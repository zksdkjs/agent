# Privacy SDK

> Unified Privacy SDK for Web3 Developers - A single interface for multiple privacy systems

[![NPM Version](https://img.shields.io/npm/v/@privacy-sdk/core.svg)](https://www.npmjs.com/package/@privacy-sdk/core)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Documentation](https://img.shields.io/badge/docs-privacy--sdk.dev-blue.svg)](https://privacy-sdk.dev)

## Overview

Privacy SDK provides a unified TypeScript interface for building privacy-preserving applications across multiple Web3 privacy systems. With a single API, you can integrate Railgun (EVM privacy), Mina (zkApps), and Semaphore (anonymous signaling) into your applications.

## ✨ Features

- **🛡️ Unified Interface**: One API for multiple privacy systems
- **⚡ Production Ready**: Enterprise-grade error handling and type safety
- **🔌 Plugin Architecture**: Extensible provider system
- **🧩 Recipe System**: Pre-built solutions for common operations
- **📚 TypeScript First**: Complete type definitions and IntelliSense support
- **🎯 Developer Experience**: Intuitive APIs with comprehensive documentation

## 🚀 Quick Start

### Installation

```bash
npm install @privacy-sdk/core
```

### Basic Usage

```typescript
import { createPrivacySDK } from '@privacy-sdk/core';

// Initialize the SDK
const sdk = createPrivacySDK({
  provider: 'railgun',
  chainId: 1
});

await sdk.initialize();

// Execute a private transfer
const result = await sdk.recipes.privateTransfer({
  to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
  amount: '1000000000000000000', // 1 ETH
  memo: 'Private payment'
});

console.log('Transaction:', result.transactions[0].hash);
```

## 🔧 Supported Privacy Systems

| System | Chains | Use Cases | Status |
|--------|--------|-----------|--------|
| **Railgun** | Ethereum, Polygon, Arbitrum, Optimism | Private DeFi, transfers, swaps | ✅ Production |
| **Aztec** | Ethereum (Sepolia) | Private transactions, contract privacy | 🔄 Beta |
| **Mina** | Mina Mainnet, Berkeley Testnet | zkApps, private computation | ✅ Production |
| **Semaphore** | EVM chains | Anonymous voting, signaling | ✅ Production |

## 📖 Documentation

- **[Full Documentation](https://privacy-sdk.dev/docs)** - Complete guides and API reference
- **[Getting Started Guide](https://privacy-sdk.dev/docs#getting-started)** - Your first private transaction
- **[API Reference](https://privacy-sdk.dev/api)** - Detailed API documentation
- **[Guides & Examples](https://privacy-sdk.dev/guides)** - Step-by-step tutorials

## 🏗️ Project Structure

```
privacy-sdk-project/
├── packages/
│   ├── sdk/                 # Core Privacy SDK package
│   │   ├── src/
│   │   │   ├── providers/   # Provider implementations
│   │   │   │   ├── railgun/ # Railgun provider
│   │   │   │   └── aztec/   # Aztec provider with PXE integration
│   │   │   └── recipes/     # Pre-built patterns
│   │   └── examples/        # SDK-specific examples
│   └── website/             # Documentation website
├── examples/                # Usage examples
│   ├── basic-usage.ts       # Simple getting started example
│   ├── multi-provider.ts    # Multi-provider setup
│   ├── cross-provider-example.ts # Cross-provider transfers
│   └── custom-recipe.ts     # Custom recipe creation
├── blogs/                   # Developer blogs
│   ├── day1-inception.md    # Initial development story
│   └── day2-progress.md     # Current progress
└── docs/                    # Architecture documentation
```

## 🛠️ Development

### Prerequisites

- Node.js 16.0 or higher
- pnpm (recommended) or npm
- TypeScript 4.5 or higher

### Building the SDK

```bash
# Install dependencies
pnpm install

# Build the SDK
cd packages/sdk
pnpm build

# Run tests
pnpm test
```

### Running Examples

```bash
# Run basic usage example
pnpm tsx examples/basic-usage.ts

# Run multi-provider example
pnpm tsx examples/multi-provider.ts

# Run custom recipe example
pnpm tsx examples/custom-recipe.ts
```

### Development Website

```bash
# Start the documentation website
cd packages/website
pnpm dev
```

## 🧪 Examples

### Multi-Provider Setup

```typescript
import { PrivacySDK } from '@privacy-sdk/core';

const sdk = new PrivacySDK({
  defaultProvider: 'railgun',
  providers: {
    railgun: {
      type: 'railgun',
      chainId: 1,
      networkName: 'ethereum'
    },
    aztec: {
      type: 'aztec',
      chainId: 11155111, // Sepolia testnet
      networkType: 'testnet',
      rpcUrl: 'https://api.aztec.network/aztec-connect-testnet/falafel'
    },
    mina: {
      type: 'mina',
      chainId: 'mina-mainnet',
      networkId: 'mainnet'
    },
    semaphore: {
      type: 'semaphore',
      chainId: 1,
      groupId: '1'
    }
  }
});

// Use different providers for different operations
await sdk.recipes.privateSwap({ provider: 'railgun', ... });
await sdk.recipes.privateTransfer({ provider: 'aztec', ... });
await sdk.recipes.anonymousVote({ provider: 'semaphore', ... });
```

### Custom Recipe

```typescript
import { BaseRecipe } from '@privacy-sdk/core';

class CustomPrivacyRecipe extends BaseRecipe {
  readonly name = 'my_custom_recipe';
  readonly supportedProviders = ['railgun', 'mina'];
  
  async execute(params) {
    // Your custom privacy logic here
  }
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Railgun](https://railgun.org) - EVM privacy protocol
- [Mina Protocol](https://minaprotocol.com) - Lightweight blockchain with zkApps
- [Semaphore](https://semaphore.appliedzkp.org) - Anonymous signaling protocol

## 📞 Support

- **Documentation**: [privacy-sdk.dev](https://privacy-sdk.dev)
- **Issues**: [GitHub Issues](https://github.com/privacy-sdk/core/issues)
- **Discord**: [Privacy SDK Community](https://discord.gg/privacy-sdk)
- **Email**: [support@privacy-sdk.dev](mailto:support@privacy-sdk.dev)

---

**Built with ❤️ by MiniMax Agent**