// Recipe: zkSDK Developer Agent
// File: sdk/packages/providers/privacy/src/provider.ts

import { BasePrivacyProvider, ProviderConfig, TransferParams, TransferResult, Balance } from '@zksdk/core';
import { PrivacyCashConfig, CompressedTokenAccount } from './types';

/**
 * Base interface for Privacy Cash provider
 */
export abstract class PrivacyCashBaseProvider extends BasePrivacyProvider {
  abstract name: string;
  protected config: PrivacyCashConfig;

  constructor(config: PrivacyCashConfig = {}) {
    super(config);
    this.config = config;
  }

  /**
   * Initialize the provider with configuration
   */
  abstract initialize(config: PrivacyCashConfig): Promise<void>;

  /**
   * Execute a private transfer using compressed tokens
   */
  abstract transfer(params: TransferParams): Promise<TransferResult>;

  /**
   * Get compressed token balances
   */
  abstract getBalances(address: string): Promise<Balance[]>;

  /**
   * Get transaction status
   */
  abstract getTransactionStatus(txHash: string): Promise<TransferResult>;

  /**
   * Get compressed token accounts for an address
   */
  abstract getCompressedTokenAccounts(address: string): Promise<CompressedTokenAccount[]>;

  /**
   * Create a new compressed token account
   */
  abstract createCompressedTokenAccount(owner: string, mint: string): Promise<string>;

  /**
   * Get Merkle tree account information
   */
  abstract getMerkleTreeInfo(treeAddress: string): Promise<any>;
}
