console.log('Testing Railgun SDK initialization with simple path...');

const { RailgunEngine } = require('@railgun-community/engine');

try {
  console.log('Creating RailgunEngine with db path: railgun_db');
  const engine = new RailgunEngine('railgun_db');
  console.log('RailgunEngine created successfully');
} catch (error) {
  console.error('Failed to create RailgunEngine:', error);
}

console.log('Done testing Railgun SDK initialization');
