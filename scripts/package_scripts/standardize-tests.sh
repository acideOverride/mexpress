#!/bin/bash

# Test Standardization Script v2.0
# Implements the priority-based test organization across all projects

set -e

# Configuration
MEXPRESS_DIR="/opt/mExpress/packages/core"
MONTPC_DIR="/opt/mExpress/projects/montpc_crm"

echo "Starting test standardization..."

# Function to create priority-based test structure
create_test_structure() {
    local base_dir="$1"
    local is_frontend="$2"

    # Create priority-based directories
    for priority in p0 p1 p2 p3; do
        if [ "$is_frontend" = "true" ]; then
            # Frontend test structure by priority
            mkdir -p "$base_dir/$priority/components/auth"
            mkdir -p "$base_dir/$priority/components/dashboard"
            mkdir -p "$base_dir/$priority/components/CustomerDetails"
            mkdir -p "$base_dir/$priority/components/CustomerList"
            mkdir -p "$base_dir/$priority/hooks"
            mkdir -p "$base_dir/$priority/api/services"
            mkdir -p "$base_dir/$priority/api/interceptors"
        else
            # Backend test structure by priority
            mkdir -p "$base_dir/$priority/models"
            mkdir -p "$base_dir/$priority/services"
            mkdir -p "$base_dir/$priority/utils"
            mkdir -p "$base_dir/$priority/core"
            mkdir -p "$base_dir/$priority/infrastructure"
        fi

        # Create results directory for each priority
        mkdir -p "$base_dir/results/$priority"
    done

    mkdir -p "$base_dir/integration"
    mkdir -p "$base_dir/__mocks__"
    mkdir -p "$base_dir/results/integration"
    mkdir -p "$base_dir/results/summary"
}

# Function to determine test priority
determine_priority() {
    local file="$1"
    
    # P0: Core functionality, critical paths, data integrity
    if echo "$file" | grep -q "/core/\|/models/\|/data/\|critical\|auth"; then
        echo "p0"
    # P1: Business logic, key integrations
    elif echo "$file" | grep -q "/services/\|/business/\|integration"; then
        echo "p1"
    # P2: Features, components
    elif echo "$file" | grep -q "/features/\|/components/"; then
        echo "p2"
    # P3: Edge cases, performance, nice-to-have features
    else
        echo "p3"
    fi
}

