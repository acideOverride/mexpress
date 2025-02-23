Roo: QA -> CODE HANDOFF
PROJECT: montpc_crm
TASK: Test Migration Execution - BRQ-2025-002
STATUS: READY FOR EXECUTION
CHAIN ID: QA-CODE-TEST-2025-002

VALIDATION CHAIN:
  Complete Flow:
    1. GPM -> QA (Migration Planning)
    2. QA -> CODE (Test Execution)
    3. CODE -> QA (Results Verification)

EVIDENCE PACKAGE:
  Documentation:
    - Test Migration Guide: /docs/core/projects/TEST_MIGRATION_GUIDE.md
    - Migration Mapping: /docs/core/projects/TEST_MIGRATION_MAPPING.md
    - Migration Summary: /docs/core/projects/TEST_MIGRATION_SUMMARY.md
    - Execution Validation: /docs/projects/montpc_crm/qa/test-execution-validation.md

EXECUTION REQUIREMENTS:

1. Environment Setup:
   ```bash
   cd /opt/mExpress/packages/core
   npm clean-install
   npm run clean
   ```

2. Pre-Migration Validation:
   ```bash
   # Collect metrics
   npm test -- --coverage --json --outputFile=pre-migration-metrics.json
   ```

3. Migration Execution:
   ```bash
   # Execute migration with verification
   ./scripts/verify-test-migration.sh
   ```

4. Post-Migration Validation:
   ```bash
   # Verify results
   npm test -- --coverage --json --outputFile=post-migration-metrics.json
   ```

QUALITY GATES:

1. Pre-Execution:
   - Clean environment verified
   - Current metrics collected
   - Backups confirmed
   - Documentation reviewed

2. During Execution:
   - Migration script logs
   - Structure changes tracked
   - Error monitoring active
   - Backup creation confirmed

3. Post-Execution:
   - All tests passing
   - Coverage maintained
   - Structure compliant
   - Documentation updated

EVIDENCE COLLECTION:

1. Required Metrics:
   - Test execution results
   - Coverage reports
   - Structure verification
   - Error logs (if any)

2. Required Documentation:
   - Updated test documentation
   - Migration results
   - Structure changes
   - Issue resolutions

VALIDATION REQUIREMENTS:

1. Structure Compliance:
   - No tests in src/
   - Standard directory structure
   - Proper test categorization
   - Clean import paths

2. Test Integrity:
   - All tests passing
   - Coverage maintained
   - Execution time stable
   - No new errors

3. Documentation Updates:
   - Test documentation current
   - README files updated
   - Migration results documented
   - Issues documented

HANDOFF COMPLETION CRITERIA:
1. All tests executed successfully
2. Coverage metrics maintained
3. Structure compliance verified
4. Documentation updated
5. Results properly documented

NEXT STEPS:
1. Execute pre-migration validation
2. Perform migration
3. Execute post-migration validation
4. Document results
5. Return to QA for verification

BLOCKERS: None
DEPENDENCIES: Jest test framework

CHAIN POSITION: QA -> CODE
EVIDENCE PACKAGE: TEST-MIG-2025-002