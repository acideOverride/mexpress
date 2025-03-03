#\!/bin/bash

# Simple test migration script
# Just copies the file and preserves its imports for now

SOURCE_FILE="$1"
TARGET_DIR="/opt/mExpress/tests/packages/core/integration/infrastructure"

mkdir -p "$TARGET_DIR"
TARGET_FILE="$TARGET_DIR/$(basename "$SOURCE_FILE")"

echo "Copying test file from $SOURCE_FILE to $TARGET_FILE"
cp "$SOURCE_FILE" "$TARGET_FILE"

echo "Test file copied to canonical location. You'll need to manually adjust imports."
echo "Remember to check if the test passes in its new location:"
echo "npx jest --config packages/core/jest.simplified.config.js $TARGET_FILE"
