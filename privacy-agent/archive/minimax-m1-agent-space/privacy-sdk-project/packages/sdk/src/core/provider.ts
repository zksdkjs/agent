// Base Privacy Provider interface and implementation

import {
  ProviderStatus,
  ProviderEvent,
  PrivateTransactionParams,
  TransactionResult,
  BalanceParams,
  PrivateBalance,
  HistoryParams,
  Transaction,
  PrivateAddressInfo,
  ProviderInfo,
  Operation,
  ProviderConfig,
  ChainId,
  EventCallback,
  EventData
} from '../types';

import { ProviderError, InitializationError, wrapError } from './errors';
import { EventEmitter } from './events';

/**
 * Base interface that all privacy providers must implement
 */
export interface PrivacyProvider {
  // Provider Info
  readonly name: string;
  readonly version: string;
  readonly supportedChains: ChainId[];
  
  // Lifecycle
  initialize(config: ProviderConfig): Promise<void>;
  destroy(): Promise<void>;
  isReady(): boolean;
  getStatus(): ProviderStatus;
  
  // Core Operations
  sendPrivateTransaction(params: PrivateTransactionParams): Promise<TransactionResult>;
  getPrivateBalance(params: BalanceParams): Promise<PrivateBalance>;
  getTransactionHistory(params: HistoryParams): Promise<Transaction[]>;
  
  // Key Management
  generatePrivateAddress(): Promise<PrivateAddressInfo>;
  importPrivateKey(key: string): Promise<void>;
  exportPrivateKey(): Promise<string>;
  
  // Events
  on(event: ProviderEvent, callback: EventCallback): void;
  off(event: ProviderEvent, callback: EventCallback): void;
  
  // Provider-specific features
  getProviderInfo(): ProviderInfo;
  getSupportedOperations(): Operation[];
}

/**
 * Abstract base class that provides common functionality for privacy providers
 */
export abstract class BasePrivacyProvider extends EventEmitter implements PrivacyProvider {
  protected _status: ProviderStatus = 'uninitialized';
  protected _config?: ProviderConfig;
  
  abstract readonly name: string;
  abstract readonly version: string;
  abstract readonly supportedChains: ChainId[];

  constructor() {
    super();
  }

  /**
   * Initialize the provider with configuration
   */
  async initialize(config: ProviderConfig): Promise<void> {
    try {
      this._status = 'initializing';
      this.emit('status_changed', { 
        provider: this.name, 
        status: this._status,
        timestamp: Date.now()
      });

      // Validate configuration
      this.validateConfig(config);
      this._config = config;

      // Perform provider-specific initialization
      await this.performInitialization(config);

      this._status = 'ready';
      this.emit('initialized', { 
        provider: this.name, 
        timestamp: Date.now() 
      });
      this.emit('status_changed', { 
        provider: this.name, 
        status: this._status,
        timestamp: Date.now()
      });
    } catch (error) {
      this._status = 'error';
      this.emit('error', { 
        provider: this.name, 
        error: wrapError(error, 'Provider initialization failed', this.name),
        timestamp: Date.now()
      });
      throw wrapError(error, 'Provider initialization failed', this.name);
    }
  }

  /**
   * Destroy the provider and clean up resources
   */
  async destroy(): Promise<void> {
    try {
      await this.performDestruction();
      this._status = 'destroyed';
      this.removeAllListeners();
      this.emit('status_changed', { 
        provider: this.name, 
        status: this._status,
        timestamp: Date.now()
      });
    } catch (error) {
      throw wrapError(error, 'Provider destruction failed', this.name);
    }
  }

  /**
   * Check if provider is ready for operations
   */
  isReady(): boolean {
    return this._status === 'ready';
  }

  /**
   * Get current provider status
   */
  getStatus(): ProviderStatus {
    return this._status;
  }

  /**
   * Get provider configuration
   */
  protected getConfig(): ProviderConfig {
    if (!this._config) {
      throw new InitializationError('Provider not initialized', this.name);
    }
    return this._config;
  }

  /**
   * Ensure provider is ready before operations
   */
  protected ensureReady(): void {
    if (!this.isReady()) {
      throw new ProviderError(
        `Provider ${this.name} is not ready. Current status: ${this._status}`,
        this.name
      );
    }
  }

