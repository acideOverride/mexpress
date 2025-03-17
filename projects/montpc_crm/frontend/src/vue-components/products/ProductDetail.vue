<template>
  <div class="product-detail">
    <!-- Breadcrumb Navigation -->
    <div class="breadcrumb">
      <router-link to="/products" class="breadcrumb-link">Products</router-link>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">{{ product?.name || 'Product Details' }}</span>
    </div>

    <!-- Page Header with Actions -->
    <div class="page-header">
      <h1 class="page-title">{{ product?.name || 'Product Details' }}</h1>
      <div class="page-actions">
        <button 
          class="action-button primary" 
          @click="toggleEditMode" 
          v-if="!isEditMode && !isLoading && !hasError"
        >
          Edit Product
        </button>
        <button class="action-button secondary" @click="goBack">
          Back to Products
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-indicator">
        <div class="loading-spinner"></div>
        <p class="loading-text">Loading product information...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="error-container">
      <div class="error-message">
        <p class="error-text">{{ errorMessage }}</p>
        <button class="action-button primary" @click="loadProduct">Try Again</button>
      </div>
    </div>

    <!-- Product Details - View Mode -->
    <div v-else-if="!isEditMode" class="product-content">
      <div class="product-main">
        <div class="product-image-container">
          <img
            :src="product?.imageUrl || '/images/placeholder.jpg'"
            :alt="product?.name"
            class="product-image"
          />
        </div>

        <div class="product-info">
          <div class="product-info-section">
            <h2 class="section-title">Product Information</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">SKU</span>
                <span class="info-value">{{ product?.sku }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Price</span>
                <span class="info-value">${{ formatPrice(product?.price) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Stock</span>
                <span :class="['info-value', getStockClass(product?.stock)]">
                  {{ product?.stock }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Category</span>
                <span class="info-value">{{ product?.category }}</span>
              </div>
              <div class="info-item full-width">
                <span class="info-label">Description</span>
                <span class="info-value description">{{ product?.description }}</span>
              </div>
            </div>
          </div>

          <div class="product-info-section">
            <h2 class="section-title">System Information</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Created Date</span>
                <span class="info-value">{{ formatDate(product?.createdAt) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Last Updated</span>
                <span class="info-value">{{ formatDate(product?.updatedAt) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Product ID</span>
                <span class="info-value">{{ product?.id }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products Section -->
      <div class="related-products-section" v-if="relatedProducts.length > 0">
        <h2 class="section-title">Related Products</h2>
        <div class="related-products-grid">
          <div 
            v-for="relatedProduct in relatedProducts" 
            :key="relatedProduct.id" 
            class="related-product-card"
            @click="navigateToProduct(relatedProduct.id)"
          >
            <div class="related-product-image">
              <img 
                :src="relatedProduct.imageUrl || '/images/placeholder.jpg'" 
                :alt="relatedProduct.name"
              />
            </div>
            <div class="related-product-info">
              <h3 class="related-product-name">{{ relatedProduct.name }}</h3>
              <p class="related-product-price">${{ formatPrice(relatedProduct.price) }}</p>
              <p class="related-product-stock" :class="getStockClass(relatedProduct.stock)">
                Stock: {{ relatedProduct.stock }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Edit Form -->
    <div v-else class="product-edit-form">
      <h2 class="form-title">Edit Product</h2>
      <form @submit.prevent="saveProduct">
        <div class="form-grid">
          <div class="form-group">
            <label for="name" class="form-label">Product Name</label>
            <input
              id="name"
              v-model="editForm.name"
              type="text"
              class="form-input"
              :class="{ 'input-error': validationErrors.name }"
              required
            />
            <div v-if="validationErrors.name" class="validation-error">
              {{ validationErrors.name }}
            </div>
          </div>

          <div class="form-group">
            <label for="sku" class="form-label">SKU</label>
            <input
              id="sku"
              v-model="editForm.sku"
              type="text"
              class="form-input"
              :class="{ 'input-error': validationErrors.sku }"
              required
            />
            <div v-if="validationErrors.sku" class="validation-error">
              {{ validationErrors.sku }}
            </div>
          </div>

          <div class="form-group">
            <label for="price" class="form-label">Price ($)</label>
            <input
              id="price"
              v-model.number="editForm.price"
              type="number"
              step="0.01"
              min="0"
              class="form-input"
              :class="{ 'input-error': validationErrors.price }"
              required
            />
            <div v-if="validationErrors.price" class="validation-error">
              {{ validationErrors.price }}
            </div>
          </div>

          <div class="form-group">
            <label for="stock" class="form-label">Stock</label>
            <input
              id="stock"
              v-model.number="editForm.stock"
              type="number"
              min="0"
              step="1"
              class="form-input"
              :class="{ 'input-error': validationErrors.stock }"
              required
            />
            <div v-if="validationErrors.stock" class="validation-error">
              {{ validationErrors.stock }}
            </div>
          </div>

          <div class="form-group">
            <label for="category" class="form-label">Category</label>
            <select
              id="category"
              v-model="editForm.category"
              class="form-select"
              :class="{ 'input-error': validationErrors.category }"
              required
            >
              <option v-for="option in productCategories" :key="option.value" :value="option.value">
                {{ option.value === 'all' ? 'Select Category' : option.text }}
              </option>
            </select>
            <div v-if="validationErrors.category" class="validation-error">
              {{ validationErrors.category }}
            </div>
          </div>

          <div class="form-group">
            <label for="imageUrl" class="form-label">Image URL</label>
            <input
              id="imageUrl"
              v-model="editForm.imageUrl"
              type="text"
              class="form-input"
              :class="{ 'input-error': validationErrors.imageUrl }"
            />
            <div v-if="validationErrors.imageUrl" class="validation-error">
              {{ validationErrors.imageUrl }}
            </div>
          </div>

          <div class="form-group full-width">
            <label for="description" class="form-label">Description</label>
            <textarea
              id="description"
              v-model="editForm.description"
              rows="4"
              class="form-textarea"
              :class="{ 'input-error': validationErrors.description }"
            ></textarea>
            <div v-if="validationErrors.description" class="validation-error">
              {{ validationErrors.description }}
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button 
            type="button" 
            class="action-button secondary" 
            @click="cancelEdit"
            :disabled="isSaving"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="action-button primary" 
            :disabled="isSaving"
          >
            <span v-if="isSaving" class="loading-spinner-small"></span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Success Notification -->
    <div v-if="showSuccessNotification" class="success-notification">
      <div class="notification-content">
        <span class="success-icon">✓</span>
        <span>Product updated successfully!</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Product, UpdateProductDto } from '@/api/types/product';
import { 
  getProductById, 
  updateProduct, 
  getRelatedProducts,
  productCategories 
} from '@/services/productMockData';

/**
 * ProductDetail - A comprehensive product detail view and editor
 * 
 * This component provides a detailed view of a product and allows for editing
 * product information. Features include:
 * - Detailed product information display
 * - Edit mode with validation
 * - Related products from the same category
 * - Responsive design for all screen sizes
 * 
 * @component
 */
export default defineComponent({
  name: 'ProductDetail',
  
  setup() {
    const route = useRoute();
    const router = useRouter();
    
    // State
    const product = ref<Product | null>(null);
    const isLoading = ref(true);
    const hasError = ref(false);
    const errorMessage = ref('');
    const isEditMode = ref(false);
    const isSaving = ref(false);
    const relatedProducts = ref<Product[]>([]);
    const showSuccessNotification = ref(false);
    
    // Edit form state
    const editForm = ref<UpdateProductDto>({
      name: '',
      sku: '',
      price: 0,
      stock: 0,
      category: '',
      description: '',
      imageUrl: ''
    });
    
    // Validation errors
    const validationErrors = ref<Record<string, string>>({});
    
    // Computed properties
    const productId = computed(() => route.params.id as string);
    
    // Methods
    const loadProduct = async () => {
      isLoading.value = true;
      hasError.value = false;
      errorMessage.value = '';
      
      try {
        const response = await getProductById(productId.value);
        product.value = response.data;
        
        // Reset edit form with current values
        resetEditForm();
        
        // Load related products
        if (product.value?.category) {
          loadRelatedProducts(product.value.category);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        hasError.value = true;
        errorMessage.value = 'Failed to load product details. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };
    
    const loadRelatedProducts = async (category: string) => {
      try {
        const response = await getRelatedProducts(category, productId.value);
        relatedProducts.value = response.data;
      } catch (error) {
        console.error('Error loading related products:', error);
        relatedProducts.value = [];
      }
    };
    
    const resetEditForm = () => {
      if (product.value) {
        editForm.value = {
          name: product.value.name,
          sku: product.value.sku,
          price: product.value.price,
          stock: product.value.stock,
          category: product.value.category || '',
          description: product.value.description || '',
          imageUrl: product.value.imageUrl || ''
        };
      }
      validationErrors.value = {};
    };
    
    const validateForm = (): boolean => {
      const errors: Record<string, string> = {};
      
      if (!editForm.value.name || editForm.value.name.trim() === '') {
        errors.name = 'Product name is required';
      }
      
      if (!editForm.value.sku || editForm.value.sku.trim() === '') {
        errors.sku = 'SKU is required';
      }
      
      if (editForm.value.price === undefined || editForm.value.price < 0) {
        errors.price = 'Price must be a positive number';
      }
      
      if (editForm.value.stock === undefined || editForm.value.stock < 0) {
        errors.stock = 'Stock must be a non-negative number';
      }
      
      if (!editForm.value.category || editForm.value.category === 'all') {
        errors.category = 'Category is required';
      }
      
      validationErrors.value = errors;
      return Object.keys(errors).length === 0;
    };
    
    const toggleEditMode = () => {
      isEditMode.value = !isEditMode.value;
      
      if (isEditMode.value) {
        resetEditForm();
      }
    };
    
    const cancelEdit = () => {
      isEditMode.value = false;
      resetEditForm();
    };
    
    const saveProduct = async () => {
      if (!validateForm()) {
        return;
      }
      
      isSaving.value = true;
      
      try {
        const response = await updateProduct(productId.value, editForm.value);
        product.value = response.data;
        isEditMode.value = false;
        
        // Show success notification
        showSuccessNotification.value = true;
        setTimeout(() => {
          showSuccessNotification.value = false;
        }, 3000);
        
        // Reload related products in case category changed
        if (product.value?.category) {
          loadRelatedProducts(product.value.category);
        }
      } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product. Please try again.');
      } finally {
        isSaving.value = false;
      }
    };
    
    const navigateToProduct = (id: string) => {
      router.push({ name: 'ProductDetail', params: { id } });
    };
    
    const goBack = () => {
      router.push({ name: 'ProductDashboard' });
    };
    
    const formatPrice = (price?: number): string => {
      return price !== undefined ? price.toFixed(2) : '0.00';
    };
    
    const formatDate = (dateString?: string): string => {
      if (!dateString) return 'N/A';
      
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    const getStockClass = (stock?: number): string => {
      if (stock === undefined) return '';
      if (stock === 0) return 'stock-out';
      if (stock <= 10) return 'stock-low';
      return 'stock-ok';
    };
    
    // Lifecycle hooks
    onMounted(() => {
      loadProduct();
    });
    
    // Watch for route changes to reload data when navigating between products
    watch(() => route.params.id, (newId, oldId) => {
      if (newId !== oldId) {
        loadProduct();
      }
    });
    
    return {
      // State
      product,
      isLoading,
      hasError,
      errorMessage,
      isEditMode,
      isSaving,
      relatedProducts,
      editForm,
      validationErrors,
      productCategories,
      showSuccessNotification,
      
      // Methods
      loadProduct,
      toggleEditMode,
      cancelEdit,
      saveProduct,
      navigateToProduct,
      goBack,
      formatPrice,
      formatDate,
      getStockClass
    };
  }
});
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  position: relative;
}

/* Breadcrumb Navigation */
.breadcrumb {
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.breadcrumb-link {
  color: #007bff;
  text-decoration: none;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
}

.breadcrumb-current {
  font-weight: 500;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.75rem;
  margin: 0;
  color: #333;
}

.page-actions {
  display: flex;
  gap: 0.5rem;
}

/* Buttons */
.action-button {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
}

.action-button:active {
  transform: translateY(1px);
}

.action-button.primary {
  background-color: #007bff;
  color: white;
}

.action-button.primary:hover {
  background-color: #0069d9;
}

.action-button.secondary {
  background-color: #6c757d;
  color: white;
}

.action-button.secondary:hover {
  background-color: #5a6268;
}

.action-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Loading State */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.loading-indicator {
  text-align: center;
}

.loading-spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 123, 255, 0.3);
  border-radius: 50%;
  border-top-color: #007bff;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-spinner-small {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error-container {
  text-align: center;
  padding: 2rem;
  background-color: #f8d7da;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.error-text {
  color: #721c24;
  margin-bottom: 1rem;
}

/* Product Content */
.product-content {
  margin-bottom: 2rem;
}

.product-main {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 2rem;
}

.product-image-container {
  flex: 0 0 300px;
  max-width: 300px;
}

.product-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  object-fit: contain;
}

.product-info {
  flex: 1;
  min-width: 300px;
}

.product-info-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-weight: 500;
  color: #6c757d;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.info-value {
  font-size: 1.1rem;
}

.info-value.description {
  white-space: pre-line;
  line-height: 1.5;
}

/* Stock Indicators */
.stock-ok {
  color: #28a745;
  font-weight: 500;
}

.stock-low {
  color: #ffc107;
  font-weight: 500;
}

.stock-out {
  color: #dc3545;
  font-weight: 500;
}

/* Related Products */
.related-products-section {
  margin-top: 3rem;
}

.related-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.related-product-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.related-product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.related-product-image {
  height: 150px;
  overflow: hidden;
}

.related-product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s;
}

.related-product-card:hover .related-product-image img {
  transform: scale(1.05);
}

.related-product-info {
  padding: 1rem;
}

.related-product-name {
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.related-product-price {
  font-weight: 500;
  font-size: 1.1rem;
  margin: 0 0 0.25rem 0;
}

.related-product-stock {
  margin: 0;
  font-size: 0.9rem;
}

/* Edit Form */
.product-edit-form {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.input-error {
  border-color: #dc3545;
}

.validation-error {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Success Notification */
.success-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #28a745;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fade-in 0.3s ease-out, fade-out 0.3s ease-in 2.7s forwards;
  z-index: 1000;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.success-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-out {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .product-main {
    flex-direction: column;
  }
  
  .product-image-container {
    max-width: 100%;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .page-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>