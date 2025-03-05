# mExpress Automated Test Dashboard

The mExpress Test Dashboard is an automated system for tracking test results, generating metrics, and visualizing test status across all projects. It eliminates the need for manual status tracking by automatically collecting, processing, and displaying test results.

## Architecture

The dashboard follows a data-driven approach:

1. **Test Results** - Individual test results are generated as structured JSON files
2. **Aggregation** - Results are automatically processed and aggregated into metrics
3. **Visualization** - The dashboard UI renders metrics into charts and tables

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Test Results │────>│ Aggregation  │────>│ Dashboard UI │
│ (JSON files) │     │ (Collector)  │     │ (HTML/JS/CSS)│
└──────────────┘     └──────────────┘     └──────────────┘
```

## Key Components

### 1. Test Result Schema

All test results follow a standardized JSON schema (`test-result-schema.json`):

- `testId`: Unique identifier for the test
- `testPath`: Path to the test file
- `testName`: Human-readable test name
- `status`: "pass", "fail", "skip", or "hanging"
- `timestamp`: When the test was executed
- `duration`: Test execution time in milliseconds
- `metadata`: Additional information about the test:
  - `priority`: "p0", "p1", "p2", or "p3"
  - `brqId`: Business Requirement ID (e.g., "MEXP-2025-001-API")
  - `project`: Project name (e.g., "core", "montpc")
  - `component`: Component or module name
  - `type`: "unit", "integration", or "e2e"
- `error`: Information about failures (if applicable)
- `coverage`: Code coverage metrics (if available)

### 2. Jest Dashboard Reporter

Custom Jest reporter (`jest-dashboard-reporter.js`) that:

- Hooks into the Jest test execution lifecycle
- Captures test results in real-time
- Generates standardized result files
- Automatically extracts metadata from test paths and names
- Creates directory structure for organized results

### 3. Test Result Collector

Script (`test-collector.js`) that:

- Scans results directory for all test result files
- Processes and aggregates metrics by priority, project, and BRQ
- Calculates success rates and other metrics
- Generates dashboard-data.js for the frontend

### 4. BRQ Annotator

Utility (`brq-annotator.js`) that:

- Scans test files for missing BRQ annotations
- Automatically determines appropriate BRQ based on file content and path
- Adds annotations to test files for proper categorization

### 5. Dashboard Visualization

The dashboard frontend features:

- Overview metrics with progress bars and charts
- Test status breakdown by priority, project, and BRQ
- Tabular data for detailed status information
- Responsive design with dark/light mode

## Setup and Usage

### Installation

Run the setup script to integrate the dashboard with your test process:

```bash
# From the project root
node dashboard/unified/setup-test-dashboard.js
```

This script will:
- Check for required dependencies
- Create Jest configuration to include the dashboard reporter
- Add scripts to package.json
- Generate a test runner script

### Running Tests with Dashboard Reporting

```bash
# Using npm script
npm run test:dashboard

# Or directly
./run-tests-with-dashboard.sh
```

This will:
1. Run tests with the dashboard reporter
2. Collect and aggregate results
3. Update the dashboard visualization

### Updating the Dashboard Manually

```bash
npm run update:dashboard
```

This updates the dashboard from existing test results without running tests.

### Annotating Tests with BRQs

```bash
# Dry run (doesn't modify files)
node dashboard/unified/brq-annotator.js --dry-run

# Apply changes
node dashboard/unified/brq-annotator.js
```

## Directory Structure

```
dashboard/unified/
├── README.md                # Documentation
├── assets/                  # CSS and JavaScript files
│   ├── dashboard.css
│   └── dashboard.js
├── brq-annotator.js         # Utility to add BRQ annotations to tests
├── dashboard-mapper.js      # Maps dashboard data to templates
├── generated/               # Auto-generated data files
│   └── dashboard-data.js
├── index.html               # Main dashboard page
├── jest-dashboard-reporter.js # Custom Jest reporter
├── pages/                   # Dashboard HTML pages
├── schema.json              # Dashboard data schema
├── setup-test-dashboard.js  # Setup script
├── templates/               # Markdown templates
├── test-collector.js        # Test result aggregator
└── test-result-schema.json  # Test result JSON schema
```

## Test Results Directory

```
tests/results/
├── core/                    # Core package tests
│   ├── integration/         # Integration tests
│   │   └── p0/              # By priority level
│   └── unit/                # Unit tests
│       ├── p0/
│       ├── p1/
│       ├── p2/
│       └── p3/
├── examples/                # Example result files
├── mexpress/                # Project-specific tests
├── montpc/                  # Project-specific tests
└── ui-components/           # UI component tests
```

## Benefits

- **Automated**: No manual status tracking required
- **Accurate**: Always reflects the current state of tests
- **Integrated**: Works with existing Jest test infrastructure
- **Informative**: Provides detailed metrics and visualizations
- **Actionable**: Clearly shows what needs attention

## CI/CD Integration

The dashboard can be integrated into CI/CD pipelines:

1. Run tests with dashboard reporting:
   ```bash
   npm run test:dashboard
   ```

2. Store generated dashboard data as artifacts:
   ```bash
   # Example for GitHub Actions
   - uses: actions/upload-artifact@v2
     with:
       name: test-dashboard
       path: dashboard/unified/generated/
   ```

3. Deploy dashboard in a static site:
   ```bash
   # Copy all dashboard files to deployment directory
   cp -r dashboard/unified/* deployment/dashboard/
   ```

## Customization

- Modify `schema.json` to add custom metrics
- Edit templates in the `templates/` directory
- Customize CSS in `assets/dashboard.css`
- Update charts and visualizations in `assets/dashboard.js`

## Troubleshooting

- **Missing Results**: Check test output and Jest configuration
- **Incorrect Metrics**: Verify BRQ annotations in test files
- **Visualization Issues**: Check browser console for errors