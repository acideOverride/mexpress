<template>
  <div class="product-dashboard">
    <h1 class="dashboard-title">Product Inventory</h1>

    <!-- Dashboard controls -->
    <div class="dashboard-controls">
      <div class="search-container">
        <input
          type="text"
          class="search-input"
          placeholder="Search products..."
          v-model="searchTerm"
          @input="onSearchInput"
          aria-label="Search products"
        />
        <button class="search-button" @click="searchProducts" aria-label="Search">
          <span class="search-icon">🔍</span>
        </button>
      </div>

      <div class="filter-container">
        <select
          class="filter-select"
          v-model="categoryFilter"
          @change="applyFilters"
          aria-label="Filter by category"
        >
          <option v-for="option in productCategories" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>

        <select
          class="filter-select"
          v-model="stockFilter"
          @change="applyFilters"
          aria-label="Filter by stock level"
        >
          <option v-for="option in stockStatus" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>

      <div class="action-buttons">
        <button class="action-button primary" @click="addNewProduct">
          Add New Product
        </button>
        <button
          class="action-button secondary"
          @click="refreshProducts"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="loading-indicator">↻</span>
          <span v-else>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Product table -->
    <div class="table-container">
      <Table
        :columns="columns"
        :data="displayedProducts"
        :loading="isLoading"
        sortable
        hoverable
        v-model:sort-by="sortBy"
        v-model:sort-desc="sortDesc"
        :theme="tableTheme"
        themeToggleEnabled
        rowKey="id"
        @update:theme="updateTheme"
        @row-click="viewProductDetails"
        empty-text="No products found matching your criteria"
      >
        <!-- Custom cell templates -->
        <template #cell(price)="{ value }">
          <span class="price-value">${{ formatPrice(value) }}</span>
        </template>

        <template #cell(stock)="{ value }">
          <span :class="getStockClass(value)">{{ value }}</span>
        </template>

        <template #cell(actions)="{ row }">
          <div class="action-buttons">
            <button class="table-action-button edit" @click.stop="editProduct(row)">
              Edit
            </button>
            <button class="table-action-button delete" @click.stop="deleteProduct(row)">
              Delete
            </button>
          </div>
        </template>
      </Table>
    </div>

    <!-- Product detail modal -->
    <div v-if="showDetailModal" class="modal-backdrop" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">{{ selectedProduct?.name }}</h2>
          <button class="modal-close-button" @click="closeModal" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedProduct" class="product-details">
            <div class="product-image">
              <img :src="selectedProduct.imageUrl || '/images/placeholder.jpg'" :alt="selectedProduct.name" />
            </div>
            <div class="product-info">
              <p><strong>SKU:</strong> {{ selectedProduct.sku }}</p>
              <p><strong>Description:</strong> {{ selectedProduct.description }}</p>
              <p><strong>Category:</strong> {{ selectedProduct.category }}</p>
              <p><strong>Price:</strong> ${{ formatPrice(selectedProduct.price) }}</p>
              <p><strong>Stock:</strong> <span :class="getStockClass(selectedProduct.stock)">{{ selectedProduct.stock }}</span></p>
              <p><strong>Created:</strong> {{ formatDate(selectedProduct.createdAt) }}</p>
              <p><strong>Last Updated:</strong> {{ formatDate(selectedProduct.updatedAt) }}</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-button edit" @click="editProduct(selectedProduct)">Edit</button>
          <button class="modal-button close" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { TableColumn } from '@/types';
import { Product } from '@/api/types/product';
import { productsService } from '@/api/services/products.service';
import { 
  mockProducts, 
  fetchMockProducts, 
  searchProducts, 
  productCategories, 
  stockStatus 
} from '@/services/productMockData';
import Table from '@/packages/vue-components/components/ui/Table.vue';

/**
 * ProductDashboard - A comprehensive product management dashboard
 * 
 * This component provides a complete interface for viewing and managing products
 * in the inventory. It features:
 * - Data table display with sorting and pagination
 * - Search functionality
 * - Filtering by category and stock level
 * - Detail view for individual products
 * - Basic CRUD operations
 * 
 * @component
 */
