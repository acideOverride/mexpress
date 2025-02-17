#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read filter rules
const filterConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'coverage-filter.json'), 'utf8')
).coverageReporting;

// Required coverage thresholds from QA rules
const COVERAGE_THRESHOLDS = {
  unit: 90,
  integration: 85,
  e2e: 80,
  critical: 100
};

// Quality gate definitions
const QUALITY_GATES = {
  QG1: {
    name: 'Architecture Compliance',
    checks: ['architecture', 'implementation', 'patterns']
  },
  QG2: {
    name: 'Performance Standards',
    checks: ['performance', 'load', 'resources']
  },
  QG3: {
    name: 'Security Requirements',
    checks: ['security', 'auth', 'authorization']
  },
  QG4: {
    name: 'Integration Verification',
    checks: ['integration', 'communication', 'error-handling']
  }
};

// Validation state tracking
let currentGate = 'QG1';
let validationState = {
  testsExecuted: false,
  coverageVerified: false,
  currentGate: 'QG1',
  gatesPassed: [],
  criticalIssues: [],
  validationLog: []
};

function logValidation(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} [${type.toUpperCase()}] ${message}`;
  
  // Add to validation state
  validationState.validationLog.push(logEntry);
  
  // Write to qa-tests.log
  fs.appendFileSync(
    path.join(process.cwd(), 'logs/qa-tests.log'),
    logEntry + '\n'
  );
}

function validateCoverage(coverageData) {
  const coverage = {
    unit: coverageData.coverageMap?.total?.lines?.pct || 0,
    integration: coverageData.coverageMap?.integration?.lines?.pct || 0,
    e2e: coverageData.coverageMap?.e2e?.lines?.pct || 0,
    critical: coverageData.coverageMap?.critical?.lines?.pct || 0
  };

  const issues = [];
  
  // Check each threshold
  Object.entries(COVERAGE_THRESHOLDS).forEach(([type, required]) => {
    if (coverage[type] < required) {
      issues.push(`${type} coverage (${coverage[type]}%) below required threshold (${required}%)`);
    }
  });

  return {
    coverage,
    issues,
    passed: issues.length === 0
  };
}

function checkQualityGate(gate, coverageData) {
  const gateConfig = QUALITY_GATES[gate];
  if (!gateConfig) {
    throw new Error(`Invalid quality gate: ${gate}`);
  }

  logValidation(`Checking quality gate: ${gate} - ${gateConfig.name}`);
  
  // Verify all required checks
  const issues = [];
  gateConfig.checks.forEach(check => {
    // Add specific check logic here
    // For now, we'll just verify test results
    if (coverageData.numFailedTests > 0) {
      issues.push(`Failed tests prevent passing ${gate}`);
    }
  });

  return {
    gate,
    name: gateConfig.name,
    issues,
    passed: issues.length === 0
  };
}

function processCoverage(coverageData) {
  // Ensure we're following the validation workflow
  if (!validationState.testsExecuted) {
    logValidation('ERROR: Tests must be executed before processing coverage', 'error');
    throw new Error('Validation workflow violation: Tests not executed');
  }

  const summary = {
    total: {
      tests: coverageData.numTotalTests,
      suites: coverageData.numTotalTestSuites
    },
    failed: {
      tests: coverageData.numFailedTests,
      suites: coverageData.numFailedTestSuites,
      runtimeErrors: coverageData.numRuntimeErrorTestSuites
    },
    passed: {
      tests: coverageData.numPassedTests,
      suites: coverageData.numPassedTestSuites
    }
  };

  // Check for critical failures first
  if (summary.failed.runtimeErrors > 0) {
    logValidation('Critical: Runtime errors detected', 'error');
    validationState.criticalIssues.push('Runtime errors must be fixed before proceeding');
  }

  // Process only failed test suites
  const failedSuites = coverageData.testResults
    .filter(suite => suite.status === 'failed')
    .map(suite => ({
      name: suite.name,
      status: suite.status,
      message: suite.message,
      failureMessages: suite.failureMessages,
      // Include only failed tests from failed suites
      failedTests: (suite.assertionResults || [])
        .filter(test => test.status === 'failed')
        .map(test => ({
          title: test.title,
          fullName: test.fullName,
          status: test.status,
          failureMessages: test.failureMessages
        }))
    }));

  // Validate coverage
  const coverageValidation = validateCoverage(coverageData);
  validationState.coverageVerified = true;

  // Check current quality gate
  const gateValidation = checkQualityGate(currentGate, coverageData);
  if (gateValidation.passed) {
    validationState.gatesPassed.push(currentGate);
    // Move to next gate if available
    const gates = Object.keys(QUALITY_GATES);
    const currentIndex = gates.indexOf(currentGate);
    if (currentIndex < gates.length - 1) {
      currentGate = gates[currentIndex + 1];
      validationState.currentGate = currentGate;
    }
  }

  return {
    summary,
    failedSuites,
    coverage: coverageValidation,
    qualityGate: gateValidation,
    validationState
  };
}

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Mark tests as executed
validationState.testsExecuted = true;
logValidation('Starting test result processing');

try {
  // Read coverage data
  const coverageData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'coverage/coverage.json'), 'utf8')
  );

  // Process and write filtered results
  const results = processCoverage(coverageData);
  
  // Write detailed results
  fs.writeFileSync(
    path.join(process.cwd(), 'coverage/summary.json'),
    JSON.stringify(results, null, 2)
  );

  // Log summary
  logValidation('Test Summary:');
  logValidation(`Total Tests: ${results.summary.total.tests}`);
  logValidation(`Failed Tests: ${results.summary.failed.tests}`);
  logValidation(`Runtime Errors: ${results.summary.failed.runtimeErrors}`);
  logValidation(`Failed Suites: ${results.summary.failed.suites}`);

  // Log validation state
  logValidation(`Current Quality Gate: ${results.qualityGate.name}`);
  logValidation(`Gates Passed: ${results.validationState.gatesPassed.join(', ')}`);
  
  if (results.coverage.issues.length > 0) {
    logValidation('Coverage Issues:', 'warning');
    results.coverage.issues.forEach(issue => logValidation(`- ${issue}`, 'warning'));
  }

  if (results.qualityGate.issues.length > 0) {
    logValidation('Quality Gate Issues:', 'error');
    results.qualityGate.issues.forEach(issue => logValidation(`- ${issue}`, 'error'));
  }

} catch (error) {
  logValidation(`Error processing coverage: ${error.message}`, 'error');
  process.exit(1);
}