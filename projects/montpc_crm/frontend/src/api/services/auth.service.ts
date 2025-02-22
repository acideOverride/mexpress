import { apiClient } from '../client';
import {
  LoginCredentials,
  AuthResponse,
  RefreshTokenRequest,
  ProfileResponse
} from '../types/auth';

class AuthService {
  private readonly basePath = '/auth';

  /**
   * Login with email and password
   * @param credentials Login credentials
   * @returns Promise with auth tokens
   */
  async login(credentials: LoginCredentials) {
    const response = await apiClient.post<AuthResponse>(`${this.basePath}/login`, credentials);
    const { token, refreshToken } = response.data.data;
    
    // Store tokens
    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    
    return response.data;
  }

  /**
   * Logout user and clear tokens
   */
  async logout() {
    await apiClient.post(`${this.basePath}/logout`);
    
    // Clear tokens
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  /**
   * Refresh auth token using refresh token
   * @param refreshToken Refresh token
   * @returns Promise with new auth tokens
   */
  async refreshToken(refreshToken: string) {
    const data: RefreshTokenRequest = { refreshToken };
    const response = await apiClient.post<AuthResponse>(`${this.basePath}/refresh`, data);
    const tokens = response.data.data;
    
    // Store new tokens
    localStorage.setItem('auth_token', tokens.token);
    localStorage.setItem('refresh_token', tokens.refreshToken);
    
    return response.data;
  }

  /**
   * Get current user profile
   * @returns Promise with user profile data
   */
  async getProfile() {
    const response = await apiClient.get<ProfileResponse>(`${this.basePath}/profile`);
    return response.data;
  }

  /**
   * Check if user is currently logged in
   * @returns boolean indicating if user is logged in
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  /**
   * Get current auth token
   * @returns Current auth token or null if not logged in
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Get current refresh token
   * @returns Current refresh token or null if not logged in
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
}

export const authService = new AuthService();