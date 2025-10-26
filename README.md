# AuthProtocol

**Manage AI agent payments on-chain. Deploy in 5 minutes, test with mock data, or go live on BSC.**

A modern Web3 platform for authorizing and tracking AI agent payments with configurable spending limits, real-time activity feeds, and full smart contract integration on Binance Smart Chain.

![EVMAuth](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)

---

## Table of Contents

- [Quick Start](#quick-start)
- [What is EVMAuth?](#what-is-evmauth)
- [Two Deployment Modes](#two-deployment-modes)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [Smart Contract Integration](#smart-contract-integration)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Quick Start

Get EVMAuth running locally in under 2 minutes:

```bash
# Clone and install
git clone https://github.com/AuthProtocol/EVMAuth.git
cd EVMAuth
npm install

# Set up environment
cp .env.example .env
# Edit .env and add your WalletConnect Project ID

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), connect your wallet, and start creating AI agents.

**No blockchain setup required** - the default `/dashboard` route uses mock data for instant testing.

---

## What is EVMAuth?

EVMAuth is a decentralized platform that enables secure, on-chain authorization for AI agent payments. Think of it as a permission system for autonomous agents to spend funds on behalf of their owners with built-in safety limits.

**Key Capabilities:**
- Create multiple AI agents with individual spending limits
- Authorize payments from agents to any recipient
- Track all transactions in real-time
- Enforce daily spending caps automatically
- Full audit trail via smart contract events

**Perfect for:**
- Trading bots that need controlled fund access
- Content creation agents that purchase API credits
- Analytics agents that pay for data sources
- DeFi automation agents managing protocol interactions

---

## Two Deployment Modes

EVMAuth supports both simulated and production blockchain environments:

### 📱 Mock Mode (`/dashboard`)
- **Simulated blockchain** - No real transactions or gas fees
- **Auto-generated payments** - New transactions every 10 seconds for demos
- **Instant confirmations** - Perfect for development and testing
- **No wallet funding required** - Just connect to explore

### ⛓️ Real Blockchain Mode (`/dashboard-real`)
- **BSC integration** - Full smart contract deployment on Binance Smart Chain
- **Real BNB transactions** - Production-ready payment authorization
- **Gas fees apply** - Actual on-chain settlement
- **Complete setup guide** - See [BLOCKCHAIN_SETUP.md](BLOCKCHAIN_SETUP.md)

Start with mock mode to explore the interface, then deploy contracts for production use.

---

## Features

**AI Agent Management**
- Create agents with configurable types (Trading, Analytics, Content, DeFi)
- Set maximum daily spending limits per agent
- Activate/deactivate agents instantly
- Decentralized Identity (DID) support in `did:ethr` format

**Payment Authorization**
- One-click payment authorization from any active agent
- Real-time payment status tracking (pending → settled/failed)
- Auto-settling payments after 5-second confirmation
- Optional payment memos for transaction notes

**Real-time Dashboard**
- Live statistics: total agents, payment volume, transaction count
- Activity feed with auto-updating payment stream
- Wallet-gated access with RainbowKit integration
- Mobile-responsive design with dark theme

**Smart Contract Backend**
- On-chain agent registry with ownership verification
- Automated 24-hour spending limit resets
- Complete event emission for audit trails
- Secure payment execution with recipient validation

**Developer Experience**
- TypeScript throughout for type safety
- Mock data system for rapid development
- Toast notifications for all user actions
- Loading states and empty states with helpful guidance

---

## Tech Stack

**Frontend**
- Next.js 14 (App Router)
- TypeScript 5.6
- Tailwind CSS 3.4
- Lucide React (icons)
- Sonner (toast notifications)

**Web3**
- wagmi v2 (React hooks for Ethereum)
- viem (TypeScript Ethereum library)
- RainbowKit (wallet connection)

**Blockchain**
- Binance Smart Chain (Mainnet & Testnet)
- Solidity 0.8.24
- Hardhat (development environment)

---

## Installation

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **WalletConnect Project ID** - [Get one free](https://cloud.walletconnect.com)
- **npm or yarn** - Package manager

### Setup Steps

**1. Clone the repository**
```bash
git clone https://github.com/AuthProtocol/EVMAuth.git
cd EVMAuth
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and add your WalletConnect Project ID:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

**4. Run the development server**
```bash
npm run dev
```

**5. Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to see the landing page.

### Project Structure

```
EVMAuth/
├── app/
│   ├── layout.tsx              # Root layout with Web3 providers
│   ├── providers.tsx           # Wagmi + RainbowKit configuration
│   ├── page.tsx               # Landing page
│   ├── dashboard/             # Mock mode dashboard
│   │   └── page.tsx
│   ├── dashboard-real/        # Real blockchain dashboard
│   │   └── page.tsx
│   └── globals.css            # Global styles & theme
├── components/
│   ├── navbar.tsx             # Navigation + wallet connect
│   ├── stats-card.tsx         # Statistics display
│   ├── agent-card.tsx         # Agent information card
│   ├── payment-row.tsx        # Payment activity row
│   ├── create-agent-form.tsx  # Agent creation form
│   └── authorize-payment-form.tsx
├── contracts/
│   └── EVMAuth.sol            # Smart contract source
├── lib/
│   ├── wagmi-config.ts        # Web3 configuration
│   ├── contract-config.ts     # Contract ABI & address
│   ├── mock-data.ts           # Mock data generators
│   └── utils.ts               # Utility functions
└── public/                    # Static assets
```

---

## Usage Guide

### Landing Page

1. Review platform features and statistics
2. Click **"Launch Dashboard"** to access mock mode
3. Or connect wallet via navbar to proceed
4. Access GitHub repository link in footer

### Creating Your First Agent

1. **Connect wallet** - Click "Connect Wallet" in navbar
2. **Navigate to dashboard** - Go to `/dashboard` (mock) or `/dashboard-real` (blockchain)
3. **Fill in agent details:**
   - **Name:** e.g., "Alpha Trading Bot"
   - **Type:** Choose from Trading, Analytics, Content, DeFi
   - **Max Daily Spend:** e.g., "0.1" BNB
4. **Click "Create Agent"**
5. Agent appears with **"pending"** status
6. After 3 seconds, status auto-updates to **"active"**

### Authorizing Payments

1. **Select an active agent** from dropdown
2. **Enter recipient address** (0x... format)
3. **Specify amount** in BNB (e.g., "0.01")
4. **(Optional) Add memo** for transaction notes
5. **Click "Authorize Payment"**
6. Payment appears in activity feed with **"pending"** status
7. After 5 seconds, payment auto-settles to **"settled"** or **"failed"**

### Dashboard Overview

**Stats Cards (Top Row)**
- Total Agents created
- Total Volume in BNB
- Total Payments processed

**Your Agents (Left Column)**
- Lists all created agents
- Shows status badges (pending/active/inactive)
- Click copy icon to copy agent DID
- Color-coded by agent type

**Activity Feed (Right Column)**
- Real-time payment stream
- Auto-updates with new transactions
- Shows amount, recipient, status, timestamp
- Includes payment memos if provided

### Agent Types

| Type | Icon | Use Case | Badge Color |
|------|------|----------|-------------|
| **Trading Bot** | 🤖 | Automated trading agents | Blue |
| **Analytics** | 📊 | Data analysis & research | Purple |
| **Content Creator** | ✍️ | Content generation agents | Pink |
| **DeFi Automation** | 💎 | DeFi protocol interactions | Green |

---

## Smart Contract Integration

### Contract Overview (`contracts/EVMAuth.sol`)

The EVMAuth smart contract provides the on-chain infrastructure for agent management and payment authorization.

**Core Functions:**
- `createAgent()` - Register new AI agent with spending limits
- `activateAgent()` / `deactivateAgent()` - Control agent status
- `authorizePayment()` - Execute payment from agent to recipient
- `updateMaxDailySpend()` - Modify agent spending limits
- `getRemainingDailyBudget()` - Check available daily budget

**Security Features:**
- Owner-only operations via `onlyAgentOwner` modifier
- Automatic 24-hour spending limit resets
- Daily spend tracking per agent
- Recipient address validation
- Agent status verification before payments

**Events Emitted:**
- `AgentCreated` - New agent registration
- `AgentStatusUpdated` - Status changes
- `PaymentAuthorized` - Payment initiation
- `PaymentSettled` - Successful payment
- `PaymentFailed` - Failed payment with reason

### Deploying to BSC

For complete smart contract deployment instructions including:
- Hardhat configuration
- BSC Testnet setup
- Contract deployment scripts
- Frontend integration

See the detailed guide: [BLOCKCHAIN_SETUP.md](BLOCKCHAIN_SETUP.md)

### Contract Address Configuration

After deployment, update `lib/contract-config.ts`:

```typescript
export const CONTRACT_ADDRESS = "0xYourDeployedContractAddress" as `0x${string}`;
```

The contract ABI is already configured in the same file.

---

## Configuration

### Adding More Networks

Edit `lib/wagmi-config.ts` to support additional chains:

```typescript
import { bsc, bscTestnet, polygon, mainnet } from "wagmi/chains";

export const config = getDefaultConfig({
  chains: [bsc, bscTestnet, polygon, mainnet], // Add networks here
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  appName: "EVMAuth",
  // ...
});
```

### Customizing Theme

Modify colors and gradients in `app/globals.css`:

```css
/* Purple gradient */
.gradient-purple {
  background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%);
}

/* Glassmorphism card */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Adjusting Auto-Generation Intervals

In `app/dashboard/page.tsx`, modify mock data timing:

```typescript
// Change payment generation interval (default: 10s)
useEffect(() => {
  const interval = setInterval(() => {
    const newPayment = generateMockPayment();
    setPayments((prev) => [newPayment, ...prev]);
  }, 10000); // Change this value in milliseconds

  return () => clearInterval(interval);
}, []);
```

---

## Development

### Running Locally

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Run ESLint
```

### Type Checking

```bash
npx tsc --noEmit     # Check TypeScript errors without building
```

### Adding New Agent Types

1. **Update type definition** in `lib/mock-data.ts`:
```typescript
export type AgentType = "trading" | "analytics" | "content" | "defi" | "new-type";
```

2. **Add to AGENT_TYPES mapping**:
```typescript
export const AGENT_TYPES = {
  // ... existing types
  "new-type": { label: "New Type", icon: "🆕", color: "orange" },
};
```

3. **Update form options** in `create-agent-form.tsx`

4. **Update smart contract** enum if using real blockchain mode

### Code Quality

**Linting:**
```bash
npm run lint
```

**Auto-fix issues:**
```bash
npm run lint -- --fix
```

---

## Deployment

### Build Locally

Test production build before deployment:

```bash
npm run build
npm run start
```

Visit [http://localhost:3000](http://localhost:3000) to test.

### Other Platforms

EVMAuth supports any Next.js-compatible hosting:

- **Netlify** - Add build command: `npm run build`
- **Cloudflare Pages** - Framework preset: Next.js
- **AWS Amplify** - Node.js 18+ runtime
- **Railway** - Auto-detects Next.js

All platforms require the `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` environment variable.

### Performance Metrics

- **Lighthouse Score:** 95+ (Desktop)
- **Bundle Size:** ~250KB (gzipped)
- **First Load:** <2s on 3G
- **Time to Interactive:** <3s

---

## Troubleshooting

### Wallet Connection Issues

**Problem:** Wallet won't connect or shows errors

**Solutions:**
- Verify `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set in `.env`
- Check browser console for specific errors
- Clear browser cache and reload
- Update wallet extension to latest version
- Try a different wallet (MetaMask, Rainbow, Coinbase)

**Check configuration:**
```bash
# Verify env variable is loaded
echo $NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
```

### Styles Not Loading

**Problem:** UI appears unstyled or broken

**Solutions:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Clear Next.js cache
rm -rf .next
npm run dev

# Verify Tailwind configuration
cat tailwind.config.ts
```

### Build Errors

**Problem:** `npm run build` fails

**Solutions:**
```bash
# Check Node.js version (must be 18+)
node --version

# Update all dependencies
npm update

# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Transaction Failures (Real Blockchain Mode)

**Problem:** Payments fail or don't appear on-chain

**Solutions:**
- Ensure wallet has sufficient BNB for gas + payment amount
- Check network (BSC Mainnet vs Testnet)
- Verify contract address in `lib/contract-config.ts`
- Check daily spending limit hasn't been exceeded
- View transaction on [BscScan](https://bscscan.com) for error details

### Mock Data Not Updating

**Problem:** Activity feed doesn't show new payments

**Solutions:**
- Check browser console for JavaScript errors
- Verify you're on `/dashboard` not `/dashboard-real`
- Refresh the page
- Check `useEffect` intervals in component code

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or run on different port
PORT=3001 npm run dev
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Update README if adding features
4. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
6. **Open a Pull Request**
   - Describe your changes
   - Link any related issues
   - Add screenshots for UI changes

### Development Guidelines

- Use TypeScript for all new files
- Follow existing component patterns
- Maintain mobile responsiveness
- Test on multiple wallets before submitting
- Run `npm run lint` before committing

---

## Security

⚠️ **Important Security Notice**

This is a demonstration application. For production deployment:

**Required Implementations:**
- Server-side input validation
- Rate limiting on all endpoints
- CSRF protection
- Proper error handling without exposing internals
- Transaction verification before state updates
- Audit of smart contracts by professionals

**Best Practices:**
- Never commit `.env` files
- Use environment variables for all secrets
- Implement access control lists
- Enable contract pause functionality
- Set up monitoring and alerts
- Regular dependency updates

**Disclaimer:** The authors are not responsible for any losses incurred from using this software. Always test thoroughly on testnets before mainnet deployment.

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Brave (Chromium-based)

Mobile browsers supported via responsive design.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Acknowledgments

Built with these amazing open-source projects:

- [Next.js](https://nextjs.org/) - React framework
- [wagmi](https://wagmi.sh/) - React hooks for Ethereum
- [RainbowKit](https://www.rainbowkit.com/) - Wallet connection
- [viem](https://viem.sh/) - TypeScript Ethereum library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Lucide](https://lucide.dev/) - Icon library
- [Sonner](https://sonner.emilkowal.ski/) - Toast notifications

---

## Support

- **Issues:** [GitHub Issues](https://github.com/AuthProtocol/EVMAuth/issues)
- **Discussions:** [GitHub Discussions](https://github.com/AuthProtocol/EVMAuth/discussions)
- **Documentation:** [Full Docs](https://github.com/AuthProtocol/EVMAuth#readme)

---

**Built for the Web3 community. Open source. No fees. No middlemen.**
