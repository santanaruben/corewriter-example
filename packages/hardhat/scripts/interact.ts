import { ethers } from "hardhat";
import { YourContract } from "../typechain-types";

async function main() {
  console.log("🚀 Starting interaction with CoreWriter contract...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("👤 Using account:", deployer.address);

  // Get the deployed contract
  const contractAddress = await getDeployedContractAddress();
  if (!contractAddress) {
    console.error("❌ Deployed contract not found. Run 'yarn deploy' first.");
    return;
  }

  const yourContract = (await ethers.getContractAt("YourContract", contractAddress)) as YourContract;
  console.log("📄 Contract found at:", contractAddress);

  // Show initial information
  console.log("\n📊 Initial contract state:");
  console.log("👤 Owner:", await yourContract.owner());
  console.log("🔒 Action counter:", await yourContract.actionCounter());
  console.log("📝 CoreWriter address:", await yourContract.CORE_WRITER());

  // Create some test actions
  console.log("\n🤪 Creating CoreWriter test actions...");

  // 1. Limit order
  console.log("1️⃣ Sending limit order...");
  const limitOrderTx = await yourContract.sendLimitOrder(
    1, // asset ID
    true, // isBuy
    100000000000n, // limitPx (1000 * 10^8)
    10000000000n, // sz (100 * 10^8)
    false, // reduceOnly
    2, // tif (Gtc)
    0n, // cloid (no cloid)
  );
  await limitOrderTx.wait();
  console.log("✅ Limit order sent");

  // 2. Vault transfer
  console.log("2️⃣ Sending vault transfer...");
  const vaultTransferTx = await yourContract.sendVaultTransfer(
    deployer.address, // vault
    true, // isDeposit
    1000000000n, // usd (1000 * 10^6)
  );
  await vaultTransferTx.wait();
  console.log("✅ Vault transfer sent");

  // 3. Token delegation
  console.log("3️⃣ Sending token delegation...");
  const tokenDelegateTx = await yourContract.sendTokenDelegate(
    "0x1234567890123456789012345678901234567890", // validator
    1000000000000000000n, // amount (1 HYPE)
    false, // isUndelegate
  );
  await tokenDelegateTx.wait();
  console.log("✅ Token delegation sent");

  // 4. Staking deposit
  console.log("4️⃣ Sending staking deposit...");
  const stakingDepositTx = await yourContract.sendStakingDeposit(
    1000000000000000000n, // amount (1 HYPE)
  );
  await stakingDepositTx.wait();
  console.log("✅ Staking deposit sent");

  // 5. Spot token send
  console.log("5️⃣ Sending spot tokens...");
  const spotSendTx = await yourContract.sendSpotSend(
    deployer.address, // destination
    1n, // token ID
    1000000000000000000n, // amount (1 HYPE)
  );
  await spotSendTx.wait();
  console.log("✅ Spot token send sent");

  // 6. USD class transfer
  console.log("6️⃣ Sending USD class transfer...");
  const usdTransferTx = await yourContract.sendUsdClassTransfer(
    1000000000n, // ntl (1000 * 10^6)
    true, // toPerp
  );
  await usdTransferTx.wait();
  console.log("✅ USD class transfer sent");

  // 7. EVM contract finalization
  console.log("7️⃣ Finalizing EVM contract...");
  const finalizeTx = await yourContract.sendFinalizeEvmContract(
    1n, // token ID
    1, // variant (Create)
    0n, // createNonce
  );
  await finalizeTx.wait();
  console.log("✅ EVM contract finalization sent");

  // 8. Add API wallet
  console.log("8️⃣ Adding API wallet...");
  const addApiWalletTx = await yourContract.sendAddApiWallet(
    "0xabcdef1234567890abcdef1234567890abcdef12", // apiWallet
    "Test API Wallet", // apiWalletName
  );
  await addApiWalletTx.wait();
  console.log("✅ API wallet added");

  // Show state after creating actions
  console.log("\n📊 State after creating actions:");
  console.log("🔒 Action counter:", await yourContract.actionCounter());

  // Show information of some actions
  console.log("\n📋 Action information:");
  for (let i = 0; i < 8; i++) {
    try {
      const action = await yourContract.getAction(i);
      console.log(`Action ${i}:`);
      console.log(`  - Creator: ${action.creator}`);
      console.log(`  - Type: ${action.actionType}`);
      console.log(`  - Executed: ${action.executed}`);
      console.log(`  - Result: ${action.result}`);
      console.log(`  - Timestamp: ${new Date(Number(action.timestamp) * 1000).toLocaleString()}`);
    } catch {
      console.log(`Action ${i}: Not found`);
    }
  }

  // Show actions of the current user
  console.log("\n👤 Current user's actions:");
  const userActions = await yourContract.getUserActions(deployer.address);
  console.log(
    "Action IDs:",
    userActions.map(id => id.toString()),
  );

  console.log("\n🎉 Interaction completed successfully!");
  console.log("📄 You can check the transactions in the block explorer");
}

async function getDeployedContractAddress(): Promise<string | null> {
  try {
    const deployments = await import("../deployments/localhost/YourContract.json");
    return deployments.address;
  } catch {
    try {
      const deployments = await import("../deployments/hyperevmTestnet/YourContract.json");
      return deployments.address;
    } catch {
      return null;
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("❌ Error during interaction:", error);
    process.exit(1);
  });
