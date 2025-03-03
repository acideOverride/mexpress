// MEXP-2025-002-FE Frontend Component Research
import { StyleValidator } from '../../../src/utils/style-validator';

// Mock component test data
const mockComponents = {
  Button: {
    variants: ['primary', 'secondary', 'danger', 'warning', 'info', 'success'],
    sizes: ['sm', 'md', 'lg', 'xl'],
    themes: ['light', 'dark'],
    colorValues: {
      primary: '#0066cc',
      secondary: '#6c757d',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
      success: '#28a745'
    },
    fontSizes: {
      sm: '0.875rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.5rem'
    }
  },
  
  Input: {
    variants: ['outline', 'filled', 'flushed', 'unstyled'],
    sizes: ['sm', 'md', 'lg'],
    states: ['normal', 'hover', 'focus', 'disabled', 'error'],
    borderRadius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem'
    },
    boxShadow: {
      focus: '0 0 0 1px rgba(0, 102, 204, 0.6)'
    }
  },
  
  Card: {
    variants: ['elevated', 'outline', 'filled', 'unstyled'],
    sizes: ['sm', 'md', 'lg'],
    borderRadius: '0.375rem',
    boxShadow: {
      elevated: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    padding: {
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem'
    }
  },
  
  Modal: {
    sizes: ['xs', 'sm', 'md', 'lg', 'xl', 'full'],
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: 1000
    },
    content: {
      backgroundColor: '#ffffff',
      borderRadius: '0.375rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }
  },
  
  Table: {
    variants: ['simple', 'striped', 'unstyled'],
    sizes: ['sm', 'md', 'lg'],
    colors: {
      header: {
        backgroundColor: '#f8f9fa',
        textColor: '#212529'
      },
      row: {
        odd: '#ffffff',
        even: '#f8f9fa',
        hover: '#e9ecef'
      }
    },
    borderWidth: '1px',
    borderColor: '#dee2e6'
  }
};

// Mock theme data
const mockTheme = {
  colors: {
    primary: '#0066cc',
    secondary: '#6c757d',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    success: '#28a745',
    text: {
      primary: '#212529',
      secondary: '#6c757d',
      disabled: '#a0aec0'
    },
    background: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
      tertiary: '#e9ecef'
    }
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeights: {
      normal: 'normal',
      none: 1,
      tight: 1.25,
      base: 1.5,
      loose: 2
    }
  },
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem'
  },
  breakpoints: {
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em'
  },
  radii: {
    none: '0',
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.375rem',
    xl: '0.5rem',
    full: '9999px'
  },
  shadows: {
    none: 'none',
    xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)'
  }
};

// Adapter class to use StyleValidator but keep the test interface
class ComponentStyleTester {
  constructor(theme, componentData) {
    this.theme = theme;
    this.componentData = componentData;
  }
  
  validateColorValues() {
    // For each component, extract its color values and validate against theme
    const result = { valid: true, issues: [] };
    
    Object.entries(this.componentData).forEach(([componentName, component]: [string, any]) => {
      if (component.colorValues) {
        const componentResult = StyleValidator.validateColors(component.colorValues, this.theme.colors);
        if (!componentResult.valid) {
          result.valid = false;
          // Add component name to issues for better context
          componentResult.issues.forEach(issue => {
            result.issues.push(`${componentName} ${issue}`);
          });
        }
      }
    });
    
    return result;
  }
  
  validateTypography(): { valid: boolean; issues: string[] } {
    const result = { valid: true, issues: [] };
    
    Object.entries(this.componentData).forEach(([componentName, component]: [string, any]) => {
      if (component.fontSizes) {
        const componentResult = StyleValidator.validateTypography(
          { fontSizes: component.fontSizes },
          this.theme.typography
        );
        if (!componentResult.valid) {
          result.valid = false;
          // Add component name to issues for better context
          componentResult.issues.forEach(issue => {
            result.issues.push(`${componentName} ${issue}`);
          });
        }
      }
    });
    
    return result;
  }
  
