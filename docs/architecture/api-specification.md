# mExpress API Specification

## 1. API Standards

### 1.1 General Guidelines

- Base URL: `https://api.mexpress.com/v1`
- All endpoints return JSON responses
- Authentication via JWT tokens
- Rate limiting: 100 requests per minute per IP
- All timestamps in ISO 8601 format
- HTTPS required for all endpoints

### 1.2 Response Format

```json
{
  "status": "success|error",
  "data": {}, // Response data
  "error": {
    // Only present if status is "error"
    "code": "ERROR_CODE",
    "message": "Human readable message"
  },
  "meta": {
    // Optional metadata
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

## 2. Authentication API

### 2.1 Login

```http
POST /auth/login
```

Request:

```json
{
  "email": "string",
  "password": "string"
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "expiresIn": 900
  }
}
```

### 2.2 Refresh Token

```http
POST /auth/refresh
```

Request:

```json
{
  "refreshToken": "string"
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "accessToken": "string",
    "expiresIn": 900
  }
}
```

## 3. Customer API

### 3.1 Create Customer

```http
POST /customers
```

Request:

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "address": {
    "street": "string",
    "city": "string",
    "postalCode": "string",
    "country": "string"
  }
}
```

### 3.2 Get Customer

```http
GET /customers/{id}
```

Response:

```json
{
  "status": "success",
  "data": {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "address": {
      "street": "string",
      "city": "string",
      "postalCode": "string",
      "country": "string"
    },
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

## 4. Order API

### 4.1 Create Repair Order

```http
POST /orders
```

Request:

```json
{
  "customerId": "string",
  "deviceType": "string",
  "issue": "string",
  "priority": "normal|urgent",
  "preferredDate": "string",
  "notes": "string"
}
```

### 4.2 Update Order Status

```http
PATCH /orders/{id}/status
```

Request:

```json
{
  "status": "pending|in_progress|completed|cancelled",
  "notes": "string"
}
```

### 4.3 Get Order Details

```http
GET /orders/{id}
```

Response:

```json
{
  "status": "success",
  "data": {
    "id": "string",
    "customerId": "string",
    "deviceType": "string",
    "issue": "string",
    "status": "string",
    "priority": "string",
    "technician": {
      "id": "string",
      "name": "string"
    },
    "timeline": [
      {
        "status": "string",
        "timestamp": "string",
        "notes": "string"
      }
    ],
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

## 5. Inventory API

### 5.1 Check Stock

```http
GET /inventory/stock/{itemId}
```

Response:

```json
{
  "status": "success",
  "data": {
    "itemId": "string",
    "name": "string",
    "quantity": "number",
    "location": "string",
    "threshold": "number",
    "reserved": "number"
  }
}
```

### 5.2 Update Stock

```http
PATCH /inventory/stock/{itemId}
```

Request:

```json
{
  "quantity": "number",
  "operation": "add|subtract|set",
  "reason": "string"
}
```

## 6. Payment API

### 6.1 Create Payment

```http
POST /payments
```

Request:

```json
{
  "orderId": "string",
  "amount": "number",
  "currency": "string",
  "method": "card|bank_transfer|cash",
  "reference": "string"
}
```

### 6.2 Get Payment Status

```http
GET /payments/{id}
```

Response:

```json
{
  "status": "success",
  "data": {
    "id": "string",
    "orderId": "string",
    "amount": "number",
    "currency": "string",
    "status": "pending|completed|failed",
    "method": "string",
    "reference": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

## 7. Notification API

### 7.1 Send Notification

```http
POST /notifications
```

Request:

```json
{
  "recipient": {
    "id": "string",
    "type": "customer|technician|admin"
  },
  "type": "sms|email|push",
  "template": "string",
  "data": {
    "key": "value"
  }
}
```

### 7.2 Get Notification History

```http
GET /notifications
```

Parameters:

- recipientId (string)
- type (string)
- startDate (string)
- endDate (string)

## 8. Integration APIs

### 8.1 PrestaShop Webhook

```http
POST /integrations/prestashop/webhook
```

Request:

```json
{
  "event": "string",
  "data": {
    "key": "value"
  }
}
```

### 8.2 Hiboutik Sync

```http
POST /integrations/hiboutik/sync
```

Request:

```json
{
  "type": "inventory|orders|customers",
  "action": "create|update|delete",
  "data": {
    "key": "value"
  }
}
```

## 9. Error Codes

| Code      | Description          |
| --------- | -------------------- |
| AUTH_001  | Invalid credentials  |
| AUTH_002  | Token expired        |
| AUTH_003  | Invalid token        |
| ORDER_001 | Invalid order status |
| ORDER_002 | Order not found      |
| INV_001   | Insufficient stock   |
| INV_002   | Item not found       |
| PAY_001   | Payment failed       |
| PAY_002   | Invalid amount       |

## 10. Rate Limiting

- Standard rate limit: 100 requests per minute
- Burst rate limit: 200 requests per minute (for 1 minute)
- Rate limit headers:
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset

## 11. Versioning

- Current version: v1
- Version in URL path
- Backward compatibility maintained within major versions
- Deprecation notices provided 6 months in advance

## 12. Security

### 12.1 Authentication

- JWT tokens required for all endpoints except public endpoints
- Token format: Bearer {token}
- Token expiration: 15 minutes
- Refresh token expiration: 7 days

### 12.2 Authorization

- Role-based access control
- Roles: admin, technician, customer
- Resource-level permissions
- IP whitelist for admin endpoints

This API specification serves as the contract between different components of the mExpress system and should be strictly followed during implementation.
