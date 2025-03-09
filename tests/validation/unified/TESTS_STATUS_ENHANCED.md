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
❌🔢📍📗 🕒:11s 🧪:unit 📦:core 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p0/core/CustomerDetail.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p0/core/CustomerDetail.test_20250309_185630.log)
❌🔢📍📗 🕒:8s 🧪:unit 📦:frontend 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p0/components/dashboard.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p0/components/dashboard.test_20250309_185622.log)
❌🔢📍📗 🕒:7s 🧪:unit 📦:auth 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p0/auth/login.ui.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p0/auth/login.ui.test_20250309_185615.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/projects/montpc_crm/tests/frontend/p0/api/services/auth.service.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p0/api/services/auth.service.test_20250309_185605.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/projects/montpc_crm/tests/frontend/p0/api/interceptors/auth.interceptor.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p0/api/interceptors/auth.interceptor.test_20250309_185556.log)
✅🔢📍📘 🕒:15s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/validation/customerValidation.test.ts | [log](/tests/results/logs/packages/core/tests/p0/validation/customerValidation.test_20250309_185541.log)
✅🔢📍📘 🕒:12s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/sync.service.test.ts | [log](/tests/results/logs/packages/core/tests/p0/sync.service.test_20250309_185529.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/ringover.service.test.ts | [log](/tests/results/logs/packages/core/tests/p0/services/ringover.service.test_20250309_185518.log)
✅🔢📍📘 🕒:13s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/product.service.test.ts | [log](/tests/results/logs/packages/core/tests/p0/services/product.service.test_20250309_185505.log)
✅🔢📍📘 🕒:16s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/hiboutik.service.test.ts | [log](/tests/results/logs/packages/core/tests/p0/services/hiboutik.service.test_20250309_185448.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/hiboutik.auth.test.ts | [log](/tests/results/logs/packages/core/tests/p0/services/hiboutik.auth.test_20250309_185438.log)
✅🔢📍📘 🕒:12s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/debug-hiboutik.test.ts | [log](/tests/results/logs/packages/core/tests/p0/services/debug-hiboutik.test_20250309_185426.log)
✅🔢📍📘 🕒:11s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/customer.service.test.ts | [log](/tests/results/logs/packages/core/tests/p0/services/customer.service.test_20250309_185415.log)
✅🔢📍📘 🕒:10s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/services/catalog-event.service.test.ts | [log](/tests/results/logs/packages/core/tests/p0/services/catalog-event.service.test_20250309_185405.log)
✅🔢📍📘 🕒:11s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/infrastructure/kubernetes-config.test.ts | [log](/tests/results/logs/packages/core/tests/p0/infrastructure/kubernetes-config.test_20250309_185354.log)
✅🔢📍📘 🕒:12s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/value-to-string.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/value-to-string.test_20250309_185341.log)
✅🔢📍📘 🕒:16s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/transaction-rollback.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/transaction-rollback.test_20250309_185325.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/time-provider.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/time-provider.test_20250309_185315.log)
✅🔢📍📘 🕒:12s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/service-discovery.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/service-discovery.test_20250309_185303.log)
✅🔢📍📘 🕒:11s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/security.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/security.test_20250309_185251.log)
✅🔢📍📘 🕒:10s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/message-queue-v2.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/message-queue-v2.test_20250309_185240.log)
✅🔢📍📘 🕒:11s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/message-queue/message-state-manager.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/message-queue/message-state-manager.test_20250309_185229.log)
✅🔢📍📘 🕒:13s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/message-delivery-confirmation.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/message-delivery-confirmation.test_20250309_185216.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/login.api.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/login.api.test_20250309_185207.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/istio-client.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/istio-client.test_20250309_185158.log)
✅🔢📍📘 🕒:10s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/istio-client.additional.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/istio-client.additional.test_20250309_185147.log)
✅🔢📍📘 🕒:11s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/git-workflow.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/git-workflow.test_20250309_185136.log)
✅🔢📍📘 🕒:11s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/every.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/every.test_20250309_185125.log)
✅🔢📍📘 🕒:11s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/event-handler.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/event-handler.test_20250309_185113.log)
✅🔢📍📘 🕒:13s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p0/core/customer-management.test.ts | [log](/tests/results/logs/packages/core/tests/p0/core/customer-management.test_20250309_185100.log)
✅🔢📍📘 🕒:34s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p0/api/connection-timeout.test.ts | [log](/tests/results/logs/packages/core/tests/p0/api/connection-timeout.test_20250309_185026.log)


