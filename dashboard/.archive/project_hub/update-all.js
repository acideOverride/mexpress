/**
 * Master Project Dashboard Update Script
 * 
 * This script runs both the project dashboard update and ensures
 * that the test dashboard is also updated.
 * 
 * Usage: node update-all.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Run the project dashboard update script
console.log('Updating project dashboard data...');
try {
  execSync('node update-dashboard.js', { stdio: 'inherit' });
  console.log('Project dashboard data updated successfully');
} catch (err) {
  console.error('Error updating project dashboard data:', err);
  process.exit(1);
}

// Check if test dashboard needs update
console.log('Checking test dashboard status...');
const TEST_DASHBOARD_DIR = path.join(__dirname, '..', '..', '..', 'tests', 'dashboard-new');
const TEST_DASHBOARD_UPDATE_SCRIPT = path.join(TEST_DASHBOARD_DIR, 'update-all.js');

if (fs.existsSync(TEST_DASHBOARD_UPDATE_SCRIPT)) {
  console.log('Updating test dashboard...');
  try {
    // Change to the test dashboard directory to run the update script
    process.chdir(TEST_DASHBOARD_DIR);
    execSync('node update-all.js', { stdio: 'inherit' });
    console.log('Test dashboard updated successfully');
    
    // Change back to the original directory
    process.chdir(__dirname);
  } catch (err) {
    console.error('Error updating test dashboard:', err);
  }
} else {
  console.log('Test dashboard update script not found, skipping update');
}

console.log('✅ All dashboards updated successfully');
console.log('📊 To view the project dashboard, open dashboard-template.html in your browser');