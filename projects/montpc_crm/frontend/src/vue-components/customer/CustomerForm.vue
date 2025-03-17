<template>
  <div class="customer-form">
    <form @submit.prevent="handleSubmit" novalidate>
      <div class="form-grid">
        <!-- First Name Field -->
        <div class="form-field" :class="{ 'form-field-error': errors.firstName }">
          <label for="firstName">First Name *</label>
          <input
            id="firstName"
            v-model="formData.firstName"
            type="text"
            :disabled="loading"
            @blur="validateField('firstName')"
            @input="errors.firstName = ''"
            autocomplete="given-name"
          />
          <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
        </div>

        <!-- Last Name Field -->
        <div class="form-field" :class="{ 'form-field-error': errors.lastName }">
          <label for="lastName">Last Name *</label>
          <input
            id="lastName"
            v-model="formData.lastName"
            type="text"
            :disabled="loading"
            @blur="validateField('lastName')"
            @input="errors.lastName = ''"
            autocomplete="family-name"
          />
          <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
        </div>

        <!-- Email Field -->
        <div class="form-field" :class="{ 'form-field-error': errors.email }">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            :disabled="loading"
            @blur="validateField('email')"
            @input="errors.email = ''"
            autocomplete="email"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <!-- Phone Field -->
        <div class="form-field" :class="{ 'form-field-error': errors.phone }">
          <label for="phone">Phone</label>
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            :disabled="loading"
            @blur="validateField('phone')"
            @input="errors.phone = ''"
            autocomplete="tel"
          />
          <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button 
          type="button" 
          class="btn-secondary" 
          @click="handleCancel" 
          :disabled="loading"
        >
          Cancel
        </button>
        <button 
          type="reset" 
          class="btn-secondary" 
          @click="resetForm" 
          :disabled="loading"
        >
          Reset
        </button>
        <button 
          type="submit" 
          class="btn-primary" 
          :disabled="loading"
        >
          {{ loading ? 'Saving...' : 'Save Customer' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed, onMounted } from 'vue';

interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface CustomerErrors {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default defineComponent({
  name: 'CustomerForm',
  props: {
    initialData: {
      type: Object as () => Partial<CustomerFormData>,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const state = reactive({
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      } as CustomerFormData,
      errors: {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      } as CustomerErrors,
      touched: {
        firstName: false,
        lastName: false,
        email: false,
        phone: false
      }
    });

    // Initialize form with initial data if provided
    onMounted(() => {
      if (props.initialData) {
        if (props.initialData.firstName) state.formData.firstName = props.initialData.firstName;
        if (props.initialData.lastName) state.formData.lastName = props.initialData.lastName;
        if (props.initialData.email) state.formData.email = props.initialData.email;
        if (props.initialData.phone) state.formData.phone = props.initialData.phone;
      }
    });

    // Validation rules
    const validationRules = {
      firstName: (value: string) => value.trim() !== '' ? true : 'First name is required',
      lastName: (value: string) => value.trim() !== '' ? true : 'Last name is required',
      email: (value: string) => {
        if (value.trim() === '') return true; // Email is optional
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? true : 'Invalid email format';
      },
      phone: (value: string) => {
        if (value.trim() === '') return true; // Phone is optional
        const phoneRegex = /^\d{10,15}$/;
        return phoneRegex.test(value) ? true : 'Invalid phone format';
      }
    };

    // Validate a single field
    const validateField = (field: keyof CustomerFormData) => {
      state.touched[field] = true;
      const value = state.formData[field];
      const validationResult = validationRules[field](value);
      
      if (validationResult === true) {
        state.errors[field] = '';
      } else {
        state.errors[field] = validationResult as string;
      }
      
      return validationResult === true;
    };

    // Validate all fields
    const validateForm = () => {
      let isValid = true;
      
      // Reset errors before validation
      Object.keys(state.errors).forEach(key => {
        state.errors[key as keyof CustomerErrors] = '';
      });
      
      // Validate each field
      Object.keys(state.formData).forEach(key => {
        const field = key as keyof CustomerFormData;
        const fieldIsValid = validateField(field);
        isValid = isValid && fieldIsValid;
      });
      
      return isValid;
    };

    // Handle form submission
    const handleSubmit = () => {
      if (validateForm()) {
        emit('submit', { ...state.formData });
      }
    };

    // Handle cancel action
    const handleCancel = () => {
      emit('cancel');
    };

    // Reset the form
    const resetForm = () => {
      Object.keys(state.formData).forEach(key => {
        const field = key as keyof CustomerFormData;
        state.formData[field] = props.initialData?.[field] || '';
        state.errors[field] = '';
        state.touched[field] = false;
      });
    };

    return {
      ...toRefs(state),
      validateField,
      validateForm,
      handleSubmit,
      handleCancel,
      resetForm
    };
  }
});
</script>

<style scoped>
.customer-form {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field label {
  margin-bottom: 0.3rem;
  font-weight: 500;
  font-size: 0.9rem;
  color: #4b5563;
}

.form-field input {
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-field input:focus {
  border-color: #2563eb;
  outline: none;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.25);
}

.form-field-error input {
  border-color: #ef4444;
}

.form-field-error input:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.25);
}

.error-message {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

button {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 0.25rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: #f3f4f6;
  border-color: #d1d5db;
  color: #4b5563;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #e5e7eb;
}
</style>