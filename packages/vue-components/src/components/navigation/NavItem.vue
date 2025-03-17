<template>
  <div 
    class="nav-item"
    :class="{ 
      'nav-item--active': active,
      'nav-item--disabled': disabled,
      'nav-item--dropdown': hasDropdown,
      'nav-item--open': open
    }"
    role="menuitem"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0"
    @click="!disabled && handleClick"
    @keydown.enter="!disabled && handleClick"
    @keydown.space.prevent="!disabled && handleClick"
  >
    <div class="nav-item__content">
      <slot name="icon"></slot>
      <span class="nav-item__label"><slot></slot></span>
      <span v-if="badge" class="nav-item__badge">{{ badge }}</span>
      <span v-if="hasDropdown" class="nav-item__dropdown-icon"></span>
    </div>
    <div v-if="hasDropdown" class="nav-item__dropdown" v-show="open">
      <slot name="dropdown"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { NavItemProps } from '@/types';

export default defineComponent({
  name: 'NavItem',
  props: {
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    badge: {
      type: [String, Number],
      default: null
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click', 'update:open'],
  setup(props, { slots, emit }) {
    const hasDropdown = computed(() => !!slots.dropdown);
    
    const handleClick = () => {
      if (hasDropdown.value) {
        emit('update:open', !props.open);
      }
      emit('click');
    };
    
    return {
      hasDropdown,
      handleClick
    };
  }
});
</script>

<style scoped>
.nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  cursor: pointer;
}

.nav-item__content {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: var(--nav-item-color, #333);
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.nav-item:hover .nav-item__content {
  background-color: var(--nav-item-hover-bg, rgba(0, 0, 0, 0.05));
  color: var(--nav-item-hover-color, #000);
}

.nav-item--active .nav-item__content {
  background-color: var(--nav-item-active-bg, rgba(0, 0, 0, 0.1));
  color: var(--nav-item-active-color, #000);
  font-weight: 500;
}

.nav-item--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.nav-item--disabled .nav-item__content {
  pointer-events: none;
}

.nav-item__label {
  flex: 1;
}

.nav-item__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  margin-left: 0.5rem;
  padding: 0 0.375rem;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  background-color: var(--nav-item-badge-bg, #f44336);
  border-radius: 9999px;
}

.nav-item__dropdown-icon {
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  margin-left: 0.5rem;
  border: solid var(--nav-item-dropdown-color, #333);
  border-width: 0 0.125rem 0.125rem 0;
  transform: rotate(45deg);
  transition: transform 0.2s ease;
}

.nav-item--open .nav-item__dropdown-icon {
  transform: rotate(-135deg);
}

.nav-item__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  min-width: 10rem;
  margin: 0;
  padding: 0.5rem 0;
  background-color: var(--nav-dropdown-bg, #fff);
  border: 1px solid var(--nav-dropdown-border, rgba(0, 0, 0, 0.15));
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

/* For vertical menus, dropdown should appear to the side */
.nav-menu--vertical .nav-item__dropdown {
  top: 0;
  left: 100%;
}

@media (max-width: 992px) {
  .nav-item__dropdown {
    position: static;
    width: 100%;
    border: none;
    border-left: 0.25rem solid var(--nav-dropdown-border, rgba(0, 0, 0, 0.15));
    box-shadow: none;
  }
  
  .nav-menu--vertical .nav-item__dropdown {
    left: 0;
  }
}
</style>