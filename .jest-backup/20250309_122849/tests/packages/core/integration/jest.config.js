module.exports = {
    testRunner: "jest-circus/runner",
  displayName: 'core-integration',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/infrastructure/**/*.test.ts'
  ],
  moduleNameMapper: {
    '^../../lib/container-orchestrator$': '<rootDir>/__mocks__/lib/container-orchestrator.ts',
    '^../../lib/service-mesh$': '<rootDir>/__mocks__/lib/service-mesh.ts',
    '^../../lib/container-runtime$': '<rootDir>/__mocks__/lib/container-runtime.ts',
    '^../../lib/service-deployment$': '<rootDir>/__mocks__/lib/service-deployment.ts',
    '^../../lib/pipeline$': '<rootDir>/__mocks__/lib/pipeline.ts',
    '^@mexpress/core/src/(.*)$': '/opt/mExpress/packages/core/src/$1',
    '^@mexpress/utils/src/(.*)$': '/opt/mExpress/packages/utils/src/$1'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { 
      isolatedModules: true,
      diagnostics: false,
      transpileOnly: true
    }]
  },
  rootDir: '/opt/mExpress/tests/packages/core/integration',
  maxWorkers: 1,
  bail: 0,
  forceExit: true
};
