A datum is data attached to a UTxO at a script address — it's the "state" the validator can read. A redeemer is data supplied at spend time — it's the "argument" telling the validator what action to take. Together they're how on-chain logic decides whether spending is allowed.

## Where each one lives

A **datum** lives in a UTxO. It's pinned there when the UTxO is created and stays put until that UTxO is spent. Reading the datum is how the validator sees "current state."

A **redeemer** lives in the spending transaction. It's supplied by the off-chain code that wants to consume the UTxO. Reading the redeemer is how the validator sees "what is the spender trying to do."

Together: datum says where things stand, redeemer says what's being attempted.

## A concrete example

Take a vesting contract:

```aiken
pub type VestingDatum {
  lock_until: Int,
  owner: VerificationKeyHash,
  beneficiary: VerificationKeyHash,
}

pub type VestingRedeemer {
  Claim
  Cancel
}
```

When the owner deposits ADA, they create a UTxO at the vesting script address with a `VestingDatum` containing the deadline, their key hash, and the beneficiary's key hash.

When someone tries to spend that UTxO, they include a `VestingRedeemer` — either `Claim` (beneficiary claiming) or `Cancel` (owner reclaiming). The validator inspects both:

```aiken
validator vesting {
  spend(datum_opt, redeemer, _, tx) {
    expect Some(datum) = datum_opt
    when redeemer is {
      Claim ->
        key_signed(tx.extra_signatories, datum.beneficiary)
        && valid_after(tx.validity_range, datum.lock_until)
      Cancel ->
        key_signed(tx.extra_signatories, datum.owner)
    }
  }
}
```

The datum tells the validator who the parties are and when the lock expires. The redeemer tells it which path is being attempted.

## Inline datums vs datum hashes

Two ways to attach a datum to a UTxO:

**Datum hash** (older, pre-Babbage): The UTxO stores only a 32-byte hash of the datum. When spending, the spender must supply the full datum off-chain so the validator can verify it matches the hash. Slightly cheaper for the UTxO itself but adds complexity to the spend.

**Inline datum** (Babbage era and later): The full datum is stored directly in the UTxO. The validator reads it directly. Slightly more expensive UTxO size but much simpler — and the standard choice for new code.

Always use inline datums unless you have a specific reason not to. In Mesh:

```typescript
tx.sendLovelace(
  { address: scriptAddress, datum: { value: datum, inline: true } },
  lovelace
);
```

## How redeemers differ from function arguments

In Solidity:

```solidity
function claim(uint256 amount) external {
  // 'amount' is a function argument
}
```

The function name plus arguments tell the contract what to do.

On Cardano there are no function names. There's just `spend()`, and the **redeemer is the argument** that distinguishes between actions:

```aiken
when redeemer is {
  Claim -> // ...
  Cancel -> // ...
  ExtendDeadline { new_deadline } -> // ...
}
```

Each redeemer constructor is roughly equivalent to a function name in Solidity, and any data carried by the constructor is roughly equivalent to function arguments.

## Common misconceptions

- **"Datum is required"** — it's not, but most useful patterns need one. UTxOs at script addresses without datums exist but are limited in what validators can decide.
- **"The validator can change the datum"** — no. Datums are immutable for the lifetime of a UTxO. To "change" state, off-chain code spends the UTxO (which destroys it and its datum) and produces a new UTxO with a new datum. The validator's job is to check that the new UTxO's datum is a valid transition.
- **"Redeemer = signer"** — no. The redeemer is just data; signing is separate (handled by the wallet/transaction builder via `extra_signatories` in the transaction).
- **"Redeemers are secret"** — no. Both datums and redeemers are publicly visible on-chain.

## Practical tip: keep datums small

Datums affect the min-ADA requirement of the UTxO. A datum with 10 fields and long string IDs can push min-ADA from ~1.5 ADA to 4+ ADA per UTxO. Production contracts typically:

- Use compact integer types where possible (POSIX timestamps in milliseconds rather than ISO strings)
- Reference off-chain data by hash rather than embedding it
- Split state across multiple UTxOs rather than packing everything into one large datum

## Further reading

The Aiken book has the canonical walkthrough of datum/redeemer typing and how they're parsed from `Data` values. The Aiken design patterns repo has examples of multi-UTxO state machines where datums encode states and redeemers encode transitions.
