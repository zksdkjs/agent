/**
 * Mina provider plugin implementation
 */

import { BaseProviderPlugin } from '../core/base-plugin';
import { 
  MinaConfig, 
  ProviderConfig, 
  PrivacyProvider, 
  ValidationResult, 
  ValidationError,
  ChainId 
} from '../types';
import { MinaProvider } from './mina-provider';

export class MinaPlugin extends BaseProviderPlugin {
  readonly name = 'mina';
  readonly version = '1.0.0';
  readonly description = 'Mina Protocol zkApps for privacy';
  readonly supportedChains = ['mina-mainnet', 'mina-berkeley'];

  async createProvider(config: ProviderConfig): Promise<PrivacyProvider> {
    const minaConfig = config as MinaConfig;
    return new MinaProvider(minaConfig);
  }

  protected validateProviderConfig(config: ProviderConfig): ValidationResult {
    const minaConfig = config as MinaConfig;
    const errors: ValidationError[] = [];

    const networkIdError = this.validateRequired(minaConfig, 'networkId', 'Mina network ID');
    if (networkIdError) {
      errors.push(networkIdError);
    }

    // Validate network ID
    if (minaConfig.networkId) {
      const validNetworks = ['mainnet', 'berkeley'];
      if (!validNetworks.includes(minaConfig.networkId)) {
        errors.push({
          field: 'networkId',
          code: 'INVALID_VALUE',
          message: `Invalid network ID. Supported networks: ${validNetworks.join(', ')}`
        });
      }
    }

    return { valid: errors.length === 0, errors, warnings: [] };
  }

  getDefaultConfig(chainId: ChainId): Partial<MinaConfig> {
    return {
      ...super.getDefaultConfig(chainId),
      type: 'mina',
      networkId: chainId === 'mina-mainnet' ? 'mainnet' : 'berkeley'
    };
  }
}