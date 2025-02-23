Roo: ARCHITECT
PROJECT: mExpress Frontend
DOCUMENT: Integration Specification
BRQ: ARCH-2025-003
STATUS: Initial Specification

INTEGRATION ARCHITECTURE:

1. External Service Integration
   a. Claude AI Integration
      ```typescript
      interface ClaudeAIService {
        generateMessage(context: MessageContext): Promise<string>;
        refineMessage(message: string, requirements: MessageRequirements): Promise<string>;
        translateMessage(message: string, language: string): Promise<string>;
      }
      ```
      - Purpose: Automated message generation
      - Integration: REST API
      - Authentication: API Key
      - Rate Limiting: Required

   b. Hiboutik Integration
      ```typescript
      interface HiboutikService {
        getInventory(): Promise<InventoryData>;
        updateStock(updates: StockUpdate[]): Promise<void>;
        syncProducts(products: Product[]): Promise<void>;
        getOrders(): Promise<Order[]>;
      }
      ```
      - Purpose: Inventory management
      - Integration: REST API
      - Authentication: OAuth2
      - Sync: Bi-directional

   c. Communication Services
      ```typescript
      interface NotificationService {
        sendEmail(message: EmailMessage): Promise<void>;
        sendSMS(message: SMSMessage): Promise<void>;
        sendPush(message: PushMessage): Promise<void>;
        trackDelivery(messageId: string): Promise<DeliveryStatus>;
      }
      ```
      - Purpose: Customer notifications
      - Integration: Message Queue
      - Authentication: API Key
      - Delivery: Asynchronous

2. Customer Portal Integration
   a. Authentication
      ```typescript
      interface PortalAuth {
        generateUniqueLink(repairId: string): Promise<string>;
        validateLink(token: string): Promise<RepairAccess>;
        revokeAccess(repairId: string): Promise<void>;
      }
      ```
      - Purpose: Secure access
      - Method: Tokenized URLs
      - Expiration: Configurable
      - Security: Required

   b. Data Access
      ```typescript
      interface PortalData {
        getRepairStatus(repairId: string): Promise<RepairStatus>;
        getRepairHistory(repairId: string): Promise<RepairHistory>;
        getCommunications(repairId: string): Promise<Communication[]>;
        getDocuments(repairId: string): Promise<Document[]>;
      }
      ```
      - Purpose: Status visibility
      - Access: Read-only
      - Updates: Real-time
      - Caching: Required

   c. Communication
      ```typescript
      interface PortalCommunication {
        sendMessage(message: CustomerMessage): Promise<void>;
        receiveMessage(callback: MessageHandler): void;
        getMessageHistory(repairId: string): Promise<Message[]>;
        markRead(messageId: string): Promise<void>;
      }
      ```
      - Purpose: Customer interaction
      - Method: WebSocket
      - Persistence: Required
      - Notifications: Enabled

3. Internal Service Integration
   a. Event Bus
      ```typescript
      interface EventBus {
        publish(event: SystemEvent): Promise<void>;
        subscribe(topic: string, handler: EventHandler): void;
        unsubscribe(topic: string, handler: EventHandler): void;
      }
      ```
      - Purpose: Service communication
      - Pattern: Pub/Sub
      - Reliability: Required
      - Monitoring: Enabled

   b. Service Mesh
      ```typescript
      interface ServiceMesh {
        registerService(service: ServiceDefinition): Promise<void>;
        discoverService(serviceId: string): Promise<ServiceEndpoint>;
        healthCheck(serviceId: string): Promise<HealthStatus>;
      }
      ```
      - Purpose: Service orchestration
      - Pattern: Mesh topology
      - Resilience: Required
      - Tracing: Enabled

SECURITY REQUIREMENTS:

1. Authentication
   - API key management
   - OAuth2 implementation
   - Token validation
   - Access control

2. Data Protection
   - Encryption in transit
   - Encryption at rest
   - Data masking
   - Access logging

3. Monitoring
   - Service health
   - Performance metrics
   - Error tracking
   - Usage analytics

IMPLEMENTATION GUIDELINES:

1. Service Development
   - TypeScript implementation
   - Strong typing
   - Error handling
   - Retry logic

2. Testing Requirements
   - Integration tests
   - Load testing
   - Security testing
   - Failover testing

3. Documentation
   - API specifications
   - Integration guides
   - Security protocols
   - Monitoring setup

This specification defines the integration architecture for the repair management system.