export default {
  testMatch: ['<rootDir>/src/components/customers/__tests__/CustomerList.test.tsx'],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/components/customers/CustomerList.tsx'
  ],
  coverageReporters: [
    ["json-summary", {"file": "./tests/results/summary/coverage-summary.json"}],
    ["text", {"file": "./tests/results/p0/coverage-text.log"}]
  ],
  reporters: [
    ["json", {"outputFile": "./tests/results/summary/test-results.json"}],
    ["summary", {"outputFile": "./tests/results/summary/test-summary.log"}]
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect'
  ]
};
