<template>
  <div class="main-layout">
    <header class="header">
      <div class="container header-container">
        <div class="logo">
          <router-link to="/">
            <img src="@/frontend/assets/logo.svg" alt="Jerome Bikes" />
            <span>Jerome Bikes</span>
          </router-link>
        </div>
        
        <nav class="main-nav">
          <ul class="nav-list">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/bikes">Bikes</router-link></li>
            <li><router-link to="/pricing">Pricing</router-link></li>
            <li><router-link to="/about">About</router-link></li>
          </ul>
        </nav>
        
        <div class="auth-buttons">
          <template v-if="isAuthenticated">
            <router-link to="/profile" class="btn btn-outline">My Profile</router-link>
            <button @click="logout" class="btn btn-primary">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-outline">Login</router-link>
            <router-link to="/register" class="btn btn-primary">Register</router-link>
          </template>
        </div>
      </div>
    </header>
    
    <main class="main-content">
      <slot></slot>
    </main>
    
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-logo">
            <img src="@/frontend/assets/logo.svg" alt="Jerome Bikes" width="40" />
            <span>Jerome Bikes</span>
          </div>
          <div class="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><router-link to="/">Home</router-link></li>
              <li><router-link to="/bikes">Bikes</router-link></li>
              <li><router-link to="/pricing">Pricing</router-link></li>
              <li><router-link to="/about">About</router-link></li>
            </ul>
          </div>
          <div class="footer-links">
            <h4>Company</h4>
            <ul>
              <li><router-link to="/terms">Terms</router-link></li>
              <li><router-link to="/privacy">Privacy</router-link></li>
              <li><router-link to="/faq">FAQ</router-link></li>
              <li><router-link to="/contact">Contact</router-link></li>
            </ul>
          </div>
          <div class="footer-newsletter">
            <h4>Stay Updated</h4>
            <p>Subscribe to our newsletter for updates and special offers</p>
            <div class="newsletter-form">
              <input type="email" placeholder="Your email" />
              <button class="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} Jerome Bikes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AuthService from '@/frontend/services/auth.service';

// Check authentication status
const isAuthenticated = ref(AuthService.isAuthenticated());

// Get current year for copyright
const currentYear = computed(() => new Date().getFullYear());

// Logout handler
const logout = () => {
  AuthService.logout();
};
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
}

.logo a {
  display: flex;
  align-items: center;
  color: var(--primary-color);
  text-decoration: none;
}

.logo img {
  width: 35px;
  margin-right: 0.5rem;
}

.main-nav {
  flex: 1;
  margin-left: 2rem;
}

.nav-list {
  display: flex;
  list-style: none;
  gap: 1.5rem;
}

.nav-list a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
}

.nav-list a:hover,
.nav-list a.router-link-active {
  color: var(--primary-color);
}

.auth-buttons {
  display: flex;
  gap: 1rem;
}

.main-content {
  flex: 1;
}

.footer {
  background-color: #f8f9fa;
  padding: 3rem 0 1.5rem;
  margin-top: 3rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--primary-color);
}

.footer-logo img {
  margin-right: 0.5rem;
}

.footer-links h4 {
  margin-bottom: 1rem;
  font-weight: 600;
}

.footer-links ul {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: var(--primary-color);
}

.footer-newsletter {
  max-width: 300px;
}

.footer-newsletter h4 {
  margin-bottom: 1rem;
  font-weight: 600;
}

.footer-newsletter p {
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.newsletter-form {
  display: flex;
}

.newsletter-form input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius) 0 0 var(--border-radius);
  outline: none;
}

.newsletter-form button {
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
}

.footer-bottom {
  border-top: 1px solid var(--light-gray);
  padding-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
  }
  
  .main-nav {
    margin: 1rem 0;
    width: 100%;
  }
  
  .nav-list {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .auth-buttons {
    width: 100%;
    justify-content: space-between;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 2rem;
  }
  
  .footer-newsletter {
    max-width: 100%;
  }
}
</style>