#!/bin/bash

# Final Test Cleanup Script v1.0
# Moves remaining scattered tests to their proper priority-based locations

set -e

echo "Starting final cleanup of remaining test files..."

# Function to move tests to appropriate location
move_remaining_tests() {
    local base_dir="$1"
    local dest_dir="$2"

    # Move git-workflow-automation tests
    if [ -d "$base_dir/src/git-workflow-automation/tests" ]; then
        find "$base_dir/src/git-workflow-automation/tests" -type f -name "*.test.*" -exec mv {} "$dest_dir/p1/core/" \;
        rm -rf "$base_dir/src/git-workflow-automation/tests"
    fi

    # Move lib tests
    if [ -d "$base_dir/src/lib" ]; then
        # Move monitoring tests
        find "$base_dir/src/lib/monitoring/__tests__" -type f -name "*.test.*" -exec mv {} "$dest_dir/p1/core/" \;
        # Move resilience tests
        find "$base_dir/src/lib/resilience/__tests__" -type f -name "*.test.*" -exec mv {} "$dest_dir/p1/core/" \;
    fi

    # Move utils tests
    if [ -d "$base_dir/src/utils/__tests__" ]; then
        find "$base_dir/src/utils/__tests__" -type f -name "*.test.*" -exec mv {} "$dest_dir/p3/utils/" \;
    fi

    # Clean up empty __tests__ directories
    find "$base_dir" -type d -name "__tests__" -empty -delete
}

# Function to move frontend tests
move_frontend_tests() {
    local base_dir="$1"
    local dest_dir="$2"

    # Move API tests
    if [ -d "$base_dir/src/api" ]; then
        # Move interceptor tests
        find "$base_dir/src/api/interceptors/__tests__" -type f -name "*.test.*" -exec mv {} "$dest_dir/p0/api/interceptors/" \;
        # Move service tests
        find "$base_dir/src/api/services/__tests__" -type f -name "*.test.*" -exec mv {} "$dest_dir/p1/api/services/" \;
    fi

    # Move hooks tests
    if [ -d "$base_dir/src/hooks/__tests__" ]; then
        find "$base_dir/src/hooks/__tests__" -type f -name "*.test.*" -exec mv {} "$dest_dir/p2/hooks/" \;
    fi

    # Move component tests
    if [ -d "$base_dir/src/components" ]; then
        find "$base_dir/src/components" -type f -name "*.test.*" -exec mv {} "$dest_dir/p2/components/" \;
    fi

    # Clean up empty __tests__ directories
    find "$base_dir" -type d -name "__tests__" -empty -delete
}

# Clean up packages/core
echo "Cleaning up remaining tests in packages/core..."
move_remaining_tests "/opt/mExpress/packages/core" "/opt/mExpress/packages/core/tests"

# Clean up montpc_crm frontend
echo "Cleaning up remaining tests in montpc_crm frontend..."
move_frontend_tests "/opt/mExpress/projects/montpc_crm/frontend" "/opt/mExpress/projects/montpc_crm/tests/frontend"

echo "Final cleanup complete!"
echo "Running verification..."

# Run verification script
bash /opt/mExpress/packages/core/scripts/verify-test-migration.sh