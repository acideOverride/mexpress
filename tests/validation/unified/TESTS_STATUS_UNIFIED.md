# Unified Test Status Report

This report shows test location, priority, and execution status for all tests in the codebase:

Legend:
- ✅ - Test passes
- ❌ - Test fails
- ⏱️ - Test timed out
- ⏩ - Test skipped
- 📍 - Test is in project-specific location (correct)
- 🚚 - Test needs to be moved from centralized location
- 🔢 - Test has priority label (P0-P3)
- ❔ - Test missing priority label
- 🕒 - Test duration
- 🧪 - Test type (unit, integration, e2e)
- 📦 - Component area
- 🔍 - Error type (for failing tests)
- 🧩 - Test coverage percentage

## Tests By Status (Grouped by Priority)

### Passing P0 (Critical) Tests
✅🔢📍 🕒:5.8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/validation/customerValidation.test.ts
✅🔢📍 🕒:5.6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/sync.service.test.ts
✅🔢📍 🕒:4.9s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/ringover.service.test.ts
✅🔢📍 🕒:11.8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/hiboutik.service.test.ts
✅🔢📍 🕒:5.1s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/hiboutik.auth.test.ts
✅🔢📍 🕒:6.6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/debug-hiboutik.test.ts
✅🔢📍 🕒:5.1s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/customer.service.test.ts
✅🔢📍 🕒:4.9s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/catalog-event.service.test.ts
✅🔢📍 🕒:5.0s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/infrastructure/kubernetes-config.test.ts
✅🔢📍 🕒:4.6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/transaction-rollback.test.ts
✅🔢📍 🕒:5.0s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/service-discovery.test.ts
✅🔢📍 🕒:4.3s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/security.test.ts
✅🔢📍 🕒:4.6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/message-queue-v2.test.ts
✅🔢📍 🕒:5.3s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/message-queue/message-state-manager.test.ts
✅🔢📍 🕒:4.8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/message-delivery-confirmation.test.ts
✅🔢📍 🕒:4.9s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/login.api.test.ts
✅🔢📍 🕒:4.7s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/event-handler.test.ts
✅🔢📍 🕒:4.6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/customer-management.test.ts
✅🔢📍 🕒:5.0s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p0/api/connection-timeout.test.ts
✅🔢📍 🕒:10.0s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/projects/montpc_crm/tests/frontend/p0/auth/login.ui.test.tsx
✅🔢📍 🕒:11.3s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/projects/montpc_crm/tests/frontend/p0/api/services/auth.service.test.ts
✅🔢📍 🕒:13.0s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/projects/montpc_crm/tests/frontend/p0/api/interceptors/auth.interceptor.test.tsx
✅🔢📍 🕒:5.4s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/projects/montpc_crm/tests/frontend/p0/core/CustomerDetail.test.tsx
✅🔢📍 🕒:6.1s 🧪:unit 📦:frontend 🧩:~70% /opt/mExpress/projects/montpc_crm/tests/frontend/p0/components/dashboard.test.tsx
✅🔢📍 🕒:2.4s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/value-to-string.test.js
✅🔢📍 🕒:2.8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/time-provider.test.ts
✅🔢📍 🕒:3.3s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/istio-client.test.ts
✅🔢📍 🕒:2.8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/istio-client.additional.test.ts
✅🔢📍 🕒:2.9s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/git-workflow.test.ts
✅🔢📍 🕒:2.3s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/every.test.js



### Failing P0 (Critical) Tests


### Passing P1 (High Priority) Tests
✅🔢📍 🕒:14.8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/sync.customer.test.ts
✅🔢📍 🕒:10.8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/service-mesh.test.ts
✅🔢📍 🕒:10.5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/service-deployment.test.ts
✅🔢📍 🕒:16.6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/ringover.customer.test.ts
✅🔢📍 🕒:19.8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/customer-validation.service.test.ts
✅🔢📍 🕒:11.3s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/cross-service-auth.test.ts
✅🔢📍 🕒:15.5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/megasearch/mongodb-text-search.test.ts
✅🔢📍 🕒:18.1s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/core/queue-persistence.test.ts
✅🔢📍 🕒:20.6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/core/concurrent-modification.test.ts
✅🔢📍 🕒:16.0s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p1/auth/token-refresh.test.ts
✅🔢📍 🕒:20.2s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p1/auth/permissions.test.ts
✅🔢📍 🕒:20.6s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p1/api/retry-logic.test.ts


