/**
 * Jest setup file for resource monitoring
 * Tracks resource usage during test execution
 * Enforces resource limits based on test priority
 */

// Import necessary modules
const fs = require('fs');
const path = require('path');

// Create the results directory structure
const resultsDir = path.resolve(process.cwd(), 'tests/results/monitoring');
try {
  fs.mkdirSync(resultsDir, { recursive: true });
} catch (err) {
  // Ignore if directory already exists
}

// Resource stats
let resourceStats = {
  startTime: Date.now(),
  tests: {},
  currentTest: null,
  memoryUsage: [],
  memoryLeaks: [],
  slowTests: [],
  resourceLimitViolations: []
};

// Check environment for test priority
const testPriority = global.__TEST_PRIORITY__ || 'p3';

// Default resource limits by test priority
const resourceLimits = {
  p0: {
    maxDuration: 5000,        // 5 seconds
    maxMemory: 512 * 1024 * 1024, // 512MB
    maxCpu: 0.7,              // 70% CPU
    concurrency: 1            // Sequential execution
  },
  p1: {
    maxDuration: 10000,       // 10 seconds
    maxMemory: 1024 * 1024 * 1024, // 1GB
    maxCpu: 0.7,              // 70% CPU
    concurrency: 2
  },
  p2: {
    maxDuration: 20000,       // 20 seconds
    maxMemory: 1.5 * 1024 * 1024 * 1024, // 1.5GB
    maxCpu: 0.7,              // 70% CPU
    concurrency: 3
  },
  p3: {
    maxDuration: 30000,       // 30 seconds
    maxMemory: 2 * 1024 * 1024 * 1024, // 2GB
    maxCpu: 0.7,              // 70% CPU
    concurrency: 4
  }
};

// Get resource limits from environment if available, otherwise use defaults
const limits = global.__RESOURCE_LIMITS__ || resourceLimits[testPriority];

// Setup hooks
beforeAll(() => {
  resourceStats.startTime = Date.now();
  resourceStats.suite = expect.getState().currentTestName;

  // Write initial resource stats
  const resourceLogFile = path.join(resultsDir, 'resource-usage.json');
  fs.writeFileSync(resourceLogFile, JSON.stringify({
    testSuite: resourceStats.suite,
    startedAt: new Date(resourceStats.startTime).toISOString(),
    priority: testPriority,
    limits
  }, null, 2));
});

// Track each test
beforeEach(() => {
  const testName = expect.getState().currentTestName;
  resourceStats.currentTest = testName;
  resourceStats.tests[testName] = {
    startTime: Date.now(),
    memoryBefore: process.memoryUsage(),
    status: 'running'
  };
});

// Monitor test completion
afterEach(() => {
  const testName = resourceStats.currentTest;
  if (!testName) return;

  const test = resourceStats.tests[testName];
  if (!test) return;

  // Calculate duration
  const endTime = Date.now();
  test.endTime = endTime;
  test.duration = endTime - test.startTime;
  
  // Get memory usage
  test.memoryAfter = process.memoryUsage();
  test.memoryDelta = {
    rss: test.memoryAfter.rss - test.memoryBefore.rss,
    heapTotal: test.memoryAfter.heapTotal - test.memoryBefore.heapTotal,
    heapUsed: test.memoryAfter.heapUsed - test.memoryBefore.heapUsed,
    external: test.memoryAfter.external - test.memoryBefore.external
  };

  // Check for limit violations
  const violations = [];
  
  if (test.duration > limits.maxDuration) {
    violations.push(`Duration limit exceeded: ${test.duration}ms (max: ${limits.maxDuration}ms)`);
    resourceStats.slowTests.push(testName);
  }
  
  if (test.memoryAfter.rss > limits.maxMemory) {
    violations.push(`Memory limit exceeded: ${test.memoryAfter.rss} bytes (max: ${limits.maxMemory} bytes)`);
  }

  if (violations.length > 0) {
    test.violations = violations;
    resourceStats.resourceLimitViolations.push({
      testName,
      violations
    });
  }
  
  test.status = 'completed';
  resourceStats.currentTest = null;
});

// Final reporting
afterAll(() => {
  // Calculate overall stats
  const endTime = Date.now();
  const totalDuration = endTime - resourceStats.startTime;
  
  // Aggregate test results
  const aggregateStats = {
    totalDuration,
    totalTests: Object.keys(resourceStats.tests).length,
    slowTests: resourceStats.slowTests.length,
    resourceViolations: resourceStats.resourceLimitViolations.length,
    memoryLeaks: resourceStats.memoryLeaks.length,
    completedAt: new Date(endTime).toISOString()
  };
  
  // Write final resource stats
  const resourceLogFile = path.join(resultsDir, 'resource-usage-final.json');
  fs.writeFileSync(resourceLogFile, JSON.stringify({
    summary: aggregateStats,
    tests: resourceStats.tests,
    violations: resourceStats.resourceLimitViolations
  }, null, 2));
});