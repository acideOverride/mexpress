<template>
  <div
    class="mx-live-search"
    :class="{
      'mx-live-search--active': isActive,
      'mx-live-search--loading': loading,
      'mx-live-search--has-results': hasResults
    }"
  >
    <!-- Search Input -->
    <div class="mx-live-search__input-wrapper">
      <input
        ref="inputRef"
        v-model="searchQuery"
        type="text"
        class="mx-live-search__input"
        :placeholder="placeholder"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.down="navigateResults('down')"
        @keydown.up="navigateResults('up')"
        @keydown.enter="selectHighlightedResult"
        @keydown.esc="closeResults"
      />
      
      <!-- Search Icon -->
      <div class="mx-live-search__icon">
        <svg
          v-if="!loading"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        
        <!-- Loading Spinner -->
        <svg
          v-else
          class="mx-live-search__spinner"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      </div>
      
      <!-- Clear Button -->
      <button
        v-if="searchQuery"
        type="button"
        class="mx-live-search__clear"
        @click="clearSearch"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
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
    
    <!-- Results Dropdown -->
    <div
      v-if="isActive && (hasTypeaheadResults || hasResults)"
      class="mx-live-search__results"
      ref="resultsRef"
    >
      <!-- Typeahead Results -->
      <div
        v-if="isTypeaheadMode && hasTypeaheadResults"
        class="mx-live-search__typeahead"
      >
        <ul class="mx-live-search__suggestions">
          <li
            v-for="(suggestion, index) in suggestions"
            :key="suggestion.id"
            class="mx-live-search__suggestion"
            :class="{ 'mx-live-search__suggestion--highlighted': highlightedIndex === index }"
            @mouseenter="highlightedIndex = index"
            @click="selectSuggestion(suggestion)"
          >
            <div class="mx-live-search__suggestion-content">
              <div class="mx-live-search__suggestion-primary">
                {{ suggestion.label }}
              </div>
              <div
                v-if="suggestion.secondaryLabel"
                class="mx-live-search__suggestion-secondary"
              >
                {{ suggestion.secondaryLabel }}
              </div>
            </div>
            <div class="mx-live-search__suggestion-type">
              {{ formatEntityType(suggestion.type) }}
            </div>
          </li>
          
          <!-- View All Results Link -->
          <li
            v-if="hasTypeaheadResults"
            class="mx-live-search__view-all"
            @click="viewAllResults"
          >
            View all {{ totalResults }} results
          </li>
        </ul>
      </div>
      
      <!-- Full Search Results -->
      <div
        v-else-if="hasResults && searchResults"
        class="mx-live-search__full-results"
      >
        <!-- Entity Type Tabs -->
        <div class="mx-live-search__tabs">
          <button
            v-for="type in resultEntityTypes"
            :key="type"
            class="mx-live-search__tab"
            :class="{ 'mx-live-search__tab--active': activeResultTab === type }"
            @click="activeResultTab = type"
          >
            {{ formatEntityType(type) }}
            <span class="mx-live-search__tab-count">
              {{ searchResults.meta.entityCounts[type] }}
            </span>
          </button>
        </div>
        
        <!-- Results List -->
        <div class="mx-live-search__entities">
          <template v-if="searchResults.results[activeResultTab]?.length">
            <ul class="mx-live-search__entity-results">
              <li
                v-for="(result, index) in searchResults.results[activeResultTab]"
                :key="result.id"
                class="mx-live-search__result"
                :class="{ 'mx-live-search__result--highlighted': highlightedIndex === index }"
                @mouseenter="highlightedIndex = index"
                @click="selectResult(result)"
              >
                <component
                  :is="getResultComponent(result.type)"
                  :result="result"
                  :query="searchQuery"
                />
              </li>
            </ul>
            
            <!-- Pagination -->
            <div
              v-if="searchResults.meta.hasMore"
              class="mx-live-search__pagination"
            >
              <button
                class="mx-live-search__load-more"
                @click="loadMoreResults"
              >
                Load more results
              </button>
            </div>
          </template>
          
          <!-- No Results -->
          <div
            v-else
            class="mx-live-search__no-results"
          >
            <p>No {{ formatEntityType(activeResultTab) }} results found for "{{ searchQuery }}"</p>
            
            <!-- Create New Suggestion -->
            <button
              v-if="createNewSuggestion && createNewSuggestion.type === activeResultTab"
              class="mx-live-search__create-new"
              @click="openCreateNewModal(createNewSuggestion)"
            >
              Create new {{ formatEntityType(activeResultTab) }}: {{ searchQuery }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Create New Modal -->
    <CreateNewModal
      v-model="isCreateNewModalOpen"
      :suggestion="selectedCreateNewSuggestion"
      @create="handleCreateNew"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, PropType, onMounted, onBeforeUnmount } from 'vue';
