/**
 * Semaphore provider plugin implementation
 */

import { BaseProviderPlugin } from '../core/base-plugin';
import { 
  SemaphoreConfig, 
  ProviderConfig, 
  PrivacyProvider, 
  ValidationResult, 
  ValidationError,
  ChainId 
} from '../types';
import { SemaphoreProvider } from './semaphore-provider';

export class SemaphorePlugin extends BaseProviderPlugin {
  readonly name = 'semaphore';
  readonly version = '1.0.0';
  readonly description = 'Semaphore anonymous signaling protocol';
  readonly supportedChains = [1, 137, 42161, 10, 5]; // EVM chains

  async createProvider(config: ProviderConfig): Promise<PrivacyProvider> {
    const semaphoreConfig = config as SemaphoreConfig;
    return new SemaphoreProvider(semaphoreConfig);
  }

  protected validateProviderConfig(config: ProviderConfig): ValidationResult {
    const semaphoreConfig = config as SemaphoreConfig;
    const errors: ValidationError[] = [];

    const groupIdError = this.validateRequired(semaphoreConfig, 'groupId', 'Semaphore group ID');
    if (groupIdError) {
      errors.push(groupIdError);
    }

    // Validate group ID format
    if (semaphoreConfig.groupId && !/^\d+$/.test(semaphoreConfig.groupId)) {
      errors.push({
        field: 'groupId',
        code: 'INVALID_FORMAT',
        message: 'Group ID must be a numeric string'
      });
    }

    return { valid: errors.length === 0, errors, warnings: [] };
  }

  getDefaultConfig(chainId: ChainId): Partial<SemaphoreConfig> {
    return {
      ...super.getDefaultConfig(chainId),
      type: 'semaphore',
      groupId: '1' // Default group
    };
  }
}