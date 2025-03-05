# MegaSearch API Specification

## Overview
The MegaSearch API provides a unified, cross-entity search capability across the mExpress platform. It enables fast, responsive search across multiple entity types (customers, products, users, etc.) with a consistent response format, debounced frontend implementation, and "create new" suggestions when no results are found.

## Design Goals
- **Speed**: Response time under 300ms for typical queries
- **Relevance**: Results sorted by relevance score across entity types
- **Comprehensive**: Search across all major entity types
- **User-friendly**: Support for partial matches and fuzzy search
- **Extensible**: Easy to add new entity types to search
- **Performance**: Optimized for large datasets with proper indexing

## API Endpoints

### 1. Main Search Endpoint

#### `POST /api/v1/megasearch`

This endpoint performs searches across multiple entities.

**Request Body:**
```json
{
  "query": "string",  // Required: The search query (minimum 2 characters)
  "types": ["string"], // Optional: Array of entity types to search (defaults to all)
  "limit": number,    // Optional: Maximum number of results per entity (default: 5)
  "page": number,     // Optional: Pagination page (default: 1)
  "filters": {        // Optional: Entity-specific filters
    "customer": {
      "state": "string",
      "city": "string"
    },
    "product": {
      "category": "string",
      "priceRange": {
        "min": number,
        "max": number
      },
      "inStock": boolean
    }
  }
}
```

**Response:**
```json
{
  "results": {
    "customer": [
      {
        "id": "string",
        "type": "customer",
        "name": "string",
        "email": "string",
        "phone": "string",
        "address": {
          "city": "string",
          "state": "string"
        },
        "score": number,      // Relevance score
        "matchedOn": ["name"] // Fields that matched the query
      }
    ],
    "product": [
      {
        "id": "string",
        "type": "product",
        "name": "string",
        "sku": "string",
        "price": number,
        "category": "string",
        "stockLevel": number,
        "score": number,
        "matchedOn": ["name", "description"]
      }
    ],
    "user": [
      {
        "id": "string",
        "type": "user",
        "email": "string",
        "firstName": "string",
        "lastName": "string",
        "role": "string",
        "score": number,
        "matchedOn": ["email"]
      }
    ]
  },
  "suggestion": {
    "createNew": {
      "type": "string",      // The entity type to create
      "prefilledData": {}    // Query-based data for creation form
    }
  },
  "meta": {
    "totalResults": number,
    "entityCounts": {
      "customer": number,
      "product": number,
      "user": number
    },
    "executionTimeMs": number,
    "page": number,
    "hasMore": boolean
  }
}
```

### 2. Entity-Specific Search

#### `POST /api/v1/megasearch/{entityType}`

This endpoint performs search on a specific entity type with entity-specific filters.

**URL Parameters:**
- `entityType`: The type of entity to search (customer, product, user, etc.)

**Request Body:**
```json
{
  "query": "string",  // Required: The search query
  "limit": number,    // Optional: Maximum results (default: 10)
  "page": number,     // Optional: Pagination page (default: 1)
  "filters": {}       // Optional: Entity-specific filters (varies by type)
}
```

**Response:**
```json
{
  "results": [
    {
      "id": "string",
      "type": "string",
      // Entity-specific fields
      "score": number,
      "matchedOn": ["string"]
    }
  ],
  "suggestion": {
    "createNew": {
      "prefilledData": {}
    }
  },
  "meta": {
    "totalResults": number,
    "executionTimeMs": number,
    "page": number,
    "hasMore": boolean
  }
}
```

### 3. Typeahead Search

#### `POST /api/v1/megasearch/typeahead`

Lightweight endpoint optimized for rapid typeahead suggestions with minimal fields.

**Request Body:**
```json
{
  "query": "string",  // Required: The search query
  "types": ["string"], // Optional: Array of entity types (default: all)
  "limit": number     // Optional: Maximum results per type (default: 3)
}
```

**Response:**
```json
{
  "suggestions": [
    {
      "id": "string",
      "type": "string",
      "label": "string",     // Primary display text
      "secondaryLabel": "string", // Secondary information
      "score": number
    }
  ],
  "meta": {
    "totalResults": number,
    "executionTimeMs": number
  }
}
```

## Data Models

### MongoDB Text Search Configuration

For entities with text search indexes:

