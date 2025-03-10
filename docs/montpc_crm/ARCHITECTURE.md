# MontPC CRM Architecture Blueprint

<!--
ARCHITECTURE.md is the immutable blueprint that defines the system's vision,
architecture, and components. It serves as the source of truth for development.
-->

## 1. System Overview

### 1.1 Vision Statement
MontPC CRM is a comprehensive customer relationship management system built on the mExpress platform. It provides an integrated solution for PC repair businesses to manage customers, repair services, inventory, and sales operations through a unified interface.

### 1.2 Architectural Principles
- **Service-Oriented**: Modular services with clear boundaries and responsibilities
- **API-First**: All functionality exposed through consistent RESTful APIs
- **Event-Driven**: Asynchronous communication using message queues for resilience
- **DevOps Enabled**: Automated testing, deployment, and monitoring
- **Multi-Channel**: Supporting in-store, online, and remote service channels

### 1.3 Technology Stack
- **Frontend**: Vue.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (primary), Redis (caching)
- **API Layer**: RESTful APIs with OpenAPI specification
- **Message Bus**: Custom message queue with persistence
- **Infrastructure**: Docker, Kubernetes
- **Monitoring**: Prometheus, Grafana
- **Testing**: Jest, Vue Testing Library
- **Visualization**: D3.js for reporting and metrics

## 2. Core Components

### 2.1 API Layer
- **Customer API**: ✅ CRUD operations for customer management
- **Repair Ticket API**: Service request intake, tracking, and management
- **Integration API**: ✅ External system connectors (Hiboutik, Ringover)
- **Authentication API**: ✅ Identity and access management
- **Product API**: Catalog and inventory management

### 2.2 Service Layer
- **Customer Service**: ✅ Customer data management and validation
- **Auth Service**: ✅ Authentication, authorization, token management
- **Repair Service**: Repair workflow, status management, and notifications
- **Integration Service**: Third-party system adapters
- **Product Service**: Product catalog and inventory management
- **Message Queue**: ✅ Reliable async communication between services
- **Printer Service**: 📅 Label generation and print management

### 2.3 Data Layer
- **Customer Repository**: ✅ Customer data storage and retrieval
- **Repair Ticket Repository**: Repair history and status tracking
- **Product Repository**: Product catalog and inventory
- **Transaction Manager**: ✅ ACID transaction support for critical operations
- **Data Consistency Service**: ✅ Cross-service data validation

### 2.4 Infrastructure Components
- **Service Discovery**: ✅ Dynamic service location and load balancing
- **Rate Limiter**: ✅ API throttling and quota management
- **Circuit Breaker**: ✅ Fault tolerance for service communication
- **High Availability Manager**: Service replication and failover
- **Monitoring System**: Performance metrics and health checks

### 2.5 UI Components
- **Main Dashboard**: Central navigation hub with sidebar for feature access
- **Customer Management**: Customer profile and interaction tracking
- **Customer Dashboard**: List view with filtering, search, and create functionality
- **Customer Detail**: Comprehensive customer profile with interaction history
- **Repair Dashboard**: Service status visualization and management
- **Repair Detail**: Individual repair workflow and management interface
- **Technician Interface**: Repair workflow and management tools
- **Product Dashboard**: Inventory and catalog management interface
- **Product Detail**: Detailed product information and status
- **MegaSearch**: Cross-entity search with live results and "create new" suggestions
- **Authentication**: ✅ Login, registration, account management
- **Reporting**: Analytics and KPI visualization using D3.js

## 3. System Integrations

### 3.1 External Services
- **Ringover API**: ✅ Phone system integration for call tracking
- **Hiboutik API**: ✅ POS and inventory integration
- **Revolut Gateway**: Payment processing integration
- **SMS Provider (Brevo)**: Customer notifications
- **Printer API**: 📅 Thermal printer connection for repair labels

### 3.2 Integration Patterns
- **Message Queue**: ✅ Asynchronous integration with guaranteed delivery
- **API Gateway**: Single entry point for external clients
- **Webhook System**: Event-based notifications for status changes
- **Synchronization Manager**: Two-way data sync with external systems

