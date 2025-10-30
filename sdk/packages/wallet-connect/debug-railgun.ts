import { RailgunAdapter } from './src/adapters/railgun-adapter';

async function testRailgunAdapter() {
  console.log('Creating Railgun adapter...');
  const adapter = new RailgunAdapter({ 
    apiKey: 'test-key',
    rpcEndpoints: {
      ethereum: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY'
    },
    engineDbPath: './railgun-db'
  });
  
  console.log('Attempting to initialize Railgun adapter...');
  try {
    await adapter.initialize({ 
      apiKey: 'test-key',
      rpcEndpoints: {
        ethereum: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY'
      },
      engineDbPath: './railgun-db'
    });
    console.log('Railgun adapter initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Railgun adapter:', error);
  }
}

testRailgunAdapter().catch(console.error);
