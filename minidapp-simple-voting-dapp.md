---
slug: simple-voting-dapp
type: minidapp
title: "Simple Voting DApp"
---

Building a simple voting dApp on the Cardano blockchain is a great way to dive into smart contracts and user interactions. This guide will take you through creating a basic decentralized application where users can create polls, vote on them, and view results in real-time.

### Prerequisites

Before diving into development, ensure you have the following:

- A basic understanding of blockchain concepts.
- Familiarity with Cardano CLI and Plutus.
- Node.js installed for frontend development.

### Architecture Overview

The voting dApp consists of:

- **Smart Contracts**: Implemented in Plutus to handle poll creation, voting, and result tallying.
- **Backend**: Utilizes Haskell scripts and Cardano CLI for transaction management.
- **Frontend**: A React application to provide user interface for poll interactions.

### Step 1: Creating a Poll

The first step is to create a poll on the blockchain. This involves crafting a transaction that includes the poll metadata.

```bash
cardano-cli governance create-poll \
  --question "What's your favourite programming language?" \
  --answer "Haskell" \
  --answer "JavaScript" \
  --answer "Python" \
  --nonce 20231501 \
  --out-file poll.cbor > poll.json
```

- **`--nonce`**: Ensures uniqueness for polls with the same question.
- **`--out-file`**: Outputs a serialized version suitable for distribution.

### Step 2: Submitting the Poll

After creating the poll, broadcast it to the network by building a transaction:

```bash
cardano-cli transaction build \
  --babbage-era \
  --testnet-magic 42 \
  --tx-in <TxID#TxIx> \
  --change-address $(cat payment.addr) \
  --metadata-json-file poll.json \
  --json-metadata-detailed-schema \
  --required-signer-hash $(cat delegate.hash) \
  --out-file question.tx
```

### Step 3: Voting Process

Participants will use the `poll.cbor` file to submit their votes. The voting process will be managed by another smart contract that checks voter eligibility and records votes.

### Step 4: Viewing Results

Once voting concludes, results can be aggregated and displayed on the frontend. This requires querying the blockchain for poll data and tallying votes.

### Frontend Implementation

Develop the frontend using React to interact with the blockchain, allowing users to create polls and cast votes. Use TypeScript for type safety and clarity.

### Conclusion

This simple voting dApp serves as a foundational project to understand how decentralized applications function on the Cardano blockchain. By expanding upon this project, you can explore more complex features like voter authentication, enhanced user interfaces, and integration with other blockchain services.

For more detailed instructions on using Cardano CLI and Plutus for smart contracts, refer to the [Cardano Node Wiki](https://github.com/input-output-hk/cardano-node-wiki/blob/main/docs/reference/Polls.md) and [PyCardano Governance Guide](https://github.com/Python-Cardano/pycardano/blob/main/docs/source/guides/governance.rst).
