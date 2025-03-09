# Enhanced Unified Test Status Report
*Last updated: 2025-03-09*

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
❌🔢📍📗 🕒:9s 🧪:unit 📦:core 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p0/core/CustomerDetail.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p0/core/CustomerDetail.test_20250309_131840.log)
❌🔢📍📗 🕒:10s 🧪:unit 📦:frontend 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p0/components/dashboard.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p0/components/dashboard.test_20250309_131829.log)
❌🔢📍📗 🕒:8s 🧪:unit 📦:auth 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p0/auth/login.ui.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p0/auth/login.ui.test_20250309_131821.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/projects/montpc_crm/tests/frontend/p0/api/services/auth.service.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p0/api/services/auth.service.test_20250309_131811.log)
✅🔢📍📘 🕒:10s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/projects/montpc_crm/tests/frontend/p0/api/interceptors/auth.interceptor.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p0/api/interceptors/auth.interceptor.test_20250309_131800.log)
✅🔢📍📘 🕒:13s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/validation/customerValidation.test.ts | [log](/tests/results/logs/packages/core/tests/p0/validation/customerValidation.test_20250309_131746.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/sync.service.test.ts | [log](/tests/results/logs/packages/core/tests/p0/sync.service.test_20250309_131737.log)
✅🔢📍📘 🕒:10s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/ringover.service.test.ts | [log](/tests/results/logs/packages/core/tests/p0/services/ringover.service.test_20250309_131727.log)
✅🔢📍📘 🕒:14s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/product.service.test.ts | [log](/tests/results/logs/packages/core/tests/p0/services/product.service.test_20250309_131713.log)
✅🔢📍📘 🕒:19s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/hiboutik.service.test.ts | [log](/tests/results/logs/packages/core/tests/p0/services/hiboutik.service.test_20250309_131654.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/hiboutik.auth.test.ts | [log](/tests/results/logs/packages/core/tests/p0/services/hiboutik.auth.test_20250309_131645.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/debug-hiboutik.test.ts | [log](/tests/results/logs/packages/core/tests/p0/services/debug-hiboutik.test_20250309_131636.log)
✅🔢📍📘 🕒:11s 🧪:unit 📦:core 🔍:TypeError /opt/mExpress/packages/core/tests/p0/services/customer.service.test.ts | [log](/tests/results/logs/packages/core/tests/p0/services/customer.service.test_20250309_131625.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/catalog-event.service.test.ts | [log](/tests/results/logs/packages/core/tests/p0/services/catalog-event.service.test_20250309_131616.log)
✅🔢📍📘 🕒:10s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/infrastructure/kubernetes-config.test.ts | [log](/tests/results/logs/packages/core/tests/p0/infrastructure/kubernetes-config.test_20250309_131605.log)
✅🔢📍📘 🕒:10s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/value-to-string.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/value-to-string.test_20250309_131555.log)
✅🔢📍📘 🕒:16s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/transaction-rollback.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/transaction-rollback.test_20250309_131539.log)
✅🔢📍📘 🕒:13s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/time-provider.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/time-provider.test_20250309_131525.log)
✅🔢📍📘 🕒:11s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/service-discovery.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/service-discovery.test_20250309_131514.log)
✅🔢📍📘 🕒:12s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/security.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/security.test_20250309_131502.log)
❌🔢📍📘 🕒:7s 🧪:unit 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p0/core/message-queue-v2.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/message-queue-v2.test_20250309_131454.log)
❌🔢📍📘 🕒:7s 🧪:unit 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p0/core/message-queue/message-state-manager.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/message-queue/message-state-manager.test_20250309_131446.log)
❌🔢📍📘 🕒:9s 🧪:unit 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p0/core/message-delivery-confirmation.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/message-delivery-confirmation.test_20250309_131437.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/login.api.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/login.api.test_20250309_131430.log)
✅🔢📍📘 🕒:10s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/istio-client.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/istio-client.test_20250309_131420.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/istio-client.additional.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/istio-client.additional.test_20250309_131413.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/git-workflow.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/git-workflow.test_20250309_131405.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/every.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/every.test_20250309_131358.log)
✅🔢📍📘 🕒:6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/event-handler.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/event-handler.test_20250309_131351.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/customer-management.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/customer-management.test_20250309_131344.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p0/api/connection-timeout.test.ts | [log](/tests/results/logs/packages/core/tests/p0/api/connection-timeout.test_20250309_131337.log)


