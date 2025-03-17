<template>
  <div class="forgot-password-page">
    <div class="container">
      <div class="auth-container">
        <div class="auth-header">
          <h1>Reset Your Password</h1>
          <p>Enter your email address to receive password reset instructions.</p>
        </div>
        
        <div v-if="step === 'request'">
          <form @submit.prevent="requestReset" class="auth-form">
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
            
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            
            <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
              {{ loading ? 'Sending...' : 'Send Reset Link' }}
            </button>
          </form>
          
          <div class="auth-footer">
            <p>Remember your password? <router-link to="/login">Back to Login</router-link></p>
          </div>
        </div>
        
        <div v-else-if="step === 'success'" class="success-container">
          <div class="success-icon">✓</div>
          <h2>Reset Link Sent</h2>
          <p>We've sent instructions to <strong>{{ email }}</strong>. Please check your email and follow the link to reset your password.</p>
          <p class="success-note">If you don't see the email, please check your spam folder.</p>
          
          <div class="auth-footer">
            <router-link to="/login" class="btn btn-primary btn-full">Back to Login</router-link>
          </div>
        </div>
        
        <div v-else-if="step === 'reset'">
          <form @submit.prevent="completeReset" class="auth-form">
            <div class="form-group">
              <label for="password" class="form-label">New Password</label>
              <input 
                type="password" 
                id="password" 
                v-model="password" 
                class="form-control" 
                required
                minlength="8"
                placeholder="Create a new password"
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
                placeholder="Confirm your new password"
              />
            </div>
            
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            
            <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
              {{ loading ? 'Updating Password...' : 'Reset Password' }}
            </button>
          </form>
        </div>
        
        <div v-else-if="step === 'complete'" class="success-container">
          <div class="success-icon">✓</div>
          <h2>Password Reset Successful</h2>
          <p>Your password has been reset successfully.</p>
          
          <div class="auth-footer">
            <router-link to="/login" class="btn btn-primary btn-full">Login with New Password</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AuthService from '@/frontend/services/auth.service';

// Router
const router = useRouter();
const route = useRoute();

// Form state
const step = ref<'request' | 'success' | 'reset' | 'complete'>('request');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const loading = ref(false);
const resetToken = ref('');

// Check if we are in reset mode
onMounted(() => {
  // Get token from query parameter
  const token = route.query.token as string;
  if (token) {
    resetToken.value = token;
    step.value = 'reset';
    
    // Get email from query parameter if available
    const emailParam = route.query.email as string;
    if (emailParam) {
      email.value = emailParam;
    }
  }
});

// Request password reset
const requestReset = async () => {
  try {
    if (!email.value) {
      error.value = 'Please enter your email address';
      return;
    }
    
    loading.value = true;
    error.value = '';
    
    // Call API to request password reset
    await AuthService.requestPasswordReset(email.value);
    
    // Show success message
    step.value = 'success';
  } catch (err: any) {
    console.error('Error requesting password reset:', err);
    error.value = err.message || 'Failed to send reset link. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Complete password reset
const completeReset = async () => {
  try {
    // Validate password match
    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match';
      return;
    }
    
    // Validate password length
    if (password.value.length < 8) {
      error.value = 'Password must be at least 8 characters long';
      return;
    }
    
    loading.value = true;
    error.value = '';
    
    // Call API to complete password reset
    await AuthService.resetPassword(resetToken.value, password.value);
    
    // Show success message
    step.value = 'complete';
  } catch (err: any) {
    console.error('Error resetting password:', err);
    error.value = err.message || 'Failed to reset password. The link may be invalid or expired.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.forgot-password-page {
  padding: 4rem 0;
  background-color: var(--background-color);
}

.auth-container {
  max-width: 450px;
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
  margin-top: 1.5rem;
}

.auth-footer a {
  color: var(--primary-color);
  font-weight: 500;
}

.success-container {
  text-align: center;
  padding: 1rem 0;
}

.success-icon {
  background-color: #28a745;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.5rem;
}

.success-container h2 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.success-container p {
  margin-bottom: 1rem;
}

.success-note {
  font-size: 0.85rem;
  color: #6c757d;
}

@media (max-width: 768px) {
  .forgot-password-page {
    padding: 2rem 1rem;
  }
  
  .auth-container {
    padding: 1.5rem;
  }
}
</style>