---
sidebar_position: 1
---

# zkthings Libraries

Zero-knowledge proof libraries for building privacy-first applications.

## Available Libraries

zkthings provides modular zero-knowledge proof libraries for EVM, Solana, and StarkNet. Each library focuses on a specific privacy primitive, allowing you to download only what you need.

| Package | What it does | Use Cases | 
|---------|-------------|-----------|
| **Membership Proofs** | Prove you're in a set without revealing which member | Allowlists, access control, private voting |
| **Range Proofs** | Prove values are within ranges without revealing exact amounts | Age verification, credit scores, balance checks |
| **E2E Encryption (EVM)** | Private messaging using secp256k1 keys | EVM wallet-to-wallet chat, Ethereum data sharing |
| **E2E Encryption (Ed25519)** | Private messaging using Ed25519 keys | Solana, StarkNet wallet encryption, secure messaging |

## Quick Installation

```bash
# Choose the package you need
npm install @zkthings/proof-membership-evm     # Membership proofs
npm install @zkthings/range-proof-evm          # Range proofs  
npm install @zkthings/e2e-encryption-secp256k1 # E2E encryption (EVM)
npm install @zkthings/e2e-encryption-ed25519   # E2E encryption (Ed25519)
```

## Getting Started

Each library is designed to be simple and modular. Click on any guide in the sidebar to see detailed examples and implementation instructions.

All libraries are:
- **Production ready** - Used in real applications
- **Well documented** - Complete guides with examples
- **Modular** - Install only what you need
- **Cross-chain** - Support for multiple blockchains


