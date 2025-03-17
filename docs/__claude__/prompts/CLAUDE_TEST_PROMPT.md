  I need you to fix the next failing test by priority in the mExpress project. Please follow these steps:

  1. Follow the TypeScript-first standards in /opt/mExpress/docs/standards/TS_CODE_STANDARDS.md:
     - If the failing test is a JavaScript (.js) file, migrate it to TypeScript (.ts)
     - If there are both .js and .ts versions of the same test, fix the TypeScript version and remove the JavaScript version
     - Follow the correct naming conventions and imports for TypeScript files
     - Ensure paths and dependencies are correctly referenced

  2. When running the test:
     - Always redirect output to /dev/null using the pattern: `> /dev/null 2>&1 && echo "PASSED" || echo "FAILED"`
     - Run tests repeatedly until CONFIRMED passing

  3. Apply the fix strategy from CLAUDE.md:
     - Create mock implementations that match expected interfaces
     - Update import paths to point to correct implementations
     - Ensure interface compatibility with proper TypeScript typing
     - Add proper error handling and test stabilization

  4. After fixing the test:
     - Move the test from the "Failing" section to the "Passing" section in TESTS_STATUS_UNIFIED.md
     - Update the timestamp and summary statistics in TESTS_STATUS_UNIFIED.md
     - Update the "Recent Updates" section with your changes
     - Follow the commit workflow described in CLAUDE.md
     - Use the specified commit message format noting the problem, solution, and related BRQ

  5. Commit your changes with the following format:
  fix(tests): fix [test-name] in [location]

  - Problem: [brief description of the issue]
  - Solution: [what was changed to fix it]
  - Migration: [if applicable, mention JavaScript to TypeScript migration]
  - BRQ: [related BRQ id]

  Please analyze the failing test, identify the issue, and implement the necessary fixes while following the project's TypeScript-first standards and best practices.

  This enhanced prompt:
  1. References the new TypeScript standards document
  2. Explicitly instructs to migrate JavaScript tests to TypeScript
  3. Adds guidelines for handling duplicate JS/TS tests
  4. Emphasizes TypeScript typing in the fix strategy
  5. Adds a "Migration" section to the commit message format for TypeScript migrations
  6. Emphasizes TypeScript-first standards in the final instruction