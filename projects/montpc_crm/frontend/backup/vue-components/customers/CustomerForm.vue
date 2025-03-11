<template>
  <div class="customer-form">
    <form @submit.prevent="handleSubmit">
      <!-- Error alert -->
      <div v-if="formError" class="form-error-alert">
        <span class="error-icon">⚠️</span>
        <span>{{ formError }}</span>
        <button type="button" class="close-error" @click="formError = ''">×</button>
      </div>
      
      <div class="form-grid">
        <div class="form-field">
          <label for="name">Name</label>
          <Input 
            id="name"
            v-model="form.name"
            placeholder="Customer name"
            :error="errors.name"
            required
          />
        </div>
        
        <div class="form-field">
          <label for="email">Email</label>
          <Input 
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Email address"
            :error="errors.email"
            required
          />
        </div>
        
        <div class="form-field">
          <label for="phone">Phone</label>
          <Input 
            id="phone"
            v-model="form.phone"
            placeholder="Phone number"
            :error="errors.phone"
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
        
        <div class="form-field full-width">
          <label for="address">Address</label>
          <Input 
            id="address"
            v-model="form.address"
            placeholder="Customer address"
            :error="errors.address"
          />
        </div>
        
        <div class="form-field full-width">
          <label for="notes">Notes</label>
          <textarea
            id="notes"
            v-model="form.notes"
            placeholder="Additional notes"
            rows="3"
            class="form-textarea"
          ></textarea>
        </div>
      </div>
      
      <div class="form-actions">
        <Button type="button" variant="secondary" @click="handleCancel">Cancel</Button>
        <Button type="submit" variant="primary" :loading="loading">Save Customer</Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Button } from '@/vue-components/ui'
import { Customer } from '@/api/types/customer'

// Temporary components until we implement proper UI components
const Input = Button
const Select = Button

const props = defineProps<{
  initialData?: Partial<Customer>
  loading?: boolean
  apiError?: string
}>()

const emit = defineEmits<{
  (e: 'submit', data: Partial<Customer>): void
  (e: 'cancel'): void
  (e: 'error-clear'): void
}>()

const formError = ref(props.apiError || '')

const form = reactive<Partial<Customer>>({
  name: props.initialData?.name || '',
  email: props.initialData?.email || '',
  phone: props.initialData?.phone || '',
  address: props.initialData?.address || '',
  status: props.initialData?.status || 'active',
  notes: props.initialData?.notes || ''
})

const errors = reactive({
  name: '',
  email: '',
  phone: '',
  status: '',
  address: '',
  notes: ''
})

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' }
]

const validateForm = (): boolean => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  formError.value = ''
  
  // Validate required fields
  if (!form.name) {
    errors.name = 'Name is required'
    isValid = false
  }
  
  if (!form.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Invalid email format'
    isValid = false
  }
  
  if (!form.status) {
    errors.status = 'Status is required'
    isValid = false
  }
  
  // Validate phone if provided
  if (form.phone && !/^[\d\s\-\(\)\+]+$/.test(form.phone)) {
    errors.phone = 'Invalid phone format'
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
  // Clear any errors when canceling
  formError.value = ''
  emit('cancel')
}
</script>

<style scoped>
.customer-form {
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.form-error-alert {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  color: #b91c1c;
  font-size: 0.875rem;
}

.error-icon {
  margin-right: 0.5rem;
}

.close-error {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 1.25rem;
  line-height: 1;
  padding: 0;
  cursor: pointer;
  color: #b91c1c;
}
</style>