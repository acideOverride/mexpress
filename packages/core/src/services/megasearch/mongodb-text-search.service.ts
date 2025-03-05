import mongoose, { Model, Document } from 'mongoose';
import { performance } from 'perf_hooks';

/**
 * Configuration for text search operation
 */
export interface TextSearchConfig<T extends Document> {
  /** MongoDB model to search */
  model: Model<T>;
  
  /** Search query string */
  query: string;
  
  /** Fields to return (projection) */
  fields?: Record<string, number | boolean>;
  
  /** Maximum number of results to return */
  limit?: number;
  
  /** Number of results to skip (for pagination) */
  skip?: number;
  
  /** Additional filters to apply */
  filters?: Record<string, any>;
  
  /** Field weights for text search (default to schema weights) */
  weights?: Record<string, number>;
  
  /** Minimum score threshold */
  minScore?: number;
  
  /** Debug mode to return timing data */
  debug?: boolean;
  
  /** Whether to apply fuzzy matching to the query */
  fuzzy?: boolean;
  
  /** Specific fields to search if not using full text index */
  searchFields?: string[];
}

/**
 * Result of a text search operation
 */
export interface TextSearchResult<T> {
  /** Search results */
  results: (T & { score: number })[];
  
  /** Total number of results (for pagination) */
  total: number;
  
  /** Search performance metrics */
  meta: {
    /** Time in milliseconds the search took */
    executionTimeMs: number;
    
    /** Detailed timing for each phase (only in debug mode) */
    timings?: {
      queryPreparation: number;
      execution: number;
      countQuery?: number;
      resultFormatting: number;
    };
    
    /** Whether text search was used (vs fallback) */
    usedTextSearch: boolean;
    
    /** Whether fuzzy matching was applied */
    fuzzyMatchApplied: boolean;
  };
}

/**
 * Service for optimized MongoDB text search operations
 */
