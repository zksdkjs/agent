import { RailgunProvider } from '@zksdk/providers/railgun';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('🚂 Railgun Backend Example\n');

  try {
    // Initialize
    const provider = new RailgunProvider();
    await provider.initialize({
      walletMnemonic: process.env.RAILGUN_MNEMONIC!,
      engineDbPath: './railgun-db',
      rpcEndpoints: {
        ethereum: process.env.ETHEREUM_RPC_URL!,
        polygon: process.env.POLYGON_RPC_URL!,
        arbitrum: process.env.ARBITRUM_RPC_URL!
      }
    });

    // Check ready
    const ready = await provider.isReady();
    console.log(`Provider ready: ${ready}`);

    if (!ready) {
      throw new Error('Provider failed to initialize properly');
    }

    // Get balances
    const address = 'railgun:0x1234567890123456789012345678901234567890'; // Example address
    console.log(`Fetching balances for address: ${address}`);
    const balances = await provider.getBalances(address);
    console.log('Balances:', JSON.stringify(balances, null, 2));

    // Transfer example (commented out to prevent actual transfers)
    /*
    console.log('\nExecuting private transfer...');
    const result = await provider.transfer({
      chain: 'ethereum',
      token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
      amount: '1000000', // 1 USDC
      to: 'railgun:0xabcdef123456789012345678901234567890abcdef',
      privacy: 'shielded'
    });

    console.log('Transfer result:', JSON.stringify(result, null, 2));

    // Poll transaction status
    if (result.transactionHash) {
      console.log(`\nChecking transaction status for ${result.transactionHash}...`);
      const status = await provider.getTransactionStatus(result.transactionHash);
      console.log('Transaction status:', JSON.stringify(status, null, 2));
    }
    */

    console.log('\n✅ Railgun backend example completed successfully!');
  } catch (error) {
    console.error('❌ Error in Railgun backend example:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { main };
