# Next Actions Plan - Bitcoin & Frontend Implementation

## 🎯 Immediate Next Steps (Priority Order)

### 1. Bitcoin Silent Payments Provider (3 hours)
**When to run**: Next session start
```bash
# Use this exact command:
GOOSE_MODEL="qwen/qwen3-coder-plus" goose run \
  --recipe automation/recipes/recipe-bitcoin-silent-payments.yaml \
  --max-turns 40 \
  --name bitcoin_$(date +%H%M%S)
```

**What Goose will create**:
- `sdk/packages/providers/bitcoin/bitcoin-provider.ts`
- `sdk/packages/providers/bitcoin/services/silent-payment-service.ts`
- `examples/backend/bitcoin-silent-payments-example.ts`
- `docs/backend/bitcoin-integration.md`

**Key requirements**:
- Implement BIP352 protocol
- Use native Bitcoin wallet (no abstraction)
- Support mainnet and testnet
- Handle UTXO management

### 2. Frontend Wallet Guides (2 hours)
**When to run**: After Bitcoin provider
```bash
GOOSE_MODEL="qwen/qwen3-coder-plus" goose run \
  --recipe automation/recipes/recipe-frontend-wallet-guides.yaml \
  --max-turns 30 \
  --name frontend_guides_$(date +%H%M%S)
```

**What Goose will create**:
- `docs/frontend/WALLET_INTEGRATION_MASTER.md`
- `docs/frontend/railgun-wallet-setup.md`
- `docs/frontend/aztec-pxe-connection.md`
- `docs/frontend/privacy-cash-solana-wallet.md`
- `docs/frontend/bitcoin-silent-payments-setup.md`

### 3. Final QA & Testing (1 hour)
**When to run**: After all providers complete
```bash
GOOSE_MODEL="qwen/qwen3-coder-plus" goose run \
  --recipe automation/recipes/recipe-qa-full-integration.yaml \
  --max-turns 25 \
  --name final_qa_$(date +%H%M%S)
```

**What Goose will do**:
- Run all provider tests
- Validate all examples
- Check TypeScript compilation
- Create release checklist
- Generate CHANGELOG.md

## 📝 Bitcoin Provider Recipe to Create

Create this before running step 1:

```yaml
# automation/recipes/recipe-bitcoin-silent-payments.yaml
version: 1.0.0
title: "Bitcoin Silent Payments Provider Implementation"
description: "Implement BIP352 Silent Payment protocol for Bitcoin privacy"

instructions: |
  You are the Bitcoin Privacy Specialist. Implement BIP352 Silent Payments.

  YOUR CHECKLIST:
  ☐ 1. Create sdk/packages/providers/bitcoin/ structure
  ☐ 2. Implement BitcoinProvider extending BasePrivacyProvider
  ☐ 3. Implement BIP352 Silent Payment protocol:
       - Silent payment address generation
       - UTXO scanning and management
       - Transaction construction
  ☐ 4. Create examples/backend/bitcoin-silent-payments-example.ts
  ☐ 5. Create docs/backend/bitcoin-integration.md
  ☐ 6. Update .env.example with Bitcoin variables
  ☐ 7. Add tests for Bitcoin provider

  WALLET REQUIREMENTS:
  - Use native Bitcoin key pairs
  - NO wallet abstraction
  - BIP352 compliant

prompt: |
  Implement Bitcoin Silent Payments provider with BIP352.

  Focus on:
  1. Silent payment address generation
  2. UTXO management
  3. Private transaction construction
  4. Example showing silent payments

settings:
  temperature: 0.2
  max_tokens: 8192
  model: qwen/qwen3-coder-plus

extensions:
  - name: developer
    type: builtin
  - name: memory
    type: builtin
```

## 🚀 After Completion Checklist

1. **Commit and Push**:
```bash
git add .
git commit -m "feat: Add Bitcoin Silent Payments provider and frontend guides"
git push origin main
```

2. **Create Release**:
```bash
git tag -a v1.0.0-beta -m "zkSDK v1.0.0-beta - The LangChain of Privacy"
git push origin v1.0.0-beta
```

3. **Update README**:
- Add badges for build status
- Update provider list to show all 5 complete
- Add quick start guide

## 💡 Key Reminders

1. **Use Qwen3 Coder Plus** - Avoids rate limits
2. **No wallet abstraction** - Each provider uses native wallet
3. **Test everything** - Run provider tests before committing
4. **Document clearly** - Frontend devs need clear wallet setup guides
5. **Privacy Cash != Light Protocol** - Updated naming

## 🎉 When Everything is Done

You'll have:
- ✅ 5 complete privacy providers
- ✅ Full documentation suite
- ✅ Working examples for each provider
- ✅ Frontend integration guides
- ✅ v1.0-beta ready for release

**Total Progress**: 60% → 100% 🚀