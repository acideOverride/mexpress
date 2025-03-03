#\!/bin/bash

# Script to safely remove compiled test files in dist/ directories

echo "Starting removal of compiled test files..."

# Count compiled test files
total_files=$(find /opt/mExpress -path "*/dist/tests/*" -name "*.test.js" | wc -l)
echo "Found $total_files compiled test files to remove"

# Create a backup list 
backup_file="/tmp/removed_dist_tests_$(date +%Y%m%d_%H%M%S).txt"
find /opt/mExpress -path "*/dist/tests/*" -name "*.test.js" > "$backup_file"
echo "Created backup list at $backup_file"

# Check if any files don't have TypeScript counterparts
missing_ts_files=0
echo "Checking for any compiled files without TypeScript counterparts..."
for js_file in $(find /opt/mExpress -path "*/dist/tests/*" -name "*.test.js"); do
  ts_file=$(echo "$js_file" | sed 's/dist\/tests/tests/g; s/\.js$/.ts/g')
  if [ \! -f "$ts_file" ]; then
    missing_ts_files=$((missing_ts_files + 1))
    echo "Note: $js_file has no direct TypeScript counterpart"
  fi
done

if [ $missing_ts_files -gt 0 ]; then
  echo "Found $missing_ts_files compiled files without direct TypeScript counterparts."
  echo "This is normal if source files were moved or deleted."
fi

# Proceed with deletion
echo "Proceeding with deletion of all compiled test files..."
find /opt/mExpress -path "*/dist/tests/*" -name "*.test.js" -delete

# Verify deletion
remaining=$(find /opt/mExpress -path "*/dist/tests/*" -name "*.test.js" | wc -l)
if [ $remaining -eq 0 ]; then
  echo "Success\! All $total_files compiled test files were removed."
  echo "If needed, the list of removed files is available at $backup_file"
else
  echo "Warning: $remaining compiled test files could not be removed."
fi
