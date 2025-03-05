import mongoose from 'mongoose';
import { UserModel } from '../../../models/user.schema';
import {
  EntitySearchAdapter,
  SearchOptions,
  SearchResult,
  TypeaheadSuggestion,
  CreateNewSuggestion,
  UserSearchResult
} from '../megasearch.types';

/**
 * User entity search adapter for MegaSearch
 */
export class UserSearchAdapter implements EntitySearchAdapter {
  readonly entityType = 'user';
  
  /**
   * Search for users matching the query
   */
  async search(query: string, options?: Partial<SearchOptions>): Promise<UserSearchResult[]> {
    // Set defaults
    const limit = options?.limit || 5;
    const page = options?.page || 1;
    const filters = options?.filters || {};
    const skip = (page - 1) * limit;
    
    try {
      // Create the search filter
      const searchPattern = new RegExp(query, 'i');
      const searchCriteria: any = {
        $or: [
          { email: searchPattern },
          { firstName: searchPattern },
          { lastName: searchPattern }
        ]
      };
      
      // Add role filter if provided
      if (filters.role) {
        searchCriteria.role = filters.role;
      }
      
      // Add active filter if provided
      if (filters.isActive !== undefined) {
        searchCriteria.isActive = filters.isActive;
      }
      
      // Exclude password and refreshToken fields
      const results = await UserModel.find(searchCriteria)
        .select('-password -refreshToken')
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
        
      return this.formatUserResults(results, query);
    } catch (error) {
      console.error('Error in user search:', error);
      return [];
    }
  }

  /**
   * Generate typeahead suggestions for users
   */
  async typeahead(query: string, limit = 3): Promise<TypeaheadSuggestion[]> {
    if (query.length < 2) return [];
    
    try {
      // Use regex for typeahead to catch partial matches
      const searchPattern = new RegExp('^' + query, 'i');
      
      const results = await UserModel.find({
        $or: [
          { email: searchPattern },
          { firstName: searchPattern },
          { lastName: searchPattern }
        ]
      })
      .select('-password -refreshToken')
      .limit(limit)
      .lean()
      .exec();
      
      return results.map(user => {
        // Calculate a simple relevance score
        let score = 50; // Base score
        
        if (new RegExp('^' + query, 'i').test(user.email)) {
          score += 30; // Boost for email match at start
        } else if (new RegExp(query, 'i').test(user.email)) {
          score += 20; // Boost for email match anywhere
        }
        
        if (new RegExp('^' + query, 'i').test(user.firstName)) {
          score += 25; // Boost for firstName match at start
        }
        
        if (new RegExp('^' + query, 'i').test(user.lastName)) {
          score += 25; // Boost for lastName match at start
        }
        
        const fullName = `${user.firstName} ${user.lastName}`;
        
        return {
          id: user._id.toString(),
          type: this.entityType,
          label: fullName,
          secondaryLabel: user.email,
          score: Math.min(score, 100) // Cap at 100
        };
      }).sort((a, b) => b.score - a.score); // Sort by score descending
    } catch (error) {
      console.error('Error in user typeahead:', error);
      return [];
    }
  }

  /**
   * Create a "new user" suggestion based on query
   */
  createNewSuggestion(query: string): CreateNewSuggestion {
    // Pre-fill data based on query format detection
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
      type: this.entityType,
      prefilledData
    };
  }

  /**
   * Format raw user documents into search results
   */
  private formatUserResults(users: any[], query: string): UserSearchResult[] {
    return users.map(user => {
      // Determine which fields matched the query
      const matchedOn: string[] = [];
      const queryRegex = new RegExp(query, 'i');
      
      if (queryRegex.test(user.email)) matchedOn.push('email');
      if (queryRegex.test(user.firstName)) matchedOn.push('firstName');
      if (queryRegex.test(user.lastName)) matchedOn.push('lastName');
      
      // Calculate score based on which fields matched
      let score = 50; // Base score
      
      if (matchedOn.includes('email')) {
        if (new RegExp('^' + query, 'i').test(user.email)) {
          score += 30; // Higher score for prefix match on email
        } else {
          score += 20; // Lower score for substring match
        }
      }
      
      if (matchedOn.includes('firstName')) score += 25;
      if (matchedOn.includes('lastName')) score += 25;
      
      // Cap score at 100
      score = Math.min(score, 100);
      
      return {
        id: user._id.toString(),
        type: this.entityType,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        score,
        matchedOn: matchedOn.length > 0 ? matchedOn : ['unknown']
      };
    }).sort((a, b) => b.score - a.score); // Sort by score descending
  }
}