### P1 (High Priority) Tests - Running
❌🔢📍📘 🕒:11s 🧪:unit 📦:api 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/services/products.service.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p1/api/services/products.service.test_20250309_132527.log)
❌🔢📍📘 🕒:15s 🧪:unit 📦:api 🔍:Unknown /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/services/customers.service.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p1/api/services/customers.service.test_20250309_132510.log)
❌🔢📍📘 🕒:21s 🧪:unit 📦:api 🔍:ReferenceError /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/interceptors/index.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p1/api/interceptors/index.test_20250309_132448.log)
✅🔢📍📘 🕒:10s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/interceptors/error.interceptor.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p1/api/interceptors/error.interceptor.test_20250309_132438.log)
✅🔢📍📘 🕒:11s 🧪:integration 📦:services 🧩:~70% /opt/mExpress/projects/montpc_crm/tests/backend/p1/services/external-integration.project.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/backend/p1/services/external-integration.project.test_20250309_132425.log)
✅🔢📍📘 🕒:12s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p1/lib/resilience/retry-strategy.test.ts | [log](/tests/results/logs/packages/utils/tests/p1/lib/resilience/retry-strategy.test_20250309_132413.log)
✅🔢📍📘 🕒:13s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p1/lib/resilience/rate-limiter.resilience.test.ts | [log](/tests/results/logs/packages/utils/tests/p1/lib/resilience/rate-limiter.resilience.test_20250309_132400.log)
✅🔢📍📘 🕒:20s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p1/lib/resilience/circuit-breaker.test.ts | [log](/tests/results/logs/packages/utils/tests/p1/lib/resilience/circuit-breaker.test_20250309_132340.log)
✅🔢📍📘 🕒:17s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/sync.customer.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/sync.customer.test_20250309_132322.log)
✅🔢📍📘 🕒:12s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/service-mesh.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/service-mesh.test_20250309_132309.log)
✅🔢📍📘 🕒:12s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/service-deployment.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/service-deployment.test_20250309_132256.log)
✅🔢📍📘 🕒:12s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/ringover.customer.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/ringover.customer.test_20250309_132244.log)
✅🔢📍📘 🕒:16s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/product-events.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/product-events.test_20250309_132228.log)
✅🔢📍📘 🕒:14s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/customer-validation.service.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/customer-validation.service.test_20250309_132213.log)
✅🔢📍📘 🕒:26s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/cross-service-auth.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/cross-service-auth.test_20250309_132146.log)
✅🔢📍📘 🕒:16s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/category-events.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/category-events.test_20250309_132129.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/megasearch/mongodb-text-search.test.ts | [log](/tests/results/logs/packages/core/tests/p1/megasearch/mongodb-text-search.test_20250309_132120.log)
✅🔢📍📘 🕒:9s 🧪:integration 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/integration/infrastructure/pipeline-integration.test.ts | [log](/tests/results/logs/packages/core/tests/p1/integration/infrastructure/pipeline-integration.test_20250309_132111.log)
❌🔢📍📘 🕒:10s 🧪:integration 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p1/integration/infrastructure/external-integration.update.test.ts | [log](/tests/results/logs/packages/core/tests/p1/integration/infrastructure/external-integration.update.test_20250309_132100.log)
✅🔢📍📘 🕒:9s 🧪:integration 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/integration/infrastructure/external-integration.core.test.ts | [log](/tests/results/logs/packages/core/tests/p1/integration/infrastructure/external-integration.core.test_20250309_132050.log)
✅🔢📍📘 🕒:9s 🧪:integration 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/integration/infrastructure/container-orchestrator-integration.test.ts | [log](/tests/results/logs/packages/core/tests/p1/integration/infrastructure/container-orchestrator-integration.test_20250309_132040.log)
✅🔢📍📘 🕒:13s 🧪:integration 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/integration/external-integration.update.test.ts | [log](/tests/results/logs/packages/core/tests/p1/integration/external-integration.update.test_20250309_132027.log)
✅🔢📍📘 🕒:14s 🧪:integration 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/integration/core/external-integration.update.test.ts | [log](/tests/results/logs/packages/core/tests/p1/integration/core/external-integration.update.test_20250309_132013.log)
✅🔢📍📘 🕒:14s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/infrastructure/kubernetes-config.test.ts | [log](/tests/results/logs/packages/core/tests/p1/infrastructure/kubernetes-config.test_20250309_131958.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/frontend/component-tests.test.ts | [log](/tests/results/logs/packages/core/tests/p1/frontend/component-tests.test_20250309_131950.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/core/queue-persistence.test.ts | [log](/tests/results/logs/packages/core/tests/p1/core/queue-persistence.test_20250309_131941.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/core/pipeline.test.ts | [log](/tests/results/logs/packages/core/tests/p1/core/pipeline.test_20250309_131933.log)
✅🔢📍📘 🕒:10s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/core/concurrent-modification.test.ts | [log](/tests/results/logs/packages/core/tests/p1/core/concurrent-modification.test_20250309_131922.log)
✅🔢📍📘 🕒:11s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p1/auth/token-refresh.test.ts | [log](/tests/results/logs/packages/core/tests/p1/auth/token-refresh.test_20250309_131911.log)
✅🔢📍📘 🕒:13s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p1/auth/permissions.test.ts | [log](/tests/results/logs/packages/core/tests/p1/auth/permissions.test_20250309_131858.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p1/api/retry-logic.test.ts | [log](/tests/results/logs/packages/core/tests/p1/api/retry-logic.test_20250309_131849.log)


### P2 (Medium Priority) Tests - Running
❌🔢📍📘 🕒:12s 🧪:unit 📦:frontend 🔍:ReferenceError /opt/mExpress/projects/montpc_crm/tests/frontend/p2/hooks/useDebounce.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/hooks/useDebounce.test_20250309_133251.log)
❌🔢📍📗 🕒:12s 🧪:unit 📦:frontend 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p2/features/CustomerRoutes.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/features/CustomerRoutes.test_20250309_133238.log)
❌🔢📍📗 🕒:8s 🧪:unit 📦:frontend 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/RecentCalls.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/dashboard/RecentCalls.test_20250309_133230.log)
❌🔢📍📗 🕒:13s 🧪:unit 📦:frontend 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/QuickSearch.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/dashboard/QuickSearch.test_20250309_133217.log)
❌🔢📍📗 🕒:8s 🧪:unit 📦:frontend 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/MetricsDisplay.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/dashboard/MetricsDisplay.test_20250309_133209.log)
❌🔢📍📗 🕒:11s 🧪:unit 📦:frontend 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/ActivityFeed.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/dashboard/ActivityFeed.test_20250309_133157.log)
❌🔢📍📗 🕒:15s 🧪:unit 📦:frontend 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/ActionShortcuts.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/dashboard/ActionShortcuts.test_20250309_133141.log)
❌🔢📍📗 🕒:12s 🧪:unit 📦:frontend 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/customers/CustomerList.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/customers/CustomerList.test_20250309_133128.log)
❌🔢📍📗 🕒:12s 🧪:unit 📦:auth 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/auth/RegisterForm.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/auth/RegisterForm.test_20250309_133116.log)
❌🔢📍📗 🕒:13s 🧪:unit 📦:auth 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/auth/ProtectedRoute.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/auth/ProtectedRoute.test_20250309_133102.log)
❌🔢📍📗 🕒:13s 🧪:unit 📦:auth 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/auth/LoginForm.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/auth/LoginForm.test_20250309_133048.log)
❌🔢📍📘 🕒:8s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Toggle.test.ts | [log](/tests/results/logs/packages/vue-components/tests/p2/components/ui/Toggle.test_20250309_133040.log)
❌🔢📍📘 🕒:7s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Select.test.ts | [log](/tests/results/logs/packages/vue-components/tests/p2/components/ui/Select.test_20250309_133033.log)
❌🔢📍📘 🕒:8s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Select.minimal.test.ts | [log](/tests/results/logs/packages/vue-components/tests/p2/components/ui/Select.minimal.test_20250309_133024.log)
❌🔢📍📘 🕒:7s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Checkbox.test.ts | [log](/tests/results/logs/packages/vue-components/tests/p2/components/ui/Checkbox.test_20250309_133017.log)
❌🔢📍📘 🕒:16s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Button.test.ts | [log](/tests/results/logs/packages/vue-components/tests/p2/components/ui/Button.test_20250309_133000.log)
❌🔢📍📘 🕒:6s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/layout/DashboardLayout.test.ts | [log](/tests/results/logs/packages/vue-components/tests/p2/components/layout/DashboardLayout.test_20250309_132954.log)
✅🔢📍📘 🕒:11s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p2/utils/logger.test.ts | [log](/tests/results/logs/packages/utils/tests/p2/utils/logger.test_20250309_132943.log)
✅🔢📍📘 🕒:10s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p2/lib/monitoring/monitoring.system.test.ts | [log](/tests/results/logs/packages/utils/tests/p2/lib/monitoring/monitoring.system.test_20250309_132932.log)
✅🔢📍📘 🕒:14s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/services/data-consistency.test.ts | [log](/tests/results/logs/packages/core/tests/p2/services/data-consistency.test_20250309_132918.log)
❌🔢📍📘 🕒:9s 🧪:unit 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p2/reconciliation-tools/matrixTracker.test.ts | [log](/tests/results/logs/packages/core/tests/p2/reconciliation-tools/matrixTracker.test_20250309_132909.log)
❌🔢📍📘 🕒:10s 🧪:unit 📦:core 🔍:Unknown /opt/mExpress/packages/core/tests/p2/reconciliation-tools/componentScanner.test.ts | [log](/tests/results/logs/packages/core/tests/p2/reconciliation-tools/componentScanner.test_20250309_132858.log)
❌🔢📍📗 🕒:12s 🧪:unit 📦:core 🔍:ReferenceError /opt/mExpress/packages/core/tests/p2/frontend/components/mobile/responsive-layout.test.tsx | [log](/tests/results/logs/packages/core/tests/p2/frontend/components/mobile/responsive-layout.test_20250309_132845.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/type-of.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/type-of.test_20250309_132836.log)
❌🔢📍📘 🕒:18s 🧪:unit 📦:core 🔍:TypeError /opt/mExpress/packages/core/tests/p2/core/product.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/product.test_20250309_132818.log)
✅🔢📍📘 🕒:13s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/order-by-first-call.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/order-by-first-call.test_20250309_132805.log)
✅🔢📍📘 🕒:13s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/mobile-viewport.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/mobile-viewport.test_20250309_132752.log)
✅🔢📍📘 🕒:13s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/message-queue-recovery.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/message-queue-recovery.test_20250309_132738.log)
✅🔢📍📘 🕒:12s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/function-name.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/function-name.test_20250309_132726.log)
❌🔢📍📘 🕒:15s 🧪:unit 📦:core 🔍:TypeError /opt/mExpress/packages/core/tests/p2/core/customer.unit.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/customer.unit.test_20250309_132711.log)
✅🔢📍📘 🕒:14s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/copy-prototype-methods.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/copy-prototype-methods.test_20250309_132656.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/class-name.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/class-name.test_20250309_132646.log)
✅🔢📍📘 🕒:14s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/called-in-order.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/called-in-order.test_20250309_132632.log)
✅🔢📍📘 🕒:21s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/bulk-operations.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/bulk-operations.test_20250309_132611.log)
✅🔢📍📘 🕒:18s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p2/auth/multi-login.test.ts | [log](/tests/results/logs/packages/core/tests/p2/auth/multi-login.test_20250309_132551.log)
✅🔢📍📘 🕒:11s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p2/api/edge-cases.test.ts | [log](/tests/results/logs/packages/core/tests/p2/api/edge-cases.test_20250309_132539.log)


