# 🚀 CoreWriter Contract for hyperEVM Testnet

This project contains a smart contract designed to test and validate the functionality of **CoreWriter** on the **hyperEVM** testnet, implementing the real functionalities according to the [official documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore#corewriter-contract).

## 📋 Contract Features

### 🎯 Main Functionalities

1. **Real Integration with CoreWriter**: Direct calls to the system CoreWriter contract at `0x3333333333333333333333333333333333333333`
2. **Limit Orders**: Send trading orders to HyperCore
3. **Vault Transfers**: Manage funds in vaults
4. **Token Delegation**: Delegate to validators
5. **Staking**: Staking deposits and withdrawals
6. **Spot Transfers**: Send tokens between addresses
7. **USD Class Transfers**: Manage USD between perp and spot
8. **EVM Contract Finalization**: Finalize contracts in HyperCore
9. **API Wallet Management**: Add API wallets

### 🔧 Available Actions

#### CoreWriter Functions (according to official documentation)
- `sendLimitOrder()` - Send limit orders to HyperCore
- `sendVaultTransfer()` - Transfer funds to/from vaults
- `sendTokenDelegate()` - Delegate tokens to validators
- `sendStakingDeposit()` - Deposit into staking
- `sendStakingWithdraw()` - Withdraw from staking
- `sendSpotSend()` - Send spot tokens
- `sendUsdClassTransfer()` - Transfer USD class
- `sendFinalizeEvmContract()` - Finalize EVM contracts
- `sendAddApiWallet()` - Add API wallet

#### Test Functions
- `testLimitOrder()` - Example of a limit order
- `testVaultTransfer()` - Example of a vault transfer
- `testTokenDelegate()` - Example of token delegation

## 🛠️ Setup and Deployment

### Prerequisites
- Node.js >= 20.18.3
- Yarn
- Account with HYPE on hyperEVM testnet

### 1. Install Dependencies
```bash
yarn install
```

### 2. Account Setup
```bash
# Generate a new account
yarn generate

# Or import an existing account
yarn account:import
```

### 3. Configure MNEMONIC
Edit the file `packages/hardhat/.env` and add your mnemonic:
```env
MNEMONIC="your 12-word mnemonic here"
```

### 4. Check Balance
```bash
# Check balance on hyperEVM testnet
yarn account --network hyperevmTestnet
```

### 5. Local Deployment (Development)
```bash
# Start local network
yarn chain

# In another terminal, deploy contract
yarn deploy
```

### 6. Deploy to hyperEVM Testnet
```bash
# Deploy to hyperEVM testnet
yarn deploy --network hyperevmTestnet

# Or use the specific script
yarn deploy --tags HyperEVM --network hyperevmTestnet
```

## 🤪 Testing

### Run Local Tests
```bash
yarn test
```

### Run Specific Tests
```bash
yarn hardhat:test --grep "CoreWriter"
```

## 🎮 Interacting with the Contract

### From the Frontend
1. Start the frontend: `yarn start`
2. Go to `http://localhost:3000/debug`
3. Connect your wallet
4. Interact with the contract functions

### From the Command Line
```bash
# Run interaction script
yarn hardhat run scripts/interact.ts --network hyperevmTestnet
```

### Check Account
```bash
# Check which account is being used
yarn hardhat run scripts/checkAccount.ts --network hyperevmTestnet
```

## 📊 Contract Structure

### State Variables
- `owner`: Contract owner's address
- `actionCounter`: Total counter of created actions
- `actions`: Mapping from action ID to Action struct
- `userActions`: Mapping from user to array of action IDs
- `CORE_WRITER`: System CoreWriter contract address

### Action Structure
```solidity
struct Action {
    uint256 id;           // Unique action ID
    address creator;      // Creator's address
    string actionType;    // Action type
    bytes data;           // Action data (CoreWriter encoding)
    uint256 timestamp;    // Creation timestamp
    bool executed;        // Execution state (always true for CoreWriter)
    string result;        // Execution result
}
```

### CoreWriter Encoding
The contract implements the correct encoding according to the documentation:
- Byte 0: Encoding version (0x01)
- Bytes 1-2: Action ID (0x0000)
- Byte 3: Action type (1-9)
- Bytes 4+: Action-specific data

## 🔍 Emitted Events

- `ActionCreated`: When a new action is created
- `ActionExecuted`: When an action is executed
- `CoreWriterCall`: When a call to CoreWriter is made

## 🌐 Network Configuration

### hyperEVM Testnet
- **Chain ID**: 998
- **RPC URL**: `https://rpc.hyperliquid-testnet.xyz/evm`
- **Explorer**: `https://testnet.purrsec.com/`
- **CoreWriter Address**: `0x3333333333333333333333333333333333333333`

### Configuration in scaffold.config.ts
```typescript
const hyperEVMTestnet = {
  id: 998,
  name: "HyperEVM Testnet",
  network: "hyperevm-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Hyperliquid",
    symbol: "HYPE",
  },
  rpcUrls: {
    default: { http: ["https://rpc.hyperliquid-testnet.xyz/evm"] },
    public: { http: ["https://rpc.hyperliquid-testnet.xyz/evm"] },
  },
  blockExplorers: {
    default: { name: "HyperEVM Testnet Explorer", url: "https://testnet.purrsec.com/" },
  },
};
```

## 🚨 Important Considerations

### Gas and Limits
- The contract is configured with a gas limit of 12,000,000 for hyperEVM
- CoreWriter calls may consume more gas than normal operations

### Security
- Only the owner can withdraw HYPE from the contract
- CoreWriter actions are executed immediately
- Existence of actions is validated before querying them

### Costs
- Deployment: ~2-3 HYPE (gas fees)
- CoreWriter operations: ~0.001-0.01 HYPE
- Limit orders: ~0.01-0.1 HYPE

### Data Types
- Prices: Multiplied by 10^8 (uint64)
- Sizes: Multiplied by 10^8 (uint64)
- USD: Multiplied by 10^6 (uint64)
- Wei: Amounts in wei (uint64)

## 🔧 Customization

### Add New Actions
1. Add new type in the `ActionType` enum
2. Create `send[NewAction]()` function with the correct parameters
3. Update the `_getActionTypeString()` function
4. Add a test function if necessary

### Modify Existing Functions
1. Edit the `send*` functions in the contract
2. Update the corresponding tests
3. Regenerate types: `yarn hardhat:compile`

## 📞 Support

For issues or questions:
1. Check the deployment logs
2. Verify network configuration
3. Make sure your account has enough balance
4. Consult the [official CoreWriter documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore#corewriter-contract)

## 🔗 Useful Links

- [hyperEVM Documentation](https://docs.hyperliquid.xyz/)
- [CoreWriter Documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore#corewriter-contract)
- [hyperEVM Testnet Explorer](https://testnet.purrsec.com/)
- [hyperEVM Faucet](https://faucet.hyperliquid-testnet.xyz) (if available)

## 📝 Usage Examples

### Limit Order
```solidity
// Buy 100 units of asset 1 at price 1000
sendLimitOrder(
    1,              // asset ID
    true,           // isBuy
    100000000000,   // limitPx (1000 * 10^8)
    10000000000,    // sz (100 * 10^8)
    false,          // reduceOnly
    2,              // tif (Gtc)
    0               // cloid (no cloid)
);
```

### Vault Transfer
```solidity
// Deposit 1000 USD into the vault
sendVaultTransfer(
    msg.sender,     // vault
    true,           // isDeposit
    1000000000      // usd (1000 * 10^6)
);
```

### Token Delegation
```solidity
// Delegate 1 HYPE to the validator
sendTokenDelegate(
    0x1234...,      // validator
    1000000000000000000, // amount (1 HYPE)
    false           // isUndelegate
);
```

---

**Ready to test CoreWriter on hyperEVM testnet! 🎉** 