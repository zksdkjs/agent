console.log('Testing Railgun SDK initialization with valid path...');

const { RailgunEngine } = require('@railgun-community/engine');

try {
  console.log('Creating RailgunEngine with db path: /tmp/railgun-db');
  const engine = new RailgunEngine('/tmp/railgun-db');
  console.log('RailgunEngine created successfully');
} catch (error) {
  console.error('Failed to create RailgunEngine:', error);
}

console.log('Done testing Railgun SDK initialization');
