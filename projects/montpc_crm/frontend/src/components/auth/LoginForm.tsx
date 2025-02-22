import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { LoginCredentials } from '../../types/auth';

interface LoginFormProps {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    redirectPath?: string;
}

interface FormErrors {
    email?: string;
    password?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    onSuccess,
    onError,
    redirectPath = '/dashboard'
}) => {
    const { login, loading, error, clearError } = useAuth();
    const [formData, setFormData] = useState<LoginCredentials>({
        email: '',
        password: ''
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (error) {
            onError?.(new Error(error.message));
        }
    }, [error, onError]);

    const validateForm = (): boolean => {
        const errors: FormErrors = {};
        
        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            errors.email = 'Invalid email format';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) {
            clearError();
        }
        // Clear field-specific error
        if (formErrors[name as keyof FormErrors]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            await login(formData.email, formData.password);
            onSuccess?.();
        } catch (err) {
            // Error is handled by AuthContext and useEffect above
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                >
                    Email
                </label>
                <div className="mt-1">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                            focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm
                            ${formErrors.email || error ? 'border-red-300' : 'border-gray-300'}`}
                    />
                    {formErrors.email && (
                        <p className="mt-2 text-sm text-red-600">
                            {formErrors.email}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                >
                    Password
                </label>
                <div className="mt-1">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                            focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm
                            ${formErrors.password || error ? 'border-red-300' : 'border-gray-300'}`}
                    />
                    {formErrors.password && (
                        <p className="mt-2 text-sm text-red-600">
                            {formErrors.password}
                        </p>
                    )}
                </div>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">
                                {error.message}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                        ${loading ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'} 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>
            </div>
        </form>
    );
};