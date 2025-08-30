// Railgun Provider Factory

import { ProviderConfig } from '../../types';
import { ProviderFactory } from '../../core/provider';
import { PrivacyProvider } from '../../core/provider';
import { RailgunProvider, RailgunProviderConfig } from './railgun-provider';

/**
 * Factory for creating Railgun providers
 */
export class RailgunProviderFactory implements ProviderFactory {
  /**
   * Create a new Railgun provider instance
   */
  async create(config: ProviderConfig): Promise<PrivacyProvider> {
    const railgunProvider = new RailgunProvider();
    
    // Validation will happen during initialization
    return railgunProvider;
  }

  /**
   * Validate Railgun provider configuration
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
    const railgunConfig = config as RailgunProviderConfig;

    // Validate URL formats if provided
    if (railgunConfig.relayerUrl && !this.isValidUrl(railgunConfig.relayerUrl)) {
      return false;
    }

    if (railgunConfig.nodeUrl && !this.isValidUrl(railgunConfig.nodeUrl)) {
      return false;
    }

    // If proof generation mode is provided, validate it
    if (
      railgunConfig.proofGenerationMode && 
      !['local', 'remote'].includes(railgunConfig.proofGenerationMode)
    ) {
      return false;
    }

    return true;
  }

  /**
   * Get default configuration for Railgun provider
   */
  getDefaultConfig(): Partial<RailgunProviderConfig> {
    return {
      type: 'railgun',
      networkType: 'mainnet',
      useRelayer: true,
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