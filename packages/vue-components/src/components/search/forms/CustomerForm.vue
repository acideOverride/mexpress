<template>
  <form class="mx-customer-form" @submit.prevent="handleSubmit">
    <div class="mx-customer-form__fields">
      <!-- Name Field -->
      <div class="mx-customer-form__field">
        <label for="name" class="mx-customer-form__label">Name *</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          class="mx-customer-form__input"
          :class="{ 'mx-customer-form__input--error': errors.name }"
          placeholder="Customer name"
          required
        />
        <div v-if="errors.name" class="mx-customer-form__error">
          {{ errors.name }}
        </div>
      </div>
      
      <!-- Email Field -->
      <div class="mx-customer-form__field">
        <label for="email" class="mx-customer-form__label">Email *</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="mx-customer-form__input"
          :class="{ 'mx-customer-form__input--error': errors.email }"
          placeholder="customer@example.com"
          required
        />
        <div v-if="errors.email" class="mx-customer-form__error">
          {{ errors.email }}
        </div>
      </div>
      
      <!-- Phone Field -->
      <div class="mx-customer-form__field">
        <label for="phone" class="mx-customer-form__label">Phone</label>
        <input
          id="phone"
          v-model="formData.phone"
          type="tel"
          class="mx-customer-form__input"
          :class="{ 'mx-customer-form__input--error': errors.phone }"
          placeholder="(123) 456-7890"
        />
        <div v-if="errors.phone" class="mx-customer-form__error">
          {{ errors.phone }}
        </div>
      </div>
      
      <!-- Address Fields -->
      <div class="mx-customer-form__field-group">
        <h3 class="mx-customer-form__subheading">Address</h3>
        
        <!-- Street -->
        <div class="mx-customer-form__field">
          <label for="street" class="mx-customer-form__label">Street *</label>
          <input
            id="street"
            v-model="formData.address.street"
            type="text"
            class="mx-customer-form__input"
            :class="{ 'mx-customer-form__input--error': errors['address.street'] }"
            placeholder="123 Main St"
            required
          />
          <div v-if="errors['address.street']" class="mx-customer-form__error">
            {{ errors['address.street'] }}
          </div>
        </div>
        
        <!-- City & State (Row) -->
        <div class="mx-customer-form__row">
          <div class="mx-customer-form__field mx-customer-form__field--half">
            <label for="city" class="mx-customer-form__label">City *</label>
            <input
              id="city"
              v-model="formData.address.city"
              type="text"
              class="mx-customer-form__input"
              :class="{ 'mx-customer-form__input--error': errors['address.city'] }"
              placeholder="New York"
              required
            />
            <div v-if="errors['address.city']" class="mx-customer-form__error">
              {{ errors['address.city'] }}
            </div>
          </div>
          
          <div class="mx-customer-form__field mx-customer-form__field--half">
            <label for="state" class="mx-customer-form__label">State *</label>
            <input
              id="state"
              v-model="formData.address.state"
              type="text"
              class="mx-customer-form__input"
              :class="{ 'mx-customer-form__input--error': errors['address.state'] }"
              placeholder="NY"
              maxlength="2"
              required
            />
            <div v-if="errors['address.state']" class="mx-customer-form__error">
              {{ errors['address.state'] }}
            </div>
          </div>
        </div>
        
        <!-- ZIP -->
        <div class="mx-customer-form__field">
          <label for="zip" class="mx-customer-form__label">ZIP Code *</label>
          <input
            id="zip"
            v-model="formData.address.zip"
            type="text"
            class="mx-customer-form__input"
            :class="{ 'mx-customer-form__input--error': errors['address.zip'] }"
            placeholder="10001"
            required
          />
          <div v-if="errors['address.zip']" class="mx-customer-form__error">
            {{ errors['address.zip'] }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Form Actions -->
    <div class="mx-customer-form__actions">
      <button
        type="button"
        class="mx-customer-form__btn mx-customer-form__btn--secondary"
        @click="$emit('cancel')"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="mx-customer-form__btn mx-customer-form__btn--primary"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Creating...' : 'Create Customer' }}
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, PropType } from 'vue';
import { CreateNewSuggestion } from '../../../composables/useMegaSearch';

