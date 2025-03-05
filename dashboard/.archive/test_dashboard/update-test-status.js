/**
 * Test Status Update Helper
 * 
 * This script helps update the status of a test file in TEST_DASHBOARD.md
 * 
 * Usage: node update-test-status.js <file-path> <status>
 *   file-path: Relative path to the test file (e.g., packages/core/tests/p0/core/event-handler.test.ts)
 *   status: One of 'pass', 'fail', 'hang'
 * 
 * Example: node update-test-status.js packages/core/tests/p0/core/event-handler.test.ts pass
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path to the dashboard markdown file
const DASHBOARD_MD_PATH = path.join(__dirname, 'TEST_DASHBOARD.md');

// Process command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node update-test-status.js <file-path> <status>');
  console.error('  file-path: Relative path to the test file');
  console.error('  status: One of pass, fail, hang');
  process.exit(1);
}

const testFilePath = args[0];
const newStatus = args[1].toLowerCase();

// Validate status
if (!['pass', 'fail', 'hang'].includes(newStatus)) {
  console.error('Error: Status must be one of: pass, fail, hang');
  process.exit(1);
}

// Status map
const statusMap = {
  'pass': '✅',
  'fail': '❌',
  'hang': '❓'
};

// Read the dashboard markdown file
try {
  const dashboardMd = fs.readFileSync(DASHBOARD_MD_PATH, 'utf8');
  
  // Find the test file in the markdown
  const testPathPattern = new RegExp(`(✅|❌|❓)\\s+\\|\\s+${testFilePath.replace(/\//g, '\\/')}\\s+\\|`, 'g');
  
  if (!testPathPattern.test(dashboardMd)) {
    console.error(`Error: Test file "${testFilePath}" not found in the dashboard`);
    process.exit(1);
  }
  
  // Replace the status
  const newDashboardMd = dashboardMd.replace(
    /(✅|❌|❓)(\s+\|\s+)(\S+\/)*?(\S+\.\S+)(\s+\|)/g,
    (match, oldStatus, spacer1, dir, filename, spacer2) => {
      const fullPath = dir ? dir + filename : filename;
      if (fullPath === testFilePath || fullPath.endsWith('/' + testFilePath)) {
        return `${statusMap[newStatus]}${spacer1}${fullPath}${spacer2}`;
      }
      return match;
    }
  );
  
  // Update the json data in the markdown with new stats
  const jsonDataMatch = newDashboardMd.match(/```json\n([\s\S]+?)\n```/);
  if (jsonDataMatch && jsonDataMatch[1]) {
    try {
      const jsonData = JSON.parse(jsonDataMatch[1]);
      
      // Determine if the test file belongs to a priority group
      let priority = 'p0';
      if (testFilePath.includes('/p1/')) {
        priority = 'p1';
      } else if (testFilePath.includes('/p2/')) {
        priority = 'p2';
      } else if (testFilePath.includes('/p3/')) {
        priority = 'p3';
      } else if (testFilePath.startsWith('tests/') && !testFilePath.includes('/p')) {
        priority = 'unclassified';
      }
      
      // Adjust the numbers in the summary
      const oldStatusSymbol = dashboardMd.match(new RegExp(`(✅|❌|❓)\\s+\\|\\s+${testFilePath.replace(/\//g, '\\/')}\\s+\\|`))[1];
      const oldStatusName = 
        oldStatusSymbol === '✅' ? 'passing' :
        oldStatusSymbol === '❌' ? 'failing' :
        'hanging';
        
      const newStatusName = 
        newStatus === 'pass' ? 'passing' :
        newStatus === 'fail' ? 'failing' :
        'hanging';
      
      // Only update if the status has changed
      if (oldStatusName !== newStatusName) {
        // Update summary
        if (jsonData.summary[oldStatusName] > 0) {
          jsonData.summary[oldStatusName]--;
        }
        jsonData.summary[newStatusName]++;
        
        // Update priority data
        if (jsonData.byPriority[priority]) {
          if (jsonData.byPriority[priority][oldStatusName] > 0) {
            jsonData.byPriority[priority][oldStatusName]--;
          }
          jsonData.byPriority[priority][newStatusName]++;
          
          // Recalculate success rate
          const total = jsonData.byPriority[priority].total;
          const passing = jsonData.byPriority[priority].passing;
          jsonData.byPriority[priority].success = Math.round((passing / total) * 100 * 10) / 10;
        }
        
        // Determine project
        let project = 'core';
        if (testFilePath.includes('montpc_crm')) {
          project = 'montpc';
        } else if (testFilePath.includes('ui-components')) {
          project = 'ui';
        } else if (testFilePath.includes('utils')) {
          project = 'utils';
        }
        
        // Update project data
        if (jsonData.byProject[project]) {
          if (jsonData.byProject[project][oldStatusName] > 0) {
            jsonData.byProject[project][oldStatusName]--;
          }
          jsonData.byProject[project][newStatusName]++;
          
          // Recalculate success rate
          const total = jsonData.byProject[project].total;
          const passing = jsonData.byProject[project].passing;
          jsonData.byProject[project].success = Math.round((passing / total) * 100 * 10) / 10;
        }
        
        // Update location data
        const locationType = testFilePath.includes('/tests/') ? 'canonical' : 'needToMove';
        
        if (jsonData.byLocation[locationType]) {
          if (jsonData.byLocation[locationType][oldStatusName] > 0) {
            jsonData.byLocation[locationType][oldStatusName]--;
          }
          jsonData.byLocation[locationType][newStatusName]++;
          
          // Recalculate success rate
          const total = jsonData.byLocation[locationType].total;
          const passing = jsonData.byLocation[locationType].passing;
          jsonData.byLocation[locationType].success = Math.round((passing / total) * 100 * 10) / 10;
        }
        
        // Update the BRQ data (more complex, would need logic to map tests to BRQs)
        // This would require additional configuration or parsing BRQ mappings
      }
      
      // Replace the JSON in the markdown
      const updatedDashboardMd = newDashboardMd.replace(
        /```json\n[\s\S]+?\n```/,
        `\`\`\`json\n${JSON.stringify(jsonData, null, 2)}\n\`\`\``
      );
      
      // Write the updated markdown back to file
      fs.writeFileSync(DASHBOARD_MD_PATH, updatedDashboardMd);
      
      console.log(`✅ Updated status of "${testFilePath}" to ${newStatus}`);
      
      // Run the update-all.js script to update the dashboard
      try {
        console.log('Updating dashboard data...');
        execSync('node update-all.js', { stdio: 'inherit' });
      } catch (err) {
        console.error('Error updating dashboard data:', err);
      }
      
    } catch (err) {
      console.error('Error parsing JSON data:', err);
    }
  } else {
    // Write the updated markdown back to file without updating JSON data
    fs.writeFileSync(DASHBOARD_MD_PATH, newDashboardMd);
    
    console.log(`⚠️ Updated status of "${testFilePath}" to ${newStatus} but could not update JSON data`);
    
    // Run the update-all.js script to update the dashboard
    try {
      console.log('Updating dashboard data...');
      execSync('node update-all.js', { stdio: 'inherit' });
    } catch (err) {
      console.error('Error updating dashboard data:', err);
    }
  }
  
} catch (err) {
  console.error('Error reading dashboard file:', err);
  process.exit(1);
}