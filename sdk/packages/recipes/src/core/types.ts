/**
 * Core types for Recipe→Step→ComboMeal pattern
 * Author: Railgun Integration Specialist
 */

import { TransferParams, TransferResult, Token, Balance } from '@zksdk/core';

/**
 * Recipe represents a high-level privacy workflow
 * It's a collection of steps that achieve a specific privacy goal
 */
export interface Recipe {
  id: string;
  name: string;
  description: string;
  steps: Step[];
  metadata?: Record<string, any>;
}

/**
 * Step represents a single operation within a recipe
 * Steps are executed sequentially to complete a recipe
 */
export interface Step {
  id: string;
  name: string;
  description: string;
  action: StepAction;
  parameters: Record<string, any>;
  dependencies?: string[]; // IDs of steps that must complete before this one
}

/**
 * StepAction defines what type of operation a step performs
 */
export type StepAction = 
  | 'transfer'
  | 'balance_check'
  | 'proof_generation'
  | 'transaction_submission'
  | 'custom';

/**
 * ComboMeal represents a bundle of recipes that work together
 * It's the highest level of abstraction, combining multiple recipes
 */
export interface ComboMeal {
  id: string;
  name: string;
  description: string;
  recipes: Recipe[];
  executionOrder: string[]; // Order in which recipes should be executed
}

/**
 * RecipeContext holds the execution context for a recipe
 */
export interface RecipeContext {
  // Shared data between steps
  sharedData: Record<string, any>;
  // Results from completed steps
  stepResults: Record<string, any>;
  // Configuration for the recipe execution
  config: RecipeConfig;
}

/**
 * RecipeConfig holds configuration for recipe execution
 */
export interface RecipeConfig {
  // Whether to execute steps in parallel where possible
  parallelExecution?: boolean;
  // Timeout for the entire recipe
  timeoutMs?: number;
  // Retry configuration
  maxRetries?: number;
  // Custom error handler
  onError?: (error: Error, step: Step) => void;
}

/**
 * Result of executing a recipe
 */
export interface RecipeResult {
  success: boolean;
  results: Record<string, any>;
  errors: Record<string, Error>;
  executionTimeMs: number;
}

/**
 * Result of executing a step
 */
export interface StepResult {
  success: boolean;
  result?: any;
  error?: Error;
  executionTimeMs: number;
}
