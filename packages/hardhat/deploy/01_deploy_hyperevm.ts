import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the CoreWriter contract on hyperEVM testnet
 * This script is optimized for the hyperEVM testnet
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployHyperEVM: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const network = hre.network.name;

  console.log("🚀 Deploying CoreWriter contract on hyperEVM testnet...");
  console.log("📝 Deployer:", deployer);
  console.log("🌐 Network:", network);

  // Verify that we are on the correct network
  if (network !== "hyperevmTestnet") {
    console.log("⚠️  This script is designed for hyperEVM testnet");
    console.log("💡 Use: yarn deploy --network hyperevmTestnet");
    return;
  }

  try {
    await deploy("YourContract", {
      from: deployer,
      args: [deployer],
      log: true,
      autoMine: false, // On live networks, do not autoMine
      waitConfirmations: 1, // Wait for 1 confirmation
    });

    // Get the deployed contract
    const yourContract = await hre.ethers.getContract<Contract>("YourContract", deployer);

    console.log("✅ CoreWriter contract deployed successfully on hyperEVM testnet!");
    console.log("📄 Contract address:", await yourContract.getAddress());
    console.log("👤 Contract owner:", await yourContract.owner());
    console.log("📊 Action counter:", await yourContract.actionCounter());
    console.log("🔗 CoreWriter address:", await yourContract.CORE_WRITER());

    // Create some initial test actions
    console.log("🤪 Creating initial test actions...");

    // Test limit order
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
    console.log("✅ Test limit order created!");

    // Test vault transfer
    const vaultTransferTx = await yourContract.sendVaultTransfer(
      deployer, // vault
      true, // isDeposit
      1000000000n, // usd (1000 * 10^6)
    );
    await vaultTransferTx.wait();
    console.log("✅ Test vault transfer created!");

    // Test token delegation
    const tokenDelegateTx = await yourContract.sendTokenDelegate(
      "0x1234567890123456789012345678901234567890", // validator
      1000000000000000000n, // amount (1 HYPE)
      false, // isUndelegate
    );
    await tokenDelegateTx.wait();
    console.log("✅ Test token delegation created!");

    // Test staking deposit
    const stakingDepositTx = await yourContract.sendStakingDeposit(
      1000000000000000000n, // amount (1 HYPE)
    );
    await stakingDepositTx.wait();
    console.log("✅ Test staking deposit created!");

    // Test spot token send
    const spotSendTx = await yourContract.sendSpotSend(
      deployer, // destination
      1n, // token ID
      1000000000000000000n, // amount (1 HYPE)
    );
    await spotSendTx.wait();
    console.log("✅ Test spot token send created!");

    console.log("🎉 Deployment complete! The contract is ready to test CoreWriter on hyperEVM testnet.");
    console.log("🔗 You can verify the contract on the hyperEVM testnet explorer");
    console.log("📄 Contract address:", await yourContract.getAddress());
  } catch (error) {
    console.error("❌ Error during deployment:", error);
    throw error;
  }
};

export default deployHyperEVM;

// Tags to run only this script
deployHyperEVM.tags = ["HyperEVM"];
