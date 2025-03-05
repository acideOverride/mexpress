import { MongoDBTextSearchService, TextSearchConfig } from './mongodb-text-search.service';
import { SearchIndexManager } from './search-index-manager';
import {
  SearchOptions,
  SearchResult,
  SearchResponse,
  TypeaheadSuggestion,
  CreateNewSuggestion
} from './megasearch.types';

/**
 * Cached search result
 */
interface CachedSearchResult {
  /** Search parameters used */
  params: string;
  
  /** Search results */
  results: SearchResponse;
  
  /** Timestamp when cache entry was created */
  timestamp: number;
}

/**
 * Advanced search service with caching and performance optimizations
 */
export class AdvancedSearchService {
  private textSearchService: MongoDBTextSearchService;
  private indexManager: SearchIndexManager;
  private searchCache: Map<string, CachedSearchResult> = new Map();
  private cacheTTL: number = 5 * 60 * 1000; // 5 minutes in milliseconds
  private maxCacheEntries: number = 100;
  
  constructor(textSearchService: MongoDBTextSearchService, indexManager: SearchIndexManager) {
    this.textSearchService = textSearchService;
    this.indexManager = indexManager;
  }
  
  /**
   * Search across multiple entity types
   * @param options Search options
   * @returns Promise resolving to search results
   */
  async search(options: SearchOptions): Promise<SearchResponse> {
    // Validate query
    if (!options.query || options.query.length < 2) {
      throw new Error('Search query must be at least 2 characters');
    }
    
    // Check cache first
    const cacheKey = this.generateCacheKey(options);
    const cachedResult = this.getCachedResult(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    
    const limit = options.limit || 5;
    const page = options.page || 1;
    const types = options.types || this.indexManager.getRegisteredIndexNames();
    const filters = options.filters || {};
    
    // Track execution time
    const startTime = Date.now();
    
    // Execute searches in parallel
    const searchPromises = types.map(async entityType => {
      const model = this.indexManager.getModelByIndexName(entityType);
      
      if (!model) {
        return {
          entityType,
          results: []
        };
      }
      
      const entityFilters = filters[entityType] || {};
      
      // Configure search
      const searchConfig: TextSearchConfig<any> = {
        model,
        query: options.query,
        limit,
        skip: (page - 1) * limit,
        filters: entityFilters,
        fuzzy: true, // Enable fuzzy matching for better results
      };
      
      // Execute search
      const searchResult = await this.textSearchService.search(searchConfig);
      
      // Process results to match SearchResult interface
      const formattedResults = this.formatSearchResults(
        searchResult.results,
        entityType,
        options.query
      );
      
      return {
        entityType,
        results: formattedResults,
        meta: searchResult.meta
      };
    });
    
    const searchResults = await Promise.all(searchPromises);
    
    // Transform results into the expected format
    const results: Record<string, SearchResult[]> = {};
    let totalResults = 0;
    const entityCounts: Record<string, number> = {};
    const executionTimes: Record<string, number> = {};
    
    searchResults.forEach(({ entityType, results: entityResults, meta }) => {
      results[entityType] = entityResults;
      entityCounts[entityType] = entityResults.length;
      totalResults += entityResults.length;
      executionTimes[entityType] = meta.executionTimeMs;
    });
    
    // Generate "create new" suggestion if no results found
    let suggestion = undefined;
    if (totalResults === 0) {
      suggestion = this.generateCreateNewSuggestion(options.query, types);
    }
    
    // Calculate execution time
    const executionTimeMs = Date.now() - startTime;
    
    // Determine if there are more results available
    const hasMore = Object.values(results).some(entityResults => 
      entityResults.length >= limit
    );
    
    // Create response
    const response: SearchResponse = {
      results,
      suggestion,
      meta: {
        totalResults,
        entityCounts,
        executionTimeMs,
        page,
        hasMore,
        executionTimes,
        usedTextIndex: searchResults.some(r => r.meta?.usedTextSearch)
      }
    };
    
    // Cache the results
    this.cacheResult(cacheKey, response);
    
    return response;
  }
  
  /**
   * Search a specific entity type
   * @param entityType Entity type to search
   * @param options Search options
   * @returns Promise resolving to search results
   */
  async searchEntity(
    entityType: string,
    options: Omit<SearchOptions, 'types'>
  ): Promise<SearchResponse> {
    // Get model for entity type
    const model = this.indexManager.getModelByIndexName(entityType);
    if (!model) {
      throw new Error(`Unknown entity type: ${entityType}`);
    }
    
    // Validate query
    if (!options.query || options.query.length < 2) {
      throw new Error('Search query must be at least 2 characters');
    }
    
    // Check cache first
    const cacheKey = this.generateCacheKey({ ...options, types: [entityType] });
    const cachedResult = this.getCachedResult(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    
    const limit = options.limit || 10;
    const page = options.page || 1;
    const filters = options.filters || {};
    
    // Track execution time
    const startTime = Date.now();
    
    // Configure search
    const searchConfig: TextSearchConfig<any> = {
      model,
      query: options.query,
      limit,
      skip: (page - 1) * limit,
      filters,
      fuzzy: true, // Enable fuzzy matching for better results
    };
    
    // Execute search
    const searchResult = await this.textSearchService.search(searchConfig);
    
    // Format results
    const formattedResults = this.formatSearchResults(
      searchResult.results,
      entityType,
      options.query
    );
    
    // Generate "create new" suggestion if no results found
    let suggestion = undefined;
    if (formattedResults.length === 0) {
      suggestion = this.generateCreateNewSuggestion(options.query, [entityType]);
    }
    
    // Calculate execution time
    const executionTimeMs = Date.now() - startTime;
    
    // Create response
    const response: SearchResponse = {
      results: {
        [entityType]: formattedResults
      },
      suggestion,
      meta: {
        totalResults: formattedResults.length,
        entityCounts: {
          [entityType]: formattedResults.length
        },
        executionTimeMs,
        page,
        hasMore: formattedResults.length >= limit,
        executionTimes: {
          [entityType]: searchResult.meta.executionTimeMs
        },
        usedTextIndex: searchResult.meta.usedTextSearch
      }
    };
    
    // Cache the results
    this.cacheResult(cacheKey, response);
    
    return response;
  }
  
  /**
   * Generate typeahead suggestions
   * @param query Search query
   * @param types Entity types to search
   * @param limit Maximum number of suggestions per entity type
   * @returns Promise resolving to typeahead suggestions
   */
  async typeahead(
    query: string,
    types?: string[],
    limit = 3
  ): Promise<TypeaheadSuggestion[]> {
    // Validate query
    if (!query || query.length < 2) {
      return [];
    }
    
    const entityTypes = types || this.indexManager.getRegisteredIndexNames();
    const suggestionsMap: Record<string, TypeaheadSuggestion[]> = {};
    
    // Generate suggestions for each entity type
    await Promise.all(
      entityTypes.map(async entityType => {
        const model = this.indexManager.getModelByIndexName(entityType);
        if (!model) return;
        
        // Configure typeahead search
        const searchConfig: TextSearchConfig<any> = {
          model,
          query,
          limit,
          fuzzy: true,
          // Focus on prefix matches for typeahead
          searchFields: this.getTypeaheadFieldsForEntityType(entityType)
        };
        
        // Execute search
        const results = await this.textSearchService.search(searchConfig);
        
        // Format as typeahead suggestions
        suggestionsMap[entityType] = this.formatTypeaheadSuggestions(
          results.results,
          entityType
        );
      })
    );
    
    // Combine and sort suggestions
    const allSuggestions = Object.values(suggestionsMap)
      .flat()
      .sort((a, b) => b.score - a.score)
      .slice(0, limit * entityTypes.length);
    
    return allSuggestions;
  }
  
  /**
   * Generate "create new" suggestion based on query
   * @param query Search query
   * @param types Available entity types
   * @returns Suggestion object or undefined
   */
  private generateCreateNewSuggestion(
    query: string,
    types: string[]
  ): { createNew: CreateNewSuggestion } | undefined {
    // Simple heuristics for determining the entity type:
    // - Email format suggests user or customer
    // - Price format suggests product
    // - Word count can help distinguish between types
    
    // Check if query looks like an email
    if (/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[\w-]{2,}$/.test(query)) {
      // Prefer customer over user if both are available
      if (types.includes('Customer')) return this.createCustomerSuggestion(query);
      if (types.includes('User')) return this.createUserSuggestion(query);
    }
    
    // Check if query includes price-like pattern ($, number with decimal)
    if (/\$?\d+(\.\d{2})?/.test(query)) {
      if (types.includes('Product')) return this.createProductSuggestion(query);
    }
    
    // Default logic based on word count
    const wordCount = query.split(/\s+/).length;
    
    if (wordCount <= 2) {
      // Short queries are more likely product names
      if (types.includes('Product')) return this.createProductSuggestion(query);
    } else {
      // Longer queries might be customer or user names
      if (types.includes('Customer')) return this.createCustomerSuggestion(query);
      if (types.includes('User')) return this.createUserSuggestion(query);
    }
    
    // If we have only one type, use that
    if (types.length === 1) {
      const type = types[0];
      
      if (type === 'Customer') return this.createCustomerSuggestion(query);
      if (type === 'Product') return this.createProductSuggestion(query);
      if (type === 'User') return this.createUserSuggestion(query);
    }
    
    // Default to customer if available
    return types.includes('Customer') 
      ? this.createCustomerSuggestion(query) 
      : undefined;
  }
  
  /**
   * Create suggestion for new customer
   * @param query Search query
   * @returns Customer suggestion
   */
  private createCustomerSuggestion(query: string): { createNew: CreateNewSuggestion } {
    const prefilledData: Record<string, any> = {};
    
    // If query looks like an email
    if (/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[\w-]{2,}$/.test(query)) {
      prefilledData.email = query;
    } 
    // If query looks like a phone number
    else if (/^\+?1?\d{9,15}$/.test(query.replace(/\D/g, ''))) {
      prefilledData.phone = query;
    } 
    // Otherwise assume it's a name
    else {
      prefilledData.name = query;
    }
    
    return {
      createNew: {
        type: 'Customer',
        prefilledData
      }
    };
  }
  
  /**
   * Create suggestion for new product
   * @param query Search query
   * @returns Product suggestion
   */
  private createProductSuggestion(query: string): { createNew: CreateNewSuggestion } {
    const prefilledData: Record<string, any> = {};
    
    // Extract potential price if present
    const priceMatch = query.match(/\$?(\d+(\.\d{1,2})?)/);
    if (priceMatch) {
      prefilledData.price = parseFloat(priceMatch[1]);
      
      // Remove price from the query for name
      const nameQuery = query.replace(/\$?(\d+(\.\d{1,2})?)/, '').trim();
      if (nameQuery) {
        prefilledData.name = nameQuery;
      }
    } else {
      // If no price found, assume entire query is the name
      prefilledData.name = query;
    }
    
    // Generate a SKU based on the name (simplified version)
    if (prefilledData.name) {
      prefilledData.sku = prefilledData.name
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 8) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    }
    
    // Set default category
    prefilledData.category = 'electronics';
    
    return {
      createNew: {
        type: 'Product',
        prefilledData
      }
    };
  }
  
  /**
   * Create suggestion for new user
   * @param query Search query
   * @returns User suggestion
   */
  private createUserSuggestion(query: string): { createNew: CreateNewSuggestion } {
    const prefilledData: Record<string, any> = {};
    
    // If query looks like an email
    if (/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[\w-]{2,}$/.test(query)) {
      prefilledData.email = query;
    } 
    // Otherwise assume it's a name
    else {
      // Try to split into first and last name
      const nameParts = query.trim().split(/\s+/);
      
      if (nameParts.length === 1) {
        prefilledData.firstName = nameParts[0];
      } else if (nameParts.length >= 2) {
        prefilledData.firstName = nameParts[0];
        prefilledData.lastName = nameParts.slice(1).join(' ');
      }
    }
    
    // Set default role
    prefilledData.role = 'user';
    
    return {
      createNew: {
        type: 'User',
        prefilledData
      }
    };
  }
  
  /**
   * Format raw search results into standardized search results
   * @param results Raw search results from MongoDB
   * @param entityType Entity type
   * @param query Original search query
   * @returns Formatted search results
   */
  private formatSearchResults(
    results: any[],
    entityType: string,
    query: string
  ): SearchResult[] {
    return results.map(result => {
      // Determine which fields matched the query
      const matchedOn: string[] = this.determineMatchedFields(result, query, entityType);
      
      // Create base result object
      const searchResult: SearchResult = {
        id: result._id.toString(),
        type: entityType,
        score: result.score || 50,
        matchedOn: matchedOn.length > 0 ? matchedOn : ['unknown']
      };
      
      // Add entity-specific fields
      switch (entityType) {
        case 'Customer':
          return {
            ...searchResult,
            name: result.name,
            email: result.email,
            phone: result.phone,
            address: result.address ? {
              city: result.address.city,
              state: result.address.state,
              zip: result.address.zip
            } : undefined
          };
          
        case 'Product':
          return {
            ...searchResult,
            name: result.name,
            sku: result.sku,
            price: result.price,
            category: result.category,
            stockLevel: result.stockLevel,
            description: result.description
          };
          
        case 'User':
          return {
            ...searchResult,
            email: result.email,
            firstName: result.firstName,
            lastName: result.lastName,
            role: result.role
          };
          
        default:
          return searchResult;
      }
    }).sort((a, b) => b.score - a.score); // Sort by score descending
  }
  
  /**
   * Format search results as typeahead suggestions
   * @param results Raw search results
   * @param entityType Entity type
   * @returns Typeahead suggestions
   */
  private formatTypeaheadSuggestions(
    results: any[],
    entityType: string
  ): TypeaheadSuggestion[] {
    return results.map(result => {
      let label = '';
      let secondaryLabel = '';
      
      switch (entityType) {
        case 'Customer':
          label = result.name;
          secondaryLabel = result.email;
          break;
          
        case 'Product':
          label = result.name;
          secondaryLabel = `${this.formatCurrency(result.price)} - ${result.category}`;
          break;
          
        case 'User':
          label = `${result.firstName} ${result.lastName}`;
          secondaryLabel = result.email;
          break;
          
        default:
          label = result.name || result.title || result._id.toString();
          secondaryLabel = result.description || '';
      }
      
      return {
        id: result._id.toString(),
        type: entityType,
        label,
        secondaryLabel,
        score: result.score || 50
      };
    }).sort((a, b) => b.score - a.score); // Sort by score descending
  }
  
  /**
   * Determine which fields in the document matched the search query
   * @param document Document from search results
   * @param query Original search query
   * @param entityType Entity type
   * @returns Array of field names that matched the query
   */
  private determineMatchedFields(document: any, query: string, entityType: string): string[] {
    const queryRegex = new RegExp(query, 'i');
    const matchedFields: string[] = [];
    
    // Define fields to check based on entity type
    const fieldsToCheck = this.getSearchableFieldsForEntityType(entityType);
    
    // Check each field for matches
    fieldsToCheck.forEach(field => {
      const value = this.getNestedProperty(document, field);
      
      if (value) {
        // Handle array values (e.g., tags)
        if (Array.isArray(value)) {
          if (value.some(item => 
            typeof item === 'string' && queryRegex.test(item)
          )) {
            matchedFields.push(field);
          }
        }
        // Handle string values
        else if (typeof value === 'string' && queryRegex.test(value)) {
          matchedFields.push(field);
        }
      }
    });
    
    return matchedFields;
  }
  
  /**
   * Get searchable fields for an entity type
   * @param entityType Entity type
   * @returns Array of field names
   */
  private getSearchableFieldsForEntityType(entityType: string): string[] {
    switch (entityType) {
      case 'Customer':
        return ['name', 'email', 'phone', 'address.city', 'address.state'];
        
      case 'Product':
        return ['name', 'sku', 'description', 'tags', 'category'];
        
      case 'User':
        return ['email', 'firstName', 'lastName'];
        
      default:
        return ['name', 'title', 'description'];
    }
  }
  
  /**
   * Get fields to use for typeahead searches
   * @param entityType Entity type
   * @returns Array of field names
   */
  private getTypeaheadFieldsForEntityType(entityType: string): string[] {
    switch (entityType) {
      case 'Customer':
        return ['name', 'email'];
        
      case 'Product':
        return ['name', 'sku'];
        
      case 'User':
        return ['email', 'firstName', 'lastName'];
        
      default:
        return ['name', 'title'];
    }
  }
  
  /**
   * Format a number as currency
   * @param value Number to format
   * @returns Formatted currency string
   */
  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }
  
