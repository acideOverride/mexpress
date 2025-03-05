/**
 * Dashboard Generator for mExpress
 * 
 * This script:
 * 1. Collects data from markdown template files
 * 2. Processes templates using variables from the data
 * 3. Generates HTML files and dashboard-data.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Configuration
const CONFIG = {
  templatesDir: path.join(__dirname, 'templates'),
  outputDir: path.join(__dirname, 'pages'),
  generatedDir: path.join(__dirname, 'generated'),
  testResultsDir: path.join('/opt/mExpress/tests/results'),
  milestonesPath: path.join('/opt/mExpress/docs/mexpress/MILESTONES_TRACKER_MASTER.md'),
  tasksPath: path.join('/opt/mExpress/docs/mexpress/TASK_TRACKER_MASTER.md')
};

/**
 * Extract JSON data from markdown file
 * @param {string} fileContent - Content of the markdown file
 * @returns {Object|null} Parsed JSON data or null if no JSON found
 */
function extractJsonFromMarkdown(fileContent) {
  // Look for JSON block in markdown (between ```json and ```)
  const jsonMatch = fileContent.match(/```json\s*([\s\S]*?)\s*```/);
  
  if (jsonMatch && jsonMatch[1]) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
    }
  }
  
  return null;
}

/**
 * Process all template files to collect embedded JSON data
 * @returns {Object} Combined dashboard data
 */
function collectDashboardData() {
  const dashboardData = {
    lastUpdated: new Date().toISOString().split('T')[0],
    tests: {},
    milestones: {},
    tasks: {},
    architecture: {},
    projects: {}
  };
  
  // Read all markdown files
  const files = fs.readdirSync(CONFIG.templatesDir);
  
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    
    const filePath = path.join(CONFIG.templatesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const jsonData = extractJsonFromMarkdown(content);
    
    if (!jsonData) {
      console.warn(`No JSON data found in ${file}`);
      continue;
    }
    
    // Map file to corresponding data section
    if (file.toLowerCase().includes('test')) {
      dashboardData.tests = jsonData;
    } else if (file.toLowerCase().includes('milestone')) {
      dashboardData.milestones = jsonData;
    } else if (file.toLowerCase().includes('task')) {
      dashboardData.tasks = jsonData;
    } else if (file.toLowerCase().includes('architecture')) {
      dashboardData.architecture = jsonData;
    } else if (file.toLowerCase().includes('project')) {
      dashboardData.projects = jsonData;
    }
  }
  
  // Calculate aggregate data for the unified dashboard
  dashboardData.summary = calculateSummaryMetrics(dashboardData);
  
  // Add fixed properties
  dashboardData.dashboardDescription = "Centralized access to all project metrics, reports, and status information in one place.";
  
  // Add recent updates
  dashboardData.recentUpdates = [
    {
      date: dashboardData.lastUpdated,
      type: 'Dashboard',
      description: 'Updated unified dashboard',
      status: 'Completed'
    },
    {
      date: dashboardData.lastUpdated,
      type: 'Template',
      description: 'Updated dashboard templates',
      status: 'Completed'
    }
  ];
  
  // Calculate BRQ information
  if (dashboardData.tests && dashboardData.tests.brqs) {
    const brqs = dashboardData.tests.brqs;
    const completedBrqs = brqs.filter(brq => brq.progress === 100).length;
    dashboardData.brqsCompleted = completedBrqs;
    dashboardData.brqsTotal = brqs.length;
  }
  
  // Calculate project counts
  if (dashboardData.projects) {
    const projects = Object.values(dashboardData.projects);
    dashboardData.activeProjects = projects.filter(p => p.status === 'active').length;
    dashboardData.planningProjects = projects.filter(p => p.status === 'planning').length;
    dashboardData.maintenanceProjects = projects.filter(p => p.status === 'maintenance').length;
  }
  
  return dashboardData;
}

/**
 * Calculate summary metrics across all dashboard components
 * @param {Object} data - Dashboard data object
 * @returns {Object} Summary metrics
 */
function calculateSummaryMetrics(data) {
  const summary = {
    milestoneCompletion: 0,
    tasksCompleted: '0/0',
    testsPassing: '0%',
    brqCompletion: '0%'
  };
  
  // Calculate milestone completion
  if (data.milestones && data.milestones.summary) {
    const { total, completed } = data.milestones.summary;
    summary.milestoneCompletion = total > 0 ? Math.round((completed / total) * 100) : 0;
  }
  
  // Calculate tasks completion
  if (data.tasks && data.tasks.summary) {
    const { completedTasks, inProgressTasks, pendingTasks } = data.tasks.summary;
    const totalTasks = completedTasks + inProgressTasks + pendingTasks;
    summary.tasksCompleted = `${completedTasks}/${totalTasks}`;
    summary.taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  }
  
  // Calculate test passing rate
  if (data.tests && data.tests.summary) {
    const { total, passing } = data.tests.summary;
    summary.testsPassing = total > 0 ? `${Math.round((passing / total) * 100)}%` : '0%';
    summary.testProgress = total > 0 ? Math.round((passing / total) * 100) : 0;
  }
  
  // Calculate BRQ completion
  if (data.tests && data.tests.brqs) {
    const brqs = data.tests.brqs;
    const completedBrqs = brqs.filter(brq => brq.progress === 100).length;
    summary.brqCompletion = brqs.length > 0 ? `${Math.round((completedBrqs / brqs.length) * 100)}%` : '0%';
    summary.brqProgress = brqs.length > 0 ? Math.round((completedBrqs / brqs.length) * 100) : 0;
  }
  
  return summary;
}

/**
 * Generate dashboard-data.js file
 * @param {Object} data - Dashboard data
 */
function generateDashboardDataFile(data) {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(CONFIG.generatedDir)) {
    fs.mkdirSync(CONFIG.generatedDir, { recursive: true });
  }
  
  const jsContent = `// Auto-generated dashboard data - Do not edit manually
// Last updated: ${data.lastUpdated}
window.dashboardData = ${JSON.stringify(data, null, 2)};`;

  fs.writeFileSync(path.join(CONFIG.generatedDir, 'dashboard-data.js'), jsContent);
  console.log(`Dashboard data generated successfully: ${path.join(CONFIG.generatedDir, 'dashboard-data.js')}`);
}

/**
 * Run the dashboard-mapper.js script to generate HTML files
 */
function generateDashboardPages() {
  return new Promise((resolve, reject) => {
    console.log('Generating dashboard pages...');
    
    exec('node dashboard-mapper.js', { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        console.error('Error generating dashboard pages:', stderr);
        reject(error);
        return;
      }
      
      console.log(stdout);
      resolve();
    });
  });
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('mExpress Dashboard Update');
    console.log('-------------------------');
    
    // 1. Collect data from template files
    console.log('Collecting data from template files...');
    const dashboardData = collectDashboardData();
    
    // 2. Generate dashboard-data.js
    console.log('Generating dashboard data file...');
    generateDashboardDataFile(dashboardData);
    
    // 3. Generate HTML files from templates
    await generateDashboardPages();
    
    console.log('\nDashboard update complete!');
    console.log(`Open ${path.join(CONFIG.outputDir, 'index.html')} in your browser to view the dashboard.`);
  } catch (error) {
    console.error('Error updating dashboard:', error);
    process.exit(1);
  }
}

// Run the main function
main();