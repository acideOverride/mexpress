#!/bin/bash
# Script to fix Vue.js dependency issues in MontPC CRM frontend

echo "🔧 Fixing Vue.js dependency issues..."
echo "====================================="

# Define the correct versions
VUE_VERSION="3.3.4"
VUE_ROUTER_VERSION="4.2.5"
DEVTOOLS_API_VERSION="6.5.1"
RUNTIME_DOM_VERSION="3.3.4"
VUE_DEMI_VERSION="0.14.6"
PINIA_VERSION="2.1.7"

# Create required directories if they don't exist
mkdir -p src/vue-components/runtime-dom
mkdir -p src/vue-components/devtools-api

# Create proxy modules
echo "Creating proxy modules..."

# Runtime DOM proxy
cat > src/vue-components/runtime-dom/index.ts << EOF
// Reexport from actual module in node_modules
export * from '../../../../node_modules/@vue/runtime-dom';
EOF

# DevTools API proxy
cat > src/vue-components/devtools-api/index.ts << EOF
// Reexport from actual module in node_modules
export * from '../../../../node_modules/@vue/devtools-api';
EOF

# Update package.json
echo "Updating package.json with compatible versions..."
# Use exact versions for Vue-related dependencies
sed -i 's/"vue": ".*"/"vue": "~'$VUE_VERSION'"/' package.json
sed -i 's/"vue-router": ".*"/"vue-router": "~'$VUE_ROUTER_VERSION'"/' package.json
sed -i 's/"@vue\/devtools-api": ".*"/"@vue\/devtools-api": "~'$DEVTOOLS_API_VERSION'"/' package.json
sed -i 's/"@vue\/runtime-dom": ".*"/"@vue\/runtime-dom": "~'$RUNTIME_DOM_VERSION'"/' package.json
sed -i 's/"vue-demi": ".*"/"vue-demi": "~'$VUE_DEMI_VERSION'"/' package.json
sed -i 's/"pinia": ".*"/"pinia": "~'$PINIA_VERSION'"/' package.json

# Update Vite configuration for Vue
echo "Updating Vite configuration for Vue.js..."
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
      // Add these aliases to resolve module import issues
      'vue': resolve(__dirname, 'node_modules/vue'),
      '@vue/runtime-dom': resolve(__dirname, 'node_modules/@vue/runtime-dom'),
      '@vue/devtools-api': resolve(__dirname, 'node_modules/@vue/devtools-api'),
      'vue-demi': resolve(__dirname, 'node_modules/vue-demi'),
      'pinia': resolve(__dirname, 'node_modules/pinia'),
    },
    dedupe: ['vue', 'vue-router', 'pinia']
  },
  server: {
    port: 3001, // Different from React's port
  },
  build: {
    outDir: 'dist/vue',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },
})
EOF

# Create a helper module for Vue imports
echo "Creating Vue components helper module..."
cat > src/vue-components/components.js << EOF
// Helper module to simplify Vue imports
import * as Vue from 'vue';
import * as VueRouter from 'vue-router';
import * as Pinia from 'pinia';

// Re-export everything
export {
  Vue,
  VueRouter,
  Pinia
};
EOF

# Clean node_modules and reinstall packages
echo "Reinstalling dependencies with fixed versions..."
rm -rf node_modules/.vite
npm install --legacy-peer-deps

echo "✅ Vue.js dependency fixes completed!"
echo "To use, start the application with ./start-simple-ts.sh"