/**
 * Custom Recipe Example - Privacy SDK
 * 
 * This example demonstrates how to create and register
 * custom recipes for specialized privacy operations.
 */

import { 
  PrivacySDK, 
  BaseRecipe, 
  RecipeParams, 
  RecipeResult, 
  ValidationResult,
  FeeEstimate,
  createPrivacySDK 
} from '@privacy-sdk/core';

/**
 * Custom Recipe: Private Batch Transfer
 * Allows sending multiple private transfers in a single operation
 */
class PrivateBatchTransferRecipe extends BaseRecipe {
  readonly name = 'private_batch_transfer';
  readonly description = 'Send multiple private transfers in a single batch operation';
  readonly supportedProviders = ['railgun'];
  readonly requiredParams = ['transfers'];
  readonly optionalParams = ['provider', 'memo'];

  async execute(params: RecipeParams): Promise<RecipeResult> {
    const startTime = Date.now();
    const batchParams = params as PrivateBatchTransferParams;

    // Validate parameters
    const validation = this.validate(batchParams);
    if (!validation.valid) {
      throw new Error(`Invalid parameters: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    const transactions = [];
    let totalFees = '0';

    try {
      // Simulate executing each transfer
      for (let i = 0; i < batchParams.transfers.length; i++) {
        const transfer = batchParams.transfers[i];
        
        // Simulate transaction execution
        const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        const fee = '5000000000000000'; // 0.005 ETH per transfer
        
        transactions.push({
          hash: txHash,
          status: 'pending' as const,
          provider: batchParams.provider || 'railgun',
          chainId: 1,
          timestamp: Date.now(),
          fee,
          metadata: {
            batchIndex: i,
            recipient: transfer.to,
            amount: transfer.amount
          }
        });
        
        totalFees = (BigInt(totalFees) + BigInt(fee)).toString();
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return this.createRecipeResult(
        transactions,
        startTime,
        true,
        {
          operation: 'private_batch_transfer',
          batchSize: batchParams.transfers.length,
          memo: batchParams.memo
        }
      );
    } catch (error) {
      throw new Error(`Batch transfer failed: ${error.message}`);
    }
  }

  async estimateFees(params: RecipeParams): Promise<FeeEstimate> {
    const batchParams = params as PrivateBatchTransferParams;
    const transferCount = batchParams.transfers?.length || 1;
    const feePerTransfer = '5000000000000000'; // 0.005 ETH
    const totalFee = (BigInt(feePerTransfer) * BigInt(transferCount)).toString();

    return {
      estimatedFee: totalFee,
      currency: 'ETH',
      confidence: 'high',
      factors: [
        {
          type: 'complexity',
          impact: 'high',
          description: `Batch operation with ${transferCount} transfers`
        },
        {
          type: 'privacy',
          impact: 'high',
          description: 'Multiple zero-knowledge proofs required'
        }
      ]
    };
  }

  protected validateRecipeParams(params: RecipeParams): ValidationResult {
    const batchParams = params as PrivateBatchTransferParams;
    const errors = [];
    const warnings = [];

    // Validate transfers array
    if (!Array.isArray(batchParams.transfers)) {
      errors.push({
        field: 'transfers',
        code: 'INVALID_TYPE',
        message: 'Transfers must be an array'
      });
    } else {
      if (batchParams.transfers.length === 0) {
        errors.push({
          field: 'transfers',
          code: 'EMPTY_ARRAY',
          message: 'At least one transfer is required'
        });
      }

      if (batchParams.transfers.length > 10) {
        warnings.push({
          field: 'transfers',
          code: 'LARGE_BATCH',
          message: 'Large batch sizes may result in higher fees and longer processing times',
          suggestion: 'Consider splitting into smaller batches'
        });
      }

      // Validate each transfer
      batchParams.transfers.forEach((transfer, index) => {
        const addressError = this.validateAddress(transfer.to, `transfers[${index}].to`);
        if (addressError) {
          errors.push(addressError);
        }

        const amountError = this.validateAmount(transfer.amount, `transfers[${index}].amount`);
        if (amountError) {
          errors.push(amountError);
        }
      });
    }

    return { valid: errors.length === 0, errors, warnings };
  }
}

/**
 * Interface for batch transfer parameters
 */
interface PrivateBatchTransferParams extends RecipeParams {
  transfers: Array<{
    to: string;
    amount: string;
    memo?: string;
  }>;
  memo?: string;
}

/**
 * Custom Recipe: Privacy Score Calculator
 * Analyzes and scores the privacy level of different operations
 */
class PrivacyScoreRecipe extends BaseRecipe {
  readonly name = 'privacy_score';
  readonly description = 'Calculate privacy score for different operations and providers';
  readonly supportedProviders = ['railgun', 'mina', 'semaphore'];
  readonly requiredParams = ['operation'];
  readonly optionalParams = ['provider', 'parameters'];

  async execute(params: RecipeParams): Promise<RecipeResult> {
    const startTime = Date.now();
    const scoreParams = params as PrivacyScoreParams;

    const scores = this.calculatePrivacyScores(scoreParams);

    return this.createRecipeResult(
      [], // No actual transactions
      startTime,
      true,
      {
        operation: 'privacy_score',
        scores,
        recommendation: this.getRecommendation(scores)
      }
    );
  }

  async estimateFees(params: RecipeParams): Promise<FeeEstimate> {
    return {
      estimatedFee: '0',
      currency: 'ETH',
      confidence: 'high',
      factors: []
    };
  }

  protected validateRecipeParams(params: RecipeParams): ValidationResult {
    const scoreParams = params as PrivacyScoreParams;
    const errors = [];

    const validOperations = ['transfer', 'swap', 'vote', 'signal'];
    if (!validOperations.includes(scoreParams.operation)) {
      errors.push({
        field: 'operation',
        code: 'INVALID_VALUE',
        message: `Operation must be one of: ${validOperations.join(', ')}`
      });
    }

    return { valid: errors.length === 0, errors, warnings: [] };
  }

  private calculatePrivacyScores(params: PrivacyScoreParams) {
    const baseScores = {
      railgun: { anonymity: 85, auditability: 70, decentralization: 80 },
      mina: { anonymity: 90, auditability: 85, decentralization: 85 },
      semaphore: { anonymity: 95, auditability: 90, decentralization: 75 }
    };

    const operationModifiers = {
      transfer: { anonymity: 0, auditability: 0, decentralization: 0 },
      swap: { anonymity: -5, auditability: -10, decentralization: 0 },
      vote: { anonymity: 10, auditability: 5, decentralization: 5 },
      signal: { anonymity: 10, auditability: 5, decentralization: 5 }
    };

    const scores = {};
    const modifier = operationModifiers[params.operation] || operationModifiers.transfer;

    Object.entries(baseScores).forEach(([provider, base]) => {
      scores[provider] = {
        anonymity: Math.min(100, Math.max(0, base.anonymity + modifier.anonymity)),
        auditability: Math.min(100, Math.max(0, base.auditability + modifier.auditability)),
        decentralization: Math.min(100, Math.max(0, base.decentralization + modifier.decentralization)),
        overall: 0
      };
      
      // Calculate overall score (weighted average)
      scores[provider].overall = Math.round(
        (scores[provider].anonymity * 0.5 + 
         scores[provider].auditability * 0.3 + 
         scores[provider].decentralization * 0.2)
      );
    });

    return scores;
  }

  private getRecommendation(scores: any) {
    const providers = Object.keys(scores);
    const bestProvider = providers.reduce((best, current) => 
      scores[current].overall > scores[best].overall ? current : best
    );

    return {
      recommended: bestProvider,
      reason: `Highest overall privacy score (${scores[bestProvider].overall}/100)`,
      alternatives: providers.filter(p => p !== bestProvider)
        .map(p => ({ provider: p, score: scores[p].overall }))
        .sort((a, b) => b.score - a.score)
    };
  }
}

interface PrivacyScoreParams extends RecipeParams {
  operation: 'transfer' | 'swap' | 'vote' | 'signal';
  parameters?: Record<string, any>;
}

/**
 * Main example function
 */
async function customRecipeExample() {
  console.log('🧪 Privacy SDK - Custom Recipe Example');
  
  const sdk = createPrivacySDK({
    provider: 'railgun',
    chainId: 1
  });
  
  try {
    await sdk.initialize();
    
    // Register custom recipes
    console.log('📝 Registering custom recipes...');
    const batchTransferRecipe = new PrivateBatchTransferRecipe();
    const privacyScoreRecipe = new PrivacyScoreRecipe();
    
    sdk.plugins.register({
      name: 'custom-recipes',
      version: '1.0.0',
      description: 'Custom recipe plugin',
      supportedChains: [1],
      createProvider: async () => { throw new Error('Not a provider plugin'); },
      validateConfig: () => ({ valid: true, errors: [], warnings: [] }),
      getDefaultConfig: () => ({})
    });
    
    // Note: In a real implementation, recipes would be registered differently
    // This is a simplified example
    
    console.log('\n🍳 Testing Batch Transfer Recipe...');
    
    // Test validation
    const batchValidation = batchTransferRecipe.validate({
      transfers: [
        { to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e', amount: '1000000000000000000' },
        { to: '0x8ba1f109551bD432803012645Hac136c19ACe3c8', amount: '500000000000000000' }
      ]
    });
    
    console.log('✅ Batch validation result:', batchValidation.valid);
    if (batchValidation.warnings.length > 0) {
      console.log('⚠️ Warnings:', batchValidation.warnings.map(w => w.message));
    }
    
    // Test fee estimation
    const batchFeeEstimate = await batchTransferRecipe.estimateFees({
      transfers: [
        { to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e', amount: '1000000000000000000' },
        { to: '0x8ba1f109551bD432803012645Hac136c19ACe3c8', amount: '500000000000000000' }
      ]
    });
    
    console.log('💰 Batch fee estimate:', batchFeeEstimate.estimatedFee, batchFeeEstimate.currency);
    
    // Execute batch transfer
    try {
      const batchResult = await batchTransferRecipe.execute({
        provider: 'railgun',
        transfers: [
          { to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e', amount: '1000000000000000000' },
          { to: '0x8ba1f109551bD432803012645Hac136c19ACe3c8', amount: '500000000000000000' }
        ],
        memo: 'Batch transfer example'
      });
      
      console.log('✅ Batch transfer completed:', batchResult.success);
      console.log('📦 Transactions created:', batchResult.transactions.length);
      console.log('⏱️ Execution time:', batchResult.executionTime, 'ms');
    } catch (error) {
      console.log('❌ Batch transfer failed (expected):', error.message);
    }
    
    console.log('\n📊 Testing Privacy Score Recipe...');
    
    // Calculate privacy scores for different operations
    const operations = ['transfer', 'swap', 'vote', 'signal'];
    
    for (const operation of operations) {
      const scoreResult = await privacyScoreRecipe.execute({
        operation: operation as any
      });
      
      console.log(`\n🔍 Privacy scores for ${operation}:`);
      const scores = scoreResult.metadata?.scores;
      Object.entries(scores).forEach(([provider, score]: [string, any]) => {
        console.log(`- ${provider}: ${score.overall}/100 (A:${score.anonymity}, Au:${score.auditability}, D:${score.decentralization})`);
      });
      
      const recommendation = scoreResult.metadata?.recommendation;
      console.log(`🏆 Recommended: ${recommendation.recommended} (${recommendation.reason})`);
    }
    
    console.log('\n✅ Custom recipe example completed');
    
  } catch (error) {
    console.error('❌ Error in custom recipe example:', error);
  } finally {
    await sdk.destroy();
    console.log('🧹 SDK cleanup completed');
  }
}

// Export for use in other examples
export { 
  customRecipeExample, 
  PrivateBatchTransferRecipe, 
  PrivacyScoreRecipe 
};

// Run the example
if (require.main === module) {
  customRecipeExample().catch(console.error);
}