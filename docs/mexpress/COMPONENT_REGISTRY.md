# mExpress Component Registry

<!-- 
══════════════════════════════════════════════════════════════════════════════
⚠️ DO NOT MODIFY SECTION ⚠️
══════════════════════════════════════════════════════════════════════════════

This file serves as the central registry of all shared components in the mExpress
ecosystem. It provides a single source of truth for component availability,
status, and usage across projects.

REGISTRY MAINTENANCE RULES:

1. Components must be classified correctly:
   - CORE: Essential foundation components used across projects
   - UI: User interface components in the shared layer
   - UTILITY: Helper components and functions
   - SERVICE: Shared services and API clients

2. Component status must be accurately maintained:
   - ✅ STABLE: Production-ready with full test coverage
   - 🟡 BETA: Working but may have API changes
   - 🟠 ALPHA: Early development, expect breaking changes
   - ⚠️ DEPRECATED: Will be removed in future version

3. Updates to this registry must include:
   - Documentation links
   - Usage examples
   - Project usage indicators

These rules ensure component discoverability and reuse across projects.

══════════════════════════════════════════════════════════════════════════════
-->

## Component Status Summary

| Category | Total | Stable | Beta | Alpha | Deprecated |
|----------|-------|--------|------|-------|------------|
| Core     | 12    | 11     | 1    | 0     | 0          |
| UI       | 54    | 36     | 16   | 2     | 0          |
| Utility  | 15    | 12     | 2    | 0     | 1          |
| Service  | 14    | 8      | 5    | 1     | 0          |
| **Total**    | **95**   | **67**    | **24**   | **3**     | **1**         |

## Project Usage

| Project       | Components Used | Coverage % |
|---------------|----------------|------------|
| MontPC CRM    | 72/95          | 76%        |
| Jerome Bikes  | 61/95          | 64%        |
| Giandra Photos| 41/95          | 43%        |

## Core Components

### Data & State Management

| Component        | Status | Projects Using       | Location                          | Description                         |
|------------------|--------|----------------------|-----------------------------------|-------------------------------------|
| DataStore        | ✅     | All                  | packages/core/data/DataStore      | Reactive data store with persistence |
| StateManager     | ✅     | All                  | packages/core/state/StateManager  | Global state management solution     |
| ApiClient        | ✅     | All                  | packages/core/api/ApiClient       | RESTful API client with interceptors |
| EntityStore      | ✅     | All                  | packages/core/data/EntityStore    | Entity-based data management         |
| MessageQueue     | ✅     | MontPC, Jerome       | packages/core/messaging/Queue     | In-memory message queue with persist |
| CacheManager     | ✅     | All                  | packages/core/cache/CacheManager  | Tiered caching system                |
| ConfigManager    | ✅     | All                  | packages/core/config/Manager      | Environment-aware configuration      |
| SearchProvider   | 🟡     | MontPC, Giandra      | packages/core/search/Provider     | Full-text search with indexing       |

### Authentication & Security

| Component        | Status | Projects Using       | Location                          | Description                         |
|------------------|--------|----------------------|-----------------------------------|-------------------------------------|
| AuthService      | ✅     | All                  | packages/core/auth/AuthService    | Authentication service with JWT, refresh tokens, role management, and email verification |
| PermissionManager| ✅     | All                  | packages/core/auth/Permissions    | Role-based access control system    |
| TokenManager     | ✅     | All                  | packages/core/auth/TokenManager   | JWT token handling and refresh       |
| SecureStorage    | ✅     | MontPC, Jerome       | packages/core/security/Storage    | Encrypted local storage utility      |

## UI Components

### Basic Elements

| Component        | Status | Projects Using       | Location                            | Description                         |
|------------------|--------|----------------------|-------------------------------------|-------------------------------------|
| Button           | ✅     | All                  | packages/ui-components/Button       | Primary action button with variants  |
| Input            | ✅     | All                  | packages/ui-components/Input        | Text input with validation           |
| Select           | ✅     | All                  | packages/ui-components/Select       | Dropdown select with search          |
| Checkbox         | ✅     | All                  | packages/ui-components/Checkbox     | Checkbox input with label            |
| Radio            | ✅     | All                  | packages/ui-components/Radio        | Radio button group                   |
| Switch           | ✅     | All                  | packages/ui-components/Switch       | Toggle switch control                |
| TextArea         | ✅     | All                  | packages/ui-components/TextArea     | Multi-line text input                |

### Layout Components

