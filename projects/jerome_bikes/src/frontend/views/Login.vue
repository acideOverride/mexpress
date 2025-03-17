<template>
  <div class="login-page">
    <div class="container">
      <div class="auth-container">
        <div class="auth-header">
          <h1>Login to Your Account</h1>
          <p>Welcome back! Please login to access your account.</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="auth-form">
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
            <label for="password" class="form-label">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              class="form-control" 
              required
              placeholder="Enter your password"
            />
          </div>
          
          <div class="form-extras">
            <div class="remember-me">
              <input type="checkbox" id="remember" v-model="rememberMe" />
              <label for="remember">Remember me</label>
            </div>
            <router-link to="/forgot-password" class="forgot-password">
              Forgot password?
            </router-link>
          </div>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
        
        <div class="auth-footer">
          <p>Don't have an account? <router-link to="/register">Sign up</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AuthService from '@/frontend/services/auth.service';

// Form data
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const error = ref('');
const loading = ref(false);

// Router
const router = useRouter();
const route = useRoute();

// Login handler
const handleLogin = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    await AuthService.login({ 
      email: email.value, 
      password: password.value,
      rememberMe: rememberMe.value 
    });
    
    // Redirect to intended destination or home page
    const redirectPath = route.query.redirect?.toString() || '/';
    router.push(redirectPath);
  } catch (err: any) {
    error.value = err.message || 'Failed to login. Please check your credentials.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
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

.form-extras {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.forgot-password {
  color: var(--primary-color);
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
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
  .login-page {
    padding: 2rem 1rem;
  }
  
  .auth-container {
    padding: 1.5rem;
  }
}
</style>