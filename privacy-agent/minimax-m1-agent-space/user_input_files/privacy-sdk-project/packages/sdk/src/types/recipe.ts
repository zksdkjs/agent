/**
 * Recipe system types and interfaces
 */

import { TransactionResult, Amount } from './base';

// Recipe System Interfaces
export interface Recipe {
  name: string;
  description: string;
  supportedProviders: string[];
  requiredParams: string[];
  optionalParams: string[];
  
  execute(params: RecipeParams): Promise<RecipeResult>;
  validate(params: RecipeParams): ValidationResult;
  estimateFees(params: RecipeParams): Promise<FeeEstimate>;
}

export interface RecipeParams {
  provider?: string;
  [key: string]: any;
}

export interface RecipeResult {
  success: boolean;
  transactions: TransactionResult[];
  totalFees: Amount;
  executionTime: number;
  metadata?: Record<string, any>;
}

// Validation Interface
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  code: string;
  message: string;
  details?: any;
}

export interface ValidationWarning {
  field: string;
  code: string;
  message: string;
  suggestion?: string;
}

// Fee Estimation
export interface FeeEstimate {
  estimatedFee: Amount;
  gasLimit?: number;
  gasPrice?: Amount;
  currency: string;
  confidence: 'low' | 'medium' | 'high';
  factors?: FeeFactor[];
}

export interface FeeFactor {
  type: 'network' | 'privacy' | 'complexity';
  impact: 'low' | 'medium' | 'high';
  description: string;
}

// Specific Recipe Interfaces
import { PrivateAddress, PublicAddress, TokenInfo, Address, ProofData } from './base';

// Private Transfer Recipe
export interface PrivateTransferParams extends RecipeParams {
  to: PrivateAddress | PublicAddress;
  amount: Amount;
  token?: TokenInfo | Address;
  memo?: string;
}

// Private Swap Recipe
export interface PrivateSwapParams extends RecipeParams {
  fromToken: TokenInfo | Address;
  toToken: TokenInfo | Address;
  amount: Amount;
  minAmountOut?: Amount;
  slippage?: number;
  deadline?: number;
}

// Anonymous Vote Recipe
export interface AnonymousVoteParams extends RecipeParams {
  groupId: string;
  signal: string | number;
  proof?: ProofData;
}

// Private NFT Recipe
export interface PrivateNFTParams extends RecipeParams {
  contractAddress: Address;
  tokenId: string;
  to: PrivateAddress | PublicAddress;
  metadata?: Record<string, any>;
}