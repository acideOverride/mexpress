import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@backend': resolve(__dirname, 'src/backend'),
      '@frontend': resolve(__dirname, 'src/frontend'),
      '@shared': resolve(__dirname, 'src/shared'),
      '@tests': resolve(__dirname, 'tests')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup-frontend.ts'],
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist', '.git', '.github', 'coverage'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/']
    },
    deps: {
      inline: ['vue-router']
    }
  }
});