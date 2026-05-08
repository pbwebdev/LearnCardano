---
slug: grocery-list-dapp
type: minidapp
title: "Grocery List DApp"
---

Building a decentralized application (DApp) on Cardano can be both an educational and rewarding experience. This guide walks you through the process of creating a Grocery List DApp, where users can create, manage, and share their grocery lists using Cardano's blockchain capabilities.

### Overview

This DApp will demonstrate how to use smart contracts for managing a grocery list. Users will be able to perform basic operations such as adding, editing, and deleting items. This application will provide a practical introduction to Cardano's smart contract functionality.

### Architecture

The architecture of the Grocery List DApp leverages both on-chain and off-chain components:

- **On-chain**: Uses Aiken for smart contract logic, which ensures the security and correctness of transactions.
- **Off-chain**: Utilizes Haskell and the Cardano CLI for transaction construction, management, and interaction with the blockchain.
- **Frontend**: Built using React and TypeScript to provide a user-friendly interface for interacting with the DApp.

### Key Features

- **Add Item**: Users can add new items to their grocery list.
- **Edit Item**: Users can modify existing items.
- **Delete Item**: Users can remove items from the list.

### Development Process

#### 1. Setting Up the Environment

To start, ensure you have the following tools installed:

- [Cardano CLI](https://github.com/input-output-hk/cardano-node)
- [Aiken Language](https://github.com/aiken-lang/site)
- Node.js and npm for the frontend development

#### 2. Writing Smart Contracts

Using Aiken, you'll write smart contracts that define the logic for adding, editing, and deleting grocery items. The contracts will validate transactions and ensure data integrity on the blockchain.

```aiken
-- Example of a simple contract in Aiken
module GroceryList exposing (..)

import Plutus.V1.Ledger.Api exposing (..)

-- Define the data structure for a grocery item
record GroceryItem =
  { name : String
  , quantity : Int
  }

-- Validator logic for adding an item
validator : Validator
validator =
  mkValidator $ \datum redeemer ctx ->
    -- Your validation logic here
    True
```

#### 3. Off-Chain Logic

The off-chain components handle transaction creation and submission. You'll use Haskell to write scripts that interact with the Cardano blockchain, leveraging the Cardano CLI for transaction management.

#### 4. Frontend Development

Create a user interface using React and TypeScript. The frontend will interact with the off-chain scripts to facilitate user actions such as adding and editing items.

```typescript
// Example React component for adding a grocery item
import React, { useState } from 'react';

const AddItem = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = async () => {
    // Logic to handle submission
  };

  return (
    <div>
      <input value={itemName} onChange={(e) => setItemName(e.target.value)} />
      <input value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
      <button onClick={handleSubmit}>Add Item</button>
    </div>
  );
};

export default AddItem;
```

### Deployment

After completing development, deploy the smart contracts to the Cardano blockchain. Test the DApp on the preview network to ensure all functionalities work as expected.

### Conclusion

The Grocery List DApp is a simple yet powerful example of how decentralized applications can be built on Cardano. By following this guide, you have learned how to leverage Cardano's blockchain technology to manage data securely and efficiently. This foundational knowledge will be invaluable as you explore more complex DApp projects.

For further reading and examples, consider exploring resources such as the [Aiken Gift Card tutorial](https://github.com/aiken-lang/site/blob/main/src/pages/example--gift-card.mdx) for more insights into working with smart contracts on Cardano.
