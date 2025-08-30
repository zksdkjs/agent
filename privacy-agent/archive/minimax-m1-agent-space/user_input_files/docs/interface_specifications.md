# Privacy SDK Interface Specifications

## Core Types and Interfaces

### Base Types
```typescript
// Chain and Network Types
export type ChainId = number | string
export type NetworkType = 'mainnet' | 'testnet' | 'devnet'

// Address Types
export type Address = string
export type PrivateAddress = string // Stealth/private address
export type PublicAddress = string  // Standard blockchain address

// Amount and Token Types
export type Amount = string | bigint // Use string to avoid precision loss
export interface TokenInfo {
  address: Address
  symbol: string
  decimals: number
  name?: string
}

// Transaction Types
export type TransactionHash = string
export type ProofData = string | Uint8Array

// Status Types
export type TransactionStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled'
export type ProviderStatus = 'uninitialized' | 'initializing' | 'ready' | 'error'
```

### Core Interfaces

#### PrivacyProvider Interface
```typescript
export interface PrivacyProvider {
  // Provider Info
  readonly name: string
  readonly version: string
  readonly supportedChains: ChainId[]
  
  // Lifecycle
  initialize(config: ProviderConfig): Promise<void>
  destroy(): Promise<void>
  isReady(): boolean
  getStatus(): ProviderStatus
  
  // Core Operations
  sendPrivateTransaction(params: PrivateTransactionParams): Promise<TransactionResult>
  getPrivateBalance(params: BalanceParams): Promise<PrivateBalance>
  getTransactionHistory(params: HistoryParams): Promise<Transaction[]>
  
  // Key Management
  generatePrivateAddress(): Promise<PrivateAddressInfo>
  importPrivateKey(key: string): Promise<void>
  exportPrivateKey(): Promise<string>
  
  // Events
  on(event: ProviderEvent, callback: (...args: any[]) => void): void
  off(event: ProviderEvent, callback: (...args: any[]) => void): void
  
  // Provider-specific features
  getProviderInfo(): ProviderInfo
  getSupportedOperations(): Operation[]
}
```

#### Transaction Parameters
```typescript
export interface PrivateTransactionParams {
  type: TransactionType
  from?: PrivateAddress
  to: PrivateAddress | PublicAddress
  amount: Amount
  token?: TokenInfo | Address
  fee?: Amount
  memo?: string
  proof?: ProofData
  metadata?: Record<string, any>
}

export type TransactionType = 
  | 'transfer'
  | 'swap'
  | 'deposit'
  | 'withdraw'
  | 'vote'
  | 'signal'
  | 'custom'
```

#### Transaction Result
```typescript
export interface TransactionResult {
  hash: TransactionHash
  status: TransactionStatus
  provider: string
  chainId: ChainId
  timestamp: number
  confirmations?: number
  blockNumber?: number
  fee?: Amount
  proof?: ProofData
  metadata?: Record<string, any>
}

export interface Transaction extends TransactionResult {
  from: PrivateAddress
  to: PrivateAddress | PublicAddress
  amount: Amount
  token: TokenInfo
  type: TransactionType
  memo?: string
}
```

#### Balance and Address Info
```typescript
export interface PrivateBalance {
  address: PrivateAddress
  balances: TokenBalance[]
  totalValueUSD?: Amount
  lastUpdated: number
}

export interface TokenBalance {
  token: TokenInfo
  balance: Amount
  unconfirmedBalance?: Amount
  valueUSD?: Amount
}

export interface PrivateAddressInfo {
  address: PrivateAddress
  publicKey?: string
  viewingKey?: string
  metadata?: Record<string, any>
}
```

#### Configuration Interfaces
```typescript
export interface ProviderConfig {
  type: string
  chainId: ChainId
  networkType: NetworkType
  rpcUrl?: string
  apiKey?: string
  metadata?: Record<string, any>
}

export interface SDKConfig {
  defaultProvider: string
  providers: Record<string, ProviderConfig>
  keyManagement?: KeyManagementConfig
  logging?: LoggingConfig
}

export interface KeyManagementConfig {
  storage: 'memory' | 'local' | 'secure' | 'custom'
  encryption?: boolean
  customStore?: KeyStore
}
```

## Recipe System Interfaces

### Recipe Base Interface
```typescript
export interface Recipe {
  name: string
  description: string
  supportedProviders: string[]
  requiredParams: string[]
  optionalParams: string[]
  
  execute(params: RecipeParams): Promise<RecipeResult>
  validate(params: RecipeParams): ValidationResult
  estimateFees(params: RecipeParams): Promise<FeeEstimate>
}

export interface RecipeParams {
  provider?: string
  [key: string]: any
}

export interface RecipeResult {
  success: boolean
  transactions: TransactionResult[]
  totalFees: Amount
  executionTime: number
  metadata?: Record<string, any>
}
```

