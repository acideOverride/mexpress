# Jerome Bikes Project

## Project Test Status

As part of our AMTC workflow (Architecture, Milestones, Tasks, Checklists), we've implemented project-specific test status tracking. This allows teams to focus on the test status of their specific project without the noise of the entire platform.

### Test Status Files

The following files provide comprehensive test status information for the Jerome Bikes project:

- **_tests/PRE_TEST_METRICS.md**: Contains pre-test metrics like test distribution, component areas, test types, etc.
- **_tests/PROJECT_TESTS_LIST.md**: Lists all test files with their categorization and metadata
- **_tests/TESTS_STATUS.md**: Shows test execution status and results with detailed statistics

These files are located in: `/opt/mExpress/docs/jerome_bikes/_tests/`

### Running Project-Specific Tests

We've created dedicated scripts for project-specific test execution:

```bash
# Run all tests for Jerome Bikes with comprehensive reporting
/opt/mExpress/scripts/testScripts/x_run_project_tests.sh jerome_bikes

# Run only P0 tests
/opt/mExpress/scripts/testScripts/x_run_project_tests.sh jerome_bikes --priority=P0

# Run maximum 10 tests in shuffled order
/opt/mExpress/scripts/testScripts/x_run_project_tests.sh jerome_bikes --max-tests=10 --shuffle
```

### Test Reports

After running tests, you'll find detailed reports in:
- `/opt/mExpress/docs/jerome_bikes/_tests/TESTS_STATUS.md`

This report includes:
- Test pass/fail status
- Test execution time
- Error types for failing tests
- Component area and test type statistics
- Priority-based status information
- File type distribution
- Test execution progress

### Integration with AMTC

These test status files integrate with our AMTC workflow:
1. Reference them in your CHECKLIST.md to track test status
2. Include them in task planning and implementation
3. Use them as a basis for refactoring decisions

This project-specific approach complements the unified test status framework while providing focused visibility on Jerome Bikes tests.