#!/bin/bash

# Script to run the specific tests we've fixed and save results to a file
# This script should be run from the repository root directory

# Define output file
OUTPUT_FILE="packages/core/test-results.log"
# Clear the output file
> "$OUTPUT_FILE"

# Set colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Running tests for fixed components${NC}"
echo "================================================================="
echo "Running tests for fixed components" >> "$OUTPUT_FILE"
echo "=================================================================" >> "$OUTPUT_FILE"

# Use NODE_OPTIONS to increase memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Array of tests to run
TESTS=(
  "packages/core/tests/p0/core/transaction-rollback.test.ts"
)

# Counters for summary
TOTAL_TESTS=${#TESTS[@]}
PASSED_TESTS=0

# Run each test
for TEST_PATH in "${TESTS[@]}"; do
  echo -e "\n${YELLOW}Running: ${TEST_PATH}${NC}"
  echo "-----------------------------------------------------------------"
  echo "" >> "$OUTPUT_FILE"
  echo "Running: ${TEST_PATH}" >> "$OUTPUT_FILE"
  echo "-----------------------------------------------------------------" >> "$OUTPUT_FILE"
  
  # Run test and capture output
  npx jest --config packages/core/jest.config.js --testTimeout=120000 --forceExit "$TEST_PATH" | tee -a "$OUTPUT_FILE"
  TEST_RESULT=${PIPESTATUS[0]}
  
  # Check exit code
  if [ $TEST_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ Test passed successfully${NC}"
    echo "✅ Test passed successfully" >> "$OUTPUT_FILE"
    PASSED_TESTS=$((PASSED_TESTS + 1))
  else
    echo -e "${RED}❌ Test failed${NC}"
    echo "❌ Test failed" >> "$OUTPUT_FILE"
  fi
  
  echo "-----------------------------------------------------------------" >> "$OUTPUT_FILE"
done

# Display summary
SUMMARY="\nTest Summary\n=================================================================\nTests passed: ${PASSED_TESTS}/${TOTAL_TESTS}"
echo -e "${YELLOW}${SUMMARY}${NC}"
echo -e "${SUMMARY}" >> "$OUTPUT_FILE"

if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
  SUCCESS_MSG="✅ All tests passed!"
  echo -e "${GREEN}${SUCCESS_MSG}${NC}"
  echo -e "${SUCCESS_MSG}" >> "$OUTPUT_FILE"
  exit 0
else
  FAILURE_MSG="❌ Some tests failed"
  echo -e "${RED}${FAILURE_MSG}${NC}"
  echo -e "${FAILURE_MSG}" >> "$OUTPUT_FILE"
  exit 1
fi