---
slug: 009-mint-nft-cip68-mesh
type: recipe
title: "Mint an NFT Using CIP-68"
---

Minting a non-fungible token (NFT) on the Cardano blockchain using the CIP-68 standard allows for enhanced features and metadata capabilities compared to previous standards. In this guide, you'll learn how to mint an NFT using Mesh SDK, a powerful tool for interacting with the Cardano blockchain.

### What You Will Need

Before starting, ensure you have the following:

- **Basic Understanding of NFTs and Blockchain**: Familiarity with blockchain concepts and NFTs is essential.
- **Node.js and npm**: These are necessary for running the Mesh SDK.
- **Mesh SDK**: Install Mesh SDK by following the [official installation guide](https://meshjs.dev/docs/installation).
- **Cardano Testnet or Mainnet Access**: Choose the appropriate network for your minting process.
- **Wallet with ADA**: Ensure your wallet has enough ADA to cover transaction fees.

### Steps to Mint an NFT Using CIP-68

#### Step 1: Set Up Your Environment

1. **Install Node.js and npm** if you haven't already. You can download them from the [official Node.js website](https://nodejs.org/).

2. **Install Mesh SDK** by running the following command in your terminal:

   ```bash
   npm install @mesh/mesh
   ```

3. **Configure the SDK** to connect to the Cardano network of your choice (testnet or mainnet).

#### Step 2: Create a Minting Policy

CIP-68 introduces more flexible minting policies, allowing for more complex conditions. Here’s how to create a basic minting policy:

1. **Generate a Policy Key**: This key is required to create a minting policy. Use the following command:

   ```bash
   cardano-cli address key-gen \
     --verification-key-file policy.vkey \
     --signing-key-file policy.skey
   ```

2. **Define the Policy Script**: Create a script that specifies the conditions under which the NFT can be minted. Here is an example of a simple policy script:

   ```json
   {
     "type": "all",
     "scripts": [
       {
         "type": "sig",
         "keyHash": "<SIGNING_KEY_HASH>"
       }
     ]
   }
   ```

   Replace `<SIGNING_KEY_HASH>` with the hash of your signing key.

3. **Compute the Policy ID**: Use the policy script to generate a policy ID:

   ```bash
   cardano-cli transaction policyid --script-file policy.script
   ```

#### Step 3: Mint the NFT

1. **Prepare Metadata**: CIP-68 allows for detailed metadata. Create a JSON file with your NFT's metadata, such as name, description, and image link.

   ```json
   {
     "721": {
       "<POLICY_ID>": {
         "<ASSET_NAME>": {
           "name": "My Unique NFT",
           "description": "This NFT represents a unique digital asset.",
           "image": "ipfs://<IPFS_HASH>"
         }
       }
     }
   }
   ```

   Replace `<POLICY_ID>`, `<ASSET_NAME>`, and `<IPFS_HASH>` with your specific details.

2. **Build the Transaction**: Use Mesh SDK to build and sign the transaction including your metadata:

   ```typescript
   import { Transaction } from '@mesh/mesh';

   const tx = new Transaction()
     .mintAsset({
       policyId: '<POLICY_ID>',
       assetName: '<ASSET_NAME>',
       quantity: 1,
     })
     .sign('<YOUR_SIGNING_KEY>');

   const txHash = await tx.submit();
   console.log(`Transaction submitted with hash: ${txHash}`);
   ```

#### Step 4: Submit the Transaction

1. **Submit the Transaction**: Execute the transaction using Mesh SDK and ensure it is successful.

2. **Verify the Minted NFT**: Once the transaction is confirmed, you can verify your NFT on a Cardano explorer by searching for the transaction hash.

### Conclusion

Minting an NFT using CIP-68 on Cardano provides a robust framework for creating unique digital assets with detailed metadata. By following this guide, you should be equipped to mint your NFT successfully. For further reading and more complex use cases, refer to the [CIP-68 documentation](https://cips.cardano.org/cips/cip68/).

If you encounter issues, check common pitfalls such as incorrect metadata format or insufficient ADA in your wallet. Happy minting!
