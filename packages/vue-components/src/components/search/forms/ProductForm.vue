<template>
  <form class="mx-product-form" @submit.prevent="handleSubmit">
    <div class="mx-product-form__fields">
      <!-- Product Name -->
      <div class="mx-product-form__field">
        <label for="name" class="mx-product-form__label">Product Name *</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          class="mx-product-form__input"
          :class="{ 'mx-product-form__input--error': errors.name }"
          placeholder="Enter product name"
          required
        />
        <div v-if="errors.name" class="mx-product-form__error">
          {{ errors.name }}
        </div>
      </div>
      
      <!-- SKU -->
      <div class="mx-product-form__field">
        <label for="sku" class="mx-product-form__label">SKU *</label>
        <input
          id="sku"
          v-model="formData.sku"
          type="text"
          class="mx-product-form__input"
          :class="{ 'mx-product-form__input--error': errors.sku }"
          placeholder="ABC123"
          required
        />
        <div v-if="errors.sku" class="mx-product-form__error">
          {{ errors.sku }}
        </div>
      </div>
      
      <!-- Price & Category Row -->
      <div class="mx-product-form__row">
        <div class="mx-product-form__field mx-product-form__field--half">
          <label for="price" class="mx-product-form__label">Price *</label>
          <div class="mx-product-form__price-wrapper">
            <span class="mx-product-form__currency-symbol">$</span>
            <input
              id="price"
              v-model="formData.price"
              type="number"
              step="0.01"
              min="0"
              class="mx-product-form__input mx-product-form__input--price"
              :class="{ 'mx-product-form__input--error': errors.price }"
              placeholder="0.00"
              required
            />
          </div>
          <div v-if="errors.price" class="mx-product-form__error">
            {{ errors.price }}
          </div>
        </div>
        
        <div class="mx-product-form__field mx-product-form__field--half">
          <label for="category" class="mx-product-form__label">Category *</label>
          <select
            id="category"
            v-model="formData.category"
            class="mx-product-form__input"
            :class="{ 'mx-product-form__input--error': errors.category }"
            required
          >
            <option value="" disabled>Select category</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ formatCategory(category) }}
            </option>
          </select>
          <div v-if="errors.category" class="mx-product-form__error">
            {{ errors.category }}
          </div>
        </div>
      </div>
      
      <!-- Description -->
      <div class="mx-product-form__field">
        <label for="description" class="mx-product-form__label">Description</label>
        <textarea
          id="description"
          v-model="formData.description"
          class="mx-product-form__textarea"
          :class="{ 'mx-product-form__input--error': errors.description }"
          placeholder="Enter product description"
          rows="3"
        ></textarea>
        <div v-if="errors.description" class="mx-product-form__error">
          {{ errors.description }}
        </div>
      </div>
      
      <!-- Tags -->
      <div class="mx-product-form__field">
        <label for="tags" class="mx-product-form__label">Tags</label>
        <div class="mx-product-form__tags">
          <div
            v-for="(tag, index) in formData.tags"
            :key="index"
            class="mx-product-form__tag"
          >
            {{ tag }}
            <button
              type="button"
              class="mx-product-form__tag-remove"
              @click="removeTag(index)"
              aria-label="Remove tag"
            >
              &times;
            </button>
          </div>
          <input
            ref="tagInput"
            v-model="newTag"
            type="text"
            class="mx-product-form__tag-input"
            placeholder="Add tag"
            @keydown.enter.prevent="addTag"
            @keydown.comma.prevent="addTag"
          />
        </div>
        <div class="mx-product-form__hint">
          Press Enter or "," to add a tag
        </div>
      </div>
      
      <!-- Stock Level & Status Row -->
      <div class="mx-product-form__row">
        <div class="mx-product-form__field mx-product-form__field--half">
          <label for="stockLevel" class="mx-product-form__label">Stock Level *</label>
          <input
            id="stockLevel"
            v-model="formData.stockLevel"
            type="number"
            min="0"
            step="1"
            class="mx-product-form__input"
            :class="{ 'mx-product-form__input--error': errors.stockLevel }"
            placeholder="0"
            required
          />
          <div v-if="errors.stockLevel" class="mx-product-form__error">
            {{ errors.stockLevel }}
          </div>
        </div>
        
        <div class="mx-product-form__field mx-product-form__field--half">
          <label for="status" class="mx-product-form__label">Status *</label>
          <select
            id="status"
            v-model="formData.status"
            class="mx-product-form__input"
            :class="{ 'mx-product-form__input--error': errors.status }"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div v-if="errors.status" class="mx-product-form__error">
            {{ errors.status }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Form Actions -->
    <div class="mx-product-form__actions">
      <button
        type="button"
        class="mx-product-form__btn mx-product-form__btn--secondary"
        @click="$emit('cancel')"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="mx-product-form__btn mx-product-form__btn--primary"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Creating...' : 'Create Product' }}
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, PropType, nextTick } from 'vue';
import { CreateNewSuggestion } from '../../../composables/useMegaSearch';