export class MongoDBTextSearchService {
  /**
   * Perform a text search on a MongoDB collection
   * @param config Search configuration
   * @returns Search results with metadata
   */
  async search<T extends Document>(config: TextSearchConfig<T>): Promise<TextSearchResult<T>> {
    const startTime = performance.now();
    
    // Initialize timing metrics
    const timings = {
      queryPreparation: 0,
      execution: 0,
      countQuery: 0,
      resultFormatting: 0
    };
    
    // Prepare query
    const queryPrepStart = performance.now();
    
    const limit = config.limit || 10;
    const skip = config.skip || 0;
    
    // Build the search query
    let searchQuery: any;
    let projection: any = config.fields || {};
    let sort: any = {};
    let usedTextSearch = false;
    let fuzzyMatchApplied = false;
    
    // Determine if text search is possible
    const hasValidQuery = config.query && config.query.length >= 2;
    
    if (hasValidQuery) {
      try {
        // First attempt: MongoDB text search for best ranking
        searchQuery = { $text: { $search: config.query } };
        projection.score = { $meta: 'textScore' };
        sort.score = { $meta: 'textScore' };
        usedTextSearch = true;
      } catch (error) {
        console.warn('MongoDB text search failed, falling back to regex:', error);
        usedTextSearch = false;
      }
    }
    
    // Apply additional filters if provided
    if (config.filters && Object.keys(config.filters).length > 0) {
      searchQuery = {
        ...searchQuery,
        ...config.filters
      };
    }
    
    // If text search is not used or we're forced to use specific fields, use regex
    if (!usedTextSearch || config.searchFields) {
      const searchFields = config.searchFields || ['name', 'description', 'tags'];
      
      // Apply fuzzy matching if requested (allowing for typos)
      let searchPattern;
      if (config.fuzzy) {
        // Create a more flexible pattern that allows for character substitutions/omissions
        // This is a simplified implementation of fuzzy matching
        const fuzzyQuery = config.query.split('').join('.*');
        searchPattern = new RegExp(fuzzyQuery, 'i');
        fuzzyMatchApplied = true;
      } else {
        searchPattern = new RegExp(config.query, 'i');
      }
      
      // Build $or query for multiple fields
      const orConditions = searchFields.map(field => {
        const condition: Record<string, any> = {};
        condition[field] = searchPattern;
        return condition;
      });
      
      searchQuery = {
        $or: orConditions,
        ...(config.filters || {})
      };
      
      // Since we're not using text search, sort by a default field
      sort = { updatedAt: -1 }; // Most recently updated first
    }
    
    timings.queryPreparation = performance.now() - queryPrepStart;
    
    // Execute search
    const executionStart = performance.now();
    
    let results: (T & { score: number })[] = [];
    let total = 0;
    
    try {
      // Get results with limit and skip
      const query = config.model.find(searchQuery, projection)
        .sort(sort)
        .skip(skip)
        .limit(limit);
      
      results = await query.lean().exec() as any[];
      
      // Get total count (if in debug mode or needed for pagination)
      if (config.debug) {
        const countStart = performance.now();
        total = await config.model.countDocuments(searchQuery);
        timings.countQuery = performance.now() - countStart;
      }
    } catch (error) {
      console.error('Error executing MongoDB search:', error);
      throw new Error(`MongoDB search failed: ${error.message}`);
    }
    
    timings.execution = performance.now() - executionStart;
    
    // Apply normalization and formatting
    const formattingStart = performance.now();
    
    if (!usedTextSearch) {
      // For regex searches, calculate a synthetic score based on match quality
      results = results.map(result => {
        const item = result as any;
        
        // Calculate a score based on where and how well the query matches
        let score = 50; // Base score
        
        // Calculate score based on field matches (simplified implementation)
        if (config.searchFields) {
          config.searchFields.forEach(field => {
            const fieldValue = this.getNestedProperty(item, field);
            if (fieldValue && typeof fieldValue === 'string') {
              // Exact match scores higher than substring match
              if (fieldValue.toLowerCase() === config.query.toLowerCase()) {
                score += 30;
              } else if (fieldValue.toLowerCase().includes(config.query.toLowerCase())) {
                // Check if match is at the beginning (higher score)
                if (fieldValue.toLowerCase().startsWith(config.query.toLowerCase())) {
                  score += 20;
                } else {
                  score += 10;
                }
              }
            }
          });
        }
        
        // Add score to result
        item.score = Math.min(score, 100); // Cap at 100
        return item;
      });
      
      // Sort by our synthetic score
      results.sort((a: any, b: any) => b.score - a.score);
    } else if (config.minScore) {
      // If using text search and minScore is set, filter results below threshold
      results = results.filter(result => result.score >= config.minScore);
    }
    
    timings.resultFormatting = performance.now() - formattingStart;
    
    // Calculate total execution time
    const executionTimeMs = performance.now() - startTime;
    
    // Return formatted results
    return {
      results,
      total: total || results.length,
      meta: {
        executionTimeMs,
        timings: config.debug ? timings : undefined,
        usedTextSearch,
        fuzzyMatchApplied
      }
    };
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
   * Create text indexes for a collection
   * This should be used during application initialization
   * 
   * @param model MongoDB model
   * @param fields Fields to index with their weights
   * @param options Additional index options
   * @returns Promise resolving when index is created
   */
  async createTextIndex<T extends Document>(
    model: Model<T>,
    fields: Record<string, number>,
    options: mongoose.IndexOptions = {}
  ): Promise<void> {
    try {
      const indexFields: Record<string, string> = {};
      Object.keys(fields).forEach(field => {
        indexFields[field] = 'text';
      });
      
      await model.collection.createIndex(indexFields, {
        weights: fields,
        name: `${model.modelName}TextIndex`,
        ...options
      });
      
      console.log(`Created text index for ${model.modelName}`);
    } catch (error) {
      console.error(`Failed to create text index for ${model.modelName}:`, error);
      throw error;
    }
  }
  
  /**
   * Check if text search is available for a model
   * @param model MongoDB model to check
   * @returns Promise resolving to boolean indicating if text search is available
   */
  async hasTextSearchEnabled<T extends Document>(model: Model<T>): Promise<boolean> {
    try {
      const indexes = await model.collection.indexes();
      return indexes.some(index => 
        index.textIndexVersion !== undefined || 
        Object.values(index.key).includes('text')
      );
    } catch (error) {
      console.error(`Failed to check text index for ${model.modelName}:`, error);
      return false;
    }
  }
  
  /**
   * Generate suggested terms for a given query
   * @param model MongoDB model
   * @param query Partial search query
   * @param field Field to generate suggestions from
   * @param limit Maximum number of suggestions
   * @returns Promise resolving to array of unique terms
   */
  async generateSuggestions<T extends Document>(
    model: Model<T>,
    query: string,
    field: string,
    limit = 5
  ): Promise<string[]> {
    if (!query || query.length < 2) return [];
    
    try {
      // Create regex pattern - match terms starting with the query
      const pattern = new RegExp(`^${query}`, 'i');
      
      // Use MongoDB aggregation to find and extract unique values
      const results = await model.aggregate([
        // Filter documents with field matching pattern
        { $match: { [field]: pattern } },
        // Project only the matching field
        { $project: { _id: 0, term: `$${field}` } },
        // Group to get unique values
        { $group: { _id: '$term' } },
        // Limit results
        { $limit: limit }
      ]);
      
      // Extract and return unique terms
      return results.map(item => item._id).filter(Boolean);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [];
    }
  }
}