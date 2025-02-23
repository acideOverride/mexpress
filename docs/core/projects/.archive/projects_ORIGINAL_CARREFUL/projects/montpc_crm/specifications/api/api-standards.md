# MontPC CRM API Standards

## Metadata
- Version: 1.0.0
- Last Updated: 2025-02-15
- Status: APPROVED
- Author: ARCHITECT Agent
- Reviewers: CODE, QA

## Table of Contents
1. [Overview](#overview)
2. [API Structure](#api-structure)
3. [Endpoint Specifications](#endpoint-specifications)
4. [Request Standards](#request-standards)
5. [Response Standards](#response-standards)
6. [Security Standards](#security-standards)
7. [Integration Standards](#integration-standards)

## Overview
API standards and specifications for the MontPC CRM system, defining the structure, endpoints, and integration patterns for all system components.

## API Structure

### URL Structure
```text
/api/v1/[resource]/[identifier]/[sub-resource]

Examples:
GET    /api/v1/customers                # List customers
POST   /api/v1/customers                # Create customer
GET    /api/v1/customers/:id            # Get customer
PUT    /api/v1/customers/:id            # Update customer
DELETE /api/v1/customers/:id            # Delete customer
GET    /api/v1/customers/:id/devices    # List customer devices
POST   /api/v1/customers/:id/services   # Create service request
```

### Resource Naming
- Use plural nouns for resources: `customers`, `services`
- Use kebab-case for multi-word resources: `service-requests`
- Use descriptive actions: `/customers/:id/activate`
- Use sub-resources for relationships: `/customers/:id/devices`

## Endpoint Specifications

### Customer Management
```typescript
// Customer Endpoints
interface CustomerEndpoints {
  list: 'GET /api/v1/customers';
  create: 'POST /api/v1/customers';
  get: 'GET /api/v1/customers/:id';
  update: 'PUT /api/v1/customers/:id';
  delete: 'DELETE /api/v1/customers/:id';
  devices: 'GET /api/v1/customers/:id/devices';
  services: 'GET /api/v1/customers/:id/services';
}

// Customer Data
interface Customer {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  devices?: Device[];
  services?: Service[];
  createdAt: string;
  updatedAt: string;
}
```

### Service Management
```typescript
// Service Endpoints
interface ServiceEndpoints {
  list: 'GET /api/v1/services';
  create: 'POST /api/v1/services';
  get: 'GET /api/v1/services/:id';
  update: 'PUT /api/v1/services/:id';
  delete: 'DELETE /api/v1/services/:id';
  status: 'GET /api/v1/services/:id/status';
  timeline: 'GET /api/v1/services/:id/timeline';
}

// Service Data
interface Service {
  id: string;
  customerId: string;
  deviceId: string;
  type: ServiceType;
  status: ServiceStatus;
  description: string;
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}
```

### Device Management
```typescript
// Device Endpoints
interface DeviceEndpoints {
  list: 'GET /api/v1/devices';
  create: 'POST /api/v1/devices';
  get: 'GET /api/v1/devices/:id';
  update: 'PUT /api/v1/devices/:id';
  delete: 'DELETE /api/v1/devices/:id';
  history: 'GET /api/v1/devices/:id/history';
}

// Device Data
interface Device {
  id: string;
  customerId: string;
  type: DeviceType;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warranty: WarrantyInfo;
  createdAt: string;
  updatedAt: string;
}
```

## Request Standards

### Headers
```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer [token]",
  "Accept": "application/json",
  "X-Request-ID": "unique-request-id",
  "X-Client-Version": "app-version"
}
```

### Query Parameters
```javascript
// Pagination
?page=1&limit=10

// Filtering
?status=active&type=repair

// Sorting
?sort=createdAt:desc

// Field Selection
?fields=id,customer,status

// Search
?search=keyword
```

### Request Validation
```typescript
// Customer Validation
const customerValidation = {
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\+?[\d\s-]{10,}$/).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required()
};

// Service Validation
const serviceValidation = {
  deviceId: Joi.string().uuid().required(),
  type: Joi.string().valid('repair', 'maintenance').required(),
  description: Joi.string().min(10).max(500).required()
};
```

## Response Standards

### Success Response
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

### Error Response
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

## Security Standards

### Authentication
1. **JWT Authentication**
   - Token-based authentication
   - Refresh token mechanism
   - Token expiration
   - Token revocation

2. **OAuth2 Integration**
   - OAuth2 flow support
   - Social login integration
   - Token exchange
   - Scope management

### Authorization
1. **Role-Based Access**
   - Role hierarchy
   - Permission management
   - Resource ownership
   - Access control lists

2. **API Security**
   - Rate limiting
   - Request validation
   - CORS configuration
   - Security headers

## Integration Standards

### Event Integration
```typescript
interface EventIntegration {
  publish: {
    topic: string;
    event: Event;
    options: PublishOptions;
  };
  subscribe: {
    topic: string;
    handler: EventHandler;
    options: SubscribeOptions;
  };
}
```

### Service Integration
```typescript
interface ServiceIntegration {
  discovery: {
    register: ServiceRegistration;
    discover: ServiceDiscovery;
  };
  communication: {
    request: ServiceRequest;
    response: ServiceResponse;
  };
}
```

## References
- [System Introduction](../../overview/introduction.md)
- [Technical Requirements](../requirements/technical-requirements.md)
- [Business Requirements](../requirements/business-requirements.md)
- [mExpress API Standards](../../../mexpress/specifications/api/api-standards.md)

## Version History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-02-15 | ARCHITECT | Initial version based on system specifications |