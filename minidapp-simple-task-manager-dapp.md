---
slug: simple-task-manager-dapp
type: minidapp
title: "Simple Task Manager dApp"
---

Building a decentralized application (dApp) on the Cardano blockchain provides a robust platform for secure and transparent task management. This guide walks you through creating a simple task manager dApp, allowing users to add, update, and delete tasks, with all data stored securely on the blockchain.

### Key Concepts

- **Decentralized Storage**: Utilizes Cardano's blockchain to store task data, ensuring immutability and security.
- **Smart Contracts**: Employs Plutus smart contracts to manage task logic.
- **User Interface**: A simple web interface built with React for interacting with the dApp.

### Architecture Overview

The task manager dApp is structured around the following components:

- **Smart Contracts**: Written in Plutus, these contracts handle the logic for adding, updating, and deleting tasks.
- **Off-chain Code**: Developed using Haskell and Cardano CLI to interact with the blockchain and manage transaction submissions.
- **Frontend**: A React-based web application that provides a user-friendly interface for interacting with the dApp.

### Development Steps

#### 1. Set Up Your Development Environment

Ensure you have the Cardano node and Plutus tools installed. Familiarity with Haskell and smart contract development on Cardano is essential. Refer to the [Cardano Node Wiki](https://github.com/input-output-hk/cardano-node-wiki/blob/main/docs/reference/native-tokens/03-exercises.md) for setup guidance.

#### 2. Develop Smart Contracts

Use Plutus to write the smart contract logic. The contract should define functions for:

- **Adding a Task**: Create a new task entry on the blockchain.
- **Updating a Task**: Modify an existing task.
- **Deleting a Task**: Remove a task from the blockchain.

Here is a basic example of a Plutus contract function:

```haskell
{-# LANGUAGE OverloadedStrings #-}
module TaskManager where

import PlutusTx.Prelude
import Ledger
import Ledger.Constraints as Constraints
import Plutus.Contract

-- Define a simple task data type
data Task = Task {
    taskId :: Integer,
    taskDescription :: BuiltinByteString,
    taskCompleted :: Bool
}

-- Function to add a task
addTask :: Task -> Contract w s Text ()
addTask task = do
    let tx = Constraints.mustPayToTheScript task (lovelaceValueOf 1000)
    ledgerTx <- submitTxConstraints taskScript tx
    awaitTxConfirmed $ getCardanoTxId ledgerTx
    logInfo @String "Task added successfully"

-- Script placeholder
{-# INLINABLE taskScript #-}
taskScript :: Validator
```

#### 3. Implement Off-Chain Code

Use Haskell and Cardano CLI to write the off-chain code that interacts with the blockchain. This code handles task transactions, sending them to the blockchain, and retrieving task data.

#### 4. Build the Frontend

Create a React application to serve as the user interface. This app should allow users to:

- Add new tasks.
- View existing tasks.
- Update or delete tasks.

Example React component for adding a task:

```javascript
import React, { useState } from 'react';

function AddTask({ onAdd }) {
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(description);
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task Description"
                required
            />
            <button type="submit">Add Task</button>
        </form>
    );
}

export default AddTask;
```

### Testing and Deployment

After completing the development, thoroughly test the dApp on a testnet to ensure all functionality works as expected. Use the Cardano CLI for deploying smart contracts and managing transactions.

### Conclusion

This simple task manager dApp demonstrates the power of using Cardano's blockchain for decentralized applications. By leveraging smart contracts and a robust frontend, users can manage their tasks with security and transparency. For further reading and examples, explore the [Cardano documentation](https://github.com/input-output-hk/cardano-node-wiki/blob/main/docs/reference/native-tokens/03-exercises.md).