```typescript
// Example for Customer model
CustomerSchema.index({
  name: 'text',
  email: 'text',
  phone: 'text',
  'address.city': 'text'
}, {
  weights: {
    name: 10,
    email: 5,
    phone: 3,
    'address.city': 1
  },
  name: 'CustomerTextIndex'
});

// Example for Product model
ProductSchema.index({
  name: 'text',
  description: 'text',
  sku: 'text',
  tags: 'text'
}, {
  weights: {
    name: 10,
    sku: 5,
    description: 3,
    tags: 2
  },
  name: 'ProductTextIndex'
});
```

### Search Service Interface

```typescript
export interface SearchOptions {
  query: string;
  types?: string[];
  limit?: number;
  page?: number;
  filters?: Record<string, any>;
}

export interface SearchResult {
  id: string;
  type: string;
  score: number;
  matchedOn: string[];
  [key: string]: any; // Entity-specific fields
}

export interface SearchResponse {
  results: Record<string, SearchResult[]>;
  suggestion?: {
    createNew?: {
      type: string;
      prefilledData: Record<string, any>;
    }
  };
  meta: {
    totalResults: number;
    entityCounts: Record<string, number>;
    executionTimeMs: number;
    page: number;
    hasMore: boolean;
  }
}
```

## Implementation Strategy

### 1. Backend Implementation

1. Create `MegaSearchService` with entity-specific search adapters
2. Implement MongoDB text search with fallback to regex for each entity type
3. Add proper indexes on all searchable entities
4. Implement weighted scoring algorithm to normalize scores across entities
5. Create API controllers for all search endpoints
6. Add pagination and filtering support
7. Implement "create new" suggestion logic
8. Add performance monitoring and optimization

### 2. Frontend Implementation

1. Create `MegaSearchClient` to interact with the API
2. Implement debouncing logic (wait 300ms after typing stops)
3. Develop search result display components
4. Implement "create new" suggestion UI
5. Add keyboard navigation for search results
6. Create entity-specific result display components
7. Implement loading states and error handling

## Performance Considerations

1. **Indexing Strategy**:
   - Text indexes for full-text search
   - Compound indexes for filtered queries
   - Use weighted indexes to prioritize important fields

2. **Query Optimization**:
   - Minimum query length of 2-3 characters
   - Limit results per entity type
   - Use projection to return only necessary fields
   - Implement query caching for repeated searches

3. **Response Time Goals**:
   - Typeahead search: < 100ms
   - Standard search: < 300ms
   - Filtered search: < 500ms

4. **Scaling Approach**:
   - Implement MongoDB read replicas for search-heavy workloads
   - Consider dedicated search service for very large datasets
   - Implement results caching for common searches

## Security Considerations

1. **Authentication & Authorization**:
   - All search endpoints require authentication
   - Results filtered based on user permissions
   - Sensitive fields excluded from search results

2. **Rate Limiting**:
   - Implement per-user rate limits for search endpoints
   - Gradually increase debounce time for high-frequency users

3. **Query Sanitization**:
   - Sanitize all search inputs to prevent injection attacks
   - Validate and escape special characters

## Error Handling

1. **Common Error Responses**:
   ```json
   {
     "error": {
       "code": "INVALID_QUERY",
       "message": "Search query must be at least 2 characters",
       "details": {}
     }
   }
   ```

2. **Error Types**:
   - `INVALID_QUERY`: Malformed or too short query
   - `INVALID_FILTER`: Invalid filter parameter
   - `UNAUTHORIZED`: Authentication required
   - `FORBIDDEN`: Insufficient permissions
   - `RATE_LIMITED`: Too many requests
   - `INTERNAL_ERROR`: Server-side error

## Future Extensions

1. **Advanced Features**:
   - Fuzzy matching for typo tolerance
   - Phonetic matching for name searches
   - Semantic search with NLP processing
   - Search history and saved searches

2. **Additional Entity Types**:
   - Support for repair tickets, orders, invoices
   - Activity logs and event searches
   - Document content search

## Testing Strategy

1. **Unit Tests**:
   - Test each entity adapter separately
   - Validate scoring and ranking logic
   - Test filter application

2. **Integration Tests**:
   - Verify cross-entity search results
   - Test pagination and filtering
   - Validate "create new" suggestion logic

3. **Performance Tests**:
   - Measure response times under various loads
   - Test with large datasets (>100k records)
   - Verify memory usage during complex searches