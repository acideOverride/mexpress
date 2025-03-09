#!/bin/bash

# Test Redistribution Script v1.0
# Redistributes tests across priority levels based on test type

set -e

TESTS_DIR="/opt/mExpress/packages/core/tests"

echo "Starting test redistribution..."

# Function to move a test file to appropriate priority level
move_test() {
    local src="$1"
    local priority="$2"
    local category="$3"
    local dest_dir="$TESTS_DIR/$priority/$category"
    
    mkdir -p "$dest_dir"
    mv "$src" "$dest_dir/"
    echo "Moved $(basename "$src") to $priority/$category/"
}

# Function to determine test priority
categorize_test() {
    local file="$1"
    local filename=$(basename "$file")
    local content=$(cat "$file")
    
    # P0: Core functionality, critical paths, data integrity
    if echo "$filename$content" | grep -qi "auth\|login\|critical\|data-integrity\|core/\|customer.service\|product.service"; then
        echo "p0"
    # P1: Business logic, key integrations
    elif echo "$filename$content" | grep -qi "business\|integration\|service\|workflow\|pipeline"; then
        echo "p1"
    # P2: Features, components
    elif echo "$filename$content" | grep -qi "feature\|component\|ui\|dashboard\|display"; then
        echo "p2"
    # P3: Edge cases, performance, nice-to-have features
    elif echo "$filename$content" | grep -qi "edge\|performance\|optimization\|debug\|mock"; then
        echo "p3"
    else
        # Default to p1 if no clear category is found
        echo "p1"
    fi
}

# Function to determine test category
get_category() {
    local file="$1"
    local filename=$(basename "$file")
    
    if echo "$filename" | grep -qi "service"; then
        echo "services"
    elif echo "$filename" | grep -qi "model"; then
        echo "models"
    elif echo "$filename" | grep -qi "util"; then
        echo "utils"
    elif echo "$filename" | grep -qi "infrastructure\|container\|kubernetes\|deployment"; then
        echo "infrastructure"
    else
        echo "core"
    fi
}

echo "Analyzing and redistributing tests..."

# Process all test files in p0
find "$TESTS_DIR/p0" -type f \( -name "*.test.*" -o -name "*.spec.*" \) | while read file; do
    priority=$(categorize_test "$file")
    category=$(get_category "$file")
    
    if [ "$priority" != "p0" ]; then
        move_test "$file" "$priority" "$category"
    fi
done

# Move integration tests to correct location
find "$TESTS_DIR" -type f -name "*integration*.test.*" | while read file; do
    if [[ "$file" != *"/integration/"* ]]; then
        mv "$file" "$TESTS_DIR/integration/"
        echo "Moved $(basename "$file") to integration/"
    fi
done

# Move mock files to __mocks__ directory
find "$TESTS_DIR" -type f -name "*.mock.*" | while read file; do
    if [[ "$file" != *"/__mocks__/"* ]]; then
        mv "$file" "$TESTS_DIR/__mocks__/"
        echo "Moved $(basename "$file") to __mocks__/"
    fi
done

echo "Test redistribution complete!"
echo "Running verification..."

# Run verification script
bash /opt/mExpress/packages/core/scripts/verify-test-migration.sh

echo "Please review the verification results and make any necessary adjustments."