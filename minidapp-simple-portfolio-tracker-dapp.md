---
slug: simple-portfolio-tracker-dapp
type: minidapp
title: "Simple Portfolio Tracker DApp"
---

Building a portfolio tracker as a decentralized application (dApp) on the Cardano blockchain provides users with a secure and transparent way to track their cryptocurrency holdings. This guide will walk you through creating a simple portfolio tracker dApp using the Evolution SDK and Blockfrost API.

### Why a Portfolio Tracker?
Cryptocurrency investors often hold assets across multiple wallets and platforms. A portfolio tracker dApp simplifies the process of monitoring these assets, providing a consolidated view of holdings, values, and performance over time.

### Architecture Overview
The Simple Portfolio Tracker dApp is composed of:

- **Backend Service:** Utilizes Node.js and Express to interact with the Cardano blockchain via the Evolution SDK and Blockfrost API.
- **Frontend Application:** Built with React and TypeScript, providing a user-friendly interface for displaying portfolio data.
- **Data Layer:** Fetches UTXO data from Cardano addresses to calculate current holdings and values.

### Getting Started

#### Prerequisites
- A working knowledge of JavaScript/TypeScript and React.
- Familiarity with blockchain concepts and the Cardano ecosystem.
- Access to a Blockfrost API key.

#### Setting Up the Backend
1. **Initialize the Project**
   
   Start by setting up a new Node.js project:
   
   ```bash
   mkdir portfolio-tracker-dapp
   cd portfolio-tracker-dapp
   npm init -y
   npm install express @evolution-sdk/evolution dotenv
   ```

2. **Configure Environment Variables**
   
   Create a `.env` file to store your Blockfrost API key:
   
   ```dotenv
   BLOCKFROST_PROJECT_ID=your_blockfrost_project_id
   ```

3. **Implement the Portfolio Tracker Logic**
   
   Use the Evolution SDK to retrieve and process wallet data:
   
   ```typescript
   import { Address, Client } from "@evolution-sdk/evolution";
   import express from "express";
   import dotenv from "dotenv";
   
   dotenv.config();
   
   const app = express();
   const client = Client.make(mainnet).withBlockfrost({
     baseUrl: "https://cardano-mainnet.blockfrost.io/api/v0",
     projectId: process.env.BLOCKFROST_PROJECT_ID!
   });
   
   app.get("/portfolio", async (req, res) => {
     const addresses = req.query.addresses.split(",");
     const portfolio = await trackPortfolio(addresses);
     res.json(portfolio);
   });
   
   async function trackPortfolio(addressesBech32: string[]): Promise<any> {
     // Logic to fetch and calculate portfolio data
   }
   
   app.listen(3000, () => {
     console.log("Server running on port 3000");
   });
   ```

#### Setting Up the Frontend
1. **Create a React Application**
   
   Use Create React App to bootstrap your frontend:
   
   ```bash
   npx create-react-app portfolio-tracker-ui --template typescript
   cd portfolio-tracker-ui
   npm install axios
   ```

2. **Implement the User Interface**
   
   Create a component to fetch and display portfolio data:
   
   ```typescript
   import React, { useState } from 'react';
   import axios from 'axios';
   
   const PortfolioTracker = () => {
     const [addresses, setAddresses] = useState("");
     const [portfolio, setPortfolio] = useState(null);
     
     const fetchPortfolio = async () => {
       const response = await axios.get(`/portfolio?addresses=${addresses}`);
       setPortfolio(response.data);
     };
     
     return (
       <div>
         <h1>Portfolio Tracker</h1>
         <input
           type="text"
           value={addresses}
           onChange={(e) => setAddresses(e.target.value)}
           placeholder="Enter addresses separated by commas"
         />
         <button onClick={fetchPortfolio}>Track Portfolio</button>
         {portfolio && (
           <div>
             {/* Render portfolio details here */}
           </div>
         )}
       </div>
     );
   };
   
   export default PortfolioTracker;
   ```

### Deploying the dApp

For deployment, consider using platforms like Vercel or Netlify for the frontend and Heroku or AWS for the backend. Ensure that your environment variables are securely managed and your application is optimised for production.

### Conclusion
This simple portfolio tracker dApp demonstrates a practical use of the Cardano blockchain for managing cryptocurrency holdings. By leveraging the Evolution SDK and Blockfrost API, developers can build robust and scalable dApps tailored to user needs.

For more detailed examples and advanced use cases, refer to the [Cardano Developer Portal](https://github.com/cardano-foundation/developer-portal) and [Evolution SDK documentation](https://github.com/IntersectMBO/evolution-sdk).
