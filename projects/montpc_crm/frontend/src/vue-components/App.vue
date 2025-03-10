<template>
  <component :is="layout">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </component>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppLayout from './layout/AppLayout.vue';

export default defineComponent({
  name: 'App',
  components: {
    AppLayout
  },
  setup() {
    const route = useRoute();
    const layout = computed(() => {
      // Check if the route requires a different layout
      const routeLayout = route.meta.layout;
      
      if (routeLayout === 'none') {
        return 'div'; // No layout, just a simple div wrapper
      }
      
      // Default to AppLayout
      return AppLayout;
    });

    return {
      layout
    };
  }
});
</script>

<style>
/* Global styles */
body {
  font-family: 'Inter', sans-serif;
  color: #1f2937; /* gray-800 */
  line-height: 1.5;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>