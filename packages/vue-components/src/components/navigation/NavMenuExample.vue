<template>
  <div class="example-container">
    <h2>NavMenu and NavItem Components</h2>
    
    <div class="description">
      <p>Navigation menu system with:</p>
      <ul>
        <li>Horizontal and vertical orientations</li>
        <li>Dropdown support</li>
        <li>Active state highlighting</li>
        <li>Badge support</li>
        <li>Icon support</li>
        <li>Disabled items</li>
      </ul>
    </div>
    
    <div class="controls">
      <div class="control-group">
        <label>Orientation:
          <select v-model="orientation">
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
        </label>
      </div>
    </div>
    
    <h3>Basic {{ orientation }} Menu</h3>
    <div class="menu-container" :class="{ 'menu-container--vertical': orientation === 'vertical' }">
      <NavMenu :orientation="orientation">
        <NavItem active>Home</NavItem>
        <NavItem>About</NavItem>
        <NavItem>Services</NavItem>
        <NavItem>Contact</NavItem>
      </NavMenu>
    </div>
    
    <h3>Advanced Features</h3>
    <div class="menu-container" :class="{ 'menu-container--vertical': orientation === 'vertical' }">
      <NavMenu :orientation="orientation">
        <NavItem>
          <template #icon>
            <span class="icon">🏠</span>
          </template>
          Home
        </NavItem>
        
        <NavItem :badge="3">
          <template #icon>
            <span class="icon">🔔</span>
          </template>
          Notifications
        </NavItem>
        
        <NavItem disabled>
          <template #icon>
            <span class="icon">🔒</span>
          </template>
          Admin
        </NavItem>
        
        <NavItem v-model:open="productsOpen">
          <template #icon>
            <span class="icon">📦</span>
          </template>
          Products
          <template #dropdown>
            <div class="submenu">
              <NavItem>Electronics</NavItem>
              <NavItem>Clothing</NavItem>
              <NavItem>Home & Garden</NavItem>
              <NavItem v-model:open="electronicsOpen">
                More Categories
                <template #dropdown>
                  <div class="submenu">
                    <NavItem>Computers</NavItem>
                    <NavItem>Phones</NavItem>
                    <NavItem>Accessories</NavItem>
                  </div>
                </template>
              </NavItem>
            </div>
          </template>
        </NavItem>
      </NavMenu>
    </div>
    
    <div class="state-display">
      <p>Products dropdown: <strong>{{ productsOpen ? 'Open' : 'Closed' }}</strong></p>
      <p>Electronics dropdown: <strong>{{ electronicsOpen ? 'Open' : 'Closed' }}</strong></p>
      <button class="btn" @click="productsOpen = !productsOpen">
        {{ productsOpen ? 'Close' : 'Open' }} Products
      </button>
      <button class="btn" @click="electronicsOpen = !electronicsOpen" :disabled="!productsOpen">
        {{ electronicsOpen ? 'Close' : 'Open' }} Electronics
      </button>
    </div>
    
    <div class="code-example">
      <h3>Basic Usage</h3>
      <pre><code>&lt;NavMenu orientation="horizontal"&gt;
  &lt;NavItem active&gt;Home&lt;/NavItem&gt;
  &lt;NavItem&gt;About&lt;/NavItem&gt;
  &lt;NavItem&gt;Services&lt;/NavItem&gt;
  &lt;NavItem&gt;Contact&lt;/NavItem&gt;
&lt;/NavMenu&gt;</code></pre>

      <h3>With Dropdown</h3>
      <pre><code>&lt;NavItem v-model:open="isOpen"&gt;
  Products
  &lt;template #dropdown&gt;
    &lt;div class="submenu"&gt;
      &lt;NavItem&gt;Electronics&lt;/NavItem&gt;
      &lt;NavItem&gt;Clothing&lt;/NavItem&gt;
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/NavItem&gt;</code></pre>

      <h3>With Icon and Badge</h3>
      <pre><code>&lt;NavItem :badge="3"&gt;
  &lt;template #icon&gt;
    &lt;span class="icon"&gt;🔔&lt;/span&gt;
  &lt;/template&gt;
  Notifications
&lt;/NavItem&gt;</code></pre>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import NavMenu from './NavMenu.vue';
import NavItem from './NavItem.vue';

export default defineComponent({
  name: 'NavMenuExample',
  components: {
    NavMenu,
    NavItem
  },
  setup() {
    const orientation = ref('horizontal');
    const productsOpen = ref(false);
    const electronicsOpen = ref(false);
    
    return {
      orientation,
      productsOpen,
      electronicsOpen
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

.description {
  margin-bottom: 24px;
}

.controls {
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.control-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.menu-container {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 16px;
}

.menu-container--vertical {
  width: 250px;
}

.icon {
  display: inline-flex;
  margin-right: 8px;
}

.submenu {
  width: 200px;
}

.state-display {
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.btn {
  padding: 8px 16px;
  margin-right: 8px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.code-example {
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  margin-bottom: 16px;
}

code {
  font-family: monospace;
  display: block;
  padding: 12px;
  background-color: #eee;
  border-radius: 4px;
}
</style>