/**
 * Mock Service Mesh Implementation
 */

class ServiceMesh {
  constructor(options) {
    this.validateOptions(options);
    this.name = options.name;
    this.namespace = options.namespace;
    this.ingress = options.ingress;
    
    this.proxies = [];
    this.routes = [];
    this.policies = [];
    
    if (options.proxies) {
      options.proxies.forEach(proxy => this.addProxy(proxy));
    }
    
    if (options.routes) {
      options.routes.forEach(route => this.addRoute(route));
    }
    
    if (options.policies) {
      options.policies.forEach(policy => this.addPolicy(policy));
    }

    this.metrics = options.metrics;
    this.discovery = options.discovery;
  }

  validateOptions(options) {
    if (!options.name || !options.namespace) {
      throw new Error('Invalid service mesh configuration');
    }
  }

  addProxy(proxy) {
    this.validateProxy(proxy);
    this.proxies.push(proxy);
  }

  validateProxy(proxy) {
    if (!proxy.name || proxy.port < 1 || !['http', 'grpc', 'tcp'].includes(proxy.protocol) ||
        proxy.timeout < 1 || proxy.retries < 0) {
      throw new Error('Invalid proxy configuration');
    }

    if (proxy.circuitBreaker && proxy.circuitBreaker.enabled) {
      const cb = proxy.circuitBreaker;
      if (cb.threshold <= 0 || cb.threshold > 1 || cb.interval < 1 || cb.timeout < 1) {
        throw new Error('Invalid proxy configuration');
      }
    }
  }

  addRoute(route) {
    this.validateRoute(route);
    this.routes.push(route);
  }

  validateRoute(route) {
    if (!route.name || !route.path || !route.service ||
        !['GET', 'POST', 'PUT', 'DELETE', 'PATCH', '*'].includes(route.method) ||
        route.timeout < 1 || route.retries < 0) {
      throw new Error('Invalid route configuration');
    }

    if (!['round-robin', 'least-conn', 'random'].includes(route.loadBalancer.type)) {
      throw new Error('Invalid route configuration');
    }
  }

  addPolicy(policy) {
    this.validatePolicy(policy);
    this.policies.push(policy);
  }

  validatePolicy(policy) {
    if (!policy.name || 
        !['rate-limit', 'circuit-breaker', 'retry', 'timeout'].includes(policy.type) ||
        !['global', 'service', 'route'].includes(policy.scope)) {
      throw new Error('Invalid policy configuration');
    }

    if (policy.type === 'rate-limit' && policy.config.rateLimit) {
      const rl = policy.config.rateLimit;
      if (rl.requests < 1 || rl.interval < 1 || (rl.burst !== undefined && rl.burst < 0)) {
        throw new Error('Invalid policy configuration');
      }
    }
  }

  updateMetrics(metrics) {
    this.validateMetrics(metrics);
    this.metrics = {
      ...this.metrics,
      ...metrics
    };
  }

  validateMetrics(metrics) {
    if (metrics.interval !== undefined && metrics.interval < 1) {
      throw new Error('Invalid metrics configuration');
    }

    if (metrics.retention !== undefined && metrics.retention < 1) {
      throw new Error('Invalid metrics configuration');
    }

    if (metrics.exporters?.prometheus?.port !== undefined && metrics.exporters.prometheus.port < 1) {
      throw new Error('Invalid metrics configuration');
    }
  }

  updateDiscovery(discovery) {
    this.validateDiscovery(discovery);
    this.discovery = discovery;
  }

  validateDiscovery(discovery) {
    if (!discovery) return;

    if (!['kubernetes', 'consul', 'static'].includes(discovery.type || '') ||
        (discovery.interval !== undefined && discovery.interval < 1) ||
        (discovery.ttl !== undefined && discovery.ttl < 1)) {
      throw new Error('Invalid discovery configuration');
    }
  }

  getMeshConfig() {
    const ingressConfig = {
      enabled: this.ingress?.enabled ?? false,
      port: this.ingress?.port ?? 8080
    };

    // Only include TLS if it's fully configured
    if (this.ingress?.tls?.enabled && this.ingress.tls.certFile && this.ingress.tls.keyFile) {
      ingressConfig.tls = {
        enabled: true,
        certFile: this.ingress.tls.certFile,
        keyFile: this.ingress.tls.keyFile
      };
    }

    return {
      apiVersion: 'v1',
      kind: 'ServiceMeshConfiguration',
      metadata: {
        name: this.name,
        namespace: this.namespace
      },
      spec: {
        ingress: ingressConfig,
        proxies: this.proxies,
        routes: this.routes,
        policies: this.policies,
        metrics: {
          enabled: this.metrics?.enabled ?? true,
          interval: this.metrics?.interval ?? 15,
          retention: this.metrics?.retention ?? 86400,
          exporters: this.metrics?.exporters ?? {
            prometheus: {
              enabled: true,
              port: 9090
            }
          }
        },
        discovery: {
          enabled: this.discovery?.enabled ?? true,
          type: this.discovery?.type ?? 'kubernetes',
          interval: this.discovery?.interval ?? 30,
          ttl: this.discovery?.ttl ?? 300
        }
      }
    };
  }
  
  // Compatibility methods with original implementation
  async initialize() {
    return undefined;
  }

  async getServiceConfig(serviceName) {
    return {
      service: serviceName,
      routing: { destinations: [] },
      security: { tls: true, mtls: true, policies: [] }
    };
  }

  async getTrafficRouting(serviceName) {
    return {
      destinations: [{ version: 'v1', weight: 100 }]
    };
  }
}

module.exports = {
  ServiceMesh
};