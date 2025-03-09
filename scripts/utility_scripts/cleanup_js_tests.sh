#!/bin/bash

# This script identifies JavaScript test files that have TypeScript equivalents and removes them
# A file is considered to have a TypeScript equivalent if a corresponding .ts or .tsx file exists 
# with the same base name in the same directory

# Find all JavaScript test files
echo "Finding JavaScript test files..."
JS_TEST_FILES=$(find /opt/mExpress -name "*.test.js" -type f | sort)

REMOVED_COUNT=0
TOTAL_COUNT=0

for js_file in $JS_TEST_FILES; do
  TOTAL_COUNT=$((TOTAL_COUNT + 1))
  
  # Get the base directory and filename without extension
  dir=$(dirname "$js_file")
  base_name=$(basename "$js_file" .test.js)
  
  # Check if a TypeScript equivalent exists
  if [ -f "$dir/$base_name.test.ts" ] || [ -f "$dir/$base_name.test.tsx" ]; then
    echo "✅ Removing $js_file (has TypeScript equivalent)"
    rm "$js_file"
    REMOVED_COUNT=$((REMOVED_COUNT + 1))
  else
    echo "⏩ Keeping $js_file (no TypeScript equivalent found)"
  fi
done

echo ""
echo "Summary:"
echo "Total JavaScript test files found: $TOTAL_COUNT"
echo "JavaScript test files removed: $REMOVED_COUNT"
echo "JavaScript test files retained: $((TOTAL_COUNT - REMOVED_COUNT))"