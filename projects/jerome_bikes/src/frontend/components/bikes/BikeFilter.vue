<template>
  <div :class="['filter-container', { compact }]">
    <div class="filter-header">
      <h3>Filter Bikes</h3>
      
      <button 
        v-if="compact" 
        class="filter-toggle-btn"
        data-test="filter-toggle"
        @click="toggleFilters"
      >
        <span v-if="isFilterVisible">
          <i class="icon-chevron-up"></i> Hide Filters
        </span>
        <span v-else>
          <i class="icon-chevron-down"></i> Show Filters
        </span>
      </button>
    </div>
    
    <div v-if="compact && hasActiveFilters" class="active-filters">
      <div v-if="filters.type" class="filter-tag">
        Type: {{ filters.type }}
        <button @click="clearFilter('type')" class="clear-filter">×</button>
      </div>
      
      <div v-if="filters.minPrice || filters.maxPrice" class="filter-tag">
        Price: 
        <span v-if="filters.minPrice">>${{ filters.minPrice }}</span>
        <span v-if="filters.minPrice && filters.maxPrice"> - </span>
        <span v-if="filters.maxPrice"><${{ filters.maxPrice }}</span>
        <button @click="clearPriceFilter" class="clear-filter">×</button>
      </div>
      
      <div v-if="filters.size" class="filter-tag">
        Size: {{ filters.size }}
        <button @click="clearFilter('size')" class="clear-filter">×</button>
      </div>
      
      <div v-if="filters.status" class="filter-tag">
        Status: {{ statusLabel[filters.status] }}
        <button @click="clearFilter('status')" class="clear-filter">×</button>
      </div>
    </div>
    
    <div :class="['filter-fields', { hidden: compact && !isFilterVisible }]">
      <!-- Bike Type Filter -->
      <div class="filter-section" data-test="type-filter">
        <label class="filter-label">Bike Type</label>
        <select v-model="filters.type" class="filter-select">
          <option value="">All Types</option>
          <option value="Mountain">Mountain</option>
          <option value="Road">Road</option>
          <option value="Urban">Urban</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Electric">Electric</option>
        </select>
      </div>
      
      <!-- Price Range Filter -->
      <div class="filter-section" data-test="price-filter">
        <label class="filter-label">Price Range (per day)</label>
        <div class="price-inputs">
          <div class="price-input">
            <span class="currency-symbol">$</span>
            <input 
              type="number" 
              v-model.number="filters.minPrice" 
              placeholder="Min" 
              min="0"
              data-test="min-price"
            />
          </div>
          <div class="separator">-</div>
          <div class="price-input">
            <span class="currency-symbol">$</span>
            <input 
              type="number" 
              v-model.number="filters.maxPrice" 
              placeholder="Max" 
              min="0"
              data-test="max-price"
            />
          </div>
        </div>
      </div>
      
      <!-- Bike Size Filter -->
      <div class="filter-section" data-test="size-filter">
        <label class="filter-label">Bike Size</label>
        <div class="size-options">
          <div 
            v-for="size in sizes" 
            :key="size" 
            :class="['size-option', { active: filters.size === size }]"
            @click="filters.size = filters.size === size ? '' : size"
          >
            <input 
              type="radio" 
              :id="`size-${size}`" 
              :value="size" 
              v-model="filters.size" 
              class="size-radio" 
            />
            <label :for="`size-${size}`" class="size-label">{{ size }}</label>
          </div>
        </div>
      </div>
      
      <!-- Station Filter -->
      <div class="filter-section" data-test="station-filter">
        <label class="filter-label">Pickup Station</label>
        <select v-model="filters.stationId" class="filter-select">
          <option value="">All Stations</option>
          <option v-for="station in stations" :key="station.id" :value="station.id">
            {{ station.name }}
          </option>
        </select>
      </div>
      
      <!-- Availability Filter -->
      <div class="filter-section" data-test="availability-filter">
        <label class="filter-label">Availability</label>
        <div class="radio-group">
          <div class="radio-option">
            <input 
              type="radio" 
              id="all-bikes" 
              value="" 
              v-model="filters.status"
            />
            <label for="all-bikes">All Bikes</label>
          </div>
          
          <div class="radio-option">
            <input 
              type="radio" 
              id="available-bikes" 
              value="available" 
              v-model="filters.status"
            />
            <label for="available-bikes">Available Only</label>
          </div>
        </div>
      </div>
      
      <!-- Error message for validation -->
      <div v-if="validationError" class="validation-error">
        {{ validationError }}
      </div>
      
      <!-- Filter Actions -->
      <div class="filter-actions">
        <button 
          type="button" 
          class="btn btn-primary" 
          data-test="apply-filters"
          @click="applyFilters"
        >
          Apply Filters
        </button>
        
        <button 
          type="button" 
          class="btn btn-text" 
          data-test="reset-filters"
          @click="resetFilters"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { BikeFilter } from '@/frontend/types/models';

