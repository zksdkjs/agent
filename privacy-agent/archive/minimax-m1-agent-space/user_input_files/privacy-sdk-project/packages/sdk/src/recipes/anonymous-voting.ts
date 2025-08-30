/**
 * Anonymous Voting Recipe Implementation
 */

import { BaseRecipe } from './base-recipe';
import {
  RecipeParams,
  RecipeResult,
  ValidationResult,
  ValidationError,
  AnonymousVoteParams,
  PrivacyProvider,
  FeeEstimate
} from '../types';
import { TransactionError } from '../types/errors';

export class AnonymousVotingRecipe extends BaseRecipe {
  readonly name = 'anonymous_voting';
  readonly description = 'Cast anonymous votes using zero-knowledge proofs';
  readonly supportedProviders = ['semaphore'];
  readonly requiredParams = ['groupId', 'signal'];
  readonly optionalParams = ['proof', 'provider'];

  async execute(params: RecipeParams): Promise<RecipeResult> {
    const startTime = Date.now();
    const voteParams = params as AnonymousVoteParams;

    // Validate parameters
    const validation = this.validate(voteParams);
    if (!validation.valid) {
      throw new TransactionError(
        `Invalid parameters: ${validation.errors.map(e => e.message).join(', ')}`
      );
    }

    try {
      const provider = await this.getProvider(voteParams.provider || 'semaphore');
      
      // Execute anonymous vote
      const transaction = await provider.sendPrivateTransaction({
        type: 'vote',
        to: voteParams.groupId, // Use groupId as destination
        amount: '0', // No amount for voting
        metadata: {
          groupId: voteParams.groupId,
          signal: voteParams.signal,
          proof: voteParams.proof
        }
      });

      return this.createRecipeResult(
        [transaction],
        startTime,
        true,
        {
          operation: 'anonymous_voting',
          groupId: voteParams.groupId,
          signal: voteParams.signal,
          anonymitySet: 'group_members'
        }
      );
    } catch (error) {
      throw new TransactionError(
        `Anonymous voting failed: ${error.message}`,
        voteParams.provider
      );
    }
  }

  async estimateFees(params: RecipeParams): Promise<FeeEstimate> {
    // Semaphore voting typically has minimal fees
    return {
      estimatedFee: '2000000000000000', // ~0.002 ETH for proof verification
      currency: 'ETH',
      confidence: 'high',
      factors: [
        {
          type: 'privacy',
          impact: 'high',
          description: 'Zero-knowledge proof verification on-chain'
        },
        {
          type: 'network',
          impact: 'low',
          description: 'Simple contract interaction for vote recording'
        }
      ]
    };
  }

  protected validateRecipeParams(params: RecipeParams): ValidationResult {
    const voteParams = params as AnonymousVoteParams;
    const errors: ValidationError[] = [];

    // Validate group ID
    if (!voteParams.groupId || typeof voteParams.groupId !== 'string') {
      errors.push({
        field: 'groupId',
        code: 'REQUIRED',
        message: 'Group ID is required and must be a string'
      });
    } else if (!/^\d+$/.test(voteParams.groupId)) {
      errors.push({
        field: 'groupId',
        code: 'INVALID_FORMAT',
        message: 'Group ID must be a numeric string'
      });
    }

    // Validate signal
    if (voteParams.signal === undefined || voteParams.signal === null) {
      errors.push({
        field: 'signal',
        code: 'REQUIRED',
        message: 'Signal is required'
      });
    }

    // Validate signal type
    if (voteParams.signal !== undefined && 
        typeof voteParams.signal !== 'string' && 
        typeof voteParams.signal !== 'number') {
      errors.push({
        field: 'signal',
        code: 'INVALID_TYPE',
        message: 'Signal must be a string or number'
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: []
    };
  }

  private async getProvider(providerName: string): Promise<PrivacyProvider> {
    throw new Error('Provider injection not implemented in this demo');
  }

  /**
   * Helper method to validate vote choices against allowed options
   */
  public validateVoteChoice(signal: string | number, allowedChoices: (string | number)[]): ValidationError | null {
    if (!allowedChoices.includes(signal)) {
      return {
        field: 'signal',
        code: 'INVALID_CHOICE',
        message: `Invalid vote choice. Allowed choices: ${allowedChoices.join(', ')}`
      };
    }
    return null;
  }

  /**
   * Helper method to create a binary vote (yes/no)
   */
  public static createBinaryVote(choice: boolean): string {
    return choice ? '1' : '0';
  }

  /**
   * Helper method to create a multiple choice vote
   */
  public static createMultipleChoiceVote(choiceIndex: number): string {
    return choiceIndex.toString();
  }
}