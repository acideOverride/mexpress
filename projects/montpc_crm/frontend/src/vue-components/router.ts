import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Dashboard from './dashboard/Dashboard.vue';

// Lazy load components for better performance
const CustomerList = () => import('./customers/CustomerList.vue');
const CustomerDetail = () => import('./customers/CustomerDetail.vue');
const TicketList = () => import('./tickets/TicketList.vue');
const TicketDetail = () => import('./tickets/TicketDetail.vue');
const RepairDashboard = () => import('./tickets/RepairDashboard.vue');
const RepairDetail = () => import('./tickets/RepairDetail.vue');
const ProductDashboard = () => import('./products/ProductDashboard.vue');
const ProductDetail = () => import('./products/ProductDetail.vue');
const Settings = () => import('./settings/Settings.vue');

// Define routes with proper structure
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
      requiresAuth: false,  // Set to false for testing
      title: 'Dashboard'
    }
  },
  {
    path: '/customers',
    name: 'CustomerList',
    component: CustomerList,
    meta: {
      requiresAuth: false,
      title: 'Customers'
    }
  },
  {
    path: '/customers/:id',
    name: 'CustomerDetail',
    component: CustomerDetail,
    props: true,
    meta: {
      requiresAuth: false,
      title: 'Customer Details'
    }
  },
  {
    path: '/tickets',
    name: 'TicketList',
    component: TicketList,
    meta: {
      requiresAuth: false,
      title: 'Repair Tickets'
    }
  },
  {
    path: '/tickets/:id',
    name: 'TicketDetail',
    component: TicketDetail,
    props: true,
    meta: {
      requiresAuth: false,
      title: 'Ticket Details'
    }
  },
  {
    path: '/repairs',
    name: 'RepairDashboard',
    component: RepairDashboard,
    meta: {
      requiresAuth: false,
      title: 'Repair Dashboard'
    }
  },
  {
    path: '/repairs/:id',
    name: 'RepairDetail',
    component: RepairDetail,
    props: true,
    meta: {
      requiresAuth: false,
      title: 'Repair Details'
    }
  },
  {
    path: '/products',
    name: 'ProductDashboard',
    component: ProductDashboard,
    meta: {
      requiresAuth: false,
      title: 'Product Inventory'
    }
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true,
    meta: {
      requiresAuth: false,
      title: 'Product Details'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      requiresAuth: false,
      title: 'Settings'
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

// Navigation guard with title updates
router.beforeEach((to, from, next) => {
  console.log('Route navigation:', from.path, '->', to.path);
  
  // Update page title
  if (to.meta.title) {
    document.title = `MontPC CRM - ${to.meta.title}`;
  }
  
  // Auth logic would go here in production
  // For now just log and continue
  if (to.meta.requiresAuth) {
    console.log('This route requires auth, but we are bypassing for development');
  }
  
  next();
});

export default router;