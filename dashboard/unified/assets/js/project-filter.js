/**
 * Project Filter Handler for Test Status Dashboard
 * Handles filtering of test stats based on project selection
 */

// Define project-specific test data
const projectData = {
  // All projects combined data
  all: {
    summary: {
      total: 111,
      passing: 43,
      failing: 66,
      timeout: 2,
      skipped: 0,
      passRate: 38
    },
    priorities: {
      p0: { total: 31, passing: 13, failing: 17, timeout: 1, passRate: 42 },
      p1: { total: 30, passing: 12, failing: 18, timeout: 0, passRate: 40 },
      p2: { total: 34, passing: 7, failing: 27, timeout: 0, passRate: 20 },
      p3: { total: 16, passing: 3, failing: 12, timeout: 1, passRate: 18 }
    },
    components: {
      core: 63,
      api: 11,
      frontend: 10
    }
  },
  
  // MontPC CRM project data
  montpc: {
    summary: {
      total: 28,
      passing: 5,
      failing: 22,
      timeout: 1,
      skipped: 0,
      passRate: 18
    },
    priorities: {
      p0: { total: 7, passing: 3, failing: 4, timeout: 0, passRate: 43 },
      p1: { total: 8, passing: 2, failing: 6, timeout: 0, passRate: 25 },
      p2: { total: 9, passing: 0, failing: 9, timeout: 0, passRate: 0 },
      p3: { total: 4, passing: 0, failing: 3, timeout: 1, passRate: 0 }
    },
    components: {
      core: 10,
      api: 5,
      frontend: 9
    }
  },
  
  // mExpress core project data
  mexpress: {
    summary: {
      total: 75,
      passing: 38,
      failing: 36,
      timeout: 1,
      skipped: 0,
      passRate: 51
    },
    priorities: {
      p0: { total: 23, passing: 10, failing: 12, timeout: 1, passRate: 43 },
      p1: { total: 20, passing: 10, failing: 10, timeout: 0, passRate: 50 },
      p2: { total: 22, passing: 7, failing: 15, timeout: 0, passRate: 32 },
      p3: { total: 10, passing: 3, failing: 7, timeout: 0, passRate: 30 }
    },
    components: {
      core: 53,
      api: 6,
      frontend: 1
    }
  },
  
  // Giandra Photos project data
  giandra: {
    summary: {
      total: 8,
      passing: 0,
      failing: 8,
      timeout: 0,
      skipped: 0,
      passRate: 0
    },
    priorities: {
      p0: { total: 1, passing: 0, failing: 1, timeout: 0, passRate: 0 },
      p1: { total: 2, passing: 0, failing: 2, timeout: 0, passRate: 0 },
      p2: { total: 3, passing: 0, failing: 3, timeout: 0, passRate: 0 },
      p3: { total: 2, passing: 0, failing: 2, timeout: 0, passRate: 0 }
    },
    components: {
      core: 0,
      api: 0,
      frontend: 0
    }
  }
};

// Initialize the project selector functionality
function initializeProjectSelector() {
  console.log('Initializing project selector with filtering');
  
  // Get project selector buttons
  const projectButtons = document.querySelectorAll('.project-option');
  
  // Add click event handler to each button
  projectButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update button styling
      projectButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = 'transparent';
        btn.style.color = '#555';
        btn.style.boxShadow = 'none';
      });
      
      this.classList.add('active');
      this.style.background = '#2196f3';
      this.style.color = 'white';
      this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
      
      // Get selected project id
      const projectId = this.getAttribute('data-project');
      console.log('Selected project: ' + projectId);
      
      // Update dashboard with project-specific data
      updateDashboardData(projectId);
    });
  });
}

