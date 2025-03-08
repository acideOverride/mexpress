# Enhanced Unified Test Status Report
*Last updated: 2025-03-08 (Updated by Claude for JavaScript to TypeScript migration)*

This report shows test execution status and metrics:

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
- 📝 - JavaScript file (.js) - MIGRATION REQUIRED ⚠️
- 📘 - TypeScript file (.ts) - PREFERRED ✓
- 📗 - React TypeScript file (.tsx) - PREFERRED ✓
- 📙 - React JavaScript file (.jsx) - MIGRATION REQUIRED ⚠️
- 👯 - Duplicate test (same name in both JS and TS) - JS VERSION SHOULD BE REMOVED ⚠️

## Tests By Status (Running)

### P0 (Critical) Tests - Running
❌🔢📍📗 🕒:1s 🧪:unit 📦:core 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p0/core/CustomerDetail.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p0/core/CustomerDetail.test_20250308_034732.log)
❌🔢📍📗 🕒:2s 🧪:unit 📦:frontend 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p0/components/dashboard.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p0/components/dashboard.test_20250308_034730.log)
❌🔢📍📗 🕒:1s 🧪:unit 📦:auth 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p0/auth/login.ui.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p0/auth/login.ui.test_20250308_034729.log)
✅🔢📍📘 🕒:20s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/projects/montpc_crm/tests/frontend/p0/api/services/auth.service.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p0/api/services/auth.service.test_20250308_034727.log)
✅🔢📍📘 🕒:16s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/projects/montpc_crm/tests/frontend/p0/api/interceptors/auth.interceptor.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p0/api/interceptors/auth.interceptor.test_20250308_034725.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/validation/customerValidation.test.ts | [log](/tests/results/logs/packages/core/tests/p0/validation/customerValidation.test_20250308_034720.log)
✅🔢📍📘 🕒:6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/sync.service.test.ts | [log](/tests/results/logs/packages/core/tests/p0/sync.service.test_20250308_034714.log)
✅🔢📍📘 🕒:6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/ringover.service.test.ts | [log](/tests/results/logs/packages/core/tests/p0/services/ringover.service.test_20250308_034708.log)
✅🔢📍📘 🕒:6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/product.service.test.ts | [log](/tests/results/logs/packages/core/tests/p0/services/product.service.test_20250308_034702.log)
✅🔢📍📘 🕒:11s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/hiboutik.service.test.ts | [log](/tests/results/logs/packages/core/tests/p0/services/hiboutik.service.test_20250308_034651.log)
✅🔢📍📘 🕒:6s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/hiboutik.auth.test.ts | [log](/tests/results/logs/packages/core/tests/p0/services/hiboutik.auth.test_20250308_034644.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/debug-hiboutik.test.ts | [log](/tests/results/logs/packages/core/tests/p0/services/debug-hiboutik.test_20250308_034639.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/customer.service.test.ts | [log](/tests/results/logs/packages/core/tests/p0/services/customer.service.test_20250308_034633.log)
✅🔢📍📘 🕒:6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/catalog-event.service.test.ts | [log](/tests/results/logs/packages/core/tests/p0/services/catalog-event.service.test_20250308_034627.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/infrastructure/kubernetes-config.test.ts | [log](/tests/results/logs/packages/core/tests/p0/infrastructure/kubernetes-config.test_20250308_034622.log)
✅🔢📍📘👯 🕒:6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/value-to-string.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/value-to-string.test_20250308_034615.log)
✅ REMOVED - Migrated to TypeScript - /opt/mExpress/packages/core/tests/p0/core/value-to-string.test.js
✅🔢📍📘 🕒:6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/transaction-rollback.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/transaction-rollback.test_20250308_034602.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/time-provider.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/time-provider.test_20250308_034557.log)
✅🔢📍📘 🕒:6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/service-discovery.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/service-discovery.test_20250308_034551.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/security.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/security.test_20250308_034544.log)
✅🔢📍📘 🕒:6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/message-queue-v2.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/message-queue-v2.test_20250308_034538.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/message-queue/message-state-manager.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/message-queue/message-state-manager.test_20250308_034532.log)
✅🔢📍📘 🕒:6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/message-delivery-confirmation.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/message-delivery-confirmation.test_20250308_034526.log)
✅🔢📍📘 🕒:6s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/login.api.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/login.api.test_20250308_034520.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/istio-client.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/istio-client.test_20250308_034512.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/istio-client.additional.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/istio-client.additional.test_20250308_034505.log)
✅🔢📍📘 🕒:6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/git-workflow.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/git-workflow.test_20250308_034459.log)
✅🔢📍📘👯 🕒:7s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/every.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/every.test_20250308_034452.log)
✅ REMOVED - Migrated to TypeScript - /opt/mExpress/packages/core/tests/p0/core/every.test.js
✅🔢📍📘 🕒:6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/event-handler.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/event-handler.test_20250308_034440.log)
✅🔢📍📘 🕒:6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/customer-management.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/customer-management.test_20250308_034434.log)
✅🔢📍📘 🕒:12s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p0/api/connection-timeout.test.ts | [log](/tests/results/logs/packages/core/tests/p0/api/connection-timeout.test_20250308_034422.log)