  /**
   * Get a nested property from an object using dot notation
   * @param obj Object to extract property from
   * @param path Property path using dot notation (e.g., 'user.address.city')
   * @returns The property value or undefined if not found
   */
  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : undefined;
    }, obj);
  }
  
  /**
   * Generate a cache key for search options
   * @param options Search options
   * @returns Cache key string
   */
  private generateCacheKey(options: Partial<SearchOptions>): string {
    return JSON.stringify({
      query: options.query,
      types: options.types,
      limit: options.limit,
      page: options.page,
      filters: options.filters
    });
  }
  
  /**
   * Get cached search result
   * @param key Cache key
   * @returns Cached result or undefined if not found or expired
   */
  private getCachedResult(key: string): SearchResponse | undefined {
    const cached = this.searchCache.get(key);
    
    if (!cached) return undefined;
    
    // Check if cache entry has expired
    if (Date.now() - cached.timestamp > this.cacheTTL) {
      this.searchCache.delete(key);
      return undefined;
    }
    
    return cached.results;
  }
  
  /**
   * Cache search result
   * @param key Cache key
   * @param results Search results
   */
  private cacheResult(key: string, results: SearchResponse): void {
    // Clean up cache if it's too large
    if (this.searchCache.size >= this.maxCacheEntries) {
      this.cleanupCache();
    }
    
    // Add to cache
    this.searchCache.set(key, {
      params: key,
      results,
      timestamp: Date.now()
    });
  }
  
  /**
   * Clean up expired cache entries
   */
  private cleanupCache(): void {
    const now = Date.now();
    
    // Remove expired entries
    for (const [key, entry] of this.searchCache.entries()) {
      if (now - entry.timestamp > this.cacheTTL) {
        this.searchCache.delete(key);
      }
    }
    
    // If still too large, remove oldest entries
    if (this.searchCache.size >= this.maxCacheEntries) {
      const entries = Array.from(this.searchCache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      // Remove oldest 20% of entries
      const deleteCount = Math.ceil(this.maxCacheEntries * 0.2);
      for (let i = 0; i < deleteCount && i < entries.length; i++) {
        this.searchCache.delete(entries[i][0]);
      }
    }
  }
  
  /**
   * Set cache time-to-live
   * @param ttlMs TTL in milliseconds
   */
  setCacheTTL(ttlMs: number): void {
    this.cacheTTL = ttlMs;
  }
  
  /**
   * Set maximum number of cache entries
   * @param maxEntries Maximum entries
   */
  setMaxCacheEntries(maxEntries: number): void {
    this.maxCacheEntries = maxEntries;
  }
  
  /**
   * Clear the search cache
   */
  clearCache(): void {
    this.searchCache.clear();
  }
}