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
- ✅🔄🕒:0.0s🧪:integration📦:core /opt/mExpress/packages/core/tests/integration/external-integration.update.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:api /opt/mExpress/packages/core/tests/p0/api/connection-timeout.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/core/customer-management.test.ts
- ❌🔄🕒:0.0s🧪:unit📦:core🔍:Unknown /opt/mExpress/packages/core/tests/p0/core/event-handler.test.ts
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
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/services/customer.service.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/services/debug-hiboutik.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:auth /opt/mExpress/packages/core/tests/p0/services/hiboutik.auth.test.ts
- ✅🔄🕒:0.0s🧪:unit📦:core /opt/mExpress/packages/core/tests/p0/services/hiboutik.service.test.ts

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
