#!/bin/bash
# Simple script to run the monitoring system test

cd /opt/mExpress
npx jest --config packages/utils/jest.config.js packages/utils/tests/p2/lib/monitoring/monitoring.system.test.ts > /dev/null 2>&1 && echo "PASSED: [monitoring.system.test.ts]" || echo "FAILED: [monitoring.system.test.ts]"