  validateSpacing(): { valid: boolean; issues: string[] } {
    const result = { valid: true, issues: [] };
    
    Object.entries(this.componentData).forEach(([componentName, component]: [string, any]) => {
      if (component.padding) {
        const componentResult = StyleValidator.validateSpacing(
          component.padding,
          this.theme.spacing
        );
        if (!componentResult.valid) {
          result.valid = false;
          // Add component name to issues for better context
          componentResult.issues.forEach(issue => {
            result.issues.push(`${componentName} ${issue}`);
          });
        }
      }
    });
    
    return result;
  }
  
  validateBorderRadius(): { valid: boolean; issues: string[] } {
    const result = { valid: true, issues: [] };
    
    Object.entries(this.componentData).forEach(([componentName, component]: [string, any]) => {
      if (component.borderRadius) {
        const componentResult = StyleValidator.validateBorderRadius(
          component.borderRadius,
          this.theme.radii
        );
        if (!componentResult.valid) {
          result.valid = false;
          // Add component name to issues for better context
          componentResult.issues.forEach(issue => {
            result.issues.push(`${componentName} ${issue}`);
          });
        }
      }
    });
    
    return result;
  }
  
  validateShadows(): { valid: boolean; issues: string[] } {
    const result = { valid: true, issues: [] };
    
    Object.entries(this.componentData).forEach(([componentName, component]: [string, any]) => {
      if (component.boxShadow) {
        const componentResult = StyleValidator.validateShadows(
          component.boxShadow,
          this.theme.shadows
        );
        if (!componentResult.valid) {
          result.valid = false;
          // Add component name to issues for better context
          componentResult.issues.forEach(issue => {
            result.issues.push(`${componentName} ${issue}`);
          });
        }
      }
    });
    
    return result;
  }
  
  validateAllStyles(): { valid: boolean; issues: string[] } {
    const colorResults = this.validateColorValues();
    const typographyResults = this.validateTypography();
    const spacingResults = this.validateSpacing();
    const borderRadiusResults = this.validateBorderRadius();
    const shadowResults = this.validateShadows();
    
    const valid = 
      colorResults.valid && 
      typographyResults.valid && 
      spacingResults.valid && 
      borderRadiusResults.valid && 
      shadowResults.valid;
    
    const issues = [
      ...colorResults.issues,
      ...typographyResults.issues,
      ...spacingResults.issues,
      ...borderRadiusResults.issues,
      ...shadowResults.issues
    ];
    
    return { valid, issues };
  }
}

