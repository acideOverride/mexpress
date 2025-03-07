<template>
  <div class="table-wrapper" :class="{ 'table-responsive': responsive }">
    <div v-if="loading" class="table-loading">
      <div class="table-spinner"></div>
    </div>
    <table
      class="table"
      :class="{
        'table-striped': striped,
        'table-bordered': bordered,
        'table-hover': hoverable,
        'table-dense': dense
      }"
    >
      <caption v-if="caption">{{ caption }}</caption>
      <thead>
        <tr>
          <th
            v-if="selectable"
            class="table-selection-column"
          >
            <label class="checkbox-container">
              <input
                type="checkbox"
                :checked="isAllSelected"
                :indeterminate="isIndeterminate"
                @change="onSelectAll"
              />
              <span class="checkmark"></span>
            </label>
          </th>
          <th
            v-for="column in columns"
            :key="column.key"
            :class="[
              column.align ? `text-${column.align}` : '',
              column.sortable ? 'sortable-column' : '',
              sortBy === column.key ? 'sorted-column' : ''
            ]"
            :style="column.width ? `width: ${column.width}` : ''"
            @click="column.sortable ? onSort(column) : null"
          >
            <div class="th-content">
              {{ column.label }}
              <span v-if="column.sortable" class="sort-icon">
                <span
                  class="sort-icon-asc"
                  :class="{ active: sortBy === column.key && !sortDesc }"
                >
                  ▲
                </span>
                <span
                  class="sort-icon-desc"
                  :class="{ active: sortBy === column.key && sortDesc }"
                >
                  ▼
                </span>
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="processedData.length === 0">
          <td :colspan="selectable ? columns.length + 1 : columns.length" class="empty-message">
            {{ emptyText || 'No data available' }}
          </td>
        </tr>
        <tr
          v-for="(row, rowIndex) in processedData"
          :key="rowIndex"
          :class="{ 'selected-row': isRowSelected(row) }"
          @click="onRowClick(row)"
        >
          <td v-if="selectable" class="table-selection-column">
            <label class="checkbox-container">
              <input
                type="checkbox"
                :checked="isRowSelected(row)"
                @change="onSelectRow(row)"
                @click.stop
              />
              <span class="checkmark"></span>
            </label>
          </td>
          <td
            v-for="column in columns"
            :key="column.key"
            :class="[
              column.align ? `text-${column.align}` : '',
              typeof column.cellClass === 'function'
                ? column.cellClass(row[column.key], row)
                : column.cellClass
            ]"
          >
            <slot
              :name="`cell(${column.key})`"
              :value="row[column.key]"
              :row="row"
              :index="rowIndex"
              :column="column"
            >
              {{ formatCellValue(row, column) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="hasPagination" class="table-pagination">
      <div class="pagination-info">
        Showing {{ paginationRangeStart }}-{{ paginationRangeEnd }} of {{ totalRows }} items
      </div>
      <div class="pagination-controls">
        <button
          class="pagination-btn"
          :disabled="currentPage <= 1"
          @click="onPageChange(currentPage - 1)"
        >
          Previous
        </button>
        <span class="pagination-page">{{ currentPage }}</span>
        <button
          class="pagination-btn"
          :disabled="currentPage >= totalPages"
          @click="onPageChange(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import { TableColumn, TableProps } from '@/types';

export default defineComponent({
  name: 'Table',
  props: {
    columns: {
      type: Array as PropType<TableColumn[]>,
      required: true
    },
    data: {
      type: Array as PropType<any[]>,
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
    bordered: {
      type: Boolean,
      default: false
    },
    hoverable: {
      type: Boolean,
      default: true
    },
    caption: {
      type: String,
      default: ''
    },
    sortBy: {
      type: String,
      default: ''
    },
    sortDesc: {
      type: Boolean,
      default: false
    },
    pageSize: {
      type: Number,
      default: 0 // 0 = no pagination
    },
    currentPage: {
      type: Number,
      default: 1
    },
    totalRows: {
      type: Number,
      default: 0
    },
    selectable: {
      type: Boolean,
      default: false
    },
    selectedRows: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    emptyText: {
      type: String,
      default: ''
    },
    responsive: {
      type: Boolean,
      default: true
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'update:sortBy',
    'update:sortDesc',
    'update:currentPage',
    'update:selectedRows',
    'row-click',
    'sort',
    'page-change',
    'selection-change'
  ],
  setup(props, { emit }) {
    const internalSortBy = ref(props.sortBy);
    const internalSortDesc = ref(props.sortDesc);
    const internalCurrentPage = ref(props.currentPage);
    const internalSelectedRows = ref<any[]>(props.selectedRows || []);

    // Watch for prop changes
    watch(() => props.sortBy, (newVal) => {
      internalSortBy.value = newVal;
    });

    watch(() => props.sortDesc, (newVal) => {
      internalSortDesc.value = newVal;
    });

    watch(() => props.currentPage, (newVal) => {
      internalCurrentPage.value = newVal;
    });

    watch(() => props.selectedRows, (newVal) => {
      internalSelectedRows.value = newVal || [];
    });

    // Computed properties
    const processedData = computed(() => {
      let result = [...props.data];

      // Apply sorting
      if (internalSortBy.value) {
        const column = props.columns.find(col => col.key === internalSortBy.value);
        if (column) {
          result.sort((a, b) => {
            let valA = a[internalSortBy.value];
            let valB = b[internalSortBy.value];

            // Handle formatter function
            if (column.formatter) {
              valA = column.formatter(valA, a);
              valB = column.formatter(valB, b);
            }

            // Handle sorting based on types
            if (typeof valA === 'string' && typeof valB === 'string') {
              return internalSortDesc.value
                ? valB.localeCompare(valA)
                : valA.localeCompare(valB);
            } else {
              if (valA < valB) return internalSortDesc.value ? 1 : -1;
              if (valA > valB) return internalSortDesc.value ? -1 : 1;
              return 0;
            }
          });
        }
      }

      // Apply pagination
      if (props.pageSize > 0) {
        const start = (internalCurrentPage.value - 1) * props.pageSize;
        result = result.slice(start, start + props.pageSize);
      }

      return result;
    });

    const hasPagination = computed(() => props.pageSize > 0);

    const totalPages = computed(() => {
      if (props.pageSize <= 0 || props.totalRows <= 0) return 1;
      return Math.ceil(props.totalRows / props.pageSize);
    });

    const paginationRangeStart = computed(() => {
      if (props.pageSize <= 0 || props.totalRows <= 0) return 1;
      return (internalCurrentPage.value - 1) * props.pageSize + 1;
    });

    const paginationRangeEnd = computed(() => {
      if (props.pageSize <= 0 || props.totalRows <= 0) return props.data.length;
      return Math.min(internalCurrentPage.value * props.pageSize, props.totalRows);
    });

    const isAllSelected = computed(() => {
      if (props.data.length === 0) return false;
      return props.data.every(row => isRowSelected(row));
    });

    const isIndeterminate = computed(() => {
      if (props.data.length === 0) return false;
      return !isAllSelected.value && internalSelectedRows.value.length > 0;
    });

    // Methods
    const formatCellValue = (row: any, column: TableColumn): string => {
      const value = row[column.key];
      
      if (column.formatter) {
        return column.formatter(value, row);
      }
      
      if (value === null || value === undefined) {
        return '';
      }
      
      return String(value);
    };

    const onSort = (column: TableColumn) => {
      if (!column.sortable) return;
      
      if (internalSortBy.value === column.key) {
        internalSortDesc.value = !internalSortDesc.value;
      } else {
        internalSortBy.value = column.key;
        internalSortDesc.value = false;
      }

      emit('update:sortBy', internalSortBy.value);
      emit('update:sortDesc', internalSortDesc.value);
      emit('sort', {
        column,
        sortBy: internalSortBy.value,
        sortDesc: internalSortDesc.value
      });
    };

    const onPageChange = (page: number) => {
      if (page < 1 || page > totalPages.value) return;
      
      internalCurrentPage.value = page;
      emit('update:currentPage', page);
      emit('page-change', {
        currentPage: page,
        pageSize: props.pageSize
      });
    };

    const isRowSelected = (row: any) => {
      return internalSelectedRows.value.some(selected => isEqual(selected, row));
    };

    const onSelectRow = (row: any) => {
      const index = internalSelectedRows.value.findIndex(
        selected => isEqual(selected, row)
      );
      
      if (index === -1) {
        internalSelectedRows.value.push(row);
      } else {
        internalSelectedRows.value.splice(index, 1);
      }

      emit('update:selectedRows', [...internalSelectedRows.value]);
      emit('selection-change', {
        selectedRows: [...internalSelectedRows.value]
      });
    };

    const onSelectAll = () => {
      if (isAllSelected.value) {
        internalSelectedRows.value = [];
      } else {
        internalSelectedRows.value = [...props.data];
      }

      emit('update:selectedRows', [...internalSelectedRows.value]);
      emit('selection-change', {
        selectedRows: [...internalSelectedRows.value]
      });
    };

    const onRowClick = (row: any) => {
      emit('row-click', row);
    };

    // Basic object comparison for selection
    const isEqual = (obj1: any, obj2: any): boolean => {
      if (obj1 === obj2) return true;
      if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
      
      // Basic primary key check (common in data tables)
      if (obj1.id !== undefined && obj2.id !== undefined) {
        return obj1.id === obj2.id;
      }

      // Simple stringified comparison as fallback
      try {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
      } catch (e) {
        return false;
      }
    };

    return {
      internalSortBy,
      internalSortDesc,
      internalCurrentPage,
      internalSelectedRows,
      processedData,
      hasPagination,
      totalPages,
      paginationRangeStart,
      paginationRangeEnd,
      isAllSelected,
      isIndeterminate,
      formatCellValue,
      onSort,
      onPageChange,
      isRowSelected,
      onSelectRow,
      onSelectAll,
      onRowClick
    };
  }
});
</script>

<style scoped>
.table-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  margin-bottom: 1rem;
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table {
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
  border-collapse: collapse;
  border-spacing: 0;
}

.table th,
.table td {
  padding: 0.75rem;
  vertical-align: middle;
  border-bottom: 1px solid #dee2e6;
}

.table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
  background-color: #f8f9fa;
  user-select: none;
}

.table-dense th,
.table-dense td {
  padding: 0.3rem;
  font-size: 0.875rem;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}

.table-bordered {
  border: 1px solid #dee2e6;
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #dee2e6;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.075);
  cursor: pointer;
}

.selected-row {
  background-color: rgba(0, 123, 255, 0.1) !important;
}

.table-selection-column {
  width: 40px;
  text-align: center;
}

.sortable-column {
  cursor: pointer;
}

.sortable-column:hover {
  background-color: #e9ecef;
}

.sorted-column {
  background-color: #e9ecef;
}

.th-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sort-icon {
  display: inline-flex;
  flex-direction: column;
  margin-left: 0.25rem;
  line-height: 0.5;
  opacity: 0.3;
}

.sort-icon-asc,
.sort-icon-desc {
  font-size: 0.6rem;
}

.sort-icon-asc.active,
.sort-icon-desc.active {
  opacity: 1;
  color: #007bff;
}

.sortable-column:hover .sort-icon {
  opacity: 0.6;
}

.empty-message {
  text-align: center;
  padding: 2rem;
  font-style: italic;
  color: #6c757d;
}

.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.table-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.table-spinner {
  width: 2rem;
  height: 2rem;
  border: 0.25rem solid rgba(0, 123, 255, 0.3);
  border-right-color: #007bff;
  border-radius: 50%;
  animation: table-spin 0.75s linear infinite;
}

@keyframes table-spin {
  to {
    transform: rotate(360deg);
  }
}

.table-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
}

.pagination-info {
  color: #6c757d;
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
}

.pagination-btn {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  background-color: #fff;
  border: 1px solid #dee2e6;
  color: #007bff;
  cursor: pointer;
  margin: 0 0.25rem;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #e9ecef;
  border-color: #dee2e6;
  color: #0056b3;
}

.pagination-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.pagination-page {
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  background-color: #007bff;
  color: #fff;
  font-weight: 500;
}

/* Checkbox styles */
.checkbox-container {
  display: block;
  position: relative;
  padding-left: 25px;
  margin-bottom: 0;
  cursor: pointer;
  font-size: 16px;
  user-select: none;
  height: 20px;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 3px;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #f8f9fa;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #007bff;
  border-color: #007bff;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
</style>