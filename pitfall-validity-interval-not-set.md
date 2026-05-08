A validator that uses `valid_after`, `valid_until`, or any time-related check rejects an otherwise-valid spend. Off-chain test harness shows the deadline has passed, but the validator returns `False`. Phase-2 validation fails and collateral is consumed.

## Why this happens

Cardano validators run in a deterministic sandbox. They cannot read "the current time" because then the same transaction could produce different results at different times — breaking the determinism the fee model depends on.

Instead, time-related checks work like this:

1. The off-chain code attaches a **validity interval** to the transaction — a `validFrom` / `validTo` slot range.
2. The **ledger** rejects the transaction if the current slot is outside that interval (this happens before the validator runs).
3. The **validator** can inspect the interval and reason about time from it. It compares the interval bounds to deadlines stored in the datum.

If the off-chain code doesn't set a validity interval, the validator's time check has nothing to compare against, and `valid_after` returns `False`. The transaction looks correct in every other way — but silently fails at phase-2 validation, costing the user their collateral.

## Symptoms

```
Phase-2 validation failure
Script evaluation failed
Validator returned False
valid_after check failed
```

The harder symptom is when there's no error at all — the transaction submits successfully, the wallet says "submitted," but minutes later collateral is gone and nothing happened. This is because the ledger accepts the tx into a block (phase-1 passes), then runs the script (phase-2 fails), then takes the collateral as the penalty for a failing script.

## The fix

Always set a validity interval on transactions that interact with time-aware validators.

### Mesh

```typescript
const now = Date.now();

tx.setTimeToStart((now - 60_000).toString());          // 1 min before now
tx.setTimeToExpire((now + 15 * 60_000).toString());    // 15 min from now
```

### Evolution

```typescript
txBuilder
  .validFrom(Date.now() - 60_000)
  .validTo(Date.now() + 15 * 60_000);
```

### Why these specific bounds

**Lower bound (`validFrom`) about 1 minute before "now":** Cardano slot time has small uncertainty (~slot drift). Setting the lower bound a minute before "now" gives the transaction a comfortable window to be included in a block without the lower bound advancing past the current slot.

**Upper bound (`validTo`) about 15 minutes after "now":** The transaction is only valid for inclusion within this window. After 15 minutes, if it hasn't made it into a block, it's invalid and must be rebuilt. Keeping this short limits how long a malicious actor could replay or front-run the transaction.

## The validator side

When you write a check like:

```aiken
valid_after(tx.validity_range, datum.lock_until)
```

This is checking the **lower bound** of the validity interval, not the current slot. So `valid_after(range, deadline)` returns `True` when the lower bound `validFrom` is greater than `deadline`.

This means: to prove "the deadline has passed," the off-chain code must set `validFrom` to a value greater than `deadline`. If `validFrom` is just "1 minute ago" and the deadline was 5 minutes ago, the check still works because `(deadline + 4 min) >= deadline`.

But if you set `validFrom` to "1 minute before now" and the deadline is set to "now," your transaction may or may not pass depending on slot drift. Always include a comfortable margin.

## Production pattern

Wrap your transaction builder so validity intervals are always set:

```typescript
function buildScriptTx(initiator: MeshWallet) {
  const now = Date.now();
  const tx = new Transaction({ initiator });
  tx.setTimeToStart((now - 60_000).toString());
  tx.setTimeToExpire((now + 15 * 60_000).toString());
  return tx;
}
```

Then in your DApp code:

```typescript
const tx = buildScriptTx(wallet);
tx.redeemValue(...);  // validity interval already set
```

Forgetting once is a hard bug to debug. Build it into your helpers.

## Related: collateral

Failing this check costs collateral, not just the fee. Every script transaction must include a collateral input (typically 5 ADA of pure ADA). If the script returns `False` at phase-2, the collateral is forfeit. Always set up collateral via `tx.setCollateral(await wallet.getCollateral())` and warn users that script transactions can lose collateral if they go wrong.

## Why this design exists

The deterministic execution model is what makes Cardano fees predictable. Off-chain you can simulate the validator with the exact transaction bytes and get the same answer the on-chain ledger will get. That guarantee falls apart if validators can read external state like "current time."

The validity interval is the workaround: the off-chain code declares "I'm asserting this transaction is valid in this time window," and the ledger enforces that window before running the script. The validator then reasons about time within that window — still pure, still deterministic.
