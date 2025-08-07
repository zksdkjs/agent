// Cross-Provider Recipe - Transfer tokens between different privacy protocols

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
 * Parameters for cross-provider transfer recipe
 */
export interface CrossProviderParams extends RecipeParams {
  sourceProvider: string;
  destinationProvider: string;
  sourceAddress: PrivateAddress;
  destinationAddress: PrivateAddress;
  token: TokenInfo | Address;
  amount: Amount;
  intermediateAccount?: PublicAddress;
  memo?: string;
}

/**
 * Recipe for executing transfers between different privacy protocols
 */
export class CrossProviderRecipe extends BaseRecipe {
  readonly name = 'cross_provider';
  readonly description = 'Transfer private tokens between different privacy protocols';
  readonly supportedProviders = ['*']; // This recipe doesn't depend on a specific provider
  readonly requiredParams = ['sourceProvider', 'destinationProvider', 'sourceAddress', 'destinationAddress', 'token', 'amount'];
  readonly optionalParams = ['intermediateAccount', 'memo'];

  protected async performExecution(
    params: CrossProviderParams,
    provider: PrivacyProvider // This is the coordinating provider, not necessarily used for transfer
  ): Promise<{ transactions: TransactionResult[]; totalFees: Amount; metadata?: Record<string, any> }> {
    
    const transactions: TransactionResult[] = [];
    const sdk = (provider as any).sdk; // Access SDK from provider context
    
    if (!sdk) {
      throw new ValidationErr(
        'Cross-provider transfers require SDK access',
        'provider',
        provider.name
      );
    }

    // Get providers
    const sourceProvider = sdk.getProvider(params.sourceProvider);
    const destinationProvider = sdk.getProvider(params.destinationProvider);
    
    if (!sourceProvider) {
      throw new ValidationErr(
        `Source provider '${params.sourceProvider}' not found`,
        'sourceProvider',
        provider.name
      );
    }
    
    if (!destinationProvider) {
      throw new ValidationErr(
        `Destination provider '${params.destinationProvider}' not found`,
        'destinationProvider',
        provider.name
      );
    }

    // Get intermediate account or use default
    const intermediateAccount = params.intermediateAccount || await this.getOrCreateIntermediateAccount(sdk);
    
    // Step 1: Unshield from source provider to intermediate account
    const unshieldTransaction = await sourceProvider.sendPrivateTransaction({
      type: 'unshield',
      from: params.sourceAddress,
      to: intermediateAccount,
      amount: params.amount,
      token: params.token,
      memo: `Cross-provider transfer to ${params.destinationProvider}`
    });
    
    transactions.push(unshieldTransaction);
    
    // Step 2: Wait for confirmation (in a production environment, this might be handled differently)
    // For now, we'll simulate waiting with a delay
    const confirmationDelayMs = 1000; // In production, would poll for confirmation
    await new Promise(resolve => setTimeout(resolve, confirmationDelayMs));
    
    // Step 3: Shield to destination provider from intermediate account
    const shieldTransaction = await destinationProvider.sendPrivateTransaction({
      type: 'shield',
      from: intermediateAccount,
      to: params.destinationAddress,
      amount: params.amount,
      token: params.token,
      memo: params.memo || `Cross-provider transfer from ${params.sourceProvider}`
    });
    
    transactions.push(shieldTransaction);
    
    const totalFees = this.calculateTotalFees(transactions);

    return {
      transactions,
      totalFees,
      metadata: {
        operationType: 'cross_provider_transfer',
        sourceProvider: params.sourceProvider,
        destinationProvider: params.destinationProvider,
        intermediateAccount,
        token: params.token,
        amount: params.amount
      }
    };
  }

  protected performValidation(params: CrossProviderParams): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Validate source provider
    if (!params.sourceProvider) {
      errors.push({
        field: 'sourceProvider',
        code: 'REQUIRED',
        message: 'Source provider is required'
      });
    }

    // Validate destination provider
    if (!params.destinationProvider) {
      errors.push({
        field: 'destinationProvider',
        code: 'REQUIRED',
        message: 'Destination provider is required'
      });
    }

    // Check that providers are different
    if (params.sourceProvider === params.destinationProvider) {
      errors.push({
        field: 'destinationProvider',
        code: 'INVALID',
        message: 'Source and destination providers must be different'
      });
    }

    // Validate source address
    if (!params.sourceAddress || !this.isValidAddress(params.sourceAddress)) {
      errors.push({
        field: 'sourceAddress',
        code: 'INVALID',
        message: 'Valid source private address is required'
      });
    }

    // Validate destination address
    if (!params.destinationAddress || !this.isValidAddress(params.destinationAddress)) {
      errors.push({
        field: 'destinationAddress',
        code: 'INVALID',
        message: 'Valid destination private address is required'
      });
    }

    // Validate token
    if (!params.token) {
      errors.push({
        field: 'token',
        code: 'REQUIRED',
        message: 'Token is required'
      });
    } else if (!this.isValidTokenOrAddress(params.token)) {
      errors.push({
        field: 'token',
        code: 'INVALID',
        message: 'Invalid token format'
      });
    }

    // Validate amount
    if (!params.amount) {
      errors.push({
        field: 'amount',
        code: 'REQUIRED',
        message: 'Amount is required'
      });
    } else if (parseFloat(params.amount) <= 0) {
      errors.push({
        field: 'amount',
        code: 'INVALID',
        message: 'Amount must be positive'
      });
    }

    // Validate intermediate account if provided
    if (params.intermediateAccount && !this.isValidAddress(params.intermediateAccount)) {
      errors.push({
        field: 'intermediateAccount',
        code: 'INVALID',
        message: 'Invalid intermediate account address'
      });
    }

    // Add warning about potential privacy implications
    warnings.push({
      field: 'general',
      code: 'PRIVACY_WARNING',
      message: 'Cross-provider transfers require an unshield and shield operation, which may reduce privacy guarantees'
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  protected async performFeeEstimation(
    params: CrossProviderParams,
    provider: PrivacyProvider
  ): Promise<FeeEstimate> {
    // Fee estimation for cross-provider transfers is the sum of unshield and shield operations
    // plus potentially additional fees for the intermediate transaction
    
    return {
      estimatedFee: '0.004', // Higher than normal operations due to multiple transactions
      currency: 'ETH',
      confidence: 'medium',
      factors: [
        {
          type: 'privacy',
          impact: 'high',
          description: 'Requires two privacy operations (unshield + shield)'
        },
        {
          type: 'complexity',
          impact: 'high',
          description: 'Multi-step operation with multiple providers'
        },
        {
          type: 'network',
          impact: 'medium',
          description: 'Multiple blockchain transactions required'
        }
      ]
    };
  }

  /**
   * Helper method to get or create an intermediate account
   * In a real implementation, this would utilize a proper key management system
   */
  private async getOrCreateIntermediateAccount(sdk: any): Promise<PublicAddress> {
    // This is a simplified implementation - in production, this would use a proper wallet integration
    // For now, we'll return a default address that would typically be managed by the SDK
    return '0x7F5EB5bB5cF88cfcEe9613368636f458800e62CB'; // Example address
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