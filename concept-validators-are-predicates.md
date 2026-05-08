A Cardano validator is a pure function that returns true or false — "may this UTxO be spent under these conditions?" It doesn't execute state changes. State changes happen in the off-chain code that builds the transaction; the validator's only job is to approve or reject.

## The split that throws Solidity devs

In Solidity, a contract function does two jobs at once:

```solidity
function withdraw() external {
  require(balances[msg.sender] >= amount);  // check
  balances[msg.sender] -= amount;             // mutate
  payable(msg.sender).transfer(amount);       // mutate
}
```

The `require` is a check; the rest mutates state. They live in the same function, run by the EVM in sequence.

On Cardano those jobs are split between two layers:

- **Off-chain code** (Mesh, Evolution, raw JS) constructs a transaction representing the desired state change. This is where the "do" happens.
- **The validator** looks at the proposed transaction and returns `True` or `False`. This is where the "check" happens.

If the validator returns `True`, the ledger applies the transaction. If `False`, the transaction fails and nothing changes.

## What this looks like in code

```aiken
validator vesting {
  spend(datum, redeemer, _, tx) {
    or {
      key_signed(tx.extra_signatories, datum.owner),
      and {
        key_signed(tx.extra_signatories, datum.beneficiary),
        valid_after(tx.validity_range, datum.lock_until),
      },
    }
  }
}
```

Read this as: "this spend is allowed if (owner signed) OR (beneficiary signed AND deadline has passed)." There's no `transfer()` call, no balance update, no event emission. Just a boolean.

The corresponding off-chain code:

```typescript
const tx = new Transaction({ initiator: wallet })
  .redeemValue({ value: utxo, script, redeemer })
  .setTimeToStart(deadline + 1)
  .setTimeToExpire(deadline + 15 * 60_000)
  .setCollateral(await wallet.getCollateral());

await wallet.submitTx(await wallet.signTx(await tx.build()));
```

This is where the state change is *constructed*. The transaction says "consume this UTxO, produce nothing new (or produce a new UTxO with new state)." The validator just decides whether to permit it.

## Why this design is actually nice

**Determinism.** Given the same transaction, a validator always returns the same answer regardless of when or where it runs. This is why fees are predictable on Cardano — you can simulate the validator off-chain, see exactly what execution units it costs, and pay exactly that. No surprise out-of-gas mid-execution.

**Testability.** Pure functions are easy to test. Aiken's `aiken check` runs your validator against synthetic transactions with no chain, no node, no fork. You can fuzz inputs and prove invariants.

**Composability.** Validators don't call each other. Multiple validators running on the same transaction each independently inspect it and return their own boolean. There's no reentrancy because there's no calling.

## Common misconceptions

- **"My validator needs to update the datum"** — no. Your off-chain code constructs a new UTxO with a new datum and includes it in the transaction outputs. The validator checks that the new UTxO satisfies the rules.

- **"I can call other validators from a validator"** — not really. Validators don't compose by calling. They compose by inspecting the same transaction. If validator A and validator B both run on a tx, each looks at the whole tx independently. If both return `True`, the tx succeeds.

- **"Failed validators waste gas"** — they cost collateral, not gas. Cardano's fee model: you pay the fee upfront based on transaction size and execution units. If the validator returns `False`, the fee was already paid AND the collateral UTxO gets seized as a deterrent against spam. Different mental model from EVM gas refunds.

- **"Validators have memory between calls"** — they don't. Each invocation is fresh. The only "memory" is what's on-chain (datums in UTxOs). If your validator needs to remember something, it has to be in the datum of the UTxO being spent.

## When this design hurts

The split makes some patterns harder. A validator can't initiate anything — it can only react to a transaction someone else built. So:

- **No automatic actions.** A vesting contract can't "release funds when the deadline passes" by itself. The beneficiary must construct and submit a claim transaction. The validator just permits it.
- **Off-chain coordination required.** Multi-step state machines need the off-chain layer to know which state transitions are valid and build the right transactions. The validator is the gatekeeper, not the planner.
- **Ordering matters off-chain.** If two users try to spend the same UTxO in the same block, only one wins. Designing around this is a key Cardano DApp skill.

## When you've internalised this

You'll know you've internalised the model when you stop asking "how does my validator update the balance?" and start asking "what transaction structure represents this state change, and what conditions must my validator check on it?" The validator never does. It only judges.

## Further reading

The Plutus and Aiken books both formalise this in their semantics chapters. For the practical patterns, the Aiken design-patterns repo demonstrates how pure-predicate validators express state machines, oracles, and multi-party contracts.
