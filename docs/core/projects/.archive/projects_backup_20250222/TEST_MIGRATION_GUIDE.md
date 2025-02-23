# Test Structure Migration Guide

## Overview
This guide outlines the process for migrating existing test files to the new test structure defined in C4_test_standards.md.

## Current Issues
1. Tests scattered across multiple locations:
   - /packages/core/src/tests/
   - /packages/core/tests/p0/
   - /packages/core/tests/unit/
   - /packages/core/tests/integration/

2. Non-standard organization:
   - p0 directory structure
   - Tests inside src directory
   - Inconsistent naming conventions

## Target Structure
```text
/packages/core/
├── src/           # No tests here
└── tests/
    ├── unit/        # Unit tests
    ├── integration/ # Integration tests
    └── __mocks__/   # Shared mocks
```

## Migration Steps

### 1. Test Inventory
1. List all test files:
   ```bash
   - /packages/core/src/tests/**/*.test.ts
   - /packages/core/tests/p0/**/*.test.ts
   - /packages/core/tests/unit/**/*.test.ts
   - /packages/core/tests/integration/**/*.test.ts
   ```

2. Categorize tests:
   ```
   A. Unit Tests
      - Service tests
      - Model tests
      - Utility tests

   B. Integration Tests
      - API tests
      - Database tests
      - External service tests
   ```

### 2. Content Migration

1. Create New Structure:
   ```bash
   mkdir -p packages/core/tests/{unit,integration,__mocks__}
   ```

2. Move Unit Tests:
   - Relocate service tests to tests/unit/services/
   - Relocate model tests to tests/unit/models/
   - Relocate utility tests to tests/unit/utils/

3. Move Integration Tests:
   - Relocate API tests to tests/integration/api/
   - Relocate DB tests to tests/integration/database/
   - Relocate service tests to tests/integration/services/

4. Move Shared Mocks:
   - Consolidate all mocks in tests/__mocks__/
   - Update mock imports in test files

### 3. Configuration Updates

1. Update Jest Config:
   ```javascript
   module.exports = {
     testMatch: [
       '<rootDir>/tests/unit/**/*.test.ts',
       '<rootDir>/tests/integration/**/*.test.ts'
     ],
     moduleNameMapper: {
       '^@mexpress/core/(.*)$': '<rootDir>/src/$1'
     }
   }
   ```

2. Update Test Scripts:
   ```json
   {
     "scripts": {
       "test:unit": "jest tests/unit",
       "test:integration": "jest tests/integration",
       "test": "jest"
     }
   }
   ```

### 4. Quality Verification

1. Test Execution:
   - Run all unit tests
   - Run all integration tests
   - Verify coverage reports
   - Check test timing

2. Code Quality:
   - Consistent naming conventions
   - Proper test organization
   - Clear test descriptions
   - Effective mocking

3. Documentation:
   - Update README files
   - Document test categories
   - Document test helpers
   - Update examples

### 5. Migration Checklist

```markdown
# Pre-Migration
- [ ] Complete test inventory
- [ ] Tests categorized
- [ ] Migration plan reviewed
- [ ] Current tests passing

# Content Migration
- [ ] New structure created
- [ ] Unit tests moved
- [ ] Integration tests moved
- [ ] Mocks consolidated
- [ ] Imports updated

# Configuration
- [ ] Jest config updated
- [ ] Scripts updated
- [ ] Build process verified
- [ ] CI/CD updated

# Quality Verification
- [ ] All tests passing
- [ ] Coverage maintained
- [ ] Standards followed
- [ ] Documentation updated
```

## Timeline

1. High Priority:
   - Move tests out of src/
   - Reorganize p0 tests
   - Update jest configuration
   - Fix broken imports

2. Medium Priority:
   - Consolidate test helpers
   - Improve test documentation
   - Update CI/CD pipelines
   - Optimize test performance

3. Low Priority:
   - Refactor complex tests
   - Add more test examples
   - Enhance test utilities
   - Add performance tests

## Support and Resources

1. Reference Documentation:
   - C4_test_standards.md
   - Jest documentation
   - Testing best practices

2. Tools:
   - Jest test framework
   - Test coverage tools
   - Migration scripts

3. Contact Points:
   - Test framework team
   - CI/CD team
   - Quality assurance

## Post-Migration Tasks

1. Cleanup:
   - Remove old test directories
   - Delete unused test files
   - Archive old test structure
   - Update .gitignore

2. Process Updates:
   - Update test guidelines
   - Train team on new structure
   - Update PR templates
   - Update test review process

3. Monitoring:
   - Track test execution times
   - Monitor coverage metrics
   - Collect feedback
   - Plan improvements