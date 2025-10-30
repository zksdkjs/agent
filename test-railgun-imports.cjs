/**
 * Simple test to understand Railgun SDK import issues
 */

// Try to import Railgun components to see what happens
try {
  console.log('Attempting to import RailgunEngine...');
  const { RailgunEngine } = require('@railgun-community/engine');
  console.log('Successfully imported RailgunEngine:', typeof RailgunEngine);
} catch (error) {
  console.error('Failed to import RailgunEngine:', error);
}

try {
  console.log('Attempting to import generateProofTransactions...');
  const { generateProofTransactions } = require('@railgun-community/wallet');
  console.log('Successfully imported generateProofTransactions:', typeof generateProofTransactions);
} catch (error) {
  console.error('Failed to import generateProofTransactions:', error);
}

try {
  console.log('Attempting to import shared-models...');
  const sharedModels = require('@railgun-community/shared-models');
  console.log('Successfully imported shared-models:', typeof sharedModels);
  console.log('Keys in shared-models:', Object.keys(sharedModels));
} catch (error) {
  console.error('Failed to import shared-models:', error);
}
