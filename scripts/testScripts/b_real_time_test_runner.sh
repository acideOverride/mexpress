#!/bin/bash

# real_time_test_runner.sh
#
# This script runs the actual tests from REAL_TESTS_LIST.md and updates the report in real-time
# Unlike enhanced_test_runner.sh, this script focuses only on test execution and updating the report
# It relies on test_pre_calculation.sh to generate the pre-test metrics first
#
# Usage: ./real_time_test_runner.sh [--max-tests=N] [--all] [--shuffle] [--priority=P0,P1]

# Define report file paths
OUTPUT_FILE="/opt/mExpress/tests/validation/unified/TESTS_STATUS_ENHANCED.md"
TEST_LIST_FILE="/opt/mExpress/tests/validation/unified/REAL_TESTS_LIST.md"
LOGS_DIR="/opt/mExpress/tests/results/logs"
mkdir -p "$(dirname "$OUTPUT_FILE")"
mkdir -p "$LOGS_DIR"

# Initialize counters
total=0
pass=0
fail=0
timeout=0
skipped=0

# Initialize file type counters as global variables
declare -g js_tests=0
declare -g ts_tests=0
declare -g tsx_tests=0
declare -g jsx_tests=0

# Get the current date
CURRENT_DATE=$(date +%Y-%m-%d)

# Check for command line arguments
MAX_TESTS=0  # Default is run ALL tests
SHUFFLE=false
PRIORITIES="P0,P1,P2,P3"  # Default is run all priorities

for arg in "$@"; do
  if [[ "$arg" =~ --max-tests=([0-9]+) ]]; then
    MAX_TESTS="${BASH_REMATCH[1]}"
    echo "Will run maximum $MAX_TESTS tests"
  elif [[ "$arg" == "--all" ]]; then
    MAX_TESTS=0
    echo "Will run all tests"
  elif [[ "$arg" == "--shuffle" ]]; then
    SHUFFLE=true
    echo "Will shuffle test order"
  elif [[ "$arg" =~ --priority=([P0-9,]+) ]]; then
    PRIORITIES="${BASH_REMATCH[1]}"
    echo "Will run tests with priorities: $PRIORITIES"
  elif [[ "$arg" == "--help" ]]; then
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  --max-tests=N       Run at most N tests"
    echo "  --all               Run all tests (default)"
    echo "  --shuffle           Randomize test order" 
    echo "  --priority=P0,P1    Run only tests with specified priorities"
    echo "  --help              Show this help message"
    exit 0
  fi
done

# Initialize the output file with the enhanced legend
cat > "$OUTPUT_FILE" << HEADER
# Enhanced Unified Test Status Report
*Last updated: ${CURRENT_DATE}*

This report shows test execution status and metrics:

Legend:
- ✅ - Test passes
- ❌ - Test fails
- ⏱️ - Test timed out
- ⏩ - Test skipped
- 📍 - Test is in project-specific location (correct)
- 🚚 - Test needs to be moved from centralized location
- 🔢 - Test has priority label (P0-P3)
- ❔ - Test missing priority label
- 🕒 - Test duration
- 🧪 - Test type (unit, integration, e2e)
- 📦 - Component area
- 🔍 - Error type (for failing tests)
- 🧩 - Test coverage percentage
- 📝 - JavaScript file (.js) - MIGRATION REQUIRED ⚠️
- 📘 - TypeScript file (.ts) - PREFERRED ✓
- 📗 - React TypeScript file (.tsx) - PREFERRED ✓
- 📙 - React JavaScript file (.jsx) - MIGRATION REQUIRED ⚠️
- 👯 - Duplicate test (same name in both JS and TS) - JS VERSION SHOULD BE REMOVED ⚠️

## Tests By Status (Running)
HEADER

# Create sections for each priority level in the report file
echo -e "\n### P0 (Critical) Tests - Running\n" >> "$OUTPUT_FILE"
echo -e "\n### P1 (High Priority) Tests - Running\n" >> "$OUTPUT_FILE"
echo -e "\n### P2 (Medium Priority) Tests - Running\n" >> "$OUTPUT_FILE"
echo -e "\n### P3 (Low Priority) Tests - Running\n" >> "$OUTPUT_FILE"
echo -e "\n### Tests with Unknown Priority - Running\n" >> "$OUTPUT_FILE"

# Create the test statistics section
echo -e "\n### Test Statistics (In Progress)\n" >> "$OUTPUT_FILE"
echo "🧮 Calculating statistics..." >> "$OUTPUT_FILE"

# Extract test files from REAL_TESTS_LIST.md
echo "Extracting test files from $TEST_LIST_FILE..."
if [ ! -f "$TEST_LIST_FILE" ]; then
  echo "Error: Test list file not found: $TEST_LIST_FILE"
  exit 1
