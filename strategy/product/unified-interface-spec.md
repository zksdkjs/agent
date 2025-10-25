# Unified Interface Specification for zkSDK

## Overview

This document defines the TypeScript interfaces and API specifications for zkSDK, the "LangChain of Privacy" protocols. The unified interface provides a consistent, protocol-agnostic API for interacting with multiple privacy protocols across different blockchains.

## Core SDK Interface

```typescript
interface ZkSDK {
  // Core properties
  readonly version: string;
  readonly supportedProtocols: string[];
  readonly supportedChains: number[];
  
  // Connection management
  connect(wallet: WalletProvider): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  
  // Protocol access
  readonly protocol: ProtocolInterface;
  readonly defi: DeFiInterface;
  readonly bitcoin: BitcoinInterface;
  readonly utils: UtilityInterface;
  
  // Configuration
  configure(options: SDKConfig): void;
  getConfig(): SDKConfig;
}

interface SDKConfig {
  // Network configuration
  chainId: number;
  rpcUrl?: string;
  explorerUrl?: string;
  
  // Privacy settings
  defaultProtocol?: string;
  privacyLevel?: 'basic' | 'enhanced' | 'maximum';
  gasOptimization?: boolean;
  
  // Advanced options
  proofCacheSize?: number;
  transactionTimeout?: number;
  enableLogging?: boolean;
}
```

## Protocol Interface

```typescript
interface ProtocolInterface {
  // Account management
  createAccount(protocol: string, options?: AccountOptions): Promise<PrivateAccount>;
  getAccount(address: string): Promise<PrivateAccount | null>;
  listAccounts(): Promise<PrivateAccount[]>;
  
  // Balance operations
  getBalance(address: string, token?: string): Promise<BigNumber>;
  getPrivateBalance(account: string, token?: string): Promise<BigNumber>;
  
  // Basic transactions
  transfer(params: TransferParams): Promise<TransactionResult>;
  deposit(params: DepositParams): Promise<TransactionResult>;
  withdraw(params: WithdrawParams): Promise<TransactionResult>;
  
  // Advanced operations
  shield(params: ShieldParams): Promise<TransactionResult>;
  unshield(params: UnshieldParams): Promise<TransactionResult>;
  
  // Protocol-specific extensions
  railgun?: RailgunExtension;
  aztec?: AztecExtension;
  penumbra?: PenumbraExtension;
  fhevm?: FhevmExtension;
}

interface AccountOptions {
  // Account creation parameters
  mnemonic?: string;
  privateKey?: string;
  derivationPath?: string;
  
  // Privacy settings
  anonymitySet?: number;
  noteCount?: number;
  
  // Protocol-specific options
  [key: string]: any;
}

interface TransferParams {
  // Recipient information
  to: string;
  amount: BigNumber;
  token?: string;
  
  // Privacy options
  anonymitySet?: number;
  memo?: string;
  
  // Transaction options
  gasLimit?: BigNumber;
  gasPrice?: BigNumber;
  protocol?: string;
}

interface DepositParams {
  amount: BigNumber;
  token?: string;
  from: string;
  
  // Privacy options
  anonymitySet?: number;
  
  // Transaction options
  gasLimit?: BigNumber;
  gasPrice?: BigNumber;
  protocol?: string;
}

interface WithdrawParams {
  amount: BigNumber;
  token?: string;
  to: string;
  
  // Privacy options
  anonymitySet?: number;
  
  // Transaction options
  gasLimit?: BigNumber;
  gasPrice?: BigNumber;
  protocol?: string;
}

interface ShieldParams {
  amount: BigNumber;
  token?: string;
  from: string;
  
  // Transaction options
  gasLimit?: BigNumber;
  gasPrice?: BigNumber;
  protocol?: string;
}

interface UnshieldParams {
  amount: BigNumber;
  token?: string;
  to: string;
  
  // Transaction options
  gasLimit?: BigNumber;
  gasPrice?: BigNumber;
  protocol?: string;
}
```

