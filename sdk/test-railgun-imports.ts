console.log('Testing Railgun imports...');

try {
  console.log('Importing RailgunEngine...');
  const { RailgunEngine } = require('@railgun-community/engine');
  console.log('RailgunEngine imported successfully');
} catch (error) {
  console.error('Failed to import RailgunEngine:', error);
}

try {
  console.log('Importing RailgunWallet...');
  const { RailgunWallet } = require('@railgun-community/engine');
  console.log('RailgunWallet imported successfully');
} catch (error) {
  console.error('Failed to import RailgunWallet:', error);
}

try {
  console.log('Importing wallet functions...');
  const { generateProofTransactions, populateProvedTransfer } = require('@railgun-community/wallet');
  console.log('Wallet functions imported successfully');
} catch (error) {
  console.error('Failed to import wallet functions:', error);
}

console.log('Done testing imports');
