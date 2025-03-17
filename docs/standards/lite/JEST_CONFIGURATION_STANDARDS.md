# mExpress Jest Configuration Standards

This document outlines the standardized approach to Jest configuration across all projects and packages within mExpress. Using this standardized approach ensures consistent test behavior whether tests are run individually or through the test runner.

## Core Principles

1. **Consistency**: All Jest configurations must use the same tooling and approach
2. **Inheritance**: Configurations must extend from a common base preset
3. **Simplicity**: Minimize configuration duplication and complexity
4. **Standardized Tools**: Use ts-jest for TypeScript integration, not Babel
5. **Reliability**: Tests should behave the same in all environments
6. **Maintainability**: Reduce the number of configuration files from 45+ to ~10

## Configuration Inheritance Hierarchy

Instead of having 45+ separate configuration files, we implement a streamlined hierarchy:

1. **Root Preset** (`/jest.preset.js`): Base configuration with common settings
2. **Utilities** (`/jest.utils.js`): Dynamic configuration generation functions
3. **Package Configurations** (`/packages/{package}/jest.config.js`): One config file per package
4. **Project Configurations** (`/projects/{project}/jest.config.js`): One config file per project

## Standard Configuration Examples

### Base Preset Configuration

All Jest configurations extend from the central base configuration: `/opt/mExpress/jest.preset.js`

```js
/**
 * Base Jest configuration preset
 * This file establishes the common Jest settings used across the project
 */
module.exports = {
    // Core configuration
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts?(x)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    
    // TypeScript configuration - specifically use ts-jest, not Babel
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            isolatedModules: true,
            diagnostics: {
                ignoreCodes: [2322, 2339, 2345, 2571]  // Ignore common TS errors in tests
            }
        }]
    },
    
    // Test execution configuration
    maxWorkers: '50%',    // Use 50% of available CPUs by default
    testRunner: "jest-circus/runner",
    testTimeout: 60000,   // Increased for integration tests
    
    // Resource management
    detectOpenHandles: true,   // Help identify resource leaks
    forceExit: true,           // Ensure clean exit
    
    // Default reporter configuration
    reporters: ["default"],
    
    // Handling mocks
    restoreMocks: true,
    clearMocks: true,
    
    // Verbose output for better debugging
    verbose: true
};
```

### Jest Utilities File

The Jest utilities file (`/jest.utils.js`) contains functions for dynamically generating test configurations based on environment variables:

```js
/**
 * Generate a Jest config for a specific test priority
 * @param {string} packageName - Package name (core, utils, etc.)
 * @param {string} priority - Test priority (p0, p1, p2, p3)
 * @param {JestConfig} baseConfig - Base configuration
 * @returns {JestConfig} Jest configuration
 */
function createPriorityConfig(packageName, priority, baseConfig) {
  return {
    ...baseConfig,
    displayName: `${packageName}-${priority}`,
    testMatch: [
      `<rootDir>/tests/${priority}/**/*.test.ts?(x)`
    ],
    // Priority-specific settings
    testTimeout: getPriorityTimeout(priority),
    maxWorkers: getPriorityWorkers(priority),
  };
}

/**
 * Create a configuration for integration tests
 * @param {string} packageName - Package name
 * @param {JestConfig} baseConfig - Base configuration
 * @returns {JestConfig} Jest configuration for integration tests
 */
function createIntegrationConfig(packageName, baseConfig) {
  return {
    ...baseConfig,
    displayName: `${packageName}-integration`,
    testMatch: [
      `<rootDir>/tests/**/integration/**/*.test.ts?(x)`
    ],
    // Integration-specific settings
    testTimeout: 120000,
    maxWorkers: 1,
    globals: {
      ...baseConfig.globals,
      __INTEGRATION__: true,
    }
  };
}

// ... additional utility functions
```

### Package-Level Configuration

Each package has a single root Jest configuration that extends the base preset and uses our utility functions:

```js
// /packages/core/jest.config.js
/**
 * Main Jest configuration file for mExpress core package
 * This configuration uses the standardized dynamic approach
 * STANDARDIZED VERSION - 2025-03-15
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
const baseConfig = require('../../jest.preset');
const jestUtils = require('../../jest.utils');

// Create the base package config
const packageConfig = {
  ...baseConfig,
  displayName: 'core',
  setupFilesAfterEnv: [
    '<rootDir>/jest/jest.mongodb.setup.js',
    '<rootDir>/jest/jest.console-redirect.js'
  ],
  moduleNameMapper: {
    '^@mexpress/core/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!**/node_modules/**',
    '!**/__tests__/**'
  ],
  coverageDirectory: '<rootDir>/tests/results/coverage',
  reporters: [
    'default',
    ['<rootDir>/jest/jest.simplified.reporter.js', {}]
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      isolatedModules: true,
      tsconfig: './tsconfig.json'
    }]
  }
};

// Use our simplified dynamic configuration utility
module.exports = jestUtils.createDynamicConfig('core', packageConfig);
```

