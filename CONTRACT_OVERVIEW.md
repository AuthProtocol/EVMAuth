# Smart Contract Technical Overview

## EVMAuth.sol - Complete Specification

### Contract Architecture

```
EVMAuth
├── Agent Registry
│   ├── Create agents with DID
│   ├── Activate/Deactivate agents
│   └── Update spending limits
├── Payment System
│   ├── Authorize payments
│   ├── Auto-settlement
│   └── Daily limit enforcement
└── Access Control
    ├── Owner-only operations
    └── Agent validation
```

## Data Structures

### Agent Struct
```solidity
struct Agent {
    string name;                  // Human-readable agent name
    AgentType agentType;          // 0=Trading, 1=Analytics, 2=Content, 3=DeFi
    string did;                   // Decentralized identifier (did:ethr:0x...)
    uint256 maxDailySpend;        // Max spend per 24h in wei
    AgentStatus status;           // 0=Pending, 1=Active, 2=Inactive
    address owner;                // Agent creator/controller
    uint256 createdAt;            // Block timestamp of creation
    uint256 dailySpent;           // Amount spent in current period
    uint256 lastResetTimestamp;   // Last daily reset time
}
```

### Payment Struct
```solidity
struct Payment {
    uint256 agentId;              // Reference to agent
    address recipient;            // Payment destination
    uint256 amount;               // Payment amount in wei
    PaymentStatus status;         // 0=Pending, 1=Settled, 2=Failed
    uint256 timestamp;            // Block timestamp
    string memo;                  // Optional payment note
}
```

## State Variables

```solidity
mapping(uint256 => Agent) public agents;           // Agent ID -> Agent
mapping(uint256 => Payment) public payments;       // Payment ID -> Payment
mapping(address => uint256[]) public userAgents;   // User -> Agent IDs
mapping(address => uint256[]) public userPayments; // User -> Payment IDs
uint256 public agentCounter;                       // Next agent ID
uint256 public paymentCounter;                     // Next payment ID
```

## Core Functions

### 1. createAgent
**Purpose**: Register a new AI agent on-chain

**Parameters**:
- `_name` (string): Agent display name
- `_agentType` (enum): Type of agent (0-3)
- `_did` (string): Decentralized identifier
- `_maxDailySpend` (uint256): Max daily spend in wei

**Returns**: `uint256` - New agent ID

**Access**: Public (any address)

**Gas**: ~150,000

**Events**: `AgentCreated`

**Example**:
```solidity
uint256 agentId = evmAuth.createAgent(
    "Alpha Trader",
    0, // Trading type
    "did:ethr:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    500000000000000000 // 0.5 BNB
);
```

### 2. activateAgent
**Purpose**: Activate a pending agent

**Parameters**:
- `_agentId` (uint256): ID of agent to activate

**Access**: Owner only

**Gas**: ~50,000

**Events**: `AgentStatusUpdated`

### 3. authorizePayment
**Purpose**: Execute a payment from an agent

**Parameters**:
- `_agentId` (uint256): Agent making the payment
- `_recipient` (address): Payment destination
- `_memo` (string): Optional note

**Value**: Payment amount (payable)

**Access**: Agent owner only

**Gas**: ~100,000

**Events**: `PaymentAuthorized`, `PaymentSettled`

**Validation**:
- Agent must be active
- Amount must not exceed daily limit
- Recipient must be valid address

**Example**:
```solidity
evmAuth.authorizePayment{value: 0.05 ether}(
    0, // Agent ID
    0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb,
    "Trade execution fee"
);
```

### 4. getAgent
**Purpose**: Retrieve agent details

**Parameters**:
- `_agentId` (uint256): Agent ID

**Returns**: `Agent` struct

**Access**: Public view (no gas)

### 5. getUserAgents
**Purpose**: Get all agents owned by an address

**Parameters**:
- `_owner` (address): Owner address

**Returns**: `uint256[]` - Array of agent IDs

**Access**: Public view (no gas)

### 6. getRemainingDailyBudget
**Purpose**: Check remaining spending allowance

**Parameters**:
- `_agentId` (uint256): Agent ID

**Returns**: `uint256` - Remaining budget in wei

**Access**: Public view (no gas)

**Logic**:
- Resets to full budget after 24 hours
- Returns `maxDailySpend - dailySpent` otherwise

## Events

### AgentCreated
```solidity
event AgentCreated(
    uint256 indexed agentId,
    address indexed owner,
    string name,
    AgentType agentType,
    uint256 maxDailySpend
);
```

