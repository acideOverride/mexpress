import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from './AuthContext';

jest.mock('./AuthContext', () => ({
    useAuth: jest.fn()
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('ProtectedRoute', () => {
    const TestComponent = () => <div>Protected Content</div>;
    const LoginComponent = () => <div>Login Page</div>;

    const renderWithRouter = (
        isAuthenticated: boolean,
        loading: boolean = false,
        roles: string[] = []
    ) => {
        mockUseAuth.mockReturnValue({
            isAuthenticated,
            loading,
            user: isAuthenticated ? { role: 'user' } : null
        } as any);

        return render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/login" element={<LoginComponent />} />
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute roles={roles}>
                                <TestComponent />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );
    };

    it('renders loading state when authenticating', () => {
        renderWithRouter(false, true);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('redirects to login when not authenticated', () => {
        renderWithRouter(false);
        expect(screen.getByText(/login page/i)).toBeInTheDocument();
    });

    it('renders protected content when authenticated', () => {
        renderWithRouter(true);
        expect(screen.getByText(/protected content/i)).toBeInTheDocument();
    });

    it('renders protected content when user has required role', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            loading: false,
            user: { role: 'admin' }
        } as any);

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/login" element={<LoginComponent />} />
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute roles={['admin']}>
                                <TestComponent />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/protected content/i)).toBeInTheDocument();
    });

    it('redirects when user does not have required role', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            loading: false,
            user: { role: 'user' }
        } as any);

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/login" element={<LoginComponent />} />
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute roles={['admin']}>
                                <TestComponent />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/login page/i)).toBeInTheDocument();
    });

    it('renders fallback component when provided and not authenticated', () => {
        const FallbackComponent = () => <div>Custom Fallback</div>;

        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            loading: false,
            user: null
        } as any);

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/login" element={<LoginComponent />} />
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute fallback={<FallbackComponent />}>
                                <TestComponent />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/custom fallback/i)).toBeInTheDocument();
    });
});