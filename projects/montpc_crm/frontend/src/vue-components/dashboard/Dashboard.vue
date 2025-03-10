<template>
  <div class="dashboard">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">MontPC CRM</h1>
        <p class="page-subtitle">Service Management Platform</p>
      </div>
      <button class="refresh-btn" @click="refreshData" :disabled="isRefreshing">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 4v6h-6"></path>
          <path d="M1 20v-6h6"></path>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
          <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
        </svg>
        {{ isRefreshing ? 'Refreshing...' : 'Refresh' }}
      </button>
    </div>
    
    <!-- Success message -->
    <div v-if="successMessage" class="success-message">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      {{ successMessage }}
    </div>
    
    <!-- Error message -->
    <div v-if="error" class="error-message">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      {{ error }}
      <button class="close-error" @click="error = ''">×</button>
    </div>
    
    <div class="overview-panel">
      <div class="overview-content">
        <h2 class="overview-title">Today's overview</h2>
        <p class="overview-date">{{ currentDate }}</p>
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
          <div class="stat-value">{{ customerCount }}</div>
          <div class="stat-trend positive">{{ customerCount > 2 ? '+12% from last month' : 'Growing' }}</div>
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
          <div class="stat-value">{{ ticketCount }}</div>
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
          <div class="stat-value">{{ repairCount }}</div>
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
          <div class="stat-value">${{ revenue.toLocaleString() }}</div>
          <div class="stat-trend positive">+8% from last month</div>
        </div>
      </div>
    </div>
    
    <div class="panels-section">
      <!-- Quick Actions -->
      <div class="section-row">
        <div class="section-header">
          <h2 class="section-title">Quick Actions</h2>
        </div>
        <div class="action-buttons">
          <button class="action-btn customers" @click="navigateTo('/customers')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            View Customers
          </button>
          <button class="action-btn tickets" @click="navigateTo('/tickets')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
            View Tickets
          </button>
          <button class="action-btn new-ticket" @click="navigateTo('/tickets/new')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
            Create New Ticket
          </button>
          <button class="action-btn new-customer" @click="showCustomerModal = true">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            Add New Customer
          </button>
        </div>
      </div>
      
      <!-- Recent Activity -->
      <div class="panel activity-panel">
        <div class="panel-header">
          <h2 class="panel-title">Recent Activity</h2>
          <button class="view-all">View all</button>
        </div>
        <ul class="activity-list">
          <li class="activity-item">
            <div class="activity-icon customer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="activity-content">
              <div class="activity-title">New customer added: <strong>John Doe</strong></div>
              <div class="activity-time">10:30 AM</div>
            </div>
          </li>
          <li class="activity-item">
            <div class="activity-icon completed">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div class="activity-content">
              <div class="activity-title">Ticket <strong>#1234</strong> marked as completed</div>
              <div class="activity-time">9:15 AM</div>
            </div>
          </li>
          <li class="activity-item">
            <div class="activity-icon repair">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </div>
            <div class="activity-content">
              <div class="activity-title">New repair ticket created for <strong>Jane Smith</strong></div>
              <div class="activity-time">Yesterday</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Customer Modal -->
    <Modal 
      v-model="showCustomerModal" 
      title="Add New Customer" 
      :closeOnBackdrop="false"
    >
      <QuickCustomerForm
        :loading="isCreatingCustomer"
        @created="handleCustomerCreated"
        @cancel="showCustomerModal = false"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { Modal } from '../ui';
import QuickCustomerForm from '../customers/QuickCustomerForm.vue';
import { Customer } from '@/api/types/customer';
import { customersService } from '@/api/services/customers.service';

const router = useRouter();
const currentDate = ref(new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
}));

// Customer creation state
const showCustomerModal = ref(false);
const isCreatingCustomer = ref(false);

const navigateTo = (path: string) => {
  router.push(path);
};

const successMessage = ref('');
const error = ref('');
const isRefreshing = ref(false);

// Add stats for dashboard
const customerCount = ref(0);
const ticketCount = ref(0);
const repairCount = ref(0);
const revenue = ref(0);

