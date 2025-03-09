<template>
  <div class="table-examples">
    <h2>Table Examples</h2>

    <div class="section">
      <h3>Basic Table</h3>
      <Table :columns="basicColumns" :data="users" />
    </div>

    <div class="section">
      <h3>Styled Table (Striped, Bordered, Hoverable)</h3>
      <Table
        :columns="basicColumns"
        :data="users"
        striped
        bordered
        hoverable
      />
    </div>

    <div class="section">
      <h3>Sortable Table</h3>
      <Table
        :columns="sortableColumns"
        :data="users"
        v-model:sort-by="sortBy"
        v-model:sort-desc="sortDesc"
        hoverable
      />
      <div class="controls">
        <div class="control-info">
          Current sort: {{ sortBy || 'None' }} ({{ sortDesc ? 'Descending' : 'Ascending' }})
        </div>
      </div>
    </div>

    <div class="section">
      <h3>Selectable Table</h3>
      <Table
        :columns="basicColumns"
        :data="users"
        :selected-rows="selectedUsers"
        @update:selected-rows="updateSelected"
        selectable
        hoverable
      />
      <div class="controls">
        <div class="control-info">
          Selected users: {{ selectedUsers.length > 0 ? selectedUsers.map(u => u.name).join(', ') : 'None' }}
        </div>
      </div>
    </div>

    <div class="section">
      <h3>Paginated Table</h3>
      <Table
        :columns="basicColumns"
        :data="users"
        :page-size="2"
        :current-page="currentPage"
        :total-rows="users.length"
        @update:current-page="updatePage"
        hoverable
      />
      <div class="controls">
        <div class="control-info">
          Current page: {{ currentPage }}
        </div>
      </div>
    </div>

    <div class="section">
      <h3>Formatted Cells Table</h3>
      <Table
        :columns="formattedColumns"
        :data="users"
        hoverable
      />
    </div>

    <div class="section">
      <h3>Loading State</h3>
      <Table
        :columns="basicColumns"
        :data="users"
        loading
        hoverable
      />
    </div>

    <div class="section">
      <h3>Empty Table</h3>
      <Table
        :columns="basicColumns"
        :data="[]"
        empty-text="No users found"
        hoverable
      />
    </div>

    <div class="section">
      <h3>Dense Table</h3>
      <Table
        :columns="basicColumns"
        :data="users"
        dense
        hoverable
      />
    </div>

    <div class="section">
      <h3>Custom Cell Rendering</h3>
      <Table
        :columns="customColumns"
        :data="users"
        hoverable
      >
        <template #cell(status)="{ value, row }">
          <span :class="`status-badge status-${value.toLowerCase()}`">
            {{ value }}
          </span>
        </template>
        <template #cell(actions)="{ row }">
          <div class="action-buttons">
            <button class="btn-action btn-edit">Edit</button>
            <button class="btn-action btn-delete">Delete</button>
          </div>
        </template>
      </Table>
    </div>
    
    <div class="section">
      <h3>Filterable Table</h3>
      <Table
        :columns="filterableColumns"
        :data="users"
        :filters="filters"
        filter-enabled
        hoverable
        bordered
        @update:filters="updateFilters"
      />
      <div class="controls">
        <div class="control-info">
          Active filters: {{ 
            Object.entries(filters).length 
              ? Object.entries(filters).map(([key, filter]) => 
                  `${key} ${filter.operator} "${filter.value}"`
                ).join(', ') 
              : 'None' 
          }}
        </div>
        <button 
          v-if="Object.keys(filters).length > 0" 
          class="btn-action btn-clear"
          @click="clearFilters"
        >
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Table from './Table.vue';
import { TableColumn, TableFilter } from '@/types';