### AgentStatusUpdated
```solidity
event AgentStatusUpdated(
    uint256 indexed agentId,
    AgentStatus newStatus
);
```

### PaymentAuthorized
```solidity
event PaymentAuthorized(
    uint256 indexed paymentId,
    uint256 indexed agentId,
    address indexed recipient,
    uint256 amount
);
```

### PaymentSettled
```solidity
event PaymentSettled(
    uint256 indexed paymentId,
    uint256 indexed agentId,
    address indexed recipient,
    uint256 amount
);
```

### PaymentFailed
```solidity
event PaymentFailed(
    uint256 indexed paymentId,
    string reason
);
```

## Security Features

### Access Control
- **Owner-only payments**: Only agent creator can authorize payments
- **Status checks**: Payments require active agents
- **Input validation**: All parameters validated

### Spending Limits
- **Daily caps**: Automatic 24-hour spending limits
- **Auto-reset**: Limits reset after 24 hours
- **Pre-validation**: Checks before transfer execution

### Safe Transfers
- **Call over transfer**: Uses low-level call for BNB transfers
- **Status tracking**: Records success/failure
- **Event emissions**: Complete audit trail

## Gas Optimization

### Storage Patterns
- Packed structs where possible
- uint256 for IDs (cheaper than smaller types)
- Minimal storage writes

### Function Design
- View functions for reads (no gas)
- Batch operations via arrays
- Events for off-chain indexing

## Upgrade Considerations

Current contract is **not upgradeable**. To add features:

1. Deploy new contract version
2. Migrate data manually
3. Update frontend contract address

For production, consider:
- OpenZeppelin UUPS proxy pattern
- Timelock for upgrades
- Multi-sig governance

## Integration Examples

### Frontend (wagmi)
```typescript
import { useWriteContract } from 'wagmi';

const { writeContractAsync } = useWriteContract();

// Create agent
await writeContractAsync({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: 'createAgent',
  args: ['My Agent', 0, 'did:ethr:0x...', parseEther('0.5')],
});
```

### Backend (viem)
```typescript
import { createPublicClient, http } from 'viem';
import { bscTestnet } from 'viem/chains';

const client = createPublicClient({
  chain: bscTestnet,
  transport: http(),
});

const agent = await client.readContract({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: 'getAgent',
  args: [0n],
});
```

### Event Listening
```typescript
const unwatch = publicClient.watchContractEvent({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  eventName: 'PaymentSettled',
  onLogs: (logs) => {
    console.log('New payment:', logs);
  },
});
```

## Testing

### Unit Tests (Hardhat)
```bash
npm run test
```

### Test Coverage
```bash
npx hardhat coverage
```

### Local Deployment
```bash
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
```

## Deployment Checklist

- [ ] Update Solidity version if needed
- [ ] Run `npm run compile`
- [ ] Set `PRIVATE_KEY` in `.env`
- [ ] Fund deployment wallet
- [ ] Run `npm run deploy:testnet`
- [ ] Verify contract on BSCScan
- [ ] Update `NEXT_PUBLIC_CONTRACT_ADDRESS`
- [ ] Test all functions on testnet
- [ ] Deploy to mainnet
- [ ] Verify mainnet contract
- [ ] Document contract addresses

## Audit Recommendations

Before mainnet deployment:

1. **Professional Audit**: Engage security firm
2. **Formal Verification**: Prove contract properties
3. **Bug Bounty**: Offer rewards for vulnerabilities
4. **Testnet Testing**: Run for 30+ days
5. **Economic Analysis**: Model attack vectors

## Known Limitations

1. **No emergency pause**: Cannot halt contract
2. **No upgrade mechanism**: Must deploy new version
3. **Single owner**: No multi-sig support
4. **No refunds**: Failed payments don't auto-refund
5. **Fixed daily period**: 24h hardcoded, not configurable

## Future Enhancements

- [ ] Multi-sig agent ownership
- [ ] Configurable daily periods
- [ ] Payment scheduling
- [ ] Batch payments
- [ ] Emergency pause functionality
- [ ] Upgrade mechanism (proxy pattern)
- [ ] Agent delegation
- [ ] Payment streaming
- [ ] Cross-chain support (LayerZero/Axelar)

## Resources

- **Solidity Docs**: https://docs.soliditylang.org/
- **OpenZeppelin**: https://docs.openzeppelin.com/
- **Hardhat**: https://hardhat.org/docs
- **BSC Docs**: https://docs.bnbchain.org/

---

**Contract Version**: 1.0.0
**Solidity**: 0.8.24
**License**: MIT
