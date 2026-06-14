---
slug: 014-query-nft-metadata-blockfrost
type: recipe
title: "Query NFT Metadata with Blockfrost"
---

In this recipe, we'll explore how to query metadata for NFTs on the Cardano blockchain using the Blockfrost API. Blockfrost provides a seamless way to interact with the Cardano blockchain without needing to manage the infrastructure yourself. By the end of this guide, you'll be able to retrieve NFT details using their policy and asset identifiers.

## Prerequisites

Before diving into the code, make sure you have the following:

- **Blockfrost API Key**: You need to sign up at [Blockfrost.io](https://blockfrost.io) to get an API key.
- **Basic understanding of REST APIs**: Familiarity with making HTTP requests.
- **Familiarity with Cardano's NFT structure**: Understanding of how NFTs are represented on Cardano, including policy IDs and asset names.
- **Node.js installed**: We will use Node.js to run our scripts.

## Understanding Cardano NFTs

On the Cardano blockchain, NFTs are identified by a combination of a policy ID and an asset name. Each NFT's metadata is stored on-chain and can be accessed using this unique identifier pair.

## Setting Up Your Environment

1. **Install Node.js**: If you haven't already, download and install Node.js from [nodejs.org](https://nodejs.org/).

2. **Initialize Your Project**:
   ```bash
   mkdir cardano-nft-query
   cd cardano-nft-query
   npm init -y
   npm install axios
   ```
   We will use `axios` to make HTTP requests to the Blockfrost API.

## Querying NFT Metadata

Here's a step-by-step guide to querying NFT metadata from the Cardano blockchain using the Blockfrost API.

### Step 1: Create a Script to Query Metadata

Create a new file named `queryMetadata.js`:

```javascript
const axios = require('axios');

const API_KEY = 'your_blockfrost_api_key';
const POLICY_ID = 'your_policy_id';
const ASSET_NAME = 'your_asset_name';

async function getNftMetadata() {
  try {
    const response = await axios.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${POLICY_ID}${ASSET_NAME}`, {
      headers: {
        'project_id': API_KEY
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching metadata:', error.response ? error.response.data : error.message);
  }
}

getNftMetadata();
```

### Step 2: Run the Script

Execute the script to retrieve your NFT's metadata:

```bash
node queryMetadata.js
```

If your setup is correct and the identifiers are valid, you should see the metadata for your NFT printed to the console.

## Understanding the Output

The data returned from Blockfrost includes detailed information about the NFT, such as:

- **Asset Name**: The unique name of the NFT.
- **Policy ID**: The identifier for the policy under which the NFT was minted.
- **Metadata**: CIP-25 metadata, which typically includes properties like `name`, `image`, `description`, etc.

## Conclusion

Using the Blockfrost API, you can easily access detailed metadata for any NFT on the Cardano blockchain. This capability is particularly useful for developers building applications that need to display or interact with NFT data. For more detailed information on Blockfrost and its capabilities, refer to the [Blockfrost Development Hub](https://blockfrost.dev/).

For further reading, you might want to explore related recipes like querying UTXOs with Blockfrost or checking token balances using the same API.
