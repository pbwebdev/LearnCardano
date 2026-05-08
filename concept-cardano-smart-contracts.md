---
slug: cardano-smart-contracts
type: concept
title: "Introduction to Cardano Smart Contracts"
---

Smart contracts on the Cardano blockchain represent a significant evolution in blockchain technology, offering a robust platform for developing decentralized applications (dApps). Unlike traditional contracts that require intermediaries and are bound by physical limitations, smart contracts operate autonomously on the blockchain, executing predefined instructions when certain conditions are met.

### What are Smart Contracts?

Smart contracts are self-executing contracts with the terms of the agreement directly written into code. They automatically enforce and execute the terms when triggered by a set of predetermined conditions. In Cardano, these are referred to as Plutus scripts, named after the functional programming language Plutus.

### How Cardano Smart Contracts Differ

Cardano smart contracts differ significantly from those on platforms like Ethereum due to Cardano's unique Extended UTXO (eUTXO) model. This model allows for greater flexibility and scalability, addressing some of the limitations seen in account-based models like Ethereum's.

1. **eUTXO Model**: Unlike Ethereum's account-based model, Cardano uses the eUTXO model, which allows for multiple outputs from a single transaction. This model enhances security and parallel processing capabilities.
2. **Concurrency**: A common misconception is that Cardano can only handle one transaction per block due to concurrency issues. However, the eUTXO model actually supports multiple transactions per block, with each transaction able to operate independently of others.
3. **Native Tokens**: In Cardano, tokens are native and do not require smart contracts to manage them, unlike Ethereum where tokens are implemented through smart contracts. This reduces complexity and potential for errors.

### Role in Decentralized Applications

Cardano smart contracts enable the development of dApps that are secure, scalable, and efficient. They can be used for a variety of applications including:

- **Decentralized Finance (DeFi)**: Enabling services like lending, borrowing, and trading without intermediaries.
- **NFT Marketplaces**: Facilitating the creation and exchange of non-fungible tokens.
- **Supply Chain Management**: Automating and securing the tracking of goods and payments.
- **Voting Systems**: Implementing secure and transparent voting mechanisms.

### Writing Smart Contracts on Cardano

Smart contracts on Cardano are primarily written in Plutus, but developers can also use Aiken, a new language designed for writing secure and efficient smart contracts. The choice of language can depend on the specific requirements of the project, and developers should consider the ecosystem and tooling available.

### Misconceptions and Clarifications

There is a misconception that Cardano's smart contract system is less capable due to its concurrency model. However, the eUTXO model's design allows for more complex and secure transactions by enabling parallel processing, reducing the risk of bottlenecks.

### Conclusion

Cardano smart contracts offer a powerful tool for developers looking to create secure and scalable dApps. By leveraging the unique eUTXO model and Plutus scripting language, Cardano provides a robust platform that addresses many of the issues faced by earlier blockchain platforms. As the ecosystem continues to grow, the flexibility and efficiency of Cardano's smart contracts are likely to attract more developers and projects.

For further reading and more technical details, refer to the [Cardano Developer Portal](https://github.com/cardano-foundation/developer-portal) and [Mesh SDK Overview](https://github.com/MeshJS/meshjs.dev/blob/main/content/docs/apis/txbuilder/smart-contracts.mdx).
