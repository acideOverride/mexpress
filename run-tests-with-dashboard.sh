#!/bin/bash

# Run tests with dashboard reporter
npx jest --config jest.dashboard.config.js "$@"

# Update dashboard after tests complete
node /opt/mExpress/dashboard/unified/test-collector.js

# Update dashboard visualization
node /opt/mExpress/dashboard/unified/update-dashboard.js

echo "Dashboard updated with latest test results"
echo "Open /opt/mExpress/dashboard/unified/index.html in your browser to view"