### Failing P1 (High Priority) Tests
❌🔢📍 🕒:5.2s 🧪:unit 📦:api 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/services/products.service.test.ts
❌🔢📍 🕒:4.6s 🧪:unit 📦:api 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/services/customers.service.test.ts
❌🔢📍 🕒:4.9s 🧪:unit 📦:api 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/interceptors/index.test.ts
❌🔢📍 🕒:3.6s 🧪:unit 📦:api 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/interceptors/error.interceptor.test.ts
❌🔢📍 🕒:3.0s 🧪:integration 📦:services 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/backend/p1/services/external-integration.project.test.ts
✅🔢📍 🕒:2.0s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p1/lib/resilience/retry-strategy.test.ts
✅🔢📍 🕒:2.9s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p1/lib/resilience/rate-limiter.resilience.test.ts
✅🔢📍 🕒:2.3s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p1/lib/resilience/circuit-breaker.test.ts
❌🔢📍 🕒:20.2s 🧪:unit 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p1/services/product-events.test.ts
❌🔢📍 🕒:15.9s 🧪:unit 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p1/services/category-events.test.ts
❌🔢📍 🕒:18.5s 🧪:integration 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p1/integration/infrastructure/pipeline-integration.test.ts
❌🔢📍 🕒:21.7s 🧪:integration 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p1/integration/infrastructure/external-integration.update.test.ts
❌🔢📍 🕒:18.2s 🧪:integration 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p1/integration/infrastructure/external-integration.core.test.ts
❌🔢📍 🕒:14.3s 🧪:integration 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p1/integration/infrastructure/container-orchestrator-integration.test.ts
❌🔢📍 🕒:20.7s 🧪:integration 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p1/integration/external-integration.update.test.ts
❌🔢📍 🕒:18.0s 🧪:integration 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p1/integration/core/external-integration.update.test.ts
❌🔢📍 🕒:2.6s 🧪:unit 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p1/frontend/component-tests.test.js
❌🔢📍 🕒:19.3s 🧪:unit 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p1/core/pipeline.test.ts


### Passing P2 (Medium Priority) Tests
✅🔢📍 🕒:6.5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/services/data-consistency.test.ts
✅🔢📍 🕒:4.8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/reconciliation-tools/componentScanner.test.ts
✅🔢📍 🕒:5.4s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/product.test.ts
✅🔢📍 🕒:5.4s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/customer.unit.test.ts
✅🔢📍 🕒:4.5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/bulk-operations.test.ts
✅🔢📍 🕒:4.4s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p2/auth/multi-login.test.ts
✅🔢📍 🕒:5.0s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p2/api/edge-cases.test.ts


### Failing P2 (Medium Priority) Tests
❌🔢📍 🕒:4.7s 🧪:unit 📦:frontend 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/hooks/useDebounce.test.ts
❌🔢📍 🕒:3.4s 🧪:unit 📦:frontend 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/features/CustomerRoutes.test.tsx
❌🔢📍 🕒:3.8s 🧪:unit 📦:frontend 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/RecentCalls.test.tsx
❌🔢📍 🕒:3.8s 🧪:unit 📦:frontend 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/QuickSearch.test.tsx
❌🔢📍 🕒:5.2s 🧪:unit 📦:frontend 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/MetricsDisplay.test.tsx
❌🔢📍 🕒:4.3s 🧪:unit 📦:frontend 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/ActivityFeed.test.tsx
❌🔢📍 🕒:5.1s 🧪:unit 📦:frontend 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/ActionShortcuts.test.tsx
❌🔢📍 🕒:4.3s 🧪:unit 📦:frontend 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/customers/CustomerList.test.tsx
❌🔢📍 🕒:4.9s 🧪:unit 📦:auth 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/auth/RegisterForm.test.tsx
❌🔢📍 🕒:3.8s 🧪:unit 📦:auth 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/auth/ProtectedRoute.test.tsx
❌🔢📍 🕒:3.6s 🧪:unit 📦:auth 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/auth/LoginForm.test.tsx
❌🔢📍 🕒:5.9s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Toggle.test.ts
❌🔢📍 🕒:5.5s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Select.test.ts
❌🔢📍 🕒:5.3s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Checkbox.test.ts
❌🔢📍 🕒:5.8s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Button.test.ts
❌🔢📍 🕒:3.5s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/layout/DashboardLayout.test.ts
✅🔢📍 🕒:2.7s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p2/utils/logger.test.ts
✅🔢📍 🕒:3.0s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p2/lib/monitoring/monitoring.system.test.ts
✅🔢📍 🕒:4.6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/reconciliation-tools/matrixTracker.test.ts
✅🔢📍 🕒:2.1s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/mobile-viewport.test.js
✅🔢📍 🕒:2.4s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/type-of.test.js
✅🔢📍 🕒:2.5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/order-by-first-call.test.js
❌🔢📍 🕒:2.1s 🧪:unit 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p2/core/message-queue-recovery.test.js
❌🔢📍 🕒:2.0s 🧪:unit 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p2/core/function-name.test.js
❌🔢📍 🕒:2.2s 🧪:unit 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p2/core/copy-prototype-methods.test.js
❌🔢📍 🕒:2.1s 🧪:unit 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p2/core/class-name.test.js
❌🔢📍 🕒:2.0s 🧪:unit 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p2/core/called-in-order.test.js