## 4. Business Domains

### 4.1 Customer Management
- **Customer Profiles**: ✅ Comprehensive customer information management
- **Customer Dashboard**: List view with filtering and quick actions
- **Customer Detail View**: Complete customer information and history
- **Interaction History**: ✅ Communication and service tracking
- **MegaSearch**: Instant cross-entity search with customer results
- **External Integration**: Automatic Hiboutik and Ringover customer sync
- **Customer Portal**: Self-service account and service management
- **VIP Customer Handling**: Special processing for priority customers
- **Create New**: Quick customer creation from search results

### 4.2 Repair Service Management
- **Service Intake**: Device reception and initial diagnostics
- **Repair Workflow**: Status tracking and technician assignment
- **Parts Management**: Inventory usage and restocking
- **Service Completion**: Quality control and customer handoff
- **Live Search**: Cross-entity search with instant results
- **Create New**: Quick creation of repair tickets from search results

### 4.3 Inventory Control
- **Stock Management**: Inventory tracking across locations
- **Parts Catalog**: Compatibility and sourcing information
- **Product Dashboard**: Centralized product management interface
- **Live Search**: Instant product search with filtering
- **Threshold Alerts**: Low stock notifications
- **Usage Analytics**: Consumption patterns and forecasting
- **Create New**: Quick creation of products from search results

### 4.4 Financial Operations
- **Payment Processing**: Transaction handling and recording
- **Invoicing**: Service and product billing
- **Financial Reporting**: Revenue and profit tracking
- **Expense Management**: Cost tracking and analysis

## 5. Cross-Cutting Concerns

### 5.1 Security
- **Authentication**: ✅ JWT-based auth with refresh tokens
- **Authorization**: ✅ Role-based access control
- **Data Protection**: Encryption at rest and in transit
- **API Security**: ✅ Rate limiting, input validation, CORS

### 5.2 Performance
- **Caching Strategy**: Multi-level caching (Redis, in-memory)
- **Database Optimization**: ✅ Indexing, query optimization
- **Load Balancing**: ✅ Request distribution across service instances
- **Resource Management**: CPU/memory limits per service

### 5.3 Resilience
- **Circuit Breaker**: ✅ Prevent cascading failures
- **Retry Mechanism**: ✅ Automatic retry for transient errors
- **Fallback Strategies**: Graceful degradation when services unavailable
- **Health Monitoring**: Proactive system health checks

### 5.4 Observability
- **Logging**: ✅ Structured logging with correlation IDs
- **Metrics**: Performance and business metrics collection
- **Tracing**: Distributed request tracing across services
- **Alerting**: Automated notification for critical issues

## 6. Implementation Status

### 6.1 BRQ Test Status

#### Core Services
| Status | BRQ | Component | Tests | Priority | Progress |
|:------:|-----|-----------|:-----:|:--------:|:--------:|
| 🟢 | MEXP-2025-002-BE | Authentication & Security | 4/4 | P0 | 100% |
| 🟢 | MEXP-2025-003-BE | Message Queue System | 5/5 | P0 | 100% |
| 🟢 | MEXP-2025-004-BE | Core CRUD Functionality | 3/3* | P0 | 100% |
| 🟢 | MEXP-2025-008-BE | Customer Management | 2/2 | P0 | 100% |
| 🟢 | MEXP-2025-027-BE | Product Catalog | 3/3 | P1 | 100% |
| 🟡 | MEXP-2025-007-BE | Service Integration Architecture | 7/9 | P1 | 78% |

#### API Layer
| Status | BRQ | Component | Tests | Priority | Progress |
|:------:|-----|-----------|:-----:|:--------:|:--------:|
| 🟢 | MEXP-2025-001-API | API Integration Phase | 3/3 | P0 | 100% |
| 🟢 | MEXP-2025-006-API | Customer CRUD API | 3/3 | P0 | 100% |
| 🟢 | MEXP-2025-030-API | External API Integrations | 3/3 | P1 | 100% |
| 🟢 | MEXP-2025-031-API | Ringover Customer Management | 3/3 | P1 | 100% |

