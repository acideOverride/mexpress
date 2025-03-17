# MontPC Website Architecture Blueprint

<!-- 
══════════════════════════════════════════════════════════════════════════════
⚠️ DO NOT MODIFY SECTION ⚠️
══════════════════════════════════════════════════════════════════════════════

Architecture documents serve as the immutable blueprint that defines the system's
vision, architecture, and components. Any changes to architectural decisions require
careful consideration and approval.

This section contains protected content that MUST NOT be modified without proper
review and explicit approval. It defines core architectural standards that all
development must adhere to.

ARCHITECTURE COMPLIANCE RULES:

1. All development MUST follow the standards-lite framework:
   - /opt/mExpress/docs/standards/lite/COMPONENT_STANDARDS.md
   - /opt/mExpress/docs/standards/lite/API_STANDARDS.md
   - /opt/mExpress/docs/standards/lite/TS_CODE_STANDARDS.md
   - /opt/mExpress/docs/standards/lite/JEST_CONFIGURATION_STANDARDS.md
   - /opt/mExpress/docs/standards/lite/DOCUMENTATION_STANDARDS.md
   - /opt/mExpress/docs/standards/lite/DIRECTORY_STRUCTURE.md
   - /opt/mExpress/docs/standards/lite/TDD_WORKFLOW.md
   - /opt/mExpress/docs/standards/lite/CI_CD_STANDARDS.md

2. All development MUST follow the TDD workflow:
   - RED phase (test creation) first
   - GREEN phase (implementation) second
   - REFACTOR phase (optimization) third

3. All development MUST maintain AMTC documentation:
   - Architecture (this document)
   - Milestones (MILESTONES.md)
   - Tasks (TASKS.md)
   - Checklists (CHECKLIST.md)

These rules are considered immutable and form the foundation for all development
decisions and implementations.

══════════════════════════════════════════════════════════════════════════════
-->

## 1. System Overview

### 1.1 Vision Statement
MontPC Website is a comprehensive web platform built on the mExpress platform. It provides a sophisticated, fashion-forward digital presence for a premium tech repair business, combining high-end aesthetics with playful elements to create a memorable user experience while serving as the public frontend for the MontPC CRM system.

### 1.2 Architectural Principles
- **Design Fusion**: Blend sophisticated fashion-inspired design with playful Sanrio-like elements
- **Responsive and Adaptive**: Ensure perfect experience across all device sizes and types
- **Multilingual Support**: Support English and French versions with consistent branding
- **Interactive Excellence**: Implement subtle, delightful interactions that enhance usability
- **Performance-First**: Prioritize loading speed and performance metrics for all features

### 1.3 Technology Stack
- **Frontend**: Vue.js, TypeScript, Tailwind CSS (aligned with MontPC CRM)
- **Backend**: Node.js with Express (API endpoints)
- **Database**: MongoDB for form submissions and chat history (shared with MontPC CRM)
- **API Layer**: RESTful API for chatbot and form submissions
- **Message Bus**: Socket.io for real-time chat functionality
- **Infrastructure**: Docker containers, Nginx for serving static content
- **Monitoring**: Google Analytics, custom performance monitoring
- **Testing**: Jest, Vue Testing Library
- **Visualization**: Vue-based interactive components, D3.js for animations

## 2. Core Components

### 2.1 API Layer
- **Chat API**: Endpoints for chatbot conversation flow and message handling
- **Forms API**: Secure submission handling for contact and appointment forms
- **Analytics API**: Collection of user interaction data for performance optimization
- **Language API**: Endpoints for dynamic language switching and content loading
- **Notification API**: Real-time service updates and appointment confirmations

### 2.2 Service Layer
- **Chat Service**: Processes conversational logic and provides contextual responses
- **Appointment Service**: Manages scheduling, availability and confirmation
- **Form Processing Service**: Validates inputs and manages form submissions
- **Theme Service**: Handles theme switching and preference storage
- **Analytics Service**: Tracks user behavior patterns and site performance

### 2.3 Data Layer
- **Chat Repository**: Stores conversation history and contexts
- **Appointment Repository**: Manages scheduling data and availability
- **User Preferences Repository**: Stores theme preferences and settings
- **Service Catalog**: Maintains repair service details and pricing
- **Testimonial Repository**: Manages customer testimonials and ratings

### 2.4 Infrastructure Components
- **Static Asset CDN**: Optimized delivery of images and static resources
- **Web Server**: Nginx configuration for optimal performance
- **Containerization**: Docker setup for consistent environments
- **CI/CD Pipeline**: Automated testing and deployment workflow
- **Monitoring Stack**: Performance and error tracking system

