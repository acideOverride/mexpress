<template>
  <div class="customers-list-container">
    <div class="header-section">
      <h1>Customers</h1>
      <div class="actions">
        <button class="action-button" type="button" @click="handleAddCustomer">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="23" y1="11" x2="17" y2="11"></line>
          </svg>
          Add Customer
        </button>
      </div>
    </div>

    <div class="filters-section" v-if="showAdvancedFilters">
      <div class="filter-grid">
        <div class="filter-field">
          <label for="status-filter">Status</label>
          <Select 
            id="status-filter"
            v-model="filters.status"
            :options="statusOptions"
            placeholder="All statuses"
            @change="handleFilterChange"
          />
        </div>
        <div class="filter-field">
          <label for="search-filter">Search</label>
          <Input 
            id="search-filter"
            v-model="filters.search"
            placeholder="Search customers..."
            @input="debounceSearch"
          />
        </div>
        <div class="filter-field">
          <label for="date-from">From</label>
          <Input 
            id="date-from"
            v-model="filters.dateFrom"
            type="date"
            @change="handleFilterChange"
          />
        </div>
        <div class="filter-field">
          <label for="date-to">To</label>
          <Input 
            id="date-to"
            v-model="filters.dateTo"
            type="date"
            @change="handleFilterChange"
          />
        </div>
      </div>
      <div class="filter-actions">
        <Button variant="secondary" size="small" @click="resetFilters">Reset Filters</Button>
      </div>
    </div>
    
    <div class="table-toolbar">
      <div class="table-actions">
        <Button 
          variant="text" 
          size="small"
          @click="showAdvancedFilters = !showAdvancedFilters"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          {{ showAdvancedFilters ? 'Hide Filters' : 'Show Filters' }}
        </Button>
        <span v-if="totalRows > 0" class="total-count">{{ totalRows }} customers found</span>
      </div>
      <div class="view-options">
        <Select
          v-model="pagination.pageSize"
          :options="pageSizeOptions"
          size="small"
          @change="handlePageSizeChange"
        />
      </div>
    </div>

    <Table 
      :columns="columns"
      :data="customers"
      :loading="loading"
      :striped="true"
      :hoverable="true"
      :sortBy="sorting.field"
      :sortDesc="sorting.direction === 'desc'"
      :showPagination="true"
      :pageSize="pagination.pageSize"
      :currentPage="pagination.page"
      :totalRows="totalRows"
      :emptyText="loading ? 'Loading customers...' : 'No customers found'"
      :showActions="true"
      @row-click="handleRowClick"
      @sort="handleSort"
      @page-change="handlePageChange"
      @edit="handleEdit"
      @delete="handleDelete"
    >
      <template #cell(status)="{ value }">
        <span :class="getStatusClass(value)">{{ value }}</span>
      </template>
      <template #cell(createdAt)="{ value }">
        {{ formatDate(value) }}
      </template>
    </Table>

    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <Button variant="secondary" size="small" @click="fetchCustomers">Retry</Button>
    </div>

    <Modal
      v-if="showAddCustomerModal"
      title="Add New Customer"
      :closeOnBackdrop="false"
      @close="showAddCustomerModal = false"
    >
      <QuickCustomerForm 
        :loading="submitting"
        @created="handleCustomerCreated" 
        @cancel="showAddCustomerModal = false"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Modal } from '@/vue-components/ui'
import { Customer } from '@/api/types/customer'
import { customersService } from '@/api/services/customers.service'
import { 
  CustomerFilterOptions,
  CustomerSortOptions,
  CustomerPaginationOptions, 
  ListResponse
} from '@/api/types/customer'

// Import UI components
import { Table, Input } from '@/vue-components/ui'
import QuickCustomerForm from './QuickCustomerForm.vue'

// Temporary Select component until we implement a proper one
const Select = Button

const customers = ref<Customer[]>([])
const loading = ref(true)
const submitting = ref(false)
const error = ref('')
const showAddCustomerModal = ref(false)
const showAdvancedFilters = ref(false)
const totalRows = ref(0)
const router = useRouter()

// Define table columns
const columns = [
  { 
    key: 'name', 
    label: 'Name', 
    sortable: true, 
    filterable: true
  },
  { 
    key: 'email', 
    label: 'Email', 
    sortable: true, 
    filterable: true 
  },
  { 
    key: 'phone', 
    label: 'Phone', 
    sortable: true,
    filterable: true
  },
  { 
    key: 'status', 
    label: 'Status', 
    sortable: true,
    filterable: true
  },
  { 
    key: 'createdAt', 
    label: 'Created', 
    sortable: true,
    width: '150px'
  }
]

// Filtering, sorting and pagination state
const filters = reactive<CustomerFilterOptions>({
  search: '',
  status: '',
  dateFrom: '',
  dateTo: ''
})

const sorting = reactive<CustomerSortOptions>({
  field: 'createdAt',
  direction: 'desc'
})

const pagination = reactive<CustomerPaginationOptions>({
  page: 1,
  pageSize: 10
})

