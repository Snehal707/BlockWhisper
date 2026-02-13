# BlockWhisper — On-Chain Fortune Telling ✨

A mystical Next.js dApp on Base that transforms your on-chain activity into AI-powered fortunes, mintable as beautiful NFTs with on-chain SVG art.

## 🌟 Features

- **AI Fortune Generation**: Uses Nous Research Hermes 3 (405B) to analyze your wallet's Base chain activity
- **On-Chain NFTs**: Mint your fortune as a fully on-chain NFT with dynamic SVG artwork
- **Real-Time Analytics**: View wallet stats powered by Alchemy's API
- **Premium UI**: Beautiful dark/light mode with Material Design 3 aesthetics
- **Base Blockchain**: Built exclusively for Base mainnet with Coinbase OnchainKit

## 🚀 Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS 4, Framer Motion
- **Blockchain**: Base (Ethereum L2), viem, wagmi, OnchainKit
- **Smart Contract**: Solidity 0.8.24 (compiled with viaIR for optimization)
- **AI/LLM**: Nous Research API (Hermes-3-Llama-3.1-405B)
- **APIs**: Alchemy (on-chain data), Basescan (verification)

## 📦 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd BlockWhisper
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual API keys:
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` - Get from [WalletConnect Cloud](https://cloud.walletconnect.com/)
- `BASESCAN_API_KEY` - Get from [Basescan](https://basescan.org/apis)
- `NOUS_API_KEY` - Get from [Nous Research](https://nousresearch.com/)
- `ALCHEMY_API_KEY` - Get from [Alchemy](https://www.alchemy.com/)
- `PRIVATE_KEY` - Your wallet private key (for deployment only)
- `NEXT_PUBLIC_CONTRACT_ADDRESS` - Will be set after deployment

4. **Run development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔧 Smart Contract

The `BlockWhisperFortune` contract is deployed and verified on Base mainnet:

**Contract Address**: `0xbc7250022a2531569f013a86de3f944f2e46ab53`

[View on Basescan](https://basescan.org/address/0xbc7250022a2531569f013a86de3f944f2e46ab53#code)

### Compilation Settings
- Solidity: `0.8.24`
- Optimizer: Enabled (200 runs)
- viaIR: `true` (required to avoid stack-too-deep errors)
- EVM Version: `shanghai`

### Redeploy Contract (if needed)

```bash
node scripts/deploy-viem.mjs
```

This will compile with viaIR, deploy to Base, and update `.env.local` automatically.

## 🌐 Deployment

### Deploy to Vercel

1. **Connect your GitHub repository to Vercel**

2. **Add environment variables** in Vercel dashboard:
   - All variables from `.env.example` except `PRIVATE_KEY`
   - Set `NEXT_PUBLIC_CONTRACT_ADDRESS` to the deployed contract

3. **Deploy**
```bash
vercel --prod
```

**Note**: Do NOT add `PRIVATE_KEY` to Vercel. Contract deployment should be done locally.

## 🔐 Security

- ✅ `.env.local` is gitignored and contains all secrets
- ✅ `.env.example` provides a template with placeholders
- ✅ Never commit private keys or API keys
- ✅ Contract is verified on Basescan for transparency

## 📄 License

MIT 

## 🙏 Credits

Built with:
- [Coinbase OnchainKit](https://onchainkit.xyz/)
- [Nous Research](https://nousresearch.com/)
- [Alchemy](https://www.alchemy.com/)
- [Base](https://base.org/)
