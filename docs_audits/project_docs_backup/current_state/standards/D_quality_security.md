# QUALITY AND SECURITY

## Test Execution Standards

1. Token-Efficient Test Configuration:
```javascript
// jest.config.js
module.exports = {
  // Core Configuration
  silent: true, // Reduce console output
  verbose: false, // Disable verbose mode
  
  // Coverage Configuration
  coverageDirectory: 'logs', // Store in logs directory
  coverageReporters: ['text-summary'], // Use minimal reporter
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};
```

2. Test Output Management:
```bash
# Directory Structure
/logs/
  ├── test-status.log    # Basic PASS/FAIL status
  ├── test-errors.log    # Error messages only
  └── coverage-summary.log # Coverage percentages only
```

3. Test Execution Commands:
```json
{
  "scripts": {
    "test": "jest --silent > logs/test-status.log",
    "test:coverage": "jest --silent --coverage --coverageReporters=\"text-summary\" > logs/coverage-summary.log",
    "test:ci": "jest --silent --coverage --ci > logs/test-status.log 2> logs/test-errors.log"
  }
}
```

4. Context Management:
- Monitor context usage before operations
- Break large test suites into chunks
- Use incremental testing approach
- Avoid large JSON outputs

5. Test Output Guidelines:
- Use silent mode by default
- Redirect output to log files
- Use text-summary for coverage
- Avoid JSON reporters
- Implement threshold-based validation

[Rest of existing D_quality_security.md content...]