export default defineComponent({
  name: 'CustomerForm',
  props: {
    suggestion: {
      type: Object as PropType<CreateNewSuggestion>,
      required: true
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    // Form state
    const isSubmitting = ref(false);
    
    // Form data, initialized with suggestion values
    const formData = reactive({
      name: props.suggestion.prefilledData.name || '',
      email: props.suggestion.prefilledData.email || '',
      phone: props.suggestion.prefilledData.phone || '',
      address: {
        street: props.suggestion.prefilledData.street || '',
        city: props.suggestion.prefilledData.city || '',
        state: props.suggestion.prefilledData.state || '',
        zip: props.suggestion.prefilledData.zip || ''
      }
    });
    
    // Form errors
    const errors: Record<string, string> = reactive({});
    
    // Validate form
    const validate = (): boolean => {
      // Clear previous errors
      Object.keys(errors).forEach(key => delete errors[key]);
      
      let isValid = true;
      
      // Name validation
      if (!formData.name.trim()) {
        errors.name = 'Name is required';
        isValid = false;
      }
      
      // Email validation
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
        isValid = false;
      } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[\w-]{2,}$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
      }
      
      // Phone validation (optional)
      if (formData.phone && !/^\+?[0-9\s\-()]{7,}$/.test(formData.phone)) {
        errors.phone = 'Please enter a valid phone number';
        isValid = false;
      }
      
      // Address validation
      if (!formData.address.street.trim()) {
        errors['address.street'] = 'Street is required';
        isValid = false;
      }
      
      if (!formData.address.city.trim()) {
        errors['address.city'] = 'City is required';
        isValid = false;
      }
      
      if (!formData.address.state.trim()) {
        errors['address.state'] = 'State is required';
        isValid = false;
      } else if (!/^[A-Za-z]{2}$/.test(formData.address.state)) {
        errors['address.state'] = 'State must be a 2-letter code';
        isValid = false;
      }
      
      if (!formData.address.zip.trim()) {
        errors['address.zip'] = 'ZIP code is required';
        isValid = false;
      } else if (!/^\d{5}(-\d{4})?$/.test(formData.address.zip)) {
        errors['address.zip'] = 'Please enter a valid ZIP code';
        isValid = false;
      }
      
      return isValid;
    };
    
    // Handle form submission
    const handleSubmit = async () => {
      if (!validate()) {
        return;
      }
      
      isSubmitting.value = true;
      
      try {
        // In a real app, you would submit to the API here
        // For now, we'll just emit the form data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulated API call
        
        emit('submit', {
          ...formData,
          // Convert address to expected format
          address: {
            street: formData.address.street,
            city: formData.address.city,
            state: formData.address.state.toUpperCase(),
            zip: formData.address.zip
          }
        });
      } catch (error) {
        console.error('Error creating customer:', error);
      } finally {
        isSubmitting.value = false;
      }
    };
    
    return {
      formData,
      errors,
      isSubmitting,
      handleSubmit
    };
  }
});
</script>

<style>
.mx-customer-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.mx-customer-form__fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mx-customer-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mx-customer-form__field-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
}

.mx-customer-form__subheading {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #333;
}

.mx-customer-form__row {
  display: flex;
  gap: 12px;
}

.mx-customer-form__field--half {
  flex: 1;
}

.mx-customer-form__label {
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.mx-customer-form__input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.mx-customer-form__input:focus {
  border-color: #4a90e2;
  outline: none;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);
}

.mx-customer-form__input--error {
  border-color: #e53935;
}

.mx-customer-form__input--error:focus {
  border-color: #e53935;
  box-shadow: 0 0 0 2px rgba(229, 57, 53, 0.1);
}

.mx-customer-form__error {
  font-size: 12px;
  color: #e53935;
  margin-top: 2px;
}

.mx-customer-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.mx-customer-form__btn {
  padding: 10px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
}

.mx-customer-form__btn--primary {
  background-color: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

.mx-customer-form__btn--primary:hover:not(:disabled) {
  background-color: #3a80d2;
}

.mx-customer-form__btn--primary:disabled {
  background-color: #a0c4f1;
  border-color: #a0c4f1;
  cursor: not-allowed;
}

.mx-customer-form__btn--secondary {
  background-color: white;
  color: #666;
  border-color: #ddd;
}

.mx-customer-form__btn--secondary:hover {
  background-color: #f5f5f5;
}
</style>