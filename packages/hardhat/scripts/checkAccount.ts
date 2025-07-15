import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Verificando configuración de cuenta para hyperEVM testnet...");

  // Obtener el proveedor de la red
  const provider = ethers.provider;
  const network = await provider.getNetwork();

  console.log("🌐 Red actual:", network.name);
  console.log("🔢 Chain ID:", network.chainId);

  // Obtener las cuentas disponibles
  const accounts = await ethers.getSigners();

  console.log("\n👤 Cuentas disponibles:");
  for (let i = 0; i < Math.min(accounts.length, 5); i++) {
    const account = accounts[i];
    const balance = await provider.getBalance(account.address);
    console.log(`  ${i}: ${account.address} - ${ethers.formatEther(balance)} ETH`);
  }

  // Mostrar la cuenta que se usará para el despliegue (índice 0)
  const deployer = accounts[0];
  const deployerBalance = await provider.getBalance(deployer.address);

  console.log("\n🚀 Cuenta que se usará para el despliegue:");
  console.log(`   Dirección: ${deployer.address}`);
  console.log(`   Balance: ${ethers.formatEther(deployerBalance)} ETH`);

  if (deployerBalance === 0n) {
    console.log("\n⚠️  ADVERTENCIA: La cuenta no tiene ETH!");
    console.log("💡 Necesitas fondos para desplegar el contrato.");
  } else {
    console.log("\n✅ La cuenta tiene fondos para el despliegue.");
  }

  // Verificar si MNEMONIC está configurado
  const mnemonic = process.env.MNEMONIC;
  if (mnemonic) {
    console.log("\n✅ MNEMONIC configurado en variables de entorno.");
    console.log("📝 Primeras palabras:", mnemonic.split(" ").slice(0, 3).join(" ") + "...");
  } else {
    console.log("\n❌ MNEMONIC no configurado en variables de entorno.");
    console.log("💡 Usando mnemonic por defecto de hardhat.");
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
