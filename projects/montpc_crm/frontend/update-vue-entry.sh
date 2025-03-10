#!/bin/bash
# Script to update Vue.js entry point after fixing dependencies

echo "🔄 Updating Vue.js entry point..."
echo "================================="

# First, ensure our App.vue is properly set up
if [ -f "src/vue-components/App.vue.template" ]; then
  echo "Using template to update App.vue..."
  cp src/vue-components/App.vue.template src/vue-components/App.vue
fi

# Update the main HTML entry point to properly load Vue
echo "Updating index.html to properly load Vue.js..."
cat > index.html << EOF
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MontPC CRM</title>
    <!-- Preload fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="app-vue">
      <!-- Initial loading state -->
      <div style="padding: 40px; text-align: center; font-family: 'Inter', sans-serif;">
        <h1 style="font-size: 28px; margin-bottom: 20px; color: #1e40af;">MontPC CRM</h1>
        <p style="font-size: 18px; color: #6b7280;">Loading Vue.js application...</p>
      </div>
    </div>
    
    <!-- Vue.js Entry Point -->
    <script type="module">
      import('./src/vue-main.ts').catch(err => {
        console.error('Failed to load Vue app:', err);
        document.getElementById('app-vue').innerHTML = \`
          <div style="padding: 40px; text-align: center; font-family: 'Inter', sans-serif;">
            <h1 style="font-size: 28px; margin-bottom: 20px; color: #e11d48;">Error Loading Application</h1>
            <p style="font-size: 18px; color: #6b7280;">There was a problem loading the application. Please try again or check the API dashboard.</p>
            <p style="margin-top: 20px;">
              <a href="/api.html" style="display: inline-block; background: #4f46e5; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px;">
                Go to API Dashboard
              </a>
            </p>
            <pre style="margin-top: 20px; text-align: left; background: #f1f5f9; padding: 16px; border-radius: 8px; overflow: auto;">\${err.toString()}</pre>
          </div>
        \`;
      });
    </script>
  </body>
</html>
EOF

# Update the Vue main entry file
echo "Updating vue-main.ts..."
cat > src/vue-main.ts << EOF
// Vue app entry point
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './vue-components/App.vue';
import router from './vue-components/router';

// Import styles
import './index.css';

console.log('Vue app initialization starting...');

// Create Pinia store
const pinia = createPinia();

// Create the Vue app
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

// Mount the app
const vueRoot = document.getElementById('app-vue');
if (vueRoot) {
  app.mount(vueRoot);
  console.log('Vue app mounted successfully');
} else {
  console.error('Could not find #app-vue element to mount Vue app');
}
EOF

# Modify start-simple-ts.sh to try both entry points
echo "Updating start-simple-ts.sh to support Vue.js entry point..."
sed -i 's/npm run dev &/npm run dev:vue \&/' start-simple-ts.sh

echo "✅ Vue.js entry point updated successfully!"
echo "Now you can run ./start-simple-ts.sh to start the application"
echo "The app will attempt to load the full Vue.js interface, with a fallback to the API dashboard."