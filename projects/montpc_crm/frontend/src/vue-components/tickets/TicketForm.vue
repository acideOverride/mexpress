<template>
  <div class="ticket-form">
    <form @submit.prevent="handleSubmit">
      <div class="form-grid">
        <div class="form-field full-width">
          <label for="title">Title</label>
          <Input 
            id="title"
            v-model="form.title"
            placeholder="Ticket title"
            :error="errors.title"
            required
          />
        </div>
        
        <div class="form-field">
          <label for="customer">Customer</label>
          <Select 
            id="customer"
            v-model="form.customerId"
            :options="customerOptions"
            :error="errors.customerId"
            required
            :disabled="!!initialCustomerId"
          />
        </div>
        
        <div class="form-field">
          <label for="priority">Priority</label>
          <Select 
            id="priority"
            v-model="form.priority"
            :options="priorityOptions"
            :error="errors.priority"
            required
          />
        </div>
        
        <div class="form-field">
          <label for="status">Status</label>
          <Select 
            id="status"
            v-model="form.status"
            :options="statusOptions"
            :error="errors.status"
            required
          />
        </div>
        
        <div class="form-field">
          <label for="technician">Technician</label>
          <Select 
            id="technician"
            v-model="form.technicianId"
            :options="technicianOptions"
            :error="errors.technicianId"
          />
        </div>
        
        <div class="form-field full-width">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="form.description"
            placeholder="Describe the issue or service needed"
            rows="4"
            class="form-textarea"
            :class="{ 'error': errors.description }"
          ></textarea>
          <div v-if="errors.description" class="error-message">
            {{ errors.description }}
          </div>
        </div>
        
        <div class="form-field">
          <label for="equipment">Equipment Type</label>
          <Select 
            id="equipment"
            v-model="form.equipmentType"
            :options="equipmentOptions"
            :error="errors.equipmentType"
          />
        </div>
        
        <div class="form-field">
          <label for="model">Model/Serial Number</label>
          <Input 
            id="model"
            v-model="form.modelNumber"
            placeholder="Model or serial number"
            :error="errors.modelNumber"
          />
        </div>
        
        <div class="form-field">
          <label for="estimated-time">Estimated Time (hours)</label>
          <Input 
            id="estimated-time"
            v-model="form.estimatedHours"
            type="number"
            min="0.5"
            step="0.5"
            placeholder="Estimated hours"
            :error="errors.estimatedHours"
          />
        </div>
        
        <div class="form-field">
          <label for="estimated-cost">Estimated Cost ($)</label>
          <Input 
            id="estimated-cost"
            v-model="form.estimatedCost"
            type="number"
            min="0"
            step="10"
            placeholder="Estimated cost"
            :error="errors.estimatedCost"
          />
        </div>
      </div>
      
      <div class="form-actions">
        <Button type="button" variant="secondary" @click="handleCancel">Cancel</Button>
        <Button type="submit" variant="primary" :loading="loading">Save Ticket</Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/vue-components/ui'
import { customersService } from '@/api/services/customers.service'

// Temporary components until we implement proper UI components
const Input = Button
const Select = Button

interface TicketFormData {
  title: string
  description: string
  customerId: string
  status: string
  priority: string
  technicianId: string
  equipmentType: string
  modelNumber: string
  estimatedHours: string
  estimatedCost: string
}

const props = defineProps<{
  initialData?: Partial<TicketFormData>
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', data: Partial<TicketFormData>): void
  (e: 'cancel'): void
}>()

const route = useRoute()
const initialCustomerId = computed(() => route.query.customerId as string || props.initialData?.customerId || '')

const form = reactive<TicketFormData>({
  title: props.initialData?.title || '',
  description: props.initialData?.description || '',
  customerId: initialCustomerId.value,
  status: props.initialData?.status || 'new',
  priority: props.initialData?.priority || 'medium',
  technicianId: props.initialData?.technicianId || '',
  equipmentType: props.initialData?.equipmentType || '',
  modelNumber: props.initialData?.modelNumber || '',
  estimatedHours: props.initialData?.estimatedHours || '',
  estimatedCost: props.initialData?.estimatedCost || ''
})

const errors = reactive({
  title: '',
  description: '',
  customerId: '',
  status: '',
  priority: '',
  technicianId: '',
  equipmentType: '',
  modelNumber: '',
  estimatedHours: '',
  estimatedCost: ''
})

const customerOptions = ref<{ value: string, label: string }[]>([])
const loadingCustomers = ref(false)

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

const technicianOptions = [
  { value: '', label: 'Unassigned' },
  { value: '1', label: 'Alex Johnson' },
  { value: '2', label: 'Maria Garcia' },
  { value: '3', label: 'David Smith' }
]

const equipmentOptions = [
  { value: '', label: 'Select Equipment Type' },
  { value: 'desktop', label: 'Desktop Computer' },
  { value: 'laptop', label: 'Laptop' },
  { value: 'server', label: 'Server' },
  { value: 'printer', label: 'Printer' },
  { value: 'network', label: 'Network Equipment' },
  { value: 'mobile', label: 'Mobile Device' },
  { value: 'other', label: 'Other' }
]

const fetchCustomers = async () => {
  if (initialCustomerId.value) return // Skip if we already have a customer ID
  
  try {
    loadingCustomers.value = true
    const response = await customersService.getCustomers()
    
    // Transform customers into options format
    customerOptions.value = response.data.map(customer => ({
      value: customer.id.toString(),
      label: customer.name
    }))
    
    // Prepend empty option
    customerOptions.value.unshift({ value: '', label: 'Select Customer' })
  } catch (error) {
    console.error('Failed to fetch customers:', error)
  } finally {
    loadingCustomers.value = false
  }
}

const validateForm = (): boolean => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  // Validate required fields
  if (!form.title) {
    errors.title = 'Title is required'
    isValid = false
  }
  
  if (!form.customerId) {
    errors.customerId = 'Customer is required'
    isValid = false
  }
  
  if (!form.status) {
    errors.status = 'Status is required'
    isValid = false
  }
  
  if (!form.priority) {
    errors.priority = 'Priority is required'
    isValid = false
  }
  
  if (!form.description) {
    errors.description = 'Description is required'
    isValid = false
  }
  
  // Validate numeric fields if provided
  if (form.estimatedHours && isNaN(Number(form.estimatedHours))) {
    errors.estimatedHours = 'Must be a valid number'
    isValid = false
  }
  
  if (form.estimatedCost && isNaN(Number(form.estimatedCost))) {
    errors.estimatedCost = 'Must be a valid number'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', form)
  }
}

const handleCancel = () => {
  emit('cancel')
}

onMounted(() => {
  fetchCustomers()
  
  // If initialCustomerId exists, make sure we have a corresponding option
  if (initialCustomerId.value && customerOptions.value.length === 0) {
    // Add a placeholder until we fetch the actual name
    customersService.getCustomerById(initialCustomerId.value)
      .then(response => {
        customerOptions.value = [
          { value: response.data.id.toString(), label: response.data.name }
        ]
      })
      .catch(error => {
        console.error('Failed to fetch customer details:', error)
      })
  }
})
</script>

<style scoped>
.ticket-form {
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: span 2;
}

label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text-primary, #374151);
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

.form-textarea.error {
  border-color: var(--color-error, #DC2626);
}

.error-message {
  color: var(--color-error, #DC2626);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .full-width {
    grid-column: span 1;
  }
}
</style>