import { expect } from "chai";
import { ethers } from "hardhat";
import { YourContract } from "../typechain-types";

describe("YourContract - CoreWriter Real", function () {
  // Definimos un fixture para reutilizar la misma configuración en cada prueba.
  let yourContract: YourContract;
  let owner: any;
  let user1: any;
  let user2: any;

  before(async () => {
    [owner, user1, user2] = await ethers.getSigners();
    const yourContractFactory = await ethers.getContractFactory("YourContract");
    yourContract = (await yourContractFactory.deploy(owner.address)) as YourContract;
    await yourContract.waitForDeployment();
  });

  describe("Despliegue", function () {
    it("Debería tener el propietario correcto al desplegar", async function () {
      expect(await yourContract.owner()).to.equal(owner.address);
    });

    it("Debería tener contador de acciones en 0 al inicio", async function () {
      expect(await yourContract.actionCounter()).to.equal(0);
    });

    it("Debería tener la dirección correcta de CoreWriter", async function () {
      expect(await yourContract.CORE_WRITER()).to.equal("0x3333333333333333333333333333333333333333");
    });
  });

  describe("Funciones de CoreWriter - Limit Orders", function () {
    it("Debería permitir enviar una orden límite", async function () {
      const asset = 1;
      const isBuy = true;
      const limitPx = 100000000000n; // 1000 * 10^8
      const sz = 10000000000n; // 100 * 10^8
      const reduceOnly = false;
      const tif = 2; // Gtc
      const cloid = 0n;

      await yourContract.connect(user1).sendLimitOrder(asset, isBuy, limitPx, sz, reduceOnly, tif, cloid);

      expect(await yourContract.actionCounter()).to.equal(1);

      const action = await yourContract.getAction(0);
      expect(action.creator).to.equal(user1.address);
      expect(action.actionType).to.equal("LIMIT_ORDER");
      expect(action.executed).to.equal(true);
    });

    it("Debería permitir usar la función de prueba de orden límite", async function () {
      await yourContract.connect(user2).testLimitOrder();

      expect(await yourContract.actionCounter()).to.equal(2);

      const action = await yourContract.getAction(1);
      expect(action.actionType).to.equal("LIMIT_ORDER");
      expect(action.executed).to.equal(true);
    });
  });

  describe("Funciones de CoreWriter - Vault Transfer", function () {
    it("Debería permitir enviar una transferencia de vault", async function () {
      const vault = user1.address;
      const isDeposit = true;
      const usd = 1000000000n; // 1000 * 10^6

      await yourContract.connect(user1).sendVaultTransfer(vault, isDeposit, usd);

      expect(await yourContract.actionCounter()).to.equal(3);

      const action = await yourContract.getAction(2);
      expect(action.actionType).to.equal("VAULT_TRANSFER");
      expect(action.executed).to.equal(true);
    });

    it("Debería permitir usar la función de prueba de vault transfer", async function () {
      await yourContract.connect(user2).testVaultTransfer();

      expect(await yourContract.actionCounter()).to.equal(4);

      const action = await yourContract.getAction(3);
      expect(action.actionType).to.equal("VAULT_TRANSFER");
      expect(action.executed).to.equal(true);
    });
  });

  describe("Funciones de CoreWriter - Token Delegate", function () {
    it("Debería permitir delegar tokens", async function () {
      const validator = "0x1234567890123456789012345678901234567890";
      const wei = 1000000000000000000n; // 1 ETH
      const isUndelegate = false;

      await yourContract.connect(user1).sendTokenDelegate(validator, wei, isUndelegate);

      expect(await yourContract.actionCounter()).to.equal(5);

      const action = await yourContract.getAction(4);
      expect(action.actionType).to.equal("TOKEN_DELEGATE");
      expect(action.executed).to.equal(true);
    });

    it("Debería permitir usar la función de prueba de token delegate", async function () {
      await yourContract.connect(user2).testTokenDelegate();

      expect(await yourContract.actionCounter()).to.equal(6);

      const action = await yourContract.getAction(5);
      expect(action.actionType).to.equal("TOKEN_DELEGATE");
      expect(action.executed).to.equal(true);
    });
  });

  describe("Funciones de CoreWriter - Staking", function () {
    it("Debería permitir depositar en staking", async function () {
      const wei = 1000000000000000000n; // 1 ETH

      await yourContract.connect(user1).sendStakingDeposit(wei);

      expect(await yourContract.actionCounter()).to.equal(7);

      const action = await yourContract.getAction(6);
      expect(action.actionType).to.equal("STAKING_DEPOSIT");
      expect(action.executed).to.equal(true);
    });

    it("Debería permitir retirar de staking", async function () {
      const wei = 500000000000000000n; // 0.5 ETH

      await yourContract.connect(user2).sendStakingWithdraw(wei);

      expect(await yourContract.actionCounter()).to.equal(8);

      const action = await yourContract.getAction(7);
      expect(action.actionType).to.equal("STAKING_WITHDRAW");
      expect(action.executed).to.equal(true);
    });
  });

  describe("Funciones de CoreWriter - Spot Send", function () {
    it("Debería permitir enviar tokens spot", async function () {
      const destination = user2.address;
      const token = 1n; // Token ID
      const wei = 1000000000000000000n; // 1 ETH

      await yourContract.connect(user1).sendSpotSend(destination, token, wei);

      expect(await yourContract.actionCounter()).to.equal(9);

      const action = await yourContract.getAction(8);
      expect(action.actionType).to.equal("SPOT_SEND");
      expect(action.executed).to.equal(true);
    });
  });

  describe("Funciones de CoreWriter - USD Class Transfer", function () {
    it("Debería permitir transferir USD class", async function () {
      const ntl = 1000000000n; // 1000 * 10^6
      const toPerp = true;

      await yourContract.connect(user1).sendUsdClassTransfer(ntl, toPerp);

      expect(await yourContract.actionCounter()).to.equal(10);

      const action = await yourContract.getAction(9);
      expect(action.actionType).to.equal("USD_CLASS_TRANSFER");
      expect(action.executed).to.equal(true);
    });
  });

  describe("Funciones de CoreWriter - Finalize EVM Contract", function () {
    it("Debería permitir finalizar un contrato EVM", async function () {
      const token = 1n; // Token ID
      const variant = 1; // Create
      const createNonce = 0n;

      await yourContract.connect(user1).sendFinalizeEvmContract(token, variant, createNonce);

      expect(await yourContract.actionCounter()).to.equal(11);

      const action = await yourContract.getAction(10);
      expect(action.actionType).to.equal("FINALIZE_EVM_CONTRACT");
      expect(action.executed).to.equal(true);
    });
  });

  describe("Funciones de CoreWriter - Add API Wallet", function () {
    it("Debería permitir agregar una wallet API", async function () {
      const apiWallet = "0xabcdef1234567890abcdef1234567890abcdef12";
      const apiWalletName = "Test API Wallet";

      await yourContract.connect(user1).sendAddApiWallet(apiWallet, apiWalletName);

      expect(await yourContract.actionCounter()).to.equal(12);

      const action = await yourContract.getAction(11);
      expect(action.actionType).to.equal("ADD_API_WALLET");
      expect(action.executed).to.equal(true);
    });
  });

  describe("Funciones de consulta", function () {
    it("Debería obtener las acciones de un usuario", async function () {
      const userActions = await yourContract.getUserActions(user1.address);
      expect(userActions.length).to.be.greaterThan(0);
    });

    it("Debería obtener información de una acción específica", async function () {
      const action = await yourContract.getAction(0);
      expect(action.id).to.equal(0);
      expect(action.creator).to.equal(user1.address);
      expect(action.executed).to.equal(true);
    });
  });

  describe("Restricciones de acceso", function () {
    it("Solo el propietario debería poder retirar ETH", async function () {
      // Enviar algo de ETH al contrato
      await owner.sendTransaction({
        to: await yourContract.getAddress(),
        value: ethers.parseEther("0.1"),
      });

      // El propietario puede retirar
      await expect(yourContract.connect(owner).withdraw()).to.not.be.reverted;

      // Otros usuarios no pueden retirar
      await expect(yourContract.connect(user1).withdraw()).to.be.revertedWith(
        "Solo el propietario puede ejecutar esta funcion",
      );
    });
  });

  describe("Encoding de datos", function () {
    it("Debería crear el encoding correcto para las acciones", async function () {
      // Esta prueba verifica que el encoding interno funciona correctamente
      const asset = 1;
      const isBuy = true;
      const limitPx = 100000000000n;
      const sz = 10000000000n;
      const reduceOnly = false;
      const tif = 2;
      const cloid = 0n;

      await yourContract.connect(user1).sendLimitOrder(asset, isBuy, limitPx, sz, reduceOnly, tif, cloid);

      const action = await yourContract.getAction((await yourContract.actionCounter()) - 1n);
      expect(action.data.length).to.be.greaterThan(4); // Debe tener al menos el header de 4 bytes
    });
  });
});
