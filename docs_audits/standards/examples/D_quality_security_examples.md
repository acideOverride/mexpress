# Quality and Security Implementation Examples

## Table of Contents
1. [Test Configuration Examples](#1-test-configuration-examples)
2. [Quality Metrics Examples](#2-quality-metrics-examples)
3. [Security Implementation Examples](#3-security-implementation-examples)
4. [Performance Testing Examples](#4-performance-testing-examples)
5. [Accessibility Testing Examples](#5-accessibility-testing-examples)
6. [Monitoring Examples](#6-monitoring-examples)
7. [CI/CD Examples](#7-cicd-examples)

## 1. Test Configuration Examples

### 1.1 Jest Configuration

```javascript
// jest.config.js
module.exports = {
  // Core Configuration
  silent: true, // Reduce console output
  verbose: false, // Disable verbose mode
  
  // Coverage Configuration
  coverageDirectory: 'logs', // Store in logs directory
  coverageReporters: ['text-summary'], // Use minimal reporter
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },

  // Test Environment
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Performance
  maxConcurrency: 5,
  maxWorkers: '50%'
};
```

### 1.2 Test Directory Structure

```text
/tests/
  ├── unit/              # Unit tests
  ├── integration/       # Integration tests
  ├── e2e/              # End-to-end tests
  ├── security/         # Security tests
  ├── performance/      # Performance tests
  └── accessibility/    # Accessibility tests

/logs/
  ├── test-status.log    # Basic PASS/FAIL status
  ├── test-errors.log    # Error messages only
  └── coverage-summary.log # Coverage percentages only
```

### 1.3 NPM Scripts

```json
{
  "scripts": {
    "test": "jest --silent > logs/test-status.log",
    "test:coverage": "jest --silent --coverage --coverageReporters=\"text-summary\" > logs/coverage-summary.log",
    "test:ci": "jest --silent --coverage --ci > logs/test-status.log 2> logs/test-errors.log",
    "test:security": "jest --testMatch='**/security/**/*.test.js'",
    "test:performance": "jest --testMatch='**/performance/**/*.test.js'",
    "test:accessibility": "jest --testMatch='**/accessibility/**/*.test.js'"
  }
}
```

## 2. Quality Metrics Examples

### 2.1 SonarQube Configuration

```javascript
// sonar-project.properties
sonar.projectKey=mExpress
sonar.projectName=mExpress
sonar.projectVersion=1.0.0

sonar.sources=src
sonar.tests=tests
sonar.language=ts

sonar.typescript.lcov.reportPaths=coverage/lcov.info
sonar.testExecutionReportPaths=test-report.xml

sonar.qualitygate.wait=true
```

### 2.2 ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:security/recommended'
  ],
  plugins: ['security'],
  rules: {
    'complexity': ['error', { max: 15 }],
    'max-lines': ['error', { max: 300 }],
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-unsafe-regex': 'error'
  }
};
```

## 3. Security Implementation Examples

### 3.1 Authentication Middleware

```typescript
import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      status: 'error',
      code: 'UNAUTHORIZED',
      message: 'No token provided'
    });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      code: 'INVALID_TOKEN',
      message: 'Invalid token'
    });
  }
};
```

### 3.2 CSRF Protection

```typescript
import csrf from 'csurf';
import { Request, Response, NextFunction } from 'express';

const csrfProtection = csrf({ cookie: true });

export const csrfMiddleware = [
  csrfProtection,
  (req: Request, res: Response, next: NextFunction) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
  }
];
```

## 4. Performance Testing Examples

### 4.1 Load Testing Script

```typescript
import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp up
    { duration: '3m', target: 50 },  // Stay at 50 users
    { duration: '1m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% of requests must complete below 200ms
    http_req_failed: ['rate<0.01'],   // Less than 1% can fail
  },
};

export default function() {
  const response = http.get('http://api.example.com/health');
  
  check(response, {
    'is status 200': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
```

### 4.2 Performance Monitoring

```typescript
import { PerformanceObserver } from 'perf_hooks';

const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    if (entry.duration > 100) {
      console.warn(`Slow operation detected: ${entry.name} took ${entry.duration}ms`);
    }
  });
});

obs.observe({ entryTypes: ['measure'], buffered: true });
```

## 5. Accessibility Testing Examples

### 5.1 Jest Axe Testing

```typescript
import { axe } from 'jest-axe';

describe('Accessibility Tests', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<MyComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 5.2 Cypress Accessibility Testing

```typescript
describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('should have no accessibility violations', () => {
    cy.checkA11y();
  });

  it('should navigate with keyboard', () => {
    cy.get('body').tab().tab().tab();
    cy.focused().should('have.attr', 'aria-label');
  });
});
```

## 6. Monitoring Examples

### 6.1 Prometheus Metrics

```typescript
import { Registry, Counter, Histogram } from 'prom-client';

const register = new Registry();

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
```

### 6.2 Health Check Endpoint

```typescript
import { Router } from 'express';
import { getConnection } from 'typeorm';
import { redisClient } from './redis';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    // Database check
    await getConnection().query('SELECT 1');
    
    // Redis check
    await redisClient.ping();
    
    // Memory check
    const memoryUsage = process.memoryUsage();
    const memoryThreshold = 1024 * 1024 * 1024; // 1GB
    
    if (memoryUsage.heapUsed > memoryThreshold) {
      throw new Error('Memory threshold exceeded');
    }

    res.json({
      status: 'healthy',
      checks: {
        database: 'up',
        redis: 'up',
        memory: 'ok'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});
```

## 7. CI/CD Examples

### 7.1 GitHub Actions Workflow

```yaml
name: Quality & Security Checks

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm run test:ci
        
      - name: Run security scan
        run: npm audit
        
      - name: Run SonarQube scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          
      - name: Check quality gate
        run: |
          sleep 5
          curl -u ${{ secrets.SONAR_TOKEN }}: \
            "https://sonarqube.example.com/api/qualitygates/project_status?projectKey=mExpress" \
            | jq -e '.projectStatus.status == "OK"'
```

### 7.2 Quality Gate Check Script

```typescript
import axios from 'axios';

async function checkQualityGate(projectKey: string): Promise<boolean> {
  try {
    const response = await axios.get(
      `https://sonarqube.example.com/api/qualitygates/project_status`,
      {
        params: { projectKey },
        headers: {
          Authorization: `Bearer ${process.env.SONAR_TOKEN}`
        }
      }
    );

    const status = response.data.projectStatus.status;
    if (status !== 'OK') {
      console.error('Quality gate failed:', response.data.projectStatus.conditions);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to check quality gate:', error);
    return false;
  }
}