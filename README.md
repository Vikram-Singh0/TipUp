# 🪙 TipUp — Universal Tipping App on Push Chain

A decentralized tipping dApp built on Push Chain that allows users to send tips to creators with real-time Push notifications.

## 🚀 Features

- **Universal Tipping**: Send tips to any registered creator using ENS names
- **Push Chain Integration**: Built on Push Chain testnet for fast, low-cost transactions
- **Push Wallet**: Seamless wallet connectivity with Push Universal Wallet
- **Real-time Notifications**: Instant Push notifications for tip events
- **Creator Dashboard**: Register and manage your creator profile
- **Modern UI**: Beautiful, responsive interface with 3D animations

## 🏗️ Architecture

```
TipUp/
├── app/                 # Next.js frontend
│   ├── src/
│   │   ├── app/        # App router pages
│   │   ├── components/ # React components
│   │   └── config/     # Contract configuration
├── hardhat/            # Smart contracts
│   ├── contracts/      # Solidity contracts
│   ├── scripts/        # Deployment scripts
│   └── test/           # Contract tests
└── README.md
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS v3, Framer Motion
- **Blockchain**: Push Chain Testnet (Chain ID: 999)
- **Wallet**: Push Universal Wallet
- **Smart Contracts**: Solidity 0.8.19, OpenZeppelin
- **Build Tool**: Hardhat
- **Dependencies**: Optimized minimal setup (no bloat)

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- Git
- Push Wallet or MetaMask with Push Chain testnet configured

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <your-repo>
cd TipUp

# Install frontend dependencies
cd app
npm install

# Install contract dependencies
cd ../hardhat
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the `app/` directory:

```env
NEXT_PUBLIC_TIPUP_CONTRACT=0xYourDeployedContractAddress
NEXT_PUBLIC_PUSH_RPC_URL=https://rpc.push.org
NEXT_PUBLIC_PUSH_CHAIN_ID=999
```

### 3. Deploy Smart Contract

```bash
cd hardhat

# Compile contracts
npm run compile

# Deploy to Push Chain testnet
npm run deploy
```

Copy the deployed contract address to your `.env.local` file.

### 4. Run Frontend

```bash
cd app
npm run dev
```

Visit `http://localhost:3000` to see the app.

## 📱 Usage

### For Creators

1. **Connect Wallet**: Use Push Universal Wallet to connect
2. **Register**: Go to Dashboard and register your ENS name
3. **Share**: Share your tip link: `yourapp.com/tip/yourname.eth`
4. **Track**: Monitor tips and analytics in your dashboard

### For Supporters

1. **Connect Wallet**: Connect your Push Wallet
2. **Find Creator**: Visit a creator's tip page
3. **Send Tip**: Enter amount and optional message
4. **Confirm**: Confirm transaction and receive notifications

## 🔧 Configuration

### Push Chain Testnet

- **RPC URL**: `https://rpc.push.org`
- **Chain ID**: `42101`
- **Currency**: ETH
- **Block Explorer**: [Push Chain Explorer](https://explorer.push.org)

### Contract Address

After deployment, update the contract address in:
- `app/.env.local`: `NEXT_PUBLIC_TIPUP_CONTRACT`
- `app/config/contract.ts`: `TIPUP_CONTRACT`

## 📊 Smart Contract

The `TipUp.sol` contract includes:

- **Creator Registration**: Register with ENS name and profile message
- **Tip Functionality**: Send tips with optional messages
- **Statistics**: Track total tips, tip count, and creator stats
- **Events**: Emit events for frontend integration
- **Security**: ReentrancyGuard and input validation

### Key Functions

```solidity
function registerCreator(string memory _ensName, string memory _profileMessage) external
function tip(string memory _ensName, string memory _message) external payable
function getCreator(string memory _ensName) external view returns (Creator memory)
```

## 🔔 Push Notifications

Currently using browser notifications as a placeholder. Future implementation will integrate with Push SDK for real-time notifications:

```typescript
// Future implementation
await PushSDK.notify({
  recipient: creatorAddress,
  title: "New Tip Received!",
  body: `${sender} sent you ${amount} ETH`,
});
```

## 🧪 Testing

### Contract Tests

```bash
cd hardhat
npm test
```

### Frontend Testing

```bash
cd app
npm run build
npm run lint
```

## 📈 Deployment

### Contract Deployment

```bash
cd hardhat
npm run deploy
```

### Frontend Deployment

Deploy to Vercel, Netlify, or your preferred platform:

```bash
cd app
npm run build
```

## 🔮 Roadmap

- [ ] Real Push SDK notifications
- [ ] Multi-token support (USDC, USDT)
- [ ] Tip history and analytics
- [ ] Creator verification system
- [ ] Mobile app
- [ ] Social features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: Check this README
- **Issues**: Open a GitHub issue
- **Push Chain**: [Push Protocol Docs](https://docs.push.org)

## 🙏 Acknowledgments

- Push Protocol for the amazing infrastructure
- OpenZeppelin for security contracts
- Next.js team for the excellent framework

---

Built with ❤️ on Push Chain
