module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@mexpress/utils/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '<rootDir>/tests/p1/lib/resilience/*.test.ts'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // Ensure the test runner completes even with lingering handles
  testTimeout: 30000,
  forceExit: true
};