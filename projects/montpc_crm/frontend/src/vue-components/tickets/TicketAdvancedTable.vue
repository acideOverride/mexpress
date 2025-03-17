<template>
  <div class="ticket-advanced-table">
    <h2 class="section-title">Repair Tickets</h2>
    
    <div class="table-toolbar">
      <div class="theme-controls">
        <label>Theme:</label>
        <select v-model="tableTheme" class="theme-select">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
      
      <div class="view-controls">
        <button @click="toggleExpandAll" class="control-button">
          {{ allExpanded ? 'Collapse All' : 'Expand All' }}
        </button>
        <button @click="enableKeyboardMode" class="control-button" :class="{ active: keyboardEnabled }">
          Keyboard Mode
        </button>
      </div>
    </div>
    
    <div :class="{ 'dark-theme': tableTheme === 'dark' }">
      <Table
        :columns="columns"
        :data="tickets"
        :theme="tableTheme"
        :exportable="true"
        :exportFormats="['csv', 'json', 'excel', 'pdf']"
        :expandableRows="true"
        :expandedRows="expandedRows"
        @update:expandedRows="updateExpandedRows"
        :keyboardNavigation="keyboardEnabled"
        columnResizing
        @column-resize="onColumnResize"
        striped
        bordered
        hoverable
        @cell-action="onCellAction"
        @export="onExport"
      >
        <!-- Custom cell renderers -->
        <template #cell(status)="{ value }">
          <span :class="`status-badge status-${value.toLowerCase()}`">
            {{ value }}
          </span>
        </template>
        
        <template #cell(priority)="{ value }">
          <div class="priority-indicator" :class="`priority-${value.toLowerCase()}`">
            <span class="priority-dots">
              {{ priorityDots(value) }}
            </span>
            <span class="priority-text">{{ value }}</span>
          </div>
        </template>
        
        <template #cell(actions)>
          <div class="action-buttons">
            <button class="btn-action btn-edit">Edit</button>
            <button class="btn-action btn-view">View</button>
          </div>
        </template>
        
        <!-- Row expansion template -->
        <template #row-expansion="{ row }">
          <div class="ticket-details">
            <div class="ticket-info">
              <h4>Ticket #{{ row.id }} Details</h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>Customer:</label>
                  <span>{{ row.customer }}</span>
                </div>
                <div class="info-item">
                  <label>Device:</label>
                  <span>{{ row.device }}</span>
                </div>
                <div class="info-item">
                  <label>Issue:</label>
                  <span>{{ row.issue }}</span>
                </div>
                <div class="info-item">
                  <label>Assigned to:</label>
                  <span>{{ row.assignedTo }}</span>
                </div>
                <div class="info-item">
                  <label>Created:</label>
                  <span>{{ formatDate(row.createdAt) }}</span>
                </div>
                <div class="info-item">
                  <label>Updated:</label>
                  <span>{{ formatDate(row.updatedAt) }}</span>
                </div>
              </div>
            </div>
            
            <div class="ticket-notes">
              <h5>Notes</h5>
              <p>{{ row.notes || 'No notes available' }}</p>
            </div>
            
            <div class="ticket-actions">
              <button class="btn primary">Update Status</button>
              <button class="btn secondary">Add Note</button>
              <button class="btn tertiary">Contact Customer</button>
            </div>
          </div>
        </template>
      </Table>
    </div>
    
    <div class="table-footer">
      <div v-if="lastAction" class="last-action">
        Last action: {{ lastAction }}
      </div>
      <div v-if="lastExport" class="last-export">
        Last export: {{ lastExport }}
      </div>
      <div v-if="lastResize" class="last-resize">
        Last resize: {{ lastResize }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { Table } from '@mexpress/vue-components';
import { TableColumn, TableTheme, TableExportFormat } from '@mexpress/vue-components/src/types';

interface Ticket {
  id: number;
  title: string;
  status: string;
  priority: string;
  customer: string;
  device: string;
  issue: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export default defineComponent({
  name: 'TicketAdvancedTable',
  components: {
    Table
  },
  setup() {
    // Column definitions
    const columns: TableColumn[] = [
      { 
        key: 'id', 
        label: 'Ticket ID',
        sortable: true,
        width: '100px',
        resizable: true
      },
      { 
        key: 'title', 
        label: 'Title',
        sortable: true,
        filterable: true,
        resizable: true
      },
      { 
        key: 'status', 
        label: 'Status',
        sortable: true,
        filterable: true,
        width: '120px',
        resizable: true
      },
      { 
        key: 'priority', 
        label: 'Priority',
        sortable: true, 
        filterable: true,
        width: '120px',
        resizable: true
      },
      { 
        key: 'customer', 
        label: 'Customer',
        sortable: true,
        filterable: true,
        resizable: true
      },
      { 
        key: 'device', 
        label: 'Device Type',
        sortable: true,
        filterable: true,
        resizable: true
      },
      { 
        key: 'assignedTo', 
        label: 'Assigned To',
        sortable: true,
        filterable: true,
        resizable: true
      },
      { 
        key: 'createdAt', 
        label: 'Created',
        sortable: true,
        filterable: true,
        width: '140px',
        formatter: (value) => formatDate(value),
        resizable: true
      },
      { 
        key: 'actions', 
        label: 'Actions',
        width: '120px',
        resizable: true
      }
    ];
    
    // Sample ticket data
    const tickets: Ticket[] = [
      {
        id: 1001,
        title: 'Laptop won\'t boot',
        status: 'In Progress',
        priority: 'High',
        customer: 'John Doe',
        device: 'Dell XPS 15',
        issue: 'Laptop shows black screen and won\'t boot after Windows update',
        assignedTo: 'Tech Smith',
        createdAt: '2025-03-15T09:30:00Z',
        updatedAt: '2025-03-16T14:20:00Z',
        notes: 'Diagnosed as corrupted boot sector. Will attempt recovery before reinstall.'
      },
      {
        id: 1002,
        title: 'Blue screen error',
        status: 'Open',
        priority: 'Medium',
        customer: 'Jane Smith',
        device: 'HP Pavilion',
        issue: 'Computer frequently crashes with blue screen error',
        assignedTo: 'Mike Johnson',
        createdAt: '2025-03-14T11:45:00Z',
        updatedAt: '2025-03-14T15:30:00Z',
        notes: 'Initial diagnosis suggests RAM issue. Will run memory tests.'
      },
      {
        id: 1003,
        title: 'Slow performance',
        status: 'Open',
        priority: 'Low',
        customer: 'Alice Williams',
        device: 'Lenovo ThinkPad',
        issue: 'Computer has become extremely slow over the past week',
        assignedTo: 'Tech Smith',
        createdAt: '2025-03-13T14:20:00Z',
        updatedAt: '2025-03-13T16:15:00Z'
      },
      {
        id: 1004,
        title: 'Software installation',
        status: 'Completed',
        priority: 'Low',
        customer: 'Bob Johnson',
        device: 'Custom Desktop',
        issue: 'Need assistance installing specialized CAD software',
        assignedTo: 'Sarah Lee',
        createdAt: '2025-03-12T10:10:00Z',
        updatedAt: '2025-03-13T11:30:00Z',
        notes: 'Successfully installed software and provided basic training.'
      },
      {
        id: 1005,
        title: 'Hardware upgrade',
        status: 'In Progress',
        priority: 'Medium',
        customer: 'Tom Wilson',
        device: 'Custom Desktop',
        issue: 'Upgrade RAM and install new graphics card',
        assignedTo: 'Mike Johnson',
        createdAt: '2025-03-11T13:50:00Z',
        updatedAt: '2025-03-12T09:45:00Z',
        notes: 'Parts have arrived. Scheduled for tomorrow morning.'
      },
      {
        id: 1006,
        title: 'Virus removal',
        status: 'In Progress',
        priority: 'High',
        customer: 'Carol Brown',
        device: 'Acer Aspire',
        issue: 'Computer infected with ransomware',
        assignedTo: 'Tech Smith',
        createdAt: '2025-03-10T16:30:00Z',
        updatedAt: '2025-03-10T17:45:00Z',
        notes: 'System heavily infected. Will need to recover data and reinstall OS.'
      },
      {
        id: 1007,
        title: 'Network connectivity',
        status: 'Open',
        priority: 'Medium',
        customer: 'David Miller',
        device: 'MacBook Pro',
        issue: 'Cannot connect to office network',
        assignedTo: 'Sarah Lee',
        createdAt: '2025-03-10T09:15:00Z',
        updatedAt: '2025-03-10T11:20:00Z'
      }
    ];
    
    // Table state
    const tableTheme = ref<TableTheme>('light');
    const expandedRows = ref<Ticket[]>([]);
    const keyboardEnabled = ref(false);
    const lastAction = ref('');
    const lastExport = ref('');
    const lastResize = ref('');
    
    // Computed
    const allExpanded = computed(() => {
      return expandedRows.value.length === tickets.length;
    });
    
    // Methods
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    };
    
    const priorityDots = (priority: string): string => {
      switch (priority.toLowerCase()) {
        case 'high':
          return '●●●';
        case 'medium':
          return '●●○';
        case 'low':
          return '●○○';
        default:
          return '○○○';
      }
    };
    
    const toggleExpandAll = () => {
      if (allExpanded.value) {
        expandedRows.value = [];
      } else {
        expandedRows.value = [...tickets];
      }
    };
    
    const updateExpandedRows = (rows: Ticket[]) => {
      expandedRows.value = rows;
    };
    
    const enableKeyboardMode = () => {
      keyboardEnabled.value = !keyboardEnabled.value;
      lastAction.value = keyboardEnabled.value ? 
        'Keyboard navigation enabled' : 
        'Keyboard navigation disabled';
    };
    
    const onCellAction = (event: any) => {
      lastAction.value = `Action performed on ${event.column.label} in row ${event.rowIndex + 1} (${event.row.title})`;
    };
    
    const onExport = (event: any) => {
      lastExport.value = `Exported data in ${event.format.toUpperCase()} format as ${event.filename}`;
    };
    
    const onColumnResize = (event: any) => {
      lastResize.value = `Column "${event.column.label}" resized to ${event.width}`;
    };
    
    return {
      columns,
      tickets,
      tableTheme,
      expandedRows,
      keyboardEnabled,
      lastAction,
      lastExport,
      lastResize,
      allExpanded,
      formatDate,
      priorityDots,
      toggleExpandAll,
      updateExpandedRows,
      enableKeyboardMode,
      onCellAction,
      onExport,
      onColumnResize
    };
  }
});
</script>

<style scoped>
.ticket-advanced-table {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 0.25rem;
}

.theme-controls,
.view-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-select {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #ced4da;
}

.control-button {
  padding: 0.25rem 0.5rem;
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.control-button:hover {
  background-color: #e9ecef;
}

.control-button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.table-footer {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #6c757d;
}

.last-action,
.last-export,
.last-resize {
  margin-bottom: 0.5rem;
}

/* Status badges */
.status-badge {
  display: inline-block;
  padding: 0.25em 0.6em;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.375rem;
}

.status-open {
  color: #212529;
  background-color: #f8f9fa;
}

.status-in.progress {
  color: #0c5460;
  background-color: #d1ecf1;
}

.status-completed {
  color: #155724;
  background-color: #d4edda;
}

/* Priority indicators */
.priority-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.priority-dots {
  font-size: 0.75rem;
}

.priority-high {
  color: #dc3545;
}

.priority-medium {
  color: #fd7e14;
}

.priority-low {
  color: #28a745;
}

/* Action buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-action {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 0.25rem;
  border: 1px solid #dee2e6;
  cursor: pointer;
}

.btn-edit {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-view {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

/* Row expansion styling */
.ticket-details {
  padding: 1rem;
}

.ticket-info h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #495057;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item label {
  font-size: 0.75rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.ticket-notes {
  margin-bottom: 1.5rem;
}

.ticket-notes h5 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #495057;
}

.ticket-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  border: 1px solid transparent;
}

.primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.tertiary {
  color: #212529;
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

/* Dark theme support */
.dark-theme {
  --background: #343a40;
  --text: #e9ecef;
  --border: #495057;
  color: var(--text);
}

.dark-theme .status-open {
  color: #e9ecef;
  background-color: #495057;
}

@media (max-width: 768px) {
  .table-toolbar {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .ticket-actions {
    flex-direction: column;
  }
}
</style>