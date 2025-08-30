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
export interface RailgunPrivateTransferRecipeInput extends RecipeInput {
  // Transfer parameters
  transferParams: {
    token: string; // Token address or symbol
    amount: string; // Amount in smallest unit
    to: string; // Recipient address
  };
  // Optional memo
  memo?: string;
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
    // Convert recipe input to step input
    const stepInput: RailgunPrivateTransferStepInput = {
      network: input.network,
      walletAddress: input.walletAddress,
      context: input.context,
      transferParams: input.transferParams,
      railgunOptions: {
        memo: input.memo
      }
    };

    return super.execute({
      ...input,
      params: stepInput
    });
  }
}
