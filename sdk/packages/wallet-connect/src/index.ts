/**
 * zkWalletConnect - Unified Wallet Interface for zkSDK
 * The LangChain of Privacy - Making privacy as easy as WalletConnect
 */

import { BasePrivacyProvider, ProviderConfig, TransferParams, TransferResult, Balance } from '@zksdk/core';

// Import provider adapters
import { RailgunAdapter } from './adapters/railgun-adapter';
import { AztecAdapter } from './adapters/aztec-adapter';
import { PrivacyCashAdapter } from './adapters/privacycash-adapter';

export interface WalletConnectConfig {
  // Default provider to use when auto-detection fails
  defaultProvider?: string;
  // Provider-specific configurations
  providers?: Record<string, ProviderConfig>;
  // Whether to automatically detect the best provider
  autoDetect?: boolean;
}

export interface ConnectionResult {
  provider: string;
  address: string;
  connected: boolean;
  error?: string;
}

export class ZkWalletConnect {
  private adapters: Record<string, BasePrivacyProvider> = {};
  private connectedProvider: string | null = null;
  private config: WalletConnectConfig;

  constructor(config: WalletConnectConfig = {}) {
    this.config = {
      autoDetect: true,
      ...config
    };
    
    // Initialize adapters
    this.initializeAdapters();
  }

  /**
   * Initialize all available adapters
   */
  private initializeAdapters(): void {
    try {
      // Initialize Railgun adapter if configuration is provided
      if (this.config.providers?.railgun) {
        this.adapters.railgun = new RailgunAdapter(this.config.providers.railgun);
      }
      
      // Initialize Aztec adapter if configuration is provided
      if (this.config.providers?.aztec) {
        this.adapters.aztec = new AztecAdapter(this.config.providers.aztec);
      }
      
      // Initialize PrivacyCash adapter if configuration is provided
      if (this.config.providers?.privacycash) {
        this.adapters.solana = new PrivacyCashAdapter(this.config.providers.privacycash);
      }
    } catch (error) {
      console.error('Failed to initialize adapters:', error);
    }
  }

  /**
   * Connect to a privacy provider
   * @param provider Name of the provider to connect to ('railgun', 'aztec', 'auto')
   * @returns Connection result with address and status
   */
  async connect(provider: string = 'auto'): Promise<ConnectionResult> {
    try {
      // Handle auto detection
      if (provider === 'auto') {
        return await this.autoConnect();
      }
      
      // Connect to specific provider
      const adapter = this.adapters[provider];
      if (!adapter) {
        throw new Error(`Provider '${provider}' not available`);
      }
      
      // Initialize the provider if needed
      if ('initialize' in adapter) {
        await adapter.initialize(this.config.providers?.[provider] || {});
      }
      
      // For demo purposes, we'll return a mock address
      // In a real implementation, this would connect to the actual wallet
      const address = await this.getAddress(provider);
      
      this.connectedProvider = provider;
      
      return {
        provider,
        address,
        connected: true
      };
    } catch (error: any) {
      return {
        provider,
        address: '',
        connected: false,
        error: error.message || 'Unknown error'
      };
    }
  }

  /**
   * Automatically detect and connect to the best available provider
   */
  private async autoConnect(): Promise<ConnectionResult> {
    // Try providers in order of preference
    const providers = ['railgun', 'aztec', 'solana'];
    
    for (const providerName of providers) {
      if (this.adapters[providerName]) {
        try {
          const result = await this.connect(providerName);
          if (result.connected) {
            return result;
          }
        } catch (error: any) {
          // Continue to next provider
          console.warn(`Failed to connect to ${providerName}:`, error.message || error);
        }
      }
    }
    
    // If no providers work, use default if specified
    if (this.config.defaultProvider && this.adapters[this.config.defaultProvider]) {
      return await this.connect(this.config.defaultProvider);
    }
    
    // No providers available
    return {
      provider: 'none',
      address: '',
      connected: false,
      error: 'No available providers found'
    };
  }

