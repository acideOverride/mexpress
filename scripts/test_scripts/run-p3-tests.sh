#\!/bin/bash

# Run the p3 priority tests (performance and stress tests)
MONGODB_URI=mongodb://localhost:27017/mexpress_test \
  npx jest --config tests/p3/jest.config.js \
  --verbose --runInBand
