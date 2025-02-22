import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from '../RegisterForm';
import { useAuth } from '../AuthContext';
import { AuthError } from '../../../types/auth';

jest.mock('../AuthContext', () => ({
    useAuth: jest.fn()
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('RegisterForm', () => {
    const mockRegister = jest.fn();
    const mockClearError = jest.fn();
    const defaultProps = {
        onSuccess: jest.fn(),
        onError: jest.fn(),
        redirectPath: '/dashboard'
    };

    beforeEach(() => {
        mockUseAuth.mockReturnValue({
            register: mockRegister,
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

    it('renders register form correctly', () => {
        render(<RegisterForm {...defaultProps} />);

        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('shows validation errors for empty fields', async () => {
        render(<RegisterForm {...defaultProps} />);
        
        const submitButton = screen.getByRole('button', { name: /sign up/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/last name is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    });

    it('shows validation error for invalid email', async () => {
        render(<RegisterForm {...defaultProps} />);
        
        const emailInput = screen.getByLabelText(/email/i);
        await userEvent.type(emailInput, 'invalid-email');
        
        const submitButton = screen.getByRole('button', { name: /sign up/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
    });

    it('shows validation error for password mismatch', async () => {
        render(<RegisterForm {...defaultProps} />);
        
        const passwordInput = screen.getByLabelText(/^password$/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
        
        await userEvent.type(passwordInput, 'password123');
        await userEvent.type(confirmPasswordInput, 'password456');
        
        const submitButton = screen.getByRole('button', { name: /sign up/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    });

    it('shows validation error for weak password', async () => {
        render(<RegisterForm {...defaultProps} />);
        
        const passwordInput = screen.getByLabelText(/^password$/i);
        await userEvent.type(passwordInput, 'weak');
        
        const submitButton = screen.getByRole('button', { name: /sign up/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });

    it('calls register function with correct data', async () => {
        render(<RegisterForm {...defaultProps} />);
        
        const firstNameInput = screen.getByLabelText(/first name/i);
        const lastNameInput = screen.getByLabelText(/last name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
        
        await userEvent.type(firstNameInput, 'John');
        await userEvent.type(lastNameInput, 'Doe');
        await userEvent.type(emailInput, 'john@example.com');
        await userEvent.type(passwordInput, 'password123');
        await userEvent.type(confirmPasswordInput, 'password123');
        
        const submitButton = screen.getByRole('button', { name: /sign up/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123'
            });
        });
    });

    it('shows loading state during form submission', () => {
        mockUseAuth.mockReturnValue({
            register: mockRegister,
            clearError: mockClearError,
            loading: true,
            error: null,
            user: null,
            isAuthenticated: false
        } as any);

        render(<RegisterForm {...defaultProps} />);
        
        expect(screen.getByRole('button', { name: /signing up/i })).toBeDisabled();
    });

    it('displays auth error message', () => {
        const error: AuthError = { message: 'Email already exists' };
        mockUseAuth.mockReturnValue({
            register: mockRegister,
            clearError: mockClearError,
            loading: false,
            error,
            user: null,
            isAuthenticated: false
        } as any);

        render(<RegisterForm {...defaultProps} />);
        
        expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });

    it('clears error when form is modified', async () => {
        const error: AuthError = { message: 'Email already exists' };
        mockUseAuth.mockReturnValue({
            register: mockRegister,
            clearError: mockClearError,
            loading: false,
            error,
            user: null,
            isAuthenticated: false
        } as any);

        render(<RegisterForm {...defaultProps} />);
        
        const emailInput = screen.getByLabelText(/email/i);
        await userEvent.type(emailInput, 'a');

        expect(mockClearError).toHaveBeenCalled();
    });

    it('calls onSuccess callback after successful registration', async () => {
        mockRegister.mockResolvedValueOnce(undefined);
        
        render(<RegisterForm {...defaultProps} />);
        
        const firstNameInput = screen.getByLabelText(/first name/i);
        const lastNameInput = screen.getByLabelText(/last name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
        
        await userEvent.type(firstNameInput, 'John');
        await userEvent.type(lastNameInput, 'Doe');
        await userEvent.type(emailInput, 'john@example.com');
        await userEvent.type(passwordInput, 'password123');
        await userEvent.type(confirmPasswordInput, 'password123');
        
        const submitButton = screen.getByRole('button', { name: /sign up/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(defaultProps.onSuccess).toHaveBeenCalled();
        });
    });

    it('calls onError callback when registration fails', async () => {
        const error = new Error('Registration failed');
        mockRegister.mockRejectedValueOnce(error);
        
        render(<RegisterForm {...defaultProps} />);
        
        const firstNameInput = screen.getByLabelText(/first name/i);
        const lastNameInput = screen.getByLabelText(/last name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
        
        await userEvent.type(firstNameInput, 'John');
        await userEvent.type(lastNameInput, 'Doe');
        await userEvent.type(emailInput, 'john@example.com');
        await userEvent.type(passwordInput, 'password123');
        await userEvent.type(confirmPasswordInput, 'password123');
        
        const submitButton = screen.getByRole('button', { name: /sign up/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(defaultProps.onError).toHaveBeenCalledWith(error);
        });
    });
});