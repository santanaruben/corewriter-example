# CoreWriter dApp - Scaffold-ETH 2 + hyperEVM

This project is a real integration of CoreWriter on hyperEVM testnet, using Scaffold-ETH 2 (NextJS, Hardhat, Wagmi, Typescript).

## 🚀 Main Features
- **Real CoreWriter contract**: All main CoreWriter functions implemented and exposed.
- **Deployment and testing on hyperEVM testnet**.
- **NextJS frontend** with a dedicated UI to interact with the contract.
- **Support for quick actions, history, and contextual help**.

---

## 📦 Project Structure
- `packages/hardhat/` - Contracts, deployment scripts, and tests.
- `packages/nextjs/` - NextJS frontend, hooks, and components to interact with the contract.
- Main page: [`/`](./packages/nextjs/app/page.tsx) - Full CoreWriter interface

---

## 🛠️ Installation and Setup

1. **Install dependencies**
   ```bash
   yarn install
   ```
2. **Set up your account and mnemonic**
   - Create the file `packages/hardhat/.env`:
     ```env
     MNEMONIC="your 12 words here"
     ```
3. **Getting funds from the Faucet**
   - Get some hyperEVM testnet USDC on the faucet https://app.hyperliquid-testnet.xyz/drip (you need 10 usdc on arbitrum mainnet).
   - You can route the assets between hyperEVM and hyperCORE in https://app.hyperliquid-testnet.xyz/portfolio
   - In order to get HYPE to deploy and make txs you need to trade that USDC in https://app.hyperliquid-testnet.xyz/trade and send HYPE to hyperEVM
4. **Configure your account to use HyperEVM Big Blocks**
   - Go to https://hyperevm-block-toggle.vercel.app/
   - Make sure you have funds on the hyperEVM testnet.
   - Set the top toggle to Testnet
   - Click the "BIG" button to enable HyperEVM Big Blocks
   - Accept the tx
5. **Deploy the contract**
   ```bash
   yarn deploy:hyperevmTestnet
   ```
6. **Start the frontend**
   ```bash
   yarn start
   ```
7. **Open the main interface**
   - Go to [http://localhost:3000](http://localhost:3000)

---

## ✨ What can you do?
- Use **quick actions** to test all main CoreWriter functions:
  - Send limit orders
  - Transfer vault
  - Delegate tokens
  - Staking
  - Send spot tokens
  - Transfer USD class
  - Finalize EVM contracts
  - Add API wallets
- View the **history of actions** created and executed by your account.
- Consult **contextual help** and usage examples.

---

## 🧪 Testing

```bash
yarn test
```

---

## 🌐 Supported Networks
- **hyperEVM Testnet**
  - Chain ID: 998
  - RPC: https://rpc.hyperliquid-testnet.xyz/evm
  - Explorer: https://testnet.purrsec.com/

---

## 📚 Useful Resources
- [Official Documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore#corewriter-contract)
- [Scaffold-ETH 2](https://github.com/scaffold-eth/se-2)
- [Tools](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperevm/tools-for-hyperevm-builders)

---

## 📝 Notes
- The main page is fully adapted for CoreWriter with user-friendly forms and action history.
- You can still use `/debug` to interact with any deployed contract in an advanced way.
- If you have questions, check the `COREWRITER_README.md` file for technical details and advanced examples.