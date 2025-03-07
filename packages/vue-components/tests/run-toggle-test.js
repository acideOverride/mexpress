#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Define paths
const testPath = path.join(__dirname, 'p2/components/ui/Toggle.test.ts');
const outDir = path.join('/tmp', 'vue-component-tests');

// Compile TypeScript file
console.log('Compiling TypeScript test...');
try {
  execSync(`npx tsc ${testPath} --outDir ${outDir}`);
  console.log('Compilation successful!');
} catch (error) {
  console.error('Compilation failed:', error.message);
  process.exit(1);
}

// Run the compiled JavaScript file
console.log('Running compiled test...');
try {
  execSync(`node ${path.join(outDir, 'Toggle.test.js')}`);
  console.log('All tests passed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Test execution failed:', error.message);
  process.exit(1);
}