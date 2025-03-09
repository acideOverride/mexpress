#!/bin/bash
# 
# Single Test Runner and Status Updater
# This script runs a single test file and updates its status in TESTS_STATUS_ENHANCED.md
# Created: 2025-03-09
#
# Usage: ./run-single-test-and-update.sh /path/to/test/file.test.ts

# Define constants
OUTPUT_FILE="/opt/mExpress/tests/validation/unified/TESTS_STATUS_ENHANCED.md"
LOGS_DIR="/opt/mExpress/tests/results/logs"
CURRENT_DATE=$(date +%Y-%m-%d)

# Check if test file parameter was provided
if [ $# -lt 1 ]; then
  echo "Error: No test file provided"
  echo "Usage: $0 /opt/mExpress/packages/core/tests/p0/services/customer.service.test.ts>"
  exit 1
fi

TEST_FILE="$1"

# Check if the test file exists
if [ ! -f "$TEST_FILE" ]; then
  echo "Error: Test file does not exist: $TEST_FILE"
  exit 1
fi

# Create log directory structure
test_basename=$(basename "$TEST_FILE")
test_dir_path=$(dirname "$TEST_FILE" | sed 's|/opt/mExpress/||')
log_dir="$LOGS_DIR/$test_dir_path"
mkdir -p "$log_dir"

# Define log file path with timestamp to avoid overwrites
timestamp=$(date +%Y%m%d_%H%M%S)
log_file="$log_dir/${test_basename%.*}_${timestamp}.log"
relative_log_path=$(realpath --relative-to=/opt/mExpress "$log_file")

echo "Running test: $TEST_FILE"
echo "Test output will be saved to: $log_file"

# Determine priority
if [[ "$TEST_FILE" == *"/p0/"* ]]; then
  priority="P0"
  priority_icon="🔢"
  export PRIORITY=p0
elif [[ "$TEST_FILE" == *"/p1/"* ]]; then
  priority="P1"
  priority_icon="🔢"
  export PRIORITY=p1
elif [[ "$TEST_FILE" == *"/p2/"* ]]; then
  priority="P2"
  priority_icon="🔢"
  export PRIORITY=p2
elif [[ "$TEST_FILE" == *"/p3/"* ]]; then
  priority="P3"
  priority_icon="🔢"
  export PRIORITY=p3
else
  priority="Unknown"
  priority_icon="❔"
fi

# Determine location status
if [[ "$TEST_FILE" == *"/packages/"*"/tests/p"[0-3]"/"* || 
      "$TEST_FILE" == *"/projects/"*"/tests/"*"/p"[0-3]"/"* ]]; then
  location_icon="📍"
else
  location_icon="🚚"
fi

# Determine file type icon
if [[ "$TEST_FILE" == *".js" ]]; then
  file_type_icon="📝"
elif [[ "$TEST_FILE" == *".ts" && "$TEST_FILE" != *".tsx" ]]; then
  file_type_icon="📘"
elif [[ "$TEST_FILE" == *".tsx" ]]; then
  file_type_icon="📗"
elif [[ "$TEST_FILE" == *".jsx" ]]; then
  file_type_icon="📙"
else
  file_type_icon=""
fi

# Determine component area
component="unknown"
if [[ "$TEST_FILE" == *"/auth/"* || "$TEST_FILE" == *"auth."* ]]; then
  component="auth"
elif [[ "$TEST_FILE" == *"/api/"* || "$TEST_FILE" == *"api."* ]]; then
  component="api"
elif [[ "$TEST_FILE" == *"/core/"* ]]; then
  component="core"
elif [[ "$TEST_FILE" == *"/customer/"* || "$TEST_FILE" == *"customer."* ]]; then
  component="customer"
elif [[ "$TEST_FILE" == *"/product/"* || "$TEST_FILE" == *"product."* ]]; then
  component="product"
elif [[ "$TEST_FILE" == *"/message-queue/"* || "$TEST_FILE" == *"queue"* ]]; then
  component="queue"
elif [[ "$TEST_FILE" == *"/frontend/"* || "$TEST_FILE" == *".tsx"* ]]; then
  component="frontend"
elif [[ "$TEST_FILE" == *"/infrastructure/"* ]]; then
  component="infra"
elif [[ "$TEST_FILE" == *"/services/"* ]]; then
  component="services"
elif [[ "$TEST_FILE" == *"/utils/"* ]]; then
  component="utils"
fi

# Determine test type
test_type="unit"
if [[ "$TEST_FILE" == *"integration"* ]]; then
  test_type="integration"
  export TEST_TYPE=integration
elif [[ "$TEST_FILE" == *"e2e"* ]]; then
  test_type="e2e"
elif [[ "$TEST_FILE" == *"/frontend/"* ]]; then
  test_type="frontend"
  export TEST_TYPE=frontend
elif [[ "$TEST_FILE" == *".tsx" ]]; then
  test_type="react"
  export TEST_TYPE=react
elif [[ "$TEST_FILE" == *".vue" ]]; then
  test_type="vue"
  export TEST_TYPE=vue
fi

# Find the appropriate config file
config="/opt/mExpress/jest.config.js"  # Default to root config

# Save test information header to the log file
echo "# Test Execution Log: $TEST_FILE" > "$log_file"
echo "Date: $(date)" >> "$log_file"
echo "Configuration: $config" >> "$log_file"
echo "Priority: $PRIORITY" >> "$log_file"
echo "Test type: $TEST_TYPE" >> "$log_file"
echo "----------------------------------------" >> "$log_file"

# Run the test with fully standardized dynamic configuration
echo "Running test with command: MONGODB_URI=mongodb://localhost:27017/mexpress_test PRIORITY=$PRIORITY TEST_TYPE=$TEST_TYPE npx jest --config $config --testPathPattern=$TEST_FILE --no-cache --runInBand --verbose" >> "$log_file"
echo "----------------------------------------" >> "$log_file"

start_time=$(date +%s)
cd /opt/mExpress # Ensure we're in the right directory

MONGODB_URI=mongodb://localhost:27017/mexpress_test \
PRIORITY=$PRIORITY \
TEST_TYPE=$TEST_TYPE \
timeout 90 npx jest --config "$config" \
  --testPathPattern="$TEST_FILE" \
  --no-cache \
  --runInBand \
  --verbose > /tmp/test_output.log 2>&1
exit_code=$?
end_time=$(date +%s)
duration=$((end_time - start_time))

# Clean up the test output before saving it
grep -v "TESTS COMPLETE: FAIL" /tmp/test_output.log | grep -v "FINAL RESULT: FAIL" > /tmp/temp_output.log
grep -v "Validation Warning:" /tmp/temp_output.log | grep -v "Unknown option" > /tmp/cleaned_output.log

# Copy the cleaned test output to the log file
cat /tmp/cleaned_output.log >> "$log_file"

# Add clear summary to the log file
echo -e "\n----------------------------------------" >> "$log_file"
echo -e "OFFICIAL TEST RESULT SUMMARY:" >> "$log_file"

if [ $exit_code -eq 124 ]; then
  echo "RESULT: ⏱️ TIMEOUT (>30s)" >> "$log_file"
  test_status="timeout"
  status_icon="⏱️"
  
  # Create test entry with log link
  test_line="⏱️$priority_icon$location_icon$file_type_icon 🕒:>30s 🧪:$test_type 📦:$component $TEST_FILE | [log](/$relative_log_path)"
  
elif [ $exit_code -eq 0 ]; then
  # Count the actual passed tests from the output
  passed_count=$(grep -o "✓" /tmp/cleaned_output.log | wc -l)
  echo "RESULT: ✅ PASSED ($duration seconds, $passed_count tests)" >> "$log_file"
  test_status="pass"
  status_icon="✅"
  
  # Create test entry with log link
  test_line="✅$priority_icon$location_icon$file_type_icon 🕒:${duration}s 🧪:$test_type 📦:$component 🧩:~70% $TEST_FILE | [log](/$relative_log_path)"
  
else
  # Count the actual failed tests from the output
  failed_count=$(grep -o "✕" /tmp/cleaned_output.log | wc -l)
  echo "RESULT: ❌ FAILED ($duration seconds, $failed_count failures)" >> "$log_file"
  test_status="fail"
  status_icon="❌"
  
  # Determine error type
  error_type="Unknown"
  if grep -q "TypeError" /tmp/cleaned_output.log; then
    error_type="TypeError"
  elif grep -q "ReferenceError" /tmp/cleaned_output.log; then
    error_type="ReferenceError"
  elif grep -q "AssertionError" /tmp/cleaned_output.log; then
    error_type="AssertionError"
  elif grep -q "SyntaxError" /tmp/cleaned_output.log; then
    error_type="SyntaxError"
  elif grep -q "Error: Cannot find module" /tmp/cleaned_output.log; then
    error_type="ModuleError"
  elif grep -q "Error: Module not found" /tmp/cleaned_output.log; then
    error_type="ModuleError"
  elif grep -q "is not a function" /tmp/cleaned_output.log; then
    error_type="FunctionError"
  elif grep -q "timeout" /tmp/cleaned_output.log; then
    error_type="TimeoutError"
  elif grep -q "expected" /tmp/cleaned_output.log && grep -q "received" /tmp/cleaned_output.log; then
    error_type="AssertionError"
  fi
  
  # Create test entry with log link
  test_line="❌$priority_icon$location_icon$file_type_icon 🕒:${duration}s 🧪:$test_type 📦:$component 🔍:$error_type $TEST_FILE | [log](/$relative_log_path)"
fi

echo "$test_line"

# Now we need to update the status in TESTS_STATUS_ENHANCED.md
# First, check if the file exists
if [ ! -f "$OUTPUT_FILE" ]; then
  echo "Error: Status file does not exist: $OUTPUT_FILE"
  echo "Please run the main test runner first to generate the status file"
  exit 1
fi

# Convert the test path to a pattern that can be used in sed
test_path_pattern=$(echo "$TEST_FILE" | sed 's/\//\\\//g')

# Check if the test is already in the status file
if grep -q "$test_path_pattern" "$OUTPUT_FILE"; then
  echo "Updating existing test entry in status file..."
  
  # Create a sed expression to replace the existing test line
  # This replaces lines starting with any status icon followed by the test path
  sed -i "s/^[❌✅⏱️⏩].*$test_path_pattern.*/$test_line/" "$OUTPUT_FILE"
  
  echo "Test status updated to $status_icon in $OUTPUT_FILE"
else
  echo "Test not found in status file. Adding new entry..."
  
  # Find the appropriate section to add the test
  section_marker=""
  if [[ "$priority" == "P0" ]]; then
    section_marker="### P0 (Critical) Tests"
  elif [[ "$priority" == "P1" ]]; then
    section_marker="### P1 (High Priority) Tests"
  elif [[ "$priority" == "P2" ]]; then
    section_marker="### P2 (Medium Priority) Tests"
  elif [[ "$priority" == "P3" ]]; then
    section_marker="### P3 (Low Priority) Tests"
  else
    section_marker="### Tests with Unknown Priority"
  fi
  
  # Add to the appropriate section
  if grep -q "$section_marker" "$OUTPUT_FILE"; then
    sed -i "/$section_marker/a $test_line" "$OUTPUT_FILE"
    echo "Added test to $section_marker section"
  else
    # If the section doesn't exist, add it and the test
    echo -e "\n$section_marker\n$test_line" >> "$OUTPUT_FILE"
    echo "Created $section_marker section and added test"
  fi
fi

# Add to the Recent Updates section or create it if it doesn't exist
if grep -q "## Recent Updates" "$OUTPUT_FILE"; then
  # Check if today's date is already in the Recent Updates section
  if grep -q "${CURRENT_DATE}" "$OUTPUT_FILE" && grep -q "## Recent Updates" -A 5 "$OUTPUT_FILE"; then
    # Add a new bullet under today's date
    sed -i "/## Recent Updates/,/${CURRENT_DATE}/s/${CURRENT_DATE}/${CURRENT_DATE}\n- Test updated: $TEST_FILE - Status: $status_icon/" "$OUTPUT_FILE"
  else
    # Add today's date and the update
    sed -i "/## Recent Updates/a \n**${CURRENT_DATE}**:\n- Test updated: $TEST_FILE - Status: $status_icon" "$OUTPUT_FILE"
  fi
else
  # Create Recent Updates section
  echo -e "\n## Recent Updates\n\n**${CURRENT_DATE}**:\n- Test updated: $TEST_FILE - Status: $status_icon" >> "$OUTPUT_FILE"
fi

# Display the final result
if [ "$test_status" == "pass" ]; then
  echo -e "\n✅ TEST PASSED: $TEST_FILE"
  echo "Duration: ${duration}s"
  echo "Log file: $log_file"
  echo "Status file updated: $OUTPUT_FILE"
elif [ "$test_status" == "timeout" ]; then
  echo -e "\n⏱️ TEST TIMED OUT: $TEST_FILE"
  echo "Status file updated: $OUTPUT_FILE"
else
  echo -e "\n❌ TEST FAILED: $TEST_FILE"
  echo "Error type: $error_type"
  echo "Duration: ${duration}s"
  echo "Log file: $log_file"
  echo "Status file updated: $OUTPUT_FILE"
fi

exit $exit_code