import { 
  useMegaSearch, 
  EntityType, 
  TypeaheadSuggestion, 
  SearchResult,
  CreateNewSuggestion 
} from '../../composables/useMegaSearch';
import CreateNewModal from './CreateNewModal.vue';

// Default result component
const DefaultResult = defineComponent({
  props: {
    result: {
      type: Object as PropType<SearchResult>,
      required: true
    },
    query: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const primaryText = computed(() => {
      if (props.result.type === 'customer') {
        return props.result.name;
      } else if (props.result.type === 'product') {
        return props.result.name;
      } else if (props.result.type === 'user') {
        return `${props.result.firstName} ${props.result.lastName}`;
      }
      return props.result.name || props.result.title || props.result.id;
    });
    
    const secondaryText = computed(() => {
      if (props.result.type === 'customer') {
        return props.result.email;
      } else if (props.result.type === 'product') {
        return `${formatCurrency(props.result.price)} - ${props.result.sku}`;
      } else if (props.result.type === 'user') {
        return props.result.email;
      }
      return '';
    });
    
    const formatCurrency = (value: number): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    };
    
    return { primaryText, secondaryText };
  },
  template: `
    <div class="mx-live-search__result-content">
      <div class="mx-live-search__result-primary">{{ primaryText }}</div>
      <div v-if="secondaryText" class="mx-live-search__result-secondary">{{ secondaryText }}</div>
    </div>
  `
});