  // Abstract methods that subclasses must implement
  protected abstract validateConfig(config: ProviderConfig): void;
  protected abstract performInitialization(config: ProviderConfig): Promise<void>;
  protected abstract performDestruction(): Promise<void>;
  
  abstract sendPrivateTransaction(params: PrivateTransactionParams): Promise<TransactionResult>;
  abstract getPrivateBalance(params: BalanceParams): Promise<PrivateBalance>;
  abstract getTransactionHistory(params: HistoryParams): Promise<Transaction[]>;
  abstract generatePrivateAddress(): Promise<PrivateAddressInfo>;
  abstract importPrivateKey(key: string): Promise<void>;
  abstract exportPrivateKey(): Promise<string>;
  abstract getProviderInfo(): ProviderInfo;
  abstract getSupportedOperations(): Operation[];
}

/**
 * Factory interface for creating provider instances
 */
export interface ProviderFactory {
  create(config: ProviderConfig): Promise<PrivacyProvider>;
  validate(config: ProviderConfig): boolean;
  getDefaultConfig(): Partial<ProviderConfig>;
}

/**
 * Helper function to create a mock provider for testing
 */
export function createMockProvider(name: string = 'mock'): PrivacyProvider {
  return new MockProvider(name);
}

/**
 * Mock provider implementation for testing
 */
class MockProvider extends BasePrivacyProvider {
  readonly name: string;
  readonly version = '1.0.0';
  readonly supportedChains = [1, 137, 42161]; // Ethereum, Polygon, Arbitrum

  constructor(name: string) {
    super();
    this.name = name;
  }

  protected validateConfig(config: ProviderConfig): void {
    if (!config.chainId) {
      throw new Error('Chain ID is required');
    }
  }

  protected async performInitialization(config: ProviderConfig): Promise<void> {
    // Mock initialization - just wait a bit
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  protected async performDestruction(): Promise<void> {
    // Mock destruction - nothing to clean up
  }

  async sendPrivateTransaction(params: PrivateTransactionParams): Promise<TransactionResult> {
    this.ensureReady();
    
    // Mock transaction result
    return {
      hash: '0x' + Math.random().toString(16).substr(2, 64),
      status: 'pending',
      provider: this.name,
      chainId: this.getConfig().chainId,
      timestamp: Date.now()
    };
  }

  async getPrivateBalance(params: BalanceParams): Promise<PrivateBalance> {
    this.ensureReady();
    
    return {
      address: params.address || '0x' + Math.random().toString(16).substr(2, 40),
      balances: [],
      lastUpdated: Date.now()
    };
  }

  async getTransactionHistory(params: HistoryParams): Promise<Transaction[]> {
    this.ensureReady();
    return [];
  }

  async generatePrivateAddress(): Promise<PrivateAddressInfo> {
    this.ensureReady();
    
    return {
      address: '0x' + Math.random().toString(16).substr(2, 40)
    };
  }

  async importPrivateKey(key: string): Promise<void> {
    this.ensureReady();
    // Mock import
  }

  async exportPrivateKey(): Promise<string> {
    this.ensureReady();
    return '0x' + Math.random().toString(16).substr(2, 64);
  }

  getProviderInfo(): ProviderInfo {
    return {
      name: this.name,
      version: this.version,
      description: 'Mock provider for testing',
      supportedChains: this.supportedChains.map(chainId => ({
        chainId,
        name: `Chain ${chainId}`,
        networkType: 'testnet' as const,
        nativeCurrency: {
          address: '0x0000000000000000000000000000000000000000',
          symbol: 'ETH',
          decimals: 18,
          name: 'Ethereum'
        }
      })),
      capabilities: [
        {
          name: 'private_transfer',
          description: 'Private token transfers',
          enabled: true
        }
      ],
      limits: {}
    };
  }

  getSupportedOperations(): Operation[] {
    return [
      {
        name: 'sendPrivateTransaction',
        description: 'Send a private transaction',
        parameters: { params: 'PrivateTransactionParams' },
        returnType: 'TransactionResult'
      }
    ];
  }
}
