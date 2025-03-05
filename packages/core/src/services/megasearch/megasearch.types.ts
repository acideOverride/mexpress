/**
 * MegaSearch Types
 * Core type definitions for the MegaSearch service and API
 */

/**
 * Search options for all search requests
 */
export interface SearchOptions {
  /** The search query string */
  query: string;
  
  /** Optional array of entity types to search (default: all available types) */
  types?: string[];
  
  /** Maximum number of results per entity type */
  limit?: number;
  
  /** Pagination page (1-based) */
  page?: number;
  
  /** Entity-specific filters */
  filters?: Record<string, any>;
}

/**
 * Base search result interface with common properties
 */
export interface SearchResult {
  /** Entity ID */
  id: string;
  
  /** Entity type (customer, product, user, etc.) */
  type: string;
  
  /** Relevance score (0-100) */
  score: number;
  
  /** Names of fields that matched the query */
  matchedOn: string[];
  
  /** Additional entity-specific fields */
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
 * Structure for "create new" suggestions when no results match
 */
export interface CreateNewSuggestion {
  /** Entity type to create */
  type: string;
  
  /** Pre-populated data for creation form based on search query */
  prefilledData: Record<string, any>;
}

/**
 * Metadata for search responses
 */
export interface SearchMetadata {
  /** Total number of results across all entity types */
  totalResults: number;
  
  /** Count of results per entity type */
  entityCounts: Record<string, number>;
  
  /** Search execution time in milliseconds */
  executionTimeMs: number;
  
  /** Current page number */
  page: number;
  
  /** Whether more results are available */
  hasMore: boolean;
}

/**
 * Complete search response structure
 */
export interface SearchResponse {
  /** Results grouped by entity type */
  results: Record<string, SearchResult[]>;
  
  /** Optional suggestions (e.g., creating new entities) */
  suggestion?: {
    createNew?: CreateNewSuggestion;
  };
  
  /** Response metadata */
  meta: SearchMetadata;
}

/**
 * Lightweight typeahead suggestion
 */
export interface TypeaheadSuggestion {
  /** Entity ID */
  id: string;
  
  /** Entity type */
  type: string;
  
  /** Primary display text */
  label: string;
  
  /** Secondary display information */
  secondaryLabel?: string;
  
  /** Relevance score */
  score: number;
}

/**
 * Response structure for typeahead API
 */
export interface TypeaheadResponse {
  /** List of suggestions */
  suggestions: TypeaheadSuggestion[];
  
  /** Response metadata */
  meta: {
    totalResults: number;
    executionTimeMs: number;
  };
}

/**
 * Interface for entity-specific search adapters
 */
export interface EntitySearchAdapter {
  /** Entity type identifier */
  readonly entityType: string;
  
  /**
   * Search for entities matching the query
   * @param query The search query
   * @param options Search options including limit, filters, etc.
   * @returns Promise resolving to entity-specific search results
   */
  search(query: string, options?: Partial<SearchOptions>): Promise<SearchResult[]>;
  
  /**
   * Generate typeahead suggestions for the entity type
   * @param query The search query
   * @param limit Maximum number of suggestions
   * @returns Promise resolving to typeahead suggestions
   */
  typeahead(query: string, limit?: number): Promise<TypeaheadSuggestion[]>;
  
  /**
   * Generate "create new" suggestion based on the query
   * @param query The search query
   * @returns CreateNewSuggestion object with prefilled data
   */
  createNewSuggestion(query: string): CreateNewSuggestion;
}