# mExpress Test Validation Tools

This directory contains tools for validating and reporting on tests across the entire mExpress codebase.

## Generated Reports

- `REAL_TESTS_LIST.md`: A comprehensive list of all actual test files in the codebase, categorized by priority and location
- `TESTS_STATUS_UNIFIED.md`: Execution status report for all tests, showing pass/fail status, duration, and other metadata

## How to Use

### Generate Both Reports (Recommended)

```bash
# Run with default settings (all tests)
./scripts/generate_unified_test_report.sh

# Run with limited test count (faster)
./scripts/generate_unified_test_report.sh --max-tests=25

# Explicitly specify to run all tests (same as default)
./scripts/generate_unified_test_report.sh --all
```

### Generate Just the Test List

```bash
./scripts/tests_status_unified.sh
```

### Run Tests and Generate Status Report Only

```bash
# Run with default settings (all tests)
./scripts/simple_test_runner.sh

# Run with limited test count (faster)
./scripts/simple_test_runner.sh --max-tests=10

# Explicitly specify to run all tests (same as default)
./scripts/simple_test_runner.sh --all

# Shuffle test order (useful for finding dependent tests)
./scripts/simple_test_runner.sh --shuffle
```

## Legend

The reports use the following icons to provide at-a-glance information:

### Test Status
- ✅ - Test passes
- ❌ - Test fails
- ⏱️ - Test timed out
- ⏩ - Test skipped

### Test Metadata
- 📍 - Test is in project-specific location (correct)
- 🚚 - Test needs to be moved from centralized location
- 🔢 - Test has priority label (P0-P3)
- ❔ - Test missing priority label
- 🕒 - Test duration
- 🧪 - Test type (unit, integration, e2e)
- 📦 - Component area
- 🔍 - Error type (for failing tests)
- 🧩 - Test coverage percentage

## Integration with Dashboard

The generated reports integrate with the mExpress dashboard:

1. Test location stats are exported to `/dashboard/unified/generated/test-location-stats.json`
2. Test execution stats are displayed on the dashboard's test status page

## Adding Tests to the Dashboard

When new tests are added:

1. Run `./scripts/generate_unified_test_report.sh` to generate updated reports
2. Update the dashboard with `cd dashboard/unified && ./update-dashboard.js`