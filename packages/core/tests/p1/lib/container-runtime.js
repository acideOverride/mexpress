/**
 * Mock Container Runtime Implementation
 */

class ContainerRuntime {
  constructor(config) {
    this.config = config || {
      runtimeName: 'mExpress-test-runtime',
      cacheEnabled: true,
      maxCacheSize: 1024 * 1024 * 1024 // 1GB
    };
    this.initialized = false;
    this.cacheSetup = false;
    this.cacheStats = {
      hits: 0,
      misses: 0,
      size: 0
    };
    this.firstBuild = true;
  }

  async initialize() {
    this.initialized = true;
    return undefined;
  }

  async setupCache() {
    if (!this.initialized) {
      throw new Error('Container runtime not initialized');
    }
    
    this.cacheSetup = true;
    return undefined;
  }

  async listImages() {
    if (!this.initialized) {
      throw new Error('Container runtime not initialized');
    }
    
    return [];
  }

  async getCacheStats() {
    if (!this.initialized) {
      throw new Error('Container runtime not initialized');
    }
    
    if (this.firstBuild) {
      this.firstBuild = false;
      return { hits: 0, misses: 1, size: 0 };
    }
    
    return { hits: 1, misses: 0, size: 100 };
  }
}

module.exports = {
  ContainerRuntime
};