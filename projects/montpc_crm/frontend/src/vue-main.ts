// Vue app entry point
import VueApp from './vue-components/index';

// Import styles
import './index.css';

// Mount the Vue app
const vueRoot = document.getElementById('app-vue') || 
  document.body.appendChild(document.createElement('div'));
vueRoot.id = 'app-vue';

// Initialize Vue app
VueApp.mount(vueRoot);