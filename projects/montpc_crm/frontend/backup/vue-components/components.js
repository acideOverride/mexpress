// Direct imports from Vue and related packages
// This approach avoids namespace imports which can cause runtime issues

// Vue core imports
import { 
  createApp,
  computed, 
  ref, 
  reactive,
  onMounted,
  watch,
  nextTick,
  defineComponent,
  h,
  provide,
  inject,
  onUnmounted,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onUpdated,
  onActivated,
  onDeactivated,
  onErrorCaptured
} from 'vue';

// Vue Router imports
import {
  createRouter,
  useRouter,
  useRoute,
  createWebHistory
} from 'vue-router';

// Pinia imports
import {
  createPinia,
  defineStore
} from 'pinia';

// Re-export Vue core functions
export {
  createApp,
  computed, 
  ref, 
  reactive,
  onMounted,
  watch,
  nextTick,
  defineComponent,
  h,
  provide,
  inject,
  onUnmounted,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onUpdated,
  onActivated,
  onDeactivated,
  onErrorCaptured
};

// Re-export Vue Router functions
export {
  createRouter,
  useRouter,
  useRoute,
  createWebHistory
};

// Re-export Pinia functions
export {
  createPinia,
  defineStore
};