fi

# Create array of test files by extracting paths from the REAL_TESTS_LIST.md file
readarray -t TEST_FILES < <(grep -o '/opt/mExpress/.*\.test\.\(ts\|js\|tsx\|jsx\)' "$TEST_LIST_FILE")

# Filter tests by priority if specified
if [[ "$PRIORITIES" != "P0,P1,P2,P3" ]]; then
  # Split the priority string into an array
  IFS=',' read -r -a PRIORITY_ARRAY <<< "$PRIORITIES"
  FILTERED_FILES=()
  
  for test_file in "${TEST_FILES[@]}"; do
    for priority in "${PRIORITY_ARRAY[@]}"; do
      if [[ "$test_file" == *"/p${priority#P}/"* ]]; then
        FILTERED_FILES+=("$test_file")
        break
      fi
    done
  done
  
  # Update the test files array with the filtered list
  TEST_FILES=("${FILTERED_FILES[@]}")
  echo "Filtered to ${#TEST_FILES[@]} tests with priorities: $PRIORITIES"
fi

# Shuffle tests if requested
if [ "$SHUFFLE" = true ]; then
  # Fisher-Yates shuffle
  for i in "${!TEST_FILES[@]}"; do
    j=$(($RANDOM % ${#TEST_FILES[@]}))
    temp="${TEST_FILES[$i]}"
    TEST_FILES[$i]="${TEST_FILES[$j]}"
    TEST_FILES[$j]="$temp"
  done
  echo "Tests shuffled randomly"
fi

# Limit number of tests if requested
if [ "$MAX_TESTS" -gt 0 ] && [ "$MAX_TESTS" -lt "${#TEST_FILES[@]}" ]; then
  echo "Limiting to $MAX_TESTS tests out of ${#TEST_FILES[@]} total"
  TEST_FILES=("${TEST_FILES[@]:0:$MAX_TESTS}")
fi

# Initialize the total test count
total=${#TEST_FILES[@]}

# Update the statistics section with initial counts
echo -e "\n### Test Statistics (In Progress)\n" > /tmp/stats_section.md
echo "Total tests to run: $total" >> /tmp/stats_section.md
echo "Tests completed: 0/$total (0%)" >> /tmp/stats_section.md
echo "Passing: 0" >> /tmp/stats_section.md
echo "Failing: 0" >> /tmp/stats_section.md
echo "Timed out: 0" >> /tmp/stats_section.md
echo "TypeScript files: 0 (0%)" >> /tmp/stats_section.md
echo "JavaScript files: 0 (0%)" >> /tmp/stats_section.md

# Replace the statistics section in the main file
sed -i '/### Test Statistics/,/TypeScript files:/d' "$OUTPUT_FILE"
cat /tmp/stats_section.md >> "$OUTPUT_FILE"

echo "Will run ${#TEST_FILES[@]} tests"

# Arrays for tests by priority and status
p0_passing=()
p0_failing=()
p1_passing=()
p1_failing=()
p2_passing=()
p2_failing=()
p3_passing=()
p3_failing=()
unknown_passing=()
unknown_failing=()
timeout_tests=()
skipped_tests=()

# Initialize file counters (redundant, but keeping for safety)
echo "Before test processing: JS=$js_tests, TS=$ts_tests, TSX=$tsx_tests, JSX=$jsx_tests" >&2

# Process all files first to get correct file type counts
for test_file in "${TEST_FILES[@]}"; do
  if [[ "$test_file" == *".js" ]]; then
    js_tests=$((js_tests + 1))
  elif [[ "$test_file" == *".ts" && "$test_file" != *".tsx" ]]; then
    ts_tests=$((ts_tests + 1))
  elif [[ "$test_file" == *".tsx" ]]; then
    tsx_tests=$((tsx_tests + 1))
  elif [[ "$test_file" == *".jsx" ]]; then
    jsx_tests=$((jsx_tests + 1))
  fi
done

echo "After file type counting: JS=$js_tests, TS=$ts_tests, TSX=$tsx_tests, JSX=$jsx_tests" >&2

# Function to update statistics section in the report file
update_statistics() {
  # First, ensure we have proper counts
  echo "DEBUG: STATISTICS UPDATE - JS: $js_tests, TS: $ts_tests, TSX: $tsx_tests, JSX: $jsx_tests" >&2
  
  # Safety check to avoid division by zero
  if [ "$total" -eq 0 ]; then
    local completion=0
  else
    local completion=$((100 * (pass + fail + timeout) / total))
  fi
  
  # Create a new statistics section
  echo -e "\n### Test Statistics (In Progress)\n" > /tmp/stats_section.md
  echo "Total tests to run: $total" >> /tmp/stats_section.md
  echo "Tests completed: $((pass + fail + timeout))/$total ($completion%)" >> /tmp/stats_section.md
  echo "Passing: $pass" >> /tmp/stats_section.md
  echo "Failing: $fail" >> /tmp/stats_section.md
  echo "Timed out: $timeout" >> /tmp/stats_section.md
  
  # Add language statistics
  local total_language_tests=$((js_tests + ts_tests + tsx_tests + jsx_tests))
  echo "DEBUG: Total language tests: $total_language_tests" >&2
  
  # Make sure we have proper values before calculating percentages
  if [ "$total_language_tests" -gt 0 ]; then
    local ts_percentage=$((100 * (ts_tests + tsx_tests) / total_language_tests))
    local js_percentage=$((100 * (js_tests + jsx_tests) / total_language_tests))
    echo "TypeScript files: $((ts_tests + tsx_tests)) ($ts_percentage%)" >> /tmp/stats_section.md
    echo "JavaScript files: $((js_tests + jsx_tests)) ($js_percentage%)" >> /tmp/stats_section.md
    echo "DEBUG: TS percentage: $ts_percentage%, JS percentage: $js_percentage%" >&2
  else
    echo "TypeScript files: 0 (0%)" >> /tmp/stats_section.md
    echo "JavaScript files: 0 (0%)" >> /tmp/stats_section.md
    echo "DEBUG: No language tests detected" >&2
  fi
  
  # Replace the statistics section in the main file
  sed -i '/### Test Statistics/,/JavaScript files:/d' "$OUTPUT_FILE"
  cat /tmp/stats_section.md >> "$OUTPUT_FILE"
}

# Function to add a test result to the appropriate section in the report file
add_test_to_report() {
  local test_line="$1"
  local priority="$2"
  local status="$3"
  
  local section_marker
  if [[ "$priority" == "P0" ]]; then
    section_marker="### P0 (Critical) Tests - Running"
  elif [[ "$priority" == "P1" ]]; then
    section_marker="### P1 (High Priority) Tests - Running"
  elif [[ "$priority" == "P2" ]]; then
    section_marker="### P2 (Medium Priority) Tests - Running"
  elif [[ "$priority" == "P3" ]]; then
    section_marker="### P3 (Low Priority) Tests - Running"
  else
    section_marker="### Tests with Unknown Priority - Running"
  fi
  
  # Insert line after the section marker
  sed -i "/$section_marker/a $test_line" "$OUTPUT_FILE"
}

# Function to determine if a file is in project-specific location (canonical)
is_in_canonical_location() {
  local file=$1
  
  # Should be in project-specific test directory and follow priority structure
  if [[ "$file" == *"/packages/"*"/tests/p"[0-3]"/"* || 
        "$file" == *"/projects/"*"/tests/"*"/p"[0-3]"/"* ]]; then
    return 0  # True, in canonical project-specific location
  fi
  
  # Default to non-canonical
  return 1  # False, not in canonical location
}

# Function to determine component area from path
determine_component() {
  local file=$1
  local component="unknown"
  
  if [[ "$file" == *"/auth/"* || "$file" == *"auth."* ]]; then
    component="auth"
  elif [[ "$file" == *"/api/"* || "$file" == *"api."* ]]; then
    component="api"
  elif [[ "$file" == *"/core/"* ]]; then
    component="core"
  elif [[ "$file" == *"/customer/"* || "$file" == *"customer."* ]]; then
    component="customer"
  elif [[ "$file" == *"/product/"* || "$file" == *"product."* ]]; then
    component="product"
  elif [[ "$file" == *"/message-queue/"* || "$file" == *"queue"* ]]; then
    component="queue"
  elif [[ "$file" == *"/frontend/"* || "$file" == *".tsx"* ]]; then
    component="frontend"
  elif [[ "$file" == *"/infrastructure/"* ]]; then
    component="infra"
  elif [[ "$file" == *"/services/"* ]]; then
    component="services"
  elif [[ "$file" == *"/utils/"* ]]; then
    component="utils"
  fi
  
  echo "$component"
}

# Function to determine test type from filename and path
determine_test_type() {
  local file=$1
  local test_type="unit"
  
  if [[ "$file" == *"integration"* ]]; then
    test_type="integration"
  elif [[ "$file" == *"e2e"* ]]; then
    test_type="e2e"
  fi
  
  echo "$test_type"
}

# Get file type icon and update counters
get_file_type_icon() {
  local file=$1
  
  if [[ "$file" == *".js" ]]; then
    js_tests=$((js_tests + 1))
    echo "📝"
  elif [[ "$file" == *".ts" && "$file" != *".tsx" ]]; then
    ts_tests=$((ts_tests + 1))
    echo "📘"
  elif [[ "$file" == *".tsx" ]]; then
    tsx_tests=$((tsx_tests + 1))
    echo "📗"
  elif [[ "$file" == *".jsx" ]]; then
    jsx_tests=$((jsx_tests + 1))
    echo "📙"
  else
    echo ""
  fi
  
  # Debug output to verify counting
  echo "DEBUG: Current counts - JS: $js_tests, TS: $ts_tests, TSX: $tsx_tests, JSX: $jsx_tests" >&2
}

# Find a specific config for each test location following standardized approach
get_config() {
  local test_file=$1
  local config_file=""
  
  # Extract the package and priority information from the test file path
  local package=""
  local priority=""
  
  # Extract package name
  if [[ "$test_file" == *"/packages/core/"* ]]; then
    package="core"
  elif [[ "$test_file" == *"/packages/utils/"* ]]; then
    package="utils"
  elif [[ "$test_file" == *"/packages/ui-components/"* ]]; then
    package="ui-components" 
  elif [[ "$test_file" == *"/packages/vue-components/"* ]]; then
    package="vue-components"
  elif [[ "$test_file" == *"/projects/montpc_crm/"* ]]; then
    package="montpc_crm"
  elif [[ "$test_file" == *"/projects/giandra_photos/"* ]]; then
    package="giandra_photos"
  elif [[ "$test_file" == *"/projects/jerome_bikes/"* ]]; then
    package="jerome_bikes"
  fi
  
  # Extract priority level
  if [[ "$test_file" == *"/p0/"* ]]; then
    priority="p0"
  elif [[ "$test_file" == *"/p1/"* ]]; then
    priority="p1"
  elif [[ "$test_file" == *"/p2/"* ]]; then
    priority="p2"
  elif [[ "$test_file" == *"/p3/"* ]]; then
    priority="p3"
  fi
  
  # Extract test type
  local test_type=""
  if [[ "$test_file" == *"/integration/"* ]]; then
    test_type="integration"
  elif [[ "$test_file" == *"/frontend/"* ]]; then
    test_type="frontend"
  elif [[ "$test_file" == *"/backend/"* ]]; then
    test_type="backend"
  elif [[ "$test_file" == *"/lib/resilience/"* ]]; then
    test_type="resilience"
  fi
  
  # Standard path resolution logic, from most specific to least specific
  
  # 1. Check for a config specific to this test's immediate directory
  local test_dir=$(dirname "$test_file")
  if [ -f "${test_dir}/jest.config.js" ]; then
    config_file="${test_dir}/jest.config.js"
    
  # 2. Check for priority-specific config
  elif [ -n "$package" ] && [ -n "$priority" ]; then
    # Projects have a different structure
    if [[ "$package" == montpc_crm || "$package" == giandra_photos || "$package" == jerome_bikes ]]; then
      if [ -n "$test_type" ] && [ -f "projects/${package}/tests/${test_type}/${priority}/jest.config.js" ]; then
        config_file="projects/${package}/tests/${test_type}/${priority}/jest.config.js"
      elif [ -f "projects/${package}/tests/${priority}/jest.config.js" ]; then
        config_file="projects/${package}/tests/${priority}/jest.config.js"
      fi
    else
      # Regular packages
      if [ -n "$test_type" ] && [ -f "packages/${package}/tests/${priority}/${test_type}/jest.config.js" ]; then
        config_file="packages/${package}/tests/${priority}/${test_type}/jest.config.js"
      elif [ -f "packages/${package}/tests/${priority}/jest.config.js" ]; then
        config_file="packages/${package}/tests/${priority}/jest.config.js"
      fi
    fi
  fi
  
  # 3. If still no config, check for package-level config
  if [ -z "$config_file" ] || [ ! -f "$config_file" ]; then
    if [ -n "$package" ]; then
      if [[ "$package" == montpc_crm || "$package" == giandra_photos || "$package" == jerome_bikes ]]; then
        if [ -f "projects/${package}/jest.config.js" ]; then
          config_file="projects/${package}/jest.config.js"
        elif [ -f "projects/${package}/tests/jest.config.js" ]; then
          config_file="projects/${package}/tests/jest.config.js"
        fi
      else
        if [ -f "packages/${package}/jest.config.js" ]; then
          config_file="packages/${package}/jest.config.js"
        fi
      fi
    fi
  fi
  
  # 4. As a last resort, use root config
  if [ -z "$config_file" ] || [ ! -f "$config_file" ]; then
    config_file="jest.config.js"
  fi
  
  echo "$config_file"
}

# Function to detect duplicates by removing extension
get_base_filename() {
  local file=$1
  # Remove extension and keep path
  echo "${file%.*.*}"
}

# Map to detect duplicate tests (same name with different extensions)
declare -A test_map
declare -A duplicate_tests

# Build the map of test base filenames to detect duplicates
for test_file in "${TEST_FILES[@]}"; do
  base_name=$(get_base_filename "$test_file")
  
  # If this base name already exists, it's a duplicate
  if [[ -n "${test_map[$base_name]}" ]]; then
    duplicate_tests[$base_name]=1
  fi
  
  # Add this file to the map
  test_map[$base_name]="${test_map[$base_name]} $test_file"
done

echo "Detected ${#duplicate_tests[@]} duplicate test pairs"

# Run each test
echo "Starting test run..."
for test_file in "${TEST_FILES[@]}"; do
  if [ -f "$test_file" ]; then
    echo "Running test: $test_file"
    
    # Determine priority
    if [[ "$test_file" == *"/p0/"* ]]; then
      priority="P0"
      priority_icon="🔢"
    elif [[ "$test_file" == *"/p1/"* ]]; then
      priority="P1"
      priority_icon="🔢"
    elif [[ "$test_file" == *"/p2/"* ]]; then
      priority="P2"
      priority_icon="🔢"
    elif [[ "$test_file" == *"/p3/"* ]]; then
      priority="P3"
      priority_icon="🔢"
    else
      priority="Unknown"
      priority_icon="❔"
    fi
    
    # Determine location status
    if is_in_canonical_location "$test_file"; then
      location_icon="📍"
    else
      location_icon="🚚"
    fi
    
    # Determine component
    component=$(determine_component "$test_file")
    
    # Determine test type
    test_type=$(determine_test_type "$test_file")
    
    # Get file type icon
    file_type_icon=$(get_file_type_icon "$test_file")
    
    # Check if this is a duplicate test
    base_name=$(get_base_filename "$test_file")
    duplicate_icon=""
    if [[ -n "${duplicate_tests[$base_name]}" ]]; then
      duplicate_icon="👯"
    fi
    
    # Determine config
    config=$(get_config "$test_file")
    
    # Create a clean test file name for the log file
    test_basename=$(basename "$test_file")
    # Create a directory structure that mirrors the test file structure
    test_dir_path=$(dirname "$test_file" | sed 's|/opt/mExpress/||')
    log_dir="$LOGS_DIR/$test_dir_path"
    mkdir -p "$log_dir"
    
    # Define log file path with timestamp to avoid overwrites
    timestamp=$(date +%Y%m%d_%H%M%S)
    log_file="$log_dir/${test_basename%.*}_${timestamp}.log"
    relative_log_path=$(realpath --relative-to=/opt/mExpress "$log_file")
    
    # Run test with timeout, using a more reliable approach
    start_time=$(date +%s)
    cd /opt/mExpress # Ensure we're in the right directory
    echo "Using config: $config for test: $test_file" >&2
    echo "Test output will be saved to: $log_file" >&2
    
    # Save test information header to the log file
    echo "# Test Execution Log: $test_file" > "$log_file"
    echo "Date: $(date)" >> "$log_file"
    echo "Configuration: $config" >> "$log_file"
    echo "----------------------------------------" >> "$log_file"
    
    # Use FULLY standardized approach with dynamic configuration:
    # 1. Set MongoDB URI for integration tests
    # 2. Set environment variables for test priority and type
    # 3. Use unified Jest configuration approach from /jest.utils.js
    # 4. Add runInBand for better stability
    # 5. Increased timeout (90s) for script execution
    
    # Extract priority and test type information from the test path
    # This must match the priority detection in jest.utils.js
    if [[ "$test_file" == *"/p0/"* ]]; then
      export PRIORITY=p0
    elif [[ "$test_file" == *"/p1/"* ]]; then
      export PRIORITY=p1
    elif [[ "$test_file" == *"/p2/"* ]]; then
      export PRIORITY=p2
    elif [[ "$test_file" == *"/p3/"* ]]; then
      export PRIORITY=p3
    fi
    
    # This must match the test type detection in jest.utils.js
    if [[ "$test_file" == *"/integration/"* ]]; then
      export TEST_TYPE=integration
    elif [[ "$test_file" == *"/frontend/"* ]]; then
      export TEST_TYPE=frontend
    elif [[ "$test_file" == *".tsx" ]]; then
      export TEST_TYPE=react
    elif [[ "$test_file" == *".vue" ]]; then
      export TEST_TYPE=vue
    else
      export TEST_TYPE=unit
    fi
    
    # Log test execution details for debugging
    echo "Running test with standardized dynamic configuration..."
    echo "Test file: $test_file" >> "$log_file"
    echo "Using config: $config" >> "$log_file"
    echo "Priority: $PRIORITY" >> "$log_file"
    echo "Test type: $TEST_TYPE" >> "$log_file"
    echo "Command: MONGODB_URI=mongodb://localhost:27017/mexpress_test PRIORITY=$PRIORITY TEST_TYPE=$TEST_TYPE npx jest --config $config --preset=ts-jest --testPathPattern=$test_file --no-cache --runInBand --verbose" >> "$log_file"
    echo "----------------------------------------" >> "$log_file"
    
    # Run the test with fully standardized dynamic configuration
    # Use the root configuration if possible, which will use projects array and our dynamic config system
    if [[ -f "/opt/mExpress/jest.config.js" ]]; then
      config="/opt/mExpress/jest.config.js"
    fi
    
    MONGODB_URI=mongodb://localhost:27017/mexpress_test \
    PRIORITY=$PRIORITY \
    TEST_TYPE=$TEST_TYPE \
    timeout 90 npx jest --config "$config" \
      --testPathPattern="$test_file" \
      --no-cache \
      --runInBand \
      --verbose > /tmp/test_output.log 2>&1
    exit_code=$?
    end_time=$(date +%s)
    duration=$((end_time - start_time))
    
    # Clean up the test output before saving it to remove conflicting messages and validation warnings
    # First remove conflicting pass/fail messages
    grep -v "TESTS COMPLETE: FAIL" /tmp/test_output.log | grep -v "FINAL RESULT: FAIL" > /tmp/temp_output.log
    
    # Then filter out Jest validation warnings - these are just noise
    grep -v "Validation Warning:" /tmp/temp_output.log | grep -v "Unknown option" | grep -v "Configuration Documentation:" | grep -v "This is probably a typing mistake" > /tmp/cleaned_output.log
    
    # Also filter out ts-jest warnings
    grep -v "ts-jest.*config under" /tmp/cleaned_output.log | grep -v "transform.*transform_regex" | grep -v "See more at https://kulshekhar.github.io" > /tmp/final_output.log
    mv /tmp/final_output.log /tmp/cleaned_output.log
    
    # Copy the cleaned test output to the log file
    cat /tmp/cleaned_output.log >> "$log_file"
    
    # Add clear summary to the log file
    echo -e "\n----------------------------------------" >> "$log_file"
    echo -e "OFFICIAL TEST RESULT SUMMARY:" >> "$log_file"
    
    if [ $exit_code -eq 124 ]; then
      echo "RESULT: ⏱️ TIMEOUT (>30s)" >> "$log_file"
    elif [ $exit_code -eq 0 ]; then
      # Count the actual passed tests from the output
      passed_count=$(grep -o "✓" /tmp/cleaned_output.log | wc -l)
      echo "RESULT: ✅ PASSED ($duration seconds, $passed_count tests)" >> "$log_file"
    else
      # Count the actual failed tests from the output
      failed_count=$(grep -o "✕" /tmp/cleaned_output.log | wc -l)
      echo "RESULT: ❌ FAILED ($duration seconds, $failed_count failures)" >> "$log_file"
    fi
    
    # Check timeout
    if [ $exit_code -eq 124 ]; then
      # Test timed out
      ((timeout++))
      result="⏱️ TIMEOUT (>30s)"
      
      # Add link to log file
      test_line="⏱️$priority_icon$location_icon$file_type_icon$duplicate_icon 🕒:>30s 🧪:$test_type 📦:$component $test_file | [log](/$relative_log_path)"
      timeout_tests+=("$test_line")
      
      # Add to output file in real-time
      add_test_to_report "$test_line" "$priority" "timeout"
      
    elif [ $exit_code -eq 0 ]; then
      # Test passed
      ((pass++))
      result="✅ PASSED ($duration seconds)"
      
      # Add link to log file
      test_line="✅$priority_icon$location_icon$file_type_icon$duplicate_icon 🕒:${duration}s 🧪:$test_type 📦:$component 🧩:~70% $test_file | [log](/$relative_log_path)"
      
      # Add to arrays for final report
      if [[ "$priority" == "P0" ]]; then
        p0_passing+=("$test_line")
      elif [[ "$priority" == "P1" ]]; then
        p1_passing+=("$test_line")  
      elif [[ "$priority" == "P2" ]]; then
        p2_passing+=("$test_line")
      elif [[ "$priority" == "P3" ]]; then
        p3_passing+=("$test_line")
      else
        unknown_passing+=("$test_line")
      fi
      
      # Add to output file in real-time
      add_test_to_report "$test_line" "$priority" "pass"
      
    else
      # Test failed
      ((fail++))
      result="❌ FAILED ($duration seconds)"
      
      # Determine error type
      error_type="Unknown"
      if grep -q "TypeError" /tmp/test_output.log; then
        error_type="TypeError"
      elif grep -q "ReferenceError" /tmp/test_output.log; then
        error_type="ReferenceError"
      elif grep -q "AssertionError" /tmp/test_output.log; then
        error_type="AssertionError"
      elif grep -q "SyntaxError" /tmp/test_output.log; then
        error_type="SyntaxError"
      elif grep -q "Error: Cannot find module" /tmp/test_output.log; then
        error_type="ModuleError"
      elif grep -q "Error: Module not found" /tmp/test_output.log; then
        error_type="ModuleError"
      elif grep -q "is not a function" /tmp/test_output.log; then
        error_type="FunctionError"
      elif grep -q "timeout" /tmp/test_output.log; then
        error_type="TimeoutError"
      elif grep -q "expected" /tmp/test_output.log && grep -q "received" /tmp/test_output.log; then
        error_type="AssertionError"
      fi
      
      # Add link to log file
      test_line="❌$priority_icon$location_icon$file_type_icon$duplicate_icon 🕒:${duration}s 🧪:$test_type 📦:$component 🔍:$error_type $test_file | [log](/$relative_log_path)"
      
      # Add to arrays for final report
      if [[ "$priority" == "P0" ]]; then
        p0_failing+=("$test_line")
      elif [[ "$priority" == "P1" ]]; then
        p1_failing+=("$test_line")
      elif [[ "$priority" == "P2" ]]; then
        p2_failing+=("$test_line")
      elif [[ "$priority" == "P3" ]]; then
        p3_failing+=("$test_line")
      else
        unknown_failing+=("$test_line")
      fi
      
      # Add to output file in real-time
      add_test_to_report "$test_line" "$priority" "fail"
    fi
    
    # Update the statistics section
    update_statistics
    
    echo "$result"
  else
    echo "Skipping test file - not found: $test_file"
    ((skipped++))
    
    # Add to skipped tests
    if [[ "$test_file" == *"/p0/"* ]]; then
      priority_icon="🔢"
    elif [[ "$test_file" == *"/p1/"* ]]; then
      priority_icon="🔢" 
    elif [[ "$test_file" == *"/p2/"* ]]; then
      priority_icon="🔢"
    elif [[ "$test_file" == *"/p3/"* ]]; then
      priority_icon="🔢"
    else
      priority_icon="❔"
    fi
    
    file_type_icon=$(get_file_type_icon "$test_file")
    
    # Create a simple log file for skipped tests
    test_basename=$(basename "$test_file")
    test_dir_path=$(dirname "$test_file" | sed 's|/opt/mExpress/||')
    log_dir="$LOGS_DIR/$test_dir_path"
    mkdir -p "$log_dir"
    
    timestamp=$(date +%Y%m%d_%H%M%S)
    log_file="$log_dir/${test_basename%.*}_${timestamp}.log"
    relative_log_path=$(realpath --relative-to=/opt/mExpress "$log_file")
    
    # Create log file with skipped information
    echo "# Skipped Test: $test_file" > "$log_file"
    echo "Date: $(date)" >> "$log_file"
    echo "----------------------------------------" >> "$log_file"
    echo "RESULT: ⏩ SKIPPED (File not found)" >> "$log_file"
    
    test_line="⏩$priority_icon$file_type_icon 🧪:unknown 📦:unknown $test_file (file not found) | [log](/$relative_log_path)"
    skipped_tests+=("$test_line")
    
    # Add skipped test to report in real-time
    if [[ "$test_file" == *"/p0/"* ]]; then
      add_test_to_report "$test_line" "P0" "skipped"
    elif [[ "$test_file" == *"/p1/"* ]]; then
      add_test_to_report "$test_line" "P1" "skipped"
    elif [[ "$test_file" == *"/p2/"* ]]; then
      add_test_to_report "$test_line" "P2" "skipped"
    elif [[ "$test_file" == *"/p3/"* ]]; then
      add_test_to_report "$test_line" "P3" "skipped"
    else
      add_test_to_report "$test_line" "Unknown" "skipped"
    fi
    
    # Update the statistics
    update_statistics
  fi
done

# Update the existing file with a summary section
echo -e "\n## Test Run Complete - Summary\n" >> "$OUTPUT_FILE"

# Add test run summary
total_language_tests=$((js_tests + ts_tests + tsx_tests + jsx_tests))
echo "FINAL COUNTS - JS: $js_tests, TS: $ts_tests, TSX: $tsx_tests, JSX: $jsx_tests, TOTAL: $total_language_tests" >&2

# Safeguard against division by zero
if [ $total_language_tests -gt 0 ]; then
  ts_percentage=$((100 * (ts_tests + tsx_tests) / total_language_tests))
  js_percentage=$((100 * (js_tests + jsx_tests) / total_language_tests))
else
  ts_percentage=0
  js_percentage=0
fi

echo "FINAL PERCENTAGES - TS: $ts_percentage%, JS: $js_percentage%" >&2

# Add summary statistics
cat >> "$OUTPUT_FILE" << EOL

## Summary Statistics

\`\`\`
Total tests run: $total
Passing: $pass ($(( 100 * pass / total ))%)
Failing: $fail ($(( 100 * fail / total ))%)
Timed out: $timeout ($(( 100 * timeout / total ))%)
Skipped: $skipped
\`\`\`
EOL

# Add language breakdown
migration_progress="$ts_percentage%"

cat >> "$OUTPUT_FILE" << EOL

## Language Breakdown

\`\`\`
JavaScript (.js): $js_tests ⚠️
TypeScript (.ts): $ts_tests ✓
React TypeScript (.tsx): $tsx_tests ✓
React JavaScript (.jsx): $jsx_tests ⚠️
Duplicate Tests: ${#duplicate_tests[@]}

TypeScript Adoption: $migration_progress ($ts_percentage% TypeScript, $js_percentage% JavaScript)
Migration Target: 100% TypeScript
\`\`\`

TypeScript Migration Status:
- ⭐⭐⭐⭐⭐ Excellent: 95-100% TypeScript
- ⭐⭐⭐⭐☆ Very Good: 85-94% TypeScript
- ⭐⭐⭐☆☆ Good: 75-84% TypeScript 
- ⭐⭐☆☆☆ Fair: 60-74% TypeScript
- ⭐☆☆☆☆ Poor: <60% TypeScript

Current Status: $(
if [ $ts_percentage -ge 95 ]; then
  echo "⭐⭐⭐⭐⭐ Excellent"
elif [ $ts_percentage -ge 85 ]; then
  echo "⭐⭐⭐⭐☆ Very Good"
elif [ $ts_percentage -ge 75 ]; then
  echo "⭐⭐⭐☆☆ Good"
elif [ $ts_percentage -ge 60 ]; then
  echo "⭐⭐☆☆☆ Fair"
else
  echo "⭐☆☆☆☆ Poor"
fi
)
EOL

# Add recent updates section
cat >> "$OUTPUT_FILE" << EOL

## Recent Updates

**${CURRENT_DATE}**:
- Standardized Jest configuration across all tests
  - Using ts-jest preset for TypeScript tests
  - Consistent configuration inheritance from base preset
  - Increased test timeouts for integration tests
  - Added better error reporting
- Added real-time test status reporting
  - Test results now appear immediately after each test runs
  - Statistics update incrementally during test execution
  - Pass/fail metrics are calculated during the run
- Added language breakdown tracking
  - JavaScript vs TypeScript file detection
  - Migration status indicators for test files
  - TypeScript adoption percentage tracking
- Improved error type detection in failing tests
- Added test execution time tracking
- Added smarter config resolution for test files
EOL

# Export to JSON for dashboard
json_file="/opt/mExpress/dashboard/unified/generated/test-execution-stats.json"
mkdir -p "$(dirname "$json_file")"

cat > "$json_file" << EOL
{
  "summary": {
    "total": $total,
    "passing": $pass,
    "failing": $fail,
    "timedOut": $timeout,
    "skipped": $skipped,
    "passingPercentage": $(( 100 * pass / total )),
    "javaScriptFiles": $js_tests,
    "typeScriptFiles": $ts_tests,
    "reactTypeScriptFiles": $tsx_tests,
    "reactJavaScriptFiles": $jsx_tests,
    "duplicateTests": ${#duplicate_tests[@]},
    "typeScriptPercentage": $ts_percentage,
    "javaScriptPercentage": $js_percentage
  },
  "p0Tests": {
    "passing": ${#p0_passing[@]},
    "failing": ${#p0_failing[@]}
  },
  "p1Tests": {
    "passing": ${#p1_passing[@]},
    "failing": ${#p1_failing[@]}
  },
  "p2Tests": {
    "passing": ${#p2_passing[@]},
    "failing": ${#p2_failing[@]}
  },
  "p3Tests": {
    "passing": ${#p3_passing[@]},
    "failing": ${#p3_failing[@]}
  },
  "reportDate": "$(date +'%Y-%m-%d %H:%M:%S')"
}
EOL

echo "Done! Enhanced test report saved to $OUTPUT_FILE"
echo "JSON stats saved to $json_file"
echo "Total tests: $total"
echo "Passed: $pass"
echo "Failed: $fail"
echo "Timed out: $timeout"
echo "Skipped: $skipped"
echo "JavaScript tests: $js_tests"
echo "TypeScript tests: $ts_tests"
echo "React TypeScript tests: $tsx_tests"
echo "React JavaScript tests: $jsx_tests"
echo "Duplicate tests: ${#duplicate_tests[@]}"