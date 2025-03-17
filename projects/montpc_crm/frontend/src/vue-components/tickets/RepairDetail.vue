<template>
  <div class="repair-detail">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading repair details...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>{{ error }}</p>
      <button class="action-btn" @click="handleBack">Back to Repairs</button>
    </div>
    
    <!-- Content -->
    <div v-else-if="repair" class="detail-content">
      <!-- Header -->
      <div class="detail-header">
        <div class="header-left">
          <button class="back-button" @click="handleBack">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span>Back</span>
          </button>
          <h1 class="detail-title">Repair #{{ repair.id }}</h1>
          <span 
            class="status-badge" 
            :class="repair.status"
          >{{ repair.statusText }}</span>
        </div>
        <div class="header-right">
          <button class="action-btn" @click="handleEdit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            <span>Edit</span>
          </button>
          <button class="action-btn primary" @click="handleNotify">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span>Notify Customer</span>
          </button>
        </div>
      </div>
      
      <!-- Detail Grid -->
      <div class="detail-grid">
        <!-- Left Column -->
        <div class="detail-section repair-info">
          <div class="section-header">
            <h2 class="section-title">Repair Information</h2>
          </div>
          <div class="section-content">
            <div class="info-group">
              <div class="info-row">
                <div class="info-label">Created</div>
                <div class="info-value">{{ formatDate(repair.createdAt) }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Status</div>
                <div class="info-value status-value">
                  <span 
                    class="status-indicator" 
                    :class="repair.status"
                  ></span>
                  <span>{{ repair.statusText }}</span>
                  <span class="status-description">{{ repair.statusDescription }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-label">Assigned To</div>
                <div class="info-value">{{ repair.assignedTo }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">ETA</div>
                <div class="info-value" :class="{ 'overdue': repair.overdue }">
                  {{ repair.etaDate }}
                  <span class="info-subtext">{{ repair.promiseText }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-label">Priority</div>
                <div class="info-value">
                  <span class="priority-badge" :class="repair.urgency">
                    {{ capitalize(repair.urgency) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Customer Info -->
        <div class="detail-section customer-info">
          <div class="section-header">
            <h2 class="section-title">Customer Information</h2>
            <button class="section-action" @click="handleViewCustomer">
              View Customer
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          <div class="section-content">
            <div class="info-group">
              <div class="info-row">
                <div class="info-label">Name</div>
                <div class="info-value">{{ repair.customerName }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Phone</div>
                <div class="info-value">
                  <a :href="`tel:${repair.customerPhone}`" class="info-link">
                    {{ repair.customerPhone }}
                  </a>
                </div>
              </div>
              <div class="info-row">
                <div class="info-label">Email</div>
                <div class="info-value">
                  <a :href="`mailto:${repair.customerEmail}`" class="info-link">
                    {{ repair.customerEmail }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Device Info -->
        <div class="detail-section device-info">
          <div class="section-header">
            <h2 class="section-title">Device Information</h2>
          </div>
          <div class="section-content">
            <div class="info-group">
              <div class="info-row">
                <div class="info-label">Device</div>
                <div class="info-value">{{ repair.deviceName }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Issue</div>
                <div class="info-value">{{ repair.deviceIssue }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Description</div>
                <div class="info-value description">{{ repair.deviceDescription }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Notes -->
        <div class="detail-section notes-section">
          <div class="section-header">
            <h2 class="section-title">Repair Notes</h2>
            <button class="section-action" @click="handleAddNote">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Note
            </button>
          </div>
          <div class="section-content">
            <div class="notes-list">
              <div v-for="note in repair.notes" :key="note.id" class="note-item">
                <div class="note-header">
                  <span class="note-author">{{ note.createdBy }}</span>
                  <span class="note-date">{{ formatDate(note.createdAt) }}</span>
                </div>
                <div class="note-content">{{ note.text }}</div>
              </div>
              
              <div v-if="repair.notes.length === 0" class="empty-notes">
                <p>No notes yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { mockApi } from '../../services/mockApi';

// Props
const props = defineProps<{
  repairId?: string;
}>();

// State
const repair = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Fetch data
onMounted(async () => {
  if (!props.repairId) {
    error.value = 'No repair ID provided';
    loading.value = false;
    return;
  }
  
  try {
    loading.value = true;
    const data = await mockApi.getRepairById(props.repairId);
    
    if (!data) {
      error.value = `Repair #${props.repairId} not found`;
    } else {
      repair.value = data;
    }
  } catch (err) {
    console.error('Failed to fetch repair details:', err);
    error.value = 'Failed to load repair details. Please try again.';
  } finally {
    loading.value = false;
  }
});

// Utility functions
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const capitalize = (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Event handlers
const handleBack = () => {
  console.log('Navigate back to repairs list');
  // Implementation would use Vue Router to navigate back
};

const handleEdit = () => {
  console.log('Edit repair', repair.value?.id);
  // Implementation would navigate to edit page
};

const handleNotify = () => {
  console.log('Notify customer about repair', repair.value?.id);
  // Implementation would show notification options dialog
};

const handleViewCustomer = () => {
  console.log('View customer details', repair.value?.customerName);
  // Implementation would navigate to customer detail page
};

const handleAddNote = () => {
  console.log('Add note to repair', repair.value?.id);
  // Implementation would show add note dialog
};

// Emits
defineEmits<{
  (e: 'back'): void;
}>();
</script>

<style scoped>
.repair-detail {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

/* Header */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md, 8px);
  font-size: 0.875rem;
  font-weight: 500;
  background-color: var(--bg-tertiary, #f3f4f6);
  color: var(--text-secondary, #4b5563);
  border: 1px solid var(--border-color, #e5e7eb);
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  background-color: var(--bg-secondary, #e5e7eb);
}

.detail-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary, #111827);
  margin: 0;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full, 9999px);
  background-color: var(--bg-tertiary, #f3f4f6);
  color: var(--text-secondary, #4b5563);
}

.status-badge.delayed {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger, #ef4444);
}

.status-badge.in-progress {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success, #10b981);
}

.status-badge.waiting-parts {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning, #f59e0b);
}

.status-badge.completed {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success, #10b981);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md, 8px);
  font-size: 0.875rem;
  font-weight: 500;
  background-color: var(--bg-tertiary, #f3f4f6);
  color: var(--text-secondary, #4b5563);
  border: 1px solid var(--border-color, #e5e7eb);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: var(--bg-secondary, #e5e7eb);
}

.action-btn.primary {
  background-color: var(--primary, #3b82f6);
  color: white;
  border-color: var(--primary, #3b82f6);
}

.action-btn.primary:hover {
  background-color: var(--primary-dark, #2563eb);
  border-color: var(--primary-dark, #2563eb);
}

/* Detail Grid */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.detail-section {
  background-color: var(--panel-bg, var(--bg-primary, #ffffff));
  border-radius: var(--radius-lg, 12px);
  border: 1px solid var(--border-color-light, #f3f4f6);
  overflow: hidden;
  height: 100%;
}

.notes-section {
  grid-column: span 2;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color-light, #f3f4f6);
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary, #111827);
  margin: 0;
}

.section-action {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-md, 8px);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--primary, #3b82f6);
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.section-action:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

.section-content {
  padding: 1.25rem;
}

/* Info Layout */
.info-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-tertiary, #9ca3af);
}

.info-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary, #111827);
}

.info-value.overdue {
  color: var(--danger, #ef4444);
}

.info-subtext {
  font-size: 0.75rem;
  color: var(--text-tertiary, #9ca3af);
  margin-left: 0.5rem;
}

.info-link {
  color: var(--primary, #3b82f6);
  text-decoration: none;
}

.info-link:hover {
  text-decoration: underline;
}

.info-value.description {
  font-size: 0.825rem;
  line-height: 1.5;
  color: var(--text-secondary, #4b5563);
}

.status-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--text-tertiary, #9ca3af);
}

.status-indicator.delayed {
  background-color: var(--danger, #ef4444);
}

.status-indicator.in-progress {
  background-color: var(--success, #10b981);
}

.status-indicator.waiting-parts {
  background-color: var(--warning, #f59e0b);
}

.status-indicator.completed {
  background-color: var(--success, #10b981);
}

.status-description {
  font-size: 0.75rem;
  color: var(--text-tertiary, #9ca3af);
}

.priority-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm, 4px);
  font-size: 0.75rem;
  font-weight: 600;
}

.priority-badge.high {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger, #ef4444);
}

.priority-badge.medium {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning, #f59e0b);
}

.priority-badge.low {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success, #10b981);
}

/* Notes */
.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.note-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background-color: var(--bg-tertiary, #f3f4f6);
  border-radius: var(--radius-md, 8px);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-author {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary, #111827);
}

.note-date {
  font-size: 0.75rem;
  color: var(--text-tertiary, #9ca3af);
}

.note-content {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-secondary, #4b5563);
}

.empty-notes {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
  color: var(--text-tertiary, #9ca3af);
  font-size: 0.875rem;
}

/* Loading and Error States */
.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  gap: 1rem;
  color: var(--text-tertiary, #9ca3af);
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid var(--bg-tertiary, #f3f4f6);
  border-top-color: var(--primary, #3b82f6);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-container svg {
  color: var(--danger, #ef4444);
  margin-bottom: 0.5rem;
}

.error-container p {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .notes-section {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .repair-detail {
    padding: 1rem;
  }
  
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-right {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 640px) {
  .header-left {
    flex-wrap: wrap;
  }
  
  .action-btn span {
    display: none;
  }
  
  .action-btn {
    padding: 0.5rem;
  }
}

/* Night Shift Mode Enhancements */
:root[data-theme="night-shift"] .note-item {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

:root[data-theme="night-shift"] .action-btn.primary {
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
}
</style>