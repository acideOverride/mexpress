<template>
  <div class="repair-dashboard">
    <!-- Communication Status Summary -->
    <div class="comm-status-section">
      <CommunicationStatusPanel :statuses="communicationStatuses" :loading="loadingStatuses" />
    </div>
    
    <!-- Main Dashboard Content -->
    <div class="dashboard-content">
      <!-- Left Column - Priority Notifications -->
      <div class="dashboard-column">
        <div class="dashboard-panel">
          <div class="panel-header">
            <h2 class="panel-title">Priority Communications</h2>
            <div class="panel-actions">
              <button class="panel-action-btn" @click="handleClearAll">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>Clear All</span>
              </button>
              <button class="panel-action-btn primary" @click="handleAddNew">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Add New</span>
              </button>
            </div>
          </div>
          
          <div v-if="loadingNotifications" class="loading-container">
            <div class="spinner"></div>
            <p>Loading notifications...</p>
          </div>
          
          <div v-else class="notification-list">
            <NotificationItem 
              v-for="notification in priorityNotifications" 
              :key="notification.id"
              :priority="notification.priority"
              :priority-label="notification.priorityLabel"
              :title="notification.title"
              :time="notification.relativeTime"
              :content="notification.content"
              :tags="notification.tags"
              :actions="notification.actions"
              @action="handleNotificationAction($event, notification)"
            />
            
            <div v-if="priorityNotifications.length === 0" class="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>No priority notifications</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right Column - Repair Timeline -->
      <div class="dashboard-column">
        <div class="dashboard-panel">
          <div class="panel-header">
            <h2 class="panel-title">Repair Status</h2>
            <div class="panel-actions">
              <div class="filter-dropdown">
                <button class="filter-button" @click="toggleFilterDropdown">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                  <span>Filter</span>
                </button>
                <!-- Filter dropdown menu would go here -->
                <div v-if="showFilterDropdown" class="filter-dropdown-menu">
                  <div class="filter-dropdown-content">
                    <div class="filter-group">
                      <h3>Status</h3>
                      <div class="filter-options">
                        <label v-for="status in repairStatuses" :key="status.value" class="filter-option">
                          <input 
                            type="radio" 
                            name="status-filter" 
                            :value="status.value"
                            :checked="statusFilter === status.value"
                            @change="handleStatusFilterChange(status.value)"
                          >
                          <span>{{ status.text }} ({{ status.count }})</span>
                        </label>
                        <label class="filter-option">
                          <input 
                            type="radio" 
                            name="status-filter" 
                            value="all"
                            :checked="statusFilter === 'all'"
                            @change="handleStatusFilterChange('all')"
                          >
                          <span>All</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button class="panel-action-btn primary" @click="handleNewRepair">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>New Repair</span>
              </button>
            </div>
          </div>
          
          <div v-if="loadingRepairs" class="loading-container">
            <div class="spinner"></div>
            <p>Loading repairs...</p>
          </div>
          
          <RepairTimeline v-else :is-empty="filteredRepairs.length === 0">
            <RepairTimelineItem
              v-for="repair in filteredRepairs"
              :key="repair.id"
              :status="repair.status"
              :status-text="repair.statusText"
              :status-description="repair.statusDescription"
              :customer-name="repair.customerName"
              :customer-phone="repair.customerPhone"
              :device-name="repair.deviceName"
              :device-type="repair.deviceType"
              :device-issue="repair.deviceIssue"
              :eta-date="repair.etaDate"
              :promise-text="repair.promiseText"
              :overdue="repair.overdue"
              :urgent="repair.urgency === 'high'"
              @notify="handleNotifyCustomer(repair)"
              @details="handleViewRepairDetails(repair)"
            />
            
            <template #footer>
              <div class="timeline-pagination">
                <button 
                  class="pagination-btn" 
                  :disabled="currentPage === 1"
                  @click="prevPage"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  <span>Previous</span>
                </button>
                <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
                <button 
                  class="pagination-btn"
                  :disabled="currentPage === totalPages"
                  @click="nextPage"
                >
                  <span>Next</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </template>
          </RepairTimeline>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { mockApi } from '../../services/mockApi';
import CommunicationStatusPanel from '../ui/CommunicationStatusPanel.vue';
import NotificationItem from '../ui/NotificationItem.vue';
import RepairTimeline from '../ui/RepairTimeline.vue';
import RepairTimelineItem from '../ui/RepairTimelineItem.vue';

// State
const repairItems = ref<any[]>([]);
const repairStatuses = ref<any[]>([]);
const communicationStatuses = ref<any[]>([]);
const priorityNotifications = ref<any[]>([]);
const loadingRepairs = ref(true);
const loadingStatuses = ref(true);
const loadingNotifications = ref(true);
const statusFilter = ref('all');
const showFilterDropdown = ref(false);
const currentPage = ref(1);
const pageSize = 5; // Items per page

// Fetch data
onMounted(async () => {
  try {
    loadingStatuses.value = true;
    loadingRepairs.value = true;
    loadingNotifications.value = true;
    
    // Fetch data in parallel for better performance
    const [repairsData, statusesData, communicationData, notificationsData] = await Promise.all([
      mockApi.getRepairs(),
      mockApi.getRepairStatuses(),
      mockApi.getCommunicationStatuses(),
      mockApi.getPriorityNotifications()
    ]);
    
    repairItems.value = repairsData;
    repairStatuses.value = statusesData;
    communicationStatuses.value = communicationData;
    priorityNotifications.value = notificationsData;
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  } finally {
    loadingStatuses.value = false;
    loadingRepairs.value = false;
    loadingNotifications.value = false;
  }
});

