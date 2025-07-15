import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Despliega el contrato CoreWriter "YourContract" usando la cuenta del deployer
 * y argumentos del constructor establecidos a la dirección del deployer
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    En localhost, la cuenta del deployer es la que viene con Hardhat, que ya está financiada.

    Al desplegar en redes en vivo (ej. `yarn deploy --network hyperevmTestnet`), la cuenta del deployer
    debe tener saldo suficiente para pagar las tarifas de gas por la creación del contrato.

    Puedes generar una cuenta aleatoria con `yarn generate` o `yarn account:import` para importar tu
    PK existente que llenará DEPLOYER_PRIVATE_KEY_ENCRYPTED en el archivo .env (luego usado en hardhat.config.ts)
    Puedes ejecutar el comando `yarn account` para verificar tu saldo en cada red.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("🚀 Desplegando contrato CoreWriter...");
  console.log("📝 Deployer:", deployer);

  await deploy("YourContract", {
    from: deployer,
    // Argumentos del constructor del contrato
    args: [deployer],
    log: true,
    // autoMine: se puede pasar a la función deploy para hacer el proceso de despliegue más rápido en redes locales
    // al minar automáticamente la transacción de despliegue del contrato. No tiene efecto en redes en vivo.
    autoMine: true,
  });

  // Obtener el contrato desplegado para interactuar con él después del despliegue.
  const yourContract = await hre.ethers.getContract<Contract>("YourContract", deployer);
  console.log("✅ Contrato CoreWriter desplegado exitosamente!");
  console.log("👤 Propietario del contrato:", await yourContract.owner());
  console.log("📊 Contador de acciones:", await yourContract.actionCounter());

  // Crear una acción de prueba inicial
  console.log("🧪 Creando acción de prueba inicial...");
  const tx = await yourContract.sendLimitOrder(
    1, // asset ID
    true, // isBuy
    100000000000n, // limitPx (1000 * 10^8)
    10000000000n, // sz (100 * 10^8)
    false, // reduceOnly
    2, // tif (Gtc)
    0n, // cloid (sin cloid)
  );
  await tx.wait();
  console.log("✅ Acción de prueba creada!");
};

export default deployYourContract;

// Tags son útiles si tienes múltiples archivos de despliegue y solo quieres ejecutar uno de ellos.
// ej. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
