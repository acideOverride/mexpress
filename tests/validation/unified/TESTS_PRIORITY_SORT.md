# Tests Sorted by Priority

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

## P0 (Critical) Tests

- ✅🔄🕒:0.0s🧪:unit📦:api /opt/mExpress/packages/core/tests/p0/api/connection-timeout.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/customer-management.test.ts
- ✅🔄🕒:5.7s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/event-handler.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/every.test.js
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/git-workflow.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/istio-client.additional.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/istio-client.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:api /opt/mExpress/packages/core/tests/p0/core/login.api.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/message-delivery-confirmation.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/message-queue-v2.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/security.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/service-discovery.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/time-provider.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/transaction-rollback.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/value-to-string.test.js
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/infrastructure/kubernetes-config.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/services/customer.service.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/services/debug-hiboutik.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:auth /opt/mExpress/packages/core/tests/p0/services/hiboutik.auth.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExPress/packages/core/tests/p0/services/hiboutik.service.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/services/product.service.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/services/ringover.service.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/sync.service.test.ts
- ✅🔄🕒:24.0s🧪:unit📦:frontend /opt/mExpress/projects/montpc_crm/frontend/tests/p0/components/dashboard.test.tsx
- ✅🔄🕒:15.2s🧪:unit📦:core /opt/mExpress/projects/montpc_crm/frontend/tests/p0/core/CustomerDetail.test.tsx
- ✅📍🕒:0.1s🧪:unit📦:auth /opt/mExpress/tests/projects/montpc_crm/frontend/unit/components/auth/LoginForm.test.tsx
- ✅📍🕒:0.1s🧪:unit📦:auth /opt/mExpress/tests/projects/montpc_crm/frontend/unit/components/auth/ProtectedRoute.test.tsx
- ✅📍🕒:0.1s🧪:unit📦:auth /opt/mExpress/tests/projects/montpc_crm/frontend/unit/components/auth/RegisterForm.test.tsx

## P1 (Important) Tests

- ✅🔄🕒:0.0s🧪:integration📦:core /opt/mExpress/packages/core/tests/integration/external-integration.update.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:api /opt/mExpress/packages/core/tests/p1/api/retry-logic.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:auth /opt/mExpress/packages/core/tests/p1/auth/permissions.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:auth /opt/mExpress/packages/core/tests/p1/auth/token-refresh.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/core/concurrent-modification.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/core/pipeline.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/core/queue-persistence.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:core🔍:Unknown /opt/mExpress/packages/core/tests/p1/frontend/components/styling-consistency.test.tsx
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/frontend/component-tests.test.js
- ❌🔄🕒:0.0s🧪:unit📦:core🔍:Unknown /opt/mExpress/packages/core/tests/p1/megasearch/mongodb-text-search.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:core🔍:Unknown /opt/mExpress/packages/core/tests/p1/services/catalog-event.service.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/services/category-events.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:auth /opt/mExpress/packages/core/tests/p1/services/cross-service-auth.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/services/customer-validation.service.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/services/product-events.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/services/ringover.customer.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/services/service-deployment.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/services/service-mesh.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p1/services/sync.customer.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:auth🔍:Unknown /opt/mExpress/projects/montpc_crm/frontend/tests/p1/auth/login.ui.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:frontend🔍:Unknown /opt/mExpress/projects/montpc_crm/frontend/tests/p1/features/CustomerRoutes.test.tsx
- ❌🔄🕒:0.0s🧪:integration📦:unknown🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/p1/services/external-integration.project.test.ts

## P2 (Secondary) Tests

