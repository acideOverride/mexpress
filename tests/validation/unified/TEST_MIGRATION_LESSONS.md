# Test Migration Lessons & Guidelines

This document captures the key lessons learned during the test migration process and provides guidelines for future test migrations.

## Migration Challenges

During our initial test migration efforts, we encountered several challenges:

1. **Import Path Resolution**: 
   - Tests in current locations use relative paths for imports
   - Moving tests to canonical locations breaks these imports
   - Path aliases like `@mexpress/core` are not consistently used

2. **Mock Implementations**:
   - Tests often use mocks in their current directories
   - Moving tests requires migrating or recreating these mocks
   - Some tests have mock dependencies that are hard to identify

3. **Jest Configuration**:
   - Different Jest configs in different locations
   - Tests expect specific Jest settings that vary by location
   - Module resolution paths differ between configurations

4. **Test Classification**:
   - Some tests are priority-based (P0, P1, P2, P3)
   - Others are type-based (unit, integration)
   - Reconciling these approaches is necessary for consistent organization

## Migration Guidelines

Based on our experience, here are guidelines for successful test migration:

### 1. Preparation

1. **Analyze the Test**:
   - Run the test in its current location to verify it works
   - Identify all dependencies (imports, mocks, etc.)
   - Check for any hard-coded paths or environment assumptions

2. **Determine Canonical Location**:
   - For priority-based tests: `/tests/packages/{package}/unit|integration/{module}/{feature}/`
   - For function-specific tests: `/tests/packages/{package}/unit|integration/{module}/{file-being-tested}/`
   - Match existing patterns in the destination directory

3. **Examine Jest Configuration**:
   - Check the Jest config the test currently uses
   - Examine the Jest config in the destination directory
   - Note any differences in module resolution, test environment, etc.

### 2. Migration Process

1. **Create Destination Directory**:
   - Ensure the destination directory exists
   - Follow the established directory structure

2. **Copy the Test**:
   - Copy the test file to the destination
   - Update test location in TEST_DASHBOARD.md
   - Update test location in TEST_CLASSIFICATION.md

3. **Update Import Paths**:
   - Replace relative imports with path aliases where possible
   - For imports from the same package, use `@mexpress/{package}`
   - For imports from another package, use relative paths from the new location

4. **Handle Mocks**:
   - Copy any mock files the test depends on
   - Place mocks in an `__mocks__` directory at the appropriate level
   - Update mock import paths in the test

5. **Adapt to Jest Configuration**:
   - Check for Jest configuration expectations in the test
   - Modify tests to work with the canonical Jest configuration
   - Add any necessary setup code

### 3. Verification

1. **Run the Test**:
   - Run the test in its new location
   - Fix any remaining issues until it passes
   - Compare the output with the original test

2. **Update Dashboard**:
   - Mark the test as migrated in TEST_DASHBOARD.md
   - Update the success status
   - Run the dashboard update script

3. **Remove Original**:
   - Only after verifying the migrated test works
   - Remove the original test file
   - Commit both the new test and the removal of the old one

### 4. Edge Cases and Tips

1. **Tests with Multiple Files**:
   - Some tests have multiple companion files (helpers, data files)
   - Copy all related files to maintain functionality

2. **Shared Functionality**:
   - Look for shared test utilities and migrate them to a common location
   - Create shared mocks for common dependencies

3. **Path Resolution**:
   - Use `path.resolve(__dirname, '..', '..', 'file')` for file system operations
   - Use path aliases for imports where possible

4. **Test Data**:
   - Copy test data files to a corresponding location
   - Update paths to test data in the test files

## Example Migration

Here's an example of migrating a test:

### Original
```typescript
// At: packages/core/tests/p0/core/message-queue-v2.test.ts

import { MessageQueue } from '../../../src/core/message-queue/message-queue-v2';
import { mockTimeProvider } from '../mocks/time-provider.mock';

describe('MessageQueue', () => {
  // Test code
});
```

### Migrated
```typescript
// At: tests/packages/core/unit/core/message-queue/message-queue-v2.test.ts

import { MessageQueue } from '@mexpress/core/core/message-queue/message-queue-v2';
import { mockTimeProvider } from '../../__mocks__/time-provider.mock';

describe('MessageQueue', () => {
  // Test code
});
```

## Conclusion

Test migration is a complex process that requires careful planning and execution. By following these guidelines, we can successfully migrate tests to their canonical locations while maintaining functionality and organization.

Remember:
1. **Analyze** before migrating
2. **Test** in both locations before removing originals
3. **Update** documentation and dashboard
4. **Commit** changes in a clear, traceable way