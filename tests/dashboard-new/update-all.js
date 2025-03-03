/**
 * Test Dashboard Unified Update Script
 * 
 * This script reads data from TEST_DASHBOARD.md and updates all dashboard files
 * 
 * Usage: node update-all.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Run the update-dashboard.js script
console.log('Updating dashboard data...');
try {
  execSync('node update-dashboard.js', { stdio: 'inherit' });
  console.log('Dashboard data updated successfully');
} catch (err) {
  console.error('Error updating dashboard data:', err);
  process.exit(1);
}

// Update CLAUDE.md instructions
const CLAUDE_MD_PATH = path.join(__dirname, '..', '..', 'CLAUDE.md');
if (fs.existsSync(CLAUDE_MD_PATH)) {
  try {
    console.log('Updating CLAUDE.md instructions...');
    let claudeMd = fs.readFileSync(CLAUDE_MD_PATH, 'utf8');
    
    // Update the instructions to reflect the new location
    claudeMd = claudeMd.replace(
      /ALWAYS run `node \/tests\/update-dashboard.js`/g,
      'ALWAYS run `cd /tests/dashboard-new && node update-all.js`'
    );
    
    claudeMd = claudeMd.replace(
      /`\/tests\/TEST_DASHBOARD.md` is the SINGLE SOURCE OF TRUTH/g,
      '`/tests/dashboard-new/TEST_DASHBOARD.md` is the SINGLE SOURCE OF TRUTH'
    );
    
    fs.writeFileSync(CLAUDE_MD_PATH, claudeMd);
    console.log('CLAUDE.md updated successfully');
  } catch (err) {
    console.error('Error updating CLAUDE.md:', err);
  }
}

console.log('✅ All dashboard files updated successfully');
console.log('📊 To view the dashboard, open dashboard-template.html in your browser');