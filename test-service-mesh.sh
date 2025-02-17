#!/bin/bash

# Run only service mesh tests with verbose output
echo "Running Service Mesh Tests..."
echo "=============================="

# Create test output directory if it doesn't exist
mkdir -p test-output

# Run jest with specific test file and output to both console and file
npx jest src/tests/infrastructure/service-mesh.test.ts \
  --verbose \
  --no-silent \
  --coverage \
  --json \
  --outputFile=test-output/service-mesh-results.json \
  | tee test-output/service-mesh-output.log

# Display coverage report
echo -e "\nCoverage Report:"
echo "================="
cat test-output/service-mesh-results.json | jq '.coverageMap'