## DeFi Interface

```typescript
interface DeFiInterface {
  // Swap operations
  swap(params: SwapParams): Promise<TransactionResult>;
  batchSwap(params: BatchSwapParams): Promise<TransactionResult>;
  
  // Liquidity operations
  addLiquidity(params: LiquidityParams): Promise<TransactionResult>;
  removeLiquidity(params: LiquidityParams): Promise<TransactionResult>;
  
  // Lending operations
  supply(params: SupplyParams): Promise<TransactionResult>;
  borrow(params: BorrowParams): Promise<TransactionResult>;
  repay(params: RepayParams): Promise<TransactionResult>;
  withdrawLending(params: WithdrawParams): Promise<TransactionResult>;
  
  // Staking operations
  stake(params: StakeParams): Promise<TransactionResult>;
  unstake(params: UnstakeParams): Promise<TransactionResult>;
  claimRewards(params: ClaimParams): Promise<TransactionResult>;
  
  // Yield operations
  depositYield(params: YieldDepositParams): Promise<TransactionResult>;
  withdrawYield(params: YieldWithdrawParams): Promise<TransactionResult>;
}

interface SwapParams {
  // Token information
  tokenIn: string;
  tokenOut: string;
  amountIn: BigNumber;
  minAmountOut?: BigNumber;
  
  // Privacy options
  anonymitySet?: number;
  slippage?: number;
  
  // Routing options
  protocols?: string[];
  gasLimit?: BigNumber;
  gasPrice?: BigNumber;
}

interface BatchSwapParams {
  swaps: SwapParams[];
  gasLimit?: BigNumber;
  gasPrice?: BigNumber;
}

interface LiquidityParams {
  // Pool information
  poolId: string;
  tokens: string[];
  amounts: BigNumber[];
  
  // Privacy options
  anonymitySet?: number;
  
  // Transaction options
  gasLimit?: BigNumber;
  gasPrice?: BigNumber;
}

interface SupplyParams {
  // Asset information
  asset: string;
  amount: BigNumber;
  protocol: string;
  
  // Privacy options
  anonymitySet?: number;
  
  // Transaction options
  gasLimit?: BigNumber;
  gasPrice?: BigNumber;
}

interface BorrowParams {
  asset: string;
  amount: BigNumber;
  protocol: string;
  
  // Transaction options
  gasLimit?: BigNumber;
  gasPrice?: BigNumber;
}

interface RepayParams {
  asset: string;
  amount: BigNumber;
  protocol: string;
  
  // Transaction options
  gasLimit?: BigNumber;
  gasPrice?: BigNumber;
}

interface StakeParams {
  // Staking information
  token: string;
  amount: BigNumber;
  protocol: string;
  
  // Privacy options
  anonymitySet?: number;
  
  // Transaction options
  gasLimit?: BigNumber;
  gasPrice?: BigNumber;
}

interface UnstakeParams {
  token: string;
  amount: BigNumber;
  protocol: string;
  
  // Transaction options
  gasLimit?: BigNumber;
  gasPrice?: BigNumber;
}

interface ClaimParams {
  protocol: string;
  gasLimit?: BigNumber;
  gasPrice?: BigNumber;
}

interface YieldDepositParams {
  vault: string;
  token: string;
  amount: BigNumber;
  
  // Privacy options
  anonymitySet?: number;
  
  // Transaction options
  gasLimit?: BigNumber;
  gasPrice?: BigNumber;
}

interface YieldWithdrawParams {
  vault: string;
  token: string;
  amount: BigNumber;
  
  // Transaction options
  gasLimit?: BigNumber;
  gasPrice?: BigNumber;
}
```

## Bitcoin Interface

