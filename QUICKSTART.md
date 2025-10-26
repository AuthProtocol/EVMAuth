# EVMAuth Quick Start Guide

Get EVMAuth running in 5 minutes!

## Option 1: Mock Mode (No Blockchain)

Perfect for testing and demos - no wallet funding required.

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Get WalletConnect Project ID
# Visit: https://cloud.walletconnect.com
# Add to .env: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id_here

# 4. Start development server
npm run dev

# 5. Open browser
# http://localhost:3000
```

### Using Mock Mode

1. Click "Launch Dashboard" or navigate to `/dashboard`
2. Connect your wallet (any wallet works, no funds needed)
3. Create agents and authorize payments
4. All data is simulated - no real transactions!

---

## Option 2: Real Blockchain Mode

For production use with actual BSC transactions.

### Prerequisites

- BSC wallet with testnet BNB (get from [faucet](https://testnet.bnbchain.org/faucet-smart))
- WalletConnect Project ID
- BSCScan API key (optional, for verification)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
```

Edit `.env`:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_wc_project_id
NEXT_PUBLIC_CHAIN_ID=97
PRIVATE_KEY=your_private_key_for_deployment
BSCSCAN_API_KEY=your_bscscan_key
```

```bash
# 3. Compile smart contract
npm run compile

# 4. Deploy to BSC Testnet
npm run deploy:testnet

# This outputs:
# EVMAuth deployed to: 0xABCDEF123456789...
# Copy this address!

# 5. Add contract address to .env
echo "NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS" >> .env

# 6. Start server
npm run dev

# 7. Open browser
# http://localhost:3000/dashboard-real
```

### Using Real Mode

1. Navigate to `/dashboard-real`
2. Connect wallet (must have BNB for gas)
3. Create agent - MetaMask will ask for signature
4. Wait ~3 seconds for confirmation
5. Authorize payment - sends real BNB!

---

## Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Wallet won't connect
- Check `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set
- Clear browser cache
- Try different wallet

### Contract deployment fails
- Ensure wallet has testnet BNB
- Check `PRIVATE_KEY` is correct (no 0x prefix)
- Verify `NEXT_PUBLIC_CHAIN_ID=97` for testnet

### Transactions fail
- Ensure enough BNB for gas + payment
- Check agent is activated
- Verify daily limit not exceeded

---

## Next Steps

- **Read the full guide**: [README.md](README.md)
- **Deploy to blockchain**: [BLOCKCHAIN_SETUP.md](BLOCKCHAIN_SETUP.md)
- **Customize the UI**: Edit files in `components/`
- **Add features**: Modify smart contract in `contracts/EVMAuth.sol`

## Support

- Check [README.md](README.md) for detailed documentation
- Review [BLOCKCHAIN_SETUP.md](BLOCKCHAIN_SETUP.md) for contract info
- Open an issue on GitHub for bugs

---

**Happy building! 🚀**