// Unit test suite for component style validation
describe('Component Style Validation', () => {
  let styleTester: ComponentStyleTester;
  
  beforeEach(() => {
    styleTester = new ComponentStyleTester(mockTheme, mockComponents);
  });
  
  describe('Color value validation', () => {
    it('should validate that component color values match theme colors', () => {
      const results = styleTester.validateColorValues();
      expect(results.valid).toBe(true);
      expect(results.issues).toHaveLength(0);
    });
    
    it('should detect color mismatches', () => {
      // Create a clone with a modified color value
      const modifiedComponents = JSON.parse(JSON.stringify(mockComponents));
      modifiedComponents.Button.colorValues.primary = '#ff0000'; // Changed from #0066cc
      
      const tester = new ComponentStyleTester(mockTheme, modifiedComponents);
      const results = tester.validateColorValues();
      
      expect(results.valid).toBe(false);
      expect(results.issues).toContain(
        'Button Color mismatch for \'primary\': Component uses #ff0000, theme defines #0066cc'
      );
    });
  });
  
  describe('Typography validation', () => {
    it('should validate that component typography values match theme', () => {
      const results = styleTester.validateTypography();
      expect(results.valid).toBe(true);
      expect(results.issues).toHaveLength(0);
    });
    
    it('should detect font size mismatches', () => {
      // Create a clone with a modified font size
      const modifiedComponents = JSON.parse(JSON.stringify(mockComponents));
      modifiedComponents.Button.fontSizes.md = '1.1rem'; // Changed from 1rem
      
      const tester = new ComponentStyleTester(mockTheme, modifiedComponents);
      const results = tester.validateTypography();
      
      expect(results.valid).toBe(false);
      expect(results.issues).toContain(
        'Button Font size mismatch for \'md\': Component uses 1.1rem, theme defines 1rem'
      );
    });
  });
  
  describe('Spacing validation', () => {
    it('should validate that component spacing values match theme', () => {
      const results = styleTester.validateSpacing();
      expect(results.valid).toBe(true);
      expect(results.issues).toHaveLength(0);
    });
    
    it('should detect spacing mismatches', () => {
      // Create a clone with a modified spacing value
      const modifiedComponents = JSON.parse(JSON.stringify(mockComponents));
      modifiedComponents.Card.padding.md = '1.2rem'; // Changed from 1rem
      
      const tester = new ComponentStyleTester(mockTheme, modifiedComponents);
      const results = tester.validateSpacing();
      
      expect(results.valid).toBe(false);
      expect(results.issues).toContain(
        'Card Spacing mismatch for \'md\': Component uses 1.2rem, theme defines 1rem'
      );
    });
  });
  
  describe('Border radius validation', () => {
    it('should validate that component border radius values match theme', () => {
      const results = styleTester.validateBorderRadius();
      expect(results.valid).toBe(true);
      expect(results.issues).toHaveLength(0);
    });
    
    it('should detect border radius mismatches', () => {
      // Create a clone with a modified border radius
      const modifiedComponents = JSON.parse(JSON.stringify(mockComponents));
      modifiedComponents.Input.borderRadius.md = '0.4rem'; // Changed from 0.375rem
      
      const tester = new ComponentStyleTester(mockTheme, modifiedComponents);
      const results = tester.validateBorderRadius();
      
      expect(results.valid).toBe(false);
      expect(results.issues).toContain(
        'Input Border radius mismatch for \'md\': Component uses 0.4rem, theme defines 0.375rem'
      );
    });
  });
  
  describe('Shadow validation', () => {
    it('should validate that component shadow values match theme', () => {
      const results = styleTester.validateShadows();
      expect(results.valid).toBe(true);
      expect(results.issues).toHaveLength(0);
    });
    
    it('should detect shadow mismatches', () => {
      // Create a clone with a modified shadow
      const modifiedComponents = JSON.parse(JSON.stringify(mockComponents));
      modifiedComponents.Card.boxShadow.elevated = '0 3px 5px rgba(0, 0, 0, 0.2)'; // Changed
      
      const tester = new ComponentStyleTester(mockTheme, modifiedComponents);
      const results = tester.validateShadows();
      
      expect(results.valid).toBe(false);
      expect(results.issues).toContain(
        'Card Shadow mismatch for \'elevated\': Component uses 0 3px 5px rgba(0, 0, 0, 0.2), theme defines 0 1px 3px rgba(0, 0, 0, 0.1)'
      );
    });
  });
  
  describe('Comprehensive style validation', () => {
    it('should validate all component styles against theme', () => {
      const results = styleTester.validateAllStyles();
      expect(results.valid).toBe(true);
      expect(results.issues).toHaveLength(0);
    });
    
    it('should detect all style mismatches', () => {
      // Create a clone with multiple style issues
      const modifiedComponents = JSON.parse(JSON.stringify(mockComponents));
      modifiedComponents.Button.colorValues.primary = '#ff0000';
      modifiedComponents.Button.fontSizes.lg = '1.3rem';
      modifiedComponents.Card.padding.sm = '0.75rem';
      
      const tester = new ComponentStyleTester(mockTheme, modifiedComponents);
      const results = tester.validateAllStyles();
      
      expect(results.valid).toBe(false);
      expect(results.issues.length).toBe(3);
      expect(results.issues).toContain(
        'Button Color mismatch for \'primary\': Component uses #ff0000, theme defines #0066cc'
      );
      expect(results.issues).toContain(
        'Button Font size mismatch for \'lg\': Component uses 1.3rem, theme defines 1.125rem'
      );
      expect(results.issues).toContain(
        'Card Spacing mismatch for \'sm\': Component uses 0.75rem, theme defines 0.5rem'
      );
    });
  });
});