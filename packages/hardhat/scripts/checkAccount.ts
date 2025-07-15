import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Checking account configuration for hyperEVM testnet...");

  // Get the network provider
  const provider = ethers.provider;
  const network = await provider.getNetwork();

  console.log("🌐 Current network:", network.name);
  console.log("🔒 Chain ID:", network.chainId);

  // Get available accounts
  const accounts = await ethers.getSigners();

  console.log("\n👤 Available accounts:");
  for (let i = 0; i < Math.min(accounts.length, 5); i++) {
    const account = accounts[i];
    const balance = await provider.getBalance(account.address);
    console.log(`  ${i}: ${account.address} - ${ethers.formatEther(balance)} HYPE`);
  }

  // Show the account that will be used for deployment (index 0)
  const deployer = accounts[0];
  const deployerBalance = await provider.getBalance(deployer.address);

  console.log("\n🚀 Account to be used for deployment:");
  console.log(`   Address: ${deployer.address}`);
  console.log(`   Balance: ${ethers.formatEther(deployerBalance)} HYPE`);

  if (deployerBalance === 0n) {
    console.log("\n⚠️  WARNING: The account has no HYPE!");
    console.log("💡 You need funds to deploy the contract.");
  } else {
    console.log("\n✅ The account has funds for deployment.");
  }

  // Check if MNEMONIC is set
  const mnemonic = process.env.MNEMONIC;
  if (mnemonic) {
    console.log("\n✅ MNEMONIC set in environment variables.");
    console.log("📝 First words:", mnemonic.split(" ").slice(0, 3).join(" ") + "...");
  } else {
    console.log("\n❌ MNEMONIC not set in environment variables.");
    console.log("💡 Using Hardhat's default mnemonic.");
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