// Options for dropdown selects
const statusOptions = [
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' }
]

const pageSizeOptions = [
  { value: 10, label: '10 per page' },
  { value: 25, label: '25 per page' },
  { value: 50, label: '50 per page' },
  { value: 100, label: '100 per page' }
]

// Fetch customers with current filters, sorting and pagination
const fetchCustomers = async () => {
  try {
    loading.value = true
    error.value = ''
    
    console.log('Fetching customers with:', { filters, sorting, pagination })
    
    const response = await customersService.getCustomers(
      filters,
      sorting,
      pagination
    )
    
    // Handle the standardized API response format
    if (response.status === 'success' && response.data) {
      customers.value = Array.isArray(response.data) ? response.data : [];
      
      // Get pagination information from meta
      if (response.meta?.pagination) {
        totalRows.value = response.meta.pagination.total || 0;
      } else {
        totalRows.value = customers.value.length;
      }
      
      console.log('Fetched customers:', customers.value);
    } else {
      throw new Error('Invalid response format');
    }
  } catch (err: any) {
    console.error('Failed to fetch customers:', err)
    error.value = err.message || 'Failed to load customers. Please try again.'
  } finally {
    loading.value = false
  }
}

// Handle customer created event
const handleCustomerCreated = (customer: Customer) => {
  console.log('Customer created:', customer)
  showAddCustomerModal.value = false
  
  // Reset to first page and refresh data
  pagination.page = 1
  fetchCustomers()
  
  // Show success message
  error.value = ''
}

// Navigation to customer detail page
const handleRowClick = (customer: Customer) => {
  router.push(`/customers/${customer.id}`)
}

// Show add customer modal
const handleAddCustomer = (event: Event) => {
  console.log('Add customer button clicked', event);
  showAddCustomerModal.value = true;
}

// Edit customer
const handleEdit = (customer: Customer) => {
  console.log('Edit customer:', customer)
  router.push(`/customers/${customer.id}`)
}

// Delete customer
const handleDelete = async (customer: Customer) => {
  if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
    try {
      loading.value = true
      await customersService.delete(customer.id)
      await fetchCustomers()
    } catch (err: any) {
      console.error('Failed to delete customer:', err)
      error.value = err.message || 'Failed to delete customer. Please try again.'
    } finally {
      loading.value = false
    }
  }
}

// Handle sorting changes from table component
const handleSort = (event: { column: any, sortBy: string, sortDesc: boolean }) => {
  sorting.field = event.sortBy
  sorting.direction = event.sortDesc ? 'desc' : 'asc'
  fetchCustomers()
}

// Handle page change from table component
const handlePageChange = (event: { currentPage: number, pageSize: number }) => {
  pagination.page = event.currentPage
  fetchCustomers()
}

// Handle page size change
const handlePageSizeChange = () => {
  pagination.page = 1 // Reset to first page when changing page size
  fetchCustomers()
}

// Handle advanced filter changes
const handleFilterChange = () => {
  pagination.page = 1 // Reset to first page when filters change
  fetchCustomers()
}

// Reset all filters
const resetFilters = () => {
  Object.keys(filters).forEach(key => {
    filters[key as keyof CustomerFilterOptions] = ''
  })
  pagination.page = 1
  fetchCustomers()
}

// Handle table-level filters
const handleTableFilters = (newFilters: any) => {
  // Convert table filters to our API filter format
  if (newFilters.name) {
    filters.search = newFilters.name.value
  }
  
  // Reset to first page when filters change
  pagination.page = 1
  fetchCustomers()
}

// Debounce search to prevent too many requests
let searchTimeout: number | null = null
const debounceSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    pagination.page = 1 // Reset to first page
    fetchCustomers()
  }, 300) as unknown as number
}

// Format date for display
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

// Get CSS class for status badge
const getStatusClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    active: 'status-badge status-active',
    inactive: 'status-badge status-inactive',
    pending: 'status-badge status-pending'
  }
  
  return statusClasses[status] || 'status-badge'
}

// Load initial data
onMounted(() => {
  // Set timeout to ensure the component is fully mounted
  setTimeout(() => {
    fetchCustomers()
  }, 100)
})
</script>

<style scoped>
.customers-list-container {
  padding: 1.5rem;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filters-section {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.filter-field {
  display: flex;
  flex-direction: column;
}

.filter-field label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #374151;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.table-actions, .view-options {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.total-count {
  font-size: 0.875rem;
  color: #6b7280;
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #b91c1c;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-active {
  background-color: rgb(209, 250, 229);
  color: rgb(6, 95, 70);
}

.status-inactive {
  background-color: rgb(254, 226, 226);
  color: rgb(153, 27, 27);
}

.status-pending {
  background-color: rgb(254, 243, 199);
  color: rgb(146, 64, 14);
}

.mr-1 {
  margin-right: 0.25rem;
}

/* Customer Action Button */
.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.15s ease;
  background-color: #2563eb;
}

.action-button:hover {
  background-color: #1d4ed8;
}
</style>