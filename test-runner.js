const { runCLI } = require('@jest/core');
const path = require('path');

async function runTest(pattern) {
    const rootDir = process.cwd();
    const { results } = await runCLI(
        {
            silent: true,
            json: true,
            testPathPattern: pattern
        },
        [rootDir]
    );
    
    if (results.numFailedTests > 0) {
        const failures = results.testResults
            .filter(r => r.numFailingTests > 0)
            .map(r => r.testResults.filter(t => t.status === 'failed'))
            .flat()
            .map(t => t.failureMessages[0].split('\n')[0])
            .join('\n');
        console.log(`FAIL: ${results.numFailedTests}/${results.numTotalTests} tests\n${failures}`);
    } else {
        console.log(`PASS: ${results.numPassedTests} tests`);
    }
}

runTest(process.argv[2]);