// Update dashboard data based on selected project
function updateDashboardData(projectId) {
  // Get project data
  const data = projectData[projectId];
  if (!data) {
    console.error('No data found for project: ' + projectId);
    return;
  }
  
  // Update summary stats
  updateSummaryStats(data.summary);
  
  // Update priority breakdown
  updatePriorityBreakdown(data.priorities);
  
  // Update component stats
  updateComponentStats(data.components);
  
  // Update test lists (this would be more complex in a real implementation
  // that dynamically filtered actual test lists)
  updateTestLists(projectId);
  
  // Update project filter badge
  updateProjectFilterBadge(projectId);
}

// Update the project filter badge in the header
function updateProjectFilterBadge(projectId) {
  const badge = document.getElementById('project-filter-badge');
  if (!badge) return;
  
  if (projectId === 'all') {
    badge.style.display = 'none';
    badge.classList.remove('visible');
  } else {
    badge.style.display = 'inline-block';
    badge.textContent = 'Filtered: ' + getProjectName(projectId);
    badge.classList.add('visible');
    
    // Add short pulse effect when changing projects
    badge.style.animation = 'none';
    setTimeout(() => {
      badge.style.animation = 'pulse 2s infinite';
    }, 10);
  }
}

// Helper to get human-readable project name
function getProjectName(projectId) {
  switch(projectId) {
    case 'montpc':
      return 'MontPC CRM';
    case 'mexpress':
      return 'mExpress Core';
    case 'giandra':
      return 'Giandra Photos';
    case 'jerome':
      return 'Jerome Bikes';
    default:
      return 'All Projects';
  }
}

// Update summary statistics
function updateSummaryStats(summary) {
  // Update sidebar stats
  document.getElementById('overall-passing').textContent = summary.passRate + '%';
  document.getElementById('tests-passing').textContent = summary.passing + '/' + summary.total;
  
  // Update progress bar
  const progressBar = document.querySelector('.sidebar-stat .progress-bar-fill');
  if (progressBar) {
    progressBar.style.width = summary.passRate + '%';
  }
  
  // Update legends
  document.getElementById('passing-count').textContent = 'Passing (' + summary.passing + ')';
  document.getElementById('failing-count').textContent = 'Failing (' + summary.failing + ')';
  document.getElementById('timeout-count').textContent = 'Timeout (' + summary.timeout + ')';
  document.getElementById('skipped-count').textContent = 'Skipped (' + summary.skipped + ')';
  
  // Update overview tab stats if it exists
  const overviewTab = document.getElementById('overview-tab');
  if (overviewTab) {
    // Update the summary stats
    const statElements = overviewTab.querySelectorAll('.summary-stats .summary-stat-value');
    if (statElements.length >= 4) {
      statElements[0].textContent = summary.total;
      statElements[1].textContent = summary.passing;
      statElements[2].textContent = summary.failing;
      statElements[3].textContent = summary.timeout;
    }
    
    // Update progress bars
    const overallProgress = overviewTab.querySelector('.progress-stat-fill.passing');
    if (overallProgress) {
      overallProgress.style.width = summary.passRate + '%';
    }
    
    // Update the progress stat value
    const overallValue = overviewTab.querySelector('.progress-stat-value');
    if (overallValue) {
      overallValue.textContent = summary.passRate + '%';
    }
  }
}

