#!/bin/bash
# Script to fix the Vue.js app with proper layout and styles

echo "🎨 Updating Vue.js app with proper layout..."
echo "========================================"

# Make sure we're in the right directory
cd "$(dirname "$0")" || exit
cd frontend || exit

# Step 1: Create a proper global CSS file
echo "Creating global CSS styles..."
cat > src/index.css << EOF
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --primary: #2563eb;
  --primary-light: #3b82f6;
  --primary-dark: #1d4ed8;
  --success: #10b981;
  --success-light: #34d399;
  --warning: #f59e0b;
  --danger: #ef4444;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', sans-serif;
  color: var(--gray-800);
  background-color: var(--gray-50);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.6;
}

a {
  color: var(--primary);
  text-decoration: none;
}

button {
  font-family: 'Inter', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  color: var(--gray-900);
  font-weight: 600;
  line-height: 1.3;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Utility classes */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.text-sm {
  font-size: 0.875rem;
}

.text-lg {
  font-size: 1.125rem;
}

.font-medium {
  font-weight: 500;
}

.font-semibold {
  font-weight: 600;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-4 {
  margin-top: 1rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.p-4 {
  padding: 1rem;
}
EOF

# Step 2: Update App.vue to properly use the layout
echo "Updating App.vue to use proper layout..."
cat > src/vue-components/App.vue << EOF
<template>
  <AppLayout>
    <router-view />
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import AppLayout from './layout/AppLayout.vue';

onMounted(() => {
  console.log('Vue application mounted successfully');
});
</script>

<style>
/* Global styles are imported from index.css */
</style>
EOF

# Step 3: Create a proper router configuration with proper components
echo "Updating router configuration..."
cat > src/vue-components/router.ts << EOF
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Dashboard from './dashboard/Dashboard.vue';

// Define routes
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: false  // Set to false for testing
    }
  },
  // Fallback route
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard (simplified for testing)
router.beforeEach((to, from, next) => {
  console.log('Route navigation:', from.path, '->', to.path);
  next();
});

export default router;
EOF

# Step 4: Update the main Vue entry file
echo "Updating vue-main.ts with error handling..."
cat > src/vue-main.ts << EOF
// Vue app entry point
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './vue-components/App.vue';
import router from './vue-components/router';

// Import styles
import './index.css';

console.log('Vue app initialization starting...');

// Create Pinia store (state management)
const pinia = createPinia();

// Create the Vue app
const app = createApp(App);

// Register global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err);
  console.error('Component:', vm);
  console.error('Error Info:', info);
  
  // Show error in UI (can be customized)
  const appElement = document.getElementById('app-vue');
  if (appElement) {
    appElement.innerHTML += \`
      <div style="position: fixed; bottom: 20px; right: 20px; background: #fee2e2; border: 1px solid #ef4444; border-radius: 6px; padding: 12px; color: #b91c1c; z-index: 9999;">
        <strong>Error:</strong> \${err.toString()}
        <button onclick="this.parentNode.style.display='none'" style="background: none; border: none; margin-left: 8px; cursor: pointer;">✕</button>
      </div>
    \`;
  }
};

// Use plugins
app.use(router);
app.use(pinia);

// Mount the app
const vueRoot = document.getElementById('app-vue');
if (vueRoot) {
  app.mount(vueRoot);
  console.log('Vue app mounted successfully');
} else {
  console.error('Could not find #app-vue element to mount Vue app');
  
  // If the element doesn't exist, create it
  const newRoot = document.createElement('div');
  newRoot.id = 'app-vue';
  document.body.appendChild(newRoot);
  
  // Then mount
  app.mount(newRoot);
  console.log('Created and mounted #app-vue element');
}

// For debugging
window.vueApp = app;
EOF

# Step 5: Update the index.html to focus on Vue
echo "Updating index.html to focus on Vue.js app..."
cat > index.html << EOF
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MontPC CRM</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="app-vue">
      <!-- Initial loading state -->
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
        <div style="text-align: center;">
          <h1 style="font-size: 24px; margin-bottom: 16px; color: #2563eb;">MontPC CRM</h1>
          <p style="margin-bottom: 24px; color: #6b7280;">Loading application...</p>
          <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top-color: #2563eb; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        </div>
      </div>
    </div>

    <style>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
    
    <!-- Vue.js Entry Point with fallback -->
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

# Step 6: Update the Vite config to prioritize Vue
echo "Updating vite.vue.config.ts..."
cat > vite.vue.config.ts << EOF
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@vue': resolve(__dirname, 'src/vue-components'),
      // Fix module resolution issues
      'vue': resolve(__dirname, 'node_modules/vue'),
      '@vue/runtime-dom': resolve(__dirname, 'node_modules/@vue/runtime-dom'),
      '@vue/devtools-api': resolve(__dirname, 'node_modules/@vue/devtools-api'),
      'vue-demi': resolve(__dirname, 'node_modules/vue-demi'),
      'pinia': resolve(__dirname, 'node_modules/pinia'),
    },
    dedupe: ['vue', 'vue-router', 'pinia']
  },
  server: {
    port: 5173, // Use standard port
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', '@vue/runtime-dom', '@vue/devtools-api']
  },
  build: {
    outDir: 'dist/vue',
  }
})
EOF

# Step 7: Make sure the start-simple-ts.sh script uses npm run dev:vue
echo "Updating start-simple-ts.sh to use dev:vue script..."
if [ -f "../start-simple-ts.sh" ]; then
  sed -i 's/npm run dev &/npm run dev:vue \&/' ../start-simple-ts.sh
else
  echo "Warning: start-simple-ts.sh not found in parent directory"
fi

# Optional: Commit changes
echo "Vue.js app updated with proper layout and styles!"
echo "Now you can run ./start-simple-ts.sh to start the application"