#!/usr/bin/env node

/**
 * Test Migration Helper
 * 
 * This script helps migrate a test file from its current location to the canonical location
 * while updating import paths and updating the dashboard.
 * 
 * Usage: node migrate-test.js <source-path> <dest-path>
 * Example: node migrate-test.js packages/core/tests/p0/core/message-queue-v2.test.ts tests/packages/core/unit/core/message-queue/message-queue-v2.test.ts
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Process command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node migrate-test.js <source-path> <dest-path>');
  console.error('  source-path: Current path to the test file (relative to project root)');
  console.error('  dest-path: Destination path for the test file (relative to project root)');
  process.exit(1);
}

const sourcePath = args[0];
const destPath = args[1];

// Paths to important project files
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SOURCE_FULL_PATH = path.join(PROJECT_ROOT, sourcePath);
const DEST_FULL_PATH = path.join(PROJECT_ROOT, destPath);
const TEST_DASHBOARD_PATH = path.join(PROJECT_ROOT, 'tests', 'dashboard-new', 'TEST_DASHBOARD.md');
const TEST_CLASSIFICATION_PATH = path.join(PROJECT_ROOT, 'tests', 'validation', 'unified', 'TEST_CLASSIFICATION.md');

// Ensure the source file exists
if (!fs.existsSync(SOURCE_FULL_PATH)) {
  console.error(`Error: Source file "${sourcePath}" does not exist`);
  process.exit(1);
}

// Create destination directory if it doesn't exist
const destDir = path.dirname(DEST_FULL_PATH);
if (!fs.existsSync(destDir)) {
  try {
    fs.mkdirSync(destDir, { recursive: true });
    console.log(`Created directory: ${destDir}`);
  } catch (err) {
    console.error(`Error creating directory "${destDir}":`, err);
    process.exit(1);
  }
}

// Read the source file
let sourceContent;
try {
  sourceContent = fs.readFileSync(SOURCE_FULL_PATH, 'utf8');
  console.log(`Read source file: ${sourcePath}`);
} catch (err) {
  console.error(`Error reading source file "${sourcePath}":`, err);
  process.exit(1);
}

// Function to update import paths
function updateImportPaths(content) {
  // Need to understand the current and new path to update relative imports
  const sourceDir = path.dirname(sourcePath);
  const destDir = path.dirname(destPath);
  
  // The number of directory levels we need to navigate up from the new location
  const sourcePathDepth = sourceDir.split('/').length;
  const destPathDepth = destDir.split('/').length;
  
  // Update relative imports
  let updatedContent = content;
  
  // Simple regex that matches import statements
  const importRegex = /import\s+(?:[\w\s{},*]+)\s+from\s+['"]([^'"]+)['"]/g;
  
  // Replace import statements with the appropriate path
  updatedContent = content.replace(importRegex, (match, importPath) => {
    // Only update relative imports (ones that start with . or ..)
    if (importPath.startsWith('.')) {
      // Calculate the new relative path
      // This is a simplistic approach and may not work for all cases
      const absoluteImportPath = path.resolve(path.dirname(SOURCE_FULL_PATH), importPath);
      const relativeImportPath = path.relative(path.dirname(DEST_FULL_PATH), absoluteImportPath);
      
      // Ensure the path starts with . or ..
      const normalizedPath = relativeImportPath.startsWith('.') ? 
        relativeImportPath : `./${relativeImportPath}`;
      
      return match.replace(importPath, normalizedPath);
    }
    return match;
  });
  
  return updatedContent;
}

// Update the import paths in the source content
const updatedContent = updateImportPaths(sourceContent);

// Write to the destination file
try {
  fs.writeFileSync(DEST_FULL_PATH, updatedContent);
  console.log(`Wrote to destination file: ${destPath}`);
} catch (err) {
  console.error(`Error writing to destination file "${destPath}":`, err);
  process.exit(1);
}

// Update TEST_DASHBOARD.md
try {
  let dashboardContent = fs.readFileSync(TEST_DASHBOARD_PATH, 'utf8');
  
  // Extract the current status of the test
  const testStatusMatch = dashboardContent.match(new RegExp(`(✅|❌|❓)\\s+\\|\\s+${sourcePath.replace(/\//g, '\\/')}\\s+\\|\\s+🔄`));
  
  if (!testStatusMatch) {
    console.warn(`Warning: Could not find test "${sourcePath}" in TEST_DASHBOARD.md`);
  } else {
    const testStatus = testStatusMatch[1];
    
    // Replace the line in the dashboard
    dashboardContent = dashboardContent.replace(
      new RegExp(`${testStatus}\\s+\\|\\s+${sourcePath.replace(/\//g, '\\/')}\\s+\\|\\s+🔄`, 'g'),
      `${testStatus} | ${destPath} | 📍`
    );
    
    // Update the byLocation statistics in the JSON data
    const jsonDataMatch = dashboardContent.match(/```json\n([\s\S]+?)\n```/);
    if (jsonDataMatch && jsonDataMatch[1]) {
      try {
        const jsonData = JSON.parse(jsonDataMatch[1]);
        
        // Move the test from needToMove to canonical
        const testStatusMapping = {
          '✅': 'passing',
          '❌': 'failing',
          '❓': 'hanging'
        };
        
        const statusName = testStatusMapping[testStatus];
        
        if (jsonData.byLocation.needToMove[statusName] > 0) {
          jsonData.byLocation.needToMove[statusName]--;
          jsonData.byLocation.needToMove.total--;
        }
        
        jsonData.byLocation.canonical[statusName]++;
        jsonData.byLocation.canonical.total++;
        
        // Recalculate success rates
        const needToMoveTotal = jsonData.byLocation.needToMove.total;
        const needToMovePassing = jsonData.byLocation.needToMove.passing;
        jsonData.byLocation.needToMove.success = needToMoveTotal > 0 ? 
          Math.round((needToMovePassing / needToMoveTotal) * 1000) / 10 : 0;
        
        const canonicalTotal = jsonData.byLocation.canonical.total;
        const canonicalPassing = jsonData.byLocation.canonical.passing;
        jsonData.byLocation.canonical.success = canonicalTotal > 0 ? 
          Math.round((canonicalPassing / canonicalTotal) * 1000) / 10 : 0;
        
        // Replace the JSON in the markdown
        dashboardContent = dashboardContent.replace(
          /```json\n[\s\S]+?\n```/,
          `\`\`\`json\n${JSON.stringify(jsonData, null, 2)}\n\`\`\``
        );
      } catch (err) {
        console.error('Error updating JSON data in TEST_DASHBOARD.md:', err);
      }
    }
    
    // Write the updated dashboard back to file
    fs.writeFileSync(TEST_DASHBOARD_PATH, dashboardContent);
    console.log(`Updated TEST_DASHBOARD.md`);
  }
} catch (err) {
  console.error('Error updating TEST_DASHBOARD.md:', err);
}

// Update TEST_CLASSIFICATION.md
try {
  let classificationContent = fs.readFileSync(TEST_CLASSIFICATION_PATH, 'utf8');
  
  // Extract the current status of the test
  const testStatusMatch = classificationContent.match(new RegExp(`- (✅|❌|❓)🔄 ${SOURCE_FULL_PATH.replace(/\//g, '\\/')}`));
  
  if (!testStatusMatch) {
    console.warn(`Warning: Could not find test "${SOURCE_FULL_PATH}" in TEST_CLASSIFICATION.md`);
  } else {
    const testStatus = testStatusMatch[1];
    
    // Replace the line in the classification
    classificationContent = classificationContent.replace(
      new RegExp(`- ${testStatus}🔄 ${SOURCE_FULL_PATH.replace(/\//g, '\\/')}`, 'g'),
      `- ${testStatus}📍 ${DEST_FULL_PATH}`
    );
    
    // Write the updated classification back to file
    fs.writeFileSync(TEST_CLASSIFICATION_PATH, classificationContent);
    console.log(`Updated TEST_CLASSIFICATION.md`);
  }
} catch (err) {
  console.error('Error updating TEST_CLASSIFICATION.md:', err);
}

// Regenerate dashboard data
try {
  console.log('Updating dashboard data...');
  execSync('cd ' + path.join(PROJECT_ROOT, 'tests', 'dashboard-new') + ' && node update-all.js', { stdio: 'inherit' });
} catch (err) {
  console.error('Error updating dashboard data:', err);
}

// Successful migration
console.log(`
✅ Successfully migrated test file:
   From: ${sourcePath}
   To:   ${destPath}

Important Notes:
- 1️⃣ Verify the test passes in its new location before removing the original file
- 2️⃣ Update any import paths that might be broken
- 3️⃣ Check if the test requires special setup or mocks in the new location
- 4️⃣ After verifying, remove the original file (this script does not delete it automatically)
`);