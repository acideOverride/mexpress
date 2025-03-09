#!/usr/bin/env node

/**
 * Dashboard Mapper
 * 
 * This script processes markdown templates and generates dashboard HTML files
 * along with dashboard-data.js based on the schema.json definition.
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Configuration
const CONFIG = {
  templatesDir: path.join(__dirname, 'templates'),
  outputDir: path.join(__dirname, 'pages'),
  generatedDir: path.join(__dirname, 'generated'),
  schemaPath: path.join(__dirname, 'schema.json')
};

/**
 * Simple template engine that replaces {{variable}} with values from data object
 * Also supports basic {{#each array}} {{/each}} for iterating over arrays
 */
function renderTemplate(template, data) {
  // Handle each loops
  template = template.replace(/\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, variable, content) => {
    const items = getNestedValue(data, variable);
    if (!Array.isArray(items) && typeof items === 'object') {
      // Handle objects as arrays of key-value pairs
      return Object.entries(items).map(([key, value]) => {
        // Add the key as a property so it can be referenced in the template
        if (typeof value === 'object') {
          value._key = key;
        } else {
          return content.replace(/\{\{([^}]+)\}\}/g, (m, v) => {
            if (v === '_key') return key;
            if (v === 'value') return value;
            return '';
          });
        }
        return renderTemplate(content, value);
      }).join('');
    }
    
    if (!items || !Array.isArray(items)) return '';
    return items.map(item => renderTemplate(content, item)).join('');
  });
  
  // Replace variables
  template = template.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
    const value = getNestedValue(data, variable);
    return value !== undefined ? value : match;
  });
  
  return template;
}

/**
 * Get a nested value from an object using dot notation
 * Example: getNestedValue(obj, 'user.profile.name')
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((prev, curr) => {
    return prev && prev[curr] !== undefined ? prev[curr] : undefined;
  }, obj);
}

/**
 * Convert markdown to HTML
 */
function markdownToHtml(markdown) {
  return marked(markdown);
}

/**
 * Process a template file and generate HTML
 */
function processTemplate(templatePath, data) {
  console.log(`Processing template: ${templatePath}`);
  
  // Read template
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  
  // Check if there's a special processor for this template
  const templateName = path.basename(templatePath, '.md');
  const processorPath = path.join(CONFIG.templatesDir, `${templateName}_PROCESSOR.js`);
  
  let processedMarkdown = templateContent;
  try {
    if (fs.existsSync(processorPath)) {
      console.log(`Using custom processor: ${processorPath}`);
      const processor = require(processorPath);
      if (typeof processor.processTemplate === 'function') {
        console.log(`Calling custom processor for ${templateName}`);
        processedMarkdown = processor.processTemplate(templateContent, data);
        console.log(`Custom processor completed successfully`);
      } else {
        console.log(`No processTemplate function found in processor module`);
      }
    } else {
      console.log(`No custom processor found at ${processorPath}`);
    }
  } catch (error) {
    console.error(`Error using custom processor: ${error.message}`);
    console.error(error.stack);
  }
  
  // Render template with data
  const renderedMarkdown = renderTemplate(processedMarkdown, data);
  
  // Convert to HTML
  const html = markdownToHtml(renderedMarkdown);
  
  // Wrap in basic HTML structure
  const fullHtml = `<!DOCTYPE html>
<html lang="en" class="light-mode">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>mExpress Dashboard - ${path.basename(templatePath, '.md')}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js"></script>
  <link rel="stylesheet" href="../assets/dashboard.css">
</head>
<body>
  <div class="container">
    <header>
      <div class="dashboard-title">
        <div class="dashboard-logo">m</div>
        <div class="dashboard-header-content">
          <h1>mExpress Dashboard Hub</h1>
          <div class="meta">
            <span id="last-updated">Last updated: ${data.lastUpdated || 'Unknown'}</span>
            <span id="version">Version: 1.0.0</span>
          </div>
        </div>
        <div class="dashboard-actions">
          <button id="dark-mode-toggle" class="theme-toggle" aria-label="Toggle dark mode">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" class="moon-icon"></path>
              <circle cx="12" cy="12" r="5" class="sun-icon-circle"></circle>
              <line x1="12" y1="1" x2="12" y2="3" class="sun-icon-ray"></line>
              <line x1="12" y1="21" x2="12" y2="23" class="sun-icon-ray"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" class="sun-icon-ray"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" class="sun-icon-ray"></line>
              <line x1="1" y1="12" x2="3" y2="12" class="sun-icon-ray"></line>
              <line x1="21" y1="12" x2="23" y2="12" class="sun-icon-ray"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" class="sun-icon-ray"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" class="sun-icon-ray"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
    
    <div class="tabs">
      <div class="tab active" data-tab="overview">Overview</div>
      <div class="tab" data-tab="dashboards">Dashboards</div>
      <div class="tab" data-tab="projects">Projects</div>
      <div class="tab" data-tab="reports">Reports</div>
    </div>
    
    <main class="main-content">
      <div class="tab-content active" id="page-content">
        ${html}
      </div>
    </main>
    
    <footer>
      <p>mExpress Unified Dashboard &copy; 2025 | Generated from template files in the /templates directory</p>
      <p>Last updated: <span id="footer-last-updated">${data.lastUpdated || 'Unknown'}</span></p>
    </footer>
  </div>
  
  <!-- Dashboard data and scripts -->
  <script src="../generated/dashboard-data.js"></script>
  <script src="../assets/dashboard.js"></script>
</body>
</html>`;
  
  return fullHtml;
}

