//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

/**
 * CoreWriter contract for hyperEVM testnet
 * Implements the real functionalities of CoreWriter according to the official documentation
 * @author Your Name
 */
contract YourContract {
    // Contract state
    address public immutable owner;
    uint256 public actionCounter = 0;
    mapping(uint256 => Action) public actions;
    mapping(address => uint256[]) public userActions;

    // CoreWriter contract address of the system
    address public constant CORE_WRITER = 0x3333333333333333333333333333333333333333;

    // Structure to represent an action
    struct Action {
        uint256 id;
        address creator;
        string actionType;
        bytes data;
        uint256 timestamp;
        bool executed;
        string result;
    }

    // Available actions according to the documentation
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

    // Events
    event ActionCreated(uint256 indexed actionId, address indexed creator, string actionType, uint256 timestamp);
    event ActionExecuted(uint256 indexed actionId, string result, uint256 timestamp);
    event CoreWriterCall(address indexed caller, string operation, bool success);

    // Modifier for the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can execute this function");
        _;
    }

    // Constructor
    constructor(address _owner) {
        owner = _owner;
        console.log("CoreWriter contract deployed by:", _owner);
    }

    /**
     * Sends a limit order to HyperCore
     * @param asset Asset ID (uint32)
     * @param isBuy true for buy, false for sell
     * @param limitPx limit price (uint64, multiplied by 10^8)
     * @param sz order size (uint64, multiplied by 10^8)
     * @param reduceOnly true for reduce only
     * @param tif order type: 1=Alo, 2=Gtc, 3=Ioc
     * @param cloid order ID (uint128, 0 for no cloid)
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

        console.log("Limit Order sent");
        console.log(asset);
        console.log(isBuy);
        console.log(limitPx);
        console.log(sz);
    }

    /**
     * Transfers funds to/from a vault
     * @param vault vault address
     * @param isDeposit true for deposit, false for withdrawal
     * @param usd amount in USD (uint64)
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
     * Delegates tokens to a validator
     * @param validator validator address
     * @param amount amount in wei (uint64)
     * @param isUndelegate true to undelegate
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
     * Deposits into staking
     * @param amount amount in wei (uint64)
     */
    function sendStakingDeposit(uint64 amount) public {
        bytes memory encodedAction = abi.encode(amount);
        _sendCoreWriterAction(ActionType.STAKING_DEPOSIT, encodedAction);

        console.log("Staking Deposit");
        console.log(amount);
    }

    /**
     * Withdraws from staking
     * @param amount amount in wei (uint64)
     */
    function sendStakingWithdraw(uint64 amount) public {
        bytes memory encodedAction = abi.encode(amount);
        _sendCoreWriterAction(ActionType.STAKING_WITHDRAW, encodedAction);

        console.log("Staking Withdraw");
        console.log(amount);
    }

    /**
     * Sends spot tokens
     * @param destination destination address
     * @param token token ID (uint64)
     * @param amount amount in wei (uint64)
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
     * Transfers USD class
     * @param ntl notional amount (uint64)
     * @param toPerp true to transfer to perp
     */
    function sendUsdClassTransfer(uint64 ntl, bool toPerp) public {
        bytes memory encodedAction = abi.encode(ntl, toPerp);
        _sendCoreWriterAction(ActionType.USD_CLASS_TRANSFER, encodedAction);

        console.log("USD Class Transfer");
        console.log(ntl);
        console.log(toPerp);
    }

    /**
     * Finalizes an EVM contract
     * @param token token ID (uint64)
     * @param variant finalization type: 1=Create, 2=FirstStorageSlot, 3=CustomStorageSlot
     * @param createNonce creation nonce (uint64)
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
     * Adds an API wallet
     * @param apiWallet API wallet address
     * @param apiWalletName API wallet name
     */
    function sendAddApiWallet(address apiWallet, string memory apiWalletName) public {
        bytes memory encodedAction = abi.encode(apiWallet, apiWalletName);
        _sendCoreWriterAction(ActionType.ADD_API_WALLET, encodedAction);

        console.log("Add API Wallet");
        console.log(apiWallet);
        // Cannot log dynamic string apiWalletName
    }

    /**
     * Test function to send a sample limit order
     */
    function testLimitOrder() public {
        // Example: Buy order of 100 units of asset 1 at price 1000
        sendLimitOrder(
            1, // asset ID
            true, // isBuy
            100000000000, // limitPx (1000 * 10^8)
            10000000000, // sz (100 * 10^8)
            false, // reduceOnly
            2, // tif (Gtc)
            0 // cloid (no cloid)
        );
    }

    /**
     * Test function to send a vault transfer
     */
    function testVaultTransfer() public {
        // Example: Deposit 1000 USD in the user's vault
        sendVaultTransfer(
            msg.sender, // vault (own address)
            true, // isDeposit
            1000000000 // usd (1000 * 10^6)
        );
    }

    /**
     * Test function to delegate tokens
     */
    function testTokenDelegate() public {
        // Example: Delegate 1000 wei to validator 0x123...
        sendTokenDelegate(
            0x1234567890123456789012345678901234567890, // validator
            1000000000000000000, // amount (1 HYPE)
            false // isUndelegate
        );
    }

    // Internal functions

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
            console.log("CoreWriter action sent successfully");
        } else {
            emit CoreWriterCall(msg.sender, actionTypeString, false);
            console.log("Error sending CoreWriter action");
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
            result: "CoreWriter action sent"
        });

        userActions[msg.sender].push(actionId);
        actionCounter++;

        emit ActionCreated(actionId, msg.sender, _actionType, block.timestamp);
        console.log("New CoreWriter action created");
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
        require(_actionId < actionCounter, "Action does not exist");
        return actions[_actionId];
    }

    /**
     * Function to receive HYPE
     */
    receive() external payable {}

    /**
     * Function to withdraw HYPE (only owner)
     */
    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{ value: address(this).balance }("");
        require(success, "Failed to send HYPE");
    }
}
