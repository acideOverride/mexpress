import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../themes/defaultTheme';

interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  children: React.ReactNode;
  className?: string;
  [key: string]: any; // For data-testid and other props
}

interface StyledCardProps {
  variant: 'default' | 'elevated' | 'outlined';
  theme: Theme;
}

// The styled component with the styling issue in the outlined variant
const StyledCard = styled.div<StyledCardProps>`
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.card};
  
  ${props => {
    switch(props.variant) {
      case 'elevated':
        return `
          background-color: ${props.theme.colors.background.default};
          box-shadow: ${props.theme.shadows.md};
        `;
      case 'outlined':
        return `
          /* Fixed the issue - now using a light background color instead of transparent */
          background-color: ${props.theme.colors.background.paper};
          border: 1px solid ${props.theme.colors.border.light};
        `;
      default:
        return `
          background-color: ${props.theme.colors.background.default};
          box-shadow: ${props.theme.shadows.xs};
        `;
    }
  }}
  
  /* Common styles */
  transition: 
    box-shadow ${props => props.theme.transitions.duration.medium} ${props => props.theme.transitions.easing.easeInOut},
    transform ${props => props.theme.transitions.duration.medium} ${props => props.theme.transitions.easing.easeInOut};
`;

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className,
  ...rest
}) => {
  return (
    <StyledCard
      variant={variant}
      className={className}
      {...rest}
    >
      {children}
    </StyledCard>
  );
};