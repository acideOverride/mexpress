<template>
  <div class="dialog-examples">
    <h2>Dialog Component Examples</h2>
    
    <div class="section">
      <h3>Dialog Types</h3>
      
      <div class="button-group">
        <button class="btn" @click="showAlertDialog">Alert Dialog</button>
        <button class="btn" @click="showConfirmDialog">Confirm Dialog</button>
        <button class="btn" @click="showPromptDialog">Prompt Dialog</button>
        <button class="btn" @click="showCustomDialog = true">Custom Dialog</button>
      </div>
      
      <!-- Result display -->
      <div v-if="dialogResult !== null" class="result-box">
        <strong>Dialog Result:</strong> 
        <code>{{ JSON.stringify(dialogResult) }}</code>
      </div>
      
      <!-- Custom Dialog Example -->
      <Dialog
        v-model="showCustomDialog"
        title="Custom Dialog"
        type="custom"
      >
        <div class="custom-dialog-content">
          <p>This is a custom dialog with your own content and buttons.</p>
          <p>You can include any components or HTML you need here.</p>
          
          <div class="custom-form">
            <label for="name">Name:</label>
            <input id="name" v-model="customForm.name" type="text" placeholder="Enter your name">
            
            <label for="email">Email:</label>
            <input id="email" v-model="customForm.email" type="email" placeholder="Enter your email">
            
            <label for="message">Message:</label>
            <textarea id="message" v-model="customForm.message" placeholder="Enter your message"></textarea>
          </div>
        </div>
        
        <template #footer>
          <button class="btn btn-secondary" @click="showCustomDialog = false">Cancel</button>
          <button class="btn" @click="submitCustomForm">Submit</button>
        </template>
      </Dialog>
    </div>
    
    <div class="section">
      <h3>Dialog Service</h3>
      <p>The DialogService provides a programmatic way to show dialogs without including them in your templates.</p>
      
      <div class="button-group">
        <button class="btn" @click="showServiceAlert">Alert via Service</button>
        <button class="btn" @click="showServiceConfirm">Confirm via Service</button>
        <button class="btn" @click="showServicePrompt">Prompt via Service</button>
      </div>
      
      <!-- Result display -->
      <div v-if="serviceResult !== null" class="result-box">
        <strong>Service Result:</strong> 
        <code>{{ JSON.stringify(serviceResult) }}</code>
      </div>
    </div>
    
    <div class="section">
      <h3>Input Validation</h3>
      <button class="btn" @click="showValidatedPrompt">Prompt with Validation</button>
      
      <!-- Result display -->
      <div v-if="validationResult !== null" class="result-box">
        <strong>Validation Result:</strong> 
        <code>{{ JSON.stringify(validationResult) }}</code>
      </div>
    </div>
    
    <div class="section">
      <h3>Usage Examples</h3>
      
      <div class="code-block">
        <h4>Template Usage</h4>
        <pre><code>&lt;Dialog
  v-model="showDialog"
  title="Confirm Action"
  type="confirm"
  message="Are you sure you want to proceed?"
  @confirm="handleConfirm"
/&gt;</code></pre>
      </div>
      
      <div class="code-block">
        <h4>Service Usage (Composition API)</h4>
        <pre><code>import { useDialog } from '@/services/DialogService';

// In your setup function
const dialog = useDialog();

async function confirmAction() {
  const confirmed = await dialog.confirm({
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Yes, Proceed',
    cancelText: 'No, Cancel'
  });
  
  if (confirmed) {
    // User confirmed the action
  }
}</code></pre>
      </div>
      
      <div class="code-block">
        <h4>Service Usage (Options API / Plugin)</h4>
        <pre><code>// In your Vue instance
methods: {
  async confirmAction() {
    const confirmed = await this.$dialog.confirm({
      title: 'Confirm Action',
      message: 'Are you sure you want to proceed?'
    });
    
    if (confirmed) {
      // User confirmed the action
    }
  }
}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Dialog from './Dialog.vue';
import { dialogService } from '../../services/DialogService';

// For direct dialog usage
const showCustomDialog = ref(false);
const dialogResult = ref<any>(null);

// Form for custom dialog
const customForm = ref({
  name: '',
  email: '',
  message: ''
});

// For dialog service examples
const serviceResult = ref<any>(null);
const validationResult = ref<any>(null);

// Alert dialog example
const showAlertDialog = async () => {
  showDialog.value = true;
  dialogType.value = 'alert';
  dialogTitle.value = 'Information';
  dialogMessage.value = 'This is an alert dialog with a simple message.';
  
  // Reset other dialog props
  dialogConfirmText.value = 'OK';
  dialogCancelText.value = 'Cancel';
  dialogDefaultValue.value = '';
  
  try {
    const result = await new Promise((resolve) => {
      dialogCallback.value = resolve;
    });
    dialogResult.value = result;
  } catch (err) {
    console.error('Dialog error:', err);
  }
};

