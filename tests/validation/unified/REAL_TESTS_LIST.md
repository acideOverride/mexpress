# Complete List of Real Test Files

This report lists all actual test files found in the codebase:
- 🔢 - Test with known priority (P0-P3)
- ❔ - Test with unknown priority 
- 📍 - Test is in project-specific test directory (correct location)
- 🚚 - Test needs to be moved from centralized location to project-specific location
- 📦 - Component area (core, auth, api, etc.)
- 🧪 - Test type (unit, integration, e2e)
- 📝 - JavaScript file (.js) - MIGRATION REQUIRED ⚠️
- 📘 - TypeScript file (.ts) - PREFERRED ✓
- 📗 - React TypeScript file (.tsx) - PREFERRED ✓
- 📙 - React JavaScript file (.jsx) - MIGRATION REQUIRED ⚠️
- 👯 - Duplicate test (same name in both JS and TS) - JS VERSION SHOULD BE REMOVED ⚠️

## Tests By Priority
Tests are sorted by priority (P0-P3) to help guide migration efforts

### P0 (Critical) Tests

🔢📍 📘 📦:api 🧪:unit /opt/mExpress/packages/core/tests/p0/api/connection-timeout.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/core/customer-management.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/core/event-handler.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/core/every.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/core/git-workflow.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/core/istio-client.additional.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/core/istio-client.test.ts
🔢📍 📘 📦:api 🧪:unit /opt/mExpress/packages/core/tests/p0/core/login.api.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/core/message-delivery-confirmation.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/core/message-queue/message-state-manager.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/core/message-queue-v2.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/core/security.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/core/service-discovery.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/core/time-provider.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/core/transaction-rollback.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/core/value-to-string.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/infrastructure/kubernetes-config.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/services/catalog-event.service.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/services/customer.service.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/services/debug-hiboutik.test.ts
🔢📍 📘 📦:auth 🧪:unit /opt/mExpress/packages/core/tests/p0/services/hiboutik.auth.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/services/hiboutik.service.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/services/product.service.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/services/ringover.service.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/sync.service.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p0/validation/customerValidation.test.ts
🔢📍 📘 📦:auth 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p0/api/interceptors/auth.interceptor.test.ts
🔢📍 📘 📦:auth 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p0/api/services/auth.service.test.ts
🔢📍 📗 📦:auth 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p0/auth/login.ui.test.tsx
🔢📍 📗 📦:frontend 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p0/components/dashboard.test.tsx
🔢📍 📗 📦:core 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p0/core/CustomerDetail.test.tsx

### P1 (High Priority) Tests

🔢📍 📘 📦:api 🧪:unit /opt/mExpress/packages/core/tests/p1/api/retry-logic.test.ts
🔢📍 📘 📦:auth 🧪:unit /opt/mExpress/packages/core/tests/p1/auth/permissions.test.ts
🔢📍 📘 📦:auth 🧪:unit /opt/mExpress/packages/core/tests/p1/auth/token-refresh.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p1/core/concurrent-modification.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p1/core/pipeline.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p1/core/queue-persistence.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p1/frontend/component-tests.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p1/infrastructure/kubernetes-config.test.ts
🔢📍 📘 📦:core 🧪:integration /opt/mExpress/packages/core/tests/p1/integration/core/external-integration.update.test.ts
🔢📍 📘 📦:core 🧪:integration /opt/mExpress/packages/core/tests/p1/integration/external-integration.update.test.ts
🔢📍 📘 📦:core 🧪:integration /opt/mExpress/packages/core/tests/p1/integration/infrastructure/container-orchestrator-integration.test.ts
🔢📍 📘 📦:core 🧪:integration /opt/mExpress/packages/core/tests/p1/integration/infrastructure/external-integration.core.test.ts
🔢📍 📘 📦:core 🧪:integration /opt/mExpress/packages/core/tests/p1/integration/infrastructure/external-integration.update.test.ts
🔢📍 📘 📦:core 🧪:integration /opt/mExpress/packages/core/tests/p1/integration/infrastructure/pipeline-integration.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p1/megasearch/mongodb-text-search.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p1/services/category-events.test.ts
🔢📍 📘 📦:auth 🧪:unit /opt/mExpress/packages/core/tests/p1/services/cross-service-auth.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p1/services/customer-validation.service.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p1/services/product-events.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p1/services/ringover.customer.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p1/services/service-deployment.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p1/services/service-mesh.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p1/services/sync.customer.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p1/services/test.service.ts
🔢📍 📘 📦:utils 🧪:unit /opt/mExpress/packages/utils/tests/p1/lib/resilience/circuit-breaker.test.ts
🔢📍 📘 📦:utils 🧪:unit /opt/mExpress/packages/utils/tests/p1/lib/resilience/rate-limiter.resilience.test.ts
🔢📍 📘 📦:utils 🧪:unit /opt/mExpress/packages/utils/tests/p1/lib/resilience/retry-strategy.test.ts
🔢📍 📘 📦:services 🧪:integration /opt/mExpress/projects/montpc_crm/tests/backend/p1/services/external-integration.project.test.ts
🔢📍 📝 📦:api 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/interceptors/basic-test.js
🔢📍 📘 📦:api 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/interceptors/error.interceptor.test.ts
🔢📍 📘 📦:api 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/interceptors/index.test.ts
🔢📍 📝 📦:api 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/interceptors/mock-test.js
🔢📍 📘 📦:api 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/services/customers.service.test.ts
🔢📍 📘 📦:api 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/services/products.service.test.ts

