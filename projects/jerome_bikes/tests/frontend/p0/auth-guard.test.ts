/**
 * Authentication Guard Tests
 * 
 * These tests verify that route guards properly protect authenticated routes
 * and handle unauthorized access correctly.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import AuthService from '@/frontend/services/auth.service';
import { routes } from '@/frontend/router';

// Mock AuthService
vi.mock('@/frontend/services/auth.service', () => ({
  default: {
    isAuthenticated: vi.fn(),
    getUser: vi.fn()
  }
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value.toString(); }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Authentication Guards', () => {
  let router: any;
  
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    
    // Create a fresh router for each test
    router = createRouter({
      history: createWebHistory(),
      routes
    });
  });

  describe('Public Routes', () => {
    it('should allow access to public routes when not authenticated', async () => {
      // Mock not authenticated
      (AuthService.isAuthenticated as any).mockReturnValue(false);
      
      // Navigate to public route (home)
      router.push('/');
      await router.isReady();
      
      // Should allow access
      expect(router.currentRoute.value.path).toBe('/');
      expect(AuthService.isAuthenticated).toHaveBeenCalled();
    });

    it('should allow access to login route when not authenticated', async () => {
      // Mock not authenticated
      (AuthService.isAuthenticated as any).mockReturnValue(false);
      
      // Navigate to login
      router.push('/login');
      await router.isReady();
      
      // Should allow access
      expect(router.currentRoute.value.path).toBe('/login');
    });

    it('should allow access to register route when not authenticated', async () => {
      // Mock not authenticated
      (AuthService.isAuthenticated as any).mockReturnValue(false);
      
      // Navigate to register
      router.push('/register');
      await router.isReady();
      
      // Should allow access
      expect(router.currentRoute.value.path).toBe('/register');
    });
  });

  describe('Protected Routes', () => {
    it('should redirect to login when accessing protected route while not authenticated', async () => {
      // Mock not authenticated
      (AuthService.isAuthenticated as any).mockReturnValue(false);
      
      // Try to navigate to protected route
      router.push('/profile');
      await router.isReady();
      
      // Should redirect to login
      expect(router.currentRoute.value.path).toBe('/login');
      expect(router.currentRoute.value.query).toEqual({ redirect: '/profile' });
    });

    it('should allow access to protected route when authenticated', async () => {
      // Mock authenticated
      (AuthService.isAuthenticated as any).mockReturnValue(true);
      
      // Navigate to protected route
      router.push('/profile');
      await router.isReady();
      
      // Should allow access
      expect(router.currentRoute.value.path).toBe('/profile');
    });

    it('should redirect from admin routes when user is not admin', async () => {
      // Mock authenticated but not admin
      (AuthService.isAuthenticated as any).mockReturnValue(true);
      (AuthService.getUser as any).mockResolvedValue({ 
        id: '1', 
        email: 'user@example.com',
        name: 'Regular User',
        role: 'user'
      });
      
      // Try to navigate to admin route
      router.push('/admin');
      await router.isReady();
      
      // Should redirect to home
      expect(router.currentRoute.value.path).toBe('/');
    });

    it('should allow access to admin routes when user is admin', async () => {
      // Mock authenticated as admin
      (AuthService.isAuthenticated as any).mockReturnValue(true);
      (AuthService.getUser as any).mockResolvedValue({ 
        id: '1', 
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin'
      });
      
      // Navigate to admin route
      router.push('/admin');
      await router.isReady();
      
      // Should allow access
      expect(router.currentRoute.value.path).toBe('/admin');
    });
  });

  describe('Authentication State Changes', () => {
    it('should redirect to login when token is removed during session', async () => {
      // Mock authenticated initially
      (AuthService.isAuthenticated as any).mockReturnValue(true);
      
      // Navigate to protected route
      router.push('/profile');
      await router.isReady();
      
      // Should be on profile
      expect(router.currentRoute.value.path).toBe('/profile');
      
      // Now simulate token removal (logout)
      (AuthService.isAuthenticated as any).mockReturnValue(false);
      
      // Trigger the navigation guard by changing routes
      router.push('/reservations');
      await router.isReady();
      
      // Should redirect to login
      expect(router.currentRoute.value.path).toBe('/login');
    });
  });
});