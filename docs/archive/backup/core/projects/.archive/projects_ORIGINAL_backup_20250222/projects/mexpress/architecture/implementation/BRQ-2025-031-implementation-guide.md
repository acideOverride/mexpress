Roo: ARCHITECT
PROJECT: mExpress
TASK: Ringover Customer Management Implementation - BRQ-2025-031
STATUS: APPROVED FOR IMPLEMENTATION
PRIORITY: High

IMPLEMENTATION APPROVAL:
  Decision: APPROVED
  QC Status: VERIFIED
  Standards: COMPLIANT
  Chain: PRESERVED

IMPLEMENTATION GUIDE:

1. Service Extension:
   ```typescript
   // Add to RingoverService
   interface RingoverCustomer {
     id: string;
     firstName: string;
     lastName: string;
     email: string;
     phone: string;
     hiboutikId?: string;  // Cross-reference
   }

   class RingoverService {
     // Existing methods...

     async createCustomer(customer: RingoverCustomer): Promise<RingoverCustomer>;
     async getCustomerById(id: string): Promise<RingoverCustomer>;
     async updateCustomer(id: string, customer: RingoverCustomer): Promise<RingoverCustomer>;
     async getCustomerByPhone(phone: string): Promise<RingoverCustomer>;
   }
   ```

2. Sync Service Update:
   ```typescript
   class SyncService {
     // Existing methods...

     async syncCustomer(hiboutikId: string): Promise<void> {
       // Get Hiboutik customer
       const hiboutikCustomer = await this.hiboutikService.getCustomerById(hiboutikId);
       
       // Create/Update in Ringover
       const ringoverCustomer = {
         firstName: hiboutikCustomer.firstName,
         lastName: hiboutikCustomer.lastName,
         email: hiboutikCustomer.email,
         phone: hiboutikCustomer.phone,
         hiboutikId: hiboutikCustomer.id
       };

       // Handle create/update logic
       try {
         const existing = await this.ringoverService.getCustomerByPhone(hiboutikCustomer.phone);
         if (existing) {
           await this.ringoverService.updateCustomer(existing.id, ringoverCustomer);
         } else {
           await this.ringoverService.createCustomer(ringoverCustomer);
         }
       } catch (error) {
         // Handle errors appropriately
       }
     }
   }
   ```

3. Implementation Steps:
   a. RingoverService:
      - Add customer interfaces
      - Implement CRUD methods
      - Add error handling
      - Implement rate limiting
      - Add tests

   b. SyncService:
      - Add sync methods
      - Implement bidirectional sync
      - Add conflict resolution
      - Update tests
      - Add documentation

4. Quality Requirements:
   - Type safety enforced
   - Error handling complete
   - Rate limiting implemented
   - Tests comprehensive
   - Documentation thorough

5. Testing Strategy:
   - Unit tests for all methods
   - Integration tests for sync
   - Error case coverage
   - Rate limit testing
   - Performance testing

VALIDATION CHAIN:
Previous: ARCHITECT -> QC
Current: Implementation Approval
Next: CODE Implementation

EVIDENCE CHAIN:
- Architecture Decision: docs/projects/mexpress/architecture/decisions/BRQ-2025-031-ringover-customer-management.md
- QC Verification: docs/projects/mexpress/architecture/qc-verification/BRQ-2025-031-ringover-customer-management-qc.md
- Implementation Guide: Current Document

Forward to CODE for implementation with complete guidance and requirements.