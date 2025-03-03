#\!/bin/bash

# Test migration script - improved version
# Migrates test files from their current location to the canonical tests directory
# Usage: ./migration.sh <source_test_file> [<target_directory>]

# Check if source file was provided
if [ $# -lt 1 ]; then
  echo "Usage: ./migration.sh <source_test_file> [<target_directory>]"
  echo "Example: ./migration.sh /opt/mExpress/packages/core/tests/p0/core/service-discovery.test.ts"
  exit 1
fi

# Source and target paths
SOURCE_FILE="$1"
BASE_NAME=$(basename "$SOURCE_FILE")
FILE_TYPE=$(echo "$BASE_NAME" | grep -oE "\.(test|spec)\.(ts|tsx)$" || echo ".test.ts")
TEST_NAME=$(echo "$BASE_NAME" | sed -E "s/\.(test|spec)\.(ts|tsx)$//")
SOURCE_DIR=$(dirname "$SOURCE_FILE")

# Determine the component type from the path
if [[ "$SOURCE_FILE" == *"/core/"* ]]; then
  COMPONENT_TYPE="core"
elif [[ "$SOURCE_FILE" == *"/api/"* ]]; then
  COMPONENT_TYPE="api"
elif [[ "$SOURCE_FILE" == *"/services/"* ]]; then
  COMPONENT_TYPE="services"
elif [[ "$SOURCE_FILE" == *"/models/"* ]]; then
  COMPONENT_TYPE="models"
elif [[ "$SOURCE_FILE" == *"/utils/"* ]]; then
  COMPONENT_TYPE="utils"
elif [[ "$SOURCE_FILE" == *"/integration/"* ]]; then
  COMPONENT_TYPE="integration"
else
  COMPONENT_TYPE="$(dirname "$SOURCE_FILE" | rev | cut -d'/' -f1 | rev)"
fi

# Determine test type
if [[ "$SOURCE_FILE" == *"/integration/"* || "$SOURCE_FILE" == *"-integration"* ]]; then
  TEST_TYPE="integration"
else
  TEST_TYPE="unit"
fi

# Check for custom target directory
if [ $# -gt 1 ]; then
  TARGET_DIR="$2"
else
  TARGET_DIR="/opt/mExpress/tests/packages/core/$TEST_TYPE/$COMPONENT_TYPE"
fi

# Create target directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Create mocks directory if needed
MOCKS_DIR="/opt/mExpress/tests/packages/core/$TEST_TYPE/__mocks__"
mkdir -p "$MOCKS_DIR/services"

# Target file path
TARGET_FILE="$TARGET_DIR/$TEST_NAME$FILE_TYPE"

echo "Migrating test file:"
echo "  From: $SOURCE_FILE"
echo "  To:   $TARGET_FILE"
echo "  Type: $TEST_TYPE"
echo "  Component: $COMPONENT_TYPE"

# Copy mocks if they exist
if [[ -d "$SOURCE_DIR/__mocks__" ]]; then
  echo "Copying mock files..."
  cp -r "$SOURCE_DIR/__mocks__"/* "$MOCKS_DIR/"
fi

# Check if target file already exists
if [ -f "$TARGET_FILE" ]; then
  echo "Target file already exists. Backing up..."
  cp "$TARGET_FILE" "${TARGET_FILE}.bak"
fi

# Copy the source file to the target location
cp "$SOURCE_FILE" "$TARGET_FILE"

# Read the file content
CONTENT=$(cat "$TARGET_FILE")

# Convert relative imports to path aliases
# This handles common patterns, but may need adjustment for specific cases
UPDATED_CONTENT=$(echo "$CONTENT" | sed -E 's|from '"'"'\.\.\/\.\.\/\.\.\/src\/([^'"'"']*)'"'"'|from '"'"'@mexpress/core/\1'"'"'|g')
UPDATED_CONTENT=$(echo "$UPDATED_CONTENT" | sed -E 's|from '"'"'\.\.\/\.\.\/src\/([^'"'"']*)'"'"'|from '"'"'@mexpress/core/\1'"'"'|g')
UPDATED_CONTENT=$(echo "$UPDATED_CONTENT" | sed -E 's|from '"'"'\.\.\/src\/([^'"'"']*)'"'"'|from '"'"'@mexpress/core/\1'"'"'|g')

# Fix mock imports to point to the new location
UPDATED_CONTENT=$(echo "$UPDATED_CONTENT" | sed -E 's|from '"'"'\.\.\/\__mocks__\/services\/([^'"'"']*)'"'"'|from '"'"'../__mocks__/services/\1'"'"'|g')
UPDATED_CONTENT=$(echo "$UPDATED_CONTENT" | sed -E 's|from '"'"'\.\.\/\__mocks__\/([^'"'"']*)'"'"'|from '"'"'../__mocks__/\1'"'"'|g')

# Write updated content back to the file
echo "$UPDATED_CONTENT" > "$TARGET_FILE"

# Verify the migrated file
echo "Verifying migrated file imports..."
grep -n "import" "$TARGET_FILE"

# Run the test to ensure it still works
echo "Running test to verify migration..."
cd /opt/mExpress
JEST_CONFIG="packages/core/jest.simplified.config.js"
if [[ "$TARGET_FILE" == *".tsx" ]]; then
  JEST_CONFIG="packages/core/jest.config.js"
fi

# Try to run the test (redirect stderr to avoid flooding output)
npx jest --config "$JEST_CONFIG" "$TARGET_FILE" > /tmp/test_migration_result.txt 2>&1
TEST_RESULT=$?

if [ $TEST_RESULT -eq 0 ]; then
  echo "✅ Test migration successful\!"
  echo "The test passed after migration."
else
  echo "❌ Test migration may require adjustments."
  echo "Check the detailed output in /tmp/test_migration_result.txt"
  
  # Show common errors
  grep -A 3 "Error" /tmp/test_migration_result.txt | head -n 10
fi

echo "Migration completed. New test file is at: $TARGET_FILE"
echo "If everything looks good, you may want to delete the original file:"
echo "rm $SOURCE_FILE"
