# mExpress Jest Configuration Simplification Plan

This document outlines the plan to simplify and standardize Jest configurations across the mExpress codebase. The current state of 45+ Jest configuration files is unsustainable and leads to inconsistent test behavior.

## Current State Analysis

- **Total Jest Configurations**: 45+
- **Redundant Configurations**: Most configs duplicate settings with minor variations
- **Maintenance Burden**: Changes must be propagated to many files
- **Inconsistent Behavior**: Tests run differently depending on which config is used

## Simplification Goals

1. ✅ Create a single base Jest preset that all configs extend from
2. ✅ Use ts-jest consistently for all TypeScript tests
3. ✅ Implement dynamic configuration generation to reduce file count
4. ✅ Consolidate configurations from 45+ files to ~10 essential files
5. ✅ Fix discrepancies between individual test runs and test runner runs
6. ✅ Use environment variables for specifying test priorities and types
7. ✅ Standardize test commands and execution patterns
8. ✅ Document simplified standards

## Simplified Configuration Hierarchy

Instead of 45+ configurations, we're implementing a streamlined hierarchy:

1. **Root Preset** (`/jest.preset.js`) - ✅ COMPLETED
   - Base configuration that all other configs extend from
   - Contains common settings for all tests

2. **Configuration Utilities** (`/jest.utils.js`) - 🔄 TO BE CREATED
   - Helper functions for generating dynamic configurations
   - Centralizes logic for priority-specific and type-specific settings

3. **Package Configurations** - 🔄 IN PROGRESS
   - One config file per package (`/packages/{package}/jest.config.js`)
   - Uses dynamic configuration based on environment variables
   - Replaces multiple priority-specific config files

4. **Global Root Configuration** (`/jest.config.js`) - 🔄 IN PROGRESS
   - Root-level configuration for running all tests
   - Uses a projects array to include all package configs

## Essential Configuration Files

### Core Files

- [x] `/jest.preset.js` - STANDARDIZED (2025-03-08)
- [ ] `/jest.utils.js` - TO BE CREATED
- [x] `/jest.config.js` - STANDARDIZED (2025-03-08)

### Package Configurations

- [ ] `/packages/core/jest.config.js` - NEEDS UPDATE
- [x] `/packages/utils/jest.config.js` - STANDARDIZED (2025-03-08)
- [ ] `/packages/ui-components/jest.config.js` - NEEDS UPDATE
- [ ] `/packages/vue-components/jest.config.js` - NEEDS UPDATE

### Project Configurations

- [ ] `/projects/montpc_crm/jest.config.js` - NEEDS UPDATE
- [ ] `/projects/giandra_photos/jest.config.js` - NEEDS UPDATE (if needed)
- [ ] `/projects/jerome_bikes/jest.config.js` - NEEDS UPDATE (if needed)

### Scripts

- [x] `/opt/mExpress/scripts/testScripts/b_real_time_test_runner.sh` - STANDARDIZED (2025-03-08)
- [ ] `/packages/core/tests/run-tests.sh` - TO BE CREATED (replacing multiple scripts)
- [x] `/packages/utils/tests/run-p1-tests.sh` - STANDARDIZED (2025-03-08)

## Files to Be Removed

Once the simplified configuration is implemented, the following files will be redundant and can be removed:

### Core Package Redundant Configs

- [ ] `/packages/core/jest/jest.config.js` - WILL BE REMOVED
- [ ] `/packages/core/jest/jest.config.base.js` - WILL BE REMOVED
- [ ] `/packages/core/jest/jest.config.p0.js` - WILL BE REMOVED
- [ ] `/packages/core/jest/jest.config.p1.js` - WILL BE REMOVED
- [ ] `/packages/core/jest/jest.config.p2.js` - WILL BE REMOVED
- [ ] `/packages/core/jest/jest.config.p3.js` - WILL BE REMOVED
- [ ] `/packages/core/tests/p0/jest.config.js` - WILL BE REMOVED
- [ ] `/packages/core/tests/p1/jest.config.js` - WILL BE REMOVED
- [ ] `/packages/core/tests/p2/jest.config.js` - WILL BE REMOVED
- [ ] `/packages/core/tests/p3/jest.config.js` - WILL BE REMOVED
- [ ] `/packages/core/tests/integration/jest.config.js` - WILL BE REMOVED
- [ ] `/packages/core/tests/p1/integration/jest.config.js` - WILL BE REMOVED

