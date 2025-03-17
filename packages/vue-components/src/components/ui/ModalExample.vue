<template>
  <div class="modal-examples">
    <h2>Modal Component Examples</h2>
    
    <div class="section">
      <h3>Basic Modal</h3>
      <button class="btn" @click="showBasicModal = true">Open Basic Modal</button>
      
      <Modal v-model="showBasicModal" title="Basic Modal">
        <p>This is a basic modal with default settings.</p>
        <p>Modals are used to display content that temporarily blocks interactions with the main view.</p>
        
        <template #footer>
          <button class="btn" @click="showBasicModal = false">Close</button>
        </template>
      </Modal>
    </div>
    
    <div class="section">
      <h3>Modal Sizes</h3>
      <div class="button-group">
        <button class="btn" @click="openSizedModal('sm')">Small Modal</button>
        <button class="btn" @click="openSizedModal('md')">Medium Modal</button>
        <button class="btn" @click="openSizedModal('lg')">Large Modal</button>
        <button class="btn" @click="openSizedModal('xl')">Extra Large Modal</button>
        <button class="btn" @click="openSizedModal('full')">Full Width Modal</button>
      </div>
      
      <Modal
        v-model="showSizedModal"
        :title="`${currentSize.toUpperCase()} Modal`"
        :size="currentSize"
      >
        <div>
          <p>This modal demonstrates the <strong>{{ currentSize }}</strong> size option.</p>
          <p>Available sizes are: sm, md, lg, xl, and full.</p>
        </div>
        
        <template #footer>
          <button class="btn" @click="showSizedModal = false">Close</button>
        </template>
      </Modal>
    </div>
    
    <div class="section">
      <h3>Modal with Transitions</h3>
      <div class="button-group">
        <button class="btn" @click="openTransitionModal('modal-fade')">Fade Transition</button>
        <button class="btn" @click="openTransitionModal('modal-slide')">Slide Transition</button>
        <button class="btn" @click="openTransitionModal('modal-scale')">Scale Transition</button>
      </div>
      
      <Modal
        v-model="showTransitionModal"
        :title="`${currentTransition} Transition`"
        :transition="currentTransition"
      >
        <p>This modal demonstrates the <strong>{{ currentTransition }}</strong> transition option.</p>
        <p>You can define custom transitions by adding the appropriate CSS rules.</p>
        
        <template #footer>
          <button class="btn" @click="showTransitionModal = false">Close</button>
        </template>
      </Modal>
    </div>
    
    <div class="section">
      <h3>Modal Positioning</h3>
      <div class="button-group">
        <button class="btn" @click="openPositionedModal(false)">Default Position</button>
        <button class="btn" @click="openPositionedModal(true)">Centered Modal</button>
      </div>
      
      <Modal
        v-model="showPositionedModal"
        :title="centered ? 'Centered Modal' : 'Default Position'"
        :centered="centered"
      >
        <p>This modal demonstrates the <strong>{{ centered ? 'centered' : 'default' }}</strong> positioning option.</p>
        <p>By default, modals align to the top. Set the centered prop to true to center vertically.</p>
        
        <template #footer>
          <button class="btn" @click="showPositionedModal = false">Close</button>
        </template>
      </Modal>
    </div>
    
    <div class="section">
      <h3>Scrollable Modal</h3>
      <button class="btn" @click="showScrollableModal = true">Open Scrollable Modal</button>
      
      <Modal
        v-model="showScrollableModal"
        title="Scrollable Modal"
        scrollable
      >
        <div>
          <p>This modal demonstrates the scrollable content area.</p>
          <p>When content exceeds the available height, the body becomes scrollable while the header and footer remain fixed.</p>
          
          <div v-for="i in 20" :key="i" class="modal-content-item">
            <strong>Item {{ i }}</strong>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>
        
        <template #footer>
          <button class="btn" @click="showScrollableModal = false">Close</button>
        </template>
      </Modal>
    </div>
    
    <div class="section">
      <h3>Persistent Modal</h3>
      <button class="btn" @click="showPersistentModal = true">Open Persistent Modal</button>
      
      <Modal
        v-model="showPersistentModal"
        title="Persistent Modal"
        persistent
      >
        <p>This modal is <strong>persistent</strong>, meaning it can't be closed by:</p>
        <ul>
          <li>Clicking outside the modal</li>
          <li>Pressing the ESC key</li>
        </ul>
        <p>You can only close it by clicking the provided button below.</p>
        
        <template #footer>
          <button class="btn" @click="showPersistentModal = false">Close Modal</button>
        </template>
      </Modal>
    </div>
    
    <div class="section">
      <h3>Modal with Custom Styling</h3>
      <button class="btn" @click="showCustomModal = true">Open Custom Styled Modal</button>
      
      <Modal
        v-model="showCustomModal"
        title="Custom Styled Modal"
        class="custom-modal"
      >
        <div class="custom-modal-content">
          <p>This modal demonstrates custom styling applied via CSS classes.</p>
          <p>You can customize modals to match your application's design system.</p>
        </div>
        
        <template #footer>
          <button class="btn-custom" @click="showCustomModal = false">Close</button>
        </template>
      </Modal>
    </div>
    
    <div class="section">
      <h3>Header and Close Button Options</h3>
      <div class="button-group">
        <button class="btn" @click="openHeaderModal('normal')">Normal Header</button>
        <button class="btn" @click="openHeaderModal('no-close')">No Close Button</button>
        <button class="btn" @click="openHeaderModal('no-header')">No Header</button>
      </div>
      
      <Modal
        v-model="showHeaderModal"
        title="Header Options"
        :hide-close="headerMode === 'no-close'"
        :hide-header="headerMode === 'no-header'"
      >
        <p>This modal demonstrates the header configuration options:</p>
        <ul>
          <li><strong>Normal header:</strong> Includes title and close button</li>
          <li><strong>No close button:</strong> Only shows the title</li>
          <li><strong>No header:</strong> Removes the entire header section</li>
        </ul>
        
        <template #footer>
          <button class="btn" @click="showHeaderModal = false">Close</button>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from './Modal.vue';

