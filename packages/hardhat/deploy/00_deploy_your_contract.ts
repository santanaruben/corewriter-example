import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the CoreWriter contract "YourContract" using the deployer's account
 * and constructor arguments set to the deployer's address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one provided by Hardhat, which is already funded.

    When deploying to live networks (e.g. `yarn deploy --network hyperevmTestnet`), the deployer account
    must have enough balance to pay the gas fees for contract creation.

    You can generate a random account with `yarn generate` or `yarn account:import` to import your
    existing PK that will fill DEPLOYER_PRIVATE_KEY_ENCRYPTED in the .env file (then used in hardhat.config.ts)
    You can run the command `yarn account` to check your balance on each network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("🚀 Deploying CoreWriter contract...");
  console.log("📝 Deployer:", deployer);

  await deploy("YourContract", {
    from: deployer,
    // Contract constructor arguments
    args: [deployer],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks
    // by automatically mining the contract deployment transaction. Has no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deployment.
  const yourContract = await hre.ethers.getContract<Contract>("YourContract", deployer);
  console.log("✅ CoreWriter contract deployed successfully!");
  console.log("👤 Contract owner:", await yourContract.owner());
  console.log("📊 Action counter:", await yourContract.actionCounter());

  // Create an initial test action
  console.log("🤪 Creating initial test action...");
  const tx = await yourContract.sendLimitOrder(
    1, // asset ID
    true, // isBuy
    100000000000n, // limitPx (1000 * 10^8)
    10000000000n, // sz (100 * 10^8)
    false, // reduceOnly
    2, // tif (Gtc)
    0n, // cloid (no cloid)
  );
  await tx.wait();
  console.log("✅ Test action created!");
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
