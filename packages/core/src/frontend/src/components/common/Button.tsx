import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../themes/defaultTheme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  className?: string;
  [key: string]: any; // For data-testid and other props
}

interface StyledButtonProps {
  variant: 'primary' | 'secondary' | 'tertiary';
  size: 'small' | 'medium' | 'large';
  disabled: boolean;
  fullWidth: boolean;
  theme: Theme;
}

const getButtonStyles = (props: StyledButtonProps) => {
  const { variant, theme } = props;
  
  // Base styles common to all variants
  const baseStyles = `
    font-family: ${theme.typography.fontFamily};
    border-radius: ${theme.borderRadius.button};
    font-weight: ${theme.typography.fontWeightMedium};
    transition: background-color ${theme.transitions.duration.short} ${theme.transitions.easing.easeInOut},
                box-shadow ${theme.transitions.duration.short} ${theme.transitions.easing.easeInOut};
    cursor: ${props.disabled ? 'not-allowed' : 'pointer'};
    opacity: ${props.disabled ? 0.6 : 1};
    width: ${props.fullWidth ? '100%' : 'auto'};
  `;
  
  // Size specific styles
  const sizeStyles = {
    small: `
      padding: ${theme.spacing.xs} ${theme.spacing.sm};
      font-size: ${theme.typography.fontSize.xs};
    `,
    medium: `
      padding: ${theme.spacing.sm} ${theme.spacing.md};
      font-size: ${theme.typography.fontSize.sm};
    `,
    large: `
      padding: ${theme.spacing.md} ${theme.spacing.lg};
      font-size: ${theme.typography.fontSize.md};
    `
  };
  
  // Variant specific styles
  const variantStyles = {
    primary: `
      background-color: ${theme.colors.primary};
      color: ${theme.colors.text.white};
      border: none;
      &:hover {
        background-color: ${props.disabled ? theme.colors.primary : '#1565c0'};
      }
    `,
    secondary: `
      background-color: ${theme.colors.secondary};
      color: ${theme.colors.text.white};
      border: none;
      &:hover {
        background-color: ${props.disabled ? theme.colors.secondary : '#303030'};
      }
    `,
    tertiary: `
      background-color: transparent;
      color: ${theme.colors.primary};
      border: 1px solid ${theme.colors.primary};
      &:hover {
        background-color: ${props.disabled ? 'transparent' : 'rgba(25, 118, 210, 0.08)'};
      }
    `
  };
  
  return `
    ${baseStyles}
    ${sizeStyles[props.size]}
    ${variantStyles[variant]}
  `;
};

const StyledButton = styled.button<StyledButtonProps>`
  ${props => getButtonStyles(props)}
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  children,
  className,
  ...rest
}) => {
  // Handle keyboard accessibility - support Enter and Space keys for activation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
      event.preventDefault();
      onClick && onClick(event as unknown as React.MouseEvent<HTMLButtonElement>);
    }
  };

  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      type={type}
      className={className}
      aria-disabled={disabled ? 'true' : undefined}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};