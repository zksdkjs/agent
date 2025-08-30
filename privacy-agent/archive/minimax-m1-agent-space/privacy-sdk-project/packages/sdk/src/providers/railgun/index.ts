// Railgun Provider exports

// Export the mock provider (for testing)
export * from './railgun-provider';
export * from './railgun-factory';

// Export the SDK provider (for production use)
export * from './railgun-sdk-provider';
export * from './railgun-sdk-factory';

// Re-export the plugins for easy registration
import { ProviderPlugin } from '../../core/plugin-registry';
import { RailgunProviderFactory } from './railgun-factory';
import { RailgunSDKProviderFactory } from './railgun-sdk-factory';

/**
 * Railgun mock provider plugin for registration with the SDK (for testing)
 */
export const RailgunMockPlugin: ProviderPlugin = {
  name: 'railgun-mock',
  version: '1.0.0',
  description: 'Railgun Privacy Protocol Mock Provider (for testing)',
  supportedChains: [1, 137, 42161, 10, 56, 43114, 42220],
  factory: new RailgunProviderFactory()
};

/**
 * Railgun SDK provider plugin for registration with the SDK (for production)
 */
export const RailgunPlugin: ProviderPlugin = {
  name: 'railgun',
  version: '1.0.0',
  description: 'Railgun Privacy Protocol Provider with SDK Integration',
  supportedChains: [1, 137, 42161, 10, 56, 43114, 42220],
  factory: new RailgunSDKProviderFactory()
};