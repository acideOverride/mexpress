# Jerome_bikes Project Test Status Report
*Last updated: 2025-03-17*

This report shows test execution status and metrics for the Jerome_bikes project.

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

❌📍🔢📘 🕒:2s 🧪:unit 📦:api 🔍:UnknownError 🧩:~70% /opt/mExpress/projects/jerome_bikes/tests/api/p0/station.api.test.ts | [log](/tests/results/logs//opt/mExpress/projects/jerome_bikes/tests/api/p0/station.api.test.ts_20250317_023129.log)
❌📍🔢📘 🕒:1s 🧪:unit 📦:api 🔍:UnknownError 🧩:~70% /opt/mExpress/projects/jerome_bikes/tests/api/p0/reservation.api.test.ts | [log](/tests/results/logs//opt/mExpress/projects/jerome_bikes/tests/api/p0/reservation.api.test.ts_20250317_023131.log)
❌📍🔢📘 🕒:1s 🧪:unit 📦:api 🔍:UnknownError 🧩:~70% /opt/mExpress/projects/jerome_bikes/tests/api/p0/docs/openapi-validation.test.ts | [log](/tests/results/logs//opt/mExpress/projects/jerome_bikes/tests/api/p0/docs/openapi-validation.test.ts_20250317_023133.log)
❌📍🔢📘 🕒:2s 🧪:unit 📦:api 🔍:UnknownError 🧩:~70% /opt/mExpress/projects/jerome_bikes/tests/api/p0/customer.api.test.ts | [log](/tests/results/logs//opt/mExpress/projects/jerome_bikes/tests/api/p0/customer.api.test.ts_20250317_023134.log)
❌📍🔢📘 🕒:1s 🧪:unit 📦:api 🔍:UnknownError 🧩:~70% /opt/mExpress/projects/jerome_bikes/tests/api/p0/auth.api.test.ts | [log](/tests/results/logs//opt/mExpress/projects/jerome_bikes/tests/api/p0/auth.api.test.ts_20250317_023136.log)
❌📍🔢📘 🕒:2s 🧪:unit 📦:api 🔍:UnknownError 🧩:~70% /opt/mExpress/projects/jerome_bikes/tests/api/p0/bike.api.test.ts | [log](/tests/results/logs//opt/mExpress/projects/jerome_bikes/tests/api/p0/bike.api.test.ts_20250317_023137.log)
❌📍🔢📘 🕒:1s 🧪:unit 📦:unknown 🔍:UnknownError 🧩:~70% /opt/mExpress/projects/jerome_bikes/tests/p0/sample.test.ts | [log](/tests/results/logs//opt/mExpress/projects/jerome_bikes/tests/p0/sample.test.ts_20250317_023139.log)
❌📍🔢📘 🕒:1s 🧪:integration 📦:unknown 🔍:UnknownError 🧩:~70% /opt/mExpress/projects/jerome_bikes/tests/backend/p1/integration/model-relationships.test.ts | [log](/tests/results/logs//opt/mExpress/projects/jerome_bikes/tests/backend/p1/integration/model-relationships.test.ts_20250317_023141.log)
❌📍🔢📘 🕒:1s 🧪:unit 📦:unknown 🔍:UnknownError 🧩:~70% /opt/mExpress/projects/jerome_bikes/tests/backend/p0/station.controller.test.ts | [log](/tests/results/logs//opt/mExpress/projects/jerome_bikes/tests/backend/p0/station.controller.test.ts_20250317_023142.log)
❌📍🔢📘 🕒:2s 🧪:unit 📦:unknown 🔍:UnknownError 🧩:~70% /opt/mExpress/projects/jerome_bikes/tests/backend/p0/reservation.model.test.ts | [log](/tests/results/logs//opt/mExpress/projects/jerome_bikes/tests/backend/p0/reservation.model.test.ts_20250317_023143.log)



## Test Execution Summary
| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Pass | 0 | 0% |
| ❌ Fail | 30 | 100% |
| ⏱️ Timeout | 0 | 0% |
| Total | 30 | 100% |

### Status by Component Area
| Component Area | Total | Pass | Fail | Pass Rate |
|----------------|-------|------|------|-----------|
| api | 11 | 0 | 11 | 0% |
| unknown | 17 | 0 | 17 | 0% |
| models | 2 | 0 | 2 | 0% |

### Status by Test Type
| Test Type | Total | Pass | Fail | Pass Rate |
|-----------|-------|------|------|-----------|
| unit | 27 | 0 | 27 | 0% |
| integration | 3 | 0 | 3 | 0% |

### Status by Priority
| Priority | Total | Pass | Fail | Pass Rate |
|----------|-------|------|------|-----------|
| unknown | 5 | 0 | 5 | 0% |
| P1 | 1 | 0 | 1 | 0% |
| P0 | 22 | 0 | 22 | 0% |
| P3 | 2 | 0 | 2 | 0% |

### File Type Distribution
| File Type | Count | Status |
|-----------|-------|--------|
| TypeScript (.ts) | 30 | PREFERRED ✓ |
| React TypeScript (.tsx) | 0 | PREFERRED ✓ |
| JavaScript (.js) | 0 | MIGRATION REQUIRED ⚠️ |
| React JavaScript (.jsx) | 0 | MIGRATION REQUIRED ⚠️ |

## Test Execution Progress
- Tests completed: 30/40 (75%)
- Tests remaining: 10 (25%)
- Estimated completion time: 0 minutes

Last updated: Mon Mar 17 02:32:20 AM CET 2025
❌🚚❔📘 🕒:3s 🧪:unit 📦:api 🔍:UnknownError 🧩:~70% /opt/mExpress/projects/jerome_bikes/src/backend/api/tests/unit/controllers/station.controller.test.ts | [log](/tests/results/logs//opt/mExpress/projects/jerome_bikes/src/backend/api/tests/unit/controllers/station.controller.test.ts_20250317_023220.log)
❌🚚❔📘 🕒:4s 🧪:unit 📦:api 🔍:UnknownError 🧩:~70% /opt/mExpress/projects/jerome_bikes/src/backend/api/tests/unit/controllers/reservation.controller.test.ts | [log](/tests/results/logs//opt/mExpress/projects/jerome_bikes/src/backend/api/tests/unit/controllers/reservation.controller.test.ts_20250317_023223.log)
❌🚚❔📘 🕒:3s 🧪:unit 📦:api 🔍:UnknownError 🧩:~70% /opt/mExpress/projects/jerome_bikes/src/backend/api/tests/unit/controllers/bike.controller.test.ts | [log](/tests/results/logs//opt/mExpress/projects/jerome_bikes/src/backend/api/tests/unit/controllers/bike.controller.test.ts_20250317_023227.log)
❌🚚❔📘 🕒:3s 🧪:unit 📦:api 🔍:UnknownError 🧩:~70% /opt/mExpress/projects/jerome_bikes/src/backend/api/tests/unit/controllers/customer.controller.test.ts | [log](/tests/results/logs//opt/mExpress/projects/jerome_bikes/src/backend/api/tests/unit/controllers/customer.controller.test.ts_20250317_023230.log)
❌🚚❔📘 🕒:3s 🧪:unit 📦:api 🔍:UnknownError 🧩:~70% /opt/mExpress/projects/jerome_bikes/src/backend/api/tests/unit/controllers/auth.controller.test.ts | [log](/tests/results/logs//opt/mExpress/projects/jerome_bikes/src/backend/api/tests/unit/controllers/auth.controller.test.ts_20250317_023233.log)
❌🚚❔📘 🕒:3s 🧪:integration 📦:api 🔍:UnknownError 🧩:~70% /opt/mExpress/projects/jerome_bikes/src/backend/api/tests/integration/routes/bike.routes.test.ts | [log](/tests/results/logs//opt/mExpress/projects/jerome_bikes/src/backend/api/tests/integration/routes/bike.routes.test.ts_20250317_023236.log)
❌🚚❔📘 🕒:2s 🧪:integration 📦:api 🔍:UnknownError 🧩:~70% /opt/mExpress/projects/jerome_bikes/src/backend/api/tests/integration/routes/auth.routes.test.ts | [log](/tests/results/logs//opt/mExpress/projects/jerome_bikes/src/backend/api/tests/integration/routes/auth.routes.test.ts_20250317_023239.log)
❌🚚❔📘 🕒:4s 🧪:integration 📦:api 🔍:UnknownError 🧩:~70% /opt/mExpress/projects/jerome_bikes/src/backend/api/tests/integration/routes/customer.routes.test.ts | [log](/tests/results/logs//opt/mExpress/projects/jerome_bikes/src/backend/api/tests/integration/routes/customer.routes.test.ts_20250317_023241.log)
❌🚚❔📘 🕒:2s 🧪:integration 📦:api 🔍:UnknownError 🧩:~70% /opt/mExpress/projects/jerome_bikes/src/backend/api/tests/integration/routes/station.routes.test.ts | [log](/tests/results/logs//opt/mExpress/projects/jerome_bikes/src/backend/api/tests/integration/routes/station.routes.test.ts_20250317_023245.log)
