# Test Execution Protocol

## Critical Rule
!! WARNING: TO AVOID HANGING IN ROO CODE, ALWAYS RUN TESTS SILENTLY AND OUTPUT TO FILES !!

## Test Execution Commands
```bash
# Unit Tests
jest --silent --json --outputFile=unit-tests.json

# Coverage Report
jest --silent --coverage --json --outputFile=coverage.json

# Integration Tests
jest --silent --testPathPattern=integration --json --outputFile=integration-tests.json

# E2E Tests
jest --silent --testPathPattern=e2e --json --outputFile=e2e-tests.json
```

## Test Result Processing
```bash
# Process test results silently
node process-test-results.js --input unit-tests.json --output test-summary.json

# Process coverage silently
node process-coverage.js --input coverage.json --output coverage-summary.json
```

## Test Execution Flow
1. Run tests silently with output to files
2. Process results in separate step
3. Read processed results
4. Make decisions based on results

## Example Implementation:
```typescript
// Execute tests
<execute_command>
<command>jest --silent --json --outputFile=test-results.json</command>
</execute_command>

// Read results
<read_file>
<path>test-results.json</path>
</read_file>

// Make decisions based on results
if (results.passed) {
  proceed_with_implementation()
} else {
  fix_failing_tests()
}
```

## Benefits
1. Prevents Roo code hanging
2. Provides clear test results
3. Enables proper decision making
4. Maintains workflow progression

## Integration with QA
1. Test results are documented
2. Coverage is tracked
3. Issues are logged
4. Progress is clear