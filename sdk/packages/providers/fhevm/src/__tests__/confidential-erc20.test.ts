/**
 * Tests for ConfidentialERC20
 */

import { ConfidentialERC20 } from '../confidential-erc20';
import { FHEVMProvider } from '../provider';
import { EncryptionUtils } from '../encryption';

// Mock the FHEVMProvider
jest.mock('../provider', () => {
  return {
    FHEVMProvider: jest.fn().mockImplementation(() => {
      return {
        getProvider: jest.fn().mockReturnValue({
          getNetwork: jest.fn().mockResolvedValue({ chainId: 8009 }),
        }),
        getSigner: jest.fn().mockReturnValue(null),
        requestDecryption: jest.fn().mockResolvedValue(BigInt(1000)),
        createConfidentialTransaction: jest.fn().mockResolvedValue({
          from: '0xmockaddress',
          to: '0xrecipient',
          encryptedAmount: {
            value: '0xmockencrypted',
            proof: {
              proof: '0xmockproof',
              publicInputs: [],
              proofType: 'mock'
            },
            contractAddress: '0xmocktoken',
            timestamp: Date.now()
          },
          tokenAddress: '0xmocktoken',
          nonce: 0,
          chainId: 8009,
          timestamp: Date.now()
        })
      };
    })
  };
});

// Mock the EncryptionUtils
jest.mock('../encryption', () => {
  return {
    EncryptionUtils: jest.fn().mockImplementation(() => {
      return {
        encryptUint256: jest.fn().mockResolvedValue({
          value: '0xmockencrypted',
          proof: {
            proof: '0xmockproof',
            publicInputs: [],
            proofType: 'mock'
          },
          contractAddress: '0xmocktoken',
          timestamp: Date.now()
        })
      };
    })
  };
});

describe('ConfidentialERC20', () => {
  let confidentialERC20: ConfidentialERC20;
  let mockProvider: jest.Mocked<FHEVMProvider>;
  const mockTokenAddress = '0x1234567890123456789012345678901234567890';
  const mockPublicKey = '0xmockpublickey';

  beforeEach(() => {
    mockProvider = new FHEVMProvider({} as any) as jest.Mocked<FHEVMProvider>;
    confidentialERC20 = new ConfidentialERC20(mockTokenAddress, mockProvider, mockPublicKey);
  });

  test('should create ConfidentialERC20 instance', () => {
    expect(confidentialERC20).toBeInstanceOf(ConfidentialERC20);
    expect(confidentialERC20.getAddress()).toBe(mockTokenAddress);
  });

  test('should get contract instance', () => {
    const contract = confidentialERC20.getContract();
    expect(contract).toBeDefined();
  });

  test('should get metadata', async () => {
    // Mock contract methods
    const mockContract = confidentialERC20.getContract() as any;
    mockContract.name = jest.fn().mockResolvedValue('MockToken');
    mockContract.symbol = jest.fn().mockResolvedValue('MTK');
    mockContract.decimals = jest.fn().mockResolvedValue(18);

    const metadata = await confidentialERC20.getMetadata();
    
    expect(metadata).toEqual({
      name: 'MockToken',
      symbol: 'MTK',
      decimals: 18
    });
  });

  test('should get encrypted balance', async () => {
    // Mock contract method
    const mockContract = confidentialERC20.getContract() as any;
    mockContract.balanceOf = jest.fn().mockResolvedValue('0xmockbalance');

    const account = '0xaccount';
    const balance = await confidentialERC20.balanceOf(account);
    
    expect(balance).toBeDefined();
    expect(balance.value).toBe('0xmockbalance');
    expect(balance.contractAddress).toBe(mockTokenAddress);
  });

  test('should transfer tokens', async () => {
    // Mock contract method
    const mockContract = confidentialERC20.getContract() as any;
    mockContract.transfer = jest.fn().mockResolvedValue({ hash: '0xtxhash' });

    const to = '0xrecipient';
    const amount = 1000n;
    const result = await confidentialERC20.transfer(to, amount);
    
    expect(result).toBeDefined();
    expect(result.hash).toBe('0xtxhash');
  });

  test('should approve spending', async () => {
    // Mock contract method
    const mockContract = confidentialERC20.getContract() as any;
    mockContract.approve = jest.fn().mockResolvedValue({ hash: '0xtxhash' });

    const spender = '0xspender';
    const amount = 1000n;
    const result = await confidentialERC20.approve(spender, amount);
    
    expect(result).toBeDefined();
    expect(result.hash).toBe('0xtxhash');
  });

  test('should get encrypted allowance', async () => {
    // Mock contract method
    const mockContract = confidentialERC20.getContract() as any;
    mockContract.allowance = jest.fn().mockResolvedValue('0xmockallowance');

    const owner = '0xowner';
    const spender = '0xspender';
    const allowance = await confidentialERC20.allowance(owner, spender);
    
    expect(allowance).toBeDefined();
    expect(allowance.value).toBe('0xmockallowance');
    expect(allowance.contractAddress).toBe(mockTokenAddress);
  });

  test('should get encrypted total supply', async () => {
    // Mock contract method
    const mockContract = confidentialERC20.getContract() as any;
    mockContract.totalSupply = jest.fn().mockResolvedValue('0xmocksupply');

    const supply = await confidentialERC20.totalSupply();
    
    expect(supply).toBeDefined();
    expect(supply.value).toBe('0xmocksupply');
    expect(supply.contractAddress).toBe(mockTokenAddress);
  });

  test('should request balance decryption', async () => {
    // Mock balanceOf method
    const mockContract = confidentialERC20.getContract() as any;
    mockContract.balanceOf = jest.fn().mockResolvedValue('0xmockbalance');

    const account = '0xaccount';
    const decryptedBalance = await confidentialERC20.requestBalanceDecryption(account);
    
    expect(decryptedBalance).toBe(1000n);
  });

  test('should batch transfer tokens', async () => {
    // Mock contract method
    const mockContract = confidentialERC20.getContract() as any;
    mockContract.transfer = jest.fn()
      .mockResolvedValueOnce({ hash: '0xtxhash1' })
      .mockResolvedValueOnce({ hash: '0xtxhash2' });

    const recipients = ['0xrecipient1', '0xrecipient2'];
    const amounts = [1000n, 2000n];
    const results = await confidentialERC20.batchTransfer(recipients, amounts);
    
    expect(results).toHaveLength(2);
    expect(results[0].hash).toBe('0xtxhash1');
    expect(results[1].hash).toBe('0xtxhash2');
  });

  test('should reject batch transfer with mismatched arrays', async () => {
    const recipients = ['0xrecipient1', '0xrecipient2'];
    const amounts = [1000n]; // Different length
    
    await expect(confidentialERC20.batchTransfer(recipients, amounts))
      .rejects
      .toThrow('Recipients and amounts arrays must have same length');
  });

  test('should create confidential transaction', async () => {
    const to = '0xrecipient';
    const amount = 1000n;
    const transaction = await confidentialERC20.createConfidentialTransaction(to, amount);
    
    expect(transaction).toBeDefined();
    expect(transaction.to).toBe('0xrecipient');
    expect(transaction.tokenAddress).toBe('0xmocktoken'); // This is what the mock returns
  });

  test('should remove all listeners', () => {
    const mockContract = confidentialERC20.getContract() as any;
    mockContract.removeAllListeners = jest.fn();

    confidentialERC20.removeAllListeners();
    
    expect(mockContract.removeAllListeners).toHaveBeenCalled();
  });
});
