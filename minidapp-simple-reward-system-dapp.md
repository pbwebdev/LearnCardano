---
slug: simple-reward-system-dapp
type: minidapp
title: "Simple Reward System dApp"
---

In this tutorial, you'll learn how to build a simple reward system decentralized application (dApp) on the Cardano blockchain. This dApp will allow users to earn rewards for completing tasks or participating in activities, integrating smart contracts and user interactions.

### Overview

Cardano enables the development of decentralized applications (dApps) that can perform various functions, including reward systems. By leveraging Cardano's smart contract capabilities, you can create applications that operate on a trustless, decentralized network.

This tutorial will guide you through the steps needed to build a basic reward system using Aiken for on-chain logic, a Haskell-based backend, and a React frontend. We'll cover the following components:

- **Smart Contracts**: To handle the logic of task completion and reward distribution.
- **Backend Services**: To interact with the blockchain and manage user data.
- **Frontend Application**: To provide a user interface for task management and reward tracking.

### Prerequisites

Before you begin, ensure you have the following:

- Basic understanding of blockchain technology and the Cardano ecosystem.
- Familiarity with smart contracts, particularly on Cardano.
- Development environment set up with Node.js, Haskell, and the Cardano CLI.

### Setting Up the Smart Contract

For the on-chain component, we'll use Aiken to write the smart contract. This contract will manage tasks and rewards.

```aiken
module RewardSystem

-- Define task structure
record Task =
  { id : Int
  , description : String
  , completed : Bool
  }

-- Define reward structure
record Reward =
  { taskId : Int
  , amount : Int
  }

-- Logic to mark a task as completed and issue rewards
func completeTask(taskId : Int, tasks : List Task) : List Task =
  List.map (fun task -> if task.id == taskId then { task | completed = True } else task) tasks
```

### Backend Setup

The backend will be responsible for:

- Interacting with the Cardano blockchain using the Cardano CLI.
- Managing user data and task states.

Using Haskell, create a simple backend service that listens for task completion events and triggers the smart contract to issue rewards.

```haskell
module Main where

import Cardano.Api

-- Function to listen for task completion and issue rewards
listenAndReward :: IO ()
listenAndReward = do
  -- Logic to interact with the blockchain
  putStrLn "Listening for task completion..."
```

### Frontend Application

The frontend will be built using React and TypeScript. It will provide a user interface for users to view tasks, complete them, and see their rewards.

```typescript
import React from 'react';

const TaskComponent: React.FC = () => {
  // State and logic for managing tasks
  return (
    <div>
      <h1>Task List</h1>
      {/* Render tasks and completion button */}
    </div>
  );
};

export default TaskComponent;
```

### Deployment and Testing

After developing the components, deploy the smart contract on the Cardano testnet. Use the Cardano CLI to submit transactions that interact with the contract.

- **Test the dApp**: Ensure tasks can be completed and rewards issued.
- **Debug and iterate**: Use logs and transaction metadata to troubleshoot any issues.

### Conclusion

Building a reward system dApp on Cardano involves integrating smart contracts with backend services and a user-friendly frontend. By following this guide, you should have a basic understanding of how to create a decentralized reward system that leverages the capabilities of the Cardano blockchain.

For further reading and resources, check out the [Cardano Developer Portal](https://github.com/cardano-foundation/developer-portal/blob/main/docs/get-started/overview.md) and explore the [Aiken examples](https://github.com/aiken-lang/site/blob/main/src/pages/example--gift-card.mdx) for more advanced use cases.
