# Test Execution Protocol

## Efficient Test Output Guidelines

1. Test Command Structure
   ```bash
   # DO NOT USE - Token Heavy
   npx jest --coverage --json --outputFile=coverage/coverage.json

   # USE INSTEAD - Token Efficient
   npx jest --silent > logs/test-status.log
   ```

2. Coverage Checks
   ```bash
   # DO NOT USE - Generates large JSON
   npx jest --coverage --json

   # USE INSTEAD - Simple text output
   npx jest --coverage --coverageReporters="text-summary" > logs/coverage-summary.log
   ```

3. Error Tracking
   ```bash
   # DO NOT USE - Full JSON error details
   npx jest --json

   # USE INSTEAD - Simple error logging
   npx jest --silent --verbose false 2> logs/test-errors.log
   ```

4. Test Result Processing
   - Store only essential information:
     * Total tests run
     * Pass/Fail status
     * Failed test names
     * Basic error messages

5. Coverage Validation
   - Use threshold checks instead of full reports:
   ```bash
   npx jest --silent --coverage --coverageThreshold='{"global":{"statements":90,"branches":85,"functions":90,"lines":90}}'
   ```

6. File Organization
   /logs/
   - test-status.log: Simple PASS/FAIL status
   - test-errors.log: Basic error messages
   - coverage-summary.log: Coverage percentages only

## Implementation in Code Mode

1. Test Execution
   ```typescript
   // DO NOT USE
   execute_command('npx jest --coverage --json --outputFile=coverage/coverage.json')

   // USE INSTEAD
   execute_command('cd /opt/mExpress && npx jest --silent --verbose false > logs/test-status.log')
   ```

2. Error Checking
   ```typescript
   // DO NOT USE
   read_file('/opt/mExpress/coverage/coverage.json')

   // USE INSTEAD
   read_file('/opt/mExpress/logs/test-status.log')
   ```

3. Coverage Validation
   ```typescript
   // DO NOT USE
   execute_command('npx jest --coverage --json')

   // USE INSTEAD
   execute_command('cd /opt/mExpress && npx jest --silent --coverage --coverageReporters="text-summary" > logs/coverage-summary.log')
   ```

IMPORTANT: Never generate or read large JSON coverage files. Focus on minimal, essential test output that provides pass/fail status and basic coverage metrics.