### Passing P3 (Low Priority) Tests
✅🔢📍 🕒:10.8s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p3/api/stress-tests.test.ts
✅🔢📍 🕒:5.1s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p3/api/simplified-rate-limit.test.ts
✅🔢📍 🕒:5.9s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p3/api/basic-stress.test.ts


### Failing P3 (Low Priority) Tests
❌🔢📍 🕒:3.9s 🧪:unit 📦:frontend 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p3/components.test.tsx
✅🔢📍 🕒:3.1s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p3/utils/rate-limiter.utils.test.ts
✅🔢📍 🕒:2.0s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p3/utils/monitoring.collector.test.ts
✅🔢📍 🕒:2.3s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p3/lib/resilience/retry-strategy.error.test.ts
❌🔢📍 🕒:2.3s 🧪:unit 📦:utils 🔍:ModuleError /opt/mExpress/packages/utils/tests/p3/lib/resilience/retry-strategy.error.test.ts
❌🔢📍 🕒:6.2s 🧪:integration 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p3/models/customer.integration.test.ts
❌🔢📍 🕒:22.8s 🧪:unit 📦:core 🔍:AssertionError /opt/mExpress/packages/core/tests/p3/infrastructure/database-performance.test.ts
❌🔢📍 🕒:2.5s 🧪:unit 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p3/frontend/components/TestExecutionPanel.test.tsx
❌🔢📍 🕒:2.9s 🧪:unit 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p3/frontend/components/styling-consistency.test.tsx
❌🔢📍 🕒:2.3s 🧪:unit 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p3/frontend/accessibility/component-accessibility.test.tsx
❌🔢📍 🕒:4.8s 🧪:unit 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p3/core/message-queue-stress.test.ts
❌🔢📍 🕒:5.0s 🧪:unit 📦:auth 🔍:TypeError /opt/mExpress/packages/core/tests/p3/auth/performance.test.ts


### Passing Tests (Unknown Priority)


### Failing Tests (Unknown Priority)


### Tests That Timed Out
⏱️🔢📍 🕒:>30s 🧪:unit 📦:core /opt/mExpress/packages/core/tests/p3/services/load-balancer.test.ts
⏱️🔢📍 🕒:>30s 🧪:unit 📦:core /opt/mExpress/packages/core/tests/p0/services/product.service.test.ts (Currently working on fixing)


### Skipped Tests


## Summary Statistics

```
Total tests: 111
Passing: 55 (49.5%)
Failing: 54 (48.7%)
Timed out: 2 (1.8%)
Skipped: 0

In project-specific location: 109 (98.2%)
Needing location update: 2 (1.8%)

With priority label: 111 (100%)
Missing priority label: 0 (0%)
```

## Priority Breakdown

```
P0: 31 (27%)
P1: 30 (27%)
P2: 34 (30%)
P3: 16 (14%)
Unknown: 0 (0%)
```

## Component Breakdown

```
utils: 9 (8%)
api: 11 (9%)
frontend: 10 (9%)
unknown: 5 (4%)
core: 63 (56%)
services: 1 (0%)
auth: 12 (10%)
```

## Test Type Breakdown

```
unit: 103 (92%)
integration: 8 (7%)
```

## Error Type Breakdown

```
Unknown: 55 (83%)
ReferenceError: 1 (1%)
AssertionError: 1 (1%)
ModuleError: 3 (6%)
TypeError: 1 (1%)
SyntaxError: 1 (1%)
```

## Test Duration Breakdown

```
Fast (≤1s): 0
Normal (1-5s): 56
Slow (>5s): 55
```