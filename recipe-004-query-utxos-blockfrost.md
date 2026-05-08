---
slug: query-utxos-blockfrost
title: Query UTxOs and on-chain data with Blockfrost
stack: [blockfrost]
category: [infrastructure]
difficulty: beginner
audience: [evm-migrant, total-beginner]
est_time_minutes: 15
last_verified: 2025-11-01
cardano_era: conway
ai_ready: true
video_url: ""
github_url: https://github.com/pbwebdev/LearnCardano/recipe-query-utxos-blockfrost
sandbox_url: ""
demo_url: ""
prerequisites:
  - Node.js 18+ installed
  - Blockfrost API key (any network)
  - Understanding of what a UTxO is (see concept: utxo-model-vs-accounts)
learning_outcomes:
  - Fetch UTxOs at an address using the Blockfrost REST API
  - Parse token balances from UTxO data
  - Understand pagination and why Blockfrost returns results in pages
  - Know when to use Blockfrost vs Koios vs Ogmios
related_pitfalls:
  - blockfrost-rate-limits
  - pagination-missed-utxos
related_concepts:
  - utxo-model-vs-accounts
  - native-assets-on-cardano
related_recipes:
  - query-utxos-koios
  - watch-address-ogmios
---

Use the Blockfrost REST API to fetch all UTxOs at a Cardano address, parse ADA and native token balances, and handle pagination. This is the foundation of almost every Cardano DApp's off-chain logic.

## Background: reading state on Cardano

On Ethereum, you call view functions on a contract to read state (`balanceOf`, `ownerOf`, etc.). On Cardano, **there is no contract state** — all value lives in UTxOs. Reading "state" means querying UTxOs at relevant addresses.

The three main ways to read UTxO data:

| Tool | Best for | Tradeoff |
|------|----------|----------|
| **Blockfrost** | Most DApps — hosted, REST API, SDKs | Rate limits; depends on Blockfrost uptime |
| **Koios** | Decentralised alternative to Blockfrost | Slightly less consistent, community-run |
| **Ogmios** | Real-time subscriptions, local node | Requires running your own node |

Start with Blockfrost. Migrate to Koios or self-hosted when you need decentralisation or higher throughput.

## Code

### 1. Install the Blockfrost SDK

```bash
npm install @blockfrost/blockfrost-js
```

### 2. Fetch UTxOs at an address

```typescript
import { BlockFrostAPI } from "@blockfrost/blockfrost-js";

const api = new BlockFrostAPI({
  projectId: process.env.BLOCKFROST_KEY!, // "mainnetXXX", "previewXXX", etc.
  network: "preview", // matches your project's network
});

async function getUtxos(address: string) {
  // Blockfrost paginates — page 1, 100 results per page by default
  const utxos = await api.addressesUtxosAll(address);
  // addressesUtxosAll handles pagination automatically — fetches all pages
  return utxos;
}

const address = "addr_test1qz..."; // your address
const utxos = await getUtxos(address);
console.log(`Found ${utxos.length} UTxOs`);
```

### 3. Calculate total ADA balance

```typescript
function lovelaceToAda(lovelace: string): number {
  return parseInt(lovelace) / 1_000_000;
}

function getAdaBalance(utxos: Awaited<ReturnType<typeof getUtxos>>): number {
  return utxos.reduce((total, utxo) => {
    const lovelace = utxo.amount.find((a) => a.unit === "lovelace");
    return total + (lovelace ? parseInt(lovelace.quantity) : 0);
  }, 0) / 1_000_000;
}

console.log("ADA balance:", getAdaBalance(utxos));
```

### 4. Parse native token balances

```typescript
type TokenBalance = { unit: string; policyId: string; assetName: string; quantity: bigint };

function getTokenBalances(utxos: Awaited<ReturnType<typeof getUtxos>>): TokenBalance[] {
  const balances = new Map<string, bigint>();

  for (const utxo of utxos) {
    for (const amount of utxo.amount) {
      if (amount.unit === "lovelace") continue;
      const current = balances.get(amount.unit) ?? 0n;
      balances.set(amount.unit, current + BigInt(amount.quantity));
    }
  }

  return Array.from(balances.entries()).map(([unit, quantity]) => ({
    unit,
    policyId: unit.slice(0, 56),   // first 56 hex chars = policy ID
    assetName: unit.slice(56),      // remainder = asset name (hex)
    quantity,
  }));
}

const tokens = getTokenBalances(utxos);
console.log("Tokens:", tokens);
```

### 5. Fetch a specific UTxO (for script interactions)

When you need to spend a specific UTxO in a smart contract transaction, fetch it by its txHash and index:

```typescript
async function getUtxo(txHash: string, outputIndex: number) {
  const tx = await api.txsUtxos(txHash);
  return tx.outputs.find((o) => o.output_index === outputIndex);
}
```

### 6. Handle pagination manually (if needed)

`addressesUtxosAll` is convenient but fetches everything at once. For addresses with thousands of UTxOs, page manually to avoid timeouts:

```typescript
async function getUtxosPaged(address: string, page = 1): Promise<any[]> {
  const results = [];
  while (true) {
    const batch = await api.addressesUtxos(address, { page, count: 100 });
    results.push(...batch);
    if (batch.length < 100) break; // last page
    page++;
  }
  return results;
}
```

## When to use which indexer

- **Blockfrost** — default choice for most projects. Free tier is generous (50k requests/day). Use until you hit limits.
- **Koios** — decentralised, no API key needed, community-run. Good fallback or if you want to avoid Blockfrost dependency. Slightly less consistent SLA.
- **Ogmios + Kupo** — run your own. Full control, no rate limits, real-time chain-following. Required for production DApps handling high transaction volumes.
- **DB-Sync** — SQL database of the full chain history. Best for analytics and complex queries. Overkill for most DApps.

## AI prompt bundle

**System prompt:**
```
You are building Cardano off-chain data fetching using the Blockfrost SDK (@blockfrost/blockfrost-js).
The network is preview testnet unless specified. Use addressesUtxosAll for simple queries.
For production, switch to manual pagination with addressesUtxos to handle large address histories.
Native asset units are 56-char policyId + hex assetName concatenated.
Lovelace is the base unit (1 ADA = 1,000,000 lovelace). Always use BigInt for token quantities.
```

**Starter prompt:**
```
Extend this to:
1. Watch an address for new UTxOs arriving (poll every 20 seconds)
2. Emit an event when a new UTxO appears containing a specific policy ID
3. Add a simple in-memory cache to avoid re-processing seen UTxOs
```

**Context files:** `query.ts`, `types.ts`
