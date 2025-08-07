# Privacy SDK Examples

This directory contains practical examples demonstrating how to use the Privacy SDK in different scenarios.

## 📁 Available Examples

### 1. Basic Usage (`basic-usage.ts`)

**Level**: Beginner  
**Duration**: 10 minutes

Learn the fundamentals of Privacy SDK including:
- SDK initialization
- Simple private transfers
- Event handling
- Basic error handling

```bash
npx tsx basic-usage.ts
```

### 2. Multi-Provider Setup (`multi-provider.ts`)

**Level**: Intermediate  
**Duration**: 20 minutes

Explore using multiple privacy providers:
- Configuring Railgun, Mina, and Semaphore
- Provider-specific operations
- Cross-provider workflows
- Fee comparison

```bash
npx tsx multi-provider.ts
```

### 3. Custom Recipes (`custom-recipe.ts`)

**Level**: Advanced  
**Duration**: 30 minutes

Create custom privacy operations:
- Batch transfer recipe
- Privacy score calculator
- Custom validation logic
- Recipe registration

```bash
npx tsx custom-recipe.ts
```

## 🚀 Running Examples

### Prerequisites

```bash
# Install dependencies
npm install

# Install tsx for TypeScript execution
npm install -g tsx
```

### Individual Examples

```bash
# Run basic usage example
npx tsx examples/basic-usage.ts

# Run multi-provider example
npx tsx examples/multi-provider.ts

# Run custom recipe example
npx tsx examples/custom-recipe.ts
```

### All Examples

```bash
# Run all examples in sequence
npm run examples
```

## 📖 Example Structure

Each example follows a consistent structure:

```typescript
/**
 * Example Title - Privacy SDK
 * 
 * Brief description of what this example demonstrates.
 */

import { PrivacySDK } from '@privacy-sdk/core';

async function exampleFunction() {
  console.log('🚀 Example Title');
  
  try {
    // Main example logic here
    console.log('✅ Example completed successfully');
  } catch (error) {
    console.error('❌ Error in example:', error);
  } finally {
    // Cleanup
    console.log('🧹 Cleanup completed');
  }
}

// Run the example
if (require.main === module) {
  exampleFunction().catch(console.error);
}

export { exampleFunction };
```

## 🎯 Learning Path

We recommend following examples in this order:

1. **Basic Usage** - Get familiar with core concepts
2. **Multi-Provider** - Understand provider differences
3. **Custom Recipes** - Learn to extend functionality

## 🔧 Configuration

### Environment Variables

Some examples may require environment variables:

```bash
# Create .env file
ETHEREUM_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/your-api-key
MINA_NETWORK_URL=https://proxy.berkeley.minaexplorer.com/graphql
SEMAPHORE_GROUP_ID=1
```

### Provider Configuration

Examples use demo configurations that work out of the box:

```typescript
// Railgun configuration
const railgunConfig = {
  type: 'railgun',
  chainId: 1,
  networkName: 'ethereum'
};

// Mina configuration
const minaConfig = {
  type: 'mina',
  chainId: 'mina-mainnet',
  networkId: 'mainnet'
};

// Semaphore configuration
const semaphoreConfig = {
  type: 'semaphore',
  chainId: 1,
  groupId: '1'
};
```

## ⚠️ Important Notes

### Demo Nature

These examples use simulated implementations:
- No real transactions are executed
- Provider operations are mocked for demonstration
- Suitable for learning and development

### Production Usage

For production use:
- Replace with real provider configurations
- Implement proper key management
- Add comprehensive error handling
- Follow security best practices

## 🐛 Troubleshooting

### Common Issues

**1. Import Errors**
```bash
# Make sure the SDK is built
cd packages/sdk
npm run build
```

**2. TypeScript Errors**
```bash
# Install tsx globally
npm install -g tsx

# Or use npx
npx tsx examples/basic-usage.ts
```

**3. Provider Initialization Fails**
```typescript
// Check provider configuration
console.log('Provider status:', sdk.getProviderStatus('railgun'));
```

### Getting Help

If you encounter issues:

1. Check the [documentation](https://privacy-sdk.dev)
2. Review the [troubleshooting guide](https://privacy-sdk.dev/docs#troubleshooting)
3. Open an [issue](https://github.com/privacy-sdk/core/issues)
4. Ask in our [Discord community](https://discord.gg/privacy-sdk)

## 🤝 Contributing Examples

We welcome new examples! To contribute:

1. Fork the repository
2. Create a new example file
3. Follow the existing structure
4. Add documentation
5. Test thoroughly
6. Submit a pull request

### Example Guidelines

- Use clear, descriptive names
- Include comprehensive comments
- Demonstrate one main concept per example
- Provide error handling
- Add console output for clarity

---

**Need help?** Check out our [documentation](https://privacy-sdk.dev) or join our [community](https://discord.gg/privacy-sdk)!