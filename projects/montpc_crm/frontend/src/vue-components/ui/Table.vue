<template>
  <div class="table-container">
    <table class="data-table" :class="{ 'table-striped': striped, 'table-hoverable': hoverable }">
      <thead>
        <tr>
          <th 
            v-for="column in columns" 
            :key="column.key"
            :class="{ 
              'sortable': column.sortable,
              'sorted': sortBy === column.key,
              'sorted-desc': sortBy === column.key && sortDesc
            }"
            :style="column.width ? { width: column.width } : {}"
            @click="column.sortable ? handleSort(column.key) : null"
          >
            {{ column.label }}
            <span v-if="column.sortable" class="sort-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sort-arrow">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </th>
          <th v-if="hasActions" class="actions-column">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="hasActions ? columns.length + 1 : columns.length" class="loading-cell">
            <div class="loading-indicator">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                <line x1="2" y1="12" x2="6" y2="12"></line>
                <line x1="18" y1="12" x2="22" y2="12"></line>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
              </svg>
              Loading...
            </div>
          </td>
        </tr>
        <tr v-else-if="!data.length">
          <td :colspan="hasActions ? columns.length + 1 : columns.length" class="empty-cell">
            {{ emptyText || 'No data available' }}
          </td>
        </tr>
        <tr
          v-for="(row, index) in data"
          :key="row.id || index"
          @click="$emit('row-click', row)"
          class="data-row"
        >
          <td
            v-for="column in columns"
            :key="column.key"
          >
            <slot :name="`cell(${column.key})`" :value="row[column.key]" :row="row">
              {{ row[column.key] }}
            </slot>
          </td>
          <td v-if="hasActions" class="actions-cell">
            <slot name="actions" :row="row">
              <button class="action-btn edit" @click.stop="$emit('edit', row)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="action-btn delete" @click.stop="$emit('delete', row)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="showPagination && totalRows > 0" class="pagination">
      <div class="pagination-summary">
        Showing {{ Math.min((currentPage - 1) * pageSize + 1, totalRows) }} - 
        {{ Math.min(currentPage * pageSize, totalRows) }} of {{ totalRows }} items
      </div>
      <div class="pagination-controls">
        <button
          class="pagination-btn"
          :disabled="currentPage === 1"
          @click="handlePageChange(currentPage - 1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <span class="current-page">Page {{ currentPage }}</span>
        <button
          class="pagination-btn"
          :disabled="currentPage >= getTotalPages()"
          @click="handlePageChange(currentPage + 1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Define props
interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}

const props = defineProps({
  columns: {
    type: Array as () => Column[],
    required: true
  },
  data: {
    type: Array as () => any[],
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  striped: {
    type: Boolean,
    default: false
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  sortBy: {
    type: String,
    default: ''
  },
  sortDesc: {
    type: Boolean,
    default: false
  },
  showActions: {
    type: Boolean,
    default: false
  },
  emptyText: {
    type: String,
    default: 'No data available'
  },
  // Pagination props
  showPagination: {
    type: Boolean,
    default: false
  },
  pageSize: {
    type: Number,
    default: 10
  },
  currentPage: {
    type: Number,
    default: 1
  },
  totalRows: {
    type: Number,
    default: 0
  }
});

// Computed properties
const hasActions = computed(() => {
  return props.showActions;
});

// Methods
const handleSort = (field: string) => {
  let newSortDesc = props.sortDesc;
  
  if (props.sortBy === field) {
    // If already sorting by this field, toggle direction
    newSortDesc = !newSortDesc;
  } else {
    // Default to ascending for new sort field
    newSortDesc = false;
  }
  
  // Emit sort event
  emit('sort', {
    column: props.columns.find(col => col.key === field),
    sortBy: field,
    sortDesc: newSortDesc
  });
};

const handlePageChange = (page: number) => {
  if (page < 1 || page > getTotalPages()) return;
  
  emit('page-change', {
    currentPage: page,
    pageSize: props.pageSize
  });
};

const getTotalPages = () => {
  return Math.ceil(props.totalRows / props.pageSize) || 1;
};

// Define emits
const emit = defineEmits([
  'sort',
  'page-change',
  'row-click',
  'edit',
  'delete'
]);
</script>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background-color: white;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.data-table th {
  background-color: #f9fafb;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
}

.data-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
}

.data-table tr:last-child td {
  border-bottom: none;
}

/* Sortable columns */
.sortable {
  cursor: pointer;
  user-select: none;
}

.sort-icon {
  display: inline-block;
  margin-left: 0.25rem;
  transition: transform 0.2s ease;
}

.sorted .sort-icon {
  opacity: 1;
}

.sorted-desc .sort-icon svg {
  transform: rotate(180deg);
}

/* Striped rows */
.table-striped tr:nth-child(even) {
  background-color: #f9fafb;
}

/* Hoverable rows */
.table-hoverable .data-row:hover {
  background-color: rgba(59, 130, 246, 0.05);
  cursor: pointer;
}

/* Loading state */
.loading-cell, .empty-cell {
  text-align: center;
  padding: 2rem !important;
  color: #6b7280;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.loading-indicator svg {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Actions column */
.actions-column {
  width: 100px;
  text-align: center !important;
}

.actions-cell {
  text-align: center;
  white-space: nowrap;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  margin: 0 0.125rem;
  transition: background-color 0.2s;
}

.action-btn.edit {
  color: #3b82f6;
}

.action-btn.edit:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.action-btn.delete {
  color: #ef4444;
}

.action-btn.delete:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  background-color: white;
  cursor: pointer;
  color: #4b5563;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #d1d5db;
  background-color: #f9fafb;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.current-page {
  font-weight: 500;
  color: #4b5563;
}
</style>