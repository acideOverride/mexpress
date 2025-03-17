import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { setupAuthGuards, setupAuthStateListener } from './auth-guard';

// Import the actual view components
import Home from '@/frontend/views/Home.vue';
import Login from '@/frontend/views/Login.vue';
import Register from '@/frontend/views/Register.vue';
import NotFound from '@/frontend/views/NotFound.vue';
import Profile from '@/frontend/views/Profile.vue';
import ForgotPassword from '@/frontend/views/ForgotPassword.vue';

// Import views for protected routes (these are already implemented)
import About from '@/frontend/views/About.vue';
import Bikes from '@/frontend/views/Bikes.vue';
import Pricing from '@/frontend/views/Pricing.vue';
import Reservations from '@/frontend/views/Reservations.vue';
import History from '@/frontend/views/History.vue';

// Admin placeholder components (to be implemented later)
const Admin = { template: '<div class="container" style="padding: 4rem 0;"><h1>Admin Dashboard</h1><p>Administration panel for Jerome Bikes.</p><router-view/></div>' };
const AdminBikes = { template: '<div class="container" style="padding: 2rem 0;"><h2>Bike Management</h2><p>Manage the bike inventory.</p></div>' };
const AdminStations = { template: '<div class="container" style="padding: 2rem 0;"><h2>Station Management</h2><p>Manage bike stations.</p></div>' };
const AdminReservations = { template: '<div class="container" style="padding: 2rem 0;"><h2>Reservation Management</h2><p>Manage customer reservations.</p></div>' };
const AdminMaintenance = { template: '<div class="container" style="padding: 2rem 0;"><h2>Maintenance Management</h2><p>Manage bike maintenance.</p></div>' };

// Define routes
export const routes: RouteRecordRaw[] = [
  // Public routes
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { requiresAuth: false }
  },
  {
    path: '/bikes',
    name: 'Bikes',
    component: Bikes,
    meta: { requiresAuth: false }
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: Pricing,
    meta: { requiresAuth: false }
  },
  
  // Authentication routes
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { requiresAuth: false }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ForgotPassword,
    meta: { requiresAuth: false }
  },
  {
    path: '/verify-email',
    name: 'VerifyEmail',
    component: () => import('@/frontend/views/VerifyEmail.vue'),
    meta: { requiresAuth: false }
  },
  
  // Authenticated user routes
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/reservations',
    name: 'Reservations',
    component: Reservations,
    meta: { requiresAuth: true }
  },
  {
    path: '/history',
    name: 'History',
    component: History,
    meta: { requiresAuth: true }
  },
  
  // Admin routes
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'bikes',
        name: 'AdminBikes',
        component: AdminBikes,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'stations',
        name: 'AdminStations',
        component: AdminStations,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'reservations',
        name: 'AdminReservations',
        component: AdminReservations,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'maintenance',
        name: 'AdminMaintenance',
        component: AdminMaintenance,
        meta: { requiresAuth: true, requiresAdmin: true }
      }
    ]
  },
  
  // 404 route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { requiresAuth: false }
  }
];

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Setup authentication guards
setupAuthGuards(router);

// Setup auth state change listener
if (isBrowser) {
  const unsubscribe = setupAuthStateListener(router);
  
  // Clean up listener when window is unloaded
  window.addEventListener('unload', unsubscribe);
}

export default router;