- ✅🔄🕒:0.0s🧪:unit📦:api /opt/mExpress/packages/core/tests/p2/api/edge-cases.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:auth /opt/mExpress/packages/core/tests/p2/auth/multi-login.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/core/bulk-operations.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/core/called-in-order.test.js
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/core/class-name.test.js
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/core/copy-prototype-methods.test.js
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/core/customer.unit.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/core/function-name.test.js
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/core/message-queue-recovery.test.js
- ❌🔄🕒:0.0s🧪:unit📦:core🔍:Unknown /opt/mExpress/packages/core/tests/p2/core/order-by-first-call.test.js
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/core/product.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:core🔍:Unknown /opt/mExpress/packages/core/tests/p2/core/type-of.test.js
- ❌🔄🕒:0.0s🧪:unit📦:core🔍:Unknown /opt/mExpress/packages/core/tests/p2/frontend/components/mobile/responsive-layout.test.tsx
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p2/services/data-consistency.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:frontend🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/ActionShortcuts.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:frontend🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/ActivityFeed.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:frontend🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/MetricsDisplay.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:frontend🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/QuickSearch.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:frontend🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/RecentCalls.test.tsx

## P3 (Performance/Stress) Tests

- ✅🔄🕒:0.0s🧪:unit📦:api /opt/mExpress/packages/core/tests/p3/api/basic-stress.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:api /opt/mExpress/packages/core/tests/p3/api/simplified-rate-limit.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:api🔍:TimeoutError /opt/mExpress/packages/core/tests/p3/api/stress-tests.test.ts
- ❓🔄🕒:>20s🧪:unit📦:auth /opt/mExpress/packages/core/tests/p3/auth/performance.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:core🔍:TimeoutError /opt/mExpress/packages/core/tests/p3/core/message-queue-stress.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:core🔍:Unknown /opt/mExpress/packages/core/tests/p3/frontend/accessibility/component-accessibility.test.tsx
- ❌🔄🕒:0.0s🧪:unit📦:core🔍:AssertionError /opt/mExpress/packages/core/tests/p3/infrastructure/database-performance.test.ts
- ❌🔄🕒:0.0s🧪:integration📦:core🔍:Unknown /opt/mExpress/packages/core/tests/p3/models/customer.integration.test.ts
- ❓🔄🕒:>20s🧪:unit📦:core /opt/mExpress/packages/core/tests/p3/services/load-balancer.test.ts

## Other Tests (Not Categorized by Priority)

- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/unit/validation/customerValidation.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/vue-components/src/components/layout/__tests__/DashboardLayout.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/vue-components/src/components/ui/__tests__/Button.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/vue-components/src/components/ui/__tests__/Checkbox.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/vue-components/src/components/ui/__tests__/Select.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/packages/vue-components/src/components/ui/__tests__/Toggle.test.ts
- ❌📍🕒:0.0s🧪:integration📦:core🔍:Unknown /opt/mExpress/tests/packages/core/integration/core/external-integration.update.test.ts
- ❌📍🕒:0.0s🧪:integration📦:core🔍:Unknown /opt/mExpress/tests/packages/core/integration/infrastructure/container-orchestrator-integration.test.ts
- ❌📍🕒:0.0s🧪:integration📦:core🔍:Unknown /opt/mExpress/tests/packages/core/integration/infrastructure/external-integration.core.test.ts
- ❌📍🕒:0.0s🧪:integration📦:core🔍:Unknown /opt/mExpress/tests/packages/core/integration/infrastructure/external-integration.update.test.ts
- ❌📍🕒:0.0s🧪:integration📦:core🔍:Unknown /opt/mExpress/tests/packages/core/integration/infrastructure/pipeline-integration.test.ts
- ❌📍🕒:0.0s🧪:unit📦:core🔍:Unknown /opt/mExpress/tests/packages/core/unit/core/message-queue/message-state-manager.test.ts
- ❌📍🕒:0.0s🧪:unit📦:core🔍:Unknown /opt/mExpress/tests/packages/core/unit/frontend/components/TestExecutionPanel.test.tsx
- ❌📍🕒:0.0s🧪:unit📦:core🔍:Unknown /opt/mExpress/tests/packages/core/unit/reconciliation-tools/componentScanner.test.ts
- ❌📍🕒:0.0s🧪:unit📦:core🔍:Unknown /opt/mExpress/tests/packages/core/unit/reconciliation-tools/matrixTracker.test.ts
- ❌📍🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/tests/packages/utils/unit/lib/monitoring/monitoring.system.test.ts
- ❌📍🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/tests/packages/utils/unit/lib/resilience/circuit-breaker.test.ts
- ❌📍🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/tests/packages/utils/unit/lib/resilience/rate-limiter.resilience.test.ts
- ❌📍🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/tests/packages/utils/unit/lib/resilience/retry-strategy.error.test.ts
- ❌📍🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/tests/packages/utils/unit/lib/resilience/retry-strategy.test.ts
- ❌📍🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/tests/packages/utils/unit/utils/logger.test.ts
- ❌📍🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/tests/packages/utils/unit/utils/moduleCheck.test.ts
- ❌📍🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/tests/packages/utils/unit/utils/monitoring.collector.test.ts
- ❌📍🕒:0.0s🧪:unit📦:unknown🔍:Unknown /opt/mExpress/tests/packages/utils/unit/utils/rate-limiter.utils.test.ts
- ❌📍🕒:0.0s🧪:unit📦:auth🔍:Unknown /opt/mExpress/tests/projects/montpc_crm/frontend/unit/api/interceptors/auth.interceptor.test.ts
- ❌📍🕒:0.0s🧪:unit📦:api🔍:Unknown /opt/mExpress/tests/projects/montpc_crm/frontend/unit/api/interceptors/error.interceptor.test.ts
- ❌📍🕒:0.0s🧪:unit📦:api🔍:Unknown /opt/mExpress/tests/projects/montpc_crm/frontend/unit/api/interceptors/index.test.ts
- ❌📍🕒:0.0s🧪:unit📦:auth🔍:Unknown /opt/mExpress/tests/projects/montpc_crm/frontend/unit/api/services/auth.service.test.ts
- ❌📍🕒:0.0s🧪:unit📦:api🔍:Unknown /opt/mExpress/tests/projects/montpc_crm/frontend/unit/api/services/customers.service.test.ts
- ❌📍🕒:0.0s🧪:unit📦:api🔍:Unknown /opt/mExpress/tests/projects/montpc_crm/frontend/unit/api/services/products.service.test.ts
- ❌📍🕒:0.0s🧪:unit📦:frontend🔍:Unknown /opt/mExpress/tests/projects/montpc_crm/frontend/unit/components/customers/CustomerList.test.tsx
- ❌📍🕒:0.0s🧪:unit📦:frontend🔍:Unknown /opt/mExpress/tests/projects/montpc_crm/frontend/unit/components.test.tsx
- ❌📍🕒:0.0s🧪:unit📦:frontend🔍:Unknown /opt/mExpress/tests/projects/montpc_crm/frontend/unit/hooks/useDebounce.test.ts

## Summary Statistics

### Status Summary
- Total P0 tests: 28
- Passing P0 tests: 28 (100%)
- Failing P0 tests: 0 (0%)

- Total P1 tests: 22
- Passing P1 tests: 17 (77.3%)
- Failing P1 tests: 5 (22.7%)

- Total P2 tests: 19
- Passing P2 tests: 14 (73.7%)
- Failing P2 tests: 5 (26.3%)

- Total P3 tests: 9
- Passing P3 tests: 2 (22.2%)
- Failing P3 tests: 5 (55.6%)
- Hanging/Timeout P3 tests: 2 (22.2%)

- Other tests: 34
- Passing other tests: 1 (2.9%)
- Failing other tests: 33 (97.1%)

### Overall Status
- Total tests: 112
- Passing: 63 (56.2%)
- Failing: 47 (42.0%)
- Hanging/Timeout: 2 (1.8%)
- In canonical location: 30 (26.8%)
- Need to move: 82 (73.2%)

### Component Breakdown
- auth: 14 tests
- api: 16 tests
- core: 61 tests
- frontend: 18 tests
- unknown: 13 tests