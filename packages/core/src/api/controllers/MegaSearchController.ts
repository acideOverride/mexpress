import { Request, Response } from 'express';
import { SearchFactory } from '../../services/megasearch/search-factory';
import { SearchOptions } from '../../services/megasearch/megasearch.types';

/**
 * Controller for MegaSearch API endpoints
 */
export class MegaSearchController {
  private static searchServices: any = null;
  
  /**
   * Initialize search services
   * Should be called during application startup
   */
  static async initialize() {
    if (!this.searchServices) {
      this.searchServices = await SearchFactory.createSearchInfrastructure({
        cacheTTL: 5 * 60 * 1000, // 5 minutes
        maxCacheEntries: 100,
        createIndexes: true
      });
      
      console.log('MegaSearch services initialized');
    }
    
    return this.searchServices;
  }
  
  /**
   * Get search services, initializing if needed
   */
  private async getSearchServices() {
    if (!MegaSearchController.searchServices) {
      await MegaSearchController.initialize();
    }
    
    return MegaSearchController.searchServices;
  }
  
  /**
   * Perform cross-entity search
   */
  async search(req: Request, res: Response): Promise<void> {
    try {
      const services = await this.getSearchServices();
      
      // Validate request body
      const { query, types, limit, page, filters } = req.body;
      
      if (!query || typeof query !== 'string' || query.length < 2) {
        res.status(400).json({
          error: {
            code: 'INVALID_QUERY',
            message: 'Search query must be at least 2 characters'
          }
        });
        return;
      }
      
      // Configure search options
      const searchOptions: SearchOptions = {
        query,
        types: types || undefined,
        limit: limit && !isNaN(limit) ? Number(limit) : undefined,
        page: page && !isNaN(page) ? Number(page) : undefined,
        filters: filters || undefined
      };
      
      // Execute search using advanced search service
      const results = await services.advancedSearch.search(searchOptions);
      
      // Return results
      res.status(200).json(results);
    } catch (error) {
      console.error('Error in MegaSearch:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('at least 2 characters')) {
          res.status(400).json({
            error: {
              code: 'INVALID_QUERY',
              message: error.message
            }
          });
          return;
        }
        
        if (error.message.includes('Unknown entity type')) {
          res.status(400).json({
            error: {
              code: 'INVALID_ENTITY_TYPE',
              message: error.message
            }
          });
          return;
        }
      }
      
      // Generic error
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while processing your search'
        }
      });
    }
  }
  
  /**
   * Perform entity-specific search
   */
  async searchEntity(req: Request, res: Response): Promise<void> {
    try {
      const services = await this.getSearchServices();
      const entityType = req.params.entityType;
      
      // Validate request body
      const { query, limit, page, filters } = req.body;
      
      if (!query || typeof query !== 'string' || query.length < 2) {
        res.status(400).json({
          error: {
            code: 'INVALID_QUERY',
            message: 'Search query must be at least 2 characters'
          }
        });
        return;
      }
      
      // Execute entity-specific search
      const results = await services.advancedSearch.searchEntity(
        this.mapApiEntityTypeToInternal(entityType),
        {
          query,
          limit: limit && !isNaN(limit) ? Number(limit) : undefined,
          page: page && !isNaN(page) ? Number(page) : undefined,
          filters: filters || undefined
        }
      );
      
      // Return results
      res.status(200).json(results);
    } catch (error) {
      console.error(`Error in ${req.params.entityType} search:`, error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('at least 2 characters')) {
          res.status(400).json({
            error: {
              code: 'INVALID_QUERY',
              message: error.message
            }
          });
          return;
        }
        
        if (error.message.includes('Unknown entity type')) {
          res.status(400).json({
            error: {
              code: 'INVALID_ENTITY_TYPE',
              message: error.message
            }
          });
          return;
        }
      }
      
      // Generic error
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while processing your search'
        }
      });
    }
  }
  
  /**
   * Provide typeahead suggestions
   */
  async typeahead(req: Request, res: Response): Promise<void> {
    try {
      const services = await this.getSearchServices();
      
      // Validate request body
      const { query, types, limit } = req.body;
      
      if (!query || typeof query !== 'string' || query.length < 2) {
        res.status(400).json({
          error: {
            code: 'INVALID_QUERY',
            message: 'Search query must be at least 2 characters'
          }
        });
        return;
      }
      
      // Map API entity types to internal types
      const mappedTypes = types ? types.map(t => this.mapApiEntityTypeToInternal(t)) : undefined;
      
      // Execute typeahead search
      const suggestions = await services.advancedSearch.typeahead(
        query,
        mappedTypes,
        limit && !isNaN(limit) ? Number(limit) : undefined
      );
      
      // Return results
      res.status(200).json({
        suggestions,
        meta: {
          totalResults: suggestions.length,
          executionTimeMs: 0 // This will be populated by the advanced search service
        }
      });
    } catch (error) {
      console.error('Error in typeahead search:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('at least 2 characters')) {
          res.status(400).json({
            error: {
              code: 'INVALID_QUERY',
              message: error.message
            }
          });
          return;
        }
      }
      
      // Generic error
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while processing your search'
        }
      });
    }
  }
  
  /**
   * Get all available entity types
   */
  async getEntityTypes(req: Request, res: Response): Promise<void> {
    try {
      const services = await this.getSearchServices();
      
      // Get registered entity types
      const entityTypes = services.indexManager.getRegisteredIndexNames();
      
      // Return entity types
      res.status(200).json({
        entityTypes: entityTypes.map(this.mapInternalEntityTypeToApi),
        count: entityTypes.length
      });
    } catch (error) {
      console.error('Error getting entity types:', error);
      
      // Generic error
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while retrieving entity types'
        }
      });
    }
  }
  
  /**
   * Clear search cache
   */
  async clearCache(req: Request, res: Response): Promise<void> {
    try {
      const services = await this.getSearchServices();
      
      // Clear cache
      services.advancedSearch.clearCache();
      
      // Return success
      res.status(200).json({
        message: 'Search cache cleared successfully'
      });
    } catch (error) {
      console.error('Error clearing search cache:', error);
      
      // Generic error
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while clearing search cache'
        }
      });
    }
  }
  
  /**
   * Map API entity type name to internal entity type
   * @param apiType Entity type from API
   * @returns Internal entity type
   */
  private mapApiEntityTypeToInternal(apiType: string): string {
    // API uses lowercase, internal uses PascalCase
    const mapping: Record<string, string> = {
      'customer': 'Customer',
      'product': 'Product',
      'user': 'User'
    };
    
    return mapping[apiType.toLowerCase()] || apiType;
  }
  
  /**
   * Map internal entity type to API entity type
   * @param internalType Internal entity type
   * @returns API entity type
   */
  private mapInternalEntityTypeToApi(internalType: string): string {
    // API uses lowercase, internal uses PascalCase
    return internalType.toLowerCase();
  }
}