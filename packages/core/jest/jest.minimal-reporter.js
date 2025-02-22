const os = require('os');
const path = require('path');

class MinimalReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
    this.startTime = Date.now();
    this.startMemory = process.memoryUsage().heapUsed;
    this.results = {
      suite: '',
      stats: {
        total: 0,
        passed: 0,
        failed: 0,
        duration: 0
      },
      tests: [],
      performance: {
        memory: {
          start: this.startMemory,
          end: 0,
          used: 0
        },
        cpu: {
          usage: 0
        },
        duration: 0
      }
    };
  }

  onRunStart() {
    this.startTime = Date.now();
    this.startMemory = process.memoryUsage().heapUsed;
  }

  onTestStart(test) {
    test.startTime = Date.now();
    test.startMemory = process.memoryUsage().heapUsed;
  }

  onTestResult(test, testResult) {
    const endMemory = process.memoryUsage().heapUsed;
    const duration = Date.now() - test.startTime;
    const memoryUsed = endMemory - test.startMemory;

    // Extract test info from file path
    const filePath = testResult.testFilePath;
    const fileNameMatch = filePath.match(/\/?([^\/]+)\.test\.ts$/);
    const fileName = fileNameMatch ? fileNameMatch[1] : 'unknown';
    const parts = fileName.split('.');

    // Extract priority and type
    const priority = filePath.includes('/__tests__/p1/') ? 'p1' : 
                    filePath.includes('/__tests__/p2/') ? 'p2' : 'p0';
    const type = filePath.includes('/unit/') ? 'unit' :
                 filePath.includes('/integration/') ? 'integration' :
                 filePath.includes('/e2e/') ? 'e2e' : 'unit';
    
    // Extract component and scenario
    const component = parts[2] || fileName;
    const scenario = parts[3] || 'test';

    // Set suite name
    this.results.suite = `${priority}.${type}.${component}`;

    // Process each test
    testResult.testResults.forEach(test => {
      this.results.tests.push({
        name: test.title,
        fullName: test.fullName,
        status: test.status,
        duration: test.duration || 0,
        memory: memoryUsed,
        priority,
        type,
        error: test.status === 'failed' ? {
          message: test.failureMessages[0].split('\n')[0],
          stack: test.failureMessages[0].split('\n')
            .slice(1)
            .join('\n')
            .trim(),
          diff: test.failureDetails?.[0]?.matcherResult?.message
        } : null,
        location: {
          file: testResult.testFilePath,
          line: test.location?.line
        }
      });
    });
  }

  onRunComplete(contexts, results) {
    const endTime = Date.now();
    const endMemory = process.memoryUsage().heapUsed;
    const cpuUsage = os.loadavg()[0];

    // Basic stats
    this.results.stats = {
      total: results.numTotalTests,
      passed: results.numPassedTests,
      failed: results.numFailedTests,
      duration: endTime - this.startTime
    };

    // Performance metrics
    this.results.performance = {
      memory: {
        start: this.startMemory,
        end: endMemory,
        used: endMemory - this.startMemory,
        peak: Math.max(...this.results.tests.map(t => t.memory))
      },
      cpu: {
        usage: cpuUsage,
        cores: os.cpus().length
      },
      duration: endTime - this.startTime,
      averageTestDuration: this.results.tests.reduce((sum, test) => sum + test.duration, 0) / this.results.tests.length,
      slowestTests: this.results.tests
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5)
        .map(t => ({
          name: t.name,
          duration: t.duration,
          memory: t.memory
        }))
    };

    // Group failures by priority
    if (results.numFailedTests > 0) {
      this.results.failures = {
        p0: {},
        p1: {},
        p2: {}
      };

      this.results.tests
        .filter(test => test.status === 'failed')
        .forEach(test => {
          const priority = test.priority;
          const fileName = test.location.file.split('/').pop();

          if (!this.results.failures[priority][fileName]) {
            this.results.failures[priority][fileName] = {
              failureCount: 0,
              errors: [],
              totalDuration: 0
            };
          }

          const failure = this.results.failures[priority][fileName];
          failure.failureCount++;
          failure.totalDuration += test.duration;
          failure.errors.push({
            name: test.name,
            error: test.error.message,
            stack: test.error.stack,
            duration: test.duration
          });
        });

      // Remove empty priorities
      Object.keys(this.results.failures).forEach(priority => {
        if (Object.keys(this.results.failures[priority]).length === 0) {
          delete this.results.failures[priority];
        }
      });
    }

    // Write results to file
    const fs = require('fs');
    
    // Use output file from environment or options
    const outputFile = process.env.JEST_OUTPUT_FILE || this._options.outputFile;
    
    // Ensure directory exists
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write detailed results
    fs.writeFileSync(
      outputFile,
      JSON.stringify(this.results, null, 2)
    );

    console.log(`Test results written to: ${outputFile}`);
  }
}

module.exports = MinimalReporter;