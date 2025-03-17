<template>
  <div class="app-container">
    <main-layout>
      <router-view />
    </main-layout>
  </div>
</template>

<script setup lang="ts">
import MainLayout from '@/frontend/layouts/MainLayout.vue';

// App.vue is the root component of our application
</script>

<style>
:root {
  --primary-color: #4169E1;
  --secondary-color: #228B22;
  --accent-color: #FFA500;
  --background-color: #F8F9FA;
  --text-color: #212529;
  --light-gray: #E9ECEF;
  --border-radius: 8px;
  --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
  background-color: var(--background-color);
  line-height: 1.6;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

button {
  cursor: pointer;
  font-family: inherit;
}
</style>