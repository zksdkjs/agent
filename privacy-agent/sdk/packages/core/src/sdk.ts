/**
 * zkSDK - The LangChain of Privacy
 * Universal SDK for private blockchain transactions
 */

import { BasePrivacyProvider, TransferParams, TransferResult, Balance } from './index';

export interface ZkSDKConfig {
  providers: Record<string, BasePrivacyProvider>;
  defaultProvider?: string;
}

export class ZkSDK {
  private providers: Record<string, BasePrivacyProvider>;
  private defaultProvider: string | undefined;

  constructor(config: ZkSDKConfig) {
    this.providers = config.providers;
    this.defaultProvider = config.defaultProvider;
  }

  /**
   * Add a privacy provider
   */
  addProvider(name: string, provider: BasePrivacyProvider): void {
    this.providers[name] = provider;
  }

  /**
   * Get a privacy provider by name
   */
  getProvider(name: string): BasePrivacyProvider {
    const provider = this.providers[name];
    if (!provider) {
      throw new Error(`Provider '${name}' not found`);
    }
    return provider;
  }

  /**
   * Execute a private transfer using the specified provider or default
   */
  async transfer(params: TransferParams, providerName?: string): Promise<TransferResult> {
    const providerKey = providerName || this.defaultProvider;
    if (!providerKey) {
      throw new Error('No provider specified and no default provider set');
    }

    const provider = this.getProvider(providerKey);
    return await provider.transfer(params);
  }

  /**
   * Get balances from a specific provider
   */
  async getBalances(providerName: string, address: string): Promise<Balance[]> {
    const provider = this.getProvider(providerName);
    return await provider.getBalances(address);
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(providerName: string, txHash: string): Promise<TransferResult> {
    const provider = this.getProvider(providerName);
    return await provider.getTransactionStatus(txHash);
  }
}

// Export core types
export * from './index';
