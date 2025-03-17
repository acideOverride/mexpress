#!/bin/bash

# test_pre_calculation.sh
#
# This script performs all possible pre-test calculations on the test files, including:
# - Test priority detection
# - Location validation
# - Component area detection
# - Test type detection (unit, integration, e2e)
# - JavaScript/TypeScript file type detection
# - Duplicate test detection
# - All calculations that don't require actually running the tests
#
# Output: Generates a detailed report with all pre-test metrics

# Define directories to search
SEARCH_DIRS=(
  "/opt/mExpress/packages"
  "/opt/mExpress/projects"
  "/opt/mExpress/tests"
)

# Create report directory if it doesn't exist
mkdir -p /opt/mExpress/tests/validation/unified

# Create the report file
REPORT_FILE="/opt/mExpress/tests/validation/unified/PRE_TEST_METRICS.md"
TEST_LIST_FILE="/opt/mExpress/tests/validation/unified/REAL_TESTS_LIST.md"

# Initialize the report with header
cat > "$REPORT_FILE" << 'HEADER'
# Test Pre-Calculation Metrics Report

This report shows all metrics that can be determined before running tests:

Legend:
- 🔢 - Test has priority label (P0-P3)
- ❔ - Test missing priority label
- 📍 - Test is in project-specific location (correct)
- 🚚 - Test needs to be moved from centralized location
- 📦 - Component area (core, auth, api, etc.)
- 🧪 - Test type (unit, integration, e2e)
- 📝 - JavaScript file (.js) - MIGRATION REQUIRED ⚠️
- 📘 - TypeScript file (.ts) - PREFERRED ✓
- 📗 - React TypeScript file (.tsx) - PREFERRED ✓
- 📙 - React JavaScript file (.jsx) - MIGRATION REQUIRED ⚠️
- 👯 - Duplicate test (same name in both JS and TS) - JS VERSION SHOULD BE REMOVED ⚠️

## Tests By Priority
HEADER

# Function to determine if a file is in a priority-based location
is_in_priority_location() {
  local file=$1
  if [[ "$file" == *"/p0/"* || "$file" == *"/p1/"* || "$file" == *"/p2/"* || "$file" == *"/p3/"* ]]; then
    return 0  # True
  else
    return 1  # False
  fi
}

