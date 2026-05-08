---
slug: cardano-eutxo-model
type: concept
title: "Understanding the eUTXO Model in Cardano"
---

Cardano's Extended Unspent Transaction Output (eUTXO) model is a fundamental component of its blockchain architecture, distinguishing it from account-based systems like Ethereum. The eUTXO model builds upon Bitcoin's UTXO model by adding support for multi-assets and smart contracts, offering several advantages that improve scalability, security, and transaction determinism.

### The Basics of eUTXO

At its core, the eUTXO model is a system where every transaction output is uniquely identified and can be spent only once. This is akin to how cash works: each note or coin is a discrete unit that can be spent individually. In Cardano, each UTXO contains a value and an address, and transactions consume these outputs to create new ones, ensuring that the ledger remains consistent and secure.

The 'extended' part of eUTXO refers to the incorporation of datums and redeemers. Datums are pieces of data attached to UTXOs, while redeemers are inputs provided when a UTXO is spent. This extension allows for more complex transaction logic and stateful smart contracts, enabling a broader range of applications.

### Advantages Over Account-Based Models

1. **Deterministic Transactions**: One of the key benefits of the eUTXO model is determinism. Before a transaction is submitted, users can know exactly how it will execute, as the state of the ledger is not affected by concurrent transactions. This reduces the risk of unexpected behaviours and errors.

2. **Scalability**: The eUTXO model facilitates parallel processing of transactions, as each UTXO is independent. This contrasts with account-based models, where transactions can be bottlenecked by account state updates.

3. **Security**: Since UTXOs can only be spent once, double-spending is inherently prevented. The model also supports more straightforward verification processes, adding an extra layer of security.

4. **Privacy**: Transactions can be structured to enhance privacy, as the model does not require account balances to be publicly visible.

5. **Simplified Transaction Logic**: Each transaction in the eUTXO model is atomic, meaning it either fully succeeds or fails. This all-or-nothing approach simplifies transaction logic and ensures consistency.

### How eUTXO Supports Smart Contracts

Smart contracts on Cardano operate under the eUTXO model by using validators, which act as predicates or conditions that need to be satisfied for a UTXO to be spent. These validators are deterministic, ensuring that they return the same result given the same inputs, which is crucial for secure and predictable smart contract execution.

Furthermore, the use of datums and redeemers allows smart contracts to maintain state and perform more complex logic. This capability is a significant advancement over the traditional UTXO model, enabling a wide range of applications from simple token transfers to complex DeFi protocols.

### Comparison with Ethereum's Account-Based Model

In Ethereum's account-based model, the ledger tracks account balances similar to a bank. Transactions update these balances, which can lead to issues with concurrency and determinism. By contrast, Cardano's eUTXO model tracks discrete units of value, providing a more predictable execution environment.

While the account model may seem simpler, the eUTXO model's predictability and enhanced security make it an attractive alternative for developers seeking to build robust blockchain applications.

### Conclusion

The eUTXO model represents a significant evolution in blockchain architecture, offering numerous advantages over traditional account-based systems. By supporting deterministic transactions, enhanced security, and complex smart contracts, it provides a solid foundation for innovative applications on the Cardano blockchain.

For more in-depth information, you can explore the [Cardano documentation on eUTXO](https://github.com/input-output-hk/cardano-documentation/blob/main/docs/about-cardano/03-learn/15-eutxo-explainer.md) and the [EUTXO handbook](https://ucarecdn.com/3da33f2f-73ac-4c9b-844b-f215dcce0628/EUTXOhandbook_for_EC.pdf).
