<template>
  <div class="app-layout">
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <router-link to="/" class="logo-link">
          <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          <span class="logo-text">MontPC CRM</span>
        </router-link>
      </div>
      
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/" class="nav-link" exact-active-class="nav-link-active">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Dashboard</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/customers" class="nav-link" active-class="nav-link-active">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Customers</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/tickets" class="nav-link" active-class="nav-link-active">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              <span>Repair Tickets</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/reports" class="nav-link" active-class="nav-link-active">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              <span>Reports</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <div class="content-wrapper">
      <!-- Top Header with Search and User -->
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
            <span class="user-name">John Doe</span>
            <span class="user-role">Administrator</span>
          </div>
          <button class="logout-button" @click="logout">
            <span>Logout</span>
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="main-content">
        <slot></slot>
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
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  // Implement logout functionality
  console.log('Logging out...');
  // For demonstration, just redirect to root
  router.push('/');
};
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
}

/* Sidebar Styles */
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

/* Main Content Area */
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

.logout-button {
  background-color: #f3f4f6;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-button:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 1.5rem;
  max-width: 100%;
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

/* Responsive Styles */
@media (max-width: 768px) {
  .sidebar {
    width: 64px;
    overflow: hidden;
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
  
  .top-header {
    padding: 0 1rem;
  }
  
  .user-info {
    display: none;
  }
}

@media (max-width: 480px) {
  .footer-links {
    display: none;
  }
  
  .search-container {
    max-width: none;
  }
}
</style>