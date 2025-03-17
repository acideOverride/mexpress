/**
 * Authentication Service
 * Handles user authentication, registration, and session management
 */
import ApiService from './api.service';
import { User } from '@/frontend/types/models';

// Response types
interface AuthResponse {
  token: string;
  user: User;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

class AuthService {
  /**
   * Log in a user with email and password
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await ApiService.post<AuthResponse>('/auth/login', credentials);
    this.setToken(response.token);
    this.setUser(response.user);
    return response;
  }
  
  /**
   * Register a new user
   */
  static async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await ApiService.post<AuthResponse>('/auth/register', userData);
    this.setToken(response.token);
    this.setUser(response.user);
    return response;
  }
  
  /**
   * Log out the current user
   */
  static logout(): void {
    this.removeToken();
    this.removeUser();
    
    // Only redirect in a browser environment
    if (isBrowser) {
      window.location.href = '/';
    }
  }
  
  /**
   * Get the current authenticated user
   */
  static async getUser(): Promise<User | null> {
    try {
      // Only work with localStorage in a browser environment
      if (!isBrowser) {
        return null;
      }
      
      // Check if we have a user in local storage
      const userJson = localStorage.getItem('user');
      if (userJson) {
        return JSON.parse(userJson);
      }
      
      // If not, try to fetch user from API
      if (this.isAuthenticated()) {
        const user = await ApiService.get<User>('/auth/me');
        this.setUser(user);
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
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
    
    const token = localStorage.getItem('token');
    return !!token;
  }
  
  /**
   * Store auth token in local storage
   */
  private static setToken(token: string): void {
    if (isBrowser) {
      localStorage.setItem('token', token);
    }
  }
  
  /**
   * Store user object in local storage
   */
  private static setUser(user: User): void {
    if (isBrowser) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
  
  /**
   * Remove token from local storage
   */
  private static removeToken(): void {
    if (isBrowser) {
      localStorage.removeItem('token');
    }
  }
  
  /**
   * Remove user from local storage
   */
  private static removeUser(): void {
    if (isBrowser) {
      localStorage.removeItem('user');
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
   * Change password
   */
  static async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await ApiService.post('/auth/change-password', { oldPassword, newPassword });
  }
}

export default AuthService;