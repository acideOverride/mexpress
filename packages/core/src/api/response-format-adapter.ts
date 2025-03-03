/**
 * Response Format Adapter for API response compatibility
 * Handles different response format versions and schemas
 * Fixes for P2 tests - Response Format Changes
 */

/**
 * Schema version definition
 */
export interface SchemaDefinition {
  version: string;
  isMatch: (response: any) => boolean;
  transform: (response: any) => any;
}

/**
 * Response Format Adapter Options
 */
export interface ResponseFormatAdapterOptions {
  defaultVersion?: string;
  schemas?: SchemaDefinition[];
  strictMode?: boolean;
}

/**
 * ResponseFormatAdapter provides version-aware compatibility for API responses
 * Handles changing API schemas while maintaining backwards compatibility
 */
export class ResponseFormatAdapter {
  private schemas: Map<string, SchemaDefinition>;
  private defaultVersion: string | null;
  private strictMode: boolean;

  /**
   * Create a new ResponseFormatAdapter
   */
  constructor(options: ResponseFormatAdapterOptions = {}) {
    this.schemas = new Map();
    this.defaultVersion = options.defaultVersion || null;
    this.strictMode = options.strictMode ?? false;
    
    // Register initial schemas if provided
    if (options.schemas) {
      options.schemas.forEach(schema => this.registerSchema(schema));
    }
  }

  /**
   * Register a new schema definition
   */
  registerSchema(schema: SchemaDefinition): void {
    this.schemas.set(schema.version, schema);
    
    // Set as default if this is the first schema or if no default is set
    if (this.defaultVersion === null) {
      this.defaultVersion = schema.version;
    }
  }

  /**
   * Set the default schema version
   */
  setDefaultVersion(version: string): void {
    if (!this.schemas.has(version)) {
      throw new Error(`Schema version '${version}' not registered`);
    }
    this.defaultVersion = version;
  }

  /**
   * Detect schema version from response
   */
  detectVersion(response: any): string | null {
    // Try explicit version in response
    if (response && typeof response === 'object') {
      if (response.apiVersion) return response.apiVersion;
      if (response.schemaVersion) return response.schemaVersion;
      if (response.version) return response.version;
      
      // Check headers for version info
      if (response.headers) {
        const headers = response.headers;
        if (headers['api-version']) return headers['api-version'];
        if (headers['x-api-version']) return headers['x-api-version'];
      }
    }
    
    // Try matching schemas
    for (const [version, schema] of this.schemas.entries()) {
      if (schema.isMatch && schema.isMatch(response)) {
        return version;
      }
    }
    
    // Return default version if available
    return this.defaultVersion;
  }

  /**
   * Adapt response to expected format
   */
  adapt(response: any, targetVersion?: string): any {
    // Return original response if no schemas registered
    if (this.schemas.size === 0) {
      return response;
    }
    
    // Detect source version
    const sourceVersion = this.detectVersion(response);
    if (!sourceVersion) {
      if (this.strictMode) {
        throw new Error('Unable to determine response format version');
      }
      return response; // Return original response in non-strict mode
    }
    
    // Get target version (use explicit target, source version, or default)
    const finalTargetVersion = targetVersion || sourceVersion || this.defaultVersion;
    if (!finalTargetVersion) {
      if (this.strictMode) {
        throw new Error('No target version specified and no default version set');
      }
      return response; // Return original response in non-strict mode
    }
    
    // If source and target versions are the same, return response as-is
    if (sourceVersion === finalTargetVersion) {
      return response;
    }
    
    // Get source and target schemas
    const sourceSchema = this.schemas.get(sourceVersion);
    const targetSchema = this.schemas.get(finalTargetVersion);
    
    // If schemas not found, return original response
    if (!sourceSchema || !targetSchema) {
      if (this.strictMode) {
        throw new Error(`Schema not found for source version '${sourceVersion}' or target version '${finalTargetVersion}'`);
      }
      return response; // Return original response in non-strict mode
    }
    
    // Transform response using schemas
    try {
      return targetSchema.transform(sourceSchema.transform(response));
    } catch (error) {
      if (this.strictMode) {
        throw error;
      }
      // Return original response in non-strict mode
      return response;
    }
  }

  /**
   * Create adapter function for use with EnhancedApiClient
   */
  createAdapterFunction(targetVersion?: string): (response: any) => any {
    return (response: any) => this.adapt(response, targetVersion);
  }
}

/**
 * Create a schema definition for standardized API responses
 */
export function createStandardSchema(version: string, matcher?: (response: any) => boolean): SchemaDefinition {
  return {
    version,
    isMatch: matcher || ((response: any) => {
      return response && 
             typeof response === 'object' && 
             response.apiVersion === version;
    }),
    transform: (response: any) => {
      // Identity transform - standard format doesn't need transformation
      return response;
    }
  };
}

/**
 * Create a schema definition for legacy API responses
 */
export function createLegacySchema(version: string, matcher?: (response: any) => boolean): SchemaDefinition {
  return {
    version,
    isMatch: matcher || ((response: any) => {
      // Legacy responses typically don't have an apiVersion field
      // Check for common legacy response patterns
      return response && 
             typeof response === 'object' && 
             !response.apiVersion &&
             (response.status !== undefined || 
              response.result !== undefined ||
              response.success !== undefined);
    }),
    transform: (response: any) => {
      // Transform legacy format to standard format
      if (!response || typeof response !== 'object') {
        return response;
      }
      
      // Create a standardized response
      const transformed: any = {
        apiVersion: version,
        data: {}
      };
      
      // Map legacy fields to standard fields
      if (response.result) {
        transformed.data = response.result;
      } else if (response.data) {
        transformed.data = response.data;
      } else {
        // Remove special fields and treat the rest as data
        const { status, success, message, error, ...rest } = response;
        transformed.data = rest;
      }
      
      // Map status fields
      if (response.status !== undefined) {
        transformed.status = response.status;
      } else if (response.success !== undefined) {
        transformed.success = response.success;
      }
      
      // Map error/message fields
      if (response.error) {
        transformed.error = response.error;
      } else if (response.message) {
        transformed.message = response.message;
      }
      
      return transformed;
    }
  };
}