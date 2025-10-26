# Blockchain Backend Setup Guide

This guide explains how to deploy and integrate the real blockchain backend for EVMAuth.

## Overview

EVMAuth includes two versions:
1. **Mock Version** (`/dashboard`) - Uses simulated data, no real blockchain calls
2. **Real Version** (`/dashboard-real`) - Fully integrated with smart contracts on BSC

## Smart Contract Architecture

### EVMAuth.sol

The main contract handles:
- **Agent Registry**: Create, activate, and manage AI agents
- **Payment Authorization**: Authorize and execute payments with daily spend limits
- **Access Control**: Only agent owners can authorize payments
- **Daily Limits**: Automatic reset every 24 hours

### Key Features
- DID (Decentralized Identity) support for agents
- Configurable max daily spend per agent
- Automatic payment settlement
- Event emission for all state changes
- Gas-optimized Solidity 0.8.24

## Deployment Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and set:

```env
# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Private key for deployment (BSC Testnet wallet with BNB)
PRIVATE_KEY=your_private_key_without_0x

# BSCScan API Key (for verification)
BSCSCAN_API_KEY=your_bscscan_api_key

# Chain ID (97 for testnet, 56 for mainnet)
NEXT_PUBLIC_CHAIN_ID=97
```

### 3. Get Testnet BNB

For BSC Testnet deployment, get free testnet BNB:
- Visit: https://testnet.bnbchain.org/faucet-smart
- Enter your wallet address
- Request testnet BNB

### 4. Compile Contract

```bash
npm run compile
```

This generates:
- Contract artifacts in `artifacts/`
- TypeScript types in `typechain-types/`

### 5. Deploy to BSC Testnet

```bash
npm run deploy:testnet
```

Output will show:
```
Deploying EVMAuth contract...
Deploying with account: 0x...
Account balance: 0.5 BNB
EVMAuth deployed to: 0xABCDEF123456789...

Add this to your .env file:
NEXT_PUBLIC_CONTRACT_ADDRESS=0xABCDEF123456789...
```

Copy the contract address and add it to your `.env` file.

### 6. Verify Contract (Optional)

```bash
npx hardhat verify --network bscTestnet YOUR_CONTRACT_ADDRESS
```

This publishes the source code on BSCScan for transparency.

### 7. Deploy to BSC Mainnet (Production)

⚠️ **Use real BNB - costs money!**

```bash
# Update .env
NEXT_PUBLIC_CHAIN_ID=56

# Deploy
npm run deploy:mainnet
```

## Using the Blockchain Dashboard

### Access the Real Dashboard

Navigate to `/dashboard-real` (instead of `/dashboard`)

### Creating an Agent

1. Connect your wallet via RainbowKit
2. Fill in the "Create Agent" form
3. Click "Create Agent" - MetaMask will prompt for signature
4. Wait for transaction confirmation (~3 seconds on BSC)
5. Agent appears with "Pending" status
6. Activate the agent by calling `activateAgent()` (auto-activated in UI after creation)

### Authorizing a Payment

1. Select an active agent from dropdown
2. Enter recipient address (must be valid `0x...` address)
3. Enter amount in BNB (respects daily limit)
4. Add optional memo
5. Click "Authorize Payment" - MetaMask prompts for payment + gas
6. Transaction settles immediately and transfers BNB to recipient

## Contract Interaction Examples

### Read Operations (Free)

```typescript
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract-config';

// Get agent details
const { data } = useReadContract({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: 'getAgent',
  args: [BigInt(0)], // Agent ID
});

// Get user's agents
const { data: agentIds } = useReadContract({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: 'getUserAgents',
  args: [userAddress],
});
```

### Write Operations (Costs Gas)

```typescript
import { useWriteContract } from 'wagmi';
import { parseEther } from 'viem';

const { writeContractAsync } = useWriteContract();

// Create agent
const hash = await writeContractAsync({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: 'createAgent',
  args: ['My Agent', 0, 'did:ethr:0x...', parseEther('0.5')],
});

// Authorize payment
const hash = await writeContractAsync({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: 'authorizePayment',
  args: [BigInt(0), recipientAddress, 'Payment memo'],
  value: parseEther('0.1'), // Amount to send
});
```

## API Routes

The app includes Next.js API routes for efficient data fetching:

### GET /api/agent/[id]

Fetch agent details by ID:

```bash
curl http://localhost:3000/api/agent/0
```

Response:
```json
{
  "id": "0",
  "name": "Alpha Trader",
  "type": "trading",
  "did": "did:ethr:0x...",
  "maxDailySpend": "0.5",
  "status": "active",
  "createdAt": "2025-10-25T10:30:00.000Z"
}
```

