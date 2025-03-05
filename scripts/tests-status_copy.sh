#!/bin/bash

# Enhanced script to test each file in FULL_TEST_STATUS_REPORT.md
# Creates a comprehensive TEST_RESULTS.md file with extended metrics

# Input file
INPUT="/opt/mExpress/tests/validation/unified/FULL_TEST_STATUS_REPORT.md"
# Results file
RESULTS="/opt/mExpress/tests/validation/unified/TEST_STATUS_RESULTS_V2.md"
# Temp directory for test outputs
TEMP_DIR="/tmp/test_outputs"
mkdir -p "$TEMP_DIR"

# Limit to first N tests (for debugging)
TEST_LIMIT=20
# Set to empty to run all tests
# TEST_LIMIT=""

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
- 🕒 - Test duration (fast ≤1s, normal ≤5s, slow >5s)
- 🧪 - Test type (unit, integration, e2e)
- 📦 - Test component area
- 🔍 - Error type (for failing tests)

Combined icons examples:
- ✅📍🕒:0.3s🧪:unit📦:auth - Fast passing unit test for auth in canonical location
- ❌🔄🕒:6.2s🧪:integration📦:api🔍:TypeError - Slow failing integration test with TypeError

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

# Initialize component and type counters
declare -A component_counts
declare -A type_counts
declare -A error_types
declare -A duration_categories

# Initialize duration categories
duration_categories["fast"]=0
duration_categories["normal"]=0
duration_categories["slow"]=0

echo "Starting test status check..."

# Create a limited test list if TEST_LIMIT is set
if [ -n "$TEST_LIMIT" ]; then
  grep "^- ❓" "$INPUT" | head -n "$TEST_LIMIT" > /tmp/test_list_limited.txt
  TEST_LIST_FILE="/tmp/test_list_limited.txt"
else
  grep "^- ❓" "$INPUT" > /tmp/test_list_full.txt
  TEST_LIST_FILE="/tmp/test_list_full.txt"
fi

# Process each test file line
cat "$TEST_LIST_FILE" | while read -r line; do
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
  if [ ! -f "$test_file" ]; then
    echo "- ❌ $test_file (file not found)" >> "$RESULTS"
    echo "  ERROR: File not found"
    ((fail++))
    continue
  fi
  
  # Extract metadata: Determine component area from path
  component="unknown"
  if [[ "$test_file" == *"/auth/"* || "$test_file" == *"auth."* ]]; then
    component="auth"
  elif [[ "$test_file" == *"/api/"* || "$test_file" == *"api."* ]]; then
    component="api"
  elif [[ "$test_file" == *"/core/"* ]]; then
    component="core"
  elif [[ "$test_file" == *"/customer/"* || "$test_file" == *"customer."* ]]; then
    component="customer"
  elif [[ "$test_file" == *"/product/"* || "$test_file" == *"product."* ]]; then
    component="product"
  elif [[ "$test_file" == *"/message-queue/"* || "$test_file" == *"queue"* ]]; then
    component="queue"
  elif [[ "$test_file" == *"/frontend/"* || "$test_file" == *".tsx"* ]]; then
    component="frontend"
  elif [[ "$test_file" == *"/infrastructure/"* ]]; then
    component="infra"
  fi
  
  # Determine test type from filename and path
  test_type="unit"
  if [[ "$test_file" == *"integration"* ]]; then
    test_type="integration"
  elif [[ "$test_file" == *"e2e"* ]]; then
    test_type="e2e"
  fi
  
  # Update component and type counters
  ((component_counts["$component"]++))
  ((type_counts["$test_type"]++))
  
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
  
  # Generate a unique output file for this test
  output_file="$TEMP_DIR/$(basename "$test_file").out"
  
  # Run test with timeout and capture start time
  echo "  Running test with $TEST_TIMEOUT second timeout..."
  start_time=$(date +%s.%N)
  timeout $TEST_TIMEOUT npx jest --config $CONFIG "$test_file" > "$output_file" 2>&1
  exit_code=$?
  end_time=$(date +%s.%N)
  
  # Calculate duration
  duration=$(echo "$end_time - $start_time" | bc)
  # Format duration to 1 decimal place
  duration=$(printf "%.1f" $duration)
  
  # Categorize duration
  duration_category=""
  if (( $(echo "$duration <= 1.0" | bc -l) )); then
    duration_category="fast"
    ((duration_categories["fast"]++))
  elif (( $(echo "$duration <= 5.0" | bc -l) )); then
    duration_category="normal"
    ((duration_categories["normal"]++))
  else
    duration_category="slow"
    ((duration_categories["slow"]++))
  fi
  
  # Check result
  if [ $exit_code -eq 0 ]; then
    # Test passed
    result_line="- ✅$location🕒:${duration}s🧪:$test_type📦:$component $test_file"
    echo "$result_line" >> "$RESULTS"
    echo "  PASS (${duration}s)"
    ((pass++))
  elif [ $exit_code -eq 124 ]; then
    # Test timed out
    result_line="- ❓$location🕒:>${TEST_TIMEOUT}s🧪:$test_type📦:$component $test_file"
    echo "$result_line" >> "$RESULTS"
    echo "  TIMEOUT (>${TEST_TIMEOUT}s)"
    ((timeout++))
  else
    # Test failed - analyze error type
    error_type="Unknown"
    
    # Extract error type from output file
    if grep -q "TypeError" "$output_file"; then
      error_type="TypeError"
    elif grep -q "ReferenceError" "$output_file"; then
      error_type="ReferenceError"
    elif grep -q "AssertionError" "$output_file"; then
      error_type="AssertionError"
    elif grep -q "SyntaxError" "$output_file"; then
      error_type="SyntaxError"
    elif grep -q "Error: Cannot find module" "$output_file"; then
      error_type="ModuleError"
    elif grep -q "Error: Module not found" "$output_file"; then
      error_type="ModuleError"
    elif grep -q "is not a function" "$output_file"; then
      error_type="FunctionError"
    elif grep -q "timeout" "$output_file"; then
      error_type="TimeoutError"
    elif grep -q "expected" "$output_file" && grep -q "received" "$output_file"; then
      error_type="AssertionError"
    fi
    
    # Update error type counter
    ((error_types["$error_type"]++))
    
    result_line="- ❌$location🕒:${duration}s🧪:$test_type📦:$component🔍:$error_type $test_file"
    echo "$result_line" >> "$RESULTS"
    echo "  FAIL (${duration}s): $error_type"
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

