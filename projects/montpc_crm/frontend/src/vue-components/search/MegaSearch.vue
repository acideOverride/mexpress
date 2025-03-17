<template>
  <div class="mega-search" :class="{ 'is-open': isOpen }">
    <!-- Search Trigger Button -->
    <button 
      class="search-trigger" 
      @click="openSearch" 
      aria-label="Open search"
      ref="searchTriggerRef"
    >
      <span class="search-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
        </svg>
      </span>
      <span class="search-label">{{ placeholder }}</span>
      <span class="shortcut-hint">
        <kbd>Ctrl</kbd><kbd>{{ shortcutKey.toUpperCase() }}</kbd>
      </span>
    </button>

    <!-- Search Modal -->
    <div v-if="isOpen" class="search-modal-backdrop" @click="closeSearch">
      <div class="search-modal" @click.stop ref="modalRef">
        <div class="search-modal-header">
          <div class="search-input-container">
            <div class="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              class="search-input"
              :placeholder="placeholder"
              v-model="searchTerm"
              ref="searchInputRef"
              @keydown.escape="closeSearch"
              @keydown.up.prevent="navigateResults('up')"
              @keydown.down.prevent="navigateResults('down')"
              @keydown.enter="selectCurrentResult"
              @keydown.tab.prevent="navigateResults('down')"
              @keydown.shift.tab.prevent="navigateResults('up')"
            />
            <button 
              v-if="searchTerm.length > 0" 
              class="clear-search" 
              @click="clearSearch" 
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
            <button 
              class="close-search" 
              @click="closeSearch" 
              aria-label="Close search"
            >
              <kbd>ESC</kbd>
            </button>
          </div>
        </div>

        <div class="search-modal-body">
          <!-- Loading State -->
          <div v-if="isLoading" class="search-loading">
            <div class="loading-spinner"></div>
            <p>Searching...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="hasError" class="search-error">
            <div class="error-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
              </svg>
            </div>
            <p>{{ errorMessage }}</p>
            <button class="retry-button" @click="retrySearch">Try Again</button>
          </div>

          <!-- Empty Search Term -->
          <div v-else-if="!searchTerm.trim() && recentSearches.length > 0" class="recent-searches">
            <h3 class="search-section-title">Recent Searches</h3>
            <ul class="search-results-list">
              <li 
                v-for="(term, index) in recentSearches" 
                :key="`recent-${index}`"
                class="search-result-item recent-search-item"
                :class="{ 'is-selected': selectedIndex === index }"
                @click="useRecentSearch(term)"
                :ref="el => { if (el) resultRefs[index] = el }"
              >
                <div class="search-result-icon recent-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0V5z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="search-result-content">
                  <div class="search-result-title">{{ term }}</div>
                  <div class="search-result-subtitle">Recent search</div>
                </div>
              </li>
            </ul>
          </div>

          <!-- No Results -->
          <div v-else-if="noResults" class="search-no-results">
            <div class="no-results-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <p>No results found for "{{ searchTerm }}"</p>
            <button class="search-button" @click="createNew">Create New</button>
          </div>

          <!-- Search Results -->
          <div v-else-if="hasResults" class="search-results">
            <!-- Customers Section -->
            <div v-if="results.customers.length > 0" class="search-section">
              <h3 class="search-section-title">
                <span class="section-icon customer-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                  </svg>
                </span>
                Customers 
                <span class="section-count">({{ results.customers.length }})</span>
              </h3>
              <ul class="search-results-list">
                <li 
                  v-for="(result, index) in results.customers" 
                  :key="`customer-${result.id}`"
                  class="search-result-item"
                  :class="{ 'is-selected': selectedCategory === 'customers' && selectedCategoryIndex === index }"
                  @click="navigateToResult(result)"
                  :ref="el => { if (el) resultRefs[getGlobalIndex('customers', index)] = el }"
                >
                  <div class="search-result-icon customer-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                    </svg>
                  </div>
                  <div class="search-result-content">
                    <div class="search-result-title">{{ result.name }}</div>
                    <div class="search-result-subtitle">
                      {{ result.email || 'No email' }} · {{ result.phone || 'No phone' }}
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Products Section -->
            <div v-if="results.products.length > 0" class="search-section">
              <h3 class="search-section-title">
                <span class="section-icon product-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M1 11.27c0-.246.033-.492.099-.73l1.523-5.521A2.75 2.75 0 015.273 3h9.454a2.75 2.75 0 012.651 2.019l1.523 5.52c.066.239.099.485.099.732V15a2 2 0 01-2 2H3a2 2 0 01-2-2v-3.73zm3.068-5.852A1.25 1.25 0 015.273 4.5h9.454a1.25 1.25 0 011.205.918l1.523 5.52c.006.02.01.041.015.062H3.53a.75.75 0 00.006-.02l1.53-5.542z" clip-rule="evenodd" />
                  </svg>
                </span>
                Products 
                <span class="section-count">({{ results.products.length }})</span>
              </h3>
              <ul class="search-results-list">
                <li 
                  v-for="(result, index) in results.products" 
                  :key="`product-${result.id}`"
                  class="search-result-item"
                  :class="{ 'is-selected': selectedCategory === 'products' && selectedCategoryIndex === index }"
                  @click="navigateToResult(result)"
                  :ref="el => { if (el) resultRefs[getGlobalIndex('products', index)] = el }"
                >
                  <div class="search-result-icon product-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                      <path fill-rule="evenodd" d="M1 11.27c0-.246.033-.492.099-.73l1.523-5.521A2.75 2.75 0 015.273 3h9.454a2.75 2.75 0 012.651 2.019l1.523 5.52c.066.239.099.485.099.732V15a2 2 0 01-2 2H3a2 2 0 01-2-2v-3.73zm3.068-5.852A1.25 1.25 0 015.273 4.5h9.454a1.25 1.25 0 011.205.918l1.523 5.52c.006.02.01.041.015.062H3.53a.75.75 0 00.006-.02l1.53-5.542z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="search-result-content">
                    <div class="search-result-title">{{ result.name }}</div>
                    <div class="search-result-subtitle">
                      {{ result.sku }} · ${{ result.price.toFixed(2) }}
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Tickets Section -->
            <div v-if="results.tickets.length > 0" class="search-section">
              <h3 class="search-section-title">
                <span class="section-icon ticket-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clip-rule="evenodd" />
                  </svg>
                </span>
                Tickets 
                <span class="section-count">({{ results.tickets.length }})</span>
              </h3>
              <ul class="search-results-list">
                <li 
                  v-for="(result, index) in results.tickets" 
                  :key="`ticket-${result.id}`"
                  class="search-result-item"
                  :class="{ 'is-selected': selectedCategory === 'tickets' && selectedCategoryIndex === index }"
                  @click="navigateToResult(result)"
                  :ref="el => { if (el) resultRefs[getGlobalIndex('tickets', index)] = el }"
                >
                  <div class="search-result-icon ticket-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                      <path fill-rule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="search-result-content">
                    <div class="search-result-title">{{ result.title }}</div>
                    <div class="search-result-subtitle">
                      {{ result.status }} · {{ result.customer }}
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Show All Results Link -->
            <div class="search-section search-footer">
              <button class="view-all-button" @click="viewAllResults">
                <span>View all results</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                  <path fill-rule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { 
  defineComponent, 
  ref, 
  computed, 
  onMounted, 
  onUnmounted, 
  watch, 
  nextTick 
} from 'vue';
import { useRouter } from 'vue-router';
import { searchService, SearchResults, SearchResultBase } from '@/services/searchService';
import CreateNewModal from './CreateNewModal.vue';

