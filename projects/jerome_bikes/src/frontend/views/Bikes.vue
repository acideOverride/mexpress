<template>
  <div class="bikes-page">
    <div class="container">
      <div class="page-header">
        <h1>Our Bike Collection</h1>
        <p class="lead">Find the perfect bike for your adventure</p>
      </div>
      
      <div class="bikes-layout">
        <div class="sidebar">
          <BikeFilter 
            :stations="stations"
            :initial-filters="filters"
            @filter-changed="applyFilters"
          />
        </div>
        
        <div class="main-content">
          <div class="bikes-toolbar">
            <div class="search-bar">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search bikes..."
                @input="debouncedSearch"
              />
              <button class="search-btn">
                <i class="icon-search"></i>
              </button>
            </div>
            
            <div class="view-toggles">
              <span>View:</span>
              <button 
                :class="['view-toggle', { active: viewMode === 'grid' }]"
                data-test="grid-view-toggle"
                @click="viewMode = 'grid'"
              >
                <i class="icon-grid"></i>
              </button>
              <button 
                :class="['view-toggle', { active: viewMode === 'list' }]"
                data-test="list-view-toggle"
                @click="viewMode = 'list'"
              >
                <i class="icon-list"></i>
              </button>
            </div>
          </div>
          
          <div data-test="loading-state" v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading bikes...</p>
          </div>
          
          <div v-else-if="error" class="error-state">
            <p class="error-message">{{ error }}</p>
            <button 
              class="btn btn-primary" 
              @click="fetchBikes"
            >
              Try Again
            </button>
          </div>
          
          <div v-else-if="bikesData.data.length === 0" class="no-results">
            <div class="empty-icon">🔍</div>
            <h3>No bikes found</h3>
            <p>
              Try adjusting your filters or search query, or 
              <button class="btn-link" @click="resetFilters">reset all filters</button>
            </p>
          </div>
          
          <div v-else>
            <!-- Grid View -->
            <div v-if="viewMode === 'grid'" class="bikes-grid">
              <div v-for="bike in bikesData.data" :key="bike.id" class="grid-item">
                <BikeCard 
                  :bike="bike"
                  @view-details="openBikeDetail"
                  @reserve="goToReservation"
                />
              </div>
            </div>
            
            <!-- List View -->
            <div v-else class="bikes-list">
              <div v-for="bike in bikesData.data" :key="bike.id" class="list-item">
                <div class="list-image">
                  <img :src="bike.imageUrl" :alt="bike.model" loading="lazy" />
                </div>
                
                <div class="list-content">
                  <div class="list-header">
                    <h3 class="bike-model">{{ bike.model }}</h3>
                    <div class="bike-rating">
                      <span class="stars">
                        <i class="icon-star" v-for="i in Math.floor(bike.rating)" :key="`full-${i}`"></i>
                        <i class="icon-star-half" v-if="bike.rating % 1 >= 0.5"></i>
                      </span>
                      <span class="rating-value">{{ bike.rating.toFixed(1) }}</span>
                    </div>
                  </div>
                  
                  <div class="list-details">
                    <div class="bike-meta">
                      <span class="bike-type">{{ bike.type }}</span>
                      <span class="bike-size">Size: {{ bike.size }}</span>
                      <span class="bike-status" :class="getStatusClass(bike)">
                        {{ getStatusText(bike) }}
                      </span>
                    </div>
                    
                    <p class="bike-description">{{ bike.description }}</p>
                    
                    <div class="bike-features">
                      <span class="feature-tag" v-for="(feature, index) in bike.features.slice(0, 3)" :key="index">
                        {{ feature }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="list-actions">
                    <div class="bike-price">
                      <span class="price-amount">${{ bike.pricePerDay }}</span>
                      <span class="price-period">/ day</span>
                    </div>
                    
                    <div class="action-buttons">
                      <button 
                        class="btn btn-outline" 
                        @click="openBikeDetail(bike.id)"
                      >
                        View Details
                      </button>
                      
                      <button 
                        class="btn btn-primary" 
                        @click="goToReservation(bike.id)"
                        :disabled="bike.status !== 'available'"
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Pagination -->
            <div class="bikes-pagination">
              <button 
                class="page-link"
                :disabled="currentPage === 1"
                @click="goToPage(currentPage - 1)"
              >
                <i class="icon-chevron-left"></i> Previous
              </button>
              
              <div class="page-numbers">
                <button 
                  v-for="page in displayedPages" 
                  :key="page"
                  :class="['page-number', { active: page === currentPage }]"
                  @click="goToPage(page)"
                >
                  {{ page }}
                </button>
              </div>
              
              <button 
                class="page-link"
                :disabled="currentPage === bikesData.totalPages"
                @click="goToPage(currentPage + 1)"
              >
                Next <i class="icon-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Bike Detail Modal -->
    <BikeDetail
      v-if="selectedBikeId"
      :bike-id="selectedBikeId"
      :is-open="isDetailOpen"
      @close="closeDetail"
      @reserve="goToReservation"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BikeService from '@/frontend/services/bike.service';
import BikeFilter from '@/frontend/components/bikes/BikeFilter.vue';
import BikeCard from '@/frontend/components/bikes/BikeCard.vue';
import BikeDetail from '@/frontend/components/bikes/BikeDetail.vue';
import { Bike, BikeFilter as BikeFilterType, PaginatedResponse } from '@/frontend/types/models';

// Router
const router = useRouter();

// Component state
const viewMode = ref<'grid' | 'list'>('grid');
const loading = ref(false);
const error = ref('');
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(12);
const bikesData = reactive<PaginatedResponse<Bike>>({
  data: [],
  page: 1,
  limit: 12,
  totalCount: 0,
  totalPages: 1
});
const filters = reactive<Partial<BikeFilterType>>({});
const selectedBikeId = ref<string | null>(null);
const isDetailOpen = ref(false);

// Mock stations data (would normally come from an API)
const stations = ref([
  { id: 'station1', name: 'Downtown Station' },
  { id: 'station2', name: 'West Side Station' },
  { id: 'station3', name: 'East Side Station' },
  { id: 'station4', name: 'North Station' }
]);

// Fetch bikes on component mount
onMounted(() => {
  fetchBikes();
});

// Search with debounce
let searchTimeout: number | null = null;
const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  searchTimeout = window.setTimeout(() => {
    fetchBikes();
  }, 500);
};

