#!/bin/bash

# Script to run a single test with extended timeout
# Usage: ./run-single-test.sh <path-to-test-file>

TEST_PATH=$1

if [ -z "$TEST_PATH" ]; then
  echo "Error: Test path is required"
  echo "Usage: ./run-single-test.sh <path-to-test-file>"
  exit 1
fi

echo "Running test: $TEST_PATH"
echo "================================================================="

# Use NODE_OPTIONS to increase memory limit and timeout
NODE_OPTIONS="--max-old-space-size=4096" npx jest \
  --config packages/core/jest.config.js \
  --testTimeout=120000 \
  --forceExit \
  "$TEST_PATH"

exit_code=$?
if [ $exit_code -eq 0 ]; then
  echo "================================================================="
  echo "✅ Test passed successfully"
else
  echo "================================================================="
  echo "❌ Test failed with exit code: $exit_code"
fi

exit $exit_code