// Confirm dialog example
const showConfirmDialog = async () => {
  showDialog.value = true;
  dialogType.value = 'confirm';
  dialogTitle.value = 'Confirm Action';
  dialogMessage.value = 'Are you sure you want to proceed with this action?';
  dialogConfirmText.value = 'Yes, Proceed';
  dialogCancelText.value = 'No, Cancel';
  
  // Reset other dialog props
  dialogDefaultValue.value = '';
  
  try {
    const result = await new Promise((resolve) => {
      dialogCallback.value = resolve;
    });
    dialogResult.value = result;
  } catch (err) {
    console.error('Dialog error:', err);
  }
};

// Prompt dialog example
const showPromptDialog = async () => {
  showDialog.value = true;
  dialogType.value = 'prompt';
  dialogTitle.value = 'Enter Information';
  dialogMessage.value = 'Please enter your name:';
  dialogDefaultValue.value = 'John Doe';
  dialogConfirmText.value = 'Submit';
  dialogCancelText.value = 'Cancel';
  
  try {
    const result = await new Promise((resolve) => {
      dialogCallback.value = resolve;
    });
    dialogResult.value = result;
  } catch (err) {
    console.error('Dialog error:', err);
  }
};

// Submit form for custom dialog
const submitCustomForm = () => {
  dialogResult.value = { ...customForm.value };
  showCustomDialog.value = false;
  
  // Reset form
  customForm.value = {
    name: '',
    email: '',
    message: ''
  };
};

// Dialog service examples
const showServiceAlert = async () => {
  try {
    const result = await dialogService.alert({
      title: 'Service Alert',
      message: 'This alert was shown using the dialog service.',
      confirmText: 'Got it!'
    });
    serviceResult.value = result;
  } catch (err) {
    console.error('Dialog service error:', err);
  }
};

const showServiceConfirm = async () => {
  try {
    const result = await dialogService.confirm({
      title: 'Service Confirmation',
      message: 'This confirm dialog was shown using the dialog service. Do you want to proceed?',
      confirmText: 'Yes, Proceed',
      cancelText: 'No, Cancel'
    });
    serviceResult.value = result;
  } catch (err) {
    console.error('Dialog service error:', err);
  }
};

const showServicePrompt = async () => {
  try {
    const result = await dialogService.prompt({
      title: 'Service Prompt',
      message: 'This prompt dialog was shown using the dialog service:',
      defaultValue: 'Default value',
      confirmText: 'Submit',
      cancelText: 'Cancel'
    });
    serviceResult.value = result;
  } catch (err) {
    console.error('Dialog service error:', err);
  }
};

// Validation example
const showValidatedPrompt = async () => {
  try {
    const result = await dialogService.prompt({
      title: 'Email Validation',
      message: 'Please enter a valid email address:',
      inputType: 'email',
      inputPlaceholder: 'example@domain.com',
      inputValidator: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) || 'Please enter a valid email address';
      }
    });
    validationResult.value = result;
  } catch (err) {
    console.error('Dialog service error:', err);
  }
};

// Internal dialog state (for direct usage examples)
const showDialog = ref(false);
const dialogType = ref<'alert' | 'confirm' | 'prompt' | 'custom'>('alert');
const dialogTitle = ref('');
const dialogMessage = ref('');
const dialogConfirmText = ref('OK');
const dialogCancelText = ref('Cancel');
const dialogDefaultValue = ref('');
const dialogCallback = ref<Function>(() => {});

// Handle dialog confirmation
const handleDialogConfirm = (result: any) => {
  if (dialogCallback.value) {
    dialogCallback.value(result);
  }
};
</script>

<style scoped>
.dialog-examples {
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

h4 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #333;
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

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.result-box {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  background-color: #fff;
}

.result-box code {
  display: block;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #f1f1f1;
  border-radius: 3px;
  font-family: monospace;
  white-space: pre-wrap;
}

.custom-dialog-content {
  line-height: 1.6;
}

.custom-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.custom-form label {
  font-weight: 600;
  margin-bottom: 0.25rem;
  display: block;
}

.custom-form input,
.custom-form textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  font-size: 1rem;
}

.custom-form textarea {
  min-height: 100px;
  resize: vertical;
}

.code-block {
  margin-bottom: 1.5rem;
}

.code-block pre {
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
  font-family: monospace;
  margin: 0;
}

.code-block code {
  font-family: monospace;
  white-space: pre-wrap;
}
</style>