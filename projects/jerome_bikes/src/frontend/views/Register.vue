<template>
  <div class="register-page">
    <div class="container">
      <div class="auth-container">
        <div class="auth-header">
          <h1>Create Your Account</h1>
          <p>Join Jerome Bikes to start renting bikes for your adventures.</p>
        </div>
        
        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label for="name" class="form-label">Full Name</label>
            <input 
              type="text" 
              id="name" 
              v-model="name" 
              class="form-control" 
              required
              placeholder="John Doe"
            />
          </div>
          
          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              class="form-control" 
              required
              placeholder="name@example.com"
            />
          </div>
          
          <div class="form-group">
            <label for="phone" class="form-label">Phone Number (optional)</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="phone" 
              class="form-control" 
              placeholder="+1 555 123 4567"
            />
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              class="form-control" 
              required
              placeholder="Create a strong password"
              minlength="8"
            />
            <small>Must be at least 8 characters long</small>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              class="form-control" 
              required
              placeholder="Confirm your password"
            />
          </div>
          
          <div class="form-terms">
            <input type="checkbox" id="terms" v-model="acceptTerms" required />
            <label for="terms">
              I agree to the <router-link to="/terms">Terms of Service</router-link> and 
              <router-link to="/privacy">Privacy Policy</router-link>
            </label>
          </div>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <button type="submit" class="btn btn-primary btn-full" :disabled="loading || !formValid">
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>
        
        <div class="auth-footer">
          <p>Already have an account? <router-link to="/login">Sign in</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '@/frontend/services/auth.service';

// Form data
const name = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');
const acceptTerms = ref(false);
const error = ref('');
const loading = ref(false);

// Router
const router = useRouter();

// Form validation
const formValid = computed(() => {
  return (
    name.value.trim() !== '' &&
    email.value.trim() !== '' &&
    password.value.length >= 8 &&
    password.value === confirmPassword.value &&
    acceptTerms.value
  );
});

// Register handler
const handleRegister = async () => {
  try {
    // Validate password match
    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match';
      return;
    }
    
    loading.value = true;
    error.value = '';
    
    // Register the user
    await AuthService.register({
      name: name.value,
      email: email.value,
      password: password.value,
      phone: phone.value || undefined
    });
    
    // Redirect to home page
    router.push('/');
  } catch (err: any) {
    error.value = err.message || 'Failed to create account. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-page {
  padding: 4rem 0;
  background-color: var(--background-color);
}

.auth-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.auth-form {
  margin-bottom: 1.5rem;
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #6c757d;
}

.form-terms {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.form-terms input {
  margin-top: 0.25rem;
}

.form-terms a {
  color: var(--primary-color);
}

.btn-full {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
}

.auth-footer {
  text-align: center;
  font-size: 0.9rem;
}

.auth-footer a {
  color: var(--primary-color);
  font-weight: 500;
}

@media (max-width: 768px) {
  .register-page {
    padding: 2rem 1rem;
  }
  
  .auth-container {
    padding: 1.5rem;
  }
}
</style>