<template>
  <div class="app-container min-h-screen bg-gray-100">
    <header class="bg-blue-600 text-white shadow">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <router-link to="/" class="text-xl font-bold">MontPC CRM</router-link>
        <nav class="hidden md:block">
          <ul class="flex space-x-6">
            <li>
              <router-link to="/dashboard" class="hover:text-blue-200">Dashboard</router-link>
            </li>
            <li>
              <router-link to="/customers" class="hover:text-blue-200">Customers</router-link>
            </li>
            <li>
              <router-link to="/tickets" class="hover:text-blue-200">Repair Tickets</router-link>
            </li>
            <li>
              <router-link to="/reports" class="hover:text-blue-200">Reports</router-link>
            </li>
          </ul>
        </nav>
        <div class="flex items-center space-x-4">
          <span>John Doe</span>
          <button class="text-sm bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded" @click="logout">
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="container mx-auto py-6 px-4">
      <slot></slot>
    </main>

    <footer class="bg-gray-200 py-4 mt-10">
      <div class="container mx-auto px-4 text-center text-gray-600 text-sm">
        &copy; 2025 MontPC CRM - All rights reserved
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppLayout',
  setup(props, { emit }) {
    const logout = () => {
      // Implement logout functionality
      console.log('Logging out...');
      // Redirect to login page or emit event
    };

    return {
      logout
    };
  }
});
</script>

<style scoped>
/* Add custom styles here if needed */
</style>