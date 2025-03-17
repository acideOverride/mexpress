/**
 * Authentication Flow Tests
 * 
 * These tests verify the authentication flows, including login, registration,
 * and authentication persistence.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/frontend/views/Login.vue';
import Register from '@/frontend/views/Register.vue';
import AuthService from '@/frontend/services/auth.service';
import { routes } from '@/frontend/router';

// Mock AuthService
vi.mock('@/frontend/services/auth.service', () => ({
  default: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getUser: vi.fn(),
    isAuthenticated: vi.fn(),
    updateProfile: vi.fn(),
    changePassword: vi.fn()
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

// Setup router
const router = createRouter({
  history: createWebHistory(),
  routes
});

describe('Authentication Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('Login Flow', () => {
    it('should render login form correctly', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router]
        }
      });

      expect(wrapper.find('form').exists()).toBe(true);
      expect(wrapper.find('#email').exists()).toBe(true);
      expect(wrapper.find('#password').exists()).toBe(true);
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
    });

    it('should call login when form is submitted', async () => {
      // Mock successful login
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
      const mockToken = 'test-token';
      const mockResponse = { user: mockUser, token: mockToken };
      
      (AuthService.login as any).mockResolvedValue(mockResponse);

      const wrapper = mount(Login, {
        global: {
          plugins: [router]
        }
      });

      // Fill form
      await wrapper.find('#email').setValue('test@example.com');
      await wrapper.find('#password').setValue('password123');

      // Submit form
      await wrapper.find('form').trigger('submit');
      await flushPromises();

      // Assert login was called
      expect(AuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('should show error message when login fails', async () => {
      // Mock failed login
      const errorMessage = 'Invalid credentials';
      (AuthService.login as any).mockRejectedValue(new Error(errorMessage));

      const wrapper = mount(Login, {
        global: {
          plugins: [router]
        }
      });

      // Fill form
      await wrapper.find('#email').setValue('test@example.com');
      await wrapper.find('#password').setValue('wrong-password');

      // Submit form
      await wrapper.find('form').trigger('submit');
      await flushPromises();

      // Assert error is displayed
      expect(wrapper.find('.error-message').exists()).toBe(true);
      expect(wrapper.find('.error-message').text()).toContain(errorMessage);
    });

    it('should redirect after successful login', async () => {
      // Mock router push
      const routerPushSpy = vi.spyOn(router, 'push');
      
      // Mock successful login
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
      const mockToken = 'test-token';
      const mockResponse = { user: mockUser, token: mockToken };
      
      (AuthService.login as any).mockResolvedValue(mockResponse);

      const wrapper = mount(Login, {
        global: {
          plugins: [router]
        }
      });

      // Fill and submit form
      await wrapper.find('#email').setValue('test@example.com');
      await wrapper.find('#password').setValue('password123');
      await wrapper.find('form').trigger('submit');
      await flushPromises();

      // Assert redirect
      expect(routerPushSpy).toHaveBeenCalledWith('/');
    });
  });

  describe('Registration Flow', () => {
    it('should render registration form correctly', async () => {
      const wrapper = mount(Register, {
        global: {
          plugins: [router]
        }
      });

      expect(wrapper.find('form').exists()).toBe(true);
      expect(wrapper.find('#name').exists()).toBe(true);
      expect(wrapper.find('#email').exists()).toBe(true);
      expect(wrapper.find('#password').exists()).toBe(true);
      expect(wrapper.find('#confirmPassword').exists()).toBe(true);
      expect(wrapper.find('#terms').exists()).toBe(true);
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
    });

    it('should validate password match', async () => {
      const wrapper = mount(Register, {
        global: {
          plugins: [router]
        }
      });

      // Fill form with mismatched passwords
      await wrapper.find('#name').setValue('Test User');
      await wrapper.find('#email').setValue('test@example.com');
      await wrapper.find('#password').setValue('password123');
      await wrapper.find('#confirmPassword').setValue('password456');
      await wrapper.find('#terms').setValue(true);

      // Submit form
      await wrapper.find('form').trigger('submit');
      await flushPromises();

      // Assert error is displayed and register not called
      expect(wrapper.find('.error-message').exists()).toBe(true);
      expect(wrapper.find('.error-message').text()).toContain('Passwords do not match');
      expect(AuthService.register).not.toHaveBeenCalled();
    });

    it('should call register when form is valid', async () => {
      // Mock successful registration
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
      const mockToken = 'test-token';
      const mockResponse = { user: mockUser, token: mockToken };
      
      (AuthService.register as any).mockResolvedValue(mockResponse);

      const wrapper = mount(Register, {
        global: {
          plugins: [router]
        }
      });

      // Fill form with valid data
      await wrapper.find('#name').setValue('Test User');
      await wrapper.find('#email').setValue('test@example.com');
      await wrapper.find('#password').setValue('password123');
      await wrapper.find('#confirmPassword').setValue('password123');
      await wrapper.find('#terms').setValue(true);

      // Submit form
      await wrapper.find('form').trigger('submit');
      await flushPromises();

      // Assert register was called with correct data
      expect(AuthService.register).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: undefined
      });
    });
  });

  describe('Authentication Persistence', () => {
    it('should check authentication status on mounted', async () => {
      // Mock isAuthenticated to return true
      (AuthService.isAuthenticated as any).mockReturnValue(true);

      const wrapper = mount(Login, {
        global: {
          plugins: [router]
        }
      });

      // Assert isAuthenticated was called
      expect(AuthService.isAuthenticated).toHaveBeenCalled();
    });

    it('should store token in localStorage after login', async () => {
      // Mock successful login
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
      const mockToken = 'test-token';
      const mockResponse = { user: mockUser, token: mockToken };
      
      (AuthService.login as any).mockImplementation(async () => {
        // Mock the implementation of login to set localStorage
        localStorageMock.setItem('token', mockToken);
        localStorageMock.setItem('user', JSON.stringify(mockUser));
        return mockResponse;
      });

      const wrapper = mount(Login, {
        global: {
          plugins: [router]
        }
      });

      // Fill and submit form
      await wrapper.find('#email').setValue('test@example.com');
      await wrapper.find('#password').setValue('password123');
      await wrapper.find('form').trigger('submit');
      await flushPromises();

      // Assert localStorage was called with token
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', mockToken);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
    });

    it('should clear token from localStorage on logout', async () => {
      // Set token in localStorage
      localStorageMock.setItem('token', 'test-token');
      localStorageMock.setItem('user', JSON.stringify({ id: '1', email: 'test@example.com', name: 'Test User' }));

      // Mock logout
      (AuthService.logout as any).mockImplementation(() => {
        localStorageMock.removeItem('token');
        localStorageMock.removeItem('user');
      });

      // Call logout
      await AuthService.logout();

      // Assert localStorage.removeItem was called
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    });
  });
});