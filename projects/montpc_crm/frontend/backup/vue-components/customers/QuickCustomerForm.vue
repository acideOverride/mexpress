<template>
  <div class="quick-customer-form">
    <form @submit.prevent="handleSubmit">
      <!-- Error alert -->
      <div v-if="formError" class="form-error-alert">
        <span class="error-icon">⚠️</span>
        <span>{{ formError }}</span>
        <button type="button" class="close-error" @click="formError = ''">×</button>
      </div>
      
      <!-- Name row -->
      <div class="name-row">
        <div class="form-field">
          <label for="firstName">First Name</label>
          <Input 
            id="firstName"
            v-model="form.firstName"
            placeholder="First name"
            :error="errors.firstName"
            required
          />
        </div>
        
        <div class="form-field">
          <label for="lastName">Last Name</label>
          <Input 
            id="lastName"
            v-model="form.lastName"
            placeholder="Last name"
            :error="errors.lastName"
            required
          />
        </div>
      </div>
      
      <!-- Email row -->
      <div class="form-field">
        <label for="email">Email Address</label>
        <Input 
          id="email"
          v-model="form.email"
          type="email"
          placeholder="customer@example.com"
          :error="errors.email"
          required
        />
      </div>
      
      <!-- Phone row -->
      <div class="form-field">
        <label for="phone">Phone Number</label>
        <Input 
          id="phone"
          v-model="form.phone"
          placeholder="(555) 123-4567"
          :error="errors.phone"
          required
        />
      </div>
      
      <div class="form-actions">
        <Button type="button" variant="secondary" @click="$emit('cancel')" :disabled="isLoading">Cancel</Button>
        <Button type="submit" variant="primary" :loading="isLoading">
          {{ isLoading ? 'Creating...' : 'Create Customer' }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Button, Input } from '../ui';
// Simple customer service implementation
const customersService = {
  create: async (customerData) => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });
      const data = await response.json();
      return data.data;
    } catch (err) {
      console.error('Error creating customer:', err);
      throw new Error(err.message || 'Failed to create customer');
    }
  }
};

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['created', 'cancel']);

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
});

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
});

const isLoading = ref(false);
const formError = ref('');

const validateForm = (): boolean => {
  let isValid = true;
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = '';
  });
  formError.value = '';
  
  // Validate required fields
  if (!form.firstName) {
    errors.firstName = 'First name is required';
    isValid = false;
  }
  
  if (!form.lastName) {
    errors.lastName = 'Last name is required';
    isValid = false;
  }
  
  if (!form.email) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Invalid email format';
    isValid = false;
  }
  
  if (!form.phone) {
    errors.phone = 'Phone number is required';
    isValid = false;
  } else if (!/^[\d\s\-\(\)\+]+$/.test(form.phone)) {
    errors.phone = 'Invalid phone format';
    isValid = false;
  }
  
  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }
  
  try {
    isLoading.value = true;
    
    // Prepare data for API - matching the backend schema model
    const customerData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      status: 'ACTIVE'
    };
    
    console.log('Sending customer data:', customerData);
    
    // Create customer via API
    const createdCustomer = await customersService.create(customerData);
    
    console.log('Customer created successfully:', createdCustomer);
    
    // Emit success event with created customer
    emit('created', createdCustomer);
    
    // Reset form
    Object.keys(form).forEach(key => {
      form[key as keyof typeof form] = '';
    });
    
  } catch (error) {
    console.error('Error creating customer:', error);
    formError.value = error instanceof Error ? error.message : 'Failed to create customer. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.quick-customer-form {
  width: 100%;
  padding: 0;
}

.name-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.name-row .form-field {
  flex: 1;
  min-width: 0; /* Prevents flex items from overflowing */
}

.form-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

label {
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

label::after {
  content: " *";
  color: #ef4444;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
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

/* Mobile styles */
@media (max-width: 480px) {
  .name-row {
    flex-direction: column;
    gap: 16px;
  }
  
  .form-actions {
    gap: 8px;
  }
}
</style>