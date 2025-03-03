import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../themes/defaultTheme';

interface MobileCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: any; // For data-testid and other props
}

// The styled component with the fixed responsive breakpoints
const CardContainer = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.card};
  background-color: ${props => props.theme.colors.background.default};
  box-shadow: ${props => props.theme.shadows.sm};
  width: 80%; // Default width for desktop
  margin: ${props => props.theme.spacing.md} auto;
  
  /* 
   * Fixed issue: Using consistent breakpoint from theme
   * Previously using hardcoded 600px breakpoint instead of theme value
   */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
    padding: ${props => props.theme.spacing.sm};
    margin: ${props => props.theme.spacing.sm} 0;
  }
`;

const CardTitle = styled.h3`
  font-family: ${props => props.theme.typography.fontFamily};
  font-weight: ${props => props.theme.typography.fontWeightBold};
  font-size: ${props => props.theme.typography.fontSize.lg};
  margin-top: 0;
  margin-bottom: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.typography.fontSize.md};
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

const CardContent = styled.div`
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.fontSize.md};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: ${props => props.theme.typography.fontSize.sm};
  }
`;

export const MobileCard: React.FC<MobileCardProps> = ({
  title,
  children,
  className,
  ...rest
}) => {
  return (
    <CardContainer className={className} {...rest}>
      <CardTitle>{title}</CardTitle>
      <CardContent>{children}</CardContent>
    </CardContainer>
  );
};