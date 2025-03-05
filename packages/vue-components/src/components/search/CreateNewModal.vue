<template>
  <div
    v-if="isOpen"
    class="mx-create-new-modal"
    @click.self="closeOnBackdropClick ? close() : null"
  >
    <div class="mx-create-new-modal__dialog" :class="dialogSizeClass">
      <!-- Modal Header -->
      <div class="mx-create-new-modal__header">
        <h2 class="mx-create-new-modal__title">
          {{ modalTitle }}
        </h2>
        <button
          type="button"
          class="mx-create-new-modal__close"
          @click="close"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      
      <!-- Modal Body -->
      <div class="mx-create-new-modal__body">
        <component
          :is="formComponent"
          v-if="formComponent"
          :suggestion="suggestion"
          @submit="handleSubmit"
          @cancel="close"
        />
        <template v-else>
          <p class="mx-create-new-modal__text">
            No form available for entity type: {{ suggestion?.type }}
          </p>
          <div class="mx-create-new-modal__actions">
            <button
              type="button"
              class="mx-create-new-modal__btn mx-create-new-modal__btn--primary"
              @click="close"
            >
              Close
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType, watch } from 'vue';
import { CreateNewSuggestion } from '../../composables/useMegaSearch';
import CustomerForm from './forms/CustomerForm.vue';
import ProductForm from './forms/ProductForm.vue';
import UserForm from './forms/UserForm.vue';

export default defineComponent({
  name: 'CreateNewModal',
  components: {
    CustomerForm,
    ProductForm,
    UserForm
  },
  props: {
    /**
     * Whether the modal is open
     */
    modelValue: {
      type: Boolean,
      default: false
    },
    
    /**
     * Create new suggestion data
     */
    suggestion: {
      type: Object as PropType<CreateNewSuggestion>,
      default: null
    },
    
    /**
     * Modal size
     */
    size: {
      type: String as PropType<'sm' | 'md' | 'lg' | 'xl'>,
      default: 'md'
    },
    
    /**
     * Custom title override
     */
    title: {
      type: String,
      default: ''
    },
    
    /**
     * Whether to close when clicking the backdrop
     */
    closeOnBackdropClick: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'create'],
  setup(props, { emit }) {
    // Modal open state
    const isOpen = ref(props.modelValue);
    
    // Watch for changes to modelValue prop
    watch(() => props.modelValue, (value) => {
      isOpen.value = value;
    });
    
    // Watch for changes to isOpen state
    watch(isOpen, (value) => {
      emit('update:modelValue', value);
    });
    
    // Computed properties
    const formComponent = computed(() => {
      if (!props.suggestion) return null;
      
      const formComponentMap: Record<string, any> = {
        customer: 'CustomerForm',
        product: 'ProductForm',
        user: 'UserForm'
      };
      
      return formComponentMap[props.suggestion.type.toLowerCase()];
    });
    
    const modalTitle = computed(() => {
      if (props.title) return props.title;
      
      if (!props.suggestion) return 'Create New';
      
      const entityName = props.suggestion.type.charAt(0).toUpperCase() + 
        props.suggestion.type.slice(1).toLowerCase();
      
      return `Create New ${entityName}`;
    });
    
    const dialogSizeClass = computed(() => {
      return {
        'mx-create-new-modal__dialog--sm': props.size === 'sm',
        'mx-create-new-modal__dialog--md': props.size === 'md',
        'mx-create-new-modal__dialog--lg': props.size === 'lg',
        'mx-create-new-modal__dialog--xl': props.size === 'xl'
      };
    });
    
    // Methods
    const close = () => {
      isOpen.value = false;
    };
    
    const handleSubmit = (data: any) => {
      emit('create', {
        type: props.suggestion?.type,
        data
      });
      close();
    };
    
    return {
      isOpen,
      formComponent,
      modalTitle,
      dialogSizeClass,
      close,
      handleSubmit
    };
  }
});
</script>

<style>
.mx-create-new-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow-y: auto;
  padding: 20px;
}

.mx-create-new-modal__dialog {
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 40px);
}

.mx-create-new-modal__dialog--sm {
  max-width: 400px;
}

.mx-create-new-modal__dialog--md {
  max-width: 500px;
}

.mx-create-new-modal__dialog--lg {
  max-width: 700px;
}

.mx-create-new-modal__dialog--xl {
  max-width: 900px;
}

.mx-create-new-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.mx-create-new-modal__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.mx-create-new-modal__close {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.mx-create-new-modal__close:hover {
  background-color: #f5f5f5;
  color: #333;
}

.mx-create-new-modal__body {
  padding: 20px;
  overflow-y: auto;
}

.mx-create-new-modal__text {
  margin-top: 0;
  color: #666;
}

.mx-create-new-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.mx-create-new-modal__btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
}

.mx-create-new-modal__btn--primary {
  background-color: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

.mx-create-new-modal__btn--primary:hover {
  background-color: #3a80d2;
}

.mx-create-new-modal__btn--secondary {
  background-color: white;
  color: #666;
  border-color: #ddd;
}

.mx-create-new-modal__btn--secondary:hover {
  background-color: #f5f5f5;
}
</style>