export default defineComponent({
  name: 'TableExample',
  components: {
    Table
  },
  setup() {
    // Sample data
    const users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        age: 32,
        status: 'Active',
        lastLogin: '2025-02-15T10:30:00Z',
        role: 'Admin'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        age: 28,
        status: 'Inactive',
        lastLogin: '2025-01-20T14:45:00Z',
        role: 'Editor'
      },
      {
        id: 3,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        age: 35,
        status: 'Active',
        lastLogin: '2025-03-05T09:15:00Z',
        role: 'User'
      },
      {
        id: 4,
        name: 'Bob Williams',
        email: 'bob@example.com',
        age: 42,
        status: 'Active',
        lastLogin: '2025-02-28T16:20:00Z',
        role: 'User'
      },
      {
        id: 5,
        name: 'Carol Brown',
        email: 'carol@example.com',
        age: 39,
        status: 'Suspended',
        lastLogin: '2025-01-10T11:05:00Z',
        role: 'Editor'
      }
    ];

    // Basic columns
    const basicColumns: TableColumn[] = [
      { key: 'id', label: 'ID', width: '50px' },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'age', label: 'Age', align: 'right', width: '80px' },
      { key: 'status', label: 'Status' },
      { key: 'role', label: 'Role' }
    ];

    // Sortable columns
    const sortableColumns: TableColumn[] = [
      { key: 'id', label: 'ID', sortable: true, width: '50px' },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'age', label: 'Age', sortable: true, align: 'right', width: '80px' },
      { key: 'status', label: 'Status', sortable: true },
      { key: 'role', label: 'Role', sortable: true }
    ];

    // Formatted columns
    const formattedColumns: TableColumn[] = [
      { key: 'id', label: 'ID', width: '50px' },
      { key: 'name', label: 'Full Name' },
      { 
        key: 'email', 
        label: 'Email',
        formatter: (value) => `<a href="mailto:${value}">${value}</a>`
      },
      { 
        key: 'age', 
        label: 'Age', 
        align: 'right', 
        width: '80px',
        formatter: (value) => `${value} years`
      },
      { 
        key: 'status', 
        label: 'Status',
        cellClass: (value) => `status-${value.toLowerCase()}`
      },
      { 
        key: 'lastLogin', 
        label: 'Last Login',
        formatter: (value) => {
          const date = new Date(value);
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
      }
    ];

    // Custom cell columns
    const customColumns: TableColumn[] = [
      { key: 'id', label: 'ID', width: '50px' },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status' },
      { key: 'role', label: 'Role' },
      { key: 'actions', label: 'Actions', align: 'center' }
    ];
    
    // Filterable columns
    const filterableColumns: TableColumn[] = [
      { key: 'id', label: 'ID', width: '50px', sortable: true, filterable: true },
      { key: 'name', label: 'Name', sortable: true, filterable: true },
      { key: 'email', label: 'Email', sortable: true, filterable: true },
      { key: 'age', label: 'Age', align: 'right', width: '80px', sortable: true, filterable: true },
      { key: 'status', label: 'Status', sortable: true, filterable: true },
      { key: 'role', label: 'Role', sortable: true, filterable: true },
      { key: 'lastLogin', label: 'Last Login', 
        sortable: true, 
        filterable: true,
        formatter: (value) => {
          const date = new Date(value);
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
      }
    ];

    // Reactive state for demo
    const sortBy = ref('');
    const sortDesc = ref(false);
    const selectedUsers = ref<any[]>([]);
    const currentPage = ref(1);
    const filters = ref<Record<string, TableFilter>>({});

    // Methods
    const updateSelected = (rows: any[]) => {
      selectedUsers.value = rows;
    };

    const updatePage = (page: number) => {
      currentPage.value = page;
    };
    
    const updateFilters = (newFilters: Record<string, TableFilter>) => {
      filters.value = newFilters;
    };
    
    const clearFilters = () => {
      filters.value = {};
    };

    return {
      users,
      basicColumns,
      sortableColumns,
      formattedColumns,
      customColumns,
      filterableColumns,
      sortBy,
      sortDesc,
      selectedUsers,
      currentPage,
      filters,
      updateSelected,
      updatePage,
      updateFilters,
      clearFilters
    };
  }
});
</script>

<style scoped>
.table-examples {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #333;
}

h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #555;
}

.section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  background-color: #fff;
}

.controls {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 0.25rem;
}

.control-info {
  font-size: 0.875rem;
  color: #6c757d;
}

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

.status-active {
  color: #155724;
  background-color: #d4edda;
}

.status-inactive {
  color: #6c757d;
  background-color: #e2e3e5;
}

.status-suspended {
  color: #856404;
  background-color: #fff3cd;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-action {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  line-height: 1.5;
  border-radius: 0.2rem;
  border: 1px solid transparent;
  cursor: pointer;
}

.btn-edit {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-delete {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-clear {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
  margin-top: 0.5rem;
}
</style>