# Deploying BlockWhisper Fortune Contract to Base Mainnet

## Using Remix IDE

1. **Go to Remix**: https://remix.ethereum.org
2. **Create File**: Create `BlockWhisperFortune.sol`
3. **Copy Contract**: Paste from `contracts/BlockWhisperFortune.sol`
4. **Install OpenZeppelin**: Click "OK" when prompted
5. **Compile**:
   - Solidity Compiler tab
   - Version: `0.8.24`
   - Click "Compile"
6. **Deploy**:
   - Deploy & Run Transactions tab
   - Environment: **Injected Provider - MetaMask**
   - Connect MetaMask to **Base Mainnet**:
     - Network: Base
     - RPC: https://mainnet.base.org
     - Chain ID: **8453**
   - Click "Deploy"
   - **Fund with real ETH** for gas
7. **Copy Address**: Save the deployed contract address

## After Deployment

Add to `.env.local`:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...your_mainnet_address
```

The app is already configured for Base Mainnet (chain ID 8453).