// Computed properties for pagination
const displayedPages = computed(() => {
  const totalPages = bikesData.totalPages;
  const currentPageVal = currentPage.value;
  
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  if (currentPageVal <= 3) {
    return [1, 2, 3, 4, 5];
  }
  
  if (currentPageVal >= totalPages - 2) {
    return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  
  return [currentPageVal - 2, currentPageVal - 1, currentPageVal, currentPageVal + 1, currentPageVal + 2];
});

// Methods
async function fetchBikes() {
  loading.value = true;
  error.value = '';
  
  try {
    if (searchQuery.value) {
      // Search for bikes with query
      bikesData.data = []; // Clear current data
      const result = await BikeService.searchBikes(
        searchQuery.value,
        currentPage.value,
        itemsPerPage.value
      );
      Object.assign(bikesData, result);
    } else {
      // Get bikes with optional filters
      bikesData.data = []; // Clear current data
      const result = await BikeService.getAllBikes(
        filters,
        currentPage.value,
        itemsPerPage.value
      );
      Object.assign(bikesData, result);
    }
  } catch (err: any) {
    console.error('Error fetching bikes:', err);
    error.value = err.message || 'Failed to load bikes. Please try again.';
  } finally {
    loading.value = false;
  }
}

function applyFilters(newFilters: Partial<BikeFilterType>) {
  // Reset to page 1 when filters change
  currentPage.value = 1;
  
  // Apply new filters
  Object.assign(filters, newFilters);
  
  // Fetch bikes with new filters
  fetchBikes();
}

function resetFilters() {
  // Clear all filters
  Object.keys(filters).forEach(key => {
    delete filters[key as keyof BikeFilterType];
  });
  
  // Reset search and page
  searchQuery.value = '';
  currentPage.value = 1;
  
  // Fetch bikes without filters
  fetchBikes();
}

function goToPage(page: number) {
  if (page < 1 || page > bikesData.totalPages) return;
  
  currentPage.value = page;
  fetchBikes();
  
  // Scroll to top of results
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.scrollTop = 0;
  }
}

