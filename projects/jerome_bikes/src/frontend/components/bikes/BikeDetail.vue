<template>
  <div v-if="isOpen" class="bike-detail-modal">
    <div class="modal-backdrop" @click="$emit('close')"></div>
    
    <div class="modal-container">
      <div class="modal-header">
        <button 
          class="close-button" 
          data-test="close-detail"
          @click="$emit('close')"
        >
          ×
        </button>
      </div>
      
      <div class="modal-content">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading bike details...</p>
        </div>
        
        <div v-else-if="error" class="error-state">
          <p class="error-message">{{ error }}</p>
          <button 
            class="btn btn-primary" 
            @click="loadBikeData"
          >
            Try Again
          </button>
        </div>
        
        <div v-else-if="bike" class="bike-detail">
          <div class="bike-gallery">
            <img :src="bike.imageUrl" :alt="bike.model" class="bike-image" />
            <div :class="['bike-status', statusClass]">
              {{ statusText }}
            </div>
          </div>
          
          <div class="bike-info">
            <h2 class="bike-model">{{ bike.model }}</h2>
            
            <div class="bike-meta">
              <div class="bike-type">{{ bike.type }}</div>
              <div class="bike-size">Size: {{ bike.size }}</div>
              <div class="bike-rating">
                <span class="stars">
                  <i class="icon-star" v-for="i in Math.floor(bike.rating)" :key="`full-${i}`"></i>
                  <i class="icon-star-half" v-if="bike.rating % 1 >= 0.5"></i>
                </span>
                <span class="rating-value">{{ bike.rating.toFixed(1) }}</span>
              </div>
            </div>
            
            <div class="bike-description">
              {{ bike.description }}
            </div>
            
            <div class="bike-pricing">
              <div class="price-item">
                <div class="price-label">Hourly Rate</div>
                <div class="price-value">${{ bike.pricePerHour }}/hour</div>
              </div>
              
              <div class="price-item">
                <div class="price-label">Daily Rate</div>
                <div class="price-value">${{ bike.pricePerDay }}/day</div>
              </div>
            </div>
            
            <div class="bike-features-section">
              <h3>Features</h3>
              <ul class="features-list">
                <li v-for="(feature, index) in bike.features" :key="index">
                  {{ feature }}
                </li>
              </ul>
            </div>
            
            <div class="bike-location">
              <h3>Pickup Location</h3>
              <div v-if="station" class="station-info">
                <div class="station-name">{{ station.name }}</div>
                <div class="station-address">{{ station.address }}</div>
                <div class="station-hours">
                  Opens: {{ station.openingHour }} - Closes: {{ station.closingHour }}
                </div>
              </div>
              <div v-else class="station-loading">
                Loading station information...
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="bike && bike.status === 'available'" class="modal-footer">
        <button 
          class="btn btn-primary btn-full" 
          data-test="reserve-bike"
          @click="$emit('reserve', bike.id)"
        >
          Reserve This Bike
        </button>
      </div>
      
      <div v-else-if="bike && bike.status !== 'available'" class="modal-footer">
        <div class="unavailable-notice">
          This bike is currently {{ statusText.toLowerCase() }} and cannot be reserved.
        </div>
        <button 
          class="btn btn-outline btn-full" 
          @click="$emit('close')"
        >
          Browse Other Bikes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import BikeService from '@/frontend/services/bike.service';
import { Bike, Station } from '@/frontend/types/models';

// Props
const props = defineProps<{
  bikeId: string;
  isOpen: boolean;
}>();

// Emits
defineEmits<{
  (e: 'close'): void;
  (e: 'reserve', id: string): void;
}>();

// Component state
const bike = ref<Bike | null>(null);
const station = ref<Station | null>(null);
const loading = ref(false);
const error = ref('');

// Watch for changes in bikeId or isOpen
watch(() => props.bikeId, loadBikeData);
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    loadBikeData();
  }
});

