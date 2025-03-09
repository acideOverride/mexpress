#!/bin/bash

# Cleanup Remaining Tests Script v1.0
# Moves remaining scattered tests to their proper priority-based locations

set -e

echo "Starting cleanup of remaining test files..."

# Function to move tests to appropriate location
move_tests() {
    local src_dir="$1"
    local dest_base="$2"
    local is_frontend="$3"

    # Find and move test files
    find "$src_dir" -type f \( -name "*.test.*" -o -name "*.spec.*" \) | while read file; do
        # Determine priority and category
        if echo "$file" | grep -qi "auth\|login\|critical\|data-integrity"; then
            priority="p0"
        elif echo "$file" | grep -qi "business\|integration\|service\|workflow"; then
            priority="p1"
        elif echo "$file" | grep -qi "feature\|component\|ui\|dashboard"; then
            priority="p2"
        else
            priority="p3"
        fi

        if [ "$is_frontend" = "true" ]; then
            if echo "$file" | grep -qi "/components/"; then
                category="components"
            elif echo "$file" | grep -qi "/hooks/"; then
                category="hooks"
            elif echo "$file" | grep -qi "/api/"; then
                category="api"
            else
                category="core"
            fi
        else
            if echo "$file" | grep -qi "service"; then
                category="services"
            elif echo "$file" | grep -qi "model"; then
                category="models"
            elif echo "$file" | grep -qi "util"; then
                category="utils"
            elif echo "$file" | grep -qi "infrastructure"; then
                category="infrastructure"
            else
                category="core"
            fi
        fi

        # Create destination directory
        dest_dir="$dest_base/$priority/$category"
        mkdir -p "$dest_dir"

        # Move file
        cp "$file" "$dest_dir/$(basename "$file")"
        echo "Moved: $file -> $dest_dir/$(basename "$file")"
        rm "$file"
    done
}

# Clean up packages/core tests
echo "Cleaning up packages/core tests..."
move_tests "/opt/mExpress/packages/core/src/__tests__" "/opt/mExpress/packages/core/tests" "false"
move_tests "/opt/mExpress/packages/core/src/services/__tests__" "/opt/mExpress/packages/core/tests" "false"
move_tests "/opt/mExpress/packages/core/src/models/__tests__" "/opt/mExpress/packages/core/tests" "false"
move_tests "/opt/mExpress/packages/core/src/test" "/opt/mExpress/packages/core/tests" "false"
move_tests "/opt/mExpress/packages/core/src/tests" "/opt/mExpress/packages/core/tests" "false"
move_tests "/opt/mExpress/packages/core/src/git-workflow-automation/tests" "/opt/mExpress/packages/core/tests" "false"

# Clean up packages/utils tests
echo "Cleaning up packages/utils tests..."
move_tests "/opt/mExpress/packages/utils/tests" "/opt/mExpress/packages/utils/tests-new" "false"
move_tests "/opt/mExpress/packages/utils/src/__tests__" "/opt/mExpress/packages/utils/tests-new" "false"

# Clean up montpc_crm frontend tests
echo "Cleaning up montpc_crm frontend tests..."
move_tests "/opt/mExpress/projects/montpc_crm/frontend/src/__tests__" "/opt/mExpress/projects/montpc_crm/tests/frontend" "true"
move_tests "/opt/mExpress/projects/montpc_crm/frontend/src/components" "/opt/mExpress/projects/montpc_crm/tests/frontend" "true"

# Remove empty test directories
find "/opt/mExpress/packages/core/src" -type d -name "__tests__" -empty -delete
find "/opt/mExpress/packages/utils/src" -type d -name "__tests__" -empty -delete
find "/opt/mExpress/projects/montpc_crm/frontend/src" -type d -name "__tests__" -empty -delete

echo "Cleanup complete!"
echo "Running verification..."

# Run verification script
bash /opt/mExpress/packages/core/scripts/verify-test-migration.sh