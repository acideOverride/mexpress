<template>
  <nav class="navbar" :class="[position && `navbar--${position}`, { 'navbar--expanded': expanded }]">
    <div class="navbar__container">
      <div class="navbar__brand">
        <slot name="brand"></slot>
      </div>
      <button 
        v-if="collapsible" 
        class="navbar__toggle" 
        @click="toggleExpanded"
        aria-label="Toggle navigation"
        :aria-expanded="expanded"
      >
        <span class="navbar__toggle-icon"></span>
      </button>
      <div class="navbar__content" :class="{ 'navbar__content--visible': expanded }">
        <div class="navbar__menu">
          <slot></slot>
        </div>
        <div class="navbar__actions">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { NavbarProps } from '@/types';

export default defineComponent({
  name: 'Navbar',
  props: {
    position: {
      type: String,
      default: 'static',
      validator: (value: string) => ['static', 'fixed-top', 'fixed-bottom', 'sticky-top'].includes(value)
    },
    collapsible: {
      type: Boolean,
      default: true
    },
    expanded: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:expanded'],
  setup(props, { emit }) {
    const toggleExpanded = () => {
      emit('update:expanded', !props.expanded);
    };

    return {
      toggleExpanded
    };
  }
});
</script>

<style scoped>
.navbar {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background-color: var(--navbar-bg-color, #fff);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar--fixed-top {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;
}

.navbar--fixed-bottom {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1030;
}

.navbar--sticky-top {
  position: sticky;
  top: 0;
  z-index: 1020;
}

.navbar__container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.navbar__brand {
  display: flex;
  align-items: center;
  margin-right: 1rem;
  font-size: 1.25rem;
  white-space: nowrap;
}

.navbar__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.25rem;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  cursor: pointer;
}

.navbar__toggle-icon {
  position: relative;
  display: inline-block;
  width: 1.5rem;
  height: 0.125rem;
  background-color: var(--navbar-toggle-color, #333);
  transition: transform 0.3s ease;
}

.navbar__toggle-icon::before,
.navbar__toggle-icon::after {
  position: absolute;
  left: 0;
  display: inline-block;
  width: 100%;
  height: 0.125rem;
  background-color: var(--navbar-toggle-color, #333);
  content: "";
  transition: transform 0.3s ease;
}

.navbar__toggle-icon::before {
  top: -0.5rem;
}

.navbar__toggle-icon::after {
  bottom: -0.5rem;
}

.navbar--expanded .navbar__toggle-icon {
  background-color: transparent;
}

.navbar--expanded .navbar__toggle-icon::before {
  top: 0;
  transform: rotate(45deg);
}

.navbar--expanded .navbar__toggle-icon::after {
  bottom: 0;
  transform: rotate(-45deg);
}

.navbar__content {
  display: flex;
  flex-basis: 100%;
  flex-grow: 1;
  align-items: center;
}

@media (max-width: 992px) {
  .navbar__content {
    display: none;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .navbar__content--visible {
    display: flex;
  }

  .navbar__menu,
  .navbar__actions {
    width: 100%;
    padding: 0.5rem 0;
  }
}

@media (min-width: 992px) {
  .navbar__toggle {
    display: none;
  }

  .navbar__content {
    display: flex !important;
  }

  .navbar__menu {
    display: flex;
    flex-grow: 1;
  }

  .navbar__actions {
    display: flex;
    align-items: center;
  }
}
</style>