/**
 * Shared types for zkSDK providers
 */
export type ChainId = number;
export type { TransferParams, TransferResult, Balance, ProviderConfig } from '@zksdk/core';
export interface TokenInfo {
    address: string;
    symbol: string;
    decimals: number;
    name: string;
    isNative?: boolean;
}
export interface PrivateTransactionParams {
    fromAddress?: string;
    toAddress: string;
    amount: string;
    tokenAddress?: string;
    memo?: string;
    fee?: string;
}
export interface BalanceParams {
    address: string;
    tokenAddress?: string;
}
export interface PrivateBalance {
    address: string;
    balances: {
        token: TokenInfo;
        balance: string;
        usdValue?: number;
    }[];
    lastUpdated: number;
}
export interface HistoryParams {
    address: string;
    limit?: number;
    offset?: number;
}
export interface Transaction {
    hash: string;
    status: 'pending' | 'confirmed' | 'failed';
    timestamp: number;
    from?: string;
    to?: string;
    amount?: string;
    token?: TokenInfo;
    fee?: string;
}
export interface TransactionResult {
    hash: string;
    status: 'pending' | 'confirmed' | 'failed';
    provider: string;
    chainId: ChainId;
    timestamp: number;
    transactions?: {
        hash: string;
        status: 'pending' | 'confirmed' | 'failed';
        timestamp: number;
    }[];
    success?: boolean;
}
export interface PrivateAddressInfo {
    address: string;
    metadata?: {
        provider: string;
        timestamp: number;
        publicKey?: string;
        [key: string]: any;
    };
}
export interface ProviderInfo {
    name: string;
    version: string;
    description: string;
    website?: string;
    documentation?: string;
    supportedChains: {
        chainId: ChainId;
        name: string;
        networkType: 'mainnet' | 'testnet' | 'devnet';
        nativeCurrency: TokenInfo;
    }[];
    capabilities: {
        name: string;
        description: string;
        enabled: boolean;
    }[];
    limits: {
        [key: string]: any;
    };
}
export interface Operation {
    name: string;
    description: string;
    parameters: {
        [key: string]: string;
    };
    returnType: string;
}
export interface DeployContractParams {
    artifact: any;
    constructorArgs?: any[];
    salt?: string;
    walletAddress?: string;
    sponsoredFee?: boolean;
}
export interface ContractCallParams {
    contractAddress: string;
    artifact: any;
    method: string;
    args?: any[];
    walletAddress?: string;
    sponsoredFee?: boolean;
}
export interface ContractResult {
    address: string;
    transactionHash?: string;
    status: 'pending' | 'deployed' | 'failed';
    provider: string;
    chainId: ChainId;
    timestamp: number;
}
//# sourceMappingURL=index.d.ts.map