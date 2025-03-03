import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';
import { useAuth } from './AuthContext';
import { AuthError } from '../types/auth';

// Mock useAuth hook
jest.mock('./AuthContext', () => ({
    useAuth: jest.fn()
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('LoginForm', () => {
    const mockLogin = jest.fn();
    const mockClearError = jest.fn();
    const defaultProps = {
        onSuccess: jest.fn(),
        onError: jest.fn(),
        redirectPath: '/dashboard'
    };

    beforeEach(() => {
        mockUseAuth.mockReturnValue({
            login: mockLogin,
            clearError: mockClearError,
            loading: false,
            error: null,
            user: null,
            isAuthenticated: false
        } as any);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders login form correctly', () => {
        render(<LoginForm {...defaultProps} />);

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('shows validation errors for empty fields', async () => {
        render(<LoginForm {...defaultProps} />);
        
        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    });

    it('shows validation error for invalid email', async () => {
        render(<LoginForm {...defaultProps} />);
        
        const emailInput = screen.getByLabelText(/email/i);
        await userEvent.type(emailInput, 'invalid-email');
        
        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
    });

    it('calls login function with correct data', async () => {
        render(<LoginForm {...defaultProps} />);
        
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        
        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'password123');
        
        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
        });
    });

    it('shows loading state during form submission', async () => {
        mockUseAuth.mockReturnValue({
            login: mockLogin,
            clearError: mockClearError,
            loading: true,
            error: null,
            user: null,
            isAuthenticated: false
        } as any);

        render(<LoginForm {...defaultProps} />);
        
        expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
    });

    it('displays auth error message', async () => {
        const error: AuthError = { message: 'Invalid credentials' };
        mockUseAuth.mockReturnValue({
            login: mockLogin,
            clearError: mockClearError,
            loading: false,
            error,
            user: null,
            isAuthenticated: false
        } as any);

        render(<LoginForm {...defaultProps} />);
        
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    it('clears error when form is modified', async () => {
        const error: AuthError = { message: 'Invalid credentials' };
        mockUseAuth.mockReturnValue({
            login: mockLogin,
            clearError: mockClearError,
            loading: false,
            error,
            user: null,
            isAuthenticated: false
        } as any);

        render(<LoginForm {...defaultProps} />);
        
        const emailInput = screen.getByLabelText(/email/i);
        await userEvent.type(emailInput, 'a');

        expect(mockClearError).toHaveBeenCalled();
    });

    it('calls onSuccess callback after successful login', async () => {
        mockLogin.mockResolvedValueOnce(undefined);
        
        render(<LoginForm {...defaultProps} />);
        
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        
        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'password123');
        
        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(defaultProps.onSuccess).toHaveBeenCalled();
        });
    });

    it('calls onError callback when login fails', async () => {
        const error = new Error('Login failed');
        mockLogin.mockRejectedValueOnce(error);
        
        render(<LoginForm {...defaultProps} />);
        
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        
        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'password123');
        
        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(defaultProps.onError).toHaveBeenCalledWith(error);
        });
    });
});