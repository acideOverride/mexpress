#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define paths
const testDir = __dirname;
const testFile = path.join(testDir, 'Button.test.ts');
const configPath = path.join(testDir, 'temp-button-tsconfig.json');
const outDir = path.join('/tmp', 'vue-component-tests');

// Ensure output directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Print current directory and paths for debugging
console.log('Current directory:', process.cwd());
console.log('Test directory:', testDir);
console.log('Test file:', testFile);
console.log('Config path:', configPath);
console.log('Output directory:', outDir);

// Compile TypeScript file
console.log('\nCompiling TypeScript test...');
try {
  const tscCommand = `npx tsc -p ${configPath}`;
  console.log('Running command:', tscCommand);
  execSync(tscCommand, { cwd: testDir, stdio: 'inherit' });
  console.log('Compilation successful!');
} catch (error) {
  console.error('Compilation failed:', error.message);
  process.exit(1);
}

// Run the compiled JavaScript file
console.log('\nRunning compiled test...');
try {
  const compiledFile = path.join(outDir, 'Button.test.js');
  console.log('Running script:', compiledFile);
  execSync(`node ${compiledFile}`, { stdio: 'inherit' });
  console.log('All tests passed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Test execution failed:', error.message);
  process.exit(1);
}