### P1 (High Priority) Tests - Running
❌🔢📍📘 🕒:2s 🧪:unit 📦:api 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/services/products.service.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p1/api/services/products.service.test_20250308_035433.log)
❌🔢📍📝 🕒:1s 🧪:unit 📦:api 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/services/products.service.mock.test.js | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p1/api/services/products.service.mock.test_20250308_035432.log)
❌🔢📍📘 🕒:1s 🧪:unit 📦:api 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/services/customers.service.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p1/api/services/customers.service.test_20250308_035430.log)
❌🔢📍📝 🕒:2s 🧪:unit 📦:api 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/services/customers.service.mock.test.js | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p1/api/services/customers.service.mock.test_20250308_035428.log)
❌🔢📍📘👯 🕒:1s 🧪:unit 📦:api 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/interceptors/index.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p1/api/interceptors/index.test_20250308_035427.log)
❌🔢📍📝👯 🕒:2s 🧪:unit 📦:api 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/interceptors/index.test.js | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p1/api/interceptors/index.test_20250308_035425.log)
❌🔢📍📝 🕒:2s 🧪:unit 📦:api 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/interceptors/index.basic.test.js | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p1/api/interceptors/index.basic.test_20250308_035423.log)
❌🔢📍📘 🕒:1s 🧪:unit 📦:api 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/interceptors/error.interceptor.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p1/api/interceptors/error.interceptor.test_20250308_035422.log)
❌🔢📍📝 🕒:1s 🧪:unit 📦:api 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/interceptors/basic.test.js | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p1/api/interceptors/basic.test_20250308_035420.log)
❌🔢📍📘 🕒:1s 🧪:integration 📦:services 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/backend/p1/services/external-integration.project.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/backend/p1/services/external-integration.project.test_20250308_035418.log)
❌🔢📍📘 🕒:3s 🧪:unit 📦:utils 🔍:Unknown /opt/mExpress/packages/utils/tests/p1/lib/resilience/retry-strategy.test.ts | [log](/tests/results/logs/packages/utils/tests/p1/lib/resilience/retry-strategy.test_20250308_035415.log)
❌🔢📍📘 🕒:4s 🧪:unit 📦:utils 🔍:Unknown /opt/mExpress/packages/utils/tests/p1/lib/resilience/rate-limiter.resilience.test.ts | [log](/tests/results/logs/packages/utils/tests/p1/lib/resilience/rate-limiter.resilience.test_20250308_035411.log)
❌🔢📍📘 🕒:4s 🧪:unit 📦:utils 🔍:Unknown /opt/mExpress/packages/utils/tests/p1/lib/resilience/circuit-breaker.test.ts | [log](/tests/results/logs/packages/utils/tests/p1/lib/resilience/circuit-breaker.test_20250308_035407.log)
✅🔢📍📘 🕒:18s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/sync.customer.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/sync.customer.test_20250308_035349.log)
✅🔢📍📘 🕒:16s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/service-mesh.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/service-mesh.test_20250308_035333.log)
✅🔢📍📘 🕒:16s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/service-deployment.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/service-deployment.test_20250308_035317.log)
✅🔢📍📘 🕒:17s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/ringover.customer.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/ringover.customer.test_20250308_035300.log)
✅🔢📍📘 🕒:18s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/product-events.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/product-events.test_20250308_035242.log)
✅🔢📍📘 🕒:19s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/customer-validation.service.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/customer-validation.service.test_20250308_035223.log)
✅🔢📍📘 🕒:18s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/cross-service-auth.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/cross-service-auth.test_20250308_035205.log)
✅🔢📍📘 🕒:18s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/category-events.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/category-events.test_20250308_035147.log)
✅🔢📍📘 🕒:17s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/megasearch/mongodb-text-search.test.ts | [log](/tests/results/logs/packages/core/tests/p1/megasearch/mongodb-text-search.test_20250308_035130.log)
✅🔢📍📘 🕒:17s 🧪:integration 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/integration/infrastructure/pipeline-integration.test.ts | [log](/tests/results/logs/packages/core/tests/p1/integration/infrastructure/pipeline-integration.test_20250308_035113.log)
❌🔢📍📘 🕒:19s 🧪:integration 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p1/integration/infrastructure/external-integration.update.test.ts | [log](/tests/results/logs/packages/core/tests/p1/integration/infrastructure/external-integration.update.test_20250308_035054.log)
❌🔢📍📘 🕒:16s 🧪:integration 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p1/integration/infrastructure/external-integration.core.test.ts | [log](/tests/results/logs/packages/core/tests/p1/integration/infrastructure/external-integration.core.test_20250308_035037.log)
✅🔢📍📘 🕒:19s 🧪:integration 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/integration/infrastructure/container-orchestrator-integration.test.ts | [log](/tests/results/logs/packages/core/tests/p1/integration/infrastructure/container-orchestrator-integration.test_20250308_035018.log)
❌🔢📍📘 🕒:19s 🧪:integration 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p1/integration/external-integration.update.test.ts | [log](/tests/results/logs/packages/core/tests/p1/integration/external-integration.update.test_20250308_034959.log)
✅🔢📍📘 🕒:17s 🧪:integration 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/integration/core/external-integration.update.test.ts | [log](/tests/results/logs/packages/core/tests/p1/integration/core/external-integration.update.test_20250308_034942.log)
❌🔢📍📝 🕒:3s 🧪:unit 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p1/infrastructure/kubernetes-config.test.js | [log](/tests/results/logs/packages/core/tests/p1/infrastructure/kubernetes-config.test_20250308_034939.log)
✅🔢📍📘 🕒:15s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/frontend/component-tests.test.ts | [log](/tests/results/logs/packages/core/tests/p1/frontend/component-tests.test_20250308_034924.log)
✅🔢📍📘 🕒:18s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/core/queue-persistence.test.ts | [log](/tests/results/logs/packages/core/tests/p1/core/queue-persistence.test_20250308_034906.log)
❌🔢📍📘 🕒:18s 🧪:unit 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p1/core/pipeline.test.ts | [log](/tests/results/logs/packages/core/tests/p1/core/pipeline.test_20250308_034848.log)
✅🔢📍📘 🕒:21s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/core/concurrent-modification.test.ts | [log](/tests/results/logs/packages/core/tests/p1/core/concurrent-modification.test_20250308_034827.log)
✅🔢📍📘 🕒:16s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p1/auth/token-refresh.test.ts | [log](/tests/results/logs/packages/core/tests/p1/auth/token-refresh.test_20250308_034811.log)
✅🔢📍📘 🕒:16s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p1/auth/permissions.test.ts | [log](/tests/results/logs/packages/core/tests/p1/auth/permissions.test_20250308_034755.log)
✅🔢📍📘 🕒:22s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p1/api/retry-logic.test.ts | [log](/tests/results/logs/packages/core/tests/p1/api/retry-logic.test_20250308_034733.log)


