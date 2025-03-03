# Test Directory Structure

Test files and results have been reorganized into a cleaner structure:

## Main Directories

- `/opt/mExpress/tests/results/test-runs`: Consolidated test result files
- `/opt/mExpress/tests/validation`: Test status tracking and documentation

## Key Files

- `/opt/mExpress/tests/results/test-runs/reports/test-status.md`: Overall test status dashboard
- `/opt/mExpress/tests/results/test-runs/reports/brq-mapping.md`: BRQ to test mapping
- `/opt/mExpress/tests/results/test-runs/reports/TEST-FIXES-SUMMARY.md`: Summary of test fixes and issues
- `/opt/mExpress/tests/results/test-runs/reports/TEST-INSTRUCTIONS.md`: Guide for running tests

## Test Results Structure

Test results are organized in `/opt/mExpress/tests/results/test-runs/`:

- `api/`: API test results 
- `customer-service/`: Customer service component test results
- `message-queue/`: Message queue system test results
- `product-catalog/`: Product catalog test results
- `infrastructure/`: Infrastructure service test results
- `utils/`: Utility library test results
- `summary/`: Overall test summaries
- `baseline/`: Initial test baselines
- `reports/`: Test status reports and documentation
- `summary/assessments/`: Detailed assessment reports

## Test Assessment Summary (March 1, 2025)

Our recent assessment shows that 7 out of 40 tests (17.5%) are working correctly with our simplified Jest configuration:

| Component | Working | Total | Success % |
|-----------|---------|-------|-----------|
| API Tests | 6 | 6 | 100% |
| Customer Management | 1 | 4 | 25% |
| Message Queue | 0 | 6 | 0% |
| Product Catalog | 0 | 6 | 0% |
| Infrastructure | 0 | 8 | 0% |
| Utils & Resilience | 0 | 8 | 0% |
| Integration Tests | 0 | 2 | 0% |
| **TOTAL** | **7** | **40** | **17.5%** |

## Common Issues

Most test failures are related to import path issues and module resolution errors:

1. **Import Path Issues** (75% of failures):
   ```
   Cannot find module '../../../../src/git-workflow-automation/src/core/message-queue/message-queue-v2'
   ```

2. **Module Not Found** (20% of failures):
   ```
   Cannot find module '@mexpress/core/lib/monitoring'
   ```

3. **TypeScript Type Errors** (5% of failures)

## Recommended Approach

Follow this approach to fix the failing tests:

1. Start with customer service tests (build on partial success)
2. Create proper Jest config with module mapping
3. Fix message queue tests (key for MEXP-2025-003-BE milestone)
4. Fix remaining tests in priority order
