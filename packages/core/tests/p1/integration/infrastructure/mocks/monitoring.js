/**
 * Mock Monitoring System for Testing
 */

class MonitoringSystem {
  constructor() {
    this.metrics = {
      errors: {},
      calls: {},
      latency: {}
    };
  }

  /**
   * Record an error
   * @param {string} service - The service name
   * @param {string} errorCode - The error code
   */
  recordError(service, errorCode) {
    // Initialize error counts for the service if they don't exist
    if (!this.metrics.errors[service]) {
      this.metrics.errors[service] = {};
    }

    // Initialize error count for the error code if it doesn't exist
    if (!this.metrics.errors[service][errorCode]) {
      this.metrics.errors[service][errorCode] = 0;
    }

    // Increment error count
    this.metrics.errors[service][errorCode]++;
  }

  /**
   * Record an API call
   * @param {string} service - The service name
   * @param {string} endpoint - The API endpoint
   */
  recordApiCall(service, endpoint) {
    // Initialize call counts for the service if they don't exist
    if (!this.metrics.calls[service]) {
      this.metrics.calls[service] = {};
    }

    // Initialize call count for the endpoint if it doesn't exist
    if (!this.metrics.calls[service][endpoint]) {
      this.metrics.calls[service][endpoint] = 0;
    }

    // Increment call count
    this.metrics.calls[service][endpoint]++;
  }

  /**
   * Record API latency
   * @param {string} service - The service name
   * @param {string} endpoint - The API endpoint
   * @param {number} latencyMs - The latency in milliseconds
   */
  recordLatency(service, endpoint, latencyMs) {
    // Initialize latency tracking for the service if it doesn't exist
    if (!this.metrics.latency[service]) {
      this.metrics.latency[service] = {};
    }

    // Initialize latency array for the endpoint if it doesn't exist
    if (!this.metrics.latency[service][endpoint]) {
      this.metrics.latency[service][endpoint] = [];
    }

    // Record latency value
    this.metrics.latency[service][endpoint].push(latencyMs);
  }

  /**
   * Get error metrics
   * @param {string} [service] - Optional service filter
   * @returns {Object} The error metrics
   */
  getErrorMetrics(service) {
    if (service) {
      return this.metrics.errors[service] || {};
    }
    return this.metrics.errors;
  }

  /**
   * Get call metrics
   * @param {string} [service] - Optional service filter
   * @returns {Object} The call metrics
   */
  getCallMetrics(service) {
    if (service) {
      return this.metrics.calls[service] || {};
    }
    return this.metrics.calls;
  }

  /**
   * Get latency metrics
   * @param {string} [service] - Optional service filter
   * @param {string} [endpoint] - Optional endpoint filter
   * @returns {Object} The latency metrics
   */
  getLatencyMetrics(service, endpoint) {
    if (service && endpoint) {
      return this.metrics.latency[service]?.[endpoint] || [];
    } else if (service) {
      return this.metrics.latency[service] || {};
    }
    return this.metrics.latency;
  }

  /**
   * Reset all metrics
   */
  resetMetrics() {
    this.metrics = {
      errors: {},
      calls: {},
      latency: {}
    };
  }
}

module.exports = { MonitoringSystem };