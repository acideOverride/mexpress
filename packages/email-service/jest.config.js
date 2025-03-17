const { defaults } = require('jest-config');
const path = require('path');

// Get environment variables for test filtering
const priority = process.env.PRIORITY; // p0, p1, p2, p3
const testType = process.env.TEST_TYPE; // unit, integration, e2e

// Filter test paths based on environment variables
let testPathPattern = [];

if (priority) {
  testPathPattern.push(`tests/${priority.toLowerCase()}`);
}

if (testType) {
  if (testType.toLowerCase() === 'integration') {
    testPathPattern.push('tests/integration');
  }
}

// Build the pattern
const finalPattern = testPathPattern.length > 0 
  ? `(${testPathPattern.join('|')})`
  : undefined;

/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  displayName: 'email-service',
  rootDir: path.resolve(__dirname),
  testMatch: ['**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  testPathPattern: finalPattern,
};

module.exports = config;