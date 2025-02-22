const os = require('os');
const fs = require('fs');

// Default configuration
const DEFAULT_RESOURCE_LIMITS = {
  test: {
    maxSuiteMemory: 2048,    // 2GB
    maxSuiteDuration: 300000, // 5 minutes
    maxConcurrentSuites: 4
  },
  process: {
    maxCpuUsage: 70,     // 70%
    maxMemoryUsage: 80,  // 80%
    maxFileDescriptors: 1000
  }
};

const DEFAULT_PERFORMANCE_BASELINES = {
  execution: {
    setup: 100,      // 100ms
    teardown: 100,   // 100ms
    assertion: 50    // 50ms
  },
  memory: {
    baselineUsage: 256,  // 256MB
    maxIncrease: 512     // 512MB
  },
  throughput: {
    testsPerSecond: 10,
    suitesPerMinute: 2
  }
};

// Resource monitoring state
let testStartTime;
let testMemoryStart;
let suiteStartTime;
let suiteMemoryStart;
const resourceLimits = global.__RESOURCE_LIMITS__ || DEFAULT_RESOURCE_LIMITS;
const performanceBaselines = global.__PERFORMANCE_BASELINES__ || DEFAULT_PERFORMANCE_BASELINES;

// Utility functions
const getMemoryUsage = () => {
  const used = process.memoryUsage();
  return {
    heapUsed: Math.round(used.heapUsed / 1024 / 1024), // MB
    heapTotal: Math.round(used.heapTotal / 1024 / 1024), // MB
    external: Math.round(used.external / 1024 / 1024), // MB
    rss: Math.round(used.rss / 1024 / 1024) // MB
  };
};

const getCpuUsage = () => {
  const cpus = os.cpus();
  const totalCpu = cpus.reduce((acc, cpu) => {
    acc.user += cpu.times.user;
    acc.system += cpu.times.system;
    acc.idle += cpu.times.idle;
    return acc;
  }, { user: 0, system: 0, idle: 0 });

  const total = totalCpu.user + totalCpu.system + totalCpu.idle;
  return ((totalCpu.user + totalCpu.system) / total) * 100;
};

const checkResourceLimits = (type, metrics) => {
  if (!resourceLimits || !resourceLimits[type]) {
    console.warn(`No resource limits defined for type: ${type}, using defaults`);
    return [];
  }

  const limits = resourceLimits[type];
  const violations = [];

  try {
    if (type === 'test' && metrics && limits) {
      if (metrics.memory && limits.maxSuiteMemory && metrics.memory > limits.maxSuiteMemory) {
        violations.push(`Memory usage exceeded: ${metrics.memory}MB > ${limits.maxSuiteMemory}MB`);
      }
      if (metrics.duration && limits.maxSuiteDuration && metrics.duration > limits.maxSuiteDuration) {
        violations.push(`Duration exceeded: ${metrics.duration}ms > ${limits.maxSuiteDuration}ms`);
      }
    } else if (type === 'process' && metrics && limits) {
      if (metrics.cpu && limits.maxCpuUsage && metrics.cpu > limits.maxCpuUsage) {
        violations.push(`CPU usage exceeded: ${metrics.cpu}% > ${limits.maxCpuUsage}%`);
      }
      if (metrics.memory && limits.maxMemoryUsage && metrics.memory > limits.maxMemoryUsage) {
        violations.push(`Memory usage exceeded: ${metrics.memory}% > ${limits.maxMemoryUsage}%`);
      }
    }
  } catch (error) {
    console.warn(`Error checking resource limits: ${error.message}`);
  }

  return violations;
};

// Jest lifecycle hooks
beforeAll(() => {
  suiteStartTime = Date.now();
  suiteMemoryStart = getMemoryUsage();
});

afterAll(done => {
  const suiteDuration = Date.now() - suiteStartTime;
  const currentMemory = getMemoryUsage();
  const memoryIncrease = currentMemory.heapUsed - suiteMemoryStart.heapUsed;

  const metrics = {
    duration: suiteDuration,
    memory: currentMemory.heapUsed,
    memoryIncrease,
    cpu: getCpuUsage()
  };

  const violations = [
    ...checkResourceLimits('test', metrics),
    ...checkResourceLimits('process', {
      cpu: metrics.cpu,
      memory: (currentMemory.heapUsed / os.totalmem()) * 100
    })
  ];

  if (violations.length > 0) {
    console.error('Resource limit violations:', violations);
    process.exit(1);
  }

  // Log performance metrics
  const performanceStream = fs.createWriteStream('logs/performance.log', { flags: 'a' });
  performanceStream.write(JSON.stringify({
    timestamp: new Date().toISOString(),
    metrics,
    violations
  }) + '\n');

  // Ensure stream is closed before completing
  performanceStream.end(() => {
    // Clean up any remaining handles
    performanceStream.removeAllListeners();
    done();
  });
});

beforeEach(() => {
  testStartTime = Date.now();
  testMemoryStart = getMemoryUsage();
});

afterEach(done => {
  try {
    const testDuration = Date.now() - testStartTime;
    const currentMemory = getMemoryUsage();
    const memoryIncrease = currentMemory.heapUsed - testMemoryStart.heapUsed;

    // Check against performance baselines with safety checks
    if (performanceBaselines?.execution?.assertion !== undefined &&
        testDuration > performanceBaselines.execution.assertion) {
      console.warn(`Test execution time exceeded baseline: ${testDuration}ms > ${performanceBaselines.execution.assertion}ms`);
    }

    if (performanceBaselines?.memory?.maxIncrease !== undefined &&
        memoryIncrease > performanceBaselines.memory.maxIncrease) {
      console.warn(`Test memory increase exceeded baseline: ${memoryIncrease}MB > ${performanceBaselines.memory.maxIncrease}MB`);
    }

    // Log test performance data
    const testStream = fs.createWriteStream('logs/test-performance.log', { flags: 'a' });
    testStream.write(JSON.stringify({
      timestamp: new Date().toISOString(),
      duration: testDuration,
      memoryIncrease,
      thresholds: {
        duration: performanceBaselines?.execution?.assertion,
        memory: performanceBaselines?.memory?.maxIncrease
      }
    }) + '\n');

    // Ensure stream is closed before completing
    testStream.end(() => {
      testStream.removeAllListeners();
      done();
    });
  } catch (error) {
    console.warn(`Error in performance monitoring: ${error.message}`);
    done();
  }
});