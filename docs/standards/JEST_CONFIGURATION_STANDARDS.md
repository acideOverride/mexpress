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

Each package has a single root Jest configuration that extends the base preset and uses the utility functions:

```js
// /packages/core/jest.config.js
/** @type {import('ts-jest').JestConfigWithTsJest} */
const baseConfig = require('../../jest.preset');
const jestUtils = require('../../jest.utils');

// Create the base package config
const packageConfig = {
  ...baseConfig,
  displayName: 'core',
  moduleNameMapper: {
    '^@mexpress/core/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: './tsconfig.json'
    }]
  }
};

// Determine if we're running specific priority tests from command line
// e.g., PRIORITY=p1 npx jest --config packages/core/jest.config.js
const priority = process.env.PRIORITY;
const testType = process.env.TEST_TYPE; // e.g., integration, unit

// Dynamic configuration based on environment variables
if (priority) {
  module.exports = jestUtils.createPriorityConfig('core', priority, packageConfig);
} else if (testType === 'integration') {
  module.exports = jestUtils.createIntegrationConfig('core', packageConfig);
} else {
  // Default configuration for running all tests
  module.exports = {
    ...packageConfig,
    projects: [
      // Priority configs
      jestUtils.createPriorityConfig('core', 'p0', packageConfig),
      jestUtils.createPriorityConfig('core', 'p1', packageConfig),
      jestUtils.createPriorityConfig('core', 'p2', packageConfig),
      jestUtils.createPriorityConfig('core', 'p3', packageConfig),
      // Integration config
      jestUtils.createIntegrationConfig('core', packageConfig)
    ]
  };
}
```

## Running Tests

### Standard Commands with Environment Variables

Use environment variables to customize test execution without changing configuration files:

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

# Run a single test file
npx jest --preset=ts-jest --no-cache path/to/test.test.ts
```

### Standard Command-Line Arguments

Always include these arguments for consistent behavior:

- `--preset=ts-jest`: Ensures TypeScript compatibility
- `--no-cache`: Prevents stale test caches
- `--runInBand`: For integration tests to avoid concurrency issues
- `--verbose`: For detailed test output

## Test Runner Integration

The standardized test runner script (`/opt/mExpress/scripts/testScripts/b_real_time_test_runner.sh`) automatically:

1. Determines the appropriate test priority and type from the file path
2. Sets environment variables accordingly
3. Runs tests with the correct configuration
4. Captures and reports results

Example code from the test runner:

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
fi

# Run with environment variables
MONGODB_URI=mongodb://localhost:27017/mexpress_test \
PRIORITY=$PRIORITY \
TEST_TYPE=$TEST_TYPE \
npx jest --config "$config" --preset=ts-jest --no-cache --runInBand --verbose
```

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