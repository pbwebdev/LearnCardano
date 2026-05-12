---
slug: transaction-signing-order
type: pitfall
title: "Transaction Signing Order: Avoiding Failures on Cardano"
---

When developing on Cardano, understanding the correct sequence for signing transactions is crucial. Overlooking this aspect can lead to unexpected failures, making your transactions invalid or rejected by the network.

### Symptom

You might notice that transactions are being rejected or failing during submission. This could manifest as errors indicating invalid transaction witnesses.

### Cause

The root cause often lies in the improper order of signing transactions. Cardano enforces a strict sequence — transactions must be fully constructed, signed by all necessary parties, and only then submitted.

### Fix

To resolve this issue, follow these steps:

1. **Draft the Transaction**: Start by drafting the transaction using the `cardano-cli`. This involves specifying inputs, outputs, and other parameters such as `invalid-hereafter`.

   ```bash
   cardano-cli transaction build-raw \
     --tx-in <TxHash>#<TxIx> \
     --tx-out <Address>+<Lovelace> \
     --invalid-hereafter <slot> \
     --fee <fee> \
     --out-file tx.raw
   ```

2. **Calculate the Fee**: Use the draft to calculate the minimum fee required.

   ```bash
   cardano-cli transaction calculate-min-fee \
     --tx-body-file tx.raw \
     --tx-in-count 1 \
     --tx-out-count 1 \
     --witness-count 1 \
     --mainnet \
     --protocol-params-file protocol.json
   ```

3. **Sign the Transaction**: Ensure all required parties sign the transaction. This is especially important for multi-signature wallets.

   ```bash
   cardano-cli transaction sign \
     --tx-body-file tx.raw \
     --signing-key-file payment.skey \
     --mainnet \
     --out-file tx.signed
   ```

4. **Submit the Transaction**: Finally, submit the signed transaction to the network.

   ```bash
   cardano-cli transaction submit \
     --tx-file tx.signed \
     --mainnet
   ```

### Understanding the Transaction Lifecycle

The transaction lifecycle on Cardano involves:

- **Building**: Drafting the transaction with all necessary parameters.
- **Signing**: Adding witness signatures from all parties involved.
- **Submitting**: Broadcasting the transaction to the network.

### Resources

For more detailed guidance, refer to the [Cardano Node Wiki](https://github.com/input-output-hk/cardano-node-wiki/blob/main/docs/reference/building-and-signing-tx.md), which offers comprehensive instructions on building and signing transactions.

### Importance of Signing Order

The order of these steps is non-negotiable. Attempting to submit an unsigned transaction or one signed out of sequence will result in errors. This rigorous design ensures security and consistency across the Cardano network.

By adhering to the correct transaction signing order, developers can avoid common pitfalls and ensure that their transactions are processed smoothly and successfully. Understanding and implementing this sequence is essential for any developer working within the Cardano ecosystem.
