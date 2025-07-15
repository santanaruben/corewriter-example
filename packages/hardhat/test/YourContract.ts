import { expect } from "chai";
import { ethers } from "hardhat";
import { YourContract } from "../typechain-types";

describe("YourContract - CoreWriter Real", function () {
  // Define a fixture to reuse the same setup in each test.
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

  describe("Deployment", function () {
    it("Should have the correct owner on deployment", async function () {
      expect(await yourContract.owner()).to.equal(owner.address);
    });

    it("Should have action counter at 0 initially", async function () {
      expect(await yourContract.actionCounter()).to.equal(0);
    });

    it("Should have the correct CoreWriter address", async function () {
      expect(await yourContract.CORE_WRITER()).to.equal("0x3333333333333333333333333333333333333333");
    });
  });

  describe("CoreWriter Functions - Limit Orders", function () {
    it("Should allow sending a limit order", async function () {
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

    it("Should allow using the test limit order function", async function () {
      await yourContract.connect(user2).testLimitOrder();

      expect(await yourContract.actionCounter()).to.equal(2);

      const action = await yourContract.getAction(1);
      expect(action.actionType).to.equal("LIMIT_ORDER");
      expect(action.executed).to.equal(true);
    });
  });

  describe("CoreWriter Functions - Vault Transfer", function () {
    it("Should allow sending a vault transfer", async function () {
      const vault = user1.address;
      const isDeposit = true;
      const usd = 1000000000n; // 1000 * 10^6

      await yourContract.connect(user1).sendVaultTransfer(vault, isDeposit, usd);

      expect(await yourContract.actionCounter()).to.equal(3);

      const action = await yourContract.getAction(2);
      expect(action.actionType).to.equal("VAULT_TRANSFER");
      expect(action.executed).to.equal(true);
    });

    it("Should allow using the test vault transfer function", async function () {
      await yourContract.connect(user2).testVaultTransfer();

      expect(await yourContract.actionCounter()).to.equal(4);

      const action = await yourContract.getAction(3);
      expect(action.actionType).to.equal("VAULT_TRANSFER");
      expect(action.executed).to.equal(true);
    });
  });

  describe("CoreWriter Functions - Token Delegate", function () {
    it("Should allow delegating tokens", async function () {
      const validator = "0x1234567890123456789012345678901234567890";
      const wei = 1000000000000000000n; // 1 HYPE
      const isUndelegate = false;

      await yourContract.connect(user1).sendTokenDelegate(validator, wei, isUndelegate);

      expect(await yourContract.actionCounter()).to.equal(5);

      const action = await yourContract.getAction(4);
      expect(action.actionType).to.equal("TOKEN_DELEGATE");
      expect(action.executed).to.equal(true);
    });

    it("Should allow using the test token delegate function", async function () {
      await yourContract.connect(user2).testTokenDelegate();

      expect(await yourContract.actionCounter()).to.equal(6);

      const action = await yourContract.getAction(5);
      expect(action.actionType).to.equal("TOKEN_DELEGATE");
      expect(action.executed).to.equal(true);
    });
  });

  describe("CoreWriter Functions - Staking", function () {
    it("Should allow staking deposit", async function () {
      const wei = 1000000000000000000n; // 1 HYPE

      await yourContract.connect(user1).sendStakingDeposit(wei);

      expect(await yourContract.actionCounter()).to.equal(7);

      const action = await yourContract.getAction(6);
      expect(action.actionType).to.equal("STAKING_DEPOSIT");
      expect(action.executed).to.equal(true);
    });

    it("Should allow staking withdrawal", async function () {
      const wei = 500000000000000000n; // 0.5 HYPE

      await yourContract.connect(user2).sendStakingWithdraw(wei);

      expect(await yourContract.actionCounter()).to.equal(8);

      const action = await yourContract.getAction(7);
      expect(action.actionType).to.equal("STAKING_WITHDRAW");
      expect(action.executed).to.equal(true);
    });
  });

  describe("CoreWriter Functions - Spot Send", function () {
    it("Should allow sending spot tokens", async function () {
      const destination = user2.address;
      const token = 1n; // Token ID
      const wei = 1000000000000000000n; // 1 HYPE

      await yourContract.connect(user1).sendSpotSend(destination, token, wei);

      expect(await yourContract.actionCounter()).to.equal(9);

      const action = await yourContract.getAction(8);
      expect(action.actionType).to.equal("SPOT_SEND");
      expect(action.executed).to.equal(true);
    });
  });

  describe("CoreWriter Functions - USD Class Transfer", function () {
    it("Should allow transferring USD class", async function () {
      const ntl = 1000000000n; // 1000 * 10^6
      const toPerp = true;

      await yourContract.connect(user1).sendUsdClassTransfer(ntl, toPerp);

      expect(await yourContract.actionCounter()).to.equal(10);

      const action = await yourContract.getAction(9);
      expect(action.actionType).to.equal("USD_CLASS_TRANSFER");
      expect(action.executed).to.equal(true);
    });
  });

  describe("CoreWriter Functions - Finalize EVM Contract", function () {
    it("Should allow finalizing an EVM contract", async function () {
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

  describe("CoreWriter Functions - Add API Wallet", function () {
    it("Should allow adding an API wallet", async function () {
      const apiWallet = "0xabcdef1234567890abcdef1234567890abcdef12";
      const apiWalletName = "Test API Wallet";

      await yourContract.connect(user1).sendAddApiWallet(apiWallet, apiWalletName);

      expect(await yourContract.actionCounter()).to.equal(12);

      const action = await yourContract.getAction(11);
      expect(action.actionType).to.equal("ADD_API_WALLET");
      expect(action.executed).to.equal(true);
    });
  });

  describe("Query Functions", function () {
    it("Should get the actions of a user", async function () {
      const userActions = await yourContract.getUserActions(user1.address);
      expect(userActions.length).to.be.greaterThan(0);
    });

    it("Should get information of a specific action", async function () {
      const action = await yourContract.getAction(0);
      expect(action.id).to.equal(0);
      expect(action.creator).to.equal(user1.address);
      expect(action.executed).to.equal(true);
    });
  });

  describe("Access Restrictions", function () {
    it("Only the owner should be able to withdraw HYPE", async function () {
      // Send some HYPE to the contract
      await owner.sendTransaction({
        to: await yourContract.getAddress(),
        value: ethers.parseEther("0.1"),
      });

      // The owner can withdraw
      await expect(yourContract.connect(owner).withdraw()).to.not.be.reverted;

      // Other users cannot withdraw
      await expect(yourContract.connect(user1).withdraw()).to.be.revertedWith(
        "Only the owner can execute this function",
      );
    });
  });

  describe("Data Encoding", function () {
    it("Should create the correct encoding for actions", async function () {
      // This test checks that the internal encoding works correctly
      const asset = 1;
      const isBuy = true;
      const limitPx = 100000000000n;
      const sz = 10000000000n;
      const reduceOnly = false;
      const tif = 2;
      const cloid = 0n;

      await yourContract.connect(user1).sendLimitOrder(asset, isBuy, limitPx, sz, reduceOnly, tif, cloid);

      const action = await yourContract.getAction((await yourContract.actionCounter()) - 1n);
      expect(action.data.length).to.be.greaterThan(4); // Should have at least the 4-byte header
    });
  });
});
