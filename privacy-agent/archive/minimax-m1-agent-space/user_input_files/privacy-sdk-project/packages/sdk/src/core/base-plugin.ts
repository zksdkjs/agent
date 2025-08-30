/**
 * Base plugin class that all provider plugins must extend
 */

import { 
  ProviderPlugin, 
  ProviderConfig, 
  PrivacyProvider, 
  ValidationResult, 
  ValidationError, 
  ValidationWarning,
  ChainId 
} from '../types';
import { ConfigurationError } from '../types/errors';

export abstract class BaseProviderPlugin implements ProviderPlugin {
  abstract readonly name: string;
  abstract readonly version: string;
  abstract readonly description: string;
  abstract readonly supportedChains: ChainId[];

  abstract createProvider(config: ProviderConfig): Promise<PrivacyProvider>;
  
  validateConfig(config: ProviderConfig): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Base validation logic
    if (!config.chainId) {
      errors.push({
        field: 'chainId',
        code: 'REQUIRED',
        message: 'Chain ID is required'
      });
    }

    if (!config.type) {
      errors.push({
        field: 'type',
        code: 'REQUIRED',
        message: 'Provider type is required'
      });
    }

    // Check if chain is supported
    if (config.chainId && !this.supportedChains.includes(config.chainId)) {
      errors.push({
        field: 'chainId',
        code: 'UNSUPPORTED',
        message: `Chain ${config.chainId} is not supported by ${this.name}`
      });
    }

    // Provider-specific validation in subclasses
    const providerValidation = this.validateProviderConfig(config);
    errors.push(...providerValidation.errors);
    warnings.push(...providerValidation.warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  protected abstract validateProviderConfig(config: ProviderConfig): ValidationResult;
  
  getDefaultConfig(chainId: ChainId): Partial<ProviderConfig> {
    return {
      chainId,
      networkType: 'mainnet'
    };
  }

  protected validateRequired(config: any, field: string, fieldName?: string): ValidationError | null {
    if (!config[field]) {
      return {
        field,
        code: 'REQUIRED',
        message: `${fieldName || field} is required`
      };
    }
    return null;
  }

  protected validateType(config: any, field: string, expectedType: string, fieldName?: string): ValidationError | null {
    if (config[field] && typeof config[field] !== expectedType) {
      return {
        field,
        code: 'INVALID_TYPE',
        message: `${fieldName || field} must be of type ${expectedType}`
      };
    }
    return null;
  }
}