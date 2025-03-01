# API Implementation Examples

## Table of Contents
1. [API Structure Examples](#1-api-structure-examples)
2. [Request/Response Examples](#2-requestresponse-examples)
3. [Validation Examples](#3-validation-examples)
4. [Versioning Examples](#4-versioning-examples)
5. [Documentation Examples](#5-documentation-examples)
6. [Security Examples](#6-security-examples)
7. [Testing Examples](#7-testing-examples)
8. [Monitoring Examples](#8-monitoring-examples)

## 1. API Structure Examples

### 1.1 URL Structure Examples

```text
/api/v1/[resource]/[identifier]/[sub-resource]

Examples:
GET    /api/v1/customers          # List customers
POST   /api/v1/customers          # Create customer
GET    /api/v1/customers/:id      # Get specific customer
PUT    /api/v1/customers/:id      # Update customer
DELETE /api/v1/customers/:id      # Delete customer
GET    /api/v1/customers/:id/orders # List customer orders
```

### 1.2 Controller Implementation

```typescript
@Controller('/api/v1/customers')
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @Get()
  async findAll(
    @Query() query: FindAllDto
  ): Promise<CustomerResponse[]> {
    try {
      return await this.service.findAll(query);
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() data: CreateCustomerDto
  ): Promise<CustomerResponse> {
    try {
      return await this.service.create(data);
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
```

## 2. Request/Response Examples

### 2.1 Request Headers Example

```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer [token]",
  "Accept": "application/json",
  "X-Request-ID": "unique-request-id"
}
```

### 2.2 Query Parameters Example

```javascript
// Pagination
?page=1&limit=10

// Filtering
?status=active&type=premium

// Sorting
?sort=createdAt:desc

// Field selection
?fields=id,name,email
```

### 2.3 Success Response Example

```javascript
{
  "status": "success",
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100
    }
  }
}
```

### 2.4 Error Response Example

```javascript
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "requestId": "unique-request-id",
  "timestamp": "2025-01-12T12:00:00Z"
}
```

## 3. Validation Examples

### 3.1 Input Validation Example

```typescript
const validateCustomer = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .description('Customer email address'),
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .description('Customer full name'),
    phone: Joi.string()
      .pattern(/^\+?[\d\s-]{10,}$/)
      .description('Customer phone number'),
  }),
};
```

### 3.2 Common Validation Rules

```typescript
const commonRules = {
  id: Joi.string().uuid(),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^\+?[\d\s-]{10,}$/),
  password: Joi.string().min(8).max(100),
  date: Joi.date().iso(),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100),
};
```

## 4. Versioning Examples

### 4.1 Version Configuration

```typescript
const versions = {
  current: 'v1',
  supported: ['v1'],
  deprecated: [],
  sunset: {
    v1: '2026-01-01',
  },
};
```

### 4.2 Version Header Example

```typescript
@Controller({
  path: 'customers',
  version: '1'
})
export class CustomerController {
  @Get()
  @Version('1')
  findAll() {
    // v1 implementation
  }

  @Get()
  @Version('2')
  findAllV2() {
    // v2 implementation
  }
}
```

## 5. Documentation Examples

### 5.1 OpenAPI/Swagger Example

```yaml
openapi: 3.0.0
info:
  title: mExpress API
  version: 1.0.0
paths:
  /customers:
    post:
      summary: Create new customer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Customer'
      responses:
        201:
          description: Customer created successfully
```

### 5.2 JSDoc Example

```typescript
/**
 * @api {post} /api/v1/customers Create Customer
 * @apiVersion 1.0.0
 * @apiName CreateCustomer
 * @apiGroup Customer
 *
 * @apiParam {String} email Customer email
 * @apiParam {String} name Customer full name
 * @apiParam {String} [phone] Customer phone number
 *
 * @apiSuccess {String} id Customer unique ID
 * @apiSuccess {String} email Customer email
 * @apiSuccess {String} name Customer name
 *
 * @apiError (400) {Object} ValidationError Invalid input data
 * @apiError (409) {Object} ConflictError Email already exists
 */
```

## 6. Security Examples

### 6.1 Authentication Middleware

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

### 6.2 Rate Limiting Example

```typescript
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests, please try again later.'
  }
});
```

## 7. Testing Examples

### 7.1 API Test Example

```typescript
describe('POST /api/v1/customers', () => {
  test('should create new customer', async () => {
    const response = await request(app)
      .post('/api/v1/customers')
      .send(validCustomerData);

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('id');
  });

  test('should handle validation errors', async () => {
    const response = await request(app)
      .post('/api/v1/customers')
      .send(invalidCustomerData);

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('VALIDATION_ERROR');
  });
});
```

### 7.2 Load Test Example

```typescript
import { check } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp up
    { duration: '5m', target: 50 },  // Stay at 50 users
    { duration: '1m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% of requests must complete below 200ms
    http_req_failed: ['rate<0.01'],   // Less than 1% can fail
  },
};

export default function() {
  const response = http.get('http://api.example.com/customers');
  check(response, {
    'is status 200': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 200,
  });
}
```

## 8. Monitoring Examples

### 8.1 Request Logging Example

```typescript
{
  timestamp: '2025-01-12T12:00:00Z',
  requestId: 'unique-id',
  method: 'POST',
  path: '/api/v1/customers',
  status: 201,
  duration: 45, // ms
  userId: 'user-id',
  userAgent: 'Mozilla/5.0...',
  ip: '192.168.1.1',
  errorCode: null,
  errorMessage: null
}
```

### 8.2 Metrics Collection Example

```typescript
@Injectable()
export class MetricsService {
  private readonly registry: Registry;
  private readonly httpRequestDuration: Histogram;
  private readonly httpRequestTotal: Counter;

  constructor() {
    this.registry = new Registry();
    
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
    });

    this.httpRequestTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status']
    });

    this.registry.registerMetric(this.httpRequestDuration);
    this.registry.registerMetric(this.httpRequestTotal);
  }

  recordMetrics(method: string, route: string, status: number, duration: number) {
    this.httpRequestDuration
      .labels(method, route, status.toString())
      .observe(duration);
    
    this.httpRequestTotal
      .labels(method, route, status.toString())
      .inc();
  }
}