# CoreWriter dApp - Scaffold-ETH 2 + hyperEVM

Este proyecto es una integración real de CoreWriter sobre hyperEVM testnet, usando Scaffold-ETH 2 (NextJS, Hardhat, Wagmi, Typescript).

## 🚀 Características principales
- **Contrato CoreWriter real**: Todas las funciones principales de CoreWriter implementadas y expuestas.
- **Despliegue y pruebas en hyperEVM testnet**.
- **Frontend NextJS** con UI dedicada para interactuar con el contrato.
- **Soporte para acciones rápidas, historial y ayuda contextual**.

---

## 📦 Estructura del proyecto
- `packages/hardhat/` - Contratos, scripts de despliegue y pruebas.
- `packages/nextjs/` - Frontend NextJS, hooks y componentes para interactuar con el contrato.
- Página principal: [`/`](./packages/nextjs/app/page.tsx) - Interfaz completa de CoreWriter

---

## 🛠️ Instalación y configuración

1. **Instala dependencias**
   ```bash
   yarn install
   ```
2. **Configura tu cuenta y mnemonic**
   - Crea el archivo `packages/hardhat/.env`:
     ```env
     MNEMONIC="tus 12 palabras aquí"
     ```
   - Asegúrate de tener fondos en la testnet de hyperEVM.
3. **Configura tu cuenta para usar HyperEVM Big Blocks**
   - Entra en https://hyperevm-block-toggle.vercel.app/
   - Asegúrate de tener fondos en la testnet de hyperEVM.
   - Coloca el toggle de arriba en Testnet
   - Haz click sobre el botón BIG para poder usar los HyperEVM Big Blocks
4. **Despliega el contrato**
   ```bash
   yarn deploy:hyperevmTestnet
   ```
5. **Inicia el frontend**
   ```bash
   yarn start
   # o
   yarn dev
   ```
6. **Abre la interfaz principal**
   - Ve a [http://localhost:3000](http://localhost:3000)

---

## ✨ ¿Qué puedes hacer?
- Usar **acciones rápidas** para probar todas las funciones principales de CoreWriter:
  - Enviar órdenes límite
  - Transferir vault
  - Delegar tokens
  - Staking
  - Enviar tokens spot
  - Transferir USD class
  - Finalizar contratos EVM
  - Agregar wallets API
- Ver el **historial de acciones** creadas y ejecutadas por tu cuenta.
- Consultar **ayuda contextual** y ejemplos de uso.

---

## 🧪 Pruebas

```bash
yarn test
```

---

## 🌐 Redes soportadas
- **hyperEVM Testnet**
  - Chain ID: 998
  - RPC: https://rpc.hyperliquid-testnet.xyz/evm
  - Explorer: https://testnet.purrsec.com/

---

## 📚 Recursos útiles
- [Documentación oficial de CoreWriter](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore#corewriter-contract)
- [Scaffold-ETH 2](https://github.com/scaffold-eth/se-2)
- [hyperEVM](https://docs.hyperliquid.xyz/)

---

## 📝 Notas
- La página principal está completamente adaptada para CoreWriter con formularios amigables y historial de acciones.
- Puedes seguir usando `/debug` para interactuar con cualquier contrato desplegado de forma avanzada.
- Si tienes dudas, revisa el archivo `COREWRITER_README.md` para detalles técnicos y ejemplos avanzados.