export default defineComponent({
  name: 'LiveSearch',
  components: {
    DefaultResult,
    CreateNewModal
  },
  props: {
    /**
     * Placeholder text for search input
     */
    placeholder: {
      type: String,
      default: 'Search...'
    },
    
    /**
     * Entity types to search
     */
    entityTypes: {
      type: Array as PropType<EntityType[]>,
      default: () => undefined
    },
    
    /**
     * Maximum number of results per entity type
     */
    limit: {
      type: Number,
      default: 5
    },
    
    /**
     * Minimum number of characters required to trigger search
     */
    minChars: {
      type: Number,
      default: 2
    },
    
    /**
     * Whether to auto-focus the search input on mount
     */
    autofocus: {
      type: Boolean,
      default: false
    },
    
    /**
     * Custom components for rendering results by entity type
     */
    resultComponents: {
      type: Object as PropType<Record<EntityType, any>>,
      default: () => ({})
    }
  },
  emits: [
    'search',
    'select',
    'create',
    'clear',
    'focus',
    'blur'
  ],
  setup(props, { emit }) {
    // Refs
    const inputRef = ref<HTMLInputElement | null>(null);
    const resultsRef = ref<HTMLElement | null>(null);
    const isActive = ref(false);
    const isTypeaheadMode = ref(true);
    const highlightedIndex = ref(-1);
    const activeResultTab = ref<EntityType>('customer');
    const isCreateNewModalOpen = ref(false);
    const selectedCreateNewSuggestion = ref<CreateNewSuggestion | null>(null);
    
    // MegaSearch composable
    const { 
      query: searchQuery,
      results: searchResults,
      suggestions,
      loading,
      error,
      debouncedSearch,
      debouncedTypeahead
    } = useMegaSearch({
      debounceDelay: 300,
      minChars: props.minChars,
      defaultLimit: props.limit,
      defaultTypes: props.entityTypes
    });
    
    // Computed values
    const hasTypeaheadResults = computed(() => suggestions.value.length > 0);
    const hasResults = computed(() => {
      if (!searchResults.value) return false;
      return searchResults.value.meta.totalResults > 0;
    });
    const totalResults = computed(() => searchResults.value?.meta.totalResults || 0);
    const resultEntityTypes = computed(() => {
      if (!searchResults.value) return [];
      return Object.keys(searchResults.value.results)
        .filter(type => searchResults.value!.results[type].length > 0);
    });
    const createNewSuggestion = computed(() => {
      if (!searchResults.value?.suggestion?.createNew) return null;
      return searchResults.value.suggestion.createNew;
    });
    
    // Set active tab when results change
    watch(resultEntityTypes, (types) => {
      if (types.length > 0 && !types.includes(activeResultTab.value)) {
        activeResultTab.value = types[0];
      }
    });
    
    // Methods
    const handleFocus = () => {
      isActive.value = true;
      emit('focus');
    };
    
    const handleBlur = (event: FocusEvent) => {
      // Keep dropdown open if click is inside results
      if (
        resultsRef.value && 
        event.relatedTarget && 
        resultsRef.value.contains(event.relatedTarget as Node)
      ) {
        return;
      }
      
      // Close after a short delay to allow result selection
      setTimeout(() => {
        isActive.value = false;
        emit('blur');
      }, 200);
    };
    
    const clearSearch = () => {
      searchQuery.value = '';
      isTypeaheadMode.value = true;
      highlightedIndex.value = -1;
      emit('clear');
    };
    
    const closeResults = () => {
      isActive.value = false;
      isTypeaheadMode.value = true;
      highlightedIndex.value = -1;
    };
    
    const navigateResults = (direction: 'up' | 'down') => {
      const results = isTypeaheadMode.value
        ? suggestions.value
        : (searchResults.value?.results[activeResultTab.value] || []);
      
      if (results.length === 0) return;
      
      if (direction === 'down') {
        highlightedIndex.value = (highlightedIndex.value + 1) % results.length;
      } else {
        highlightedIndex.value = (highlightedIndex.value - 1 + results.length) % results.length;
      }
    };
    
    const selectHighlightedResult = () => {
      if (highlightedIndex.value === -1) {
        // No highlighted result, perform search
        viewAllResults();
        return;
      }
      
      if (isTypeaheadMode.value) {
        // Select typeahead suggestion
        const suggestion = suggestions.value[highlightedIndex.value];
        if (suggestion) {
          selectSuggestion(suggestion);
        }
      } else {
        // Select search result
        const result = searchResults.value?.results[activeResultTab.value][highlightedIndex.value];
        if (result) {
          selectResult(result);
        }
      }
    };
    
    const selectSuggestion = (suggestion: TypeaheadSuggestion) => {
      emit('select', { ...suggestion, resultType: 'suggestion' });
    };
    
    const selectResult = (result: SearchResult) => {
      emit('select', { ...result, resultType: 'result' });
    };
    
    const viewAllResults = async () => {
      isTypeaheadMode.value = false;
      highlightedIndex.value = -1;
      
      // Perform full search if not already done
      if (!searchResults.value) {
        await debouncedSearch();
      }
      
      emit('search', {
        query: searchQuery.value,
        results: searchResults.value
      });
    };
    
    const loadMoreResults = async () => {
      // Implement pagination logic here
      if (!searchResults.value) return;
      
      emit('search', {
        query: searchQuery.value,
        results: searchResults.value,
        loadMore: true
      });
    };
    
    const openCreateNewModal = (suggestion: CreateNewSuggestion) => {
      selectedCreateNewSuggestion.value = suggestion;
      isCreateNewModalOpen.value = true;
    };
    
    const handleCreateNew = (data: any) => {
      emit('create', {
        ...selectedCreateNewSuggestion.value,
        data
      });
      isCreateNewModalOpen.value = false;
    };
    
    const formatEntityType = (type: EntityType): string => {
      // Format entity type for display (e.g., 'customer' -> 'Customer')
      return type.charAt(0).toUpperCase() + type.slice(1);
    };
    
    const getResultComponent = (type: EntityType) => {
      return props.resultComponents[type] || DefaultResult;
    };
    
    // Handle clicks outside the component
    const handleClickOutside = (event: MouseEvent) => {
      const element = event.target as HTMLElement;
      if (
        inputRef.value && 
        resultsRef.value && 
        !inputRef.value.contains(element) && 
        !resultsRef.value.contains(element)
      ) {
        closeResults();
      }
    };
    
    // Watch for search query changes
    watch(searchQuery, (newValue) => {
      // Reset results display when query changes
      isTypeaheadMode.value = true;
      highlightedIndex.value = -1;
      
      if (newValue.length >= props.minChars) {
        // Fetch typeahead suggestions
        debouncedTypeahead();
      }
    });
    
    // Lifecycle hooks
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
      
      if (props.autofocus && inputRef.value) {
        inputRef.value.focus();
      }
    });
    
    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });
    
    return {
      // Refs
      inputRef,
      resultsRef,
      searchQuery,
      searchResults,
      suggestions,
      loading,
      isActive,
      isTypeaheadMode,
      highlightedIndex,
      activeResultTab,
      
      // Computed
      hasTypeaheadResults,
      hasResults,
      totalResults,
      resultEntityTypes,
      createNewSuggestion,
      
      // Methods
      handleFocus,
      handleBlur,
      clearSearch,
      closeResults,
      navigateResults,
      selectHighlightedResult,
      selectSuggestion,
      selectResult,
      viewAllResults,
      loadMoreResults,
      openCreateNewModal,
      handleCreateNew,
      isCreateNewModalOpen,
      selectedCreateNewSuggestion,
      formatEntityType,
      getResultComponent
    };
  }
});
</script>