# Add component breakdown
echo -e "\n## Component Breakdown\n" >> "$RESULTS"
echo '```' >> "$RESULTS"
for component in "${!component_counts[@]}"; do
  count=${component_counts[$component]}
  if [ $total -ne 0 ]; then
    percentage=$(( 100 * count / total ))
    echo "$component: $count ($percentage%)" >> "$RESULTS"
  else
    echo "$component: $count (0%)" >> "$RESULTS"
  fi
done
echo '```' >> "$RESULTS"

# Add test type breakdown
echo -e "\n## Test Type Breakdown\n" >> "$RESULTS"
echo '```' >> "$RESULTS"
for type in "${!type_counts[@]}"; do
  count=${type_counts[$type]}
  if [ $total -ne 0 ]; then
    percentage=$(( 100 * count / total ))
    echo "$type: $count ($percentage%)" >> "$RESULTS"
  else
    echo "$type: $count (0%)" >> "$RESULTS"
  fi
done
echo '```' >> "$RESULTS"

# Add error type breakdown
if [ ${#error_types[@]} -gt 0 ]; then
  echo -e "\n## Error Type Breakdown\n" >> "$RESULTS"
  echo '```' >> "$RESULTS"
  for error in "${!error_types[@]}"; do
    count=${error_types[$error]}
    if [ $fail -ne 0 ]; then
      percentage=$(( 100 * count / fail ))
      echo "$error: $count ($percentage%)" >> "$RESULTS"
    else
      echo "$error: $count (0%)" >> "$RESULTS"
    fi
  done
  echo '```' >> "$RESULTS"
fi

# Add duration breakdown
echo -e "\n## Test Duration Breakdown\n" >> "$RESULTS"
echo '```' >> "$RESULTS"
echo "Fast (≤1s): ${duration_categories["fast"]}" >> "$RESULTS"
echo "Normal (1-5s): ${duration_categories["normal"]}" >> "$RESULTS"
echo "Slow (>5s): ${duration_categories["slow"]}" >> "$RESULTS"
echo '```' >> "$RESULTS"

# Export to JSON for dashboard
json_file="/opt/mExpress/dashboard/unified/generated/test-stats.json"
mkdir -p "$(dirname "$json_file")"

cat > "$json_file" << EOL
{
  "summary": {
    "total": $total,
    "pass": $pass,
    "fail": $fail,
    "timeout": $timeout,
    "skip": $skip,
    "canonical": $canonical,
    "nonCanonical": $noncanonical
  },
  "components": {
EOL

# Add component breakdown to JSON
first=true
for component in "${!component_counts[@]}"; do
  count=${component_counts[$component]}
  if [ "$first" = true ]; then
    first=false
  else
    echo "," >> "$json_file"
  fi
  echo "    \"$component\": $count" >> "$json_file"
done

cat >> "$json_file" << EOL
  },
  "testTypes": {
EOL

# Add test type breakdown to JSON
first=true
for type in "${!type_counts[@]}"; do
  count=${type_counts[$type]}
  if [ "$first" = true ]; then
    first=false
  else
    echo "," >> "$json_file"
  fi
  echo "    \"$type\": $count" >> "$json_file"
done

cat >> "$json_file" << EOL
  },
  "errorTypes": {
EOL

# Add error type breakdown to JSON
first=true
for error in "${!error_types[@]}"; do
  count=${error_types[$error]}
  if [ "$first" = true ]; then
    first=false
  else
    echo "," >> "$json_file"
  fi
  echo "    \"$error\": $count" >> "$json_file"
done

cat >> "$json_file" << EOL
  },
  "duration": {
    "fast": ${duration_categories["fast"]},
    "normal": ${duration_categories["normal"]},
    "slow": ${duration_categories["slow"]}
  },
  "testDate": "$(date +'%Y-%m-%d %H:%M:%S')"
}
EOL

echo "Done! Results saved to $RESULTS"
echo "JSON stats saved to $json_file"

# Clean up temp files
rm -rf "$TEMP_DIR"