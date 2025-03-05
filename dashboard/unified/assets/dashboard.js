/**
 * mExpress Unified Dashboard
 * Main JavaScript for dashboard functionality
 */

// Check if dashboard-data.js is loaded
if (!window.dashboardData) {
  console.error('Dashboard data not loaded');
} else {
  console.log('Dashboard data loaded, version: ' + (window.dashboardData.version || 'unknown'));
}

// Make sure these functions are defined globally
window.setupProjectSelector = window.setupProjectSelector || function() {
  console.log('Default setupProjectSelector called');
  const projectOptions = document.querySelectorAll('.project-option');
  
  if (projectOptions.length === 0) {
    console.warn('No project options found');
    return;
  }
  
  projectOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Update active state
      projectOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      
      // Get selected project
      const project = option.getAttribute('data-project');
      console.log(`Project selected: ${project}`);
      
      // Filter components and BRQs by project
      if (typeof window.filterByProject === 'function') {
        window.filterByProject(project);
      }
    });
  });
};

window.setupBlueprintToggle = window.setupBlueprintToggle || function() {
  console.log('Default setupBlueprintToggle called');
  const toggle = document.getElementById('blueprint-view-toggle');
  const label = document.getElementById('view-mode-label');
  const container = document.querySelector('.blueprint-container');
  
  if (toggle && label && container) {
    toggle.addEventListener('change', () => {
      if (toggle.checked) {
        label.textContent = 'Blueprint View';
        container.style.background = '';
        document.querySelectorAll('.diagram-layer').forEach(layer => {
          layer.style.background = '';
        });
      } else {
        label.textContent = 'Standard View';
        container.style.background = 'white';
        document.querySelectorAll('.diagram-layer').forEach(layer => {
          layer.style.background = '#f8f9fa';
        });
      }
    });
  } else {
    console.warn('Blueprint toggle elements not found');
  }
};

window.initCharts = window.initCharts || function() {
  console.log('Default initCharts called');
  // Initialize charts if Chart.js is available
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not available');
    return;
  }
  
  // Component Status Chart
  const componentCtx = document.getElementById('component-status-chart');
  if (componentCtx) {
    const config = {
      type: 'doughnut',
      data: {
        labels: ['Complete', 'In Progress', 'Not Started'],
        datasets: [{
          data: [64, 20, 16],
          backgroundColor: [
            getComputedStyle(document.documentElement).getPropertyValue('--complete-color'),
            getComputedStyle(document.documentElement).getPropertyValue('--in-progress-color'),
            getComputedStyle(document.documentElement).getPropertyValue('--not-started-color')
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--blueprint-text')
            }
          }
        }
      }
    };
    
    if (window.componentStatusChart) {
      window.componentStatusChart.destroy();
    }
    window.componentStatusChart = new Chart(componentCtx, config);
  }
  
  // BRQ Progress Chart
  const brqCtx = document.getElementById('brq-progress-chart');
  if (brqCtx) {
    const config = {
      type: 'bar',
      data: {
        labels: ['Completed', 'In Progress', 'Planned'],
        datasets: [{
          data: [9, 2, 4],
          backgroundColor: [
            getComputedStyle(document.documentElement).getPropertyValue('--complete-color'),
            getComputedStyle(document.documentElement).getPropertyValue('--in-progress-color'),
            getComputedStyle(document.documentElement).getPropertyValue('--planned-color')
          ],
          borderWidth: 0
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--blueprint-text')
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--blueprint-text')
            }
          }
        }
      }
    };
    
    if (window.brqProgressChart) {
      window.brqProgressChart.destroy();
    }
    window.brqProgressChart = new Chart(brqCtx, config);
  }
};

window.loadDetailedData = window.loadDetailedData || function() {
  console.log('Default loadDetailedData called');
  if (!window.dashboardData || !window.dashboardData.architecture) {
    console.error('Architecture data not loaded');
    return;
  }
  
  const archData = window.dashboardData.architecture;
  
  // Update basic metrics in sidebar
  if (typeof window.updateBasicMetrics === 'function') {
    window.updateBasicMetrics(archData);
  }
  
  // Load components data
  if (archData.detailedComponents && typeof window.loadComponentsData === 'function') {
    window.loadComponentsData(archData.detailedComponents);
  }
  
  // Load BRQs data
  if (archData.detailedBRQs && typeof window.loadBRQsData === 'function') {
    window.loadBRQsData(archData.detailedBRQs);
  }
  
  // Load current BRQs in focus
  if (typeof window.loadCurrentBRQs === 'function') {
    window.loadCurrentBRQs(archData);
  }
  
  // Initialize component and BRQ filters
  if (typeof window.setupComponentFilters === 'function') {
    window.setupComponentFilters();
  }
  
  if (typeof window.setupBRQFilters === 'function') {
    window.setupBRQFilters();
  }
  
  // Set up search functionality
  if (typeof window.setupSearch === 'function') {
    window.setupSearch();
  }
};

document.addEventListener('DOMContentLoaded', function() {
  // Initialize dashboard with data
  updateDashboard();
  
  // Set up event listeners
  setupTabNavigation();
  
  // Initialize architecture-specific features if on architecture page
  if (document.getElementById('architecture')) {
    initArchitectureDashboard();
  }
});

/**
 * Set up tab navigation
 */
function setupTabNavigation() {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Update active content
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
          content.classList.add('active');
        }
      });
    });
  });
}

/**
 * Update dashboard with data from dashboardData
 */
function updateDashboard() {
  if (!window.dashboardData) {
    console.error('Dashboard data not loaded');
    return;
  }
  
  const data = window.dashboardData;
  
  // Update last updated timestamp
  document.getElementById('last-updated').textContent = `Last updated: ${data.lastUpdated}`;
  document.getElementById('footer-last-updated').textContent = data.lastUpdated;
  
  // Update overview metrics
  updateOverviewMetrics(data);
  
  // Update specific sections
  if (data.tests && Object.keys(data.tests).length > 0) {
    updateTestsDashboard(data.tests);
  }
  
  if (data.milestones && Object.keys(data.milestones).length > 0) {
    updateMilestonesDashboard(data.milestones);
  }
  
  if (data.tasks && Object.keys(data.tasks).length > 0) {
    updateTasksDashboard(data.tasks);
  }
  
  // Create charts
  createCharts(data);
}

