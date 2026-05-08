---
slug: sign-message-cip8-mesh
title: Prove wallet ownership with CIP-8 message signing
stack: [mesh]
category: [frontend, identity]
difficulty: beginner
audience: [evm-migrant, total-beginner]
est_time_minutes: 15
last_verified: 2025-11-01
cardano_era: conway
ai_ready: true
video_url: ""
github_url: https://github.com/pbwebdev/LearnCardano/recipe-cip8-signing-mesh
sandbox_url: ""
demo_url: ""
prerequisites:
  - Mesh SDK with React installed (@meshsdk/react, @meshsdk/core)
  - Completed recipe: token-gated-content-mesh-nextjs (wallet connection working)
  - Next.js 14+ project
learning_outcomes:
  - Understand CIP-8 message signing (Cardano's equivalent of eth_sign)
  - Request a signed message from a connected wallet
  - Verify the signature server-side to prove address ownership
  - Build a complete wallet-based auth flow with no passwords or accounts
related_pitfalls:
  - cip8-signature-format-differences-between-wallets
related_concepts:
  - cip-30-wallet-standard
  - cardano-address-types
related_recipes:
  - token-gated-content-mesh-nextjs
  - jwt-auth-with-wallet-signature
---

Use CIP-8 to request a cryptographic signature from a connected wallet, then verify it server-side. This proves the user controls a Cardano address — no passwords, no accounts, just a wallet. Equivalent to `eth_sign` on Ethereum but with a formalised standard.

## Background: why wallet signing for auth?

Traditional auth: user creates account → stores password → your server stores a hash. Lots of attack surface.

Wallet auth: user signs a message with their private key → server verifies the signature matches the claimed address → done. No passwords stored, no account creation, cryptographically proven ownership.

On Ethereum this is done with `eth_sign` / `personal_sign`. On Cardano the equivalent is defined in **CIP-8** and exposed through the **CIP-30** wallet API (`wallet.signData()`).

The flow:

```
1. Server generates a nonce (random string, single-use)
2. Client fetches the nonce, asks wallet to sign it
3. Wallet user approves → signature returned to client
4. Client sends address + signature + nonce to server
5. Server verifies: does this signature match this address and this nonce?
6. If yes → issue session token. Nonce is consumed (prevents replay).
```

## Code

### 1. Client-side: request the signature

```tsx
// components/WalletAuth.tsx
"use client";
import { useState } from "react";
import { useWallet } from "@meshsdk/react";

export function WalletAuth({ onSuccess }: { onSuccess: (token: string) => void }) {
  const { wallet, connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function authenticate() {
    if (!wallet) return;
    setLoading(true);
    setError("");

    try {
      // Get the user's address
      const addresses = await wallet.getUsedAddresses();
      const address = addresses[0];

      // Step 1: fetch a server-generated nonce
      const nonceRes = await fetch("/api/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const { nonce } = await nonceRes.json();

      // Step 2: ask the wallet to sign the nonce
      // wallet.signData expects the message as hex
      const hexNonce = Buffer.from(nonce).toString("hex");
      const signature = await wallet.signData(address, hexNonce);

      // Step 3: verify with the server
      const authRes = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, signature, nonce }),
      });

      if (!authRes.ok) throw new Error("Authentication failed");
      const { token } = await authRes.json();
      onSuccess(token);
    } catch (err: any) {
      setError(err.message || "Signing cancelled or failed");
    } finally {
      setLoading(false);
    }
  }

  if (!connected) return <p>Connect your wallet first.</p>;

  return (
    <div>
      <button onClick={authenticate} disabled={loading}>
        {loading ? "Waiting for signature..." : "Sign in with wallet"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
```

### 2. Server-side: generate the nonce

```typescript
// app/api/nonce/route.ts
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

// Simple in-memory store — use Redis in production
const nonceStore = new Map<string, { nonce: string; expires: number }>();

export async function POST(req: NextRequest) {
  const { address } = await req.json();

  if (!address || !address.startsWith("addr")) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }

  // Generate a fresh nonce, expire in 5 minutes
  const nonce = `Sign in to Learn Cardano\nAddress: ${address}\nNonce: ${randomUUID()}`;
  nonceStore.set(address, { nonce, expires: Date.now() + 5 * 60 * 1000 });

  return NextResponse.json({ nonce });
}
```

### 3. Server-side: verify the signature

```typescript
// app/api/auth/route.ts
import { checkSignature } from "@meshsdk/core";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose"; // npm install jose

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: NextRequest) {
  const { address, signature, nonce } = await req.json();

  // Retrieve and consume the nonce — prevents replay attacks
  const stored = nonceStore.get(address);
  if (!stored || stored.nonce !== nonce || Date.now() > stored.expires) {
    return NextResponse.json({ error: "Invalid or expired nonce" }, { status: 401 });
  }
  nonceStore.delete(address); // consume it — single use

  // Verify the CIP-8 signature
  const hexNonce = Buffer.from(nonce).toString("hex");
  const isValid = checkSignature(hexNonce, address, signature);

  if (!isValid) {
    return NextResponse.json({ error: "Signature verification failed" }, { status: 401 });
  }

  // Issue a JWT — address ownership is proven
  const token = await new SignJWT({ address, sub: address })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);

  return NextResponse.json({ token, address });
}
```

### 4. Protect API routes with the JWT

```typescript
// middleware.ts
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const PROTECTED = ["/api/members", "/api/content"];

export async function middleware(req: NextRequest) {
  const isProtected = PROTECTED.some((p) => req.nextUrl.pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    // Optionally: check payload.address holds a required token (combine with token-gating recipe)
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
```

### 5. Wire it all together on a page

```tsx
// app/login/page.tsx
"use client";
import { useState } from "react";
import { CardanoWallet } from "@meshsdk/react";
import { WalletAuth } from "@/components/WalletAuth";

export default function LoginPage() {
  const [token, setToken] = useState("");

  return (
    <div>
      <h1>Sign in</h1>
      <CardanoWallet />
      <WalletAuth onSuccess={(t) => {
        setToken(t);
        localStorage.setItem("lc_token", t);
      }} />
      {token && <p>Signed in. Token saved.</p>}
    </div>
  );
}
```

## Wallet compatibility notes

CIP-8 is well-supported but a few wallets have quirks:
- **Eternl** — fully compliant, works as expected
- **Lace** — works, but signature object structure may vary slightly. Always use `checkSignature` from Mesh rather than rolling your own verification.
- **Nami** — deprecated in favour of Lace. Still works but treat it as legacy.
- **Flint** — discontinued. Remove from your supported wallet list.

## AI prompt bundle

**System prompt:**
```
You are building Cardano wallet authentication using CIP-8 message signing with Mesh SDK.
Client-side: wallet.signData(address, hexEncodedMessage) from @meshsdk/react useWallet hook.
Server-side: checkSignature(hexMessage, address, signature) from @meshsdk/core.
Always use server-generated nonces to prevent replay attacks — store server-side, single-use.
Address format is bech32 (addr1... mainnet, addr_test1... testnet).
JWT library: jose (not jsonwebtoken — jose works in Next.js edge runtime).
```

**Starter prompt:**
```
Extend the auth flow to:
1. After verifying the signature, also check whether the address holds a token
   from REQUIRED_POLICY_ID using Blockfrost (combine auth + token-gating)
2. Include the result (hasToken: true/false) in the JWT payload
3. Add a useAuth() hook that reads the JWT from localStorage and returns
   { address, hasToken, isExpired }
```

**Context files:** `components/WalletAuth.tsx`, `app/api/nonce/route.ts`, `app/api/auth/route.ts`, `middleware.ts`