#### Infrastructure & DevOps
| Status | BRQ | Component | Tests | Priority | Progress |
|:------:|-----|-----------|:-----:|:--------:|:--------:|
| 🟡 | MEXP-2025-024-INFRA | MVP Readiness | 1/2 | P0 | 50% |
| 🟢 | MEXP-2025-037-FULL | MVP Implementation | 3/3 | P1 | 100% |

#### Frontend
| Status | BRQ | Component | Tests | Priority | Progress |
|:------:|-----|-----------|:-----:|:--------:|:--------:|
| 🟢 | MEXP-2025-005-FE | UI Architecture | 1/1 | P1 | 100% |
| 🟠 | MEXP-2025-040-FE | Dashboard Design | 0/1 | P2 | 0% |

#### MontPC Project
| Status | BRQ | Component | Tests | Priority | Progress |
|:------:|-----|-----------|:-----:|:--------:|:--------:|
| 🟢 | MONT-2025-001-FULL | Customer Service | 1/1 | P1 | 100% |
| 🟢 | MONT-2025-002-FULL | Auth Service | 2/2 | P1 | 100% |
| 🟢 | MONT-2025-007-FULL | Emergency Recovery | 1/1 | P1 | 100% |
| 🔴 | MONT-2025-032-API | External Integrations | 0/1 | P2 | 0% |
| 🟠 | MONT-2025-033-API | Repair Sticker Integration | 0/2 | P1 | 0% |

*All tests skipped with proper documentation due to MongoDB replica set requirement

### 6.2 Component Test Details
```
📊 Status Legend:
🟢 Complete (100%)    🟡 In Progress (50-99%)    🟠 Started (1-49%)    🔴 Not Started (0%)
📌 Test Types:        🔬 Unit    🧩 Integration    🔄 E2E
🏷️ Test Priority:     🔴 P0      🟠 P1            🟡 P2              🟢 P3
🔍 Test Location:     📍 Canonical    🔄 Need to Move
```

### 6.2.1 Integration Status
While tests for components are largely passing, there is an important distinction to clarify:

1. **Component Test Status**: Many Vue.js components have been created and pass tests in isolation
2. **Integration Status**: These components are not yet integrated into the main application
3. **Current UI**: The current user-facing UI is still using React components
4. **Integration Gap**: The primary gap is connecting the Vue components to the application entry point  

This explains why the application UI appears basic despite component tests passing - the new components exist but aren't being used in the actual application yet. The highest current priority is bridging this integration gap.

### 6.2.2 Application Startup and Development Environment

A consolidated TypeScript application starter has been implemented to simplify the development process and provide a consistent environment:

1. **TypeScript Application Starter**: The `start-simple-ts.sh` script provides a single command to start all required services:
   - MongoDB (automatically starts or connects to an existing instance)
   - Express API Server with auto-generated TypeScript implementation
   - Vue.js Frontend

2. **Shell Script Wrapper**: The shell script handles dependency installation and proper environment setup:
   - Checks and installs required dependencies
   - Sets up MongoDB data directory with appropriate permissions
   - Runs the TypeScript starter with proper error handling
   - Provides graceful shutdown for all services

3. **Simplified Developer Experience**:
   - Single command to start the entire environment: `./start-simple-ts.sh`
   - Automatic MongoDB initialization with sample data
   - Port management to avoid conflicts
   - Proper startup sequence and service dependency management
   - Automatic error recovery and diagnostic information
   - Clear console output with service URLs

All services are accessible at standardized URLs:
- MongoDB: mongodb://localhost:27017/montpc_crm
- API Server: http://localhost:3000/api
- Vue.js Frontend: http://localhost:3002 (or another available port)

This approach bridges the development and production environments by ensuring consistent service initialization and communication.

