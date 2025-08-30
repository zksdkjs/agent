import { Step, StepInput, StepOutput } from './steps/step';
import { Network } from '@zksdk/core';

/**
 * Configuration for a Recipe
 */
export interface RecipeConfig {
  name: string;
  description: string;
  version: string;
  supportedNetworks: Network[];
  minGasLimit?: number;
}

/**
 * Input for a Recipe execution
 */
export interface RecipeInput {
  network: Network;
  walletAddress: string;
  // Parameters specific to the recipe
  params: Record<string, any>;
  // Optional context
  context?: Record<string, any>;
}

/**
 * Output from a Recipe execution
 */
export interface RecipeOutput {
  // Name of the recipe
  name: string;
  // Results from each step
  stepOutputs: StepOutput[];
  // Combined gas estimate
  totalGasUsed?: number;
  // Any errors encountered
  errors?: Error[];
  // Final result
  result: any;
}

/**
 * Abstract base class for all Recipes
 */
export abstract class Recipe {
  abstract readonly config: RecipeConfig;

  /**
   * Get the steps that make up this recipe
   */
  protected abstract getSteps(): Step[];

  /**
   * Execute the recipe with the given input
   */
  async execute(input: RecipeInput): Promise<RecipeOutput> {
    // Validate input
    this.validateInput(input);

    // Get steps
    const steps = this.getSteps();
    
    // Execute each step
    const stepOutputs: StepOutput[] = [];
    let currentContext = input.context || {};
    let totalGasUsed = 0;
    const errors: Error[] = [];

    for (const step of steps) {
      try {
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
      } catch (error) {
        errors.push(error as Error);
        // Depending on configuration, we might want to continue or stop
        // For now, we'll continue to collect all errors
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
   * Estimate gas usage for this recipe
   */
  async estimateGas(input: RecipeInput): Promise<number> {
    const steps = this.getSteps();
    let totalGas = 0;

    for (const step of steps) {
      totalGas += await step.estimateGas({
        network: input.network,
        walletAddress: input.walletAddress,
        context: input.context
      });
    }

    return totalGas + (this.config.minGasLimit || 0);
  }

  /**
   * Validate recipe input
   */
  private validateInput(input: RecipeInput): void {
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
