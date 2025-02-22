Roo: QA/CODE REPORT
PROJECT: montpc_crm
TASK: Test Migration Validation - BRQ-2025-002
RECEIVED FROM: GPM
SCOPE: Test Structure Migration

MONOREPO CONTEXT:
  Package: core
  Version: 1.0.0
  Dependencies: jest, testing-library
  API_Status: Non-Breaking
  Integration: Test framework

IMPLEMENTATION STATUS:
  Package Level:
    Quality:
      - Test Organization: Requires Migration
      - Test Coverage: Must Maintain
      - Test Standards: Must Align
      - Integration: Must Verify
    Coverage:
      - Unit Tests: Must Preserve
      - Integration Tests: Must Preserve
      - Component Tests: Must Preserve
    Documentation:
      - Test Documentation: Must Update
      - Coverage Reports: Must Maintain
      - Migration Docs: Complete
    Standards:
      - Test Standards: C4_test_standards.md
      - Migration Standards: Verified
      - Documentation Standards: Complete

  System Level:
    Quality:
      - Cross-Package Tests: Must Verify
      - Build Pipeline: Must Maintain
      - System Tests: Must Preserve
    Coverage:
      - Cross-Package Coverage: Must Maintain
      - Build Coverage: Must Verify
      - System Coverage: Must Preserve
    Documentation:
      - Migration Guide: Complete
      - Test Structure: Must Update
      - Coverage Reports: Must Preserve
    Standards:
      - Monorepo Standards: Must Follow
      - Test Standards: Must Implement
      - Documentation: Must Update

VERIFICATION REQUIREMENTS:

1. Pre-Migration Validation:
   - Document current test structure
   - Record current test counts
   - Capture coverage metrics
   - Log test execution times
   - Document dependencies

2. Migration Process Validation:
   - Verify backup creation
   - Monitor file movements
   - Track structure changes
   - Validate import updates
   - Check cleanup operations

3. Post-Migration Validation:
   - Verify new structure
   - Compare test counts
   - Validate coverage metrics
   - Check execution times
   - Verify dependencies

TEST EXECUTION PROTOCOL:

1. Pre-Execution Requirements:
   - Clean test environment
   - Fresh dependency installation
   - Clear cache directories
   - Reset coverage reports
   - Backup current state

2. Execution Steps:
   ```bash
   # Step 1: Environment Setup
   npm clean-install
   npm run clean

   # Step 2: Pre-Migration Tests
   npm test -- --coverage

   # Step 3: Migration Execution
   ./scripts/migrate-tests.sh

   # Step 4: Post-Migration Tests
   npm test -- --coverage
   ```

3. Validation Points:
   - Test count comparison
   - Coverage metric comparison
   - Execution time comparison
   - Error count comparison
   - Structure verification

QUALITY GATES:

1. Pre-Migration:
   - All current tests passing
   - Coverage meets thresholds
   - Documentation complete
   - Backup verified

2. During Migration:
   - No data loss
   - Structure maintained
   - Imports updated
   - Backups created

3. Post-Migration:
   - All tests passing
   - Coverage maintained
   - Structure compliant
   - Documentation updated

EVIDENCE REQUIREMENTS:

1. Test Metrics:
   - Test counts (before/after)
   - Coverage reports (before/after)
   - Execution times (before/after)
   - Error logs (if any)

2. Structure Evidence:
   - Directory listings (before/after)
   - Import validations
   - Backup confirmations
   - Cleanup verifications

3. Documentation:
   - Updated test documentation
   - Migration results
   - Structure changes
   - Issue resolutions

VERIFICATION CHAIN:
  Position: QA/CODE REPORT
  History: GPM -> QA -> CODE
  Evidence: Test migration preparation
  Flow: Validation required before execution

NEXT STEPS:
1. Review this validation plan
2. Execute pre-migration checks
3. Perform monitored migration
4. Execute post-migration validation
5. Document results
6. Update test documentation

BLOCKERS: None
DEPENDENCIES: Jest test framework

RECOMMENDATION:
Proceed with test migration only after:
1. Full validation plan review
2. Pre-migration metrics collection
3. Backup verification
4. Environment preparation

Chain Position: QA -> CODE
Evidence Package: TEST-MIG-2025-002