### P2 (Medium Priority) Tests

🔢📍 📘 📦:api 🧪:unit /opt/mExpress/packages/core/tests/p2/api/edge-cases.test.ts
🔢📍 📘 📦:auth 🧪:unit /opt/mExpress/packages/core/tests/p2/auth/multi-login.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p2/core/bulk-operations.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p2/core/called-in-order.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p2/core/class-name.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p2/core/copy-prototype-methods.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p2/core/customer.unit.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p2/core/function-name.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p2/core/message-queue-recovery.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p2/core/mobile-viewport.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p2/core/order-by-first-call.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p2/core/product.test.ts
🔢📍 📝 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p2/core/run-called-in-order-test.js
🔢📍 📝 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p2/core/run-message-queue-recovery-test.js
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p2/core/type-of.test.ts
🔢📍 📗 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p2/frontend/components/mobile/responsive-layout.test.tsx
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p2/reconciliation-tools/componentScanner.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p2/reconciliation-tools/matrixTracker.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p2/services/data-consistency.test.ts
🔢📍 📘 📦:utils 🧪:unit /opt/mExpress/packages/utils/tests/p2/lib/monitoring/monitoring.system.test.ts
🔢📍 📝 📦:utils 🧪:unit /opt/mExpress/packages/utils/tests/p2/lib/monitoring/run-monitoring-test.js
🔢📍 📘 📦:utils 🧪:unit /opt/mExpress/packages/utils/tests/p2/utils/logger.test.ts
🔢📍 📝 📦:utils 🧪:unit /opt/mExpress/packages/utils/tests/p2/utils/run-logger-test.js
🔢📍 📝 📦:utils 🧪:unit /opt/mExpress/packages/utils/tests/p2/utils/temp-logger-test.js
🔢📍 📘 📦:unknown 🧪:unit /opt/mExpress/packages/vue-components/tests/p2/components/layout/DashboardLayout.test.ts
🔢📍 📝 📦:unknown 🧪:unit /opt/mExpress/packages/vue-components/tests/p2/components/layout/run-dashboard-test.js
🔢📍 📘 📦:unknown 🧪:unit /opt/mExpress/packages/vue-components/tests/p2/components/ui/Button.test.ts
🔢📍 📘 📦:unknown 🧪:unit /opt/mExpress/packages/vue-components/tests/p2/components/ui/Checkbox.test.ts
🔢📍 📝 📦:unknown 🧪:unit /opt/mExpress/packages/vue-components/tests/p2/components/ui/run-button-test.js
🔢📍 📝 📦:unknown 🧪:unit /opt/mExpress/packages/vue-components/tests/p2/components/ui/run-checkbox-test.js
🔢📍 📝 📦:unknown 🧪:unit /opt/mExpress/packages/vue-components/tests/p2/components/ui/run-select-test.js
🔢📍 📝 📦:unknown 🧪:unit /opt/mExpress/packages/vue-components/tests/p2/components/ui/run-select-vitest.js
🔢📍 📘 📦:unknown 🧪:unit /opt/mExpress/packages/vue-components/tests/p2/components/ui/Select.minimal.test.ts
🔢📍 📘 📦:unknown 🧪:unit /opt/mExpress/packages/vue-components/tests/p2/components/ui/Select.test.ts
🔢📍 📝 📦:unknown 🧪:unit /opt/mExpress/packages/vue-components/tests/p2/components/ui/temp-select-test.js
🔢📍 📘 📦:unknown 🧪:unit /opt/mExpress/packages/vue-components/tests/p2/components/ui/Toggle.test.ts
🔢📍 📗 📦:auth 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/auth/LoginForm.test.tsx
🔢📍 📗 📦:auth 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/auth/ProtectedRoute.test.tsx
🔢📍 📗 📦:auth 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/auth/RegisterForm.test.tsx
🔢📍 📗 📦:frontend 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/customers/CustomerList.test.tsx
🔢📍 📗 📦:frontend 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/ActionShortcuts.test.tsx
🔢📍 📗 📦:frontend 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/ActivityFeed.test.tsx
🔢📍 📗 📦:frontend 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/MetricsDisplay.test.tsx
🔢📍 📗 📦:frontend 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/QuickSearch.test.tsx
🔢📍 📗 📦:frontend 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/RecentCalls.test.tsx
🔢📍 📗 📦:frontend 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p2/features/CustomerRoutes.test.tsx
🔢📍 📘 📦:frontend 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p2/hooks/useDebounce.test.ts

