<template>
  <div class="example-container">
    <h2>Drawer Component</h2>
    
    <div class="controls">
      <div class="control-group">
        <button class="btn" @click="drawer = true">Open Drawer</button>
        <label>Position:
          <select v-model="position">
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
          </select>
        </label>
      </div>
      
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="showHeader" />
          Show Header
        </label>
        
        <label>
          <input type="checkbox" v-model="showClose" />
          Show Close Button
        </label>
        
        <label>
          <input type="checkbox" v-model="closeOnBackdrop" />
          Close on Backdrop Click
        </label>
        
        <label>
          <input type="checkbox" v-model="lockScroll" />
          Lock Scroll
        </label>
      </div>
      
      <div class="control-group">
        <label>Title: <input type="text" v-model="title" /></label>
      </div>
    </div>
    
    <Drawer
      v-model="drawer"
      :position="position"
      :title="title"
      :show-header="showHeader"
      :show-close="showClose"
      :close-on-backdrop="closeOnBackdrop"
      :lock-scroll="lockScroll"
    >
      <template #header v-if="customHeader">
        <div class="custom-header">
          <h3>Custom Header</h3>
          <button class="btn-close" @click="drawer = false">×</button>
        </div>
      </template>
      
      <div class="drawer-content">
        <h3>Drawer Content</h3>
        <p>This is a drawer component that can be positioned on any side of the screen.</p>
        <p>It supports:</p>
        <ul>
          <li>Custom headers</li>
          <li>Custom content</li>
          <li>Custom footers</li>
          <li>Backdrop click to close</li>
          <li>Scroll locking</li>
        </ul>
        
        <label>
          <input type="checkbox" v-model="customHeader" />
          Use Custom Header
        </label>
        
        <label>
          <input type="checkbox" v-model="showFooter" />
          Show Footer
        </label>
        
        <button class="btn close-btn" @click="drawer = false">Close Drawer</button>
      </div>
      
      <template #footer v-if="showFooter">
        <div class="drawer-footer">
          <button class="btn" @click="drawer = false">Cancel</button>
          <button class="btn btn-primary" @click="drawer = false">Confirm</button>
        </div>
      </template>
    </Drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Drawer from './Drawer.vue';

export default defineComponent({
  name: 'DrawerExample',
  components: {
    Drawer
  },
  setup() {
    const drawer = ref(false);
    const position = ref('left');
    const title = ref('Drawer Title');
    const showHeader = ref(true);
    const showClose = ref(true);
    const closeOnBackdrop = ref(true);
    const lockScroll = ref(true);
    const customHeader = ref(false);
    const showFooter = ref(false);
    
    return {
      drawer,
      position,
      title,
      showHeader,
      showClose,
      closeOnBackdrop,
      lockScroll,
      customHeader,
      showFooter
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

.controls {
  margin-bottom: 20px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.control-group {
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.btn {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #2196f3;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 16px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ddd;
}

.custom-header h3 {
  margin: 0;
}

.drawer-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.drawer-content label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 8px 16px;
  border-top: 1px solid #ddd;
}

.close-btn {
  margin-top: 16px;
}
</style>