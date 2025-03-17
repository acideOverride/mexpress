<template>
  <a
    :href="href"
    :class="{
      'router-link': true,
      'router-link--active': isActive,
      'router-link--exact-active': isExactActive,
      'router-link--disabled': disabled,
      'router-link--external': isExternal
    }"
    :target="target"
    :rel="rel"
    :aria-current="ariaCurrent"
    @click="navigate"
  >
    <slot></slot>
  </a>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter, useRoute, useLink } from 'vue-router';
import type { RouterLinkProps } from '@/types';

export default defineComponent({
  name: 'RouterLink',
  props: {
    to: {
      type: [String, Object],
      required: true
    },
    activeClass: {
      type: String,
      default: 'router-link--active'
    },
    exactActiveClass: {
      type: String,
      default: 'router-link--exact-active'
    },
    custom: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    replace: {
      type: Boolean,
      default: false
    },
    target: {
      type: String,
      default: '_self',
      validator: (value: string) => ['_self', '_blank', '_parent', '_top'].includes(value)
    },
    prefetch: {
      type: Boolean,
      default: false
    },
    trackEvent: {
      type: String,
      default: ''
    }
  },
  emits: ['click', 'navigate'],
  setup(props, { emit }) {
    const router = useRouter();
    const route = useRoute();
    
    // Use Vue Router's useLink composable to get active state and link properties
    const { 
      route: linkRoute, 
      href, 
      isActive, 
      isExactActive, 
      navigate: navigateLink 
    } = useLink(props);
    
    // Determine if the link is external
    const isExternal = computed(() => {
      return typeof props.to === 'string' && /^(https?:|mailto:|tel:)/.test(props.to);
    });
    
    // Determine the appropriate rel attribute
    const rel = computed(() => {
      return props.target === '_blank' ? 'noopener noreferrer' : null;
    });
    
    // Determine the appropriate aria-current attribute
    const ariaCurrent = computed(() => {
      return isExactActive.value ? 'page' : null;
    });
    
    // Prefetch the route if prefetch is enabled
    if (props.prefetch && !isExternal.value) {
      router.resolve(props.to);
    }
    
    // Handle navigation
    const navigate = (event: MouseEvent) => {
      if (props.disabled) {
        event.preventDefault();
        return;
      }
      
      if (isExternal.value) {
        // Allow default behavior for external links
        emit('click', event);
        return;
      }
      
      event.preventDefault();
      
      // Track the event if trackEvent is provided
      if (props.trackEvent) {
        // In a real implementation, this would integrate with analytics
        console.log('Track event:', props.trackEvent);
      }
      
      emit('click', event);
      
      // Navigate using router
      if (props.replace) {
        router.replace(props.to);
      } else {
        router.push(props.to);
      }
      
      emit('navigate', props.to);
    };
    
    return {
      isExternal,
      href,
      isActive,
      isExactActive,
      rel,
      ariaCurrent,
      navigate
    };
  }
});
</script>

<style scoped>
.router-link {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  color: var(--router-link-color, #0d6efd);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.15s ease-in-out;
}

.router-link:hover {
  color: var(--router-link-hover-color, #0a58ca);
  text-decoration: underline;
}

.router-link--active {
  color: var(--router-link-active-color, #0a58ca);
  font-weight: 500;
}

.router-link--exact-active {
  color: var(--router-link-exact-active-color, #0a58ca);
  font-weight: 700;
}

.router-link--disabled {
  color: var(--router-link-disabled-color, #6c757d);
  pointer-events: none;
  cursor: default;
  text-decoration: none;
  opacity: 0.5;
}

.router-link--external {
  position: relative;
  padding-right: 1.25rem;
}

.router-link--external::after {
  position: absolute;
  top: 50%;
  right: 0.25rem;
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  margin-left: 0.25rem;
  border: solid currentColor;
  border-width: 0 0.125rem 0.125rem 0;
  content: "";
  transform: translateY(-50%) rotate(-45deg);
}
</style>