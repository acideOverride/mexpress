module.exports = {
  displayName: 'utils-monitoring-tests',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: '../../tsconfig.json'
    }]
  },
  testMatch: [
    '<rootDir>/p2/lib/monitoring/*.test.ts'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@mexpress/utils/(.*)$': '<rootDir>/../src/$1'
  }
};