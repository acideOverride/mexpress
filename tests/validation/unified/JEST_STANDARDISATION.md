# Jest Configuration Standardization Checklist

## Overview
This document tracks the standardization of Jest configurations in the mExpress platform. We've simplified from 45+ configuration files to a unified system with approximately 10 essential files.

## Standardization Status

### Core Files
- [x] Create standardized base preset (`/jest.preset.js`)
- [x] Create Jest utilities (`/jest.utils.js`)
- [x] Update root configuration (`/jest.config.js`)
- [x] Create and document Jest configuration standards (`/docs/standards/JEST_CONFIGURATION_STANDARDS.md`)

### Package Configurations
- [x] Update core package config (`/packages/core/jest.config.js`)
- [x] Update utils package config (`/packages/utils/jest.config.js`)
- [x] Update UI components package config (`/packages/ui-components/jest.config.js`)
- [x] Update Vue components package config (`/packages/vue-components/jest.config.js`)

### Project Configurations
- [x] Update MontPC CRM project config (`/projects/montpc_crm/jest.config.js`)
- [x] Update MontPC CRM frontend config (`/projects/montpc_crm/frontend/jest.config.js`)
- [x] Update MontPC CRM tests config (`/projects/montpc_crm/tests/jest.config.js`)
- [ ] Update other project configs as needed (No immediate action required)

### Test Runner Scripts
- [x] Update main test runner (`/scripts/test_scripts/run-all-tests.sh`)
- [x] Update core package test runner (`/scripts/test_scripts/run-tests.sh`)
- [x] Create Vue components test runner (`/scripts/test_scripts/run-vue-component-tests.sh`) 
- [ ] Create unified test runner script with environment variable support
- [ ] Update project-specific test runners to use the new configuration

### Cleanup Tasks
- [ ] Rename or remove redundant configurations with `.bak` extension
- [ ] Remove redundant configurations in `/packages/core/jest/`
- [ ] Remove redundant configurations in project-level test directories
- [ ] Remove outdated documentation files:
  - [x] Delete `/opt/mExpress/JEST_CONFIGURATION_HANDOFF.md`
  - [x] Delete `/opt/mExpress/tests/validation/unified/JEST_UNIFIED.md`

## Remaining Items

1. **Vue Components Configuration**:
   - [x] Update `/packages/vue-components/jest.config.js` with dynamic configuration
   - [x] Add Vue-specific test settings (using @vue/vue3-jest)
   - [x] Create test runner script for Vue components
   - [x] Verify Vue component tests run correctly

2. **MontPC Custom Configuration**:
   - [x] Update MontPC tests config with custom priority handler for its unique structure
   - [x] Test and verify both priority and test type selection works properly
   - [x] Document custom approach for project-specific configurations

3. **Test Runner Enhancements**:
   - [ ] Create a unified test runner with environment variable support
   - [ ] Add support for combined options (PRIORITY=p1 TEST_TYPE=frontend)
   - [ ] Add parallel test execution for specified priorities

4. **Verification**:
   - [ ] Verify all tests pass with standardized configuration
   - [ ] Run performance comparison between old and new configuration
   - [ ] Create script to verify configuration consistency

5. **Documentation**:
   - [ ] Update CLAUDE.md with standardized test commands
   - [ ] Create example documentation for common test scenarios

## Benefits Achieved

- **Maintenance**: Reduced from 45+ files to ~10 files (78% reduction)
- **Consistency**: All settings follow the same pattern
- **Adaptability**: Configurations adapt based on environment variables
- **Simplicity**: Commands are uniform and predictable
- **Type Safety**: TypeScript interfaces for configurations
- **Updateability**: Fewer files to modify for Jest updates

## Progress Summary

- **Total Essential Jest Configurations**: 11
- **Standardized**: 11 (100%)
- **Remaining**: 0 (0%)

Last updated: 2025-03-09