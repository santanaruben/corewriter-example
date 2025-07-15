# 🚀 Contrato CoreWriter para hyperEVM Testnet

Este proyecto contiene un contrato inteligente diseñado para probar y validar la funcionalidad de **CoreWriter** en la testnet de **hyperEVM**, implementando las funcionalidades reales según la [documentación oficial](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore#corewriter-contract).

## 📋 Características del Contrato

### 🎯 Funcionalidades Principales

1. **Integración Real con CoreWriter**: Llamadas directas al contrato CoreWriter del sistema en `0x3333333333333333333333333333333333333333`
2. **Órdenes Límite**: Envío de órdenes de trading a HyperCore
3. **Transferencias de Vault**: Gestión de fondos en vaults
4. **Delegación de Tokens**: Delegación a validadores
5. **Staking**: Depósitos y retiros de staking
6. **Transferencias Spot**: Envío de tokens entre direcciones
7. **Transferencias USD Class**: Gestión de USD entre perp y spot
8. **Finalización de Contratos EVM**: Finalización de contratos en HyperCore
9. **Gestión de API Wallets**: Agregar wallets API

### 🔧 Acciones Disponibles

#### Funciones de CoreWriter (según documentación oficial)
- `sendLimitOrder()` - Enviar órdenes límite a HyperCore
- `sendVaultTransfer()` - Transferir fondos desde/hacia vaults
- `sendTokenDelegate()` - Delegar tokens a validadores
- `sendStakingDeposit()` - Depositar en staking
- `sendStakingWithdraw()` - Retirar de staking
- `sendSpotSend()` - Enviar tokens spot
- `sendUsdClassTransfer()` - Transferir USD class
- `sendFinalizeEvmContract()` - Finalizar contratos EVM
- `sendAddApiWallet()` - Agregar wallet API

#### Funciones de Prueba
- `testLimitOrder()` - Ejemplo de orden límite
- `testVaultTransfer()` - Ejemplo de transferencia de vault
- `testTokenDelegate()` - Ejemplo de delegación de tokens

## 🛠️ Configuración y Despliegue

### Prerrequisitos
- Node.js >= 20.18.3
- Yarn
- Cuenta con ETH en hyperEVM testnet

### 1. Instalación de Dependencias
```bash
yarn install
```

### 2. Configuración de la Cuenta
```bash
# Generar una nueva cuenta
yarn generate

# O importar una cuenta existente
yarn account:import
```

### 3. Configurar MNEMONIC
Edita el archivo `packages/hardhat/.env` y agrega tu mnemonic:
```env
MNEMONIC="tu mnemonic de 12 palabras aquí"
```

### 4. Verificar Saldo
```bash
# Verificar saldo en hyperEVM testnet
yarn account --network hyperevmTestnet
```

### 5. Despliegue Local (Desarrollo)
```bash
# Iniciar red local
yarn chain

# En otra terminal, desplegar contrato
yarn deploy
```

### 6. Despliegue en hyperEVM Testnet
```bash
# Desplegar en hyperEVM testnet
yarn deploy --network hyperevmTestnet

# O usar el script específico
yarn deploy --tags HyperEVM --network hyperevmTestnet
```

## 🧪 Pruebas

### Ejecutar Pruebas Locales
```bash
yarn test
```

### Ejecutar Pruebas Específicas
```bash
yarn hardhat:test --grep "CoreWriter"
```

## 🎮 Interacción con el Contrato

### Desde el Frontend
1. Inicia el frontend: `yarn start`
2. Ve a `http://localhost:3000/debug`
3. Conecta tu wallet
4. Interactúa con las funciones del contrato

### Desde la Línea de Comandos
```bash
# Ejecutar script de interacción
yarn hardhat run scripts/interact.ts --network hyperevmTestnet
```

### Verificar Cuenta
```bash
# Verificar qué cuenta se está usando
yarn hardhat run scripts/checkAccount.ts --network hyperevmTestnet
```

## 📊 Estructura del Contrato

### Variables de Estado
- `owner`: Dirección del propietario del contrato
- `actionCounter`: Contador total de acciones creadas
- `actions`: Mapping de ID de acción a estructura Action
- `userActions`: Mapping de usuario a array de IDs de acciones
- `CORE_WRITER`: Dirección del contrato CoreWriter del sistema

### Estructura Action
```solidity
struct Action {
    uint256 id;           // ID único de la acción
    address creator;      // Dirección del creador
    string actionType;    // Tipo de acción
    bytes data;          // Datos de la acción (encoding de CoreWriter)
    uint256 timestamp;   // Timestamp de creación
    bool executed;       // Estado de ejecución (siempre true para CoreWriter)
    string result;       // Resultado de la ejecución
}
```

### Encoding de CoreWriter
El contrato implementa el encoding correcto según la documentación:
- Byte 0: Versión de encoding (0x01)
- Bytes 1-2: Action ID (0x0000)
- Byte 3: Tipo de acción (1-9)
- Bytes 4+: Datos específicos de la acción

## 🔍 Eventos Emitidos

- `ActionCreated`: Cuando se crea una nueva acción
- `ActionExecuted`: Cuando se ejecuta una acción
- `CoreWriterCall`: Cuando se realiza una llamada a CoreWriter

## 🌐 Configuración de Redes

### hyperEVM Testnet
- **Chain ID**: 998
- **RPC URL**: `https://rpc.hyperliquid-testnet.xyz/evm`
- **Explorer**: `https://testnet.purrsec.com/`
- **CoreWriter Address**: `0x3333333333333333333333333333333333333333`

### Configuración en scaffold.config.ts
```typescript
const hyperEVMTestnet = {
  id: 998,
  name: "HyperEVM Testnet",
  network: "hyperevm-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://rpc.hyperliquid-testnet.xyz/evm"] },
    public: { http: ["https://rpc.hyperliquid-testnet.xyz/evm"] },
  },
  blockExplorers: {
    default: { name: "HyperEVM Testnet Explorer", url: "https://testnet.purrsec.com/" },
  },
};
```

## 🚨 Consideraciones Importantes

### Gas y Límites
- El contrato está configurado con un límite de gas de 12,000,000 para hyperEVM
- Las llamadas a CoreWriter pueden consumir más gas que operaciones normales

### Seguridad
- Solo el propietario puede retirar ETH del contrato
- Las acciones de CoreWriter se ejecutan inmediatamente
- Validación de existencia de acciones antes de consultarlas

### Costos
- Despliegue: ~2-3 ETH (gas fees)
- Operaciones CoreWriter: ~0.001-0.01 ETH
- Órdenes límite: ~0.01-0.1 ETH

### Tipos de Datos
- Precios: Multiplicados por 10^8 (uint64)
- Tamaños: Multiplicados por 10^8 (uint64)
- USD: Multiplicados por 10^6 (uint64)
- Wei: Cantidades en wei (uint64)

## 🔧 Personalización

### Agregar Nuevas Acciones
1. Agregar nuevo tipo en el enum `ActionType`
2. Crear función `send[NuevaAccion]()` con los parámetros correctos
3. Actualizar la función `_getActionTypeString()`
4. Agregar función de prueba si es necesario

### Modificar Funciones Existentes
1. Editar las funciones `send*` en el contrato
2. Actualizar las pruebas correspondientes
3. Regenerar los tipos: `yarn hardhat:compile`

## 📞 Soporte

Para problemas o preguntas:
1. Revisa los logs de despliegue
2. Verifica la configuración de red
3. Asegúrate de tener saldo suficiente en la cuenta
4. Consulta la [documentación oficial de CoreWriter](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore#corewriter-contract)

## 🔗 Enlaces Útiles

- [Documentación de hyperEVM](https://docs.hyperliquid.xyz/)
- [Documentación de CoreWriter](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore#corewriter-contract)
- [Explorador de hyperEVM Testnet](https://testnet.purrsec.com/)
- [Faucet de hyperEVM](https://faucet.hyperliquid-testnet.xyz) (si está disponible)

## 📝 Ejemplos de Uso

### Orden Límite
```solidity
// Comprar 100 unidades del activo 1 a precio 1000
sendLimitOrder(
    1,              // asset ID
    true,           // isBuy
    100000000000,   // limitPx (1000 * 10^8)
    10000000000,    // sz (100 * 10^8)
    false,          // reduceOnly
    2,              // tif (Gtc)
    0               // cloid (sin cloid)
);
```

### Transferencia de Vault
```solidity
// Depositar 1000 USD en el vault
sendVaultTransfer(
    msg.sender,     // vault
    true,           // isDeposit
    1000000000      // usd (1000 * 10^6)
);
```

### Delegación de Tokens
```solidity
// Delegar 1 ETH al validador
sendTokenDelegate(
    0x1234...,      // validator
    1000000000000000000, // amount (1 ETH)
    false           // isUndelegate
);
```

---

**¡Listo para probar CoreWriter en hyperEVM testnet! 🎉** 