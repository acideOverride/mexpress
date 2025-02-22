import { createContext, useContext, useCallback, useReducer, ReactNode } from 'react';
import { AuthTokens, User } from '../../types/auth';
import { authService } from '../../api/services/auth.service';

interface AuthState {
    user: User | null;
    loading: boolean;
    error: Error | null;
    isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    register: (userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false
};

type AuthAction =
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; payload: User }
    | { type: 'AUTH_ERROR'; payload: Error }
    | { type: 'AUTH_LOGOUT' }
    | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'AUTH_START':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'AUTH_SUCCESS':
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null,
                isAuthenticated: true
            };
        case 'AUTH_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload,
                isAuthenticated: false
            };
        case 'AUTH_LOGOUT':
            return {
                ...initialState
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const login = useCallback(async (email: string, password: string) => {
        try {
            dispatch({ type: 'AUTH_START' });
            const response = await authService.login({ email, password });
            dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
        } catch (error) {
            dispatch({ type: 'AUTH_ERROR', payload: error as Error });
            throw error;
        }
    }, []);

    const register = useCallback(async (userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }) => {
        try {
            dispatch({ type: 'AUTH_START' });
            const response = await authService.register(userData);
            dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
        } catch (error) {
            dispatch({ type: 'AUTH_ERROR', payload: error as Error });
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
            dispatch({ type: 'AUTH_LOGOUT' });
        } catch (error) {
            dispatch({ type: 'AUTH_ERROR', payload: error as Error });
            throw error;
        }
    }, []);

    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' });
    }, []);

    const value = {
        ...state,
        login,
        register,
        logout,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;