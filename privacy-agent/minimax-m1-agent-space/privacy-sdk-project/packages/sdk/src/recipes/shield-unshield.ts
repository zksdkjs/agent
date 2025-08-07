// Shield/Unshield Recipes - Convert between public and private tokens

import {
  RecipeParams,
  ValidationResult,
  ValidationError,
  FeeEstimate,
  TransactionResult,
  Amount,
  PrivateAddress,
  PublicAddress,
  TokenInfo,
  Address
} from '../types';

import { PrivacyProvider } from '../core/provider';
import { BaseRecipe } from './base-recipe';
import { ValidationError as ValidationErr } from '../core/errors';

/**
 * Parameters for shield recipe (public -> private)
 */
export interface ShieldParams extends RecipeParams {
  token: TokenInfo | Address;
  amount: Amount;
  to: PrivateAddress;
  from?: PublicAddress;
}

/**
 * Parameters for unshield recipe (private -> public)
 */
export interface UnshieldParams extends RecipeParams {
  token: TokenInfo | Address;
  amount: Amount;
  to: PublicAddress;
  from?: PrivateAddress;
}

/**
 * Recipe for shielding tokens (converting public tokens to private)
 */
export class ShieldRecipe extends BaseRecipe {
  readonly name = 'shield';
  readonly description = 'Shield public tokens to make them private';
  readonly supportedProviders = ['*']; // All privacy providers should support this
  readonly requiredParams = ['token', 'amount', 'to'];
  readonly optionalParams = ['from', 'provider'];

  protected async performExecution(
    params: ShieldParams,
    provider: PrivacyProvider
  ): Promise<{ transactions: TransactionResult[]; totalFees: Amount; metadata?: Record<string, any> }> {
    
    const tokenAddress = typeof params.token === 'string' ? params.token : params.token.address;
    
    // Check if provider has shield method
    if ('shield' in provider && typeof provider.shield === 'function') {
      const transaction = await provider.shield(tokenAddress, params.amount, params.to);
      const transactions = [transaction];
      
      return {
        transactions,
        totalFees: this.calculateTotalFees(transactions),
        metadata: {
          operation: 'shield',
          token: params.token,
          amount: params.amount,
          recipient: params.to
        }
      };
    } else {
      // Fallback to generic private transaction
      const transaction = await provider.sendPrivateTransaction({
        type: 'shield',
        token: params.token,
        amount: params.amount,
        to: params.to,
        from: params.from
      });
      
      return {
        transactions: [transaction],
        totalFees: this.calculateTotalFees([transaction]),
        metadata: {
          operation: 'shield',
          token: params.token,
          amount: params.amount,
          recipient: params.to
        }
      };
    }
  }

  protected performValidation(params: ShieldParams): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Validate token
    if (!this.isValidTokenOrAddress(params.token)) {
      errors.push({
        field: 'token',
        code: 'INVALID',
        message: 'Invalid token format'
      });
    }

    // Validate amount
    if (!params.amount || parseFloat(params.amount) <= 0) {
      errors.push({
        field: 'amount',
        code: 'INVALID',
        message: 'Amount must be a positive number'
      });
    }

    // Validate recipient (private address)
    if (!params.to || !this.isValidAddress(params.to)) {
      errors.push({
        field: 'to',
        code: 'INVALID',
        message: 'Valid private address is required'
      });
    }

