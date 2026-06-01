---
slug: cardano-metadata
type: concept
title: "Understanding Cardano Metadata"
---

Cardano metadata is an integral feature of the blockchain that enables the attachment of additional information to transactions. This functionality enhances the versatility and applicability of transactions within the Cardano ecosystem, enabling a wide range of potential use cases.

### What is Cardano Metadata?

Cardano metadata refers to the data that can be associated with a transaction on the Cardano blockchain. This data is user-defined and can include various types of information, such as transaction comments, digital signatures, or asset ownership details. Importantly, metadata does not affect the execution or validation of the transaction itself, allowing for flexible and secure data attachment.

### How Metadata Works

Metadata in Cardano is stored on-chain and is part of the transaction body. This means that while it is permanently recorded on the blockchain, it does not impact the ledger state or transaction validation. The metadata hash is included in the transaction body, ensuring that the metadata can be authenticated and its integrity verified. Every transaction signature covers this metadata hash, providing security and immutability.

For developers, metadata is a powerful tool to embed additional data within transactions. Using the Cardano Wallet API, metadata can be represented in JSON format, which is isomorphic to the on-chain binary encoding.

### Types of Metadata

1. **Transaction Metadata**: This includes arbitrary data attached to a transaction, such as tags or comments. It is useful for applications that require certified ownership exchange, document certification, or other custom data needs.

2. **Asset Metadata**: Specific to assets, this metadata can describe asset properties, provenance, and other relevant details. It follows Cardano CIP standards and is supported by tools like the Evolution SDK.

3. **Token Metadata**: Similar to asset metadata, this type applies to tokens, providing a rich metadata layer that supports various use cases in token management and utilisation.

### Use Cases and Applications

- **Certification and Provenance**: Metadata can be used to certify ownership of assets, documenting the transfer of ownership over time. This is particularly useful for digital assets and documents that require proof of authenticity.

- **Document Certification**: By using a public hash, metadata can certify the existence of a document at a specific time. This is beneficial for legal documents, digital contracts, and any scenario where proof of existence is required.

- **Enhancing User Experience**: Applications can leverage metadata to store user-specific information, enhancing the functionality and user experience without impacting the transaction's execution.

### Considerations and Best Practices

While metadata offers significant benefits, it is crucial to remember that once data is on the blockchain, it is immutable and public. Therefore, sensitive or personally identifiable information (PII) should never be included in metadata. Developers should also be aware of the potential cost implications, as larger metadata payloads can increase transaction fees.

### Conclusion

Cardano metadata is a versatile and powerful feature that expands the potential applications of the blockchain. By enabling the attachment of additional information to transactions, it allows for enhanced functionality while maintaining the integrity and security of the network. Developers and users alike can leverage metadata to build more dynamic and informative applications, contributing to the growing ecosystem of Cardano.

For further details on implementing and using metadata in your Cardano applications, refer to the [Cardano Node Wiki on Transaction Metadata](https://github.com/input-output-hk/cardano-node-wiki/blob/main/docs/reference/tx-metadata.md) and the [Cardano Wallet documentation](https://github.com/cardano-foundation/cardano-wallet/blob/main/docs/site/src/user/common-use-cases/handle-metadata.md).
