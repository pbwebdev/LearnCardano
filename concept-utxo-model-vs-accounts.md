Cardano tracks value as a set of unspent transaction outputs (UTxOs), not as account balances. Every transaction consumes whole UTxOs and produces new ones. This is the single biggest mental shift coming from Ethereum, and it changes how you think about contracts, concurrency, and state.

## The mental model in one paragraph

Imagine your wallet is a folder of digital banknotes. Each note has a face value (some amount of ADA) and may also carry a few stamps on it (native tokens). When you spend, you don't subtract from a balance — you pick one or more whole notes, hand them over, and receive change as a new note. That's it. There is no balance variable anywhere on the ledger; "balance" is just the sum of notes at your address at any given moment.

## How this differs from Ethereum

| | Ethereum (account model) | Cardano (eUTxO model) |
|---|---|---|
| What is a wallet's balance? | A single number stored in contract state | The sum of UTxOs at the address |
| Where does state live? | In contract storage | In the datum field of each UTxO |
| What happens during a tx? | Functions execute and mutate state | UTxOs are consumed; new ones are produced |
| What does a smart contract do? | Runs code, updates storage | Validates whether spending is allowed |
| Can two people interact with the same contract simultaneously? | Yes, sequentially | Sometimes — depends on whether they touch the same UTxO |

The "e" in eUTxO is what makes Cardano interesting. Beyond Bitcoin's simple "spend if you have the key" model, each UTxO can carry a **datum** (arbitrary data acting as state) and live at a **script address** (where a validator decides whether spending is allowed).

## Why this matters for design

**Concurrency is structural, not free.** If your DApp has a single UTxO that everyone needs to spend, only one user can do it per block. The pattern is to split state across many UTxOs — a DEX has one UTxO per pool, an NFT marketplace has one per listing.

**State updates are recreations, not mutations.** To "update" a vesting contract's remaining balance, you spend the old UTxO (with the old datum) and produce a new one (with the new datum). The validator checks that the new UTxO's datum is a valid transition from the old.

**Validators are stateless.** They only see the transaction in front of them. They don't have an "init" function or persistent memory. All context comes from the transaction's inputs, outputs, and validity range.

## Practical implications when reading code

When you see Cardano off-chain code do this:

```typescript
const utxos = await wallet.getUtxos();
const utxo = utxos[0];
tx.spendValue(utxo, ...);
```

It's deliberately picking a specific UTxO to consume. There's no `wallet.balance -= 5` equivalent — you select which notes to hand over.

When you see a validator do this:

```aiken
validator vesting {
  spend(datum, redeemer, _ref, tx) {
    // Inspects tx and datum, returns Bool
  }
}
```

It's looking at the transaction the off-chain code constructed and deciding yes or no. It doesn't *do* anything — it just *judges*.

## Common misconceptions

- **"UTxOs are the same as Bitcoin"** — partly. Cardano's extension (datum + scripts) is what makes smart contracts possible. Without the "e," you couldn't do anything beyond simple transfers.
- **"State is broken on Cardano"** — not broken, structured differently. State lives in datums attached to UTxOs, not in contract storage.
- **"You can't do DeFi without an account model"** — false. Most major Cardano DEXs (Minswap, SundaeSwap) and lending protocols work fine with eUTxO; they just use design patterns adapted to it (batchers, order book UTxOs, etc.).
- **"Concurrency is impossible"** — false. It's just designed differently. High-throughput contracts split state across many UTxOs so users don't contend.

## When you've internalised this

You'll know you've internalised the model when you stop trying to translate Solidity patterns directly and instead ask "what UTxOs does this transaction need to consume and produce?" That question doesn't make sense in the account model — it's the right question in eUTxO.

## Further reading

The official Cardano docs have a deep dive on the eUTxO model with formal definitions. For a more practical lens, the Aiken design patterns repo (sidan-lab/aiken-design-patterns) shows how this model expresses things like singletons, oracles, and stateful protocols.
