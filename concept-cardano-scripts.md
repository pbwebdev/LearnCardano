---
slug: cardano-scripts
type: concept
title: "Introduction to Cardano Scripts"
---

Cardano scripts are a fundamental component of the Cardano blockchain, enabling the execution of smart contracts. These scripts allow for complex transaction validation logic, essential for the secure and flexible operation of decentralised applications (dApps) on Cardano.

### Understanding the eUTXO Model

The Cardano blockchain utilises an extended version of the Unspent Transaction Output (UTXO) model, known as eUTXO. This model enhances the traditional UTXO approach by allowing scripts to determine the conditions under which a transaction can occur. Unlike the account-based model used by Ethereum, the eUTXO model ensures that transactions are deterministic, meaning the outcome is known before the transaction is processed. This determinism is crucial for ensuring predictable smart contract behaviour.

In the eUTXO model, each transaction output can include not just a value and an address, but also additional data fields such as datums and redeemers. These fields allow scripts to access and utilise local state information, which is a key feature for implementing smart contracts.

### Role of Scripts in Cardano

Scripts in Cardano serve as validators. They do not initiate actions themselves but evaluate whether certain conditions are met for a transaction to proceed. This approach contrasts with Ethereum's model, where smart contracts can actively manage state and trigger actions.

- **Validator Scripts**: These scripts contain logic that determines whether a transaction can be executed. They check conditions such as whether the correct signatures are provided or whether certain state conditions are met.
- **Datums and Redeemers**: Datums are pieces of data attached to UTXOs that scripts can read, while redeemers are inputs provided by the user to trigger the script's logic.
- **Context**: The context includes transaction-specific information that scripts can access to perform validations.

### Scripts and Smart Contracts

Cardano scripts enable the implementation of smart contracts by defining the rules and conditions under which transactions can occur. While Ethereum smart contracts can directly modify state and execute code, Cardano's approach focuses on validation. This distinction makes Cardano's smart contracts more secure and less prone to unpredictable behaviours.

### Developing with Cardano Scripts

Developers can write Cardano scripts using various languages, with Plutus being the primary language for smart contract development on Cardano. Plutus scripts are compiled and deployed on the blockchain, where they execute their validation logic as part of transaction processing.

For developers transitioning from Ethereum, it's important to understand the differences in how smart contracts are structured and executed. While the underlying principles of logic and validation remain, the deterministic nature of the eUTXO model requires a different approach to designing and implementing smart contracts.

### Conclusion

Cardano scripts are a powerful tool for creating secure, efficient, and deterministic smart contracts. By leveraging the eUTXO model, Cardano provides a robust framework for developing dApps that can scale effectively while maintaining security and predictability. Understanding how these scripts work and their role in the Cardano ecosystem is crucial for developers looking to build on this innovative blockchain platform.

For more detailed information, refer to the [Cardano Developer Portal on eUTXO](https://github.com/cardano-foundation/developer-portal/blob/main/docs/learn/core-concepts/eutxo.md).
