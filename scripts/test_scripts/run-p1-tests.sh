#!/bin/bash

# Run the P1 tests for utils package with the standardized configuration
echo "Running utils P1 tests..."

# Set environment variables needed for tests
# Use ts-jest preset and runInBand to ensure tests run sequentially
cd "$(dirname "$0")/.." && \
MONGODB_URI=mongodb://localhost:27017/mexpress_test \
  npx jest --config tests/p1/jest.config.js \
  --preset=ts-jest --verbose --runInBand

# Exit with the same code as Jest
exit $?