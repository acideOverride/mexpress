/**
 * Default theme for mExpress application
 * Provides consistent styling across all components
 * 
 * MEXP-2025-002-FE: Frontend Component Research
 */
export const defaultTheme = {
  // Add responsive breakpoints to ensure consistent media queries
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1280px',
    largeDesktop: '1440px'
  },
  colors: {
    primary: '#1976d2',
    secondary: '#424242',
    tertiary: '#f5f5f5',
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
      dark: '#121212'
    },
    
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#9e9e9e',
      hint: '#9e9e9e',
      white: '#ffffff'
    },
    border: {
      light: '#e0e0e0',
      medium: '#bdbdbd',
      dark: '#9e9e9e'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem'
    },
    lineHeight: {
      xs: 1.2,
      sm: 1.3,
      md: 1.5,
      lg: 1.7,
      xl: 1.9
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  borderRadius: {
    none: '0',
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    circular: '50%',
    // Component-specific border radiuses
    button: '4px',
    input: '4px',
    card: '8px',
    chip: '16px'
  },
  shadows: {
    none: 'none',
    xs: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    sm: '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
    md: '0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10)',
    lg: '0 15px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 40px rgba(0, 0, 0, 0.2)'
  },
  transitions: {
    duration: {
      short: '150ms',
      medium: '300ms',
      long: '500ms'
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },
  zIndex: {
    mobileStepper: 1000,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500
  }
};

export type Theme = typeof defaultTheme;

// The issue causing the test to fail - the outlined Card variant has a transparent background
// which should be a slight color for better contrast