/**
 * Update overview tab metrics
 */
function updateOverviewMetrics(data) {
  const summary = data.summary || {};
  
  // Update milestone completion
  if (summary.milestoneCompletion !== undefined) {
    document.getElementById('milestone-completion').textContent = `${summary.milestoneCompletion}%`;
    document.getElementById('milestone-progress').style.width = `${summary.milestoneCompletion}%`;
  }
  
  // Update tasks completed
  if (summary.tasksCompleted !== undefined) {
    document.getElementById('tasks-completed').textContent = summary.tasksCompleted;
    document.getElementById('task-progress').style.width = `${summary.taskProgress || 0}%`;
  }
  
  // Update tests passing
  if (summary.testsPassing !== undefined) {
    document.getElementById('tests-passing').textContent = summary.testsPassing;
    document.getElementById('test-progress').style.width = `${summary.testProgress || 0}%`;
  }
  
  // Update BRQ completion
  if (summary.brqCompletion !== undefined) {
    document.getElementById('brq-completion').textContent = summary.brqCompletion;
    document.getElementById('brq-progress').style.width = `${summary.brqProgress || 0}%`;
  }
  
  // Update current sprint info
  if (data.tasks && data.tasks.currentSprint) {
    const sprint = data.tasks.currentSprint;
    document.getElementById('current-sprint-name').textContent = sprint.name;
    document.getElementById('sprint-progress').textContent = `${sprint.progress || 0}%`;
    document.getElementById('sprint-progress-bar').style.width = `${sprint.progress || 0}%`;
    
    // Sprint tasks
    const tasksTotal = sprint.testsTotal || 0;
    const tasksPassing = sprint.testsPassing || 0;
    document.getElementById('sprint-tasks-completed').textContent = `${sprint.completed || 0}/${sprint.completed + sprint.inProgress + sprint.pending}`;
    document.getElementById('sprint-tasks-progress').style.width = `${sprint.completed > 0 ? (sprint.completed / (sprint.completed + sprint.inProgress + sprint.pending)) * 100 : 0}%`;
    
    // Sprint tests
    document.getElementById('sprint-tests-passing').textContent = `${tasksPassing}/${tasksTotal}`;
    document.getElementById('sprint-tests-progress').style.width = `${tasksTotal > 0 ? (tasksPassing / tasksTotal) * 100 : 0}%`;
  }
  
  // Update project-specific metrics for mExpress
  updateProjectMetrics('mexpress', 80, summary.testProgress || 0);
}

/**
 * Update tests dashboard
 */
function updateTestsDashboard(testsData) {
  // This function would update the tests tab with test data
  console.log("Tests data loaded", testsData);
  
  // Update priority test metrics if data is available
  if (testsData.byPriority) {
    updatePriorityTestMetrics(testsData.byPriority);
  }
  
  // Update BRQ tables if data is available
  if (testsData.brqs && testsData.brqs.length > 0) {
    updateBRQTables(testsData.brqs);
  }
  
  // Initialize sortable tables
  initSortableTables();
  
  // Initialize BRQ filters
  initBRQFilters();
}

/**
 * Update BRQ tables with data
 */
function updateBRQTables(brqs) {
  // Sort BRQs by completion status
  const completedBrqs = brqs.filter(brq => brq.progress === 100);
  const inProgressBrqs = brqs.filter(brq => brq.progress > 0 && brq.progress < 100);
  const notStartedBrqs = brqs.filter(brq => brq.progress === 0);
  
  // Update completed BRQs table
  updateBRQTable('completed-brqs-table', completedBrqs);
  
  // Update in-progress BRQs table
  updateBRQTable('in-progress-brqs-table', inProgressBrqs);
  
  // Update not-started BRQs table
  updateBRQTable('not-started-brqs-table', notStartedBrqs);
  
  // Update unified BRQ table if it exists
  updateUnifiedBRQTable('brq-table', brqs);
}

/**
 * Update a specific BRQ table with data
 */
function updateBRQTable(tableId, brqs) {
  const table = document.getElementById(tableId);
  if (!table) return;
  
  const tbody = table.querySelector('tbody');
  if (!tbody) return;
  
  tbody.innerHTML = brqs.map(brq => `
    <tr>
      <td>${getStatusEmoji(brq.progress)}</td>
      <td>${brq.id}</td>
      <td>${brq.name}</td>
      <td>${brq.tests}</td>
      <td>${brq.priority}</td>
      <td>${brq.progress}%</td>
    </tr>
  `).join('');
}

/**
 * Update unified BRQ table with filtering capabilities
 */
function updateUnifiedBRQTable(tableId, brqs) {
  const table = document.getElementById(tableId);
  if (!table) return;
  
  const tbody = table.querySelector('tbody');
  if (!tbody) return;
  
  // Extract unique projects and components for filters
  const projects = [...new Set(brqs.map(brq => brq.id.substring(0, 4)))];
  const components = [...new Set(brqs.map(brq => {
    const match = brq.id.match(/-(BE|FE|API|FULL|INFRA|DOC)$/);
    return match ? match[1] : 'UNKNOWN';
  }))];
  
  // Update project filter options
  const projectFilter = document.getElementById('project-filter');
  if (projectFilter) {
    projectFilter.innerHTML = `
      <option value="all">All Projects</option>
      ${projects.map(project => `<option value="${project}">${project}</option>`).join('')}
    `;
  }
  
  // Update component filter options
  const componentFilter = document.getElementById('component-filter');
  if (componentFilter) {
    componentFilter.innerHTML = `
      <option value="all">All Components</option>
      ${components.map(component => `<option value="${component}">${component}</option>`).join('')}
    `;
  }
  
  // Populate table with all BRQs
  tbody.innerHTML = brqs.map(brq => {
    const component = brq.id.match(/-(BE|FE|API|FULL|INFRA|DOC)$/)?.[1] || 'UNKNOWN';
    
    return `
      <tr data-project="${brq.id.substring(0, 4)}" data-component="${component}" data-priority="${brq.priority}" data-status="${getStatusClass(brq.progress)}">
        <td>${getStatusEmoji(brq.progress)}</td>
        <td>${brq.id}</td>
        <td>${brq.name}</td>
        <td>${brq.tests}</td>
        <td>${brq.priority}</td>
        <td>
          <div class="progress-bar">
            <div class="progress-fill ${getProgressColorClass(brq.progress)}" style="width: ${brq.progress}%"></div>
          </div>
          ${brq.progress}%
        </td>
      </tr>
    `;
  }).join('');
  
  // Update visible count
  const countElement = document.getElementById('visible-brq-count');
  if (countElement) {
    countElement.textContent = `Showing ${brqs.length} of ${brqs.length} BRQs`;
  }
}

