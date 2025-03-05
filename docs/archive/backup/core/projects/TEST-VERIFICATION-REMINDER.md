# MILESTONE TEST VERIFICATION - STRICT PROTOCOL

## CARDINAL RULES - NEVER FORGET
1. ⚠️ NEVER output test results to console - WILL CAUSE VSCODE HANGING
2. ⚠️ NEVER fabricate or assume test results - MUST have log evidence
3. ⚠️ NEVER reference log files that don't exist - CHECK all paths
4. ⚠️ NEVER claim tests pass without verified evidence

## TEST EXECUTION PROTOCOL
1. Create proper directory structure:
   ```bash
   mkdir -p packages/core/tests/results/BRQ-XXXX/{p0,p1,p2,p3,summary}
   ```

2. Run individual priority-level tests SEPARATELY:
   ```bash
   NODE_ENV=test npx jest --config packages/core/jest/jest.config.p0.js "pattern" --silent > packages/core/tests/results/BRQ-XXXX/p0/results.log 2>/dev/null
   NODE_ENV=test npx jest --config packages/core/jest/jest.config.p1.js "pattern" --silent > packages/core/tests/results/BRQ-XXXX/p1/results.log 2>/dev/null
   NODE_ENV=test npx jest --config packages/core/jest/jest.config.p2.js "pattern" --silent > packages/core/tests/results/BRQ-XXXX/p2/results.log 2>/dev/null
   NODE_ENV=test npx jest --config packages/core/jest/jest.config.p3.js "pattern" --silent > packages/core/tests/results/BRQ-XXXX/p3/results.log 2>/dev/null
   ```

3. Run all priorities TOGETHER for combined report:
   ```bash
   NODE_ENV=test npx jest "pattern" --silent > packages/core/tests/results/BRQ-XXXX/summary/all-tests.log 2>/dev/null
   ```

4. Verify test results by examining log files BEFORE updating documentation
5. After 3 failed attempts on a test, send to DEBUGGER
6. Document all failures honestly and accurately

## C4 STANDARDS COMPLIANCE
- Follow test directory structure (Section 1.1)
- Respect priority levels (Section 1.2):
  * P0: Critical path, sequential execution
  * P1: High priority, max 2 concurrent
  * P2: Medium priority, max 3 concurrent
  * P3: Low priority, max 4 concurrent
- Manage resources properly (Section 1.3)
- CRITICAL: Comply with Output Management (Section 4.4)

## OUTPUT MANAGEMENT (SECTION 4.4)
- NEVER output to terminal/console
- ALL output MUST be redirected to files
- Use silent execution mode (--silent flag)
- ALWAYS redirect stderr to /dev/null
- Follow test directory structure
- Maintain proper hierarchy
- Clean up logs regularly

## VERIFICATION STANDARDS
- Run each test independently
- Check actual test results in log files
- Document ALL test outcomes honestly
- Fix one test at a time
- Send to DEBUGGER after 3 failed attempts

I will strictly follow this protocol throughout the verification task without exception.