### P3 (Low Priority) Tests

🔢📍 📘 📦:api 🧪:unit /opt/mExpress/packages/core/tests/p3/api/basic-stress.test.ts
🔢📍 📘 📦:api 🧪:unit /opt/mExpress/packages/core/tests/p3/api/simplified-rate-limit.test.ts
🔢📍 📘 📦:api 🧪:unit /opt/mExpress/packages/core/tests/p3/api/stress-tests.test.ts
🔢📍 📘 📦:auth 🧪:unit /opt/mExpress/packages/core/tests/p3/auth/performance.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p3/core/message-queue-stress.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p3/frontend/accessibility/component-accessibility.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p3/frontend/components/styling-consistency.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p3/frontend/components/TestExecutionPanel.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p3/infrastructure/database-performance.test.ts
🔢📍 📘 📦:core 🧪:integration /opt/mExpress/packages/core/tests/p3/models/customer.integration.test.ts
🔢📍 📘 📦:core 🧪:unit /opt/mExpress/packages/core/tests/p3/services/load-balancer.test.ts
🔢📍 📘 📦:utils 🧪:unit /opt/mExpress/packages/utils/tests/p3/lib/resilience/retry-strategy.error.test.ts
🔢📍 📝 📦:utils 🧪:unit /opt/mExpress/packages/utils/tests/p3/lib/resilience/run-retry-error-test.js
🔢📍 📘 📦:utils 🧪:unit /opt/mExpress/packages/utils/tests/p3/utils/moduleCheck.test.ts
🔢📍 📘 📦:utils 🧪:unit /opt/mExpress/packages/utils/tests/p3/utils/monitoring.collector.test.ts
🔢📍 📘 📦:utils 🧪:unit /opt/mExpress/packages/utils/tests/p3/utils/rate-limiter.utils.test.ts
🔢📍 📗 📦:frontend 🧪:unit /opt/mExpress/projects/montpc_crm/tests/frontend/p3/components.test.tsx

## Summary Statistics

- Total real test files found: 130
- Tests with known priority (P0-P3): 129 (99%)
- Tests with unknown priority: 1 (0%)
- Tests in canonical location: 129 (99%)
- Tests needing relocation: 1 (0%)

## Component Breakdown

```
utils: 13 (10%)
api: 13 (10%)
frontend: 10 (7%)
unknown: 13 (10%)
core: 68 (52%)
services: 1 (0%)
auth: 12 (9%)
```

## Test Type Breakdown

```
unit: 122 (93%)
integration: 8 (6%)
```
