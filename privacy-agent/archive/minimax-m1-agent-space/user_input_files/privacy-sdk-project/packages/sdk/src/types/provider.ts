/**
 * Provider-related types and interfaces
 */

import { ChainId, NetworkType, Address, PrivateAddress, PublicAddress, Amount, TokenInfo, TransactionHash, ProofData, TransactionStatus, ProviderStatus, TransactionType, ProviderEvent, EventData } from './base';

// Core Interfaces
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
  on(event: ProviderEvent, callback: (...args: any[]) => void): void;
  off(event: ProviderEvent, callback: (...args: any[]) => void): void;
  
  // Provider-specific features
  getProviderInfo(): ProviderInfo;
  getSupportedOperations(): Operation[];
}

// Transaction Parameters
export interface PrivateTransactionParams {
  type: TransactionType;
  from?: PrivateAddress;
  to: PrivateAddress | PublicAddress;
  amount: Amount;
  token?: TokenInfo | Address;
  fee?: Amount;
  memo?: string;
  proof?: ProofData;
  metadata?: Record<string, any>;
}

// Transaction Result
export interface TransactionResult {
  hash: TransactionHash;
  status: TransactionStatus;
  provider: string;
  chainId: ChainId;
  timestamp: number;
  confirmations?: number;
  blockNumber?: number;
  fee?: Amount;
  proof?: ProofData;
  metadata?: Record<string, any>;
}

export interface Transaction extends TransactionResult {
  from: PrivateAddress;
  to: PrivateAddress | PublicAddress;
  amount: Amount;
  token: TokenInfo;
  type: TransactionType;
  memo?: string;
}

// Balance and Address Info
export interface PrivateBalance {
  address: PrivateAddress;
  balances: TokenBalance[];
  totalValueUSD?: Amount;
  lastUpdated: number;
}

export interface TokenBalance {
  token: TokenInfo;
  balance: Amount;
  unconfirmedBalance?: Amount;
  valueUSD?: Amount;
}

export interface PrivateAddressInfo {
  address: PrivateAddress;
  publicKey?: string;
  viewingKey?: string;
  metadata?: Record<string, any>;
}

// Configuration Interfaces
export interface ProviderConfig {
  type: string;
  chainId: ChainId;
  networkType: NetworkType;
  rpcUrl?: string;
  apiKey?: string;
  metadata?: Record<string, any>;
}

export interface SDKConfig {
  defaultProvider: string;
  providers: Record<string, ProviderConfig>;
  keyManagement?: KeyManagementConfig;
  logging?: LoggingConfig;
}

export interface KeyManagementConfig {
  storage: 'memory' | 'local' | 'secure' | 'custom';
  encryption?: boolean;
  customStore?: KeyStore;
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  transport?: 'console' | 'file' | 'custom';
}

export interface KeyStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

// Query Parameters
export interface BalanceParams {
  address?: PrivateAddress;
  tokens?: (TokenInfo | Address)[];
  includeUnconfirmed?: boolean;
}

export interface HistoryParams {
  address?: PrivateAddress;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
  type?: TransactionType[];
  status?: TransactionStatus[];
}

// Provider Info
export interface ProviderInfo {
  name: string;
  version: string;
  description: string;
  website?: string;
  documentation?: string;
  supportedChains: ChainInfo[];
  capabilities: ProviderCapability[];
  limits: ProviderLimits;
}

export interface ChainInfo {
  chainId: ChainId;
  name: string;
  networkType: NetworkType;
  nativeCurrency: TokenInfo;
}

export interface ProviderCapability {
  name: string;
  description: string;
  enabled: boolean;
  requirements?: string[];
}

export interface ProviderLimits {
  maxTransactionAmount?: Amount;
  dailyLimit?: Amount;
  monthlyLimit?: Amount;
  minTransactionAmount?: Amount;
}

export interface Operation {
  name: string;
  description: string;
  parameters: OperationParameter[];
}

export interface OperationParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

// Event System
export interface EventEmitter {
  on(event: ProviderEvent, callback: (data: EventData) => void): void;
  off(event: ProviderEvent, callback: (data: EventData) => void): void;
  emit(event: ProviderEvent, data: EventData): void;
}