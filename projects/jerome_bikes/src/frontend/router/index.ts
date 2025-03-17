import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// Import the actual view components
import Home from '@/frontend/views/Home.vue';
import Login from '@/frontend/views/Login.vue';
import Register from '@/frontend/views/Register.vue';

// For views that haven't been implemented yet, we use placeholder components
// These will be replaced with real components as they are developed
const About = { template: '<div class="container" style="padding: 4rem 0;"><h1>About Page</h1><p>Information about Jerome Bikes coming soon.</p></div>' };
const Bikes = { template: '<div class="container" style="padding: 4rem 0;"><h1>Bikes Page</h1><p>Browse our selection of bikes.</p></div>' };
const Pricing = { template: '<div class="container" style="padding: 4rem 0;"><h1>Pricing Page</h1><p>Affordable rates for all your biking needs.</p></div>' };
const Profile = { template: '<div class="container" style="padding: 4rem 0;"><h1>Profile Page</h1><p>Your account details and reservation history.</p></div>' };
const Reservations = { template: '<div class="container" style="padding: 4rem 0;"><h1>Reservations Page</h1><p>Manage your bike reservations.</p></div>' };
const History = { template: '<div class="container" style="padding: 4rem 0;"><h1>History Page</h1><p>Your past bike rentals.</p></div>' };
const Admin = { template: '<div class="container" style="padding: 4rem 0;"><h1>Admin Dashboard</h1><p>Administration panel for Jerome Bikes.</p><router-view/></div>' };
const AdminBikes = { template: '<div class="container" style="padding: 2rem 0;"><h2>Bike Management</h2><p>Manage the bike inventory.</p></div>' };
const AdminStations = { template: '<div class="container" style="padding: 2rem 0;"><h2>Station Management</h2><p>Manage bike stations.</p></div>' };
const AdminReservations = { template: '<div class="container" style="padding: 2rem 0;"><h2>Reservation Management</h2><p>Manage customer reservations.</p></div>' };
const AdminMaintenance = { template: '<div class="container" style="padding: 2rem 0;"><h2>Maintenance Management</h2><p>Manage bike maintenance.</p></div>' };
const NotFound = { template: '<div class="container" style="padding: 4rem 0; text-align: center;"><h1>404 Not Found</h1><p>The page you were looking for does not exist.</p><router-link to="/" class="btn btn-primary">Return Home</router-link></div>' };

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

// Navigation guards
router.beforeEach((to, from, next) => {
  // Only run this in a browser environment
  if (isBrowser) {
    // This is a placeholder for the actual authentication logic
    // We'll implement this properly later
    const isAuthenticated = localStorage.getItem('token') !== null;
    const isAdmin = false; // For now, no admin access
    
    // Check if route requires authentication
    if (to.meta.requiresAuth && !isAuthenticated) {
      // Redirect to login page if not authenticated
      next({ name: 'Login', query: { redirect: to.fullPath } });
    } 
    // Check if route requires admin privileges
    else if (to.meta.requiresAdmin && !isAdmin) {
      // Redirect to home page if not admin
      next({ name: 'Home' });
    } 
    // Otherwise, proceed normally
    else {
      next();
    }
  } else {
    // In a non-browser environment (like tests), just proceed
    next();
  }
});

export default router;