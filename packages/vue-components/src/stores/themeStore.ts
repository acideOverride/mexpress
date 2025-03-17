/**
 * Theme Store
 * Manages application theme state including dark/light mode
 * and custom theme settings
 */

import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeColor = 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'red';
export type ColorScheme = Record<string, string>;

export interface ThemeConfig {
  fontSize: 'small' | 'medium' | 'large';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;
}

/**
 * Theme Store
 * Manages theme settings including:
 * - Light/dark mode preference
 * - Primary color scheme
 * - Typography settings
 * - Accessibility preferences
 */
export const useThemeStore = defineStore('theme', () => {
  // ====== STATE ======
  const themeMode = ref<ThemeMode>(getInitialThemeMode());
  const primaryColor = ref<ThemeColor>('blue');
  const isSystemDarkMode = ref<boolean>(getSystemDarkMode());
  const config = ref<ThemeConfig>({
    fontSize: 'medium',
    borderRadius: 'medium',
    reducedMotion: false,
    highContrast: false
  });
  
  // Color schemes for each primary color
  const colorSchemes = ref<Record<ThemeColor, { light: ColorScheme; dark: ColorScheme }>>({
    blue: {
      light: {
        primary: '#1976d2',
        'primary-light': '#63a4ff',
        'primary-dark': '#004ba0',
        'primary-contrast': '#ffffff'
      },
      dark: {
        primary: '#90caf9',
        'primary-light': '#c3fdff',
        'primary-dark': '#5d99c6',
        'primary-contrast': '#000000'
      }
    },
    green: {
      light: {
        primary: '#2e7d32',
        'primary-light': '#60ad5e',
        'primary-dark': '#005005',
        'primary-contrast': '#ffffff'
      },
      dark: {
        primary: '#81c784',
        'primary-light': '#b2fab4',
        'primary-dark': '#519657',
        'primary-contrast': '#000000'
      }
    },
    purple: {
      light: {
        primary: '#7b1fa2',
        'primary-light': '#ae52d4',
        'primary-dark': '#4a0072',
        'primary-contrast': '#ffffff'
      },
      dark: {
        primary: '#ba68c8',
        'primary-light': '#ee98fb',
        'primary-dark': '#883997',
        'primary-contrast': '#000000'
      }
    },
    orange: {
      light: {
        primary: '#e65100',
        'primary-light': '#ff833a',
        'primary-dark': '#ac1900',
        'primary-contrast': '#ffffff'
      },
      dark: {
        primary: '#ffb74d',
        'primary-light': '#ffe97d',
        'primary-dark': '#c88719',
        'primary-contrast': '#000000'
      }
    },
    teal: {
      light: {
        primary: '#00796b',
        'primary-light': '#48a999',
        'primary-dark': '#004c40',
        'primary-contrast': '#ffffff'
      },
      dark: {
        primary: '#80cbc4',
        'primary-light': '#b2fef7',
        'primary-dark': '#4f9a94',
        'primary-contrast': '#000000'
      }
    },
    red: {
      light: {
        primary: '#c62828',
        'primary-light': '#ff5f52',
        'primary-dark': '#8e0000',
        'primary-contrast': '#ffffff'
      },
      dark: {
        primary: '#ef5350',
        'primary-light': '#ff867c',
        'primary-dark': '#b61827',
        'primary-contrast': '#000000'
      }
    }
  });

  // ====== WATCHERS ======
  // Watch for theme mode changes and update localStorage and document
  watch(themeMode, (newMode) => {
    localStorage.setItem('themeMode', newMode);
    updateThemeAttributes();
  }, { immediate: true });

  // Watch for system dark mode changes
  watch(isSystemDarkMode, () => {
    if (themeMode.value === 'system') {
      updateThemeAttributes();
    }
  });

  // Watch for primary color changes and update localStorage and CSS vars
  watch(primaryColor, (newColor) => {
    localStorage.setItem('primaryColor', newColor);
    updateThemeAttributes();
  }, { immediate: true });

  // Watch for theme config changes and update localStorage
  watch(config, (newConfig) => {
    localStorage.setItem('themeConfig', JSON.stringify(newConfig));
    updateThemeAttributes();
  }, { immediate: true, deep: true });

  // ====== GETTERS ======
  /**
   * Get the effective theme (light/dark) based on
   * the theme mode and system preference
   */
  const effectiveTheme = computed<'light' | 'dark'>(() => {
    if (themeMode.value === 'system') {
      return isSystemDarkMode.value ? 'dark' : 'light';
    }
    return themeMode.value;
  });

  /**
   * Get the current color scheme based on 
   * the primary color and effective theme
   */
  const currentColorScheme = computed<ColorScheme>(() => {
    return colorSchemes.value[primaryColor.value][effectiveTheme.value];
  });

  /**
   * Get CSS variables for the current theme
   */
  const cssVars = computed(() => {
    const vars: Record<string, string> = {};
    const scheme = currentColorScheme.value;
    
    // Add colors from scheme
    Object.entries(scheme).forEach(([key, value]) => {
      vars[`--${key}`] = value;
    });
    
    // Add theme-specific variables
    vars['--theme-bg'] = effectiveTheme.value === 'dark' ? '#121212' : '#ffffff';
    vars['--theme-bg-subtle'] = effectiveTheme.value === 'dark' ? '#1e1e1e' : '#f5f5f5';
    vars['--theme-fg'] = effectiveTheme.value === 'dark' ? '#ffffff' : '#000000';
    vars['--theme-fg-subtle'] = effectiveTheme.value === 'dark' ? '#a0a0a0' : '#717171';
    vars['--theme-border'] = effectiveTheme.value === 'dark' ? '#333333' : '#e0e0e0';
    vars['--theme-shadow'] = effectiveTheme.value === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)';
    
    // Add config variables
    switch (config.value.fontSize) {
      case 'small':
        vars['--font-size-scale'] = '0.875';
        break;
      case 'large':
        vars['--font-size-scale'] = '1.125';
        break;
      default:
        vars['--font-size-scale'] = '1';
    }
    
    switch (config.value.borderRadius) {
      case 'none':
        vars['--border-radius'] = '0px';
        break;
      case 'small':
        vars['--border-radius'] = '4px';
        break;
      case 'large':
        vars['--border-radius'] = '12px';
        break;
      default:
        vars['--border-radius'] = '8px';
    }
    
    if (config.value.highContrast) {
      vars['--theme-bg'] = effectiveTheme.value === 'dark' ? '#000000' : '#ffffff';
      vars['--theme-fg'] = effectiveTheme.value === 'dark' ? '#ffffff' : '#000000';
      vars['--theme-contrast-ratio'] = '7';
    } else {
      vars['--theme-contrast-ratio'] = '4.5';
    }
    
    return vars;
  });

  // ====== ACTIONS ======
  /**
   * Set the theme mode (light, dark, or system)
   */
  function setThemeMode(mode: ThemeMode) {
    themeMode.value = mode;
  }

  /**
   * Set the primary color
   */
  function setPrimaryColor(color: ThemeColor) {
    primaryColor.value = color;
  }

  /**
   * Update theme configuration
   */
  function updateConfig(newConfig: Partial<ThemeConfig>) {
    config.value = {
      ...config.value,
      ...newConfig
    };
  }

  /**
   * Toggle between light and dark mode
   */
  function toggleDarkMode() {
    if (themeMode.value === 'light') {
      themeMode.value = 'dark';
    } else if (themeMode.value === 'dark') {
      themeMode.value = 'light';
    } else {
      // If system, override with the opposite of system preference
      themeMode.value = isSystemDarkMode.value ? 'light' : 'dark';
    }
  }

  /**
   * Check if system dark mode preference has changed
   */
  function checkSystemThemeChange() {
    isSystemDarkMode.value = getSystemDarkMode();
  }

  /**
   * Reset theme to defaults
   */
  function resetTheme() {
    themeMode.value = 'system';
    primaryColor.value = 'blue';
    config.value = {
      fontSize: 'medium',
      borderRadius: 'medium',
      reducedMotion: false,
      highContrast: false
    };
  }

  // ====== HELPER FUNCTIONS ======
  /**
   * Get the initial theme mode from localStorage or system preference
   */
  function getInitialThemeMode(): ThemeMode {
    const storedTheme = localStorage.getItem('themeMode') as ThemeMode | null;
    return storedTheme || 'system';
  }

  /**
   * Get the system dark mode preference
   */
  function getSystemDarkMode(): boolean {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Get the initial primary color from localStorage
   */
  function getInitialPrimaryColor(): ThemeColor {
    const storedColor = localStorage.getItem('primaryColor') as ThemeColor | null;
    return storedColor || 'blue';
  }

  /**
   * Get the initial theme config from localStorage
   */
  function getInitialThemeConfig(): ThemeConfig {
    const storedConfig = localStorage.getItem('themeConfig');
    if (storedConfig) {
      try {
        return JSON.parse(storedConfig) as ThemeConfig;
      } catch (e) {
        // Fallback to default if parsing fails
        return {
          fontSize: 'medium',
          borderRadius: 'medium',
          reducedMotion: false,
          highContrast: false
        };
      }
    }
    
    return {
      fontSize: 'medium',
      borderRadius: 'medium',
      reducedMotion: false,
      highContrast: false
    };
  }

  /**
   * Update theme attributes on the document
   */
  function updateThemeAttributes() {
    // Update data-theme attribute on document
    document.documentElement.setAttribute('data-theme', effectiveTheme.value);
    
    // Update color-scheme property
    document.documentElement.style.colorScheme = effectiveTheme.value;
    
    // Update CSS variables
    Object.entries(cssVars.value).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    
    // Set reduced motion
    if (config.value.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }

  // Set up system theme change listener
  function setupSystemThemeListener() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => {
        isSystemDarkMode.value = e.matches;
      };
      
      // Add listener (using addEventListener or deprecated addListener based on browser support)
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
      } else if (mediaQuery.addListener) {
        // For older browsers
        mediaQuery.addListener(listener);
      }
    }
  }

  // Setup the listener
  if (typeof window !== 'undefined') {
    setupSystemThemeListener();
  }

  return {
    // State
    themeMode,
    primaryColor,
    isSystemDarkMode,
    config,
    colorSchemes,
    
    // Getters
    effectiveTheme,
    currentColorScheme,
    cssVars,
    
    // Actions
    setThemeMode,
    setPrimaryColor,
    updateConfig,
    toggleDarkMode,
    checkSystemThemeChange,
    resetTheme
  };
});