```typescript
interface BitcoinInterface {
  // Address management
  createSilentAddress(): Promise<SilentAddress>;
  getSilentAddress(paymentId: string): Promise<SilentAddress>;
  
  // Transaction operations
  createTransaction(params: BitcoinTxParams): Promise<BitcoinTransaction>;
  signTransaction(tx: BitcoinTransaction): Promise<SignedBitcoinTransaction>;
  broadcastTransaction(tx: SignedBitcoinTransaction): Promise<string>;
  
  // Atomic swaps
  createAtomicSwap(params: AtomicSwapParams): Promise<AtomicSwap>;
  participateAtomicSwap(params: AtomicSwapParticipationParams): Promise<AtomicSwap>;
  
  // DLC operations
  createDLC(params: DLCParams): Promise<DLCContract>;
  signDLC(contract: DLCContract): Promise<SignedDLC>;
}

interface SilentAddress {
  address: string;
  paymentId: string;
  publicKey: string;
}

interface BitcoinTxParams {
  // Transaction details
  inputs: BitcoinInput[];
  outputs: BitcoinOutput[];
  
  // Privacy options
  enableCoinJoin?: boolean;
  enablePayJoin?: boolean;
  
  // Fee management
  feeRate?: number;
  fee?: BigNumber;
}

interface BitcoinInput {
  txid: string;
  vout: number;
  amount: BigNumber;
  scriptPubKey: string;
  witnessUtxo?: WitnessUtxo;
}

interface BitcoinOutput {
  address: string;
  amount: BigNumber;
  scriptPubKey?: string;
}

interface AtomicSwapParams {
  // Swap details
  secretHash: string;
  recipient: string;
  refundAddress: string;
  amount: BigNumber;
  lockTime: number;
  
  // Network options
  network?: 'mainnet' | 'testnet';
}

interface AtomicSwapParticipationParams {
  swapAddress: string;
  secretHash: string;
  participantAddress: string;
  amount: BigNumber;
  lockTime: number;
}

interface DLCParams {
  // Contract details
  oracleInfo: OracleInfo;
  contractInfo: ContractInfo;
  offerCollateral: BigNumber;
  acceptCollateral: BigNumber;
  
  // Timing
  maturityTime: number;
  timeout: number;
}

interface OracleInfo {
  oraclePublicKey: string;
  oracleEvent: OracleEvent;
}

interface ContractInfo {
  outcomes: Outcome[];
  feeRate: number;
}
```

## Utility Interface

```typescript
interface UtilityInterface {
  // Gas estimation
  estimateGas(operation: string, params: any): Promise<GasEstimate>;
  
  // Fee management
  getGasPrice(chainId?: number): Promise<BigNumber>;
  getFeeHistory(blocks: number, chainId?: number): Promise<FeeHistory>;
  
  // Privacy metrics
  getAnonymitySet(protocol: string, token?: string): Promise<number>;
  getPrivacyScore(protocol: string): Promise<number>;
  
  // Transaction monitoring
  waitForTransaction(hash: string, confirmations?: number): Promise<TransactionReceipt>;
  getTransactionStatus(hash: string): Promise<TransactionStatus>;
  
  // Proof management
  cacheProof(operation: string, proof: Proof): Promise<void>;
  getCachedProof(operation: string): Promise<Proof | null>;
  clearProofCache(): Promise<void>;
  
  // Protocol information
  getProtocolInfo(protocol: string): Promise<ProtocolInfo>;
  listSupportedProtocols(): Promise<ProtocolInfo[]>;
}

interface GasEstimate {
  gasLimit: BigNumber;
  gasPrice: BigNumber;
  totalCost: BigNumber;
  currency: string;
}

interface FeeHistory {
  baseFeePerGas: BigNumber[];
  gasUsedRatio: number[];
  reward?: BigNumber[][];
}

interface TransactionStatus {
  hash: string;
  status: 'pending' | 'success' | 'failed' | 'unknown';
  confirmations: number;
  blockNumber?: number;
  timestamp?: number;
}

interface ProtocolInfo {
  name: string;
  version: string;
  chainId: number;
  privacyLevel: 'basic' | 'enhanced' | 'maximum';
  gasEfficiency: number;
  tvl?: BigNumber;
  supportedTokens: string[];
}
```

## Protocol-Specific Extensions

