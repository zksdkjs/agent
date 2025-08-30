import { 
  TransferParams, 
  TransferResult, 
  Balance, 
  Network 
} from '@zksdk/core';

/**
 * Base interface for Step configuration
 */
export interface StepConfig {
  name: string;
  description: string;
  gasEstimate?: number;
}

/**
 * Input for a Step execution
 */
export interface StepInput {
  network: Network;
  // Railgun-specific wallet info would go here
  walletAddress?: string;
  // Any additional context needed for the step
  context?: Record<string, any>;
}

/**
 * Output from a Step execution
 */
export interface StepOutput {
  // Results of the step execution
  result: any;
  // Any side effects or state changes
  effects?: Record<string, any>;
  // Updated context for subsequent steps
  updatedContext?: Record<string, any>;
  // Gas used by this step
  gasUsed?: number;
}

/**
 * Abstract base class for all Steps
 */
export abstract class Step {
  abstract readonly config: StepConfig;

  /**
   * Execute the step with the given input
   */
  abstract execute(input: StepInput): Promise<StepOutput>;

  /**
   * Estimate gas usage for this step
   */
  async estimateGas(input: StepInput): Promise<number> {
    return this.config.gasEstimate || 0;
  }

  /**
   * Validate step input
   */
  protected validateInput(input: StepInput): void {
    if (!input.network) {
      throw new Error('Network is required');
    }
  }
}