| Component        | Status | Projects Using       | Location                            | Description                         |
|------------------|--------|----------------------|-------------------------------------|-------------------------------------|
| Card             | ✅     | All                  | packages/ui-components/Card         | Content container with header/footer |
| Grid             | ✅     | All                  | packages/ui-components/Grid         | CSS Grid layout system               |
| Flex             | ✅     | All                  | packages/ui-components/Flex         | Flexbox container component          |
| Divider          | ✅     | All                  | packages/ui-components/Divider      | Horizontal/vertical content divider  |
| Spacer           | ✅     | All                  | packages/ui-components/Spacer       | Gap/spacing utility component        |
| Container        | ✅     | All                  | packages/ui-components/Container    | Responsive container with max-width  |
| AppLayout        | 🟡     | MontPC               | projects/montpc_crm/frontend/src/vue-components/layout/AppLayout.vue | Application layout with sidebar, header, and content areas |
| MainLayout       | 🟡     | Jerome, MontPC       | projects/jerome_bikes/src/frontend/layouts/MainLayout.vue | Main layout with responsive header, footer, and navigation |

### Navigation Components

| Component        | Status | Projects Using       | Location                            | Description                         |
|------------------|--------|----------------------|-------------------------------------|-------------------------------------|
| Menu             | ✅     | MontPC, Jerome       | packages/ui-components/Menu         | Multi-level menu system              |
| Tabs             | ✅     | All                  | packages/ui-components/Tabs         | Tabbed interface component           |
| Breadcrumbs      | ✅     | All                  | packages/ui-components/Breadcrumbs  | Navigation breadcrumbs               |
| Pagination       | ✅     | All                  | packages/ui-components/Pagination   | Paged content navigation             |
| Sidebar          | ✅     | MontPC, Giandra      | packages/ui-components/Sidebar      | Collapsible sidebar navigation       |
| Navbar           | ✅     | All                  | packages/vue-components/src/components/navigation/Navbar.vue | Top navigation bar with responsive design |
| NavMenu          | ✅     | All                  | packages/vue-components/src/components/navigation/NavMenu.vue | Navigation menu with horizontal/vertical modes |
| NavItem          | ✅     | All                  | packages/vue-components/src/components/navigation/NavItem.vue | Navigation item with active state and badges |
| Drawer           | ✅     | All                  | packages/vue-components/src/components/navigation/Drawer.vue | Slide-out drawer for navigation and content |
| RouterLink       | ✅     | All                  | packages/vue-components/src/components/navigation/RouterLink.vue | Enhanced Vue Router link with active state detection |

### Data Display

| Component        | Status | Projects Using       | Location                            | Description                         |
|------------------|--------|----------------------|-------------------------------------|-------------------------------------|
| Table            | ✅     | All                  | packages/vue-components/src/components/ui/Table.vue | Enhanced data table with theme support, keyboard navigation, column resizing, data export, row expansion and advanced filtering |
| List             | ✅     | All                  | packages/ui-components/List         | Basic and advanced list component    |
| Avatar           | ✅     | All                  | packages/ui-components/Avatar       | User avatar with image/initials      |
| Badge            | ✅     | All                  | packages/ui-components/Badge        | Status indicator badge               |
| Tag              | ✅     | All                  | packages/ui-components/Tag          | Category/label tag component         |
| Timeline         | 🟡     | MontPC, Jerome       | packages/ui-components/Timeline     | Vertical/horizontal timeline         |
| Chart            | 🟡     | MontPC               | packages/ui-components/Chart        | D3-based chart components            |
| StatusIndicator  | 🟡     | MontPC, Jerome       | packages/ui-components/Status       | Color-coded status display           |

### Dashboard Components

| Component        | Status | Projects Using       | Location                                         | Description                                 |
|------------------|--------|----------------------|--------------------------------------------------|---------------------------------------------|
| AuthGuard        | ✅     | MontPC, Jerome       | projects/jerome_bikes/src/frontend/router/auth-guard.ts | Route protection with role-based access control |
| StatusCard       | 🟡     | MontPC               | projects/montpc_crm/frontend/src/vue-components/ui/StatusCard.vue | Status display card with icon, count, and label |
| CommunicationStatusPanel | 🟡 | MontPC           | projects/montpc_crm/frontend/src/vue-components/ui/CommunicationStatusPanel.vue | Grid container for status cards with title |
| PriorityCommunications | 🟡 | MontPC             | projects/montpc_crm/frontend/src/vue-components/ui/PriorityCommunications.vue | Prioritized notification list with actions |
| RepairTimeline   | 🟡     | MontPC               | projects/montpc_crm/frontend/src/vue-components/ui/RepairTimeline.vue | Timeline display for repair tickets with filtering |
| RepairTimelineItem | 🟡   | MontPC               | projects/montpc_crm/frontend/src/vue-components/ui/RepairTimelineItem.vue | Individual repair timeline entry with status |
| ProductDashboard | 🟡     | MontPC               | projects/montpc_crm/frontend/src/vue-components/products/ProductDashboard.vue | Comprehensive product inventory management with table, filtering, search, and detail view |
| ProductDetail    | 🟡     | MontPC               | projects/montpc_crm/frontend/src/vue-components/products/ProductDetail.vue | Detailed product information display with editing capabilities, validation, and related products |

