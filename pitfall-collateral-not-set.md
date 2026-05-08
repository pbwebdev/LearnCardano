Transaction submission fails with `NoCollateralInputs`, `InsufficientCollateral`, or "Collateral required for script execution." Happens specifically on transactions that spend from a script address or run a minting policy.

## Why collateral exists

Any transaction that executes a Plutus validator must include collateral — a UTxO the ledger can seize if the script fails at phase-2 validation. This is Cardano's anti-spam mechanism for smart contract execution.

The flow:

1. **Phase-1 validation** (free, structural): Does the transaction parse? Are the inputs valid? Are the signatures correct?
2. **Phase-2 validation** (script execution): Run all the validators. If any return `False`, the transaction fails — but it's already been included in a block.
3. **Penalty**: Because phase-2 wasted the network's compute resources, the user pays. The collateral UTxO gets seized; the regular fee is also taken.

This makes broken scripts expensive enough to deter spam without making them so expensive that legitimate users can't afford to submit code.

## Constraints on collateral

- **Must be pure ADA.** No native tokens. The ledger needs to be able to seize a clean lovelace amount.
- **Must belong to a transaction signer.** It can't be a UTxO from somewhere random — the user must have authority to spend it.
- **Must meet the minimum.** Currently 150% of the script's max execution units. For most contracts, 5 ADA is more than enough.

## Symptoms

```
NoCollateralInputs
InsufficientCollateral
Collateral required for script execution
Missing required collateral input
InsufficientCollateralBalance
```

If you only see this when running script transactions and never on simple transfers, this is the issue.

## The fix

Always include collateral on script transactions.

### Mesh (browser wallet)

```typescript
tx.setCollateral(await wallet.getCollateral());
```

`wallet.getCollateral()` returns the user's configured collateral UTxOs from the wallet extension via CIP-30. Browser wallets like Lace, Eternl, and Yoroi let users mark a UTxO as their dedicated collateral.

### Mesh (headless / mnemonic-based wallet)

The MeshWallet class has the same `getCollateral()` helper but it picks any suitable ADA-only UTxO from the wallet. If your wallet only contains UTxOs with native tokens, you'll get an empty result. Fix:

```typescript
// Send 5 ADA to yourself first, creating a clean ADA-only UTxO:
const setupTx = new Transaction({ initiator: wallet });
setupTx.sendLovelace(await wallet.getChangeAddress(), "5000000");
await wallet.submitTx(await wallet.signTx(await setupTx.build()));
// Wait for confirmation, then proceed with script transactions
```

### Evolution

Evolution handles collateral automatically when the wallet has it configured. If you're using a custom key agent without browser wallet integration, set the collateral input explicitly:

```typescript
txBuilder.collateral(collateralUtxo);
```

## Production pattern

Make collateral part of your transaction-building helper, not something you remember to add per call:

```typescript
async function buildScriptTx(wallet: MeshWallet) {
  const tx = new Transaction({ initiator: wallet });
  tx.setCollateral(await wallet.getCollateral());
  // (also set validity interval here — same reason)
  return tx;
}
```

Then in your DApp code:

```typescript
const tx = await buildScriptTx(wallet);
tx.redeemValue(...);
```

Forgetting collateral on one code path is a class of bug that happens once and ruins someone's day.

## UX implications

When a user connects a wallet that doesn't have collateral configured, your DApp should detect this and prompt them to set it up before they try to interact:

```typescript
const collateral = await wallet.getCollateral();
if (!collateral || collateral.length === 0) {
  showWarning("Your wallet doesn't have collateral configured. Open your wallet settings and mark a UTxO as collateral before continuing.");
  return;
}
```

Lace, Eternl, and Yoroi all expose collateral configuration in their UI. Some wallets auto-configure it on first script interaction; some don't. Don't assume.

## Why script transactions are different

Simple transfers don't need collateral because they don't run scripts — they're guaranteed to succeed at phase-2 (there's no script to fail). The moment you spend from a script address or run a minting policy, you're invoking the validator, and the network charges collateral as insurance.

Reference scripts (CIP-0033) don't change this — even though the script itself is referenced rather than inlined, it still runs at phase-2, and collateral is still required.

## Related issues

- **Reference scripts and collateral**: still required. Reference scripts save fees on the script-bytes side but don't reduce collateral requirements.
- **Multiple script inputs**: one collateral UTxO covers all script inputs in the transaction, not one per script.
- **Minting policies**: also count as script execution and require collateral.
