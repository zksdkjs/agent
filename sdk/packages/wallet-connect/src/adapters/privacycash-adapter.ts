/**
 * PrivacyCash Adapter for zkWalletConnect
 * Integrates PrivacyCash provider with the unified wallet interface
 */

import { BasePrivacyProvider, ProviderConfig, TransferParams, TransferResult, Balance } from '@zksdk/core';
import { PrivacyCashProvider, PrivacyCashConfig } from '@zksdk/privacy-provider';

export class PrivacyCashAdapter extends BasePrivacyProvider {
  name = 'PrivacyCash';
  private provider: PrivacyCashProvider;

  constructor(config: PrivacyCashConfig = {}) {
    super(config);
    this.provider = new PrivacyCashProvider(config);
  }

  /**
   * Initialize the PrivacyCash adapter
   */
  async initialize(config: PrivacyCashConfig): Promise<void> {
    this.config = { ...this.config, ...config };
    await this.provider.initialize(config);
  }

  /**
   * Execute a private transfer using PrivacyCash
   */
  async transfer(params: TransferParams): Promise<TransferResult> {
    return await this.provider.transfer(params);
  }

  /**
   * Get private balances using PrivacyCash
   */
  async getBalances(address: string): Promise<Balance[]> {
    return await this.provider.getBalances(address);
  }

  /**
   * Get transaction status using PrivacyCash
   */
  async getTransactionStatus(txHash: string): Promise<TransferResult> {
    return await this.provider.getTransactionStatus(txHash);
  }
}
