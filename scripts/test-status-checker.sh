#\!/bin/bash

# Test Status Checker
# This script checks each test file for:
# 1. Pass/Fail status
# 2. Whether it's in the canonical location (/opt/mExpress/tests/)

# Output file 
OUTPUT="/opt/mExpress/tests/validation/unified/TEST_STATUS_REPORT.md"

# Function to check if test passes
check_test_status() {
  local test_file=$1
  local test_name=$(basename "$test_file")
  
  # Skip node_modules and dist files
  if [[ "$test_file" == *"node_modules"* || "$test_file" == *"/dist/"* ]]; then
    echo "⏩ SKIPPED (EXTERNAL): $test_file"
    return 2
  fi
  
  # Determine the right config to use
  if [[ "$test_file" == *".tsx" ]]; then
    # React component tests need a different config
    CONFIG="packages/core/jest.config.js"
  else
    # Regular tests
    CONFIG="packages/core/jest.simplified.config.js"
  fi
  
  # Run the test with output redirected
  if npx jest --config $CONFIG "$test_file" > /dev/null 2>&1; then
    echo "✅ PASSED: $test_file"
    return 0
  else
    echo "❌ FAILED: $test_file"
    return 1
  fi
}

# Function to check if test is in canonical location
is_canonical_location() {
  local test_file=$1
  
  # Tests should be in the central test directory
  if [[ "$test_file" == "/opt/mExpress/tests/"* ]]; then
    echo "📍 CANONICAL: $test_file"
    return 0
  else
    echo "🔄 MOVE NEEDED: $test_file"
    return 1
  fi
}

# Function to process a test and add it to the report
process_test() {
  local test_file=$1
  local priority=$2
  local status_icon=""
  local location_icon=""
  
  # Check test status
  check_test_status "$test_file"
  local status=$?
  
  if [ $status -eq 0 ]; then
    status_icon="✅"
  elif [ $status -eq 1 ]; then
    status_icon="❌"
  else
    status_icon="⏩"
  fi
  
  # Skip location check for skipped tests
  if [ $status -eq 2 ]; then
    echo "- $status_icon $test_file" >> "$OUTPUT"
    return
  fi
  
  # Check if canonical location
  is_canonical_location "$test_file"
  local location=$?
  
  if [ $location -eq 0 ]; then
    location_icon="📍"
  else
    location_icon="🔄"
  fi
  
  # Add to report with combined icons
  echo "- $status_icon$location_icon $test_file" >> "$OUTPUT"
}

# Initialize the report
cat << 'HEADER' > "$OUTPUT"
# Test Status Report

Legend:
- ✅ - Test passes
- ❌ - Test fails
- ⏩ - Test skipped (node_modules or dist)
- 📍 - Test is in canonical location
- 🔄 - Test should be moved to canonical location

Combined icons:
- ✅📍 - Passing test in canonical location (ideal)
- ✅🔄 - Passing test that needs to be moved
- ❌📍 - Failing test in canonical location
- ❌🔄 - Failing test that needs to be moved

HEADER

# Function to process a section of the PALL_SORTED_RECAP.md file
process_section() {
  local priority=$1
  local section_header=$2
  
  echo "## $section_header" >> "$OUTPUT"
  echo "" >> "$OUTPUT"
  
  # Extract the tests for this section from the sorted recap file
  # Process a small sample of 5 tests per section for demonstration
  grep -A 100 "^## $priority" /opt/mExpress/tests/validation/unified/PALL_SORTED_RECAP.md | 
    grep -v "^##" | 
    grep "^ *- ❓" | 
    head -n 5 | 
    while read -r line; do
      test_file=$(echo "$line" | sed 's/^ *- ❓ //')
      if [ -f "$test_file" ]; then
        process_test "$test_file" "$priority"
      fi
    done
  
  echo "" >> "$OUTPUT"
}

# Process each priority section
process_section "P0" "P0 (Critical Path) Tests"
process_section "P1" "P1 (Important Features) Tests"
process_section "P2" "P2 (Secondary Features) Tests"
process_section "P3" "P3 (Performance & Stress) Tests"
process_section "Other" "Other Tests"

echo "## Test Execution Instructions" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "To run the full test status check on all files, execute:" >> "$OUTPUT"
echo '```bash' >> "$OUTPUT"
echo '# Replace this demo script with the full check script' >> "$OUTPUT"
echo './scripts/full-test-status-checker.sh' >> "$OUTPUT"
echo '```' >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "The full script will:" >> "$OUTPUT"
echo "1. Check each test file's status (pass/fail)" >> "$OUTPUT"
echo "2. Check if the test file is in the canonical location" >> "$OUTPUT"
echo "3. Generate a complete report with status indicators" >> "$OUTPUT"
echo "4. Identify tests that need to be moved or fixed" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "Warning: The full test run may take significant time to complete." >> "$OUTPUT"

# Make the script executable
chmod +x /opt/mExpress/scripts/test-status-checker.sh

echo "Test status checker script created at /opt/mExpress/scripts/test-status-checker.sh"
echo "This sample script will check 5 tests from each priority section to demonstrate functionality."
echo "Run it with: ./scripts/test-status-checker.sh"
