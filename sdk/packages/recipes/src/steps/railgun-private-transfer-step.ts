import { Step, StepConfig, StepInput, StepOutput } from '../steps/step';
import { RailgunProvider } from '../../../providers/railgun/src/index';
import { TransferParams, TransferResult } from '@zksdk/core';

/**
 * Configuration for Railgun Private Transfer Step
 */
export interface RailgunPrivateTransferStepConfig extends StepConfig {
  // Additional configuration specific to private transfers
  minGasLimit?: number;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}

/**
 * Input for Railgun Private Transfer Step
 */
export interface RailgunPrivateTransferStepInput extends StepInput {
  // Transfer parameters
  transferParams: Omit<TransferParams, 'privacy'>;
  // Railgun-specific options
  railgunOptions?: {
    memo?: string;
    // Proof generation options
    proofOptions?: {
      timeout?: number;
      retries?: number;
    };
  };
}

/**
 * Output from Railgun Private Transfer Step
 */
export interface RailgunPrivateTransferStepOutput extends StepOutput {
  result: TransferResult;
  effects: {
    transactionHash: string;
    proofGenerated: boolean;
    feesPaid: string;
  };
}

/**
 * Railgun Private Transfer Step
 * Executes a private transfer using Railgun
 */
export class RailgunPrivateTransferStep extends Step {
  readonly config: RailgunPrivateTransferStepConfig = {
    name: 'Railgun Private Transfer',
    description: 'Execute a private transfer using Railgun EVM privacy system',
    gasEstimate: 300000, // Estimated gas for Railgun transactions
  };

  private railgunProvider: RailgunProvider;

  constructor(railgunProvider: RailgunProvider) {
    super();
    this.railgunProvider = railgunProvider;
  }

  /**
   * Execute the private transfer step
   */
  async execute(input: RailgunPrivateTransferStepInput): Promise<RailgunPrivateTransferStepOutput> {
    this.validateInput(input);

    // Prepare transfer parameters
    const transferParams: TransferParams = {
      ...input.transferParams,
      privacy: 'anonymous' // Always use maximum privacy for Railgun
    };

    // Execute the transfer using Railgun provider
    const result = await this.railgunProvider.transfer(transferParams);

    // Calculate fees (mock implementation)
    const feesPaid = result.fee || '0';

    return {
      result,
      effects: {
        transactionHash: result.transactionHash,
        proofGenerated: true, // Railgun always generates proofs
        feesPaid
      },
      updatedContext: {
        lastTransactionHash: result.transactionHash,
        lastTransactionTimestamp: result.timestamp
      },
      gasUsed: this.config.gasEstimate
    };
  }

  /**
   * Validate step input
   */
  private validateInput(input: RailgunPrivateTransferStepInput): void {
    this.validateInputBase(input);

    if (!input.transferParams) {
      throw new Error('Transfer parameters are required');
    }

    if (!input.transferParams.chain) {
      throw new Error('Chain is required');
    }

    if (!input.transferParams.token) {
      throw new Error('Token is required');
    }

    if (!input.transferParams.amount || input.transferParams.amount === '0') {
      throw new Error('Amount must be greater than 0');
    }

    if (!input.transferParams.to) {
      throw new Error('Recipient address is required');
    }
  }
}
