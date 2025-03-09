# mExpress Dashboard

This directory contains the mExpress test dashboard and visualization tools.

## Viewing the Dashboard

There are multiple ways to view the dashboard:

### 1. Using a Local Web Server

For the best experience, run a simple web server from the project root directory:

```bash
# From the /opt/mExpress directory:
python3 -m http.server 8000
```

Then access one of the dashboard pages:
```
http://localhost:8000/dashboard/unified/pages/index.html           # Main dashboard hub
http://localhost:8000/dashboard/unified/pages/test_status.html     # New test status dashboard
http://localhost:8000/dashboard/unified/pages/test-results.html    # Legacy test results
```

### 2. Direct File Access

You can also open the HTML files directly, but some features may not work properly due to browser security restrictions.

Open one of the following files in your browser:
```
file:///opt/mExpress/dashboard/unified/pages/index.html
file:///opt/mExpress/dashboard/unified/pages/test_status.html
```

## Generating Dashboard Data

### Legacy Test Data

For legacy test dashboards, run the test scripts to generate current data:

```bash
# Generate test data for legacy dashboards
./scripts/tests_unified_status.sh
```

### New Unified Dashboard

For the new unified dashboard, run:

```bash
# Generate the unified dashboard
cd /opt/mExpress/dashboard/unified
node update-dashboard.js
```

## Dashboard Files

### New Unified Dashboard
- `pages/index.html` - Main dashboard hub
- `pages/test_status.html` - Comprehensive test status dashboard
- `pages/dashboard.html` - Dashboard with summary metrics
- `generated/dashboard-data.js` - Auto-generated dashboard data

### Legacy Dashboards
- `pages/test-results.html` - Main test results dashboard
- `pages/simple-test.html` - Simple test page (for debugging)
- `generated/*.json` - Auto-generated test data files

## Creating New Dashboard Pages

1. Create a Markdown template file in `/templates` (e.g. `MY_DASHBOARD.md`)
2. Optionally create a processor script in `/templates` (e.g. `MY_DASHBOARD_PROCESSOR.js`) to process custom variables
3. Run the update script to generate the dashboard HTML page

## Troubleshooting

If the dashboard isn't loading properly:

1. Check the browser console for JavaScript errors
2. Ensure data files exist in the `generated` directory
3. Try using a local web server instead of direct file access
4. Clear browser cache or try a different browser
5. Check for missing template files in the `/templates` directory