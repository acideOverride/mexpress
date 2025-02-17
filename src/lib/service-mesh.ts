import { ServiceMeshConfig, ServiceMeshConfigOptions, ServiceMeshProxy, ServiceMeshRoute, ServiceMeshPolicy, ServiceMeshMetrics } from '../types/service-mesh-config';

export class ServiceMesh {
  private name: string;
  private namespace: string;
  private ingress?: ServiceMeshConfigOptions['ingress'];
  private proxies: ServiceMeshProxy[] = [];
  private routes: ServiceMeshRoute[] = [];
  private policies: ServiceMeshPolicy[] = [];
  private metrics?: ServiceMeshConfigOptions['metrics'];
  private discovery?: ServiceMeshConfigOptions['discovery'];

  constructor(options: ServiceMeshConfigOptions) {
    this.validateOptions(options);
    this.name = options.name;
    this.namespace = options.namespace;
    this.ingress = options.ingress;
    
    if (options.proxies) {
      options.proxies.forEach(proxy => this.addProxy(proxy as ServiceMeshProxy));
    }
    
    if (options.routes) {
      options.routes.forEach(route => this.addRoute(route as ServiceMeshRoute));
    }
    
    if (options.policies) {
      options.policies.forEach(policy => this.addPolicy(policy as ServiceMeshPolicy));
    }

    this.metrics = options.metrics;
    this.discovery = options.discovery;
  }

  private validateOptions(options: ServiceMeshConfigOptions): void {
    if (!options.name || !options.namespace) {
      throw new Error('Invalid service mesh configuration');
    }
  }

  public addProxy(proxy: ServiceMeshProxy): void {
    this.validateProxy(proxy);
    this.proxies.push(proxy);
  }

  private validateProxy(proxy: ServiceMeshProxy): void {
    if (!proxy.name || proxy.port < 1 || !['http', 'grpc', 'tcp'].includes(proxy.protocol) ||
        proxy.timeout < 1 || proxy.retries < 0) {
      throw new Error('Invalid proxy configuration');
    }

    if (proxy.circuitBreaker.enabled) {
      const cb = proxy.circuitBreaker;
      if (cb.threshold <= 0 || cb.threshold > 1 || cb.interval < 1 || cb.timeout < 1) {
        throw new Error('Invalid proxy configuration');
      }
    }
  }

  public addRoute(route: ServiceMeshRoute): void {
    this.validateRoute(route);
    this.routes.push(route);
  }

  private validateRoute(route: ServiceMeshRoute): void {
    if (!route.name || !route.path || !route.service ||
        !['GET', 'POST', 'PUT', 'DELETE', 'PATCH', '*'].includes(route.method) ||
        route.timeout < 1 || route.retries < 0) {
      throw new Error('Invalid route configuration');
    }

    if (!['round-robin', 'least-conn', 'random'].includes(route.loadBalancer.type)) {
      throw new Error('Invalid route configuration');
    }
  }

  public addPolicy(policy: ServiceMeshPolicy): void {
    this.validatePolicy(policy);
    this.policies.push(policy);
  }

  private validatePolicy(policy: ServiceMeshPolicy): void {
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

  public updateMetrics(metrics: Partial<ServiceMeshMetrics>): void {
    this.validateMetrics(metrics);
    this.metrics = {
      ...this.metrics,
      ...metrics
    };
  }

  private validateMetrics(metrics: Partial<ServiceMeshMetrics>): void {
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

  public updateDiscovery(discovery: ServiceMeshConfigOptions['discovery']): void {
    this.validateDiscovery(discovery);
    this.discovery = discovery;
  }

  private validateDiscovery(discovery: ServiceMeshConfigOptions['discovery']): void {
    if (!discovery) return;

    if (!['kubernetes', 'consul', 'static'].includes(discovery.type || '') ||
        (discovery.interval !== undefined && discovery.interval < 1) ||
        (discovery.ttl !== undefined && discovery.ttl < 1)) {
      throw new Error('Invalid discovery configuration');
    }
  }

  public getMeshConfig(): ServiceMeshConfig {
    const ingressConfig = {
      enabled: this.ingress?.enabled ?? false,
      port: this.ingress?.port ?? 8080
    };

    // Only include TLS if it's fully configured
    if (this.ingress?.tls?.enabled && this.ingress.tls.certFile && this.ingress.tls.keyFile) {
      (ingressConfig as any).tls = {
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
}