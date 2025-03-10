import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Support both React and Vue
    react(),
    vue(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    // Generate sourcemaps for easier debugging
    sourcemap: true,
  },
  server: {
    // Open browser on start
    open: true,
    // Enable HMR
    hmr: true
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia']
  }
})
