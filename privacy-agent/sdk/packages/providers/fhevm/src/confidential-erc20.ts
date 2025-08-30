import { ethers } from 'ethers';
import { FHEVMProvider } from './provider';
import { EncryptionUtils } from './encryption';
import { EncryptedAmount, ConfidentialTransaction } from './types';

/**
 * Confidential ERC20 Token Wrapper
 * Provides interface for encrypted token operations
 */
export class ConfidentialERC20 {
  private provider: FHEVMProvider;
  private contract: ethers.Contract;
  private encryption: EncryptionUtils;
  private tokenAddress: string;
  
  // ABI for confidential ERC20 operations
  private static readonly ABI = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function totalSupply() view returns (bytes)',
    'function balanceOf(address account) view returns (bytes)',
    'function transfer(address to, bytes calldata encryptedAmount, bytes calldata inputProof) returns (bool)',
    'function transferFrom(address from, address to, bytes calldata encryptedAmount, bytes calldata inputProof) returns (bool)',
    'function approve(address spender, bytes calldata encryptedAmount, bytes calldata inputProof) returns (bool)',
    'function allowance(address owner, address spender) view returns (bytes)',
    'function mint(address to, bytes calldata encryptedAmount, bytes calldata inputProof) returns (bool)',
    'function burn(bytes calldata encryptedAmount, bytes calldata inputProof) returns (bool)',
    'event TransferEncrypted(address indexed from, address indexed to)',
    'event ApprovalEncrypted(address indexed owner, address indexed spender)'
  ];

  constructor(
    tokenAddress: string,
    provider: FHEVMProvider,
    publicKey: string
  ) {
    this.tokenAddress = tokenAddress;
    this.provider = provider;
    this.encryption = new EncryptionUtils(publicKey);
    
    const ethersProvider = provider.getProvider();
    const signer = provider.getSigner();
    
    this.contract = new ethers.Contract(
      tokenAddress,
      ConfidentialERC20.ABI,
      signer || ethersProvider
    );
  }

  /**
   * Get token metadata
   */
  async getMetadata(): Promise<{
    name: string;
    symbol: string;
    decimals: number;
  }> {
    const [name, symbol, decimals] = await Promise.all([
      this.contract.name(),
      this.contract.symbol(),
      this.contract.decimals()
    ]);

    return { name, symbol, decimals };
  }

  /**
   * Get encrypted balance for an account
   */
  async balanceOf(account: string): Promise<EncryptedAmount> {
    const encryptedBalance = await this.contract.balanceOf(account);
    
    return {
      value: encryptedBalance,
      proof: '0x' as any,
      contractAddress: this.tokenAddress,
      timestamp: Date.now()
    };
  }

  /**
   * Transfer tokens with encrypted amount
   */
  async transfer(
    to: string,
    amount: bigint
  ): Promise<ethers.TransactionResponse> {
    // Encrypt the amount
    const encryptedAmount = await this.encryption.encryptUint256(amount);
    
    // Execute transfer
    return await this.contract.transfer(
      to,
      encryptedAmount.value,
      encryptedAmount.proof
    );
  }

  /**
   * Transfer tokens from another account (requires approval)
   */
  async transferFrom(
    from: string,
    to: string,
    amount: bigint
  ): Promise<ethers.TransactionResponse> {
    const encryptedAmount = await this.encryption.encryptUint256(amount);
    
    return await this.contract.transferFrom(
      from,
      to,
      encryptedAmount.value,
      encryptedAmount.proof
    );
  }

  /**
   * Approve spending with encrypted amount
   */
  async approve(
    spender: string,
    amount: bigint
  ): Promise<ethers.TransactionResponse> {
    const encryptedAmount = await this.encryption.encryptUint256(amount);
    
    return await this.contract.approve(
      spender,
      encryptedAmount.value,
      encryptedAmount.proof
    );
  }

  /**
   * Get encrypted allowance
   */
  async allowance(
    owner: string,
    spender: string
  ): Promise<EncryptedAmount> {
    const encryptedAllowance = await this.contract.allowance(owner, spender);
    
    return {
      value: encryptedAllowance,
      proof: '0x' as any,
      contractAddress: this.tokenAddress,
      timestamp: Date.now()
    };
  }

  /**
   * Mint new tokens (if caller has minting rights)
   */
  async mint(
    to: string,
    amount: bigint
  ): Promise<ethers.TransactionResponse> {
    const encryptedAmount = await this.encryption.encryptUint256(amount);
    
    return await this.contract.mint(
      to,
      encryptedAmount.value,
      encryptedAmount.proof
    );
  }

  /**
   * Burn tokens
   */
  async burn(amount: bigint): Promise<ethers.TransactionResponse> {
    const encryptedAmount = await this.encryption.encryptUint256(amount);
    
    return await this.contract.burn(
      encryptedAmount.value,
      encryptedAmount.proof
    );
  }

  /**
   * Get encrypted total supply
   */
  async totalSupply(): Promise<EncryptedAmount> {
    const encryptedSupply = await this.contract.totalSupply();
    
    return {
      value: encryptedSupply,
      proof: '0x' as any,
      contractAddress: this.tokenAddress,
      timestamp: Date.now()
    };
  }

  /**
   * Request decryption of balance (requires permission)
   */
  async requestBalanceDecryption(
    account: string
  ): Promise<bigint> {
    const encryptedBalance = await this.balanceOf(account);
    return await this.provider.requestDecryption(encryptedBalance);
  }

  /**
   * Batch transfer to multiple recipients
   */
  async batchTransfer(
    recipients: string[],
    amounts: bigint[]
  ): Promise<ethers.TransactionResponse[]> {
    if (recipients.length !== amounts.length) {
      throw new Error('Recipients and amounts arrays must have same length');
    }

    const transactions: Promise<ethers.TransactionResponse>[] = [];
    
    for (let i = 0; i < recipients.length; i++) {
      transactions.push(this.transfer(recipients[i], amounts[i]));
    }

    return Promise.all(transactions);
  }

  /**
   * Create a confidential transaction object
   */
  async createConfidentialTransaction(
    to: string,
    amount: bigint
  ): Promise<ConfidentialTransaction> {
    const encryptedAmount = await this.encryption.encryptUint256(amount);
    
    return this.provider.createConfidentialTransaction(
      to,
      encryptedAmount,
      this.tokenAddress
    );
  }

  /**
   * Watch for encrypted transfer events
   */
  onTransfer(
    callback: (from: string, to: string, event: ethers.EventLog) => void
  ): void {
    this.contract.on('TransferEncrypted', (from, to, event) => {
      callback(from, to, event as ethers.EventLog);
    });
  }

  /**
   * Watch for encrypted approval events
   */
  onApproval(
    callback: (owner: string, spender: string, event: ethers.EventLog) => void
  ): void {
    this.contract.on('ApprovalEncrypted', (owner, spender, event) => {
      callback(owner, spender, event as ethers.EventLog);
    });
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners(): void {
    this.contract.removeAllListeners();
  }

  /**
   * Get contract instance
   */
  getContract(): ethers.Contract {
    return this.contract;
  }

  /**
   * Get token address
   */
  getAddress(): string {
    return this.tokenAddress;
  }
}