/**
 * Get status emoji based on progress
 */
function getStatusEmoji(progress) {
  if (progress === 100) return '🟢'; // Complete
  if (progress >= 50) return '🟡';    // In Progress
  if (progress > 0) return '🟠';      // Started
  return '🔴';                        // Not Started
}

/**
 * Get status class based on progress
 */
function getStatusClass(progress) {
  if (progress === 100) return 'complete';
  if (progress >= 50) return 'in-progress';
  if (progress > 0) return 'started';
  return 'not-started';
}

/**
 * Get progress bar color class based on progress
 */
function getProgressColorClass(progress) {
  if (progress === 100) return 'progress-fill-success';
  if (progress >= 50) return 'progress-fill-warning';
  if (progress > 0) return 'progress-fill-danger';
  return 'progress-fill-primary';
}

/**
 * Update milestones dashboard
 */
function updateMilestonesDashboard(milestonesData) {
  // This function would update the milestones tab with milestone data
  console.log("Milestones data loaded", milestonesData);
  
  // Update milestone list if data is available
  if (milestonesData.milestones && milestonesData.milestones.length > 0) {
    updateMilestoneList(milestonesData.milestones);
  }
}

/**
 * Update tasks dashboard
 */
function updateTasksDashboard(tasksData) {
  // This function would update the tasks tab with task data
  console.log("Tasks data loaded", tasksData);
  
  // Update current tasks if data is available
  if (tasksData.tasks && tasksData.tasks.length > 0) {
    const currentTasks = tasksData.tasks.filter(task => 
      task.sprint === tasksData.currentSprint.name);
    updateCurrentTasks(currentTasks);
  }
}

/**
 * Update project-specific metrics
 */
function updateProjectMetrics(projectId, milestoneProgress, testProgress) {
  const milestoneElement = document.getElementById(`${projectId}-milestone-progress`);
  const testElement = document.getElementById(`${projectId}-test-progress`);
  const progressElement = document.getElementById(`${projectId}-progress`);
  
  if (milestoneElement) milestoneElement.textContent = `${milestoneProgress}%`;
  if (testElement) testElement.textContent = `${testProgress}%`;
  if (progressElement) progressElement.style.width = `${milestoneProgress}%`;
}

/**
 * Update priority test metrics
 */
function updatePriorityTestMetrics(priorityData) {
  // Update P0 tests
  if (priorityData.p0) {
    const p0Success = priorityData.p0.success || 0;
    document.getElementById('p0-tests').textContent = `${p0Success}%`;
    document.getElementById('p0-progress').style.width = `${p0Success}%`;
  }
  
  // Update P1 tests
  if (priorityData.p1) {
    const p1Success = priorityData.p1.success || 0;
    document.getElementById('p1-tests').textContent = `${p1Success}%`;
    document.getElementById('p1-progress').style.width = `${p1Success}%`;
  }
  
  // Update P2 tests
  if (priorityData.p2) {
    const p2Success = priorityData.p2.success || 0;
    document.getElementById('p2-tests').textContent = `${p2Success}%`;
    document.getElementById('p2-progress').style.width = `${p2Success}%`;
  }
  
  // Update P3 tests
  if (priorityData.p3) {
    const p3Success = priorityData.p3.success || 0;
    document.getElementById('p3-tests').textContent = `${p3Success}%`;
    document.getElementById('p3-progress').style.width = `${p3Success}%`;
  }
}

/**
 * Update milestone list
 */
function updateMilestoneList(milestones) {
  const container = document.getElementById('milestone-list');
  if (!container) return;
  
  container.innerHTML = milestones.map(milestone => `
    <tr>
      <td>${milestone.name}</td>
      <td>${milestone.quarter || '-'}</td>
      <td>
        <div class="progress-bar">
          <div class="progress-fill progress-fill-primary" style="width: ${milestone.progress}%"></div>
        </div>
        ${milestone.progress}%
      </td>
      <td>
        <span class="status status-${milestone.status}">
          ${capitalizeFirstLetter(milestone.status)}
        </span>
      </td>
    </tr>
  `).join('');
}

/**
 * Update current tasks
 */
function updateCurrentTasks(tasks) {
  const container = document.getElementById('current-tasks');
  if (!container) return;
  
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  if (inProgressTasks.length === 0) {
    container.innerHTML = '<div class="task-card"><div class="task-header"><h3 class="task-title">No tasks in progress</h3></div></div>';
    return;
  }
  
  container.innerHTML = inProgressTasks.map(task => `
    <div class="task-card">
      <div class="task-header">
        <h3 class="task-title">${task.name}</h3>
        <span class="status status-in-progress">In Progress</span>
      </div>
      <div class="task-meta">
        <div>Assignee: ${task.assignee || 'Unassigned'}</div>
        <div>BRQ: ${task.brq || '-'}</div>
      </div>
      <div class="task-description">
        <p>${task.description || 'No description available'}</p>
      </div>
      <div class="progress-bar">
        <div class="progress-fill progress-fill-warning" style="width: ${task.progress || 0}%"></div>
      </div>
    </div>
  `).join('');
}

