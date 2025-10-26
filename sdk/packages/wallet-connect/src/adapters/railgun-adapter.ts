/**
 * Railgun Adapter for zkWalletConnect
 * Handles Railgun-specific wallet connections and operations
 */

import { BasePrivacyProvider, ProviderConfig, TransferParams, TransferResult, Balance } from '@zksdk/core';
import { RailgunProvider, RailgunConfig } from '@zksdk/railgun-provider';

export interface RailgunAdapterConfig extends RailgunConfig {}

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
    } catch (error: any) {
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
   * Shield tokens from public to private (0x → 0zk)
   */
  async shield(tokenAddress: string, amount: string, network: string): Promise<TransferResult> {
    if (!this.initialized) {
      throw new Error('Railgun adapter not initialized. Call initialize() first.');
    }
    
    // Cast to RailgunProvider to access shield method
    const provider = this.railgunProvider as any as { shield: (tokenAddress: string, amount: string, network: string) => Promise<TransferResult> };
    return await provider.shield(tokenAddress, amount, network);
  }

  /**
   * Unshield tokens from private to public (0zk → 0x)
   */
  async unshield(tokenAddress: string, amount: string, recipientAddress: string, network: string): Promise<TransferResult> {
    if (!this.initialized) {
      throw new Error('Railgun adapter not initialized. Call initialize() first.');
    }
    
    // Cast to RailgunProvider to access unshield method
    const provider = this.railgunProvider as any as { unshield: (tokenAddress: string, amount: string, recipientAddress: string, network: string) => Promise<TransferResult> };
    return await provider.unshield(tokenAddress, amount, recipientAddress, network);
  }

  /**
   * Check if the adapter is ready
   */
  async isReady(): Promise<boolean> {
    return this.initialized;
  }
}
