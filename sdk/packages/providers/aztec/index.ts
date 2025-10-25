// Aztec Provider exports

export * from './aztec-provider.js';
export * from './aztec-factory.js';
export * from './services/index.js';

// Re-export the plugin for easy registration
import { AztecProviderFactory } from './aztec-factory.js';

/**
 * Aztec provider plugin for registration with the SDK
 */
export const AztecPlugin = {
  name: 'aztec',
  version: '1.0.0',
  description: 'Aztec Privacy Protocol Provider',
  supportedChains: [1, 5, 11155111], // Ethereum Mainnet, Goerli, Sepolia
  factory: new AztecProviderFactory()
};
