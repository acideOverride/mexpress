/**
 * Frontend Structure Test
 * 
 * These tests verify that the basic frontend directory structure
 * and essential files exist with correct configurations.
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const FRONTEND_DIR = path.resolve(__dirname, '../../../src/frontend');

describe('Frontend Structure', () => {
  it('should have frontend directory', () => {
    expect(fs.existsSync(FRONTEND_DIR)).toBe(true);
  });

  it('should have essential directories', () => {
    const requiredDirs = [
      'assets',
      'components',
      'composables',
      'layouts',
      'router',
      'services',
      'stores',
      'types',
      'views'
    ];

    for (const dir of requiredDirs) {
      const dirPath = path.join(FRONTEND_DIR, dir);
      expect(fs.existsSync(dirPath), `Directory ${dir} should exist`).toBe(true);
    }
  });

  it('should have main.ts file', () => {
    const mainTsPath = path.join(FRONTEND_DIR, 'main.ts');
    expect(fs.existsSync(mainTsPath), 'main.ts file should exist').toBe(true);
  });

  it('should have App.vue file', () => {
    const appVuePath = path.join(FRONTEND_DIR, 'App.vue');
    expect(fs.existsSync(appVuePath), 'App.vue file should exist').toBe(true);
  });

  it('should have index.html file', () => {
    const indexHtmlPath = path.join(FRONTEND_DIR, '../..', 'index.html');
    expect(fs.existsSync(indexHtmlPath), 'index.html file should exist').toBe(true);
  });
});

describe('Frontend Configuration', () => {
  it('should have proper package.json with Vue dependencies', () => {
    const packageJsonPath = path.resolve(__dirname, '../../../package.json');
    expect(fs.existsSync(packageJsonPath), 'package.json file should exist').toBe(true);
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    expect(packageJson.dependencies).toBeDefined();
    expect(packageJson.dependencies.vue).toBeDefined();
    expect(packageJson.dependencies['vue-router']).toBeDefined();
  });
});