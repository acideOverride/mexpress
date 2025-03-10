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
    },
    dedupe: ['vue']
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