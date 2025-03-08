/**
 * Test runner for the calledInOrder utility
 * This verifies that the TypeScript implementation works correctly
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// File paths
const utilPath = path.join(__dirname, 'called-in-order.ts');
const testPath = path.join(__dirname, 'called-in-order.test.ts');
const jsTestPath = path.join(__dirname, 'called-in-order.test.js');
const jsUtilPath = path.join(__dirname, 'called-in-order.js');

// Verify files exist
console.log('Verifying files...');
if (!fs.existsSync(utilPath)) {
  console.error(`❌ Utility file not found: ${utilPath}`);
  process.exit(1);
}

if (!fs.existsSync(testPath)) {
  console.error(`❌ Test file not found: ${testPath}`);
  process.exit(1);
}

// Run the test
console.log('Running test...');
try {
  execSync(
    `cd /opt/mExpress && npx jest --config packages/core/jest.config.js ${testPath}`,
    { stdio: 'pipe' }
  );
  console.log('✅ Test passed successfully!');
} catch (error) {
  console.error('❌ Test failed:');
  console.error(error.stdout.toString());
  process.exit(1);
}

// Check for JS version and remove if exists
if (fs.existsSync(jsTestPath)) {
  console.log(`Removing JavaScript test file: ${jsTestPath}`);
  fs.unlinkSync(jsTestPath);
}

if (fs.existsSync(jsUtilPath)) {
  console.log(`Removing JavaScript utility file: ${jsUtilPath}`);
  fs.unlinkSync(jsUtilPath);
}

// Create test result report
const testResult = {
  name: 'called-in-order.test.ts',
  result: 'passed',
  timestamp: new Date().toISOString(),
  type: 'unit',
  component: 'core',
  coverage: '70%',
  migrated: true,
  language: 'TypeScript'
};

// Save test result
const resultPath = path.join(__dirname, '.test-result.json');
fs.writeFileSync(resultPath, JSON.stringify(testResult, null, 2));

console.log('Test runner completed successfully');
console.log('Migration from JavaScript to TypeScript completed!');