// Basic modal
const showBasicModal = ref(false);

// Sized modal
const showSizedModal = ref(false);
const currentSize = ref('md');

const openSizedModal = (size: string) => {
  currentSize.value = size;
  showSizedModal.value = true;
};

// Transition modal
const showTransitionModal = ref(false);
const currentTransition = ref('modal-fade');

const openTransitionModal = (transition: string) => {
  currentTransition.value = transition;
  showTransitionModal.value = true;
};

// Positioned modal
const showPositionedModal = ref(false);
const centered = ref(false);

const openPositionedModal = (isCentered: boolean) => {
  centered.value = isCentered;
  showPositionedModal.value = true;
};

// Scrollable modal
const showScrollableModal = ref(false);

// Persistent modal
const showPersistentModal = ref(false);

// Custom modal
const showCustomModal = ref(false);

// Header options modal
const showHeaderModal = ref(false);
const headerMode = ref('normal');

const openHeaderModal = (mode: string) => {
  headerMode.value = mode;
  showHeaderModal.value = true;
};
</script>

<style scoped>
.modal-examples {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h2 {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: #333;
}

h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #555;
}

.section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  background-color: #f6f8fa;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  background-color: #0366d6;
  color: white;
  transition: background-color 0.2s ease-in-out;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.btn:hover {
  background-color: #0255b3;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.modal-content-item {
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  background-color: #f6f8fa;
}

/* Custom modal styling */
:deep(.custom-modal .modal-container) {
  border-radius: 1rem;
  background-color: #2a2a2a;
  color: #ffffff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

:deep(.custom-modal .modal-header) {
  background-color: #1a1a1a;
  color: #ffffff;
  border-bottom: 1px solid #3a3a3a;
}

:deep(.custom-modal .modal-footer) {
  background-color: #1a1a1a;
  border-top: 1px solid #3a3a3a;
}

:deep(.custom-modal .modal-title) {
  color: #ffffff;
}

:deep(.custom-modal .modal-close) {
  color: #ffffff;
}

.custom-modal-content {
  line-height: 1.6;
}

.btn-custom {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: #bb86fc;
  color: #000;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.btn-custom:hover {
  background-color: #a370db;
  transform: translateY(-1px);
}
</style>