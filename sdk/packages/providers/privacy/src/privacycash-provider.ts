import { BasePrivacyProvider, TransferParams, TransferResult, Balance } from '@zksdk/core';
import {
  Commitment,
  Connection,
  Keypair,
  PublicKey
} from '@solana/web3.js';
import { PrivacyCash } from 'privacycash';
import {
  EncryptionService,
  getUtxos
} from 'privacycash/utils';
import bs58 from 'bs58';
import path from 'path';
import { LocalStorage } from 'node-localstorage';

import { PrivacyCashConfig, CompressedTokenAccount, PrivacyCashCluster } from './types';

const SOL_MINT_ADDRESS = 'So11111111111111111111111111111111111111112';
const DEFAULT_CLUSTER_ENDPOINTS: Record<PrivacyCashCluster, string> = {
  'mainnet-beta': 'https://api.mainnet-beta.solana.com',
  testnet: 'https://api.testnet.solana.com',
  devnet: 'https://api.devnet.solana.com'
};

const EXPLORER_BASE_URL = 'https://solscan.io/tx';

export class PrivacyCashProvider extends BasePrivacyProvider {
  name = 'privacycash';

  protected config: PrivacyCashConfig;
  private initialized = false;
  private connection?: Connection;
  private privacyCash?: PrivacyCash;
  private keypair?: Keypair;
  private encryptionService?: EncryptionService;
  private storage?: LocalStorage;
  private cluster: PrivacyCashCluster = 'devnet';
  private commitment: Commitment = 'confirmed';

  constructor(config: PrivacyCashConfig = {}) {
    super(config);
    this.config = { ...config };
    if (config.cluster) {
      this.cluster = config.cluster;
    }
    if (config.commitment) {
      this.commitment = config.commitment;
    }
  }

  async initialize(config: PrivacyCashConfig): Promise<void> {
    this.config = { ...this.config, ...config };
    this.cluster = this.config.cluster ?? this.cluster;
    this.commitment = this.config.commitment ?? this.commitment;

    const rpcEndpoint = this.resolveRpcEndpoint(this.config);
    this.cluster = this.config.cluster ?? this.guessClusterFromEndpoint(rpcEndpoint);

    const keypair = this.resolveKeypair(
      this.config.keypair ??
      this.config.owner ??
      this.config.secretKey ??
      this.config.privateKey ??
      this.config.walletPrivateKey
    );

    const cachePath = this.config.cachePath ?? path.join(process.cwd(), '.privacycash-cache');

    this.keypair = keypair;
    this.connection = new Connection(rpcEndpoint, this.commitment);
    this.storage = new LocalStorage(cachePath);
    this.encryptionService = new EncryptionService();
    this.encryptionService.deriveEncryptionKeyFromWallet(keypair);

    this.privacyCash = new PrivacyCash({
      RPC_url: rpcEndpoint,
      owner: keypair,
      enableDebug: this.config.enableDebug
    });

    this.initialized = true;
  }

  async transfer(params: TransferParams): Promise<TransferResult> {
    this.ensureInitialized();
    this.validateTransferParams(params);

    if (params.chain !== 'solana') {
      throw new Error('Privacy Cash provider only supports the Solana network');
    }
    if (params.privacy !== 'anonymous') {
      throw new Error('Privacy Cash requires anonymous privacy level');
    }

    const lamports = this.normalizeLamports(params.amount);
    if (lamports <= 0) {
      throw new Error('Transfer amount must be greater than zero');
    }

    try {
      const { tx } = await this.privacyCash!.deposit({ lamports });
      const explorerUrl = this.buildExplorerUrl(tx);

      return {
        transactionHash: tx,
        status: 'success',
        explorerUrl,
        fee: '0',
        timestamp: Date.now()
      };
    } catch (error: any) {
      throw new Error(`Failed to execute Privacy Cash deposit: ${error.message || error}`);
    }
  }

  async getBalances(_address: string): Promise<Balance[]> {
    this.ensureInitialized();

    try {
      const result = await this.privacyCash!.getPrivateBalance();
      const lamports = typeof result.lamports === 'number'
        ? result.lamports
        : Number(result.lamports ?? 0);

      return [
        {
          token: {
            address: SOL_MINT_ADDRESS,
            symbol: 'SOL',
            decimals: 9,
            name: 'Solana'
          },
          balance: lamports.toString()
        }
      ];
    } catch (error: any) {
      throw new Error(`Failed to fetch Privacy Cash balances: ${error.message || error}`);
    }
  }

  async getTransactionStatus(txHash: string): Promise<TransferResult> {
    this.ensureInitialized();

    try {
      const status = await this.connection!.getSignatureStatus(txHash);
      const value = status.value;

      let currentStatus: TransferResult['status'] = 'pending';
      if (value?.err) {
        currentStatus = 'failed';
      } else if (value?.confirmationStatus === 'confirmed' || value?.confirmationStatus === 'finalized') {
        currentStatus = 'success';
      }

      return {
        transactionHash: txHash,
        status: currentStatus,
        explorerUrl: this.buildExplorerUrl(txHash),
        timestamp: Date.now()
      };
    } catch (error: any) {
      throw new Error(`Failed to retrieve transaction status: ${error.message || error}`);
    }
  }