export default defineComponent({
  name: 'ProductDashboard',
  components: {
    Table
  },
  props: {
    /**
     * Controls the loading state of the component
     * When true, displays a loading spinner
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * Error message to display when there's an error loading products
     */
    error: {
      type: String,
      default: ''
    }
  },
  setup() {
    const router = useRouter();
    
    // State
    const products = ref<Product[]>([]);
    const displayedProducts = ref<Product[]>([]);
    const isLoading = ref(false);
    const errorMessage = ref('');
    const searchTerm = ref('');
    const categoryFilter = ref('all');
    const stockFilter = ref('all');
    const sortBy = ref('name');
    const sortDesc = ref(false);
    const tableTheme = ref('light');
    const showDetailModal = ref(false);
    const selectedProduct = ref<Product | null>(null);
    
    // Table columns definition
    const columns: TableColumn[] = [
      { key: 'id', label: 'ID', sortable: true, width: '60px' },
      { key: 'name', label: 'Product Name', sortable: true },
      { key: 'sku', label: 'SKU', sortable: true, width: '120px' },
      { 
        key: 'price', 
        label: 'Price', 
        sortable: true, 
        align: 'right', 
        width: '100px' 
      },
      { 
        key: 'stock', 
        label: 'Stock', 
        sortable: true, 
        align: 'center', 
        width: '80px' 
      },
      { key: 'category', label: 'Category', sortable: true, width: '120px' },
      { 
        key: 'actions', 
        label: 'Actions', 
        sortable: false, 
        align: 'center', 
        width: '140px' 
      }
    ];

    // Methods
    const loadProducts = async () => {
      isLoading.value = true;
      errorMessage.value = '';
      try {
        // In production, we would use the real API service
        // const response = await productsService.getAll();
        // For now, we'll use our mock data
        const response = await fetchMockProducts();
        products.value = response.data;
        applyFilters(); // Apply any active filters
      } catch (error) {
        errorMessage.value = 'Failed to load products. Please try again.';
        console.error('Error loading products:', error);
      } finally {
        isLoading.value = false;
      }
    };

    // Since we now use a computed property for filtering, this function just triggers reactivity
    const applyFilters = () => {
      // The watch on filteredProducts will update displayedProducts automatically
      // We just need to ensure the reactive dependencies are triggered
      searchTerm.value;
      categoryFilter.value;
      stockFilter.value;
    };

    const searchProducts = () => {
      applyFilters();
    };

    // Debounce function to prevent too many filter operations on search input
    const debounce = (fn: Function, delay: number) => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return function(...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
      };
    };
    
    // Debounced search
    const onSearchInput = debounce(() => {
      applyFilters();
    }, 300);

    const refreshProducts = () => {
      loadProducts();
    };

    const formatPrice = (price: number): string => {
      return price.toFixed(2);
    };

    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const getStockClass = (stock: number): string => {
      if (stock === 0) return 'stock-out';
      if (stock <= 10) return 'stock-low';
      return 'stock-ok';
    };

    const updateTheme = (theme: 'light' | 'dark') => {
      tableTheme.value = theme;
    };

    const addNewProduct = () => {
      // TODO: Navigate to product creation page or open modal
      alert('Add new product functionality would open a form');
    };

    const editProduct = (product: Product) => {
      // TODO: Navigate to product edit page or open modal
      alert(`Edit product: ${product.name}`);
    };

    const deleteProduct = (product: Product) => {
      // TODO: Show confirmation dialog and delete product
      alert(`Delete product: ${product.name}`);
    };

    const viewProductDetails = (product: Product) => {
      // For a complete view, navigate to the product detail page
      if (product && product.id) {
        router.push({ name: 'ProductDetail', params: { id: product.id } });
      } else {
        // Fallback to modal for any reason
        selectedProduct.value = product;
        showDetailModal.value = true;
      }
    };

    const closeModal = () => {
      showDetailModal.value = false;
      selectedProduct.value = null;
    };

    // Memoize the filtered products for better performance
    const filteredProducts = computed(() => {
      let filtered = [...products.value];
      
      // Apply category filter
      if (categoryFilter.value !== 'all') {
        filtered = filtered.filter(product => 
          product.category === categoryFilter.value
        );
      }
      
      // Apply stock filter
      switch (stockFilter.value) {
        case 'in-stock':
          filtered = filtered.filter(product => product.stock > 0);
          break;
        case 'low-stock':
          filtered = filtered.filter(product => product.stock > 0 && product.stock <= 10);
          break;
        case 'out-of-stock':
          filtered = filtered.filter(product => product.stock === 0);
          break;
      }
      
      // Apply search term
      if (searchTerm.value.trim() !== '') {
        const term = searchTerm.value.toLowerCase();
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term) ||
          product.sku.toLowerCase().includes(term) ||
          product.category?.toLowerCase().includes(term)
        );
      }
      
      return filtered;
    });
    
    // Update displayed products when filters change
    watch(filteredProducts, (newValue) => {
      displayedProducts.value = newValue;
    });

    // Watchers
    watch([sortBy, sortDesc], () => {
      // Just for demo - in production, sorting might be handled by the server
      // For now we just show that the table supports sorting
    });

    // Automatic cleanup of any subscriptions or event listeners
    let dataRefreshInterval: ReturnType<typeof setInterval>;
    
    // Lifecycle hooks
    onMounted(() => {
      loadProducts();
      
      // Set up a refresh interval for keeping data up to date
      // This would be used in production to periodically refresh data
      // For demo purposes, we'll set it to a long interval
      dataRefreshInterval = setInterval(() => {
        // In a real app, we might check if the user is active before refreshing
        // Only refresh if component is visible and user has been active
        console.log('Automatic refresh would happen here in production');
        // Actual refresh disabled for demo
        // refreshProducts();
      }, 300000); // 5 minutes
    });
    
    // Clean up resources when component is unmounted
    onUnmounted(() => {
      if (dataRefreshInterval) {
        clearInterval(dataRefreshInterval);
      }
    });

    return {
      products,
      displayedProducts,
      isLoading,
      errorMessage,
      searchTerm,
      categoryFilter,
      stockFilter,
      sortBy,
      sortDesc,
      columns,
      tableTheme,
      productCategories,
      stockStatus,
      showDetailModal,
      selectedProduct,
      
      // Methods
      loadProducts,
      applyFilters,
      searchProducts,
      onSearchInput,
      refreshProducts,
      formatPrice,
      formatDate,
      getStockClass,
      updateTheme,
      addNewProduct,
      editProduct,
      deleteProduct,
      viewProductDetails,
      closeModal
    };
  }
});
</script>

