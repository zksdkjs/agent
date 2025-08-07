/**
 * Base recipe class for common privacy operations
 */

import {
  Recipe,
  RecipeParams,
  RecipeResult,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  FeeEstimate,
  PrivacyProvider
} from '../types';
import { ValidationError as ValidationErrorClass } from '../types/errors';

export abstract class BaseRecipe implements Recipe {
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly supportedProviders: string[];
  abstract readonly requiredParams: string[];
  abstract readonly optionalParams: string[];

  abstract execute(params: RecipeParams): Promise<RecipeResult>;

  validate(params: RecipeParams): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate required parameters
    for (const param of this.requiredParams) {
      if (!(param in params) || params[param] === undefined || params[param] === null) {
        errors.push({
          field: param,
          code: 'REQUIRED',
          message: `Parameter '${param}' is required`
        });
      }
    }

    // Validate provider is supported
    if (params.provider && !this.supportedProviders.includes(params.provider)) {
      errors.push({
        field: 'provider',
        code: 'UNSUPPORTED',
        message: `Provider '${params.provider}' is not supported. Supported providers: ${this.supportedProviders.join(', ')}`
      });
    }

    // Recipe-specific validation
    const recipeValidation = this.validateRecipeParams(params);
    errors.push(...recipeValidation.errors);
    warnings.push(...recipeValidation.warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  async estimateFees(params: RecipeParams): Promise<FeeEstimate> {
    // Default fee estimation - override in specific recipes
    return {
      estimatedFee: '0',
      currency: 'ETH',
      confidence: 'low',
      factors: [
        {
          type: 'network',
          impact: 'medium',
          description: 'Network congestion affects transaction fees'
        },
        {
          type: 'privacy',
          impact: 'high',
          description: 'Privacy features require additional computation'
        }
      ]
    };
  }

  protected abstract validateRecipeParams(params: RecipeParams): ValidationResult;

  protected validateAddress(address: string, fieldName: string): ValidationError | null {
    if (!address || typeof address !== 'string') {
      return {
        field: fieldName,
        code: 'INVALID_FORMAT',
        message: `${fieldName} must be a valid address string`
      };
    }

    // Basic address validation (can be enhanced for specific formats)
    if (!/^0x[a-fA-F0-9]{40}$/.test(address) && !address.includes('_railgun') && !address.startsWith('B62q')) {
      return {
        field: fieldName,
        code: 'INVALID_FORMAT',
        message: `${fieldName} is not a valid address format`
      };
    }

    return null;
  }

  protected validateAmount(amount: string, fieldName: string): ValidationError | null {
    if (!amount || typeof amount !== 'string') {
      return {
        field: fieldName,
        code: 'INVALID_FORMAT',
        message: `${fieldName} must be a valid amount string`
      };
    }

    if (!/^\d+$/.test(amount)) {
      return {
        field: fieldName,
        code: 'INVALID_FORMAT',
        message: `${fieldName} must be a positive integer string`
      };
    }

    if (BigInt(amount) <= 0) {
      return {
        field: fieldName,
        code: 'INVALID_VALUE',
        message: `${fieldName} must be greater than 0`
      };
    }

    return null;
  }

  protected createRecipeResult(
    transactions: any[],
    startTime: number,
    success: boolean = true,
    metadata?: Record<string, any>
  ): RecipeResult {
    const totalFees = transactions.reduce((sum, tx) => {
      const fee = BigInt(tx.fee || '0');
      return (BigInt(sum) + fee).toString();
    }, '0');

    return {
      success,
      transactions,
      totalFees,
      executionTime: Date.now() - startTime,
      metadata
    };
  }
}