### Specific Recipe Interfaces
```typescript
// Private Transfer Recipe
export interface PrivateTransferParams extends RecipeParams {
  to: PrivateAddress | PublicAddress
  amount: Amount
  token?: TokenInfo | Address
  memo?: string
}

// Private Swap Recipe
export interface PrivateSwapParams extends RecipeParams {
  fromToken: TokenInfo | Address
  toToken: TokenInfo | Address
  amount: Amount
  minAmountOut?: Amount
  slippage?: number
  deadline?: number
}

// Anonymous Vote Recipe
export interface AnonymousVoteParams extends RecipeParams {
  groupId: string
  signal: string | number
  proof?: ProofData
}
```

## Plugin System Interfaces

### Plugin Interface
```typescript
export interface ProviderPlugin {
  name: string
  version: string
  description: string
  supportedChains: ChainId[]
  
  createProvider(config: ProviderConfig): Promise<PrivacyProvider>
  validateConfig(config: ProviderConfig): ValidationResult
  getDefaultConfig(chainId: ChainId): Partial<ProviderConfig>
}

export interface PluginRegistry {
  register(plugin: ProviderPlugin): void
  unregister(name: string): void
  getPlugin(name: string): ProviderPlugin | undefined
  listPlugins(): ProviderPlugin[]
}
```

## Event System

### Event Types
```typescript
export type ProviderEvent = 
  | 'initialized'
  | 'status_changed'
  | 'transaction_pending'
  | 'transaction_confirmed'
  | 'transaction_failed'
  | 'balance_updated'
  | 'error'

export interface EventData {
  provider: string
  timestamp: number
  [key: string]: any
}

export interface EventEmitter {
  on(event: ProviderEvent, callback: (data: EventData) => void): void
  off(event: ProviderEvent, callback: (data: EventData) => void): void
  emit(event: ProviderEvent, data: EventData): void
}
```

## Error Handling

### Error Types
```typescript
export abstract class PrivacySDKError extends Error {
  abstract code: string
  abstract provider?: string
  abstract details?: Record<string, any>
}

export class ConfigurationError extends PrivacySDKError {
  code = 'CONFIGURATION_ERROR'
  constructor(message: string, public provider?: string) {
    super(message)
  }
}

export class TransactionError extends PrivacySDKError {
  code = 'TRANSACTION_ERROR'
  constructor(
    message: string,
    public provider?: string,
    public transactionHash?: string,
    public details?: Record<string, any>
  ) {
    super(message)
  }
}

export class ProofGenerationError extends PrivacySDKError {
  code = 'PROOF_GENERATION_ERROR'
  constructor(message: string, public provider?: string, public details?: Record<string, any>) {
    super(message)
  }
}

export class NetworkError extends PrivacySDKError {
  code = 'NETWORK_ERROR'
  constructor(message: string, public provider?: string, public statusCode?: number) {
    super(message)
  }
}
```

### Validation Interface
```typescript
export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  field: string
  code: string
  message: string
  details?: any
}

export interface ValidationWarning {
  field: string
  code: string
  message: string
  suggestion?: string
}
```

## Utility Interfaces

### Fee Estimation
```typescript
export interface FeeEstimate {
  estimatedFee: Amount
  gasLimit?: number
  gasPrice?: Amount
  currency: string
  confidence: 'low' | 'medium' | 'high'
  factors?: FeeFactor[]
}

export interface FeeFactor {
  type: 'network' | 'privacy' | 'complexity'
  impact: 'low' | 'medium' | 'high'
  description: string
}
```

### Query Parameters
```typescript
export interface BalanceParams {
  address?: PrivateAddress
  tokens?: (TokenInfo | Address)[]
  includeUnconfirmed?: boolean
}

export interface HistoryParams {
  address?: PrivateAddress
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
  type?: TransactionType[]
  status?: TransactionStatus[]
}
```

### Provider Info
```typescript
export interface ProviderInfo {
  name: string
  version: string
  description: string
  website?: string
  documentation?: string
  supportedChains: ChainInfo[]
  capabilities: ProviderCapability[]
  limits: ProviderLimits
}

export interface ChainInfo {
  chainId: ChainId
  name: string
  networkType: NetworkType
  nativeCurrency: TokenInfo
}

export interface ProviderCapability {
  name: string
  description: string
  enabled: boolean
  requirements?: string[]
}

export interface ProviderLimits {
  maxTransactionAmount?: Amount
  dailyLimit?: Amount
  monthlyLimit?: Amount
  minTransactionAmount?: Amount
}
```