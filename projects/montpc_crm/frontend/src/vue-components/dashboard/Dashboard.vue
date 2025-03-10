<template>
  <div class="container mx-auto p-4">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2" data-testid="dashboard-title">Dashboard</h1>
      <p class="text-gray-600" data-testid="welcome-message">Welcome to MontPC CRM System</p>
    </div>

    <!-- Search Bar -->
    <div class="mb-8">
      <form @submit.prevent="handleSearch" class="flex" data-testid="search-form">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search customers, tickets..."
          class="flex-grow p-2 border border-gray-300 rounded-l"
          data-testid="search-input"
        />
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded-r"
          data-testid="search-button"
        >
          Search
        </button>
      </form>
    </div>

    <!-- Quick Actions -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="quick-actions">
        <router-link
          to="/customers/new"
          class="bg-blue-100 hover:bg-blue-200 p-4 rounded text-center"
          @click="handleActionClick('new-customer')"
        >
          <div class="text-blue-800 font-medium">New Customer</div>
        </router-link>
        <router-link
          to="/tickets/new"
          class="bg-green-100 hover:bg-green-200 p-4 rounded text-center"
          @click="handleActionClick('new-ticket')"
          data-testid="action-create"
        >
          <div class="text-green-800 font-medium">New Repair Ticket</div>
        </router-link>
        <button
          class="bg-purple-100 hover:bg-purple-200 p-4 rounded text-center"
          @click="handleActionClick('sync-data')"
          data-testid="action-sync"
        >
          <div class="text-purple-800 font-medium">Sync Data</div>
        </button>
        <button
          class="bg-yellow-100 hover:bg-yellow-200 p-4 rounded text-center"
          @click="handleActionClick('reports')"
          data-testid="action-reports"
        >
          <div class="text-yellow-800 font-medium">Generate Reports</div>
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div v-if="loading" class="text-center p-4">
      Loading dashboard data...
    </div>
    <div v-else-if="error" class="text-center p-4 text-red-600">
      {{ error }}
    </div>
    <div v-else class="mb-8" data-testid="stats-section">
      <h2 class="text-xl font-semibold mb-4">Overview</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded shadow" data-testid="stat-customers">
          <div class="text-gray-500">Total Customers</div>
          <div class="text-2xl font-bold">{{ stats.customerCount }}</div>
        </div>
        <div class="bg-white p-4 rounded shadow" data-testid="stat-tickets">
          <div class="text-gray-500">Total Tickets</div>
          <div class="text-2xl font-bold">{{ stats.ticketCount }}</div>
        </div>
        <div class="bg-white p-4 rounded shadow" data-testid="stat-pending">
          <div class="text-gray-500">Pending Tickets</div>
          <div class="text-2xl font-bold">{{ stats.pendingTickets }}</div>
        </div>
        <div class="bg-white p-4 rounded shadow" data-testid="stat-completed">
          <div class="text-gray-500">Completed Tickets</div>
          <div class="text-2xl font-bold">{{ stats.completedTickets }}</div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="mb-8" data-testid="recent-activity">
      <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
      <div class="bg-white p-4 rounded shadow">
        <div class="divide-y">
          <div v-for="(activity, index) in activities" :key="activity.id" class="py-2">
            <div class="text-sm text-gray-500">{{ activity.date }}</div>
            <div class="flex justify-between items-center">
              <div :data-testid="`activity-${activity.id}`">{{ activity.text }}</div>
              <div class="text-xs text-gray-500">{{ activity.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Links -->
    <div>
      <h2 class="text-xl font-semibold mb-4">Quick Links</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <router-link
          to="/customers"
          class="bg-white p-4 rounded shadow hover:shadow-md"
        >
          <div class="font-medium">Customer Management</div>
          <div class="text-sm text-gray-500">View and manage all customers</div>
        </router-link>
        <router-link
          to="/tickets"
          class="bg-white p-4 rounded shadow hover:shadow-md"
        >
          <div class="font-medium">Repair Ticket Management</div>
          <div class="text-sm text-gray-500">View and manage all repair tickets</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue';
import { customersService, ticketsService } from '../../api/services';

interface DashboardStats {
  customerCount: number;
  ticketCount: number;
  pendingTickets: number;
  completedTickets: number;
}

interface Activity {
  id: number;
  text: string;
  date: string;
  time: string;
}

export default defineComponent({
  name: 'Dashboard',
  props: {
    userName: {
      type: String,
      default: ''
    }
  },
  emits: ['search', 'action-select'],
  setup(props, { emit }) {
    // Reactive state
    const searchQuery = ref('');
    const stats = reactive<DashboardStats>({
      customerCount: 0,
      ticketCount: 0,
      pendingTickets: 0,
      completedTickets: 0
    });
    const loading = ref(true);
    const error = ref<string | null>(null);

    // Mock activities for now
    const activities = ref<Activity[]>([
      { id: 1, text: 'New customer added: John Doe', date: 'Today', time: '10:30 AM' },
      { id: 2, text: 'Ticket #1234 status changed to "In Progress"', date: 'Today', time: '9:15 AM' },
      { id: 3, text: 'New repair ticket created for Jane Smith', date: 'Yesterday', time: '4:45 PM' }
    ]);

    // Methods
    const fetchDashboardData = async () => {
      try {
        loading.value = true;
        
        // Fetch customers and tickets data
        const customersResponse = await customersService.getAll();
        const ticketsResponse = await ticketsService.getAll();
        
        // Handle both response formats (for backward compatibility)
        const customers = 'data' in customersResponse 
          ? customersResponse.data as any[]
          : 'items' in customersResponse
            ? customersResponse.items as any[]
            : [] as any[];
        const tickets = ticketsResponse || [] as any[];
        
        // Calculate dashboard stats
        const pendingTickets = Array.isArray(tickets) ? tickets.filter((ticket: any) =>
          ['PENDING', 'IN_PROGRESS', 'WAITING_FOR_PARTS'].includes(ticket.status)
        ).length : 0;
        
        const completedTickets = Array.isArray(tickets) ? tickets.filter((ticket: any) =>
          ticket.status === 'COMPLETED'
        ).length : 0;
        
        // Update reactive state
        stats.customerCount = customers.length;
        stats.ticketCount = Array.isArray(tickets) ? tickets.length : 0;
        stats.pendingTickets = pendingTickets;
        stats.completedTickets = completedTickets;
        
        error.value = null;
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        error.value = 'Failed to load dashboard data. Please try again later.';
        
        // Use demo data for local development or when API fails
        stats.customerCount = 2;
        stats.ticketCount = 4;
        stats.pendingTickets = 3;
        stats.completedTickets = 1;
      } finally {
        loading.value = false;
      }
    };

    const handleSearch = () => {
      emit('search', searchQuery.value);
    };

    const handleActionClick = (action: string) => {
      emit('action-select', action);
    };

    // Lifecycle hooks
    onMounted(() => {
      fetchDashboardData();
    });

    return {
      searchQuery,
      stats,
      loading,
      error,
      activities,
      handleSearch,
      handleActionClick
    };
  }
});
</script>

<style scoped>
/* Additional component-specific styles can be added here */
</style>