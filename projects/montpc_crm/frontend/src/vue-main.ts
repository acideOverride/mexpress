// Vue app entry point
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './vue-components/App.vue';
import router from './vue-components/router';

// Import styles
import './index.css';

// Create Pinia store
const pinia = createPinia();

// Create the Vue app
const app = createApp(App);

// Use plugins
app.use(router);
app.use(pinia);

// Load global components
import LoadingSpinner from './vue-components/common/LoadingSpinner.vue';
app.component('LoadingSpinner', LoadingSpinner);

console.log('Vue app initialization starting...');

// Mount the app
const vueRoot = document.getElementById('app-vue');
if (vueRoot) {
  app.mount(vueRoot);
  console.log('Vue app mounted successfully');
} else {
  console.error('Could not find #app-vue element to mount Vue app');
}