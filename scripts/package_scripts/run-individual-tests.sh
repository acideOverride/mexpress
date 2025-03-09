#!/bin/bash

# Script to run individual test files to check if our fixes are working
# This helps us avoid timeouts with the whole test suite

# Colors for better visualization
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Function to run a single test and report the result
run_test() {
  local test_file=$1
  local test_name=$(basename "$test_file")
  
  echo -e "${YELLOW}Testing: $test_name${NC}"
  
  # Run the test with a timeout
  timeout 30s npx jest --no-cache --verbose "$test_file" > test-output.log 2>&1
  
  # Check the exit status
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ PASS: $test_name${NC}"
    return 0
  else
    echo -e "${RED}✗ FAIL: $test_name${NC}"
    # Show the error
    echo -e "${RED}Error output:${NC}"
    grep -A 10 "FAIL" test-output.log | head -n 15
    return 1
  fi
}

# Make sure we're in the right directory
cd "$(dirname "$0")/.."

# Create results directory
mkdir -p test-results

# Test files to check
declare -a test_files=(
  # P0 tests
  "tests/p0/core/service-discovery.test.ts"
  "tests/p0/core/transaction-rollback.test.ts"
  # P2 tests
  "tests/p2/services/data-consistency.test.ts"
  # P3 tests
  "tests/p3/auth/performance.test.ts"
)

# Track results
pass_count=0
fail_count=0
failed_tests=()

# Run each test
for test_file in "${test_files[@]}"; do
  run_test "$test_file"
  if [ $? -eq 0 ]; then
    ((pass_count++))
  else
    ((fail_count++))
    failed_tests+=("$test_file")
  fi
  echo "----------------------------------------"
done

# Show summary
echo "Tests completed!"
echo -e "${GREEN}Passed: $pass_count${NC}"
echo -e "${RED}Failed: $fail_count${NC}"

if [ ${#failed_tests[@]} -gt 0 ]; then
  echo "Failed tests:"
  for test in "${failed_tests[@]}"; do
    echo " - $test"
  done
fi

exit $fail_count # Return non-zero if any tests failed