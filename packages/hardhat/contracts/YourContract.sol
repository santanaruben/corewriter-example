//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

/**
 * Contrato CoreWriter para hyperEVM testnet
 * Implementa las funcionalidades reales de CoreWriter según la documentación oficial
 * @author Tu Nombre
 */
contract YourContract {
    // Estado del contrato
    address public immutable owner;
    uint256 public actionCounter = 0;
    mapping(uint256 => Action) public actions;
    mapping(address => uint256[]) public userActions;

    // Dirección del contrato CoreWriter del sistema
    address public constant CORE_WRITER = 0x3333333333333333333333333333333333333333;

    // Estructura para representar una acción
    struct Action {
        uint256 id;
        address creator;
        string actionType;
        bytes data;
        uint256 timestamp;
        bool executed;
        string result;
    }

    // Acciones disponibles según la documentación
    enum ActionType {
        LIMIT_ORDER, // 1
        VAULT_TRANSFER, // 2
        TOKEN_DELEGATE, // 3
        STAKING_DEPOSIT, // 4
        STAKING_WITHDRAW, // 5
        SPOT_SEND, // 6
        USD_CLASS_TRANSFER, // 7
        FINALIZE_EVM_CONTRACT, // 8
        ADD_API_WALLET // 9
    }

    // Eventos
    event ActionCreated(uint256 indexed actionId, address indexed creator, string actionType, uint256 timestamp);
    event ActionExecuted(uint256 indexed actionId, string result, uint256 timestamp);
    event CoreWriterCall(address indexed caller, string operation, bool success);

    // Modificador para el propietario
    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el propietario puede ejecutar esta funcion");
        _;
    }

    // Constructor
    constructor(address _owner) {
        owner = _owner;
        console.log("Contrato CoreWriter desplegado por:", _owner);
    }

    /**
     * Envía una orden límite a HyperCore
     * @param asset ID del activo (uint32)
     * @param isBuy true para compra, false para venta
     * @param limitPx precio límite (uint64, multiplicado por 10^8)
     * @param sz tamaño de la orden (uint64, multiplicado por 10^8)
     * @param reduceOnly true para reducir solo
     * @param tif tipo de orden: 1=Alo, 2=Gtc, 3=Ioc
     * @param cloid ID de la orden (uint128, 0 para sin cloid)
     */
    function sendLimitOrder(
        uint32 asset,
        bool isBuy,
        uint64 limitPx,
        uint64 sz,
        bool reduceOnly,
        uint8 tif,
        uint128 cloid
    ) public {
        bytes memory encodedAction = abi.encode(asset, isBuy, limitPx, sz, reduceOnly, tif, cloid);
        _sendCoreWriterAction(ActionType.LIMIT_ORDER, encodedAction);

        console.log("Limit Order enviada");
        console.log(asset);
        console.log(isBuy);
        console.log(limitPx);
        console.log(sz);
    }

    /**
     * Transfiere fondos desde/hacia un vault
     * @param vault dirección del vault
     * @param isDeposit true para depósito, false para retiro
     * @param usd cantidad en USD (uint64)
     */
    function sendVaultTransfer(address vault, bool isDeposit, uint64 usd) public {
        bytes memory encodedAction = abi.encode(vault, isDeposit, usd);
        _sendCoreWriterAction(ActionType.VAULT_TRANSFER, encodedAction);

        console.log("Vault Transfer");
        console.log(vault);
        console.log(isDeposit);
        console.log(usd);
    }

    /**
     * Delega tokens a un validador
     * @param validator dirección del validador
     * @param amount cantidad en wei (uint64)
     * @param isUndelegate true para des-delegar
     */
    function sendTokenDelegate(address validator, uint64 amount, bool isUndelegate) public {
        bytes memory encodedAction = abi.encode(validator, amount, isUndelegate);
        _sendCoreWriterAction(ActionType.TOKEN_DELEGATE, encodedAction);

        console.log("Token Delegate");
        console.log(validator);
        console.log(amount);
        console.log(isUndelegate);
    }

    /**
     * Deposita en staking
     * @param amount cantidad en wei (uint64)
     */
    function sendStakingDeposit(uint64 amount) public {
        bytes memory encodedAction = abi.encode(amount);
        _sendCoreWriterAction(ActionType.STAKING_DEPOSIT, encodedAction);

        console.log("Staking Deposit");
        console.log(amount);
    }

    /**
     * Retira de staking
     * @param amount cantidad en wei (uint64)
     */
    function sendStakingWithdraw(uint64 amount) public {
        bytes memory encodedAction = abi.encode(amount);
        _sendCoreWriterAction(ActionType.STAKING_WITHDRAW, encodedAction);

        console.log("Staking Withdraw");
        console.log(amount);
    }

    /**
     * Envía tokens spot
     * @param destination dirección de destino
     * @param token ID del token (uint64)
     * @param amount cantidad en wei (uint64)
     */
    function sendSpotSend(address destination, uint64 token, uint64 amount) public {
        bytes memory encodedAction = abi.encode(destination, token, amount);
        _sendCoreWriterAction(ActionType.SPOT_SEND, encodedAction);

        console.log("Spot Send");
        console.log(destination);
        console.log(token);
        console.log(amount);
    }

    /**
     * Transfiere USD class
     * @param ntl cantidad notional (uint64)
     * @param toPerp true para transferir a perp
     */
    function sendUsdClassTransfer(uint64 ntl, bool toPerp) public {
        bytes memory encodedAction = abi.encode(ntl, toPerp);
        _sendCoreWriterAction(ActionType.USD_CLASS_TRANSFER, encodedAction);

        console.log("USD Class Transfer");
        console.log(ntl);
        console.log(toPerp);
    }

    /**
     * Finaliza un contrato EVM
     * @param token ID del token (uint64)
     * @param variant tipo de finalización: 1=Create, 2=FirstStorageSlot, 3=CustomStorageSlot
     * @param createNonce nonce de creación (uint64)
     */
    function sendFinalizeEvmContract(uint64 token, uint8 variant, uint64 createNonce) public {
        bytes memory encodedAction = abi.encode(token, variant, createNonce);
        _sendCoreWriterAction(ActionType.FINALIZE_EVM_CONTRACT, encodedAction);

        console.log("Finalize EVM Contract");
        console.log(token);
        console.log(variant);
        console.log(createNonce);
    }

    /**
     * Agrega una wallet API
     * @param apiWallet dirección de la wallet API
     * @param apiWalletName nombre de la wallet API
     */
    function sendAddApiWallet(address apiWallet, string memory apiWalletName) public {
        bytes memory encodedAction = abi.encode(apiWallet, apiWalletName);
        _sendCoreWriterAction(ActionType.ADD_API_WALLET, encodedAction);

        console.log("Add API Wallet");
        console.log(apiWallet);
        // No se puede loggear string dinámico apiWalletName
    }

    /**
     * Función de prueba para enviar una orden límite de ejemplo
     */
    function testLimitOrder() public {
        // Ejemplo: Orden de compra de 100 unidades del activo 1 a precio 1000
        sendLimitOrder(
            1, // asset ID
            true, // isBuy
            100000000000, // limitPx (1000 * 10^8)
            10000000000, // sz (100 * 10^8)
            false, // reduceOnly
            2, // tif (Gtc)
            0 // cloid (sin cloid)
        );
    }

    /**
     * Función de prueba para enviar una transferencia de vault
     */
    function testVaultTransfer() public {
        // Ejemplo: Depositar 1000 USD en el vault del usuario
        sendVaultTransfer(
            msg.sender, // vault (propio address)
            true, // isDeposit
            1000000000 // usd (1000 * 10^6)
        );
    }

    /**
     * Función de prueba para delegar tokens
     */
    function testTokenDelegate() public {
        // Ejemplo: Delegar 1000 wei al validador 0x123...
        sendTokenDelegate(
            0x1234567890123456789012345678901234567890, // validator
            1000000000000000000, // amount (1 ETH)
            false // isUndelegate
        );
    }

    // Funciones internas

    function _sendCoreWriterAction(ActionType actionType, bytes memory encodedAction) internal {
        // Construir el encoding según la documentación
        bytes memory data = new bytes(4 + encodedAction.length);
        data[0] = 0x01; // Encoding version 1
        data[1] = 0x00; // Action ID byte 1
        data[2] = 0x00; // Action ID byte 2
        data[3] = bytes1(uint8(actionType)); // Action ID byte 3

        // Copiar los datos de la acción
        for (uint256 i = 0; i < encodedAction.length; i++) {
            data[4 + i] = encodedAction[i];
        }

        // Llamar al contrato CoreWriter del sistema
        (bool success, ) = CORE_WRITER.call(data);

        // Crear registro de la acción
        string memory actionTypeString = _getActionTypeString(actionType);
        _createAction(actionTypeString, data);

        if (success) {
            emit CoreWriterCall(msg.sender, actionTypeString, true);
            console.log("CoreWriter action enviada exitosamente");
        } else {
            emit CoreWriterCall(msg.sender, actionTypeString, false);
            console.log("Error al enviar CoreWriter action");
        }
    }

    function _createAction(string memory _actionType, bytes memory _data) internal {
        uint256 actionId = actionCounter;

        actions[actionId] = Action({
            id: actionId,
            creator: msg.sender,
            actionType: _actionType,
            data: _data,
            timestamp: block.timestamp,
            executed: true, // Las acciones de CoreWriter se ejecutan inmediatamente
            result: "CoreWriter action enviada"
        });

        userActions[msg.sender].push(actionId);
        actionCounter++;

        emit ActionCreated(actionId, msg.sender, _actionType, block.timestamp);
        console.log("Nueva accion CoreWriter creada");
        console.log(actionId);
    }

    function _getActionTypeString(ActionType _actionType) internal pure returns (string memory) {
        if (_actionType == ActionType.LIMIT_ORDER) return "LIMIT_ORDER";
        if (_actionType == ActionType.VAULT_TRANSFER) return "VAULT_TRANSFER";
        if (_actionType == ActionType.TOKEN_DELEGATE) return "TOKEN_DELEGATE";
        if (_actionType == ActionType.STAKING_DEPOSIT) return "STAKING_DEPOSIT";
        if (_actionType == ActionType.STAKING_WITHDRAW) return "STAKING_WITHDRAW";
        if (_actionType == ActionType.SPOT_SEND) return "SPOT_SEND";
        if (_actionType == ActionType.USD_CLASS_TRANSFER) return "USD_CLASS_TRANSFER";
        if (_actionType == ActionType.FINALIZE_EVM_CONTRACT) return "FINALIZE_EVM_CONTRACT";
        if (_actionType == ActionType.ADD_API_WALLET) return "ADD_API_WALLET";
        return "UNKNOWN";
    }

    // Funciones de consulta (mantenidas del contrato anterior)

    function getUserActions(address _user) public view returns (uint256[] memory) {
        return userActions[_user];
    }

    function getAction(uint256 _actionId) public view returns (Action memory) {
        require(_actionId < actionCounter, "Accion no existe");
        return actions[_actionId];
    }

    /**
     * Función para recibir ETH
     */
    receive() external payable {}

    /**
     * Función para retirar ETH (solo propietario)
     */
    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{ value: address(this).balance }("");
        require(success, "Fallo al enviar ETH");
    }
}
