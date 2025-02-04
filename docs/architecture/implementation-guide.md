# mExpress Implementation Guide

## 1. Development Environment Setup

### 1.1 Required Tools

- Node.js v18 or higher
- MongoDB v6.0 or higher
- Redis v7.0 or higher
- Git
- Docker and Docker Compose
- Visual Studio Code (recommended)

### 1.2 Environment Configuration

```bash
# Clone repository
git clone https://github.com/mexpress/mexpress.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development environment
docker-compose up -d
```

## 2. Project Structure

### 2.1 Directory Layout

```
mexpress/
├── src/
│   ├── api/           # API routes and controllers
│   ├── services/      # Business logic
│   ├── models/        # Database models
│   ├── middleware/    # Express middleware
│   ├── utils/         # Utility functions
│   └── config/        # Configuration files
├── tests/
│   ├── unit/         # Unit tests
│   ├── integration/  # Integration tests
│   └── e2e/          # End-to-end tests
├── docs/             # Documentation
└── scripts/          # Build and deployment scripts
```

### 2.2 Key Files

- `src/index.ts` - Application entry point
- `src/app.ts` - Express application setup
- `src/config/index.ts` - Configuration management
- `src/api/routes/index.ts` - API route definitions

## 3. Coding Standards

### 3.1 TypeScript Guidelines

- Use strict type checking
- Prefer interfaces over types
- Document public APIs
- Use enums for constants
- Implement error handling

Example:

```typescript
interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

enum OrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

class OrderService {
  /**
   * Creates a new order in the system
   * @param data Order creation data
   * @returns Created order
   * @throws ValidationError if data is invalid
   */
  async createOrder(data: CreateOrderDTO): Promise<Order> {
    try {
      // Implementation
    } catch (error) {
      throw new ValidationError('Invalid order data');
    }
  }
}
```

### 3.2 Code Style

- Use ESLint and Prettier
- Follow naming conventions
- Write meaningful comments
- Keep functions small and focused
- Use dependency injection

## 4. API Implementation

### 4.1 Route Handler Template

```typescript
import { Router } from 'express';
import { validateRequest } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post(
  '/endpoint',
  authenticate,
  validateRequest(schema),
  async (req, res, next) => {
    try {
      const result = await service.method(req.body);
      res.json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
```

### 4.2 Error Handling

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string
  ) {
    super(message);
  }
}

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      code: error.code,
      message: error.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    code: 'INTERNAL_ERROR',
    message: 'Internal server error',
  });
};
```

## 5. Database Operations

### 5.1 MongoDB Best Practices

- Use Mongoose for schema validation
- Implement proper indexing
- Use transactions when needed
- Handle connection errors
- Implement retry logic

Example:

```typescript
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

orderSchema.index({ customerId: 1, status: 1 });
```

### 5.2 Redis Caching

```typescript
import { createClient } from 'redis';

const cache = createClient();

const getCachedData = async (key: string) => {
  const cached = await cache.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  return null;
};

const setCachedData = async (key: string, data: any, ttl: number = 3600) => {
  await cache.set(key, JSON.stringify(data), 'EX', ttl);
};
```

## 6. Integration Implementation

### 6.1 External Service Integration

```typescript
import axios from 'axios';

class PrestaShopService {
  private client: axios.AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.PRESTASHOP_API_URL,
      headers: {
        Authorization: `Bearer ${process.env.PRESTASHOP_API_KEY}`,
      },
    });
  }

  async syncProduct(product: Product) {
    try {
      await this.client.post('/products', product);
    } catch (error) {
      throw new IntegrationError('PrestaShop sync failed');
    }
  }
}
```

### 6.2 Webhook Handling

```typescript
const handleWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['x-webhook-signature'];
  if (!verifySignature(signature, req.body)) {
    throw new SecurityError('Invalid webhook signature');
  }

  await processWebhookEvent(req.body);
  res.status(200).send();
};
```

## 7. Testing Guidelines

### 7.1 Unit Testing

```typescript
import { describe, it, expect } from 'jest';

describe('OrderService', () => {
  it('should create an order', async () => {
    const service = new OrderService(mockRepo);
    const order = await service.createOrder(mockData);
    expect(order).toHaveProperty('id');
    expect(order.status).toBe(OrderStatus.PENDING);
  });
});
```

### 7.2 Integration Testing

```typescript
import request from 'supertest';
import app from '../src/app';

describe('Order API', () => {
  it('should create an order', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send(mockOrderData)
      .expect(201);

    expect(response.body.data).toHaveProperty('id');
  });
});
```

## 8. Security Implementation

### 8.1 Authentication

```typescript
import jwt from 'jsonwebtoken';

const generateToken = (user: User): string => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
```

### 8.2 Authorization

```typescript
const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user.permissions.includes(permission)) {
      throw new AuthorizationError('Insufficient permissions');
    }
    next();
  };
};
```

## 9. Deployment Process

### 9.1 Build Process

```bash
# Install dependencies
npm ci

# Run tests
npm test

# Build TypeScript
npm run build

# Create Docker image
docker build -t mexpress:latest .
```

### 9.2 Deployment Steps

1. Build application
2. Run tests
3. Create Docker image
4. Push to registry
5. Deploy to environment
6. Run migrations
7. Verify deployment

## 10. Monitoring Implementation

### 10.1 Health Checks

```typescript
const healthCheck = async () => {
  const dbHealth = await checkDatabase();
  const cacheHealth = await checkRedis();
  const integrationHealth = await checkIntegrations();

  return {
    status: 'healthy',
    checks: {
      database: dbHealth,
      cache: cacheHealth,
      integrations: integrationHealth,
    },
  };
};
```

### 10.2 Logging

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

This implementation guide provides the foundation for developing the mExpress system. Follow these guidelines to ensure consistent and maintainable code across the project.
