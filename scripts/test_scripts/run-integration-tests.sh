#!/bin/bash

# Run the integration tests
MONGODB_URI=mongodb://localhost:27017/mexpress_test \
  npx jest --config tests/integration/jest.config.js \
  --verbose --runInBand