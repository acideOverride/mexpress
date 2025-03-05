import { ref, Ref, computed, watch } from 'vue';
import { useApiClient } from './useApiClient';
import debounce from 'lodash.debounce';

/**
 * MegaSearch entity type
 */
export type EntityType = 'customer' | 'product' | 'user' | string;

/**
 * Search filter options specific to an entity type
 */
export interface EntityFilters {
  [key: string]: any;
}

/**
 * Search options
 */
export interface SearchOptions {
  /** Search query string */
  query: string;
  
  /** Entity types to search */
  types?: EntityType[];
  
  /** Maximum results per entity type */
  limit?: number;
  
  /** Page number for pagination */
  page?: number;
  
  /** Entity-specific filters */
  filters?: Record<EntityType, EntityFilters>;
}

/**
 * Search result base interface
 */
export interface SearchResult {
  /** Entity ID */
  id: string;
  
  /** Entity type */
  type: EntityType;
  
  /** Relevance score */
  score: number;
  
  /** Fields that matched the search query */
  matchedOn: string[];
  
  /** Additional properties based on entity type */
  [key: string]: any;
}

/**
 * Customer search result
 */
export interface CustomerSearchResult extends SearchResult {
  type: 'customer';
  name: string;
  email: string;
  phone?: string;
  address?: {
    city: string;
    state: string;
    zip: string;
  };
}

/**
 * Product search result
 */
export interface ProductSearchResult extends SearchResult {
  type: 'product';
  name: string;
  sku: string;
  price: number;
  category: string;
  stockLevel: number;
  description?: string;
}

/**
 * User search result
 */
export interface UserSearchResult extends SearchResult {
  type: 'user';
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

/**
 * Create new suggestion
 */
export interface CreateNewSuggestion {
  /** Entity type to create */
  type: EntityType;
  
  /** Pre-populated data based on search query */
  prefilledData: Record<string, any>;
}

/**
 * Search response
 */
export interface SearchResponse {
  /** Results grouped by entity type */
  results: Record<EntityType, SearchResult[]>;
  
  /** Optional suggestions */
  suggestion?: {
    createNew?: CreateNewSuggestion;
  };
  
  /** Response metadata */
  meta: {
    /** Total number of results */
    totalResults: number;
    
    /** Count of results per entity type */
    entityCounts: Record<EntityType, number>;
    
    /** Execution time in milliseconds */
    executionTimeMs: number;
    
    /** Current page number */
    page: number;
    
    /** Whether there are more results available */
    hasMore: boolean;
    
    /** Execution times per entity type */
    executionTimes?: Record<EntityType, number>;
    
    /** Whether text search was used */
    usedTextIndex?: boolean;
  };
}

/**
 * Typeahead suggestion
 */
export interface TypeaheadSuggestion {
  /** Entity ID */
  id: string;
  
  /** Entity type */
  type: EntityType;
  
  /** Primary display text */
  label: string;
  
  /** Secondary display information */
  secondaryLabel?: string;
  
  /** Relevance score */
  score: number;
}

/**
 * Typeahead response
 */
export interface TypeaheadResponse {
  /** Typeahead suggestions */
  suggestions: TypeaheadSuggestion[];
  
  /** Response metadata */
  meta: {
    /** Total number of suggestions */
    totalResults: number;
    
    /** Execution time in milliseconds */
    executionTimeMs: number;
  };
}

/**
 * Available entity types
 */
export interface EntityTypesResponse {
  /** List of available entity types */
  entityTypes: EntityType[];
  
  /** Number of entity types */
  count: number;
}

/**
 * MegaSearch composable options
 */
export interface MegaSearchOptions {
  /** API base URL */
  baseUrl?: string;
  
  /** Debounce delay in milliseconds */
  debounceDelay?: number;
  
  /** Minimum characters required to trigger search */
  minChars?: number;
  
  /** Default result limit per entity type */
  defaultLimit?: number;
  
