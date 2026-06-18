---
slug: simple-recipe-sharing-dapp
type: minidapp
title: "Simple Recipe Sharing DApp"
---

In this guide, we'll walk through building a Simple Recipe Sharing DApp on the Cardano blockchain. This application allows users to submit, browse, and rate recipes in a decentralized manner, fostering a community of food enthusiasts.

## Architecture Overview

The application is built using Plutus smart contracts for on-chain logic, ensuring that recipe submissions and ratings are securely stored on the blockchain. The off-chain components are developed using Node.js and Express.js, providing the backend logic and API endpoints. The frontend is crafted with React and TypeScript, offering a responsive and interactive user experience.

## Setting Up the Development Environment

To begin developing this dApp, ensure you have the following prerequisites:

- Node.js and npm installed on your machine.
- A Cardano node or access to a Cardano testnet.
- Familiarity with Plutus and TypeScript.

### Step 1: Clone the Repository

Start by cloning the GitHub repository:

```bash
git clone https://github.com/example/simple-recipe-sharing-dapp.git
cd simple-recipe-sharing-dapp
```

### Step 2: Install Dependencies

Navigate to the project directory and install the necessary dependencies:

```bash
npm install
```

### Step 3: Configure the Cardano Node

Ensure that your Cardano node is running and configured correctly. You can connect to the Cardano preview network for testing purposes. Refer to the [Cardano Developer Portal](https://github.com/cardano-foundation/developer-portal) for detailed instructions on setting up a test environment.

## Developing the Smart Contracts

The heart of this dApp lies in its smart contracts, written in Plutus. These contracts manage the submission and rating of recipes.

### Recipe Submission Contract

The submission contract verifies the authenticity of the recipe and stores it on the blockchain. Here's a simplified version of the contract:

```haskell
module Recipes where

import PlutusTx.Prelude
import Plutus.Contract

submitRecipe :: Recipe -> Contract w s Text ()
submitRecipe recipe = do
  -- Logic for submitting a recipe
  logInfo @String "Recipe submitted successfully"
```

### Recipe Rating Contract

Similarly, the rating contract allows users to rate existing recipes:

```haskell
rateRecipe :: RecipeId -> Rating -> Contract w s Text ()
rateRecipe recipeId rating = do
  -- Logic for rating a recipe
  logInfo @String "Recipe rated successfully"
```

## Building the Backend API

The backend is developed using Node.js and Express.js. It provides endpoints for interacting with the blockchain and managing user sessions.

### Key API Endpoints

- **POST /api/recipes**: Submits a new recipe to the blockchain.
- **GET /api/recipes**: Retrieves a list of all recipes.
- **POST /api/recipes/:id/rate**: Rates a specific recipe.

Here’s an example of an API endpoint implementation:

```javascript
app.post('/api/recipes', async (req, res) => {
  const recipe = req.body;
  // Logic to submit recipe to blockchain
  res.status(200).send({ message: 'Recipe submitted successfully' });
});
```

## Crafting the Frontend

The frontend, built with React and TypeScript, provides a user-friendly interface for interacting with the dApp.

### Key Components

- **RecipeList**: Displays all submitted recipes.
- **RecipeForm**: Allows users to submit new recipes.
- **RatingSystem**: Enables users to rate recipes.

Here’s a snippet of the RecipeList component:

```typescript
import React from 'react';

const RecipeList: React.FC = () => {
  // Logic to fetch and display recipes
  return (
    <div>
      <h1>Recipe List</h1>
      {/* Render recipes here */}
    </div>
  );
};

export default RecipeList;
```

## Testing and Deployment

Once development is complete, thoroughly test the application using the Cardano preview testnet. Ensure all transactions are processed correctly and the UI functions as expected.

Deploy the application by hosting the frontend and backend on a cloud provider of your choice, ensuring scalability and reliability.

## Conclusion

The Simple Recipe Sharing DApp demonstrates how Cardano's blockchain can be leveraged to create a decentralized platform for sharing culinary creations. By following this guide, developers can build a secure, scalable, and engaging application that brings food enthusiasts together in a unique way. For further development and optimizations, explore the [Mesh SDK Use Cases](https://github.com/MeshJS/meshjs.dev/blob/main/content/docs/resources/use-cases.mdx) and Cardano's [Developer Portal](https://github.com/cardano-foundation/developer-portal).
