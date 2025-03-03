import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../../../../../src/frontend/src/themes/defaultTheme';
import { MobileCard } from '../../../../../src/frontend/src/components/mobile/MobileCard';
import { MobileNav } from '../../../../../src/frontend/src/components/mobile/MobileNav';
import { MobileMenu } from '../../../../../src/frontend/src/components/mobile/MobileMenu';

// Helper function to set viewport size
const setViewportSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: height });
  window.dispatchEvent(new Event('resize'));
};

// Helper to check if element is properly sized for touch targets
const hasSufficientTouchTargetSize = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  // WCAG recommends at least 44x44px for touch targets
  return rect.width >= 44 && rect.height >= 44;
};

describe('Mobile Component Responsive Tests (MEXP-2025-002-FE)', () => {
  const renderWithTheme = (ui: React.ReactNode) => {
    return render(<ThemeProvider theme={defaultTheme}>{ui}</ThemeProvider>);
  };

  beforeEach(() => {
    // Reset viewport to desktop size before each test
    setViewportSize(1024, 768);
  });

  it('should properly adjust card layout on mobile viewport', () => {
    // Set to mobile viewport
    setViewportSize(375, 667); // iPhone 8 size
    
    renderWithTheme(
      <MobileCard title="Test Card" data-testid="mobile-card">
        <div>Card content</div>
      </MobileCard>
    );
    
    const card = screen.getByTestId('mobile-card');
    const styles = window.getComputedStyle(card);
    
    // Check card takes full width on mobile
    expect(styles.width).toBe('100%');
    
    // Check padding is reduced on mobile
    expect(styles.padding).toBe(defaultTheme.spacing.sm);
    
    // Check font size is adjusted for mobile
    const titleElement = card.querySelector('h3');
    if (titleElement) {
      const titleStyles = window.getComputedStyle(titleElement);
      expect(titleStyles.fontSize).toBe(defaultTheme.typography.fontSize.md);
    }
  });

  it('should display mobile navigation correctly on small screens', () => {
    // Set to mobile viewport
    setViewportSize(375, 667); // iPhone 8 size
    
    renderWithTheme(
      <MobileNav data-testid="mobile-nav">
        <button data-testid="nav-button">Menu</button>
      </MobileNav>
    );
    
    const nav = screen.getByTestId('mobile-nav');
    const navButton = screen.getByTestId('nav-button');
    
    // Check nav has proper mobile styling
    const navStyles = window.getComputedStyle(nav);
    expect(navStyles.position).toBe('fixed');
    expect(navStyles.top).toBe('0px');
    expect(navStyles.width).toBe('100%');
    
    // Check button has sufficient touch target size
    expect(hasSufficientTouchTargetSize(navButton)).toBe(true);
  });

  it('should properly stack menu items vertically on mobile', () => {
    // Set to mobile viewport
    setViewportSize(375, 667);
    
    renderWithTheme(
      <MobileMenu data-testid="mobile-menu">
        <button data-testid="menu-item-1">Item 1</button>
        <button data-testid="menu-item-2">Item 2</button>
        <button data-testid="menu-item-3">Item 3</button>
      </MobileMenu>
    );
    
    const menu = screen.getByTestId('mobile-menu');
    const menuStyles = window.getComputedStyle(menu);
    
    // Check flex direction is column on mobile
    expect(menuStyles.flexDirection).toBe('column');
    
    // Check all menu items are full width
    const menuItem1 = screen.getByTestId('menu-item-1');
    const menuItem2 = screen.getByTestId('menu-item-2');
    const menuItem3 = screen.getByTestId('menu-item-3');
    
    const item1Styles = window.getComputedStyle(menuItem1);
    const item2Styles = window.getComputedStyle(menuItem2);
    const item3Styles = window.getComputedStyle(menuItem3);
    
    expect(item1Styles.width).toBe('100%');
    expect(item2Styles.width).toBe('100%');
    expect(item3Styles.width).toBe('100%');
    
    // Check sufficient spacing between items
    expect(item1Styles.marginBottom).toBe(defaultTheme.spacing.md);
    expect(item2Styles.marginBottom).toBe(defaultTheme.spacing.md);
    
    // Check touch target sizes
    expect(hasSufficientTouchTargetSize(menuItem1)).toBe(true);
    expect(hasSufficientTouchTargetSize(menuItem2)).toBe(true);
    expect(hasSufficientTouchTargetSize(menuItem3)).toBe(true);
  });

  it('should use appropriate media queries for viewport adjustment', () => {
    // This test is failing because the media query breakpoints are inconsistent
    // The component is using a breakpoint of 600px but the theme defines mobile as 768px
    
    // Set viewport to tablet size
    setViewportSize(600, 800);
    
    renderWithTheme(
      <MobileCard title="Test Card" data-testid="mobile-card">
        <div>Card content</div>
      </MobileCard>
    );
    
    const card = screen.getByTestId('mobile-card');
    const cardStyles = window.getComputedStyle(card);
    
    // This is failing because the card is still showing desktop styles at 600px
    // It should be using mobile styles at this width according to our theme
    expect(cardStyles.width).toBe('100%');
  });
});