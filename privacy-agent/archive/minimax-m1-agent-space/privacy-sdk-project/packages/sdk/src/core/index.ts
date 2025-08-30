// Core exports for Privacy SDK

export * from './provider';
export * from './plugin-registry';
export * from './events';
export * from './errors';

// Re-export types for convenience (without ValidationError to avoid conflict)
export {
  ChainId,
  NetworkType,
  Address,
  PrivateAddress,
  PublicAddress,
  Amount,
  TransactionHash,
  ProofData,
  TransactionStatus,
  ProviderStatus,
  TransactionType,
  ProviderEvent,
  TokenInfo,
  PrivateTransactionParams,
  TransactionResult,
  Transaction,
  TokenBalance,
  PrivateBalance,
  PrivateAddressInfo,
  ProviderConfig,
  SDKConfig,
  KeyManagementConfig,
  LoggingConfig,
  KeyStore,
  BalanceParams,
  HistoryParams,
  ChainInfo,
  ProviderCapability,
  ProviderLimits,
  ProviderInfo,
  ValidationResult,
  ValidationWarning,
  FeeFactor,
  FeeEstimate,
  EventData,
  EventCallback,
  RecipeParams,
  RecipeResult,
  Operation
} from '../types';
