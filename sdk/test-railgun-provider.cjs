/**
 * Test to reproduce the Railgun SDK error
 */

async function testRailgunImport() {
  try {
    console.log('Attempting to import Railgun components...');
    
    // Import the Railgun provider
    const { RailgunProvider } = require('./packages/providers/railgun/dist/index.js');
    
    console.log('Successfully imported RailgunProvider');
    
    // Try to create an instance
    const provider = new RailgunProvider();
    console.log('Successfully created RailgunProvider instance');
    
  } catch (error) {
    console.error('Error during Railgun import/test:', error);
  }
}

testRailgunImport();
