---
slug: 013-batch-mint-nfts
type: recipe
title: "Batch Mint NFTs: Efficient Creation on Cardano"
---

Batch minting NFTs on the Cardano blockchain can significantly streamline the process of creating digital assets, especially when dealing with a large number of tokens. This guide will walk you through the steps to batch mint NFTs using the Mesh SDK in a single transaction, ensuring efficiency and cost-effectiveness.

### Prerequisites

Before diving into the batch minting process, ensure you have the following:

- **Basic understanding of blockchain technology**: Familiarity with how blockchain operates will be beneficial.
- **Familiarity with Cardano and its ecosystem**: Knowing the basics of Cardano will help you understand the minting process.
- **Node.js and npm installed**: These are essential for running JavaScript applications.
- **Mesh SDK installed**: This will be our primary tool for creating and sending transactions.
- **Access to a Cardano node or testnet**: You'll need this to interact with the Cardano blockchain.

### Step 1: Set Up Your Environment

Start by ensuring that your development environment is ready. Install Node.js and npm if they aren't already installed. Then, install the Mesh SDK by running the following command:

```bash
npm install @mesh-sdk/core
```

This command installs the core components of the Mesh SDK, which will be used to interact with the Cardano blockchain.

### Step 2: Define Your Minting Policy

To mint NFTs, you'll need a minting policy. A minting policy is a script that defines the conditions under which tokens can be minted or burned. For batch minting, you can use a simple Native Script. Here's an example:

```typescript
const mintingPolicy = {
  type: "all",
  scripts: [
    {
      type: "before",
      slot: 50000000
    },
    {
      type: "sig",
      keyHash: "<your-key-hash>"
    }
  ]
};
```

This policy allows minting until a specific slot number and requires a signature from a specific key.

### Step 3: Prepare NFT Metadata

NFTs on Cardano can include metadata that describes the asset. Prepare your metadata in JSON format. For batch minting, you can create an array of metadata objects for each NFT you want to mint:

```json
[
  {
    "721": {
      "<policy_id>": {
        "nft1": {
          "name": "NFT One",
          "image": "ipfs://<image-hash>",
          "description": "The first NFT in the batch."
        }
      }
    }
  },
  {
    "721": {
      "<policy_id>": {
        "nft2": {
          "name": "NFT Two",
          "image": "ipfs://<image-hash>",
          "description": "The second NFT in the batch."
        }
      }
    }
  }
]
```

### Step 4: Create the Transaction

Use the Mesh SDK to create a transaction that mints the NFTs. You'll need to include your minting policy and metadata in the transaction:

```typescript
import { Transaction } from '@mesh-sdk/core';

const tx = new Transaction();
tx.addMintingPolicy(mintingPolicy);

metadata.forEach((meta) => {
  tx.addMetadata(meta);
});

const signedTx = await tx.sign(<your-private-key>);
```

This creates and signs a transaction ready for submission.

### Step 5: Submit the Transaction

Finally, submit the transaction to the Cardano network:

```typescript
const txHash = await tx.submit();
console.log(`Transaction submitted with hash: ${txHash}`);
```

### Conclusion

Batch minting NFTs on Cardano using the Mesh SDK is a powerful way to efficiently create multiple digital assets. By following the steps outlined above, you can leverage Cardano's robust blockchain capabilities to streamline your NFT creation process. For further details, refer to the [Mesh SDK documentation](https://meshjs.dev/guides/nft-collection) and the [Cardano Developer Portal](https://github.com/cardano-foundation/developer-portal/blob/main/docs/get-started/client-sdks/typescript/mesh/transactions-minting.md) for additional resources and examples.
