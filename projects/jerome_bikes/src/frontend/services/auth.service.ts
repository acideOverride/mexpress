/**
 * Authentication Service
 * Handles user authentication, registration, and session management
 */
import ApiService from './api.service';
import { User } from '@/frontend/types/models';
import jwt_decode from 'jwt-decode';

// Response types
interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

interface TokenPayload {
  sub: string;
  exp: number;
  iat: number;
  role: string;
}

// Storage keys
const TOKEN_KEY = 'jb_auth_token';
const REFRESH_TOKEN_KEY = 'jb_refresh_token';
const USER_KEY = 'jb_user';
const REMEMBER_KEY = 'jb_remember_me';
const TOKEN_EXPIRY_KEY = 'jb_token_expiry';

// Session durations
const DEFAULT_SESSION_DURATION = 60 * 60 * 1000; // 1 hour
const EXTENDED_SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Event for auth state changes
const AUTH_STATE_CHANGE_EVENT = 'jb_auth_state_change';

// Initialize refresh timer
let refreshTimer: number | null = null;

class AuthService {
  /**
   * Log in a user with email and password
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await ApiService.post<AuthResponse>('/auth/login', credentials);
    
    // Store tokens and user data
    this.setSession(response, credentials.rememberMe);
    
    // Emit auth state change event
    this.emitAuthStateChange(true);
    
    return response;
  }
  
  /**
   * Register a new user
   */
  static async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await ApiService.post<AuthResponse>('/auth/register', userData);
    
    // Store tokens and user data
    this.setSession(response, false);
    
    // Emit auth state change event
    this.emitAuthStateChange(true);
    
