---
slug: 015-mint-token-cip30-mesh
type: recipe
title: "Mint a Token with CIP-30 in Mesh"
---

Minting a fungible token on Cardano using the CIP-30 standard allows for seamless integration with browser wallets and enhances user interaction by leveraging the Mesh framework. This guide will walk you through the process of setting up your environment, connecting to a CIP-30 compatible wallet, and minting a token.

## Prerequisites

- **Node.js and npm:** Ensure you have Node.js and npm installed on your machine. You can download them from [nodejs.org](https://nodejs.org/).
- **Mesh SDK:** The Mesh SDK should be installed. You can set it up by running:

  ```bash
  npm install @meshsdk/core
  ```

- **Cardano Wallet:** You will need a Cardano wallet with some test ADA to cover transaction fees. Wallets like Nami or Eternl support CIP-30.
- **Basic Knowledge:** Familiarity with JavaScript/TypeScript and an understanding of Cardano's native tokens will be beneficial.

## Step 1: Set Up Your Project

1. **Create a New Project Directory**

   Start by creating a new directory for your project and initialize it:

   ```bash
   mkdir cardano-token-minting
   cd cardano-token-minting
   npm init -y
   ```

2. **Install Dependencies**

   Install the Mesh SDK to interact with the Cardano blockchain:

   ```bash
   npm install @meshsdk/core
   npm install @meshsdk/browser-wallet
   ```

## Step 2: Connect to a CIP-30 Wallet

CIP-30 enables interaction with Cardano wallets directly from the browser. Ensure your wallet supports CIP-30.

1. **Configure Wallet Connection**

   Create a new JavaScript file `connectWallet.js`:

   ```javascript
   import { CardanoWallet } from '@meshsdk/browser-wallet';

   const wallet = new CardanoWallet();

   async function connectWallet() {
     try {
       await wallet.enable();
       console.log('Wallet connected');
     } catch (error) {
       console.error('Failed to connect wallet', error);
     }
   }

   connectWallet();
   ```

2. **Run the Connection Script**

   Ensure your wallet is open in your browser and run the script:

   ```bash
   node connectWallet.js
   ```

## Step 3: Mint Your Token

1. **Define Token Parameters**

   Decide on the token name, policy, and quantity. For this example, we will create a simple fungible token.

2. **Create Minting Script**

   In a file called `mintToken.js`, set up the minting transaction:

   ```javascript
   import { MeshTxBuilder } from '@meshsdk/core';

   async function mintToken() {
     const txBuilder = new MeshTxBuilder();
     const policyId = 'your-policy-id'; // Replace with your policy ID
     const tokenName = 'MyToken';
     const quantity = 1000;

     const mintTransaction = await txBuilder.newMintingTransaction(
       policyId,
       tokenName,
       quantity
     );

     console.log('Minting transaction created:', mintTransaction);
   }

   mintToken();
   ```

3. **Execute the Minting**

   Run your minting script:

   ```bash
   node mintToken.js
   ```

   Ensure you have enough ADA for the transaction fees and that your wallet is connected.

## Conclusion

Congratulations! You've minted your first fungible token on Cardano using the CIP-30 standard and the Mesh framework. This token can now be transferred, traded, or used within dApps that support Cardano's native tokens.

For further exploration, consider implementing more complex minting policies or integrating your token into a dApp. The Mesh SDK documentation and the Cardano developer portal provide excellent resources for deepening your understanding of Cardano's capabilities.

## Additional Resources

- [Mesh SDK Documentation](https://github.com/MeshJS/meshjs.dev)
- [Cardano Developer Portal](https://developers.cardano.org)
- [CIP-30 Specification](https://cips.cardano.org/cip/cip-0030/)
