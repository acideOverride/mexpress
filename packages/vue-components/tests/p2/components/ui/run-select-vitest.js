#!/usr/bin/env node
/**
 * This is a wrapper script to run the Select component test using the project's Vitest configuration
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path to the root of the vue-components package
const packageRoot = path.resolve(__dirname, '../../../../..');

// Run the test using Vitest
try {
  console.log('Running Select.test.ts with Vitest...');
  
  // Create a temporary tsconfig.json specifically for running this test
  const tempTsConfig = path.join(__dirname, 'temp-vitest-tsconfig.json');
  const tsConfigContent = JSON.stringify({
    "compilerOptions": {
      "target": "es2020",
      "useDefineForClassFields": true,
      "module": "ESNext",
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "skipLibCheck": true,
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": true,
      "jsx": "preserve",
      "strict": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noFallthroughCasesInSwitch": true,
      "paths": {
        "@/*": ["../../src/*"]
      }
    },
    "include": ["./Select.test.ts", "../../src/**/*.ts", "../../src/**/*.d.ts", "../../src/**/*.vue"],
    "references": [{ "path": "./tsconfig.node.json" }]
  });
  
  fs.writeFileSync(tempTsConfig, tsConfigContent);
  
  // Create a temporary Vitest config
  const tempVitestConfig = path.join(__dirname, 'vitest.config.ts');
  const vitestConfigContent = `
  import { defineConfig } from 'vitest/config';
  import vue from '@vitejs/plugin-vue';
  import { resolve } from 'path';
  
  export default defineConfig({
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, '../../../../src')
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['Select.test.ts']
    }
  });
  `;
  
  fs.writeFileSync(tempVitestConfig, vitestConfigContent);
  
  // Run the test
  const testCommand = `cd ${__dirname} && npx vitest run --config vitest.config.ts`;
  execSync(testCommand, { stdio: 'inherit' });
  
  // Clean up temporary files
  fs.unlinkSync(tempTsConfig);
  fs.unlinkSync(tempVitestConfig);
  
  console.log('Test execution completed');
} catch (error) {
  console.error('Error running test:', error.message);
  process.exit(1);
}