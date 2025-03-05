<template>
  <form class="mx-user-form" @submit.prevent="handleSubmit">
    <div class="mx-user-form__fields">
      <!-- Name Fields (Row) -->
      <div class="mx-user-form__row">
        <div class="mx-user-form__field mx-user-form__field--half">
          <label for="firstName" class="mx-user-form__label">First Name *</label>
          <input
            id="firstName"
            v-model="formData.firstName"
            type="text"
            class="mx-user-form__input"
            :class="{ 'mx-user-form__input--error': errors.firstName }"
            placeholder="First name"
            required
          />
          <div v-if="errors.firstName" class="mx-user-form__error">
            {{ errors.firstName }}
          </div>
        </div>
        
        <div class="mx-user-form__field mx-user-form__field--half">
          <label for="lastName" class="mx-user-form__label">Last Name *</label>
          <input
            id="lastName"
            v-model="formData.lastName"
            type="text"
            class="mx-user-form__input"
            :class="{ 'mx-user-form__input--error': errors.lastName }"
            placeholder="Last name"
            required
          />
          <div v-if="errors.lastName" class="mx-user-form__error">
            {{ errors.lastName }}
          </div>
        </div>
      </div>
      
      <!-- Email Field -->
      <div class="mx-user-form__field">
        <label for="email" class="mx-user-form__label">Email *</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="mx-user-form__input"
          :class="{ 'mx-user-form__input--error': errors.email }"
          placeholder="user@example.com"
          required
        />
        <div v-if="errors.email" class="mx-user-form__error">
          {{ errors.email }}
        </div>
      </div>
      
      <!-- Password Fields -->
      <div class="mx-user-form__field">
        <label for="password" class="mx-user-form__label">Password *</label>
        <div class="mx-user-form__password-wrapper">
          <input
            id="password"
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            class="mx-user-form__input"
            :class="{ 'mx-user-form__input--error': errors.password }"
            placeholder="Enter password"
            required
          />
          <button
            type="button"
            class="mx-user-form__password-toggle"
            @click="showPassword = !showPassword"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
          >
            <svg
              v-if="showPassword"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
        <div v-if="errors.password" class="mx-user-form__error">
          {{ errors.password }}
        </div>
        <div class="mx-user-form__password-strength" v-if="formData.password">
          <div class="mx-user-form__strength-label">Password strength:</div>
          <div class="mx-user-form__strength-meter">
            <div
              class="mx-user-form__strength-bar"
              :style="{ width: passwordStrength.percent + '%' }"
              :class="passwordStrength.class"
            ></div>
          </div>
          <div 
            class="mx-user-form__strength-text"
            :class="'mx-user-form__strength-text--' + passwordStrength.level"
          >
            {{ passwordStrength.label }}
          </div>
        </div>
      </div>
      
      <!-- Role & Active Status Row -->
      <div class="mx-user-form__row">
        <div class="mx-user-form__field mx-user-form__field--half">
          <label for="role" class="mx-user-form__label">Role *</label>
          <select
            id="role"
            v-model="formData.role"
            class="mx-user-form__input"
            :class="{ 'mx-user-form__input--error': errors.role }"
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <div v-if="errors.role" class="mx-user-form__error">
            {{ errors.role }}
          </div>
        </div>
        
        <div class="mx-user-form__field mx-user-form__field--half">
          <label class="mx-user-form__label mx-user-form__label--checkbox">
            <input
              type="checkbox"
              v-model="formData.isActive"
              class="mx-user-form__checkbox"
            />
            <span class="mx-user-form__checkbox-text">Active account</span>
          </label>
        </div>
      </div>
    </div>
    
    <!-- Form Actions -->
    <div class="mx-user-form__actions">
      <button
        type="button"
        class="mx-user-form__btn mx-user-form__btn--secondary"
        @click="$emit('cancel')"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="mx-user-form__btn mx-user-form__btn--primary"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Creating...' : 'Create User' }}
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, PropType } from 'vue';
import { CreateNewSuggestion } from '../../../composables/useMegaSearch';

