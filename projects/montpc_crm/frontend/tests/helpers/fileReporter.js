export default class FileReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options || {};
    this.outputFile = options.outputFile || 'test-results.json';
    this.coverageFile = options.coverageFile || 'coverage.json';
  }

  onRunComplete(contexts, results) {
    const fs = require('fs');
    const path = require('path');
    
    // Create output directories if they don't exist
    const outputDir = path.dirname(this.outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Extract key test results
    const testData = {
      numTotalTests: results.numTotalTests,
      numPassedTests: results.numPassedTests,
      numFailedTests: results.numFailedTests,
      numPendingTests: results.numPendingTests,
      testResults: results.testResults.map(testResult => ({
        name: testResult.testFilePath,
        status: testResult.numFailingTests === 0 ? 'passed' : 'failed',
        startTime: testResult.perfStats.start,
        endTime: testResult.perfStats.end,
        duration: testResult.perfStats.end - testResult.perfStats.start,
        testResults: testResult.testResults.map(test => ({
          title: test.title,
          status: test.status,
          duration: test.duration,
          failureMessages: test.failureMessages
        }))
      }))
    };
    
    // Write test results to file
    fs.writeFileSync(this.outputFile, JSON.stringify(testData, null, 2));
    
    // Write coverage summary if available
    if (results.coverageMap) {
      try {
        const coverageDir = path.dirname(this.coverageFile);
        if (!fs.existsSync(coverageDir)) {
          fs.mkdirSync(coverageDir, { recursive: true });
        }
        
        const coverageSummary = results.coverageMap.getCoverageSummary();
        const coverageData = {
          statements: {
            pct: coverageSummary.statements.pct,
            covered: coverageSummary.statements.covered,
            total: coverageSummary.statements.total
          },
          branches: {
            pct: coverageSummary.branches.pct,
            covered: coverageSummary.branches.covered, 
            total: coverageSummary.branches.total
          },
          functions: {
            pct: coverageSummary.functions.pct,
            covered: coverageSummary.functions.covered,
            total: coverageSummary.functions.total
          },
          lines: {
            pct: coverageSummary.lines.pct,
            covered: coverageSummary.lines.covered,
            total: coverageSummary.lines.total
          }
        };
        
        fs.writeFileSync(this.coverageFile, JSON.stringify(coverageData, null, 2));
      } catch (error) {
        console.error('Error writing coverage data', error);
      }
    }
    
    // Also write a human-readable test summary
    const summaryFile = path.join(path.dirname(this.outputFile), 'test-summary.txt');
    const summary = `
Test Results:
- Total Tests: ${results.numTotalTests}
- Passed Tests: ${results.numPassedTests}
- Failed Tests: ${results.numFailedTests}
- Pending Tests: ${results.numPendingTests}
- Test Suites: ${results.numTotalTestSuites}
- Runtime: ${(results.startTime && results.endTime) ? 
    ((results.endTime - results.startTime) / 1000).toFixed(2) + 's' : 'unknown'}

Coverage Summary:
${results.coverageMap ? 
  `- Statements: ${results.coverageMap.getCoverageSummary().statements.pct.toFixed(2)}%
- Branches: ${results.coverageMap.getCoverageSummary().branches.pct.toFixed(2)}%
- Functions: ${results.coverageMap.getCoverageSummary().functions.pct.toFixed(2)}%
- Lines: ${results.coverageMap.getCoverageSummary().lines.pct.toFixed(2)}%` 
  : '- No coverage data available'}
`;
    
    fs.writeFileSync(summaryFile, summary);
  }
}