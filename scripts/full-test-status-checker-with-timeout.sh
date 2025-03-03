#\!/bin/bash

# Full Test Status Checker (Improved Version with Timeout)
# This script checks every test file in the PALL_SORTED_RECAP.md for:
# 1. Pass/Fail status
# 2. Whether it's in the canonical location (/opt/mExpress/tests/)
# 3. Handles hanging tests with a timeout and marks them with ❓

# Output file 
OUTPUT="/opt/mExpress/tests/validation/unified/FULL_TEST_STATUS_REPORT.md"
# Backup of PALL_SORTED_RECAP with current progress
PROGRESS="/opt/mExpress/tests/validation/unified/PALL_SORTED_RECAP_PROGRESS.md"

# Test timeout in seconds
TEST_TIMEOUT=20

# Function to check if test passes with timeout
check_test_status() {
  local test_file=$1
  local test_name=$(basename "$test_file")
  
  # Skip node_modules and dist files
  if [[ "$test_file" == *"node_modules"* || "$test_file" == *"/dist/"* ]]; then
    return 2  # Skip
  fi
  
  # Determine the right config to use
  if [[ "$test_file" == *".tsx" ]]; then
    # React component tests need a different config
    CONFIG="packages/core/jest.config.js"
  else
    # Regular tests
    CONFIG="packages/core/jest.simplified.config.js"
  fi
  
  # Run the test with timeout
  local timeout_cmd="timeout $TEST_TIMEOUT npx jest --config $CONFIG \"$test_file\" > /dev/null 2>&1"
  
  if eval $timeout_cmd; then
    return 0  # Pass
  elif [ $? -eq 124 ]; then
    return 3  # Timeout
  else
    return 1  # Fail
  fi
}

# Function to check if test is in canonical location
is_canonical_location() {
  local test_file=$1
  
  # Tests should be in the central test directory
  if [[ "$test_file" == "/opt/mExpress/tests/"* ]]; then
    return 0  # Canonical
  else
    return 1  # Non-canonical
  fi
}

# Initialize the report
cat << 'HEADER' > "$OUTPUT"
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

## Summary Statistics

HEADER

