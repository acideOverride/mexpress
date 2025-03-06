import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../themes/defaultTheme';

interface MobileMenuProps {
  children: React.ReactNode;
  isOpen?: boolean;
  className?: string;
  [key: string]: any; // For data-testid and other props
}

// The MobileMenu component with proper responsive layout
const MenuContainer = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: row; // Default for desktop
  justify-content: flex-start;
  align-items: center;
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.sm};
  
  /* Desktop style has horizontal layout */
  & > * {
    margin-right: ${props => props.theme.spacing.md};
    
    &:last-child {
      margin-right: 0;
    }
  }
  
  /* Mobile style has vertical layout */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column; // Stack items vertically on mobile
    width: 100%;
    padding: ${props => props.theme.spacing.sm};
    
    & > * {
      margin-right: 0;
      margin-bottom: ${props => props.theme.spacing.md};
      width: 100%; // Full width items on mobile
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

// Ensure menu items have proper touch target sizes on mobile
const MenuItem = styled.button`
  background-color: ${props => props.theme.colors.background.default};
  color: ${props => props.theme.colors.text.primary};
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.fontSize.md};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.duration.short} ${props => props.theme.transitions.easing.easeInOut};
  
  /* Ensure sufficient touch target size on mobile */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    min-height: 44px; // WCAG recommendation for touch targets
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: ${props => props.theme.spacing.md};
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.tertiary};
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
`;

// Enhance direct button children with proper MenuItem styling
export const MobileMenu: React.FC<MobileMenuProps> = ({
  children,
  isOpen = true,
  className,
  ...rest
}) => {
  // Apply MenuItem styling to direct button children
  const enhancedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type === 'button') {
      return (
        <MenuItem {...child.props}>
          {child.props.children}
        </MenuItem>
      );
    }
    return child;
  });

  return (
    <MenuContainer isOpen={isOpen} className={className} {...rest}>
      {enhancedChildren}
    </MenuContainer>
  );
};