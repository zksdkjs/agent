console.log('Testing Railgun SDK initialization...');

const { RailgunEngine } = require('@railgun-community/engine');

try {
  console.log('Creating RailgunEngine with db path: ./railgun-db');
  const engine = new RailgunEngine('./railgun-db');
  console.log('RailgunEngine created successfully');
} catch (error) {
  console.error('Failed to create RailgunEngine:', error);
}

console.log('Done testing Railgun SDK initialization');
