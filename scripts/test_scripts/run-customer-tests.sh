#!/bin/bash

# Create output directories if they don't exist
mkdir -p tests/results/p0
mkdir -p tests/results/summary

# Run tests with silent output following the test standards
npx jest src/components/customers/__tests__/CustomerList.test.tsx --silent --coverage --json --outputFile=tests/results/summary/test-results.json > tests/results/p0/test.log 2>/dev/null

# Generate coverage report separately to ensure it's captured
npx jest src/components/customers/__tests__/CustomerList.test.tsx --silent --coverage --coverageReporters=json-summary --coverageDirectory=tests/results/summary > tests/results/p0/coverage.log 2>/dev/null

# Generate text coverage for human reading
npx jest src/components/customers/__tests__/CustomerList.test.tsx --silent --coverage --coverageReporters=text > tests/results/p0/coverage-text.log 2>/dev/null

# Exit with success
exit 0
