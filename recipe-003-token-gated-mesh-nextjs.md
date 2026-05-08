---
slug: token-gated-content-mesh-nextjs
title: Token-gate a Next.js page with Mesh and CIP-30
stack: [mesh, blockfrost]
category: [frontend, tokens, nft]
difficulty: beginner
audience: [evm-migrant, total-beginner]
est_time_minutes: 20
last_verified: 2025-11-01
cardano_era: conway
ai_ready: true
video_url: ""
github_url: https://github.com/pbwebdev/LearnCardano/recipe-token-gated-mesh-nextjs
sandbox_url: ""
demo_url: ""
prerequisites:
  - Next.js 14+ project set up
  - Mesh SDK installed (@meshsdk/react, @meshsdk/core)
  - A Cardano browser wallet installed (Lace, Eternl, or Nami)
learning_outcomes:
  - Connect a Cardano wallet from a Next.js page using CIP-30
  - Query wallet assets using Mesh
  - Gate page content based on token/NFT holding
  - Understand why this needs no smart contract
related_pitfalls:
  - wallet-api-not-available-server-side
  - policy-id-case-sensitivity
related_concepts:
  - cip-30-wallet-standard
  - native-assets-on-cardano
related_recipes:
  - mint-nft-cip25-mesh
  - verify-wallet-ownership-cip-8
---

Add wallet-based token gating to a Next.js page in under 50 lines. If the connected wallet holds a token under a specific policy ID, show the content. No smart contract required — wallet asset queries are off-chain operations.

## Background: why no smart contract needed

On Ethereum, token gating usually means calling an on-chain `balanceOf()` view function. On Cardano, **wallet balances are public and queryable off-chain** — every UTxO is on-chain and any indexer (Blockfrost, Koios, etc.) can tell you what tokens an address holds. No contract call needed.

This makes Cardano token gating simpler and cheaper: just query the wallet's assets, check for your policy ID, and conditionally render content. All in the browser.

## Code

### 1. Install Mesh React

```bash
npm install @meshsdk/react @meshsdk/core
```

### 2. Wrap your app with MeshProvider

```tsx
// app/layout.tsx
import { MeshProvider } from "@meshsdk/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <MeshProvider>{children}</MeshProvider>
      </body>
    </html>
  );
}
```

### 3. Build the token-gated component

```tsx
// components/TokenGate.tsx
"use client";
import { useState } from "react";
import { useWallet, CardanoWallet } from "@meshsdk/react";

const REQUIRED_POLICY_ID = "your_policy_id_here"; // 56 hex chars

export function TokenGate({ children }: { children: React.ReactNode }) {
  const { connected, wallet } = useWallet();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  async function checkAccess() {
    if (!wallet) return;
    setChecking(true);
    try {
      const assets = await wallet.getAssets();
      const holds = assets.some(
        (asset) => asset.policyId === REQUIRED_POLICY_ID
      );
      setHasAccess(holds);
    } finally {
      setChecking(false);
    }
  }

  if (!connected) {
    return (
      <div>
        <p>Connect your wallet to access this content.</p>
        <CardanoWallet />
      </div>
    );
  }

  if (hasAccess === null) {
    return (
      <button onClick={checkAccess} disabled={checking}>
        {checking ? "Checking..." : "Check access"}
      </button>
    );
  }

  if (!hasAccess) {
    return (
      <div>
        <p>You need a token from policy <code>{REQUIRED_POLICY_ID}</code> to access this.</p>
      </div>
    );
  }

  return <>{children}</>;
}
```

### 4. Use it on any page

```tsx
// app/members/page.tsx
import { TokenGate } from "@/components/TokenGate";

export default function MembersPage() {
  return (
    <TokenGate>
      <h1>Members-only content</h1>
      <p>You hold the token. Welcome in.</p>
    </TokenGate>
  );
}
```

## Important security note

This pattern is **UI gating only** — it's not a security boundary. The `wallet.getAssets()` call happens in the browser and returns data from the user's wallet extension. A determined user can bypass it by manipulating the client-side check.

For real access control (e.g. premium content, download links, API keys), move the check server-side:

```typescript
// app/api/check-access/route.ts
import { BlockfrostProvider } from "@meshsdk/core";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { address } = await req.json();
  const provider = new BlockfrostProvider(process.env.BLOCKFROST_KEY!);
  const assets = await provider.fetchAddressAssets(address);
  const hasToken = assets.some((a) => a.unit.startsWith(REQUIRED_POLICY_ID));

  // Optionally: sign a message with the wallet to prove address ownership (CIP-8)
  return NextResponse.json({ hasAccess: hasToken });
}
```

For maximum security, combine server-side asset check with **CIP-8 message signing** (see recipe: verify-wallet-ownership-cip-8) to prove the user actually controls the address.

## AI prompt bundle

**System prompt:**
```
You are building a Cardano token-gated Next.js 14 app using Mesh SDK (@meshsdk/react, @meshsdk/core).
Wallet connection uses CIP-30 via the CardanoWallet component from @meshsdk/react.
Asset queries use wallet.getAssets() client-side or BlockfrostProvider server-side.
Always flag the difference between client-side UI gating and server-side security gating.
Network is mainnet unless specified otherwise.
```

**Starter prompt:**
```
Extend the token gate to:
1. Support multiple allowed policy IDs (any one of them grants access)
2. Move the access check to a Next.js API route using Blockfrost
3. Cache the result in a signed cookie so the user doesn't need to re-check on every page load
```

**Context files:** `components/TokenGate.tsx`, `app/api/check-access/route.ts`, `app/layout.tsx`