### 2.5 UI Components
- **Theme Toggle**: Light/dark mode switch with smooth transitions
- **Magnetic Cards**: Interactive service cards with hover effects
- **Custom Cursor**: Fashion-inspired cursor effects on desktop
- **Animated Gallery**: Image showcase with interactive elements
- **Chatbot Interface**: Interactive conversation component with rich responses

## 3. System Integrations

### 3.1 External Services
- **Google Analytics**: User behavior tracking and analytics
- **Google Maps API**: Location display for physical store
- **Customer Review APIs**: Integration with Google and Yelp reviews
- **Social Media APIs**: Social sharing and feed integration
- **Payment Gateway**: For pre-payment of repair services

### 3.2 Integration Patterns
- **REST API**: Standard HTTP methods for data exchange
- **WebSockets**: Real-time bidirectional communication for chat
- **OAuth 2.0**: Secure authentication for third-party services
- **Webhook Notifications**: Event-driven updates for appointments

## 4. Business Domains

### 4.1 Main Website
- **Hero Section**: Dynamic showcase with animation and CTAs
- **Service Cards**: Interactive display of repair service options
- **Testimonial Carousel**: Customer review showcase with navigation
- **Contact Form**: Validated form with secure submission
- **Image Gallery**: Portfolio of repair work with filtering options

### 4.2 Chatbot Assistant
- **Chat Interface**: Conversational UI with rich message formatting
- **Quick Reply Chips**: Tap/click options for common responses
- **Service Cards**: Rich message cards displaying service options
- **Appointment Booking**: In-chat appointment scheduling flow
- **Context Panel**: Supplementary information display alongside chat

### 4.3 Multilingual Support
- **Language Toggle**: Switch between English and French interfaces
- **Localized Content**: Culturally appropriate content variations
- **Translated Resources**: All text elements available in both languages
- **Locale Detection**: Automatic language selection based on browser settings
- **Consistent Branding**: Visual identity maintained across language versions

### 4.4 Administrative Functions
- **Form Submission Dashboard**: View and manage contact requests
- **Appointment Calendar**: Manage and track scheduled appointments
- **Content Management**: Update service information and pricing
- **Analytics Dashboard**: View site performance and user behavior
- **Chatbot Training**: Improve chatbot responses based on interactions

## 5. Cross-Cutting Concerns

### 5.1 Security
- **Form Validation**: Client and server-side validation for all inputs
- **CSRF Protection**: Cross-site request forgery prevention
- **Content Security Policy**: Restrict resource loading to trusted sources
- **Rate Limiting**: Prevent abuse of API endpoints and forms

### 5.2 Performance
- **Image Optimization**: WebP format with appropriate sizing and compression
- **Code Splitting**: Load JavaScript resources as needed
- **Critical CSS**: Inline critical styles for faster initial rendering
- **Lazy Loading**: Defer non-critical resources and imagery

### 5.3 Resilience
- **Graceful Degradation**: Ensure core functionality works without JS
- **Error Handling**: Comprehensive error handling and user feedback
- **Offline Capability**: Basic functionality available offline
- **Browser Compatibility**: Support for all modern browsers

### 5.4 Observability
- **Performance Monitoring**: Core Web Vitals tracking and reporting
- **Error Tracking**: Capture and report JavaScript errors
- **User Journey Analysis**: Track user paths through the site
- **A/B Testing Framework**: Test different design and content variations

## 6. Implementation Status

### 6.1 BRQ Test Status

#### Core Website
| Status | BRQ | Component | Tests | Priority | Progress |
|:------:|-----|-----------|:-----:|:--------:|:--------:|
| 🔴 | MONT-2025-001-FE | Core Website Structure | 0/10 | P0 | 0% |
| 🔴 | MONT-2025-002-FE | Responsive Design | 0/8 | P0 | 0% |
| 🔴 | MONT-2025-003-FE | Theme Toggle | 0/5 | P0 | 0% |

#### Interactive Elements
| Status | BRQ | Component | Tests | Priority | Progress |
|:------:|-----|-----------|:-----:|:--------:|:--------:|
| 🔴 | MONT-2025-004-FE | Custom Cursor | 0/3 | P1 | 0% |
| 🔴 | MONT-2025-005-FE | Service Cards | 0/5 | P0 | 0% |

#### Chatbot
| Status | BRQ | Component | Tests | Priority | Progress |
|:------:|-----|-----------|:-----:|:--------:|:--------:|
| 🔴 | MONT-2025-006-FULL | Chatbot Interface | 0/7 | P1 | 0% |
| 🔴 | MONT-2025-007-BE | Chat API | 0/6 | P1 | 0% |

