/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: [
    '<rootDir>/tests/**/*.test.ts',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@backend/(.*)$': '<rootDir>/src/backend/$1',
    '^@frontend/(.*)$': '<rootDir>/src/frontend/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1'
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,vue}',
    '!src/**/*.d.ts',
    '!**/node_modules/**'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'vue'],
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true
};

// Set test timeouts based on priority level (from environment variable)
const priority = process.env.PRIORITY || '';
switch (priority) {
  case 'p0':
    config.testTimeout = 30000; // 30 seconds for critical tests
    config.testMatch = ['<rootDir>/tests/p0/**/*.test.ts'];
    break;
  case 'p1':
    config.testTimeout = 60000; // 60 seconds for important tests
    config.testMatch = ['<rootDir>/tests/p1/**/*.test.ts'];
    break;
  case 'p2':
    config.testTimeout = 60000; // 60 seconds for secondary tests
    config.testMatch = ['<rootDir>/tests/p2/**/*.test.ts'];
    break;
  case 'p3':
    config.testTimeout = 120000; // 120 seconds for performance tests
    config.testMatch = ['<rootDir>/tests/p3/**/*.test.ts'];
    break;
  default:
    config.testTimeout = 60000; // Default timeout
    break;
}

// Configure based on test type if specified
const testType = process.env.TEST_TYPE || '';
if (testType === 'frontend') {
  config.testEnvironment = 'jsdom';
  config.setupFilesAfterEnv.push('<rootDir>/tests/setup-frontend.ts');
}

module.exports = config;