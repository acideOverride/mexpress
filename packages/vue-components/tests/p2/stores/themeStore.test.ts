/**
 * ThemeStore Unit Tests
 * 
 * Tests the theme store functionality including:
 * - Theme mode switching (light/dark/system)
 * - Primary color customization
 * - Accessibility settings
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useThemeStore, ThemeMode, ThemeColor } from '../../../src/stores/themeStore';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    })
  };
})();

// Mock document methods
document.documentElement.setAttribute = vi.fn();
document.documentElement.style.setProperty = vi.fn();
document.documentElement.style.colorScheme = '';
document.documentElement.classList.add = vi.fn();
document.documentElement.classList.remove = vi.fn();

// Mock window.matchMedia
window.matchMedia = vi.fn().mockImplementation(query => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
});

describe('Theme Store', () => {
  beforeEach(() => {
    // Setup the mock localStorage
    vi.stubGlobal('localStorage', localStorageMock);
    
    // Create a fresh pinia instance and set it as active
    setActivePinia(createPinia());
    
    // Clear mock calls
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clear localStorage after each test
    localStorageMock.clear();
  });

  // Basic store initialization tests
  it('initializes with default theme settings', () => {
    const themeStore = useThemeStore();
    
    // Check default values
    expect(themeStore.themeMode).toBe('system');
    expect(themeStore.primaryColor).toBe('blue');
    expect(themeStore.effectiveTheme).toBe('light'); // Default effective theme when system is light
    expect(themeStore.config).toEqual({
      fontSize: 'medium',
      borderRadius: 'medium',
      reducedMotion: false,
      highContrast: false
    });
  });

  // Theme mode switching tests
  it('switches between theme modes', () => {
    const themeStore = useThemeStore();
    
    // Test setting themes
    themeStore.setThemeMode('dark');
    expect(themeStore.themeMode).toBe('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('themeMode', 'dark');
    
    themeStore.setThemeMode('light');
    expect(themeStore.themeMode).toBe('light');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('themeMode', 'light');
    
    themeStore.setThemeMode('system');
    expect(themeStore.themeMode).toBe('system');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('themeMode', 'system');
    
    // Test toggling
    themeStore.setThemeMode('light');
    themeStore.toggleDarkMode();
    expect(themeStore.themeMode).toBe('dark');
    
    themeStore.toggleDarkMode();
    expect(themeStore.themeMode).toBe('light');
  });

  // Primary color tests
  it('changes primary color', () => {
    const themeStore = useThemeStore();
    
    // Test changing colors
    themeStore.setPrimaryColor('green');
    expect(themeStore.primaryColor).toBe('green');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('primaryColor', 'green');
    
    themeStore.setPrimaryColor('purple');
    expect(themeStore.primaryColor).toBe('purple');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('primaryColor', 'purple');
    
    // Verify color scheme changes
    const purpleScheme = themeStore.colorSchemes.purple.light;
    expect(themeStore.currentColorScheme).toEqual(purpleScheme);
  });

  // Theme config tests
  it('updates theme configuration', () => {
    const themeStore = useThemeStore();
    
    // Test updating config
    themeStore.updateConfig({
      fontSize: 'large',
      highContrast: true
    });
    
    expect(themeStore.config).toEqual({
      fontSize: 'large',
      borderRadius: 'medium',
      reducedMotion: false,
      highContrast: true
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalled();
    
    // Test that document methods were called to update
    expect(document.documentElement.style.setProperty).toHaveBeenCalled();
  });

  // CSS variables tests
  it('generates correct CSS variables', () => {
    const themeStore = useThemeStore();
    
    // Test light theme variables
    themeStore.setThemeMode('light');
    let cssVars = themeStore.cssVars;
    
    expect(cssVars['--theme-bg']).toBe('#ffffff');
    expect(cssVars['--theme-fg']).toBe('#000000');
    expect(cssVars).toHaveProperty('--primary');
    
    // Test dark theme variables
    themeStore.setThemeMode('dark');
    cssVars = themeStore.cssVars;
    
    expect(cssVars['--theme-bg']).toBe('#121212');
    expect(cssVars['--theme-fg']).toBe('#ffffff');
    
    // Test high contrast mode
    themeStore.updateConfig({ highContrast: true });
    cssVars = themeStore.cssVars;
    
    expect(cssVars['--theme-bg']).toBe('#000000');
    expect(cssVars['--theme-contrast-ratio']).toBe('7');
  });

  // System preference tests
  it('handles system preference changes', () => {
    const themeStore = useThemeStore();
    
    // Set mode to system
    themeStore.setThemeMode('system');
    
    // Simulate a system preference change
    const matchMediaMock = window.matchMedia as jest.Mock;
    
    // System prefers light
    matchMediaMock.mockImplementation(() => ({ 
      matches: false, 
      addEventListener: vi.fn(),
      removeEventListener: vi.fn() 
    }));
    themeStore.checkSystemThemeChange();
    expect(themeStore.effectiveTheme).toBe('light');
    
    // System prefers dark
    matchMediaMock.mockImplementation(() => ({ 
      matches: true, 
      addEventListener: vi.fn(),
      removeEventListener: vi.fn() 
    }));
    themeStore.checkSystemThemeChange();
    expect(themeStore.effectiveTheme).toBe('dark');
  });

  // Reset functionality
  it('resets theme to defaults', () => {
    const themeStore = useThemeStore();
    
    // Change various settings
    themeStore.setThemeMode('dark');
    themeStore.setPrimaryColor('orange');
    themeStore.updateConfig({
      fontSize: 'large',
      borderRadius: 'none',
      reducedMotion: true,
      highContrast: true
    });
    
    // Reset everything
    themeStore.resetTheme();
    
    // Check all settings are back to defaults
    expect(themeStore.themeMode).toBe('system');
    expect(themeStore.primaryColor).toBe('blue');
    expect(themeStore.config).toEqual({
      fontSize: 'medium',
      borderRadius: 'medium',
      reducedMotion: false,
      highContrast: false
    });
  });
});