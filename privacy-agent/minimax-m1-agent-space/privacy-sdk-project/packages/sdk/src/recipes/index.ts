// Recipe exports and registry

import { Recipe } from './base-recipe';
import { PrivateTransferRecipe, PrivateTransferParams } from './private-transfer';
import { PrivateSwapRecipe, PrivateSwapParams } from './private-swap';
import { ShieldRecipe, UnshieldRecipe, ShieldParams, UnshieldParams } from './shield-unshield';
import { BatchTransferRecipe, BatchTransferParams } from './batch-transfer';
import { CrossProviderRecipe, CrossProviderParams } from './cross-provider-recipe';

// Export base classes and interfaces
export * from './base-recipe';
export * from './private-transfer';
export * from './private-swap';
export * from './shield-unshield';
export * from './batch-transfer';
export * from './cross-provider-recipe';

/**
 * Recipe registry for managing and accessing recipes
 */
export class RecipeRegistry {
  private recipes: Map<string, Recipe> = new Map();

  constructor() {
    // Register built-in recipes
    this.registerBuiltInRecipes();
  }

  /**
   * Register a recipe
   */
  register(recipe: Recipe): void {
    this.recipes.set(recipe.name, recipe);
  }

  /**
   * Get a recipe by name
   */
  get(name: string): Recipe | undefined {
    return this.recipes.get(name);
  }

  /**
   * List all available recipes
   */
  list(): Recipe[] {
    return Array.from(this.recipes.values());
  }

  /**
   * Check if a recipe exists
   */
  has(name: string): boolean {
    return this.recipes.has(name);
  }

  /**
   * Get recipes that support a specific provider
   */
  getRecipesForProvider(providerName: string): Recipe[] {
    return this.list().filter(recipe => 
      recipe.supportedProviders.includes('*') || 
      recipe.supportedProviders.includes(providerName)
    );
  }

  /**
   * Register built-in recipes
   */
  private registerBuiltInRecipes(): void {
    this.register(new PrivateTransferRecipe());
    this.register(new PrivateSwapRecipe());
    this.register(new ShieldRecipe());
    this.register(new UnshieldRecipe());
    this.register(new BatchTransferRecipe());
    this.register(new CrossProviderRecipe());
  }
}

/**
 * Global recipe registry instance
 */
export const recipeRegistry = new RecipeRegistry();

/**
 * Recipe execution helper class
 */
export class RecipeExecutor {
  constructor(
    private registry: RecipeRegistry = recipeRegistry
  ) {}

  /**
   * Execute a recipe by name
   */
  async execute(recipeName: string, params: any, provider: any): Promise<any> {
    const recipe = this.registry.get(recipeName);
    if (!recipe) {
      throw new Error(`Recipe '${recipeName}' not found`);
    }

    return await recipe.execute(params, provider);
  }

  /**
   * Validate recipe parameters
   */
  validate(recipeName: string, params: any): any {
    const recipe = this.registry.get(recipeName);
    if (!recipe) {
      throw new Error(`Recipe '${recipeName}' not found`);
    }

    return recipe.validate(params);
  }

  /**
   * Estimate fees for recipe execution
   */
  async estimateFees(recipeName: string, params: any, provider: any): Promise<any> {
    const recipe = this.registry.get(recipeName);
    if (!recipe) {
      throw new Error(`Recipe '${recipeName}' not found`);
    }

    return await recipe.estimateFees(params, provider);
  }
}

// Export commonly used recipe parameter types
export type { 
  PrivateTransferParams,
  PrivateSwapParams,
  ShieldParams,
  UnshieldParams,
  BatchTransferParams,
  CrossProviderParams
};