  async getCompressedTokenAccounts(address: string): Promise<CompressedTokenAccount[]> {
    this.ensureInitialized();

    try {
      const owner = new PublicKey(address);
      if (!owner.equals(this.keypair!.publicKey)) {
        throw new Error('Privacy Cash currently supports fetching accounts for the initialized keypair only');
      }

      const utxos = await getUtxos({
        publicKey: this.keypair!.publicKey,
        connection: this.connection!,
        encryptionService: this.encryptionService!,
        storage: this.storage!
      });

      const accounts: CompressedTokenAccount[] = await Promise.all(
        utxos.map(async (utxo) => ({
          publicKey: await utxo.getCommitment(),
          mint: utxo.mintAddress,
          amount: utxo.amount.toString(),
          owner: this.keypair!.publicKey.toBase58()
        }))
      );

      return accounts;
    } catch (error: any) {
      throw new Error(`Failed to fetch compressed token accounts: ${error.message || error}`);
    }
  }

  async createCompressedTokenAccount(): Promise<string> {
    throw new Error('Privacy Cash manages compressed accounts automatically; manual creation is not supported.');
  }

  async getMerkleTreeInfo(): Promise<never> {
    throw new Error('Merkle tree metadata is managed by Privacy Cash relayers and is not exposed via the SDK.');
  }

  async clearCache(): Promise<void> {
    this.ensureInitialized();
    await this.privacyCash!.clearCache();
  }

  private ensureInitialized(): void {
    if (!this.initialized || !this.privacyCash || !this.connection || !this.keypair || !this.encryptionService || !this.storage) {
      throw new Error('Privacy Cash provider not initialized. Call initialize() before using the provider.');
    }
  }

  private normalizeLamports(amount: string): number {
    const value = amount.trim();
    if (!value) {
      throw new Error('Amount is required');
    }
    if (value.includes('.')) {
      const [whole, fractional = ''] = value.split('.');
      const sanitizedFraction = `${fractional}000000000`.slice(0, 9);
      const normalized = `${whole}${sanitizedFraction}`.replace(/^0+/, '') || '0';
      return this.normalizeLamports(normalized);
    }

    if (value.startsWith('-')) {
      throw new Error('Amount must be positive');
    }

    const lamports = BigInt(value);
    if (lamports <= 0n) {
      throw new Error('Amount must be greater than zero');
    }
    if (lamports > BigInt(Number.MAX_SAFE_INTEGER)) {
      throw new Error('Amount exceeds the supported range for Privacy Cash transactions.');
    }

    return Number(lamports);
  }

  private resolveRpcEndpoint(config: PrivacyCashConfig): string {
    if (config.rpcEndpoint) {
      return config.rpcEndpoint;
    }
    if (config.rpcUrl) {
      return config.rpcUrl;
    }
    const cluster = config.cluster ?? this.cluster ?? 'devnet';
    return DEFAULT_CLUSTER_ENDPOINTS[cluster];
  }

  private guessClusterFromEndpoint(endpoint: string): PrivacyCashCluster {
    if (endpoint.includes('mainnet')) return 'mainnet-beta';
    if (endpoint.includes('testnet')) return 'testnet';
    return 'devnet';
  }

  private buildExplorerUrl(signature: string): string {
    if (this.cluster === 'mainnet-beta') {
      return `${EXPLORER_BASE_URL}/${signature}`;
    }
    const clusterParam = this.cluster === 'devnet' ? 'devnet' : 'testnet';
    return `${EXPLORER_BASE_URL}/${signature}?cluster=${clusterParam}`;
  }

  private resolveKeypair(secret?: PrivacyCashConfig['owner'] | PrivacyCashConfig['secretKey']): Keypair {
    if (secret instanceof Keypair) {
      return secret;
    }

    if (!secret) {
      throw new Error('Privacy Cash provider requires a Solana keypair. Provide `keypair`, `owner`, or `secretKey` in the configuration.');
    }

    if (secret instanceof Uint8Array) {
      return this.keypairFromBytes(secret);
    }

    if (Array.isArray(secret)) {
      return this.keypairFromBytes(Uint8Array.from(secret));
    }

    if (typeof secret === 'string') {
      const trimmed = secret.trim();
      if (!trimmed) {
        throw new Error('Provided secret key is empty.');
      }

      if (trimmed.startsWith('[')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (!Array.isArray(parsed)) {
            throw new Error('Secret key array must be a list of numbers.');
          }
          return this.keypairFromBytes(Uint8Array.from(parsed));
        } catch (error: any) {
          throw new Error(`Failed to parse secret key array: ${error.message || error}`);
        }
      }

      try {
        const bytes = bs58.decode(trimmed);
        return this.keypairFromBytes(bytes);
      } catch (error: any) {
        throw new Error(`Failed to decode base58 secret key: ${error.message || error}`);
      }
    }

    throw new Error('Unsupported secret key format for Privacy Cash provider.');
  }

  private keypairFromBytes(bytes: Uint8Array): Keypair {
    if (bytes.length === 64) {
      return Keypair.fromSecretKey(bytes);
    }
    if (bytes.length === 32) {
      return Keypair.fromSeed(bytes);
    }
    throw new Error('Secret key must be 32 or 64 bytes for Privacy Cash provider.');
  }
}
