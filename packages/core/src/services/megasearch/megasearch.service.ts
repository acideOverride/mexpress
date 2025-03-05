import {
  SearchOptions,
  SearchResponse,
  SearchResult,
  TypeaheadResponse,
  TypeaheadSuggestion,
  EntitySearchAdapter,
  CreateNewSuggestion
} from './megasearch.types';

/**
 * MegaSearch Service
 * Provides cross-entity search functionality by coordinating multiple entity adapters
 */
export class MegaSearchService {
  private adapters: Map<string, EntitySearchAdapter> = new Map();
  private defaultLimit = 5;
  private defaultPage = 1;

  /**
   * Register an entity search adapter
   * @param adapter The adapter instance to register
   */
  registerAdapter(adapter: EntitySearchAdapter): void {
    this.adapters.set(adapter.entityType, adapter);
  }

  /**
   * Get all registered entity types
   * @returns Array of entity type strings
   */
  getRegisteredEntityTypes(): string[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * Perform cross-entity search
   * @param options Search options
   * @returns Promise resolving to search results across entity types
   */
  async search(options: SearchOptions): Promise<SearchResponse> {
    // Validate query
    if (!options.query || options.query.length < 2) {
      throw new Error('Search query must be at least 2 characters');
    }

    const limit = options.limit || this.defaultLimit;
    const page = options.page || this.defaultPage;
    const types = options.types || this.getRegisteredEntityTypes();
    const filters = options.filters || {};

    // Track execution time
    const startTime = Date.now();

    // Filter to use only registered adapters
    const activeAdapters = types
      .filter(type => this.adapters.has(type))
      .map(type => this.adapters.get(type)!);

    if (activeAdapters.length === 0) {
      throw new Error('No valid entity types specified for search');
    }

    // Execute searches in parallel
    const searchPromises = activeAdapters.map(adapter => {
      const entityFilters = filters[adapter.entityType] || {};
      
      return adapter.search(options.query, {
        limit,
        page,
        filters: entityFilters
      }).then(results => ({
        entityType: adapter.entityType,
        results
      }));
    });

    const searchResults = await Promise.all(searchPromises);

    // Transform results into the expected format
    const results: Record<string, SearchResult[]> = {};
    let totalResults = 0;
    const entityCounts: Record<string, number> = {};

    searchResults.forEach(({ entityType, results: entityResults }) => {
      results[entityType] = entityResults;
      entityCounts[entityType] = entityResults.length;
      totalResults += entityResults.length;
    });

    // Generate "create new" suggestion if no results found
    let suggestion = undefined;
    if (totalResults === 0) {
      const bestMatchType = this.determineBestEntityTypeForCreation(options.query, types);
      if (bestMatchType) {
        const adapter = this.adapters.get(bestMatchType);
        if (adapter) {
          suggestion = {
            createNew: adapter.createNewSuggestion(options.query)
          };
        }
      }
    }

    // Calculate execution time
    const executionTimeMs = Date.now() - startTime;

    // Determine if there are more results available
    // This is a simplification - in reality we'd need to know total count from the database
    const hasMore = Object.values(results).some(entityResults => 
      entityResults.length >= limit
    );

    // Return structured response
    return {
      results,
      suggestion,
      meta: {
        totalResults,
        entityCounts,
        executionTimeMs,
        page,
        hasMore
      }
    };
  }

  /**
   * Perform entity-specific search
   * @param entityType The type of entity to search
   * @param options Search options
   * @returns Promise resolving to entity-specific search results
   */
  async searchEntity(
    entityType: string,
    options: Omit<SearchOptions, 'types'>
  ): Promise<SearchResponse> {
    const adapter = this.adapters.get(entityType);
    if (!adapter) {
      throw new Error(`Unknown entity type: ${entityType}`);
    }

    const limit = options.limit || this.defaultLimit;
    const page = options.page || this.defaultPage;
    const entityFilters = options.filters || {};

    // Track execution time
    const startTime = Date.now();

    // Execute search
    const results = await adapter.search(options.query, {
      limit,
      page,
      filters: entityFilters
    });

    const totalResults = results.length;

    // Generate "create new" suggestion if no results found
    let suggestion = undefined;
    if (totalResults === 0) {
      suggestion = {
        createNew: adapter.createNewSuggestion(options.query)
      };
    }

    // Calculate execution time
    const executionTimeMs = Date.now() - startTime;

    // Return structured response
    return {
      results: {
        [entityType]: results
      },
      suggestion,
      meta: {
        totalResults,
        entityCounts: {
          [entityType]: totalResults
        },
        executionTimeMs,
        page,
        hasMore: results.length >= limit // Simplification
      }
    };
  }

  /**
   * Get typeahead suggestions across entity types
   * @param query The search query
   * @param types Optional array of entity types to search
   * @param limit Maximum number of suggestions per entity type
   * @returns Promise resolving to typeahead suggestions
   */
  async typeahead(
    query: string,
    types?: string[],
    limit = 3
  ): Promise<TypeaheadResponse> {
    // Validate query
    if (!query || query.length < 2) {
      throw new Error('Search query must be at least 2 characters');
    }

    const entityTypes = types || this.getRegisteredEntityTypes();
    const activeAdapters = entityTypes
      .filter(type => this.adapters.has(type))
      .map(type => this.adapters.get(type)!);

    // Track execution time
    const startTime = Date.now();

    // Execute typeahead searches in parallel
    const suggestionPromises = activeAdapters.map(adapter =>
      adapter.typeahead(query, limit)
    );

    const allSuggestions = await Promise.all(suggestionPromises);
    const suggestions = allSuggestions.flat()
      .sort((a, b) => b.score - a.score)
      .slice(0, limit * 3); // Limit total number of suggestions

    // Calculate execution time
    const executionTimeMs = Date.now() - startTime;

    return {
      suggestions,
      meta: {
        totalResults: suggestions.length,
        executionTimeMs
      }
    };
  }

  /**
   * Determine the best entity type for creating a new entity based on the query
   * @param query The search query
   * @param types Available entity types
   * @returns The most suitable entity type for creation
   */
  private determineBestEntityTypeForCreation(query: string, types: string[]): string | null {
    // Simple heuristics for determining the entity type:
    // - Email format suggests user or customer
    // - Price format suggests product
    // - Word count can help distinguish between types
    
    // Check if query looks like an email
    if (/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[\w-]{2,}$/.test(query)) {
      // Prefer customer over user if both are available
      if (types.includes('customer')) return 'customer';
      if (types.includes('user')) return 'user';
    }

    // Check if query includes price-like pattern ($, number with decimal)
    if (/\$?\d+(\.\d{2})?/.test(query)) {
      if (types.includes('product')) return 'product';
    }

    // Default logic based on word count
    const wordCount = query.split(/\s+/).length;
    
    if (wordCount <= 2) {
      // Short queries are more likely product names
      if (types.includes('product')) return 'product';
    } else {
      // Longer queries might be customer or user names
      if (types.includes('customer')) return 'customer';
      if (types.includes('user')) return 'user';
    }

    // If we have only one type, use that
    if (types.length === 1) return types[0];
    
    // Default to customer if available
    return types.includes('customer') ? 'customer' : types[0] || null;
  }
}