// Computed properties
const statusClass = computed(() => {
  if (!bike.value) return '';
  
  return {
    'available': 'status-available',
    'reserved': 'status-reserved',
    'maintenance': 'status-maintenance'
  }[bike.value.status] || '';
});

const statusText = computed(() => {
  if (!bike.value) return '';
  
  return {
    'available': 'Available',
    'reserved': 'Reserved',
    'maintenance': 'In Maintenance'
  }[bike.value.status] || 'Unknown';
});

// Load bike data when component is mounted and isOpen
onMounted(() => {
  if (props.isOpen) {
    loadBikeData();
  }
});

// Function to load bike data
async function loadBikeData() {
  if (!props.bikeId) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    // Get bike details
    bike.value = await BikeService.getBikeById(props.bikeId);
    
    // Also load station information if available
    // In a real implementation, you would have a StationService
    if (bike.value && bike.value.stationId) {
      // Mock function to demonstrate - in real app, this would use a service
      loadStationData(bike.value.stationId);
    }
  } catch (err: any) {
    console.error('Error loading bike details:', err);
    error.value = err.message || 'Failed to load bike details';
    bike.value = null;
  } finally {
    loading.value = false;
  }
}

// Mock function to load station data
// In a real implementation, this would use a StationService
async function loadStationData(stationId: string) {
  // Simulate station data
  setTimeout(() => {
    station.value = {
      id: stationId,
      name: 'Downtown Station',
      address: '123 Main St, City',
      city: 'Example City',
      state: 'EX',
      zip: '12345',
      coordinates: [0, 0],
      openingHour: '8:00 AM',
      closingHour: '8:00 PM',
      isActive: true,
      availableBikes: 12,
      capacity: 20
    };
  }, 500);
}
</script>

<style scoped>
.bike-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-container {
  position: relative;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 1001;
}

.modal-header {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
}

.close-button:hover {
  color: var(--primary-color);
}

.modal-content {
  padding: 0 2rem 2rem;
  overflow-y: auto;
  flex-grow: 1;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #eee;
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-left-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
}

.bike-detail {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.bike-gallery {
  position: relative;
  width: 100%;
  max-height: 400px;
  overflow: hidden;
  border-radius: var(--border-radius);
}

.bike-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bike-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 600;
  color: white;
}

.status-available {
  background-color: #27ae60;
}

.status-reserved {
  background-color: #e67e22;
}

.status-maintenance {
  background-color: #e74c3c;
}

.bike-info {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.bike-model {
  margin: 0;
  font-size: 2rem;
  color: var(--text-color);
}

.bike-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.bike-type {
  background-color: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.9rem;
}

.bike-size {
  font-size: 0.9rem;
  color: #666;
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

.bike-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
}

.bike-pricing {
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
}

.price-item {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 0.9rem;
  color: #666;
}

.price-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
}

.bike-features-section h3,
.bike-location h3 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: var(--text-color);
}

.features-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
}

.features-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
}

.features-list li::before {
  content: "✓";
  color: var(--primary-color);
  font-weight: bold;
}

.station-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.station-name {
  font-weight: 600;
}

.station-address, .station-hours {
  font-size: 0.9rem;
  color: #666;
}

.unavailable-notice {
  background-color: #fff3cd;
  color: #856404;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
  text-align: center;
}

.btn-full {
  width: 100%;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .bike-detail {
    flex-direction: row;
    align-items: flex-start;
  }
  
  .bike-gallery {
    flex: 0 0 45%;
    max-height: none;
    height: 350px;
  }
  
  .bike-info {
    flex: 1;
    padding-left: 1rem;
  }
}

@media (max-width: 767px) {
  .modal-container {
    width: 95%;
    max-height: 95vh;
  }
  
  .modal-content {
    padding: 0 1rem 1rem;
  }
  
  .modal-footer {
    padding: 1rem;
  }
  
  .bike-pricing {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .features-list {
    grid-template-columns: 1fr;
  }
}
</style>