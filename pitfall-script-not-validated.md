---
slug: script-not-validated
type: pitfall
title: "Script Not Validated"
---

Developing smart contracts on Cardano presents unique challenges and responsibilities, especially when it comes to validating scripts before deployment. This pitfall often leads to unexpected behaviour and vulnerabilities, which can have severe financial implications. Understanding the importance of thorough testing and validation processes is critical to ensuring your scripts function as intended.

## Symptoms

- **Unexpected Behaviour**: Deployed contracts behave unpredictably, leading to potential loss of funds or contract failure.
- **Vulnerabilities**: Contracts may contain security weaknesses that can be exploited by malicious actors.

## Cause

The root cause of these issues is often a failure to properly validate scripts before deployment. Unlike traditional software, smart contracts on Cardano are immutable once deployed. This means any bugs or vulnerabilities present in the contract can lead to irreversible consequences. The Cardano eUTXO model does provide some inherent security benefits, but developers must still ensure their scripts are robust and secure.

## Fix

To prevent these issues, developers should implement comprehensive testing and validation processes:

1. **Exhaustive Testing**: Test your on-chain validators extensively with mock transactions to ensure they handle all possible scenarios. Use property-based testing tools like fuzzers to cover a wide range of inputs and edge cases. [Read more about testing](https://github.com/cardano-foundation/developer-portal/blob/main/docs/developers/curriculum/07-production/going-to-production.md).

2. **Off-Chain Code Testing**: Don't neglect the off-chain code. Test transaction building and submission thoroughly. Utilize unit tests and integration tests to ensure all components of your application work together seamlessly.

3. **Rehearse on Preprod**: Before moving to mainnet, conduct a full dry run of your user flow on the Preprod test environment. This environment mirrors the mainnet closely, allowing you to identify and rectify issues before they affect real users.

4. **Security Audits**: Conduct audits akin to penetration testing to uncover any security flaws. This step is crucial given the irreversibility of transactions on the mainnet.

5. **Formal Verification**: Where possible, employ formal verification methods to mathematically prove the correctness of your contracts. This process can help ensure that your contracts behave as intended under all circumstances.

## Importance of Validation

Validation is not just about ensuring functionality; it's about safeguarding the assets and trust of your users. The Cardano [Developer Portal](https://github.com/cardano-foundation/developer-portal/blob/main/docs/developers/curriculum/05-smart-contracts/security.md) highlights the critical nature of smart contract security and the permanent consequences of deploying flawed contracts.

By adhering to rigorous validation processes, you can avoid the pitfall of deploying unvalidated scripts and protect both your project and its users from unforeseen issues.