  /** Entity types to include by default */
  defaultTypes?: EntityType[];
}

/**
 * Composable for using MegaSearch functionality
 * @param options Configuration options
 * @returns Object with search methods and state
 */
export function useMegaSearch(options: MegaSearchOptions = {}) {
  // Default options
  const config = {
    baseUrl: '/api/v1/megasearch',
    debounceDelay: 300,
    minChars: 2,
    defaultLimit: 5,
    defaultTypes: undefined,
    ...options
  };
  
  // Create API client
  const apiClient = useApiClient({
    baseUrl: config.baseUrl
  });
  
  // State
  const query = ref('');
  const results = ref<SearchResponse | null>(null);
  const suggestions = ref<TypeaheadSuggestion[]>([]);
  const availableTypes = ref<EntityType[]>([]);
  const loading = computed(() => apiClient.loading.value);
  const error = computed(() => apiClient.error.value);
  const hasResults = computed(() => {
    if (!results.value) return false;
    return results.value.meta.totalResults > 0;
  });
  
  // Search settings
  const searchTypes = ref<EntityType[] | undefined>(config.defaultTypes);
  const searchLimit = ref(config.defaultLimit);
  const searchPage = ref(1);
  const searchFilters = ref<Record<EntityType, EntityFilters>>({});
  
  /**
   * Perform search with current settings
   * @returns Promise resolving to search results
   */
  const search = async (): Promise<SearchResponse | null> => {
    if (!query.value || query.value.length < config.minChars) {
      results.value = null;
      return null;
    }
    
    try {
      const response = await apiClient.post<SearchResponse>('', {
        query: query.value,
        types: searchTypes.value,
        limit: searchLimit.value,
        page: searchPage.value,
        filters: Object.keys(searchFilters.value).length > 0 ? searchFilters.value : undefined
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      results.value = response.data;
      return response.data;
    } catch (err) {
      console.error('Search error:', err);
      results.value = null;
      return null;
    }
  };
  
  /**
   * Perform entity-specific search
   * @param entityType Entity type to search
   * @param options Search options
   * @returns Promise resolving to search results
   */
  const searchEntity = async (
    entityType: EntityType,
    options: Omit<SearchOptions, 'types'> = { query: query.value }
  ): Promise<SearchResponse | null> => {
    if (!options.query || options.query.length < config.minChars) {
      return null;
    }
    
    try {
      const response = await apiClient.post<SearchResponse>(`/${entityType}`, {
        query: options.query,
        limit: options.limit || searchLimit.value,
        page: options.page || searchPage.value,
        filters: options.filters?.[entityType]
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.data;
    } catch (err) {
      console.error(`${entityType} search error:`, err);
      return null;
    }
  };
  
  /**
   * Get typeahead suggestions for current query
   * @param types Entity types to include in suggestions
   * @param limit Maximum number of suggestions per entity type
   * @returns Promise resolving to typeahead suggestions
   */
  const getTypeaheadSuggestions = async (
    types?: EntityType[],
    limit?: number
  ): Promise<TypeaheadSuggestion[]> => {
    if (!query.value || query.value.length < config.minChars) {
      suggestions.value = [];
      return [];
    }
    
    try {
      const response = await apiClient.post<TypeaheadResponse>('/typeahead', {
        query: query.value,
        types: types || searchTypes.value,
        limit: limit || searchLimit.value
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      suggestions.value = response.data.suggestions;
      return response.data.suggestions;
    } catch (err) {
      console.error('Typeahead error:', err);
      suggestions.value = [];
      return [];
    }
  };
  
  /**
   * Get available entity types
   * @returns Promise resolving to entity types
   */
  const getEntityTypes = async (): Promise<EntityType[]> => {
    try {
      const response = await apiClient.get<EntityTypesResponse>('/types');
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      availableTypes.value = response.data.entityTypes;
      return response.data.entityTypes;
    } catch (err) {
      console.error('Error getting entity types:', err);
      return [];
    }
  };
  
  /**
   * Clear search cache (admin only)
   * @returns Promise resolving to boolean indicating success
   */
  const clearCache = async (): Promise<boolean> => {
    try {
      const response = await apiClient.post('/cache/clear');
      return !response.error;
    } catch (err) {
      console.error('Error clearing cache:', err);
      return false;
    }
  };
  
  /**
   * Reset search state
   */
  const resetSearch = () => {
    query.value = '';
    results.value = null;
    suggestions.value = [];
    searchPage.value = 1;
  };
  
  /**
   * Set entity filters
   * @param entityType Entity type to filter
   * @param filters Filters to apply
   */
  const setFilters = (entityType: EntityType, filters: EntityFilters) => {
    searchFilters.value = {
      ...searchFilters.value,
      [entityType]: filters
    };
  };
  
  /**
   * Clear entity filters
   * @param entityType Entity type to clear filters for (or all if not specified)
   */
  const clearFilters = (entityType?: EntityType) => {
    if (entityType) {
      const { [entityType]: _, ...rest } = searchFilters.value;
      searchFilters.value = rest;
    } else {
      searchFilters.value = {};
    }
  };
  
  // Create debounced versions of search functions
  const debouncedSearch = debounce(search, config.debounceDelay);
  const debouncedTypeahead = debounce(getTypeaheadSuggestions, config.debounceDelay);
  
  // Watch for query changes and trigger typeahead
  watch(query, (newValue) => {
    if (newValue && newValue.length >= config.minChars) {
      debouncedTypeahead();
    } else {
      suggestions.value = [];
    }
  });
  
  // Load entity types on initialization
  getEntityTypes().catch(console.error);
  
  return {
    // State
    query,
    results,
    suggestions,
    availableTypes,
    loading,
    error,
    hasResults,
    
    // Settings
    searchTypes,
    searchLimit,
    searchPage,
    searchFilters,
    
    // Methods
    search,
    searchEntity,
    getTypeaheadSuggestions,
    getEntityTypes,
    clearCache,
    resetSearch,
    setFilters,
    clearFilters,
    
    // Debounced methods
    debouncedSearch,
    debouncedTypeahead
  };
}