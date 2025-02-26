import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Configuration
const config = {
  testFile: 'src/components/customers/__tests__/CustomerList.test.tsx',
  outputDirs: {
    p0: '/opt/mExpress/projects/montpc_crm/frontend/tests/results/p0',
    summary: '/opt/mExpress/projects/montpc_crm/frontend/tests/results/summary'
  },
  coverage: true
};

// Ensure output directories exist
Object.values(config.outputDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Common Jest arguments
const jestBin = path.resolve('./node_modules/.bin/jest');
const commonArgs = [
  config.testFile,
  '--silent',
  '--testLocationInResults=false'
];

// Run test for JSON output
const jsonResult = spawnSync(jestBin, [
  ...commonArgs,
  '--json'
], { encoding: 'utf8' });

if (jsonResult.stdout) {
  try {
    // Parse and save JSON result
    const testResults = JSON.parse(jsonResult.stdout);
    fs.writeFileSync(
      `${config.outputDirs.summary}/test-results.json`, 
      JSON.stringify(testResults, null, 2)
    );
    console.log('✅ Test results JSON saved');
    
    // Save summary metrics in a simple format
    const metrics = {
      numTotalTests: testResults.numTotalTests,
      numPassedTests: testResults.numPassedTests,
      numFailedTests: testResults.numFailedTests,
      numPendingTests: testResults.numPendingTests,
      testSuites: testResults.numTotalTestSuites,
      executionTime: testResults.startTime ? 
        (testResults.endTime - testResults.startTime) / 1000 : 0
    };
    
    fs.writeFileSync(
      `${config.outputDirs.p0}/test.log`, 
      `Total tests: ${metrics.numTotalTests}\n` +
      `Passed: ${metrics.numPassedTests}\n` +
      `Failed: ${metrics.numFailedTests}\n` +
      `Execution time: ${metrics.executionTime.toFixed(2)}s`
    );
    console.log('✅ Test summary log saved');
    
  } catch (error) {
    console.error('Error parsing JSON output:', error);
    fs.writeFileSync(`${config.outputDirs.p0}/error.log`, error.toString());
  }
} else {
  console.error('No JSON output received');
  fs.writeFileSync(`${config.outputDirs.p0}/error.log`, 'No JSON output received');
}

// Run test with coverage
if (config.coverage) {
  const coverageResult = spawnSync(jestBin, [
    ...commonArgs,
    '--coverage',
    '--coverageReporters=json-summary',
    `--coverageDirectory=${config.outputDirs.summary}`
  ], { encoding: 'utf8' });
  
  // Check if coverage-summary.json was created
  const coverageSummaryPath = `${config.outputDirs.summary}/coverage-summary.json`;
  if (fs.existsSync(coverageSummaryPath)) {
    try {
      const coverageSummary = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'));
      
      // Create a metrics summary for the coverage
      const total = coverageSummary.total || {};
      const metrics = {
        statements: total.statements?.pct || 0,
        branches: total.branches?.pct || 0,
        functions: total.functions?.pct || 0,
        lines: total.lines?.pct || 0
      };
      
      // Write metrics to file
      fs.writeFileSync(
        `${config.outputDirs.summary}/test-metrics.json`,
        JSON.stringify({
          testResults: {
            totalTests: jsonResult.stdout ? JSON.parse(jsonResult.stdout).numTotalTests : 0,
            passedTests: jsonResult.stdout ? JSON.parse(jsonResult.stdout).numPassedTests : 0,
            failedTests: jsonResult.stdout ? JSON.parse(jsonResult.stdout).numFailedTests : 0,
            pendingTests: jsonResult.stdout ? JSON.parse(jsonResult.stdout).numPendingTests : 0,
            skippedTests: jsonResult.stdout ? JSON.parse(jsonResult.stdout).numTotalSkippedTests || 0 : 0
          },
          coverage: {
            statements: metrics.statements,
            branches: metrics.branches,
            functions: metrics.functions,
            lines: metrics.lines
          },
          qualityGates: {
            coverageThreshold: {
              statements: 80,
              branches: 70,
              functions: 80,
              lines: 80
            },
            status: metrics.statements >= 80 && 
                   metrics.branches >= 70 && 
                   metrics.functions >= 80 && 
                   metrics.lines >= 80 ? "PASSED" : "FAILED"
          }
        }, null, 2)
      );
      console.log('✅ Coverage metrics saved');
      
      // Generate a human-readable coverage report
      fs.writeFileSync(
        `${config.outputDirs.p0}/coverage-text.log`,
        `Coverage Summary:\n` +
        `Statements: ${metrics.statements.toFixed(1)}%\n` +
        `Branches  : ${metrics.branches.toFixed(1)}%\n` +
        `Functions : ${metrics.functions.toFixed(1)}%\n` +
        `Lines     : ${metrics.lines.toFixed(1)}%\n\n` +
        `Quality Gate Status: ${metrics.statements >= 80 && 
                                metrics.branches >= 70 && 
                                metrics.functions >= 80 && 
                                metrics.lines >= 80 ? "PASSED" : "FAILED"}`
      );
      console.log('✅ Coverage text report saved');
      
    } catch (error) {
      console.error('Error processing coverage data:', error);
      fs.writeFileSync(`${config.outputDirs.p0}/coverage-error.log`, error.toString());
    }
  } else {
    console.error('No coverage summary file found');
    fs.writeFileSync(`${config.outputDirs.p0}/coverage-error.log`, 'No coverage summary file found');
  }
}

console.log('✅ All test operations completed');