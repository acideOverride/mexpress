import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    roles?: string[];
    fallback?: ReactNode;
    redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    roles = [],
    fallback,
    redirectPath = '/login'
}) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-2 text-gray-600">Loading...</span>
            </div>
        );
    }

    const hasRequiredRole = () => {
        if (!roles.length) return true;
        return user && roles.includes(user.role);
    };

    if (!isAuthenticated || !hasRequiredRole()) {
        if (fallback) {
            return <>{fallback}</>;
        }
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};