/**
 * Create charts for the dashboard
 */
function createCharts(data) {
  // Create project progress chart
  if (document.getElementById('project-progress-chart')) {
    createProjectProgressChart();
  }
  
  // Create test status chart
  if (document.getElementById('test-status-chart')) {
    createTestStatusChart();
  }
  
  // Create test priority chart
  if (document.getElementById('test-priority-chart')) {
    createTestPriorityChart(data);
  }
  
  // Create test project chart
  if (document.getElementById('test-project-chart')) {
    createTestProjectChart(data);
  }
}

/**
 * Create project progress chart
 */
function createProjectProgressChart() {
  const ctx = document.getElementById('project-progress-chart');
  if (!ctx) return;
  
  const ctx2d = ctx.getContext('2d');
  
  // Chart data
  const data = {
    labels: ['mExpress', 'MontPC CRM', 'Giandra Photos', 'Jerome Bikes'],
    datasets: [
      {
        label: 'Completed',
        data: [80, 30, 5, 2],
        backgroundColor: 'rgba(16, 185, 129, 0.7)'
      },
      {
        label: 'In Progress',
        data: [15, 40, 10, 5],
        backgroundColor: 'rgba(245, 158, 11, 0.7)'
      },
      {
        label: 'Planned',
        data: [5, 30, 85, 93],
        backgroundColor: 'rgba(79, 70, 229, 0.7)'
      }
    ]
  };
  
  // Chart config
  const config = {
    type: 'bar',
    data: data,
    options: {
      plugins: {
        title: {
          display: false
        },
        legend: {
          position: 'bottom'
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          max: 100,
          title: {
            display: true,
            text: 'Percentage (%)'
          }
        }
      }
    },
  };
  
  // Create the chart
  if (window.projectProgressChart) {
    window.projectProgressChart.destroy();
  }
  window.projectProgressChart = new Chart(ctx2d, config);
}

/**
 * Create test status chart
 */
function createTestStatusChart() {
  const ctx = document.getElementById('test-status-chart');
  if (!ctx) return;
  
  const ctx2d = ctx.getContext('2d');
  
  // Chart data - using actual data if available
  const testsData = window.dashboardData?.tests || {};
  const byProject = testsData.byProject || {};
  
  // Extract data or use defaults
  const projectNames = Object.keys(byProject).length > 0 ? 
    Object.keys(byProject) : ['mExpress', 'MontPC CRM', 'Giandra Photos', 'Jerome Bikes'];
  
  const datasets = [];
  
  // Passing tests
  datasets.push({
    label: 'Passing',
    data: projectNames.map(name => {
      const project = byProject[name];
      return project ? (project.total > 0 ? Math.round((project.passing / project.total) * 100) : 0) : 
        name === 'mExpress' ? 52.3 : 0;
    }),
    backgroundColor: 'rgba(16, 185, 129, 0.7)'
  });
  
  // Failing tests
  datasets.push({
    label: 'Failing',
    data: projectNames.map(name => {
      const project = byProject[name];
      return project ? (project.total > 0 ? Math.round((project.failing / project.total) * 100) : 0) : 
        name === 'mExpress' ? 43.1 : name === 'MontPC CRM' ? 100 : 0;
    }),
    backgroundColor: 'rgba(239, 68, 68, 0.7)'
  });
  
  // Hanging tests
  datasets.push({
    label: 'Hanging',
    data: projectNames.map(name => {
      const project = byProject[name];
      return project ? (project.total > 0 ? Math.round(((project.hanging || 0) / project.total) * 100) : 0) : 
        name === 'mExpress' ? 4.6 : 0;
    }),
    backgroundColor: 'rgba(245, 158, 11, 0.7)'
  });
  
  // Chart data
  const data = {
    labels: projectNames,
    datasets: datasets
  };
  
  // Chart config
  const config = {
    type: 'bar',
    data: data,
    options: {
      plugins: {
        title: {
          display: false
        },
        legend: {
          position: 'bottom'
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          max: 100,
          title: {
            display: true,
            text: 'Percentage (%)'
          }
        }
      }
    },
  };
  
  // Create the chart
  if (window.testStatusChart) {
    window.testStatusChart.destroy();
  }
  window.testStatusChart = new Chart(ctx2d, config);
}

/**
 * Create test priority chart
 */
