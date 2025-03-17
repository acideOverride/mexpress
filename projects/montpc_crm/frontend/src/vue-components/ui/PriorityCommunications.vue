<template>
  <div class="dashboard-panel priority-communications">
    <!-- Panel Header -->
    <div class="panel-header">
      <h2 class="panel-title">{{ title }}</h2>
      <div class="panel-actions">
        <slot name="panel-actions">
          <button 
            v-if="showClearButton" 
            class="panel-action-btn"
            @click="$emit('clear')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>{{ clearButtonText }}</span>
          </button>
          <button 
            v-if="showAddButton" 
            class="panel-action-btn primary"
            @click="$emit('add')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>{{ addButtonText }}</span>
          </button>
        </slot>
      </div>
    </div>
    
    <!-- Filter Controls -->
    <div v-if="showFilters" class="filter-controls">
      <div class="filter-tabs">
        <button 
          v-for="filter in priorityFilters" 
          :key="filter.value" 
          class="filter-tab" 
          :class="{ active: currentFilter === filter.value }"
          @click="handleFilterChange(filter.value)"
        >
          {{ filter.label }}
          <span v-if="filter.count !== undefined" class="filter-count">{{ filter.count }}</span>
        </button>
      </div>
    </div>
    
    <!-- Notification List -->
    <div 
      class="notification-list"
      :class="{ 'with-filters': showFilters }"
    >
      <slot>
        <div v-if="isEmpty" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <p>{{ emptyText }}</p>
        </div>
      </slot>
    </div>
    
    <!-- Footer Actions (optional) -->
    <div v-if="$slots['footer-actions']" class="panel-footer">
      <slot name="footer-actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Types
export type PriorityFilter = {
  label: string;
  value: string;
  count?: number;
};

// Props
const props = withDefaults(defineProps<{
  title: string;
  showFilters?: boolean;
  priorityFilters?: PriorityFilter[];
  initialFilter?: string;
  showClearButton?: boolean;
  showAddButton?: boolean;
  clearButtonText?: string;
  addButtonText?: string;
  isEmpty?: boolean;
  emptyText?: string;
}>(), {
  showFilters: true,
  priorityFilters: () => [
    { label: 'All', value: 'all' },
    { label: 'Urgent', value: 'urgent' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' }
  ],
  initialFilter: 'all',
  showClearButton: true,
  showAddButton: true,
  clearButtonText: 'Clear All',
  addButtonText: 'Add New',
  isEmpty: false,
  emptyText: 'No communications found'
});

// Reactive state
const currentFilter = ref(props.initialFilter);

// Emits
const emit = defineEmits<{
  (e: 'filter-change', value: string): void;
  (e: 'clear'): void;
  (e: 'add'): void;
}>();

// Methods
function handleFilterChange(value: string) {
  currentFilter.value = value;
  emit('filter-change', value);
}
</script>

<style scoped>
.dashboard-panel {
  background-color: var(--panel-bg, var(--bg-primary, #ffffff));
  border-radius: var(--radius-lg, 12px);
  box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  border: 1px solid var(--border-color-light, #f3f4f6);
}

.panel-header {
  padding: 1.25rem;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary, #111827);
  margin: 0;
}

.panel-actions {
  display: flex;
  gap: 0.75rem;
}

.panel-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: transparent;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: var(--radius-md, 8px);
  padding: 0.4rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary, #4b5563);
  cursor: pointer;
  transition: all 0.15s ease;
}

.panel-action-btn:hover {
  border-color: var(--text-secondary, #4b5563);
  background-color: var(--bg-tertiary, #f3f4f6);
}

.panel-action-btn.primary {
  background-color: var(--primary, #3b82f6);
  border-color: var(--primary, #3b82f6);
  color: white;
}

.panel-action-btn.primary:hover {
  background-color: var(--primary-dark, #2563eb);
  border-color: var(--primary-dark, #2563eb);
}

.panel-action-btn svg {
  width: 14px;
  height: 14px;
}

/* Filter controls */
.filter-controls {
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  background-color: var(--bg-secondary, #f9fafb);
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.filter-tabs::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.filter-tab {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary, #4b5563);
  background: transparent;
  border: none;
  border-radius: var(--radius-md, 8px);
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.filter-tab:hover {
  background-color: var(--bg-tertiary, #f3f4f6);
  color: var(--text-primary, #111827);
}

.filter-tab.active {
  background-color: var(--primary-glass, rgba(59, 130, 246, 0.1));
  color: var(--primary, #3b82f6);
}

.filter-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  font-size: 0.65rem;
  font-weight: 600;
  border-radius: 8px;
  background-color: var(--bg-tertiary, #f3f4f6);
}

.filter-tab.active .filter-count {
  background-color: var(--primary, #3b82f6);
  color: white;
}

/* Notification list */
.notification-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.notification-list.with-filters {
  padding-top: 0.5rem;
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

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
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

/* Panel footer */
.panel-footer {
  padding: 0.75rem;
  border-top: 1px solid var(--border-color, #e5e7eb);
  display: flex;
  justify-content: center;
}

/* Responsive styles */
@media (max-width: 768px) {
  .panel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .panel-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .filter-tabs {
    width: 100%;
    justify-content: space-between;
  }
  
  .filter-tab {
    flex: 1;
    justify-content: center;
  }
}

/* Night Shift Mode Enhancements */
:root[data-theme="night-shift"] .panel-action-btn.primary {
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
}
</style>