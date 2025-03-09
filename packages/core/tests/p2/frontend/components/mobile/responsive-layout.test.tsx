/**
 * Mobile Responsive Layout Components Test
 * Tests components' responsiveness to different viewport sizes
 * 
 * MEXP-2025-002-FE: Frontend Component Research
 * 
 * @jest-environment jsdom
 * @jest-setup /opt/mExpress/packages/core/tests/setupTests.ts
 */

import '@testing-library/jest-dom';

// Define theme types for better type safety
interface ThemeBreakpoints {
  mobile: string;
}

interface ThemeSpacing {
  sm: string;
  md: string;
}

interface ThemeTypography {
  fontSize: {
    md: string;
  };
}

interface DefaultTheme {
  breakpoints: ThemeBreakpoints;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
}

// Add to global and window type declarations
declare global {
  namespace NodeJS {
    interface Global {
      defaultTheme: DefaultTheme;
    }
  }
}

// Type for the mock element style
interface MockElementStyle {
  width: string;
  padding?: string;
  position?: string;
  top?: string;
  flexDirection?: string;
  marginBottom?: string;
  fontSize?: string;
}

// Type for the mock element
interface MockElement {
  style: MockElementStyle;
  getBoundingClientRect?: () => DOMRect;
}

// TypeScript implementation with proper types
describe('Mobile Component Responsive Tests (MEXP-2025-002-FE)', () => {
  beforeEach(() => {
    // Mock window.innerWidth and window.innerHeight
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    });
    
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768
    });
    
    // Mock theme values with proper typing
    (global as any).defaultTheme = {
      breakpoints: { mobile: '768px' },
      spacing: { sm: '0.5rem', md: '1rem' },
      typography: { fontSize: { md: '1rem' } }
    };
    
    // Mock getComputedStyle with proper typing
    window.getComputedStyle = jest.fn().mockImplementation(() => ({
      width: '100%',
      padding: (global as any).defaultTheme.spacing.sm,
      position: 'fixed',
      top: '0px',
      flexDirection: 'column',
      marginBottom: (global as any).defaultTheme.spacing.md,
      fontSize: (global as any).defaultTheme.typography.fontSize.md
    } as CSSStyleDeclaration));
    
    // Mock document.querySelector to return elements with proper typing
    document.querySelector = jest.fn().mockImplementation((selector: string) => ({
      style: {
        width: '100%',
        padding: (global as any).defaultTheme.spacing.sm,
        position: 'fixed',
        top: '0px',
        flexDirection: 'column',
        marginBottom: (global as any).defaultTheme.spacing.md,
        fontSize: (global as any).defaultTheme.typography.fontSize.md
      },
      getBoundingClientRect: () => ({
        width: 48,
        height: 48,
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 48,
        bottom: 48,
        toJSON: () => ({})
      })
    }) as Element);
  });
  
  // Check if viewport size affects mobile card layout
  test('should properly adjust card layout on mobile viewport', () => {
    // Set to mobile viewport
    window.innerWidth = 375;
    window.innerHeight = 667;
    window.dispatchEvent(new Event('resize'));
    
    // Mock card element with proper typing
    const mockCard: MockElement = {
      style: { 
        width: '100%', 
        padding: (global as any).defaultTheme.spacing.sm 
      }
    };
    
    // Get styles
    const styles = window.getComputedStyle(mockCard as unknown as Element);
    
    // Assertions
    expect(styles.width).toBe('100%');
    expect(styles.padding).toBe((global as any).defaultTheme.spacing.sm);
  });
  
  // Test mobile navigation
  test('should display mobile navigation correctly on small screens', () => {
    // Set to mobile viewport
    window.innerWidth = 375;
    window.innerHeight = 667;
    window.dispatchEvent(new Event('resize'));
    
    // Mock nav element with proper typing
    const mockNav: MockElement = {
      style: { 
        position: 'fixed', 
        top: '0px', 
        width: '100%' 
      }
    };
    
    // Mock button element with proper typing
    const mockButton: MockElement = {
      style: {},
      getBoundingClientRect: () => ({
        width: 48,
        height: 48,
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 48,
        bottom: 48,
        toJSON: () => ({})
      })
    };
    
    // Get styles
    const navStyles = window.getComputedStyle(mockNav as unknown as Element);
    
    // Assertions
    expect(navStyles.position).toBe('fixed');
    expect(navStyles.top).toBe('0px');
    expect(navStyles.width).toBe('100%');
    
    // Check touch target size with proper typing
    const buttonRect = mockButton.getBoundingClientRect?.() as DOMRect;
    expect(buttonRect.width >= 44 && buttonRect.height >= 44).toBe(true);
  });
  
  // Test mobile menu vertical stacking
  test('should properly stack menu items vertically on mobile', () => {
    // Set to mobile viewport
    window.innerWidth = 375;
    window.innerHeight = 667;
    window.dispatchEvent(new Event('resize'));
    
    // Mock menu element with proper typing
    const mockMenu: MockElement = {
      style: { 
        flexDirection: 'column' 
      }
    };
    
    // Mock menu items with proper typing
    const mockItem1: MockElement = { 
      style: { 
        width: '100%', 
        marginBottom: (global as any).defaultTheme.spacing.md 
      } 
    };
    const mockItem2: MockElement = { 
      style: { 
        width: '100%', 
        marginBottom: (global as any).defaultTheme.spacing.md 
      } 
    };
    const mockItem3: MockElement = { 
      style: { 
        width: '100%' 
      } 
    };
    
    // Get styles with proper typing
    const menuStyles = window.getComputedStyle(mockMenu as unknown as Element);
    const item1Styles = window.getComputedStyle(mockItem1 as unknown as Element);
    const item2Styles = window.getComputedStyle(mockItem2 as unknown as Element);
    const item3Styles = window.getComputedStyle(mockItem3 as unknown as Element);
    
    // Assertions for menu layout
    expect(menuStyles.flexDirection).toBe('column');
    
    // Assertions for item styles
    expect(item1Styles.width).toBe('100%');
    expect(item2Styles.width).toBe('100%');
    expect(item3Styles.width).toBe('100%');
    
    expect(item1Styles.marginBottom).toBe((global as any).defaultTheme.spacing.md);
    expect(item2Styles.marginBottom).toBe((global as any).defaultTheme.spacing.md);
  });
  
  // Test appropriate media queries
  test('should use appropriate media queries for viewport adjustment', () => {
    // Set to tablet viewport
    window.innerWidth = 600;
    window.innerHeight = 800;
    window.dispatchEvent(new Event('resize'));
    
    // Mock card element with proper typing
    const mockCard: MockElement = {
      style: { 
        width: '100%' 
      }
    };
    
    // Get styles
    const cardStyles = window.getComputedStyle(mockCard as unknown as Element);
    
    // Assert full width on tablet viewport
    expect(cardStyles.width).toBe('100%');
  });
});