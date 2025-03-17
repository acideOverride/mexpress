<template>
  <div class="verify-email-page">
    <div class="container">
      <div class="auth-container">
        <div class="auth-header">
          <h1>Email Verification</h1>
        </div>
        
        <div v-if="loading" class="loading-container">
          <div class="spinner"></div>
          <p>Verifying your email address...</p>
        </div>
        
        <div v-else-if="state === 'success'" class="success-container">
          <div class="success-icon">✓</div>
          <h2>Email Verified</h2>
          <p>Your email address has been successfully verified.</p>
          
          <div class="auth-footer">
            <router-link to="/login" class="btn btn-primary btn-full">Log In</router-link>
          </div>
        </div>
        
        <div v-else-if="state === 'error'" class="error-container">
          <div class="error-icon">!</div>
          <h2>Verification Failed</h2>
          <p>{{ errorMessage }}</p>
          
          <div v-if="showResend">
            <form @submit.prevent="resendVerification" class="resend-form">
              <div class="form-group">
                <label for="email" class="form-label">Your Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="email" 
                  class="form-control" 
                  required
                  placeholder="name@example.com"
                />
              </div>
              
              <button type="submit" class="btn btn-primary btn-full" :disabled="resending">
                {{ resending ? 'Sending...' : 'Resend Verification Email' }}
              </button>
            </form>
            
            <div v-if="resendSuccess" class="success-message">
              Verification email has been sent. Please check your inbox.
            </div>
            
            <div v-if="resendError" class="error-message">
              {{ resendError }}
            </div>
          </div>
          
          <div class="auth-footer">
            <router-link to="/" class="btn btn-outline btn-full">Return to Home</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AuthService from '@/frontend/services/auth.service';

// Component state
const route = useRoute();
const state = ref<'loading' | 'success' | 'error'>('loading');
const loading = ref(true);
const errorMessage = ref('');
const showResend = ref(false);
const email = ref('');
const resending = ref(false);
const resendSuccess = ref(false);
const resendError = ref('');

// Check verification token on mount
onMounted(async () => {
  // Get token from query parameter
  const token = route.query.token as string;
  
  // If no token is provided, show an error
  if (!token) {
    state.value = 'error';
    errorMessage.value = 'No verification token was provided. Please check your email for the verification link.';
    showResend.value = true;
    loading.value = false;
    return;
  }
  
  try {
    // Verify email with token
    await AuthService.verifyEmail(token);
    
    // Show success message
    state.value = 'success';
  } catch (err: any) {
    // Show error message
    state.value = 'error';
    errorMessage.value = err.message || 'Failed to verify email. The link may be invalid or expired.';
    showResend.value = true;
    
    // Pre-fill email if available
    const emailParam = route.query.email as string;
    if (emailParam) {
      email.value = emailParam;
    }
  } finally {
    loading.value = false;
  }
});

// Resend verification email
const resendVerification = async () => {
  try {
    resending.value = true;
    resendError.value = '';
    resendSuccess.value = false;
    
    await AuthService.resendVerificationEmail(email.value);
    
    resendSuccess.value = true;
  } catch (err: any) {
    resendError.value = err.message || 'Failed to resend verification email. Please try again.';
  } finally {
    resending.value = false;
  }
};
</script>

<style scoped>
.verify-email-page {
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

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-left-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success-container, .error-container {
  text-align: center;
  padding: 1rem 0;
}

.success-icon, .error-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.5rem;
}

.success-icon {
  background-color: #28a745;
  color: white;
}

.error-icon {
  background-color: #dc3545;
  color: white;
}

.success-container h2, .error-container h2 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.success-container p, .error-container p {
  margin-bottom: 1.5rem;
}

.resend-form {
  margin: 1.5rem 0;
}

.btn-full {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}

.btn-outline:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.auth-footer {
  margin-top: 1.5rem;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  margin: 1rem 0;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 0.75rem;
  margin: 1rem 0;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .verify-email-page {
    padding: 2rem 1rem;
  }
  
  .auth-container {
    padding: 1.5rem;
  }
}
</style>