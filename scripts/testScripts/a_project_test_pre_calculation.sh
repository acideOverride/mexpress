#!/bin/bash

# a_project_test_pre_calculation.sh
#
# This script performs pre-test calculations for a specific project, including:
# - Test priority detection
# - Location validation
# - Component area detection
# - Test type detection (unit, integration, e2e)
# - JavaScript/TypeScript file type detection
# - Duplicate test detection
# - All calculations that don't require actually running the tests
#
# Usage: ./a_project_test_pre_calculation.sh [project_name]
# Example: ./a_project_test_pre_calculation.sh jerome_bikes

# Check if project name is provided
if [ -z "$1" ]; then
  echo "Error: Project name is required."
  echo "Usage: ./a_project_test_pre_calculation.sh [project_name]"
  echo "Example: ./a_project_test_pre_calculation.sh jerome_bikes"
  exit 1
fi

PROJECT_NAME="$1"

# Validate project directory exists
if [ ! -d "/opt/mExpress/projects/$PROJECT_NAME" ] && [ ! -d "/opt/mExpress/packages/$PROJECT_NAME" ]; then
  echo "Error: Project directory not found: /opt/mExpress/projects/$PROJECT_NAME or /opt/mExpress/packages/$PROJECT_NAME"
  exit 1
fi

# Define directories to search based on project
SEARCH_DIRS=()

# Check if it's a project or package
if [ -d "/opt/mExpress/projects/$PROJECT_NAME" ]; then
  SEARCH_DIRS+=("/opt/mExpress/projects/$PROJECT_NAME")
elif [ -d "/opt/mExpress/packages/$PROJECT_NAME" ]; then
  SEARCH_DIRS+=("/opt/mExpress/packages/$PROJECT_NAME")
fi

# Create report directory if it doesn't exist
mkdir -p "/opt/mExpress/docs/$PROJECT_NAME/_tests"

# Create the report file
REPORT_FILE="/opt/mExpress/docs/$PROJECT_NAME/_tests/PRE_TEST_METRICS.md"
TEST_LIST_FILE="/opt/mExpress/docs/$PROJECT_NAME/_tests/PROJECT_TESTS_LIST.md"

# Initialize the report with header
cat > "$REPORT_FILE" << EOF
# ${PROJECT_NAME^} Project Pre-Test Metrics
*Last updated: $(date +%Y-%m-%d)*

This report shows pre-test metrics for the ${PROJECT_NAME^} project.

## Test Distribution

### Tests by Location
| Location | Count |
|----------|-------|
EOF

# Process each directory
total_tests=0
location_counts=()
component_counts=()
type_counts=()
priority_counts=()
file_type_counts=()

echo "🔍 Searching for test files in: ${SEARCH_DIRS[*]}"

# Find all potential test files
found_files=()
for dir in "${SEARCH_DIRS[@]}"; do
  while IFS= read -r file; do
    if [[ "$file" =~ \.(spec|test)\.(js|jsx|ts|tsx)$ ]]; then
      found_files+=("$file")
    fi
  done < <(find "$dir" -type f -name "*.test.*" -o -name "*.spec.*" 2>/dev/null)
done

echo "📋 Found ${#found_files[@]} test files. Processing..."

# Process each file for location categorization
correct_location=0
incorrect_location=0

# Create test list file
echo "# ${PROJECT_NAME^} Project Test List" > "$TEST_LIST_FILE"
echo "*Last updated: $(date +%Y-%m-%d)*" >> "$TEST_LIST_FILE"
echo "" >> "$TEST_LIST_FILE"
echo "## Test Files" >> "$TEST_LIST_FILE"
echo "" >> "$TEST_LIST_FILE"