export default defineComponent({
  name: 'ProductForm',
  props: {
    suggestion: {
      type: Object as PropType<CreateNewSuggestion>,
      required: true
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    // Available categories
    const categories = [
      'electronics',
      'clothing',
      'books',
      'home',
      'sports',
      'toys',
      'food',
      'health',
      'beauty',
      'automotive'
    ];
    
    // Format category for display
    const formatCategory = (category: string): string => {
      return category.charAt(0).toUpperCase() + category.slice(1);
    };
    
    // Form state
    const isSubmitting = ref(false);
    const tagInput = ref<HTMLInputElement | null>(null);
    const newTag = ref('');
    
    // Form data, initialized with suggestion values
    const formData = reactive({
      name: props.suggestion.prefilledData.name || '',
      sku: props.suggestion.prefilledData.sku || '',
      price: props.suggestion.prefilledData.price || '',
      category: props.suggestion.prefilledData.category || 'electronics',
      description: props.suggestion.prefilledData.description || '',
      tags: props.suggestion.prefilledData.tags || [] as string[],
      stockLevel: props.suggestion.prefilledData.stockLevel || 0,
      status: props.suggestion.prefilledData.status || 'active'
    });
    
    // Form errors
    const errors: Record<string, string> = reactive({});
    
    // Add a new tag
    const addTag = () => {
      if (!newTag.value.trim()) return;
      
      const tag = newTag.value.trim();
      
      // Check if tag already exists
      if (!formData.tags.includes(tag)) {
        formData.tags.push(tag);
      }
      
      newTag.value = '';
      
      // Focus the tag input after adding a tag
      nextTick(() => {
        if (tagInput.value) {
          tagInput.value.focus();
        }
      });
    };
    
    // Remove a tag
    const removeTag = (index: number) => {
      formData.tags.splice(index, 1);
    };
    
    // Validate form
    const validate = (): boolean => {
      // Clear previous errors
      Object.keys(errors).forEach(key => delete errors[key]);
      
      let isValid = true;
      
      // Name validation
      if (!formData.name.trim()) {
        errors.name = 'Product name is required';
        isValid = false;
      } else if (formData.name.length < 2) {
        errors.name = 'Product name must be at least 2 characters';
        isValid = false;
      }
      
      // SKU validation
      if (!formData.sku.trim()) {
        errors.sku = 'SKU is required';
        isValid = false;
      } else if (!/^[A-Za-z0-9]+$/.test(formData.sku)) {
        errors.sku = 'SKU must be alphanumeric';
        isValid = false;
      }
      
      // Price validation
      if (!formData.price) {
        errors.price = 'Price is required';
        isValid = false;
      } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
        errors.price = 'Price must be a positive number';
        isValid = false;
      }
      
      // Category validation
      if (!formData.category) {
        errors.category = 'Category is required';
        isValid = false;
      }
      
      // Description validation (optional)
      if (formData.description && formData.description.length > 1000) {
        errors.description = 'Description cannot exceed 1000 characters';
        isValid = false;
      }
      
      // Stock level validation
      if (formData.stockLevel === '' || formData.stockLevel === null) {
        errors.stockLevel = 'Stock level is required';
        isValid = false;
      } else if (isNaN(Number(formData.stockLevel)) || Number(formData.stockLevel) < 0 || !Number.isInteger(Number(formData.stockLevel))) {
        errors.stockLevel = 'Stock level must be a non-negative integer';
        isValid = false;
      }
      
      // Status validation
      if (!formData.status) {
        errors.status = 'Status is required';
        isValid = false;
      }
      
      return isValid;
    };
    
    // Handle form submission
    const handleSubmit = async () => {
      if (!validate()) {
        return;
      }
      
      isSubmitting.value = true;
      
      try {
        // In a real app, you would submit to the API here
        // For now, we'll just emit the form data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulated API call
        
        emit('submit', {
          ...formData,
          // Ensure proper types
          price: Number(formData.price),
          stockLevel: Number(formData.stockLevel),
          sku: formData.sku.toUpperCase()
        });
      } catch (error) {
        console.error('Error creating product:', error);
      } finally {
        isSubmitting.value = false;
      }
    };
    
    return {
      formData,
      errors,
      isSubmitting,
      categories,
      newTag,
      tagInput,
      formatCategory,
      addTag,
      removeTag,
      handleSubmit
    };
  }
});
</script>