    return response;
  }
  
  /**
   * Log out the current user
   */
  static async logout(): Promise<void> {
    try {
      // Call logout API to invalidate tokens on server
      if (this.isAuthenticated()) {
        await ApiService.post('/auth/logout');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear session data
      this.clearSession();
      
      // Emit auth state change event
      this.emitAuthStateChange(false);
      
      // Redirect in browser environment
      if (isBrowser) {
        window.location.href = '/';
      }
    }
  }
  
  /**
   * Get the current authenticated user
   */
  static async getUser(): Promise<User | null> {
    try {
      // Only work with storage in a browser environment
      if (!isBrowser) {
        return null;
      }
      
      // Check if we have a valid token
      if (!this.isAuthenticated()) {
        return null;
      }
      
      // Check if we have a user in storage
      const userJson = this.getStorageType().getItem(USER_KEY);
      if (userJson) {
        return JSON.parse(userJson);
      }
      
      // If not, try to fetch user from API
      const user = await ApiService.get<User>('/auth/me');
      this.setUser(user);
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      
      // If 401 error, clear session since token is invalid
      if (error instanceof Error && error.message.includes('401')) {
        this.clearSession();
        this.emitAuthStateChange(false);
      }
      
      return null;
    }
  }
  
  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    if (!isBrowser) {
      return false;
    }
    
    // Get token
    const token = this.getStorageType().getItem(TOKEN_KEY);
    if (!token) {
      return false;
    }
    
    // Check token expiration
    try {
      const decoded = jwt_decode<TokenPayload>(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      if (decoded.exp < currentTime) {
        // Try to use refresh token
        this.refreshToken();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  }
  
  /**
   * Check if user has a specific role
   */
  static async hasRole(role: string): Promise<boolean> {
    const user = await this.getUser();
    return user?.role === role;
  }
  
  /**
   * Check if user is an admin
   */
  static async isAdmin(): Promise<boolean> {
    return this.hasRole('admin');
  }
  
  /**
   * Refresh the authentication token
   */
  static async refreshToken(): Promise<boolean> {
    // Only refresh if we have a refresh token
    const refreshToken = this.getStorageType().getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return false;
    }
    
    try {
      // Call refresh token API
      const response = await ApiService.post<AuthResponse>('/auth/refresh', { refreshToken });
      
      // Update session with new tokens
      this.setSession(response, this.isRememberMeEnabled());
      
      return true;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      
      // Clear session on refresh failure
      this.clearSession();
      this.emitAuthStateChange(false);
      
      return false;
    }
  }
  
  /**
   * Update user profile
   */
  static async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await ApiService.put<User>('/auth/profile', userData);
    this.setUser(response);
    return response;
  }
  
  /**
   * Change password when logged in
   */
  static async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await ApiService.post('/auth/change-password', { oldPassword, newPassword });
  }
  
  /**
   * Request a password reset (forgot password flow)
   */
  static async requestPasswordReset(email: string): Promise<void> {
    await ApiService.post('/auth/forgot-password', { email });
  }
  
  /**
   * Reset password using reset token
   */
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    await ApiService.post('/auth/reset-password', { token, newPassword });
  }
  
  /**
   * Verify email address
   */
  static async verifyEmail(token: string): Promise<void> {
    await ApiService.post('/auth/verify-email', { token });
  }
  
  /**
   * Request a new verification email
   */
  static async resendVerificationEmail(email: string): Promise<void> {
    await ApiService.post('/auth/resend-verification', { email });
  }
  
  /**
   * Start session and initialize token refresh timer
   */
  private static setSession(response: AuthResponse, rememberMe: boolean = false): void {
    if (!isBrowser) return;
    
    // Get appropriate storage
    const storage = rememberMe ? localStorage : sessionStorage;
    
    // Store tokens
    storage.setItem(TOKEN_KEY, response.token);
    
    if (response.refreshToken) {
      storage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    }
    
    // Store user
    storage.setItem(USER_KEY, JSON.stringify(response.user));
    
    // Store remember me preference
    storage.setItem(REMEMBER_KEY, rememberMe ? 'true' : 'false');
    
    // Calculate token expiration
    try {
      const decoded = jwt_decode<TokenPayload>(response.token);
      const expiryTime = decoded.exp * 1000; // Convert to milliseconds
      storage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
      
      // Schedule token refresh
      this.scheduleTokenRefresh(expiryTime);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
  
  /**
   * Clear all authentication data
   */
  private static clearSession(): void {
    if (!isBrowser) return;
    
    // Clear both storage types to be safe
    [localStorage, sessionStorage].forEach(storage => {
      storage.removeItem(TOKEN_KEY);
      storage.removeItem(REFRESH_TOKEN_KEY);
      storage.removeItem(USER_KEY);
      storage.removeItem(TOKEN_EXPIRY_KEY);
    });
    
    // Clear refresh timer
    if (refreshTimer !== null) {
      window.clearTimeout(refreshTimer);
      refreshTimer = null;
    }
  }
  
  /**
   * Get the appropriate storage type (local or session)
   */
  private static getStorageType(): Storage {
    if (!isBrowser) {
      // Mock storage for non-browser environments
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        length: 0,
        key: () => null
      } as Storage;
    }
    
    // Check if remember me is enabled
    const rememberMe = localStorage.getItem(REMEMBER_KEY) === 'true';
    return rememberMe ? localStorage : sessionStorage;
  }
  
  /**
   * Check if remember me is enabled
   */
  private static isRememberMeEnabled(): boolean {
    return localStorage.getItem(REMEMBER_KEY) === 'true';
  }
  
  /**
   * Set user data
   */
  private static setUser(user: User): void {
    if (!isBrowser) return;
    this.getStorageType().setItem(USER_KEY, JSON.stringify(user));
  }
  
  /**
   * Schedule token refresh before it expires
   */
  private static scheduleTokenRefresh(expiryTime: number): void {
    if (!isBrowser) return;
    
    // Clear any existing timer
    if (refreshTimer !== null) {
      window.clearTimeout(refreshTimer);
    }
    
    // Calculate time until refresh (5 minutes before expiry)
    const currentTime = Date.now();
    const timeUntilRefresh = Math.max(0, expiryTime - currentTime - (5 * 60 * 1000));
    
    // Schedule refresh
    refreshTimer = window.setTimeout(() => {
      if (this.isAuthenticated()) {
        this.refreshToken();
      }
    }, timeUntilRefresh);
  }
  
  /**
   * Emit authentication state change event
   */
  private static emitAuthStateChange(isAuthenticated: boolean): void {
    if (!isBrowser) return;
    
    // Dispatch custom event
    const event = new CustomEvent(AUTH_STATE_CHANGE_EVENT, {
      detail: { isAuthenticated }
    });
    
    window.dispatchEvent(event);
  }
  
  /**
   * Add authentication state change listener
   */
  static onAuthStateChange(callback: (isAuthenticated: boolean) => void): () => void {
    if (!isBrowser) return () => {};
    
    // Event handler
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent;
      callback(customEvent.detail.isAuthenticated);
    };
    
    // Add listener
    window.addEventListener(AUTH_STATE_CHANGE_EVENT, handler);
    
    // Return function to remove listener
    return () => {
      window.removeEventListener(AUTH_STATE_CHANGE_EVENT, handler);
    };
  }
}

export default AuthService;