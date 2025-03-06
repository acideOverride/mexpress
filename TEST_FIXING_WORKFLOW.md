# Test Fixing Workflow

Use this workflow when fixing failing tests in the mExpress project:

1. Check /opt/mExpress/tests/validation/unified/TESTS_STATUS_UNIFIED.md to identify failing tests by priority:
   - P0 (Critical)
   - P1 (High Priority)
   - P2 (Medium Priority)
   - P3 (Low Priority)

2. Follow the test organization standards in CLAUDE.md:
   - Keep tests in their project-specific test directories
   - Follow the correct naming conventions and imports
   - Ensure paths and dependencies are correctly referenced

3. When running the test:
   - Always redirect output to /dev/null using the pattern: `> /dev/null 2>&1 && echo "PASSED" || echo "FAILED"`
   - Run tests repeatedly until CONFIRMED passing

4. Apply the fix strategy from CLAUDE.md:
   - Create mock implementations that match expected interfaces
   - Update import paths to point to correct implementations
   - Ensure interface compatibility
   - Add proper error handling and test stabilization

5. After fixing the test:
   - Move the test from the "Failing" section to the "Passing" section in TESTS_STATUS_UNIFIED.md
   - Update the timestamp, summary statistics, and BRQ coverage
   - Update the "Recent Updates" section with your changes
   - Follow the commit workflow described in CLAUDE.md
   - Use the specified commit message format noting the problem, solution, and related BRQ

6. Commit your changes with the following format:
```
fix(tests): fix [test-name] in [location]

- Problem: [brief description of the issue]
- Solution: [what was changed to fix it]
- BRQ: [related BRQ id]

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>
```

Remember to analyze the failing test, identify the issue, and implement the necessary fixes while following the project's coding standards and best practices.