---
slug: simple-sticker-collection-dapp
type: minidapp
title: "Simple Sticker Collection DApp"
---

Creating a Simple Sticker Collection DApp on the Cardano blockchain involves several key components: user accounts, asset creation, and interactions on the blockchain. This guide will walk through the basics of setting up a DApp where users can collect, trade, and showcase digital stickers. 

### Overview

The Simple Sticker Collection DApp leverages Cardano's ability to handle native assets directly on the blockchain. Unlike other platforms that require smart contracts for token management, Cardano treats custom tokens as first-class citizens alongside ADA. This means our DApp can efficiently manage digital stickers as native tokens.

For a foundational understanding, see the [Cardano Developer Portal's section on Assets](https://github.com/cardano-foundation/developer-portal/blob/main/docs/learn/core-concepts/assets.md).

### Architecture

This DApp follows a distributed dApp (dDApp) model as described in [CIP-0089](https://github.com/cardano-foundation/CIPs/blob/main/./CIP-0089/README.md). Each user is given their own DApp address, maintaining custody and control of their assets. This decentralised approach ensures that there is no centralised point of failure and enhances user autonomy.

### Components

1. **User Accounts**: 
   - Each user connects their Cardano wallet via the Mesh SDK, which implements the [CIP-30 dApp-wallet web bridge standard](https://cips.cardano.org/cip/CIP-0030).
   - Users can authenticate and manage their digital stickers through their connected wallet.

2. **Asset Creation**:
   - Stickers are minted as native tokens on the Cardano blockchain. This process involves defining the asset's metadata and policy scripts.
   - For detailed steps on minting, refer to the [Minting Native Assets guide](https://github.com/cardano-foundation/developer-portal/blob/main/docs/build/native-tokens/minting.md).

3. **Smart Contracts**:
   - Smart contracts written in Plutus handle the logic for trading and showcasing stickers. Plutus allows for secure and complex transaction logic directly on-chain.

### Development Stack

- **On-Chain**: Plutus for smart contract development.
- **Off-Chain**: Haskell for backend logic and Cardano CLI for blockchain interactions.
- **Frontend**: Utilizing Next.js for the user interface and Mesh SDK for wallet integration.

### Implementing the DApp

#### Setting Up the Environment

1. **Install Dependencies**: Ensure you have Node.js, Haskell, and the Cardano CLI installed.

2. **Initialize a Next.js Project**:
   ```bash
   npx create-next-app simple-sticker-collection-dapp
   cd simple-sticker-collection-dapp
   npm install @meshsdk/core
   ```

3. **Connect to a Wallet**:
   - Use Mesh SDK to integrate wallet connection functionality.
   - Display the user's ADA balance and any owned stickers.

#### Minting Stickers

- Define the asset policy and metadata following the Cardano native token standards.
- Use the Cardano CLI to mint tokens, ensuring they are recognised as native assets on the blockchain.

#### Trading Stickers

- Implement Plutus smart contracts to facilitate peer-to-peer trading of stickers.
- Ensure contracts are tested on the Cardano testnet before deploying to mainnet.

### Testing and Deployment

- **Test Locally**: Start the development server with `npm run dev` and access the app at `http://localhost:3000`.
- **Deploy**: Once tested, deploy your application using a platform like Vercel for Next.js.

### Conclusion

This Simple Sticker Collection DApp provides a hands-on introduction to building on Cardano, showcasing the power of native assets and decentralised applications. By following this guide, developers gain practical experience in blockchain development, asset management, and smart contract integration on Cardano.