The `createDynamicConfig` function is a powerful utility that handles all configuration based on environment variables. It automatically detects priority and test type to generate the appropriate configuration:
```

## Running Tests

### Using Standardized Test Script

The most convenient way to run tests is through our standardized test runner scripts:

```bash
# Run all tests across all packages
./run-all-tests.sh

# Run only P1 tests
./run-all-tests.sh --p1

# Run only Core package P0 tests
./run-all-tests.sh --p0 --core

# Run integration tests
./run-all-tests.sh --integration

# Run with coverage
./run-all-tests.sh --coverage
```

### Standard Commands with Environment Variables

You can also use environment variables to customize test execution without changing configuration files:

```bash
# Run all tests in a package
npx jest --config packages/core/jest.config.js

# Run only P1 tests in a package
PRIORITY=p1 npx jest --config packages/core/jest.config.js

# Run only integration tests in a package
TEST_TYPE=integration npx jest --config packages/core/jest.config.js

# Run only frontend tests in a package
TEST_TYPE=frontend npx jest --config packages/core/jest.config.js

# Run tests requiring MongoDB
MONGODB_URI=mongodb://localhost:27017/mexpress_test npx jest --config packages/core/jest.config.js

# Run a single test file (through our dynamic configuration system)
PRIORITY=p1 npx jest --config=packages/core/jest.config.js --testPathPattern=packages/core/tests/p1/specific/test.test.ts
```

### Standard Command-Line Arguments

Always include these arguments for consistent behavior:

- `--preset=ts-jest`: Ensures TypeScript compatibility
- `--no-cache`: Prevents stale test caches
- `--runInBand`: For integration tests to avoid concurrency issues
- `--verbose`: For detailed test output

## Test Runner Integration

We have two standardized test runner scripts:

1. **Master Test Runner** (`/opt/mExpress/run-all-tests.sh`)
   - Runs tests across all packages using our standardized configuration
   - Supports command-line options like `--p0`, `--core`, `--coverage`, etc.
   - Uses the root Jest configuration with projects array

2. **Real-time Test Runner** (`/opt/mExpress/scripts/testScripts/b_real_time_test_runner.sh`)
   - Executes tests and provides real-time status updates 
   - Generates detailed reports with test metrics
   - Uses environment variables for dynamic configuration

Both runners use our standardized approach:

```bash
# Extract priority and test type information from the test path
if [[ "$test_file" == *"/p0/"* ]]; then
  export PRIORITY=p0
elif [[ "$test_file" == *"/p1/"* ]]; then
  export PRIORITY=p1
elif [[ "$test_file" == *"/p2/"* ]]; then
  export PRIORITY=p2
elif [[ "$test_file" == *"/p3/"* ]]; then
  export PRIORITY=p3
fi

if [[ "$test_file" == *"/integration/"* ]]; then
  export TEST_TYPE=integration
elif [[ "$test_file" == *"/frontend/"* ]]; then
  export TEST_TYPE=frontend
elif [[ "$test_file" == *".tsx" ]]; then
  export TEST_TYPE=react
elif [[ "$test_file" == *".vue" ]]; then
  export TEST_TYPE=vue
else
  export TEST_TYPE=unit
fi

# Run with environment variables and standardized configuration
MONGODB_URI=mongodb://localhost:27017/mexpress_test \
PRIORITY=$PRIORITY \
TEST_TYPE=$TEST_TYPE \
npx jest --config "$config" --no-cache --runInBand --verbose
```

Additionally, package-specific test runners (`/packages/core/tests/run-tests.sh`) are available for focused testing within a specific package.

## Common Configuration Issues

1. **Missing Dependencies**: Ensure `ts-jest` and other dependencies are installed
2. **Path Resolution**: Use `<rootDir>` for consistent path resolution in all configs
3. **Mock Collision**: Avoid duplicate mock files with the same name in different directories
4. **Test Timeouts**: Use the utility functions for standardized timeouts:
   - P0 tests: 30 seconds
   - P1 tests: 60 seconds
   - P2 tests: 60 seconds
   - P3 tests: 120 seconds
   - Integration tests: 120 seconds
5. **Project References**: Make sure tsconfig.json properly references project types
6. **Import Paths**: Use consistent module name mapping

## Implementation Plan

See `/tests/validation/unified/JEST_UNIFIED.md` for the detailed implementation plan, which outlines:

1. Which configuration files to update
2. Which configuration files to remove
3. The phased approach to standardizing all configurations
4. Progress tracking

## Benefits

1. **Drastically Reduced Maintenance**: From 45+ files to ~10 files
2. **Consistent Configuration**: All settings follow the same pattern
3. **Dynamic Behavior**: Configurations adapt based on environment variables
4. **Simplified Execution**: Commands are more uniform and predictable
5. **Better Type Safety**: TypeScript interfaces for configurations
6. **Easier Updates**: When Jest updates, you modify fewer files