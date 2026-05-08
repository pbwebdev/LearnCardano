---
slug: vesting-validator-aiken-mesh
title: Build a vesting contract with Aiken and Mesh
stack: [aiken, mesh, blockfrost]
category: [smart-contracts, defi]
difficulty: intermediate
audience: [evm-migrant, intermediate-cardano]
est_time_minutes: 45
last_verified: 2025-11-01
cardano_era: conway
ai_ready: true
video_url: ""
github_url: https://github.com/pbwebdev/LearnCardano/recipe-vesting-aiken-mesh
sandbox_url: ""
demo_url: ""
prerequisites:
  - Aiken CLI installed (aiken --version >= 1.1.0)
  - Node.js 18+ with Mesh SDK installed
  - Basic understanding of UTxO model (see concept: utxo-model-vs-accounts)
  - Funded preview testnet wallet
learning_outcomes:
  - Write and compile an Aiken validator with a typed datum
  - Understand how time-locking works in Cardano (validity intervals, not block numbers)
  - Lock funds at a script address and unlock them after a deadline
  - Use vodka utility library for clean validator code
related_pitfalls:
  - validity-interval-not-set
  - datum-hash-vs-inline-datum
  - collateral-not-set
related_concepts:
  - validators-are-predicates
  - datums-and-redeemers
  - posix-time-vs-slot-number
related_recipes:
  - escrow-validator-aiken-mesh
  - multi-sig-validator-aiken
---

Write a time-lock vesting validator in Aiken that lets an owner lock ADA for a beneficiary. The beneficiary can only claim after a deadline; the owner can reclaim at any time. Compile the validator, lock funds using Mesh, then unlock them after the deadline passes.

## Background: time in Cardano validators

Solidity devs reach for `block.timestamp` without thinking about it. Cardano is different. Validators run in a **deterministic sandbox** — they cannot read the "current" time at execution. Instead:

- The **transaction builder** attaches a validity interval (`validFrom` / `validTo`) to the transaction.
- The **ledger** rejects the transaction if the current slot is outside that interval.
- The **validator** can inspect the interval and reason about time from it.

This preserves determinism: given the same inputs and the same transaction, the validator always produces the same result, regardless of when it runs. The tradeoff is that you must think about validity intervals when building the transaction, not just when writing the validator.

## On-chain code (Aiken)

### 1. Create the project

```bash
aiken new learncardano/vesting
cd vesting
```

Add the vodka utility library to `aiken.toml`:

```toml
[[dependencies]]
name = "sidan-lab/vodka"
version = "0.1.1-beta"
source = "github"
```

### 2. Write the validator

```aiken
// validators/vesting.ak
use aiken/crypto.{VerificationKeyHash}
use cardano/transaction.{OutputReference, Transaction}
use vodka_extra_signatories.{key_signed}
use vodka_validity_range.{valid_after}

pub type VestingDatum {
  lock_until: Int,        // POSIX time in milliseconds
  owner: VerificationKeyHash,
  beneficiary: VerificationKeyHash,
}

validator vesting {
  spend(
    datum_opt: Option<VestingDatum>,
    _redeemer: Data,
    _input: OutputReference,
    tx: Transaction,
  ) {
    expect Some(datum) = datum_opt

    // Owner can reclaim at any time
    // Beneficiary can claim only after the deadline
    or {
      key_signed(tx.extra_signatories, datum.owner),
      and {
        key_signed(tx.extra_signatories, datum.beneficiary),
        valid_after(tx.validity_range, datum.lock_until),
      },
    }
  }

  else(_) {
    fail
  }
}
```

### 3. Build and generate the blueprint

```bash
aiken build
```

This produces `plutus.json` — the compiled validator blueprint that Mesh reads to construct transactions.

## Off-chain code (Mesh)

### 4. Read the compiled validator