/**
 * MegaSearch - A comprehensive search component for searching across multiple entity types
 * 
 * Features:
 * - Searching across customers, products, and tickets
 * - Keyboard shortcuts (Ctrl+K to open)
 * - Keyboard navigation between search results
 * - Recent searches memory
 * - Search result categorization
 * - Loading, error, and empty states
 * - Create new functionality
 * 
 * @component
 */
export default defineComponent({
  name: 'MegaSearch',
  components: {
    CreateNewModal
  },
  props: {
    /**
     * Keyboard shortcut key to open search (without Ctrl)
     */
    shortcutKey: {
      type: String,
      default: 'k'
    },
    /**
     * Placeholder text for search input
     */
    placeholder: {
      type: String,
      default: 'Search customers, products, tickets...'
    },
    /**
     * Maximum number of results to display per category
     */
    maxResults: {
      type: Number,
      default: 5
    }
  },
  
  setup(props) {
    const router = useRouter();
    
    // Refs for DOM elements
    const searchTriggerRef = ref<HTMLButtonElement | null>(null);
    const searchInputRef = ref<HTMLInputElement | null>(null);
    const modalRef = ref<HTMLDivElement | null>(null);
    const resultRefs = ref<HTMLElement[]>([]);
    
    // State
    const isOpen = ref(false);
    const searchTerm = ref('');
    const debouncedSearchTerm = ref('');
    const isLoading = ref(false);
    const hasError = ref(false);
    const errorMessage = ref('');
    const results = ref<SearchResults>({
      customers: [],
      products: [],
      tickets: []
    });
    const recentSearches = ref<string[]>([]);
    const selectedIndex = ref(-1);
    const selectedCategory = ref<'customers' | 'products' | 'tickets' | ''>('');
    const selectedCategoryIndex = ref(-1);
    const showCreateModal = ref(false);
    
    // Computed properties
    const hasResults = computed(() => {
      return (
        results.value.customers.length > 0 ||
        results.value.products.length > 0 ||
        results.value.tickets.length > 0
      );
    });
    
    const noResults = computed(() => {
      return (
        searchTerm.value.trim().length > 0 &&
        results.value.customers.length === 0 &&
        results.value.products.length === 0 &&
        results.value.tickets.length === 0 &&
        !isLoading.value &&
        !hasError.value
      );
    });
    
    const totalResultsCount = computed(() => {
      return (
        results.value.customers.length +
        results.value.products.length +
        results.value.tickets.length
      );
    });
    
    // Debounce search
    let searchTimeout: ReturnType<typeof setTimeout> | null = null;
    
    const debounceSearch = (callback: () => void, delay: number) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      
      searchTimeout = setTimeout(() => {
        callback();
      }, delay);
    };
    
    // Search function
    const performSearch = async () => {
      const term = searchTerm.value.trim();
      if (!term) {
        results.value = {
          customers: [],
          products: [],
          tickets: []
        };
        return;
      }
      
      isLoading.value = true;
      hasError.value = false;
      errorMessage.value = '';
      
      try {
        const response = await searchService.search(term, props.maxResults);
        results.value = response.data;
        
        // Reset selection after search
        selectedIndex.value = -1;
        selectedCategory.value = '';
        selectedCategoryIndex.value = -1;
        
        // Update the debounced search term
        debouncedSearchTerm.value = term;
      } catch (error) {
        console.error('Search error:', error);
        hasError.value = true;
        errorMessage.value = 'An error occurred while searching. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };
    
    // Handle search input
    watch(searchTerm, (newValue) => {
      debounceSearch(() => {
        performSearch();
      }, 300);
    });
    
    // Methods
    const openSearch = () => {
      isOpen.value = true;
      loadRecentSearches();
      
      // Focus search input after modal opens
      nextTick(() => {
        if (searchInputRef.value) {
          searchInputRef.value.focus();
        }
      });
    };
    
    const closeSearch = () => {
      isOpen.value = false;
      
      // Reset search state
      searchTerm.value = '';
      selectedIndex.value = -1;
      selectedCategory.value = '';
      selectedCategoryIndex.value = -1;
      
      // Focus the search trigger button
      nextTick(() => {
        if (searchTriggerRef.value) {
          searchTriggerRef.value.focus();
        }
      });
    };
    
    const clearSearch = () => {
      searchTerm.value = '';
      results.value = {
        customers: [],
        products: [],
        tickets: []
      };
      
      // Focus back on the search input
      if (searchInputRef.value) {
        searchInputRef.value.focus();
      }
    };
    
    const retrySearch = () => {
      performSearch();
    };
    
    // Get recent searches from localStorage
    const loadRecentSearches = async () => {
      try {
        const response = await searchService.getRecentSearches();
        recentSearches.value = response.data;
      } catch (error) {
        console.error('Error loading recent searches:', error);
        recentSearches.value = [];
      }
    };
    
    const useRecentSearch = (term: string) => {
      searchTerm.value = term;
      performSearch();
    };
    
    // Navigate to search result
    const navigateToResult = (result: SearchResultBase) => {
      closeSearch();
      router.push(result.url);
    };
    
    // Keyboard navigation
    const getGlobalIndex = (category: 'customers' | 'products' | 'tickets', index: number): number => {
      let globalIndex = index;
      
      if (category === 'products') {
        globalIndex += results.value.customers.length;
      } else if (category === 'tickets') {
        globalIndex += results.value.customers.length + results.value.products.length;
      }
      
      return globalIndex;
    };
    
    const navigateResults = (direction: 'up' | 'down') => {
      if (!hasResults.value && recentSearches.value.length === 0) return;
      
      const maxIndex = searchTerm.value.trim()
        ? totalResultsCount.value - 1
        : recentSearches.value.length - 1;
      
      if (direction === 'down') {
        selectedIndex.value = selectedIndex.value < maxIndex
          ? selectedIndex.value + 1
          : 0;
      } else {
        selectedIndex.value = selectedIndex.value > 0
          ? selectedIndex.value - 1
          : maxIndex;
      }
      
      // Update category and category index based on selectedIndex
      updateCategoryFromGlobalIndex();
      
      // Scroll to the selected item
      nextTick(() => {
        if (resultRefs.value[selectedIndex.value]) {
          resultRefs.value[selectedIndex.value].scrollIntoView({
            block: 'nearest'
          });
        }
      });
    };
    
    const updateCategoryFromGlobalIndex = () => {
      const customersLength = results.value.customers.length;
      const productsLength = results.value.products.length;
      
      if (!searchTerm.value.trim()) {
        // We're showing recent searches
        selectedCategory.value = '';
        selectedCategoryIndex.value = selectedIndex.value;
        return;
      }
      
      if (selectedIndex.value < customersLength) {
        selectedCategory.value = 'customers';
        selectedCategoryIndex.value = selectedIndex.value;
      } else if (selectedIndex.value < customersLength + productsLength) {
        selectedCategory.value = 'products';
        selectedCategoryIndex.value = selectedIndex.value - customersLength;
      } else {
        selectedCategory.value = 'tickets';
        selectedCategoryIndex.value = selectedIndex.value - customersLength - productsLength;
      }
    };
    
    const selectCurrentResult = () => {
      if (selectedIndex.value === -1) return;
      
      if (!searchTerm.value.trim() && recentSearches.value.length > 0) {
        // Select recent search
        useRecentSearch(recentSearches.value[selectedIndex.value]);
        return;
      }
      
      if (selectedCategory.value === 'customers' && selectedCategoryIndex.value >= 0) {
        navigateToResult(results.value.customers[selectedCategoryIndex.value]);
      } else if (selectedCategory.value === 'products' && selectedCategoryIndex.value >= 0) {
        navigateToResult(results.value.products[selectedCategoryIndex.value]);
      } else if (selectedCategory.value === 'tickets' && selectedCategoryIndex.value >= 0) {
        navigateToResult(results.value.tickets[selectedCategoryIndex.value]);
      }
    };
    
    // Create new functionality
    const createNew = () => {
      showCreateModal.value = true;
    };
    
    // View all results
    const viewAllResults = () => {
      closeSearch();
      router.push({
        name: 'SearchResults',
        query: { q: debouncedSearchTerm.value }
      });
    };
    
    // Keyboard shortcut handler
    const handleKeyboardShortcut = (event: KeyboardEvent) => {
      // Check for Ctrl+K shortcut
      if (event.ctrlKey && event.key.toLowerCase() === props.shortcutKey.toLowerCase()) {
        event.preventDefault();
        
        if (!isOpen.value) {
          openSearch();
        }
      }
    };
    
    // Click outside to close
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen.value && modalRef.value && !modalRef.value.contains(event.target as Node)) {
        closeSearch();
      }
    };
    
    // Lifecycle hooks
    onMounted(() => {
      // Add event listeners for keyboard shortcut
      document.addEventListener('keydown', handleKeyboardShortcut);
      document.addEventListener('mousedown', handleClickOutside);
      
      // Load recent searches
      loadRecentSearches();
    });
    
    onUnmounted(() => {
      // Remove event listeners
      document.removeEventListener('keydown', handleKeyboardShortcut);
      document.removeEventListener('mousedown', handleClickOutside);
      
      // Clear any pending timeouts
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    });
    
    return {
      // State
      isOpen,
      searchTerm,
      isLoading,
      hasError,
      errorMessage,
      results,
      recentSearches,
      selectedIndex,
      selectedCategory,
      selectedCategoryIndex,
      showCreateModal,
      
      // Computed
      hasResults,
      noResults,
      
      // Refs
      searchTriggerRef,
      searchInputRef,
      modalRef,
      resultRefs,
      
      // Methods
      openSearch,
      closeSearch,
      clearSearch,
      retrySearch,
      useRecentSearch,
      navigateToResult,
      navigateResults,
      getGlobalIndex,
      selectCurrentResult,
      createNew,
      viewAllResults
    };
  }
});
</script>

