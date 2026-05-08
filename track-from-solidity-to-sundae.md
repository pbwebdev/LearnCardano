A guided path for Solidity / Ethereum developers to become productive Cardano developers in roughly a working day. Starts with mental-model adjustments (UTxOs vs accounts, validators vs contracts), works through hands-on recipes building real things, flags the common pitfalls, and ends with a capstone DApp you can show off.

## Who this track is for

You've shipped at least one Solidity contract or interacted seriously with Ethereum dev tools (Hardhat, Foundry, ethers.js). You're comfortable with TypeScript. You don't need to know Haskell, functional programming, or anything Cardano-specific yet — that's what this track is for.

If you've never written a smart contract before, start with the "Build Your First DApp" track instead. This one assumes you know the EVM patterns you're being asked to forget.

## Why this track exists

The biggest barrier to EVM devs adopting Cardano isn't tooling — it's the mental model. The eUTxO model breaks Solidity intuitions in ways that aren't always obvious until you hit them. A dev coming over without explicit unlearning tends to:

1. Try to update state inside the validator (you can't)
2. Hard-code lovelace amounts on outputs containing tokens (you'll hit min-ADA errors)
3. Forget the validity interval on time-aware contracts (silent failure, costs collateral)
4. Build a single-UTxO contract and wonder why concurrent users fail (you need to split state)

This track tackles those head-on, in the order they tend to bite.

## How long will it take

Roughly 8 working hours, spread however suits you. Some devs power through in one weekend day; others spread it over a week. The track is structured so you can pause after any step.

| Phase | Time | Steps |
|---|---|---|
| Mental models (concepts) | ~1.5h | UTxO model → Validators are predicates → Datums and redeemers |
| Hands-on basics (recipes) | ~2h | Query UTxOs → Mint NFT → Token gating → CIP-8 signing |
| Smart contracts (recipes + pitfalls) | ~3h | Vesting validator → Aiken tests → Reference scripts → 3 pitfalls |
| Capstone (mini-DApp) | ~1.5h | Read and run the NFT minter mini-DApp |

## What you'll be able to do at the end

- Explain the eUTxO model and why it requires different design patterns from EVM
- Read and write a basic Aiken validator with unit tests
- Build off-chain code with Mesh SDK that constructs, signs, and submits transactions
- Connect a Cardano wallet and request CIP-8 message signatures for auth
- Mint and gate access to NFTs
- Debug the most common categories of failure: min-ADA, validity intervals, collateral
- Ship a working mini-DApp end-to-end on preview testnet

You won't be a Cardano expert at the end. You'll be at the stage where you can read most Cardano dev content without needing a glossary, and you can build from scratch with confidence on the basics.

## Track structure (annotated)

The 14 steps in the sidebar follow this logic:

**Steps 1-3 — Concepts (no code yet).** Read these first. They take ~30 minutes each and they're the difference between fighting the eUTxO model and working with it. Don't skip.

**Step 4 — Query UTxOs with Blockfrost.** First hands-on. You'll see what UTxOs actually look like in JSON. Concrete grounds the abstract.

**Steps 5-6 — Mint your first NFT, with the min-ADA pitfall right after.** You'll hit the pitfall the first time you try, then fix it. The pitfall is sequenced right after so the lesson sticks.

**Steps 7-8 — Token gating + CIP-8 signing.** Real DApp patterns that don't require a smart contract. These build confidence with the wallet/SDK layer before you go on-chain.

**Steps 9-11 — Vesting validator + the two pitfalls it tends to trigger.** First real validator. Validity intervals and collateral both matter here, and the pitfalls explain why your tx may silently fail.

**Step 12 — Aiken tests.** Now that you've written a validator, learn how to test it properly. Tests in Aiken are inline and use a built-in `test` keyword.

**Step 13 — Reference scripts.** Production technique, fee optimisation. Worth knowing before you ship.

**Step 14 — Capstone DApp.** Read the NFT minter end-to-end. Everything you've learned should now read as familiar.

## What's deliberately not covered

This track is intentionally narrow:

- **No DeFi-specific patterns** (AMMs, lending, oracles) — those need their own track
- **No governance / DRep / Conway-era topics** — separate concern, evolving fast
- **No Hydra or Layer 2** — start with L1 first
- **No Plutus or Plutarch** — Aiken is the most beginner-friendly choice; switch later if needed
- **No Evolution SDK** — Mesh first; Evolution comparison covered separately

The goal is the shortest path to "I can build a Cardano DApp," not "I know everything about Cardano."

## Prerequisites

- Node.js 18+ installed
- A Cardano browser wallet (Lace, Eternl, Yoroi) — install before starting
- Some preview testnet ADA from the [preview faucet](https://faucet.preview.world.dev.cardano.org)
- A free Blockfrost account with a preview-network project key
- Familiarity with TypeScript and one frontend framework (Next.js used in examples, but transferable)

## Tips for getting through it

- **Run the code, don't just read it.** The recipes include working examples on GitHub. Clone, run, modify. Reading without running won't give you the muscle memory.
- **Pause at the pitfalls.** They're the lessons. Don't skim past them — read the symptoms, the cause, the fix, then go back and check whether your own code handles them.
- **Look at Cardanoscan.** When your transactions land on preview, click through to Cardanoscan and look at the inputs, outputs, datums, and metadata. Seeing the chain artifact makes the abstract concrete.
- **Ask in the Aiken Discord** if you get stuck. The community is unusually helpful.

## After this track

Suggested next steps:

- The "Production Patterns" track (intermediate) — concurrency, indexing, audit-readiness
- A specific topic deep-dive: DeFi on Cardano, governance, or Hydra
- Build something of your own. The fastest way to consolidate is to ship a thing.
