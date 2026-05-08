---
slug: cardano-plutus
type: concept
title: "Introduction to Plutus: Cardano's Smart Contract Platform"
---

Plutus is Cardano's smart contract development platform, designed to enable developers to create secure and reliable decentralized applications (dApps). It leverages Haskell, a functional programming language, to provide a high-level environment for writing smart contracts. This introductory guide explores the architecture of Plutus, its key components, and its integration with the Cardano blockchain.

### Plutus Architecture

Plutus is built on a layered architecture, consisting of several key components:

- **Plinth**: Formerly known as Plutus Tx, Plinth is a high-level language used for writing the validation logic of smart contracts. It is a subset of Haskell and is used to write the logic that determines transaction validity, such as spending UTXOs or minting assets.

- **Plutus Core**: This is the low-level language that actually runs on the blockchain. Plutus Core is based on lambda calculus and is responsible for executing smart contracts. It is designed to be minimal and efficient, focusing on security and robustness.

- **Untyped Plutus Core (UPLC)**: The compiled version of Plinth contracts, UPLC is the language executed on the Cardano blockchain. The use of UPLC ensures that only the essential logic is executed on-chain, maintaining efficiency and security.

For more on Plinth and Plutus Core, you can refer to the [Plinth and Plutus Core documentation](https://github.com/IntersectMBO/plutus/blob/main/doc/docusaurus/docs/essential-concepts/plinth-and-plutus-core.md).

### Key Components

1. **Smart Contracts**: In Plutus, smart contracts are written in Plinth (Haskell) and compiled to UPLC for execution on the Cardano blockchain. These contracts are used to automate processes, manage assets, and enforce rules without intermediaries.

2. **Datums and Redeemers**: These are data structures used in Plutus contracts to provide input data and conditions for contract execution. Datums are used to store state, while redeemers are used to provide arguments to scripts. More details can be found in the [Datums and Redeemers documentation](https://github.com/IntersectMBO/plutus/blob/main/doc/docusaurus/docs/glossary.md).

3. **Validator Scripts**: These are scripts that determine whether a transaction is valid. They are executed by the Cardano blockchain during transaction processing. Validators are predicates, meaning they return true or false based on the transaction details.

### Integration with Cardano

Plutus is integrated into the Cardano blockchain through the extended UTXO (eUTXO) model. This model extends the traditional UTXO system by allowing smart contracts to interact with UTXOs, providing more flexibility and capabilities compared to simple transaction models.

- **eUTXO Model**: The eUTXO model allows for more complex transaction logic, supporting smart contracts and enabling features such as multi-signature transactions and custom tokens. You can learn more about the eUTXO model in the [Cardano eUTXO Model documentation](https://github.com/IntersectMBO/plutus/blob/main/doc/docusaurus/docs/glossary.md).

### Plutus vs. EVM

For developers familiar with Ethereum's ecosystem, Plutus can be seen as a combination of Solidity and the EVM. While Solidity is a high-level language for writing contracts, the EVM is the runtime environment. In Cardano, Plinth serves as the high-level language, and Plutus Core acts as the execution environment.

### Common Misconceptions

One prevalent misconception is that Plutus executes Haskell code directly on-chain. In reality, Plutus contracts written in Haskell (Plinth) are compiled into Untyped Plutus Core before being executed on-chain. This ensures that the on-chain execution is efficient and secure.

### Conclusion

Plutus empowers developers to create sophisticated and secure dApps on Cardano by leveraging Haskell's strengths and the robustness of the Cardano blockchain. Understanding its architecture and components is crucial for developers looking to harness Cardano's smart contract capabilities effectively.

For further exploration and resources, you can watch the [Functional Smart Contracts on Cardano presentation](https://www.youtube.com/embed/MpWeg6Fg0t8) by experts in the field.
