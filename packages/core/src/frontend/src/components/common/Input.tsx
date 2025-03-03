import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../themes/defaultTheme';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  id?: string;
  name?: string;
  required?: boolean;
  className?: string;
  [key: string]: any; // For data-testid and other props
}

interface StyledInputProps {
  error: boolean;
  disabled: boolean;
  theme: Theme;
}

const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${props => props.theme.spacing.md};
  width: 100%;
`;

const StyledInput = styled.input<StyledInputProps>`
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.fontSize.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.input};
  border: 1px solid ${props => 
    props.error 
      ? props.theme.colors.error 
      : props.disabled 
        ? props.theme.colors.border.light 
        : props.theme.colors.border.medium
  };
  background-color: ${props => 
    props.disabled 
      ? props.theme.colors.background.paper 
      : props.theme.colors.background.default
  };
  color: ${props => 
    props.disabled 
      ? props.theme.colors.text.disabled 
      : props.theme.colors.text.primary
  };
  outline: none;
  transition: border-color ${props => props.theme.transitions.duration.short} ${props => props.theme.transitions.easing.easeInOut};
  
  &:focus {
    border-color: ${props => 
      props.error 
        ? props.theme.colors.error 
        : props.theme.colors.primary
    };
    box-shadow: 0 0 0 2px ${props => 
      props.error 
        ? `${props.theme.colors.error}33` 
        : `${props.theme.colors.primary}33`
    };
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.text.hint};
  }
`;

const ErrorMessage = styled.span`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.typography.fontSize.xs};
  margin-top: ${props => props.theme.spacing.xs};
`;

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
  errorMessage,
  id,
  name,
  required = false,
  className,
  ...rest
}) => {
  // Generate a unique ID if one wasn't provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  // Generate error message ID if error message exists
  const errorId = error && errorMessage ? `${inputId}-error` : undefined;
  
  return (
    <StyledInputContainer>
      <StyledInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        error={error}
        id={inputId}
        name={name}
        required={required}
        className={className}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={errorId}
        aria-required={required ? 'true' : undefined}
        aria-disabled={disabled ? 'true' : undefined}
        {...rest}
      />
      {error && errorMessage && (
        <ErrorMessage id={errorId} role="alert">
          {errorMessage}
        </ErrorMessage>
      )}
    </StyledInputContainer>
  );
};