function openBikeDetail(bikeId: string) {
  selectedBikeId.value = bikeId;
  isDetailOpen.value = true;
}

function closeDetail() {
  isDetailOpen.value = false;
  // Wait for close animation
  setTimeout(() => {
    selectedBikeId.value = null;
  }, 300);
}

function goToReservation(bikeId: string) {
  // Navigate to reservations page with bike ID
  router.push({
    path: '/reservations',
    query: { bikeId }
  });
}

function getStatusClass(bike: Bike) {
  return {
    'available': 'status-available',
    'reserved': 'status-reserved',
    'maintenance': 'status-maintenance'
  }[bike.status] || '';
}

function getStatusText(bike: Bike) {
  return {
    'available': 'Available',
    'reserved': 'Reserved',
    'maintenance': 'In Maintenance'
  }[bike.status] || 'Unknown';
}
</script>

<style scoped>
.bikes-page {
  padding: 4rem 0;
}

.page-header {
  margin-bottom: 3rem;
  text-align: center;
}

.page-header h1 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.lead {
  font-size: 1.25rem;
  color: #666;
}

.bikes-layout {
  display: flex;
  gap: 2rem;
}

.sidebar {
  flex: 0 0 280px;
}

.main-content {
  flex: 1;
}

.bikes-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-bar {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-bar input {
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
}

.search-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  font-size: 1rem;
  cursor: pointer;
}

.view-toggles {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.view-toggles span {
  font-size: 0.9rem;
  color: #666;
}

.view-toggle {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: #666;
  font-size: 1.25rem;
}

.view-toggle.active {
  color: var(--primary-color);
}

.loading-state, .error-state, .no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
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

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-results h3 {
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.no-results p {
  color: #666;
}

.btn-link {
  background: none;
  border: none;
  color: var(--primary-color);
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
}

/* Grid view */
.bikes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.grid-item {
  height: 100%;
}

/* List view */
.bikes-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.list-item {
  display: flex;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
}

.list-image {
  flex: 0 0 200px;
  height: 200px;
}

.list-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.list-content {
  flex: 1;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.list-header .bike-model {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-color);
  font-weight: 600;
}

.list-header .bike-rating {
  display: flex;
  align-items: center;
  color: #ffa41c;
  font-weight: 600;
}

.list-details {
  flex: 1;
}

.bike-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.bike-meta .bike-type {
  background-color: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.bike-meta .bike-size {
  font-size: 0.8rem;
  color: #666;
}

.bike-meta .bike-status {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  color: white;
}

.bike-meta .status-available {
  background-color: #27ae60;
}

.bike-meta .status-reserved {
  background-color: #e67e22;
}

.bike-meta .status-maintenance {
  background-color: #e74c3c;
}

.bike-description {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #444;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bike-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature-tag {
  background-color: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary-color);
  font-size: 0.8rem;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
}

.list-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.list-actions .bike-price {
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

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-buttons button {
  font-size: 0.9rem;
  padding: 0.4rem 0.75rem;
}

/* Pagination */
.bikes-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.page-link {
  background: none;
  border: none;
  color: var(--primary-color);
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.page-link:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
  margin: 0 0.5rem;
}

.page-number {
  background: none;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
}

.page-number.active {
  background-color: var(--primary-color);
  color: white;
}

/* Responsive adjustments */
@media (max-width: 991px) {
  .bikes-layout {
    flex-direction: column;
  }
  
  .sidebar {
    flex: none;
    width: 100%;
  }
}

@media (max-width: 767px) {
  .bikes-toolbar {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .search-bar {
    width: 100%;
    max-width: none;
  }
  
  .view-toggles {
    align-self: flex-end;
  }
  
  .list-item {
    flex-direction: column;
  }
  
  .list-image {
    flex: none;
    width: 100%;
    height: 200px;
  }
  
  .list-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .action-buttons {
    width: 100%;
  }
  
  .action-buttons button {
    flex: 1;
  }
}
</style>