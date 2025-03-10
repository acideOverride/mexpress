import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Dashboard from './dashboard/Dashboard.vue';

// Define routes
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  // For now, we'll redirect unimplemented routes to Dashboard
  {
    path: '/customers',
    name: 'Customers',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tickets',
    name: 'Tickets',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    // Will be implemented later
    component: () => import('./auth/Login.vue'),
    meta: {
      layout: 'none',
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    // Will be implemented later
    component: () => import('./common/NotFound.vue'),
    meta: {
      layout: 'none',
      requiresAuth: false
    }
  }
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard (basic implementation)
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = true; // This will be replaced with actual auth check
  
  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;