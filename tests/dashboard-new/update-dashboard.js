/**
 * Test Dashboard Update Script
 * 
 * This script reads data from TEST_DASHBOARD.md and generates the dashboard-data.js file
 * that powers the dynamic dashboard.
 * 
 * Usage: node update-dashboard.js
 */

const fs = require('fs');
const path = require('path');

const MD_DASHBOARD_PATH = path.join(__dirname, 'TEST_DASHBOARD.md');
const OUTPUT_DATA_PATH = path.join(__dirname, 'dashboard-data.js');

/**
 * Extract JSON data from the Markdown file
 */
function extractJsonData(mdContent) {
  const jsonMatch = mdContent.match(/```json\n([\s\S]+?)\n```/);
  
  if (!jsonMatch || !jsonMatch[1]) {
    throw new Error('Could not find JSON data in the markdown file');
  }
  
  try {
    return JSON.parse(jsonMatch[1]);
  } catch (err) {
    console.error('Error parsing JSON data:', err);
    throw err;
  }
}

/**
 * Extract recent fixes from the markdown
 */
function extractRecentFixes(mdContent) {
  const fixesMatch = mdContent.match(/## Recent Fixes & Updates\n\n([\s\S]+?)(?=\n\n## |$)/);
  
  if (!fixesMatch || !fixesMatch[1]) {
    return [];
  }
  
  const fixesContent = fixesMatch[1].trim();
  const fixLines = fixesContent.split('\n');
  const fixes = [];
  
  // Process each line that starts with a number
  fixLines.forEach(line => {
    if (/^\d+\.\s+✅/.test(line)) {
      // Extract the fix description (remove the number and checkmark)
      let description = line.replace(/^\d+\.\s+✅\s+/, '');
      
      // If it has bullet points on the next lines, skip them for now
      if (description) {
        fixes.push(description);
      }
    }
  });
  
  return fixes;
}

/**
 * Extract next steps from the markdown
 */
function extractNextSteps(mdContent) {
  const stepsMatch = mdContent.match(/## Next Steps\n\n([\s\S]+?)(?=\n\n## |$)/);
  
  if (!stepsMatch || !stepsMatch[1]) {
    return { high: [], medium: [], low: [] };
  }
  
  const stepsContent = stepsMatch[1].trim();
  
  // Extract High Priority steps
  const highPriorityMatch = stepsContent.match(/### High Priority\n([\s\S]+?)(?=\n\n### |$)/);
  const highPriority = [];
  
  if (highPriorityMatch && highPriorityMatch[1]) {
    const highPriorityLines = highPriorityMatch[1].trim().split('\n');
    
    highPriorityLines.forEach(line => {
      // Look for numbered items with bold titles
      const itemMatch = line.match(/\d+\.\s+\*\*([^*]+)\*\*(.*)/);
      if (itemMatch) {
        const title = itemMatch[1].trim();
        const detail = itemMatch[2].trim();
        
        // Extract bullet points
        const bulletPoints = [];
        let index = highPriorityLines.indexOf(line) + 1;
        
        while (index < highPriorityLines.length && highPriorityLines[index].trim().startsWith('-')) {
          bulletPoints.push(highPriorityLines[index].trim().replace(/^-\s+/, ''));
          index++;
        }
        
        highPriority.push({
          title: title,
          detail: detail ? detail : "",
          bullets: bulletPoints
        });
      }
    });
  }
  
  // Extract Medium Priority steps
  const mediumPriorityMatch = stepsContent.match(/### Medium Priority\n([\s\S]+?)(?=\n\n### |$)/);
  const mediumPriority = [];
  
  if (mediumPriorityMatch && mediumPriorityMatch[1]) {
    const mediumPriorityLines = mediumPriorityMatch[1].trim().split('\n');
    
    mediumPriorityLines.forEach(line => {
      // Look for numbered items with bold titles
      const itemMatch = line.match(/\d+\.\s+\*\*([^*]+)\*\*(.*)/);
      if (itemMatch) {
        const title = itemMatch[1].trim();
        const detail = itemMatch[2].trim();
        
        // Extract bullet points
        const bulletPoints = [];
        let index = mediumPriorityLines.indexOf(line) + 1;
        
        while (index < mediumPriorityLines.length && mediumPriorityLines[index].trim().startsWith('-')) {
          bulletPoints.push(mediumPriorityLines[index].trim().replace(/^-\s+/, ''));
          index++;
        }
        
        mediumPriority.push({
          title: title,
          detail: detail ? detail : "",
          bullets: bulletPoints
        });
      }
    });
  }
  
  // Extract Low Priority steps
  const lowPriorityMatch = stepsContent.match(/### Low Priority\n([\s\S]+?)(?=\n\n### |$)/);
  const lowPriority = [];
  
  if (lowPriorityMatch && lowPriorityMatch[1]) {
    const lowPriorityLines = lowPriorityMatch[1].trim().split('\n');
    
    lowPriorityLines.forEach(line => {
      // Look for numbered items with bold titles
      const itemMatch = line.match(/\d+\.\s+\*\*([^*]+)\*\*(.*)/);
      if (itemMatch) {
        const title = itemMatch[1].trim();
        const detail = itemMatch[2].trim();
        
        // Extract bullet points
        const bulletPoints = [];
        let index = lowPriorityLines.indexOf(line) + 1;
        
        while (index < lowPriorityLines.length && lowPriorityLines[index].trim().startsWith('-')) {
          bulletPoints.push(lowPriorityLines[index].trim().replace(/^-\s+/, ''));
          index++;
        }
        
        lowPriority.push({
          title: title,
          detail: detail ? detail : "",
          bullets: bulletPoints
        });
      }
    });
  }
  
  return {
    high: highPriority,
    medium: mediumPriority,
    low: lowPriority
  };
}

/**
 * Extract all tests from the markdown
 */
function extractAllTests(mdContent) {
  // Extract tests from all priority levels
  const tests = [];
  const priorities = ['p0', 'p1', 'p2', 'p3'];
  
  // Process priority-based tests
  priorities.forEach(priority => {
    const levelName = priority === 'p0' ? 'Critical Path' : 
                   priority === 'p1' ? 'Important Features' :
                   priority === 'p2' ? 'Secondary Features' :
                   'Performance & Stress';
    
    const testsMatch = mdContent.match(new RegExp(`## P${priority[1]} \\(${levelName}\\) Tests\\n\\n\`\`\`\\nstatus \\| file \\| location\\n----.*\\n([\\s\\S]+?)\\n\`\`\``));
    
    if (testsMatch && testsMatch[1]) {
      const testLines = testsMatch[1].trim().split('\n');
      
      testLines.forEach(line => {
        const parts = line.split('|').map(part => part.trim());
        if (parts.length >= 3) {
          const [status, path, location] = parts;
          
          let testStatus = 'unknown';
          if (status.includes('✅')) testStatus = 'passing';
          else if (status.includes('❌')) testStatus = 'failing';
          else if (status.includes('❓')) testStatus = 'hanging';
          
          if (path) {
            // Determine project based on path
            let project = 'unknown';
            if (path.startsWith('packages/core/')) project = 'core';
            else if (path.startsWith('packages/utils/')) project = 'utils';
            else if (path.startsWith('packages/ui-components/')) project = 'ui';
            else if (path.startsWith('projects/montpc_crm/')) project = 'montpc';
            
            // Determine location type
            let locationType = 'needs-moving';
            if (location.includes('📍')) locationType = 'canonical';
            
            tests.push({
              status: testStatus,
              path: `/opt/mExpress/${path}`,
              shortPath: path,
              priority: priority,
              location: location,
              locationType: locationType,
              project: project
            });
          }
        }
      });
    }
  });
  
  // Process canonical location tests (non-P structure)
  const canonicalTestsMatch = mdContent.match(/## Canonical Location Tests \(Non-P Structure\)\n\n```\nstatus \| file \| location\n----.*\n([\s\S]+?)\n```/);
  
  if (canonicalTestsMatch && canonicalTestsMatch[1]) {
    const testLines = canonicalTestsMatch[1].trim().split('\n');
    
    testLines.forEach(line => {
      const parts = line.split('|').map(part => part.trim());
      if (parts.length >= 3) {
        const [status, path, location] = parts;
        
        let testStatus = 'unknown';
        if (status.includes('✅')) testStatus = 'passing';
        else if (status.includes('❌')) testStatus = 'failing';
        else if (status.includes('❓')) testStatus = 'hanging';
        
        if (path) {
          // Determine project based on path
          let project = 'unknown';
          if (path.includes('/packages/core/')) project = 'core';
          else if (path.includes('/packages/utils/')) project = 'utils';
          else if (path.includes('/packages/ui-components/')) project = 'ui';
          else if (path.includes('/projects/montpc_crm/')) project = 'montpc';
          
          // Determine location type - should always be canonical for this section
          let locationType = 'canonical';
          
          tests.push({
            status: testStatus,
            path: path,
            shortPath: path.replace('/opt/mExpress/', ''),
            priority: 'unclassified',
            location: location,
            locationType: locationType,
            project: project
          });
        }
      }
    });
  }
  
  return tests;
}

/**
 * Generate the dashboard data file
 */
function generateDashboardData(jsonData, recentFixes, nextSteps, allTests) {
  // Limit the number of tests to include in the dashboard data to avoid large files
  const limitedTests = allTests.slice(0, 100);
  
  const dashboardData = {
    lastUpdated: jsonData.lastUpdated,
    summary: jsonData.summary,
    byPriority: jsonData.byPriority,
    byLocation: jsonData.byLocation,
    byProject: jsonData.byProject,
    recentFixes: recentFixes,
    nextSteps: nextSteps,
    brqs: jsonData.brqs,
    tests: limitedTests
  };
  
  // Generate JavaScript file with the data
  const jsContent = `// This file is auto-generated by update-dashboard.js
// Do not edit this file directly - it will be overwritten

window.dashboardData = ${JSON.stringify(dashboardData, null, 2)};`;
  
  fs.writeFileSync(OUTPUT_DATA_PATH, jsContent);
  
  console.log(`Dashboard data generated successfully at ${OUTPUT_DATA_PATH}`);
}

/**
 * Main function to update dashboard data
 */
function main() {
  console.log('Generating dashboard data from TEST_DASHBOARD.md...');
  
  try {
    const mdContent = fs.readFileSync(MD_DASHBOARD_PATH, 'utf8');
    
    const jsonData = extractJsonData(mdContent);
    console.log('Extracted JSON data from markdown');
    
    const recentFixes = extractRecentFixes(mdContent);
    console.log(`Extracted ${recentFixes.length} recent fixes from markdown`);
    
    const nextSteps = extractNextSteps(mdContent);
    console.log(`Extracted next steps from markdown (High: ${nextSteps.high.length}, Medium: ${nextSteps.medium.length}, Low: ${nextSteps.low.length})`);
    
    const allTests = extractAllTests(mdContent);
    console.log(`Extracted ${allTests.length} tests from markdown`);
    
    // Generate the dashboard data file
    generateDashboardData(jsonData, recentFixes, nextSteps, allTests);
    
    console.log('Dashboard data updated successfully');
  } catch (err) {
    console.error('Error updating dashboard data:', err);
    process.exit(1);
  }
}

// Run the main function
main();