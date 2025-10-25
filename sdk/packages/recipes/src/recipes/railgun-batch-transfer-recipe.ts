import { Recipe, RecipeConfig, RecipeInput } from './recipe';
import { Step } from '../steps/step';
import { RailgunPrivateTransferStep, RailgunPrivateTransferStepInput } from '../steps/railgun-private-transfer-step';
import { RailgunProvider } from '../../../providers/railgun/src/index';
import { Network } from '@zksdk/core';

/**
 * Configuration for Railgun Batch Transfer Recipe
 */
export interface RailgunBatchTransferRecipeConfig extends RecipeConfig {
  maxTransfersPerBatch?: number;
  enableGasOptimization?: boolean;
}

/**
 * Input for Railgun Batch Transfer Recipe
 */
export interface RailgunBatchTransferRecipeInput {
  network: Network;
  walletAddress: string;
  // Batch transfer parameters
  transfers: Array<{
    token: string; // Token address or symbol
    amount: string; // Amount in smallest unit
    to: string; // Recipient address
  }>;
  // Optional memo for all transfers
  memo?: string;
  // Optional context
  context?: Record<string, any>;
}

/**
 * Railgun Batch Transfer Recipe
 * A recipe for executing multiple private transfers in a batch using Railgun
 */
export class RailgunBatchTransferRecipe extends Recipe {
  readonly config: RailgunBatchTransferRecipeConfig = {
    name: 'Railgun Batch Transfer Recipe',
    description: 'Execute multiple private transfers in a batch using Railgun EVM privacy system',
    version: '1.0.0',
    supportedNetworks: ['ethereum', 'polygon', 'arbitrum'],
    minGasLimit: 400000,
    maxTransfersPerBatch: 10,
    enableGasOptimization: true
  };

  private railgunProvider: RailgunProvider;

  constructor(railgunProvider: RailgunProvider) {
    super();
    this.railgunProvider = railgunProvider;
  }

  /**
   * Get the steps that make up this recipe
   */
  protected getSteps(): Step[] {
    // For batch transfers, we create multiple steps
    // In a real implementation, Railgun might have optimized batch operations
    // But for now, we'll create individual transfer steps
    return []; // Steps will be created dynamically in execute method
  }

  /**
   * Execute the recipe with the given input
   */
  async execute(input: RailgunBatchTransferRecipeInput) {
    // Validate input
    if (!input.transfers || input.transfers.length === 0) {
      throw new Error('At least one transfer is required');
    }

    if (input.transfers.length > (this.config.maxTransfersPerBatch || 10)) {
      throw new Error(`Maximum ${this.config.maxTransfersPerBatch} transfers allowed per batch`);
    }

    // Create steps for each transfer
    const steps: Step[] = [];
    for (const transfer of input.transfers) {
      const step = new RailgunPrivateTransferStep(this.railgunProvider);
      steps.push(step);
    }

    // Override the getSteps method for this execution
    const originalGetSteps = this.getSteps;
    this.getSteps = () => steps;

    try {
      // Convert recipe input to step inputs
      const results = [];
      let totalGasUsed = 0;
      const errors: Error[] = [];

      // Execute each transfer step
      for (let i = 0; i < input.transfers.length; i++) {
        const transfer = input.transfers[i];
        const step = steps[i];
        
        const stepInput: RailgunPrivateTransferStepInput = {
          network: input.network,
          walletAddress: input.walletAddress,
          context: input.context,
          transferParams: transfer,
          railgunOptions: {
            memo: input.memo
          }
        };

        try {
          const stepOutput = await step.execute(stepInput);
          results.push(stepOutput.result);
          
          if (stepOutput.gasUsed) {
            totalGasUsed += stepOutput.gasUsed;
          }
        } catch (error) {
          errors.push(error as Error);
        }
      }

      // Determine final result
      const finalResult = results.length > 0 ? results : null;

      return {
        name: this.config.name,
        stepOutputs: results.map((result, index) => ({
          result,
          effects: {
            transactionHash: result.transactionHash,
            proofGenerated: true,
            feesPaid: result.fee || '0'
          },
          updatedContext: {
            lastTransactionHash: result.transactionHash,
            lastTransactionTimestamp: result.timestamp
          },
          gasUsed: 300000 // Approximate gas per transfer
        })),
        totalGasUsed: totalGasUsed + (this.config.minGasLimit || 0),
        errors: errors.length > 0 ? errors : undefined,
        result: finalResult
      };
    } finally {
      // Restore original getSteps method
      this.getSteps = originalGetSteps;
    }
  }
}
