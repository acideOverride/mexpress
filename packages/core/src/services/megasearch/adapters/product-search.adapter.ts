import mongoose from 'mongoose';
import { Product } from '../../../models/product';
import { ProductService } from '../../product.service';
import {
  EntitySearchAdapter,
  SearchOptions,
  SearchResult,
  TypeaheadSuggestion,
  CreateNewSuggestion,
  ProductSearchResult
} from '../megasearch.types';

/**
 * Product entity search adapter for MegaSearch
 */
export class ProductSearchAdapter implements EntitySearchAdapter {
  readonly entityType = 'product';
  private productService: ProductService;
  
  constructor(productService: ProductService) {
    this.productService = productService;
  }

  /**
   * Search for products matching the query
   */
  async search(query: string, options?: Partial<SearchOptions>): Promise<ProductSearchResult[]> {
    // Set defaults
    const limit = options?.limit || 5;
    const page = options?.page || 1;
    const filters = options?.filters || {};
    const skip = (page - 1) * limit;
    
    try {
      // Build the search criteria
      const searchCriteria: any = {};
      
      // Add text search if we have valid text indexes
      if (query.length >= 2) {
        // Check if Product schema has text index - if not, we'll use regex
        // This is a simplification - in a real implementation we'd check the collection's indexes
        const hasTextIndex = true; // Assume we've added text index to Product model
        
        if (hasTextIndex) {
          searchCriteria.$text = { $search: query };
        } else {
          const searchRegex = new RegExp(query, 'i');
          searchCriteria.$or = [
            { name: searchRegex },
            { sku: searchRegex },
            { description: searchRegex },
            { tags: searchRegex }
          ];
        }
      }
      
      // Apply filters if provided
      if (filters.category) {
        searchCriteria.category = filters.category;
      }
      
      if (filters.inStock) {
        searchCriteria.stockLevel = { $gt: 0 };
      }
      
      if (filters.priceRange) {
        searchCriteria.price = {};
        
        if (filters.priceRange.min !== undefined) {
          searchCriteria.price.$gte = filters.priceRange.min;
        }
        
        if (filters.priceRange.max !== undefined) {
          searchCriteria.price.$lte = filters.priceRange.max;
        }
      }
      
      // Set up projection and sorting
      const projection: any = {};
      const sort: any = {};
      
      // If using text search, include score and sort by it
      if (searchCriteria.$text) {
        projection.score = { $meta: 'textScore' };
        sort.score = { $meta: 'textScore' };
      } else {
        // Default sort by name if not using text search
        sort.name = 1;
      }
      
      // Execute search query
      const results = await Product.find(searchCriteria, projection)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
        
      return this.formatProductResults(results, query);
    } catch (error) {
      console.error('Error in product search:', error);
      return [];
    }
  }

  /**
   * Generate typeahead suggestions for products
   */
  async typeahead(query: string, limit = 3): Promise<TypeaheadSuggestion[]> {
    if (query.length < 2) return [];
    
    try {
      // Use regex for typeahead to catch partial matches
      const searchPattern = new RegExp('^' + query, 'i'); // Start-of-string match for better suggestions
      
      const results = await Product.find({
        $or: [
          { name: searchPattern },
          { sku: searchPattern }
        ]
      })
      .limit(limit)
      .lean()
      .exec();
      
      return results.map(product => {
        // Calculate a simple relevance score
        let score = 50; // Base score
        
        if (new RegExp('^' + query, 'i').test(product.name)) {
          score += 30; // Boost for name match at start
        } else if (new RegExp(query, 'i').test(product.name)) {
          score += 20; // Boost for name match anywhere
        }
        
        if (new RegExp(query, 'i').test(product.sku)) {
          score += 25; // Boost for SKU match
        }
        
        // Format price for display
        const formattedPrice = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(product.price);
        
        return {
          id: product._id.toString(),
          type: this.entityType,
          label: product.name,
          secondaryLabel: `${formattedPrice} - ${product.category}`,
          score: Math.min(score, 100) // Cap at 100
        };
      }).sort((a, b) => b.score - a.score); // Sort by score descending
    } catch (error) {
      console.error('Error in product typeahead:', error);
      return [];
    }
  }

  /**
   * Create a "new product" suggestion based on query
   */
  createNewSuggestion(query: string): CreateNewSuggestion {
    // Pre-fill data based on query format detection
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
    
    return {
      type: this.entityType,
      prefilledData
    };
  }

  /**
   * Format raw product documents into search results
   */
  private formatProductResults(products: any[], query: string): ProductSearchResult[] {
    return products.map(product => {
      // Determine which fields matched the query
      const matchedOn: string[] = [];
      const queryRegex = new RegExp(query, 'i');
      
      if (queryRegex.test(product.name)) matchedOn.push('name');
      if (queryRegex.test(product.sku)) matchedOn.push('sku');
      if (product.description && queryRegex.test(product.description)) matchedOn.push('description');
      if (product.tags && product.tags.some((tag: string) => queryRegex.test(tag))) matchedOn.push('tags');
      
      // Calculate score based on which fields matched
      let score = product.score ? Math.min(product.score * 10, 100) : 50; // Base score from MongoDB
      
      // Apply score adjustments if we're using regex search
      if (!product.score) {
        if (matchedOn.includes('name')) score += 30;
        if (matchedOn.includes('sku')) score += 25;
        if (matchedOn.includes('description')) score += 15;
        if (matchedOn.includes('tags')) score += 10;
        
        // Cap score at 100
        score = Math.min(score, 100);
      }
      
      return {
        id: product._id.toString(),
        type: this.entityType,
        name: product.name,
        sku: product.sku,
        price: product.price,
        category: product.category,
        stockLevel: product.stockLevel,
        description: product.description,
        score,
        matchedOn: matchedOn.length > 0 ? matchedOn : ['unknown']
      };
    }).sort((a, b) => b.score - a.score); // Sort by score descending
  }
}