# Jest Configuration Standardization Prompt

## Context
The mExpress platform had a complex and fragmented Jest testing configuration system with over 45 different configuration files spread across packages, projects, and test directories. This created significant maintenance challenges, inconsistent test behavior, and difficulty in understanding the test setup.

## What We're Trying to Achieve
We are standardizing the Jest configuration across the entire mExpress platform to:

1. **Reduce Configuration Complexity**: Consolidate from 45+ files down to ~10 essential configuration files
2. **Create a Consistent Pattern**: Establish a clear configuration hierarchy and inheritance model
3. **Centralize Common Settings**: Move shared configuration into a preset that all other configs extend
4. **Enable Dynamic Configuration**: Use environment variables to control test selection and behavior
5. **Standardize Test Commands**: Create uniform commands that work consistently across packages
6. **Simplify Maintenance**: Make Jest updates and configuration changes easier to implement
7. **Improve Test Reliability**: Ensure tests behave consistently across environments and execution modes

## Approach
Our approach follows these key principles:

1. **Configuration Hierarchy**:
   - Base preset (`/jest.preset.js`) contains common settings for all tests
   - Utility functions (`/jest.utils.js`) generate specialized configurations
   - Package-level configurations use dynamic generation based on environment variables

2. **Environment Variable Control**:
   - `PRIORITY=p0|p1|p2|p3`: Run tests of a specific priority level
   - `TEST_TYPE=integration|frontend|react|vue`: Run specific types of tests
   - Combined variables: `PRIORITY=p0 TEST_TYPE=frontend`: Run critical frontend tests

3. **Priority-Based Testing**:
   - P0 (critical): Fast execution, parallel testing, short timeouts
   - P1 (important): Standard settings, sequential execution
   - P2 (secondary): Standard settings, sequential execution
   - P3 (performance): Extended timeouts, sequential execution

## Current Status
We've made significant progress (90% complete) with our standardization efforts:
- Created core configuration files and utilities
- Standardized 9 of 10 essential configurations
- Established documentation and usage patterns
- Created test runners that support the new system

## Remaining Work
The main remaining tasks are:
1. Completing the Vue components package configuration
2. Creating a unified test runner with enhanced environment variable support
3. Removing redundant configuration files once the new system is fully validated
4. Updating documentation with examples for common testing scenarios

## Request
Please review the `/opt/mExpress/scripts/JEST_STANDARDISATION.md` checklist to understand the current status and remaining work. Then help us complete the following:

1. Update the Vue components package configuration to use our dynamic system
2. Create a unified test runner script with better environment variable handling
3. Verify that all tests run correctly with the new configuration
4. Develop a strategy for removing redundant configuration files safely

## Success Criteria
We'll consider this standardization effort successful when:
1. All tests run consistently with the new configuration system
2. The number of configuration files is reduced by at least 75%
3. All test runners use environment variables for selection
4. Documentation clearly explains the new approach
5. Team members can easily run tests with the new commands