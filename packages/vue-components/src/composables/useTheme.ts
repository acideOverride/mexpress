import { ref, watch, onMounted } from 'vue';

type ThemeMode = 'light' | 'dark' | 'system';

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';
const THEME_STORAGE_KEY = 'mexpress-theme-mode';

export function useTheme() {
  // Theme state
  const mode = ref<ThemeMode>('system');
  const isDark = ref(false);
  
  // Function to get system preference
  const getSystemTheme = (): 'dark' | 'light' => {
    return window.matchMedia(COLOR_SCHEME_QUERY).matches ? 'dark' : 'light';
  };
  
  // Update theme class on document
  const updateThemeClass = () => {
    const resolvedTheme = mode.value === 'system' ? getSystemTheme() : mode.value;
    isDark.value = resolvedTheme === 'dark';
    
    if (isDark.value) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Set theme mode
  const setTheme = (newMode: ThemeMode) => {
    mode.value = newMode;
    localStorage.setItem(THEME_STORAGE_KEY, newMode);
    updateThemeClass();
  };
  
  // Toggle between light/dark (preserving system setting)
  const toggleTheme = () => {
    if (mode.value === 'system') {
      setTheme(getSystemTheme() === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(mode.value === 'dark' ? 'light' : 'dark');
    }
  };
  
  // Watch for system preference changes
  onMounted(() => {
    // Load saved preference
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (savedTheme) {
      mode.value = savedTheme;
    }
    
    // Update initial state
    updateThemeClass();
    
    // Listen for system changes
    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY);
    mediaQuery.addEventListener('change', updateThemeClass);
    
    // Clean up listener when component unmounts
    return () => {
      mediaQuery.removeEventListener('change', updateThemeClass);
    };
  });
  
  // Watch for mode changes
  watch(mode, updateThemeClass);
  
  return {
    mode,
    isDark,
    setTheme,
    toggleTheme
  };
}