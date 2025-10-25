# zkSDK Strategy Documents

This directory contains versioned strategic decisions for zkSDK development.

## Current Active Strategy
**[v1-strategy-2025-10-23-1310.md](./v1-strategy-2025-10-23-1310.md)** - ACTIVE

## Strategy History

| Version | Date | Decision | Status |
|---------|------|----------|--------|
| v1-strategy-2025-10-23-1310 | Oct 23, 2025 | Build zkWalletConnect first, then expand | ACTIVE |

## Key Strategic Decisions

### Current Focus: zkWalletConnect
- Build unified wallet interface FIRST
- Ship v1.0-beta in 4 days
- Add DeFi features in v1.0 stable
- Bitcoin/remaining providers in v1.1

### Core Principle
We're not competing with MetaMask/WalletConnect - we're the **privacy layer** that integrates with them. "The LangChain of Privacy"

## How to Update Strategy

1. Run strategy optimizer: `goose run --recipe recipe-strategy-optimizer.yaml`
2. Create new versioned file: `v1-strategy-YYYY-MM-DD-HHMM.md`
3. Update this README
4. Push to GitHub

## Success Metrics
- v1.0-beta: Day 4 (zkWalletConnect)
- v1.0 stable: Day 9 (+ DeFi features)
- 100+ developers: Day 30