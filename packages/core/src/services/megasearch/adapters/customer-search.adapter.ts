import mongoose from 'mongoose';
import { CustomerModel } from '../../../models/customer.schema';
import { CustomerService } from '../../customer.service';
import {
  EntitySearchAdapter,
  SearchOptions,
  SearchResult,
  TypeaheadSuggestion,
  CreateNewSuggestion,
  CustomerSearchResult
} from '../megasearch.types';

/**
 * Customer entity search adapter for MegaSearch
 */
export class CustomerSearchAdapter implements EntitySearchAdapter {
  readonly entityType = 'customer';
  private customerService: CustomerService;
  
  constructor(customerService: CustomerService) {
    this.customerService = customerService;
  }

  /**
   * Search for customers matching the query
   */
  async search(query: string, options?: Partial<SearchOptions>): Promise<CustomerSearchResult[]> {
    // Set defaults
    const limit = options?.limit || 5;
    const page = options?.page || 1;
    const filters = options?.filters || {};
    const skip = (page - 1) * limit;

    // Start measuring execution time
    const startTime = Date.now();
    
    try {
      // First try MongoDB text search for better relevance ranking
      if (query.length >= 2) {
        const textSearchQuery: any = { $text: { $search: query } };
        
        // Apply filters if provided
        if (filters.state) {
          textSearchQuery['address.state'] = filters.state;
        }
        if (filters.city) {
          textSearchQuery['address.city'] = filters.city;
        }
        
        const textSearchResults = await CustomerModel.find(
          textSearchQuery,
          { score: { $meta: 'textScore' } }
        )
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();

        if (textSearchResults.length > 0) {
          return this.formatCustomerResults(textSearchResults, query);
        }
      }
      
      // Fallback to regex search if text search returns no results or query is too short
      const searchPattern = new RegExp(query, 'i');
      const regexQuery: any = {
        $or: [
          { name: searchPattern },
          { email: searchPattern },
          { phone: searchPattern },
          { 'address.city': searchPattern }
        ]
      };
      
      // Apply filters
      if (filters.state) {
        regexQuery['address.state'] = filters.state;
      }
      if (filters.city) {
        regexQuery['address.city'] = filters.city;
      }
      
      const regexResults = await CustomerModel.find(regexQuery)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();

      return this.formatCustomerResults(regexResults, query);
    } catch (error) {
      console.error('Error in customer search:', error);
      return [];
    }
  }

  /**
   * Generate typeahead suggestions for customers
   */
  async typeahead(query: string, limit = 3): Promise<TypeaheadSuggestion[]> {
    if (query.length < 2) return [];
    
    try {
      // Use regex for typeahead to catch partial matches
      const searchPattern = new RegExp('^' + query, 'i'); // Start-of-string match for better suggestions
      
      const results = await CustomerModel.find({
        $or: [
          { name: searchPattern },
          { email: searchPattern },
          { phone: searchPattern }
        ]
      })
      .limit(limit)
      .lean()
      .exec();
      
      return results.map(customer => {
        // Calculate a simple relevance score
        let score = 50; // Base score
        
        if (new RegExp('^' + query, 'i').test(customer.name)) {
          score += 30; // Boost for name match at start
        } else if (new RegExp(query, 'i').test(customer.name)) {
          score += 20; // Boost for name match anywhere
        }
        
        if (new RegExp(query, 'i').test(customer.email)) {
          score += 15; // Boost for email match
        }
        
        return {
          id: customer._id.toString(),
          type: this.entityType,
          label: customer.name,
          secondaryLabel: customer.email,
          score: Math.min(score, 100) // Cap at 100
        };
      }).sort((a, b) => b.score - a.score); // Sort by score descending
    } catch (error) {
      console.error('Error in customer typeahead:', error);
      return [];
    }
  }

  /**
   * Create a "new customer" suggestion based on query
   */
  createNewSuggestion(query: string): CreateNewSuggestion {
    // Pre-fill data based on query format detection
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
      type: this.entityType,
      prefilledData
    };
  }

  /**
   * Format raw customer documents into search results
   */
  private formatCustomerResults(customers: any[], query: string): CustomerSearchResult[] {
    return customers.map(customer => {
      // Determine which fields matched the query
      const matchedOn: string[] = [];
      const queryRegex = new RegExp(query, 'i');
      
      if (queryRegex.test(customer.name)) matchedOn.push('name');
      if (queryRegex.test(customer.email)) matchedOn.push('email');
      if (customer.phone && queryRegex.test(customer.phone)) matchedOn.push('phone');
      if (customer.address && queryRegex.test(customer.address.city)) matchedOn.push('address.city');
      
      // Calculate score based on which fields matched
      let score = customer.score ? Math.min(customer.score * 10, 100) : 50; // Base score from MongoDB
      
      // Apply score adjustments if we're using regex search
      if (!customer.score) {
        if (matchedOn.includes('name')) score += 30;
        if (matchedOn.includes('email')) score += 20;
        if (matchedOn.includes('phone')) score += 15;
        if (matchedOn.includes('address.city')) score += 10;
        
        // Cap score at 100
        score = Math.min(score, 100);
      }
      
      return {
        id: customer._id.toString(),
        type: this.entityType,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address ? {
          city: customer.address.city,
          state: customer.address.state,
          zip: customer.address.zip
        } : undefined,
        score,
        matchedOn: matchedOn.length > 0 ? matchedOn : ['unknown']
      };
    }).sort((a, b) => b.score - a.score); // Sort by score descending
  }
}