<style>
.mx-product-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.mx-product-form__fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mx-product-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mx-product-form__row {
  display: flex;
  gap: 12px;
}

.mx-product-form__field--half {
  flex: 1;
}

.mx-product-form__label {
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.mx-product-form__input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
  width: 100%;
}

.mx-product-form__textarea {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
  resize: vertical;
  min-height: 80px;
  width: 100%;
  font-family: inherit;
}

.mx-product-form__input:focus,
.mx-product-form__textarea:focus {
  border-color: #4a90e2;
  outline: none;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);
}

.mx-product-form__input--error,
.mx-product-form__textarea.mx-product-form__input--error {
  border-color: #e53935;
}

.mx-product-form__input--error:focus,
.mx-product-form__textarea.mx-product-form__input--error:focus {
  border-color: #e53935;
  box-shadow: 0 0 0 2px rgba(229, 57, 53, 0.1);
}

.mx-product-form__price-wrapper {
  position: relative;
}

.mx-product-form__currency-symbol {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  z-index: 1;
}

.mx-product-form__input--price {
  padding-left: 24px;
}

.mx-product-form__error {
  font-size: 12px;
  color: #e53935;
  margin-top: 2px;
}

.mx-product-form__hint {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.mx-product-form__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 42px;
}

.mx-product-form__tag {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #f0f7ff;
  color: #4a90e2;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.mx-product-form__tag-remove {
  border: none;
  background: none;
  color: #4a90e2;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mx-product-form__tag-input {
  border: none;
  padding: 4px;
  flex: 1;
  min-width: 120px;
  font-size: 14px;
  outline: none;
}

.mx-product-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.mx-product-form__btn {
  padding: 10px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
}

.mx-product-form__btn--primary {
  background-color: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

.mx-product-form__btn--primary:hover:not(:disabled) {
  background-color: #3a80d2;
}

.mx-product-form__btn--primary:disabled {
  background-color: #a0c4f1;
  border-color: #a0c4f1;
  cursor: not-allowed;
}

.mx-product-form__btn--secondary {
  background-color: white;
  color: #666;
  border-color: #ddd;
}

.mx-product-form__btn--secondary:hover {
  background-color: #f5f5f5;
}
</style>