// Define component props
const props = defineProps({
  // Initial filter values
  initialFilters: {
    type: Object as () => Partial<BikeFilter>,
    default: () => ({})
  },
  
  // List of available stations for the station filter
  stations: {
    type: Array,
    default: () => []
  },
  
  // Compact mode for mobile
  compact: {
    type: Boolean,
    default: false
  }
});

// Define events
const emit = defineEmits<{
  (e: 'filter-changed', filters: Partial<BikeFilter>): void
}>();

// Component state
const filters = reactive<Partial<BikeFilter>>({
  type: props.initialFilters.type || '',
  minPrice: props.initialFilters.minPrice || null,
  maxPrice: props.initialFilters.maxPrice || null,
  size: props.initialFilters.size || '',
  stationId: props.initialFilters.stationId || '',
  status: props.initialFilters.status || ''
});

const validationError = ref('');
const isFilterVisible = ref(!props.compact);

// Available bike sizes
const sizes = ['XS', 'S', 'M', 'L', 'XL'];

// Status display labels
const statusLabel = {
  'available': 'Available',
  'reserved': 'Reserved',
  'maintenance': 'In Maintenance'
};

// Check if there are any active filters
const hasActiveFilters = computed(() => {
  return (
    filters.type || 
    filters.minPrice || 
    filters.maxPrice || 
    filters.size || 
    filters.stationId || 
    filters.status
  );
});

// Filter functions
function applyFilters() {
  // Validate price range
  if (filters.minPrice && filters.maxPrice && filters.minPrice > filters.maxPrice) {
    validationError.value = 'Min price cannot be greater than max price';
    return;
  }
  
  validationError.value = '';
  
  // Only include non-empty filters
  const activeFilters: Partial<BikeFilter> = {};
  
  if (filters.type) activeFilters.type = filters.type;
  if (filters.minPrice) activeFilters.minPrice = filters.minPrice;
  if (filters.maxPrice) activeFilters.maxPrice = filters.maxPrice;
  if (filters.size) activeFilters.size = filters.size;
  if (filters.stationId) activeFilters.stationId = filters.stationId;
  if (filters.status) activeFilters.status = filters.status as 'available' | 'reserved' | 'maintenance';
  
  emit('filter-changed', activeFilters);
  
  // Hide filters in compact mode after applying
  if (props.compact) {
    isFilterVisible.value = false;
  }
}

function resetFilters() {
  // Reset all filters
  filters.type = '';
  filters.minPrice = null;
  filters.maxPrice = null;
  filters.size = '';
  filters.stationId = '';
  filters.status = '';
  
  validationError.value = '';
  
  // Emit empty filters
  emit('filter-changed', {});
}

function clearFilter(key: keyof BikeFilter) {
  if (key in filters) {
    filters[key] = '';
    applyFilters();
  }
}

function clearPriceFilter() {
  filters.minPrice = null;
  filters.maxPrice = null;
  applyFilters();
}

function toggleFilters() {
  isFilterVisible.value = !isFilterVisible.value;
}
</script>

<style scoped>
.filter-container {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-color);
}

.filter-toggle-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.filter-tag {
  background-color: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color);
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.clear-filter {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  padding: 0 2px;
  line-height: 1;
}

.filter-fields {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.filter-fields.hidden {
  display: none;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.9rem;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  font-size: 0.9rem;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-input {
  position: relative;
  flex: 1;
}

.currency-symbol {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.price-input input {
  width: 100%;
  padding: 0.5rem;
  padding-left: 1.25rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.separator {
  color: #666;
}

.size-options {
  display: flex;
  gap: 0.5rem;
}

.size-option {
  position: relative;
  flex: 1;
  text-align: center;
}

.size-radio {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.size-label {
  display: block;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.size-option.active .size-label {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.validation-error {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.filter-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
}

/* Compact mode styles */
.filter-container.compact {
  padding: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .filter-container {
    padding: 1rem;
  }
  
  .size-options {
    flex-wrap: wrap;
  }
  
  .size-option {
    flex: 0 0 calc(20% - 0.4rem);
  }
}
</style>