<style>
.mx-live-search {
  position: relative;
  width: 100%;
  max-width: 600px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.mx-live-search__input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.mx-live-search__input {
  width: 100%;
  padding: 10px 40px 10px 36px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.mx-live-search__input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.mx-live-search__icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  display: flex;
}

.mx-live-search__spinner {
  animation: mx-spin 1.5s linear infinite;
}

@keyframes mx-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.mx-live-search__clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mx-live-search__clear:hover {
  color: #666;
}

.mx-live-search__results {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
  z-index: 100;
}

.mx-live-search__suggestions {
  list-style: none;
  margin: 0;
  padding: 0;
}

.mx-live-search__suggestion {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}

.mx-live-search__suggestion:last-child {
  border-bottom: none;
}

.mx-live-search__suggestion--highlighted {
  background-color: #f7f9fc;
}

.mx-live-search__suggestion-content {
  flex: 1;
  min-width: 0;
}

.mx-live-search__suggestion-primary {
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mx-live-search__suggestion-secondary {
  font-size: 0.85em;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mx-live-search__suggestion-type {
  font-size: 0.75em;
  color: #999;
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  margin-left: 10px;
}

.mx-live-search__view-all {
  padding: 10px 15px;
  text-align: center;
  background-color: #f7f9fc;
  color: #4a90e2;
  font-weight: 500;
  cursor: pointer;
  border-top: 1px solid #e6e6e6;
}

.mx-live-search__view-all:hover {
  background-color: #f0f7ff;
}

.mx-live-search__tabs {
  display: flex;
  border-bottom: 1px solid #e6e6e6;
  background-color: #f7f9fc;
  overflow-x: auto;
}

.mx-live-search__tab {
  padding: 10px 15px;
  font-size: 14px;
  border: none;
  background: none;
  cursor: pointer;
  white-space: nowrap;
  color: #666;
  border-bottom: 2px solid transparent;
}

.mx-live-search__tab--active {
  color: #4a90e2;
  border-bottom-color: #4a90e2;
  font-weight: 500;
}

.mx-live-search__tab-count {
  display: inline-block;
  font-size: 0.85em;
  background-color: #eee;
  color: #666;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 5px;
  min-width: 20px;
  text-align: center;
}

.mx-live-search__entity-results {
  list-style: none;
  margin: 0;
  padding: 0;
}

.mx-live-search__result {
  padding: 12px 15px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}

.mx-live-search__result:last-child {
  border-bottom: none;
}

.mx-live-search__result--highlighted {
  background-color: #f7f9fc;
}

.mx-live-search__result-content {
  width: 100%;
}

.mx-live-search__result-primary {
  font-weight: 500;
  color: #333;
  margin-bottom: 3px;
}

.mx-live-search__result-secondary {
  font-size: 0.9em;
  color: #666;
}

.mx-live-search__pagination {
  padding: 10px;
  text-align: center;
  border-top: 1px solid #e6e6e6;
}

.mx-live-search__load-more {
  padding: 6px 12px;
  background-color: #f0f7ff;
  color: #4a90e2;
  border: 1px solid #4a90e2;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.mx-live-search__load-more:hover {
  background-color: #e5f1ff;
}

.mx-live-search__no-results {
  padding: 20px;
  text-align: center;
  color: #666;
}

.mx-live-search__create-new {
  margin-top: 10px;
  padding: 6px 12px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.mx-live-search__create-new:hover {
  background-color: #3a80d2;
}
</style>