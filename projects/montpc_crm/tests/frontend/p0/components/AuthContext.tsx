import React, { createContext, useContext, ReactNode } from 'react';
import { AuthError, User, RegisterData } from '../types/auth';

// Auth context type definition
interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  loading: boolean;
  error: AuthError | null;
  user: User | null;
  isAuthenticated: boolean;
}

// Create context with undefined default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider props interface
interface AuthProviderProps {
  children: ReactNode;
  value?: Partial<AuthContextType>;
}

// Mock implementation for tests
const defaultAuthContext: AuthContextType = {
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
  loading: false,
  error: null,
  user: null,
  isAuthenticated: false
};

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  value = {}
}) => {
  // Merge default values with provided values
  const contextValue = {
    ...defaultAuthContext,
    ...value
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;