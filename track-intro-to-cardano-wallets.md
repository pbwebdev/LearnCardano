---
slug: intro-to-cardano-wallets
type: track
title: "Introduction to Cardano Wallets"
---

### Understanding Cardano Wallets

Cardano wallets are essential tools for managing your assets on the Cardano blockchain. They allow you to store, send, and receive ADA and other native tokens securely. In this track, we'll cover the various types of wallets available, how to set them up, manage your assets, and secure your funds.

#### Types of Cardano Wallets

1. **Byron Wallets**: These are legacy wallets from the initial phase of Cardano's development. While still supported, they are not recommended for new users.

2. **Shelley Wallets**: The most common type of wallet used today. Shelley wallets support delegation and staking, making them a popular choice.

3. **Shared Wallets**: Designed for collaborative use, these wallets allow multiple users to manage funds together. They're particularly useful for organisations or joint accounts.

For more details on wallet types, refer to the [Cardano Wallet API documentation](https://cardano-foundation.github.io/cardano-wallet/api/edge/#tag/Wallets).

### Setting Up a Cardano Wallet

To begin using a Cardano wallet, you'll need to set one up. This involves creating a new wallet using endpoints provided by the Cardano wallet API.

- **Creating a Shelley Wallet**: Use the `POST /wallets` endpoint to create a new Shelley wallet. Detailed instructions can be found in the [Cardano Wallet API guide](https://cardano-foundation.github.io/cardano-wallet/api/edge/#operation/postWallet).

- **Creating a Byron Wallet**: If necessary, use the `POST /byron-wallets` endpoint for legacy support.

### Managing Wallet Assets

Once your wallet is set up, you can manage your assets effectively. Cardano supports native tokens, allowing you to send and receive custom assets without needing smart contracts. This native support simplifies asset management across all wallet types.

For a comprehensive guide on managing assets, refer to the [Cardano Wallet documentation](https://github.com/cardano-foundation/cardano-wallet/blob/main/docs/site/src/user/common-use-cases/assets.md).

### Best Practices for Security

Securing your funds is paramount. Here are some best practices:

- **Regularly Update Software**: Ensure that your wallet software is up-to-date to protect against vulnerabilities.

- **Use Strong Passwords**: Protect your wallet with a strong, unique password.

- **Backup Your Recovery Phrase**: Keep your wallet's recovery phrase in a secure location. This is crucial for recovering your funds if you lose access to your wallet.

- **Utilise Hardware Wallets**: For enhanced security, consider using hardware wallets like Ledger or Trezor, which store your private keys offline.

### Conclusion

By understanding the different types of Cardano wallets and following best practices, you can manage your assets securely and effectively. This foundational knowledge sets the stage for more advanced blockchain interactions on Cardano.