### Railgun Extension

```typescript
interface RailgunExtension {
  // Adapt module integration
  adaptContract(contractAddress: string, adaptation: Adaptation): Promise<void>;
  getAdaptedContracts(): Promise<AdaptedContract[]>;
  
  // Cross-contract calls
  executeAdaptedCall(params: AdaptedCallParams): Promise<TransactionResult>;
  
  // Nullifier management
  getNullifiers(account: string): Promise<Nullifier[]>;
  checkNullifier(nullifier: string): Promise<boolean>;
}

interface Adaptation {
  contractAddress: string;
  functions: AdaptedFunction[];
  permissions: Permission[];
}

interface AdaptedFunction {
  name: string;
  signature: string;
  privacyRequirements: PrivacyRequirement[];
}

interface PrivacyRequirement {
  type: 'input' | 'output' | 'both';
  indices: number[];
}
```

### Aztec Extension

```typescript
interface AztecExtension {
  // Noir contract deployment
  deployNoir(contract: NoirContract): Promise<DeployedContract>;
  getNoirContract(address: string): Promise<NoirContract>;
  
  // Aztec Connect integration
  executeConnectBridge(params: ConnectBridgeParams): Promise<TransactionResult>;
  
  // Account management
  createAztecAccount(options?: AztecAccountOptions): Promise<AztecAccount>;
  getAztecAccount(address: string): Promise<AztecAccount>;
}

interface NoirContract {
  bytecode: string;
  abi: any[];
  constructorArgs?: any[];
}

interface ConnectBridgeParams {
  bridgeAddress: string;
  inputAssets: Asset[];
  outputAssets: Asset[];
  auxData: string;
}

interface AztecAccountOptions {
  spendingKey?: string;
  viewingKey?: string;
  address?: string;
}
```

### FHEVM Extension

```typescript
interface FhevmExtension {
  // Encrypted computation
  encryptedCompute(params: EncryptedComputeParams): Promise<EncryptedResult>;
  
  // Key management
  generateFheKey(): Promise<FheKeyPair>;
  importFheKey(key: FhePublicKey): Promise<void>;
  
  // Encrypted data operations
  encrypt(value: BigNumber, publicKey: string): Promise<EncryptedValue>;
  decrypt(encryptedValue: EncryptedValue): Promise<BigNumber>;
}

interface EncryptedComputeParams {
  functionName: string;
  encryptedInputs: EncryptedValue[];
  contractAddress: string;
}

interface FheKeyPair {
  publicKey: string;
  privateKey: string;
}

interface EncryptedValue {
  ciphertext: string;
  securityLevel: number;
}
```

## Core Data Structures

```typescript
interface PrivateAccount {
  // Account identification
  address: string;
  protocol: string;
  chainId: number;
  
  // Balance information
  getBalance(token?: string): Promise<BigNumber>;
  getPrivateBalance(token?: string): Promise<BigNumber>;
  
  // Note management
  getNotes(token?: string): Promise<PrivateNote[]>;
  createNote(amount: BigNumber, recipient: string): Promise<PrivateNote>;
  
  // Transaction operations
  transfer(params: TransferParams): Promise<TransactionResult>;
  deposit(params: DepositParams): Promise<TransactionResult>;
  withdraw(params: WithdrawParams): Promise<TransactionResult>;
}

interface PrivateNote {
  // Note identification
  id: string;
  commitment: string;
  nullifier: string;
  
  // Value information
  amount: BigNumber;
  token: string;
  
  // Privacy metadata
  createdAt: number;
  spentAt?: number;
  anonymitySet: number;
}

interface TransactionResult {
  // Transaction identification
  hash: string;
  status: 'pending' | 'success' | 'failed';
  
  // Gas information
  gasUsed?: BigNumber;
  gasPrice?: BigNumber;
  gasCost?: BigNumber;
  
  // Proof information
  proof?: Proof;
  proofTime?: number;
  
  // Metadata
  timestamp: number;
  protocol: string;
}

interface Proof {
  // Proof data
  proof: string;
  publicInputs: any[];
  
  // Metadata
  proofSystem: string;
  generationTime: number;
  verificationKey?: string;
}

interface WalletProvider {
  // Connection methods
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  
  // Signing methods
  signTransaction(transaction: any): Promise<string>;
  signMessage(message: string): Promise<string>;
  
  // Account information
  getAccounts(): Promise<string[]>;
  getChainId(): Promise<number>;
}
```

