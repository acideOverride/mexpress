// Dashboard functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard loaded, initializing...');
    
    // Initialize dashboard data
    initializeDashboard();
    
    // Set up tab navigation
    setupTabs();
    
    // Set up filters
    setupFilters();
    
    // Set up search
    setupSearch();
    
    // Set up theme toggle
    setupThemeToggle();
});

// Load dashboard data from JSON
async function initializeDashboard() {
    try {
        // We'll assume dashboardData is loaded from dashboard-data.js
        if (!window.dashboardData) {
            console.error('Dashboard data not found!');
            return;
        }
        
        const data = window.dashboardData;
        
        // Update last updated date
        document.getElementById('last-updated').textContent = data.lastUpdated;
        
        // Render all sections
        renderSummaryStats(data.summary);
        renderRecentFixes(data.recentFixes);
        renderNextSteps(data.nextSteps);
        renderPriorityProgress(data.byPriority);
        renderBrqStats(data.brqs);
        renderProjectStatus(data.byProject);
        renderLocationStatus(data.byLocation);
        
        // Render tabs content
        renderProjectsTab(data.byProject);
        renderPriorityTab(data.byPriority);
        renderLocationTab(data.byLocation);
        renderBrqTab(data.brqs);
        
        // Render test details
        renderTestDetails(data.tests);
        
        console.log('Dashboard initialized successfully');
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
}

// Tab navigation
function setupTabs() {
    const tabs = document.querySelectorAll('.dashboard-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabType = tab.dataset.tab;
            
            // Remove active class from all tabs and tab contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Find and activate the corresponding tab content
            const tabId = `${tabType}-tab`;
            const contentElement = document.getElementById(tabId);
            
            if (contentElement) {
                contentElement.classList.add('active');
            }
        });
    });
}

// Filter functionality
function setupFilters() {
    // Project filters
    setupFilterButtons('projects-tab', 'filter', 'projects-table', 'data-project');
    
    // Priority filters
    setupFilterButtons('priority-tab', 'filter', 'priority-table', 'data-priority');
    
    // BRQ filters
    setupFilterButtons('brq-tab', 'filter', 'brq-table', 'data-brq-status');
    
    // Test details filters (status)
    const detailsTab = document.getElementById('details-tab');
    const detailsStatusFilters = detailsTab?.querySelectorAll('.filter-button[data-filter]');
    const detailsPriorityFilters = detailsTab?.querySelectorAll('.filter-button[data-filter-priority]');
    
    // Status filters (passing, failing, etc.)
    detailsStatusFilters?.forEach(button => {
        button.addEventListener('click', () => {
            detailsStatusFilters.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            filterTestDetails();
        });
    });
    
    // Priority filters (P0, P1, etc.)
    detailsPriorityFilters?.forEach(button => {
        button.addEventListener('click', () => {
            // Toggle active state
            if (button.classList.contains('active')) {
                button.classList.remove('active');
            } else {
                detailsPriorityFilters.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            }
            
            filterTestDetails();
        });
    });
}

// Set up filter buttons for a specific tab
function setupFilterButtons(tabId, filterAttribute, tableId, dataAttribute) {
    const tab = document.getElementById(tabId);
    if (!tab) return;
    
    const filterButtons = tab.querySelectorAll(`.filter-button[data-${filterAttribute}]`);
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const rows = table.querySelectorAll(`tbody tr[${dataAttribute}]`);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset[filterAttribute];
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter rows
            rows.forEach(row => {
                if (filter === 'all' || row.getAttribute(dataAttribute) === filter) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });
}