### Feedback Components

| Component        | Status | Projects Using       | Location                            | Description                         |
|------------------|--------|----------------------|-------------------------------------|-------------------------------------|
| Modal            | ✅     | All                  | packages/vue-components/src/components/ui/Modal.vue | Enhanced modal with accessibility, focus trapping, and transitions |
| Toast            | ✅     | All                  | packages/vue-components/src/components/ui/Toast.vue | Toast notification with auto-dismiss and positions |
| Notification     | ✅     | All                  | packages/vue-components/src/components/ui/Notification.vue | Notification container with stacking support |
| Alert            | ✅     | All                  | packages/vue-components/src/components/ui/Alert.vue | Status alert messages with multiple styles |
| Popover          | ✅     | All                  | packages/ui-components/Popover      | Information popover                  |
| Tooltip          | ✅     | All                  | packages/ui-components/Tooltip      | Hover tooltip component              |
| Dialog           | ✅     | All                  | packages/vue-components/src/components/ui/Dialog.vue | Dialog system with alert, confirm, and prompt variants |
| DialogService    | ✅     | All                  | packages/vue-components/src/services/DialogService.ts | Programmatic dialog service with Promise API |
| NotificationService | ✅  | All                  | packages/vue-components/src/services/NotificationService.ts | Programmatic notification management service |
| Skeleton         | 🟡     | MontPC, Giandra      | packages/ui-components/Skeleton     | Loading skeleton placeholder         |
| ProgressBar      | 🟡     | Jerome, Giandra      | packages/ui-components/Progress     | Progress indicator component         |
| ActionButton     | ✅     | MontPC, Jerome       | projects/montpc_crm/frontend/src/vue-components/ui/ActionButton.vue | Button with icon and text for common actions |
| StatusBadge      | ✅     | MontPC, Jerome       | projects/montpc_crm/frontend/src/vue-components/ui/StatusBadge.vue | Status indicator with color and label |
| ThemeToggle      | ✅     | MontPC               | projects/montpc_crm/frontend/src/vue-components/ui/ThemeToggle.vue | Theme switching button for light/dark modes |
| UserAvatar       | ✅     | MontPC               | projects/montpc_crm/frontend/src/vue-components/ui/UserAvatar.vue | User avatar with image or initials and status |
| NotificationItem | ✅     | MontPC               | projects/montpc_crm/frontend/src/vue-components/ui/NotificationItem.vue | Notification with priority, title, and actions |
| LoginForm        | ✅     | Jerome, MontPC       | projects/jerome_bikes/src/frontend/views/Login.vue | Authentication form with validation and error handling |
| RegisterForm     | ✅     | Jerome, MontPC       | projects/jerome_bikes/src/frontend/views/Register.vue | Registration form with validation and Terms of Service acceptance |
| ForgotPassword   | ✅     | Jerome, MontPC       | projects/jerome_bikes/src/frontend/views/ForgotPassword.vue | Password reset workflow with email verification |
| EmailVerification| ✅     | Jerome               | projects/jerome_bikes/src/frontend/views/VerifyEmail.vue | Email verification component with resend capability |
| ProfileManagement| ✅     | Jerome, MontPC       | projects/jerome_bikes/src/frontend/views/Profile.vue | User profile management with password change |

## Utility Components

### Form Utilities

| Component        | Status | Projects Using       | Location                           | Description                         |
|------------------|--------|----------------------|------------------------------------|-------------------------------------|
| FormBuilder      | ✅     | All                  | packages/utils/form/FormBuilder    | Declarative form generation          |
| FormValidator    | ✅     | All                  | packages/utils/form/Validator      | Form validation system               |
| InputMask        | ✅     | All                  | packages/utils/form/InputMask      | Input masking utility                |
| AutoForm         | 🟡     | MontPC, Jerome       | packages/utils/form/AutoForm       | Schema-driven form generation        |

