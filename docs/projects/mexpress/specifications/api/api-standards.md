# mExpress API Standards

## Metadata
- Version: 1.0.0
- Last Updated: 2025-02-15
- Status: APPROVED
- Author: ARCHITECT Agent
- Reviewers: CODE, QA

## Table of Contents
1. [Overview](#overview)
2. [API Structure](#api-structure)
3. [Request Standards](#request-standards)
4. [Response Standards](#response-standards)
5. [Validation Standards](#validation-standards)
6. [Versioning](#versioning)
7. [Documentation](#documentation)
8. [Security](#security)
9. [Testing](#testing)
10. [Monitoring](#monitoring)

## Overview
This document defines the API standards for the mExpress framework, ensuring consistency, reliability, and maintainability across all API endpoints.

## API Structure

### URL Structure
```text
/api/v1/[resource]/[identifier]/[sub-resource]

Examples:
GET    /api/v1/customers          # List customers
POST   /api/v1/customers          # Create customer
GET    /api/v1/customers/:id      # Get specific customer
PUT    /api/v1/customers/:id      # Update customer
DELETE /api/v1/customers/:id      # Delete customer
```

### Resource Naming Conventions
1. **Resources**
   - Use plural nouns: `customers`, `orders`
   - Use kebab-case: `order-items`
   - Use descriptive verbs: `/customers/:id/activate`

2. **Parameters**
   - Use camelCase for parameters
   - Use descriptive names
   - Include type in name when necessary

## Request Standards

### HTTP Methods
```javascript
GET:    // Retrieve resources
POST:   // Create new resources
PUT:    // Update entire resources
PATCH:  // Partial updates
DELETE: // Remove resources
```

### Request Headers
```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer [token]",
  "Accept": "application/json",
  "X-Request-ID": "unique-request-id"
}
```

### Query Parameters
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

## Response Standards

### Success Response Format
```javascript
{
  "status": "success",
  "data": {
    // Resource data
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

### Error Response Format
```javascript
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Human readable message",
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

### HTTP Status Codes
```javascript
200: OK              // Successful GET, PUT, PATCH
201: Created         // Successful POST
204: No Content      // Successful DELETE
400: Bad Request     // Validation errors
401: Unauthorized    // Authentication failed
403: Forbidden       // Authorization failed
404: Not Found       // Resource not found
409: Conflict        // Resource conflict
422: Unprocessable   // Business logic error
429: Too Many       // Rate limit exceeded
500: Server Error   // Internal error
```

## Validation Standards

### Input Validation
```javascript
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

### Common Validation Rules
```javascript
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

## Versioning

### Version Control
1. **URL Versioning**
   - Use URL prefix: `/api/v1/`
   - Major version for breaking changes
   - Document deprecated endpoints
   - Provide migration guides

2. **Version Lifecycle**
```javascript
const versions = {
  current: 'v1',
  supported: ['v1'],
  deprecated: [],
  sunset: {
    v1: '2026-01-01',
  },
};
```

## Documentation

### OpenAPI/Swagger Specification
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

### Endpoint Documentation
```javascript
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

## Security

### Authentication
1. **Token Requirements**
   - Bearer token required
   - Token validation middleware
   - Token refresh mechanism
   - Token expiration handling

2. **Authorization**
   - Role-based access control
   - Resource ownership validation
   - Permission middleware
   - Access level checks

### Rate Limiting
```javascript
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
```

## Testing

### API Testing Requirements
```javascript
describe('POST /api/v1/customers', () => {
  test('should create new customer', async () => {
    const response = await request(app)
      .post('/api/v1/customers')
      .send(validCustomerData);

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('id');
  });
});
```

### Coverage Requirements
1. **Test Coverage**
   - All endpoints tested
   - Success scenarios covered
   - Error scenarios covered
   - Edge cases tested

2. **Testing Types**
   - Unit tests
   - Integration tests
   - Performance tests
   - Security tests

## Monitoring

### Request Logging
```javascript
{
  timestamp: '2025-01-12T12:00:00Z',
  requestId: 'unique-id',
  method: 'POST',
  path: '/api/v1/customers',
  status: 201,
  duration: 45, // ms
  userId: 'user-id'
}
```

### Performance Metrics
1. **Key Metrics**
   - Response times
   - Error rates
   - Request volume
   - Resource usage

2. **Monitoring Requirements**
   - Real-time monitoring
   - Alert thresholds
   - Performance tracking
   - Error tracking

## References
- [Framework Introduction](../../overview/introduction.md)
- [Technical Requirements](../requirements/technical-requirements.md)
- [Architecture Decisions](../design/architecture-decisions.md)
- [Implementation Plan](../design/implementation-plan.md)

## Version History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-02-15 | ARCHITECT | Initial version based on API development standards |