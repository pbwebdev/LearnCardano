---
slug: cardano-transaction-structure
type: concept
title: "Understanding Cardano Transaction Structure"
---

Cardano's transaction structure is pivotal to understanding how the blockchain operates, particularly because it uses the Extended Unspent Transaction Output (eUTXO) model. This model is a sophisticated evolution of Bitcoin's UTXO model, enabling advanced smart contract functionality while maintaining determinism.

### Components of a Cardano Transaction

A Cardano transaction is essentially a state change request on the blockchain. It involves the following key components:

- **Inputs**: These are existing UTXOs that are consumed by the transaction. Each input references a previous transaction's output, which is being spent.
- **Outputs**: New UTXOs created by the transaction. Each output specifies an address and a value and can optionally include a datum, which is a piece of data that scripts can use for conditions.
- **Signatures**: Transactions must be signed by the private keys associated with the input UTXOs, authorising the spend.
- **Redeemers**: These are data structures passed to validators when spending UTXOs locked by scripts, providing arguments necessary for script execution.
- **Validity Interval**: A time window during which the transaction is valid. This prevents transactions from being executed outside a defined timeframe.
- **Fees**: Transactions must include a fee, which is deducted from the total input value.

### The eUTXO Model

The eUTXO model extends the traditional UTXO model by adding support for smart contracts through datums and redeemers. This allows for complex transaction logic while maintaining the deterministic nature of UTXOs:

- **Datums**: These are pieces of data attached to outputs that can be used by scripts to determine spending conditions.
- **Redeemers**: These provide input arguments to scripts, enabling dynamic execution based on transaction context.

This model ensures that each transaction's outcome is predictable before it is submitted to the blockchain, which contrasts with account-based models where state changes can be less predictable.

### How It Differs from Ethereum

In Ethereum, transactions directly alter account balances in a global state. This can lead to non-deterministic outcomes due to concurrent state changes. In contrast, Cardano's eUTXO model processes transactions independently, leading to deterministic results. Each transaction explicitly defines its inputs and outputs, ensuring no hidden state changes.

### Common Misconceptions

One misconception is that Cardano's transaction model is overly complex. While its structure is more intricate than account-based models, this complexity allows for greater flexibility and security. Developers may initially find it challenging but ultimately benefit from its deterministic and robust nature.

### Conclusion

Understanding Cardano's transaction structure is crucial for developers and users alike. By leveraging the eUTXO model, Cardano provides a powerful and flexible framework for building secure and efficient applications on the blockchain. For further reading, the [Cardano Developer Portal](https://github.com/cardano-foundation/developer-portal/blob/main/docs/learn/core-concepts/transactions.md) offers comprehensive resources on transaction mechanics and the eUTXO model.