# Function to migrate tests with priority-based organization
migrate_tests() {
    local src_dir="$1"
    local test_dir="$2"
    local is_frontend="$3"

    echo "Migrating tests from $src_dir to $test_dir..."

    # Find and migrate tests from src directories
    find "$src_dir" -type f -name "*.test.*" -o -name "*.spec.*" | while read file; do
        # Determine priority
        priority=$(determine_priority "$file")
        
        # Determine target directory based on file path
        relative_path=${file#$src_dir/}
        parent_dir=$(dirname "$relative_path")
        
        if [ "$is_frontend" = "true" ]; then
            # Handle frontend test organization
            if echo "$file" | grep -q "/components/"; then
                component_type=$(echo "$parent_dir" | grep -o "components/[^/]*" | cut -d'/' -f2)
                target_dir="$test_dir/$priority/components/$component_type"
            elif echo "$file" | grep -q "/hooks/"; then
                target_dir="$test_dir/$priority/hooks"
            elif echo "$file" | grep -q "/api/services/"; then
                target_dir="$test_dir/$priority/api/services"
            elif echo "$file" | grep -q "/api/interceptors/"; then
                target_dir="$test_dir/$priority/api/interceptors"
            else
                target_dir="$test_dir/$priority/$(dirname "$relative_path")"
            fi
        else
            # Handle backend test organization
            if echo "$file" | grep -q "/models/"; then
                target_dir="$test_dir/$priority/models"
            elif echo "$file" | grep -q "/services/"; then
                target_dir="$test_dir/$priority/services"
            elif echo "$file" | grep -q "/utils/"; then
                target_dir="$test_dir/$priority/utils"
            elif echo "$file" | grep -q "/core/"; then
                target_dir="$test_dir/$priority/core"
            elif echo "$file" | grep -q "/infrastructure/"; then
                target_dir="$test_dir/$priority/infrastructure"
            else
                target_dir="$test_dir/$priority/$(dirname "$relative_path")"
            fi
        fi

        mkdir -p "$target_dir"
        cp "$file" "$target_dir/$(basename "$file")"
        echo "Migrated: $file -> $target_dir/$(basename "$file")"
    done

    # Migrate mock files
    find "$src_dir" -type f -name "*.mock.*" | while read file; do
        cp "$file" "$test_dir/__mocks__/$(basename "$file")"
        echo "Migrated mock: $file -> $test_dir/__mocks__/$(basename "$file")"
    done
}

# Function to create Jest configuration
create_jest_config() {
    local test_dir="$1"
    local project_name="$2"
    local is_frontend="$3"

    local test_env="node"
    local additional_setup=""
    local additional_mappers=""

    if [ "$is_frontend" = "true" ]; then
        test_env="jsdom"
        additional_setup=",\n    '@testing-library/jest-dom/extend-expect'"
        additional_mappers=",\n    '\\.(css|less|scss)$': 'identity-obj-proxy'"
    fi

    cat > "$test_dir/jest.config.js" << EOL
module.exports = {
  displayName: '${project_name}',
  preset: '../../jest.preset.js',
  testEnvironment: '${test_env}',
  testMatch: [
    '<rootDir>/p0/**/*.test.{ts,js,tsx}',
    '<rootDir>/p1/**/*.test.{ts,js,tsx}',
    '<rootDir>/p2/**/*.test.{ts,js,tsx}',
    '<rootDir>/p3/**/*.test.{ts,js,tsx}',
    '<rootDir>/integration/**/*.test.{ts,js,tsx}'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/__mocks__/setup.ts'${additional_setup}
  ],
  moduleNameMapper: {
    '^@mexpress/${project_name}/(.*)$': '<rootDir>/src/$1'${additional_mappers}
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts'
  ]
};
EOL

    cat > "$test_dir/package.json" << EOL
{
  "name": "@${project_name}/tests",
  "private": true,
  "scripts": {
    "test:p0": "jest --config jest.config.js --testMatch='<rootDir>/p0/**/*.test.{ts,js,tsx}' --silent > results/p0/test.log 2>/dev/null",
    "test:p1": "jest --config jest.config.js --testMatch='<rootDir>/p1/**/*.test.{ts,js,tsx}' --silent > results/p1/test.log 2>/dev/null",
    "test:p2": "jest --config jest.config.js --testMatch='<rootDir>/p2/**/*.test.{ts,js,tsx}' --silent > results/p2/test.log 2>/dev/null",
    "test:p3": "jest --config jest.config.js --testMatch='<rootDir>/p3/**/*.test.{ts,js,tsx}' --silent > results/p3/test.log 2>/dev/null",
    "test:integration": "jest --config jest.config.js --testMatch='<rootDir>/integration/**/*.test.{ts,js,tsx}' --silent > results/integration/test.log 2>/dev/null",
    "test:coverage": "jest --config jest.config.js --coverage --silent > results/summary/coverage.log 2>/dev/null",
    "test": "npm run test:p0 && npm run test:p1 && npm run test:p2 && npm run test:p3 && npm run test:integration && npm run test:coverage > results/summary/test.log 2>/dev/null"
  }
}
EOL
}

# 1. Standardize mexpress core tests
echo "Standardizing mexpress core tests..."

# Create backup
BACKUP_DIR="$MEXPRESS_DIR/tests_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r "$MEXPRESS_DIR/tests" "$BACKUP_DIR/" 2>/dev/null || true
cp -r "$MEXPRESS_DIR/src/__tests__" "$BACKUP_DIR/" 2>/dev/null || true

# Create new test structure
TEST_DIR="$MEXPRESS_DIR/tests-new"
rm -rf "$TEST_DIR" 2>/dev/null || true
create_test_structure "$TEST_DIR" "false"

# Migrate tests
migrate_tests "$MEXPRESS_DIR/src" "$TEST_DIR" "false"

# Create test configuration
create_jest_config "$TEST_DIR" "mexpress" "false"

# 2. Standardize montpc_crm backend tests
echo "Standardizing montpc_crm backend tests..."

# Create backup
mkdir -p "$MONTPC_DIR/tests_backup_$(date +%Y%m%d_%H%M%S)"
cp -r "$MONTPC_DIR/tests" "$MONTPC_DIR/tests_backup_$(date +%Y%m%d_%H%M%S)/" 2>/dev/null || true

# Create new test structure
BACKEND_TEST_DIR="$MONTPC_DIR/tests"
rm -rf "$BACKEND_TEST_DIR" 2>/dev/null || true
create_test_structure "$BACKEND_TEST_DIR" "false"

# Migrate tests
migrate_tests "$MONTPC_DIR/backend/src" "$BACKEND_TEST_DIR" "false"

# Create test configuration
create_jest_config "$BACKEND_TEST_DIR" "montpc_crm" "false"

# 3. Standardize montpc_crm frontend tests
echo "Standardizing montpc_crm frontend tests..."

# Create new test structure
FRONTEND_TEST_DIR="$MONTPC_DIR/tests/frontend"
rm -rf "$FRONTEND_TEST_DIR" 2>/dev/null || true
create_test_structure "$FRONTEND_TEST_DIR" "true"

# Migrate tests
migrate_tests "$MONTPC_DIR/frontend/src" "$FRONTEND_TEST_DIR" "true"

# Create test configuration
create_jest_config "$FRONTEND_TEST_DIR" "montpc_crm-frontend" "true"

echo "Test standardization complete!"
echo "Please verify the new test organization in:"
echo "1. mexpress: $TEST_DIR"
echo "2. montpc_crm backend: $BACKEND_TEST_DIR"
echo "3. montpc_crm frontend: $FRONTEND_TEST_DIR"
echo ""
echo "After verification, you can:"
echo "1. Remove old test directories"
echo "2. Move tests-new to tests for mexpress"
echo "3. Update import paths in test files"