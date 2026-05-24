---
slug: 011-build-transaction-simple-script
type: recipe
title: "Build a Simple Transaction with a Script"
---

Creating a basic Cardano transaction using a simple script is a foundational skill for blockchain developers working with Cardano. This guide will walk you through the process of constructing, signing, and submitting a transaction using the Cardano CLI.

### Prerequisites

To follow this guide, you should have:

- A running Cardano node.
- Basic understanding of the Cardano UTXO model.
- Familiarity with the Cardano CLI.

### Understanding Simple Transactions

Cardano transactions involve consuming one or more Unspent Transaction Outputs (UTXOs) and generating new UTXOs. The simplest form of transaction is transferring ADA from one address to another. It is crucial that transactions are well-balanced: the sum of inputs must equal the sum of outputs plus transaction fees. Unbalanced transactions will be rejected.

You can learn more about the UTXO model from the [Cardano Developer Portal](https://github.com/cardano-foundation/developer-portal/blob/main/docs/learn/cardano-cli/basic-operations/simple-transactions.md).

### Transaction Workflow

The process of creating a transaction involves three main steps:

1. **Build**: Construct the transaction with the necessary details.
2. **Sign**: Authenticate the transaction using the appropriate keys.
3. **Submit**: Send the signed transaction to the network.

### Building the Transaction

You can build transactions using the Cardano CLI with different commands based on your needs:

- **`build-raw`**: Enables offline transaction building but requires manual fee calculation and balancing.
- **`build`**: Automatically calculates fees and balances the transaction, requiring a connection to a running node.
- **`build-estimate`**: Useful for estimating transaction size and fees without a node connection.

#### Example Command

```bash
cardano-cli transaction build \
  --tx-in <transaction_input> \
  --tx-out <recipient_address>+<amount> \
  --change-address <change_address> \
  --out-file tx.raw
```

### Signing the Transaction

After building the transaction, you need to sign it using your payment signing key.

#### Example Command

```bash
cardano-cli transaction sign \
  --tx-body-file tx.raw \
  --signing-key-file <payment.skey> \
  --out-file tx.signed
```

### Submitting the Transaction

With the transaction signed, you can now submit it to the blockchain.

#### Example Command

```bash
cardano-cli transaction submit \
  --tx-file tx.signed \
  --mainnet
```

### Conclusion

By following these steps, you can successfully create and submit a simple transaction on the Cardano blockchain. This process forms the basis for more complex interactions, such as those involving multi-signatures or smart contracts.

For further reading, explore the [Cardano Developer Portal](https://github.com/cardano-foundation/developer-portal/blob/main/docs/learn/cardano-cli/simple-scripts/simple-scripts.md) for details on using scripts with transactions.
