<template>
  <div class="example-container">
    <h2>RouterLink Component</h2>
    
    <div class="description">
      <p>Enhanced Vue Router link with additional features:</p>
      <ul>
        <li>Active state styling with custom classes</li>
        <li>External link detection with icon</li>
        <li>Disabled state</li>
        <li>Target attribute support (_blank, _self, etc.)</li>
        <li>Prefetch capability for faster navigation</li>
        <li>Analytics event tracking</li>
      </ul>
    </div>
    
    <div class="controls">
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="disabled" />
          Disabled
        </label>
        
        <label>Target:
          <select v-model="target">
            <option value="_self">_self</option>
            <option value="_blank">_blank</option>
            <option value="_parent">_parent</option>
            <option value="_top">_top</option>
          </select>
        </label>
        
        <label>
          <input type="checkbox" v-model="prefetch" />
          Prefetch
        </label>
      </div>
    </div>
    
    <div class="example-links">
      <h3>Internal Links</h3>
      <div class="link-list">
        <RouterLink to="/home" :disabled="disabled" :target="target" :prefetch="prefetch" trackEvent="home-click">Home</RouterLink>
        <RouterLink to="/about" :disabled="disabled" :target="target" :prefetch="prefetch" trackEvent="about-click">About</RouterLink>
        <RouterLink to="/contact" :disabled="disabled" :target="target" :prefetch="prefetch">Contact</RouterLink>
      </div>
      
      <h3>Object Notation</h3>
      <div class="link-list">
        <RouterLink :to="{ path: '/products', query: { category: 'electronics' } }" :disabled="disabled">Products</RouterLink>
        <RouterLink :to="{ name: 'user', params: { id: '123' } }" :disabled="disabled">User Profile</RouterLink>
      </div>
      
      <h3>External Links</h3>
      <div class="link-list">
        <RouterLink to="https://example.com" :disabled="disabled" :target="target">Example.com</RouterLink>
        <RouterLink to="https://google.com" :disabled="disabled" :target="target">Google.com</RouterLink>
      </div>
      
      <h3>Active Links (current path: /home)</h3>
      <div class="link-list">
        <RouterLink to="/home" activeClass="custom-active" exactActiveClass="custom-exact-active">
          Home (active)
        </RouterLink>
        <RouterLink to="/about">About (inactive)</RouterLink>
      </div>
    </div>
    
    <div class="code-example">
      <h3>Usage Example</h3>
      <pre><code>&lt;RouterLink 
  to="/dashboard" 
  :disabled="false" 
  target="_self"
  :prefetch="true"
  trackEvent="dashboard-view"
&gt;
  Dashboard
&lt;/RouterLink&gt;</code></pre>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import RouterLink from './RouterLink.vue';

export default defineComponent({
  name: 'RouterLinkExample',
  components: {
    RouterLink
  },
  setup() {
    const disabled = ref(false);
    const target = ref('_self');
    const prefetch = ref(false);
    
    return {
      disabled,
      target,
      prefetch
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

.example-links {
  margin-bottom: 24px;
}

.example-links h3 {
  margin: 16px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #eee;
}

.link-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 16px;
}

.code-example {
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

pre {
  margin: 0;
  white-space: pre-wrap;
}

code {
  font-family: monospace;
}

.custom-active {
  color: #f00 !important;
  font-weight: bold;
}

.custom-exact-active {
  color: #00f !important;
  text-decoration: underline !important;
}
</style>