A. PROJECT FOUNDATION

# foundation

I. FILESYSTEM STRUCTURE (Linux FHS standard)
[⬆ Back to Top](#table-of-contents)

# filesystem structure

1. Application Layout
   a. Root Directory (/opt/mexpress/)

   - backend/ # Backend application code
   - frontend/ # Frontend application code
   - scripts/ # Deployment and maintenance scripts

   b. Variable Data (/var/lib/mexpress/)

   - uploads/ # User uploaded files
   - temp/ # Temporary processing files
   - cache/ # Application cache

   c. Logs (/var/log/mexpress/)

   - access.log # HTTP access logs
   - error.log # Application error logs
   - audit.log # Security audit logs
   - debug.log # Debug information

   d. Configuration (/etc/mexpress/)

   - ssl/ # SSL certificates
   - nginx/ # Nginx configuration
   - env/ # Environment configurations

# project overview

2. Access Control
   a. Directory Ownership

   - /opt/mexpress: $USER:$USER
   - /var/lib/mexpress: www-data:www-data
   - /var/log/mexpress: www-data:www-data

   b. Permission Sets

   - Application directories: 755
   - Log directories: 744
   - Upload directories: 755
   - Config files: 644

3. System Links
   a. Symbolic Links

   - logs -> /var/log/mexpress
   - uploads -> /var/lib/mexpress/uploads

4. Backup Structure
   a. Backup Directory (/var/backups/mexpress/)

   - daily/ # Daily backups
   - weekly/ # Weekly backups
   - monthly/ # Monthly backups

5. Setup Commands

   # Create directory structure

   sudo mkdir -p /opt/mexpress/{backend,frontend,scripts}
   sudo mkdir -p /var/lib/mexpress/{uploads,temp,cache}
   sudo mkdir -p /var/log/mexpress
   sudo mkdir -p /etc/mexpress/{ssl,nginx,env}
   sudo mkdir -p /var/backups/mexpress/{daily,weekly,monthly}

   # Set permissions

   sudo chown -R $USER:$USER /opt/mexpress
   sudo chown -R www-data:www-data /var/lib/mexpress
   sudo chown -R www-data:www-data /var/log/mexpress

   # Create symbolic links

   ln -s /var/log/mexpress /opt/mexpress/logs
   ln -s /var/lib/mexpress/uploads /opt/mexpress/uploads

III. ENVIRONMENTS
[⬆ Back to Top](#table-of-contents)

# environments

A. Environment Configuration

1.  Base Configuration:

```typescript
// config/environment.ts
interface EnvironmentConfig {
  app: {
    name: string;
    version: string;
    port: number;
    apiUrl: string;
    corsOrigins: string[];
  };
  database: {
    uri: string;
    poolSize: number;
    retryWrites: boolean;
  };
  cache: {
    host: string;
    port: number;
    ttl: number;
  };
  security: {
    jwtSecret: string;
    jwtExpiry: string;
    bcryptRounds: number;
  };
}

// Base configuration implementation
const getEnvironmentConfig = (env: string): EnvironmentConfig => {
  const baseConfig: EnvironmentConfig = {
    app: {
      name: 'mExpress',
      version: process.env.npm_package_version || '1.0.0',
      port: parseInt(process.env.PORT || '3000', 10),
      apiUrl: process.env.API_URL || 'http://localhost:3000',
      corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['*'],
    },
    database: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mexpress',
      poolSize: parseInt(process.env.DB_POOL_SIZE || '10', 10),
      retryWrites: true,
    },
    cache: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      ttl: parseInt(process.env.CACHE_TTL || '3600', 10),
    },
    security: {
      jwtSecret: process.env.JWT_SECRET || 'development-secret',
      jwtExpiry: process.env.JWT_EXPIRY || '1h',
      bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    },
  };

  return baseConfig;
};
```

B. Development Environment

1.  Development Configuration:

```typescript
// config/environments/development.ts
const developmentConfig: Partial<EnvironmentConfig> = {
  app: {
    corsOrigins: ['*'],
  },
  database: {
    uri: 'mongodb://localhost:27017/mexpress_dev',
  },
  cache: {
    ttl: 60, // Short cache for development
  },
  security: {
    jwtExpiry: '24h', // Longer token life for development
  },
};

// Development specific features
const developmentFeatures = {
  enableDebugLogs: true,
  enableSwagger: true,
  mockThirdPartyServices: true,
  disableRateLimiting: true,
  hotReload: true,
};
```

2.  Development Tools:

```typescript
// utils/development.ts
class DevelopmentTools {
  // API request logger
  static requestLogger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
  };

  // Error stack trace enhancement
  static enhanceError = (err: Error) => {
    Error.stackTraceLimit = Infinity;
    return err;
  };

  // Development-only routes
  static registerDevRoutes = (app: Express) => {
    if (process.env.NODE_ENV === 'development') {
      app.get('/dev/routes', (req, res) => {
        const routes = app._router.stack
          .filter(r => r.route)
          .map(r => ({
            path: r.route.path,
            methods: Object.keys(r.route.methods),
          }));
        res.json(routes);
      });
    }
  };
}
```

C. Staging Environment

1.  Staging Configuration:

```typescript
// config/environments/staging.ts
const stagingConfig: Partial<EnvironmentConfig> = {
  app: {
    corsOrigins: ['https://staging.mexpress.com'],
  },
  database: {
    uri: process.env.STAGING_DB_URI,
    poolSize: 20,
  },
  cache: {
    ttl: 300, // 5 minutes cache
  },
  security: {
    jwtExpiry: '2h',
  },
};

// Staging monitoring setup
const stagingMonitoring = {
  metrics: {
    enabled: true,
    interval: 60000, // 1 minute
    retention: '7d',
  },
  logging: {
    level: 'debug',
    format: 'json',
    filename: '/var/log/mexpress/staging.log',
  },
  alerts: {
    enabled: true,
    endpoints: [
      'https://alerts.mexpress.com/staging',
      'mailto:devs@mexpress.com',
    ],
  },
};
```

2.  Staging Validation:

```typescript
// utils/staging-validator.ts
class StagingValidator {
  static async validateEnvironment(): Promise<boolean> {
    const checks = [
      this.checkDatabaseConnection(),
      this.checkRedisConnection(),
      this.checkExternalServices(),
      this.checkFilePermissions(),
      this.checkCertificates(),
    ];

    try {
      const results = await Promise.all(checks);
      return results.every(result => result === true);
    } catch (error) {
      logger.error('Staging validation failed:', error);
      return false;
    }
  }

  static async checkExternalServices(): Promise<boolean> {
    const services = [
      'https://api.hiboutik.com/health',
      'https://api.brevo.com/health',
      'https://api.qonto.com/health',
    ];

    const results = await Promise.all(
      services.map(service =>
        axios
          .get(service)
          .then(() => true)
          .catch(() => false)
      )
    );

    return results.every(result => result === true);
  }
}
```

D. Production Environment

1.  Production Configuration:

```typescript
// config/environments/production.ts
const productionConfig: Partial<EnvironmentConfig> = {
  app: {
    corsOrigins: ['https://mexpress.com'],
  },
  database: {
    uri: process.env.PROD_DB_URI,
    poolSize: 50,
    retryWrites: true,
  },
  cache: {
    ttl: 3600, // 1 hour cache
    host: process.env.PROD_REDIS_HOST,
    port: parseInt(process.env.PROD_REDIS_PORT || '6379', 10),
  },
  security: {
    jwtExpiry: '1h',
    bcryptRounds: 12,
  },
};

// Production security enhancements
const productionSecurity = {
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
};
```

2.  Production Monitoring:

```typescript
// monitoring/production.ts
class ProductionMonitoring {
  private metrics: MetricsService;
  private alerts: AlertService;

  constructor() {
    this.metrics = new MetricsService({
      interval: 30000, // 30 seconds
      retention: '30d',
      alertThresholds: {
        cpu: 80, // 80% CPU usage
        memory: 85, // 85% memory usage
        disk: 90, // 90% disk usage
        errors: 50, // 50 errors per minute
      },
    });

    this.alerts = new AlertService({
      channels: ['slack', 'email', 'pager'],
      escalationPolicy: {
        level1: 'devops-team',
        level2: 'engineering-lead',
        level3: 'cto',
      },
    });
  }

  async monitorHealthMetrics(): Promise<void> {
    const metrics = await this.collectMetrics();
    await this.evaluateMetrics(metrics);
    await this.storeMetrics(metrics);
  }

  private async evaluateMetrics(metrics: SystemMetrics): Promise<void> {
    if (metrics.errorRate > 50 || metrics.responseTime > 500) {
      await this.alerts.trigger('HIGH_ERROR_RATE', metrics);
    }
  }
}
```

E. Environment Switch Utility

```typescript
// utils/environment-switcher.ts
class EnvironmentSwitcher {
  static async switchTo(
    env: 'development' | 'staging' | 'production'
  ): Promise<void> {
    // 1. Load environment-specific configuration
    const config = await this.loadConfig(env);

    // 2. Configure services
    await this.configureServices(config);

    // 3. Run environment-specific validations
    await this.validateEnvironment(env);

    // 4. Update monitoring
    await this.updateMonitoring(env);

    logger.info(`Successfully switched to ${env} environment`);
  }

  private static async validateEnvironment(env: string): Promise<void> {
    const validator =
      env === 'staging' ? new StagingValidator() : new ProductionValidator();

    const isValid = await validator.validateEnvironment();
    if (!isValid) {
      throw new Error(`Environment validation failed for ${env}`);
    }
  }
}
```

These environment configurations provide:

- Clear separation between environments
- Environment-specific security measures
- Appropriate monitoring and logging
- Validation and health checks
- Production-ready configurations
- Development tools and conveniences
- Staging environment for testing
