#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

// Priority configurations
const PRIORITIES = {
  p0: {
    config: 'jest.config.p0.js',
    name: 'Critical Tests',
    failFast: true,
    maxWorkers: 1,
    timeout: 30000,
    outputDir: 'src/__tests__/results/p0/unit'
  },
  p1: {
    config: 'jest.config.p1.js',
    name: 'High Priority Tests',
    failFast: false,
    maxWorkers: 2,
    timeout: 60000,
    outputDir: 'src/__tests__/results/p1/unit'
  },
  p2: {
    config: 'jest.config.p2.js',
    name: 'Standard Tests',
    failFast: false,
    maxWorkers: 4,
    timeout: 120000,
    outputDir: 'src/__tests__/results/p2/unit'
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
const priority = args[0]?.toLowerCase();
const testPath = args[1];

// Validate priority
if (!priority || !PRIORITIES[priority]) {
  console.error('Usage: node test-runner.js <priority> [test-path]');
  console.error('Priorities: p0, p1, p2');
  process.exit(1);
}

// Get test name from path
const getTestName = (testPath) => {
  if (!testPath) return 'all';
  const parts = testPath.split('/');
  const fileName = parts[parts.length - 1];
  return fileName.replace('.test.ts', '').replace(/\./g, '_');
};

// Build Jest command
const config = PRIORITIES[priority];
const testName = getTestName(testPath);

// Use consistent naming between test-runner and minimal-reporter
const outputFile = path.join(config.outputDir, `${priority}.unit.${testName}.test.json`);

const jestArgs = [
  '--config', config.config,
  '--silent',
  '--maxWorkers', config.maxWorkers,
  '--testTimeout', config.timeout
];

// Add fail-fast if configured
if (config.failFast) {
  jestArgs.push('--bail');
}

// Add specific test path if provided
if (testPath) {
  jestArgs.push(testPath);
}

console.log(`Running ${config.name}...`);
if (testPath) {
  console.log(`Test path: ${testPath}`);
}
console.log(`Results will be saved to: ${outputFile}`);

// Run tests
const jest = spawn('jest', jestArgs, {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: {
    ...process.env,
    JEST_OUTPUT_FILE: outputFile // Pass to minimal-reporter
  }
});

// Handle output
jest.stdout.on('data', (data) => {
  // Only show essential output
  const output = data.toString();
  if (output.includes('PASS') || output.includes('FAIL')) {
    process.stdout.write(data);
  }
});

jest.stderr.on('data', (data) => {
  // Show errors
  process.stderr.write(data);
});

// Handle process exit
jest.on('close', (code) => {
  if (code !== 0) {
    console.error(`${config.name} failed with code ${code}`);
    process.exit(code);
  }
  console.log(`${config.name} completed successfully`);
  console.log(`Results saved to: ${outputFile}`);
});

// Handle process errors
jest.on('error', (err) => {
  console.error('Failed to start test process:', err);
  process.exit(1);
});
