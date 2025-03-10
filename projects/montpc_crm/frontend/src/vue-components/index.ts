import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Import shared components
import LoadingSpinner from './common/LoadingSpinner.vue';

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