// Add recent activity tracking
const recentActivity = ref<any[]>([]);

// Refresh dashboard data
const refreshData = async () => {
  try {
    isRefreshing.value = true;
    console.log('Refreshing dashboard data...');
    
    // Clear any previous error
    error.value = '';
    
    // Fetch customers from service
    const customerResponse = await customersService.getCustomers();
    if (customerResponse.status === 'success' && customerResponse.data) {
      // Update stats
      customerCount.value = customerResponse.data.length;
      
      // Update recent activity with latest customers (for this demo)
      const newActivity = customerResponse.data
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
        .map(customer => ({
          type: 'customer',
          title: `New customer added: ${customer.name}`,
          time: new Date(customer.createdAt).toLocaleTimeString(),
          date: new Date(customer.createdAt).toLocaleDateString(),
          id: customer.id
        }));
      
      recentActivity.value = newActivity;
      
      // Set demo values for tickets, repairs and revenue (these would come from real APIs)
      ticketCount.value = 38;
      repairCount.value = 142;
      revenue.value = 19850;
      
      // Show success message briefly
      successMessage.value = 'Dashboard data refreshed successfully';
      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
    }
  } catch (err: any) {
    console.error('Error refreshing data:', err);
    error.value = err.message || 'Failed to load dashboard data. Please try again.';
  } finally {
    isRefreshing.value = false;
  }
};

const handleCustomerCreated = (customer: Customer) => {
  console.log('Customer created:', customer);
  showCustomerModal.value = false;
  
  // Add success message to show to the user
  successMessage.value = `Customer ${customer.name} created successfully!`;
  
  // Clear success message after 5 seconds
  setTimeout(() => {
    successMessage.value = '';
  }, 5000);
  
  // Refresh the dashboard data to show updated stats
  refreshData();
};
</script>

<style scoped>
.dashboard {
  padding: 0;
  width: 100%;
}

/* Header Section */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0 0 0;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.15s ease;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #ecfdf5;
  border: 1px solid #10b981;
  border-radius: 6px;
  color: #047857;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-size: 14px;
  animation: fadeIn 0.3s ease-in-out;
}

.success-message svg {
  color: #10b981;
  flex-shrink: 0;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #fee2e2;
  border: 1px solid #ef4444;
  border-radius: 6px;
  color: #b91c1c;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-size: 14px;
  animation: fadeIn 0.3s ease-in-out;
}

.error-message svg {
  color: #ef4444;
  flex-shrink: 0;
}

.close-error {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 1.25rem;
  line-height: 1;
  padding: 0;
  cursor: pointer;
  color: #b91c1c;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Overview Panel */
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

/* Stats Section */
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
  display: flex;
  align-items: center;
}

.stat-trend.positive {
  color: #10b981;
}

.stat-trend.negative {
  color: #ef4444;
}

/* Panel Sections */
.panels-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-row {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.panel {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.panel-header {
  border-bottom: 1px solid #e5e7eb;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.view-all {
  background: none;
  border: none;
  font-size: 13px;
  color: #2563eb;
  cursor: pointer;
  padding: 0;
}

/* Quick Actions */
.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-grow: 1;
  max-width: calc(25% - 9px);
}

.action-btn svg {
  flex-shrink: 0;
}

.action-btn.customers {
  background-color: #2563eb;
}

.action-btn.customers:hover {
  background-color: #1d4ed8;
}

.action-btn.tickets {
  background-color: #10b981;
}

.action-btn.tickets:hover {
  background-color: #059669;
}

.action-btn.new-ticket {
  background-color: #ef4444;
}

.action-btn.new-ticket:hover {
  background-color: #dc2626;
}

.action-btn.new-customer {
  background-color: #f59e0b;
}

.action-btn.new-customer:hover {
  background-color: #d97706;
}

/* Activity List */
.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-item {
  padding: 14px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 12px;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-icon.customer {
  background-color: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}

.activity-icon.completed {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.activity-icon.repair {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 13px;
  color: #4b5563;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: #9ca3af;
}

/* Responsive Adjustments */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .action-btn {
    max-width: calc(50% - 6px);
  }
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .action-btn {
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>