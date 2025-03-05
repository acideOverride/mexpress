import mongoose from 'mongoose';
import { CustomerModel } from '../../models/customer.schema';
import { Product } from '../../models/product';
import { UserModel } from '../../models/user.schema';
import { MongoDBTextSearchService } from './mongodb-text-search.service';

/**
 * Configuration for a text search index
 */
export interface TextIndexConfig {
  /** Model to create index for */
  model: mongoose.Model<any>;
  
  /** Fields to index with their respective weights */
  fields: Record<string, number>;
  
  /** Optional indexing options */
  options?: mongoose.IndexOptions;
}

/**
 * Manager for creating and maintaining text search indexes
 */
export class SearchIndexManager {
  private textSearchService: MongoDBTextSearchService;
  private indexConfigurations: Map<string, TextIndexConfig> = new Map();
  
  constructor(textSearchService: MongoDBTextSearchService) {
    this.textSearchService = textSearchService;
    this.registerDefaultIndexes();
  }
  
  /**
   * Register the default text indexes for core models
   */
  private registerDefaultIndexes(): void {
    // Customer model index
    this.registerIndex('Customer', {
      model: CustomerModel,
      fields: {
        name: 10,
        email: 5,
        phone: 3,
        'address.city': 1
      }
    });
    
    // Product model index
    this.registerIndex('Product', {
      model: Product,
      fields: {
        name: 10,
        sku: 5,
        description: 3,
        tags: 2
      }
    });
    
    // User model index
    this.registerIndex('User', {
      model: UserModel,
      fields: {
        email: 10,
        firstName: 5,
        lastName: 5
      }
    });
  }
  
  /**
   * Register a text index configuration
   * @param name Unique name for the index
   * @param config Index configuration
   */
  registerIndex(name: string, config: TextIndexConfig): void {
    this.indexConfigurations.set(name, config);
  }
  
  /**
   * Create all registered text indexes
   * This should be called during application startup
   */
  async createAllIndexes(): Promise<void> {
    console.log('Creating text search indexes...');
    
    // Get all index configurations
    const indexConfigs = Array.from(this.indexConfigurations.values());
    
    // Create indexes in parallel
    const results = await Promise.allSettled(
      indexConfigs.map(config => 
        this.textSearchService.createTextIndex(
          config.model, 
          config.fields, 
          config.options
        )
      )
    );
    
    // Report results
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    console.log(`Text index creation completed: ${successful} successful, ${failed} failed`);
    
    // Log failures
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const modelName = indexConfigs[index].model.modelName;
        console.error(`Failed to create text index for ${modelName}:`, result.reason);
      }
    });
  }
  
  /**
   * Verify that text indexes exist for all registered models
   * @returns Promise resolving to object with verification results
   */
  async verifyIndexes(): Promise<Record<string, boolean>> {
    console.log('Verifying text search indexes...');
    
    const results: Record<string, boolean> = {};
    
    // Check each index
    for (const [name, config] of this.indexConfigurations.entries()) {
      results[name] = await this.textSearchService.hasTextSearchEnabled(config.model);
    }
    
    return results;
  }
  
  /**
   * Get a list of all registered index names
   * @returns Array of index names
   */
  getRegisteredIndexNames(): string[] {
    return Array.from(this.indexConfigurations.keys());
  }
  
  /**
   * Get index configuration by name
   * @param name Index name
   * @returns Index configuration or undefined if not found
   */
  getIndexConfig(name: string): TextIndexConfig | undefined {
    return this.indexConfigurations.get(name);
  }
  
  /**
   * Get model by index name
   * @param name Index name
   * @returns Mongoose model or undefined if not found
   */
  getModelByIndexName(name: string): mongoose.Model<any> | undefined {
    const config = this.indexConfigurations.get(name);
    return config ? config.model : undefined;
  }
}