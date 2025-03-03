#\!/bin/bash

# Very simple script to test each file in FULL_TEST_STATUS_REPORT_NEW.md
# Creates a clean TEST_RESULTS.md file in the exact format requested

# Input file
INPUT="/opt/mExpress/tests/validation/unified/FULL_TEST_STATUS_REPORT.md"
# Results file
RESULTS="/opt/mExpress/tests/validation/unified/TEST_STATUS_RESULTS.md"

# Create header for results
cat > "$RESULTS" << 'HEADER'
# Full Test Status Report

Legend:
- ✅ - Test passes
- ❌ - Test fails
- ❓ - Test hangs/times out
- ⏩ - Test skipped (node_modules or dist)
- 📍 - Test is in canonical location
- 🔄 - Test should be moved to canonical location

Combined icons:
- ✅📍 - Passing test in canonical location (ideal)
- ✅🔄 - Passing test that needs to be moved
- ❌📍 - Failing test in canonical location
- ❌🔄 - Failing test that needs to be moved
- ❓📍 - Hanging test in canonical location
- ❓🔄 - Hanging test that needs to be moved

## Test Results
HEADER

# Test timeout in seconds
TEST_TIMEOUT=20

# Initialize counters for statistics
total=0
pass=0
fail=0
timeout=0
skip=0
canonical=0
noncanonical=0

echo "Starting test status check..."

# Process each test file line
grep "^- ❓" "$INPUT" | while read -r line; do
  # Extract the test file path
  test_file=$(echo "$line" | sed 's/^- ❓ //')
  
  echo "Testing: $test_file"
  ((total++))
  
  # Skip node_modules and dist files
  if [[ "$test_file" == *"node_modules"* || "$test_file" == *"/dist/"* ]]; then
    echo "- ⏩ $test_file" >> "$RESULTS"
    echo "  SKIP: node_modules or dist"
    ((skip++))
    continue
  fi
  
  # Check if file exists
  if [ \! -f "$test_file" ]; then
    echo "- ❌ $test_file (file not found)" >> "$RESULTS"
    echo "  ERROR: File not found"
    ((fail++))
    continue
  fi
  
  # Check if canonical location
  if [[ "$test_file" == "/opt/mExpress/tests/"* ]]; then
    location="📍"
    ((canonical++))
  else
    location="🔄"
    ((noncanonical++))
  fi
  
  # Determine config to use
  if [[ "$test_file" == *".tsx" ]]; then
    CONFIG="packages/core/jest.config.js"
  else
    CONFIG="packages/core/jest.simplified.config.js"
  fi
  
  # Run test with timeout
  echo "  Running test with $TEST_TIMEOUT second timeout..."
  if timeout $TEST_TIMEOUT npx jest --config $CONFIG "$test_file" > /dev/null 2>&1; then
    # Test passed
    echo "- ✅$location $test_file" >> "$RESULTS"
    echo "  PASS"
    ((pass++))
  elif [ $? -eq 124 ]; then
    # Test timed out
    echo "- ❓$location $test_file" >> "$RESULTS"
    echo "  TIMEOUT"
    ((timeout++))
  else
    # Test failed
    echo "- ❌$location $test_file" >> "$RESULTS"
    echo "  FAIL"
    ((fail++))
  fi
  
  # Show progress every 5 tests
  if (( total % 5 == 0 )); then
    echo "Progress: $total tests processed"
  fi
done

# Add summary statistics
echo -e "\n## Summary Statistics\n" >> "$RESULTS"
echo '```' >> "$RESULTS"
echo "Total tests: $total" >> "$RESULTS"
if [ $total -ne 0 ]; then
  echo "Passing: $pass ($(( 100 * pass / total ))%)" >> "$RESULTS"
  echo "Failing: $fail ($(( 100 * fail / total ))%)" >> "$RESULTS"
  echo "Hanging/Timeout: $timeout ($(( 100 * timeout / total ))%)" >> "$RESULTS"
else
  echo "Passing: $pass (0%)" >> "$RESULTS"
  echo "Failing: $fail (0%)" >> "$RESULTS"
  echo "Hanging/Timeout: $timeout (0%)" >> "$RESULTS"
fi
echo "Skipped: $skip" >> "$RESULTS"
if [ $((canonical + noncanonical)) -ne 0 ]; then
  echo "In canonical location: $canonical ($(( 100 * canonical / (canonical + noncanonical) ))%)" >> "$RESULTS"
  echo "Need to move: $noncanonical ($(( 100 * noncanonical / (canonical + noncanonical) ))%)" >> "$RESULTS"
else
  echo "In canonical location: $canonical (0%)" >> "$RESULTS"
  echo "Need to move: $noncanonical (0%)" >> "$RESULTS"
fi
echo '```' >> "$RESULTS"

echo "Done\! Results saved to $RESULTS"
