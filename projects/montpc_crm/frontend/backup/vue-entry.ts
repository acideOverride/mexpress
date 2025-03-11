// MontPC CRM Vue.js entry point
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './vue-components/App.vue';
import router from './vue-components/router';

// Enable Vue debug mode in development
const isDevMode = true;
if (isDevMode) {
  console.log('Vue.js debug mode enabled');
  // Print initial route
  console.log('Initial route:', window.location.pathname);
}

// Create Pinia store
const pinia = createPinia();

// Create and configure Vue app
const app = createApp(App);

// Use plugins
app.use(router);
app.use(pinia);

// Add global error handling
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err);
  console.error('Component:', vm);
  console.error('Error Info:', info);
};

// Handle router errors
router.onError((error) => {
  console.error('Router error:', error);
});

// Log route changes in development
if (isDevMode) {
  router.beforeEach((to, from, next) => {
    console.log(`Route navigation: ${from.path} -> ${to.path}`);
    next();
  });
}

// Mount the Vue app immediately
const vueRoot = document.getElementById('app-vue');
if (vueRoot) {
  // Mount the Vue app
  app.mount(vueRoot);
  console.log('Vue app mounted successfully');
} else {
  console.error('Could not find #app-vue element to mount Vue app');
}