// Railgun SDK Provider Factory

import { ProviderConfig } from '../../types';
import { ProviderFactory } from '../../core/provider';
import { PrivacyProvider } from '../../core/provider';
import { RailgunSDKProvider, RailgunSDKProviderConfig } from './railgun-sdk-provider';
import { NetworkName } from '@railgun-community/shared-models';

/**
 * Factory for creating Railgun SDK providers
 */
export class RailgunSDKProviderFactory implements ProviderFactory {
  /**
   * Create a new Railgun SDK provider instance
   */
  async create(config: ProviderConfig): Promise<PrivacyProvider> {
    const railgunProvider = new RailgunSDKProvider();
    
    // Validation will happen during initialization
    return railgunProvider;
  }

  /**
   * Validate Railgun SDK provider configuration
   */
  validate(config: ProviderConfig): boolean {
    // Basic validation
    if (config.type !== 'railgun') {
      return false;
    }

    if (!config.chainId) {
      return false;
    }

    // Type assertion to access Railgun-specific config
    const railgunConfig = config as RailgunSDKProviderConfig;

    // Validate URL formats if provided
    if (railgunConfig.relayerURL && !this.isValidUrl(railgunConfig.relayerURL)) {
      return false;
    }

    if (railgunConfig.rpcURL && !this.isValidUrl(railgunConfig.rpcURL)) {
      return false;
    }

    // If proof generation mode is provided, validate it
    if (
      railgunConfig.proofGenerationMode && 
      !['local', 'remote'].includes(railgunConfig.proofGenerationMode)
    ) {
      return false;
    }

    // Validate wallet configuration
    if (railgunConfig.walletId && !railgunConfig.walletPassword) {
      return false;
    }

    return true;
  }

  /**
   * Get default configuration for Railgun SDK provider
   */
  getDefaultConfig(): Partial<RailgunSDKProviderConfig> {
    return {
      type: 'railgun',
      networkType: 'mainnet',
      useRelayer: true,
      walletSource: 'privacy-sdk',
      proofGenerationMode: 'local'
    };
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }
}