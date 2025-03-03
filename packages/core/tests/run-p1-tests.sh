#\!/bin/bash

# Run the p1 priority tests 
MONGODB_URI=mongodb://localhost:27017/mexpress_test \
  npx jest --config tests/p1/jest.config.js \
  --verbose --runInBand
