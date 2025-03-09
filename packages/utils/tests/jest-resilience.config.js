const path = require('path');

module.exports = {
  displayName: 'utils-resilience-tests',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: path.join(__dirname, '../../tsconfig.json')
    }]
  },
  testMatch: [
    path.join(__dirname, 'p1/lib/resilience/*.test.ts')
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@mexpress/utils/(.*)$': path.join(__dirname, '../../src/$1')
  },
  rootDir: path.join(__dirname, '../..')
};