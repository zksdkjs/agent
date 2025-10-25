// examples/backend/light-protocol-example.ts
import { LightProtocolPrivacyProvider } from '../../sdk/packages/providers/light-protocol/src/light-provider';
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  console.log('Privacy Cash Privacy Provider Example');
  
  // Initialize the Privacy Cash provider
  const provider = new LightProtocolPrivacyProvider();
  
  try {
    // Initialize with configuration
    await provider.initialize({
      rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      privateKey: process.env.SOLANA_PRIVATE_KEY ? 
        Uint8Array.from(JSON.parse(process.env.SOLANA_PRIVATE_KEY)) : 
        Keypair.generate().secretKey
    });
    
    // Get private balances
    console.log('Fetching private balances...');
    const balances = await provider.getBalances('');
    console.log('Private Balances:', balances);
    
    // Example transfer (commented out to prevent accidental transactions)
    /*
    console.log('Executing private transfer...');
    const transferResult = await provider.transfer({
      chain: 'solana',
      token: 'SOL',
      amount: '0.01', // 0.01 SOL
      to: 'RecipientPublicKeyHere',
      privacy: 'anonymous'
    });
    console.log('Transfer Result:', transferResult);
    */
    
    // Example transaction status check (replace with actual transaction hash)
    /*
    const txStatus = await provider.getTransactionStatus('transactionHashHere');
    console.log('Transaction Status:', txStatus);
    */
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);
