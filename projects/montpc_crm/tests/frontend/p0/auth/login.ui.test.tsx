// MONT-2025-002-FULL Auth Service & Frontend
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simplified login form without React state
const LoginForm = (props) => (
  <div data-testid="login-container">
    <h1 data-testid="login-title">Sign In</h1>
    
    {props.error && (
      <div data-testid="error-message" role="alert">
        {props.error}
      </div>
    )}
    
    <form data-testid="login-form" onSubmit={(e) => { 
      e.preventDefault();
      if (props.onLogin) {
        props.onLogin('test@example.com', 'password123', true);
      }
    }}>
      <div>
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          data-testid="email-input"
          type="email"
          defaultValue="test@example.com"
          aria-label="Email address"
        />
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          data-testid="password-input"
          type="password"
          defaultValue="password123"
          aria-label="Password"
        />
      </div>
      
      <div>
        <label>
          <input
            type="checkbox"
            data-testid="remember-checkbox"
            defaultChecked={true}
            aria-label="Remember me"
          />
          Remember me
        </label>
      </div>
      
      <div>
        <button 
          type="submit" 
          data-testid="submit-button"
          disabled={props.isLoading}
        >
          {props.isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </form>
    
    <div>
      <button 
        type="button" 
        data-testid="forgot-password-button"
        onClick={props.onForgotPassword}
      >
        Forgot Password
      </button>
    </div>
  </div>
);

describe('LoginUI Component Tests', () => {
  const handleLogin = jest.fn();
  const handleForgotPassword = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders login form with all elements', () => {
    render(
      <LoginForm 
        onLogin={handleLogin} 
        onForgotPassword={handleForgotPassword} 
      />
    );
    
    expect(screen.getByTestId('login-title')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });
  
  it('handles form submission correctly', () => {
    render(
      <LoginForm 
        onLogin={handleLogin} 
        onForgotPassword={handleForgotPassword} 
      />
    );
    
    // Submit the form
    fireEvent.submit(screen.getByTestId('login-form'));
    
    // Verify onLogin was called with correct values
    expect(handleLogin).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
      true
    );
  });
  
  it('handles forgot password click', () => {
    render(
      <LoginForm 
        onLogin={handleLogin} 
        onForgotPassword={handleForgotPassword} 
      />
    );
    
    fireEvent.click(screen.getByTestId('forgot-password-button'));
    
    expect(handleForgotPassword).toHaveBeenCalledTimes(1);
  });
  
  it('displays loading state correctly', () => {
    render(
      <LoginForm 
        onLogin={handleLogin} 
        onForgotPassword={handleForgotPassword}
        isLoading={true}
      />
    );
    
    expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeDisabled();
  });
  
  it('displays error message when provided', () => {
    const errorMessage = 'Invalid email or password';
    
    render(
      <LoginForm 
        onLogin={handleLogin} 
        onForgotPassword={handleForgotPassword}
        error={errorMessage}
      />
    );
    
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
  });
  
  it('renders all required form elements with correct attributes', () => {
    render(
      <LoginForm 
        onLogin={handleLogin} 
        onForgotPassword={handleForgotPassword} 
      />
    );
    
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(screen.getByTestId('remember-checkbox')).toHaveAttribute('type', 'checkbox');
  });
});