<style scoped>
.mega-search {
  position: relative;
  z-index: 50;
}

/* Search Trigger Button */
.search-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-bg-secondary, #f3f4f6);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  max-width: 400px;
}

.search-trigger:hover {
  background-color: var(--color-bg-hover, #e5e7eb);
}

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-text-secondary, #6b7280);
}

.search-label {
  flex: 1;
  text-align: left;
  color: var(--color-text-secondary, #6b7280);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shortcut-hint {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.shortcut-hint kbd {
  padding: 0.125rem 0.25rem;
  background-color: var(--color-bg, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  line-height: 1;
  font-family: monospace;
}

/* Search Modal */
.search-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 4rem;
  z-index: 100;
  animation: backdrop-fade 0.2s ease-out;
}

.search-modal {
  width: 100%;
  max-width: 640px;
  max-height: 80vh;
  background-color: var(--color-bg, #ffffff);
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: modal-slide 0.2s ease-out;
}

.search-modal-header {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}

.search-input-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: var(--color-bg-secondary, #f3f4f6);
  border-radius: 0.375rem;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.5rem;
  font-size: 1rem;
  outline: none;
  color: var(--color-text, #1f2937);
}

.search-input::placeholder {
  color: var(--color-text-secondary, #6b7280);
}

.clear-search,
.close-search {
  background: transparent;
  border: none;
  color: var(--color-text-secondary, #6b7280);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
}

.clear-search:hover,
.close-search:hover {
  background-color: var(--color-bg-hover, #e5e7eb);
  color: var(--color-text, #1f2937);
}

.close-search kbd {
  padding: 0.125rem 0.25rem;
  background-color: var(--color-bg, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  line-height: 1;
  font-family: monospace;
}

.search-modal-body {
  flex: 1;
  overflow-y: auto;
  max-height: calc(80vh - 80px);
}

/* Loading State */
.search-loading {
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary, #6b7280);
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid rgba(203, 213, 225, 0.3);
  border-radius: 50%;
  border-top-color: var(--color-primary, #3b82f6);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.search-error {
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-error, #dc2626);
  text-align: center;
}

.error-icon {
  color: var(--color-error, #dc2626);
  margin-bottom: 1rem;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-primary, #3b82f6);
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: var(--color-primary-dark, #2563eb);
}

/* Empty State */
.search-no-results {
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary, #6b7280);
  text-align: center;
}

.no-results-icon {
  color: var(--color-text-secondary, #6b7280);
  margin-bottom: 1rem;
}

.search-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-primary, #3b82f6);
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: var(--color-primary-dark, #2563eb);
}

/* Recent Searches */
.recent-searches {
  padding: 1rem;
}

/* Search Results */
.search-results {
  padding: 0.5rem 0;
}

.search-section {
  padding: 0.5rem 1rem;
}

.search-section-title {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-secondary, #6b7280);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.section-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
}

.section-count {
  font-weight: normal;
  opacity: 0.7;
  margin-left: 0.25rem;
}

.search-results-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-result-item:hover {
  background-color: var(--color-bg-hover, #e5e7eb);
}

.search-result-item.is-selected {
  background-color: var(--color-bg-active, #dbeafe);
}

.search-result-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  margin-right: 0.75rem;
}

.customer-icon {
  background-color: #dbeafe;
  color: #3b82f6;
}

.product-icon {
  background-color: #dcfce7;
  color: #16a34a;
}

.ticket-icon {
  background-color: #ffedd5;
  color: #f97316;
}

.recent-icon {
  background-color: #f3f4f6;
  color: #6b7280;
}

.search-result-content {
  flex: 1;
  overflow: hidden;
}

.search-result-title {
  font-weight: 500;
  color: var(--color-text, #1f2937);
  margin-bottom: 0.125rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-result-subtitle {
  font-size: 0.875rem;
  color: var(--color-text-secondary, #6b7280);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Search Footer */
.search-footer {
  border-top: 1px solid var(--color-border, #e5e7eb);
  margin-top: 0.5rem;
  padding-top: 1rem;
  display: flex;
  justify-content: center;
}

.view-all-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-bg-secondary, #f3f4f6);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-text, #1f2937);
}

.view-all-button:hover {
  background-color: var(--color-bg-hover, #e5e7eb);
}

/* Animations */
@keyframes backdrop-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modal-slide {
  from { 
    opacity: 0;
    transform: translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1f2937;
    --color-bg-secondary: #111827;
    --color-bg-hover: #374151;
    --color-bg-active: #1e3a8a;
    --color-text: #f3f4f6;
    --color-text-secondary: #9ca3af;
    --color-border: #374151;
    --color-primary: #3b82f6;
    --color-primary-dark: #2563eb;
    --color-error: #ef4444;
  }
}

/* Responsive Styles */
@media (max-width: 768px) {
  .search-modal-backdrop {
    padding-top: 2rem;
    align-items: flex-start;
  }
  
  .search-modal {
    max-width: 90%;
    max-height: 80vh;
  }
}
</style>