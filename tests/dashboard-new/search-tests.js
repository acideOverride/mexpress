#!/usr/bin/env node

/**
 * Test Search Utility
 * 
 * This script helps search for tests by various criteria
 * 
 * Usage: node search-tests.js [options]
 * 
 * Options:
 *   --status=<status>      Filter by status: pass, fail, hang
 *   --priority=<priority>  Filter by priority: p0, p1, p2, p3, unclassified
 *   --location=<location>  Filter by location: canonical, needs-moving
 *   --project=<project>    Filter by project: core, montpc, ui, utils
 *   --pattern=<pattern>    Filter by file name pattern (substring match)
 *   --help                 Show this help
 * 
 * Example: node search-tests.js --status=fail --priority=p0
 */

const fs = require('fs');
const path = require('path');

// Path to the TEST_CLASSIFICATION.md file
const TEST_CLASSIFICATION_PATH = path.join(__dirname, '..', 'validation', 'unified', 'TEST_CLASSIFICATION.md');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {};

args.forEach(arg => {
  if (arg === '--help') {
    showHelp();
    process.exit(0);
  }
  
  const match = arg.match(/^--([^=]+)=(.+)$/);
  if (match) {
    options[match[1]] = match[2];
  }
});

// Show help
function showHelp() {
  console.log(`
Test Search Utility

This script helps search for tests by various criteria

Usage: node search-tests.js [options]

Options:
  --status=<status>      Filter by status: pass, fail, hang
  --priority=<priority>  Filter by priority: p0, p1, p2, p3, unclassified
  --location=<location>  Filter by location: canonical, needs-moving
  --project=<project>    Filter by project: core, montpc, ui, utils
  --pattern=<pattern>    Filter by file name pattern (substring match)
  --help                 Show this help

Example: node search-tests.js --status=fail --priority=p0
  `);
}

// Status map
const statusMap = {
  'pass': '✅',
  'fail': '❌',
  'hang': '❓'
};

// Convert status option to symbol
if (options.status) {
  if (statusMap[options.status]) {
    options.status = statusMap[options.status];
  } else {
    console.error(`Invalid status: ${options.status}`);
    process.exit(1);
  }
}

// Read the test classification file
try {
  const classificationContent = fs.readFileSync(TEST_CLASSIFICATION_PATH, 'utf8');
  
  // Parse the test file
  const testLines = classificationContent.split('\n').filter(line => {
    return line.match(/^- (✅|❌|❓)/);
  });
  
  // Parse each test line
  const tests = testLines.map(line => {
    const statusMatch = line.match(/^- (✅|❌|❓)(🔄|📍) (.*)/);
    if (statusMatch) {
      const [_, status, location, path] = statusMatch;
      
      // Determine priority
      let priority = 'unclassified';
      if (path.includes('/p0/')) {
        priority = 'p0';
      } else if (path.includes('/p1/')) {
        priority = 'p1';
      } else if (path.includes('/p2/')) {
        priority = 'p2';
      } else if (path.includes('/p3/')) {
        priority = 'p3';
      }
      
      // Determine project
      let project = 'unknown';
      if (path.includes('/packages/core/')) {
        project = 'core';
      } else if (path.includes('/packages/utils/')) {
        project = 'utils';
      } else if (path.includes('/packages/ui-components/')) {
        project = 'ui';
      } else if (path.includes('/projects/montpc_crm/')) {
        project = 'montpc';
      }
      
      // Determine location type
      const locationType = location === '📍' ? 'canonical' : 'needs-moving';
      
      return {
        status,
        location,
        locationType,
        path,
        priority,
        project
      };
    }
    return null;
  }).filter(Boolean);
  
  // Filter tests based on options
  const filteredTests = tests.filter(test => {
    if (options.status && test.status !== options.status) {
      return false;
    }
    
    if (options.priority && test.priority !== options.priority) {
      return false;
    }
    
    if (options.location && test.locationType !== options.location) {
      return false;
    }
    
    if (options.project && test.project !== options.project) {
      return false;
    }
    
    if (options.pattern && !test.path.includes(options.pattern)) {
      return false;
    }
    
    return true;
  });
  
  // Print the filtered tests
  console.log(`Found ${filteredTests.length} matching tests:`);
  console.log('');
  
  filteredTests.forEach(test => {
    console.log(`${test.status} ${test.location} ${test.path}`);
  });
  
  console.log('');
  console.log('Summary:');
  console.log('--------');
  
  const passingTests = filteredTests.filter(test => test.status === '✅').length;
  const failingTests = filteredTests.filter(test => test.status === '❌').length;
  const hangingTests = filteredTests.filter(test => test.status === '❓').length;
  
  console.log(`Total: ${filteredTests.length}`);
  console.log(`Passing: ${passingTests} (${Math.round(passingTests / filteredTests.length * 100)}%)`);
  console.log(`Failing: ${failingTests} (${Math.round(failingTests / filteredTests.length * 100)}%)`);
  console.log(`Hanging: ${hangingTests} (${Math.round(hangingTests / filteredTests.length * 100)}%)`);
  
} catch (err) {
  console.error('Error reading test classification file:', err);
  process.exit(1);
}