// Filter test details based on active filters
function filterTestDetails() {
    const statusFilter = document.querySelector('#details-tab .filter-button[data-filter].active')?.dataset.filter || 'all';
    const priorityFilter = document.querySelector('#details-tab .filter-button[data-filter-priority].active')?.dataset.filterPriority;
    
    const rows = document.querySelectorAll('#tests-table tbody tr');
    
    rows.forEach(row => {
        const rowStatus = row.dataset.testStatus;
        const rowPriority = row.dataset.testPriority;
        
        const statusMatch = statusFilter === 'all' || rowStatus === statusFilter;
        const priorityMatch = !priorityFilter || rowPriority === priorityFilter;
        
        if (statusMatch && priorityMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const rows = document.querySelectorAll('#tests-table tbody tr');
        
        rows.forEach(row => {
            const testPath = row.querySelector('td:nth-child(3)')?.textContent.toLowerCase() || '';
            
            if (testPath.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// Theme toggle functionality
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('mexpress-dashboard-theme');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply theme based on saved preference or system preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        document.documentElement.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    } else {
        document.documentElement.classList.remove('dark-mode');
        themeIcon.textContent = '🌙';
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark-mode')) {
            document.documentElement.classList.remove('dark-mode');
            localStorage.setItem('mexpress-dashboard-theme', 'light');
            themeIcon.textContent = '🌙';
        } else {
            document.documentElement.classList.add('dark-mode');
            localStorage.setItem('mexpress-dashboard-theme', 'dark');
            themeIcon.textContent = '☀️';
        }
    });
}

// Render summary statistics
function renderSummaryStats(summary) {
    const container = document.getElementById('summary-stats');
    if (!container) return;
    
    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-value" style="color: var(--color-primary);">${summary.total}</div>
            <div class="stat-label">Total Tests</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: var(--color-success);">${summary.passing}</div>
            <div class="stat-label">Passing Tests</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: var(--color-danger);">${summary.failing}</div>
            <div class="stat-label">Failing Tests</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: var(--color-warning);">${summary.hanging || 0}</div>
            <div class="stat-label">Hanging Tests</div>
        </div>
    `;
}

// Render recent fixes
function renderRecentFixes(fixes) {
    const container = document.getElementById('recent-fixes-content');
    if (!container || !fixes || !fixes.length) {
        container.innerHTML = '<div class="loading-placeholder">No recent fixes available</div>';
        return;
    }
    
    let html = '';
    
    // Generate HTML for each fix (limit to 5)
    const fixesToShow = fixes.slice(0, 5);
    fixesToShow.forEach(fix => {
        // Extract component name if possible
        let component = '';
        let description = fix;
        
        const colonIndex = fix.indexOf(':');
        if (colonIndex > 0) {
            component = fix.substring(0, colonIndex).trim();
            description = fix.substring(colonIndex + 1).trim();
        }
        
        html += `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="color: var(--color-success);">✅</span>
                <span>${component ? `<strong>${component}</strong>: ${description}` : description}</span>
            </div>`;
    });
    
    container.innerHTML = html;
}

// Render next steps
function renderNextSteps(nextSteps) {
    const container = document.getElementById('next-steps-content');
    if (!container || !nextSteps) {
        container.innerHTML = '<div class="loading-placeholder">No next steps available</div>';
        return;
    }
    
    let html = '';
    
    // High Priority section
    if (nextSteps.high && nextSteps.high.length > 0) {
        html += `
            <div style="margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                    <span class="priority-indicator priority-p0"></span>
                    <strong>High Priority</strong>
                </div>
                <ul style="margin: 0; padding-left: 1.5rem; list-style-type: '▶️ ';">`;
        
        // Get the first 3 high priority items
        const highPriorityToShow = nextSteps.high.slice(0, 3);
        highPriorityToShow.forEach(step => {
            // For each step, extract the first bullet point or use the title
            const description = step.bullets && step.bullets.length > 0 
                ? step.bullets[0] 
                : (step.detail || step.title);
            
            html += `
                <li>${step.title}${description ? ` - ${description}` : ''}</li>`;
        });
        
        html += `
                </ul>
            </div>`;
    }
    
    // Medium Priority section
    if (nextSteps.medium && nextSteps.medium.length > 0) {
        html += `
            <div style="margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                    <span class="priority-indicator priority-p1"></span>
                    <strong>Medium Priority</strong>
                </div>
                <ul style="margin: 0; padding-left: 1.5rem; list-style-type: '🔄 ';">`;
        
        // Get the first 3 medium priority items
        const mediumPriorityToShow = nextSteps.medium.slice(0, 3);
        mediumPriorityToShow.forEach(step => {
            // For each step, extract the first bullet point or use the title
            const description = step.bullets && step.bullets.length > 0 
                ? step.bullets[0] 
                : (step.detail || step.title);
            
            html += `
                <li>${step.title}${description ? ` - ${description}` : ''}</li>`;
        });
        
        html += `
                </ul>
            </div>`;
    }
    
    // Low Priority section
    if (nextSteps.low && nextSteps.low.length > 0) {
        html += `
            <div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                    <span class="priority-indicator priority-p2"></span>
                    <strong>Low Priority</strong>
                </div>
                <ul style="margin: 0; padding-left: 1.5rem; list-style-type: '🔍 ';">`;
        
        // Get the first 3 low priority items
        const lowPriorityToShow = nextSteps.low.slice(0, 3);
        lowPriorityToShow.forEach(step => {
            // For each step, extract the first bullet point or use the title
            const description = step.bullets && step.bullets.length > 0 
                ? step.bullets[0] 
                : (step.detail || step.title);
            
            html += `
                <li>${step.title}${description ? ` - ${description}` : ''}</li>`;
        });
        
        html += `
                </ul>
            </div>`;
    }
    
    container.innerHTML = html;
}

// Render priority progress bars
function renderPriorityProgress(priorityData) {
    const container = document.getElementById('priority-progress');
    if (!container) return;
    
    let html = '';
    
    // Add progress bars for each priority level
    const priorities = [
        { key: 'p0', label: 'P0 (Critical)' },
        { key: 'p1', label: 'P1 (Important)' },
        { key: 'p2', label: 'P2 (Secondary)' },
        { key: 'p3', label: 'P3 (Performance)' }
    ];
    
    priorities.forEach(priority => {
        const data = priorityData[priority.key];
        if (!data) return;
        
        html += `
            <div class="progress-label">
                <span><span class="priority-indicator priority-${priority.key}"></span>${priority.label}</span>
                <span class="progress-percent">${data.success}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${data.success}%; background-color: var(--color-${priority.key === 'p0' ? 'danger' : priority.key === 'p1' ? 'warning' : priority.key === 'p2' ? 'info' : 'success'});"></div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Render BRQ stats
function renderBrqStats(brqData) {
    const container = document.getElementById('brq-stats');
    if (!container) return;
    
    // Calculate BRQ stats
    const completedBrqs = brqData.filter(brq => brq.status === 'complete').length;
    const inProgressBrqs = brqData.filter(brq => brq.status === 'in-progress').length;
    const notStartedBrqs = brqData.filter(brq => brq.status === 'not-started').length;
    const totalBrqs = brqData.length;
    const brqCompletionPercent = Math.round((completedBrqs / totalBrqs) * 100);
    
    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-value" style="color: var(--color-success);">${completedBrqs}</div>
            <div class="stat-label">Completed (100%)</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: var(--color-warning);">${inProgressBrqs}</div>
            <div class="stat-label">In Progress</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: var(--color-danger);">${notStartedBrqs}</div>
            <div class="stat-label">Not Started</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: var(--color-primary);">${totalBrqs}</div>
            <div class="stat-label">Total BRQs</div>
        </div>
    `;
    
    // Add completion progress bar
    const brqCompletionContainer = document.getElementById('brq-completion');
    if (brqCompletionContainer) {
        brqCompletionContainer.innerHTML = `
            <div class="progress-label">
                <span>Overall BRQ Completion</span>
                <span class="progress-percent">${brqCompletionPercent}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${brqCompletionPercent}%; background-color: var(--color-primary);"></div>
            </div>
        `;
    }
}

// Render project status
function renderProjectStatus(projectData) {
    const container = document.getElementById('project-status');
    if (!container) return;
    
    let html = '';
    
    // Add status items for each project
    Object.entries(projectData).forEach(([key, data]) => {
        const projectName = key === 'core' ? 'mExpress Core' :
                          key === 'montpc' ? 'MontPC CRM' :
                          key === 'ui' ? 'UI Components' : 'Utils';
        
        const successRate = data.success;
        const statusClass = successRate > 80 ? 'badge-success' :
                          successRate > 50 ? 'badge-warning' : 'badge-danger';
        
        html += `
            <li class="status-item">
                <span class="status-name">${projectName}</span>
                <span class="status-badge ${statusClass}">${successRate}% Passing</span>
            </li>
        `;
    });
    
    container.innerHTML = html;
}

// Render location status
function renderLocationStatus(locationData) {
    const container = document.getElementById('location-status');
    if (!container) return;
    
    const canonicalPercent = Math.round(locationData.canonical.total / (locationData.canonical.total + locationData.needToMove.total) * 100);
    const needToMovePercent = Math.round(locationData.needToMove.total / (locationData.canonical.total + locationData.needToMove.total) * 100);
    
    container.innerHTML = `
        <div class="progress-label">
            <span>In Canonical Location</span>
            <span class="progress-percent">${canonicalPercent}%</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${canonicalPercent}%; background-color: var(--color-success);"></div>
        </div>
        
        <div class="progress-label">
            <span>Need to Move (🔄)</span>
            <span class="progress-percent">${needToMovePercent}%</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${needToMovePercent}%; background-color: var(--color-danger);"></div>
        </div>
    `;
    
    // Render location table
    const tableBody = document.getElementById('location-table-body');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr data-location-type="canonical">
                <td>Canonical Location (📍)</td>
                <td>${locationData.canonical.total}</td>
                <td>${locationData.canonical.passing}</td>
                <td>${locationData.canonical.failing}</td>
                <td>
                    <div class="progress-bar" style="margin-bottom: 0;">
                        <div class="progress-fill" style="width: ${locationData.canonical.passing > 0 ? Math.round(locationData.canonical.passing / locationData.canonical.total * 100) : 0}%; background-color: var(--color-success);"></div>
                    </div>
                    <span>${locationData.canonical.passing > 0 ? Math.round(locationData.canonical.passing / locationData.canonical.total * 100) : 0}%</span>
                </td>
            </tr>
            <tr data-location-type="needs-moving">
                <td>Need to Move (🔄)</td>
                <td>${locationData.needToMove.total}</td>
                <td>${locationData.needToMove.passing}</td>
                <td>${locationData.needToMove.failing}</td>
                <td>
                    <div class="progress-bar" style="margin-bottom: 0;">
                        <div class="progress-fill" style="width: ${locationData.needToMove.passing > 0 ? Math.round(locationData.needToMove.passing / locationData.needToMove.total * 100) : 0}%; background-color: var(--color-warning);"></div>
                    </div>
                    <span>${locationData.needToMove.passing > 0 ? Math.round(locationData.needToMove.passing / locationData.needToMove.total * 100) : 0}%</span>
                </td>
            </tr>
        `;
    }
}

// Render Projects tab
function renderProjectsTab(projectData) {
    const tableBody = document.getElementById('projects-table-body');
    if (!tableBody) return;
    
    let html = '';
    
    // Add rows for each project
    Object.entries(projectData).forEach(([key, data]) => {
        const projectName = key === 'core' ? 'mExpress Core' :
                          key === 'montpc' ? 'MontPC CRM' :
                          key === 'ui' ? 'UI Components' : 'Utils';
        
        const successRate = data.success;
        const colorClass = successRate > 80 ? 'var(--color-success)' :
                         successRate > 50 ? 'var(--color-warning)' : 'var(--color-danger)';
        
        html += `
            <tr data-project="${key}">
                <td>${projectName}</td>
                <td>${data.total}</td>
                <td>${data.passing}</td>
                <td>${data.failing}</td>
                <td>${data.hanging || 0}</td>
                <td>
                    <div class="progress-bar" style="margin-bottom: 0;">
                        <div class="progress-fill" style="width: ${successRate}%; background-color: ${colorClass};"></div>
                    </div>
                    <span>${successRate}%</span>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

// Render Priority tab
function renderPriorityTab(priorityData) {
    const tableBody = document.getElementById('priority-table-body');
    if (!tableBody) return;
    
    let html = '';
    
    // Add rows for each priority level
    const priorities = [
        { key: 'p0', label: 'P0 (Critical)' },
        { key: 'p1', label: 'P1 (Important)' },
        { key: 'p2', label: 'P2 (Secondary)' },
        { key: 'p3', label: 'P3 (Performance)' }
    ];
    
    priorities.forEach(priority => {
        const data = priorityData[priority.key];
        if (!data) return;
        
        const successRate = data.success;
        const colorClass = successRate > 80 ? 'var(--color-success)' :
                         successRate > 50 ? 'var(--color-warning)' : 'var(--color-danger)';
        
        html += `
            <tr data-priority="${priority.key}">
                <td><span class="priority-indicator priority-${priority.key}"></span>${priority.label}</td>
                <td>${data.total}</td>
                <td>${data.passing}</td>
                <td>${data.failing}</td>
                <td>${data.hanging || 0}</td>
                <td>
                    <div class="progress-bar" style="margin-bottom: 0;">
                        <div class="progress-fill" style="width: ${successRate}%; background-color: ${colorClass};"></div>
                    </div>
                    <span>${successRate}%</span>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

// Render Location tab
function renderLocationTab(locationData) {
    const tableBody = document.getElementById('location-detail-table-body');
    if (!tableBody) return;
    
    const canonicalSuccessRate = locationData.canonical.passing > 0 ? 
        Math.round(locationData.canonical.passing / locationData.canonical.total * 100) : 0;
    
    const needToMoveSuccessRate = locationData.needToMove.passing > 0 ? 
        Math.round(locationData.needToMove.passing / locationData.needToMove.total * 100) : 0;
    
    tableBody.innerHTML = `
        <tr data-location-type="canonical">
            <td>Canonical Location (📍)</td>
            <td>${locationData.canonical.total}</td>
            <td>${locationData.canonical.passing}</td>
            <td>${locationData.canonical.failing}</td>
            <td>${locationData.canonical.hanging || 0}</td>
            <td>
                <div class="progress-bar" style="margin-bottom: 0;">
                    <div class="progress-fill" style="width: ${canonicalSuccessRate}%; background-color: ${canonicalSuccessRate > 50 ? 'var(--color-success)' : 'var(--color-danger)'};"></div>
                </div>
                <span>${canonicalSuccessRate}%</span>
            </td>
        </tr>
        <tr data-location-type="needs-moving">
            <td>Need to Move (🔄)</td>
            <td>${locationData.needToMove.total}</td>
            <td>${locationData.needToMove.passing}</td>
            <td>${locationData.needToMove.failing}</td>
            <td>${locationData.needToMove.hanging || 0}</td>
            <td>
                <div class="progress-bar" style="margin-bottom: 0;">
                    <div class="progress-fill" style="width: ${needToMoveSuccessRate}%; background-color: ${needToMoveSuccessRate > 50 ? 'var(--color-success)' : 'var(--color-danger)'};"></div>
                </div>
                <span>${needToMoveSuccessRate}%</span>
            </td>
        </tr>
    `;
}

// Render BRQ tab
function renderBrqTab(brqData) {
    const tableBody = document.getElementById('brq-table-body');
    if (!tableBody) return;
    
    let html = '';
    
    // Add rows for each BRQ
    brqData.forEach(brq => {
        const statusClass = brq.status === 'complete' ? 'badge-success' :
                          brq.status === 'in-progress' ? 'badge-warning' : 'badge-danger';
        
        const statusText = brq.status === 'complete' ? 'Complete' :
                          brq.status === 'in-progress' ? 'In Progress' : 'Not Started';
        
        const projectBadgeClass = brq.id.includes('MEXP') ? 'badge-mexp' : 'badge-mont';
        
        html += `
            <tr data-brq-status="${brq.status}">
                <td>${brq.id}</td>
                <td>${brq.name}</td>
                <td><span class="project-badge ${projectBadgeClass}">${brq.id}</span></td>
                <td>${brq.tests}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="progress-bar" style="margin-bottom: 0;">
                        <div class="progress-fill" style="width: ${brq.progress}%; background-color: ${
                            brq.progress === 100 ? 'var(--color-success)' :
                            brq.progress > 0 ? 'var(--color-warning)' : 'var(--color-danger)'
                        };"></div>
                    </div>
                    <span>${brq.progress}%</span>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

// Render test details
function renderTestDetails(tests) {
    const tableBody = document.getElementById('tests-table-body');
    if (!tableBody) return;
    
    let html = '';
    
    // Add rows for each test
    tests.forEach(test => {
        let statusClass = '';
        let statusIcon = '';
        
        switch(test.status) {
            case 'passing':
                statusClass = 'badge-success';
                statusIcon = '✅';
                break;
            case 'failing':
                statusClass = 'badge-danger';
                statusIcon = '❌';
                break;
            case 'hanging':
                statusClass = 'badge-warning';
                statusIcon = '❓';
                break;
            default:
                statusClass = 'badge-warning';
                statusIcon = '❓';
        }
        
        html += `
            <tr data-test-status="${test.status}" data-test-priority="${test.priority}">
                <td><span class="status-badge ${statusClass}">${statusIcon} ${test.status}</span></td>
                <td><span class="priority-indicator priority-${test.priority}"></span>${test.priority.toUpperCase()}</td>
                <td title="${test.path}">${test.shortPath}</td>
                <td>${test.location}</td>
                <td>${test.project}</td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}