import { ComboMeal, ComboMealConfig, ComboMealInput } from '../combo-meals/combo-meal';
import { Recipe } from '../recipes/recipe';
import { RailgunPrivateTransferRecipe } from '../recipes/railgun-private-transfer-recipe';
import { RailgunBatchTransferRecipe } from '../recipes/railgun-batch-transfer-recipe';
import { RailgunProvider } from '../../../providers/railgun/src/index';
import { Network } from '@zksdk/core';

/**
 * Configuration for Railgun Privacy Operations ComboMeal
 */
export interface RailgunPrivacyOperationsComboMealConfig extends ComboMealConfig {
  // Additional configuration specific to this combo meal
  enableParallelExecution?: boolean;
  maxTotalTransfers?: number;
}

/**
 * Input for Railgun Privacy Operations ComboMeal
 */
export interface RailgunPrivacyOperationsComboMealInput {
  network: Network;
  walletAddress: string;
  context?: Record<string, any>;
  // Operations to perform
  operations: Array<{
    type: 'privateTransfer' | 'batchTransfer';
    params: any; // Parameters specific to the operation type
  }>;
}

/**
 * Railgun Privacy Operations ComboMeal
 * A combo meal for executing multiple privacy operations using Railgun
 */
export class RailgunPrivacyOperationsComboMeal extends ComboMeal {
  readonly config: RailgunPrivacyOperationsComboMealConfig = {
    name: 'Railgun Privacy Operations ComboMeal',
    description: 'Execute multiple privacy operations in sequence using Railgun EVM privacy system',
    version: '1.0.0',
    supportedNetworks: ['ethereum', 'polygon', 'arbitrum'],
    minGasLimit: 500000,
    maxRecipes: 5,
    parallelExecution: false,
    enableParallelExecution: false,
    maxTotalTransfers: 20
  };

  private railgunProvider: RailgunProvider;

  constructor(railgunProvider: RailgunProvider) {
    super();
    this.railgunProvider = railgunProvider;
  }

  /**
   * Get the recipes that make up this combo meal
   */
  protected getRecipes(): Recipe[] {
    // Recipes will be created dynamically based on input operations
    return [];
  }

  /**
   * Execute the combo meal with the given input
   */
  async execute(input: RailgunPrivacyOperationsComboMealInput) {
    // Validate input
    if (!input.operations || input.operations.length === 0) {
      throw new Error('At least one operation is required');
    }

    if (input.operations.length > (this.config.maxRecipes || 5)) {
      throw new Error(`Maximum ${this.config.maxRecipes} operations allowed`);
    }

    // Count total transfers to ensure we don't exceed limits
    let totalTransfers = 0;
    for (const operation of input.operations) {
      if (operation.type === 'batchTransfer' && operation.params.transfers) {
        totalTransfers += operation.params.transfers.length;
      } else if (operation.type === 'privateTransfer') {
        totalTransfers += 1;
      }
    }

    if (totalTransfers > (this.config.maxTotalTransfers || 20)) {
      throw new Error(`Maximum ${this.config.maxTotalTransfers} total transfers allowed`);
    }

    // Create recipes for each operation
    const recipes: Recipe[] = [];
    for (const operation of input.operations) {
      let recipe: Recipe;
      
      switch (operation.type) {
        case 'privateTransfer':
          recipe = new RailgunPrivateTransferRecipe(this.railgunProvider);
          break;
        case 'batchTransfer':
          recipe = new RailgunBatchTransferRecipe(this.railgunProvider);
          break;
        default:
          throw new Error(`Unsupported operation type: ${operation.type}`);
      }
      
      recipes.push(recipe);
    }

    // Execute each recipe
    const recipeOutputs: RecipeOutput[] = [];
    let totalGasUsed = 0;
    const errors: Error[] = [];

    // Execute recipes sequentially (as combo meal doesn't have parallel execution enabled)
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      const operation = input.operations[i];
      
      try {
        let recipeOutput: RecipeOutput;
        
        if (operation.type === 'privateTransfer') {
          // For private transfer, we need to create the proper input
          const privateTransferRecipe = recipe as RailgunPrivateTransferRecipe;
          recipeOutput = await privateTransferRecipe.execute({
            network: input.network,
            walletAddress: input.walletAddress,
            context: input.context,
            transferParams: operation.params,
            memo: operation.params.memo
          });
        } else if (operation.type === 'batchTransfer') {
          // For batch transfer, we need to create the proper input
          const batchTransferRecipe = recipe as RailgunBatchTransferRecipe;
          recipeOutput = await batchTransferRecipe.execute({
            network: input.network,
            walletAddress: input.walletAddress,
            context: input.context,
            transfers: operation.params.transfers,
            memo: operation.params.memo
          });
        }
        
        recipeOutputs.push(recipeOutput!);

        // Track gas usage
        if (recipeOutput!.totalGasUsed) {
          totalGasUsed += recipeOutput!.totalGasUsed;
        }
      } catch (error) {
        errors.push(error as Error);
        // Continue with other recipes
      }
    }

    // Determine final result
    const finalResult = recipeOutputs.length > 0 
      ? recipeOutputs.map(output => output.result) 
      : null;

    return {
      name: this.config.name,
      recipeOutputs,
      totalGasUsed,
      errors: errors.length > 0 ? errors : undefined,
      result: finalResult
    };
  }
}