### GET /api/payment/[id]

Fetch payment details by ID:

```bash
curl http://localhost:3000/api/payment/0
```

Response:
```json
{
  "id": "0",
  "agentName": "Alpha Trader",
  "recipient": "0x...",
  "amount": "0.05",
  "status": "settled",
  "timestamp": "2025-10-25T11:00:00.000Z",
  "memo": "Trade execution"
}
```

## Testing

### Run Hardhat Tests

```bash
npm run test
```

### Local Hardhat Network

```bash
# Terminal 1 - Start local node
npx hardhat node

# Terminal 2 - Deploy to local
npx hardhat run scripts/deploy.ts --network localhost
```

Update wagmi config to add localhost:

```typescript
import { hardhat } from 'wagmi/chains';

export const config = getDefaultConfig({
  chains: [bsc, bscTestnet, hardhat],
  // ...
});
```

## Gas Costs (BSC Testnet)

Approximate gas costs at 10 gwei:

| Operation | Gas Used | Cost (BNB) | USD (BNB=$300) |
|-----------|----------|------------|----------------|
| Deploy Contract | ~2,000,000 | 0.02 | $6 |
| Create Agent | ~150,000 | 0.0015 | $0.45 |
| Activate Agent | ~50,000 | 0.0005 | $0.15 |
| Authorize Payment | ~100,000 | 0.001 | $0.30 |

BSC mainnet is typically 3-5 gwei (even cheaper).

## Security Considerations

### Smart Contract
- ✅ Owner-only access control on payments
- ✅ Daily spending limits enforced
- ✅ Reentrancy protection via Checks-Effects-Interactions
- ✅ Input validation on all functions
- ⚠️ No emergency pause (add for production)
- ⚠️ No upgrade mechanism (deploy new version if needed)

### Frontend
- ✅ Transaction confirmation before signing
- ✅ Display gas estimates
- ✅ Error handling for failed transactions
- ⚠️ Add slippage protection for large amounts
- ⚠️ Add transaction history export

### Deployment
- ✅ Private keys in `.env` (never commit)
- ✅ Contract verification on BSCScan
- ⚠️ Use hardware wallet for mainnet deployment
- ⚠️ Test extensively on testnet first

## Troubleshooting

### "Insufficient funds" error
- Ensure wallet has enough BNB for gas + payment amount
- Get testnet BNB from faucet

### "Agent not active" error
- Call `activateAgent(agentId)` first
- Check agent status via `getAgent()`

### "Exceeds daily spending limit"
- Wait 24 hours or increase limit via `updateMaxDailySpend()`
- Check remaining budget: `getRemainingDailyBudget(agentId)`

### Contract not verified on BSCScan
- Ensure BSCSCAN_API_KEY is set
- Run verify command with correct network
- Check compiler version matches (0.8.24)

## Migration from Mock to Real

To switch your existing app from mock data to blockchain:

1. **Update imports** in dashboard components:
   ```typescript
   // Before
   import { CreateAgentForm } from "@/components/create-agent-form";

   // After
   import { CreateAgentFormReal } from "@/components/create-agent-form-real";
   ```

2. **Replace mock data** with hooks:
   ```typescript
   // Before
   const [agents, setAgents] = useState(MOCK_AGENTS);

   // After
   const { userAgentIds } = useEVMAuth();
   ```

3. **Use API routes** for data fetching instead of local state

4. **Test thoroughly** on testnet before mainnet

## Production Checklist

Before deploying to mainnet:

- [ ] Test all functions on BSC testnet
- [ ] Verify contract on BSCScan
- [ ] Audit smart contract (consider professional audit)
- [ ] Set appropriate daily limits
- [ ] Use hardware wallet for deployment
- [ ] Monitor gas prices (deploy during low usage)
- [ ] Set up contract monitoring (BSCScan API)
- [ ] Document all contract addresses
- [ ] Prepare emergency response plan
- [ ] Test with small amounts first

## Resources

- **BSC Docs**: https://docs.bnbchain.org/
- **Hardhat**: https://hardhat.org/
- **wagmi**: https://wagmi.sh/
- **BSCScan Testnet**: https://testnet.bscscan.com/
- **BSCScan Mainnet**: https://bscscan.com/

## Support

For issues:
1. Check console for error messages
2. Verify contract address and ABI are correct
3. Ensure wallet is connected to correct network
4. Check transaction on BSCScan

---

**Tech Stack**: Hardhat + wagmi + Next.js + Solidity