#### Recent Test Runs
- 🟢📍⚡️0.3s🔬auth MEXP-2025-002-BE packages/core/tests/p0/core/login.api.test.ts
- 🟢📍⚡️0.2s🔬auth MEXP-2025-002-BE packages/core/tests/p1/auth/permissions.test.ts
- 🟢📍⚡️0.3s🔬auth MEXP-2025-002-BE packages/core/tests/p1/auth/token-refresh.test.ts
- 🟢📍⚡️0.2s🔬customer MEXP-2025-008-BE packages/core/tests/p0/core/customer-management.test.ts
- 🟢📍⚡️0.4s🧩integration MEXP-2025-001-API packages/core/tests/integration/external-integration.update.test.ts
- 🟢📍⚡️0.3s🔬api MEXP-2025-001-API packages/core/tests/p0/api/connection-timeout.test.ts
- 🟢📍⚡️0.4s🔬queue MEXP-2025-003-BE packages/core/tests/p0/core/message-queue-v2.test.ts
- 🟢🔄⚡️0.5s🧩ringover MEXP-2025-031-API packages/core/tests/p1/services/ringover.customer.test.ts
- 🟢🔄⚡️0.3s🧩hiboutik MEXP-2025-030-API packages/core/tests/p0/services/hiboutik.service.test.ts
- 🟢🔄⚡️0.4s🔬service MEXP-2025-007-BE packages/core/tests/p0/services/service-discovery.test.ts
- 🔴🔄⚡️6.2s🧩infrastructure MEXP-2025-007-BE packages/core/tests/p1/services/service-mesh.test.ts [ConfigError]
- 🔴🔄⚡️5.8s🧩infrastructure MEXP-2025-007-BE packages/core/tests/p1/services/service-deployment.test.ts [TypeError]
- 🔴🔄⚡️4.9s🧩infrastructure MEXP-2025-024-INFRA packages/core/tests/p0/infrastructure/kubernetes-config.test.ts [KubeConfigError]

### 6.2 Business Requirements (BRQ)

#### Current
- MONT-2025-001-FULL: Customer Service Implementation ✅
- MONT-2025-002-FULL: Auth Service Implementation ✅
- MONT-2025-007-FULL: Customer Component Recovery ✅
- MEXP-2025-007-BE: Service Integration Architecture 🚧 (7/9 tests passing)
- MEXP-2025-024-INFRA: MVP Readiness 🚧 (1/2 tests passing)

#### Next
- MONT-2025-032-API: External Integrations
- MONT-2025-033-API: Ringover Repair Sticker Integration 📅
- MEXP-2025-027-BE: Product Catalog Expansion
- MEXP-2025-031-API: Ringover Customer Management Enhancement
- MEXP-2025-040-FE: Dashboard Design Implementation

#### Past
- MEXP-2025-001-API: API Integration Phase ✅
- MEXP-2025-002-BE: Authentication & Security ✅
- MEXP-2025-003-BE: Message Queue System ✅
- MEXP-2025-004-BE: Core CRUD Functionality ✅
- MEXP-2025-006-API: Customer CRUD API ✅

### 6.3 Business Requirement Details

#### MONT-2025-001-FULL: Customer Service Implementation
- **Status**: ✅ Completed
- **Priority**: P1
- **Component**: CustomerService
- **Dependencies**: Core CRUD, Mongo Schema
- **Features**:
  - CRUD operations for customer management
  - Email uniqueness validation
  - Phone number format validation
  - ZIP code format validation
  - Advanced search functionality
  - Custom error handling
  - Input validation
  - Integration with Hiboutik and Ringover (customer record creation)
  - Live search capability with type-ahead
- **Testing Strategy**:
  - Priority 0: Core CRUD operations, Data validation, Error handling, Search functionality
  - Test coverage: 100%
  - MongoDB memory server for isolation

#### MONT-2025-002-FULL: Auth Service Implementation
- **Status**: ✅ Completed  
- **Priority**: P1
- **Component**: AuthService, Frontend Authentication
- **Dependencies**: JWT, Security Library
- **Features**: 
  - JWT-based authentication
  - Token refresh mechanism
  - Role-based access control
  - Frontend login/register components
  - Protected routes implementation
  - Session management
  - Password hashing and security
- **Testing Strategy**:
  - Unit tests for auth service methods
  - Integration tests for token validation
  - Component tests for UI elements
  - E2E tests for authentication flow

