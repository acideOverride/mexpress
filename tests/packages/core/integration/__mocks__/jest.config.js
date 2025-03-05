module.exports = {
  // Use the mock directory for these imports
  moduleNameMapper: {
    '^../../lib/container-orchestrator$': '<rootDir>/__mocks__/lib/container-orchestrator.ts',
    '^../../lib/service-mesh$': '<rootDir>/__mocks__/lib/service-mesh.ts',
    '^../../lib/container-runtime$': '<rootDir>/__mocks__/lib/container-runtime.ts',
    '^../../lib/service-deployment$': '<rootDir>/__mocks__/lib/service-deployment.ts',
    '^../../lib/pipeline$': '<rootDir>/__mocks__/lib/pipeline.ts'
  }
};