    // Validate sender if provided
    if (params.from && !this.isValidAddress(params.from)) {
      errors.push({
        field: 'from',
        code: 'INVALID',
        message: 'Invalid sender address format'
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  protected async performFeeEstimation(
    params: ShieldParams,
    provider: PrivacyProvider
  ): Promise<FeeEstimate> {
    return {
      estimatedFee: '0.002',
      currency: 'ETH',
      confidence: 'high',
      factors: [
        {
          type: 'privacy',
          impact: 'medium',
          description: 'Shielding requires proof generation'
        },
        {
          type: 'network',
          impact: 'low',
          description: 'Standard transaction costs'
        }
      ]
    };
  }

  private isValidTokenOrAddress(token: TokenInfo | Address): boolean {
    if (typeof token === 'string') {
      return this.isValidAddress(token);
    }
    return token.address && this.isValidAddress(token.address);
  }

  private isValidAddress(address: string): boolean {
    if (typeof address !== 'string') return false;
    if (/^0x[a-fA-F0-9]{40}$/.test(address)) return true;
    return address.length > 10 && address.length < 100;
  }
}

/**
 * Recipe for unshielding tokens (converting private tokens to public)
 */
export class UnshieldRecipe extends BaseRecipe {
  readonly name = 'unshield';
  readonly description = 'Unshield private tokens to make them public';
  readonly supportedProviders = ['*'];
  readonly requiredParams = ['token', 'amount', 'to'];
  readonly optionalParams = ['from', 'provider'];

  protected async performExecution(
    params: UnshieldParams,
    provider: PrivacyProvider
  ): Promise<{ transactions: TransactionResult[]; totalFees: Amount; metadata?: Record<string, any> }> {
    
    const tokenAddress = typeof params.token === 'string' ? params.token : params.token.address;
    
    // Check if provider has unshield method
    if ('unshield' in provider && typeof provider.unshield === 'function') {
      const transaction = await provider.unshield(tokenAddress, params.amount, params.to);
      const transactions = [transaction];
      
      return {
        transactions,
        totalFees: this.calculateTotalFees(transactions),
        metadata: {
          operation: 'unshield',
          token: params.token,
          amount: params.amount,
          recipient: params.to
        }
      };
    } else {
      // Fallback to generic private transaction
      const transaction = await provider.sendPrivateTransaction({
        type: 'unshield',
        token: params.token,
        amount: params.amount,
        to: params.to,
        from: params.from
      });
      
      return {
        transactions: [transaction],
        totalFees: this.calculateTotalFees([transaction]),
        metadata: {
          operation: 'unshield',
          token: params.token,
          amount: params.amount,
          recipient: params.to
        }
      };
    }
  }

  protected performValidation(params: UnshieldParams): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Validate token
    if (!this.isValidTokenOrAddress(params.token)) {
      errors.push({
        field: 'token',
        code: 'INVALID',
        message: 'Invalid token format'
      });
    }

    // Validate amount
    if (!params.amount || parseFloat(params.amount) <= 0) {
      errors.push({
        field: 'amount',
        code: 'INVALID',
        message: 'Amount must be a positive number'
      });
    }

    // Validate recipient (public address)
    if (!params.to || !this.isValidAddress(params.to)) {
      errors.push({
        field: 'to',
        code: 'INVALID',
        message: 'Valid public address is required'
      });
    }

    // Validate sender if provided
    if (params.from && !this.isValidAddress(params.from)) {
      errors.push({
        field: 'from',
        code: 'INVALID',
        message: 'Invalid sender address format'
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  protected async performFeeEstimation(
    params: UnshieldParams,
    provider: PrivacyProvider
  ): Promise<FeeEstimate> {
    return {
      estimatedFee: '0.002',
      currency: 'ETH',
      confidence: 'high',
      factors: [
        {
          type: 'privacy',
          impact: 'medium',
          description: 'Unshielding requires proof generation'
        },
        {
          type: 'network',
          impact: 'low',
          description: 'Standard transaction costs'
        }
      ]
    };
  }

  private isValidTokenOrAddress(token: TokenInfo | Address): boolean {
    if (typeof token === 'string') {
      return this.isValidAddress(token);
    }
    return token.address && this.isValidAddress(token.address);
  }

  private isValidAddress(address: string): boolean {
    if (typeof address !== 'string') return false;
    if (/^0x[a-fA-F0-9]{40}$/.test(address)) return true;
    return address.length > 10 && address.length < 100;
  }
}
