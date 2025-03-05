module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@mexpress/utils/src/(.*)$': '<rootDir>/../../../../../packages/utils/src/$1',
    '^@mexpress/core/src/(.*)$': '<rootDir>/../../../../../packages/core/src/$1'
  },
  rootDir: '/opt/mExpress/packages/core/tests/p0/infrastructure',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      isolatedModules: true,
      diagnostics: false
    }]
  }
};
