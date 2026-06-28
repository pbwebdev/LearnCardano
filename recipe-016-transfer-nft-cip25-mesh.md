---
slug: 016-transfer-nft-cip25-mesh
type: recipe
title: "Transfer an NFT using CIP25"
---

Transferring an NFT on the Cardano blockchain, particularly one that complies with the CIP25 standard, involves several steps. This guide will walk you through constructing and submitting a transaction to transfer ownership of a CIP25 NFT using the Mesh SDK.

## Prerequisites

Before you begin, ensure you have the following:

- **Basic understanding of Cardano blockchain**: Familiarity with Cardano's architecture and NFT standards is beneficial.
- **Cardano wallet with funds**: You need a funded wallet to pay for transaction fees.
- **NFT minted using CIP25**: This guide assumes you already have an NFT that follows the CIP25 standard.
- **Mesh SDK installed**: Ensure you have the Mesh SDK set up on your development environment.
- **Access to a Cardano node or API**: You'll need this to submit transactions to the network. You can use services like Blockfrost or run your own node.

## Learning Outcomes

By the end of this tutorial, you will be able to:

- **Understand the process of transferring a CIP25 NFT on Cardano**
- **Construct a transaction to transfer an NFT**
- **Submit the transaction to the Cardano network**

## Step-by-Step Guide

### 1. Set Up Your Environment

Ensure your development environment is ready with the Mesh SDK. If you haven't installed it yet, you can follow the installation guide available on their [official GitHub repository](https://github.com/MeshSDK/mesh).

### 2. Retrieve the NFT Details

First, identify the NFT you wish to transfer. You'll need its policy ID and asset name. If you minted the NFT using CIP25, this information should be available in your records or on-chain metadata.

### 3. Construct the Transaction

Using the Mesh SDK, construct a transaction to transfer the NFT. This involves specifying the sender and receiver addresses, along with the NFT details.

```typescript
import { Transaction } from 'mesh-sdk';

const senderAddress = 'addr1...'; // Replace with your address
const receiverAddress = 'addr1...'; // Replace with recipient's address
const policyId = '6d5052088183db1ef06439a9f501b52721c2645532a50254a69d5390';
const assetName = 'AmazingNFT';

const tx = new Transaction();
tx.addInput(senderAddress, policyId, assetName);
tx.addOutput(receiverAddress, policyId, assetName);
```

### 4. Sign the Transaction

Once the transaction is constructed, you need to sign it with your private key. This step ensures that you are the legitimate owner of the NFT being transferred.

```typescript
const signedTx = tx.signWithPrivateKey('your-private-key');
```

### 5. Submit the Transaction

With the transaction signed, you can now submit it to the Cardano network. Use an API endpoint or a direct node connection to broadcast the transaction.

```typescript
const txHash = await tx.submit();
console.log(`Transaction submitted with hash: ${txHash}`);
```

### 6. Verify the Transfer

After submitting the transaction, verify that the NFT has been transferred by checking the recipient's wallet. You can use a blockchain explorer or query the network directly.

## Conclusion

You've successfully transferred an NFT on the Cardano blockchain using the CIP25 standard. This process involves constructing a transaction, signing it, and submitting it to the network. By mastering these steps, you can manage NFT ownership transfers efficiently within the Cardano ecosystem.

For more detailed information on transaction construction and CIP25, refer to the [Cardano documentation](https://github.com/cardano-foundation/cardano-wallet/blob/main/docs/site/src/user/common-use-cases/assets.md).
