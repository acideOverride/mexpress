#!/bin/bash
# Run all tests and output to files

# Run backend tests
echo "Running backend tests..."
npm test > test-output/backend-tests.log 2>&1

# Run frontend tests
echo "Running frontend tests..."
cd frontend && npm test -- --watchAll=false > ../test-output/frontend-tests.log 2>&1
cd ..

# Display summary
echo "Tests completed. Check test-output directory for results."
