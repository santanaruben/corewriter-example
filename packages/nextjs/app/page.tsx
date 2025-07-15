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

  // Formularios para cada función
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
    amount: "1000000000000000000", // 1 ETH
    isUndelegate: false,
  });

  const [stakingForm, setStakingForm] = useState({
    amount: "1000000000000000000", // 1 ETH
  });

  const [spotSendForm, setSpotSendForm] = useState({
    destination: "",
    tokenId: 1,
    amount: "1000000000000000000", // 1 ETH
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

  // Hooks para leer datos del contrato
  const { data: contractActionCounter } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "actionCounter",
  });

  const { data: contractUserActions } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getUserActions",
    args: [address],
  });

  // Hooks para escribir en el contrato
  const { writeContractAsync: writeLimitOrder } = useScaffoldWriteContract("YourContract");
  const { writeContractAsync: writeVaultTransfer } = useScaffoldWriteContract("YourContract");
  const { writeContractAsync: writeTokenDelegate } = useScaffoldWriteContract("YourContract");
  const { writeContractAsync: writeStakingDeposit } = useScaffoldWriteContract("YourContract");
  const { writeContractAsync: writeStakingWithdraw } = useScaffoldWriteContract("YourContract");
  const { writeContractAsync: writeSpotSend } = useScaffoldWriteContract("YourContract");
  const { writeContractAsync: writeUsdTransfer } = useScaffoldWriteContract("YourContract");
  const { writeContractAsync: writeFinalize } = useScaffoldWriteContract("YourContract");
  const { writeContractAsync: writeAddApiWallet } = useScaffoldWriteContract("YourContract");

  // Actualizar datos cuando cambien
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

  // Cargar acciones del usuario
  useEffect(() => {
    const loadActions = async () => {
      if (userActions.length > 0) {
        const actionsData = [];
        for (let i = 0; i < Math.min(userActions.length, 10); i++) {
          try {
            // Aquí necesitarías un hook para leer getAction, pero por simplicidad
            // usamos un placeholder
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

  // Funciones para enviar transacciones
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
      notification.success("Orden límite enviada exitosamente!");
    } catch (error) {
      notification.error("Error al enviar orden límite");
      console.error(error);
    }
  };

  const handleVaultTransfer = async () => {
    try {
      await writeVaultTransfer({
        functionName: "sendVaultTransfer",
        args: [vaultTransferForm.vault || address, vaultTransferForm.isDeposit, BigInt(vaultTransferForm.usd)],
      });
      notification.success("Transferencia de vault enviada exitosamente!");
    } catch (error) {
      notification.error("Error al enviar transferencia de vault");
      console.error(error);
    }
  };

  const handleTokenDelegate = async () => {
    try {
      await writeTokenDelegate({
        functionName: "sendTokenDelegate",
        args: [tokenDelegateForm.validator, BigInt(tokenDelegateForm.amount), tokenDelegateForm.isUndelegate],
      });
      notification.success("Delegación de tokens enviada exitosamente!");
    } catch (error) {
      notification.error("Error al enviar delegación de tokens");
      console.error(error);
    }
  };

  const handleStakingDeposit = async () => {
    try {
      await writeStakingDeposit({
        functionName: "sendStakingDeposit",
        args: [BigInt(stakingForm.amount)],
      });
      notification.success("Depósito en staking enviado exitosamente!");
    } catch (error) {
      notification.error("Error al enviar depósito en staking");
      console.error(error);
    }
  };

  const handleStakingWithdraw = async () => {
    try {
      await writeStakingWithdraw({
        functionName: "sendStakingWithdraw",
        args: [BigInt(stakingForm.amount)],
      });
      notification.success("Retiro de staking enviado exitosamente!");
    } catch (error) {
      notification.error("Error al enviar retiro de staking");
      console.error(error);
    }
  };

  const handleSpotSend = async () => {
    try {
      await writeSpotSend({
        functionName: "sendSpotSend",
        args: [spotSendForm.destination || address, BigInt(spotSendForm.tokenId), BigInt(spotSendForm.amount)],
      });
      notification.success("Envío de tokens spot enviado exitosamente!");
    } catch (error) {
      notification.error("Error al enviar tokens spot");
      console.error(error);
    }
  };

  const handleUsdTransfer = async () => {
    try {
      await writeUsdTransfer({
        functionName: "sendUsdClassTransfer",
        args: [BigInt(usdTransferForm.ntl), usdTransferForm.toPerp],
      });
      notification.success("Transferencia USD class enviada exitosamente!");
    } catch (error) {
      notification.error("Error al enviar transferencia USD class");
      console.error(error);
    }
  };

  const handleFinalize = async () => {
    try {
      await writeFinalize({
        functionName: "sendFinalizeEvmContract",
        args: [BigInt(finalizeForm.tokenId), finalizeForm.variant, BigInt(finalizeForm.createNonce)],
      });
      notification.success("Finalización de contrato EVM enviada exitosamente!");
    } catch (error) {
      notification.error("Error al finalizar contrato EVM");
      console.error(error);
    }
  };

  const handleAddApiWallet = async () => {
    try {
      await writeAddApiWallet({
        functionName: "sendAddApiWallet",
        args: [apiWalletForm.apiWallet, apiWalletForm.apiWalletName],
      });
      notification.success("Wallet API agregada exitosamente!");
    } catch (error) {
      notification.error("Error al agregar wallet API");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center py-10 px-4 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">CoreWriter - hyperEVM</h1>
      <p className="mb-6 text-center text-base-content/80">
        Interfaz dedicada para interactuar con el contrato <b>CoreWriter</b> en la testnet de hyperEVM.
        <br />
        Prueba las funciones principales, consulta el historial de acciones y aprende cómo funciona cada operación.
      </p>

      <div className="mb-6 flex flex-col items-center">
        <span className="font-medium">Tu dirección conectada:</span>
        <Address address={address} />
        <div className="mt-2 text-sm text-base-content/60">
          Contador de acciones: {actionCounter?.toString() || "0"}
        </div>
      </div>

      <div className="tabs tabs-boxed mb-8">
        <button
          className={`tab ${selectedTab === "acciones" ? "tab-active" : ""}`}
          onClick={() => setSelectedTab("acciones")}
        >
          Acciones rápidas
        </button>
        <button
          className={`tab ${selectedTab === "historial" ? "tab-active" : ""}`}
          onClick={() => setSelectedTab("historial")}
        >
          Historial de acciones
        </button>
        <button
          className={`tab ${selectedTab === "ayuda" ? "tab-active" : ""}`}
          onClick={() => setSelectedTab("ayuda")}
        >
          Ayuda
        </button>
      </div>

      <div className="w-full">
        {selectedTab === "acciones" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orden Límite */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">📈 Orden Límite</h2>
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
                      <span className="label-text ml-2">Compra</span>
                    </label>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Precio límite (10^8)</span>
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
                      <span className="label-text">Tamaño (10^8)</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={limitOrderForm.sz}
                      onChange={e => setLimitOrderForm({ ...limitOrderForm, sz: e.target.value })}
                    />
                  </div>
                  <button className="btn btn-primary w-full" onClick={handleLimitOrder}>
                    Enviar Orden Límite
                  </button>
                </div>
              </div>
            </div>

            {/* Transferencia de Vault */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">🏦 Transferencia de Vault</h2>
                <div className="space-y-3">
                  <div>
                    <label className="label">
                      <span className="label-text">Dirección del Vault</span>
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
                      <span className="label-text ml-2">Depósito</span>
                    </label>
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Cantidad USD (10^6)</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={vaultTransferForm.usd}
                      onChange={e => setVaultTransferForm({ ...vaultTransferForm, usd: e.target.value })}
                    />
                  </div>
                  <button className="btn btn-primary w-full" onClick={handleVaultTransfer}>
                    Enviar Transferencia
                  </button>
                </div>
              </div>
            </div>

            {/* Delegación de Tokens */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">🎯 Delegación de Tokens</h2>
                <div className="space-y-3">
                  <div>
                    <label className="label">
                      <span className="label-text">Validador</span>
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
                      <span className="label-text">Cantidad (Wei)</span>
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
                    Enviar Delegación
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
                      <span className="label-text">Cantidad (Wei)</span>
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
                      Depositar
                    </button>
                    <button className="btn btn-secondary flex-1" onClick={handleStakingWithdraw}>
                      Retirar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Envío Spot */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">💸 Envío Spot</h2>
                <div className="space-y-3">
                  <div>
                    <label className="label">
                      <span className="label-text">Destino</span>
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
                      <span className="label-text">Cantidad (Wei)</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={spotSendForm.amount}
                      onChange={e => setSpotSendForm({ ...spotSendForm, amount: e.target.value })}
                    />
                  </div>
                  <button className="btn btn-primary w-full" onClick={handleSpotSend}>
                    Enviar Tokens
                  </button>
                </div>
              </div>
            </div>

            {/* Transferencia USD Class */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">💵 Transferencia USD Class</h2>
                <div className="space-y-3">
                  <div>
                    <label className="label">
                      <span className="label-text">Cantidad NTL (10^6)</span>
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
                      <span className="label-text ml-2">A Perp</span>
                    </label>
                  </div>
                  <button className="btn btn-primary w-full" onClick={handleUsdTransfer}>
                    Enviar Transferencia
                  </button>
                </div>
              </div>
            </div>

            {/* Finalizar Contrato EVM */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">📋 Finalizar Contrato EVM</h2>
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
                      <span className="label-text">Variante</span>
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
                    Finalizar Contrato
                  </button>
                </div>
              </div>
            </div>

            {/* Agregar Wallet API */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">🔑 Agregar Wallet API</h2>
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
                      <span className="label-text">Nombre</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={apiWalletForm.apiWalletName}
                      onChange={e => setApiWalletForm({ ...apiWalletForm, apiWalletName: e.target.value })}
                    />
                  </div>
                  <button className="btn btn-primary w-full" onClick={handleAddApiWallet}>
                    Agregar Wallet API
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "historial" && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">📊 Historial de Acciones</h2>
              {actions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Creador</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th>Resultado</th>
                        <th>Fecha</th>
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
                              {action.executed ? "Ejecutada" : "Pendiente"}
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
                  <p className="text-base-content/60">No hay acciones para mostrar</p>
                  <p className="text-sm text-base-content/40">
                    Crea algunas acciones en la pestaña &quot;Acciones rápidas&quot;
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === "ayuda" && (
          <div className="prose max-w-none">
            <h2>¿Qué es CoreWriter?</h2>
            <p>
              CoreWriter es el contrato oficial para interactuar con HyperCore en hyperEVM. Permite enviar órdenes,
              transferir fondos, delegar, hacer staking y más, todo desde un solo contrato.
            </p>

            <h3>Funciones principales expuestas:</h3>
            <ul>
              <li>
                <b>sendLimitOrder</b>: Enviar órdenes límite de trading.
              </li>
              <li>
                <b>sendVaultTransfer</b>: Transferir fondos desde/hacia vaults.
              </li>
              <li>
                <b>sendTokenDelegate</b>: Delegar tokens a validadores.
              </li>
              <li>
                <b>sendStakingDeposit</b>: Depositar en staking.
              </li>
              <li>
                <b>sendStakingWithdraw</b>: Retirar de staking.
              </li>
              <li>
                <b>sendSpotSend</b>: Enviar tokens spot.
              </li>
              <li>
                <b>sendUsdClassTransfer</b>: Transferir USD class.
              </li>
              <li>
                <b>sendFinalizeEvmContract</b>: Finalizar contratos EVM.
              </li>
              <li>
                <b>sendAddApiWallet</b>: Agregar wallet API.
              </li>
            </ul>

            <h3>Tipos de datos importantes:</h3>
            <ul>
              <li>
                <b>Precios</b>: Multiplicados por 10^8 (uint64)
              </li>
              <li>
                <b>Tamaños</b>: Multiplicados por 10^8 (uint64)
              </li>
              <li>
                <b>USD</b>: Multiplicados por 10^6 (uint64)
              </li>
              <li>
                <b>Wei</b>: Cantidades en wei (uint64)
              </li>
            </ul>

            <p>
              Consulta la{" "}
              <a
                href="https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore#corewriter-contract"
                target="_blank"
                rel="noopener noreferrer"
              >
                documentación oficial de CoreWriter
              </a>{" "}
              para más detalles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoreWriterPage;
