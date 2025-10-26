// Recipe: zkSDK Developer Agent
// File: sdk/packages/providers/privacy/src/types.ts

import { ProviderConfig, TransferParams, TransferResult, Balance, Token } from '@zksdk/core';

/**
 * Privacy Cash Configuration
 */
export interface PrivacyCashConfig extends ProviderConfig {
  rpcEndpoint?: string;
  commitment?: 'processed' | 'confirmed' | 'finalized';
  cluster?: 'mainnet-beta' | 'testnet' | 'devnet';
}

/**
 * Compressed Token Account
 */
export interface CompressedTokenAccount {
  publicKey: string;
  mint: string;
  amount: string;
  owner: string;
}

/**
 * Compressed Token Program IDs
 */
export interface CompressedTokenProgramIds {
  tokenProgramId: string;
  accountCompressionProgramId: string;
  noopProgramId: string;
}

/**
 * Merkle Tree Account Info
 */
export interface MerkleTreeAccountInfo {
  authority: string;
  height: number;
  bufferSize: number;
  currentRootIndex: number;
  roots: string[];
}
