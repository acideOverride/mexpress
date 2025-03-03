#!/bin/bash

# Script to run tests with output captured to a file
# Usage: ./run-tests-with-output.sh [test-pattern]

# Set default pattern if not provided
PATTERN=${1:-"tests/p0"}
OUTPUT_FILE="test-results-$(date +%Y%m%d-%H%M%S).log"

echo "Running tests matching pattern: $PATTERN"
echo "Output will be saved to $OUTPUT_FILE"

# Run tests with increased timeout and save output
NODE_OPTIONS="--no-warnings --max-old-space-size=4096" npx jest \
  --no-cache \
  --forceExit \
  --testTimeout=60000 \
  --maxWorkers=1 \
  --verbose \
  --testPathPattern="$PATTERN" \
  > "$OUTPUT_FILE" 2>&1 &

PID=$!
echo "Test process started with PID: $PID"

# Monitor progress
while kill -0 $PID 2>/dev/null; do
  echo -n "."
  sleep 5
done

echo
echo "Tests completed. Results saved to $OUTPUT_FILE"

# Show summary of test results
echo "==== TEST SUMMARY ===="
grep -A 5 "Test Suites:" "$OUTPUT_FILE" | head -n 6

# Show number of each type of error
echo
echo "==== ERROR TYPES ===="
echo "Missing module errors: $(grep -c "Cannot find module" "$OUTPUT_FILE")"
echo "Transaction errors: $(grep -c "Transaction numbers are only allowed" "$OUTPUT_FILE")"
echo "Type errors: $(grep -c "TypeError:" "$OUTPUT_FILE")"
echo "Validation errors: $(grep -c "validation failed" "$OUTPUT_FILE")"

echo
echo "For detailed results, review $OUTPUT_FILE"