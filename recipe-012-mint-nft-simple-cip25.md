---
slug: 012-mint-nft-simple-cip25
type: recipe
title: "Mint a Simple NFT using CIP-25"
---

In this tutorial, we will guide you through the process of minting a simple NFT on the Cardano blockchain using the CIP-25 standard. This involves creating a native script for minting policy, crafting the transaction, and interacting with the blockchain.

### Prerequisites

Before you start, ensure you have the following:

- **Basic understanding of blockchain and NFTs**: Familiarity with the concepts of blockchain technology and non-fungible tokens.
- **Cardano node setup**: You need a running Cardano node or access to a Cardano node.
- **Wallet with ADA**: Make sure your wallet is funded with ADA. Use the [testnet faucet](https://testnets.cardano.org/en/testnets/cardano/tools/faucet/) to get tADA for testing.
- **Familiarity with command line**: Basic command-line skills are required.
- **Access to Cardano testnet faucet**: To obtain test ADA for transaction fees.

### Learning Outcomes

By the end of this tutorial, you will:

- Understand the CIP-25 standard for NFTs on Cardano.
- Create a native script minting policy.
- Craft a transaction to mint an NFT.
- Interact with the Cardano blockchain to mint an NFT.

### Step-by-Step Instructions

#### 1. Create a Wallet and Obtain ADA

If you haven't already, create a wallet and fund it with ADA from the testnet faucet. You can use the Cardano Wallet API to create a wallet:

```bash
curl -X POST http://localhost:8090/v2/wallets \
-d '{"name": "MyWallet", "mnemonic_sentence": ["word1", "word2", ..., "word15"], "passphrase": "SecurePassphrase"}' \
-H "Content-Type: application/json"
```

#### 2. Set Up a Policy Key

A policy key is needed for minting NFTs. Check if your wallet has a policy key:

```bash
curl -X GET http://localhost:8090/v2/wallets/{walletId}/policy-key
```

If it doesn't, set one:

```bash
curl -X POST http://localhost:8090/v2/wallets/{walletId}/policy-key \
-d '{"passphrase":"SecurePassphrase"}' \
-H "Content-Type: application/json"
```

#### 3. Create a Native Script

Create a native script that defines your minting policy. A basic script allowing minting with a single signature might look like:

```json
{
  "type": "sig",
  "keyHash": "policy_vk12d0gdel9u6px8wf3uv4z6m4h447n9qsad24gztaku8dzzdqfajzqfm3rr0"
}
```

This script uses a single signature from the policy key.

#### 4. Prepare CIP-25 Metadata

CIP-25 metadata is required to describe your NFT. An example metadata JSON:

```json
{
  "721": {
    "<POLICY_ID>": {
      "<ASSET_NAME>": {
        "name": "My Amazing NFT",
        "image": "ipfs://<IPFS_ID>",
        "description": "A description of my NFT."
      }
    }
  }
}
```

Replace `<POLICY_ID>`, `<ASSET_NAME>`, and `<IPFS_ID>` with your actual values.

#### 5. Craft the Minting Transaction

Use the Cardano CLI to craft a transaction to mint your NFT:

```bash
cardano-cli transaction build-raw \
--tx-in <TX_IN> \
--tx-out <TX_OUT> \
--mint "1 <ASSET_NAME>.<POLICY_ID>" \
--metadata-json-file metadata.json \
--fee <FEE> \
--out-file mint.raw
```

Replace `<TX_IN>`, `<TX_OUT>`, `<ASSET_NAME>`, `<POLICY_ID>`, and `<FEE>` with your actual values.

#### 6. Sign and Submit the Transaction

Sign the transaction with your wallet's signing key:

```bash
cardano-cli transaction sign \
--tx-body-file mint.raw \
--signing-key-file <SIGNING_KEY> \
--out-file mint.signed
```

Submit the signed transaction to the blockchain:

```bash
cardano-cli transaction submit \
--tx-file mint.signed \
--mainnet
```

### Conclusion

Congratulations! You've successfully minted a simple NFT on the Cardano blockchain using the CIP-25 standard. This process involved setting up a wallet, creating a policy key, defining a native script, preparing metadata, crafting a transaction, and finally submitting it to the blockchain.

For further reading and advanced use cases, consider exploring the [CIP-25 documentation](https://cips.cardano.org/cips/cip25/) and the [Cardano Developer Portal](https://github.com/cardano-foundation/developer-portal).
