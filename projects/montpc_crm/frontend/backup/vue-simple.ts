// Enhanced Dashboard with layout resembling original Vue design
document.addEventListener('DOMContentLoaded', () => {
  const appElement = document.getElementById('app');
  
  // Track app state
  const state = {
    customers: [],
    notifications: [],
    activeTab: 'dashboard',
    loading: false,
    error: null,
    ticketCount: 38,    // Mock data
    repairCount: 142,   // Mock data
    revenue: 19850      // Mock data
  };
  
  // Create app layout
  if (appElement) {
    // Initial app render with loading UI
    renderApp();
    
    // Load initial data
    loadData();
    
    // Setup event listeners for navigation
    setupEventListeners();
  }
  
  function renderApp() {
    appElement.innerHTML = `
      <div class="app-container">
        <!-- Sidebar Navigation -->
        <aside class="sidebar">
          <div class="sidebar-logo">
            <a href="#" class="logo-link" data-tab="dashboard">
              <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              <span class="logo-text">MontPC CRM</span>
            </a>
          </div>
          
          <nav class="sidebar-nav">
            <ul class="nav-list">
              <li class="nav-item">
                <a href="#" class="nav-link ${state.activeTab === 'dashboard' ? 'nav-link-active' : ''}" data-tab="dashboard">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  <span>Dashboard</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link ${state.activeTab === 'customers' ? 'nav-link-active' : ''}" data-tab="customers">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Customers</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link ${state.activeTab === 'tickets' ? 'nav-link-active' : ''}" data-tab="tickets">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                  </svg>
                  <span>Repair Tickets</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link ${state.activeTab === 'reports' ? 'nav-link-active' : ''}" data-tab="reports">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                  <span>Reports</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <!-- Main Content Area -->
        <div class="content-wrapper">
          <!-- Top Header with Search -->
          <header class="top-header">
            <div class="search-container">
              <div class="mega-search">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" placeholder="Search for customers, tickets, products..." class="search-input" />
              </div>
            </div>

            <div class="user-panel">
              <div class="user-info">
                <span class="user-name">Admin User</span>
                <span class="user-role">Administrator</span>
              </div>
              <button class="refresh-btn" id="refresh-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M23 4v6h-6"></path>
                  <path d="M1 20v-6h6"></path>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
                  <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
                </svg>
                <span>Refresh</span>
              </button>
            </div>
          </header>

          <!-- Notifications -->
          <div id="notifications-container" class="notifications-container">
            ${state.notifications.map(notification => `
              <div class="notification ${notification.type}">
                <div class="notification-content">${notification.message}</div>
                <button class="notification-close" data-id="${notification.id}">×</button>
              </div>
            `).join('')}
          </div>

          <!-- Main Content -->
          <main class="main-content">
            ${state.loading ? renderLoading() : renderTabContent()}
          </main>

          <!-- Footer -->
          <footer class="app-footer">
            <div class="footer-copyright">
              &copy; 2025 MontPC CRM - All rights reserved
            </div>
            <div class="footer-links">
              <a href="#" class="footer-link">Privacy</a>
              <a href="#" class="footer-link">Terms</a>
              <a href="#" class="footer-link">Help</a>
            </div>
          </footer>
        </div>
      </div>

      <style>
        /* Global Styles */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          color: #1f2937;
          background-color: #f9fafb;
          line-height: 1.6;
        }
        
        a {
          color: #2563eb;
          text-decoration: none;
        }
        
        button {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          cursor: pointer;
        }
        
        h1, h2, h3, h4, h5, h6 {
          color: #111827;
          font-weight: 600;
        }
        
        /* App Layout */
        .app-container {
          display: flex;
          min-height: 100vh;
        }
        
        /* Sidebar */
        .sidebar {
          width: 250px;
          background-color: #ffffff;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 10;
        }
        
        .sidebar-logo {
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .logo-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #2563eb;
          font-weight: 700;
          font-size: 1.25rem;
        }
        
        .logo-icon {
          margin-right: 10px;
          color: #2563eb;
        }
        
        .sidebar-nav {
          padding: 1rem 0;
          flex-grow: 1;
        }
        
        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .nav-item {
          margin-bottom: 0.25rem;
        }
        
        .nav-link {
          display: flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          color: #6b7280;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .nav-link svg {
          margin-right: 12px;
        }
        
        .nav-link:hover {
          background-color: #f3f4f6;
          color: #2563eb;
        }
        
        .nav-link-active {
          background-color: #eff6ff;
          color: #2563eb;
          font-weight: 600;
          border-right: 3px solid #2563eb;
        }
        
        /* Content Area */
        .content-wrapper {
          flex: 1;
          margin-left: 250px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        
        /* Top Header */
        .top-header {
          height: 64px;
          background-color: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1.5rem;
          position: sticky;
          top: 0;
          z-index: 5;
        }
        
        .search-container {
          flex: 1;
          max-width: 600px;
        }
        
        .mega-search {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .mega-search svg {
          position: absolute;
          left: 12px;
          color: #9ca3af;
        }
        
        .search-input {
          width: 100%;
          padding: 0.5rem 1rem 0.5rem 2.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 0.875rem;
          background-color: #f9fafb;
          transition: all 0.2s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #2563eb;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .user-panel {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .user-info {
          display: flex;
          flex-direction: column;
          text-align: right;
        }
        
        .user-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 14px;
        }
        
        .user-role {
          color: #6b7280;
          font-size: 12px;
        }
        
        .refresh-btn {
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
        }
        
        .refresh-btn:hover {
          background-color: #1d4ed8;
        }
        
        /* Notifications */
        .notifications-container {
          position: fixed;
          top: 70px;
          right: 20px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 400px;
        }
        
        .notification {
          padding: 12px 16px;
          border-radius: 6px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          animation: slideIn 0.3s ease;
        }
        
        .notification.success {
          background-color: #ecfdf5;
          border-left: 4px solid #10b981;
          color: #047857;
        }
        
        .notification.error {
          background-color: #fee2e2;
          border-left: 4px solid #ef4444;
          color: #b91c1c;
        }
        
        .notification.info {
          background-color: #eff6ff;
          border-left: 4px solid #3b82f6;
          color: #1e40af;
        }
        
        .notification-close {
          background: transparent;
          border: none;
          color: inherit;
          font-size: 18px;
          cursor: pointer;
          margin-left: 10px;
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        /* Main Content Area */
        .main-content {
          flex: 1;
          padding: 1.5rem;
          background-color: #f9fafb;
        }
        
        /* Dashboard Components */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .dashboard-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }
        
        .dashboard-subtitle {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }
        
        .overview-panel {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .overview-title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 4px 0;
        }
        
        .overview-date {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }
        
        .status-badge {
          background-color: #dcfce7;
          color: #166534;
          font-size: 13px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 16px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }
        
        .stat-card {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        
        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .stat-icon.customer {
          background-color: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }
        
        .stat-icon.ticket {
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
        
        .stat-icon.repair {
          background-color: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
        
        .stat-icon.revenue {
          background-color: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }
        
        .stat-details {
          flex: 1;
        }
        
        .stat-label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
          margin: 0 0 6px 0;
        }
        
        .stat-value {
          font-size: 22px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 6px 0;
        }
        
        .stat-trend {
          font-size: 12px;
        }
        
        .stat-trend.positive {
          color: #10b981;
        }
        
        .stat-trend.negative {
          color: #ef4444;
        }
        
        /* Customer List */
        .table-container {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 20px;
        }
        
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .table-title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }
        
        .table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .table th,
        .table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .table th {
          background-color: #f9fafb;
          font-weight: 500;
          color: #4b5563;
          font-size: 13px;
        }
        
        .table tbody tr:hover {
          background-color: #f9fafb;
        }
        
        .badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .badge.active {
          background-color: #dcfce7;
          color: #166534;
        }
        
        .badge.inactive {
          background-color: #f3f4f6;
          color: #6b7280;
        }
        
        /* Footer */
        .app-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background-color: #ffffff;
          border-top: 1px solid #e5e7eb;
        }
        
        .footer-copyright {
          color: #6b7280;
          font-size: 0.875rem;
        }
        
        .footer-links {
          display: flex;
          gap: 1.5rem;
        }
        
        .footer-link {
          color: #6b7280;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s ease;
        }
        
        .footer-link:hover {
          color: #2563eb;
        }
        
        /* Loading State */
        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 50px 0;
        }
        
        .spinner {
          border: 4px solid rgba(229, 231, 235, 0.5);
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }
        
        .loading-text {
          color: #6b7280;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Responsive Adjustments */
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .sidebar {
            width: 64px;
          }
          
          .sidebar .logo-text,
          .sidebar .nav-link span {
            display: none;
          }
          
          .sidebar .nav-link {
            justify-content: center;
            padding: 0.75rem;
          }
          
          .sidebar .nav-link svg {
            margin-right: 0;
          }
          
          .content-wrapper {
            margin-left: 64px;
          }
          
          .user-info {
            display: none;
          }
        }
        
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    `;
  }
  
  function renderLoading() {
    return `
      <div class="loading">
        <div class="spinner"></div>
        <div class="loading-text">Loading data...</div>
      </div>
    `;
  }
  
  function renderTabContent() {
    switch (state.activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'customers':
        return renderCustomers();
      case 'tickets':
        return renderTickets();
      case 'reports':
        return renderReports();
      default:
        return renderDashboard();
    }
  }
  
  function renderDashboard() {
    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return `
      <div class="dashboard-header">
        <div>
          <h1 class="dashboard-title">MontPC CRM Dashboard</h1>
          <p class="dashboard-subtitle">Welcome to your customer management dashboard</p>
        </div>
      </div>
      
      <div class="overview-panel">
        <div class="overview-content">
          <h2 class="overview-title">Today's overview</h2>
          <p class="overview-date">${currentDate}</p>
        </div>
        <div class="status-badge">Active</div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon customer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div class="stat-details">
            <h3 class="stat-label">Customers</h3>
            <div class="stat-value">${state.customers.length}</div>
            <div class="stat-trend positive">+15% from last month</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon ticket">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <div class="stat-details">
            <h3 class="stat-label">Active Tickets</h3>
            <div class="stat-value">${state.ticketCount}</div>
            <div class="stat-trend negative">+5% from last week</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon repair">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="stat-details">
            <h3 class="stat-label">Completed Repairs</h3>
            <div class="stat-value">${state.repairCount}</div>
            <div class="stat-trend positive">+18% from last month</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon revenue">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div class="stat-details">
            <h3 class="stat-label">Monthly Revenue</h3>
            <div class="stat-value">$${state.revenue.toLocaleString()}</div>
            <div class="stat-trend positive">+8% from last month</div>
          </div>
        </div>
      </div>
      
      <div class="table-container">
        <div class="table-header">
          <h2 class="table-title">Recent Customers</h2>
          <button class="refresh-btn" id="view-all-customers" data-tab="customers">View All</button>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${state.customers.slice(0, 5).map(customer => `
              <tr>
                <td>${customer.firstName} ${customer.lastName}</td>
                <td>${customer.email}</td>
                <td>${customer.phone || 'N/A'}</td>
                <td><span class="badge ${customer.status === 'ACTIVE' ? 'active' : 'inactive'}">${customer.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  
  function renderCustomers() {
    return `
      <div class="dashboard-header">
        <div>
          <h1 class="dashboard-title">Customer Management</h1>
          <p class="dashboard-subtitle">Manage your customer database</p>
        </div>
        <button class="refresh-btn">Add Customer</button>
      </div>
      
      <div class="table-container">
        <div class="table-header">
          <h2 class="table-title">All Customers</h2>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            ${state.customers.map(customer => `
              <tr>
                <td>${customer.firstName} ${customer.lastName}</td>
                <td>${customer.email}</td>
                <td>${customer.phone || 'N/A'}</td>
                <td><span class="badge ${customer.status === 'ACTIVE' ? 'active' : 'inactive'}">${customer.status}</span></td>
                <td>${new Date(customer.createdAt).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  
  function renderTickets() {
    return `
      <div class="dashboard-header">
        <div>
          <h1 class="dashboard-title">Repair Tickets</h1>
          <p class="dashboard-subtitle">Manage repair tickets and status</p>
        </div>
        <button class="refresh-btn">Create Ticket</button>
      </div>
      
      <div class="table-container">
        <div class="table-header">
          <h2 class="table-title">No tickets available</h2>
        </div>
        <div style="padding: 50px 20px; text-align: center;">
          <p>Tickets will appear here once created.</p>
          <button class="refresh-btn" style="margin-top: 20px;">Create First Ticket</button>
        </div>
      </div>
    `;
  }
  
  function renderReports() {
    return `
      <div class="dashboard-header">
        <div>
          <h1 class="dashboard-title">Reports</h1>
          <p class="dashboard-subtitle">View business performance reports</p>
        </div>
      </div>
      
      <div style="padding: 50px 20px; text-align: center; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
        <h2>Reports Coming Soon</h2>
        <p style="margin: 20px 0;">This feature is still in development. Check back later!</p>
      </div>
    `;
  }
  
  async function loadData() {
    try {
      state.loading = true;
      renderApp();
      
      // Fetch customers from API
      const response = await fetch('http://localhost:3000/api/customers');
      const data = await response.json();
      
      if (data.status === 'success') {
        state.customers = data.data;
        addNotification('success', `Successfully loaded ${state.customers.length} customers`);
      } else {
        state.error = data.message || 'Failed to load customers';
        addNotification('error', state.error);
      }
    } catch (error) {
      state.error = error.message;
      addNotification('error', `Error loading data: ${error.message}`);
    } finally {
      state.loading = false;
      renderApp();
    }
  }
  
  function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        state.activeTab = e.currentTarget.getAttribute('data-tab');
        renderApp();
      });
    });
    
    // Logo click - go to dashboard
    document.querySelector('.logo-link').addEventListener('click', (e) => {
      e.preventDefault();
      state.activeTab = 'dashboard';
      renderApp();
    });
    
    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', () => {
      loadData();
    });
    
    // View all customers button
    setTimeout(() => {
      const viewAllBtn = document.getElementById('view-all-customers');
      if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
          state.activeTab = 'customers';
          renderApp();
        });
      }
    }, 100);
  }
  
  function addNotification(type, message) {
    const id = Date.now();
    state.notifications.push({ id, type, message });
    renderApp();
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      state.notifications = state.notifications.filter(notif => notif.id !== id);
      renderApp();
    }, 5000);
  }
  
  // Setup event delegation for dynamically added elements
  document.addEventListener('click', (e) => {
    // Handle notification close buttons
    if (e.target.classList.contains('notification-close')) {
      const id = Number(e.target.getAttribute('data-id'));
      state.notifications = state.notifications.filter(notif => notif.id !== id);
      renderApp();
    }
  });
});

console.log('Enhanced dashboard loaded successfully');