/**
 * Authentication Guard for Vue Router
 * 
 * This module provides navigation guards to protect routes that require authentication
 * and to limit access based on user roles.
 */

import { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import AuthService from '@/frontend/services/auth.service';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Setup authentication guards for the Vue Router
 */
export function setupAuthGuards(router: Router): void {
  router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    // Skip auth checks in non-browser environments
    if (!isBrowser) {
      next();
      return;
    }
    
    // Get authentication status
    const isAuthenticated = AuthService.isAuthenticated();
    
    // Check if route requires authentication
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    
    // Check if route requires admin role
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
    
    // Handle unauthenticated users trying to access protected routes
    if (requiresAuth && !isAuthenticated) {
      // Redirect to login with return URL
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      });
      return;
    }
    
    // Handle routes that require admin role
    if (requiresAdmin) {
      try {
        const isAdmin = await AuthService.isAdmin();
        
        if (!isAdmin) {
          // Redirect non-admin users
          next({ name: 'Home' });
          return;
        }
      } catch (error) {
        console.error('Failed to check admin status:', error);
        next({ name: 'Home' });
        return;
      }
    }
    
    // Check for trying to access login/register while already authenticated
    if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
      // If there's a redirect query, go there
      const redirectUrl = to.query.redirect?.toString() || '/';
      next(redirectUrl);
      return;
    }
    
    // Otherwise proceed normally
    next();
  });
}

/**
 * Handle authentication state changes
 */
export function setupAuthStateListener(router: Router): () => void {
  // Set up auth state change listener
  return AuthService.onAuthStateChange((isAuthenticated: boolean) => {
    // On logout, redirect to home if on protected route
    if (!isAuthenticated) {
      const currentRoute = router.currentRoute.value;
      
      // Check if current route requires authentication
      const requiresAuth = currentRoute.matched.some(record => record.meta.requiresAuth);
      
      if (requiresAuth) {
        // Redirect to login
        router.push({
          name: 'Login',
          query: { redirect: currentRoute.fullPath }
        });
      }
    }
  });
}