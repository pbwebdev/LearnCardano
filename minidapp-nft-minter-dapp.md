A complete one-page Next.js DApp that lets a user connect a Cardano wallet, upload an image to IPFS, fill in NFT metadata, and mint a CIP-25 NFT under a one-shot policy. Designed as the canonical "hello world" — every Cardano dev should be able to read this end-to-end in under an hour.

## What you'll see when you run it

1. Land on the page → "Connect wallet" button using Mesh's `<CardanoWallet />` component
2. Connect Eternl/Lace/Nami → wallet shows balance, address
3. Click "Mint NFT" → form appears: name, description, image upload, optional attributes
4. Upload image → frontend calls `/api/pin` which forwards to Pinata IPFS
5. Submit → frontend builds the minting transaction with Mesh, attaches CIP-25 metadata at label 721
6. Wallet pops up to sign → signed tx submits to preview testnet
7. Success screen shows tx hash, link to Cardanoscan, and the new NFT's policy ID + asset name

## Architecture in one diagram

```
┌─────────────────────────────────────────────────┐
│  Next.js 14 App Router (frontend)               │
│  ┌──────────────────┐  ┌─────────────────────┐  │
│  │ <CardanoWallet/> │  │ MintForm component  │  │
│  │ from @meshsdk/   │  │ - Image upload      │  │
│  │ react            │  │ - Metadata fields   │  │
│  └──────────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────┘
              │                       │
              ▼                       ▼
   ┌──────────────────┐    ┌──────────────────────┐
   │ Wallet (CIP-30)  │    │ /api/pin (Next.js)   │
   │ Lace, Eternl,    │    │ Forwards to Pinata   │
   │ Nami, Yoroi      │    │ Returns IPFS hash    │
   └──────────────────┘    └──────────────────────┘
              │
              ▼
   ┌──────────────────────────────────────────────┐
   │ BlockfrostProvider                           │
   │ - Fetches UTxOs                              │
   │ - Submits signed transaction                 │
   └──────────────────────────────────────────────┘
              │
              ▼
   ┌──────────────────────────────────────────────┐
   │ Cardano preview testnet                      │
   │ Native script (one-shot minting policy)      │
   └──────────────────────────────────────────────┘
```

## Why a one-shot policy

The minting policy is parameterised by a UTxO. Once that UTxO is consumed (which happens in the minting transaction itself), the policy can never mint again — guaranteeing every NFT minted under this policy is unique. This is the simplest pattern that satisfies CIP-25's "true NFT" requirement (quantity 1, never-recurring policy).

If you wanted a series (e.g. 1,000 NFTs in a collection), you'd parameterise differently — typically a time-locked policy that expires after the mint window, or a signature-based policy gated by a known key. The repo has a `examples/series-mint/` branch demonstrating that variant.

## File layout

```
dapps/nft-minter/
├── app/
│   ├── layout.tsx              # MeshProvider wrap
│   ├── page.tsx                # Main mint UI
│   └── api/
│       └── pin/route.ts        # IPFS upload (Pinata API key server-side)
├── components/
│   ├── MintForm.tsx
│   ├── ConnectButton.tsx
│   └── SuccessCard.tsx
├── lib/
│   ├── mint.ts                 # Mesh transaction builder
│   ├── pinata.ts               # IPFS helpers
│   └── metadata.ts             # CIP-25 builders + validators
├── README.md
└── package.json
```

`lib/mint.ts` is the heart of it — about 80 lines, including comments. Everything else is presentation.

## Running it locally

```bash
git clone https://github.com/pbwebdev/LearnCardano.git
cd LearnCardano/dapps/nft-minter
cp .env.example .env.local
# Edit .env.local with your Blockfrost preview key + Pinata JWT
npm install
npm run dev
```

Make sure your wallet is on preview testnet and has some test ADA from the [preview faucet](https://faucet.preview.world.dev.cardano.org).

## What this teaches

Reading this end-to-end teaches:

- **CIP-30 wallet connection** via Mesh's React components
- **Minting policies** without needing a Plutus validator (native scripts work for simple cases)
- **CIP-25 metadata** structure and the label-721 convention
- **IPFS pinning** as the standard for NFT image storage
- **One-shot policy parameterisation** as a uniqueness mechanism
- **Blockfrost integration** for chain queries and tx submission

## Production hardening (left as an exercise)

The repo version is deliberately a teaching artifact, not a production-ready minter. To take it to mainnet:

- Server-side validation of metadata (max image size, allowed file types, attribute limits)
- Rate limiting on `/api/pin` to prevent IPFS-pinning abuse
- Better error handling for wallet rejection / network failures
- A real database for tracking minted NFTs (currently logs to console)
- CIP-27 royalty support (10-line addition shown in the README)
- Optional: serverless function to listen for tx confirmation and notify the user

## Recipes that compose this DApp

- `mint-nft-cip25-mesh` — the core minting transaction
- `token-gated-content-mesh-nextjs` — wallet connection patterns (reused here)

## Known issues / pitfalls relevant to this DApp

- `min-ada-with-metadata` — long descriptions or many attributes push min-ADA up; let Mesh calculate

## Demo

Live at [nft-minter.learncardano.io](https://nft-minter.learncardano.io) on preview testnet. Bring your own preview ADA.
