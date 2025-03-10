<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-blue-600">404</h1>
      <h2 class="text-3xl font-medium text-gray-800 mt-4">Page Not Found</h2>
      <p class="text-gray-600 mt-2">The page you are looking for doesn't exist or has been moved.</p>
      
      <div class="mt-8">
        <router-link to="/dashboard" class="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Back to Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NotFound'
});
</script>