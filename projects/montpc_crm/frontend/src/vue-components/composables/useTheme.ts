/**
 * Theme Management Composable
 * 
 * Provides theme functionality for the application with support for
 * light, dark, and night-shift themes.
 */
import { ref, readonly, watch, computed, inject, provide } from 'vue';

// Create theme context symbol for provide/inject
export const THEME_KEY = Symbol('theme');

// Available themes
export const THEMES = ['light', 'dark', 'night-shift'] as const;
export type Theme = typeof THEMES[number];

// Theme interface for injection
export interface ThemeContext {
  currentTheme: readonly Ref<Theme>;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
  isTheme: (theme: Theme) => boolean;
  themeIcon: ComputedRef<string>;
  // Additional theme properties
  preferredDark: Ref<boolean>;
  systemTheme: Ref<Theme>;
}

/**
 * Creates and returns theme context
 */
export function createThemeContext() {
  // Track current theme
  const currentTheme = ref<Theme>('light');
  
  // System preferences
  const preferredDark = ref(false);
  const systemTheme = computed<Theme>(() => preferredDark.value ? 'dark' : 'light');
  
  // Theme comparison helper
  const isTheme = (theme: Theme) => currentTheme.value === theme;
  
  // Dynamic icon based on current theme
  const themeIcon = computed(() => {
    switch (currentTheme.value) {
      case 'light': return 'sun';
      case 'dark': return 'moon';
      case 'night-shift': return 'eye';
      default: return 'sun';
    }
  });
  
  // Set theme with validation
  const setTheme = (theme: Theme) => {
    if (THEMES.includes(theme)) {
      currentTheme.value = theme;
      localStorage.setItem('mont-pc-theme', theme);
      document.body.setAttribute('data-theme', theme);
    }
  };
  
  // Cycle through themes
  const cycleTheme = () => {
    const currentIndex = THEMES.indexOf(currentTheme.value);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    setTheme(THEMES[nextIndex]);
  };
  
  // Initialize theme preference detection
  const initThemePreferences = () => {
    // Check for stored theme preference
    const storedTheme = localStorage.getItem('mont-pc-theme') as Theme | null;
    
    // Check for system preference
    if (window.matchMedia) {
      const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      preferredDark.value = darkMediaQuery.matches;
      
      // Listen for system preference changes
      darkMediaQuery.addEventListener('change', (e) => {
        preferredDark.value = e.matches;
        
        // Auto-update theme if using system preference (no stored theme)
        if (!localStorage.getItem('mont-pc-theme')) {
          setTheme(systemTheme.value);
        }
      });
    }
    
    // Set initial theme
    if (storedTheme && THEMES.includes(storedTheme)) {
      setTheme(storedTheme);
    } else {
      // Use system preference as default
      setTheme(systemTheme.value);
    }
  };
  
  // Create theme context
  const themeContext: ThemeContext = {
    currentTheme: readonly(currentTheme),
    setTheme,
    cycleTheme,
    isTheme,
    themeIcon,
    preferredDark: readonly(preferredDark),
    systemTheme: readonly(systemTheme),
  };
  
  // Initialize
  initThemePreferences();
  
  return themeContext;
}

/**
 * Composable for accessing theme context
 */
export function useTheme(): ThemeContext {
  const themeContext = inject<ThemeContext>(THEME_KEY);
  
  if (!themeContext) {
    throw new Error('useTheme must be used within a component that has ThemeProvider as an ancestor');
  }
  
  return themeContext;
}

/**
 * Creates and provides theme context
 */
export function provideTheme(): ThemeContext {
  const themeContext = createThemeContext();
  provide(THEME_KEY, themeContext);
  return themeContext;
}