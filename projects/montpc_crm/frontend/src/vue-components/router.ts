import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Dashboard from './dashboard/Dashboard.vue';
import { CustomerList, CustomerDetail } from './customers';
import { TicketList, TicketDetail } from './tickets';

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
  // Customer routes
  {
    path: '/customers',
    name: 'Customers',
    component: CustomerList,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/customers/:id',
    name: 'CustomerDetail',
    component: CustomerDetail,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/customers/new',
    name: 'NewCustomer',
    component: () => import('./customers/CustomerForm.vue'),
    meta: {
      requiresAuth: true
    }
  },
  // Ticket routes
  {
    path: '/tickets',
    name: 'Tickets',
    component: TicketList,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tickets/:id',
    name: 'TicketDetail',
    component: TicketDetail,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tickets/new',
    name: 'NewTicket',
    component: () => import('./tickets/TicketForm.vue'),
    props: route => ({ customerId: route.query.customerId }),
    meta: {
      requiresAuth: true
    }
  },
  // Auth routes
  {
    path: '/login',
    name: 'Login',
    component: () => import('./auth/Login.vue'),
    meta: {
      layout: 'none',
      requiresAuth: false
    }
  },
  // Not found
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
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