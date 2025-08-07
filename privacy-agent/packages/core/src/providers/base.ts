// Base provider implementation for privacy systems

import { PrivacyProvider, ProviderConfig, TransferParams, TransferResult } from '../types';

export abstract class BasePrivacyProvider implements PrivacyProvider {
  abstract name: string;
  abstract config: ProviderConfig;

  // Core methods that each provider must implement
  abstract transfer(params: TransferParams): Promise<TransferResult>;
  abstract getBalance(address: string, token: string): Promise<string>;
  abstract getTransactionHistory(address: string): Promise<TransferResult[]>;
  abstract initialize(config: any): Promise<void>;
  abstract isReady(): Promise<boolean>;

  // Helper method for validation
  protected validateParams(params: TransferParams): void {
    if (!this.config.chains.includes(params.chain)) {
      throw new Error(`Chain ${params.chain} not supported by ${this.name}`);
    }

    if (!this.config.privacyLevels.includes(params.privacy)) {
      throw new Error(`Privacy level ${params.privacy} not supported by ${this.name}`);
    }

    if (!params.amount || params.amount === '0') {
      throw new Error('Amount must be greater than 0');
    }

    if (!params.to) {
      throw new Error('Recipient address is required');
    }
  }

  // Common error handling
  protected handleError(error: any): never {
    if (error.message) {
      throw new Error(`${this.name} Provider Error: ${error.message}`);
    }
    throw new Error(`${this.name} Provider Error: ${error}`);
  }
}

// AI Agent Implementation Priority:
// 1. Create RailgunProvider extends BasePrivacyProvider
// 2. Create AztecProvider extends BasePrivacyProvider  
// 3. Create SolanaPrivacyProvider extends BasePrivacyProvider
// 4. Create MidnightProvider extends BasePrivacyProvider (Phase 2)