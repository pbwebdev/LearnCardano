---
slug: cardano-dapp-development-tools-vs-frameworks-vs-libraries
type: comparison
title: "Cardano DApp Development Tools, Frameworks, and Libraries"
---

When developing decentralised applications (DApps) on Cardano, choosing the right tools, frameworks, and libraries is crucial. The Cardano ecosystem offers several options, each with unique strengths and weaknesses. This guide will help you understand these differences and make informed decisions for your projects.

### Aiken

Aiken is a relatively new smart contract language tailored for the Cardano blockchain. It's designed to be lightweight and efficient, making it an excellent choice for developers looking to build fast and secure smart contracts.

**Pros:**
- Lightweight and fast.
- Designed specifically for Cardano smart contracts.
- Supported by good tooling.

**Cons:**
- Limited to the Cardano ecosystem.
- Less mature compared to other options like Plutus.

**When to pick:** Use Aiken when you need a dedicated tool for writing smart contracts on Cardano.

Learn more about Aiken [here](https://aiken-lang.org/installation-instructions).

### Plutus

Plutus is a Haskell-based smart contract language for Cardano. It allows developers to write complex financial contracts and is backed by the robustness of Haskell.

**Pros:**
- Strong integration with Haskell.
- Rich feature set suitable for complex contracts.

**Cons:**
- Steeper learning curve compared to other languages.
- Heavier than alternatives like Aiken.

**When to pick:** Choose Plutus if you are developing complex smart contracts and are comfortable with Haskell.

More on Plutus can be found [here](https://plutus.iohk.io/).

### Mesh SDK

Mesh SDK provides a TypeScript-based SDK for building web DApps on Cardano. It's a great fit for developers familiar with JavaScript and TypeScript, allowing them to leverage existing skills.

**Pros:**
- Friendly for JavaScript/TypeScript developers.
- Ideal for web-based DApps.

**Cons:**
- Limited to front-end development.
- Depends heavily on the JavaScript/TypeScript ecosystem.

**When to pick:** Use Mesh SDK if you are building a web-based DApp and prefer JavaScript/TypeScript.

Find out more about Mesh SDK [here](https://mesh.js.org/).

### Cardano API WASM Library

This library allows developers to use Cardano APIs in both browser and Node.js environments through WASM compilation. It enhances developer productivity by enabling the use of familiar JavaScript environments.

**Pros:**
- Runs in both browser and Node.js environments.
- Increases DApp developer productivity.

**Cons:**
- Requires knowledge of WASM.
- May not cover all features of Cardano.

**When to pick:** Choose this library if you need to integrate Cardano APIs into a JavaScript app.

Explore the Cardano API WASM Library [here](https://github.com/input-output-hk/cardano-node-wiki/blob/main/docs/ADR-015-Cardano-API-WASM-library-for-browser.md).

### Conclusion

The choice between these tools, frameworks, and libraries largely depends on your project's specific needs and your familiarity with the underlying technologies. For lightweight DApps, Aiken is a solid choice. For complex smart contracts, Plutus offers robust features. If you're building a web-based DApp, Mesh SDK is your go-to. Finally, the Cardano API WASM Library is ideal for integrating Cardano features in a JavaScript environment.

By understanding the strengths and limitations of each option, you can better align your development approach with your project's goals and constraints.