### Project Redundant Configs

- [ ] `/projects/montpc_crm/frontend/jest.config.js` - WILL BE REMOVED
- [ ] `/projects/montpc_crm/frontend/jest.simple.config.js` - WILL BE REMOVED
- [ ] `/projects/montpc_crm/tests/frontend/jest.config.js` - WILL BE REMOVED
- [ ] `/projects/montpc_crm/tests/frontend/p0/jest.config.js` - WILL BE REMOVED
- [ ] `/projects/montpc_crm/tests/frontend/p1/jest.config.js` - WILL BE REMOVED
- [ ] `/projects/montpc_crm/tests/backend/jest.config.js` - WILL BE REMOVED

## Dynamic Configuration Approach

The key to this simplification is creating dynamic Jest configurations:

```js
// /jest.utils.js
module.exports = {
  /**
   * Generate a Jest config for a specific test priority
   * @param {string} packageName - Package name (core, utils, etc.)
   * @param {string} priority - Test priority (p0, p1, p2, p3)
   * @param {Object} baseConfig - Base configuration
   * @returns {Object} Jest configuration
   */
  createPriorityConfig(packageName, priority, baseConfig) {
    return {
      ...baseConfig,
      displayName: `${packageName}-${priority}`,
      testMatch: [
        `<rootDir>/tests/${priority}/**/*.test.ts?(x)`
      ],
      // Priority-specific settings
      testTimeout: priority === 'p3' ? 120000 : 60000,
      maxWorkers: priority === 'p0' ? '50%' : 1,
    };
  },

  /**
   * Create a configuration for integration tests
   * @param {string} packageName - Package name
   * @param {Object} baseConfig - Base configuration
   * @returns {Object} Jest configuration for integration tests
   */
  createIntegrationConfig(packageName, baseConfig) {
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
};
```

## Package Configuration Example

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

## Test Runner Script Updates

Update the test runner script to use environment variables for priority and test type:

```bash
# For P0 tests
PRIORITY=p0 npx jest --config packages/core/jest.config.js

# For P1 tests
PRIORITY=p1 npx jest --config packages/core/jest.config.js

# For integration tests
TEST_TYPE=integration npx jest --config packages/core/jest.config.js

# For all tests in a package
npx jest --config packages/core/jest.config.js
```

## Implementation Plan

### Phase 1: Core Files (Current)

- [x] Create standardized base preset (`/jest.preset.js`)
- [x] Create Jest utilities (`/jest.utils.js`) (Added createDynamicConfig for simplified usage)
- [x] Update root configuration (`/jest.config.js`)
- [x] Update test runner script

### Phase 2: Package Configurations

- [ ] Update core package config
- [x] Update utils package config
- [ ] Update UI components package config
- [ ] Update Vue components package config

### Phase 3: Project Configurations

- [ ] Update MontPC CRM project config
- [ ] Update other project configs as needed

### Phase 4: Cleanup and Documentation

- [ ] Remove redundant configuration files
- [ ] Update documentation and examples
- [ ] Create unified test running scripts

### Phase 5: Testing and Verification

- [ ] Verify all tests pass with new configuration
- [ ] Document final configuration structure

## Benefits of Simplified Approach

1. **Drastically Reduced Maintenance**: From 45+ files to ~10 files
2. **Consistent Configuration**: All settings follow the same pattern
3. **Dynamic Behavior**: Configurations adapt based on environment variables
4. **Simplified Execution**: Commands are more uniform and predictable
5. **Better Type Safety**: TypeScript interfaces for configurations
6. **Easier Updates**: When Jest updates, you modify fewer files

## Progress Tracking

- Total Essential Jest configurations: 10
- Standardized: 5 (50%)
- In progress: 0 (0%)
- Remaining: 5 (50%)

Last updated: 2025-03-08