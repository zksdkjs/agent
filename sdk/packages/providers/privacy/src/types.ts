// Recipe: zkSDK Developer Agent
// File: sdk/packages/providers/privacy/src/types.ts

import { ProviderConfig } from '@zksdk/core';
import { Commitment, Keypair } from '@solana/web3.js';

/**
 * Privacy Cash Configuration
 */
export type PrivacyCashCluster = 'mainnet-beta' | 'testnet' | 'devnet';

export interface PrivacyCashConfig extends ProviderConfig {
  rpcEndpoint?: string;
  cluster?: PrivacyCashCluster;
  commitment?: Commitment;
  keypair?: Keypair;
  owner?: string | number[] | Uint8Array | Keypair;
  secretKey?: string | number[] | Uint8Array;
  cachePath?: string;
  enableDebug?: boolean;
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
