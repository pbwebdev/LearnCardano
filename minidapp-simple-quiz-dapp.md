---
slug: simple-quiz-dapp
type: minidapp
title: "Simple Quiz dApp: A Beginner's Guide"
---

Creating a simple quiz dApp on Cardano is an excellent way for beginners to get their feet wet with blockchain development. This project will guide you through the process of setting up a decentralized application (dApp) that allows users to answer multiple-choice questions, submit their answers, and receive immediate feedback. The dApp will leverage Cardano's smart contracts to handle quiz submissions and scoring, providing a practical introduction to blockchain application development.

### Prerequisites

Before starting, ensure you have the following:

- Basic understanding of JavaScript and React.
- Familiarity with Haskell, as it's used for writing Plutus smart contracts.
- Cardano CLI installed and configured on your machine.
- Access to a Cardano testnet or sandbox environment for deployment.

### Architecture Overview

The architecture of this quiz dApp consists of the following components:

1. **Frontend**: Built with React, the frontend will handle user interactions, displaying questions and collecting answers.
2. **Backend**: A lightweight server to manage user sessions and communicate with the blockchain.
3. **Smart Contracts**: Written in Plutus, these contracts will validate submissions and calculate scores.

### Step-by-Step Guide

#### 1. Setting Up the Frontend

Start by creating a React application. You can use Create React App for a quick setup:

```bash
npx create-react-app quiz-dapp
cd quiz-dapp
```

In your React app, create components for displaying questions and handling user input. Use state management to keep track of user answers.

#### 2. Building the Backend

For the backend, you can use Node.js to set up a simple server that interfaces with your frontend and the Cardano blockchain. This server will manage user sessions and handle API requests from the frontend.

#### 3. Writing Smart Contracts with Plutus

Plutus smart contracts will be used to validate quiz submissions. You'll write contracts that check if the answers are correct and calculate the user's score. Plutus contracts are written in Haskell, and you'll need to compile them for deployment.

Refer to the [Plutus documentation](https://plutus-community.readthedocs.io/en/latest/) for detailed instructions on writing and compiling smart contracts.

#### 4. Integrating with Cardano

Use the Cardano CLI to deploy your smart contracts to the blockchain. You'll create transactions that include the necessary metadata for each quiz submission:

```bash
cardano-cli transaction build \
    --babbage-era \
    --cardano-mode \
    --testnet-magic 1097911063 \
    --tx-in $TXID#0 \
    --tx-out $ADDRESS+1000000 \
    --change-address $ADDRESS \
    --out-file quiz.tx
```

Sign and submit the transaction to the Cardano network.

#### 5. Providing Feedback

Once the smart contract processes a submission, the result (pass/fail and score) can be sent back to the frontend for display to the user. This feedback loop is crucial for user engagement.

### Deployment and Testing

Deploy your dApp to a Cardano testnet first to ensure everything works as expected. Use [Cardanoscan](https://testnet.cardanoscan.io/) to verify transactions and contract interactions.

### Conclusion

By completing this project, you will have a functional quiz dApp that not only tests user knowledge but also demonstrates the power of smart contracts on the Cardano blockchain. This is a stepping stone to more complex dApp development, and you are encouraged to explore additional features such as user authentication and enhanced scoring algorithms.

For further learning, consider exploring the [Mesh SDK guide](https://github.com/MeshJS/meshjs.dev/blob/main/content/docs/guides/nextjs.mdx) to enhance your frontend with wallet integrations and more advanced blockchain interactions.
