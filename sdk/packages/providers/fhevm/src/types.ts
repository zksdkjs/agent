/**
 * Type definitions for Zama fhEVM Provider
 */

import { ethers } from 'ethers';

/**
 * Configuration for the fhEVM provider
 */
export interface FHEVMConfig {
  /** RPC endpoint for the fhEVM network */
  rpcUrl: string;
  /** Chain ID of the network */
  chainId: number;
  /** Network ID */
  networkId: number;
  /** ACL contract address for access control */
  aclAddress?: string;
  /** Gateway URL for FHE operations */
  gatewayUrl?: string;
  /** Public key for encryption */
  publicKey?: string;
  /** Enable debug mode */
  debug?: boolean;
}

/**
 * Options for initializing the provider
 */
export interface FHEVMProviderOptions {
  /** Ethereum provider or signer */
  provider: ethers.Provider | ethers.Signer;
  /** fhEVM configuration */
  config: FHEVMConfig;
}

/**
 * Represents an encrypted amount in the FHE system
 */
export interface EncryptedAmount {
  /** The encrypted value (ciphertext) */
  value: string;
  /** The proof data for verification */
  proof: FHEProof;
  /** Contract address this encrypted value is associated with */
  contractAddress: string;
  /** Timestamp when encryption was performed */
  timestamp: number;
}

/**
 * Represents an encrypted balance
 */
export interface EncryptedBalance {
  /** User address */
  address: string;
  /** Token address */
  token: string;
  /** Encrypted balance value */
  encryptedAmount: EncryptedAmount;
  /** Block number when balance was fetched */
  blockNumber: number;
}

/**
 * Parameters for a confidential transfer
 */
export interface ConfidentialTransferParams {
  /** Token contract address */
  tokenAddress: string;
  /** Recipient address */
  to: string;
  /** Amount to transfer (will be encrypted) */
  amount: bigint;
  /** Optional memo (encrypted) */
  memo?: string;
}

/**
 * Parameters for a confidential swap
 */
export interface ConfidentialSwapParams {
  /** Input token address */
  tokenIn: string;
  /** Output token address */
  tokenOut: string;
  /** Amount of input token (will be encrypted) */
  amountIn: bigint;
  /** Minimum amount of output token (encrypted) */
  minAmountOut: bigint;
  /** Deadline timestamp */
  deadline: number;
  /** DEX router address */
  routerAddress?: string;
}

/**
 * Parameters for a blind auction bid
 */
export interface BlindAuctionParams {
  /** Auction contract address */
  auctionAddress: string;
  /** Bid amount (encrypted) */
  bidAmount: bigint;
  /** Optional salt for commitment scheme */
  salt?: string;
}

/**
 * Represents a proof in the FHE system
 */
export interface FHEProof {
  /** The proof data as hex string */
  proof: string;
  /** Public inputs to the proof */
  publicInputs: string[];
  /** Proof type identifier */
  proofType: string;
}

/**
 * Result of a confidential transaction
 */
export interface ConfidentialTransaction {
  /** From address */
  from: string;
  /** To address */
  to: string;
  /** Encrypted amount */
  encryptedAmount: EncryptedAmount;
  /** Token address */
  tokenAddress: string;
  /** Nonce */
  nonce: number;
  /** Chain ID */
  chainId: number;
  /** Timestamp */
  timestamp: number;
}

/**
 * Represents an event from a confidential contract
 */
export interface ConfidentialEvent {
  /** Event name */
  name: string;
  /** Event arguments (may include encrypted values) */
  args: Record<string, any>;
  /** Contract address that emitted the event */
  address: string;
}

/**
 * FHE operation types
 */
export enum FHEOperation {
  ADD = 'add',
  SUB = 'sub',
  MUL = 'mul',
  DIV = 'div',
  REM = 'rem',
  AND = 'and',
  OR = 'or',
  XOR = 'xor',
  EQ = 'eq',
  NE = 'ne',
  GE = 'ge',
  GT = 'gt',
  LE = 'le',
  LT = 'lt',
  MIN = 'min',
  MAX = 'max',
  NEG = 'neg',
  NOT = 'not',
  SELECT = 'select'
}

/**
 * Result of an FHE computation
 */
export interface FHEComputationResult {
  /** The encrypted result */
  result: EncryptedAmount;
  /** Gas used for computation */
  gasUsed: bigint;
  /** Computation time in milliseconds */
  computationTime: number;
  /** Whether computation was done on-chain or off-chain */
  onChain: boolean;
}