```typescript
import { MeshWallet, BlockfrostProvider, Transaction,
         serializePlutusScript, resolveScriptHash,
         conStr0, pubKeyHash } from "@meshsdk/core";
import blueprint from "./plutus.json";

const provider = new BlockfrostProvider("previewXXXXXXXXXXXXXXXXXX");
const wallet = new MeshWallet({ networkId: 0, fetcher: provider,
  submitter: provider, key: { type: "mnemonic",
    words: process.env.WALLET_MNEMONIC!.split(" ") }});

// Extract the compiled validator from the blueprint
const script = blueprint.validators.find(
  (v: any) => v.title === "vesting.vesting.spend"
);
const compiledCode = script.compiledCode;
const scriptAddress = serializePlutusScript(
  { code: compiledCode, version: "V3" }, undefined, 0
);
```

### 5. Lock funds

```typescript
async function lockFunds(lovelace: string, beneficiaryAddress: string, lockUntilMs: number) {
  const ownerPkh = await wallet.getPubKeyHash();
  const beneficiaryPkh = resolvePubKeyHash(beneficiaryAddress);

  // Build the inline datum matching VestingDatum
  const datum = conStr0([
    { int: lockUntilMs },    // lock_until
    pubKeyHash(ownerPkh),    // owner
    pubKeyHash(beneficiaryPkh), // beneficiary
  ]);

  const tx = new Transaction({ initiator: wallet })
    .sendLovelace(
      { address: scriptAddress, datum: { value: datum, inline: true } },
      lovelace
    );

  const unsignedTx = await tx.build();
  const signedTx = await wallet.signTx(unsignedTx);
  return await wallet.submitTx(signedTx);
}

// Lock 5 ADA, claimable 2 minutes from now
const deadline = Date.now() + 2 * 60 * 1000;
const txHash = await lockFunds("5000000", beneficiaryAddress, deadline);
console.log("Locked:", txHash);
```

### 6. Unlock funds (after deadline)

```typescript
async function unlockFunds(txHash: string, txIndex: number) {
  // Fetch the UTxO at the script address
  const utxos = await provider.fetchAddressUTxOs(scriptAddress);
  const utxo = utxos.find(u => u.input.txHash === txHash);
  if (!utxo) throw new Error("UTxO not found");

  const now = Date.now();
  const lowerBound = now - 60_000;   // 1 min buffer
  const upperBound = now + 15 * 60_000; // 15 min window

  const tx = new Transaction({ initiator: wallet })
    .redeemValue({
      value: utxo,
      script: { version: "V3", code: compiledCode },
      redeemer: { data: { alternative: 0, fields: [] } },
    })
    .setTimeToStart(lowerBound.toString())
    .setTimeToExpire(upperBound.toString());

  // Collateral is required for smart contract transactions
  tx.setCollateral(await wallet.getCollateral());

  const unsignedTx = await tx.build();
  const signedTx = await wallet.signTx(unsignedTx, true);
  return await wallet.submitTx(signedTx);
}
```

## Key concepts reinforced

- **Inline datum vs datum hash**: We used `inline: true` — the datum is stored directly in the UTxO output, not just its hash. Validators can read inline datums directly; datum hash requires the spender to supply the preimage.
- **Validity interval**: The `setTimeToStart` / `setTimeToExpire` calls are not optional — without them the `valid_after` check in the validator has nothing to inspect and will fail.
- **Collateral**: Any transaction that runs a validator must include collateral — a UTxO the ledger can seize if the script fails unexpectedly. Mesh handles selection automatically via `getCollateral()`.

## AI prompt bundle

**System prompt:**
```
You are helping extend a Cardano vesting contract built with Aiken v1.1+ and Mesh SDK v1.x.
The on-chain code is in Aiken (validators/vesting.ak).
The off-chain code uses Mesh with BlockfrostProvider on preview testnet.
The blueprint is at plutus.json. Validator version is V3.
Vodka utilities are available for time/signature checks.
Always use inline datums. Always set collateral for script transactions.
```

**Starter prompt:**
```
Modify the vesting contract to support partial withdrawals:
1. The beneficiary can claim a percentage of the locked amount at each interval
2. Track remaining balance in the datum
3. Explain the eUTxO pattern required — how does the output go back to the script?
```

**Context files:** `validators/vesting.ak`, `aiken.toml`, `plutus.json`, `lock.ts`, `unlock.ts`
