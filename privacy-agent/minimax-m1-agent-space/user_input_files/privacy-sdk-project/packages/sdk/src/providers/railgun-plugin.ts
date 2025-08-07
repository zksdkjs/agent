/**
 * Railgun provider plugin implementation
 */

import { BaseProviderPlugin } from '../core/base-plugin';
import { 
  RailgunConfig, 
  ProviderConfig, 
  PrivacyProvider, 
  ValidationResult, 
  ValidationError,
  ChainId 
} from '../types';
import { RailgunProvider } from './railgun-provider';

export class RailgunPlugin extends BaseProviderPlugin {
  readonly name = 'railgun';
  readonly version = '1.0.0';
  readonly description = 'Railgun privacy protocol for EVM chains';
  readonly supportedChains = [1, 137, 42161, 10]; // Ethereum, Polygon, Arbitrum, Optimism

  async createProvider(config: ProviderConfig): Promise<PrivacyProvider> {
    const railgunConfig = config as RailgunConfig;
    return new RailgunProvider(railgunConfig);
  }

  protected validateProviderConfig(config: ProviderConfig): ValidationResult {
    const railgunConfig = config as RailgunConfig;
    const errors: ValidationError[] = [];

    const networkNameError = this.validateRequired(railgunConfig, 'networkName', 'Railgun network name');
    if (networkNameError) {
      errors.push(networkNameError);
    }

    // Validate network name matches supported chains
    if (railgunConfig.networkName) {
      const validNetworks = ['ethereum', 'polygon', 'arbitrum', 'optimism'];
      if (!validNetworks.includes(railgunConfig.networkName)) {
        errors.push({
          field: 'networkName',
          code: 'INVALID_VALUE',
          message: `Invalid network name. Supported networks: ${validNetworks.join(', ')}`
        });
      }
    }

    return { valid: errors.length === 0, errors, warnings: [] };
  }

  getDefaultConfig(chainId: ChainId): Partial<RailgunConfig> {
    const networkMap: Record<number, string> = {
      1: 'ethereum',
      137: 'polygon',
      42161: 'arbitrum',
      10: 'optimism'
    };

    return {
      ...super.getDefaultConfig(chainId),
      type: 'railgun',
      networkName: networkMap[chainId as number] || 'ethereum'
    };
  }
}