<style scoped>
.product-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

.dashboard-title {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

/* Dashboard controls */
.dashboard-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
  justify-content: space-between;
}

.search-container {
  display: flex;
  min-width: 250px;
  flex: 1;
}

.search-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-right: none;
  border-radius: 4px 0 0 4px;
  font-size: 0.9rem;
}

.search-button {
  padding: 0.5rem 0.75rem;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.search-button:hover {
  background-color: #e9ecef;
}

.filter-container {
  display: flex;
  gap: 0.5rem;
  min-width: 250px;
  flex: 1;
  justify-content: center;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  font-size: 0.9rem;
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  min-width: 200px;
}

.action-button {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  border: none;
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

/* Table specific styles */
.table-container {
  width: 100%;
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.price-value {
  font-weight: 500;
}

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

.loading-indicator {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.table-action-button {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 3px;
  cursor: pointer;
  margin: 0 0.125rem;
  border: none;
}

.table-action-button.edit {
  background-color: #17a2b8;
  color: white;
}

.table-action-button.edit:hover {
  background-color: #138496;
}

.table-action-button.delete {
  background-color: #dc3545;
  color: white;
}

.table-action-button.delete:hover {
  background-color: #c82333;
}

/* Modal styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.modal-close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  color: #6c757d;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.product-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.product-image {
  flex: 0 0 200px;
  text-align: center;
}

.product-image img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 4px;
}

.product-info {
  flex: 1;
  min-width: 300px;
}

.product-info p {
  margin: 0.5rem 0;
  line-height: 1.5;
}

.modal-footer {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: 1px solid #e9ecef;
}

.modal-button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  border: none;
}

.modal-button.edit {
  background-color: #17a2b8;
  color: white;
}

.modal-button.edit:hover {
  background-color: #138496;
}

.modal-button.close {
  background-color: #6c757d;
  color: white;
}

.modal-button.close:hover {
  background-color: #5a6268;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-container,
  .filter-container,
  .action-buttons {
    width: 100%;
  }
  
  .product-details {
    flex-direction: column;
  }
  
  .product-image {
    margin: 0 auto 1rem;
  }
}
</style>