---
slug: wrong-network-selection
type: pitfall
title: "Wrong Network Selection"
---

When building applications on Cardano, choosing the right network for deployment is crucial. Mistakes in network selection can lead to wasted resources, confusion, and potentially costly errors. Developers often encounter issues when they inadvertently deploy smart contracts or transactions to the wrong network, such as deploying on the mainnet when they intended to test on a testnet.

### Understanding Cardano Networks

Cardano offers multiple networks tailored for different stages of development and deployment:

- **Mainnet**: The production network where transactions have real value, using actual ADA. This network should only be used for applications that are production-ready. Transactions on the mainnet cannot be reversed and will incur real costs. [Learn more about mainnet](https://github.com/cardano-foundation/developer-portal/blob/main/docs/get-started/networks/overview.md).

- **Testnets**: These are safe environments for testing without the risk of losing real ADA. Testnets use test ADA, which has no real value. They are ideal for integration testing and pre-production validation. [Explore testnets further](https://github.com/cardano-foundation/developer-portal/blob/main/docs/get-started/networks/testnets.md).

- **Local Networks**: Used for offline development, enabling fast iterations and custom scenario testing. These networks are suitable for initial development phases and continuous integration/continuous deployment (CI/CD) processes.

### Symptoms of Wrong Network Selection

Developers may notice that their smart contracts do not execute as expected, or they might encounter unexpected transaction fees. These issues often arise because the deployment was made on the mainnet instead of a testnet, or vice versa.

### Causes

The primary cause of wrong network selection is a lack of attention to the configuration settings during deployment. Developers might rush through setup processes or misunderstand the purpose of different networks, leading to incorrect selections.

### Fixing the Issue

To avoid deploying on the wrong network, developers should:

1. **Double-check Network Configuration**: Always verify the network settings in your development environment. Ensure that the selected network aligns with your current development phase.

2. **Use Environment Variables**: Implement environment variables to manage network configurations. This reduces the risk of hardcoding network settings, which can lead to mistakes.

3. **Conduct Thorough Testing**: Utilize testnets for comprehensive testing before deploying on the mainnet. This practice helps identify and rectify issues in a cost-free environment.

4. **Educate the Team**: Ensure all team members understand the differences between Cardano's networks and the implications of deploying on each.

5. **Automate Deployment Processes**: Use scripts and automation tools to manage network selection and deployment processes. Automation reduces human error and ensures consistency.

### Conclusion

Selecting the correct network is a foundational step in Cardano development. By understanding the purpose of each network and implementing robust checks and balances, developers can avoid the common pitfall of wrong network selection. This not only saves resources but also enhances the efficiency and reliability of the development process.

For more detailed guidance, refer to the [Cardano Developer Portal](https://github.com/cardano-foundation/developer-portal/blob/main/docs/get-started/networks/overview.md) and ensure your project leverages the appropriate network for its current stage.
