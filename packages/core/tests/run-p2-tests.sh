#\!/bin/bash

# Run the p2 priority tests
MONGODB_URI=mongodb://localhost:27017/mexpress_test \
  npx jest --config tests/p2/jest.config.js \
  --verbose --runInBand