## Event System

```typescript
interface ZkSDKEvents {
  // Connection events
  onConnect: (provider: WalletProvider) => void;
  onDisconnect: () => void;
  
  // Transaction events
  onTransactionPending: (transaction: TransactionResult) => void;
  onTransactionSuccess: (transaction: TransactionResult) => void;
  onTransactionFailed: (transaction: TransactionResult, error: Error) => void;
  
  // Proof events
  onProofGenerating: (operation: string) => void;
  onProofGenerated: (operation: string, proof: Proof) => void;
  onProofFailed: (operation: string, error: Error) => void;
  
  // Protocol events
  onProtocolAdded: (protocol: string) => void;
  onProtocolRemoved: (protocol: string) => void;
}

// Event subscription interface
interface EventEmitter {
  on(event: string, listener: Function): void;
  off(event: string, listener: Function): void;
  emit(event: string, ...args: any[]): void;
}
```

## Error Handling

```typescript
class ZkSDKError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public details?: any
  ) {
    super(message);
    this.name = 'ZkSDKError';
  }
}

enum ErrorCode {
  // Connection errors
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  UNSUPPORTED_CHAIN = 'UNSUPPORTED_CHAIN',
  
  // Protocol errors
  PROTOCOL_NOT_SUPPORTED = 'PROTOCOL_NOT_SUPPORTED',
  PROTOCOL_ERROR = 'PROTOCOL_ERROR',
  
  // Transaction errors
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  TRANSACTION_REJECTED = 'TRANSACTION_REJECTED',
  TRANSACTION_TIMEOUT = 'TRANSACTION_TIMEOUT',
  
  // Proof errors
  PROOF_GENERATION_FAILED = 'PROOF_GENERATION_FAILED',
  PROOF_VERIFICATION_FAILED = 'PROOF_VERIFICATION_FAILED',
  
  // Validation errors
  INVALID_PARAMETERS = 'INVALID_PARAMETERS',
  UNSUPPORTED_OPERATION = 'UNSUPPORTED_OPERATION',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR'
}

interface ErrorDetails {
  // Context information
  operation?: string;
  protocol?: string;
  chainId?: number;
  
  // Technical details
  originalError?: Error;
  stackTrace?: string;
  
  // User guidance
  recoverySuggestion?: string;
  documentationUrl?: string;
}
```

## Usage Examples

```typescript
// Basic usage
const sdk = new ZkSDK({
  chainId: 1,
  defaultProtocol: 'railgun'
});

await sdk.connect(walletProvider);

// Simple transfer
const result = await sdk.protocol.transfer({
  to: '0x...',
  amount: ethers.utils.parseEther('1.0'),
  token: 'ETH'
});

// Private swap
const swapResult = await sdk.defi.swap({
  tokenIn: 'ETH',
  tokenOut: 'DAI',
  amountIn: ethers.utils.parseEther('1.0'),
  anonymitySet: 100
});

// Bitcoin silent payment
const silentAddress = await sdk.bitcoin.createSilentAddress();

// Protocol-specific operation
if (sdk.protocol.railgun) {
  await sdk.protocol.railgun.adaptContract(
    '0x...', 
    adaptationConfig
  );
}
```

## Conclusion

This unified interface specification provides a comprehensive and consistent API for interacting with multiple privacy protocols through zkSDK. The design emphasizes protocol agnosticism while still allowing access to protocol-specific features when needed. The TypeScript interfaces ensure type safety and excellent developer experience with autocomplete and documentation in modern IDEs.
