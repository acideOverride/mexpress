import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Dashboard from './dashboard/Dashboard.vue';

// Define simplified routes - just the dashboard for now
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
      requiresAuth: false  // Set to false for testing
    }
  },
  // Fallback route
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard (simplified for testing)
router.beforeEach((to, from, next) => {
  console.log('Route navigation:', from.path, '->', to.path);
  next();
});

export default router;