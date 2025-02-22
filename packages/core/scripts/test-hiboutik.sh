#!/bin/bash

# Create test output directory if it doesn't exist
mkdir -p test-output

# Run the authentication tests and output to file
jest src/services/__tests__/hiboutik.auth.test.ts \
  --no-color \
  --verbose \
  --runInBand \
  --detectOpenHandles \
  2>&1 | tee test-output/hiboutik-auth-test.log

# Store the exit code
TEST_EXIT_CODE=${PIPESTATUS[0]}

# Add test status to log
if [ $TEST_EXIT_CODE -eq 0 ]; then
  echo -e "\nTests passed successfully" >> test-output/hiboutik-auth-test.log
else
  echo -e "\nTests failed with exit code $TEST_EXIT_CODE" >> test-output/hiboutik-auth-test.log
fi

exit $TEST_EXIT_CODE