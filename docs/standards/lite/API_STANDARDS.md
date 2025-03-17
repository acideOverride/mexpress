# API Standards (Lite Version)

This document outlines the essential standards for API development across mExpress projects, focusing on RESTful API design, authentication, error handling, best practices, and port allocation.

## API Endpoints

### URL Structure

- Use resource-based URL paths
- Use kebab-case for multi-word resource names
- Use plural nouns for collections

```
✅ Good:
GET    /api/customers
GET    /api/customers/123
POST   /api/customers
PUT    /api/customers/123
DELETE /api/customers/123

❌ Avoid:
GET    /api/getCustomers
POST   /api/createCustomer
PUT    /api/updateCustomer/123
DELETE /api/deleteCustomer/123
```

### Resource Relationships

- Use nested resources for relationships
- Limit nesting to one level when possible

```
✅ Good:
GET /api/customers/123/orders
GET /api/customers/123/orders/456

❌ Avoid:
GET /api/customers/123/orders/456/items/789
```

### Query Parameters

- Use query parameters for filtering, sorting, and pagination
- Follow consistent parameter naming

```
✅ Good:
GET /api/customers?status=active
GET /api/orders?sort=created_at:desc
GET /api/products?page=2&limit=10

❌ Avoid:
GET /api/customers/getActiveCustomers
GET /api/orders/sortByDate
```

## HTTP Methods

- Use standard HTTP methods appropriately:
  - `GET`: Retrieve resources
  - `POST`: Create resources or perform operations
  - `PUT`: Update resources (full update)
  - `PATCH`: Partial update of resources
  - `DELETE`: Remove resources

- Use HTTP method overrides when necessary:
  - Some clients only support GET/POST
  - Use the `X-HTTP-Method-Override` header

## Request and Response Format

### JSON Structure

- Use camelCase for JSON property names
- Use consistent property naming across resources
- Include a root element for collections
- Include metadata for collections

```json
{
  "customers": [
    {
      "id": "123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    },
    {
      "id": "456",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com"
    }
  ],
  "meta": {
    "totalCount": 42,
    "page": 1,
    "limit": 10
  }
}
```

### Response Headers

- Use standard HTTP headers appropriately
- Include rate limiting headers
- Include caching headers

```
Cache-Control: max-age=3600
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1620000000
Content-Type: application/json
```

## Status Codes

- Use appropriate HTTP status codes
- Be consistent with status code usage

| Code | Description | Usage |
|------|-------------|-------|
| 200 | OK | Successful GET, PUT, or PATCH |
| 201 | Created | Successful POST resulting in creation |
| 204 | No Content | Successful DELETE or no response body |
| 400 | Bad Request | Malformed request or validation errors |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Valid authentication but insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Request conflicts with current state |
| 422 | Unprocessable Entity | Semantic validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |

## Error Handling

### Error Response Format

- Use consistent error response format
- Include an error code, message, and details
- Return appropriate HTTP status codes

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid parameters",
    "details": [
      {
        "field": "email",
        "message": "Email address is invalid"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
```

### Error Logging

- Log all server errors with unique identifiers
- Return the error identifier to the client for support reference
- Do not expose sensitive information in error responses

## Authentication and Authorization

### Authentication Methods

- Use JWT for stateless authentication
- Include token expiration times
- Implement refresh token rotation

### Security Headers

- Always use HTTPS for all API endpoints
- Include security headers in responses:
  - `Strict-Transport-Security`
  - `X-Content-Type-Options`
  - `X-Frame-Options`
  - `Content-Security-Policy`

## Versioning

- Include API version in the URL path
- Use major version numbers only
- Maintain backward compatibility within versions

```
✅ Good:
/api/v1/customers
/api/v2/customers

❌ Avoid:
/api/v1.2/customers
/api/customers?version=2
```

## Performance

### Caching

- Use appropriate Cache-Control headers
- Implement ETag support for resource caching
- Use conditional requests (If-None-Match, If-Modified-Since)

### Pagination

- Always paginate collection responses
- Include pagination metadata
- Support both page-based and cursor-based pagination

```
GET /api/customers?page=2&limit=10
GET /api/customers?after=cus_123&limit=10
```

### Filtering and Sorting

- Support field filtering via query parameters
- Support multiple sort fields with direction

```
GET /api/customers?fields=id,firstName,lastName
GET /api/orders?sort=created_at:desc,total:asc
```

## Documentation

- Document all API endpoints
- Include request/response examples
- Document error codes and messages
- Update documentation when API changes

## Testing

- Write tests for all endpoints
- Test happy paths and error cases
- Test performance under load
- Test authorization and authentication edge cases

## Monitoring

- Monitor API response times
- Track error rates by endpoint
- Set up alerts for critical failures
- Monitor rate limit usage

## Port Allocation

### Standard Port Ranges

The mExpress ecosystem uses the port range **9000-9999** for all services and applications:

| Port Range | Project/Component | Description |
|------------|-------------------|-------------|
| 9000-9099  | Core mExpress Services | Central services used by all projects |
| 9100-9299  | MontPC CRM | All MontPC CRM related services |
| 9300-9499  | Giandra Photos | All Giandra Photos related services |
| 9500-9699  | Jerome Bikes | All Jerome Bikes related services |
| 9700-9799  | MontPC.com Website | Website and related services |
| 9800-9899  | Shared Components | Services for shared components |
| 9900-9999  | Utilities & Monitoring | Logging, monitoring and utility services |

### Key Port Assignments

| Port | Service |
|------|---------|
| 9000 | mExpress Core API |
| 9001 | Authentication Service |
| 9002 | Email Service (Resend.com integration) |
| 9701 | MontPC.com Contact Form API |

### Port Usage Guidelines

1. **Service Configuration**
   - All services must use their assigned port
   - Services should bind to localhost (127.0.0.1) unless external access is required
   - Define ports in configuration files or environment variables, not hardcoded

2. **Nginx Integration**
   - All public-facing services should be proxied through Nginx
   - Use consistent proxy configuration:
     ```nginx
     location /api/ {
         proxy_pass http://localhost:9xxx;
         proxy_http_version 1.1;
         proxy_set_header Host $host;
         proxy_cache_bypass $http_upgrade;
     }
     ```

3. **Security Considerations**
   - Restrict access to service ports using firewall rules
   - Only expose necessary ports to the public
   - Use SSL/TLS termination at the Nginx level