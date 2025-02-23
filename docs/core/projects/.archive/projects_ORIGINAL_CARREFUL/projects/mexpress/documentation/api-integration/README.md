# API Integration Layer

This directory contains the API integration layer for the mExpress Frontend, providing a robust and type-safe way to interact with the backend API.

## Structure

```
api/
├── client.ts              # API client configuration
├── interceptors/          # Request/response interceptors
│   ├── auth.ts           # Authentication interceptor
│   └── error.ts          # Error handling interceptor
├── services/             # API service modules
│   ├── auth.service.ts   # Authentication service
│   ├── customers.service.ts
│   └── products.service.ts
└── types/               # TypeScript interfaces
    ├── auth.ts
    ├── customer.ts
    └── product.ts
```

## Features

- Configured API client with base URL and timeout
- Authentication handling with automatic token refresh
- Consistent error handling across all requests
- Type-safe API services for:
  - Authentication
  - Customers
  - Products
- Full test coverage for all components

## Usage

### API Client

The API client is pre-configured with:
- Base URL: http://localhost:3000/api
- Default timeout: 10 seconds
- Content-Type: application/json
- Auth token handling
- Error interceptors

### Services

#### Auth Service

```typescript
import { authService } from '@/api/services';

// Login
const auth = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Get user profile
const profile = await authService.getProfile();

// Refresh token
await authService.refreshToken(refreshToken);

// Logout
await authService.logout();

// Check login status
const isLoggedIn = authService.isLoggedIn();
```

#### Customers Service

```typescript
import { customersService } from '@/api/services';

// Get all customers
const customers = await customersService.getAll();

// Get customer by ID
const customer = await customersService.getById('123');

// Create customer
const newCustomer = await customersService.create({
  name: 'John Doe',
  email: 'john@example.com'
});

// Update customer
await customersService.update('123', {
  name: 'John Smith'
});

// Delete customer
await customersService.delete('123');
```

#### Products Service

```typescript
import { productsService } from '@/api/services';

// Get all products
const products = await productsService.getAll();

// Get product by ID
const product = await productsService.getById('123');

// Create product
const newProduct = await productsService.create({
  name: 'Product Name',
  price: 99.99,
  sku: 'SKU123',
  stock: 100
});

// Update product
await productsService.update('123', {
  price: 89.99,
  stock: 150
});

// Delete product
await productsService.delete('123');
```

## Error Handling

The error interceptor provides consistent error handling across all API requests:

- 400: Bad Request - Validation errors
- 401: Unauthorized - Automatically attempts token refresh
- 403: Forbidden - Permission errors
- 404: Not Found - Resource not found
- 500: Server Error - Internal server errors
- Network errors: Connection issues

## Authentication

The auth interceptor handles:
- Adding auth tokens to requests
- Automatic token refresh on 401 errors
- Redirect to login on auth failures

## Token Management

Auth tokens are automatically:
- Stored in localStorage after login
- Added to request headers
- Refreshed when expired
- Cleared on logout or auth failures

## Testing

All components are thoroughly tested:
```bash
npm test "src/api/**/*.test.ts"
```

Tests cover:
- API client configuration
- Interceptor functionality
- Service methods
- Error handling
- Authentication flow
- Token management