// Computed
const filteredRepairs = computed(() => {
  if (statusFilter.value === 'all') {
    return repairItems.value;
  }
  return repairItems.value.filter(repair => repair.status === statusFilter.value);
});

const paginatedRepairs = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return filteredRepairs.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
  return Math.ceil(filteredRepairs.value.length / pageSize);
});

// Methods
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const toggleFilterDropdown = () => {
  showFilterDropdown.value = !showFilterDropdown.value;
};

const handleStatusFilterChange = (status: string) => {
  statusFilter.value = status;
  currentPage.value = 1; // Reset to first page when filter changes
  showFilterDropdown.value = false;
};

const handleNotifyCustomer = (repair: any) => {
  console.log('Notify customer:', repair.customerName, repair.customerPhone);
  // Implementation would call a notification service
};

const handleViewRepairDetails = (repair: any) => {
  console.log('View repair details:', repair.id);
  // Implementation would navigate to repair detail page
};

const handleNotificationAction = (action: string, notification: any) => {
  console.log(`Performing ${action} action for notification:`, notification.id);
  // Implementation would handle the specific action
};

const handleClearAll = () => {
  console.log('Clear all notifications');
  // Implementation would clear all notifications
};

const handleAddNew = () => {
  console.log('Add new notification');
  // Implementation would open a dialog to create a new notification
};

const handleNewRepair = () => {
  console.log('Create new repair ticket');
  // Implementation would navigate to the new repair ticket form
};
</script>

<style scoped>
.repair-dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
  max-width: 1920px;
  margin: 0 auto;
  width: 100%;
}

.comm-status-section {
  width: 100%;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 1.5rem;
}

.dashboard-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard-panel {
  background-color: var(--panel-bg, var(--bg-primary, #ffffff));
  border-radius: var(--radius-lg, 12px);
  border: 1px solid var(--border-color-light, #f3f4f6);
  overflow: hidden;
  box-shadow: var(--shadow-sm, 0 1px 2px 0 rgba(0,0,0,0.05));
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color-light, #f3f4f6);
}

.panel-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary, #111827);
  margin: 0;
}

.panel-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md, 8px);
  font-size: 0.75rem;
  font-weight: 500;
  background-color: var(--bg-tertiary, #f3f4f6);
  color: var(--text-secondary, #4b5563);
  border: 1px solid var(--border-color, #e5e7eb);
  cursor: pointer;
  transition: all 0.2s ease;
}

.panel-action-btn:hover {
  background-color: var(--bg-secondary, #e5e7eb);
}

.panel-action-btn.primary {
  background-color: var(--primary, #3b82f6);
  color: white;
  border-color: var(--primary, #3b82f6);
}

.panel-action-btn.primary:hover {
  background-color: var(--primary-dark, #2563eb);
  border-color: var(--primary-dark, #2563eb);
}

.notification-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  overflow-y: auto;
}

.notification-list::-webkit-scrollbar {
  width: 4px;
}

.notification-list::-webkit-scrollbar-track {
  background: transparent;
}

.notification-list::-webkit-scrollbar-thumb {
  background: var(--text-tertiary, #9ca3af);
  border-radius: 4px;
}

.filter-dropdown {
  position: relative;
}

.filter-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md, 8px);
  font-size: 0.75rem;
  font-weight: 500;
  background-color: var(--bg-tertiary, #f3f4f6);
  color: var(--text-secondary, #4b5563);
  border: 1px solid var(--border-color, #e5e7eb);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-button:hover {
  background-color: var(--bg-secondary, #e5e7eb);
}

.filter-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  width: 250px;
  background-color: var(--bg-primary, #ffffff);
  border-radius: var(--radius-md, 8px);
  border: 1px solid var(--border-color, #e5e7eb);
  box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.1));
  z-index: 10;
}

.filter-dropdown-content {
  padding: 0.75rem;
}

.filter-group {
  margin-bottom: 1rem;
}

.filter-group h3 {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary, #111827);
  margin: 0 0 0.5rem 0;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-secondary, #4b5563);
  cursor: pointer;
}

.filter-option input {
  margin: 0;
}

.timeline-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
}

.pagination-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md, 8px);
  font-size: 0.75rem;
  font-weight: 500;
  background-color: var(--bg-tertiary, #f3f4f6);
  color: var(--text-secondary, #4b5563);
  border: 1px solid var(--border-color, #e5e7eb);
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn:not(:disabled):hover {
  background-color: var(--bg-secondary, #e5e7eb);
}

.pagination-info {
  font-size: 0.75rem;
  color: var(--text-tertiary, #9ca3af);
}

/* Loading state */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-tertiary, #9ca3af);
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--bg-tertiary, #f3f4f6);
  border-top-color: var(--primary, #3b82f6);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: var(--text-tertiary, #9ca3af);
}

.empty-state svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  font-size: 0.875rem;
  font-weight: 500;
}

/* Responsive styles */
@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .repair-dashboard {
    padding: 0.75rem;
  }
  
  .panel-action-btn span, 
  .filter-button span {
    display: none;
  }
  
  .panel-action-btn, 
  .filter-button {
    padding: 0.5rem;
  }
}

@media (max-width: 640px) {
  .panel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .panel-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

/* Night Shift Mode Enhancements */
:root[data-theme="night-shift"] .panel-action-btn.primary {
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
}

:root[data-theme="night-shift"] .filter-dropdown-menu {
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}
</style>