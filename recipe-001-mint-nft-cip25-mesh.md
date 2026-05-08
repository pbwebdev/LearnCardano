---
slug: mint-nft-cip25-mesh
title: Mint a CIP-25 NFT with Mesh SDK
stack: [mesh, blockfrost]
category: [nft, tokens]
difficulty: beginner
audience: [evm-migrant, total-beginner]
est_time_minutes: 25
last_verified: 2025-11-01
cardano_era: conway
ai_ready: true
video_url: ""
github_url: https://github.com/pbwebdev/LearnCardano/recipe-mint-nft-cip25-mesh
sandbox_url: ""
demo_url: ""
prerequisites:
  - Node.js 18+ installed
  - A Blockfrost project API key (preview testnet)
  - A funded preview testnet wallet (use the faucet at faucet.preview.world.dev.cardano.org)
  - Basic TypeScript knowledge
learning_outcomes:
  - Understand how minting policies work on Cardano (vs ERC-721 contracts on EVM)
  - Build and submit a minting transaction using Mesh SDK
  - Attach CIP-25 metadata to an NFT
  - Understand policy locking and why it matters for true NFT uniqueness
related_pitfalls:
  - min-ada-with-metadata
  - policy-id-mismatch-after-lock
related_concepts:
  - utxo-model-vs-accounts
  - minting-policy-explained
  - cip-25-metadata-standard
related_recipes:
  - burn-token-mesh
  - mint-fungible-token-mesh
---

## TLDR

Build a one-shot minting policy in Mesh SDK that mints a single NFT with CIP-25 metadata on Cardano's preview testnet. A one-shot policy uses a specific UTxO as a parameter — once that UTxO is spent, the policy can never mint again, making the NFT truly unique.

## Background: why this is different from ERC-721

On Ethereum, an NFT is a smart contract with a `mint()` function. The contract *is* the NFT standard. On Cardano, there is no contract to deploy first. Instead:

1. You define a **minting policy** — a script that says *who can mint, under what conditions, and for how long*.
2. The **policy ID** (the hash of that script) becomes the "contract address" equivalent. All tokens sharing a policy ID are grouped together.
3. Metadata is attached to the **transaction**, not stored on-chain in contract state. CIP-25 defines where in the transaction that metadata lives.

This means minting on Cardano is cheaper and simpler than ERC-721 deployment, but the mental model shift from contracts to policies trips up almost every Solidity developer.

## Code

### 1. Install dependencies

```bash
npm install @meshsdk/core @meshsdk/core-cst
```

### 2. Set up the minting script

```typescript
import {
  BlockfrostProvider,
  MeshWallet,
  Transaction,
  ForgeScript,
  resolveScriptHash,
  stringToHex,
} from "@meshsdk/core";

const provider = new BlockfrostProvider("previewXXXXXXXXXXXXXXXXXX");

const wallet = new MeshWallet({
  networkId: 0, // 0 = testnet
  fetcher: provider,
  submitter: provider,
  key: {
    type: "mnemonic",
    words: process.env.WALLET_MNEMONIC!.split(" "),
  },
});
```

### 3. Create a one-shot minting policy

A one-shot policy is parameterised by a UTxO. Once that UTxO is consumed, no more tokens can ever be minted under this policy ID — guaranteeing NFT uniqueness.

```typescript
const utxos = await wallet.getUtxos();
const utxo = utxos[0]; // Use the first available UTxO as the one-shot parameter

const forgingScript = ForgeScript.withOneTimeMintingPolicy(utxo);
const policyId = resolveScriptHash(forgingScript);

console.log("Policy ID:", policyId);
// Save this — it identifies your NFT collection
```

### 4. Define CIP-25 metadata

CIP-25 metadata lives at label `721` in the transaction. Structure: `{ 721: { <policyId>: { <assetName>: { ...metadata } } } }`.

```typescript
const assetName = "LearnCardanoNFT001";
const assetNameHex = stringToHex(assetName);

const metadata = {
  721: {
    [policyId]: {
      [assetName]: {
        name: "Learn Cardano NFT #001",
        description: "First NFT minted through the Learn Cardano recipe.",
        image: "ipfs://QmYourIPFSHashHere",
        mediaType: "image/png",
        // Optional: add any custom attributes here
        attributes: {
          series: "Learn Cardano",
          edition: 1,
        },
      },
    },
  },
};
```

### 5. Build and submit the transaction

```typescript
const tx = new Transaction({ initiator: wallet });

tx.mintAsset(forgingScript, {
  assetName: assetNameHex,
  assetQuantity: "1",
  metadata,
  label: "721",
  recipient: await wallet.getChangeAddress(),
});

const unsignedTx = await tx.build();
const signedTx = await wallet.signTx(unsignedTx);
const txHash = await wallet.submitTx(signedTx);

console.log("Minted! Tx hash:", txHash);
console.log("View on explorer: https://preview.cardanoscan.io/transaction/" + txHash);
```

## What just happened

1. You selected a UTxO to parameterise the one-shot policy → this generates a unique policy ID.
2. You built a transaction that **spends that UTxO** (consuming it) and **mints 1 token** under the policy.
3. The spending of the UTxO is what proves the policy can never mint again — the ledger enforces it.
4. CIP-25 metadata was attached to the transaction at label `721`.

## Pitfalls to watch for

- **Min ADA requirement**: Every output holding a native token must include a minimum amount of ADA (calculated by the ledger based on the token size + metadata). Mesh handles this automatically, but if you're building raw transactions, forgetting min-ADA is the #1 beginner error.
- **IPFS hashes**: Use a proper IPFS URI (`ipfs://Qm...`), not an HTTP gateway URL. Gateways can go offline; the IPFS hash is permanent.
- **Policy locking**: Once the UTxO is spent, minting is closed. Keep your policy ID and the script source. If you need an *open* collection (mint more later), use a time-locked policy or a signature-based policy instead.

## AI prompt bundle

**System prompt:**
```
You are helping build a Cardano NFT minter using Mesh SDK v1.x on Node.js.
The target network is preview testnet. Minting policy is one-shot (UTxO-parameterised).
Metadata follows CIP-25 standard at label 721.
Always use BlockfrostProvider for network access.
Key imports come from @meshsdk/core.
Do not use deprecated MeshTxBuilder unless explicitly asked.
```

**Starter prompt:**
```
Using the recipe above as a base, modify the minter to:
1. Accept an array of NFT metadata objects and mint the whole collection in one transaction
2. Calculate the correct min-ADA for each output automatically
3. Add a royalty field following CIP-27
```

**Context files:** `mint.ts`, `metadata.json`, `package.json`
