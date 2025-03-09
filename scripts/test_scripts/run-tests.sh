#!/bin/bash

# Script to run tests with output redirected to files
# Following the test standards in C4_test_standards.md

# Set the base directory
BASE_DIR="/opt/mExpress/projects/montpc_crm/frontend"
RESULTS_DIR="$BASE_DIR/tests/results"
SUMMARY_DIR="$RESULTS_DIR/summary"

# Create results directories if they don't exist
mkdir -p "$RESULTS_DIR/p0" "$RESULTS_DIR/p1" "$RESULTS_DIR/p2" "$RESULTS_DIR/p3" "$SUMMARY_DIR"

# Function to run tests with priority level
run_tests() {
  local priority=$1
  local test_pattern=$2
  local max_workers=$3
  local max_time=$4
  
  echo "Running P$priority tests..."
  
  # Run tests and redirect output to log file
  NODE_OPTIONS="--max-old-space-size=1024" npx jest \
    --config "$BASE_DIR/tests/jest.config.js" \
    --testMatch "**/p$priority/$test_pattern/**/*.test.{ts,tsx}" \
    --silent \
    --maxWorkers=$max_workers \
    --testTimeout=$max_time \
    > "$RESULTS_DIR/p$priority/test.log" 2>/dev/null
  
  # Run tests with coverage
  NODE_OPTIONS="--max-old-space-size=1024" npx jest \
    --config "$BASE_DIR/tests/jest.config.js" \
    --testMatch "**/p$priority/$test_pattern/**/*.test.{ts,tsx}" \
    --silent \
    --coverage \
    --maxWorkers=$max_workers \
    --testTimeout=$max_time \
    > "$RESULTS_DIR/p$priority/coverage.log" 2>/dev/null
  
  # Extract coverage summary and save to summary directory
  grep -A 10 "Test Suites:" "$RESULTS_DIR/p$priority/coverage.log" > "$SUMMARY_DIR/p$priority-summary.log"
  
  echo "P$priority tests completed. Results saved to $RESULTS_DIR/p$priority/"
}

# Run tests by priority level
# P0 (Critical) - Sequential execution, 5s timeout, 512MB memory
run_tests 0 "core" 1 5000

# P1 (High) - 2 concurrent workers, 10s timeout, 1GB memory
run_tests 1 "features" 2 10000

# Generate overall summary
echo "Generating test summary..."
cat "$SUMMARY_DIR/p0-summary.log" "$SUMMARY_DIR/p1-summary.log" > "$SUMMARY_DIR/all-tests-summary.log"

echo "All tests completed. Summary available at $SUMMARY_DIR/all-tests-summary.log"