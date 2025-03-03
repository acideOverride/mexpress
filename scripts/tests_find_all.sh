#\!/bin/bash

# Script to find all test files in the mExpress project
# Generates a report in the exact same format as PALL_MASTER_RECAP.md
# Saves to /opt/mExpress/tests/validation/unified/FULL_TEST_STATUS_REPORT_NEW.md

# Define directories to search
SEARCH_DIRS=(
  "/opt/mExpress/packages"
  "/opt/mExpress/projects" 
  "/opt/mExpress/tests"
)

# Create report directory if it doesn't exist
mkdir -p /opt/mExpress/tests/validation/unified

# Create the report file
REPORT_FILE="/opt/mExpress/tests/validation/unified/FULL_TEST_STATUS_REPORT.md"

# Initialize the report with header
cat > "$REPORT_FILE" << 'HEADER'
# All Tests Recap

List of all test files found in the codebase:

HEADER

# Function to find test files
find_tests() {
  local dir=$1
  local test_pattern=".*\.(spec|test)\.(js|jsx|ts|tsx)$"
  find "$dir" -type f -regextype posix-extended -regex "$test_pattern" | grep -v "node_modules" | sort
}

# Get all test files
for dir in "${SEARCH_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    test_files=$(find_tests "$dir")
    
    # Add each file to the report with ❓ prefix
    while IFS= read -r file; do
      if [[ -n "$file" ]]; then
        echo "- ❓ $file" >> "$REPORT_FILE"
      fi
    done <<< "$test_files"
  fi
done

echo "Report generated at $REPORT_FILE"
