---
slug: 010-query-token-balance-blockfrost
type: recipe
title: "Query Token Balance with Blockfrost"
---

In this tutorial, we will explore how to query the token balance of a specific wallet on the Cardano blockchain using the Blockfrost API. Blockfrost provides a convenient way to interact with the Cardano blockchain through RESTful APIs.

## Prerequisites

Before we start, ensure you have the following:

- **Blockfrost API Key**: Sign up at [Blockfrost.io](https://blockfrost.io) to obtain a free API key.
- **Node.js Installed**: Ensure you have Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).
- **Basic Understanding of Cardano**: Familiarity with blockchain concepts and Cardano's architecture.
- **Wallet Information**: The address and mnemonic of the wallet whose balance you wish to query.

## Setting Up Your Environment

1. **Install Dependencies**: Start by creating a new Node.js project and installing necessary packages:

   ```bash
   mkdir cardano-balance-query
   cd cardano-balance-query
   npm init -y
   npm install axios dotenv
   ```

   - `axios` will be used to make HTTP requests to the Blockfrost API.
   - `dotenv` allows us to manage environment variables easily.

2. **Environment Variables**:

   Create a `.env` file in your project root to store your Blockfrost API key and wallet mnemonic:

   ```
   BLOCKFROST_API_KEY=your_blockfrost_api_key
   WALLET_MNEMONIC=your_wallet_mnemonic
   ```

## Querying the Token Balance

Now, let's write the script to query the token balance:

1. **Create a JavaScript File**:

   Create a file named `queryBalance.js` and add the following code:

   ```javascript
   require('dotenv').config();
   const axios = require('axios');

   const baseUrl = 'https://cardano-mainnet.blockfrost.io/api/v0';
   const projectId = process.env.BLOCKFROST_API_KEY;

   async function getTokenBalance(address) {
     try {
       const response = await axios.get(`${baseUrl}/addresses/${address}`, {
         headers: {
           project_id: projectId
         }
       });

       console.log('Token Balance:', response.data.amount);
     } catch (error) {
       console.error('Error fetching balance:', error);
     }
   }

   // Replace with your wallet address
   const walletAddress = 'your_wallet_address_here';
   getTokenBalance(walletAddress);
   ```

2. **Run the Script**:

   Execute the script using Node.js:

   ```bash
   node queryBalance.js
   ```

   This will output the token balance for the specified wallet address.

## Key Points

- **Blockfrost API**: Provides a simple interface to interact with Cardano blockchain data.
- **Authentication**: Always use your API key securely and avoid hardcoding it into your source files.
- **Handling Responses**: Blockfrost returns data in JSON format, which you can parse and use as needed.

## Conclusion

Using Blockfrost API, you can efficiently query the token balance of any wallet on the Cardano blockchain. This is particularly useful for developers building applications that need to display or analyse blockchain data. For further exploration, you can look into additional endpoints provided by Blockfrost to gather more comprehensive data about transactions, metadata, and more.

For more detailed information, refer to the [Blockfrost documentation](https://blockfrost.io/docs).