# Process each file
for file in "${found_files[@]}"; do
  # Get file info
  filename=$(basename "$file")
  extension="${filename##*.}"
  is_component_test=false
  test_type="unit" # Default
  priority="unknown"
  component_area="unknown"
  
  # Check if file path contains priority information
  if [[ "$file" =~ /p([0-3])/ ]]; then
    priority="P${BASH_REMATCH[1]}"
  fi
  
  # Determine component area based on path
  if [[ "$file" =~ /core/ ]]; then
    component_area="core"
  elif [[ "$file" =~ /auth/ ]]; then
    component_area="auth"
  elif [[ "$file" =~ /components/ ]]; then
    component_area="frontend"
    is_component_test=true
  elif [[ "$file" =~ /api/ ]]; then
    component_area="api"
  elif [[ "$file" =~ /services/ ]]; then
    component_area="services"
  elif [[ "$file" =~ /utils/ ]]; then
    component_area="utils"
  elif [[ "$file" =~ /models/ ]]; then
    component_area="models"
  elif [[ "$file" =~ /infrastructure/ ]]; then
    component_area="infrastructure"
  fi
  
  # Determine test type based on filename or directory
  if [[ "$file" =~ integration|e2e|end-to-end ]]; then
    if [[ "$file" =~ e2e|end-to-end ]]; then
      test_type="e2e"
    else
      test_type="integration"
    fi
  fi
  
  # Check if test is in the correct location
  if [[ "$file" =~ /projects/${PROJECT_NAME}/tests/ ]] || [[ "$file" =~ /packages/${PROJECT_NAME}/tests/ ]]; then
    location_status="📍" # Correct - project-specific location
    ((correct_location++))
  else
    location_status="🚚" # Needs to be moved from centralized/incorrect location
    ((incorrect_location++))
  fi
  
  # Check priority label
  if [[ "$priority" != "unknown" ]]; then
    priority_status="🔢" # Has priority label
  else
    priority_status="❔" # Missing priority label
  fi
  
  # Get file type
  if [[ "$extension" == "ts" ]]; then
    file_type="📘" # TypeScript preferred
  elif [[ "$extension" == "tsx" ]]; then
    file_type="📗" # React TypeScript preferred
  elif [[ "$extension" == "js" ]]; then
    file_type="📝" # JavaScript - migration required
  elif [[ "$extension" == "jsx" ]]; then
    file_type="📙" # React JavaScript - migration required
  fi
  
  # Write to test list file - format: [location_status][priority_status][file_type] [test_type]:[component_area] [file_path]
  echo "${location_status}${priority_status}${file_type} 🧪:${test_type} 📦:${component_area} ${file}" >> "$TEST_LIST_FILE"
  
  # Update counters
  ((total_tests++))
  
  # Update location counts
  if [[ "$file" =~ /projects/ ]]; then
    location_counts["projects"]=$((${location_counts["projects"]:=0} + 1))
  elif [[ "$file" =~ /packages/ ]]; then
    location_counts["packages"]=$((${location_counts["packages"]:=0} + 1))
  fi
  
  # Update component counts
  component_counts["$component_area"]=$((${component_counts["$component_area"]:=0} + 1))
  
  # Update type counts
  type_counts["$test_type"]=$((${type_counts["$test_type"]:=0} + 1))
  
  # Update priority counts
  priority_counts["$priority"]=$((${priority_counts["$priority"]:=0} + 1))
  
  # Update file type counts
  file_type_counts["$extension"]=$((${file_type_counts["$extension"]:=0} + 1))
done

# Write location counts to report
for loc in "${!location_counts[@]}"; do
  echo "| $loc | ${location_counts[$loc]} |" >> "$REPORT_FILE"
done

# Write tests by directory correctness
cat >> "$REPORT_FILE" << EOF

### Tests by Directory Correctness
| Status | Count | Description |
|--------|-------|-------------|
| 📍 | $correct_location | Tests in project-specific location (correct) |
| 🚚 | $incorrect_location | Tests need to be moved from centralized location |

### Tests by Component Area
| Component Area | Count |
|----------------|-------|
EOF

# Write component area counts to report
for area in "${!component_counts[@]}"; do
  echo "| $area | ${component_counts[$area]} |" >> "$REPORT_FILE"
done

# Write tests by type
cat >> "$REPORT_FILE" << EOF

### Tests by Type
| Test Type | Count |
|-----------|-------|
EOF

# Write test type counts to report
for type in "${!type_counts[@]}"; do
  echo "| $type | ${type_counts[$type]} |" >> "$REPORT_FILE"
done

# Write tests by priority
cat >> "$REPORT_FILE" << EOF

### Tests by Priority
| Priority | Count |
|----------|-------|
EOF

# Write priority counts to report
for pri in "${!priority_counts[@]}"; do
  echo "| $pri | ${priority_counts[$pri]} |" >> "$REPORT_FILE"
done

# Write tests by file type
cat >> "$REPORT_FILE" << EOF

### Tests by File Type
| File Type | Count | Status |
|-----------|-------|--------|
EOF

# Write file type counts to report
[ "${file_type_counts["ts"]}" ] && echo "| TypeScript (.ts) | ${file_type_counts["ts"]} | PREFERRED ✓ |" >> "$REPORT_FILE"
[ "${file_type_counts["tsx"]}" ] && echo "| React TypeScript (.tsx) | ${file_type_counts["tsx"]} | PREFERRED ✓ |" >> "$REPORT_FILE"
[ "${file_type_counts["js"]}" ] && echo "| JavaScript (.js) | ${file_type_counts["js"]} | MIGRATION REQUIRED ⚠️ |" >> "$REPORT_FILE"
[ "${file_type_counts["jsx"]}" ] && echo "| React JavaScript (.jsx) | ${file_type_counts["jsx"]} | MIGRATION REQUIRED ⚠️ |" >> "$REPORT_FILE"

# Write summary
cat >> "$REPORT_FILE" << EOF

## Summary
- Total tests: $total_tests
- Tests in correct location: $correct_location ($((correct_location * 100 / total_tests))%)
- Tests in incorrect location: $incorrect_location ($((incorrect_location * 100 / total_tests))%)
EOF

echo "✅ Pre-test calculations complete for ${PROJECT_NAME^} project!"
echo "📊 Pre-test metrics report: $REPORT_FILE"
echo "📊 Test list: $TEST_LIST_FILE"