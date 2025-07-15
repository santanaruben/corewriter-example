import { ethers } from "hardhat";
import { YourContract } from "../typechain-types";

async function main() {
  console.log("🚀 Iniciando interacción con contrato CoreWriter...");

  // Obtener la cuenta deployer
  const [deployer] = await ethers.getSigners();
  console.log("👤 Usando cuenta:", deployer.address);

  // Obtener el contrato desplegado
  const contractAddress = await getDeployedContractAddress();
  if (!contractAddress) {
    console.error("❌ No se encontró el contrato desplegado. Ejecuta 'yarn deploy' primero.");
    return;
  }

  const yourContract = (await ethers.getContractAt("YourContract", contractAddress)) as YourContract;
  console.log("📄 Contrato encontrado en:", contractAddress);

  // Mostrar información inicial
  console.log("\n📊 Estado inicial del contrato:");
  console.log("👤 Propietario:", await yourContract.owner());
  console.log("🔢 Contador de acciones:", await yourContract.actionCounter());
  console.log("📝 Dirección CoreWriter:", await yourContract.CORE_WRITER());

  // Crear algunas acciones de prueba
  console.log("\n🧪 Creando acciones de prueba de CoreWriter...");

  // 1. Orden límite
  console.log("1️⃣ Enviando orden límite...");
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
  console.log("✅ Orden límite enviada");

  // 2. Transferencia de vault
  console.log("2️⃣ Enviando transferencia de vault...");
  const vaultTransferTx = await yourContract.sendVaultTransfer(
    deployer.address, // vault
    true, // isDeposit
    1000000000n, // usd (1000 * 10^6)
  );
  await vaultTransferTx.wait();
  console.log("✅ Transferencia de vault enviada");

  // 3. Delegación de tokens
  console.log("3️⃣ Enviando delegación de tokens...");
  const tokenDelegateTx = await yourContract.sendTokenDelegate(
    "0x1234567890123456789012345678901234567890", // validator
    1000000000000000000n, // amount (1 ETH)
    false, // isUndelegate
  );
  await tokenDelegateTx.wait();
  console.log("✅ Delegación de tokens enviada");

  // 4. Depósito en staking
  console.log("4️⃣ Enviando depósito en staking...");
  const stakingDepositTx = await yourContract.sendStakingDeposit(
    1000000000000000000n, // amount (1 ETH)
  );
  await stakingDepositTx.wait();
  console.log("✅ Depósito en staking enviado");

  // 5. Envío de tokens spot
  console.log("5️⃣ Enviando tokens spot...");
  const spotSendTx = await yourContract.sendSpotSend(
    deployer.address, // destination
    1n, // token ID
    1000000000000000000n, // amount (1 ETH)
  );
  await spotSendTx.wait();
  console.log("✅ Envío de tokens spot enviado");

  // 6. Transferencia USD class
  console.log("6️⃣ Enviando transferencia USD class...");
  const usdTransferTx = await yourContract.sendUsdClassTransfer(
    1000000000n, // ntl (1000 * 10^6)
    true, // toPerp
  );
  await usdTransferTx.wait();
  console.log("✅ Transferencia USD class enviada");

  // 7. Finalización de contrato EVM
  console.log("7️⃣ Finalizando contrato EVM...");
  const finalizeTx = await yourContract.sendFinalizeEvmContract(
    1n, // token ID
    1, // variant (Create)
    0n, // createNonce
  );
  await finalizeTx.wait();
  console.log("✅ Finalización de contrato EVM enviada");

  // 8. Agregar wallet API
  console.log("8️⃣ Agregando wallet API...");
  const addApiWalletTx = await yourContract.sendAddApiWallet(
    "0xabcdef1234567890abcdef1234567890abcdef12", // apiWallet
    "Test API Wallet", // apiWalletName
  );
  await addApiWalletTx.wait();
  console.log("✅ Wallet API agregada");

  // Mostrar estado después de crear acciones
  console.log("\n📊 Estado después de crear acciones:");
  console.log("🔢 Contador de acciones:", await yourContract.actionCounter());

  // Mostrar información de algunas acciones
  console.log("\n📋 Información de acciones:");
  for (let i = 0; i < 8; i++) {
    try {
      const action = await yourContract.getAction(i);
      console.log(`Acción ${i}:`);
      console.log(`  - Creador: ${action.creator}`);
      console.log(`  - Tipo: ${action.actionType}`);
      console.log(`  - Ejecutada: ${action.executed}`);
      console.log(`  - Resultado: ${action.result}`);
      console.log(`  - Timestamp: ${new Date(Number(action.timestamp) * 1000).toLocaleString()}`);
    } catch {
      console.log(`Acción ${i}: No encontrada`);
    }
  }

  // Mostrar acciones del usuario
  console.log("\n👤 Acciones del usuario actual:");
  const userActions = await yourContract.getUserActions(deployer.address);
  console.log(
    "IDs de acciones:",
    userActions.map(id => id.toString()),
  );

  console.log("\n🎉 ¡Interacción completada exitosamente!");
  console.log("📄 Puedes verificar las transacciones en el explorador de bloques");
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
    console.error("❌ Error durante la interacción:", error);
    process.exit(1);
  });
