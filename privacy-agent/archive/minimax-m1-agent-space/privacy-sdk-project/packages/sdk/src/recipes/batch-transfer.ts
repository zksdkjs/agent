// Batch Transfer Recipe - Execute multiple private transfers in one transaction

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
import { PrivateTransferParams } from './private-transfer';

/**
 * Single transfer within a batch
 */
export interface BatchTransferItem {
  to: PrivateAddress | PublicAddress;
  amount: Amount;
  token?: TokenInfo | Address;
  memo?: string;
}

/**
 * Parameters for batch transfer recipe
 */
export interface BatchTransferParams extends RecipeParams {
  transfers: BatchTransferItem[];
  from?: PrivateAddress;
  maxFeePerTransfer?: Amount;
}

/**
 * Recipe for executing multiple private transfers efficiently
 */
export class BatchTransferRecipe extends BaseRecipe {
  readonly name = 'batch_transfer';
  readonly description = 'Execute multiple private transfers in a single optimized transaction';
  readonly supportedProviders = ['railgun']; // Batch operations typically require advanced providers
  readonly requiredParams = ['transfers'];
  readonly optionalParams = ['from', 'maxFeePerTransfer', 'provider'];

  protected async performExecution(
    params: BatchTransferParams,
    provider: PrivacyProvider
  ): Promise<{ transactions: TransactionResult[]; totalFees: Amount; metadata?: Record<string, any> }> {
    
    const transactions: TransactionResult[] = [];
    
    // Check if provider supports batch operations
    if ('sendBatchPrivateTransactions' in provider && typeof provider.sendBatchPrivateTransactions === 'function') {
      // Use native batch support if available
      const batchTransactions = params.transfers.map(transfer => ({
        type: 'transfer' as const,
        from: params.from,
        to: transfer.to,
        amount: transfer.amount,
        token: transfer.token,
        memo: transfer.memo
      }));
      
      const batchResult = await (provider as any).sendBatchPrivateTransactions(batchTransactions);
      transactions.push(...(Array.isArray(batchResult) ? batchResult : [batchResult]));
    } else {
      // Fallback to individual transactions
      for (const transfer of params.transfers) {
        const transaction = await provider.sendPrivateTransaction({
          type: 'transfer',
          from: params.from,
          to: transfer.to,
          amount: transfer.amount,
          token: transfer.token,
          memo: transfer.memo
        });
        transactions.push(transaction);
        
        // Small delay between transactions to avoid nonce conflicts
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    const totalFees = this.calculateTotalFees(transactions);

    return {
      transactions,
      totalFees,
      metadata: {
        batchSize: params.transfers.length,
        totalAmount: this.calculateTotalAmount(params.transfers),
        uniqueTokens: this.getUniqueTokens(params.transfers),
        executionType: 'sendBatchPrivateTransactions' in provider ? 'batch' : 'sequential'
      }
    };
  }

  protected performValidation(params: BatchTransferParams): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Validate transfers array
    if (!Array.isArray(params.transfers)) {
      errors.push({
        field: 'transfers',
        code: 'INVALID',
        message: 'Transfers must be an array'
      });
      return { valid: false, errors, warnings };
    }

    if (params.transfers.length === 0) {
      errors.push({
        field: 'transfers',
        code: 'REQUIRED',
        message: 'At least one transfer is required'
      });
    }

    if (params.transfers.length > 100) {
      errors.push({
        field: 'transfers',
        code: 'LIMIT_EXCEEDED',
        message: 'Maximum 100 transfers allowed per batch'
      });
    } else if (params.transfers.length > 20) {
      warnings.push({
        field: 'transfers',
        code: 'LARGE_BATCH',
        message: 'Large batches may have higher failure risk and longer processing time'
      });
    }

    // Validate each transfer
    params.transfers.forEach((transfer, index) => {
      const prefix = `transfers[${index}]`;
      
      // Validate recipient
      if (!transfer.to || !this.isValidAddress(transfer.to)) {
        errors.push({
          field: `${prefix}.to`,
          code: 'INVALID',
          message: `Transfer ${index}: Invalid recipient address`
        });
      }

      // Validate amount
      if (!transfer.amount || parseFloat(transfer.amount) <= 0) {
        errors.push({
          field: `${prefix}.amount`,
          code: 'INVALID',
          message: `Transfer ${index}: Amount must be positive`
        });
      }

      // Validate token if provided
      if (transfer.token && !this.isValidTokenOrAddress(transfer.token)) {
        errors.push({
          field: `${prefix}.token`,
          code: 'INVALID',
          message: `Transfer ${index}: Invalid token format`
        });
      }

      // Validate memo length
      if (transfer.memo && transfer.memo.length > 256) {
        warnings.push({
          field: `${prefix}.memo`,
          code: 'LENGTH_WARNING',
          message: `Transfer ${index}: Memo longer than 256 characters`
        });
      }
    });

    // Check for duplicate recipients (potential issue)
    const recipients = params.transfers.map(t => t.to);
    const duplicates = recipients.filter((addr, index) => recipients.indexOf(addr) !== index);
    if (duplicates.length > 0) {
      warnings.push({
        field: 'transfers',
        code: 'DUPLICATE_RECIPIENTS',
        message: 'Multiple transfers to same recipient detected'
      });
    }

    // Validate maxFeePerTransfer if provided
    if (params.maxFeePerTransfer && parseFloat(params.maxFeePerTransfer) <= 0) {
      errors.push({
        field: 'maxFeePerTransfer',
        code: 'INVALID',
        message: 'Max fee per transfer must be positive'
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  protected async performFeeEstimation(
    params: BatchTransferParams,
    provider: PrivacyProvider
  ): Promise<FeeEstimate> {
    const transferCount = params.transfers.length;
    const hasBatchSupport = 'sendBatchPrivateTransactions' in provider;
    
    // Estimate based on batch efficiency
    const baseFeePerTransfer = 0.001;
    const batchDiscount = hasBatchSupport ? 0.3 : 0; // 30% discount for native batch support
    const effectiveFeePerTransfer = baseFeePerTransfer * (1 - batchDiscount);
    const totalEstimatedFee = (effectiveFeePerTransfer * transferCount).toFixed(6);

    return {
      estimatedFee: totalEstimatedFee,
      currency: 'ETH',
      confidence: hasBatchSupport ? 'high' : 'medium',
      factors: [
        {
          type: 'batch_size',
          impact: transferCount > 10 ? 'high' : 'medium',
          description: `Processing ${transferCount} transfers`
        },
        {
          type: 'batch_optimization',
          impact: hasBatchSupport ? 'positive' : 'none',
          description: hasBatchSupport ? 'Provider supports native batching' : 'Using sequential processing'
        },
        {
          type: 'privacy',
          impact: 'medium',
          description: 'Each transfer requires proof generation'
        }
      ]
    };
  }

  private isValidAddress(address: string): boolean {
    if (typeof address !== 'string') return false;
    if (/^0x[a-fA-F0-9]{40}$/.test(address)) return true;
    return address.length > 10 && address.length < 100;
  }

  private isValidTokenOrAddress(token: TokenInfo | Address): boolean {
    if (typeof token === 'string') {
      return this.isValidAddress(token);
    }
    return token.address && this.isValidAddress(token.address);
  }

  private calculateTotalAmount(transfers: BatchTransferItem[]): Amount {
    // This is a simplified calculation - in reality, you'd need to group by token
    const total = transfers.reduce((sum, transfer) => {
      return sum + parseFloat(transfer.amount);
    }, 0);
    return total.toString();
  }

  private getUniqueTokens(transfers: BatchTransferItem[]): string[] {
    const tokens = new Set<string>();
    transfers.forEach(transfer => {
      if (transfer.token) {
        const tokenAddr = typeof transfer.token === 'string' ? transfer.token : transfer.token.address;
        tokens.add(tokenAddr);
      } else {
        tokens.add('native'); // Default/native token
      }
    });
    return Array.from(tokens);
  }
}