// Update priority breakdown statistics
function updatePriorityBreakdown(priorities) {
  // Update sidebar priority stats
  document.getElementById('p0-passing').textContent = priorities.p0.passRate + '%';
  document.getElementById('p1-passing').textContent = priorities.p1.passRate + '%';
  document.getElementById('p2-passing').textContent = priorities.p2.passRate + '%';
  document.getElementById('p3-passing').textContent = priorities.p3.passRate + '%';
  
  // Update progress bars
  const p0Bar = document.querySelector('.sidebar-stat:nth-of-type(1) .progress-bar-fill');
  if (p0Bar) p0Bar.style.width = priorities.p0.passRate + '%';
  
  const p1Bar = document.querySelector('.sidebar-stat:nth-of-type(2) .progress-bar-fill');
  if (p1Bar) p1Bar.style.width = priorities.p1.passRate + '%';
  
  const p2Bar = document.querySelector('.sidebar-stat:nth-of-type(3) .progress-bar-fill');
  if (p2Bar) p2Bar.style.width = priorities.p2.passRate + '%';
  
  const p3Bar = document.querySelector('.sidebar-stat:nth-of-type(4) .progress-bar-fill');
  if (p3Bar) p3Bar.style.width = priorities.p3.passRate + '%';
  
  // Update overview tab priority progress bars
  const overviewTab = document.getElementById('overview-tab');
  if (overviewTab) {
    const progressStats = overviewTab.querySelectorAll('.progress-stat');
    if (progressStats.length >= 5) {
      // Priority progress bars (skipping the first one which is overall)
      updateProgressBar(progressStats[1], priorities.p0.passRate);
      updateProgressBar(progressStats[2], priorities.p1.passRate);
      updateProgressBar(progressStats[3], priorities.p2.passRate);
      updateProgressBar(progressStats[4], priorities.p3.passRate);
    }
  }
  
  // Update P0 tab summary stats
  updatePriorityTabStats('p0', priorities.p0);
  updatePriorityTabStats('p1', priorities.p1);
  updatePriorityTabStats('p2', priorities.p2);
  updatePriorityTabStats('p3', priorities.p3);
}

// Helper to update progress bar in a progress stat element
function updateProgressBar(progressStatElement, percentage) {
  if (!progressStatElement) return;
  
  const value = progressStatElement.querySelector('.progress-stat-value');
  if (value) value.textContent = percentage + '%';
  
  const fill = progressStatElement.querySelector('.progress-stat-fill');
  if (fill) fill.style.width = percentage + '%';
}

// Update priority tab statistics
function updatePriorityTabStats(priority, data) {
  const tab = document.getElementById(priority + '-tab');
  if (!tab) return;
  
  const statElements = tab.querySelectorAll('.summary-stats .summary-stat-value');
  if (statElements.length >= 4) {
    statElements[0].textContent = data.total;
    statElements[1].textContent = data.passing;
    statElements[2].textContent = data.failing;
    if (statElements[3]) statElements[3].textContent = data.timeout || 0;
  }
}

// Update component statistics
function updateComponentStats(components) {
  // Check if these element IDs exist before trying to update them
  const coreEl = document.getElementById('core-tests');
  const apiEl = document.getElementById('api-tests');
  const frontendEl = document.getElementById('frontend-tests');
  
  if (coreEl) coreEl.textContent = components.core;
  if (apiEl) apiEl.textContent = components.api;
  if (frontendEl) frontendEl.textContent = components.frontend;
  
  // Log the component stats for monitoring
  console.log('Component stats updated:', components);
}

// Update test lists based on project
function updateTestLists(projectId) {
  // In a real implementation, this would filter the actual test lists
  // based on the selected project
  console.log('Would update test lists for project: ' + projectId);
  
  // For this demo, we'll just show/hide a message about filtering
  const testLists = document.querySelectorAll('.test-list');
  testLists.forEach(list => {
    // Add filtered notice if not already present
    if (projectId !== 'all') {
      if (!list.querySelector('.project-filter-notice')) {
        const notice = document.createElement('div');
        notice.className = 'project-filter-notice';
        notice.style.padding = '10px';
        notice.style.marginBottom = '10px';
        notice.style.background = 'rgba(52, 152, 219, 0.1)';
        notice.style.border = '1px solid rgba(52, 152, 219, 0.3)';
        notice.style.borderRadius = '4px';
        notice.innerHTML = `<strong>Filtered:</strong> Showing only ${projectId.toUpperCase()} project tests`;
        list.prepend(notice);
      }
    } else {
      // Remove filtered notice
      const notice = list.querySelector('.project-filter-notice');
      if (notice) {
        notice.remove();
      }
    }
  });
}

// Initialize once the page is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Project filter script loaded');
  initializeProjectSelector();
});