# Function to determine if a file is in project-specific location (canonical)
is_in_canonical_location() {
  local file=$1
  
  # Should be in project-specific test directory and follow priority structure
  if [[ "$file" == *"/packages/"*"/tests/p"[0-3]"/"* || 
        "$file" == *"/projects/"*"/tests/"*"/p"[0-3]"/"* ]]; then
    return 0  # True, in canonical project-specific location
  fi
  
  # Files in centralized "/tests/" directory need to be moved
  if [[ "$file" == "/opt/mExpress/tests/"* ]]; then
    return 1  # False, in centralized location
  fi
  
  # Files in source directories need to be moved
  if [[ "$file" == *"/src/"*"/__tests__/"* || "$file" == *"/src/"*"/test/"* ]]; then
    return 1  # False, in source directory
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

# Function to determine file type and get appropriate icon
get_file_type_icon() {
  local file=$1
  
  if [[ "$file" == *".js" ]]; then
    echo "📝"
  elif [[ "$file" == *".ts" && "$file" != *".tsx" ]]; then
    echo "📘"
  elif [[ "$file" == *".tsx" ]]; then
    echo "📗"
  elif [[ "$file" == *".jsx" ]]; then
    echo "📙"
  else
    echo ""
  fi
}

# Function to detect duplicates by removing extension
get_base_filename() {
  local file=$1
  # Remove extension and keep path
  echo "${file%.*.*}"
}

# Function to check if a file is a real test file
is_real_test_file() {
  local file=$1
  
  # Skip coverage reports
  if [[ "$file" == *"/coverage/"* ]]; then
    return 1  # False
  fi
  
  # Skip configuration files
  if [[ "$file" == *".config.js" || "$file" == *"setup.ts" || "$file" == *"setup.js" ]]; then
    return 1  # False
  fi
  
  # Skip type definitions
  if [[ "$file" == *".d.ts" ]]; then
    return 1  # False
  fi
  
  # Skip mocks directory
  if [[ "$file" == *"/__mocks__/"* || "$file" == *"/mocks/"* ]]; then
    return 1  # False
  fi
  
  # Skip utility files and test runners
  if [[ "$file" == *"test-utils"* || "$file" == *"test-runner"* || "$file" == *"tester.ts"* ]]; then
    return 1  # False
  fi
  
  # Check if it's a test file (by extension or name)
  if [[ "$file" == *".test."* || "$file" == *".spec."* || 
        "$file" == *"Test."* || "$file" == *"/tests/"*"test."* ]]; then
    # It's a real test file
    return 0  # True
  fi
  
  # Not a real test file
  return 1  # False
}

# Find all potential test files
find_test_files() {
  # Find by standard test extensions
  find "${SEARCH_DIRS[@]}" -type f -regextype posix-extended -regex ".*\.(spec|test)\.(js|jsx|ts|tsx)$" | grep -v "node_modules" | grep -v "dist"
  
  # Find files with Test in their name
  find "${SEARCH_DIRS[@]}" -type f -name "*Test*" -name "*.js" -o -name "*Test*" -name "*.jsx" -o -name "*Test*" -name "*.ts" -o -name "*Test*" -name "*.tsx" | grep -v "node_modules" | grep -v "dist"
  
  # Find files in test directories with test-like names
  find "${SEARCH_DIRS[@]}" -type d -path "*/tests/*" -o -path "*/test/*" | grep -v "node_modules" | grep -v "dist" | xargs -I{} find {} -type f \( -name "*test*.js" -o -name "*test*.jsx" -o -name "*test*.ts" -o -name "*test*.tsx" \) | grep -v "node_modules" | grep -v "dist"
}

# Initialize counters
total_tests=0
prioritized_tests=0
canonical_location=0
js_tests=0
ts_tests=0
tsx_tests=0
jsx_tests=0
duplicates=0

# Initialize component and type counters
declare -A component_counts
declare -A type_counts

# Arrays to store tests by priority
p0_tests=()
p1_tests=()
p2_tests=()
p3_tests=()
unknown_priority_tests=()

# Map to detect duplicate tests (same name with different extensions)
declare -A test_map
declare -A duplicate_tests

# Get all unique test files
all_tests=$(find_test_files | sort | uniq)

# Process each file
while IFS= read -r file; do
  if [[ -n "$file" ]]; then
    # Check if it's a real test file
    if is_real_test_file "$file"; then
      ((total_tests++))
      
      # Track file type counts
      if [[ "$file" == *".js" ]]; then
        js_tests=$((js_tests + 1))
      elif [[ "$file" == *".ts" && "$file" != *".tsx" ]]; then
        ts_tests=$((ts_tests + 1))
      elif [[ "$file" == *".tsx" ]]; then
        tsx_tests=$((tsx_tests + 1))
      elif [[ "$file" == *".jsx" ]]; then
        jsx_tests=$((jsx_tests + 1))
      fi
      
      # Check for duplicates
      base_name=$(get_base_filename "$file")
      
      # If this base name already exists, it's a duplicate
      if [[ -n "${test_map[$base_name]}" ]]; then
        duplicate_tests[$base_name]=1
        ((duplicates++))
      fi
      
      # Add this file to the map
      test_map[$base_name]="${test_map[$base_name]} $file"
      
      # Determine priority status
      if [[ "$file" == *"/p0/"* ]]; then
        priority="P0"
        priority_status="🔢"
        ((prioritized_tests++))
      elif [[ "$file" == *"/p1/"* ]]; then
        priority="P1"
        priority_status="🔢"
        ((prioritized_tests++))
      elif [[ "$file" == *"/p2/"* ]]; then
        priority="P2"
        priority_status="🔢"
        ((prioritized_tests++))
      elif [[ "$file" == *"/p3/"* ]]; then
        priority="P3"
        priority_status="🔢"
        ((prioritized_tests++))
      else
        priority="Unknown"
        priority_status="❔"
      fi
      
      # Determine location status
      if is_in_canonical_location "$file"; then
        location_status="📍"
        ((canonical_location++))
      else
        location_status="🚚"
      fi
      
      # Determine component and test type
      component=$(determine_component "$file")
      test_type=$(determine_test_type "$file")
      
      # Update component and type counters
      ((component_counts["$component"]++))
      ((type_counts["$test_type"]++))
      
      # Get file type icon
      file_type_icon=$(get_file_type_icon "$file")
      
      # Check if this is a duplicate test
      duplicate_icon=""
      if [[ -n "${duplicate_tests[$base_name]}" ]]; then
        duplicate_icon="👯"
      fi
      
      # Create formatted line for this test with enhanced icons
      test_line="$priority_status$location_status $file_type_icon$duplicate_icon 📦:$component 🧪:$test_type $file"
      
      # Add to appropriate priority array
      if [[ "$priority" == "P0" ]]; then
        p0_tests+=("$test_line")
      elif [[ "$priority" == "P1" ]]; then
        p1_tests+=("$test_line")
      elif [[ "$priority" == "P2" ]]; then
        p2_tests+=("$test_line")
      elif [[ "$priority" == "P3" ]]; then
        p3_tests+=("$test_line")
      else
        unknown_priority_tests+=("$test_line")
      fi
    fi
  fi
done <<< "$all_tests"

# Write tests to report, sorted by priority
# P0 tests first
if [ ${#p0_tests[@]} -gt 0 ]; then
  echo -e "\n### P0 (Critical) Tests\n" >> "$REPORT_FILE"
  for test in "${p0_tests[@]}"; do
    echo "$test" >> "$REPORT_FILE"
  done
fi

# P1 tests
if [ ${#p1_tests[@]} -gt 0 ]; then
  echo -e "\n### P1 (High Priority) Tests\n" >> "$REPORT_FILE"
  for test in "${p1_tests[@]}"; do
    echo "$test" >> "$REPORT_FILE"
  done
fi

# P2 tests
if [ ${#p2_tests[@]} -gt 0 ]; then
  echo -e "\n### P2 (Medium Priority) Tests\n" >> "$REPORT_FILE"
  for test in "${p2_tests[@]}"; do
    echo "$test" >> "$REPORT_FILE"
  done
fi

# P3 tests
if [ ${#p3_tests[@]} -gt 0 ]; then
  echo -e "\n### P3 (Low Priority) Tests\n" >> "$REPORT_FILE"
  for test in "${p3_tests[@]}"; do
    echo "$test" >> "$REPORT_FILE"
  done
fi

# Unknown priority tests
if [ ${#unknown_priority_tests[@]} -gt 0 ]; then
  echo -e "\n### Unknown Priority Tests\n" >> "$REPORT_FILE"
  for test in "${unknown_priority_tests[@]}"; do
    echo "$test" >> "$REPORT_FILE"
  done
fi

# List duplicate test files
echo -e "\n## Duplicate Tests (Same Test in JS and TS)\n" >> "$REPORT_FILE"
for base_name in "${!duplicate_tests[@]}"; do
  echo "👯 Duplicate Test: ${base_name}" >> "$REPORT_FILE"
  for dup_file in ${test_map[$base_name]}; do
    if [[ "$dup_file" == *".js" ]]; then
      echo "  📝 JavaScript: $dup_file ⚠️ SHOULD BE REMOVED AFTER VERIFYING TS VERSION" >> "$REPORT_FILE"
    elif [[ "$dup_file" == *".ts" ]]; then
      echo "  📘 TypeScript: $dup_file ✓ KEEP THIS VERSION" >> "$REPORT_FILE"
    elif [[ "$dup_file" == *".tsx" ]]; then
      echo "  📗 React TypeScript: $dup_file ✓ KEEP THIS VERSION" >> "$REPORT_FILE"
    elif [[ "$dup_file" == *".jsx" ]]; then
      echo "  📙 React JavaScript: $dup_file ⚠️ SHOULD BE REMOVED AFTER VERIFYING TSX VERSION" >> "$REPORT_FILE"
    fi
  done
  echo "" >> "$REPORT_FILE"
done

# Create arrays for JavaScript tests by priority
js_p0_tests=()
js_p1_tests=()
js_p2_tests=()
js_p3_tests=()

# Identify JavaScript tests for migration
for file in $(find "${SEARCH_DIRS[@]}" -type f -name "*.js" -o -name "*.jsx" | grep -v "node_modules" | grep -v "dist"); do
  if is_real_test_file "$file"; then
    base_name=$(get_base_filename "$file")
    
    # Skip if this is a duplicate test (already listed in duplicates section)
    if [[ -n "${duplicate_tests[$base_name]}" ]]; then
      continue
    fi
    
    # Add to the appropriate priority array
    if [[ "$file" == *"/p0/"* ]]; then
      js_p0_tests+=("$file")
    elif [[ "$file" == *"/p1/"* ]]; then
      js_p1_tests+=("$file")
    elif [[ "$file" == *"/p2/"* ]]; then
      js_p2_tests+=("$file")
    elif [[ "$file" == *"/p3/"* ]]; then
      js_p3_tests+=("$file")
    fi
  fi
done

# Create TypeScript migration section
echo -e "\n## TypeScript Migration Candidates\n" >> "$REPORT_FILE"
echo "According to TS_CODE_STANDARDS.md, all JavaScript tests should be migrated to TypeScript." >> "$REPORT_FILE"
echo "The following JavaScript tests need to be migrated, prioritized by test level:" >> "$REPORT_FILE"

# Output migration candidates by priority
if [ ${#js_p0_tests[@]} -gt 0 ]; then
  echo -e "\n### P0 (Critical) Tests to Migrate - HIGHEST PRIORITY\n" >> "$REPORT_FILE"
  for test in "${js_p0_tests[@]}"; do
    if [[ "$test" == *".js" ]]; then
      echo "  📝 JavaScript: $test" >> "$REPORT_FILE"
    elif [[ "$test" == *".jsx" ]]; then
      echo "  📙 React JavaScript: $test" >> "$REPORT_FILE"
    fi
  done
  echo "" >> "$REPORT_FILE"
fi

if [ ${#js_p1_tests[@]} -gt 0 ]; then
  echo -e "\n### P1 (High Priority) Tests to Migrate\n" >> "$REPORT_FILE"
  for test in "${js_p1_tests[@]}"; do
    if [[ "$test" == *".js" ]]; then
      echo "  📝 JavaScript: $test" >> "$REPORT_FILE"
    elif [[ "$test" == *".jsx" ]]; then
      echo "  📙 React JavaScript: $test" >> "$REPORT_FILE"
    fi
  done
  echo "" >> "$REPORT_FILE"
fi

if [ ${#js_p2_tests[@]} -gt 0 ]; then
  echo -e "\n### P2 (Medium Priority) Tests to Migrate\n" >> "$REPORT_FILE"
  for test in "${js_p2_tests[@]}"; do
    if [[ "$test" == *".js" ]]; then
      echo "  📝 JavaScript: $test" >> "$REPORT_FILE"
    elif [[ "$test" == *".jsx" ]]; then
      echo "  📙 React JavaScript: $test" >> "$REPORT_FILE"
    fi
  done
  echo "" >> "$REPORT_FILE"
fi

if [ ${#js_p3_tests[@]} -gt 0 ]; then
  echo -e "\n### P3 (Low Priority) Tests to Migrate\n" >> "$REPORT_FILE"
  for test in "${js_p3_tests[@]}"; do
    if [[ "$test" == *".js" ]]; then
      echo "  📝 JavaScript: $test" >> "$REPORT_FILE"
    elif [[ "$test" == *".jsx" ]]; then
      echo "  📙 React JavaScript: $test" >> "$REPORT_FILE"
    fi
  done
  echo "" >> "$REPORT_FILE"
fi

# Add summary statistics
cat >> "$REPORT_FILE" << EOL

## Summary Statistics

- Total real test files found: $total_tests
- Tests with known priority (P0-P3): $prioritized_tests ($(( 100 * prioritized_tests / total_tests ))%)
- Tests with unknown priority: $(( total_tests - prioritized_tests )) ($(( 100 * (total_tests - prioritized_tests) / total_tests ))%)
- Tests in canonical location: $canonical_location ($(( 100 * canonical_location / total_tests ))%)
- Tests needing relocation: $(( total_tests - canonical_location )) ($(( 100 * (total_tests - canonical_location) / total_tests ))%)
- Duplicate tests detected: $duplicates
EOL

# Add component breakdown
echo -e "\n## Component Breakdown\n" >> "$REPORT_FILE"
echo '```' >> "$REPORT_FILE"
for component in "${!component_counts[@]}"; do
  count=${component_counts[$component]}
  if [ $total_tests -ne 0 ]; then
    percentage=$(( 100 * count / total_tests ))
    echo "$component: $count ($percentage%)" >> "$REPORT_FILE"
  else
    echo "$component: $count (0%)" >> "$REPORT_FILE"
  fi
done
echo '```' >> "$REPORT_FILE"

# Add test type breakdown
echo -e "\n## Test Type Breakdown\n" >> "$REPORT_FILE"
echo '```' >> "$REPORT_FILE"
for type in "${!type_counts[@]}"; do
  count=${type_counts[$type]}
  if [ $total_tests -ne 0 ]; then
    percentage=$(( 100 * count / total_tests ))
    echo "$type: $count ($percentage%)" >> "$REPORT_FILE"
  else
    echo "$type: $count (0%)" >> "$REPORT_FILE"
  fi
done
echo '```' >> "$REPORT_FILE"

# Add language breakdown
total_language_tests=$((js_tests + ts_tests + tsx_tests + jsx_tests))
echo "DEBUG: Final counts - JS: $js_tests, TS: $ts_tests, TSX: $tsx_tests, JSX: $jsx_tests, TOTAL: $total_language_tests" >&2

# Safeguard against division by zero
if [ $total_language_tests -gt 0 ]; then
  ts_percentage=$((100 * (ts_tests + tsx_tests) / total_language_tests))
  js_percentage=$((100 * (js_tests + jsx_tests) / total_language_tests))
else
  ts_percentage=0
  js_percentage=0
fi

migration_progress="$ts_percentage%"
echo "DEBUG: Final percentages - TS: $ts_percentage%, JS: $js_percentage%" >&2

cat >> "$REPORT_FILE" << EOL

## Language Breakdown

\`\`\`
JavaScript (.js): $js_tests ⚠️
TypeScript (.ts): $ts_tests ✓
React TypeScript (.tsx): $tsx_tests ✓
React JavaScript (.jsx): $jsx_tests ⚠️
Duplicate Tests: $duplicates

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

Migration Priority:
1. Remove duplicate JavaScript tests with TypeScript equivalents: $duplicates tests
2. Migrate P0 JavaScript tests to TypeScript: ${#js_p0_tests[@]} tests
3. Migrate P1 JavaScript tests to TypeScript: ${#js_p1_tests[@]} tests
4. Migrate P2 JavaScript tests to TypeScript: ${#js_p2_tests[@]} tests
5. Migrate P3 JavaScript tests to TypeScript: ${#js_p3_tests[@]} tests
EOL

# Export to JSON for dashboard
json_file="/opt/mExpress/dashboard/unified/generated/test-pre-metrics.json"
mkdir -p "$(dirname "$json_file")"

cat > "$json_file" << EOL
{
  "summary": {
    "total": $total_tests,
    "prioritized": $prioritized_tests,
    "unprioritized": $(( total_tests - prioritized_tests )),
    "canonical": $canonical_location,
    "nonCanonical": $(( total_tests - canonical_location )),
    "javaScriptFiles": $js_tests,
    "typeScriptFiles": $ts_tests,
    "reactTypeScriptFiles": $tsx_tests,
    "reactJavaScriptFiles": $jsx_tests,
    "duplicateTests": $duplicates,
    "typeScriptPercentage": $ts_percentage,
    "javaScriptPercentage": $js_percentage
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
  "reportDate": "$(date +'%Y-%m-%d %H:%M:%S')"
}
EOL

# Also generate a simplified REAL_TESTS_LIST.md
cat > "$TEST_LIST_FILE" << 'HEADER'
# Complete List of Real Test Files

This report lists all actual test files found in the codebase:
- 🔢 - Test with known priority (P0-P3)
- ❔ - Test with unknown priority 
- 📍 - Test is in project-specific test directory (correct location)
- 🚚 - Test needs to be moved from centralized location to project-specific location
- 📦 - Component area (core, auth, api, etc.)
- 🧪 - Test type (unit, integration, e2e)
- 📝 - JavaScript file (.js) - MIGRATION REQUIRED ⚠️
- 📘 - TypeScript file (.ts) - PREFERRED ✓
- 📗 - React TypeScript file (.tsx) - PREFERRED ✓
- 📙 - React JavaScript file (.jsx) - MIGRATION REQUIRED ⚠️
- 👯 - Duplicate test (same name in both JS and TS) - JS VERSION SHOULD BE REMOVED ⚠️

## Tests By Priority
Tests are sorted by priority (P0-P3) to help guide migration efforts
HEADER

# P0 tests first for REAL_TESTS_LIST.md
if [ ${#p0_tests[@]} -gt 0 ]; then
  echo -e "\n### P0 (Critical) Tests\n" >> "$TEST_LIST_FILE"
  for test in "${p0_tests[@]}"; do
    echo "$test" >> "$TEST_LIST_FILE"
  done
fi

# P1 tests
if [ ${#p1_tests[@]} -gt 0 ]; then
  echo -e "\n### P1 (High Priority) Tests\n" >> "$TEST_LIST_FILE"
  for test in "${p1_tests[@]}"; do
    echo "$test" >> "$TEST_LIST_FILE"
  done
fi

# P2 tests
if [ ${#p2_tests[@]} -gt 0 ]; then
  echo -e "\n### P2 (Medium Priority) Tests\n" >> "$TEST_LIST_FILE"
  for test in "${p2_tests[@]}"; do
    echo "$test" >> "$TEST_LIST_FILE"
  done
fi

# P3 tests
if [ ${#p3_tests[@]} -gt 0 ]; then
  echo -e "\n### P3 (Low Priority) Tests\n" >> "$TEST_LIST_FILE"
  for test in "${p3_tests[@]}"; do
    echo "$test" >> "$TEST_LIST_FILE"
  done
fi

# Add summary statistics to REAL_TESTS_LIST.md
cat >> "$TEST_LIST_FILE" << EOL

## Summary Statistics

- Total real test files found: $total_tests
- Tests with known priority (P0-P3): $prioritized_tests ($(( 100 * prioritized_tests / total_tests ))%)
- Tests with unknown priority: $(( total_tests - prioritized_tests )) ($(( 100 * (total_tests - prioritized_tests) / total_tests ))%)
- Tests in canonical location: $canonical_location ($(( 100 * canonical_location / total_tests ))%)
- Tests needing relocation: $(( total_tests - canonical_location )) ($(( 100 * (total_tests - canonical_location) / total_tests ))%)

## Component Breakdown

\`\`\`
EOL

# Add component breakdown to REAL_TESTS_LIST.md
for component in "${!component_counts[@]}"; do
  count=${component_counts[$component]}
  if [ $total_tests -ne 0 ]; then
    percentage=$(( 100 * count / total_tests ))
    echo "$component: $count ($percentage%)" >> "$TEST_LIST_FILE"
  else
    echo "$component: $count (0%)" >> "$TEST_LIST_FILE"
  fi
done

cat >> "$TEST_LIST_FILE" << EOL
\`\`\`

## Test Type Breakdown

\`\`\`
EOL

# Add test type breakdown to REAL_TESTS_LIST.md
for type in "${!type_counts[@]}"; do
  count=${type_counts[$type]}
  if [ $total_tests -ne 0 ]; then
    percentage=$(( 100 * count / total_tests ))
    echo "$type: $count ($percentage%)" >> "$TEST_LIST_FILE"
  else
    echo "$type: $count (0%)" >> "$TEST_LIST_FILE"
  fi
done

echo "\`\`\`" >> "$TEST_LIST_FILE"

echo "Pre-test metrics report generated at $REPORT_FILE"
echo "Test list generated at $TEST_LIST_FILE"
echo "JSON stats saved to $json_file"
echo "Total real test files found: $total_tests"
echo "Tests with known priority (P0-P3): $prioritized_tests ($(( 100 * prioritized_tests / total_tests ))%)"
echo "Tests in canonical location: $canonical_location ($(( 100 * canonical_location / total_tests ))%)"
echo "TypeScript adoption: $ts_percentage%"
echo "Duplicate tests: $duplicates"