# Process all tests in PALL_SORTED_RECAP.md
process_all_tests() {
  local section=""
  local total_count=0
  local pass_count=0
  local fail_count=0
  local timeout_count=0
  local skip_count=0
  local canonical_count=0
  local noncanonical_count=0
  local resume_mode=false
  local resume_file=""
  
  # Check if a progress file exists to resume from
  if [ -f "$PROGRESS" ]; then
    echo "Previous run detected. Do you want to resume from where it left off? (y/n)"
    read answer
    if [[ "$answer" == "y" ]]; then
      resume_mode=true
      resume_file="$PROGRESS"
      echo "Resuming from previous run..."
    else
      # Make a backup of the current progress file
      cp "$PROGRESS" "${PROGRESS}.bak.$(date +%Y%m%d%H%M%S)"
      resume_file="/opt/mExpress/tests/validation/unified/PALL_SORTED_RECAP.md"
    fi
  else
    resume_file="/opt/mExpress/tests/validation/unified/PALL_SORTED_RECAP.md"
  fi
  
  # Temporary file to collect section data
  local section_data=$(mktemp)
  
  # Create a copy of the input file to track progress
  if [[ "$resume_mode" == false ]]; then
    cp "/opt/mExpress/tests/validation/unified/PALL_SORTED_RECAP.md" "$PROGRESS"
  fi
  
  # Read the sorted recap file line by line
  while IFS= read -r line; do
    # Check if line starts a new section
    if [[ "$line" == "## "* ]]; then
      # If we were processing a section, add it to the output
      if [ -n "$section" ]; then
        cat "$section_data" >> "$OUTPUT"
        > "$section_data"  # Clear the temp file
      fi
      
      # Set new section name
      section=$(echo "$line" | sed 's/^## //')
      echo "## $section" >> "$OUTPUT"
      echo "" >> "$section_data"
      echo "Processing section: $section" >&2  # Debug output to terminal
    
    # Process test files
    elif [[ "$line" == *"- ❓ "* ]]; then
      test_file=$(echo "$line" | sed 's/^ *- ❓ //')
      
      # Skip if we're in resume mode and this line doesn't have ❓ in the progress file
      if [[ "$resume_mode" == true ]]; then
        grep -q "$test_file" "$PROGRESS" || continue
        grep -q "- ❓ $test_file" "$PROGRESS" || continue
      fi
      
      if [ -f "$test_file" ]; then
        echo "Testing: $test_file" >&2  # Debug output to terminal
        local status_icon=""
        local location_icon=""
        
        # Skip node_modules and dist files immediately
        if [[ "$test_file" == *"node_modules"* || "$test_file" == *"/dist/"* ]]; then
          echo "- ⏩ $test_file" >> "$section_data"
          echo "  Skipped (node_modules/dist)" >&2  # Debug output
          ((skip_count++))
          # Update progress file
          sed -i "s|- ❓ $test_file|- ⏩ $test_file|g" "$PROGRESS"
          continue
        fi
        
        # Check if canonical location
        if [[ "$test_file" == "/opt/mExpress/tests/"* ]]; then
          location_icon="📍"
          ((canonical_count++))
          echo "  Location: Canonical" >&2  # Debug output
        else
          location_icon="🔄"
          ((noncanonical_count++))
          echo "  Location: Non-canonical" >&2  # Debug output
        fi
        
        # Determine the config
        if [[ "$test_file" == *".tsx" ]]; then
          CONFIG="packages/core/jest.config.js"
        else
          CONFIG="packages/core/jest.simplified.config.js"
        fi
        
        echo "  Running test with $TEST_TIMEOUT second timeout..." >&2  # Debug output
        # Run test with timeout
        local timeout_cmd="timeout $TEST_TIMEOUT npx jest --config $CONFIG \"$test_file\" > /dev/null 2>&1"
        if eval $timeout_cmd; then
          status_icon="✅"
          ((pass_count++))
          echo "  Result: PASS" >&2  # Debug output
          # Update progress file
          sed -i "s|- ❓ $test_file|- ✅ $test_file|g" "$PROGRESS"
        elif [ $? -eq 124 ]; then
          status_icon="❓"
          ((timeout_count++))
          echo "  Result: TIMEOUT" >&2  # Debug output
          # Keep the ❓ in the progress file, but add a note
          sed -i "s|- ❓ $test_file|- ❓ $test_file (TIMEOUT)|g" "$PROGRESS"
        else
          status_icon="❌"
          ((fail_count++))
          echo "  Result: FAIL" >&2  # Debug output
          # Update progress file
          sed -i "s|- ❓ $test_file|- ❌ $test_file|g" "$PROGRESS"
        fi
        
        # Add to section data with combined icons
        echo "- $status_icon$location_icon $test_file" >> "$section_data"
        ((total_count++))
        
        # Write progress to the report intermittently
        if (( total_count % 5 == 0 )); then
          echo "Progress: $total_count tests processed" >&2
          cat "$section_data" >> "$OUTPUT"
          > "$section_data"  # Clear the temp file
        fi
      fi
    fi
  done < "$resume_file"
  
  # Add the last section
  if [ -n "$section" ]; then
    cat "$section_data" >> "$OUTPUT"
  fi
  
  # Clean up
  rm -f "$section_data"
  
  # Add summary statistics
  local summary="Total tests: $total_count\n"
  summary+="Passing: $pass_count ($(( 100 * pass_count / total_count ))%)\n"
  summary+="Failing: $fail_count ($(( 100 * fail_count / total_count ))%)\n"
  summary+="Hanging/Timeout: $timeout_count ($(( 100 * timeout_count / total_count ))%)\n"
  summary+="Skipped: $skip_count\n"
  summary+="In canonical location: $canonical_count ($(( 100 * canonical_count / (canonical_count + noncanonical_count) ))%)\n"
  summary+="Need to move: $noncanonical_count ($(( 100 * noncanonical_count / (canonical_count + noncanonical_count) ))%)\n"
  
  # Insert summary after the header
  sed -i "s|## Summary Statistics|## Summary Statistics\n\n\`\`\`\n$summary\`\`\`|" "$OUTPUT"
}

echo "Starting full test status check. This may take a while..."
process_all_tests
echo "Done\! Full report available at $OUTPUT"

# Make the script executable
chmod +x /opt/mExpress/scripts/full-test-status-checker.sh
