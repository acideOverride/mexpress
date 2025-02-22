# Test Migration Mapping

## High Priority Files

### Core Package Tests

1. Unit Tests (/packages/core/tests/unit/)
   ```
   # From p0/core -> unit/services/
   - p0/core/auth.service.test.ts -> unit/services/auth.service.test.ts
   - p0/core/customer.service.test.ts -> unit/services/customer.service.test.ts
   - p0/core/environment.test.ts -> unit/config/environment.test.ts
   
   # From p0/models -> unit/models/
   - p0/models/customer.test.ts -> unit/models/customer.test.ts
   
   # From p0/utils -> unit/utils/
   - p0/utils/logger.test.ts -> unit/utils/logger.test.ts
   ```

2. Integration Tests (/packages/core/tests/integration/)
   ```
   # From p0/infrastructure -> integration/services/
   - p0/infrastructure/service-mesh.test.ts -> integration/services/service-mesh.test.ts
   
   # From root level -> integration/
   - federation.test.ts -> integration/federation.test.ts
   - shell.test.ts -> integration/shell.test.ts
   ```

3. Test Helpers (/packages/core/tests/__helpers__/)
   ```
   # From helpers/ -> __helpers__/
   - helpers/db.ts -> __helpers__/db.ts
   - helpers/mongodb.helper.ts -> __helpers__/mongodb.helper.ts
   - helpers/test-setup.ts -> __helpers__/test-setup.ts
   - helpers/types.ts -> __helpers__/types.ts
   
   # From helpers/fixtures -> __helpers__/fixtures/
   - helpers/fixtures/database.ts -> __helpers__/fixtures/database.ts
   
   # From helpers/mocks -> __helpers__/mocks/
   - helpers/mocks/database.ts -> __helpers__/mocks/database.ts
   ```

4. Test Utils (/packages/core/tests/__helpers__/utils/)
   ```
   # From helpers/utils -> __helpers__/utils/
   - helpers/utils/assertions.ts -> __helpers__/utils/assertions.ts
   - helpers/utils/cleanup.ts -> __helpers__/utils/cleanup.ts
   - helpers/utils/setup.ts -> __helpers__/utils/setup.ts
   ```

## Configuration Updates

1. Jest Configs
   ```
   # Update jest.config.js
   - Update testMatch patterns
   - Update moduleNameMapper
   - Update setupFilesAfterEnv
   ```

2. Package Scripts
   ```json
   {
     "scripts": {
       "test:unit": "jest tests/unit",
       "test:integration": "jest tests/integration",
       "test": "jest",
       "test:coverage": "jest --coverage"
     }
   }
   ```

## Cleanup Tasks

1. Remove Old Directories:
   ```
   - /packages/core/tests/p0/
   - /packages/core/src/tests/
   - /packages/core/tests/helpers/
   ```

2. Archive if Needed:
   ```
   - Backup old test structure
   - Keep reference for 1 week
   - Delete after successful migration
   ```

## Validation Steps

1. Pre-Migration:
   ```
   - Run current test suite
   - Record test counts
   - Record coverage metrics
   - Document failing tests
   ```

2. Post-Migration:
   ```
   - Run migrated test suite
   - Compare test counts
   - Compare coverage metrics
   - Verify no new failures
   ```

## Next Steps

1. Start with Core Services:
   ```bash
   # Priority order
   1. Auth service tests
   2. Customer service tests
   3. Infrastructure tests
   4. Utility tests
   ```

2. Then Handle Integration:
   ```bash
   1. Move integration tests
   2. Update configurations
   3. Verify test helpers
   4. Run full suite
   ```

3. Finally:
   ```bash
   1. Remove old structure
   2. Update documentation
   3. Verify CI/CD
   4. Train team