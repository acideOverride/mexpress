import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../../../../src/frontend/src/themes/defaultTheme';
import { Button } from '../../../../src/frontend/src/components/common/Button';
import { Input } from '../../../../src/frontend/src/components/common/Input';
import { Card } from '../../../../src/frontend/src/components/common/Card';

// Utility function to get computed styles
const getComputedStyles = (element: HTMLElement, property: string): string => {
  return window.getComputedStyle(element).getPropertyValue(property);
};

describe('Component Styling Consistency Tests (MEXP-2025-002-FE)', () => {
  const renderWithTheme = (ui: React.ReactNode) => {
    return render(<ThemeProvider theme={defaultTheme}>{ui}</ThemeProvider>);
  };

  it('should have consistent button styling across primary, secondary, and tertiary variants', () => {
    renderWithTheme(
      <>
        <Button variant="primary" data-testid="primary-button">Primary Button</Button>
        <Button variant="secondary" data-testid="secondary-button">Secondary Button</Button>
        <Button variant="tertiary" data-testid="tertiary-button">Tertiary Button</Button>
      </>
    );

    const primaryButton = screen.getByTestId('primary-button');
    const secondaryButton = screen.getByTestId('secondary-button');
    const tertiaryButton = screen.getByTestId('tertiary-button');

    // Check that all buttons have the same border-radius
    const primaryBorderRadius = getComputedStyles(primaryButton, 'border-radius');
    const secondaryBorderRadius = getComputedStyles(secondaryButton, 'border-radius');
    const tertiaryBorderRadius = getComputedStyles(tertiaryButton, 'border-radius');

    expect(primaryBorderRadius).toBe(defaultTheme.borderRadius.button);
    expect(secondaryBorderRadius).toBe(defaultTheme.borderRadius.button);
    expect(tertiaryBorderRadius).toBe(defaultTheme.borderRadius.button);

    // Check consistent padding
    const primaryPadding = getComputedStyles(primaryButton, 'padding');
    const secondaryPadding = getComputedStyles(secondaryButton, 'padding');
    const tertiaryPadding = getComputedStyles(tertiaryButton, 'padding');

    expect(primaryPadding).toBe(secondaryPadding);
    expect(secondaryPadding).toBe(tertiaryPadding);

    // Check font family consistency
    const primaryFontFamily = getComputedStyles(primaryButton, 'font-family');
    const secondaryFontFamily = getComputedStyles(secondaryButton, 'font-family');
    const tertiaryFontFamily = getComputedStyles(tertiaryButton, 'font-family');

    expect(primaryFontFamily).toBe(defaultTheme.typography.fontFamily);
    expect(secondaryFontFamily).toBe(defaultTheme.typography.fontFamily);
    expect(tertiaryFontFamily).toBe(defaultTheme.typography.fontFamily);
  });

  it('should maintain consistent input field styling', () => {
    renderWithTheme(
      <>
        <Input type="text" placeholder="Regular input" data-testid="regular-input" />
        <Input type="text" placeholder="Disabled input" disabled data-testid="disabled-input" />
        <Input type="text" placeholder="Error input" error data-testid="error-input" />
      </>
    );

    const regularInput = screen.getByTestId('regular-input');
    const disabledInput = screen.getByTestId('disabled-input');
    const errorInput = screen.getByTestId('error-input');

    // Check border-radius consistency
    const regularBorderRadius = getComputedStyles(regularInput, 'border-radius');
    const disabledBorderRadius = getComputedStyles(disabledInput, 'border-radius');
    const errorBorderRadius = getComputedStyles(errorInput, 'border-radius');

    expect(regularBorderRadius).toBe(defaultTheme.borderRadius.input);
    expect(disabledBorderRadius).toBe(defaultTheme.borderRadius.input);
    expect(errorBorderRadius).toBe(defaultTheme.borderRadius.input);

    // Check font-size consistency
    const regularFontSize = getComputedStyles(regularInput, 'font-size');
    const disabledFontSize = getComputedStyles(disabledInput, 'font-size');
    const errorFontSize = getComputedStyles(errorInput, 'font-size');

    expect(regularFontSize).toBe(disabledFontSize);
    expect(disabledFontSize).toBe(errorFontSize);
    
    // Check padding consistency
    const regularPadding = getComputedStyles(regularInput, 'padding');
    const disabledPadding = getComputedStyles(disabledInput, 'padding');
    const errorPadding = getComputedStyles(errorInput, 'padding');

    expect(regularPadding).toBe(disabledPadding);
    expect(disabledPadding).toBe(errorPadding);
  });

  it('should have consistent card styling', () => {
    renderWithTheme(
      <>
        <Card data-testid="default-card">Default Card</Card>
        <Card variant="elevated" data-testid="elevated-card">Elevated Card</Card>
        <Card variant="outlined" data-testid="outlined-card">Outlined Card</Card>
      </>
    );

    const defaultCard = screen.getByTestId('default-card');
    const elevatedCard = screen.getByTestId('elevated-card');
    const outlinedCard = screen.getByTestId('outlined-card');

    // Check border-radius consistency
    const defaultBorderRadius = getComputedStyles(defaultCard, 'border-radius');
    const elevatedBorderRadius = getComputedStyles(elevatedCard, 'border-radius');
    const outlinedBorderRadius = getComputedStyles(outlinedCard, 'border-radius');

    expect(defaultBorderRadius).toBe(defaultTheme.borderRadius.card);
    expect(elevatedBorderRadius).toBe(defaultTheme.borderRadius.card);
    expect(outlinedBorderRadius).toBe(defaultTheme.borderRadius.card);

    // Check background color contrast with text
    // This test is failing because of the inconsistent background colors
    // The outlined card has a transparent background but should have a slight
    // background color for better contrast with the text
    const defaultBackground = getComputedStyles(defaultCard, 'background-color');
    const elevatedBackground = getComputedStyles(elevatedCard, 'background-color');
    const outlinedBackground = getComputedStyles(outlinedCard, 'background-color');

    // This assertion is failing because outlinedBackground is 'transparent'
    // instead of a proper background color with alpha channel
    expect(outlinedBackground).not.toBe('transparent');
    
    // Check padding consistency
    const defaultPadding = getComputedStyles(defaultCard, 'padding');
    const elevatedPadding = getComputedStyles(elevatedCard, 'padding');
    const outlinedPadding = getComputedStyles(outlinedCard, 'padding');

    expect(defaultPadding).toBe(elevatedPadding);
    expect(elevatedPadding).toBe(outlinedPadding);
  });
});