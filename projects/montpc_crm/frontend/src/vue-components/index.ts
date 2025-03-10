import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Import shared components
import LoadingSpinner from './common/LoadingSpinner.vue';
import NotFound from './common/NotFound.vue';

// Layout components
import AppLayout from './layout/AppLayout.vue';

// Auth components
import Login from './auth/Login.vue';

// Dashboard components
import Dashboard from './dashboard/Dashboard.vue';

// Import feature components
import { CustomerList, CustomerDetail, CustomerForm } from './customers';
import { TicketList, TicketDetail, TicketForm } from './tickets';

// Create and configure Vue app
const app = createApp(App);

// Register global components
app.component('LoadingSpinner', LoadingSpinner);

// Use plugins
app.use(router);

// Mount the app
export default {
  mount: (el: string | Element) => {
    app.mount(el);
    return app;
  }
};

// Export all components for individual imports
export {
  // Layout
  AppLayout,
  
  // Auth
  Login,
  
  // Common
  LoadingSpinner,
  NotFound,
  
  // Dashboard
  Dashboard,
  
  // Customer components
  CustomerList,
  CustomerDetail,
  CustomerForm,
  
  // Ticket components
  TicketList,
  TicketDetail,
  TicketForm
};