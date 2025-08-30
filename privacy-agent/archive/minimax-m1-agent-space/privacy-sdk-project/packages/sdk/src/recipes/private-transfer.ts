// Private Transfer Recipe

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
 * Parameters for private transfer recipe
 */
export interface PrivateTransferParams extends RecipeParams {
  to: PrivateAddress | PublicAddress;
  amount: Amount;
  token?: TokenInfo | Address;
  from?: PrivateAddress;
  memo?: string;
}

/**
 * Recipe for executing private transfers
 */
export class PrivateTransferRecipe extends BaseRecipe {
  readonly name = 'private_transfer';
  readonly description = 'Execute a private token transfer';
  readonly supportedProviders = ['*']; // Support all providers
  readonly requiredParams = ['to', 'amount'];
  readonly optionalParams = ['token', 'from', 'memo', 'provider'];

  protected async performExecution(
    params: PrivateTransferParams, 
    provider: PrivacyProvider
  ): Promise<{ transactions: TransactionResult[]; totalFees: Amount; metadata?: Record<string, any> }> {
    
    // Execute private transaction
    const transaction = await provider.sendPrivateTransaction({
      type: 'transfer',
      from: params.from,
      to: params.to,
      amount: params.amount,
      token: params.token,
      memo: params.memo
    });

    const transactions = [transaction];
    const totalFees = this.calculateTotalFees(transactions);

    return {
      transactions,
      totalFees,
      metadata: {
        transferType: 'private',
        recipientAddress: params.to,
        amount: params.amount,
        token: params.token
      }
    };
  }

  protected performValidation(params: PrivateTransferParams): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Validate recipient address
    if (typeof params.to !== 'string' || params.to.length === 0) {
      errors.push({
        field: 'to',
        code: 'INVALID',
        message: 'Recipient address must be a non-empty string'
      });
    } else if (!this.isValidAddress(params.to)) {
      errors.push({
        field: 'to',
        code: 'INVALID_FORMAT',
        message: 'Recipient address format is invalid'
      });
    }

    // Validate amount
    if (typeof params.amount !== 'string' || params.amount.length === 0) {
      errors.push({
        field: 'amount',
        code: 'INVALID',
        message: 'Amount must be a non-empty string'
      });
    } else {
      const numAmount = parseFloat(params.amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        errors.push({
          field: 'amount',
          code: 'INVALID_VALUE',
          message: 'Amount must be a positive number'
        });
      }
    }

    // Validate sender address if provided
    if (params.from && !this.isValidAddress(params.from)) {
      errors.push({
        field: 'from',
        code: 'INVALID_FORMAT',
        message: 'Sender address format is invalid'
      });
    }

    // Validate token if provided
    if (params.token) {
      if (typeof params.token === 'string') {
        if (!this.isValidAddress(params.token)) {
          errors.push({
            field: 'token',
            code: 'INVALID_FORMAT',
            message: 'Token address format is invalid'
          });
        }
      } else {
        // TokenInfo object validation
        if (!params.token.address || !this.isValidAddress(params.token.address)) {
          errors.push({
            field: 'token.address',
            code: 'INVALID_FORMAT',
            message: 'Token address is required and must be valid'
          });
        }
        if (!params.token.symbol || typeof params.token.symbol !== 'string') {
          errors.push({
            field: 'token.symbol',
            code: 'REQUIRED',
            message: 'Token symbol is required'
          });
        }
        if (typeof params.token.decimals !== 'number' || params.token.decimals < 0) {
          errors.push({
            field: 'token.decimals',
            code: 'INVALID',
            message: 'Token decimals must be a non-negative number'
          });
        }
      }
    }

    // Validate memo length if provided
    if (params.memo && params.memo.length > 256) {
      warnings.push({
        field: 'memo',
        code: 'LENGTH_WARNING',
        message: 'Memo is longer than 256 characters and may not be supported by all providers'
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  protected async performFeeEstimation(
    params: PrivateTransferParams, 
    provider: PrivacyProvider
  ): Promise<FeeEstimate> {
    
    // Basic fee estimation - providers should override this with more accurate estimates
    return {
      estimatedFee: '0.001', // Default estimate in native currency
      currency: 'ETH', // Default to ETH
      confidence: 'low',
      factors: [
        {
          type: 'privacy',
          impact: 'medium',
          description: 'Private transaction requires proof generation'
        },
        {
          type: 'network',
          impact: 'low',
          description: 'Network congestion may affect final fee'
        }
      ]
    };
  }

  /**
   * Helper method to validate address format
   */
  private isValidAddress(address: string): boolean {
    // Basic address validation - could be enhanced for specific address formats
    if (typeof address !== 'string') return false;
    
    // Ethereum-style address (0x + 40 hex chars)
    if (/^0x[a-fA-F0-9]{40}$/.test(address)) return true;
    
    // Solana-style address (base58, typically 32-44 chars)
    if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) return true;
    
    // Allow other formats for now
    return address.length > 10 && address.length < 100;
  }
}
