const os = require('os');
const fs = require('fs');

// Resource monitoring state
let testStartTime;
let testMemoryStart;
let suiteStartTime;
let suiteMemoryStart;
const resourceLimits = global.__RESOURCE_LIMITS__;
const performanceBaselines = global.__PERFORMANCE_BASELINES__;

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
  const limits = resourceLimits[type];
  const violations = [];

  if (type === 'test') {
    if (metrics.memory > limits.maxSuiteMemory) {
      violations.push(`Memory usage exceeded: ${metrics.memory}MB > ${limits.maxSuiteMemory}MB`);
    }
    if (metrics.duration > limits.maxSuiteDuration) {
      violations.push(`Duration exceeded: ${metrics.duration}ms > ${limits.maxSuiteDuration}ms`);
    }
  } else if (type === 'process') {
    if (metrics.cpu > limits.maxCpuUsage) {
      violations.push(`CPU usage exceeded: ${metrics.cpu}% > ${limits.maxCpuUsage}%`);
    }
    if (metrics.memory > limits.maxMemoryUsage) {
      violations.push(`Memory usage exceeded: ${metrics.memory}% > ${limits.maxMemoryUsage}%`);
    }
  }

  return violations;
};

// Jest lifecycle hooks
beforeAll(() => {
  suiteStartTime = Date.now();
  suiteMemoryStart = getMemoryUsage();
});

afterAll(() => {
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
  fs.appendFileSync('logs/performance.log', JSON.stringify({
    timestamp: new Date().toISOString(),
    metrics,
    violations
  }) + '\n');
});

beforeEach(() => {
  testStartTime = Date.now();
  testMemoryStart = getMemoryUsage();
});

afterEach(() => {
  const testDuration = Date.now() - testStartTime;
  const currentMemory = getMemoryUsage();
  const memoryIncrease = currentMemory.heapUsed - testMemoryStart.heapUsed;

  // Check against performance baselines
  if (testDuration > performanceBaselines.execution.assertion) {
    console.warn(`Test execution time exceeded baseline: ${testDuration}ms > ${performanceBaselines.execution.assertion}ms`);
  }

  if (memoryIncrease > performanceBaselines.memory.maxIncrease) {
    console.warn(`Test memory increase exceeded baseline: ${memoryIncrease}MB > ${performanceBaselines.memory.maxIncrease}MB`);
  }
});