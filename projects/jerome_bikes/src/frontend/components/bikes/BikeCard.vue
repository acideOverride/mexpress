<template>
  <div class="bike-card">
    <div class="bike-image">
      <img :src="bike.imageUrl" :alt="bike.model + ' bike'" loading="lazy" />
      <div :class="['status-indicator', statusClass]">
        <span class="status-text">{{ statusText }}</span>
      </div>
    </div>
    
    <div class="bike-info">
      <div class="bike-header">
        <h3 class="bike-model">{{ bike.model }}</h3>
        <div class="bike-rating">
          <span class="stars">
            <i class="icon-star" v-for="i in Math.floor(bike.rating)" :key="`full-${i}`"></i>
            <i class="icon-star-half" v-if="bike.rating % 1 >= 0.5"></i>
          </span>
          <span class="rating-value">{{ bike.rating.toFixed(1) }}</span>
        </div>
      </div>
      
      <div class="bike-details">
        <div class="bike-type">{{ bike.type }}</div>
        <div class="bike-size">Size: {{ bike.size }}</div>
        <div class="bike-price" data-test="bike-price">
          <span class="price-amount">${{ bike.pricePerDay }}</span>
          <span class="price-period">/ day</span>
        </div>
      </div>
      
      <div class="bike-features">
        <span class="feature-tag" v-for="(feature, index) in displayFeatures" :key="index">
          {{ feature }}
        </span>
      </div>
      
      <div class="bike-actions">
        <button 
          class="btn btn-outline" 
          data-test="view-details-button"
          @click="$emit('view-details', bike.id)"
        >
          View Details
        </button>
        
        <button 
          class="btn btn-primary" 
          data-test="reserve-button"
          @click="$emit('reserve', bike.id)"
          :disabled="bike.status !== 'available'"
        >
          Reserve
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bike } from '@/frontend/types/models';

// Props
const props = defineProps<{
  bike: Bike
}>();

// Emits
defineEmits<{
  (e: 'view-details', id: string): void
  (e: 'reserve', id: string): void
}>();

// Computed properties
const statusClass = computed(() => {
  return {
    'available': props.bike.status === 'available',
    'reserved': props.bike.status === 'reserved',
    'maintenance': props.bike.status === 'maintenance'
  }[props.bike.status] || 'unknown';
});

const statusText = computed(() => {
  return {
    'available': 'Available',
    'reserved': 'Reserved',
    'maintenance': 'In Maintenance'
  }[props.bike.status] || 'Unknown';
});

// Only show max 3 features in card view
const displayFeatures = computed(() => {
  return props.bike.features.slice(0, 3);
});
</script>

<style scoped>
.bike-card {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}

.bike-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.bike-image {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.bike-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.bike-card:hover .bike-image img {
  transform: scale(1.1);
}

.status-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

.status-indicator.available {
  background-color: #27ae60;
}

.status-indicator.reserved {
  background-color: #e67e22;
}

.status-indicator.maintenance {
  background-color: #e74c3c;
}

.bike-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.bike-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.bike-model {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-color);
  font-weight: 600;
}

.bike-rating {
  display: flex;
  align-items: center;
  color: #ffa41c;
  font-weight: 600;
}

.stars {
  margin-right: 4px;
}

.bike-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.bike-type {
  font-size: 0.9rem;
  color: #666;
  background-color: #f0f0f0;
  padding: 2px 8px;
  border-radius: 12px;
}

.bike-size {
  font-size: 0.9rem;
  color: #666;
}

.bike-price {
  font-weight: 600;
  color: var(--primary-color);
}

.price-amount {
  font-size: 1.1rem;
}

.price-period {
  font-size: 0.8rem;
  color: #666;
}

.bike-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 1.25rem;
  min-height: 30px;
}

.feature-tag {
  background-color: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color);
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 12px;
  white-space: nowrap;
}

.bike-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

.bike-actions button {
  flex: 1;
  font-size: 0.9rem;
  padding: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .bike-actions {
    flex-direction: column;
  }
  
  .bike-image {
    height: 160px;
  }
}
</style>