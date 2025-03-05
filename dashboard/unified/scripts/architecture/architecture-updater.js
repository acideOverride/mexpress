/**
 * Architecture Dashboard Updater
 * 
 * This script:
 * 1. Uses the simple calculator to extract metrics from ARCHITECTURE.md files
 * 2. Generates dashboard-data.js with the calculated metrics
 * 3. Makes the architecture dashboard dynamic based on actual data
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Run our simple calculator to get the metrics
function runCalculator() {
  return new Promise((resolve, reject) => {
    console.log('Running architecture calculator...');
    
    exec('node architecture-calculator.js', { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Calculator execution error: ${error}`);
        return reject(error);
      }
      
      if (stderr) {
        console.warn(`Calculator warnings: ${stderr}`);
      }
      
      console.log(stdout);
      
      // Read the calculation results
      const resultsPath = path.join(__dirname, 'calculation_results.md');
      if (!fs.existsSync(resultsPath)) {
        return reject(new Error('Calculator did not generate results file'));
      }
      
      const results = fs.readFileSync(resultsPath, 'utf8');
      const metrics = parseCalculationResults(results);
      resolve(metrics);
    });
  });
}

// Parse the calculation results from markdown format
function parseCalculationResults(markdownContent) {
  const metrics = {
    overallCompletion: 0,
    componentStatus: {
      total: 0,
      complete: 0,
      inProgress: 0,
      planned: 0,
      notStarted: 0
    },
    brqStatus: {
      total: 0,
      complete: 0,
      inProgress: 0,
      planned: 0
    },
    testStatus: {
      total: 0,
      passing: 0
    },
    phaseInfo: {
      currentPhase: 0,
      totalPhases: 0,
      phaseName: ''
    },
    componentPercentages: {
      complete: 0,
      inProgress: 0,
      notStarted: 0
    },
    lastUpdated: new Date().toISOString().split('T')[0]
  };
  
  // Overall completion
  const overallMatch = markdownContent.match(/Overall Completion.*?(\d+)%/);
  if (overallMatch) {
    metrics.overallCompletion = parseInt(overallMatch[1], 10);
  }
  
  // Component status
  const componentsMatch = markdownContent.match(/Components Completed.*?(\d+)\/(\d+)/);
  if (componentsMatch) {
    metrics.componentStatus.complete = parseInt(componentsMatch[1], 10);
    metrics.componentStatus.total = parseInt(componentsMatch[2], 10);
  }
  
  const completeMatch = markdownContent.match(/Complete.*?(\d+)/);
  if (completeMatch) {
    metrics.componentStatus.complete = parseInt(completeMatch[1], 10);
  }
  
  const inProgressMatch = markdownContent.match(/In Progress.*?(\d+)/);
  if (inProgressMatch) {
    metrics.componentStatus.inProgress = parseInt(inProgressMatch[1], 10);
  }
  
  const plannedMatch = markdownContent.match(/Planned.*?(\d+)/);
  if (plannedMatch) {
    metrics.componentStatus.planned = parseInt(plannedMatch[1], 10);
  }
  
  const notStartedMatch = markdownContent.match(/Not Started.*?(\d+)/);
  if (notStartedMatch) {
    metrics.componentStatus.notStarted = parseInt(notStartedMatch[1], 10);
  }
  
  // BRQ status
  const brqsMatch = markdownContent.match(/BRQs Completed.*?(\d+)\/(\d+)/);
  if (brqsMatch) {
    metrics.brqStatus.complete = parseInt(brqsMatch[1], 10);
    metrics.brqStatus.total = parseInt(brqsMatch[2], 10);
  }
  
  // BRQ progress numbers
  const brqCompletedMatch = markdownContent.match(/BRQ Progress[\s\S]*?Completed.*?(\d+)/);
  if (brqCompletedMatch) {
    metrics.brqStatus.complete = parseInt(brqCompletedMatch[1], 10);
  }
  
  const brqInProgressMatch = markdownContent.match(/BRQ Progress[\s\S]*?In Progress.*?(\d+)/);
  if (brqInProgressMatch) {
    metrics.brqStatus.inProgress = parseInt(brqInProgressMatch[1], 10);
  }
  
  const brqPlannedMatch = markdownContent.match(/BRQ Progress[\s\S]*?Planned.*?(\d+)/);
  if (brqPlannedMatch) {
    metrics.brqStatus.planned = parseInt(brqPlannedMatch[1], 10);
  }
  
  // Test status
  const testsMatch = markdownContent.match(/Tests Passing.*?(\d+)\/(\d+)/);
  if (testsMatch) {
    metrics.testStatus.passing = parseInt(testsMatch[1], 10);
    metrics.testStatus.total = parseInt(testsMatch[2], 10);
  }
  
  // Phase info
  const phaseMatch = markdownContent.match(/Current Phase.*?Phase (\d+)\/(\d+)/);
  if (phaseMatch) {
    metrics.phaseInfo.currentPhase = parseInt(phaseMatch[1], 10);
    metrics.phaseInfo.totalPhases = parseInt(phaseMatch[2], 10);
  }
  
  const phaseNameMatch = markdownContent.match(/Phase Name.*?(.+)/);
  if (phaseNameMatch) {
    metrics.phaseInfo.phaseName = phaseNameMatch[1].trim();
  }
  
  // Component chart percentages
  const completePercentMatch = markdownContent.match(/Component Status[\s\S]*?Complete.*?(\d+)%/);
  if (completePercentMatch) {
    metrics.componentPercentages.complete = parseInt(completePercentMatch[1], 10);
  }
  
  const inProgressPercentMatch = markdownContent.match(/Component Status[\s\S]*?In Progress.*?(\d+)%/);
  if (inProgressPercentMatch) {
    metrics.componentPercentages.inProgress = parseInt(inProgressPercentMatch[1], 10);
  }
  
  const notStartedPercentMatch = markdownContent.match(/Component Status[\s\S]*?Not Started.*?(\d+)%/);
  if (notStartedPercentMatch) {
    metrics.componentPercentages.notStarted = parseInt(notStartedPercentMatch[1], 10);
  }
  
  return metrics;
}

// Configuration
const CONFIG = {
  architectureFiles: [
    '/opt/mExpress/docs/montpc_crm/ARCHITECTURE.md',
    '/opt/mExpress/docs/mexpress/design/architecture/architecture-overview.md',
    '/opt/mExpress/docs/giandra_photos/ARCHITECTURE.md',
    '/opt/mExpress/docs/jerome_bikes/ARCHITECTURE.md'
  ],
  dashboardDataPath: '/opt/mExpress/dashboard/unified/generated/dashboard-data.js',
  dashboardDataBackupPath: '/opt/mExpress/dashboard/unified/generated/dashboard-data.js.bak',
  outputDir: '/opt/mExpress/dashboard/unified/generated/'
};

/**
 * Parse ARCHITECTURE.md file to extract component information
 * @param {string} filePath - Path to ARCHITECTURE.md file
 * @returns {Object} Parsed architecture data
 */
function parseArchitectureFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`Architecture file not found: ${filePath}`);
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const projectName = getProjectNameFromPath(filePath);
    
    console.log(`Parsing architecture file for ${projectName}: ${filePath}`);
    
    // Extract components
    const components = extractComponents(content);
    
    // Extract BRQs
    const brqs = extractBRQs(content);
    
    // Extract roadmap phases
    const phases = extractRoadmapPhases(content);
    
    // Extract test status
    const testStatus = extractTestStatus(content);
    
    return {
      projectName,
      components,
      brqs,
      phases,
      testStatus,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  } catch (error) {
    console.error(`Error parsing architecture file ${filePath}:`, error);
    return null;
  }
}

/**
 * Get project name from file path
 * @param {string} filePath - Path to architecture file
 * @returns {string} Project name
 */
function getProjectNameFromPath(filePath) {
  // Extract project name from path
  const parts = filePath.split('/');
  const docIndex = parts.indexOf('docs');
  
  if (docIndex >= 0 && docIndex + 1 < parts.length) {
    let projectName = parts[docIndex + 1];
    
    // Map to proper display name
    const projectNameMap = {
      'montpc_crm': 'MontPC',
      'mexpress': 'mExpress',
      'giandra_photos': 'Giandra',
      'jerome_bikes': 'Jerome'
    };
    
    return projectNameMap[projectName] || projectName;
  }
  
  return 'Unknown Project';
}

/**
 * Extract components from architecture content
 * @param {string} content - Architecture file content
 * @returns {Array} Array of component objects
 */
