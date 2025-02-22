# API Interceptors

## Auth Interceptor

The auth interceptor provides automatic token handling and refresh functionality for API requests.

### Features

- Automatically adds auth token to request headers
- Handles token refresh on 401 (Unauthorized) errors
- Redirects to login page on authentication failures

### Usage

```typescript
import { setupAuthInterceptor } from './interceptors/auth';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://api.example.com'
});

setupAuthInterceptor(apiClient);
```

### Implementation Details

1. Request Interceptor
   - Checks for auth token in localStorage
   - Adds token to request headers if present

2. Response Interceptor
   - Catches 401 errors
   - Attempts to refresh token
   - Retries original request with new token
   - Redirects to login on refresh failure

## Error Interceptor

The error interceptor provides consistent error handling and logging across all API requests.

### Features

- Handles common HTTP error status codes (400, 403, 404, 500)
- Provides specific error messages for different types of errors
- Handles network and request errors
- Logs errors to console with appropriate context

### Usage

```typescript
import { setupErrorInterceptor } from './interceptors/error';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://api.example.com'
});

setupErrorInterceptor(apiClient);
```

### Error Handling

1. HTTP Status Errors
   - 400: Bad Request
   - 403: Forbidden
   - 404: Not Found
   - 500: Server Error
   - Other: Generic HTTP error with status code

2. Network Errors
   - Connection issues
   - Timeout errors
   - DNS failures

3. Request Errors
   - Malformed requests
   - Invalid configurations
   - Other axios-specific errors

### Testing

Both interceptors are fully tested with Jest:
- Request/response handling
- Error scenarios
- Token management
- Network issues
- Error logging