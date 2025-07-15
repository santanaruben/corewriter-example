"use client";

import { useEffect, useState } from "react";
import { Address } from "../components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "../hooks/scaffold-eth";
import { notification } from "../utils/scaffold-eth";
import { useAccount } from "wagmi";

const CoreWriterPage = () => {
  const { address } = useAccount();
  const [selectedTab, setSelectedTab] = useState("acciones");
  const [actionCounter, setActionCounter] = useState<bigint>(0n);
  const [userActions, setUserActions] = useState<bigint[]>([]);
  const [actions, setActions] = useState<any[]>([]);

  // Forms for each function
  const [limitOrderForm, setLimitOrderForm] = useState({
    asset: 1,
    isBuy: true,
    limitPx: "100000000000", // 1000 * 10^8
    sz: "10000000000", // 100 * 10^8
    reduceOnly: false,
    tif: 2, // Gtc
    cloid: "0",
  });

  const [vaultTransferForm, setVaultTransferForm] = useState({
    vault: "",
    isDeposit: true,
    usd: "1000000000", // 1000 * 10^6
  });

  const [tokenDelegateForm, setTokenDelegateForm] = useState({
    validator: "0x1234567890123456789012345678901234567890",
    amount: "1000000000000000000", // 1 HYPE
    isUndelegate: false,
  });

  const [stakingForm, setStakingForm] = useState({
    amount: "1000000000000000000", // 1 HYPE
  });

  const [spotSendForm, setSpotSendForm] = useState({
    destination: "",
    tokenId: 1,
    amount: "1000000000000000000", // 1 HYPE
  });

  const [usdTransferForm, setUsdTransferForm] = useState({
    ntl: "1000000000", // 1000 * 10^6
    toPerp: true,
  });

  const [finalizeForm, setFinalizeForm] = useState({
    tokenId: 1,
    variant: 1, // Create
    createNonce: 0,
  });

  const [apiWalletForm, setApiWalletForm] = useState({
    apiWallet: "0xabcdef1234567890abcdef1234567890abcdef12",
    apiWalletName: "Test API Wallet",
  });

  // Hooks to read contract data
  const { data: contractActionCounter } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "actionCounter",
  });

  const { data: contractUserActions } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getUserActions",
    args: [address],
  });

  // Hooks to write to the contract
  const { writeContractAsync: writeLimitOrder } = useScaffoldWriteContract("YourContract");
  const { writeContractAsync: writeVaultTransfer } = useScaffoldWriteContract("YourContract");
  const { writeContractAsync: writeTokenDelegate } = useScaffoldWriteContract("YourContract");
  const { writeContractAsync: writeStakingDeposit } = useScaffoldWriteContract("YourContract");
  const { writeContractAsync: writeStakingWithdraw } = useScaffoldWriteContract("YourContract");
  const { writeContractAsync: writeSpotSend } = useScaffoldWriteContract("YourContract");
  const { writeContractAsync: writeUsdTransfer } = useScaffoldWriteContract("YourContract");
  const { writeContractAsync: writeFinalize } = useScaffoldWriteContract("YourContract");
  const { writeContractAsync: writeAddApiWallet } = useScaffoldWriteContract("YourContract");

  // Update data when it changes
  useEffect(() => {
    if (contractActionCounter !== undefined) {
      setActionCounter(contractActionCounter);
    }
  }, [contractActionCounter]);

  useEffect(() => {
    if (contractUserActions) {
      setUserActions([...contractUserActions]);
    }
  }, [contractUserActions]);

  // Load user actions
  useEffect(() => {
    const loadActions = async () => {
      if (userActions.length > 0) {
        const actionsData = [];
        for (let i = 0; i < Math.min(userActions.length, 10); i++) {
          try {
            // Here you would need a hook to read getAction, but for simplicity
            // we use a placeholder
            actionsData.push({
              id: userActions[i],
              creator: address,
              actionType: "CoreWriter Action",
              executed: true,
              result: "Success",
              timestamp: Date.now() / 1000,
            });
          } catch (error) {
            console.error("Error loading action:", error);
          }
        }
        setActions(actionsData);
      }
    };
    loadActions();
  }, [userActions, address]);

  // Functions to send transactions
  const handleLimitOrder = async () => {
    try {
      await writeLimitOrder({
        functionName: "sendLimitOrder",
        args: [
          limitOrderForm.asset,
          limitOrderForm.isBuy,
          BigInt(limitOrderForm.limitPx),
          BigInt(limitOrderForm.sz),
          limitOrderForm.reduceOnly,
          limitOrderForm.tif,
          BigInt(limitOrderForm.cloid),
        ],
      });
      notification.success("Limit order sent successfully!");
    } catch (error) {
      notification.error("Error sending limit order");
      console.error(error);
    }
  };

  const handleVaultTransfer = async () => {
    try {
      await writeVaultTransfer({
        functionName: "sendVaultTransfer",
        args: [vaultTransferForm.vault || address, vaultTransferForm.isDeposit, BigInt(vaultTransferForm.usd)],
      });
      notification.success("Vault transfer sent successfully!");
    } catch (error) {
      notification.error("Error sending vault transfer");
      console.error(error);
    }
  };

  const handleTokenDelegate = async () => {
    try {
      await writeTokenDelegate({
        functionName: "sendTokenDelegate",
        args: [tokenDelegateForm.validator, BigInt(tokenDelegateForm.amount), tokenDelegateForm.isUndelegate],
      });
      notification.success("Token delegation sent successfully!");
    } catch (error) {
      notification.error("Error sending token delegation");
      console.error(error);
    }
  };

  const handleStakingDeposit = async () => {
    try {
      await writeStakingDeposit({
        functionName: "sendStakingDeposit",
        args: [BigInt(stakingForm.amount)],
      });
      notification.success("Staking deposit sent successfully!");
    } catch (error) {
      notification.error("Error sending staking deposit");
      console.error(error);
    }
  };

  const handleStakingWithdraw = async () => {
    try {
      await writeStakingWithdraw({
        functionName: "sendStakingWithdraw",
        args: [BigInt(stakingForm.amount)],
      });
      notification.success("Staking withdrawal sent successfully!");
    } catch (error) {
      notification.error("Error sending staking withdrawal");
      console.error(error);
    }
  };

  const handleSpotSend = async () => {
    try {
      await writeSpotSend({
        functionName: "sendSpotSend",
        args: [spotSendForm.destination || address, BigInt(spotSendForm.tokenId), BigInt(spotSendForm.amount)],
      });
      notification.success("Spot token send sent successfully!");
    } catch (error) {
      notification.error("Error sending spot tokens");
      console.error(error);
    }
  };

  const handleUsdTransfer = async () => {
    try {
      await writeUsdTransfer({
        functionName: "sendUsdClassTransfer",
        args: [BigInt(usdTransferForm.ntl), usdTransferForm.toPerp],
      });
      notification.success("USD class transfer sent successfully!");
    } catch (error) {
      notification.error("Error sending USD class transfer");
      console.error(error);
    }
  };

  const handleFinalize = async () => {
    try {
      await writeFinalize({
        functionName: "sendFinalizeEvmContract",
        args: [BigInt(finalizeForm.tokenId), finalizeForm.variant, BigInt(finalizeForm.createNonce)],
      });
      notification.success("EVM contract finalization sent successfully!");
    } catch (error) {
      notification.error("Error finalizing EVM contract");
      console.error(error);
    }
  };

  const handleAddApiWallet = async () => {
    try {
      await writeAddApiWallet({
        functionName: "sendAddApiWallet",
        args: [apiWalletForm.apiWallet, apiWalletForm.apiWalletName],
      });
      notification.success("API wallet added successfully!");
    } catch (error) {
      notification.error("Error adding API wallet");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center py-10 px-4 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">CoreWriter - hyperEVM</h1>
      <p className="mb-6 text-center text-base-content/80">
        Dedicated interface to interact with the <b>CoreWriter</b> contract on the hyperEVM testnet.
        <br />
        Test the main functions, check the action history, and learn how each operation works.
      </p>

      <div className="mb-6 flex flex-col items-center">
        <span className="font-medium">Your connected address:</span>
        <Address address={address} />
        <div className="mt-2 text-sm text-base-content/60">Action counter: {actionCounter?.toString() || "0"}</div>
      </div>

      <div className="tabs tabs-boxed mb-8">
        <button
          className={`tab ${selectedTab === "acciones" ? "tab-active" : ""}`}
          onClick={() => setSelectedTab("acciones")}
        >
          Quick Actions
        </button>
        <button
          className={`tab ${selectedTab === "historial" ? "tab-active" : ""}`}
          onClick={() => setSelectedTab("historial")}
        >
          Action History
        </button>
        <button
          className={`tab ${selectedTab === "ayuda" ? "tab-active" : ""}`}
          onClick={() => setSelectedTab("ayuda")}
        >
          Help
        </button>
      </div>

      <div className="w-full">
        {selectedTab === "acciones" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Limit Order */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">📈 Limit Order</h2>
                <div className="space-y-3">
                  <div>
                    <label className="label">
                      <span className="label-text">Asset ID</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={limitOrderForm.asset}
                      onChange={e => setLimitOrderForm({ ...limitOrderForm, asset: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <label className="label cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={limitOrderForm.isBuy}
                        onChange={e => setLimitOrderForm({ ...limitOrderForm, isBuy: e.target.checked })}
                      />
                      <span className="label-text ml-2">Buy</span>
                    </label>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Limit Price (10^8)</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={limitOrderForm.limitPx}
                      onChange={e => setLimitOrderForm({ ...limitOrderForm, limitPx: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Size (10^8)</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={limitOrderForm.sz}
                      onChange={e => setLimitOrderForm({ ...limitOrderForm, sz: e.target.value })}
                    />
                  </div>
                  <button className="btn btn-primary w-full" onClick={handleLimitOrder}>
                    Send Limit Order
                  </button>
                </div>
              </div>
            </div>

            {/* Vault Transfer */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">🏦 Vault Transfer</h2>
                <div className="space-y-3">
                  <div>
                    <label className="label">
                      <span className="label-text">Vault Address</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      placeholder={address}
                      value={vaultTransferForm.vault}
                      onChange={e => setVaultTransferForm({ ...vaultTransferForm, vault: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <label className="label cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={vaultTransferForm.isDeposit}
                        onChange={e => setVaultTransferForm({ ...vaultTransferForm, isDeposit: e.target.checked })}
                      />
                      <span className="label-text ml-2">Deposit</span>
                    </label>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Amount USD (10^6)</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={vaultTransferForm.usd}
                      onChange={e => setVaultTransferForm({ ...vaultTransferForm, usd: e.target.value })}
                    />
                  </div>
                  <button className="btn btn-primary w-full" onClick={handleVaultTransfer}>
                    Send Transfer
                  </button>
                </div>
              </div>
            </div>

            {/* Token Delegation */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">🎯 Token Delegation</h2>
                <div className="space-y-3">
                  <div>
                    <label className="label">
                      <span className="label-text">Validator</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={tokenDelegateForm.validator}
                      onChange={e => setTokenDelegateForm({ ...tokenDelegateForm, validator: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Amount (Wei)</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={tokenDelegateForm.amount}
                      onChange={e => setTokenDelegateForm({ ...tokenDelegateForm, amount: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <label className="label cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={tokenDelegateForm.isUndelegate}
                        onChange={e => setTokenDelegateForm({ ...tokenDelegateForm, isUndelegate: e.target.checked })}
                      />
                      <span className="label-text ml-2">Undelegate</span>
                    </label>
                  </div>
                  <button className="btn btn-primary w-full" onClick={handleTokenDelegate}>
                    Send Delegation
                  </button>
                </div>
              </div>
            </div>

            {/* Staking */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">🔒 Staking</h2>
                <div className="space-y-3">
                  <div>
                    <label className="label">
                      <span className="label-text">Amount (Wei)</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={stakingForm.amount}
                      onChange={e => setStakingForm({ ...stakingForm, amount: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-primary flex-1" onClick={handleStakingDeposit}>
                      Deposit
                    </button>
                    <button className="btn btn-secondary flex-1" onClick={handleStakingWithdraw}>
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Spot Send */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">💸 Spot Send</h2>
                <div className="space-y-3">
                  <div>
                    <label className="label">
                      <span className="label-text">Destination</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      placeholder={address}
                      value={spotSendForm.destination}
                      onChange={e => setSpotSendForm({ ...spotSendForm, destination: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Token ID</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={spotSendForm.tokenId}
                      onChange={e => setSpotSendForm({ ...spotSendForm, tokenId: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Amount (Wei)</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={spotSendForm.amount}
                      onChange={e => setSpotSendForm({ ...spotSendForm, amount: e.target.value })}
                    />
                  </div>
                  <button className="btn btn-primary w-full" onClick={handleSpotSend}>
                    Send Tokens
                  </button>
                </div>
              </div>
            </div>

            {/* USD Class Transfer */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">💵 USD Class Transfer</h2>
                <div className="space-y-3">
                  <div>
                    <label className="label">
                      <span className="label-text">NTL Amount (10^6)</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={usdTransferForm.ntl}
                      onChange={e => setUsdTransferForm({ ...usdTransferForm, ntl: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <label className="label cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={usdTransferForm.toPerp}
                        onChange={e => setUsdTransferForm({ ...usdTransferForm, toPerp: e.target.checked })}
                      />
                      <span className="label-text ml-2">To Perp</span>
                    </label>
                  </div>
                  <button className="btn btn-primary w-full" onClick={handleUsdTransfer}>
                    Send Transfer
                  </button>
                </div>
              </div>
            </div>

            {/* Finalize EVM Contract */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">📋 Finalize EVM Contract</h2>
                <div className="space-y-3">
                  <div>
                    <label className="label">
                      <span className="label-text">Token ID</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={finalizeForm.tokenId}
                      onChange={e => setFinalizeForm({ ...finalizeForm, tokenId: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Variant</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={finalizeForm.variant}
                      onChange={e => setFinalizeForm({ ...finalizeForm, variant: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Create Nonce</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={finalizeForm.createNonce}
                      onChange={e => setFinalizeForm({ ...finalizeForm, createNonce: parseInt(e.target.value) })}
                    />
                  </div>
                  <button className="btn btn-primary w-full" onClick={handleFinalize}>
                    Finalize Contract
                  </button>
                </div>
              </div>
            </div>

            {/* Add API Wallet */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">🔑 Add API Wallet</h2>
                <div className="space-y-3">
                  <div>
                    <label className="label">
                      <span className="label-text">API Wallet Address</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={apiWalletForm.apiWallet}
                      onChange={e => setApiWalletForm({ ...apiWalletForm, apiWallet: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={apiWalletForm.apiWalletName}
                      onChange={e => setApiWalletForm({ ...apiWalletForm, apiWalletName: e.target.value })}
                    />
                  </div>
                  <button className="btn btn-primary w-full" onClick={handleAddApiWallet}>
                    Add API Wallet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "historial" && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">📊 Action History</h2>
              {actions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Creator</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Result</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {actions.map((action, index) => (
                        <tr key={index}>
                          <td>{action.id.toString()}</td>
                          <td>
                            <Address address={action.creator} />
                          </td>
                          <td>{action.actionType}</td>
                          <td>
                            <span className={`badge ${action.executed ? "badge-success" : "badge-warning"}`}>
                              {action.executed ? "Executed" : "Pending"}
                            </span>
                          </td>
                          <td>{action.result}</td>
                          <td>{new Date(Number(action.timestamp) * 1000).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-base-content/60">No actions to display</p>
                  <p className="text-sm text-base-content/40">
                    Create some actions in the &quot;Quick Actions&quot; tab
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === "ayuda" && (
          <div className="prose max-w-none">
            <h2>What is CoreWriter?</h2>
            <p>
              CoreWriter is the official contract to interact with HyperCore on hyperEVM. It allows you to send orders,
              transfer funds, delegate, stake, and more, all from a single contract.
            </p>

            <h3>Main exposed functions:</h3>
            <ul>
              <li>
                <b>sendLimitOrder</b>: Send trading limit orders.
              </li>
              <li>
                <b>sendVaultTransfer</b>: Transfer funds to/from vaults.
              </li>
              <li>
                <b>sendTokenDelegate</b>: Delegate tokens to validators.
              </li>
              <li>
                <b>sendStakingDeposit</b>: Deposit into staking.
              </li>
              <li>
                <b>sendStakingWithdraw</b>: Withdraw from staking.
              </li>
              <li>
                <b>sendSpotSend</b>: Send spot tokens.
              </li>
              <li>
                <b>sendUsdClassTransfer</b>: Transfer USD class.
              </li>
              <li>
                <b>sendFinalizeEvmContract</b>: Finalize EVM contracts.
              </li>
              <li>
                <b>sendAddApiWallet</b>: Add API wallet.
              </li>
            </ul>

            <h3>Important data types:</h3>
            <ul>
              <li>
                <b>Prices</b>: Multiplied by 10^8 (uint64)
              </li>
              <li>
                <b>Sizes</b>: Multiplied by 10^8 (uint64)
              </li>
              <li>
                <b>USD</b>: Multiplied by 10^6 (uint64)
              </li>
              <li>
                <b>Wei</b>: Amounts in wei (uint64)
              </li>
            </ul>

            <p>
              See the{" "}
              <a
                href="https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore#corewriter-contract"
                target="_blank"
                rel="noopener noreferrer"
              >
                official CoreWriter documentation
              </a>{" "}
              for more details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoreWriterPage;
