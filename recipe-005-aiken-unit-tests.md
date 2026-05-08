---
slug: aiken-unit-tests
title: Write unit tests for Aiken validators
stack: [aiken]
category: [smart-contracts, testing]
difficulty: intermediate
audience: [intermediate-cardano]
est_time_minutes: 30
last_verified: 2025-11-01
cardano_era: conway
ai_ready: true
video_url: ""
github_url: https://github.com/pbwebdev/LearnCardano/recipe-aiken-unit-tests
sandbox_url: ""
demo_url: ""
prerequisites:
  - Aiken CLI installed (aiken --version >= 1.1.0)
  - Completed recipe: vesting-validator-aiken-mesh or similar
  - Understanding of Aiken type system basics
learning_outcomes:
  - Write property-based and example-based tests in Aiken
  - Use aiken check to run tests
  - Test edge cases in validators (expired deadline, wrong signer, missing datum)
  - Understand what Aiken tests do and don't cover (off-chain remains untested)
related_pitfalls:
  - tests-pass-but-mainnet-fails
  - fuzzer-not-covering-edge-cases
related_concepts:
  - validators-are-predicates
  - property-based-testing
related_recipes:
  - vesting-validator-aiken-mesh
  - yaci-devkit-integration-tests
---

Write inline unit tests directly in Aiken using the `test` keyword. Test your vesting validator against valid claims, invalid signers, and early withdrawals. Run everything with `aiken check`. No test framework needed — testing is built into the language.

## Background: testing in Aiken

Aiken tests are first-class. You write `test` blocks directly in your `.ak` files, right next to the code they test. The `aiken check` command compiles and runs them, reporting pass/fail per test. Optionally, fuzzing generates random inputs to stress-test edge cases.

What Aiken tests cover: the on-chain validator logic, pure functions, type coercions.
What they don't cover: the off-chain transaction builder (Mesh, Evolution). Test those separately with Yaci DevKit or integration tests.

## Code

### 1. Set up test utilities in your validator file

```aiken
// validators/vesting.ak
use aiken/crypto.{VerificationKeyHash}
use cardano/transaction.{OutputReference, Transaction, NoDatum}
use cardano/interval.{Finite, Interval, IntervalBound}
use vodka_extra_signatories.{key_signed}
use vodka_validity_range.{valid_after}

pub type VestingDatum {
  lock_until: Int,
  owner: VerificationKeyHash,
  beneficiary: VerificationKeyHash,
}

validator vesting {
  spend(datum_opt: Option<VestingDatum>, _redeemer: Data,
        _input: OutputReference, tx: Transaction) {
    expect Some(datum) = datum_opt
    or {
      key_signed(tx.extra_signatories, datum.owner),
      and {
        key_signed(tx.extra_signatories, datum.beneficiary),
        valid_after(tx.validity_range, datum.lock_until),
      },
    }
  }
  else(_) { fail }
}
```

### 2. Write a test helper for mock transactions

```aiken
// Test helpers — only compiled during tests, not deployed
fn mock_tx(signatories: List<VerificationKeyHash>, lower_bound: Int) -> Transaction {
  Transaction {
    ..transaction.placeholder,
    extra_signatories: signatories,
    validity_range: Interval {
      lower_bound: IntervalBound { bound_type: Finite(lower_bound), is_inclusive: True },
      upper_bound: IntervalBound { bound_type: Finite(lower_bound + 600_000), is_inclusive: False },
    },
  }
}

fn mock_datum(lock_until: Int, owner: VerificationKeyHash,
              beneficiary: VerificationKeyHash) -> VestingDatum {
  VestingDatum { lock_until, owner, beneficiary }
}
```

### 3. Write the tests

```aiken
// Test: beneficiary can claim after deadline
test beneficiary_can_claim_after_deadline() {
  let owner = #"aabb"
  let beneficiary = #"ccdd"
  let deadline = 1_700_000_000_000 // POSIX ms

  let datum = mock_datum(deadline, owner, beneficiary)
  let tx = mock_tx([beneficiary], deadline + 1) // lower bound is AFTER deadline

  let result = vesting.spend(Some(datum), Void, mock_oref(), tx)
  result == True
}

// Test: beneficiary cannot claim before deadline
test beneficiary_cannot_claim_before_deadline() {
  let owner = #"aabb"
  let beneficiary = #"ccdd"
  let deadline = 1_700_000_000_000

  let datum = mock_datum(deadline, owner, beneficiary)
  let tx = mock_tx([beneficiary], deadline - 1000) // lower bound BEFORE deadline

  // This should fail — validator should return False
  !vesting.spend(Some(datum), Void, mock_oref(), tx)
}

// Test: owner can always reclaim
test owner_can_reclaim_anytime() {
  let owner = #"aabb"
  let beneficiary = #"ccdd"
  let deadline = 1_700_000_000_000

  let datum = mock_datum(deadline, owner, beneficiary)
  // Owner signs, but tx is way before deadline
  let tx = mock_tx([owner], 0)

  vesting.spend(Some(datum), Void, mock_oref(), tx)
}

// Test: random signer cannot claim
test random_signer_cannot_claim() {
  let owner = #"aabb"
  let beneficiary = #"ccdd"
  let attacker = #"eeff"
  let deadline = 1_700_000_000_000

  let datum = mock_datum(deadline, owner, beneficiary)
  let tx = mock_tx([attacker], deadline + 1)

  !vesting.spend(Some(datum), Void, mock_oref(), tx)
}

fn mock_oref() -> OutputReference {
  OutputReference { transaction_id: #"abcd", output_index: 0 }
}
```

### 4. Run the tests

```bash
aiken check
```

Output:
```
✓ vesting/vesting_test.beneficiary_can_claim_after_deadline [1ms]
✓ vesting/vesting_test.beneficiary_cannot_claim_before_deadline [1ms]
✓ vesting/vesting_test.owner_can_reclaim_anytime [1ms]
✓ vesting/vesting_test.random_signer_cannot_claim [1ms]

4 tests, 4 passed, 0 failed
```

### 5. Add a fuzzer (optional but powerful)

```aiken
use aiken/fuzz

test deadline_always_enforced(lock_until via fuzz.int(), lower_bound via fuzz.int()) {
  let datum = mock_datum(lock_until, #"aabb", #"ccdd")
  let tx = mock_tx([#"ccdd"], lower_bound)
  let result = vesting.spend(Some(datum), Void, mock_oref(), tx)

  // Beneficiary should only succeed when lower_bound >= lock_until
  if lower_bound >= lock_until {
    result == True
  } else {
    result == False
  }
}
```

The fuzzer generates hundreds of random `(lock_until, lower_bound)` pairs and verifies the invariant holds for all of them.

## AI prompt bundle

**System prompt:**
```
You are writing Aiken v1.1+ unit tests for Cardano smart contract validators.
Tests use the built-in `test` keyword and are placed in the same file as the validator.
Use transaction.placeholder as the base for mock transactions, then spread-update fields.
Fuzzers use aiken/fuzz module and the `via` keyword for property-based testing.
Run tests with `aiken check`. Do not use external test frameworks.
```

**Starter prompt:**
```
Add tests for:
1. A validator that checks a datum field (minimum deposit amount)
2. A fuzzer that verifies the minimum deposit check holds for all positive integers
3. A test that verifies datum parsing fails gracefully when datum is missing
```

**Context files:** `validators/vesting.ak`, `aiken.toml`
