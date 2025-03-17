<template>
  <div 
    class="nav-menu" 
    :class="[orientation && `nav-menu--${orientation}`]"
    role="menubar"
    :aria-orientation="orientation"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { NavMenuProps } from '@/types';

export default defineComponent({
  name: 'NavMenu',
  props: {
    orientation: {
      type: String,
      default: 'horizontal',
      validator: (value: string) => ['horizontal', 'vertical'].includes(value)
    }
  }
});
</script>

<style scoped>
.nav-menu {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-menu--horizontal {
  flex-direction: row;
  flex-wrap: wrap;
}

.nav-menu--vertical {
  flex-direction: column;
}

@media (max-width: 992px) {
  .nav-menu--horizontal {
    flex-direction: column;
  }
}
</style>