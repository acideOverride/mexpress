import { MongoDBTextSearchService } from './mongodb-text-search.service';
import { SearchIndexManager } from './search-index-manager';
import { AdvancedSearchService } from './advanced-search.service';

/**
 * Factory for creating search services
 */
export class SearchFactory {
  /**
   * Create a fully configured MongoDB text search service
   * @returns MongoDB text search service
   */
  static createTextSearchService(): MongoDBTextSearchService {
    return new MongoDBTextSearchService();
  }
  
  /**
   * Create a search index manager
   * @param textSearchService Text search service to use
   * @returns Search index manager
   */
  static createIndexManager(textSearchService: MongoDBTextSearchService): SearchIndexManager {
    return new SearchIndexManager(textSearchService);
  }
  
  /**
   * Create an advanced search service
   * @param textSearchService Text search service to use
   * @param indexManager Search index manager to use
   * @returns Advanced search service
   */
  static createAdvancedSearchService(
    textSearchService: MongoDBTextSearchService,
    indexManager: SearchIndexManager
  ): AdvancedSearchService {
    return new AdvancedSearchService(textSearchService, indexManager);
  }
  
  /**
   * Create and initialize the complete search infrastructure
   * This is the main factory method to use when initializing the application
   * @param options Configuration options
   * @returns Object containing all search services
   */
  static async createSearchInfrastructure(options: {
    cacheTTL?: number;
    maxCacheEntries?: number;
    createIndexes?: boolean;
  } = {}) {
    // Create core services
    const textSearchService = this.createTextSearchService();
    const indexManager = this.createIndexManager(textSearchService);
    const advancedSearch = this.createAdvancedSearchService(textSearchService, indexManager);
    
    // Configure cache
    if (options.cacheTTL) {
      advancedSearch.setCacheTTL(options.cacheTTL);
    }
    
    if (options.maxCacheEntries) {
      advancedSearch.setMaxCacheEntries(options.maxCacheEntries);
    }
    
    // Create indexes if requested
    if (options.createIndexes) {
      try {
        console.log('Creating search indexes...');
        await indexManager.createAllIndexes();
        
        // Verify indexes were created successfully
        const verificationResults = await indexManager.verifyIndexes();
        console.log('Index verification results:', verificationResults);
      } catch (error) {
        console.error('Error creating search indexes:', error);
      }
    }
    
    return {
      textSearchService,
      indexManager,
      advancedSearch
    };
  }
}