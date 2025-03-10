<template>
  <div class="ticket-detail">
    <div v-if="loading" class="loading-container">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <Button variant="secondary" @click="goBack">Go Back</Button>
    </div>
    
    <div v-else-if="ticket">
      <div class="header-section">
        <div class="header-title">
          <h1>Ticket #{{ ticket.id }}: {{ ticket.title }}</h1>
          <span :class="['status-badge', `status-${ticket.status}`]">
            {{ getStatusLabel(ticket.status) }}
          </span>
        </div>
        
        <div class="header-actions">
          <Button variant="secondary" @click="goBack">
            Back to Tickets
          </Button>
          <Button variant="primary" @click="handleEdit">
            Edit Ticket
          </Button>
        </div>
      </div>
      
      <div class="ticket-content">
        <Card class="ticket-info">
          <template #title>Ticket Information</template>
          <div class="info-grid">
            <div class="info-item">
              <h3>Service Details</h3>
              <p><strong>Status:</strong> {{ getStatusLabel(ticket.status) }}</p>
              <p><strong>Priority:</strong> {{ getPriorityLabel(ticket.priority) }}</p>
              <p><strong>Created:</strong> {{ formatDate(ticket.createdAt) }}</p>
              <p><strong>Last Updated:</strong> {{ formatDate(ticket.updatedAt) }}</p>
              <p v-if="ticket.estimatedHours"><strong>Estimated Time:</strong> {{ ticket.estimatedHours }} hours</p>
              <p v-if="ticket.estimatedCost"><strong>Estimated Cost:</strong> ${{ ticket.estimatedCost }}</p>
            </div>
            
            <div class="info-item">
              <h3>Customer</h3>
              <p><strong>Name:</strong> {{ ticket.customer.name }}</p>
              <p v-if="ticket.customer.email"><strong>Email:</strong> {{ ticket.customer.email }}</p>
              <p v-if="ticket.customer.phone"><strong>Phone:</strong> {{ ticket.customer.phone }}</p>
              <Button size="small" variant="text" @click="viewCustomer(ticket.customer.id)">
                View Customer
              </Button>
            </div>
          </div>
          
          <div class="description-section">
            <h3>Description</h3>
            <p>{{ ticket.description }}</p>
          </div>
          
          <div class="equipment-section" v-if="ticket.equipmentType || ticket.modelNumber">
            <h3>Equipment</h3>
            <p v-if="ticket.equipmentType"><strong>Type:</strong> {{ getEquipmentLabel(ticket.equipmentType) }}</p>
            <p v-if="ticket.modelNumber"><strong>Model/Serial Number:</strong> {{ ticket.modelNumber }}</p>
          </div>
          
          <div class="assignment-section">
            <h3>Assignment</h3>
            <p v-if="ticket.technician?.id">
              <strong>Technician:</strong> {{ ticket.technician.name }}
            </p>
            <p v-else class="unassigned">
              <strong>Technician:</strong> Unassigned
            </p>
            
            <div v-if="!ticket.technician?.id && isNew" class="assign-action">
              <Button size="small" variant="secondary" @click="showAssignModal = true">
                Assign Technician
              </Button>
            </div>
          </div>
        </Card>
        
        <div class="ticket-secondary">
          <Card class="ticket-timeline">
            <template #title>Timeline</template>
            <div v-if="timeline.length === 0" class="empty-state">
              <p>No timeline events</p>
            </div>
            <ul v-else class="timeline-list">
              <li v-for="event in timeline" :key="event.id" class="timeline-item">
                <div class="timeline-header">
                  <h4>{{ event.type }}</h4>
                  <span class="timeline-date">{{ formatDate(event.timestamp) }}</span>
                </div>
                <p class="timeline-description">{{ event.description }}</p>
                <p v-if="event.user" class="timeline-user">
                  By: {{ event.user }}
                </p>
              </li>
            </ul>
          </Card>
          
          <Card class="ticket-actions">
            <template #title>Actions</template>
            <div class="action-buttons">
              <Button 
                v-if="ticket.status === 'new'" 
                variant="primary" 
                @click="updateStatus('in_progress')"
              >
                Start Work
              </Button>
              
              <Button 
                v-if="ticket.status === 'in_progress'" 
                variant="primary" 
                @click="updateStatus('completed')"
              >
                Mark as Completed
              </Button>
              
              <Button 
                v-if="['new', 'in_progress', 'waiting'].includes(ticket.status)" 
                variant="secondary" 
                @click="updateStatus('waiting')"
              >
                Mark as Waiting
              </Button>
              
              <Button 
                v-if="!['cancelled', 'completed'].includes(ticket.status)" 
                variant="danger" 
                @click="updateStatus('cancelled')"
              >
                Cancel Ticket
              </Button>
              
              <Button 
                v-if="ticket.status === 'completed'" 
                variant="secondary" 
                @click="updateStatus('in_progress')"
              >
                Reopen Ticket
              </Button>
            </div>
          </Card>
          
          <Card class="add-note">
            <template #title>Add Note</template>
            <div class="note-form">
              <textarea
                v-model="newNote"
                placeholder="Add a note to this ticket..."
                rows="3"
                class="form-textarea"
              ></textarea>
              <div class="note-actions">
                <Button 
                  variant="primary" 
                  :disabled="!newNote.trim()" 
                  @click="addNote"
                >
                  Add Note
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
    
    <CreateNewModal
      v-if="showEditModal"
      title="Edit Ticket"
      @close="showEditModal = false"
    >
      <TicketForm 
        :initialData="ticket"
        :loading="updating"
        @submit="handleTicketFormSubmit"
        @cancel="showEditModal = false"
      />
    </CreateNewModal>
    
    <CreateNewModal
      v-if="showAssignModal"
      title="Assign Technician"
      @close="showAssignModal = false"
    >
      <div class="assign-form">
        <div class="form-field">
          <label for="assign-technician">Select Technician</label>
          <Select 
            id="assign-technician"
            v-model="selectedTechnician"
            :options="technicianOptions"
          />
        </div>
        <div class="form-actions">
          <Button type="button" variant="secondary" @click="showAssignModal = false">Cancel</Button>
          <Button 
            type="button" 
            variant="primary" 
            :disabled="!selectedTechnician" 
            @click="assignTechnician"
          >
            Assign
          </Button>
        </div>
      </div>
    </CreateNewModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button, Card } from '@/vue-components/ui'
