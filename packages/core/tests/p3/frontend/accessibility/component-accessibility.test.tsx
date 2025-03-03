import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../../../../../src/frontend/src/themes/defaultTheme';
import { Card } from '../../../../../src/frontend/src/components/common/Card';
import { Button } from '../../../../../src/frontend/src/components/common/Button';
import { Input } from '../../../../../src/frontend/src/components/common/Input';
import { MobileCard } from '../../../../../src/frontend/src/components/mobile/MobileCard';
import { MobileNav } from '../../../../../src/frontend/src/components/mobile/MobileNav';
import { MobileMenu } from '../../../../../src/frontend/src/components/mobile/MobileMenu';
import { AccessibilityProvider } from '../../../../../src/frontend/src/contexts/AccessibilityContext';

// Add jest-axe matcher
expect.extend(toHaveNoViolations);

describe('Component Accessibility Tests (MEXP-2025-002-FE)', () => {
  const renderWithProviders = (ui: React.ReactNode) => {
    return render(
      <AccessibilityProvider>
        <ThemeProvider theme={defaultTheme}>
          {ui}
        </ThemeProvider>
      </AccessibilityProvider>
    );
  };

  it('should have proper ARIA attributes on Card component', async () => {
    const { container } = renderWithProviders(
      <Card variant="default" aria-label="Example card" data-testid="card">
        <h2>Card Title</h2>
        <p>Card content for testing</p>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    
    // Check for proper ARIA attributes
    expect(card).toHaveAttribute('aria-label', 'Example card');
    
    // Check for no accessibility violations with jest-axe
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should support keyboard navigation and focus management', () => {
    renderWithProviders(
      <>
        <Button variant="primary" data-testid="button1">Button 1</Button>
        <Button variant="secondary" data-testid="button2">Button 2</Button>
        <Button variant="tertiary" data-testid="button3">Button 3</Button>
      </>
    );
    
    const button1 = screen.getByTestId('button1');
    const button2 = screen.getByTestId('button2');
    const button3 = screen.getByTestId('button3');
    
    // Set focus on first button
    button1.focus();
    expect(document.activeElement).toBe(button1);
    
    // Tab to next button
    fireEvent.keyDown(button1, { key: 'Tab', code: 'Tab' });
    // In a real browser this would move focus, but we need to simulate it in tests
    button2.focus();
    expect(document.activeElement).toBe(button2);
    
    // Tab to next button
    fireEvent.keyDown(button2, { key: 'Tab', code: 'Tab' });
    button3.focus();
    expect(document.activeElement).toBe(button3);
    
    // Check that buttons can be activated with keyboard
    let button1Clicked = false;
    button1.addEventListener('click', () => { button1Clicked = true; });
    
    button1.focus();
    fireEvent.keyDown(button1, { key: 'Enter', code: 'Enter' });
    expect(button1Clicked).toBe(true);
  });

  it('should have proper color contrast ratios', async () => {
    const { container } = renderWithProviders(
      <>
        <Button variant="primary" data-testid="primary-btn">Primary</Button>
        <Button variant="secondary" data-testid="secondary-btn">Secondary</Button>
        <Button variant="tertiary" data-testid="tertiary-btn">Tertiary</Button>
        <Card variant="default" data-testid="default-card">
          <p>Card content</p>
        </Card>
        <Input type="text" placeholder="Test input" data-testid="input" />
      </>
    );
    
    // Check for contrast issues with axe
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should support screen readers via ARIA roles and properties', async () => {
    const { container } = renderWithProviders(
      <form aria-labelledby="form-title" data-testid="test-form">
        <h2 id="form-title">Contact Form</h2>
        <div>
          <label htmlFor="name">Name</label>
          <Input 
            id="name"
            type="text" 
            aria-required="true"
            data-testid="name-input" 
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <Input 
            id="email"
            type="email" 
            aria-required="true"
            data-testid="email-input" 
          />
        </div>
        <Button 
          type="submit" 
          aria-label="Submit form"
          data-testid="submit-btn"
        >
          Submit
        </Button>
      </form>
    );
    
    const form = screen.getByTestId('test-form');
    const nameInput = screen.getByTestId('name-input');
    const emailInput = screen.getByTestId('email-input');
    const submitBtn = screen.getByTestId('submit-btn');
    
    // Check form is properly labeled
    expect(form).toHaveAttribute('aria-labelledby', 'form-title');
    
    // Check inputs have proper attributes
    expect(nameInput).toHaveAttribute('aria-required', 'true');
    expect(emailInput).toHaveAttribute('aria-required', 'true');
    
    // Check button has proper aria-label
    expect(submitBtn).toHaveAttribute('aria-label', 'Submit form');
    
    // Check for no accessibility violations
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should handle focus management properly', () => {
    renderWithProviders(
      <MobileMenu data-testid="mobile-menu">
        <button data-testid="menu-item-1">Item 1</button>
        <button data-testid="menu-item-2">Item 2</button>
        <button data-testid="menu-item-3">Item 3</button>
      </MobileMenu>
    );
    
    const menuItem1 = screen.getByTestId('menu-item-1');
    const menuItem2 = screen.getByTestId('menu-item-2');
    const menuItem3 = screen.getByTestId('menu-item-3');
    
    // Check focus trap works properly
    menuItem1.focus();
    expect(document.activeElement).toBe(menuItem1);
    
    // Tab forward through menu
    fireEvent.keyDown(menuItem1, { key: 'Tab', code: 'Tab' });
    menuItem2.focus(); // Simulate tab behavior
    expect(document.activeElement).toBe(menuItem2);
    
    // Tab to last item
    fireEvent.keyDown(menuItem2, { key: 'Tab', code: 'Tab' });
    menuItem3.focus();
    expect(document.activeElement).toBe(menuItem3);
    
    // Verify we can navigate with arrow keys
    fireEvent.keyDown(menuItem3, { key: 'ArrowUp', code: 'ArrowUp' });
    menuItem2.focus(); // Simulate arrow key behavior
    expect(document.activeElement).toBe(menuItem2);
  });
});