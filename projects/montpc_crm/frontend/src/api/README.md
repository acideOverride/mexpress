# mExpress Frontend API Layer

This directory contains the API integration layer for the mExpress Frontend application.

## Structure

```
api/
├── client.ts              # API client configuration
├── config.ts             # API configuration
├── types.ts              # Common type definitions
├── interceptors/         # Request/response interceptors
├── services/            # API service modules
└── types/               # Type definitions
```

## Components

### API Client
- Base configuration for API requests
- Timeout and headers setup
- Error handling

### Interceptors
- Authentication handling
- Error processing
- Request/response transformation

### Services
- API endpoint wrappers
- Type-safe request/response handling
- Business logic integration

### Types
- TypeScript interfaces
- Request/response types
- Common type definitions

## Usage

```typescript
import { apiClient } from './client';
import { SomeService } from './services/some.service';

// Using API client directly
const response = await apiClient.get('/endpoint');

// Using service modules
const service = new SomeService();
const data = await service.getData();
```

## Configuration

API configuration is managed through `config.ts`:
- Base URL
- Timeout settings
- Default headers
- Environment-specific settings

## Development

1. Adding new services:
   - Create service file in `services/`
   - Define types in `types/`
   - Export through `services/index.ts`

2. Adding interceptors:
   - Create interceptor in `interceptors/`
   - Configure in `client.ts`
   - Export through `interceptors/index.ts`

3. Adding types:
   - Create type file in `types/`
   - Export through `types/index.ts`

## Testing

All components should have corresponding test files:
- `__tests__/` directories
- `.test.ts` suffix
- Full coverage required