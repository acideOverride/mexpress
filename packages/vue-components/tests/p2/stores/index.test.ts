/**
 * Store Tests Entry Point
 * This is a basic test to ensure the store exports are working correctly
 */

import { describe, it, expect } from 'vitest';
import * as stores from '../../../src/stores';

describe('Store Exports', () => {
  it('exports the necessary stores', () => {
    expect(stores).toHaveProperty('useDashboardStore');
    expect(stores).toHaveProperty('useThemeStore');
    expect(stores).toHaveProperty('useNotificationStore');
    expect(stores).toHaveProperty('pinia');
    expect(stores).toHaveProperty('setupPinia');
  });
});