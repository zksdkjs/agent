/**
 * Railgun Adapter for zkWalletConnect
 * Handles Railgun-specific wallet connections and operations
 */

import { BasePrivacyProvider, ProviderConfig, TransferParams, TransferResult, Balance } from '@zksdk/core';
import { RailgunProvider } from '@zksdk/providers-railgun';

export interface RailgunAdapterConfig extends ProviderConfig {
  walletMnemonic?: string;
  rpcEndpoints?: Record<string, string>;
  engineDbPath?: string;
}

export class RailgunAdapter extends BasePrivacyProvider {
  name = 'Railgun';
  private railgunProvider: RailgunProvider;
  private initialized = false;

  constructor(config: RailgunAdapterConfig = {}) {
    super(config);
    this.railgunProvider = new RailgunProvider(config);
  }

  /**
   * Initialize the Railgun adapter
   */
  async initialize(config: RailgunAdapterConfig): Promise<void> {
    this.config = { ...this.config, ...config };
    
    try {
      await this.railgunProvider.initialize(config);
      this.initialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize Railgun adapter: ${error.message}`);
    }
  }

  /**
   * Execute a private transfer using Railgun
   */
  async transfer(params: TransferParams): Promise<TransferResult> {
    if (!this.initialized) {
      throw new Error('Railgun adapter not initialized. Call initialize() first.');
    }
    
    return await this.railgunProvider.transfer(params);
  }

  /**
   * Get private balances using Railgun
   */
  async getBalances(address: string): Promise<Balance[]> {
    if (!this.initialized) {
      throw new Error('Railgun adapter not initialized. Call initialize() first.');
    }
    
    return await this.railgunProvider.getBalances(address);
  }

  /**
   * Get transaction status using Railgun
   */
  async getTransactionStatus(txHash: string): Promise<TransferResult> {
    if (!this.initialized) {
      throw new Error('Railgun adapter not initialized. Call initialize() first.');
    }
    
    return await this.railgunProvider.getTransactionStatus(txHash);
  }

  /**
   * Check if the adapter is ready
   */
  async isReady(): Promise<boolean> {
    return this.initialized;
  }
}
