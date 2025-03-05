# mExpress Dynamic Test Dashboard

This is the dynamic test dashboard for the mExpress project. It provides a more maintainable, efficient, and performant alternative to the previous static HTML dashboards.

## Key Features

- **Dynamic Data Loading**: Dashboard loads data from a separate JSON file at runtime
- **Clean Separation**: HTML/CSS/JS/Data are properly separated
- **Smaller File Size**: No hardcoded test data in HTML
- **Easy Maintenance**: Single source of truth in TEST_DASHBOARD.md
- **Support for all test types**: Works with both priority-based tests and canonical location tests
- **Advanced Search and Filtering**: Find tests by status, priority, location, project, or pattern

## Usage

### Viewing the Dashboard

To view the dashboard, simply open the HTML file in your browser:

```bash
# Either double-click the file in your file explorer
# Or use this command to open it with your default browser:
open /opt/mExpress/tests/dashboard-new/dashboard-template.html  # On macOS
xdg-open /opt/mExpress/tests/dashboard-new/dashboard-template.html  # On Linux
start /opt/mExpress/tests/dashboard-new/dashboard-template.html  # On Windows
```

No server required - it's just static HTML, CSS, and JavaScript files.

### Updating the Dashboard

After making changes to the `TEST_DASHBOARD.md` file:

```bash
cd /opt/mExpress/tests/dashboard-new
node update-all.js
```

This will:
1. Parse the TEST_DASHBOARD.md file
2. Update the dashboard-data.js file with the latest information
3. Update references in CLAUDE.md if needed

## Helper Tools

### Update Test Status

The `update-test-status.js` script helps update the status of a test in the dashboard:

```bash
cd /opt/mExpress/tests/dashboard-new
node update-test-status.js <file-path> <status>
```

- `file-path`: Relative path to the test file (e.g., `packages/core/tests/p0/core/event-handler.test.ts`)
- `status`: One of `pass`, `fail`, `hang`

Example:
```bash
node update-test-status.js packages/core/tests/p0/core/event-handler.test.ts pass
```

This script will:
1. Update the status in `TEST_DASHBOARD.md`
2. Update the statistics in the JSON data
3. Regenerate the dashboard data

### Search Tests

The `search-tests.js` script helps search for tests by various criteria:

```bash
cd /opt/mExpress/tests/dashboard-new
node search-tests.js [options]
```

Options:
- `--status=<status>`: Filter by status (`pass`, `fail`, `hang`)
- `--priority=<priority>`: Filter by priority (`p0`, `p1`, `p2`, `p3`, `unclassified`)
- `--location=<location>`: Filter by location (`canonical`, `needs-moving`)
- `--project=<project>`: Filter by project (`core`, `montpc`, `ui`, `utils`)
- `--pattern=<pattern>`: Filter by file name pattern (substring match)
- `--help`: Show help

Example:
```bash
node search-tests.js --status=fail --priority=p0
```

### Migrate Test

The `migrate-test.js` script in the `scripts` directory helps migrate tests to canonical locations:

```bash
cd /opt/mExpress
node scripts/migrate-test.js <source-path> <dest-path>
```

- `source-path`: Current path to the test file (relative to project root)
- `dest-path`: Destination path for the test file (relative to project root)

Example:
```bash
node scripts/migrate-test.js packages/core/tests/p0/core/message-queue-v2.test.ts tests/packages/core/unit/core/message-queue/message-queue-v2.test.ts
```

This script will:
1. Copy the test file to the new location
2. Update import paths in the file (basic updates only)
3. Update `TEST_DASHBOARD.md` and `TEST_CLASSIFICATION.md`
4. Regenerate the dashboard data

IMPORTANT: The original file is not deleted automatically. You should verify the test passes in its new location before removing the original file.

## Files

- `dashboard-template.html`: The HTML template (no hardcoded data)
- `dashboard.css`: Styles separated from HTML for better maintainability
- `dashboard.js`: Handles dynamic loading and UI interactions
- `dashboard-data.js`: Contains the actual data (auto-generated)
- `TEST_DASHBOARD.md`: Single source of truth for test status
- `update-dashboard.js`: Script to extract data from TEST_DASHBOARD.md
- `update-all.js`: Main script to update all dashboard files
- `update-test-status.js`: Script to update test status in TEST_DASHBOARD.md
- `search-tests.js`: Script to search for tests by various criteria

## Dashboard Features

### Filtering Options

The dashboard provides multiple ways to filter and view tests:

- **Status Filters**: View all tests, passing tests, failing tests, or hanging tests
- **Priority Filters**: Filter by priority level (P0, P1, P2, P3, or Unclassified)
- **Project Filters**: View tests by project (Core, MontPC CRM, UI Components, Utils)
- **Location Filters**: Filter by test location (Canonical or Need to Move)
- **BRQ Filters**: View tests by Business Requirement Query status

You can combine these filters to drill down to specific test sets. For example, you can view all failing P0 tests in the Core project.

## Test Classification

Tests are classified by:

1. **Priority**:
   - **P0**: Critical path tests
   - **P1**: Important feature tests
   - **P2**: Secondary feature tests
   - **P3**: Performance and stress tests
   - **Unclassified**: Tests without priority classification (usually in canonical locations)

2. **Location**:
   - **Canonical (📍)**: Tests in the canonical location (`/tests/`)
   - **Need to Move (🔄)**: Tests in non-canonical locations (e.g., mixed with source code)

3. **Status**:
   - **Passing (✅)**: Tests that pass
   - **Failing (❌)**: Tests that fail
   - **Hanging (❓)**: Tests that hang or timeout

## Important Notes

- Always update TEST_DASHBOARD.md first, then run the update script
- Never edit the HTML/CSS/JS files directly
- The JSON section at the bottom of TEST_DASHBOARD.md must be maintained
- Keep the TEST_DASHBOARD.md format consistent - the scripts depend on it