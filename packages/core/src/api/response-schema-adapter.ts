/**
 * ResponseSchemaAdapter provides version-aware schema adaptation for API responses
 * Handles changes in API response formats while maintaining backward compatibility
 */
export class ResponseSchemaAdapter {
  private schemaVersions: Map<string, Map<string, SchemaVersionDefinition>>;
  private negotiationStrategies: Map<string, VersionNegotiationStrategy>;

  constructor() {
    this.schemaVersions = new Map();
    this.negotiationStrategies = new Map();
    
    // Register default negotiation strategies
    this.registerNegotiationStrategy('latest', latestVersionStrategy);
    this.registerNegotiationStrategy('oldest', oldestVersionStrategy);
    this.registerNegotiationStrategy('compatible', compatibleVersionStrategy);
  }

  /**
   * Register a schema version for a specific API
   * @param apiName The name of the API
   * @param version The version string
   * @param definition The schema definition
   */
  public registerSchemaVersion(
    apiName: string, 
    version: string, 
    definition: SchemaVersionDefinition
  ): void {
    if (!this.schemaVersions.has(apiName)) {
      this.schemaVersions.set(apiName, new Map());
    }
    
    const apiVersions = this.schemaVersions.get(apiName)!;
    apiVersions.set(version, definition);
  }

  /**
   * Register a version negotiation strategy
   * @param name The strategy name
   * @param strategy The strategy function
   */
  public registerNegotiationStrategy(
    name: string, 
    strategy: VersionNegotiationStrategy
  ): void {
    this.negotiationStrategies.set(name, strategy);
  }

  /**
   * Adapt a response to the desired schema version
   * @param apiName The name of the API
   * @param response The raw API response to adapt
   * @param targetVersion The desired target version (optional)
   * @param strategyName The negotiation strategy to use (default: 'compatible')
   */
  public adaptResponse<T = any>(
    apiName: string,
    response: any,
    targetVersion?: string,
    strategyName: string = 'compatible'
  ): T {
    const apiVersions = this.schemaVersions.get(apiName);
    if (!apiVersions || apiVersions.size === 0) {
      // If no schema registered, return response as-is
      return response as T;
    }

    // Auto-detect the response version
    const detectedVersion = this.detectResponseVersion(apiName, response);
    if (!detectedVersion) {
      // If we can't detect the version, return as-is
      return response as T;
    }

    // If target version is not specified, negotiate the best version
    const finalTargetVersion = targetVersion || this.negotiateVersion(
      apiName,
      detectedVersion,
      strategyName
    );

    // If source and target versions are the same, return as-is
    if (detectedVersion === finalTargetVersion) {
      return response as T;
    }

    // Get the adapters for source and target versions
    const sourceDefinition = apiVersions.get(detectedVersion)!;
    const targetDefinition = apiVersions.get(finalTargetVersion);

    if (!targetDefinition) {
      // Target version not found, return as-is
      return response as T;
    }

    // Use schema definitions to transform the response
    const normalizedResponse = sourceDefinition.fromResponse(response);
    return targetDefinition.toResponse(normalizedResponse) as T;
  }

  /**
   * Detect the version of an API response
   * @param apiName The name of the API
   * @param response The response to detect version for
   * @returns The detected version or undefined
   */
  private detectResponseVersion(apiName: string, response: any): string | undefined {
    const apiVersions = this.schemaVersions.get(apiName);
    if (!apiVersions) {
      return undefined;
    }

    // Try each version's isMatch function to detect the version
    for (const [version, definition] of apiVersions.entries()) {
      if (definition.isMatch && definition.isMatch(response)) {
        return version;
      }
    }

    // Check for explicit version information in the response
    if (response && typeof response === 'object') {
      // Check common version fields
      if (response.apiVersion) return response.apiVersion;
      if (response.version) return response.version;
      if (response.schemaVersion) return response.schemaVersion;
      
      // Check headers for version info
      if (response.headers) {
        const headers = response.headers;
        if (headers['api-version']) return headers['api-version'];
        if (headers['x-api-version']) return headers['x-api-version'];
      }
    }

    // Default to newest registered version
    const versions = [...apiVersions.keys()].sort();
    return versions.length > 0 ? versions[versions.length - 1] : undefined;
  }

  /**
   * Negotiate the best version to use
   * @param apiName The name of the API
   * @param detectedVersion The detected version
   * @param strategyName The negotiation strategy to use
   * @returns The negotiated version
   */
  private negotiateVersion(
    apiName: string,
    detectedVersion: string,
    strategyName: string
  ): string {
    const apiVersions = this.schemaVersions.get(apiName);
    if (!apiVersions || apiVersions.size <= 1) {
      return detectedVersion;
    }

    const strategy = this.negotiationStrategies.get(strategyName) || compatibleVersionStrategy;
    const versions = [...apiVersions.keys()];
    
    return strategy(versions, detectedVersion) || detectedVersion;
  }
}

/**
 * Schema version definition interface
 */
export interface SchemaVersionDefinition {
  /**
   * Function to check if a response matches this schema version
   */
  isMatch?: (response: any) => boolean;
  
  /**
   * Transform from the API response to a normalized internal format
   */
  fromResponse: (response: any) => any;
  
  /**
   * Transform from normalized internal format to the API response format
   */
  toResponse: (normalized: any) => any;
}

/**
 * Version negotiation strategy
 * @param versions Available versions
 * @param current Current version
 * @returns The negotiated version
 */
export type VersionNegotiationStrategy = (versions: string[], current: string) => string | undefined;

/**
 * Strategy to use the latest available version
 */
export const latestVersionStrategy: VersionNegotiationStrategy = (versions, current) => {
  if (versions.length === 0) return current;
  return versions.sort()[versions.length - 1];
};

/**
 * Strategy to use the oldest available version
 */
export const oldestVersionStrategy: VersionNegotiationStrategy = (versions, current) => {
  if (versions.length === 0) return current;
  return versions.sort()[0];
};

/**
 * Strategy to use the closest compatible version
 */
export const compatibleVersionStrategy: VersionNegotiationStrategy = (versions, current) => {
  if (versions.length === 0) return current;
  
  // Parse semantic versions (if applicable)
  try {
    const currentParts = current.split('.').map(Number);
    
    // Find versions with same major version (assuming semver)
    const compatibleVersions = versions.filter(v => {
      const parts = v.split('.').map(Number);
      return parts[0] === currentParts[0];
    });
    
    if (compatibleVersions.length > 0) {
      // Return the latest compatible version
      return compatibleVersions.sort()[compatibleVersions.length - 1];
    }
  } catch (e) {
    // Not semver, fallback to exact match
  }
  
  // Fallback to exact match or latest
  return versions.includes(current) ? current : latestVersionStrategy(versions, current);
};