export default defineComponent({
  name: 'UserForm',
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
    const showPassword = ref(false);
    
    // Form data, initialized with suggestion values
    const formData = reactive({
      firstName: props.suggestion.prefilledData.firstName || '',
      lastName: props.suggestion.prefilledData.lastName || '',
      email: props.suggestion.prefilledData.email || '',
      password: '',
      role: props.suggestion.prefilledData.role || 'user',
      isActive: true
    });
    
    // Form errors
    const errors: Record<string, string> = reactive({});
    
    // Calculate password strength
    const passwordStrength = computed(() => {
      const password = formData.password;
      
      if (!password) {
        return {
          level: 'empty',
          label: 'Empty',
          percent: 0,
          class: 'mx-user-form__strength-bar--empty'
        };
      }
      
      // Criteria for strength
      const hasLowercase = /[a-z]/.test(password);
      const hasUppercase = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[^a-zA-Z0-9]/.test(password);
      const length = password.length;
      
      // Calculate score (0-4)
      let score = 0;
      if (length >= 8) score++;
      if (hasLowercase && hasUppercase) score++;
      if (hasNumber) score++;
      if (hasSpecial) score++;
      
      // Map score to strength level
      const strengthMap = [
        { level: 'weak', label: 'Weak', percent: 25, class: 'mx-user-form__strength-bar--weak' },
        { level: 'fair', label: 'Fair', percent: 50, class: 'mx-user-form__strength-bar--fair' },
        { level: 'good', label: 'Good', percent: 75, class: 'mx-user-form__strength-bar--good' },
        { level: 'strong', label: 'Strong', percent: 100, class: 'mx-user-form__strength-bar--strong' }
      ];
      
      return strengthMap[score] || strengthMap[0];
    });
    
    // Validate form
    const validate = (): boolean => {
      // Clear previous errors
      Object.keys(errors).forEach(key => delete errors[key]);
      
      let isValid = true;
      
      // First name validation
      if (!formData.firstName.trim()) {
        errors.firstName = 'First name is required';
        isValid = false;
      }
      
      // Last name validation
      if (!formData.lastName.trim()) {
        errors.lastName = 'Last name is required';
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
      
      // Password validation
      if (!formData.password) {
        errors.password = 'Password is required';
        isValid = false;
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
        isValid = false;
      }
      
      // Role validation
      if (!formData.role) {
        errors.role = 'Role is required';
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
        
        emit('submit', formData);
      } catch (error) {
        console.error('Error creating user:', error);
      } finally {
        isSubmitting.value = false;
      }
    };
    
    return {
      formData,
      errors,
      isSubmitting,
      showPassword,
      passwordStrength,
      handleSubmit
    };
  }
});
</script>

<style>
.mx-user-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.mx-user-form__fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mx-user-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mx-user-form__row {
  display: flex;
  gap: 12px;
}

.mx-user-form__field--half {
  flex: 1;
}

.mx-user-form__label {
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.mx-user-form__label--checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding-top: 10px;
}

.mx-user-form__checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.mx-user-form__checkbox-text {
  font-weight: normal;
}

.mx-user-form__input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
  width: 100%;
}

.mx-user-form__input:focus {
  border-color: #4a90e2;
  outline: none;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);
}

.mx-user-form__input--error {
  border-color: #e53935;
}

.mx-user-form__input--error:focus {
  border-color: #e53935;
  box-shadow: 0 0 0 2px rgba(229, 57, 53, 0.1);
}

.mx-user-form__password-wrapper {
  position: relative;
}

.mx-user-form__password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mx-user-form__error {
  font-size: 12px;
  color: #e53935;
  margin-top: 2px;
}

.mx-user-form__password-strength {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mx-user-form__strength-label {
  font-size: 12px;
  color: #666;
}

.mx-user-form__strength-meter {
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
}

.mx-user-form__strength-bar {
  height: 100%;
  transition: width 0.3s, background-color 0.3s;
}

.mx-user-form__strength-bar--empty {
  width: 0;
}

.mx-user-form__strength-bar--weak {
  background-color: #f44336;
}

.mx-user-form__strength-bar--fair {
  background-color: #ff9800;
}

.mx-user-form__strength-bar--good {
  background-color: #4caf50;
}

.mx-user-form__strength-bar--strong {
  background-color: #2e7d32;
}

.mx-user-form__strength-text {
  font-size: 12px;
  font-weight: 500;
}

.mx-user-form__strength-text--weak {
  color: #f44336;
}

.mx-user-form__strength-text--fair {
  color: #ff9800;
}

.mx-user-form__strength-text--good {
  color: #4caf50;
}

.mx-user-form__strength-text--strong {
  color: #2e7d32;
}

.mx-user-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.mx-user-form__btn {
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

.mx-user-form__btn--primary {
  background-color: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

.mx-user-form__btn--primary:hover:not(:disabled) {
  background-color: #3a80d2;
}

.mx-user-form__btn--primary:disabled {
  background-color: #a0c4f1;
  border-color: #a0c4f1;
  cursor: not-allowed;
}

.mx-user-form__btn--secondary {
  background-color: white;
  color: #666;
  border-color: #ddd;
}

.mx-user-form__btn--secondary:hover {
  background-color: #f5f5f5;
}
</style>