### Date & Time Utilities

| Component        | Status | Projects Using       | Location                           | Description                         |
|------------------|--------|----------------------|------------------------------------|-------------------------------------|
| DatePicker       | ✅     | All                  | packages/utils/date/DatePicker     | Date selection component             |
| DateFormatter    | ✅     | All                  | packages/utils/date/Formatter      | Date formatting utility              |
| TimeAgo          | ✅     | All                  | packages/utils/date/TimeAgo        | Relative time component              |
| Calendar         | ✅     | Jerome, Giandra      | packages/utils/date/Calendar       | Interactive calendar component       |

### Media Utilities

| Component        | Status | Projects Using       | Location                           | Description                         |
|------------------|--------|----------------------|------------------------------------|-------------------------------------|
| ImageLoader      | ✅     | All                  | packages/utils/media/ImageLoader   | Progressive image loading utility    |
| MediaViewer      | ✅     | MontPC, Giandra      | packages/utils/media/MediaViewer   | Multi-format media viewer            |
| FileUploader     | ✅     | All                  | packages/utils/media/FileUploader  | Drag & drop file upload component    |
| ImageEditor      | 🟠     | Giandra              | packages/utils/media/ImageEditor   | Basic image editing capability       |

### Miscellaneous Utilities

| Component        | Status | Projects Using       | Location                           | Description                         |
|------------------|--------|----------------------|------------------------------------|-------------------------------------|
| CodeHighlighter  | ✅     | MontPC               | packages/utils/code/Highlighter    | Syntax highlighting component        |
| ColorPicker      | ✅     | Giandra              | packages/utils/color/ColorPicker   | Color selection component            |
| VirtualScroller  | ✅     | All                  | packages/utils/scroll/VirtualScroll| Virtualized scrolling for large lists|
| MarkdownRenderer | ⚠️     | MontPC               | packages/utils/markdown/Renderer   | Markdown to HTML renderer (deprecated)|

## Service Components

### API Services

| Component        | Status | Projects Using       | Location                           | Description                         |
|------------------|--------|----------------------|------------------------------------|-------------------------------------|
| RestClient       | ✅     | All                  | packages/services/api/RestClient   | RESTful API client                   |
| GraphQLClient    | ✅     | MontPC               | packages/services/api/GraphQLClient| GraphQL API client                   |
| ApiCache         | ✅     | All                  | packages/services/api/ApiCache     | API response caching service         |
| WebSocketClient  | 🟡     | Jerome, Giandra      | packages/services/api/WebSocket    | WebSocket client with reconnection   |
| ApiService       | 🟡     | Jerome, MontPC       | projects/jerome_bikes/src/frontend/services/api.service.ts | Enhanced Axios-based API client with interceptors |
| BikeService      | 🟡     | Jerome               | projects/jerome_bikes/src/frontend/services/bike.service.ts | API client for bike entity operations |
| ReservationService | 🟡   | Jerome               | projects/jerome_bikes/src/frontend/services/reservation.service.ts | API client for reservation management |

### Integration Services

| Component        | Status | Projects Using       | Location                               | Description                         |
|------------------|---------|--------------------|---------------------------------------|-------------------------------------|
| NotificationService | ✅  | All                 | packages/services/integration/Notification | Push notification service            |
| MapService       | ✅     | Jerome              | packages/services/integration/Map      | Map integration service              |
| PaymentService   | ✅     | Giandra             | packages/services/integration/Payment  | Payment gateway integration          |
| AnalyticsService | ✅     | All                 | packages/services/integration/Analytics| User analytics integration service   |
| EmailService     | 🟡     | All                 | packages/email-service                | Provider-agnostic email service with templating |
| ExternalAuthService | 🟠  | MontPC              | packages/services/integration/ExternalAuth | OAuth provider integration service   |

## Adding New Components

To propose a component for sharing across projects:

1. Check if similar component exists in this registry
2. Extract component removing project-specific dependencies
3. Create tests following Jest standards
4. Update this registry with component information
5. Create PR for review and inclusion

## Component Promotion Criteria

For project components to be promoted to shared components:

1. Component must be used in at least 2 projects
2. Component must have no project-specific business logic
3. Component must have 90%+ test coverage
4. Component must follow shared component standards
5. Component must have proper documentation

This registry is updated monthly to reflect new shared components.