### P2 (Medium Priority) Tests - Running
❌🔢📍📘 🕒:1s 🧪:unit 📦:frontend 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/hooks/useDebounce.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/hooks/useDebounce.test_20250308_035650.log)
❌🔢📍📗 🕒:2s 🧪:unit 📦:frontend 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/features/CustomerRoutes.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/features/CustomerRoutes.test_20250308_035648.log)
❌🔢📍📗 🕒:2s 🧪:unit 📦:frontend 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/RecentCalls.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/dashboard/RecentCalls.test_20250308_035646.log)
❌🔢📍📗 🕒:2s 🧪:unit 📦:frontend 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/QuickSearch.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/dashboard/QuickSearch.test_20250308_035644.log)
❌🔢📍📗 🕒:1s 🧪:unit 📦:frontend 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/MetricsDisplay.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/dashboard/MetricsDisplay.test_20250308_035641.log)
❌🔢📍📗 🕒:1s 🧪:unit 📦:frontend 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/ActivityFeed.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/dashboard/ActivityFeed.test_20250308_035640.log)
❌🔢📍📗 🕒:1s 🧪:unit 📦:frontend 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/ActionShortcuts.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/dashboard/ActionShortcuts.test_20250308_035638.log)
❌🔢📍📗 🕒:2s 🧪:unit 📦:frontend 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/customers/CustomerList.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/customers/CustomerList.test_20250308_035636.log)
❌🔢📍📗 🕒:2s 🧪:unit 📦:auth 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/auth/RegisterForm.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/auth/RegisterForm.test_20250308_035634.log)
❌🔢📍📗 🕒:1s 🧪:unit 📦:auth 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/auth/ProtectedRoute.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/auth/ProtectedRoute.test_20250308_035633.log)
❌🔢📍📗 🕒:1s 🧪:unit 📦:auth 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/auth/LoginForm.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/auth/LoginForm.test_20250308_035631.log)
❌🔢📍📘 🕒:2s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Toggle.test.ts | [log](/tests/results/logs/packages/vue-components/tests/p2/components/ui/Toggle.test_20250308_035629.log)
❌🔢📍📘👯 🕒:1s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Select.test.ts | [log](/tests/results/logs/packages/vue-components/tests/p2/components/ui/Select.test_20250308_035627.log)
❌🔢📍📝👯 🕒:2s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Select.test.js | [log](/tests/results/logs/packages/vue-components/tests/p2/components/ui/Select.test_20250308_035625.log)
❌🔢📍📘 🕒:1s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Select.minimal.test.ts | [log](/tests/results/logs/packages/vue-components/tests/p2/components/ui/Select.minimal.test_20250308_035623.log)
❌🔢📍📘👯 🕒:2s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Checkbox.test.ts | [log](/tests/results/logs/packages/vue-components/tests/p2/components/ui/Checkbox.test_20250308_035621.log)
❌🔢📍📝👯 🕒:2s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Checkbox.test.js | [log](/tests/results/logs/packages/vue-components/tests/p2/components/ui/Checkbox.test_20250308_035619.log)
❌🔢📍📘 🕒:1s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Button.test.ts | [log](/tests/results/logs/packages/vue-components/tests/p2/components/ui/Button.test_20250308_035618.log)
❌🔢📍📘 🕒:2s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/layout/DashboardLayout.test.ts | [log](/tests/results/logs/packages/vue-components/tests/p2/components/layout/DashboardLayout.test_20250308_035616.log)
❌🔢📍📘 🕒:3s 🧪:unit 📦:utils 🔍:Unknown /opt/mExpress/packages/utils/tests/p2/utils/logger.test.ts | [log](/tests/results/logs/packages/utils/tests/p2/utils/logger.test_20250308_035613.log)
❌🔢📍📘 🕒:4s 🧪:unit 📦:utils 🔍:Unknown /opt/mExpress/packages/utils/tests/p2/lib/monitoring/monitoring.system.test.ts | [log](/tests/results/logs/packages/utils/tests/p2/lib/monitoring/monitoring.system.test_20250308_035609.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/services/data-consistency.test.ts | [log](/tests/results/logs/packages/core/tests/p2/services/data-consistency.test_20250308_035602.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/reconciliation-tools/matrixTracker.test.ts | [log](/tests/results/logs/packages/core/tests/p2/reconciliation-tools/matrixTracker.test_20250308_035557.log)
✅🔢📍📘 🕒:6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/reconciliation-tools/componentScanner.test.ts | [log](/tests/results/logs/packages/core/tests/p2/reconciliation-tools/componentScanner.test_20250308_035551.log)
✅🔢📍📗 🕒:5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/frontend/components/mobile/responsive-layout.test.tsx | [log](/tests/results/logs/packages/core/tests/p2/frontend/components/mobile/responsive-layout.test_20250308_035546.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/type-of.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/type-of.test_20250308_035541.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/product.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/product.test_20250308_035534.log)
✅🔢📍📘 🕒:4s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/order-by-first-call.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/order-by-first-call.test_20250308_035530.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/mobile-viewport.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/mobile-viewport.test_20250308_035525.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/message-queue-recovery.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/message-queue-recovery.test_20250308_035520.log)
✅🔢📍📘 🕒:6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/function-name.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/function-name.test_20250308_035514.log)
✅🔢📍📘 🕒:6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/customer.unit.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/customer.unit.test_20250308_035508.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/copy-prototype-methods.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/copy-prototype-methods.test_20250308_035503.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/class-name.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/class-name.test_20250308_035458.log)
✅🔢📍📘 🕒:4s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/called-in-order.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/called-in-order.test_20250308_035454.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/bulk-operations.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/bulk-operations.test_20250308_035446.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p2/auth/multi-login.test.ts | [log](/tests/results/logs/packages/core/tests/p2/auth/multi-login.test_20250308_035441.log)
✅🔢📍📘 🕒:6s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p2/api/edge-cases.test.ts | [log](/tests/results/logs/packages/core/tests/p2/api/edge-cases.test_20250308_035435.log)


