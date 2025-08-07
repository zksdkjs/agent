/**
 * Privacy SDK - Unified interface for Web3 privacy systems
 * 
 * Enables developers to implement private transactions across multiple privacy systems
 * (RailGun, Mina, Semaphore) with a single, simple interface.
 * 
 * @example
 * ```typescript
 * import { PrivacySDK } from '@privacy-sdk/core';
 * 
 * const sdk = new PrivacySDK({
 *   defaultProvider: 'railgun',
 *   providers: {
 *     railgun: {
 *       type: 'railgun',
 *       chainId: 1,
 *       networkType: 'mainnet',
 *       networkName: 'ethereum'
 *     }
 *   }
 * });
 * 
 * await sdk.initialize();
 * 
 * // Simple private transfer
 * const result = await sdk.recipes.privateTransfer({
 *   to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
 *   amount: '1000000000000000000', // 1 ETH
 *   token: 'ETH'
 * });
 * ```
 */

// Core SDK
export { PrivacySDK } from './core/privacy-sdk';
export { PluginRegistryImpl as PluginRegistry } from './core/plugin-registry';
export { BaseProviderPlugin } from './core/base-plugin';
export { EventEmitter } from './core/event-emitter';

// Providers
export { RailgunProvider } from './providers/railgun-provider';
export { MinaProvider } from './providers/mina-provider';
export { SemaphoreProvider } from './providers/semaphore-provider';
export { RailgunPlugin } from './providers/railgun-plugin';
export { MinaPlugin } from './providers/mina-plugin';
export { SemaphorePlugin } from './providers/semaphore-plugin';

// Recipes
export { 
  BaseRecipe,
  PrivateTransferRecipe,
  PrivateSwapRecipe,
  AnonymousVotingRecipe,
  RecipeRegistry,
  privateTransferRecipe,
  privateSwapRecipe,
  anonymousVotingRecipe,
  recipeRegistry
} from './recipes';

// Types
export * from './types';

// Utilities
export * from './utils';

// Version
export const VERSION = '1.0.0';

/**
 * Create a PrivacySDK instance with minimal configuration
 * 
 * @example
 * ```typescript
 * import { createPrivacySDK } from '@privacy-sdk/core';
 * 
 * const sdk = createPrivacySDK({
 *   provider: 'railgun',
 *   chainId: 1
 * });
 * ```
 */
export function createPrivacySDK(config: {
  provider: 'railgun' | 'mina' | 'semaphore';
  chainId: number | string;
  networkType?: 'mainnet' | 'testnet' | 'devnet';
  [key: string]: any;
}): PrivacySDK {
  const { provider, chainId, networkType = 'mainnet', ...rest } = config;
  
  const providerConfig = {
    type: provider,
    chainId,
    networkType,
    ...rest
  };
  
  // Add provider-specific defaults
  if (provider === 'railgun') {
    const networkMap: Record<number, string> = {
      1: 'ethereum',
      137: 'polygon',
      42161: 'arbitrum',
      10: 'optimism'
    };
    providerConfig.networkName = networkMap[chainId as number] || 'ethereum';
  } else if (provider === 'mina') {
    providerConfig.networkId = chainId === 'mina-mainnet' ? 'mainnet' : 'berkeley';
  } else if (provider === 'semaphore') {
    providerConfig.groupId = '1';
  }
  
  return new PrivacySDK({
    defaultProvider: provider,
    providers: {
      [provider]: providerConfig
    }
  });
}

/**
 * Default configurations for common setups
 */
export const defaultConfigs = {
  /**
   * Ethereum mainnet with Railgun
   */
  ethereumRailgun: {
    defaultProvider: 'railgun',
    providers: {
      railgun: {
        type: 'railgun',
        chainId: 1,
        networkType: 'mainnet' as const,
        networkName: 'ethereum'
      }
    }
  },
  
  /**
   * Polygon with Railgun
   */
  polygonRailgun: {
    defaultProvider: 'railgun',
    providers: {
      railgun: {
        type: 'railgun',
        chainId: 137,
        networkType: 'mainnet' as const,
        networkName: 'polygon'
      }
    }
  },
  
  /**
   * Mina mainnet
   */
  minaMainnet: {
    defaultProvider: 'mina',
    providers: {
      mina: {
        type: 'mina',
        chainId: 'mina-mainnet',
        networkType: 'mainnet' as const,
        networkId: 'mainnet'
      }
    }
  },
  
  /**
   * Multi-provider setup with all systems
   */
  multiProvider: {
    defaultProvider: 'railgun',
    providers: {
      railgun: {
        type: 'railgun',
        chainId: 1,
        networkType: 'mainnet' as const,
        networkName: 'ethereum'
      },
      mina: {
        type: 'mina',
        chainId: 'mina-mainnet',
        networkType: 'mainnet' as const,
        networkId: 'mainnet'
      },
      semaphore: {
        type: 'semaphore',
        chainId: 1,
        networkType: 'mainnet' as const,
        groupId: '1'
      }
    }
  }
};