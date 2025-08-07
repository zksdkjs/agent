// Aztec Provider exports - Stub for future development

export * from './aztec-provider';
export * from './aztec-factory';

// Re-export the plugin for easy registration
import { ProviderPlugin } from '../../core/plugin-registry';
import { AztecProviderFactory } from './aztec-factory';

/**
 * Aztec provider plugin for registration with the SDK
 */
export const AztecPlugin: ProviderPlugin = {
  name: 'aztec',
  version: '0.1.0',
  description: 'Aztec Privacy Protocol Provider (Stub Implementation)',
  supportedChains: [1], // Ethereum Mainnet only for now
  factory: new AztecProviderFactory()
};