### P3 (Low Priority) Tests - Running
❌🔢📍📗 🕒:4s 🧪:unit 📦:frontend 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p3/components.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p3/components.test_20250308_035814.log)
❌🔢📍📘 🕒:4s 🧪:unit 📦:utils 🔍:Unknown /opt/mExpress/packages/utils/tests/p3/utils/rate-limiter.utils.test.ts | [log](/tests/results/logs/packages/utils/tests/p3/utils/rate-limiter.utils.test_20250308_035809.log)
❌🔢📍📘 🕒:5s 🧪:unit 📦:utils 🔍:Unknown /opt/mExpress/packages/utils/tests/p3/utils/monitoring.collector.test.ts | [log](/tests/results/logs/packages/utils/tests/p3/utils/monitoring.collector.test_20250308_035804.log)
❌🔢📍📘 🕒:3s 🧪:unit 📦:utils 🔍:Unknown /opt/mExpress/packages/utils/tests/p3/utils/moduleCheck.test.ts | [log](/tests/results/logs/packages/utils/tests/p3/utils/moduleCheck.test_20250308_035800.log)
❌🔢📍📘 🕒:3s 🧪:unit 📦:utils 🔍:Unknown /opt/mExpress/packages/utils/tests/p3/lib/resilience/retry-strategy.error.test.ts | [log](/tests/results/logs/packages/utils/tests/p3/lib/resilience/retry-strategy.error.test_20250308_035756.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p3/services/load-balancer.test.ts | [log](/tests/results/logs/packages/core/tests/p3/services/load-balancer.test_20250308_035751.log)
✅🔢📍📘 🕒:5s 🧪:integration 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p3/models/customer.integration.test.ts | [log](/tests/results/logs/packages/core/tests/p3/models/customer.integration.test_20250308_035746.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p3/infrastructure/database-performance.test.ts | [log](/tests/results/logs/packages/core/tests/p3/infrastructure/database-performance.test_20250308_035740.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p3/frontend/components/TestExecutionPanel.test.ts | [log](/tests/results/logs/packages/core/tests/p3/frontend/components/TestExecutionPanel.test_20250308_035735.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p3/frontend/components/styling-consistency.test.ts | [log](/tests/results/logs/packages/core/tests/p3/frontend/components/styling-consistency.test_20250308_035730.log)
✅🔢📍📘 🕒:6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p3/frontend/accessibility/component-accessibility.test.ts | [log](/tests/results/logs/packages/core/tests/p3/frontend/accessibility/component-accessibility.test_20250308_035724.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p3/core/message-queue-stress.test.ts | [log](/tests/results/logs/packages/core/tests/p3/core/message-queue-stress.test_20250308_035719.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p3/auth/performance.test.ts | [log](/tests/results/logs/packages/core/tests/p3/auth/performance.test_20250308_035714.log)
✅🔢📍📘 🕒:11s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p3/api/stress-tests.test.ts | [log](/tests/results/logs/packages/core/tests/p3/api/stress-tests.test_20250308_035703.log)
✅🔢📍📘 🕒:6s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p3/api/simplified-rate-limit.test.ts | [log](/tests/results/logs/packages/core/tests/p3/api/simplified-rate-limit.test_20250308_035657.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p3/api/basic-stress.test.ts | [log](/tests/results/logs/packages/core/tests/p3/api/basic-stress.test_20250308_035652.log)


### Tests with Unknown Priority - Running






























































































































### Test Statistics (In Progress)

Total tests to run: 121
Tests completed: 121/121 (100%)
Passing: 74
Failing: 47
Timed out: 0
TypeScript files: 113 (93%)
JavaScript files: 8 (7%)

## Test Run Complete - Summary


## Summary Statistics

```
Total tests run: 121
Passing: 74 (61%)
Failing: 47 (39%)
Timed out: 0 (0%)
Skipped: 0
Removed: 2 (due to migration to TypeScript)
```

## Language Breakdown

```
JavaScript (.js): 8 ⚠️
TypeScript (.ts): 98 ✓
React TypeScript (.tsx): 15 ✓
React JavaScript (.jsx): 0 ⚠️
Duplicate Tests: 3 (down from 5)

TypeScript Adoption: 93% (93% TypeScript, 7% JavaScript)
Migration Target: 100% TypeScript
```

TypeScript Migration Status:
- ⭐⭐⭐⭐⭐ Excellent: 95-100% TypeScript
- ⭐⭐⭐⭐☆ Very Good: 85-94% TypeScript
- ⭐⭐⭐☆☆ Good: 75-84% TypeScript 
- ⭐⭐☆☆☆ Fair: 60-74% TypeScript
- ⭐☆☆☆☆ Poor: <60% TypeScript

Current Status: ⭐⭐⭐⭐☆ Very Good

## Recent Updates

**2025-03-08** (2nd update):
- Fixed auth interceptor and auth service tests in P0:
  - Fixed `/opt/mExpress/projects/montpc_crm/tests/frontend/p0/api/interceptors/auth.interceptor.test.ts` - Added localStorage mock
  - Fixed `/opt/mExpress/projects/montpc_crm/tests/frontend/p0/api/services/auth.service.test.ts` - Passed without modifications
- Removed JavaScript versions of tests that have TypeScript equivalents:
  - Removed `/opt/mExpress/packages/core/tests/p0/core/every.test.js`
  - Removed `/opt/mExpress/packages/core/tests/p0/core/value-to-string.test.js`
- Updated TypeScript adoption metrics:
  - Increased from 91% to 93%
  - Reduced duplicate test count from 5 to 3
  - Removed failing JavaScript tests that were already migrated to TypeScript
- Improved overall pass rate from 59% to 61%

**2025-03-08** (1st update):
- Added real-time test status reporting
  - Test results now appear immediately after each test runs
  - Statistics update incrementally during test execution
  - Pass/fail metrics are calculated during the run
- Added language breakdown tracking
  - JavaScript vs TypeScript file detection
  - Migration status indicators for test files
  - TypeScript adoption percentage tracking
- Improved error type detection in failing tests
- Added test execution time tracking
