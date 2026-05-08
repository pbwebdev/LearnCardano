---
slug: reference-scripts-aiken-mesh
title: Deploy and use reference scripts to save transaction fees
stack: [aiken, mesh, blockfrost]
category: [smart-contracts, off-chain]
difficulty: advanced
audience: [intermediate-cardano]
est_time_minutes: 40
last_verified: 2025-11-01
cardano_era: conway
ai_ready: true
video_url: ""
github_url: https://github.com/pbwebdev/LearnCardano/recipe-reference-scripts-aiken-mesh
sandbox_url: ""
demo_url: ""
prerequisites:
  - Completed recipe: vesting-validator-aiken-mesh
  - Understanding of min-ADA and UTxO sizing
  - Blockfrost API key and funded preview testnet wallet
learning_outcomes:
  - Understand what reference scripts are and why they save fees
  - Deploy a compiled Aiken script as a reference UTxO
  - Spend from a validator using a reference script instead of inlining the script
  - Calculate the fee saving for high-throughput contracts
  - Safely manage the reference script UTxO in production
related_pitfalls:
  - reference-script-utxo-must-not-be-spent
  - wrong-script-reference-causes-phase-2-failure
related_concepts:
  - babbage-era-features
  - script-size-and-fees
  - inline-datum-vs-datum-hash
related_recipes:
  - vesting-validator-aiken-mesh
  - aiken-unit-tests
---

Reference scripts (CIP-0033, introduced in Babbage era) let you deploy a compiled Aiken validator once to a UTxO, then reference that UTxO in future transactions instead of re-including the full script bytes every time. For large scripts, this cuts transaction fees by 60–80% and is now standard practice for any production Cardano contract.

## Background: why scripts used to be expensive

Before Babbage era (pre-CIP-0033), every transaction that executed a script had to include the full compiled script bytes in the transaction body. A typical Aiken validator is 2–10KB. At Cardano's fee model (minFeeB × txSizeBytes), including a 5KB script added roughly 0.05–0.15 ADA per transaction.

For a protocol with 10,000 daily interactions, that's 500–1,500 ADA wasted per day just on script inclusion.

**Reference scripts solve this.** Deploy the script once to a UTxO. Every subsequent transaction references that UTxO — the ledger reads the script from the reference, validates it, and you never pay to include those bytes again. The reference itself costs only 36 bytes (32 txHash + 4 index).

## Code

### 1. Compile your validator

Same as the vesting recipe — `aiken build` produces `plutus.json`:

```bash
aiken build
```

### 2. Deploy the reference script

Send a transaction that places the script in a UTxO's `referenceScript` field. Park it at an address you control but will never sweep:

```typescript
import {
  BlockfrostProvider,
  MeshWallet,
  Transaction,
  serializePlutusScript,
  resolveScriptHash,
} from "@meshsdk/core";
import blueprint from "./plutus.json";

const provider = new BlockfrostProvider(process.env.BLOCKFROST_KEY!);
const wallet = new MeshWallet({
  networkId: 0,
  fetcher: provider,
  submitter: provider,
  key: { type: "mnemonic", words: process.env.WALLET_MNEMONIC!.split(" ") },
});

// Extract the compiled validator from the Aiken blueprint
const validator = blueprint.validators.find(
  (v: any) => v.title === "vesting.vesting.spend"
);
const compiledCode = validator.compiledCode;

// Deploy: send a UTxO that carries the script as a referenceScript
const tx = new Transaction({ initiator: wallet });

tx.sendLovelace(
  {
    address: await wallet.getChangeAddress(),
    // The script lives here — this UTxO must NEVER be spent
    script: { version: "V3", code: compiledCode },
  },
  "2000000" // 2 ADA min — ledger requires more lovelace for UTxOs with scripts
);

const unsignedTx = await tx.build();
const signedTx = await wallet.signTx(unsignedTx);
const deployTxHash = await wallet.submitTx(signedTx);

console.log("Reference script deployed!");
console.log("Tx hash:", deployTxHash);
console.log("UTxO index: 0");
console.log("SAVE THESE — you need them for every future interaction");

// Save to a registry file so you don't lose track
const fs = require("fs");
const registry = { vesting: { txHash: deployTxHash, txIndex: 0 } };
fs.writeFileSync("./script-registry.json", JSON.stringify(registry, null, 2));
```

### 3. Use the reference script in a spend transaction

Instead of passing `{ version: "V3", code: compiledCode }` in `redeemValue`, point at the reference UTxO:

