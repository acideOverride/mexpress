<template>
  <div class="tickets-list-container">
    <div class="header-section">
      <h1>Service Tickets</h1>
      <div class="actions">
        <Button variant="primary" @click="handleAddTicket">
          Create Ticket
        </Button>
      </div>
    </div>

    <div class="filters">
      <div class="filter-row">
        <div class="filter-group">
          <label for="status-filter">Status</label>
          <Select
            id="status-filter"
            v-model="filters.status"
            :options="statusOptions"
            @update:modelValue="applyFilters"
          />
        </div>
        
        <div class="filter-group">
          <label for="priority-filter">Priority</label>
          <Select
            id="priority-filter"
            v-model="filters.priority"
            :options="priorityOptions"
            @update:modelValue="applyFilters"
          />
        </div>
        
        <div class="filter-group">
          <label for="technician-filter">Technician</label>
          <Select
            id="technician-filter"
            v-model="filters.technician"
            :options="technicianOptions"
            @update:modelValue="applyFilters"
          />
        </div>
        
        <div class="filter-group search-group">
          <label for="search-filter">Search</label>
          <Input
            id="search-filter"
            v-model="filters.search"
            placeholder="Search tickets..."
            @input="debounceSearch"
          />
        </div>
      </div>
      
      <div v-if="hasActiveFilters" class="active-filters">
        <span>Active filters:</span>
        <div class="filter-tags">
          <div v-if="filters.status" class="filter-tag">
            Status: {{ getOptionLabel(statusOptions, filters.status) }}
            <span class="filter-tag-remove" @click="removeFilter('status')">×</span>
          </div>
          <div v-if="filters.priority" class="filter-tag">
            Priority: {{ getOptionLabel(priorityOptions, filters.priority) }}
            <span class="filter-tag-remove" @click="removeFilter('priority')">×</span>
          </div>
          <div v-if="filters.technician" class="filter-tag">
            Technician: {{ getOptionLabel(technicianOptions, filters.technician) }}
            <span class="filter-tag-remove" @click="removeFilter('technician')">×</span>
          </div>
          <div v-if="filters.search" class="filter-tag">
            Search: "{{ filters.search }}"
            <span class="filter-tag-remove" @click="removeFilter('search')">×</span>
          </div>
          <Button size="small" variant="text" @click="clearAllFilters">
            Clear all
          </Button>
        </div>
      </div>
    </div>

    <Table 
      :data="filteredTickets"
      :columns="columns"
      :loading="loading"
      :filterable="true"
      :sortable="true"
      :pagination="true"
      :items-per-page-options="[10, 25, 50]"
      default-items-per-page="10"
      @row-click="handleRowClick"
    />

    <CreateNewModal
      v-if="showAddTicketModal"
      title="Create New Ticket"
      @close="showAddTicketModal = false"
    >
      <TicketForm 
        :loading="creatingTicket"
        @submit="handleTicketFormSubmit" 
        @cancel="showAddTicketModal = false" 
      />
    </CreateNewModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Button } from '@/vue-components/ui'
import { CreateNewModal } from '@/vue-components/search'
import TicketForm from './TicketForm.vue'

// Temporary mock services
const ticketsService = {
  getTickets: async () => {
    return []
  },
  createTicket: async () => {
    return {}
  }
}

// Temporary components until we implement proper UI components
const Table = Button
const Select = Button
const Input = Button

