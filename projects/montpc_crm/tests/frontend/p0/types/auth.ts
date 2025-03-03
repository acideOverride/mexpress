export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface TokenValidationResponse {
  valid: boolean;
  user?: User;
  error?: string;
}

export interface RefreshTokenResponse {
  tokens: AuthTokens;
  user?: User;
}