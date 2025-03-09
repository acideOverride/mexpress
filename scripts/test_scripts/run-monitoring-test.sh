#!/bin/bash
# Simple script to run the monitoring system test with simplified configuration

cd /opt/mExpress
npx jest --config packages/utils/tests/jest.simplified.config.js packages/utils/tests/p2/lib/monitoring/monitoring.system.test.ts > /dev/null 2>&1 && echo "PASSED: [monitoring.system.test.ts]" || echo "FAILED: [monitoring.system.test.ts]"