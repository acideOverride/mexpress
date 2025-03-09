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
- [x] `/jest.utils.js` - STANDARDIZED (2025-03-15)
- [x] `/jest.config.js` - STANDARDIZED (2025-03-15)

### Package Configurations

- [x] `/packages/core/jest.config.js` - STANDARDIZED (2025-03-15)
- [x] `/packages/utils/jest.config.js` - STANDARDIZED (2025-03-08)
- [x] `/packages/ui-components/jest.config.js` - STANDARDIZED (2025-03-15)
- [ ] `/packages/vue-components/jest.config.js` - NEEDS UPDATE

### Project Configurations

- [x] `/projects/montpc_crm/jest.config.js` - STANDARDIZED (2025-03-15)
- [ ] `/projects/giandra_photos/jest.config.js` - NOT NEEDED (no tests yet)
- [ ] `/projects/jerome_bikes/jest.config.js` - NOT NEEDED (no tests yet)

### Scripts

- [x] `/opt/mExpress/scripts/testScripts/b_real_time_test_runner.sh` - STANDARDIZED (2025-03-08)
- [ ] `/packages/core/tests/run-tests.sh` - TO BE CREATED (replacing multiple scripts)
- [x] `/packages/utils/tests/run-p1-tests.sh` - STANDARDIZED (2025-03-08)

## Files to Be Removed

With our standardized configuration in place, the following files are now redundant and can be removed after thorough testing:

### Core Package Redundant Configs (DO NOT REMOVE YET)

- [ ] `/packages/core/jest/jest.config.js` - CAN BE REMOVED
- [ ] `/packages/core/jest/jest.config.base.js` - CAN BE REMOVED
- [ ] `/packages/core/jest/jest.config.p0.js` - CAN BE REMOVED
- [ ] `/packages/core/jest/jest.config.p1.js` - CAN BE REMOVED
- [ ] `/packages/core/jest/jest.config.p2.js` - CAN BE REMOVED
- [ ] `/packages/core/jest/jest.config.p3.js` - CAN BE REMOVED
- [ ] `/packages/core/tests/p0/jest.config.js` - CAN BE REMOVED
- [ ] `/packages/core/tests/p1/jest.config.js` - CAN BE REMOVED
- [ ] `/packages/core/tests/p2/jest.config.js` - CAN BE REMOVED
- [ ] `/packages/core/tests/p3/jest.config.js` - CAN BE REMOVED
- [ ] `/packages/core/tests/integration/jest.config.js` - CAN BE REMOVED
- [ ] `/packages/core/tests/p1/integration/jest.config.js` - CAN BE REMOVED

### Project Redundant Configs (DO NOT REMOVE YET)

- [x] `/projects/montpc_crm/frontend/jest.config.js` - UPDATED, NOT REMOVED
- [ ] `/projects/montpc_crm/frontend/jest.simple.config.js` - CAN BE REMOVED
- [ ] `/projects/montpc_crm/tests/frontend/jest.config.js` - CAN BE REMOVED
- [ ] `/projects/montpc_crm/tests/frontend/p0/jest.config.js` - CAN BE REMOVED
- [ ] `/projects/montpc_crm/tests/frontend/p1/jest.config.js` - CAN BE REMOVED
- [ ] `/projects/montpc_crm/tests/backend/jest.config.js` - CAN BE REMOVED

NOTE: Do not remove these files until Phase 5 (Testing and Verification) is completed. For now, we're running both systems in parallel to ensure the new standardized system works correctly.

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

### Phase 1: Core Files ✅ COMPLETED

- [x] Create standardized base preset (`/jest.preset.js`) - COMPLETED (2025-03-08)
- [x] Create Jest utilities (`/jest.utils.js`) - COMPLETED (2025-03-15)
- [x] Update root configuration (`/jest.config.js`) - COMPLETED (2025-03-15)
- [x] Update test runner script - COMPLETED (2025-03-08)

### Phase 2: Package Configurations ✅ MOSTLY COMPLETED

- [x] Update core package config - COMPLETED (2025-03-15)
- [x] Update utils package config - COMPLETED (2025-03-08)
- [x] Update UI components package config - COMPLETED (2025-03-15)
- [ ] Update Vue components package config - PENDING

### Phase 3: Project Configurations ✅ MOSTLY COMPLETED

- [x] Update MontPC CRM project config - COMPLETED (2025-03-15)
- [ ] Update other project configs as needed - NOT REQUIRED YET

### Phase 4: Cleanup and Documentation 🔄 IN PROGRESS 

- [ ] Remove redundant configuration files - SCHEDULED (After Phase 5)
- [x] Update documentation and examples - COMPLETED (2025-03-15)
- [ ] Create unified test running scripts - PENDING

### Phase 5: Testing and Verification 🔄 IN PROGRESS

- [ ] Verify all tests pass with new configuration - PENDING
- [ ] Document final configuration structure - PENDING

### Next Steps

1. Update Vue components package configuration
2. Create and test unified test running scripts
3. Verify that all tests run correctly with the new configuration
4. Once verified, remove redundant configuration files

## Benefits of Simplified Approach

1. **Drastically Reduced Maintenance**: From 45+ files to ~10 files
2. **Consistent Configuration**: All settings follow the same pattern
3. **Dynamic Behavior**: Configurations adapt based on environment variables
4. **Simplified Execution**: Commands are more uniform and predictable
5. **Better Type Safety**: TypeScript interfaces for configurations
6. **Easier Updates**: When Jest updates, you modify fewer files

## Progress Tracking

- Total Essential Jest configurations: 10
- Standardized: 9 (90%)
- In progress: 0 (0%)
- Remaining: 1 (10%)

Last updated: 2025-03-15