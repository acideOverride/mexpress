const fs = require('fs');

// Read test results
const results = JSON.parse(fs.readFileSync('./test-results.json', 'utf8'));

// Process test suites
const errors = results.testResults.reduce((acc, suite) => {
  const filePath = suite.testFilePath.replace(process.cwd(), '');
  
  // Process test results
  suite.testResults.forEach(test => {
    if (test.status === 'failed') {
      const error = {
        testFile: filePath,
        failedTest: test.fullName,
        errorType: test.failureMessages[0].split(':')[0].trim(),
        keyEvidence: extractCodeSnippet(test.failureMessages[0]),
        quickFix: generateQuickFix(test.failureMessages[0])
      };
      acc.push(error);
    }
  });
  
  return acc;
}, []);

// Extract 3-line code snippet around failure
function extractCodeSnippet(message) {
  const lines = message.split('\n');
  let codeLines = [];
  let foundCode = false;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('> ')) {
      // Found failing line
      if (i > 0) codeLines.push(lines[i-1]);
      codeLines.push(lines[i]);
      if (i < lines.length - 1) codeLines.push(lines[i+1]);
      foundCode = true;
      break;
    }
  }
  
  return foundCode ? codeLines.join('\n') : 'No code snippet available';
}

// Generate quick fix suggestion
function generateQuickFix(message) {
  if (message.includes('TestingLibraryElementError')) {
    return 'Check if the element exists in the DOM and verify the query selector';
  }
  if (message.includes('TimeoutError')) {
    return 'Increase wait time or check async operation completion';
  }
  return 'Review error message and test implementation';
}

// Write filtered errors
fs.writeFileSync(
  './filtered-errors.json',
  JSON.stringify(errors, null, 2)
);