Roo: GPM
PROJECT: mExpress
MILESTONE: External Integrations - BRQ-2025-030
DOCUMENT: Testing Guide

IMPLEMENTED FEATURES:

1. Hiboutik Integration:
   - Customer management API client
   - Features:
     * Create customers
     * Update customer details
     * Retrieve customer information
     * List all customers
   - Security:
     * Basic authentication
     * Rate limiting (100 requests/minute)
   - Error handling and retries

2. Ringover Integration:
   - Call tracking API client
   - Features:
     * Retrieve call history
     * Get call details
     * Track call status
   - Security:
     * Bearer token authentication
     * Rate limiting (100 requests/minute)
   - Error handling and retries

3. Data Synchronization:
   - Customer-Call History Matching
   - Features:
     * Match customers with their calls
     * Phone number normalization
     * International format support
   - Error handling and recovery

TESTING INSTRUCTIONS:

1. Prerequisites:
   ```bash
   # Environment Variables Needed:
   HIBOUTIK_BASE_URL=https://api.hiboutik.com/v1
   HIBOUTIK_USERNAME=your-username
   HIBOUTIK_API_KEY=your-api-key
   HIBOUTIK_STORE_ID=your-store-id
   
   RINGOVER_BASE_URL=https://api.ringover.com/v2
   RINGOVER_API_KEY=your-api-key
   RINGOVER_TEAM_ID=your-team-id
   ```

2. Testing Hiboutik Integration:
   ```typescript
   // Create a customer
   const hiboutik = new HiboutikService({
     baseUrl: process.env.HIBOUTIK_BASE_URL,
     username: process.env.HIBOUTIK_USERNAME,
     apiKey: process.env.HIBOUTIK_API_KEY,
     storeId: process.env.HIBOUTIK_STORE_ID
   });

   const customer = await hiboutik.createCustomer({
     firstName: "John",
     lastName: "Doe",
     email: "john@example.com",
     phone: "+33123456789"
   });
   ```

3. Testing Ringover Integration:
   ```typescript
   // Get call history
   const ringover = new RingoverService({
     baseUrl: process.env.RINGOVER_BASE_URL,
     apiKey: process.env.RINGOVER_API_KEY,
     teamId: process.env.RINGOVER_TEAM_ID
   });

   const calls = await ringover.getRecentCalls();
   ```

4. Testing Data Synchronization:
   ```typescript
   // Get customer's call history
   const sync = new SyncService(hiboutik, ringover);
   const customerHistory = await sync.getCustomerCallHistory("customer-id");
   ```

ERROR HANDLING:
- Authentication errors: Check credentials
- Rate limiting: Automatic retry with backoff
- Network errors: Automatic retry for transient failures
- API errors: Detailed error messages

VALIDATION:
- All API responses are typed
- Phone numbers are normalized
- Error cases are handled
- Rate limits are respected

This implementation provides:
1. Customer management through Hiboutik
2. Call tracking through Ringover
3. Synchronized customer call history
4. Error handling and recovery
5. Rate limiting protection

The services are ready for integration into the frontend once the Message Queue (BRQ-2025-003) and Frontend Auth (BRQ-2025-018) components are completed.