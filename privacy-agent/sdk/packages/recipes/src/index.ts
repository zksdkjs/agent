/**
 * zkSDK Recipes Package
 * Implementation of the Recipe→Step→ComboMeal pattern for privacy operations
 */

// Base classes
export { Step } from './steps/step';
export type { StepConfig, StepInput, StepOutput } from './steps/step';

export { Recipe } from './recipes/recipe';
export type { RecipeConfig, RecipeInput, RecipeOutput } from './recipes/recipe';

export { ComboMeal } from './combo-meals/combo-meal';
export type { ComboMealConfig, ComboMealInput, ComboMealOutput } from './combo-meals/combo-meal';

// Railgun-specific implementations
export { RailgunPrivateTransferStep } from './steps/railgun-private-transfer-step';
export type { 
  RailgunPrivateTransferStepConfig, 
  RailgunPrivateTransferStepInput, 
  RailgunPrivateTransferStepOutput 
} from './steps/railgun-private-transfer-step';

export { RailgunPrivateTransferRecipe } from './recipes/railgun-private-transfer-recipe';
export type { 
  RailgunPrivateTransferRecipeConfig, 
  RailgunPrivateTransferRecipeInput 
} from './recipes/railgun-private-transfer-recipe';

export { RailgunBatchTransferRecipe } from './recipes/railgun-batch-transfer-recipe';
export type { 
  RailgunBatchTransferRecipeConfig, 
  RailgunBatchTransferRecipeInput 
} from './recipes/railgun-batch-transfer-recipe';

export { RailgunPrivacyOperationsComboMeal } from './combo-meals/railgun-privacy-operations-combo-meal';
export type { 
  RailgunPrivacyOperationsComboMealConfig, 
  RailgunPrivacyOperationsComboMealInput 
} from './combo-meals/railgun-privacy-operations-combo-meal';