import { LoadingSpinner } from '@/vue-components/common'
import { CreateNewModal } from '@/vue-components/search'
import TicketForm from './TicketForm.vue'

// Temporary dummy Select component 
const Select = Button

// Temporary mock service
const ticketsService = {
  getTicketById: async () => {
    return {
      data: {
        id: '123',
        title: 'Sample Ticket',
        description: 'This is a sample ticket',
        status: 'active',
        priority: 'medium',
        customer: {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  },
  updateTicket: async () => {
    return {}
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
    email?: string
    phone?: string
  }
  technician?: {
    id: string | number
    name: string
  }
  createdAt: string
  updatedAt: string
  equipmentType?: string
  modelNumber?: string
  estimatedHours?: string
  estimatedCost?: string
}

interface TimelineEvent {
  id: string | number
  type: string
  description: string
  timestamp: string
  user?: string
}

const route = useRoute()
const router = useRouter()
const ticket = ref<Ticket | null>(null)
const loading = ref(true)
const updating = ref(false)
const error = ref<string | null>(null)
const showEditModal = ref(false)
const showAssignModal = ref(false)
const timeline = ref<TimelineEvent[]>([])
const newNote = ref('')
const selectedTechnician = ref('')

const isNew = computed(() => ticket.value?.status === 'new')

const technicianOptions = [
  { value: '1', label: 'Alex Johnson' },
  { value: '2', label: 'Maria Garcia' },
  { value: '3', label: 'David Smith' }
]

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'waiting', label: 'Waiting for Parts' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

const priorityOptions = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
]

const equipmentOptions = [
  { value: 'desktop', label: 'Desktop Computer' },
  { value: 'laptop', label: 'Laptop' },
  { value: 'server', label: 'Server' },
  { value: 'printer', label: 'Printer' },
  { value: 'network', label: 'Network Equipment' },
  { value: 'mobile', label: 'Mobile Device' },
  { value: 'other', label: 'Other' }
]

const fetchTicket = async () => {
  const id = route.params.id
  if (!id) {
    error.value = 'Invalid ticket ID'
    loading.value = false
    return
  }
  
  try {
    loading.value = true
    const response = await ticketsService.getTicketById(id as string)
    ticket.value = response.data
    
    // In a real application, you would fetch these from your API
    // For now, we'll use mock data
    fetchTimeline(id as string)
  } catch (err) {
    console.error('Failed to fetch ticket:', err)
    error.value = 'Failed to load ticket information'
  } finally {
    loading.value = false
  }
}

const fetchTimeline = async (ticketId: string) => {
  // Mock data - in a real application, these would come from your API
  timeline.value = [
    {
      id: 'TL1001',
      type: 'Ticket Created',
      description: 'Ticket created and assigned to queue',
      timestamp: '2025-03-05T10:23:45Z',
      user: 'System'
    },
    {
      id: 'TL1002',
      type: 'Status Change',
      description: 'Status changed from New to In Progress',
      timestamp: '2025-03-05T14:35:12Z',
      user: 'Maria Garcia'
    },
    {
      id: 'TL1003',
      type: 'Note Added',
      description: 'Called customer to discuss the issue. They will be available tomorrow for an appointment.',
      timestamp: '2025-03-05T14:40:05Z',
      user: 'Maria Garcia'
    }
  ]
}

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getStatusLabel = (status: string): string => {
  const option = statusOptions.find(opt => opt.value === status)
  return option ? option.label : status
}

const getPriorityLabel = (priority: string): string => {
  const option = priorityOptions.find(opt => opt.value === priority)
  return option ? option.label : priority
}

const getEquipmentLabel = (equipment: string): string => {
  const option = equipmentOptions.find(opt => opt.value === equipment)
  return option ? option.label : equipment
}

const goBack = () => {
  router.push('/tickets')
}

const handleEdit = () => {
  showEditModal.value = true
}

const handleTicketFormSubmit = async (ticketData: Partial<Ticket>) => {
  if (!ticket.value?.id) return
  
  try {
    updating.value = true
    await ticketsService.updateTicket(ticket.value.id, ticketData)
    
    // Update the local ticket data
    ticket.value = {
      ...ticket.value,
      ...ticketData,
      customer: ticket.value.customer // Preserve customer object
    }
    
    // Add to timeline
    timeline.value.unshift({
      id: `TL${Date.now()}`,
      type: 'Ticket Updated',
      description: 'Ticket details were updated',
      timestamp: new Date().toISOString(),
      user: 'You'
    })
    
    showEditModal.value = false
  } catch (err) {
    console.error('Failed to update ticket:', err)
  } finally {
    updating.value = false
  }
}

const updateStatus = async (newStatus: string) => {
  if (!ticket.value?.id) return
  
  try {
    updating.value = true
    await ticketsService.updateTicketStatus(ticket.value.id, newStatus)
    
    // Update the local status
    if (ticket.value) {
      const oldStatus = ticket.value.status
      ticket.value.status = newStatus
      
      // Add to timeline
      timeline.value.unshift({
        id: `TL${Date.now()}`,
        type: 'Status Change',
        description: `Status changed from ${getStatusLabel(oldStatus)} to ${getStatusLabel(newStatus)}`,
        timestamp: new Date().toISOString(),
        user: 'You'
      })
    }
  } catch (err) {
    console.error('Failed to update ticket status:', err)
  } finally {
    updating.value = false
  }
}

const viewCustomer = (customerId: string | number) => {
  router.push(`/customers/${customerId}`)
}

const addNote = async () => {
  if (!ticket.value?.id || !newNote.value.trim()) return
  
  try {
    updating.value = true
    await ticketsService.addTicketNote(ticket.value.id, newNote.value)
    
    // Add to timeline
    timeline.value.unshift({
      id: `TL${Date.now()}`,
      type: 'Note Added',
      description: newNote.value,
      timestamp: new Date().toISOString(),
      user: 'You'
    })
    
    // Clear the note input
    newNote.value = ''
  } catch (err) {
    console.error('Failed to add note:', err)
  } finally {
    updating.value = false
  }
}

const assignTechnician = async () => {
  if (!ticket.value?.id || !selectedTechnician.value) return
  
  try {
    updating.value = true
    await ticketsService.assignTicket(ticket.value.id, selectedTechnician.value)
    
    // Find the technician name
    const techOption = technicianOptions.find(t => t.value === selectedTechnician.value)
    
    // Update the local data
    if (ticket.value && techOption) {
      ticket.value.technician = {
        id: selectedTechnician.value,
        name: techOption.label
      }
      
      // Add to timeline
      timeline.value.unshift({
        id: `TL${Date.now()}`,
        type: 'Technician Assigned',
        description: `Ticket assigned to ${techOption.label}`,
        timestamp: new Date().toISOString(),
        user: 'You'
      })
    }
    
    showAssignModal.value = false
  } catch (err) {
    console.error('Failed to assign technician:', err)
  } finally {
    updating.value = false
  }
}

onMounted(() => {
  fetchTicket()
})
</script>

<style scoped>
.ticket-detail {
  padding: 1.5rem;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 5rem 0;
  gap: 1.5rem;
}

.error-message {
  color: #DC2626;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-new {
  background-color: rgb(239, 246, 255);
  color: rgb(30, 64, 175);
}

.status-in_progress {
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

.ticket-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.ticket-info {
  grid-column: span 1;
}

.ticket-secondary {
  grid-column: span 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-item h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-text-primary, #374151);
}

.info-item p {
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary, #6B7280);
}

.description-section,
.equipment-section,
.assignment-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border, #E5E7EB);
}

.description-section h3,
.equipment-section h3,
.assignment-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-text-primary, #374151);
}

.unassigned {
  color: var(--color-text-secondary, #6B7280);
  font-style: italic;
}

.assign-action {
  margin-top: 0.75rem;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 0;
  color: var(--color-text-secondary, #6B7280);
  font-style: italic;
}

.timeline-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.timeline-item {
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border, #E5E7EB);
}

.timeline-item:last-child {
  border-bottom: none;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.timeline-header h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary, #374151);
}

.timeline-date {
  font-size: 0.875rem;
  color: var(--color-text-secondary, #6B7280);
}

.timeline-description {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: var(--color-text-primary, #374151);
}

.timeline-user {
  font-size: 0.75rem;
  font-style: italic;
  color: var(--color-text-secondary, #6B7280);
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.note-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-textarea {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid var(--color-border, #D1D5DB);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  background-color: white;
  color: var(--color-text-primary, #374151);
  resize: vertical;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary, #3B82F6);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

.note-actions {
  display: flex;
  justify-content: flex-end;
}

.assign-form {
  padding: 1rem;
}

.form-field {
  margin-bottom: 1.5rem;
}

.form-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text-primary, #374151);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .ticket-content {
    grid-template-columns: 1fr;
  }
  
  .ticket-info,
  .ticket-secondary {
    grid-column: span 1;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>