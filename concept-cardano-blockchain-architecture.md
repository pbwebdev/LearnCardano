---
slug: cardano-blockchain-architecture
type: concept
title: "Cardano Blockchain Architecture: An Overview"
---

Cardano is a third-generation blockchain platform designed to address some of the most pressing issues faced by earlier blockchain technologies. Its architecture is distinctively structured into layers, each serving a specific function to enhance the system's flexibility, security, and scalability.

## The Layered Architecture

Cardano's architecture is primarily divided into two layers:

### 1. Cardano Settlement Layer (CSL)

The Cardano Settlement Layer is responsible for all the transaction-related activities. It handles the ledger of accounts and balances, and it is where the ADA cryptocurrency resides. This separation ensures that any changes or upgrades to the ledger can occur without affecting the computation layer.

### 2. Cardano Computation Layer (CCL)

The Cardano Computation Layer is where smart contracts are executed. It is designed to support advanced functionalities, enabling developers to create decentralized applications (dApps). By separating this layer from the CSL, Cardano can ensure that smart contract functionality is robust and secure without jeopardizing the stability of the currency layer.

## Key Components of Cardano

Cardano's architecture includes several key components that interact across these layers:

- **Ouroboros Protocol**: This is Cardano's consensus mechanism, a proof-of-stake protocol that determines how nodes agree on the network's state. It's designed to be energy-efficient and secure, providing a high level of assurance through rigorous academic research.

- **Cardano-node**: This is the core software that runs the Cardano protocol. It manages interactions with the blockchain, processing transactions, and maintaining the network's state.

- **Cardano-wallet**: This component handles the user's funds, allowing for secure storage and transactions. It interacts with the Cardano-node to ensure seamless operations.

- **Daedalus and Yoroi Wallets**: These are user-facing applications that provide interfaces for interacting with the Cardano network. Daedalus is a full-node wallet, while Yoroi is a light wallet, offering different levels of decentralisation and user experience.

## Formal Methods and Security

One of Cardano's standout features is its reliance on formal methods—a rigorous mathematical approach to software development. By using formal specifications, Cardano ensures that each component functions as intended, reducing the risk of vulnerabilities and errors.

## How the Layers Interact

The interaction between the CSL and CCL is crucial for Cardano's functionality:

- Transactions are processed in the CSL, ensuring fast and secure transfers of ADA.
- The CCL handles smart contracts, allowing for complex computations and dApp functionality without affecting the transactional integrity of the CSL.

This separation allows for each layer to evolve independently, providing flexibility in upgrades and maintaining high security standards.

## EVM Comparison

For those familiar with Ethereum, Cardano's architecture can be seen as a more modular approach. While Ethereum handles transactions and smart contracts on a single layer, Cardano's separation into CSL and CCL allows for more specialized handling of each function, potentially leading to better scalability and security.

## Common Misconceptions

A common misconception is that Cardano's layers function similarly to traditional blockchain layers. However, the separation of settlement and computation layers, along with the use of formal methods, distinguishes Cardano significantly, providing a more robust and scalable platform.

## Conclusion

Cardano's architectural design reflects its commitment to sustainability, scalability, and security. By employing a layered approach and leveraging formal methods, Cardano stands out as a pioneering blockchain platform, poised to meet the needs of future decentralized applications and secure transactions.

For more detailed technical information, you can explore the [Cardano Components](https://github.com/cardano-foundation/developer-portal/blob/main/docs/get-started/infrastructure/node/cardano-components.md) and [Introduction to Cardano](https://github.com/cardano-foundation/developer-portal/blob/main/docs/learn/core-concepts/overview.md) on the Cardano Developer Portal.
