<template>
  <div class="example-container">
    <h2>Navbar Component</h2>
    
    <h3>Basic Navbar</h3>
    <Navbar v-model:expanded="expanded">
      <template #brand>
        <div class="brand">
          <img src="https://placehold.co/30x30" alt="Logo" />
          <span>Brand</span>
        </div>
      </template>
      <NavMenu>
        <NavItem active>Home</NavItem>
        <NavItem>About</NavItem>
        <NavItem>Services</NavItem>
        <NavItem>Contact</NavItem>
      </NavMenu>
      <template #actions>
        <button class="btn">Login</button>
      </template>
    </Navbar>
    
    <div class="props-control">
      <h3>Props</h3>
      <div class="prop-group">
        <label>Position:</label>
        <select v-model="position">
          <option value="static">Static</option>
          <option value="fixed-top">Fixed Top</option>
          <option value="fixed-bottom">Fixed Bottom</option>
          <option value="sticky-top">Sticky Top</option>
        </select>
      </div>
      <div class="prop-group">
        <label>
          <input type="checkbox" v-model="expanded" /> 
          Expanded
        </label>
      </div>
      <div class="prop-group">
        <label>
          <input type="checkbox" v-model="collapsible" /> 
          Collapsible
        </label>
      </div>
    </div>
    
    <h3>Position: {{ position }}</h3>
    <Navbar :position="position" :collapsible="collapsible" v-model:expanded="expanded">
      <template #brand>
        <div class="brand">
          <img src="https://placehold.co/30x30" alt="Logo" />
          <span>Brand</span>
        </div>
      </template>
      <NavMenu>
        <NavItem>Home</NavItem>
        <NavItem active>About</NavItem>
        <NavItem>Services</NavItem>
        <NavItem :badge="3">Notifications</NavItem>
        <NavItem v-model:open="dropdownOpen">
          Products
          <template #dropdown>
            <div class="dropdown-content">
              <NavItem>Product 1</NavItem>
              <NavItem>Product 2</NavItem>
              <NavItem>Product 3</NavItem>
            </div>
          </template>
        </NavItem>
      </NavMenu>
      <template #actions>
        <button class="btn">Login</button>
      </template>
    </Navbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Navbar from './Navbar.vue';
import NavMenu from './NavMenu.vue';
import NavItem from './NavItem.vue';

export default defineComponent({
  name: 'NavbarExample',
  components: {
    Navbar,
    NavMenu,
    NavItem
  },
  setup() {
    const position = ref('static');
    const expanded = ref(false);
    const collapsible = ref(true);
    const dropdownOpen = ref(false);
    
    return {
      position,
      expanded,
      collapsible,
      dropdownOpen
    };
  }
});
</script>

<style scoped>
.example-container {
  margin: 20px;
  font-family: sans-serif;
}

.example-container h2 {
  margin-bottom: 16px;
}

.example-container h3 {
  margin: 24px 0 12px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 18px;
}

.props-control {
  margin: 24px 0;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.prop-group {
  margin: 8px 0;
}

.prop-group label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dropdown-content {
  width: 200px;
}
</style>