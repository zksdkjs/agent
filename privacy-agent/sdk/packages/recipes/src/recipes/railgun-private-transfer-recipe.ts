import { Recipe, RecipeConfig, RecipeInput } from './recipe';
import { Step } from '../steps/step';
import { RailgunPrivateTransferStep, RailgunPrivateTransferStepInput } from '../steps/railgun-private-transfer-step';
import { RailgunProvider } from '../../../providers/railgun/src/index';
import { Network } from '@zksdk/core';

/**
 * Configuration for Railgun Private Transfer Recipe
 */
export interface RailgunPrivateTransferRecipeConfig extends RecipeConfig {
  // Additional configuration specific to this recipe
  defaultSlippageBasisPoints?: number;
  enableGasOptimization?: boolean;
}

/**
 * Input for Railgun Private Transfer Recipe
 */
export interface RailgunPrivateTransferRecipeInput {
  network: Network;
  walletAddress: string;
  // Transfer parameters
  transferParams: {
    token: string; // Token address or symbol
    amount: string; // Amount in smallest unit
    to: string; // Recipient address
  };
  // Optional memo
  memo?: string;
  // Optional context
  context?: Record<string, any>;
}

/**
 * Railgun Private Transfer Recipe
 * A recipe for executing private transfers using Railgun
 */
export class RailgunPrivateTransferRecipe extends Recipe {
  readonly config: RailgunPrivateTransferRecipeConfig = {
    name: 'Railgun Private Transfer Recipe',
    description: 'Execute a private transfer using Railgun EVM privacy system',
    version: '1.0.0',
    supportedNetworks: ['ethereum', 'polygon', 'arbitrum'],
    minGasLimit: 350000,
    defaultSlippageBasisPoints: 50, // 0.5%
    enableGasOptimization: true
  };

  private railgunProvider: RailgunProvider;
  private railgunPrivateTransferStep: RailgunPrivateTransferStep;

  constructor(railgunProvider: RailgunProvider) {
    super();
    this.railgunProvider = railgunProvider;
    this.railgunPrivateTransferStep = new RailgunPrivateTransferStep(railgunProvider);
  }

  /**
   * Get the steps that make up this recipe
   */
  protected getSteps(): Step[] {
    return [this.railgunPrivateTransferStep];
  }

  /**
   * Execute the recipe with the given input
   */
  async execute(input: RailgunPrivateTransferRecipeInput) {
    // Validate input first
    this.validateRecipeInput(input);

    // Get steps
    const steps = this.getSteps();
    
    // Execute each step with the appropriate input
    const stepOutputs: StepOutput[] = [];
    let currentContext = input.context || {};
    let totalGasUsed = 0;
    const errors: Error[] = [];

    for (const step of steps) {
      try {
        // Special handling for RailgunPrivateTransferStep
        if (step instanceof RailgunPrivateTransferStep) {
          const stepInput: RailgunPrivateTransferStepInput = {
            network: input.network,
            walletAddress: input.walletAddress,
            context: currentContext,
            transferParams: input.transferParams,
            railgunOptions: {
              memo: input.memo
            }
          };

          const stepOutput = await step.execute(stepInput);
          stepOutputs.push(stepOutput);

          // Update context for next step
          if (stepOutput.updatedContext) {
            currentContext = { ...currentContext, ...stepOutput.updatedContext };
          }

          // Track gas usage
          if (stepOutput.gasUsed) {
            totalGasUsed += stepOutput.gasUsed;
          }
        } else {
          // Default behavior for other steps
          const stepInput: StepInput = {
            network: input.network,
            walletAddress: input.walletAddress,
            context: currentContext
          };

          const stepOutput = await step.execute(stepInput);
          stepOutputs.push(stepOutput);

          // Update context for next step
          if (stepOutput.updatedContext) {
            currentContext = { ...currentContext, ...stepOutput.updatedContext };
          }

          // Track gas usage
          if (stepOutput.gasUsed) {
            totalGasUsed += stepOutput.gasUsed;
          }
        }
      } catch (error) {
        errors.push(error as Error);
      }
    }

    // Determine final result
    const finalResult = stepOutputs.length > 0 
      ? stepOutputs[stepOutputs.length - 1].result 
      : null;

    return {
      name: this.config.name,
      stepOutputs,
      totalGasUsed,
      errors: errors.length > 0 ? errors : undefined,
      result: finalResult
    };
  }

  /**
   * Validate recipe input
   */
  private validateRecipeInput(input: RailgunPrivateTransferRecipeInput): void {
    if (!input.network) {
      throw new Error('Network is required');
    }

    if (!input.walletAddress) {
      throw new Error('Wallet address is required');
    }

    if (!this.config.supportedNetworks.includes(input.network)) {
      throw new Error(`Network ${input.network} is not supported by this recipe`);
    }
  }
}
