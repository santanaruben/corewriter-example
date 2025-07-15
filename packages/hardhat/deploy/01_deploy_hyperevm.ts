import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Despliega el contrato CoreWriter en hyperEVM testnet
 * Este script está optimizado para la red hyperEVM testnet
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployHyperEVM: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const network = hre.network.name;

  console.log("🚀 Desplegando contrato CoreWriter en hyperEVM testnet...");
  console.log("📝 Deployer:", deployer);
  console.log("🌐 Red:", network);

  // Verificar que estamos en la red correcta
  if (network !== "hyperevmTestnet") {
    console.log("⚠️  Este script está diseñado para hyperEVM testnet");
    console.log("💡 Usa: yarn deploy --network hyperevmTestnet");
    return;
  }

  try {
    await deploy("YourContract", {
      from: deployer,
      args: [deployer],
      log: true,
      autoMine: false, // En redes en vivo, no autoMine
      waitConfirmations: 1, // Esperar 1 confirmación
    });

    // Obtener el contrato desplegado
    const yourContract = await hre.ethers.getContract<Contract>("YourContract", deployer);

    console.log("✅ Contrato CoreWriter desplegado exitosamente en hyperEVM testnet!");
    console.log("📄 Dirección del contrato:", await yourContract.getAddress());
    console.log("👤 Propietario del contrato:", await yourContract.owner());
    console.log("📊 Contador de acciones:", await yourContract.actionCounter());
    console.log("🔗 Dirección CoreWriter:", await yourContract.CORE_WRITER());

    // Crear algunas acciones de prueba iniciales
    console.log("🧪 Creando acciones de prueba iniciales...");

    // Orden límite de prueba
    const limitOrderTx = await yourContract.sendLimitOrder(
      1, // asset ID
      true, // isBuy
      100000000000n, // limitPx (1000 * 10^8)
      10000000000n, // sz (100 * 10^8)
      false, // reduceOnly
      2, // tif (Gtc)
      0n, // cloid (sin cloid)
    );
    await limitOrderTx.wait();
    console.log("✅ Orden límite de prueba creada!");

    // Transferencia de vault de prueba
    const vaultTransferTx = await yourContract.sendVaultTransfer(
      deployer, // vault
      true, // isDeposit
      1000000000n, // usd (1000 * 10^6)
    );
    await vaultTransferTx.wait();
    console.log("✅ Transferencia de vault de prueba creada!");

    // Delegación de tokens de prueba
    const tokenDelegateTx = await yourContract.sendTokenDelegate(
      "0x1234567890123456789012345678901234567890", // validator
      1000000000000000000n, // amount (1 ETH)
      false, // isUndelegate
    );
    await tokenDelegateTx.wait();
    console.log("✅ Delegación de tokens de prueba creada!");

    // Depósito en staking de prueba
    const stakingDepositTx = await yourContract.sendStakingDeposit(
      1000000000000000000n, // amount (1 ETH)
    );
    await stakingDepositTx.wait();
    console.log("✅ Depósito en staking de prueba creado!");

    // Envío de tokens spot de prueba
    const spotSendTx = await yourContract.sendSpotSend(
      deployer, // destination
      1n, // token ID
      1000000000000000000n, // amount (1 ETH)
    );
    await spotSendTx.wait();
    console.log("✅ Envío de tokens spot de prueba creado!");

    console.log("🎉 ¡Despliegue completo! El contrato está listo para probar CoreWriter en hyperEVM testnet.");
    console.log("🔗 Puedes verificar el contrato en el explorador de hyperEVM testnet");
    console.log("📄 Dirección del contrato:", await yourContract.getAddress());
  } catch (error) {
    console.error("❌ Error durante el despliegue:", error);
    throw error;
  }
};

export default deployHyperEVM;

// Tags para ejecutar solo este script
deployHyperEVM.tags = ["HyperEVM"];
