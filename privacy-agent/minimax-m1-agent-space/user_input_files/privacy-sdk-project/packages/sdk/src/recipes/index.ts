/**
 * Recipe exports
 */

export * from './base-recipe';
export * from './private-transfer';
export * from './private-swap';
export * from './anonymous-voting';

import { PrivateTransferRecipe } from './private-transfer';
import { PrivateSwapRecipe } from './private-swap';
import { AnonymousVotingRecipe } from './anonymous-voting';
import { Recipe } from '../types';

/**
 * Registry of all available recipes
 */
export class RecipeRegistry {
  private recipes = new Map<string, Recipe>();

  constructor() {
    this.registerBuiltInRecipes();
  }

  register(recipe: Recipe): void {
    this.recipes.set(recipe.name, recipe);
  }

  unregister(name: string): void {
    this.recipes.delete(name);
  }

  getRecipe(name: string): Recipe | undefined {
    return this.recipes.get(name);
  }

  listRecipes(): Recipe[] {
    return Array.from(this.recipes.values());
  }

  getRecipesByProvider(providerName: string): Recipe[] {
    return this.listRecipes().filter(recipe => 
      recipe.supportedProviders.includes(providerName)
    );
  }

  private registerBuiltInRecipes(): void {
    this.register(new PrivateTransferRecipe());
    this.register(new PrivateSwapRecipe());
    this.register(new AnonymousVotingRecipe());
  }
}

// Export recipe instances for convenience
export const privateTransferRecipe = new PrivateTransferRecipe();
export const privateSwapRecipe = new PrivateSwapRecipe();
export const anonymousVotingRecipe = new AnonymousVotingRecipe();

// Export default recipe registry
export const recipeRegistry = new RecipeRegistry();