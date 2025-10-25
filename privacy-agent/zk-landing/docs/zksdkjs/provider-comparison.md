---
id: provider-comparison
title: Provider Comparison & Selection Guide
sidebar_label: Provider Comparison
---

# zkSDK Provider Comparison & Selection Guide

**Version**: 1.0.0-beta  
**Last Updated**: 2025-10-22

## Quick Comparison

| Provider | Privacy Model | Primary Use Case | Networks | Status | Production Ready |
|----------|---------------|------------------|----------|--------|------------------|
| **Railgun** | Shielded pools (ZK proofs) | EVM private transfers | Ethereum, Polygon, Arbitrum, BSC | ✅ Ready | ✅ Yes |
| **Aztec** | ZK rollup with encrypted contracts | L2 privacy + private contracts | Aztec Testnet → Ethereum L1 | ✅ Ready | ⚠️ Testnet |
| **FHEVM** | Fully homomorphic encryption | Encrypted state/computation | Zama devnet | ✅ Ready | ⚠️ Devnet |
| **Privacy Cash** | Intent-based shielded transfers | Solana private settlements | Solana Mainnet | 🚧 In progress | 🔜 Soon |
| **Bitcoin** | Silent Payments (BIP352) | Bitcoin privacy | Bitcoin Mainnet | 🔬 Research | 🔜 Soon |

## Decision Tree

```
┌─ Need privacy on Ethereum/EVM chains?
│
├─ Yes ──┬─ Need encrypted smart contracts?
│        │
│        ├─ Yes → Use AZTEC (testnet) or FHEVM (encrypted computation)
│        │
│        └─ No, just private transfers → Use RAILGUN (production ready)
│
├─ Need privacy on Solana?
│  └─ Yes → Use PRIVACY CASH (intent router + compliance relayers)
│
└─ Need privacy on Bitcoin?
   └─ Yes → Use BITCOIN (BIP352 Silent Payments)
```

## Detailed Provider Notes

### Railgun

- **Strengths:** Production mainnet support, battle-tested shielded pools, multi-chain coverage, optimized gas costs.
- **Limitations:** Requires dedicated mnemonic + local database, relayer network recommended for full privacy.
- **Typical Use Cases:** Private token transfers, privacy-preserving DeFi interactions, cross-chain shielding.
- **Gas Costs:** Shield ~300–500 k gas; transfer ~350–550 k; unshield ~300–500 k.

```typescript
const railgun = new RailgunProvider();
await railgun.initialize({
  walletMnemonic: process.env.RAILGUN_MNEMONIC!,
  engineDbPath: './railgun-db',
  rpcEndpoints: {
    ethereum: process.env.ETHEREUM_RPC_URL!,
    polygon: process.env.POLYGON_RPC_URL!,
  },
});
```

### Aztec

- **Strengths:** Encrypted smart contracts via Noir, programmable privacy, L2 scalability.
- **Limitations:** Testnet only today, requires PXE server, Noir learning curve.
- **Use Cases:** Private dApp prototypes, research, encrypted asset experiments.

```typescript
const aztec = new AztecProvider();
await aztec.initialize({
  pxeConfig: {
    pxeUrl: 'http://localhost:8080',
    accountMnemonic: process.env.AZTEC_MNEMONIC!,
  },
});
```

### FHEVM

- **Strengths:** Full encrypted computation, compatible with standard EVM tooling.
- **Limitations:** Currently on Zama devnet; requires gateway services; performance profiling ongoing.
- **Use Cases:** Encrypted state experiments, compliance-focused pilots.

### Privacy Cash (Solana)

- **Strengths:** Intent-based zk rollup with built-in compliance domains, Phantom-compatible signer flow, and managed relayers that keep Solana fees predictable.
- **Limitations:** Relies on a hosted relay (self-hostable) and requires domain configuration before production; runbook tracked under `privacy-agent/docs/backend/privacy-cash-integration.md`.
- **Use Cases:** Solana private settlements, institutional OTC flows, shielded consumer payments.

### Bitcoin (Silent Payments)

- **Strengths:** BIP352-compatible, works with wallet-only flow (no full node).
- **Limitations:** Still under active development; watch-only wallet support in progress.
- **Use Cases:** Stealth address payments, institutional Bitcoin privacy.

## Selection Considerations

- **Regulatory posture:** Some regions prefer audited providers (Railgun, Aztec). Document the compliance stance before production use.
- **Latency:** PXE proof times (Aztec) vs. real-time transfers (Railgun/FHEVM). Monitor metrics dashboard targets.
- **Wallet UX:** Railgun requires a separate mnemonic; Aztec + Privacy Cash integrate with protocol-specific accounts/intents; FHEVM leverages standard signers.
- **Operational footprint:** PXE servers, relayers, Helius, or Zama gateways may introduce additional infrastructure.

## Roadmap Alignment

- MVP focuses on Railgun + Aztec + FHEVM.
- Privacy Cash and Bitcoin providers follow after the Phase 1 checklist in `docs/zksdkjs/coming-soon.md` is complete.
- Strategy artifacts under `strategy/product/` provide the latest prioritization and should be reviewed before committing to an integration path.
