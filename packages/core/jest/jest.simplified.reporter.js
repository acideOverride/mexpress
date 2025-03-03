/**
 * Simplified Jest reporter for consistent test output
 * Focuses on important information and reduces noise.
 */
class SimplifiedReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options || {};
    this.testResults = [];
    this.startTime = null;
  }

  onRunStart(results, options) {
    this.startTime = new Date();
    console.log('\n🚀 Starting test run...\n');
  }

  onTestResult(test, testResult, aggregatedResult) {
    // Extract important information
    const { numFailingTests, numPassingTests, numPendingTests, testFilePath, testResults } = testResult;
    const relativePath = testFilePath.split('/tests/')[1] || testFilePath;
    
    // Record test result
    this.testResults.push({
      path: relativePath,
      passed: numPassingTests,
      failed: numFailingTests,
      pending: numPendingTests,
      time: testResult.perfStats.end - testResult.perfStats.start,
      milestones: this.extractMilestones(testResult),
      failures: numFailingTests > 0 ? this.extractFailures(testResults) : []
    });
    
    // Output a line for each test file
    const symbol = numFailingTests > 0 ? '❌' : numPendingTests > 0 ? '⚠️' : '✅';
    console.log(`${symbol} ${relativePath}: ${numPassingTests} passed, ${numFailingTests} failed, ${numPendingTests} pending`);
    
    // For failures, output details
    if (numFailingTests > 0) {
      console.log('  Failures:');
      for (const result of testResults) {
        if (result.status === 'failed') {
          console.log(`  - ${result.title} (${result.duration}ms)`);
          console.log(`    ${result.failureMessages[0].split('\n')[0]}`);
        }
      }
      console.log('');
    }
  }

  onRunComplete(contexts, results) {
    const endTime = new Date();
    const duration = (endTime - this.startTime) / 1000;
    
    // Calculate statistics
    const totalTests = results.numTotalTests;
    const passedTests = results.numPassedTests;
    const failedTests = results.numFailedTests;
    const passPercentage = Math.round((passedTests / totalTests) * 100);
    
    // Summary
    console.log('\n----------------------------------------');
    console.log(`TESTS COMPLETE: ${results.success ? 'PASS' : 'FAIL'}`);
    console.log('----------------------------------------');
    console.log(`📊 Test Summary:`);
    console.log(`⏱️  Time: ${duration.toFixed(2)}s`);
    console.log(`📝 Test Suites: ${results.numFailedTestSuites} failed, ${results.numPassedTestSuites} passed, ${results.numTotalTestSuites} total`);
    console.log(`🧪 Tests: ${results.numFailedTests} failed, ${results.numPassedTests} passed, ${results.numPendingTests} pending, ${results.numTotalTests} total`);
    
    // Group by milestone
    const milestoneMap = {};
    for (const result of this.testResults) {
      for (const milestone of result.milestones) {
        if (!milestoneMap[milestone]) {
          milestoneMap[milestone] = { passed: 0, failed: 0, pending: 0, total: 0 };
        }
        milestoneMap[milestone].passed += result.passed;
        milestoneMap[milestone].failed += result.failed;
        milestoneMap[milestone].pending += result.pending;
        milestoneMap[milestone].total += result.passed + result.failed + result.pending;
      }
    }
    
    // Output milestone results if any found
    if (Object.keys(milestoneMap).length > 0) {
      console.log('\n📌 Milestone Coverage:');
      for (const [milestone, stats] of Object.entries(milestoneMap)) {
        const percent = Math.round((stats.passed / stats.total) * 100);
        const symbol = stats.failed > 0 ? '❌' : percent === 100 ? '✅' : '⚠️';
        console.log(`${symbol} ${milestone}: ${stats.passed}/${stats.total} (${percent}%)`);
      }
    }
    
    // Output failures with minimal information
    if (results.numFailedTests > 0) {
      console.log('\n----------------------------------------');
      console.log('FAILED TESTS:');
      console.log('----------------------------------------');
      
      results.testResults.forEach(testResult => {
        if (testResult.numFailingTests > 0) {
          console.log(`\n${testResult.testFilePath}`);
          
          testResult.testResults.forEach(test => {
            if (test.status === 'failed') {
              console.log(`  ✕ ${test.title}`);
              // Print only the first line of the error message
              const errorMessage = test.failureMessages[0].split('\n')[0];
              console.log(`    ${errorMessage}`);
            }
          });
        }
      });
    }
    
    // Overall result
    console.log('\n----------------------------------------');
    console.log(`FINAL RESULT: ${results.success ? 'PASS ✅' : 'FAIL ❌'}`);
    console.log('----------------------------------------');
  }
  
  /**
   * Extract milestone identifiers from test results
   */
  extractMilestones(testResult) {
    try {
      // Read the test file to find milestone headers
      const fs = require('fs');
      const content = fs.readFileSync(testResult.testFilePath, 'utf8');
      
      // Look for BRQ milestone identifiers (MEXP-YYYY-NNN-XXX)
      const milestonePattern = /MEXP-\d{4}-\d{3}-(BE|FE|API|FULL|INFRA|DOC)/g;
      const matches = content.match(milestonePattern) || [];
      
      // Remove duplicates
      return [...new Set(matches)];
    } catch (error) {
      return [];
    }
  }
  
  /**
   * Extract clean failure messages from test results
   */
  extractFailures(testResults) {
    return testResults
      .filter(r => r.status === 'failed')
      .map(r => ({
        title: r.title,
        message: r.failureMessages[0].split('\n')[0].trim()
      }));
  }
}

module.exports = SimplifiedReporter;