Mesh for DApp builders, Evolution for wallet/exchange/infrastructure builders. Mesh prioritises developer experience with high-level helpers and React components; Evolution prioritises composability and control. They're not competitors — they target different layers. Most projects only need Mesh.

## Why this comparison matters

Both SDKs are TypeScript, both run in Node.js or the browser, both can build any Cardano transaction the protocol supports. So why are there two?

The short answer: they were built by different teams to solve different problems. MeshJS started as a community project focused on making DApps approachable. Evolution (formerly cardano-js-sdk) was built by IOG and the Cardano Foundation to power production wallets and infrastructure. Both have grown into general-purpose libraries, but they retain the design philosophy of their origins.

You can technically use either for any task. In practice, the friction is very different.

## Quick framing

| If you're building... | Use |
|---|---|
| An NFT marketplace, DEX UI, governance dashboard | Mesh |
| A custodial exchange backend, wallet app, indexer | Evolution |
| A hackathon project | Mesh |
| Something you're not sure about | Start with Mesh; switch later if you need to |

## Decision tree

1. **Does your project have a user-facing frontend with wallet connection?** → Almost always Mesh.
2. **Are you building a wallet, an exchange integration, or backend infrastructure?** → Evolution.
3. **Are you teaching Cardano dev or writing tutorials?** → Mesh (lower friction for readers).
4. **Do you need direct control over UTxO selection algorithms?** → Evolution.
5. **Do you care about minimising peer-dependency complexity?** → Mesh (single package vs Evolution's monorepo).

## What you can't do with one but can with the other

**Things Mesh makes easy but Evolution requires more code:**

- React component for wallet connection (`<CardanoWallet />`)
- High-level minting helpers (`tx.mintAsset(...)`)
- Quick wallet-creation from a mnemonic without configuring key agents
- Tutorial-grade examples that fit on one page

**Things Evolution makes easy but Mesh hides:**

- Pluggable UTxO selection algorithms (you can write your own)
- Direct provider abstraction — swap Blockfrost ↔ Ogmios ↔ Kupo without changing tx code
- Custom signing flows (hardware wallets, threshold signing, MPC)
- Chain-following with stateful sync (used by wallets to track balances)
- Full wallet lifecycle (PersonalWallet manages tx history, balance tracking automatically)

If your project needs anything from the second list, Evolution is the right pick. If not, Mesh saves you significant time.

## Common misconceptions

- **"Mesh is amateur, Evolution is professional"** — false. Mesh is used in production by NFT marketplaces, DEXs, and the majority of new Cardano DApps. The design difference isn't quality — it's audience.

- **"Evolution is faster because it's lower-level"** — performance is similar for the same transaction. The "speed" difference is dev time, not runtime.

- **"You should use both"** — you can, but you usually shouldn't. They have overlapping concepts (transaction builders, providers) that work differently. Pick one and stick with it.

- **"Evolution is harder to use, so it must be more powerful"** — somewhat true. It exposes more knobs. But for typical DApp work, those knobs are unnecessary complexity.

## Migration path

If you start with Mesh and outgrow it (rare but possible — usually for wallet-grade reliability needs), migrating to Evolution is mostly a transaction-builder rewrite. Your validators and on-chain code don't change. Your provider config (Blockfrost API key) stays the same. Plan for ~1-2 weeks per developer for a moderate codebase.

Migrating in the other direction (Evolution → Mesh) is uncommon — usually the project's needs grow rather than shrink.

## When to revisit this decision

- **You hit a Mesh limitation** — file an issue first; the team is responsive and the API surface keeps growing
- **Your project becomes wallet-grade** — meaning users trust it with their seed phrase and you need bulletproof reliability; Evolution is built for this
- **You need to support a non-standard wallet flow** — hardware wallets, MPC, custodial signing

## Other comparisons worth reading alongside

- Aiken vs Plutus vs Plutarch (validator language choice — independent of off-chain SDK)
- Blockfrost vs Koios vs Ogmios (provider choice — applies to either SDK)

## Sources

- Mesh: https://meshjs.dev
- Evolution: https://github.com/input-output-hk/cardano-js-sdk
