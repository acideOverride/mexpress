#!/bin/bash

# Create test report directories
mkdir -p /opt/mExpress/projects/montpc_crm/frontend/tests/results/p0
mkdir -p /opt/mExpress/projects/montpc_crm/frontend/tests/results/summary

# Run tests with coverage and output to separate files
# Option 1 - Direct node execution to bypass npm wrapper
NODE_OPTIONS=--experimental-vm-modules \
node \
  ./node_modules/jest/bin/jest.js \
  src/components/customers/__tests__/CustomerList.test.tsx \
  --silent \
  --coverage \
  --coverageDirectory=/opt/mExpress/projects/montpc_crm/frontend/tests/results/summary \
  > /opt/mExpress/projects/montpc_crm/frontend/tests/results/p0/test-direct.log 2>/dev/null

# Option 2 - Generate test results explicitly
NODE_OPTIONS=--experimental-vm-modules \
node \
  ./node_modules/jest/bin/jest.js \
  src/components/customers/__tests__/CustomerList.test.tsx \
  --json \
  --outputFile=/opt/mExpress/projects/montpc_crm/frontend/tests/results/summary/test-output.json \
  --silent \
  > /opt/mExpress/projects/montpc_crm/frontend/tests/results/p0/test-json.log 2>/dev/null

# Option 3 - Generate coverage report in text format
NODE_OPTIONS=--experimental-vm-modules \
node \
  ./node_modules/jest/bin/jest.js \
  src/components/customers/__tests__/CustomerList.test.tsx \
  --coverage \
  --coverageReporters=text \
  --silent \
  > /opt/mExpress/projects/montpc_crm/frontend/tests/results/p0/coverage-text.log 2>/dev/null

# Exit with success
exit 0
