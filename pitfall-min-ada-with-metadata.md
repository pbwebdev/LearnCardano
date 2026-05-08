Transaction fails to build or submit with an error like `OutputTooSmallUTxO`, "insufficient ada in output", or "Min ADA value not satisfied". Often happens when minting NFTs that include CIP-25 metadata, especially with longer image URIs or many attributes.

## What's actually happening

Every UTxO on Cardano must carry a minimum amount of ADA proportional to its size. The protocol enforces this so that the on-chain UTxO set doesn't get bloated with effectively-empty entries.

The size of a UTxO depends on:

- The address it's at
- The native tokens it holds (each policy-ID + asset-name pair adds bytes)
- The datum (if any)
- The reference script (if any, in Babbage+)
- Metadata attached to the transaction (which affects related min-ADA calculations)

A bare ADA-only output needs ~1 ADA (1,000,000 lovelace). An output holding an NFT with a CIP-25 metadata block — particularly with attributes, descriptions, and a long IPFS URI — typically needs 1.5 to 2.5 ADA. Hard-coding 1,000,000 lovelace for an output containing a token will fail.

## The fix

Three options, in preference order:

### 1. Let the SDK calculate it (best)

Both Mesh and Evolution can compute the correct min-ADA automatically. In Mesh, when minting:

```typescript
tx.mintAsset(forgingScript, {
  assetName: assetNameHex,
  assetQuantity: "1",
  metadata,
  label: "721",
  recipient: await wallet.getChangeAddress(),
});
// Don't pass an explicit lovelace amount — Mesh handles it
```

In Evolution:

```typescript
const output = {
  address: recipientAddress,
  value: { coins: undefined, assets: { [unit]: 1n } },
};
// buildTx() fills in the correct min-ADA
```

### 2. Calculate it manually

If you need to know the exact value before building (for UX, accounting, etc.), use the protocol formula:

```typescript
const COINS_PER_UTXO_BYTE = 4310n; // protocol param, current value
const FIXED_OVERHEAD = 160n;        // Babbage+ overhead per output

function minAdaForOutput(outputSizeBytes: bigint): bigint {
  return (FIXED_OVERHEAD + outputSizeBytes) * COINS_PER_UTXO_BYTE;
}

// For a typical NFT output: ~350-450 bytes → ~2.2-2.6 ADA
```

The exact size includes serialised CBOR overhead, so this is approximate. For precision, build the transaction in dry-run mode and read the value the SDK calculated.

### 3. Buffer with extra ADA (lazy)

For testing, just send 2 ADA along with the NFT instead of 1:

```typescript
// Wasteful but unblocks dev:
"2000000" // 2 ADA — generous buffer
```

Don't do this in production. It costs users extra ADA per mint, and CIP-25 metadata can vary in size per NFT, so the right buffer is unknowable without calculating.

## Production pattern

Always trust the SDK's calculation. Never hard-code lovelace amounts on outputs that contain tokens. If you need to display the cost to a user before they sign, do a dry-run build first and read the actual value:

```typescript
const dryRunTx = await tx.build(); // Mesh fills in min-ADA here
const finalLovelace = parseDryRunOutputValue(dryRunTx);
showToUser(`This mint will cost ${finalLovelace / 1_000_000n} ADA`);
```

## Error signatures to grep for

If you see any of these, you've hit this pitfall:

```
OutputTooSmallUTxO
Min ADA value not satisfied
insufficient ada in output
ValueNotConservedUTxO
output does not contain enough ADA
```

The `OutputTooSmallUTxO` error sometimes includes the actual minimum required — read the error body carefully, the number is often right there.

## Why this exists

UTxO bloat is a real problem on UTxO-based chains — every output sits in the UTxO set indefinitely until spent, costing every node memory and disk. The min-ADA requirement makes "spam UTxO" attacks economically infeasible. It's the equivalent of the storage rent debate on Ethereum, but resolved up-front: pay for the storage you're using, no rent collection needed.

## Related issues

- Adding many native tokens to one output multiplies the size — minting a batch of 10 NFTs into one output needs roughly 10x the per-token byte count.
- Long metadata strings (descriptions, file lists, attributes) push size up faster than people expect. A few extra fields in CIP-25 metadata can mean 0.5+ ADA more per output.
- Reference scripts dramatically increase UTxO size — a reference UTxO holding a 5KB script needs 2+ ADA just for that. This is intentional and acceptable; it's a one-time cost amortised across thousands of future transactions.