function createTestPriorityChart(data) {
  const ctx = document.getElementById('test-priority-chart');
  if (!ctx) return;
  
  const ctx2d = ctx.getContext('2d');
  
  // Get data from the dashboard data
  const priorityData = data.tests?.byPriority || {};
  
  const p0Success = priorityData.p0?.success || 0;
  const p1Success = priorityData.p1?.success || 0;
  const p2Success = priorityData.p2?.success || 0;
  const p3Success = priorityData.p3?.success || 0;
  
  // Chart data
  const chartData = {
    labels: ['P0 (Critical)', 'P1 (Important)', 'P2 (Secondary)', 'P3 (Performance)'],
    datasets: [
      {
        label: 'Test Success Rate',
        data: [p0Success, p1Success, p2Success, p3Success],
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',  // Red for critical
          'rgba(245, 158, 11, 0.7)', // Orange for important
          'rgba(79, 70, 229, 0.7)',  // Blue for secondary
          'rgba(16, 185, 129, 0.7)'  // Green for performance
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
          'rgb(79, 70, 229)',
          'rgb(16, 185, 129)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Chart config
  const config = {
    type: 'bar',
    data: chartData,
    options: {
      plugins: {
        legend: {
          display: false
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Success Rate (%)'
          }
        }
      }
    },
  };
  
  // Create the chart
  if (window.testPriorityChart) {
    window.testPriorityChart.destroy();
  }
  window.testPriorityChart = new Chart(ctx2d, config);
}

/**
 * Create test project chart
 */
function createTestProjectChart(data) {
  const ctx = document.getElementById('test-project-chart');
  if (!ctx) return;
  
  const ctx2d = ctx.getContext('2d');
  
  // Chart data based on byProject data
  const byProject = data.tests?.byProject || {};
  
  const projectNames = Object.keys(byProject).length > 0 ? 
    Object.keys(byProject).filter(name => name !== 'unclassified') : 
    ['mExpress Core', 'MontPC CRM', 'UI Components', 'Utils'];
  
  const passingRates = projectNames.map(name => {
    const project = byProject[name];
    return project && project.total > 0 ? 
      Math.round((project.passing / project.total) * 100) : 
      name === 'mExpress Core' ? 52.3 : 0;
  });
  
  const failingRates = projectNames.map(name => {
    const project = byProject[name];
    return project && project.total > 0 ? 
      Math.round((project.failing / project.total) * 100) : 
      name === 'mExpress Core' ? 43.1 : name === 'MontPC CRM' ? 100 : 0;
  });
  
  const hangingRates = projectNames.map(name => {
    const project = byProject[name];
    return project && project.total > 0 ? 
      Math.round(((project.hanging || 0) / project.total) * 100) : 
      name === 'mExpress Core' ? 4.6 : 0;
  });
  
  // Chart data
  const chartData = {
    labels: projectNames,
    datasets: [
      {
        label: 'Passing',
        data: passingRates,
        backgroundColor: 'rgba(16, 185, 129, 0.7)'
      },
      {
        label: 'Failing',
        data: failingRates,
        backgroundColor: 'rgba(239, 68, 68, 0.7)'
      },
      {
        label: 'Hanging',
        data: hangingRates,
        backgroundColor: 'rgba(245, 158, 11, 0.7)'
      }
    ]
  };
  
  // Chart config
  const config = {
    type: 'bar',
    data: chartData,
    options: {
      plugins: {
        title: {
          display: false
        },
        legend: {
          position: 'bottom'
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          max: 100,
          title: {
            display: true,
            text: 'Percentage (%)'
          }
        }
      }
    },
  };
  
  // Create the chart
  if (window.testProjectChart) {
    window.testProjectChart.destroy();
  }
  window.testProjectChart = new Chart(ctx2d, config);
}

/**
 * Utility function to capitalize first letter
 */
function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Initialize architecture dashboard with data from dashboardData
 */
function initArchitectureDashboard() {
  if (!window.dashboardData || !window.dashboardData.architecture) {
    console.error('Architecture data not loaded');
    return;
  }
  
  const data = window.dashboardData.architecture;
  
  // Update architecture overview metrics
  updateArchitectureOverview(data);
  
  // Update component status in the diagram
  updateComponentStatus(data);
  
  // Set up project selector
  setupProjectSelector(data);
  
  // Setup component modal
  setupComponentModal(data);
  
  // Setup BRQ filters
  setupBRQFilters(data.brqs);
  
  // Initialize SVG connections
  drawComponentConnections(data);
  
  // Update last updated
  const timestamp = window.dashboardData.lastUpdated || new Date().toISOString().split('T')[0];
  document.getElementById('last-updated').textContent = `Last updated: ${timestamp}`;
  document.getElementById('footer-last-updated').textContent = timestamp;
}

/**
 * Update architecture overview metrics
 */
function updateArchitectureOverview(data) {
  // Get component stats
  const components = Object.values(data.components || {});
  const completedCount = components.filter(c => c.status === 'complete').length;
  const inProgressCount = components.filter(c => c.status === 'in-progress').length;
  const startedCount = components.filter(c => c.status === 'started').length;
  const notStartedCount = components.filter(c => c.status === 'not-started').length;
  const totalCount = components.length;
  
  // Get BRQ stats
  const brqs = data.brqs || [];
  const completedBrqs = brqs.filter(b => b.status === 'complete').length;
  const inProgressBrqs = brqs.filter(b => b.status === 'in-progress').length;
  const plannedBrqs = brqs.filter(b => b.status === 'planned' || b.status === 'not-started').length;
  const totalBrqs = brqs.length;
  
  // Get test stats
  const testData = window.dashboardData.tests?.summary || {};
  const passingTests = testData.passing || 0;
  const totalTests = testData.total || 0;
  
  // Calculate overall completion
  const overallCompletion = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  // Update sidebar stats
  document.querySelector('.sidebar-stat-value').textContent = `${overallCompletion}%`;
  document.querySelector('.progress-bar-fill').style.width = `${overallCompletion}%`;
  
  // Update component status
  const componentsCompleted = document.querySelector('.sidebar-section:nth-of-type(2) .sidebar-stat-value');
  if (componentsCompleted) {
    componentsCompleted.textContent = `${completedCount}/${totalCount}`;
    componentsCompleted.nextElementSibling.nextElementSibling.querySelector('.progress-bar-fill').style.width = 
      `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`;
  }
  
  // Update status legend
  const legendComplete = document.querySelector('.legend-item:nth-of-type(1) span');
  const legendInProgress = document.querySelector('.legend-item:nth-of-type(2) span');
  const legendPlanned = document.querySelector('.legend-item:nth-of-type(3) span');
  const legendNotStarted = document.querySelector('.legend-item:nth-of-type(4) span');
  
  if (legendComplete) legendComplete.textContent = `Complete (${completedCount})`;
  if (legendInProgress) legendInProgress.textContent = `In Progress (${inProgressCount})`;
  if (legendPlanned) legendPlanned.textContent = `Started (${startedCount})`;
  if (legendNotStarted) legendNotStarted.textContent = `Not Started (${notStartedCount})`;
  
  // Update BRQ stats
  const brqsCompleted = document.querySelector('.sidebar-section:nth-of-type(3) .sidebar-stat-value');
  if (brqsCompleted) {
    brqsCompleted.textContent = `${completedBrqs}/${totalBrqs}`;
    brqsCompleted.nextElementSibling.nextElementSibling.querySelector('.progress-bar-fill').style.width = 
      `${totalBrqs > 0 ? (completedBrqs / totalBrqs) * 100 : 0}%`;
  }
  
  // Update test stats
  const testsPassing = document.querySelector('.sidebar-section:nth-of-type(4) .sidebar-stat-value');
  if (testsPassing) {
    testsPassing.textContent = `${passingTests}/${totalTests}`;
    testsPassing.nextElementSibling.nextElementSibling.querySelector('.progress-bar-fill').style.width = 
      `${totalTests > 0 ? (passingTests / totalTests) * 100 : 0}%`;
  }
  
  // Update overview cards
  const overviewStats = document.querySelectorAll('.overview-stat-value');
  if (overviewStats.length >= 3) {
    overviewStats[0].textContent = `${Math.round((completedCount / totalCount) * 100)}%`;
    overviewStats[1].textContent = `${Math.round((inProgressCount / totalCount) * 100)}%`;
    overviewStats[2].textContent = `${Math.round(((startedCount + notStartedCount) / totalCount) * 100)}%`;
  }
  
  const brqStats = document.querySelectorAll('.overview-card:nth-of-type(2) .overview-stat-value');
  if (brqStats.length >= 3) {
    brqStats[0].textContent = `${completedBrqs}`;
    brqStats[1].textContent = `${inProgressBrqs}`;
    brqStats[2].textContent = `${plannedBrqs}`;
  }
  
  // Initialize charts
  initCharts(completedCount, inProgressCount, startedCount, notStartedCount, 
             completedBrqs, inProgressBrqs, plannedBrqs);
  
  // Update current focus BRQs
  updateCurrentBRQs(data.brqs);
}

/**
 * Update component status in the architecture diagram
 */
function updateComponentStatus(data) {
  const components = Object.values(data.components || {});
  
  // Update each component box in the diagram
  document.querySelectorAll('.component-box').forEach(box => {
    const componentName = box.getAttribute('data-component');
    
    // Find matching component data
    const componentData = components.find(c => c.name === componentName);
    
    if (componentData) {
      // Update status
      box.setAttribute('data-status', componentData.status);
      box.className = `component-box ${componentData.status}`;
      
      // Update status indicator
      const statusIndicator = box.querySelector('.component-status');
      if (statusIndicator) {
        switch (componentData.status) {
          case 'complete':
            statusIndicator.textContent = '🟢';
            break;
          case 'in-progress':
            statusIndicator.textContent = '🟡';
            break;
          case 'started':
            statusIndicator.textContent = '🟠';
            break;
          case 'not-started':
            statusIndicator.textContent = '🔴';
            break;
          default:
            statusIndicator.textContent = '⚪';
        }
      }
      
      // Update description if available
      const descElement = box.querySelector('.component-desc');
      if (descElement && componentData.description) {
        descElement.textContent = componentData.description;
      }
      
      // Update progress bar
      const progressBar = box.querySelector('.component-progress');
      if (progressBar) {
        progressBar.className = `component-progress ${componentData.status}`;
        const progressFill = progressBar.querySelector('.progress-bar-fill');
        if (progressFill) {
          progressFill.style.width = `${componentData.progress}%`;
        }
      }
      
      // Store component data for modal
      box.setAttribute('data-info', JSON.stringify(componentData));
    }
  });
}

/**
 * Setup project selector
 */
function setupProjectSelector(data) {
  const projectOptions = document.querySelectorAll('.project-option');
  const projects = data.projects || {};
  
  projectOptions.forEach(option => {
    const projectId = option.getAttribute('data-project').toLowerCase();
    
    // Skip if no project data or "all" option
    if (projectId === 'all' || !projects[projectId]) return;
    
    option.addEventListener('click', () => {
      // Update active state
      projectOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      
      // Filter components by project
      filterComponentsByProject(projectId, data);
    });
  });
}

/**
 * Filter components in the architecture diagram by project
 */
function filterComponentsByProject(projectId, data) {
  const components = Object.values(data.components || {});
  
  // If "all" is selected, show all components
  if (projectId === 'all') {
    document.querySelectorAll('.component-box').forEach(comp => {
      comp.style.display = '';
    });
    return;
  }
  
  // Get components for this project
  const projectComponents = components.filter(c => c.project === projectId);
  const projectComponentNames = projectComponents.map(c => c.name);
  
  // Filter component boxes
  document.querySelectorAll('.component-box').forEach(comp => {
    const componentName = comp.getAttribute('data-component');
    if (projectComponentNames.includes(componentName)) {
      comp.style.display = '';
    } else {
      comp.style.display = 'none';
    }
  });
  
  // Update BRQs to only show those for this project
  filterBRQsByProject(projectId, data.brqs);
  
  // Update current phase based on project
  updateCurrentPhase(projectId, data);
}

/**
 * Filter BRQs by project
 */
function filterBRQsByProject(projectId, brqs) {
  const projectBrqs = brqs.filter(b => b.project === projectId);
  const projectBrqIds = projectBrqs.map(b => b.id);
  
  // Filter BRQ cards
  document.querySelectorAll('.brq-card').forEach(card => {
    const brqId = card.getAttribute('data-brq');
    if (projectId === 'all' || projectBrqIds.includes(brqId)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

/**
 * Update current phase information based on project
 */
function updateCurrentPhase(projectId, data) {
  const phases = data.phases || [];
  const projectPhases = phases.filter(p => p.project === projectId);
  
  // Find current phase (in progress)
  const currentPhase = projectPhases.find(p => p.status === 'in-progress') || 
                       projectPhases.find(p => p.status === 'current');
  
  if (currentPhase) {
    const phaseElement = document.querySelector('.sidebar-section:nth-of-type(5) .sidebar-stat-value');
    if (phaseElement) {
      phaseElement.textContent = `Phase ${currentPhase.number}/4`;
    }
    
    const phaseNameElement = document.querySelector('.sidebar-section:nth-of-type(5) .sidebar-stat-label');
    if (phaseNameElement) {
      phaseNameElement.textContent = currentPhase.name;
    }
    
    const phaseProgressElement = document.querySelector('.sidebar-section:nth-of-type(5) .progress-bar-fill');
    if (phaseProgressElement) {
      phaseProgressElement.style.width = `${currentPhase.progress}%`;
    }
  }
}

/**
 * Setup component modal with dynamic data
 */
function setupComponentModal(data) {
  const componentBoxes = document.querySelectorAll('.component-box');
  const modal = document.getElementById('component-modal');
  const closeBtn = document.getElementById('modal-close');
  
  componentBoxes.forEach(box => {
    box.addEventListener('click', () => {
      const componentName = box.getAttribute('data-component');
      const componentStatus = box.getAttribute('data-status');
      const componentInfo = box.getAttribute('data-info');
      
      // Parse component data if available
      let componentData;
      try {
        componentData = componentInfo ? JSON.parse(componentInfo) : null;
      } catch (error) {
        componentData = null;
      }
      
      // If component data was found directly
      if (componentData) {
        updateComponentModal(componentData, data);
      } else {
        // Otherwise look it up by name
        const component = Object.values(data.components || {}).find(c => c.name === componentName);
        if (component) {
          updateComponentModal(component, data);
        } else {
          // Fallback to basic info
          document.getElementById('component-modal-title').textContent = componentName;
          document.getElementById('component-description').textContent = box.querySelector('.component-desc').textContent;
        }
      }
      
      // Show the modal
      modal.classList.add('active');
    });
  });
  
  // Close modal on close button click
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }
  
  // Close modal on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/**
 * Update component modal with data
 */
function updateComponentModal(component, data) {
  // Update title and description
  document.getElementById('component-modal-title').textContent = component.name;
  document.getElementById('component-description').textContent = component.description;
  
  // Find tests related to this component
  const testStatus = document.getElementById('component-test-status');
  if (testStatus) {
    // Look for BRQs related to this component
    const relatedBrqs = data.brqs.filter(brq => 
      component.brqs && component.brqs.includes(brq.id)
    );
    
    if (relatedBrqs.length > 0) {
      const testsPassing = relatedBrqs.reduce((sum, brq) => sum + brq.testsPassing, 0);
      const testsTotal = relatedBrqs.reduce((sum, brq) => sum + brq.testsTotal, 0);
      
      testStatus.innerHTML = `
        <div class="test-status">
          <span class="test-passing">✓ ${testsPassing} passing</span>
        </div>
        ${testsTotal - testsPassing > 0 ? `
        <div class="test-status">
          <span class="test-failing">✗ ${testsTotal - testsPassing} failing</span>
        </div>` : ''}
      `;
    } else {
      testStatus.innerHTML = `<div class="test-status">No associated tests</div>`;
    }
  }
  
  // Find dependencies
  const dependenciesElement = document.getElementById('component-dependencies');
  if (dependenciesElement) {
    // Find components that this component depends on
    const connections = window.componentConnections || [];
    const dependencies = connections
      .filter(conn => conn.source === component.name)
      .map(conn => conn.target);
    
    if (dependencies.length > 0) {
      dependenciesElement.innerHTML = dependencies.map(dep => `
        <div class="dependency-item">
          <span class="dependency-arrow">→</span>
          <span>${dep}</span>
        </div>
      `).join('');
    } else {
      dependenciesElement.innerHTML = `<div class="dependency-item">No explicit dependencies</div>`;
    }
  }
  
  // Find related BRQs
  const brqsElement = document.getElementById('component-brqs');
  if (brqsElement) {
    const relatedBrqs = data.brqs.filter(brq => 
      component.brqs && component.brqs.includes(brq.id)
    );
    
    if (relatedBrqs.length > 0) {
      brqsElement.innerHTML = relatedBrqs.map(brq => `
        <div class="modal-brq ${brq.status}">
          <div class="brq-id">${brq.id}</div>
          <div class="brq-name">${brq.name}</div>
          <div class="brq-progress">
            <div class="progress-bar-fill" style="width: ${brq.progress}%; background: var(--${brq.status}-color);"></div>
          </div>
        </div>
      `).join('');
    } else {
      brqsElement.innerHTML = `<div class="modal-brq">No associated BRQs</div>`;
    }
  }
}

/**
 * Setup BRQ filters
 */
function setupBRQFilters(brqs) {
  const brqFilters = document.querySelectorAll('.brq-filter');
  
  // Update current focus BRQs
  updateCurrentBRQs(brqs);
  
  brqFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      // Update active state
      brqFilters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');
      
      // Get selected filter
      const filterValue = filter.getAttribute('data-filter');
      
      // Filter BRQs
      filterBRQs(filterValue, brqs);
    });
  });
}

/**
 * Update current focus BRQs
 */
function updateCurrentBRQs(brqs) {
  const currentBrqsContainer = document.getElementById('current-brqs');
  if (!currentBrqsContainer) return;
  
  // Find in-progress and high priority BRQs
  const inProgressBrqs = brqs.filter(brq => 
    brq.status === 'in-progress' && (brq.priority === 'P0' || brq.priority === 'P1')
  );
  
  // Sort by priority and progress (show most pressing first)
  const sortedBrqs = inProgressBrqs.sort((a, b) => {
    // First sort by priority (P0 > P1)
    if (a.priority !== b.priority) {
      return a.priority === 'P0' ? -1 : 1;
    }
    // Then sort by progress (lower progress first)
    return a.progress - b.progress;
  });
  
  // Take top 3 most important in-progress BRQs
  const topBrqs = sortedBrqs.slice(0, 3);
  
  // Add completed BRQs if needed to fill the space
  if (topBrqs.length < 3) {
    const completedBrqs = brqs.filter(brq => brq.status === 'complete')
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 3 - topBrqs.length);
    
    topBrqs.push(...completedBrqs);
  }
  
  // Generate BRQ cards
  if (topBrqs.length > 0) {
    currentBrqsContainer.innerHTML = topBrqs.map(brq => `
      <div class="brq-card ${brq.status}" data-brq="${brq.id}">
        <div class="brq-id">${brq.id}</div>
        <div class="brq-name">${brq.name}</div>
        <div class="brq-details">
          <div>Tests: ${brq.tests}</div>
          <div class="brq-meta">
            <div class="brq-tag">${brq.priority}</div>
            <div class="brq-tag">${getComponentCategory(brq.id)}</div>
          </div>
        </div>
        <div class="brq-progress">
          <div class="progress-bar-fill" style="width: ${brq.progress}%; background: var(--${brq.status}-color);"></div>
        </div>
      </div>
    `).join('');
  }
}

/**
 * Extract component category from BRQ ID
 */
function getComponentCategory(brqId) {
  // Extract component type from BRQ ID
  const match = brqId.match(/-(BE|FE|API|FULL|INFRA|DOC)$/);
  return match ? match[1] : 'Component';
}

/**
 * Filter BRQs based on status
 */
function filterBRQs(filter, brqs) {
  const currentBrqsContainer = document.getElementById('current-brqs');
  if (!currentBrqsContainer) return;
  
  let filteredBrqs;
  
  if (filter === 'all') {
    // Sort by priority first, then status
    filteredBrqs = [...brqs].sort((a, b) => {
      // First sort by priority (P0 > P1 > P2)
      if (a.priority !== b.priority) {
        if (a.priority === 'P0') return -1;
        if (b.priority === 'P0') return 1;
        if (a.priority === 'P1') return -1;
        if (b.priority === 'P1') return 1;
        return 0;
      }
      // Then sort by status (in-progress > complete > planned)
      const statusOrder = { 'in-progress': 0, 'complete': 1, 'planned': 2, 'not-started': 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    }).slice(0, 5); // Limit to 5 to avoid crowding
  } else if (filter === 'current') {
    filteredBrqs = brqs.filter(brq => brq.status === 'in-progress');
  } else if (filter === 'completed') {
    filteredBrqs = brqs.filter(brq => brq.status === 'complete');
  } else if (filter === 'planned') {
    filteredBrqs = brqs.filter(brq => brq.status === 'planned' || brq.status === 'not-started');
  }
  
  // Generate BRQ cards
  if (filteredBrqs && filteredBrqs.length > 0) {
    currentBrqsContainer.innerHTML = filteredBrqs.map(brq => `
      <div class="brq-card ${brq.status}" data-brq="${brq.id}">
        <div class="brq-id">${brq.id}</div>
        <div class="brq-name">${brq.name}</div>
        <div class="brq-details">
          <div>Tests: ${brq.tests}</div>
          <div class="brq-meta">
            <div class="brq-tag">${brq.priority}</div>
            <div class="brq-tag">${getComponentCategory(brq.id)}</div>
          </div>
        </div>
        <div class="brq-progress">
          <div class="progress-bar-fill" style="width: ${brq.progress}%; background: var(--${brq.status}-color);"></div>
        </div>
      </div>
    `).join('');
  } else {
    currentBrqsContainer.innerHTML = `<div class="brq-card">No BRQs matching the selected filter</div>`;
  }
}

/**
 * Draw connections between components
 */
function drawComponentConnections(data) {
  // Load connections data from global variable if available, otherwise use empty array
  const connections = window.componentConnections || [];
  
  const svg = document.getElementById('connections-svg');
  if (!svg || !window.d3) return;
  
  // Clear existing connections
  d3.select(svg).selectAll('*').remove();
  
  // Draw each connection
  connections.forEach(conn => {
    const sourceElem = document.querySelector(`[data-component="${conn.source}"]`);
    const targetElem = document.querySelector(`[data-component="${conn.target}"]`);
    
    if (sourceElem && targetElem) {
      // Get element positions
      const sourceRect = sourceElem.getBoundingClientRect();
      const targetRect = targetElem.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();
      
      // Calculate source and target coordinates
      const sourceX = sourceRect.left + sourceRect.width / 2 - svgRect.left;
      const sourceY = sourceRect.top + sourceRect.height - svgRect.top;
      const targetX = targetRect.left + targetRect.width / 2 - svgRect.left;
      const targetY = targetRect.top - svgRect.top;
      
      // Create the SVG path with appropriate styling based on connection type
      const pathClass = conn.type === 'dependency' ? 'connection-dependency' : 'connection-layer';
      const opacity = conn.strength ? conn.strength : conn.type === 'dependency' ? 0.8 : 0.5;
      
      d3.select(svg)
        .append('path')
        .attr('class', `connection ${pathClass}`)
        .attr('d', `M${sourceX},${sourceY} C${sourceX},${sourceY + 20} ${targetX},${targetY - 20} ${targetX},${targetY}`)
        .style('opacity', opacity);
    }
  });
}

/**
 * Initialize charts for architecture dashboard
 */
function initCharts(completedCount, inProgressCount, startedCount, notStartedCount,
                    completedBrqs, inProgressBrqs, plannedBrqs) {
  // Component Status Chart
  const componentCtx = document.getElementById('component-status-chart');
  if (componentCtx) {
    new Chart(componentCtx, {
      type: 'doughnut',
      data: {
        labels: ['Complete', 'In Progress', 'Started', 'Not Started'],
        datasets: [{
          data: [completedCount, inProgressCount, startedCount, notStartedCount],
          backgroundColor: [
            getComputedStyle(document.documentElement).getPropertyValue('--complete-color'),
            getComputedStyle(document.documentElement).getPropertyValue('--in-progress-color'),
            getComputedStyle(document.documentElement).getPropertyValue('--planned-color'),
            getComputedStyle(document.documentElement).getPropertyValue('--not-started-color')
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--blueprint-text')
            }
          }
        }
      }
    });
  }
  
  // BRQ Progress Chart
  const brqCtx = document.getElementById('brq-progress-chart');
  if (brqCtx) {
    new Chart(brqCtx, {
      type: 'bar',
      data: {
        labels: ['Completed', 'In Progress', 'Planned'],
        datasets: [{
          data: [completedBrqs, inProgressBrqs, plannedBrqs],
          backgroundColor: [
            getComputedStyle(document.documentElement).getPropertyValue('--complete-color'),
            getComputedStyle(document.documentElement).getPropertyValue('--in-progress-color'),
            getComputedStyle(document.documentElement).getPropertyValue('--planned-color')
          ],
          borderWidth: 0
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--blueprint-text')
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--blueprint-text')
            }
          }
        }
      }
    });
  }
}