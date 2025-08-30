// Base recipe implementation for Privacy SDK

import {
  RecipeParams,
  RecipeResult,
  ValidationResult,
  ValidationError,
  FeeEstimate,
  TransactionResult,
  Amount
} from '../types';

import { PrivacyProvider } from '../core/provider';

import { ValidationError as ValidationErr, wrapError } from '../core/errors';

/**
 * Base recipe interface that all recipes must implement
 */
export interface Recipe {
  name: string;
  description: string;
  supportedProviders: string[];
  requiredParams: string[];
  optionalParams: string[];
  
  execute(params: RecipeParams, provider: PrivacyProvider): Promise<RecipeResult>;
  validate(params: RecipeParams): ValidationResult;
  estimateFees(params: RecipeParams, provider: PrivacyProvider): Promise<FeeEstimate>;
}

/**
 * Abstract base class for recipes
 */
export abstract class BaseRecipe implements Recipe {
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly supportedProviders: string[];
  abstract readonly requiredParams: string[];
  abstract readonly optionalParams: string[];

  /**
   * Execute the recipe with given parameters
   */
  async execute(params: RecipeParams, provider: PrivacyProvider): Promise<RecipeResult> {
    const startTime = Date.now();
    
    try {
      // Validate parameters
      const validation = this.validate(params);
      if (!validation.valid) {
        const errorMessages = validation.errors.map(e => `${e.field}: ${e.message}`);
        throw new ValidationErr(
          `Recipe validation failed: ${errorMessages.join(', ')}`,
          undefined,
          provider.name,
          { errors: validation.errors }
        );
      }

      // Check provider support
      if (!this.supportedProviders.includes('*') && !this.supportedProviders.includes(provider.name)) {
        throw new ValidationErr(
          `Recipe '${this.name}' does not support provider '${provider.name}'`,
          'provider',
          provider.name
        );
      }

      // Ensure provider is ready
      if (!provider.isReady()) {
        throw new ValidationErr(
          `Provider '${provider.name}' is not ready`,
          'provider',
          provider.name
        );
      }

      // Execute recipe-specific logic
      const result = await this.performExecution(params, provider);
      
      return {
        success: true,
        transactions: result.transactions,
        totalFees: result.totalFees,
        executionTime: Date.now() - startTime,
        metadata: {
          ...result.metadata,
          recipe: this.name,
          provider: provider.name
        }
      };
    } catch (error) {
      return {
        success: false,
        transactions: [],
        totalFees: '0',
        executionTime: Date.now() - startTime,
        metadata: {
          recipe: this.name,
          provider: provider.name,
          error: wrapError(error, `Recipe '${this.name}' execution failed`, provider.name)
        }
      };
    }
  }

  /**
   * Validate recipe parameters
   */
  validate(params: RecipeParams): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Check required parameters
    for (const param of this.requiredParams) {
      if (!(param in params) || params[param] === undefined || params[param] === null) {
        errors.push({
          field: param,
          code: 'REQUIRED',
          message: `Parameter '${param}' is required`
        });
      }
    }

    // Perform recipe-specific validation
    const specificValidation = this.performValidation(params);
    errors.push(...specificValidation.errors);
    warnings.push(...specificValidation.warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Estimate fees for recipe execution
   */
  async estimateFees(params: RecipeParams, provider: PrivacyProvider): Promise<FeeEstimate> {
    try {
      // Validate parameters first
      const validation = this.validate(params);
      if (!validation.valid) {
        throw new ValidationErr('Cannot estimate fees for invalid parameters');
      }

      return await this.performFeeEstimation(params, provider);
    } catch (error) {
      throw wrapError(error, `Fee estimation failed for recipe '${this.name}'`, provider.name);
    }
  }

  // Abstract methods that subclasses must implement
  protected abstract performExecution(
    params: RecipeParams, 
    provider: PrivacyProvider
  ): Promise<{ transactions: TransactionResult[]; totalFees: Amount; metadata?: Record<string, any> }>;
  
  protected abstract performValidation(params: RecipeParams): ValidationResult;
  
  protected abstract performFeeEstimation(
    params: RecipeParams, 
    provider: PrivacyProvider
  ): Promise<FeeEstimate>;

  /**
   * Helper method to calculate total fees from transactions
   */
  protected calculateTotalFees(transactions: TransactionResult[]): Amount {
    const total = transactions.reduce((sum, tx) => {
      const fee = tx.fee ? parseFloat(tx.fee) : 0;
      return sum + fee;
    }, 0);
    
    return total.toString();
  }
}
