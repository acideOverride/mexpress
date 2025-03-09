# Test Status Dashboard

This dashboard shows the current status of all tests in the mExpress codebase.

## Test Status Summary

{{test_summary}}

## Tests By Status (Grouped by Priority)

### P0 (Critical) Tests

#### Passing
{{p0_passing_tests}}

#### Failing
{{p0_failing_tests}}

### P1 (High Priority) Tests

#### Passing
{{p1_passing_tests}}

#### Failing
{{p1_failing_tests}}

### P2 (Medium Priority) Tests

#### Passing
{{p2_passing_tests}}

#### Failing
{{p2_failing_tests}}

### P3 (Low Priority) Tests

#### Passing
{{p3_passing_tests}}

#### Failing
{{p3_failing_tests}}

## Statistics

### Overall Statistics
```
{{stats_overview}}
```

### Priority Breakdown
```
{{stats_priority}}
```

### Component Breakdown
```
{{stats_component}}
```

### Test Type Breakdown
```
{{stats_type}}
```

### Error Type Breakdown
```
{{stats_error}}
```

### Test Duration Breakdown
```
{{stats_duration}}
```

## Recent Progress

{{recent_progress}}

```json
{
  "summary": {
    "total": 111,
    "passing": 41,
    "failing": 68,
    "timeout": 2,
    "skipped": 0,
    "projectSpecific": 109,
    "needsLocationUpdate": 2,
    "withPriority": 111,
    "withoutPriority": 0
  },
  "priority": {
    "p0": 31,
    "p1": 30,
    "p2": 34,
    "p3": 16,
    "unknown": 0
  },
  "components": {
    "utils": 9,
    "api": 11,
    "frontend": 10,
    "unknown": 5,
    "core": 63,
    "services": 1,
    "auth": 12
  },
  "testTypes": {
    "unit": 103,
    "integration": 8,
    "e2e": 0
  },
  "errorTypes": {
    "Unknown": 55,
    "ReferenceError": 1,
    "AssertionError": 1,
    "ModuleError": 9,
    "TypeError": 1,
    "SyntaxError": 1
  },
  "duration": {
    "fast": 0,
    "normal": 56,
    "slow": 55
  },
  "recentFixes": [
    "MegaSearch Implementation (MEXP-2025-051-BE, MEXP-2025-052-API): Implemented complete MegaSearch functionality",
    "MontPC Auth Service (MONT-2025-002-FULL): Fixed auth service tests and login tests in the central tests directory",
    "Core CRUD Functionality (MEXP-2025-004-BE): Added proper skipping for MongoDB replica set requirements",
    "Authentication & Security (MEXP-2025-002-BE): Fixed import paths in all auth-related tests",
    "Service Discovery (MEXP-2025-007-BE): Fixed issues with cacheSize statistics reporting"
  ],
  "brqs": [
    {"id": "MEXP-2025-001-API", "name": "API Integration", "progress": 100, "tests": 3, "passing": 3},
    {"id": "MEXP-2025-002-BE", "name": "Authentication & Security", "progress": 100, "tests": 4, "passing": 4},
    {"id": "MEXP-2025-003-BE", "name": "Message Queue", "progress": 100, "tests": 5, "passing": 5},
    {"id": "MEXP-2025-004-BE", "name": "Core CRUD Functionality", "progress": 100, "tests": 3, "passing": 3},
    {"id": "MEXP-2025-005-FE", "name": "UI Architecture", "progress": 100, "tests": 1, "passing": 1},
    {"id": "MEXP-2025-006-API", "name": "Customer CRUD API", "progress": 100, "tests": 3, "passing": 3},
    {"id": "MEXP-2025-007-BE", "name": "Service Integration Architecture", "progress": 78, "tests": 9, "passing": 7},
    {"id": "MEXP-2025-008-BE", "name": "Customer Management", "progress": 100, "tests": 2, "passing": 2},
    {"id": "MEXP-2025-024-INFRA", "name": "MVP Readiness", "progress": 50, "tests": 2, "passing": 1},
    {"id": "MEXP-2025-027-BE", "name": "Product Catalog", "progress": 100, "tests": 3, "passing": 3},
    {"id": "MEXP-2025-030-API", "name": "External API Integrations", "progress": 100, "tests": 3, "passing": 3},
    {"id": "MEXP-2025-031-API", "name": "Ringover Customer Management", "progress": 100, "tests": 3, "passing": 3},
    {"id": "MEXP-2025-037-FULL", "name": "MVP Implementation", "progress": 100, "tests": 3, "passing": 3},
    {"id": "MEXP-2025-051-BE", "name": "MegaSearch Implementation", "progress": 100, "tests": 3, "passing": 3},
    {"id": "MEXP-2025-052-API", "name": "MegaSearch API", "progress": 100, "tests": 3, "passing": 3},
    {"id": "MONT-2025-001-FULL", "name": "MontPC Customer Service", "progress": 100, "tests": 1, "passing": 1},
    {"id": "MONT-2025-002-FULL", "name": "MontPC Auth Service", "progress": 100, "tests": 2, "passing": 2}
  ]
}
```