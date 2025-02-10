# QA Test Validation Guidelines

## Test Result Processing

### 1. Initial Test Execution
```bash
# Run tests silently and output to coverage file
cd /opt/mExpress && npx jest --silent --coverage --json --outputFile=coverage/coverage.json > /dev/null 2>&1

# Process coverage results
./docs/qa/process-coverage.js
```

### 2. Validation Sequence
1. **Test Results First**
   - Always check test results before any other validation
   - Use processed summary.json for quick overview
   - Block validation if tests are failing

2. **Critical Issues**
   - Runtime errors take priority
   - Failed test suites need immediate attention
   - Missing dependencies must be addressed first

3. **Coverage Analysis**
   - Check coverage metrics only after tests pass
   - Verify against required thresholds
   - Document any coverage gaps

### 3. Common Issues & Solutions

#### Test Environment Issues
- Missing JSDOM: Add to jest.config.js
  ```js
  testEnvironment: 'jsdom'
  ```
- Missing Dependencies: Check package.json
  ```bash
  npm install --save-dev [missing-package]
  ```

#### Test Execution Issues
- Runtime Errors: Check test setup
- TypeScript Errors: Verify tsconfig.json
- Missing Types: Install @types packages

### 4. Validation Report Format
```
Roo: QA
PROJECT: [Project Name]
TASK: [Task Name] - [BRQ-YEAR-NUMBER]
VALIDATION STATUS: [ACCEPTED/REJECTED]

TEST RESULTS:
  Summary:
    - Total Tests: [count]
    - Failed Tests: [count]
    - Runtime Errors: [count]
    - Failed Suites: [count]

  Critical Issues:
    [List major problems]

  Required Fixes:
    [Specific actions needed]
```

### 5. Best Practices

1. **Test Processing**
   - Use process-coverage.js for consistent reporting
   - Focus on failed tests first
   - Document all critical issues

2. **Validation Flow**
   - Never skip test validation
   - Block on critical failures
   - Require fixes before proceeding

3. **Documentation**
   - Keep clear validation records
   - Document all decisions
   - Track recurring issues

### 6. Coverage Filter Configuration

The coverage-filter.json file controls test result processing:
```json
{
  "coverageReporting": {
    "format": "minimal",
    "rules": {
      "includeOnly": {
        "summary": true,
        "failedSuites": true
      }
    }
  }
}
```

### 7. Validation Checklist

Before Starting:
- [ ] Clear test environment
- [ ] Latest code pulled
- [ ] Dependencies installed

Test Execution:
- [ ] Run tests silently
- [ ] Process coverage results
- [ ] Check for critical failures

Validation Steps:
- [ ] Review test summary
- [ ] Analyze failed suites
- [ ] Check coverage metrics
- [ ] Document findings

Report Generation:
- [ ] Include all critical issues
- [ ] Specify required fixes
- [ ] Clear next steps

### 8. Error Categories

1. Critical (Block Validation):
   - Runtime errors
   - Missing dependencies
   - Test environment issues

2. Major (Require Fixes):
   - Failed test suites
   - Coverage below threshold
   - Type system errors

3. Minor (Document for Later):
   - Slow tests
   - Deprecation warnings
   - Style violations

### 9. Maintenance

Regular Tasks:
- Update filter rules as needed
- Review validation guidelines
- Track common issues
- Update documentation

Emergency Response:
- Document critical failures
- Escalate blocking issues
- Track temporary workarounds