/**
 * Extract variable structure from a template
 */
function extractVariables(templateContent) {
  const variables = new Set();
  const regex = /\{\{(?!#each|\/each)([^}]+)\}\}/g;
  let match;
  
  while ((match = regex.exec(templateContent)) !== null) {
    variables.add(match[1].trim());
  }
  
  // Also extract variables from each loops
  const eachRegex = /\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
  while ((match = eachRegex.exec(templateContent)) !== null) {
    variables.add(match[1].trim());
    
    // Extract variables from within the each loop
    const nestedContent = match[2];
    const nestedVariables = extractVariables(nestedContent);
    nestedVariables.forEach(v => variables.add(v));
  }
  
  return Array.from(variables);
}

/**
 * Generate mock data structure based on extracted variables
 */
function generateMockDataStructure(variables) {
  const mockData = {};
  
  variables.forEach(variable => {
    // Skip special variables like _key
    if (variable === '_key' || variable === 'value') return;
    
    // Handle nested properties using dot notation
    const parts = variable.split('.');
    let current = mockData;
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      if (i === parts.length - 1) {
        // Generate mock value based on property name
        if (part.includes('Date') || part.includes('date') || part.includes('Updated')) {
          current[part] = new Date().toISOString().split('T')[0];
        } else if (part.includes('Percent') || part.includes('Progress')) {
          current[part] = Math.floor(Math.random() * 100);
        } else if (part.includes('total') || part.includes('Total')) {
          current[part] = Math.floor(Math.random() * 50) + 10;
        } else if (part.includes('name') || part.includes('Name')) {
          current[part] = `Mock ${part} Value`;
        } else if (part.includes('status') || part.includes('Status')) {
          const statuses = ['pending', 'in-progress', 'completed'];
          current[part] = statuses[Math.floor(Math.random() * statuses.length)];
        } else if (part.includes('description') || part.includes('Description')) {
          current[part] = `This is a mock description for ${parts.join('.')}`;
        } else {
          // Default for other variables
          current[part] = `Mock value for ${parts.join('.')}`;
        }
      } else {
        // Create nested object if it doesn't exist
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
    }
  });
  
  return mockData;
}

/**
 * Generate structured mock data
 */
function generateMockData() {
  // Define a pre-structured mock data object based on our schema
  return {
    "lastUpdated": "2025-03-03",
    "dashboardDescription": "Centralized access to all project metrics, reports, and status information in one place.",
    "tests": {
      "lastUpdated": "2025-03-03",
      "summary": {
        "total": 104,
        "passing": 34,
        "failing": 67,
        "hanging": 3,
        "skipped": 0
      },
      "byPriority": {
        "p0": {
          "total": 25,
          "passing": 21,
          "failing": 4,
          "success": 84
        },
        "p1": {
          "total": 21,
          "passing": 8,
          "failing": 13,
          "success": 38.1
        },
        "p2": {
          "total": 16,
          "passing": 5,
          "failing": 11,
          "success": 31.3
        },
        "p3": {
          "total": 17,
          "passing": 0,
          "failing": 14,
          "hanging": 3,
          "success": 0
        },
        "unclassified": {
          "total": 25,
          "passing": 0,
          "failing": 25,
          "success": 0
        }
      },
      "byProject": {
        "core": {
          "total": 65,
          "passing": 34,
          "failing": 28,
          "hanging": 3,
          "success": 52.3
        },
        "montpc": {
          "total": 14,
          "passing": 0,
          "failing": 14,
          "success": 0
        },
        "ui": {
          "total": 2,
          "passing": 0,
          "failing": 2,
          "success": 0
        }
      },
      "brqs": [
        {
          "id": "MEXP-2025-001-API",
          "name": "API Integration Phase",
          "tests": 3,
          "priority": "P0",
          "status": "in-progress",
          "progress": 33.3
        },
        {
          "id": "MEXP-2025-002-BE",
          "name": "Authentication & Security",
          "tests": 4,
          "priority": "P0",
          "status": "in-progress",
          "progress": 75
        },
        {
          "id": "MEXP-2025-003-BE",
          "name": "Message Queue System",
          "tests": 5,
          "priority": "P0",
          "status": "in-progress",
          "progress": 80
        }
      ]
    },
    "milestones": {
      "lastUpdated": "2025-03-03",
      "summary": {
        "total": 11,
        "completed": 5,
        "inProgress": 2,
        "planned": 4
      },
      "quarters": {
        "q1-2025": {
          "total": 5,
          "completed": 5,
          "success": 100,
          "remaining": 0
        },
        "q2-2025": {
          "total": 2,
          "completed": 0,
          "inProgress": 2,
          "success": 0,
          "planned": 0
        },
        "q3-2025": {
          "total": 2,
          "completed": 0,
          "success": 0,
          "planned": 2
        },
        "q4-2025": {
          "total": 2,
          "completed": 0,
          "success": 0,
          "planned": 2
        }
      },
      "milestones": [
        {
          "id": "milestone-1",
          "name": "Core Infrastructure",
          "status": "completed",
          "quarter": "q1-2025",
          "progress": 100,
          "brqs": [
            "MEXP-2025-003-BE",
            "MEXP-2025-024-INFRA",
            "MEXP-2025-025-INFRA"
          ]
        },
        {
          "id": "milestone-2",
          "name": "Authentication & Security",
          "status": "completed",
          "quarter": "q1-2025",
          "progress": 100,
          "brqs": [
            "MEXP-2025-002-BE"
          ]
        },
        {
          "id": "milestone-3",
          "name": "API Integration Foundation",
          "status": "completed",
          "quarter": "q1-2025",
          "progress": 100,
          "brqs": [
            "MEXP-2025-001-API",
            "MEXP-2025-006-API"
          ]
        }
      ]
    },
    "tasks": {
      "lastUpdated": "2025-03-03",
      "summary": {
        "completedTasks": 9,
        "inProgressTasks": 3,
        "pendingTasks": 8
      },
      "currentSprint": {
        "name": "Service Integration Architecture",
        "dates": "March 1-15, 2025",
        "milestone": "milestone-6",
        "brq": "MEXP-2025-007-BE",
        "completed": 7,
        "inProgress": 2,
        "pending": 3,
        "testsPassing": 7,
        "testsTotal": 9,
        "total": 12
      },
      "nextSprint": {
        "name": "Frontend Architecture",
        "dates": "March 16-31, 2025",
        "milestone": "milestone-7",
        "brqs": [
          "MEXP-2025-002-FE",
          "MEXP-2025-005-FE",
          "MEXP-2025-018-FE"
        ],
        "completed": 2,
        "inProgress": 1,
        "pending": 2,
        "testsPassing": 1,
        "testsTotal": 2,
        "total": 5
      },
      "tasks": [
        {
          "id": "task-1",
          "name": "Service Discovery Implementation",
          "status": "completed",
          "sprint": "Service Integration Architecture",
          "milestone": "milestone-6",
          "brq": "MEXP-2025-007-BE",
          "assignee": "Developer Team",
          "tests": [
            "service-discovery.test.ts"
          ]
        },
        {
          "id": "task-2",
          "name": "Cross-Service Authentication",
          "status": "completed",
          "sprint": "Service Integration Architecture",
          "milestone": "milestone-6",
          "brq": "MEXP-2025-007-BE",
          "assignee": "Security Team",
          "tests": [
            "cross-service-auth.test.ts"
          ]
        },
        {
          "id": "task-9",
          "name": "Component Library Setup",
          "status": "completed",
          "sprint": "Frontend Architecture",
          "milestone": "milestone-7",
          "brq": "MEXP-2025-005-FE",
          "assignee": "UI Team",
          "tests": [
            "component-tests.test.js"
          ]
        }
      ]
    },
    "projects": {
      "mexpress": {
        "name": "mExpress",
        "description": "Core platform for business applications",
        "status": "active",
        "milestoneProgress": 80,
        "testProgress": 52.3
      },
      "montpc": {
        "name": "MontPC CRM",
        "description": "Customer management for PC repair",
        "status": "active",
        "milestoneProgress": 30,
        "testProgress": 0
      },
      "giandra": {
        "name": "Giandra Photos",
        "description": "Photo management and selling platform",
        "status": "planning",
        "milestoneProgress": 5,
        "testProgress": 0
      },
      "jerome": {
        "name": "Jerome Bikes",
        "description": "Bike rental and reservation system",
        "status": "planning",
        "milestoneProgress": 2,
        "testProgress": 0
      }
    },
    "recentUpdates": [
      {
        "date": "2025-03-03",
        "type": "Test",
        "description": "Fixed authentication service tests",
        "status": "Completed"
      },
      {
        "date": "2025-03-02",
        "type": "Milestone",
        "description": "Completed Core Infrastructure milestone",
        "status": "Completed"
      },
      {
        "date": "2025-03-01",
        "type": "Task",
        "description": "Started work on Service Mesh Configuration",
        "status": "In Progress"
      }
    ],
    "summary": {
      "milestoneCompletion": 45,
      "tasksCompleted": "9/20",
      "testsPassing": "33%",
      "brqCompletion": "5%",
      "taskProgress": 45,
      "testProgress": 33,
      "brqProgress": 5
    },
    "brqsCompleted": 5,
    "brqsTotal": 19,
    "activeProjects": 2,
    "planningProjects": 2,
    "maintenanceProjects": 0
  };
}

/**
 * Process all templates and generate dashboard files
 */
function processDashboard(mockData = null) {
  // Create output directories if they don't exist
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  if (!fs.existsSync(CONFIG.generatedDir)) {
    fs.mkdirSync(CONFIG.generatedDir, { recursive: true });
  }
  
  // Generate mock data if not provided
  const data = mockData || generateMockData();
  
  // Write dashboard-data.js
  const dashboardDataContent = `// Auto-generated dashboard data - Do not edit manually
// Last updated: ${data.lastUpdated || new Date().toISOString().split('T')[0]}
window.dashboardData = ${JSON.stringify(data, null, 2)};`;
  
  fs.writeFileSync(path.join(CONFIG.generatedDir, 'dashboard-data.js'), dashboardDataContent);
  console.log(`Generated: ${path.join(CONFIG.generatedDir, 'dashboard-data.js')}`);
  
  // Process all templates
  const templates = fs.readdirSync(CONFIG.templatesDir)
    .filter(file => file.endsWith('.md'));
  
  templates.forEach(templateFile => {
    const templatePath = path.join(CONFIG.templatesDir, templateFile);
    const outputFile = path.join(
      CONFIG.outputDir,
      templateFile.replace(/\.md$/i, '.html').toLowerCase()
    );
    
    const html = processTemplate(templatePath, data);
    fs.writeFileSync(outputFile, html);
    console.log(`Generated: ${outputFile}`);
  });
  
  console.log('\nDashboard generation complete!');
}

/**
 * Main function
 */
function main() {
  console.log('mExpress Dashboard Mapper');
  console.log('-------------------------');
  
  // Generate mock data and process templates
  processDashboard();
}

// Run main function
main();