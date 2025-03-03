import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../themes/defaultTheme';

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any; // For data-testid and other props
}

// The MobileNav component with proper responsive styles
const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text.white};
  padding: ${props => props.theme.spacing.md};
  
  /* Desktop styles */
  position: static;
  width: auto;
  
  /* 
   * Mobile styles using consistent breakpoint from theme
   * Now using the standardized breakpoint from the theme
   */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    padding: ${props => props.theme.spacing.sm};
    z-index: ${props => props.theme.zIndex.appBar};
  }
`;

// Special styling for buttons within the nav to ensure proper touch targets
const NavButton = styled.button`
  background-color: transparent;
  color: ${props => props.theme.colors.text.white};
  border: none;
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.fontSize.md};
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.duration.short} ${props => props.theme.transitions.easing.easeInOut};
  
  /* Desktop styles */
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  
  /* Mobile styles with improved touch targets */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    /* Ensure minimum 44x44px touch target size for accessibility */
    min-width: 44px;
    min-height: 44px;
    padding: ${props => props.theme.spacing.sm};
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.text.white};
    outline-offset: 2px;
  }
`;

// Automatically enhance direct button children with proper styling
export const MobileNav: React.FC<MobileNavProps> = ({
  children,
  className,
  ...rest
}) => {
  // Apply NavButton styling to direct button children
  const enhancedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type === 'button') {
      return (
        <NavButton {...child.props}>
          {child.props.children}
        </NavButton>
      );
    }
    return child;
  });

  return (
    <NavContainer className={className} {...rest}>
      {enhancedChildren}
    </NavContainer>
  );
};