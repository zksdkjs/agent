import { Recipe, RecipeConfig, RecipeInput, RecipeOutput } from './recipes/recipe';

/**
 * Configuration for a ComboMeal
 */
export interface ComboMealConfig extends RecipeConfig {
  // Additional combo meal specific configuration
  maxRecipes?: number;
  parallelExecution?: boolean;
}

/**
 * Input for a ComboMeal execution
 */
export interface ComboMealInput extends RecipeInput {
  // Additional combo meal specific input
  recipeInputs?: RecipeInput[];
}

/**
 * Output from a ComboMeal execution
 */
export interface ComboMealOutput {
  name: string;
  recipeOutputs: RecipeOutput[];
  totalGasUsed?: number;
  errors?: Error[];
  result: any;
}

/**
 * Abstract base class for ComboMeals
 * ComboMeals bundle multiple recipes together for execution
 */
export abstract class ComboMeal {
  abstract readonly config: ComboMealConfig;

  /**
   * Get the recipes that make up this combo meal
   */
  protected abstract getRecipes(): Recipe[];

  /**
   * Execute the combo meal with the given input
   */
  async execute(input: ComboMealInput): Promise<ComboMealOutput> {
    // Get recipes
    const recipes = this.getRecipes();
    
    // Execute each recipe
    const recipeOutputs: RecipeOutput[] = [];
    let totalGasUsed = 0;
    const errors: Error[] = [];

    // Determine execution mode (sequential or parallel)
    if (this.config.parallelExecution) {
      // Execute recipes in parallel
      const promises = recipes.map(recipe => 
        recipe.execute(this.getRecipeInputForCombo(input, recipe))
      );
      
      try {
        const results = await Promise.all(promises);
        recipeOutputs.push(...results);
      } catch (error) {
        errors.push(error as Error);
      }
    } else {
      // Execute recipes sequentially
      for (const recipe of recipes) {
        try {
          const recipeInput = this.getRecipeInputForCombo(input, recipe);
          const recipeOutput = await recipe.execute(recipeInput);
          recipeOutputs.push(recipeOutput);

          // Track gas usage
          if (recipeOutput.totalGasUsed) {
            totalGasUsed += recipeOutput.totalGasUsed;
          }
        } catch (error) {
          errors.push(error as Error);
          // Continue with other recipes
        }
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

  /**
   * Estimate gas usage for this combo meal
   */
  async estimateGas(input: ComboMealInput): Promise<number> {
    const recipes = this.getRecipes();
    let totalGas = 0;

    for (const recipe of recipes) {
      const recipeInput = this.getRecipeInputForCombo(input, recipe);
      totalGas += await recipe.estimateGas(recipeInput);
    }

    return totalGas + (this.config.minGasLimit || 0);
  }

  /**
   * Create recipe input from combo meal input
   */
  private getRecipeInputForCombo(input: ComboMealInput, recipe: Recipe): RecipeInput {
    // If specific inputs were provided for this recipe, use them
    if (input.recipeInputs) {
      const specificInput = input.recipeInputs.find(
        ri => ri.params.recipeId === recipe.config.name
      );
      if (specificInput) {
        return specificInput;
      }
    }

    // Otherwise, use the combo meal input with recipe-specific parameters
    return {
      network: input.network,
      walletAddress: input.walletAddress,
      params: {
        ...input.params,
        recipeId: recipe.config.name
      },
      context: input.context
    };
  }
}
