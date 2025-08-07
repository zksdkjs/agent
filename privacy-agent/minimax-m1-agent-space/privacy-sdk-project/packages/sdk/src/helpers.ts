// Helper functions for creating and configuring the Privacy SDK

import { PrivacySDK } from './privacy-sdk';
import { SDKConfig, ChainId, NetworkType } from './types';
import { registerBuiltInProviders } from './providers';
import { pluginRegistry } from './core/plugin-registry';

// Clear the existing registry and register all built-in providers
pluginRegistry.clear();
registerBuiltInProviders(pluginRegistry);

// Interface for simplified SDK creation
export interface SimplifiedSDKConfig {
  provider: string;
  chainId: ChainId;
  networkType?: NetworkType;
  apiKey?: string;
  relayerUrl?: string;
  nodeUrl?: string;
  testing?: boolean; // Whether to use mock providers for testing
  walletId?: string; // For Railgun provider, wallet ID
  walletPassword?: string; // For Railgun provider, wallet password
  [key: string]: any;
}

/**
 * Create a Privacy SDK instance with simplified configuration
 */
export function createPrivacySDK(config: SimplifiedSDKConfig): PrivacySDK {
  const { 
    provider, 
    chainId, 
    networkType = 'mainnet', 
    testing = false,
    ...rest 
  } = config;
  
  // Create full configuration
  const fullConfig: SDKConfig = {
    defaultProvider: provider,
    providers: {
      [provider]: {
        type: provider,
        chainId,
        networkType,
        ...rest
      }
    }
  };
  
  // Reset the plugin registry and register providers based on testing flag
  pluginRegistry.clear();
  registerBuiltInProviders(pluginRegistry, testing);
  
  return new PrivacySDK(fullConfig);
}

/**
 * Create a Privacy SDK instance for testing with mock providers
 */
export function createTestingSDK(config: SimplifiedSDKConfig): PrivacySDK {
  return createPrivacySDK({
    ...config,
    testing: true
  });
}

/**
 * Default configurations for common use cases
 */
export const defaultConfigs = {
  // Configuration with Railgun as the only provider
  railgunOnly: {
    defaultProvider: 'railgun',
    providers: {
      railgun: {
        type: 'railgun',
        chainId: 1,
        networkType: 'mainnet',
        useRelayer: true,
        walletSource: 'privacy-sdk'
      }
    }
  },
  
  // Configuration with all providers
  multiProvider: {
    defaultProvider: 'railgun',
    providers: {
      railgun: {
        type: 'railgun',
        chainId: 1,
        networkType: 'mainnet',
        useRelayer: true,
        walletSource: 'privacy-sdk'
      },
      aztec: {
        type: 'aztec',
        chainId: 1,
        networkType: 'mainnet'
      }
    },
    keyManagement: {
      storage: 'memory',
      encryption: true
    },
    logging: {
      level: 'info',
      enabled: true
    }
  },
  
  // Testing configuration with mock providers
  testing: {
    defaultProvider: 'railgun-mock',
    providers: {
      'railgun-mock': {
        type: 'railgun-mock',
        chainId: 1,
        networkType: 'testnet'
      },
      aztec: {
        type: 'aztec',
        chainId: 1,
        networkType: 'testnet'
      }
    },
    keyManagement: {
      storage: 'memory',
      encryption: false
    },
    logging: {
      level: 'debug',
      enabled: true
    }
  }
};