---
slug: not-sufficiently-testing
type: pitfall
title: "Insufficient Testing of Smart Contracts"
---

Building robust smart contracts on Cardano requires diligent testing to prevent unexpected behaviours and vulnerabilities. However, many developers overlook the importance of comprehensive testing, leading to issues that could have been avoided. This post explores common testing pitfalls and strategies to implement effective testing practices.

### Common Testing Pitfalls

1. **Over-reliance on Manual Testing**: Developers often rely on manual testing, which is prone to human error and lacks thoroughness.

2. **Inadequate Unit Testing**: Skipping unit tests or not covering enough scenarios can lead to logic errors in the contract that go unnoticed until deployment.

3. **Insufficient Integration Testing**: Failing to test how smart contracts interact with other components can result in unexpected behaviours when deployed on the network.

4. **Lack of Testnet Verification**: Skipping the testnet phase before deploying to the mainnet can lead to unanticipated issues that could have been caught earlier.

### Causes

The root cause of insufficient testing often stems from a lack of awareness or resources. Developers may underestimate the complexity of the Cardano eUTxO model, leading to inadequate testing strategies. Additionally, time constraints and pressure to deploy quickly can result in cutting corners during the testing phase.

### Effective Testing Strategies

To mitigate these pitfalls, developers should adopt a structured testing approach. The **Test Pyramid** model is a highly recommended strategy for smart contracts on Cardano, as detailed in the [Scalus documentation](https://github.com/scalus3/scalus/blob/main/./docs/internal/testing-strategy.md).

#### Test Pyramid for Smart Contracts

- **Unit Tests (JVM + PlutusVM)**: These should form the base of your testing strategy, covering about 70% of all tests. They are fast and allow for thorough testing of logic and budget constraints.
  
  ```typescript
  // Example of a unit test in Plutus
  import { expect } from 'chai';
  import { validateTransaction } from './myContract';

  describe('My Smart Contract', () => {
    it('should validate the transaction correctly', () => {
      const tx = createMockTransaction();
      const result = validateTransaction(tx);
      expect(result).to.be.true;
    });
  });
  ```

- **Protocol Tests (Emulator)**: These account for about 25% of tests and focus on transaction and security testing within an emulated environment.

- **Integration Tests (Yaci DevKit)**: Conduct around 5% of tests here, ensuring that your contracts behave correctly in a network-like environment.

- **Testnet Verification**: Before deploying to the mainnet, conduct a final verification on the testnet to catch any last-minute issues.

### Benefits of Thorough Testing

- **Prevents Financial Loss**: By catching bugs early, you can avoid situations where funds are locked or unauthorised transactions occur.

- **Enhances Security**: Thorough testing helps identify potential vulnerabilities that could be exploited.

- **Increases Confidence**: A well-tested smart contract provides assurance to users and stakeholders about its reliability and security.

### Conclusion

The importance of testing in the development of smart contracts on Cardano cannot be overstated. By implementing a comprehensive testing strategy, developers can significantly reduce the risk of unexpected behaviours and vulnerabilities. Refer to the [Mesh SDK documentation](https://github.com/MeshJS/meshjs.dev/blob/main/content/docs/resources/cardano-course/04-contract-testing.mdx) for additional insights into contract testing practices.
