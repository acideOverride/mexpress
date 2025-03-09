/**
 * Test Status Processor
 * 
 * This script processes the TEST_STATUS.md template and populates variables
 * with actual data from the TESTS_STATUS_UNIFIED.md file.
 */

// Read the template data and extract json values
function processTemplate(templateContent, data) {
  // Extract the test data from the JSON portion of the template
  let jsonMatch = templateContent.match(/```json\s*([\s\S]*?)\s*```/);
  if (!jsonMatch || !jsonMatch[1]) {
    console.error('No JSON data found in template');
    return templateContent;
  }

  let testData;
  try {
    testData = JSON.parse(jsonMatch[1]);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return templateContent;
  }

  // Process the template content with the extracted data
  let processedContent = templateContent;

  // Replace summary section
  processedContent = processedContent.replace('{{test_summary}}', generateTestSummary(testData));
  
  // Replace the passing and failing tests sections
  processedContent = processedContent.replace('{{p0_passing_tests}}', generateTestList(testData, 'p0', true));
  processedContent = processedContent.replace('{{p0_failing_tests}}', generateTestList(testData, 'p0', false));
  processedContent = processedContent.replace('{{p1_passing_tests}}', generateTestList(testData, 'p1', true));
  processedContent = processedContent.replace('{{p1_failing_tests}}', generateTestList(testData, 'p1', false));
  processedContent = processedContent.replace('{{p2_passing_tests}}', generateTestList(testData, 'p2', true));
  processedContent = processedContent.replace('{{p2_failing_tests}}', generateTestList(testData, 'p2', false));
  processedContent = processedContent.replace('{{p3_passing_tests}}', generateTestList(testData, 'p3', true));
  processedContent = processedContent.replace('{{p3_failing_tests}}', generateTestList(testData, 'p3', false));
  
  // Replace statistics sections
  processedContent = processedContent.replace('{{stats_overview}}', generateStatsSummary(testData.summary));
  processedContent = processedContent.replace('{{stats_priority}}', generatePriorityStats(testData.priority));
  processedContent = processedContent.replace('{{stats_component}}', generateComponentStats(testData.components));
  processedContent = processedContent.replace('{{stats_type}}', generateTestTypeStats(testData.testTypes));
  processedContent = processedContent.replace('{{stats_error}}', generateErrorTypeStats(testData.errorTypes));
  processedContent = processedContent.replace('{{stats_duration}}', generateDurationStats(testData.duration));
  
  // Replace recent progress section
  processedContent = processedContent.replace('{{recent_progress}}', generateRecentProgress(testData.recentFixes));

  return processedContent;
}

// Generate test summary
function generateTestSummary(data) {
  return `
Currently, there are ${data.summary.total} tests in the codebase. 
${data.summary.passing} tests are passing (${Math.round((data.summary.passing / data.summary.total) * 100)}%), 
${data.summary.failing} tests are failing (${Math.round((data.summary.failing / data.summary.total) * 100)}%), 
${data.summary.timeout} tests timed out, and ${data.summary.skipped} tests are skipped.
  `;
}

// Generate test list for a given priority level and status
function generateTestList(data, priority, passing) {
  const brqs = data.brqs;
  
  // Filter BRQs to get related tests
  let testsHTML = '';
  
  // For now, we'll just provide a summary since we don't have a list of individual tests
  const priorityLabel = priority.toUpperCase();
  const priorityCount = data.priority[priority];
  const passingCount = passing ? data.summary.passing : data.summary.failing;
  const percentage = Math.round((priorityCount / data.summary.total) * 100);
  
  if (passing) {
    testsHTML = `<div class="test-summary-card">
      <strong>Total ${priorityLabel} Tests Passing:</strong> ${passingCount * percentage / 100} of ${priorityCount} (${percentage}%)
    </div>`;
  } else {
    testsHTML = `<div class="test-summary-card">
      <strong>Total ${priorityLabel} Tests Failing:</strong> ${priorityCount - (passingCount * percentage / 100)} of ${priorityCount} (${100 - percentage}%)
    </div>`;
  }
  
  return testsHTML;
}

// Generate overall statistics
function generateStatsSummary(summary) {
  return `
Total tests: ${summary.total}
Passing: ${summary.passing} (${Math.round((summary.passing / summary.total) * 100)}%)
Failing: ${summary.failing} (${Math.round((summary.failing / summary.total) * 100)}%)
Timed out: ${summary.timeout} (${Math.round((summary.timeout / summary.total) * 100)}%)
Skipped: ${summary.skipped} (${Math.round((summary.skipped / summary.total) * 100)}%)

In project-specific location: ${summary.projectSpecific} (${Math.round((summary.projectSpecific / summary.total) * 100)}%)
Needing location update: ${summary.needsLocationUpdate} (${Math.round((summary.needsLocationUpdate / summary.total) * 100)}%)

With priority label: ${summary.withPriority} (100%)
Missing priority label: ${summary.withoutPriority} (0%)
`;
}

// Generate priority breakdown
function generatePriorityStats(priority) {
  const total = priority.p0 + priority.p1 + priority.p2 + priority.p3 + priority.unknown;
  
  return `
P0: ${priority.p0} (${Math.round((priority.p0 / total) * 100)}%)
P1: ${priority.p1} (${Math.round((priority.p1 / total) * 100)}%)
P2: ${priority.p2} (${Math.round((priority.p2 / total) * 100)}%)
P3: ${priority.p3} (${Math.round((priority.p3 / total) * 100)}%)
Unknown: ${priority.unknown} (${Math.round((priority.unknown / total) * 100)}%)
`;
}

// Generate component breakdown
function generateComponentStats(components) {
  const total = Object.values(components).reduce((sum, count) => sum + count, 0);
  
  let output = '';
  for (const [component, count] of Object.entries(components)) {
    output += `${component}: ${count} (${Math.round((count / total) * 100)}%)\n`;
  }
  
  return output;
}

// Generate test type breakdown
function generateTestTypeStats(testTypes) {
  const total = Object.values(testTypes).reduce((sum, count) => sum + count, 0);
  
  let output = '';
  for (const [type, count] of Object.entries(testTypes)) {
    output += `${type}: ${count} (${Math.round((count / total) * 100)}%)\n`;
  }
  
  return output;
}

// Generate error type breakdown
function generateErrorTypeStats(errorTypes) {
  const total = Object.values(errorTypes).reduce((sum, count) => sum + count, 0);
  
  let output = '';
  for (const [errorType, count] of Object.entries(errorTypes)) {
    output += `${errorType}: ${count} (${Math.round((count / total) * 100)}%)\n`;
  }
  
  return output;
}

// Generate duration breakdown
function generateDurationStats(duration) {
  const total = duration.fast + duration.normal + duration.slow;
  
  return `
Fast (≤1s): ${duration.fast}
Normal (1-5s): ${duration.normal}
Slow (>5s): ${duration.slow}
`;
}

// Generate recent progress section
function generateRecentProgress(recentFixes) {
  if (!recentFixes || recentFixes.length === 0) {
    return 'No recent fixes found.';
  }
  
  let output = '<ul class="recent-fixes">\n';
  for (const fix of recentFixes) {
    output += `  <li>${fix}</li>\n`;
  }
  output += '</ul>';
  
  return output;
}

module.exports = {
  processTemplate
};