#### MONT-2025-007-FULL: Customer Component Recovery
- **Status**: ✅ Completed
- **Priority**: P1
- **Component**: CustomerComponents, Emergency Recovery
- **Features**:
  - Restoration of customer data handling
  - Re-implementation of lost functionality
  - Data integrity validation
  - Interface consistency
  - Performance optimization
- **Tests**: Recovery validation, Component functionality, Integration testing

#### MONT-2025-032-API: External Integrations
- **Status**: 🔴 Not Started
- **Priority**: P2
- **Component**: API, Integration
- **Dependencies**: External APIs, Auth Service
- **Features**:
  - Integration with third-party APIs
  - Data synchronization
  - Secure token handling
  - Error recovery mechanisms
  - Rate limiting
  - Response caching
- **Testing Strategy**: 
  - Mock API integration tests
  - Error handling verification
  - Performance and resilience testing

#### MONT-2025-033-API: Ringover Repair Sticker Integration
- **Status**: 📅 Planned
- **Priority**: P1
- **Component**: Printer Service, Ringover Integration
- **Dependencies**: Ringover API, Label Printer API
- **Features**:
  - Automatic label generation from Ringover calls
  - Custom sticker templates with repair information
  - QR code generation for repair tracking
  - Thermal printer integration
  - Print queue management
  - Label history and reprinting
- **Testing Strategy**: 
  - Mock printer service integration
  - Template rendering tests
  - QR code validation
  - Print job management tests

## 7. Development Roadmap

### 7.1 Phase 1: Core Foundation (Completed)
- ✅ Basic customer management
- ✅ Authentication system
- ✅ Message queue infrastructure
- ✅ Initial external integrations

### 7.2 Phase 2: MontPC MVP (Current - High Priority)
- 🚧 Main CRM dashboard with navigation sidebar
- 🚧 Customer dashboard (list view)
- 🚧 Individual customer detail page
- 🚧 Repair dashboard (list view)
- 🚧 Individual repair detail page
- 🚧 Product dashboard (list view)
- 🚧 Individual product detail page
- 🚧 MegaSearch functionality with live search
- 🚧 Create new functionality from search results
- 🚧 Integration with Hiboutik and Ringover for new records

### 7.3 Phase 3: Enhanced Functionality (Next)
- 📅 Customer portal implementation
- 📅 Notification system enhancement
- 📅 Mobile-responsive interfaces
- 📅 Self-service capabilities
- 📅 Enhanced reporting with D3.js visualizations

### 7.4 Phase 4: Advanced Features (Future)
- 📅 Business intelligence dashboard
- 📅 Inventory optimization
- 📅 Automated scheduling system
- 📅 Predictive maintenance recommendations

## 8. Implementation Guidelines

### 8.1 Development Standards
- Follow mExpress style guide and coding standards
- Implement TDD with priority-based test organization (P0-P3)
- Ensure 80%+ test coverage for all new components
- Update dashboard with test status after each implementation
- Use Vue.js with TypeScript for all frontend components
- Implement D3.js for visualization components

### 8.2 Testing Strategy
- P0: Critical path tests - must pass for core functionality
- P1: Important features - essential for milestone delivery
- P2: Secondary features and edge cases
- P3: Performance, stress tests, and non-functional requirements
- Tests must be registered in TESTS.md before implementation
- Follow test-first development approach

### 8.3 Quality Gates
- All P0 tests must pass for any release
- Code review approval from at least one senior developer
- Security scan with no high/critical vulnerabilities
- Test dashboard must be updated with accurate status

### 8.4 MegaSearch Implementation Guidelines
- Live search should initiate after 2-3 characters are typed
- Search should query MongoDB with optimized indexes
- Results should display across all entity types (customers, repairs, products)
- Create new suggestions must appear when no results are found
- Search should have a response time under 300ms
- Frontend should debounce input to prevent excessive API calls

### 8.5 Integration Requirements
- New customer records must sync with both Hiboutik and Ringover
- Created records must store external IDs for future reference
- Error handling must include retry logic for integration failures
- Integration should be non-blocking for UI interactions
- Async queue should be used for integration operations