#!/bin/bash

# Run the p0 priority tests with MongoDB Memory Server
MONGODB_URI=mongodb://localhost:27017/mexpress_test \
  npx jest --config tests/p0/jest.config.js \
  --verbose --runInBand