function extractComponents(content) {
  const components = [];
  
  // Regular expression to match components with optional checkmark
  const componentRegex = /^\s*-\s*\*\*(.*?)\*\*:\s*(✅)?\s*(.*)$/gm;
  let match;
  
  // Match all component lines
  while ((match = componentRegex.exec(content)) !== null) {
    const name = match[1].trim();
    const isComplete = !!match[2]; // Check if ✅ is present
    const description = match[3].trim();
    
    // Determine component layer by looking at previous headings
    const layerMatch = content.substring(0, match.index).match(/### \d\.\d (.*?)$/m);
    const layer = layerMatch ? layerMatch[1].trim() : 'Unknown Layer';
    
    components.push({
      name,
      description,
      status: isComplete ? 'complete' : 'not-started',
      progress: isComplete ? 100 : 0,
      layer
    });
  }
  
  // Search for in-progress components with 🚧 symbol
  const inProgressRegex = /^\s*-\s*🚧\s*\*\*(.*?)\*\*:\s*(.*)$/gm;
  
  while ((match = inProgressRegex.exec(content)) !== null) {
    const name = match[1].trim();
    const description = match[2].trim();
    
    // Determine component layer by looking at previous headings
    const layerMatch = content.substring(0, match.index).match(/### \d\.\d (.*?)$/m);
    const layer = layerMatch ? layerMatch[1].trim() : 'Unknown Layer';
    
    components.push({
      name,
      description,
      status: 'in-progress',
      progress: 50, // Default to 50% for in-progress
      layer
    });
  }
  
  // Also look for components in sections 2.1-2.5 which follow the pattern:
  // - **Component Name**: ✅ Description
  // These components have explicit layer information in headings like "### 2.1 API Layer"
  const sectionRegex = /### (2\.\d) (.*?)$([\s\S]*?)(?=###|$)/gm;
  let sectionMatch;
  
  while ((sectionMatch = sectionRegex.exec(content)) !== null) {
    const sectionNumber = sectionMatch[1];
    const layerName = sectionMatch[2].trim();
    const sectionContent = sectionMatch[3];
    
    // Extract components from this section
    const componentRegex = /^\s*-\s*\*\*(.*?)\*\*:\s*(✅)?\s*(.*)$/gm;
    let componentMatch;
    
    while ((componentMatch = componentRegex.exec(sectionContent)) !== null) {
      const name = componentMatch[1].trim();
      const isComplete = !!componentMatch[2]; // Check if ✅ is present
      const description = componentMatch[3].trim();
      
      // Check if component is already added
      const existing = components.find(c => c.name === name);
      if (!existing) {
        components.push({
          name,
          description,
          status: isComplete ? 'complete' : 'not-started',
          progress: isComplete ? 100 : 0,
          layer: layerName
        });
      }
    }
  }
  
  return components;
}

/**
 * Extract BRQ information from architecture content
 * @param {string} content - Architecture file content
 * @returns {Array} Array of BRQ objects
 */
function extractBRQs(content) {
  const brqs = [];
  
  // Look for BRQ tables in section 6.1
  const brqTableRegex = /\| Status \| BRQ \| Component \| Tests \| Priority \| Progress \|([\s\S]*?)(?=\n\n|\n\*|$)/g;
  let tableMatch;
  
  while ((tableMatch = brqTableRegex.exec(content)) !== null) {
    const tableContent = tableMatch[1];
    
    // Extract rows from table
    const rowRegex = /\|\s*(🟢|🟡|🟠|🔴)\s*\|\s*([^\|]+)\s*\|\s*([^\|]+)\s*\|\s*(\d+\/\d+(?:\*)?)\s*\|\s*([^\|]+)\s*\|\s*(\d+%)\s*\|/g;
    let rowMatch;
    
    while ((rowMatch = rowRegex.exec(tableContent)) !== null) {
      const status = rowMatch[1].trim();
      const id = rowMatch[2].trim();
      const component = rowMatch[3].trim();
      const tests = rowMatch[4].trim();
      const priority = rowMatch[5].trim();
      const progress = parseInt(rowMatch[6], 10);
      
      let statusText;
      switch (status) {
        case '🟢': statusText = 'complete'; break;
        case '🟡': statusText = 'in-progress'; break;
        case '🟠': statusText = 'started'; break;
        case '🔴': statusText = 'not-started'; break;
        default: statusText = 'unknown';
      }
      
      // Extract test counts
      const testMatch = tests.match(/(\d+)\/(\d+)/);
      const testsPassing = testMatch ? parseInt(testMatch[1], 10) : 0;
      const testsTotal = testMatch ? parseInt(testMatch[2], 10) : 0;
      
      brqs.push({
        id,
        name: component,
        status: statusText,
        progress,
        priority,
        tests: `${testsPassing}/${testsTotal}`,
        testsPassing,
        testsTotal
      });
    }
  }
  
  // Also check section 6.2 for Current/Next/Past BRQs
  const brqSectionRegex = /#### (Current|Next|Past)([\s\S]*?)(?=####|$)/g;
  let sectionMatch;
  
  while ((sectionMatch = brqSectionRegex.exec(content)) !== null) {
    const sectionType = sectionMatch[1];
    const sectionContent = sectionMatch[2];
    
    // Extract BRQs from this section using list format
    const brqListRegex = /^\s*-\s*([\w\-]+):\s*(.*?)(?:$|\s*(?:✅|🚧|\(\d+\/\d+))/gm;
    let brqMatch;
    
    while ((brqMatch = brqListRegex.exec(sectionContent)) !== null) {
      const id = brqMatch[1].trim();
      const name = brqMatch[2].trim();
      
      // Check if this BRQ is already in our list
      const existing = brqs.find(b => b.id === id);
      if (!existing) {
        let status, progress;
        
        if (sectionContent.includes(`${id}: ${name} ✅`)) {
          status = 'complete';
          progress = 100;
        } else if (sectionContent.includes(`${id}: ${name} 🚧`)) {
          status = 'in-progress';
          // Try to extract progress from parentheses
          const progressMatch = sectionContent.match(new RegExp(`${id}:.*?\\((\\d+)\\/(\\d+)`));
          if (progressMatch) {
            const passing = parseInt(progressMatch[1], 10);
            const total = parseInt(progressMatch[2], 10);
            progress = Math.round((passing / total) * 100);
          } else {
            progress = 50; // Default for in-progress
          }
        } else if (sectionType === 'Next') {
          status = 'planned';
          progress = 0;
        } else if (sectionType === 'Past') {
          status = 'complete';
          progress = 100;
        } else {
          status = 'not-started';
          progress = 0;
        }
        
        brqs.push({
          id,
          name,
          status,
          progress,
          priority: id.includes('-P0-') ? 'P0' : id.includes('-P1-') ? 'P1' : 'P2',
          tests: '0/0',
          testsPassing: 0,
          testsTotal: 0
        });
      }
    }
  }
  
  // Look for detailed BRQ sections to enhance our data
  const brqDetailRegex = /#### ([\w\-]+): (.*?)$([\s\S]*?)(?=####|$)/gm;
  let detailMatch;
  
  while ((detailMatch = brqDetailRegex.exec(content)) !== null) {
    const id = detailMatch[1].trim();
    const name = detailMatch[2].trim();
    const detailContent = detailMatch[3];
    
    // Find existing BRQ or create new one
    let brq = brqs.find(b => b.id === id);
    if (!brq) {
      brq = {
        id,
        name,
        status: 'unknown',
        progress: 0,
        priority: 'P2', // Default
        tests: '0/0',
        testsPassing: 0,
        testsTotal: 0
      };
      brqs.push(brq);
    }
    
    // Extract status
    const statusMatch = detailContent.match(/\*\*Status\*\*:\s*(✅|🚧|🟢|🟡|🟠|🔴|Completed|In Progress|Not Started)/);
    if (statusMatch) {
      const statusText = statusMatch[1];
      if (statusText === '✅' || statusText === '🟢' || statusText === 'Completed') {
        brq.status = 'complete';
        brq.progress = 100;
      } else if (statusText === '🚧' || statusText === '🟡' || statusText === 'In Progress') {
        brq.status = 'in-progress';
        // Keep existing progress if we have it, otherwise default to 50%
        if (brq.progress === 0) brq.progress = 50;
      } else if (statusText === '🟠' || statusText === 'Started') {
        brq.status = 'started';
        // Keep existing progress if we have it, otherwise default to 25%
        if (brq.progress === 0) brq.progress = 25;
      } else {
        brq.status = 'not-started';
        brq.progress = 0;
      }
    }
    
    // Extract priority
    const priorityMatch = detailContent.match(/\*\*Priority\*\*:\s*(P\d+)/);
    if (priorityMatch) {
      brq.priority = priorityMatch[1];
    }
    
    // Extract component
    const componentMatch = detailContent.match(/\*\*Component\*\*:\s*(.*?)(?:$|\n)/m);
    if (componentMatch && brq.name === id) { // Only update if name is same as ID
      brq.name = componentMatch[1].trim();
    }
    
    // Extract dependencies
    const dependenciesMatch = detailContent.match(/\*\*Dependencies\*\*:\s*(.*?)(?:$|\n)/m);
    if (dependenciesMatch) {
      brq.dependencies = dependenciesMatch[1].trim().split(/,\s*/);
    }
    
    // Extract features
    const featuresMatch = detailContent.match(/\*\*Features\*\*:\s*\n([\s\S]*?)(?=\n\s*\*\*|\n\s*-\s*\*\*|\n\n|$)/);
    if (featuresMatch) {
      const featuresText = featuresMatch[1];
      brq.features = featuresText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim());
    }
  }
  
  return brqs;
}

/**
 * Extract roadmap phases from architecture content
 * @param {string} content - Architecture file content
 * @returns {Array} Array of phase objects
 */
function extractRoadmapPhases(content) {
  const phases = [];
  
  // Look for roadmap sections using pattern "### X.X Phase X: Name (Status)"
  const phaseRegex = /### \d+\.\d+ Phase (\d+): (.*?)(?:\((.*?)\))?$([\s\S]*?)(?=###|$)/gm;
  let match;
  
  while ((match = phaseRegex.exec(content)) !== null) {
    const number = parseInt(match[1], 10);
    const name = match[2].trim();
    const status = match[3] ? match[3].trim() : null;
    const phaseContent = match[4];
    
    // Extract items from this phase
    const items = phaseContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-'))
      .map(line => {
        // Extract item status and text
        const itemMatch = line.match(/^-\s*(✅|🚧|📅)?\s*(.*?)$/);
        if (!itemMatch) return null;
        
        const status = itemMatch[1] || '';
        const text = itemMatch[2].trim();
        
        let itemStatus;
        if (status === '✅') itemStatus = 'complete';
        else if (status === '🚧') itemStatus = 'in-progress';
        else if (status === '📅') itemStatus = 'planned';
        else itemStatus = 'not-started';
        
        return {
          name: text,
          status: itemStatus,
          progress: itemStatus === 'complete' ? 100 : 
                   itemStatus === 'in-progress' ? 50 : 
                   itemStatus === 'planned' ? 10 : 0
        };
      })
      .filter(item => item !== null);
    
    // Determine phase status based on item statuses or explicit status
    let phaseStatus;
    if (status === 'Completed' || status === 'Current' || status === 'Next' || status === 'Future') {
      phaseStatus = status.toLowerCase();
    } else {
      // Determine status from items
      const completeItems = items.filter(i => i.status === 'complete').length;
      const totalItems = items.length;
      
      if (totalItems === 0) {
        phaseStatus = 'planned';
      } else if (completeItems === totalItems) {
        phaseStatus = 'completed';
      } else if (completeItems > 0) {
        phaseStatus = 'in-progress';
      } else {
        phaseStatus = 'planned';
      }
    }
    
    // Calculate overall phase progress
    const progressSum = items.reduce((sum, item) => sum + item.progress, 0);
    const phaseProgress = items.length > 0 ? Math.round(progressSum / items.length) : 0;
    
    phases.push({
      number,
      name,
      status: phaseStatus,
      progress: phaseProgress,
      items
    });
  }
  
  return phases;
}

/**
 * Extract test status from architecture content
 * @param {string} content - Architecture file content
 * @returns {Object} Test status information
 */
function extractTestStatus(content) {
  // Initialize test status object
  const testStatus = {
    total: 0,
    passing: 0,
    failing: 0,
    skipped: 0,
    p0: { total: 0, passing: 0, failing: 0 },
    p1: { total: 0, passing: 0, failing: 0 },
    p2: { total: 0, passing: 0, failing: 0 },
    p3: { total: 0, passing: 0, failing: 0 }
  };
  
  // Extract test counts from BRQ tables
  const brqTableRegex = /\| Status \| BRQ \| Component \| Tests \| Priority \| Progress \|([\s\S]*?)(?=\n\n|\n\*|$)/g;
  let tableMatch;
  
  while ((tableMatch = brqTableRegex.exec(content)) !== null) {
    const tableContent = tableMatch[1];
    
    // Extract rows from table
    const rowRegex = /\|\s*(🟢|🟡|🟠|🔴)\s*\|\s*([^\|]+)\s*\|\s*([^\|]+)\s*\|\s*(\d+)\/(\d+)(?:\*)?[^\|]*\|\s*(P\d+)[^\|]*\|\s*(\d+)%\s*\|/g;
    let rowMatch;
    
    while ((rowMatch = rowRegex.exec(tableContent)) !== null) {
      const passing = parseInt(rowMatch[4], 10);
      const total = parseInt(rowMatch[5], 10);
      const priority = rowMatch[6].trim().toLowerCase();
      
      // Add to overall totals
      testStatus.total += total;
      testStatus.passing += passing;
      testStatus.failing += (total - passing);
      
      // Add to priority-specific totals
      if (testStatus[priority]) {
        testStatus[priority].total += total;
        testStatus[priority].passing += passing;
        testStatus[priority].failing += (total - passing);
      }
    }
  }
  
  // Look for skipped tests note
  const skippedMatch = content.match(/\*All tests skipped with proper documentation due to/);
  if (skippedMatch) {
    // Try to find preceding test numbers
    const precedingNumbersMatch = content.match(/\|[^\|]*\|[^\|]*\|[^\|]*\|[^\|]*(\d+)\/(\d+)\*[^\|]*\|/);
    if (precedingNumbersMatch) {
      const skippedCount = parseInt(precedingNumbersMatch[2], 10);
      testStatus.skipped += skippedCount;
    }
  }
  
  // Calculate success percentages
  if (testStatus.total > 0) {
    testStatus.successRate = Math.round((testStatus.passing / testStatus.total) * 100);
  } else {
    testStatus.successRate = 0;
  }
  
  for (const priority of ['p0', 'p1', 'p2', 'p3']) {
    if (testStatus[priority].total > 0) {
      testStatus[priority].successRate = Math.round((testStatus[priority].passing / testStatus[priority].total) * 100);
    } else {
      testStatus[priority].successRate = 0;
    }
  }
  
  return testStatus;
}

/**
 * Generate dashboard data from parsed architecture data
 * @param {Array} architectureData - Array of parsed architecture data objects
 * @returns {Object} Dashboard data object
 */
function generateDashboardData(architectureData) {
  // Filter out null data
  const validArchData = architectureData.filter(data => data !== null);
  if (validArchData.length === 0) {
    console.error('No valid architecture data found');
    return null;
  }
  
  // Initialize dashboard data
  const dashboardData = {
    lastUpdated: new Date().toISOString().split('T')[0],
    architecture: {
      lastUpdated: new Date().toISOString().split('T')[0],
      projects: {},
      components: {},
      brqs: [],
      phases: [],
      // Add other sections here
    },
    // Keep existing dashboard data structure intact
    tests: { summary: {}, byPriority: {}, byProject: {}, brqs: [] },
    milestones: { summary: {}, quarters: {}, milestones: [] },
    tasks: { summary: {}, currentSprint: {}, nextSprint: {}, tasks: [] },
    projects: {},
    recentUpdates: [],
    summary: {}
  };
  
  // Process each project's architecture data
  validArchData.forEach(data => {
    const projectId = data.projectName.toLowerCase();
    
    // Initialize project structure
    dashboardData.architecture.projects[projectId] = {
      name: data.projectName,
      components: data.components.map(c => c.name),
      brqs: data.brqs.map(b => b.id),
      phases: data.phases.map(p => p.number),
      testStatus: data.testStatus
    };
    
    // Add components
    data.components.forEach(component => {
      // Create unique component ID
      const componentId = `${projectId}-${component.name.toLowerCase().replace(/\s+/g, '-')}`;
      
      dashboardData.architecture.components[componentId] = {
        id: componentId,
        name: component.name,
        description: component.description,
        status: component.status,
        progress: component.progress,
        layer: component.layer,
        project: projectId,
        // Associate with BRQs if possible
        brqs: data.brqs
          .filter(b => b.name.includes(component.name) || component.name.includes(b.name))
          .map(b => b.id),
        // Add test stats if available
        tests: {
          total: 0,
          passing: 0,
          failing: 0
        }
      };
    });
    
    // Add BRQs
    data.brqs.forEach(brq => {
      dashboardData.architecture.brqs.push({
        id: brq.id,
        name: brq.name,
        status: brq.status,
        progress: brq.progress,
        priority: brq.priority,
        project: projectId,
        tests: brq.tests,
        testsPassing: brq.testsPassing,
        testsTotal: brq.testsTotal,
        features: brq.features || [],
        dependencies: brq.dependencies || []
      });
    });
    
    // Add phases
    data.phases.forEach(phase => {
      dashboardData.architecture.phases.push({
        number: phase.number,
        name: phase.name,
        status: phase.status,
        progress: phase.progress,
        project: projectId,
        items: phase.items
      });
    });
    
    // Update test status in the existing data structure
    if (data.testStatus) {
      // Add to tests summary
      if (!dashboardData.tests.summary.total) {
        dashboardData.tests.summary = {
          total: 0,
          passing: 0,
          failing: 0,
          skipped: 0
        };
      }
      dashboardData.tests.summary.total += data.testStatus.total;
      dashboardData.tests.summary.passing += data.testStatus.passing;
      dashboardData.tests.summary.failing += data.testStatus.failing;
      dashboardData.tests.summary.skipped += data.testStatus.skipped;
      
      // Add project-specific test data
      dashboardData.tests.byProject[projectId] = {
        total: data.testStatus.total,
        passing: data.testStatus.passing,
        failing: data.testStatus.failing,
        skipped: data.testStatus.skipped,
        success: data.testStatus.successRate
      };
      
      // Add to test priority data
      for (const priority of ['p0', 'p1', 'p2', 'p3']) {
        if (!dashboardData.tests.byPriority[priority]) {
          dashboardData.tests.byPriority[priority] = {
            total: 0,
            passing: 0,
            failing: 0,
            success: 0
          };
        }
        
        dashboardData.tests.byPriority[priority].total += data.testStatus[priority].total;
        dashboardData.tests.byPriority[priority].passing += data.testStatus[priority].passing;
        dashboardData.tests.byPriority[priority].failing += data.testStatus[priority].failing;
      }
    }
    
    // Add project to projects
    dashboardData.projects[projectId] = {
      name: data.projectName,
      description: `${data.projectName} project`,
      status: 'active',
      milestoneProgress: getMilestoneProgress(data),
      testProgress: data.testStatus ? data.testStatus.successRate : 0
    };
    
    // Add BRQs to tests.brqs
    data.brqs.forEach(brq => {
      if (!dashboardData.tests.brqs.some(b => b.id === brq.id)) {
        dashboardData.tests.brqs.push({
          id: brq.id,
          name: brq.name,
          tests: brq.tests,
          priority: brq.priority,
          status: brq.status,
          progress: brq.progress
        });
      }
    });
  });
  
  // Calculate priority success rates
  for (const priority of ['p0', 'p1', 'p2', 'p3']) {
    if (dashboardData.tests.byPriority[priority]) {
      const { total, passing } = dashboardData.tests.byPriority[priority];
      dashboardData.tests.byPriority[priority].success = total > 0 ? 
        Math.round((passing / total) * 100) : 0;
    }
  }
  
  // Add recent updates
  dashboardData.recentUpdates = [
    {
      date: dashboardData.lastUpdated,
      type: 'Architecture',
      description: 'Updated architecture dashboard with latest component status',
      status: 'Completed'
    },
    {
      date: dashboardData.lastUpdated,
      type: 'BRQ',
      description: 'Updated BRQ status with latest test results',
      status: 'Completed'
    }
  ];
  
  // Calculate summary metrics
  dashboardData.summary = {
    milestoneCompletion: getMilestoneCompletionFromPhases(dashboardData.architecture.phases),
    tasksCompleted: '0/0',
    testsPassing: dashboardData.tests.summary.total > 0 ? 
      `${Math.round((dashboardData.tests.summary.passing / dashboardData.tests.summary.total) * 100)}%` : '0%',
    brqCompletion: getBrqCompletionPercentage(dashboardData.architecture.brqs),
    taskProgress: 0,
    testProgress: dashboardData.tests.summary.total > 0 ? 
      Math.round((dashboardData.tests.summary.passing / dashboardData.tests.summary.total) * 100) : 0,
    brqProgress: Math.round(getBrqCompletionPercentage(dashboardData.architecture.brqs))
  };
  
  // Add completion counts
  dashboardData.brqsCompleted = dashboardData.architecture.brqs.filter(b => b.status === 'complete').length;
  dashboardData.brqsTotal = dashboardData.architecture.brqs.length;
  dashboardData.activeProjects = Object.values(dashboardData.projects).filter(p => p.status === 'active').length;
  dashboardData.planningProjects = Object.values(dashboardData.projects).filter(p => p.status === 'planning').length;
  dashboardData.maintenanceProjects = Object.values(dashboardData.projects).filter(p => p.status === 'maintenance').length;
  
  return dashboardData;
}

/**
 * Calculate milestone progress from project data
 * @param {Object} projectData - Project architecture data
 * @returns {number} Milestone progress percentage
 */
function getMilestoneProgress(projectData) {
  if (!projectData.phases || projectData.phases.length === 0) {
    return 0;
  }
  
  // Calculate weighted progress based on phase numbers
  const totalWeight = projectData.phases.reduce((sum, phase) => sum + phase.number, 0);
  const weightedProgress = projectData.phases.reduce((sum, phase) => {
    return sum + (phase.progress * phase.number);
  }, 0);
  
  return totalWeight > 0 ? Math.round(weightedProgress / totalWeight) : 0;
}

/**
 * Calculate milestone completion percentage from phases
 * @param {Array} phases - Array of phase objects
 * @returns {number} Milestone completion percentage
 */
function getMilestoneCompletionFromPhases(phases) {
  if (!phases || phases.length === 0) {
    return 0;
  }
  
  const completedPhases = phases.filter(p => p.status === 'completed').length;
  return Math.round((completedPhases / phases.length) * 100);
}

/**
 * Calculate BRQ completion percentage
 * @param {Array} brqs - Array of BRQ objects
 * @returns {number} BRQ completion percentage
 */
function getBrqCompletionPercentage(brqs) {
  if (!brqs || brqs.length === 0) {
    return 0;
  }
  
  const progressSum = brqs.reduce((sum, brq) => sum + brq.progress, 0);
  return brqs.length > 0 ? progressSum / brqs.length : 0;
}

/**
 * Update dashboard-data.js with the calculated metrics
 * @param {Object} metrics - Calculated architecture metrics
 */
function updateDashboardData(metrics) {
  if (!metrics) {
    console.error('No metrics data to update');
    return;
  }
  
  // Create backup of existing file if it exists
  const dashboardDataPath = CONFIG.dashboardDataPath;
  if (fs.existsSync(dashboardDataPath)) {
    const backupPath = CONFIG.dashboardDataBackupPath;
    fs.copyFileSync(dashboardDataPath, backupPath);
    console.log(`Created backup of dashboard data at ${backupPath}`);
  }
  
  // Create output directory if it doesn't exist
  const outputDir = CONFIG.outputDir;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Check if there are detailed BRQs and components
  const hasDetailedData = metrics.detailedBRQs || metrics.detailedComponents || metrics.componentConnections;
  
  // Generate dashboard data object
  const dashboardData = {
    architecture: {
      lastUpdated: metrics.lastUpdated,
      overallCompletion: metrics.overallCompletion,
      componentStatus: metrics.componentStatus,
      brqStatus: metrics.brqStatus,
      testStatus: metrics.testStatus,
      phaseInfo: metrics.phaseInfo,
      chartData: {
        componentPercentages: metrics.componentPercentages,
        brqCounts: {
          completed: metrics.brqStatus.complete,
          inProgress: metrics.brqStatus.inProgress,
          planned: metrics.brqStatus.planned
        }
      }
    },
    // Keep other dashboard sections as empty placeholders
    tests: { summary: {} },
    milestones: { summary: {} },
    tasks: { summary: {} },
    projects: {},
    summary: {
      milestoneCompletion: metrics.overallCompletion,
      testsPassing: `${metrics.testStatus.passing}/${metrics.testStatus.total}`,
      brqCompletion: `${metrics.brqStatus.complete}/${metrics.brqStatus.total}`,
      testProgress: Math.round((metrics.testStatus.passing / metrics.testStatus.total) * 100),
      brqProgress: Math.round((metrics.brqStatus.complete / metrics.brqStatus.total) * 100)
    },
    lastUpdated: metrics.lastUpdated
  };
  
  // Add detailed BRQs if available
  if (metrics.detailedBRQs && metrics.detailedBRQs.length > 0) {
    dashboardData.architecture.detailedBRQs = metrics.detailedBRQs.reduce((acc, brq) => {
      acc[brq.id] = brq;
      return acc;
    }, {});
  }
  
  // Add detailed components if available
  if (metrics.detailedComponents && metrics.detailedComponents.length > 0) {
    dashboardData.architecture.detailedComponents = metrics.detailedComponents.reduce((acc, comp) => {
      acc[comp.id] = comp;
      return acc;
    }, {});
  }
  
  // Add component connections if available
  if (metrics.componentConnections && metrics.componentConnections.length > 0) {
    dashboardData.architecture.connections = metrics.componentConnections;
  }
  
  // Generate JavaScript file content
  const jsContent = `// Auto-generated dashboard data from ARCHITECTURE.md
// Last updated: ${metrics.lastUpdated}

window.dashboardData = ${JSON.stringify(dashboardData, null, 2)};`;
  
  // Write the file
  fs.writeFileSync(dashboardDataPath, jsContent);
  console.log(`Updated dashboard data at ${dashboardDataPath}`);
  
  // Generate simple component connections for the diagram
  const connections = generateComponentConnections(metrics);
  fs.writeFileSync(path.join(CONFIG.outputDir, 'component-connections.json'), 
                 JSON.stringify(connections, null, 2));
  console.log(`Generated component connections at ${path.join(CONFIG.outputDir, 'component-connections.json')}`);
}

/**
 * Generate simple component connections for the diagram
 * @param {Object} metrics - Calculated metrics
 * @returns {Array} - Array of connection objects
 */
function generateComponentConnections(metrics) {
  // For demonstration purposes, we'll create some basic connections
  // In a real implementation, this would be derived from the ARCHITECTURE.md file
  return [
    { source: "Customer API", target: "Customer Service", type: "dependency" },
    { source: "Authentication API", target: "Auth Service", type: "dependency" },
    { source: "Integration API", target: "Integration Service", type: "dependency" },
    { source: "Customer Service", target: "Customer Repository", type: "dependency" },
    { source: "Auth Service", target: "Data Consistency Service", type: "dependency" },
    { source: "Message Queue", target: "Service Discovery", type: "layer" }
  ];
}

// Remove this function as we're not using it anymore

/**
 * Main function
 */
async function main() {
  console.log('mExpress Architecture Dashboard Updater');
  console.log('--------------------------------------');
  
  try {
    // Run the calculator to get metrics from ARCHITECTURE.md
    const metrics = await runCalculator();
    
    // Update dashboard-data.js with the metrics
    updateDashboardData(metrics);
    
    console.log('\nArchitecture dashboard update complete!');
  } catch (error) {
    console.error(`Error updating architecture dashboard: ${error}`);
    process.exit(1);
  }
}

// Run main function
main();