# Customer API

## Endpoints

### GET /api/customers
Retrieves a paginated list of customers.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)
- `sort`: Field to sort by (default: 'lastName')
- `order`: Sort order ('asc' or 'desc', default: 'asc')
- `search`: Search term to filter results

**Response:**
```json
{
  "data": [
    {
      "id": "cust_123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "verificationStatus": "verified",
      "createdAt": "2025-02-15T12:00:00Z",
      "updatedAt": "2025-02-15T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### GET /api/customers/:id
Retrieves a single customer by ID.

**Response:**
```json
{
  "id": "cust_123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "verificationStatus": "verified",
  "externalIds": {
    "hiboutik": "hib_456",
    "ringover": "ring_789"
  },
  "syncStatus": {
    "hiboutik": "synced",
    "ringover": "synced"
  },
  "createdAt": "2025-02-15T12:00:00Z",
  "updatedAt": "2025-02-15T12:00:00Z"
}
```

### POST /api/customers
Creates a new customer.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+9876543210"
}
```

**Response:**
```json
{
  "id": "cust_124",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+9876543210",
  "verificationStatus": "pending",
  "externalIds": {},
  "syncStatus": {
    "hiboutik": "pending",
    "ringover": "pending"
  },
  "createdAt": "2025-02-18T15:30:00Z",
  "updatedAt": "2025-02-18T15:30:00Z"
}
```

### PUT /api/customers/:id
Updates an existing customer.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Johnson",
  "email": "jane.johnson@example.com"
}
```

**Response:** Same as GET /api/customers/:id

### DELETE /api/customers/:id
Deletes a customer by ID.

**Response:**
```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

## Integration Services

### Verification Service
The customer verification service validates customer data in real-time, checking for duplicate records and validating contact information.

### External Integration
Customers are automatically synchronized with:
- Hiboutik CRM system
- Ringover phone system

Each integration maintains its own ID mapping and sync status.

## Error Handling

All endpoints return standardized error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is invalid",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
```

## Rate Limiting

API endpoints are rate limited to 100 requests per minute per API key.