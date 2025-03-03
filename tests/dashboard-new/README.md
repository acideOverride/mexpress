# mExpress Dynamic Test Dashboard

This is the dynamic test dashboard for the mExpress project. It provides a more maintainable, efficient, and performant alternative to the previous static HTML dashboards.

## Key Features

- **Dynamic Data Loading**: Dashboard loads data from a separate JSON file at runtime
- **Clean Separation**: HTML/CSS/JS/Data are properly separated
- **Smaller File Size**: No hardcoded test data in HTML
- **Easy Maintenance**: Single source of truth in TEST_DASHBOARD.md

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

## Files

- `dashboard-template.html`: The HTML template (no hardcoded data)
- `dashboard.css`: Styles separated from HTML for better maintainability
- `dashboard.js`: Handles dynamic loading and UI interactions
- `dashboard-data.js`: Contains the actual data (auto-generated)
- `TEST_DASHBOARD.md`: Single source of truth for test status
- `update-dashboard.js`: Script to extract data from TEST_DASHBOARD.md
- `update-all.js`: Main script to update all dashboard files

## Important Notes

- Always update TEST_DASHBOARD.md first, then run the update script
- Never edit the HTML/CSS/JS files directly
- The JSON section at the bottom of TEST_DASHBOARD.md must be maintained
- Keep the TEST_DASHBOARD.md format consistent - the scripts depend on it

## Benefits Over Previous Dashboard

1. **Maintainability**: No more editing large HTML files for small changes
2. **Efficiency**: Only updates the data file, not the entire HTML structure
3. **Performance**: Smaller files, faster loading
4. **Consistency**: Automated updates ensure dashboard always reflects TEST_DASHBOARD.md