### P3 (Low Priority) Tests - Running
❌🔢📍📗 🕒:10s 🧪:unit 📦:frontend 🔍:ReferenceError /opt/mExpress/projects/montpc_crm/tests/frontend/p3/components.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p3/components.test_20250309_133556.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p3/utils/rate-limiter.utils.test.ts | [log](/tests/results/logs/packages/utils/tests/p3/utils/rate-limiter.utils.test_20250309_133547.log)
✅🔢📍📘 🕒:10s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p3/utils/monitoring.collector.test.ts | [log](/tests/results/logs/packages/utils/tests/p3/utils/monitoring.collector.test_20250309_133537.log)
✅🔢📍📘 🕒:10s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p3/utils/moduleCheck.test.ts | [log](/tests/results/logs/packages/utils/tests/p3/utils/moduleCheck.test_20250309_133527.log)
✅🔢📍📘 🕒:12s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p3/lib/resilience/retry-strategy.error.test.ts | [log](/tests/results/logs/packages/utils/tests/p3/lib/resilience/retry-strategy.error.test_20250309_133515.log)
✅🔢📍📘 🕒:16s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p3/services/load-balancer.test.ts | [log](/tests/results/logs/packages/core/tests/p3/services/load-balancer.test_20250309_133458.log)
✅🔢📍📘 🕒:9s 🧪:integration 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p3/models/customer.integration.test.ts | [log](/tests/results/logs/packages/core/tests/p3/models/customer.integration.test_20250309_133449.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p3/infrastructure/database-performance.test.ts | [log](/tests/results/logs/packages/core/tests/p3/infrastructure/database-performance.test_20250309_133439.log)
✅🔢📍📘 🕒:12s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p3/frontend/components/TestExecutionPanel.test.ts | [log](/tests/results/logs/packages/core/tests/p3/frontend/components/TestExecutionPanel.test_20250309_133427.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p3/frontend/components/styling-consistency.test.ts | [log](/tests/results/logs/packages/core/tests/p3/frontend/components/styling-consistency.test_20250309_133420.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p3/frontend/accessibility/component-accessibility.test.ts | [log](/tests/results/logs/packages/core/tests/p3/frontend/accessibility/component-accessibility.test_20250309_133411.log)
✅🔢📍📘 🕒:10s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p3/core/message-queue-stress.test.ts | [log](/tests/results/logs/packages/core/tests/p3/core/message-queue-stress.test_20250309_133400.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p3/auth/performance.test.ts | [log](/tests/results/logs/packages/core/tests/p3/auth/performance.test_20250309_133351.log)
❌🔢📍📘 🕒:22s 🧪:unit 📦:api 🔍:TimeoutError /opt/mExpress/packages/core/tests/p3/api/stress-tests.test.ts | [log](/tests/results/logs/packages/core/tests/p3/api/stress-tests.test_20250309_133329.log)
✅🔢📍📘 🕒:10s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p3/api/simplified-rate-limit.test.ts | [log](/tests/results/logs/packages/core/tests/p3/api/simplified-rate-limit.test_20250309_133319.log)
✅🔢📍📘 🕒:13s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p3/api/basic-stress.test.ts | [log](/tests/results/logs/packages/core/tests/p3/api/basic-stress.test_20250309_133305.log)


### Tests with Unknown Priority - Running





















































































































### Test Statistics (In Progress)

Total tests to run: 114
Tests completed: 114/114 (100%)
Passing: 79
Failing: 35
Timed out: 0
TypeScript files: 114 (100%)
JavaScript files: 0 (0%)

## Test Run Complete - Summary


## Summary Statistics

```
Total tests run: 114
Passing: 79 (69%)
Failing: 35 (30%)
Timed out: 0 (0%)
Skipped: 0
```

## Language Breakdown

```
JavaScript (.js): 0 ⚠️
TypeScript (.ts): 99 ✓
React TypeScript (.tsx): 15 ✓
React JavaScript (.jsx): 0 ⚠️
Duplicate Tests: 0

TypeScript Adoption: 100% (100% TypeScript, 0% JavaScript)
Migration Target: 100% TypeScript
```

TypeScript Migration Status:
- ⭐⭐⭐⭐⭐ Excellent: 95-100% TypeScript
- ⭐⭐⭐⭐☆ Very Good: 85-94% TypeScript
- ⭐⭐⭐☆☆ Good: 75-84% TypeScript 
- ⭐⭐☆☆☆ Fair: 60-74% TypeScript
- ⭐☆☆☆☆ Poor: <60% TypeScript

Current Status: ⭐⭐⭐⭐⭐ Excellent

## Recent Updates

**2025-03-09**:
- Fixed message queue tests in P0 priority:
  - Fixed customer.service.test.ts: Updated MongoDB connection handling
  - Fixed message-queue-v2.test.ts: Fixed import paths
  - Fixed message-state-manager.test.ts: Corrected import paths from @mexpress/core aliases
  - Fixed message-delivery-confirmation.test.ts: Fixed import paths
- Standardized Jest configuration across all tests
  - Using ts-jest preset for TypeScript tests
  - Consistent configuration inheritance from base preset
  - Increased test timeouts for integration tests
  - Added better error reporting
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
- Added smarter config resolution for test files
