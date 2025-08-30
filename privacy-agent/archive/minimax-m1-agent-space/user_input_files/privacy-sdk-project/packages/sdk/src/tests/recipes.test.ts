/**
 * Recipe system tests
 */

import { 
  PrivateTransferRecipe, 
  PrivateSwapRecipe, 
  AnonymousVotingRecipe,
  RecipeRegistry
} from '../recipes';
import { ValidationError } from '../types/errors';

describe('Recipe System', () => {
  describe('PrivateTransferRecipe', () => {
    let recipe: PrivateTransferRecipe;

    beforeEach(() => {
      recipe = new PrivateTransferRecipe();
    });

    it('should validate required parameters', () => {
      const result = recipe.validate({});
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.field === 'to')).toBe(true);
      expect(result.errors.some(e => e.field === 'amount')).toBe(true);
    });

    it('should validate valid parameters', () => {
      const result = recipe.validate({
        to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
        amount: '1000000000000000000'
      });
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should estimate fees', async () => {
      const estimate = await recipe.estimateFees({
        provider: 'railgun',
        to: '0x742d35Cc6634C0532925a3b8D2aE2E8d8C3b7c7e',
        amount: '1000000000000000000'
      });
      
      expect(estimate.estimatedFee).toBeDefined();
      expect(estimate.currency).toBeDefined();
      expect(estimate.confidence).toBeDefined();
    });
  });

  describe('PrivateSwapRecipe', () => {
    let recipe: PrivateSwapRecipe;

    beforeEach(() => {
      recipe = new PrivateSwapRecipe();
    });

    it('should validate swap parameters', () => {
      const result = recipe.validate({
        fromToken: '0xA0b86a33E6441ddD8BaFbD36fA20b0D91b42DFfF',
        toToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        amount: '1000000000000000000'
      });
      expect(result.valid).toBe(true);
    });

    it('should validate slippage range', () => {
      const result = recipe.validate({
        fromToken: '0xA0b86a33E6441ddD8BaFbD36fA20b0D91b42DFfF',
        toToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        amount: '1000000000000000000',
        slippage: 150 // Invalid: > 100
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'slippage')).toBe(true);
    });
  });

  describe('AnonymousVotingRecipe', () => {
    let recipe: AnonymousVotingRecipe;

    beforeEach(() => {
      recipe = new AnonymousVotingRecipe();
    });

    it('should validate voting parameters', () => {
      const result = recipe.validate({
        groupId: '1',
        signal: 'yes'
      });
      expect(result.valid).toBe(true);
    });

    it('should validate group ID format', () => {
      const result = recipe.validate({
        groupId: 'invalid-group',
        signal: 'yes'
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'groupId')).toBe(true);
    });

    it('should create binary votes', () => {
      expect(AnonymousVotingRecipe.createBinaryVote(true)).toBe('1');
      expect(AnonymousVotingRecipe.createBinaryVote(false)).toBe('0');
    });

    it('should create multiple choice votes', () => {
      expect(AnonymousVotingRecipe.createMultipleChoiceVote(0)).toBe('0');
      expect(AnonymousVotingRecipe.createMultipleChoiceVote(2)).toBe('2');
    });
  });

  describe('RecipeRegistry', () => {
    let registry: RecipeRegistry;

    beforeEach(() => {
      registry = new RecipeRegistry();
    });

    it('should list built-in recipes', () => {
      const recipes = registry.listRecipes();
      expect(recipes.length).toBeGreaterThan(0);
      
      const names = recipes.map(r => r.name);
      expect(names).toContain('private_transfer');
      expect(names).toContain('private_swap');
      expect(names).toContain('anonymous_voting');
    });

    it('should get recipe by name', () => {
      const recipe = registry.getRecipe('private_transfer');
      expect(recipe).toBeDefined();
      expect(recipe!.name).toBe('private_transfer');
    });

    it('should get recipes by provider', () => {
      const railgunRecipes = registry.getRecipesByProvider('railgun');
      expect(railgunRecipes.length).toBeGreaterThan(0);
      
      const semaphoreRecipes = registry.getRecipesByProvider('semaphore');
      expect(semaphoreRecipes.some(r => r.name === 'anonymous_voting')).toBe(true);
    });

    it('should register and unregister custom recipes', () => {
      const customRecipe = {
        name: 'custom_recipe',
        description: 'Test recipe',
        supportedProviders: ['railgun'],
        requiredParams: ['test'],
        optionalParams: [],
        execute: async () => ({ success: true, transactions: [], totalFees: '0', executionTime: 0 }),
        validate: () => ({ valid: true, errors: [], warnings: [] }),
        estimateFees: async () => ({ estimatedFee: '0', currency: 'ETH', confidence: 'high' as const })
      };

      registry.register(customRecipe);
      expect(registry.getRecipe('custom_recipe')).toBeDefined();
      
      registry.unregister('custom_recipe');
      expect(registry.getRecipe('custom_recipe')).toBeUndefined();
    });
  });
});