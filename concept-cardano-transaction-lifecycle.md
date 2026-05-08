---
slug: cardano-transaction-lifecycle
type: concept
title: "Understanding the Cardano Transaction Lifecycle"
---

Understanding the transaction lifecycle on Cardano is crucial for developers and users engaging with its blockchain. Unlike Ethereum's account-based model, Cardano employs an Extended Unspent Transaction Output (eUTXO) model, which offers distinct advantages and requires a different approach to transaction management.

### Key Components of a Cardano Transaction

A Cardano transaction involves several key components that work together to move assets from one state to another. Here’s a breakdown of these components:

- **Inputs**: These are the UTxOs being spent in the transaction. Each input must be signed by the owner to authorize the spending.

- **Outputs**: New UTxOs are created as outputs, each associated with an address, a value, and optionally a datum.

- **Signatures**: Required to authorize the transaction, ensuring that only the rightful owner can spend the UTxOs.

- **Redeemers**: Data passed to validators when spending UTxOs locked at script addresses, used to unlock these funds.

- **Validity Interval**: A defined time window during which the transaction is valid. Transactions outside this interval are rejected.

- **Mint/Burn**: Operations for creating or destroying tokens, if applicable.

### Transaction Validity and Atomicity

One of the unique features of the Cardano blockchain is its approach to transaction validity and atomicity. The validity interval specifies when a transaction can be included in the blockchain. This is different from Ethereum, where transactions can directly query block timestamps.

In Cardano, validators do not have access to the current time during execution. Instead, they rely on the transaction’s validity interval. This ensures that time-based constraints are respected without relying on external state.

### Determinism and Local State

A major advantage of the eUTXO model is its deterministic nature. Every aspect of the transaction, from inputs to outputs and signatures, is self-contained. This means that validators have all the necessary information to execute a transaction without querying external state, reducing the risk of unexpected outcomes due to concurrent modifications.

In Ethereum, transactions can involve multiple internal contract calls, leading to potential side effects if other transactions modify shared state. Cardano transactions, however, must succeed or fail atomically, ensuring consistency across all involved UTxOs.

### Composition and Flexibility

Cardano transactions can interact with multiple script addresses and mint tokens under various policies within a single transaction. This flexibility contrasts with Ethereum’s reliance on router contracts for complex interactions. Each validator script in a Cardano transaction runs independently, and all scripts must pass for the transaction to succeed.

### Conclusion

The Cardano transaction lifecycle presents a robust and deterministic model for managing blockchain interactions. By understanding these components and how they interact, developers can effectively leverage Cardano's unique capabilities to build secure and efficient blockchain applications.

For more detailed information, please refer to the [Cardano Wallet Transaction Lifecycle documentation](https://github.com/cardano-foundation/cardano-wallet/blob/main/docs/site/src/design/concepts/transaction-lifecycle.md) and the [Developer Portal](https://github.com/cardano-foundation/developer-portal/blob/main/docs/learn/educational-resources/ethereum-developers.md).