// Simple debounce function
const useDebounce = (fn: Function, delay: number) => {
  let timeout: any
  return function(...args: any[]) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

interface Ticket {
  id: string | number
  title: string
  description: string
  status: string
  priority: string
  customer: {
    id: string | number
    name: string
  }
  technician: {
    id: string | number
    name: string
  }
  createdAt: string
  updatedAt: string
}

const router = useRouter()
const route = useRoute()
const tickets = ref<Ticket[]>([])
const loading = ref(true)
const creatingTicket = ref(false)
const showAddTicketModal = ref(false)

const filters = reactive({
  status: '',
  priority: '',
  technician: '',
  search: '',
  customerId: route.query.customerId as string || ''
})

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'waiting', label: 'Waiting for Parts' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

const priorityOptions = [
  { value: '', label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
]

const technicianOptions = [
  { value: '', label: 'All Technicians' },
  { value: '1', label: 'Alex Johnson' },
  { value: '2', label: 'Maria Garcia' },
  { value: '3', label: 'David Smith' }
]

const columns = [
  { 
    key: 'id', 
    header: 'Ticket ID', 
    sortable: true
  },
  { 
    key: 'title', 
    header: 'Title', 
    sortable: true, 
    filterable: true 
  },
  { 
    key: 'status', 
    header: 'Status', 
    sortable: true,
    filterable: true,
    render: (value: string) => {
      const statusClasses: Record<string, string> = {
        new: 'status-badge status-new',
        in_progress: 'status-badge status-in-progress',
        waiting: 'status-badge status-waiting',
        completed: 'status-badge status-completed',
        cancelled: 'status-badge status-cancelled'
      }
      const statusLabels: Record<string, string> = {
        new: 'New',
        in_progress: 'In Progress',
        waiting: 'Waiting for Parts',
        completed: 'Completed',
        cancelled: 'Cancelled'
      }
      return `<span class="${statusClasses[value] || ''}">${statusLabels[value] || value}</span>`
    }
  },
  { 
    key: 'priority', 
    header: 'Priority', 
    sortable: true,
    filterable: true,
    render: (value: string) => {
      const priorityClasses: Record<string, string> = {
        high: 'priority-badge priority-high',
        medium: 'priority-badge priority-medium',
        low: 'priority-badge priority-low'
      }
      return `<span class="${priorityClasses[value] || ''}">${value.charAt(0).toUpperCase() + value.slice(1)}</span>`
    }
  },
  { 
    key: 'customer.name', 
    header: 'Customer', 
    sortable: true,
    filterable: true
  },
  { 
    key: 'technician.name', 
    header: 'Technician', 
    sortable: true,
    filterable: true
  },
  { 
    key: 'createdAt', 
    header: 'Created', 
    sortable: true,
    render: (value: string) => new Date(value).toLocaleDateString()
  }
]

const hasActiveFilters = computed(() => {
  return filters.status !== '' || 
         filters.priority !== '' || 
         filters.technician !== '' || 
         filters.search !== '' || 
         filters.customerId !== ''
})

const fetchTickets = async () => {
  try {
    loading.value = true
    
    // In a real app, you'd pass filters to the API
    // For now we'll use mock data and filter client-side
    const response = await ticketsService.getTickets({
      customerId: filters.customerId
    })
    
    tickets.value = response.data
  } catch (error) {
    console.error('Failed to fetch tickets:', error)
  } finally {
    loading.value = false
  }
}

const filteredTickets = computed(() => {
  let result = [...tickets.value]
  
  if (filters.status) {
    result = result.filter(ticket => ticket.status === filters.status)
  }
  
  if (filters.priority) {
    result = result.filter(ticket => ticket.priority === filters.priority)
  }
  
  if (filters.technician) {
    result = result.filter(ticket => ticket.technician.id.toString() === filters.technician)
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    result = result.filter(ticket => 
      ticket.title.toLowerCase().includes(searchLower) ||
      ticket.description.toLowerCase().includes(searchLower) ||
      ticket.customer.name.toLowerCase().includes(searchLower)
    )
  }
  
  return result
})

const getOptionLabel = (options: { value: string, label: string }[], value: string) => {
  const option = options.find(opt => opt.value === value)
  return option ? option.label : value
}

const removeFilter = (filterName: keyof typeof filters) => {
  filters[filterName] = ''
  applyFilters()
}

const clearAllFilters = () => {
  filters.status = ''
  filters.priority = ''
  filters.technician = ''
  filters.search = ''
  // Don't clear customerId filter as it's part of the route
  applyFilters()
}

const debounceSearch = useDebounce(() => {
  applyFilters()
}, 300)

const applyFilters = () => {
  // In a real app, you might want to update the URL with the current filters
  // and fetch from the server with those filters
  // For now we'll just rely on the computed filteredTickets
}

const handleAddTicket = () => {
  showAddTicketModal.value = true
}

const handleRowClick = (ticket: Ticket) => {
  router.push(`/tickets/${ticket.id}`)
}

const handleTicketFormSubmit = async (ticketData: Partial<Ticket>) => {
  try {
    creatingTicket.value = true
    await ticketsService.createTicket(ticketData)
    await fetchTickets()
    showAddTicketModal.value = false
  } catch (error) {
    console.error('Failed to create ticket:', error)
  } finally {
    creatingTicket.value = false
  }
}

// Watch for changes to the customerId route param
watch(() => route.query.customerId, (newValue) => {
  if (newValue !== filters.customerId) {
    filters.customerId = newValue as string || ''
    fetchTickets()
  }
})

onMounted(() => {
  fetchTickets()
})
</script>

<style scoped>
.tickets-list-container {
  padding: 1.5rem;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filters {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #F9FAFB;
  border-radius: 0.5rem;
  border: 1px solid #E5E7EB;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 200px;
  flex: 1;
}

.search-group {
  flex: 2;
}

.filter-group label {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text-primary, #374151);
}

.active-filters {
  display: flex;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #E5E7EB;
  font-size: 0.875rem;
  color: var(--color-text-secondary, #6B7280);
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-left: 0.5rem;
}

.filter-tag {
  display: flex;
  align-items: center;
  background-color: #EFF6FF;
  color: #1E40AF;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.filter-tag-remove {
  margin-left: 0.25rem;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
}

.filter-tag-remove:hover {
  color: #DC2626;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-new {
  background-color: rgb(239, 246, 255);
  color: rgb(30, 64, 175);
}

.status-in-progress {
  background-color: rgb(237, 233, 254);
  color: rgb(91, 33, 182);
}

.status-waiting {
  background-color: rgb(254, 243, 199);
  color: rgb(146, 64, 14);
}

.status-completed {
  background-color: rgb(209, 250, 229);
  color: rgb(6, 95, 70);
}

.status-cancelled {
  background-color: rgb(254, 226, 226);
  color: rgb(153, 27, 27);
}

.priority-badge {
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.priority-high {
  background-color: rgb(254, 226, 226);
  color: rgb(153, 27, 27);
}

.priority-medium {
  background-color: rgb(254, 243, 199);
  color: rgb(146, 64, 14);
}

.priority-low {
  background-color: rgb(209, 250, 229);
  color: rgb(6, 95, 70);
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
  }
  
  .filter-group {
    min-width: 100%;
  }
}
</style>