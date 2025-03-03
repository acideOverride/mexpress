/**
 * Test Milestone Mapping Verification
 * 
 * This script analyzes test files and verifies their mapping to BRQ milestones.
 * It checks for proper documentation headers and ensures all tests are tagged with
 * the appropriate milestone identifiers.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const config = {
  // Milestone pattern: MEXP-YYYY-NNN-COMP format
  milestonePattern: /MEXP-\d{4}-\d{3}-(BE|FE|API|FULL|INFRA|DOC)/,
  // Test directories to scan
  testDirectories: [
    'tests/p0',
    'tests/p1',
    'tests/p2',
    'tests/p3',
    'src/__tests__'
  ],
  // Output directory for reports
  outputDir: 'tests/results/summary',
  // Required tags in test file headers
  requiredTags: ['MEXP-']
};

// Create output directory if it doesn't exist
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Results tracking
const results = {
  scannedFiles: 0,
  correctlyMapped: 0,
  missingMilestone: 0,
  invalidMilestone: 0,
  filesByMilestone: {}
};

/**
 * Check if a file has the required milestone mapping
 */
function checkMilestoneMapping(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileInfo = {
      path: filePath,
      milestones: [],
      hasValidMapping: false,
      issues: []
    };
    
    // Look for milestone identifiers in the file content
    const milestoneMatches = content.match(new RegExp(config.milestonePattern, 'g'));
    
    if (milestoneMatches && milestoneMatches.length > 0) {
      fileInfo.milestones = [...new Set(milestoneMatches)]; // Remove duplicates
      fileInfo.hasValidMapping = true;
      
      // Track files by milestone
      for (const milestone of fileInfo.milestones) {
        if (!results.filesByMilestone[milestone]) {
          results.filesByMilestone[milestone] = [];
        }
        results.filesByMilestone[milestone].push(filePath);
      }
    } else {
      fileInfo.issues.push('Missing milestone identifier');
    }
    
    // Check for required tags
    for (const tag of config.requiredTags) {
      if (!content.includes(tag)) {
        fileInfo.issues.push(`Missing required tag: ${tag}`);
        fileInfo.hasValidMapping = false;
      }
    }
    
    return fileInfo;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return {
      path: filePath,
      milestones: [],
      hasValidMapping: false,
      issues: [`Error: ${error.message}`]
    };
  }
}

/**
 * Scan all test files for milestone mappings
 */
function scanTestFiles() {
  const allTestFiles = [];
  
  // Get all test files from configured directories
  for (const dir of config.testDirectories) {
    const fullPath = path.resolve(dir);
    if (fs.existsSync(fullPath)) {
      const files = glob.sync(`${fullPath}/**/*.test.{ts,js,tsx,jsx}`);
      allTestFiles.push(...files);
    }
  }
  
  results.scannedFiles = allTestFiles.length;
  const mappingResults = [];
  
  // Check each file for milestone mapping
  for (const file of allTestFiles) {
    const mapping = checkMilestoneMapping(file);
    mappingResults.push(mapping);
    
    if (mapping.hasValidMapping) {
      results.correctlyMapped++;
    } else if (mapping.issues.includes('Missing milestone identifier')) {
      results.missingMilestone++;
    } else {
      results.invalidMilestone++;
    }
  }
  
  return mappingResults;
}

/**
 * Generate summary report
 */
function generateReport(mappingResults) {
  // Generate summary report
  const summaryReport = {
    totalFiles: results.scannedFiles,
    correctlyMapped: results.correctlyMapped,
    missingMilestone: results.missingMilestone,
    invalidMilestone: results.invalidMilestone,
    mappingPercentage: results.scannedFiles > 0 
      ? Math.round((results.correctlyMapped / results.scannedFiles) * 100) 
      : 0,
    milestones: Object.keys(results.filesByMilestone).map(milestone => ({
      milestone,
      fileCount: results.filesByMilestone[milestone].length
    }))
  };
  
  // Generate detailed report with issues
  const detailedReport = mappingResults.filter(result => !result.hasValidMapping)
    .map(result => ({
      path: result.path,
      issues: result.issues
    }));
    
  // Write reports to files
  fs.writeFileSync(
    path.join(config.outputDir, 'milestone-mapping-summary.json'),
    JSON.stringify(summaryReport, null, 2)
  );
  
  fs.writeFileSync(
    path.join(config.outputDir, 'milestone-mapping-issues.json'),
    JSON.stringify(detailedReport, null, 2)
  );
  
  // Generate milestone mapping file for each milestone
  for (const milestone of Object.keys(results.filesByMilestone)) {
    fs.writeFileSync(
      path.join(config.outputDir, `${milestone}-tests.json`),
      JSON.stringify({
        milestone,
        files: results.filesByMilestone[milestone]
      }, null, 2)
    );
  }
  
  // Generate Markdown summary report
  const markdownReport = `# Test Milestone Mapping Report

## Summary
- Total Test Files: ${summaryReport.totalFiles}
- Correctly Mapped: ${summaryReport.correctlyMapped} (${summaryReport.mappingPercentage}%)
- Missing Milestone: ${summaryReport.missingMilestone}
- Invalid Milestone: ${summaryReport.invalidMilestone}

## Milestone Coverage
${summaryReport.milestones.map(m => `- ${m.milestone}: ${m.fileCount} tests`).join('\n')}

## Issues
${detailedReport.length > 0 
  ? detailedReport.map(d => `- ${d.path}\n  - ${d.issues.join('\n  - ')}`).join('\n\n')
  : 'No issues found.'}
`;

  fs.writeFileSync(
    path.join(config.outputDir, 'milestone-mapping-report.md'),
    markdownReport
  );
  
  return summaryReport;
}

// Run the scan and generate reports
const mappingResults = scanTestFiles();
const summaryReport = generateReport(mappingResults);

// Print summary to console
console.log('Test Milestone Mapping Report');
console.log('--------------------------');
console.log(`Total Test Files: ${summaryReport.totalFiles}`);
console.log(`Correctly Mapped: ${summaryReport.correctlyMapped} (${summaryReport.mappingPercentage}%)`);
console.log(`Missing Milestone: ${summaryReport.missingMilestone}`);
console.log(`Invalid Milestone: ${summaryReport.invalidMilestone}`);
console.log('--------------------------');
console.log(`Report saved to ${config.outputDir}/milestone-mapping-report.md`);

// Return non-zero exit code if any issues were found
process.exit(summaryReport.missingMilestone > 0 || summaryReport.invalidMilestone > 0 ? 1 : 0);