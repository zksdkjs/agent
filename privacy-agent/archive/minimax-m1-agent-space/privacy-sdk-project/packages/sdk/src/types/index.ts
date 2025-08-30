// Core type definitions for Privacy SDK

export type ChainId = number | string;
export type NetworkType = 'mainnet' | 'testnet' | 'devnet';
export type Address = string;
export type PrivateAddress = string;
export type PublicAddress = string;
export type Amount = string; // Use string to avoid precision loss
export type TransactionHash = string;
export type ProofData = string | Uint8Array;

export type TransactionStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled';
export type ProviderStatus = 'uninitialized' | 'initializing' | 'ready' | 'error' | 'destroyed';

export type TransactionType = 
  | 'transfer'
  | 'swap'
  | 'deposit'
  | 'withdraw'
  | 'vote'
  | 'signal'
  | 'custom';

export type ProviderEvent = 
  | 'initialized'
  | 'status_changed'
  | 'transaction_pending'
  | 'transaction_confirmed'
  | 'transaction_failed'
  | 'balance_updated'
  | 'error'
  | 'plugin_registered'
  | 'plugin_unregistered'
  | 'provider_created'
  | 'provider_destroyed';

// Token Information
export interface TokenInfo {
  address: Address;
  symbol: string;
  decimals: number;
  name?: string;
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

// Balance Information
export interface TokenBalance {
  token: TokenInfo;
  balance: Amount;
  unconfirmedBalance?: Amount;
  valueUSD?: Amount;
}

export interface PrivateBalance {
  address: PrivateAddress;
  balances: TokenBalance[];
  totalValueUSD?: Amount;
  lastUpdated: number;
}

export interface PrivateAddressInfo {
  address: PrivateAddress;
  publicKey?: string;
  viewingKey?: string;
  metadata?: Record<string, any>;
}

// Configuration Types
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
  enabled: boolean;
}

export interface KeyStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
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

// Provider Information
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

// Validation Types
export interface ValidationError {
  field: string;
  code: string;
  message: string;
  details?: any;
}

export interface ValidationWarning {
  field: string;
  code: string;
  message: string;
  suggestion?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

// Fee Estimation
export interface FeeFactor {
  type: 'network' | 'privacy' | 'complexity';
  impact: 'low' | 'medium' | 'high';
  description: string;
}

export interface FeeEstimate {
  estimatedFee: Amount;
  gasLimit?: number;
  gasPrice?: Amount;
  currency: string;
  confidence: 'low' | 'medium' | 'high';
  factors?: FeeFactor[];
}

// Event System
export interface EventData {
  provider: string;
  timestamp: number;
  [key: string]: any;
}

export type EventCallback = (data: EventData) => void;

// Recipe System Types
export interface RecipeParams {
  provider?: string;
  [key: string]: any;
}

export interface RecipeResult {
  success: boolean;
  transactions: TransactionResult[];
  totalFees: Amount;
  executionTime: number;
  metadata?: Record<string, any>;
}

// Provider Operation Types
export interface Operation {
  name: string;
  description: string;
  parameters: Record<string, any>;
  returnType: string;
}