#### Forms & Data
| Status | BRQ | Component | Tests | Priority | Progress |
|:------:|-----|-----------|:-----:|:--------:|:--------:|
| 🔴 | MONT-2025-008-FE | Contact Form | 0/4 | P0 | 0% |
| 🔴 | MONT-2025-009-BE | Form Submission API | 0/4 | P0 | 0% |

### 6.2 Component Test Details
```
📊 Status Legend:
🟢 Complete (100%)    🟡 In Progress (50-99%)    🟠 Started (1-49%)    🔴 Not Started (0%)
📌 Test Types:        🔬 Unit    🧩 Integration    🔄 E2E
🏷️ Test Priority:     🔴 P0      🟠 P1            🟡 P2              🟢 P3
🔍 Test Location:     📍 Canonical    🔄 Need to Move
```

### 6.3 Business Requirements (BRQ)

#### Current
- MONT-2025-001-FE: Core Website Structure Implementation 🔴
- MONT-2025-002-FE: Responsive Design Implementation 🔴
- MONT-2025-003-FE: Theme Toggle Functionality 🔴

#### Next
- MONT-2025-005-FE: Service Cards Implementation 📅
- MONT-2025-008-FE: Contact Form Implementation 📅
- MONT-2025-009-BE: Form Submission API 📅

## 7. Development Roadmap

### 7.1 Phase 1: Core Website
- 🔴 Implement base Vue.js structure and components
- 🔴 Create responsive CSS framework with Tailwind design system
- 🔴 Develop theme toggle functionality
- 🔴 Implement service card components

### 7.2 Phase 2: Interactive Elements
- 📅 Custom cursor implementation for desktop
- 📅 Magnetic hover effects for interactive elements
- 📅 Testimonial slider and gallery
- 📅 Scroll-based animations and reveals

### 7.3 Phase 3: Chatbot Integration
- 📅 Chatbot UI implementation
- 📅 Chat logic and response system
- 📅 Rich message cards for services
- 📅 Appointment booking flow in chat

### 7.4 Phase 4: Multilingual Support
- 📅 French language implementation
- 📅 Language toggle functionality
- 📅 Content localization system
- 📅 Admin dashboard and CMS

## 8. Implementation Guidelines

### 8.1 Development Standards

#### 8.1.1 Standard Documents
All development must adhere to the mExpress standard documents located in `/opt/mExpress/docs/standards/lite/`:

- **COMPONENT_STANDARDS.md**: Vue.js component architecture and best practices
- **API_STANDARDS.md**: RESTful API design and implementation guidelines
- **TS_CODE_STANDARDS.md**: TypeScript coding standards and practices
- **JEST_CONFIGURATION_STANDARDS.md**: Test configuration and organization
- **DOCUMENTATION_STANDARDS.md**: Documentation requirements and formats
- **DIRECTORY_STRUCTURE.md**: Project organization and file structure
- **TDD_WORKFLOW.md**: Test-driven development workflow
- **CI_CD_STANDARDS.md**: Continuous integration and deployment standards

#### 8.1.2 Component Registry and Reuse

##### Component Registry System
The mExpress platform provides a component registry system for shared component discovery and reuse:

- **COMPONENT_REGISTRY.md**: `/opt/mExpress/docs/mexpress/COMPONENT_REGISTRY.md` - Complete inventory of shared components
- **SHARED_COMPONENTS.md**: `/opt/mExpress/docs/mexpress/SHARED_COMPONENTS.md` - Quick reference guide

All MontPC Website development must:

1. **Check Registry First**: 
   - Before designing new components, check existing registry
   - Use: `grep -i "[keyword]" /opt/mExpress/docs/mexpress/COMPONENT_REGISTRY.md`
   - Reuse components whenever possible to maintain consistency

2. **Registry Research Process**:
   - Add component registry check to CHECKLIST.md
   - Reference previous implementations in `/opt/mExpress/docs/{project}/checklist_history/`
   - Document reused components in architecture proposals

3. **Registry Update Process**:
   - After implementing a reusable component, update registry as final step
   - Both COMPONENT_REGISTRY.md and SHARED_COMPONENTS.md updated in same commit
   - Update occurs before marking task as completed

4. **Component Classification**:
   - MontPC-specific components: Stored in project directories
   - Reusable components: Promoted to mExpress shared layer
   - Promotion criteria: 90%+ test coverage, proper documentation, used in 2+ projects

##### Core Development Principles
- Follow the TDD workflow (RED-GREEN-REFACTOR) for all implementations
- Organize tests by priority (P0-P3) in the appropriate directories
- Ensure 80%+ test coverage for all new components
- Update test dashboard after each implementation
- Use Vue.js with TypeScript for all frontend components
- Create CHECKLIST.md files for task implementation tracking

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