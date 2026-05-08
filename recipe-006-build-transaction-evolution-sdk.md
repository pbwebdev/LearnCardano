---
slug: build-transaction-evolution-sdk
title: Build and submit a transaction with Evolution SDK
stack: [evolution]
category: [off-chain]
difficulty: beginner
audience: [evm-migrant, intermediate-cardano]
est_time_minutes: 20
last_verified: 2025-11-01
cardano_era: conway
ai_ready: true
video_url: ""
github_url: https://github.com/pbwebdev/LearnCardano/recipe-tx-evolution-sdk
sandbox_url: ""
demo_url: ""
prerequisites:
  - Node.js 18+ installed
  - Evolution SDK installed (@cardano-sdk/core and peers)
  - Blockfrost or Ogmios endpoint available
learning_outcomes:
  - Understand the difference between Mesh and Evolution SDK (and when to use each)
  - Build a simple ADA transfer transaction with Evolution SDK
  - Sign and submit the transaction
  - Handle the async chain of Cardano transaction lifecycle
related_pitfalls:
  - evolution-sdk-peer-version-mismatch
  - fee-estimation-off-by-one
related_concepts:
  - utxo-selection-algorithms
  - transaction-lifecycle
related_recipes:
  - mint-nft-cip25-mesh
  - vesting-validator-aiken-mesh
---

Build a simple ADA transfer with Evolution SDK (formerly cardano-js-sdk). Understand where Evolution fits vs Mesh — Evolution is lower-level, more flexible, and better suited for wallets and complex applications. Mesh is faster for DApp builders who want to ship fast.

## Background: Mesh vs Evolution — which one do you use?

Both are JavaScript/TypeScript SDKs for building Cardano transactions. The difference is depth vs speed:

| | **Mesh SDK** | **Evolution SDK** |
|---|---|---|
| Best for | DApp frontends, tutorials, quick prototypes | Wallets, exchanges, complex tx logic |
| API style | High-level, opinionated helpers | Low-level, composable primitives |
| Learning curve | Low | Higher |
| UTxO selection | Automatic | Manual or pluggable algorithms |
| Maintained by | MeshJS community | Cardano Foundation + IOG |
| Use when | You want to ship fast | You need full control |

For most Learn Cardano recipes, Mesh gets you to the result fastest. Learn Evolution when Mesh can't express what you need, or when you're building something that needs wallet-grade reliability.

## Code

### 1. Install Evolution SDK packages

Evolution is a monorepo — install only the packages you need:

```bash
npm install \
  @cardano-sdk/core \
  @cardano-sdk/crypto \
  @cardano-sdk/tx-construction \
  @cardano-sdk/wallet \
  @cardano-sdk/blockfrost
```

### 2. Set up the Blockfrost provider

```typescript
import { Blockfrost } from "@cardano-sdk/blockfrost";
import { Cardano } from "@cardano-sdk/core";

const blockfrost = new Blockfrost({
  baseUrl: "https://cardano-preview.blockfrost.io/api/v0",
  projectId: process.env.BLOCKFROST_KEY!,
});
```

### 3. Build a simple ADA transfer

```typescript
import { buildTx } from "@cardano-sdk/tx-construction";

async function sendAda(
  fromAddress: Cardano.PaymentAddress,
  toAddress: Cardano.PaymentAddress,
  lovelace: bigint
) {
  // Fetch UTxOs at the sender address
  const utxos = await blockfrost.utxosByAddresses([fromAddress]);

  // Build the transaction — Evolution handles fee estimation and change
  const { body, hash } = await buildTx({
    utxos,
    outputs: new Set([
      {
        address: toAddress,
        value: { coins: lovelace },
      },
    ]),
    changeAddress: fromAddress,
  });

  return { body, hash };
}
```

### 4. Sign and submit

```typescript
import { InMemoryKeyAgent } from "@cardano-sdk/key-management";
import { Ed25519 } from "@cardano-sdk/crypto";

// In production, use a hardware wallet or secure key store — never raw mnemonics
const keyAgent = await InMemoryKeyAgent.fromBip39MnemonicWords(
  {
    mnemonicWords: process.env.WALLET_MNEMONIC!.split(" "),
    getPassphrase: async () => Buffer.from(""),
  },
  { bip32Ed25519: await Ed25519.getBip32Ed25519() }
);

const { body, hash } = await sendAda(fromAddress, toAddress, 5_000_000n);

const signedTx = await keyAgent.signTransaction(
  { body, hash },
  { knownAddresses: [], txInKeyPathMap: {} }
);

const txId = await blockfrost.submitTx(signedTx);
console.log("Submitted:", txId);
console.log("View: https://preview.cardanoscan.io/transaction/" + txId);
```

### 5. Full managed wallet (alternative)

For a fully managed wallet that handles sync, balance tracking, and tx history automatically:

```typescript
import { PersonalWallet } from "@cardano-sdk/wallet";

const wallet = new PersonalWallet(
  { name: "Learn Cardano Wallet" },
  {
    keyAgent,
    chainHistoryProvider: blockfrost,
    networkInfoProvider: blockfrost,
    utxoProvider: blockfrost,
    txSubmitProvider: blockfrost,
    assetProvider: blockfrost,
  }
);

// Clean builder API — wallet handles UTxO selection, fees, change
const { tx } = await wallet
  .createTxBuilder()
  .addOutput({ address: toAddress, value: { coins: 5_000_000n } })
  .build()
  .sign();

await wallet.submitTx(tx);
```

### 6. Attach transaction metadata (CIP-20 message)

```typescript
import { TxMetadata } from "@cardano-sdk/core";

// CIP-20: transaction message at label 674
const metadata: TxMetadata = new Map([
  [674n, { msg: ["Sent from Learn Cardano recipe"] }],
]);

const { tx } = await wallet
  .createTxBuilder()
  .addOutput({ address: toAddress, value: { coins: 5_000_000n } })
  .metadata(metadata)
  .build()
  .sign();
```

## Key differences from Mesh to watch for

- **BigInt everywhere** — Evolution uses `bigint` for all lovelace and token quantities. Never use `number` for ADA values; JavaScript `number` loses precision above 2^53.
- **Monorepo packages** — a version mismatch between `@cardano-sdk/*` packages causes cryptic errors. Always install exact matching versions across the whole SDK.
- **Provider interfaces** — Blockfrost, Ogmios, and Kupo all implement the same provider interfaces. Swapping providers is a one-line config change, which makes Evolution good for production systems that need redundancy.

## AI prompt bundle

**System prompt:**
```
You are building Cardano transactions with Evolution SDK (cardano-js-sdk).
Key packages: @cardano-sdk/core, @cardano-sdk/tx-construction, @cardano-sdk/blockfrost, @cardano-sdk/wallet.
Use Cardano namespace types from @cardano-sdk/core for addresses and values.
Use BigInt for ALL lovelace and token quantities — never number.
All @cardano-sdk/* packages must be on the same exact version — warn if they aren't.
Network is preview testnet unless stated. Blockfrost is the provider.
```

**Starter prompt:**
```
Extend this to build a transaction that:
1. Sends ADA to multiple recipients in a single transaction
2. Attaches a metadata label 674 with a message (CIP-20 transaction message)
3. Estimates the fee before submitting and logs it in ADA (not lovelace)
4. Handles the case where the wallet doesn't have enough UTxOs to cover the outputs
```

**Context files:** `send.ts`, `wallet.ts`, `package.json`