### P1 (High Priority) Tests - Running
✅🔢📍📘 🕒:10s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/services/products.service.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p1/api/services/products.service.test_20250309_190116.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/services/customers.service.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p1/api/services/customers.service.test_20250309_190107.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/interceptors/index.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p1/api/interceptors/index.test_20250309_190051.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/projects/montpc_crm/tests/frontend/p1/api/interceptors/error.interceptor.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p1/api/interceptors/error.interceptor.test_20250309_190043.log)
✅🔢📍📘 🕒:8s 🧪:integration 📦:services 🧩:~70% /opt/mExpress/projects/montpc_crm/tests/backend/p1/services/external-integration.project.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/backend/p1/services/external-integration.project.test_20250309_190035.log)
✅🔢📍📘 🕒:11s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p1/lib/resilience/retry-strategy.test.ts | [log](/tests/results/logs/packages/utils/tests/p1/lib/resilience/retry-strategy.test_20250309_190024.log)
✅🔢📍📘 🕒:14s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p1/lib/resilience/rate-limiter.resilience.test.ts | [log](/tests/results/logs/packages/utils/tests/p1/lib/resilience/rate-limiter.resilience.test_20250309_190010.log)
✅🔢📍📘 🕒:12s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p1/lib/resilience/circuit-breaker.test.ts | [log](/tests/results/logs/packages/utils/tests/p1/lib/resilience/circuit-breaker.test_20250309_185957.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/sync.customer.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/sync.customer.test_20250309_185949.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/service-mesh.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/service-mesh.test_20250309_185941.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/service-deployment.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/service-deployment.test_20250309_185932.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/ringover.customer.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/ringover.customer.test_20250309_185923.log)
✅🔢📍📘 🕒:12s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/product-events.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/product-events.test_20250309_185911.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/customer-validation.service.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/customer-validation.service.test_20250309_185903.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/cross-service-auth.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/cross-service-auth.test_20250309_185855.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/services/category-events.test.ts | [log](/tests/results/logs/packages/core/tests/p1/services/category-events.test_20250309_185846.log)
✅🔢📍📘 🕒:6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/megasearch/mongodb-text-search.test.ts | [log](/tests/results/logs/packages/core/tests/p1/megasearch/mongodb-text-search.test_20250309_185840.log)
✅🔢📍📘 🕒:6s 🧪:integration 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/integration/infrastructure/pipeline-integration.test.ts | [log](/tests/results/logs/packages/core/tests/p1/integration/infrastructure/pipeline-integration.test_20250309_185833.log)
✅🔢📍📘 🕒:8s 🧪:integration 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/integration/infrastructure/external-integration.update.test.ts | [log](/tests/results/logs/packages/core/tests/p1/integration/infrastructure/external-integration.update.test_20250309_185826.log)
✅🔢📍📘 🕒:7s 🧪:integration 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/integration/infrastructure/external-integration.core.test.ts | [log](/tests/results/logs/packages/core/tests/p1/integration/infrastructure/external-integration.core.test_20250309_185819.log)
✅🔢📍📘 🕒:9s 🧪:integration 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/integration/infrastructure/container-orchestrator-integration.test.ts | [log](/tests/results/logs/packages/core/tests/p1/integration/infrastructure/container-orchestrator-integration.test_20250309_185810.log)
✅🔢📍📘 🕒:8s 🧪:integration 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/integration/external-integration.update.test.ts | [log](/tests/results/logs/packages/core/tests/p1/integration/external-integration.update.test_20250309_185801.log)
✅🔢📍📘 🕒:8s 🧪:integration 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/integration/core/external-integration.update.test.ts | [log](/tests/results/logs/packages/core/tests/p1/integration/core/external-integration.update.test_20250309_185753.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/infrastructure/kubernetes-config.test.ts | [log](/tests/results/logs/packages/core/tests/p1/infrastructure/kubernetes-config.test_20250309_185745.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/frontend/component-tests.test.ts | [log](/tests/results/logs/packages/core/tests/p1/frontend/component-tests.test_20250309_185736.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/core/queue-persistence.test.ts | [log](/tests/results/logs/packages/core/tests/p1/core/queue-persistence.test_20250309_185728.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/core/pipeline.test.ts | [log](/tests/results/logs/packages/core/tests/p1/core/pipeline.test_20250309_185721.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p1/core/concurrent-modification.test.ts | [log](/tests/results/logs/packages/core/tests/p1/core/concurrent-modification.test_20250309_185712.log)
✅🔢📍📘 🕒:12s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p1/auth/token-refresh.test.ts | [log](/tests/results/logs/packages/core/tests/p1/auth/token-refresh.test_20250309_185659.log)
✅🔢📍📘 🕒:10s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p1/auth/permissions.test.ts | [log](/tests/results/logs/packages/core/tests/p1/auth/permissions.test_20250309_185649.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p1/api/retry-logic.test.ts | [log](/tests/results/logs/packages/core/tests/p1/api/retry-logic.test_20250309_185642.log)


### P2 (Medium Priority) Tests - Running
✅🔢📍📘 🕒:7s 🧪:unit 📦:frontend 🧩:~70% /opt/mExpress/projects/montpc_crm/tests/frontend/p2/hooks/useDebounce.test.ts | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/hooks/useDebounce.test_20250309_190558.log)
❌🔢📍📗 🕒:7s 🧪:unit 📦:frontend 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p2/features/CustomerRoutes.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/features/CustomerRoutes.test_20250309_190551.log)
❌🔢📍📗 🕒:8s 🧪:unit 📦:frontend 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/RecentCalls.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/dashboard/RecentCalls.test_20250309_190543.log)
❌🔢📍📗 🕒:9s 🧪:unit 📦:frontend 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/QuickSearch.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/dashboard/QuickSearch.test_20250309_190534.log)
❌🔢📍📗 🕒:9s 🧪:unit 📦:frontend 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/MetricsDisplay.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/dashboard/MetricsDisplay.test_20250309_190525.log)
❌🔢📍📗 🕒:9s 🧪:unit 📦:frontend 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/ActivityFeed.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/dashboard/ActivityFeed.test_20250309_190516.log)
❌🔢📍📗 🕒:7s 🧪:unit 📦:frontend 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/dashboard/ActionShortcuts.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/dashboard/ActionShortcuts.test_20250309_190508.log)
❌🔢📍📗 🕒:9s 🧪:unit 📦:frontend 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/customers/CustomerList.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/customers/CustomerList.test_20250309_190459.log)
❌🔢📍📗 🕒:6s 🧪:unit 📦:auth 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/auth/RegisterForm.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/auth/RegisterForm.test_20250309_190453.log)
❌🔢📍📗 🕒:6s 🧪:unit 📦:auth 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/auth/ProtectedRoute.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/auth/ProtectedRoute.test_20250309_190447.log)
❌🔢📍📗 🕒:6s 🧪:unit 📦:auth 🔍:SyntaxError /opt/mExpress/projects/montpc_crm/tests/frontend/p2/components/auth/LoginForm.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p2/components/auth/LoginForm.test_20250309_190440.log)
❌🔢📍📘 🕒:4s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Toggle.test.ts | [log](/tests/results/logs/packages/vue-components/tests/p2/components/ui/Toggle.test_20250309_190435.log)
❌🔢📍📘 🕒:5s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Select.test.ts | [log](/tests/results/logs/packages/vue-components/tests/p2/components/ui/Select.test_20250309_190429.log)
❌🔢📍📘 🕒:3s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Select.minimal.test.ts | [log](/tests/results/logs/packages/vue-components/tests/p2/components/ui/Select.minimal.test_20250309_190425.log)
❌🔢📍📘 🕒:3s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Checkbox.test.ts | [log](/tests/results/logs/packages/vue-components/tests/p2/components/ui/Checkbox.test_20250309_190422.log)
❌🔢📍📘 🕒:5s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/ui/Button.test.ts | [log](/tests/results/logs/packages/vue-components/tests/p2/components/ui/Button.test_20250309_190417.log)
❌🔢📍📘 🕒:5s 🧪:unit 📦:unknown 🔍:Unknown /opt/mExpress/packages/vue-components/tests/p2/components/layout/DashboardLayout.test.ts | [log](/tests/results/logs/packages/vue-components/tests/p2/components/layout/DashboardLayout.test_20250309_190411.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p2/utils/logger.test.ts | [log](/tests/results/logs/packages/utils/tests/p2/utils/logger.test_20250309_190406.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p2/lib/monitoring/monitoring.system.test.ts | [log](/tests/results/logs/packages/utils/tests/p2/lib/monitoring/monitoring.system.test_20250309_190359.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/services/data-consistency.test.ts | [log](/tests/results/logs/packages/core/tests/p2/services/data-consistency.test_20250309_190349.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/reconciliation-tools/matrixTracker.test.ts | [log](/tests/results/logs/packages/core/tests/p2/reconciliation-tools/matrixTracker.test_20250309_190342.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/reconciliation-tools/componentScanner.test.ts | [log](/tests/results/logs/packages/core/tests/p2/reconciliation-tools/componentScanner.test_20250309_190335.log)
❌🔢📍📗 🕒:10s 🧪:unit 📦:core 🔍:ReferenceError /opt/mExpress/packages/core/tests/p2/frontend/components/mobile/responsive-layout.test.tsx | [log](/tests/results/logs/packages/core/tests/p2/frontend/components/mobile/responsive-layout.test_20250309_190325.log)
✅🔢📍📘 🕒:11s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/type-of.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/type-of.test_20250309_190314.log)
✅🔢📍📘 🕒:15s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/product.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/product.test_20250309_190259.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/order-by-first-call.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/order-by-first-call.test_20250309_190251.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/mobile-viewport.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/mobile-viewport.test_20250309_190243.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/message-queue-recovery.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/message-queue-recovery.test_20250309_190236.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/function-name.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/function-name.test_20250309_190228.log)
❌🔢📍📘 🕒:7s 🧪:unit 📦:core 🔍:TypeError /opt/mExpress/packages/core/tests/p2/core/customer.unit.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/customer.unit.test_20250309_190221.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/copy-prototype-methods.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/copy-prototype-methods.test_20250309_190214.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/class-name.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/class-name.test_20250309_190205.log)
✅🔢📍📘 🕒:9s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/called-in-order.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/called-in-order.test_20250309_190155.log)
✅🔢📍📘 🕒:11s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p2/core/bulk-operations.test.ts | [log](/tests/results/logs/packages/core/tests/p2/core/bulk-operations.test_20250309_190144.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p2/auth/multi-login.test.ts | [log](/tests/results/logs/packages/core/tests/p2/auth/multi-login.test_20250309_190135.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p2/api/edge-cases.test.ts | [log](/tests/results/logs/packages/core/tests/p2/api/edge-cases.test_20250309_190127.log)


### P3 (Low Priority) Tests - Running
❌🔢📍📗 🕒:5s 🧪:unit 📦:frontend 🔍:ReferenceError /opt/mExpress/projects/montpc_crm/tests/frontend/p3/components.test.tsx | [log](/tests/results/logs/projects/montpc_crm/tests/frontend/p3/components.test_20250309_190738.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p3/utils/rate-limiter.utils.test.ts | [log](/tests/results/logs/packages/utils/tests/p3/utils/rate-limiter.utils.test_20250309_190733.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p3/utils/monitoring.collector.test.ts | [log](/tests/results/logs/packages/utils/tests/p3/utils/monitoring.collector.test_20250309_190728.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p3/utils/moduleCheck.test.ts | [log](/tests/results/logs/packages/utils/tests/p3/utils/moduleCheck.test_20250309_190723.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:utils 🧩:~70% /opt/mExpress/packages/utils/tests/p3/lib/resilience/retry-strategy.error.test.ts | [log](/tests/results/logs/packages/utils/tests/p3/lib/resilience/retry-strategy.error.test_20250309_190718.log)
✅🔢📍📘 🕒:6s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p3/services/load-balancer.test.ts | [log](/tests/results/logs/packages/core/tests/p3/services/load-balancer.test_20250309_190712.log)
✅🔢📍📘 🕒:5s 🧪:integration 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p3/models/customer.integration.test.ts | [log](/tests/results/logs/packages/core/tests/p3/models/customer.integration.test_20250309_190707.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p3/infrastructure/database-performance.test.ts | [log](/tests/results/logs/packages/core/tests/p3/infrastructure/database-performance.test_20250309_190702.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p3/frontend/components/TestExecutionPanel.test.ts | [log](/tests/results/logs/packages/core/tests/p3/frontend/components/TestExecutionPanel.test_20250309_190656.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p3/frontend/components/styling-consistency.test.ts | [log](/tests/results/logs/packages/core/tests/p3/frontend/components/styling-consistency.test_20250309_190651.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p3/frontend/accessibility/component-accessibility.test.ts | [log](/tests/results/logs/packages/core/tests/p3/frontend/accessibility/component-accessibility.test_20250309_190644.log)
✅🔢📍📘 🕒:8s 🧪:unit 📦:core 🧩:~70% /opt/mExpress/packages/core/tests/p3/core/message-queue-stress.test.ts | [log](/tests/results/logs/packages/core/tests/p3/core/message-queue-stress.test_20250309_190636.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:auth 🧩:~70% /opt/mExpress/packages/core/tests/p3/auth/performance.test.ts | [log](/tests/results/logs/packages/core/tests/p3/auth/performance.test_20250309_190629.log)
❌🔢📍📘 🕒:11s 🧪:unit 📦:api 🔍:TimeoutError /opt/mExpress/packages/core/tests/p3/api/stress-tests.test.ts | [log](/tests/results/logs/packages/core/tests/p3/api/stress-tests.test_20250309_190618.log)
✅🔢📍📘 🕒:5s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p3/api/simplified-rate-limit.test.ts | [log](/tests/results/logs/packages/core/tests/p3/api/simplified-rate-limit.test_20250309_190612.log)
✅🔢📍📘 🕒:7s 🧪:unit 📦:api 🧩:~70% /opt/mExpress/packages/core/tests/p3/api/basic-stress.test.ts | [log](/tests/results/logs/packages/core/tests/p3/api/basic-stress.test_20250309_190605.log)


### Tests with Unknown Priority - Running





















































































































### Test Statistics (In Progress)

Total tests to run: 114
Tests completed: 114/114 (100%)
Passing: 90
Failing: 24
Timed out: 0
TypeScript files: 114 (100%)
JavaScript files: 0 (0%)

## Test Run Complete - Summary


## Summary Statistics

```
Total tests run: 114
Passing: 90 (79%)
Failing: 24 (21%)
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
- Fixed p2 priority product.test.ts in core directory
  - Problem: TypeError when calling validateSync() on mock Product model
  - Solution: Implemented comprehensive mock with proper TypeScript implementation of validateSync() method
  - BRQ: MEXP-2025-027-BE (Product Catalog)
- Fixed p2 priority componentScanner.test.ts in reconciliation-tools
  - Problem: Module resolution error with @mexpress/core path alias
  - Solution: Replaced path aliases with relative imports for more reliable resolution
  - BRQ: MEXP-2025-007-BE (Service Integration Architecture)
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