```typescript
import scriptRegistry from "./script-registry.json";

async function unlockWithReferenceScript(
  lockTxHash: string,
  lockTxIndex: number
) {
  // Fetch the UTxO locked at the script address
  const scriptAddress = serializePlutusScript(
    { code: compiledCode, version: "V3" },
    undefined,
    0
  );
  const utxos = await provider.fetchAddressUTxOs(scriptAddress);
  const utxo = utxos.find(
    (u) => u.input.txHash === lockTxHash && u.input.outputIndex === lockTxIndex
  );
  if (!utxo) throw new Error("UTxO not found at script address");

  const now = Date.now();

  const tx = new Transaction({ initiator: wallet });

  tx.redeemValue({
    value: utxo,
    // Reference the deployed script UTxO — no script bytes included in this tx
    script: {
      txHash: scriptRegistry.vesting.txHash,
      txIndex: scriptRegistry.vesting.txIndex,
    },
    redeemer: { data: { alternative: 0, fields: [] } },
  });

  // Validity interval is required for the time-lock check in the validator
  tx.setTimeToStart((now - 60_000).toString());       // 1 min buffer
  tx.setTimeToExpire((now + 15 * 60_000).toString()); // 15 min window

  // Collateral required for all script transactions
  tx.setCollateral(await wallet.getCollateral());

  const unsignedTx = await tx.build();
  const signedTx = await wallet.signTx(unsignedTx, true);
  return await wallet.submitTx(signedTx);
}
```

### 4. Build a registry helper (production pattern)

Don't hardcode the reference UTxO — build a small registry helper that checks if a script is deployed and deploys it if not:

```typescript
// script-registry.ts
import fs from "fs";
import path from "path";

const REGISTRY_PATH = "./script-registry.json";

type ScriptEntry = { txHash: string; txIndex: number };
type Registry = Record<string, ScriptEntry>;

function loadRegistry(): Registry {
  if (!fs.existsSync(REGISTRY_PATH)) return {};
  return JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf-8"));
}

function saveRegistry(registry: Registry) {
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
}

async function isDeployed(
  provider: BlockfrostProvider,
  entry: ScriptEntry
): Promise<boolean> {
  try {
    const utxos = await provider.fetchAddressUTxOs(
      await wallet.getChangeAddress()
    );
    return utxos.some(
      (u) =>
        u.input.txHash === entry.txHash &&
        u.input.outputIndex === entry.txIndex
    );
  } catch {
    return false;
  }
}

export async function ensureDeployed(
  name: string,
  compiledCode: string
): Promise<ScriptEntry> {
  const registry = loadRegistry();

  // Already deployed and UTxO still exists — return it
  if (registry[name] && (await isDeployed(provider, registry[name]))) {
    console.log(`[${name}] Reference script already deployed at`, registry[name]);
    return registry[name];
  }

  // Deploy fresh
  console.log(`[${name}] Deploying reference script...`);
  const tx = new Transaction({ initiator: wallet });
  tx.sendLovelace(
    { address: await wallet.getChangeAddress(),
      script: { version: "V3", code: compiledCode } },
    "2000000"
  );
  const txHash = await wallet.submitTx(await wallet.signTx(await tx.build()));
  const entry: ScriptEntry = { txHash, txIndex: 0 };

  registry[name] = entry;
  saveRegistry(registry);
  console.log(`[${name}] Deployed:`, entry);
  return entry;
}
```

### 5. Calculate your actual fee saving

```typescript
const scriptBytes = compiledCode.length / 2; // hex → bytes
const refOverheadBytes = 32 + 4;             // txHash + outputIndex
const savingPerTx = scriptBytes - refOverheadBytes;

// Cardano fee formula: minFeeA (44 lovelace/byte) approx
const lovelaceSavingPerTx = savingPerTx * 44;
const adaSavingPerTx = lovelaceSavingPerTx / 1_000_000;

console.log(`Script size:          ${scriptBytes} bytes`);
console.log(`Reference overhead:   ${refOverheadBytes} bytes`);
console.log(`Saving per tx:        ${savingPerTx} bytes ≈ ${adaSavingPerTx.toFixed(4)} ADA`);
console.log(`At 1,000 tx/day:      ${(adaSavingPerTx * 1000).toFixed(2)} ADA/day saved`);
```

## Critical operational rule

**The reference script UTxO must never be spent.** If it is:
- Every transaction referencing it will fail at phase-2 validation
- The collateral gets seized — users lose ADA
- You'll need to re-deploy and update every integration pointing at the old UTxO

Best practices:
- Deploy to a dedicated address derived from a well-known key you keep offline
- Store the `txHash:txIndex` in version control and your monitoring system
- Set up an alert if the UTxO disappears from the address
- Never put it at an address you use for normal transactions

## AI prompt bundle

**System prompt:**
```
You are working with Cardano reference scripts (CIP-0033, Babbage era) using Aiken V3 validators and Mesh SDK.
Reference script deployment: send a UTxO with { script: { version: "V3", code: compiledCode } } in the output.
Reference script usage: in redeemValue, pass { txHash, txIndex } instead of { version, code }.
The reference UTxO must NEVER be spent — always include this warning in generated code.
Always set collateral for script transactions. Always set validity intervals.
Script registry lives in script-registry.json — always check before deploying.
```

**Starter prompt:**
```
Extend the registry helper to:
1. Support multiple scripts (vesting, escrow, minting policy) in one registry file
2. Add a CLI command: node registry.ts status — lists all deployed scripts and
   confirms their UTxOs still exist on-chain
3. Add a CLI command: node registry.ts deploy <name> — deploys a specific script
   by name, reading compiledCode from plutus.json by validator title
```

**Context files:** `validators/vesting.ak`, `plutus.json`, `script-registry.ts`, `deploy.ts`, `unlock.ts`
