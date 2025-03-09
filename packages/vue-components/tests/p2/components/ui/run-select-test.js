// Simple runner for Select.test.ts based on our standalone implementation
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the paths to the test files
const testSelectJs = path.join(__dirname, 'test-select.js');

console.log('Running Select component test with standalone implementation');

try {
  // Check if the files exists
  if (!fs.existsSync(testSelectJs)) {
    console.error('Test implementation file not found!');
    process.exit(1);
  }

  // Run the JavaScript implementation
  console.log('Running test...');
  execSync(`node ${testSelectJs}`, { stdio: 'inherit' });
  
  console.log('All tests passed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Error running tests:', error.message);
  process.exit(1);
}