  /**
   * Get address from connected provider
   */
  async getAddress(provider?: string): Promise<string> {
    const providerName = provider || this.connectedProvider;
    
    if (!providerName) {
      throw new Error('No provider connected');
    }
    
    const adapter = this.adapters[providerName];
    if (!adapter) {
      throw new Error(`Provider '${providerName}' not available`);
    }
    
    // In a real implementation, this would get the actual wallet address
    // For now, we'll return a mock address based on the provider
    const mockAddresses: Record<string, string> = {
      railgun: 'railgun:0x742d35Cc6634C434C434C434C434C434C434C434',
      aztec: 'aztec:0x8ba1f109551bD432803012645Hac136c22C43210',
      solana: 'solana:5D2zmCFX5bQ9WjTNTYsyhYVEcVccj4AEfCLLHp7QQg1y'
    };
    
    return mockAddresses[providerName] || `address:${providerName}`;
  }

  /**
   * Execute a private transfer using the connected provider
   */
  async transfer(params: TransferParams): Promise<TransferResult> {
    if (!this.connectedProvider) {
      throw new Error('No provider connected. Call connect() first.');
    }
    
    const adapter = this.adapters[this.connectedProvider];
    if (!adapter) {
      throw new Error(`Provider '${this.connectedProvider}' not available`);
    }
    
    return await adapter.transfer(params);
  }

  /**
   * Get balances from the connected provider
   */
  async getBalances(address?: string): Promise<Balance[]> {
    if (!this.connectedProvider) {
      throw new Error('No provider connected. Call connect() first.');
    }
    
    const adapter = this.adapters[this.connectedProvider];
    if (!adapter) {
      throw new Error(`Provider '${this.connectedProvider}' not available`);
    }
    
    const addr = address || await this.getAddress();
    return await adapter.getBalances(addr);
  }

  /**
   * Get transaction status from the connected provider
   */
  async getTransactionStatus(txHash: string): Promise<TransferResult> {
    if (!this.connectedProvider) {
      throw new Error('No provider connected. Call connect() first.');
    }
    
    const adapter = this.adapters[this.connectedProvider];
    if (!adapter) {
      throw new Error(`Provider '${this.connectedProvider}' not available`);
    }
    
    return await adapter.getTransactionStatus(txHash);
  }

  /**
   * Disconnect from the current provider
   */
  disconnect(): void {
    this.connectedProvider = null;
  }

  /**
   * Check if a provider is available
   */
  isProviderAvailable(provider: string): boolean {
    return !!this.adapters[provider];
  }

  /**
   * Get list of available providers
   */
  getAvailableProviders(): string[] {
    return Object.keys(this.adapters);
  }

  /**
   * Get the currently connected provider
   */
  getConnectedProvider(): string | null {
    return this.connectedProvider;
  }
}

// Export the auto provider as a special provider that uses ZkWalletConnect
export class AutoPrivacyProvider extends BasePrivacyProvider {
  name = 'Auto';
  private walletConnect: ZkWalletConnect;
  private connectedProvider: BasePrivacyProvider | null = null;

  constructor(config: ProviderConfig = {}) {
    super(config);
    this.walletConnect = new ZkWalletConnect({
      providers: config.providers as Record<string, ProviderConfig>,
      defaultProvider: config.defaultProvider as string
    });
  }

  /**
   * Initialize the auto provider
   */
  async initialize(config: ProviderConfig): Promise<void> {
    this.config = { ...this.config, ...config };
    
    // Connect to the best available provider
    const result = await this.walletConnect.connect('auto');
    if (!result.connected) {
      throw new Error(`Failed to connect to any provider: ${result.error}`);
    }
    
    // Get the connected provider instance
    const providerName = this.walletConnect.getConnectedProvider();
    if (providerName) {
      const adapters = (this.walletConnect as any).adapters;
      this.connectedProvider = adapters[providerName];
    }
  }

  /**
   * Execute a private transfer using the auto-selected provider
   */
  async transfer(params: TransferParams): Promise<TransferResult> {
    if (!this.connectedProvider) {
      throw new Error('No provider connected');
    }
    
    return await this.connectedProvider.transfer(params);
  }

  /**
   * Get private balances using the auto-selected provider
   */
  async getBalances(address: string): Promise<Balance[]> {
    if (!this.connectedProvider) {
      throw new Error('No provider connected');
    }
    
    return await this.connectedProvider.getBalances(address);
  }

  /**
   * Get transaction status using the auto-selected provider
   */
  async getTransactionStatus(txHash: string): Promise<TransferResult> {
    if (!this.connectedProvider) {
      throw new Error('No provider connected');
    }
    
    return await this.connectedProvider.getTransactionStatus(txHash);
  }
}

// Export main classes and types
export * from './adapters/railgun-adapter';
export * from './adapters/aztec-adapter';
