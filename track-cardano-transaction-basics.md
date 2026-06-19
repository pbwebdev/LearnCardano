---
slug: cardano-transaction-basics
type: track
title: "Understanding Cardano Transactions"
---

### Introduction

Cardano transactions are integral to the functionality of the blockchain, allowing users to transfer ADA and interact with smart contracts. Understanding how these transactions work is crucial for anyone looking to use the Cardano network effectively.

### The UTXO Model

Cardano uses the Unspent Transaction Output (UTXO) model, similar to Bitcoin. Each transaction consumes one or more UTXOs and creates new ones. This model ensures that every transaction is 'well-balanced', meaning the total value of inputs equals the total of outputs plus fees. For more on the UTXO model, see the [Cardano documentation](https://github.com/cardano-foundation/developer-portal/blob/main/docs/learn/cardano-cli/basic-operations/simple-transactions.md).

### Transaction Types

Transactions on Cardano can be classified into several types:

- **Simple Transactions**: These involve the transfer of ADA from one address to another. They are straightforward but require the correct calculation of fees and balance.
- **Multi-Asset Transactions**: With the introduction of native tokens, transactions can now involve multiple assets, not just ADA.
- **Smart Contract Transactions**: These are more complex and involve executing scripts on the blockchain.

### How Fees Work

Cardano employs a deterministic fee model. The fee for a transaction is calculated using a fixed formula based on the transaction size and, for smart contracts, the execution budget. This deterministic nature means fees can be calculated before submission, eliminating the unpredictability seen in other blockchains like Ethereum. More details can be found in the [Cardano fee documentation](https://github.com/cardano-foundation/developer-portal/blob/main/docs/learn/educational-resources/ethereum-developers.md).

### Sending and Receiving ADA

To send ADA, you need to:

1. **Build the Transaction**: Using tools like `cardano-cli`, you specify inputs (UTXOs) and outputs (addresses and amounts), ensuring the transaction is balanced.
2. **Sign the Transaction**: Authenticate it using your private key.
3. **Submit the Transaction**: Broadcast it to the Cardano network for inclusion in the blockchain.

Receiving ADA is simpler and involves providing your wallet address to the sender.

### Practical Steps

Using the `cardano-cli`, transactions are built, signed, and submitted through a series of commands. Here's a basic example:

```bash
cardano-cli transaction build \
 --tx-in <UTXO> \
 --tx-out <address>+<amount> \
 --change-address <change-address> \
 --out-file tx.raw

cardano-cli transaction sign \
 --tx-body-file tx.raw \
 --signing-key-file <signing-key> \
 --out-file tx.signed

cardano-cli transaction submit \
 --tx-file tx.signed \
 --mainnet
```

### Conclusion

Understanding Cardano transactions is crucial for effective participation on the network. By grasping the UTXO model, transaction types, and fee structures, you can confidently send and receive ADA, as well as interact with more complex functionalities like multi-asset transactions and smart contracts.
