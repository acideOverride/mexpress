# Full Test Status Report

Legend:
- ✅ - Test passes
- ❌ - Test fails
- ❓ - Test hangs/times out
- ⏩ - Test skipped (node_modules or dist)
- 📍 - Test is in canonical location
- 🔄 - Test should be moved to canonical location
- 🕒 - Test duration (fast ≤1s, normal ≤5s, slow >5s)
- 🧪 - Test type (unit, integration, e2e)
- 📦 - Test component area
- 🔍 - Error type (for failing tests)

Combined icons examples:
- ✅📍🕒:0.3s🧪:unit📦:auth - Fast passing unit test for auth in canonical location
- ❌🔄🕒:6.2s🧪:integration📦:api🔍:TypeError - Slow failing integration test with TypeError

## Test Results
- ✅🔄🕒:0.0s🧪:unit📦:api /opt/mExpress/packages/core/tests/p0/api/connection-timeout.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/customer-management.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/event-handler.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/every.test.js
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/git-workflow.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/istio-client.additional.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/istio-client.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:api /opt/mExpress/packages/core/tests/p0/core/login.api.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/message-delivery-confirmation.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/message-queue/message-state-manager.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/message-queue-v2.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/security.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/service-discovery.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/time-provider.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/transaction-rollback.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/value-to-string.test.js
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/infrastructure/kubernetes-config.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/services/catalog-event.service.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/services/customer.service.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/services/debug-hiboutik.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:auth /opt/mExpress/packages/core/tests/p0/services/hiboutik.auth.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/services/hiboutik.service.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/services/product.service.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/services/ringover.service.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/sync.service.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/validation/customerValidation.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:api /opt/mExpress/packages/core/tests/p1/api/retry-logic.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:auth /opt/mExpress/packages/core/tests/p1/auth/permissions.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:auth /opt/mExpress/packages/core/tests/p1/auth/token-refresh.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/core/concurrent-modification.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/core/pipeline.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/core/queue-persistence.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/frontend/component-tests.test.js
- ✅🔄🕒:0.0s🧪:integration📦:core /opt/mExpress/packages/core/tests/p1/integration/core/external-integration.update.test.js
- ❌🔄🕒:0.0s🧪:integration📦:core🔍:Unknown /opt/mExpress/packages/core/tests/p1/integration/core/external-integration.update.test.ts
- ✅🔄🕒:0.0s🧪:integration📦:core /opt/mExpress/packages/core/tests/p1/integration/external-integration.update.test.js
- ❌🔄🕒:0.0s🧪:integration📦:core🔍:Unknown /opt/mExpress/packages/core/tests/p1/integration/external-integration.update.test.ts
- ❌🔄🕒:0.0s🧪:integration📦:core🔍:Unknown /opt/mExpress/packages/core/tests/p1/integration/infrastructure/container-orchestrator-integration.test.js
- ❌🔄🕒:0.0s🧪:integration📦:core🔍:Unknown /opt/mExpress/packages/core/tests/p1/integration/infrastructure/container-orchestrator-integration.test.ts
- ✅🔄🕒:0.0s🧪:integration📦:core /opt/mExpress/packages/core/tests/p1/integration/infrastructure/external-integration.core.test.js
- ✅🔄🕒:0.0s🧪:integration📦:core /opt/mExpress/packages/core/tests/p1/integration/infrastructure/external-integration.core.test.ts
- ✅🔄🕒:0.0s🧪:integration📦:core /opt/mExpress/packages/core/tests/p1/integration/infrastructure/external-integration.update.test.js
- ❌🔄🕒:0.0s🧪:integration📦:core🔍:Unknown /opt/mExpress/packages/core/tests/p1/integration/infrastructure/external-integration.update.test.ts
- ❌🔄🕒:0.0s🧪:integration📦:core🔍:Unknown /opt/mExpress/packages/core/tests/p1/integration/infrastructure/pipeline-integration.test.js
- ❌🔄🕒:0.0s🧪:integration📦:core🔍:Unknown /opt/mExpress/packages/core/tests/p1/integration/infrastructure/pipeline-integration.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/megasearch/mongodb-text-search.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:core🔍:Unknown /opt/mExpress/packages/core/tests/p1/services/category-events.test.js
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/services/category-events.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:auth /opt/mExpress/packages/core/tests/p1/services/cross-service-auth.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/services/customer-validation.service.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:core🔍:TypeError /opt/mExpress/packages/core/tests/p1/services/product-events.test.js
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/services/product-events.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/services/ringover.customer.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/services/service-deployment.test.js
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/services/service-deployment.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/services/service-mesh.test.js
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/services/service-mesh.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/services/sync.customer.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:api /opt/mExpress/packages/core/tests/p2/api/edge-cases.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:auth /opt/mExpress/packages/core/tests/p2/auth/multi-login.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/core/bulk-operations.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/core/called-in-order.test.js
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/core/class-name.test.js
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/core/copy-prototype-methods.test.js
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/core/customer.unit.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/core/function-name.test.js
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/core/message-queue-recovery.test.js
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/core/mobile-viewport.test.js
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/core/order-by-first-call.test.js
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/core/product.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/core/type-of.test.js
- ✅📍🕒:7.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/frontend/components/mobile/responsive-layout.test.tsx
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/reconciliation-tools/componentScanner.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/reconciliation-tools/matrixTracker.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/services/data-consistency.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:api /opt/mExpress/packages/core/tests/p3/api/basic-stress.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:api /opt/mExpress/packages/core/tests/p3/api/simplified-rate-limit.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:api🔍:TimeoutError /opt/mExpress/packages/core/tests/p3/api/stress-tests.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:auth /opt/mExpress/packages/core/tests/p3/auth/performance.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:core🔍:TimeoutError /opt/mExpress/packages/core/tests/p3/core/message-queue-stress.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:core🔍:Unknown /opt/mExpress/packages/core/tests/p3/frontend/accessibility/component-accessibility.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:core🔍:Unknown /opt/mExpress/packages/core/tests/p3/frontend/components/styling-consistency.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:core🔍:Unknown /opt/mExpress/packages/core/tests/p3/frontend/components/TestExecutionPanel.test.tsx
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p3/infrastructure/database-performance.test.ts
- ❌🔄🕒:0.0s🧪:integration📦:core🔍:Unknown /opt/mExpress/packages/core/tests/p3/models/customer.integration.test.ts
- ❓🔄🕒:>20s🧪:unit📦:core /opt/mExpress/packages/core/tests/p3/services/load-balancer.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/utils/tests/p1/lib/resilience/circuit-breaker.test.js
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/utils/tests/p1/lib/resilience/circuit-breaker.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/utils/tests/p1/lib/resilience/rate-limiter.resilience.test.js
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/utils/tests/p1/lib/resilience/rate-limiter.resilience.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/utils/tests/p1/lib/resilience/retry-strategy.test.js
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/utils/tests/p1/lib/resilience/retry-strategy.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/utils/tests/p2/lib/monitoring/monitoring.system.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/utils/tests/p2/utils/logger.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/utils/tests/p3/lib/resilience/retry-strategy.error.test.js
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/utils/tests/p3/lib/resilience/retry-strategy.error.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/utils/tests/p3/utils/moduleCheck-simple.test.js
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/utils/tests/p3/utils/moduleCheck.test.js
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/utils/tests/p3/utils/moduleCheck.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/utils/tests/p3/utils/monitoring.collector.test.js
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/utils/tests/p3/utils/monitoring.collector.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/utils/tests/p3/utils/rate-limiter.utils.test.js
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/utils/tests/p3/utils/rate-limiter.utils.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/layout/DashboardLayout.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Button.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Checkbox.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Select.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Toggle.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:frontend🔍:Unknown /opt/mExpress/projects/montpc_crm/frontend/tests/p0/components/dashboard.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:core🔍:Unknown /opt/mExpress/projects/montpc_crm/frontend/tests/p0/core/CustomerDetail.test.tsx
- ❌🔄🕒:0.0s🧪:integration📦:unknown🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/backend/p1/services/external-integration.project.test.js
- ❌🔄🕒:0.0s🧪:integration📦:unknown🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/backend/p1/services/external-integration.project.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:auth🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p0/api/interceptors/auth.interceptor.test.js
- ❌🔄🕒:0.0s🧪:unit📦:auth🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p0/api/interceptors/auth.interceptor.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:auth🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p0/api/interceptors/auth.interceptor.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:auth🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p0/api/services/auth.service.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:auth🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p0/auth/login.ui.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:frontend🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p0/components/dashboard.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:core🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p0/core/CustomerDetail.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:api🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/interceptors/error.interceptor.test.js
- ❌🔄🕒:0.0s🧪:unit📦:api🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/interceptors/error.interceptor.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:api🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/interceptors/index.test.js
- ❌🔄🕒:0.0s🧪:unit📦:api🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/interceptors/index.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:api🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/services/customers.service.test.js
- ❌🔄🕒:0.0s🧪:unit📦:api🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/services/customers.service.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:api🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/services/products.service.test.js
- ❌🔄🕒:0.0s🧪:unit📦:api🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/services/products.service.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:auth🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/auth/LoginForm.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:auth🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/auth/ProtectedRoute.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:auth🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/auth/RegisterForm.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:frontend🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/customers/CustomerList.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:frontend🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/ActionShortcuts.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:frontend🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/ActivityFeed.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:frontend🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/MetricsDisplay.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:frontend🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/QuickSearch.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:frontend🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/RecentCalls.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:frontend🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/features/CustomerRoutes.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:frontend🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/hooks/useDebounce.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:frontend🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p3/components.test.tsx

## Summary Statistics

```
Total tests: 0
Passing: 0 (0%)
Failing: 0 (0%)
Hanging/Timeout: 0 (0%)
Skipped: 0
In canonical location: 0 (0%)
Need to move: 0 (0%)
```

## Component Breakdown

```
```

## Test Type Breakdown

```
```

## Test Duration Breakdown

```
Fast (≤1s): 0
Normal (1-5s): 0
Slow (>5s): 0
```
