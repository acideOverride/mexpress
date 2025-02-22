#!/bin/bash

# Test Migration Script v1.0
# Migrates and separates tests between mexpress and montpc_crm

set -e

# Enable debug output
set -x

# Configuration
MEXPRESS_DIR="/opt/mExpress/packages/core/tests/mexpress"
MONTPC_DIR="/opt/mExpress/projects/montpc_crm/tests"
MONTPC_FRONTEND_DIR="/opt/mExpress/projects/montpc_crm/tests/frontend"
PACKAGE_NAME="core"

echo "Starting comprehensive test migration and separation..."

# Create standard directory structure for mexpress
mkdir -p "$MEXPRESS_DIR/unit"
mkdir -p "$MEXPRESS_DIR/integration"
mkdir -p "$MEXPRESS_DIR/__mocks__"
mkdir -p "$MEXPRESS_DIR/results/unit"
mkdir -p "$MEXPRESS_DIR/results/integration"
mkdir -p "$MEXPRESS_DIR/results/summary"

# Create standard directory structure for montpc_crm backend
mkdir -p "$MONTPC_DIR/unit"
mkdir -p "$MONTPC_DIR/integration"
mkdir -p "$MONTPC_DIR/__mocks__"
mkdir -p "$MONTPC_DIR/results/unit"
mkdir -p "$MONTPC_DIR/results/integration"
mkdir -p "$MONTPC_DIR/results/summary"

# Create standard directory structure for montpc_crm frontend
mkdir -p "$MONTPC_FRONTEND_DIR/unit/components/auth"
mkdir -p "$MONTPC_FRONTEND_DIR/unit/components/CustomerDetails"
mkdir -p "$MONTPC_FRONTEND_DIR/unit/components/CustomerList"
mkdir -p "$MONTPC_FRONTEND_DIR/unit/components/dashboard"
mkdir -p "$MONTPC_FRONTEND_DIR/unit/hooks"
mkdir -p "$MONTPC_FRONTEND_DIR/unit/api/interceptors"
mkdir -p "$MONTPC_FRONTEND_DIR/unit/api/services"
mkdir -p "$MONTPC_FRONTEND_DIR/integration"
mkdir -p "$MONTPC_FRONTEND_DIR/__mocks__"
mkdir -p "$MONTPC_FRONTEND_DIR/results/unit"
mkdir -p "$MONTPC_FRONTEND_DIR/results/integration"
mkdir -p "$MONTPC_FRONTEND_DIR/results/summary"

# Create backup of original tests
BACKUP_DIR="/opt/mExpress/packages/core/tests_backup_$(date +%Y%m%d_%H%M%S)"
echo "Creating backup at $BACKUP_DIR"
cp -r "/opt/mExpress/packages/core/tests" "$BACKUP_DIR" 2>/dev/null || true

# Process frontend test files
process_frontend_tests() {
    local frontend_src="/opt/mExpress/projects/montpc_crm/frontend/src"
    echo "Processing frontend tests..."
    
    # Process API tests
    echo "Processing API tests..."
    for file in $(find "$frontend_src/api" -type f -name "*.test.*"); do
        echo "Found API test: $file"
        if echo "$file" | grep -q "/interceptors/"; then
            echo "Copying interceptor test to: $MONTPC_FRONTEND_DIR/unit/api/interceptors/$(basename "$file")"
            cp "$file" "$MONTPC_FRONTEND_DIR/unit/api/interceptors/$(basename "$file")"
        elif echo "$file" | grep -q "/services/"; then
            echo "Copying service test to: $MONTPC_FRONTEND_DIR/unit/api/services/$(basename "$file")"
            cp "$file" "$MONTPC_FRONTEND_DIR/unit/api/services/$(basename "$file")"
        fi
    done
    
    # Process component tests
    echo "Processing component tests..."
    for file in $(find "$frontend_src/components" -type f -name "*.test.*"); do
        echo "Found component test: $file"
        component_type=$(basename $(dirname $(dirname $(dirname "$file"))))
        if [ "$component_type" = "components" ]; then
            component_type=$(basename $(dirname $(dirname "$file")))
        fi
        if [ "$component_type" = "__tests__" ]; then
            component_type=$(basename $(dirname $(dirname $(dirname "$file"))))
        fi
        
        echo "Component type: $component_type"
        target_dir="$MONTPC_FRONTEND_DIR/unit/components/$component_type"
        echo "Target directory: $target_dir"
        
        mkdir -p "$target_dir"
        echo "Copying to: $target_dir/$(basename "$file")"
        cp "$file" "$target_dir/$(basename "$file")"
    done
    
    # Process hook tests
    echo "Processing hook tests..."
    for file in $(find "$frontend_src/hooks" -type f -name "*.test.*"); do
        echo "Found hook test: $file"
        echo "Copying to: $MONTPC_FRONTEND_DIR/unit/hooks/$(basename "$file")"
        cp "$file" "$MONTPC_FRONTEND_DIR/unit/hooks/$(basename "$file")"
    done
}

# Process mock files
process_mock_files() {
    local search_dir="$1"
    echo "Processing mocks in $search_dir..."
    
    find "$search_dir" -type f \( -name "*mock*.ts" -o -name "*mock*.js" -o -name "*mock*.tsx" \) | while read file; do
        project=$(determine_project "$file")
        filename=$(basename "$file")
        
        if echo "$file" | grep -q "/frontend/"; then
            cp "$file" "$MONTPC_FRONTEND_DIR/__mocks__/$filename"
            echo "Moved frontend mock: $filename"
        elif [ "$project" = "montpc" ]; then
            cp "$file" "$MONTPC_DIR/__mocks__/$filename"
            echo "Moved backend mock: $filename"
        else
            cp "$file" "$MEXPRESS_DIR/__mocks__/$filename"
            echo "Moved mexpress mock: $filename"
        fi
    done
}

# Process frontend tests first
echo "Starting frontend test migration..."
process_frontend_tests

# Create Jest configurations
create_jest_config() {
    local target_dir="$1"
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
    
    cat > "$target_dir/jest.config.js" << EOL
module.exports = {
  displayName: '${project_name}',
  preset: '../../jest.preset.js',
  testEnvironment: '${test_env}',
  testMatch: [
    '<rootDir>/unit/**/*.test.{ts,js,tsx}',
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

    cat > "$target_dir/package.json" << EOL
{
  "name": "@${project_name}/tests",
  "private": true,
  "scripts": {
    "test:unit": "jest --config jest.config.js --testMatch='<rootDir>/unit/**/*.test.{ts,js,tsx}' --silent > results/unit/test.log 2>/dev/null",
    "test:integration": "jest --config jest.config.js --testMatch='<rootDir>/integration/**/*.test.{ts,js,tsx}' --silent > results/integration/test.log 2>/dev/null",
    "test:coverage": "jest --config jest.config.js --coverage --silent > results/summary/coverage.log 2>/dev/null",
    "test": "npm run test:unit && npm run test:integration && npm run test:coverage > results/summary/test.log 2>/dev/null"
  }
}
EOL
}

echo "Creating test configurations..."
create_jest_config "$MEXPRESS_DIR" "mexpress" "false"
create_jest_config "$MONTPC_DIR" "montpc_crm" "false"
create_jest_config "$MONTPC_FRONTEND_DIR" "montpc_crm-frontend" "true"

echo "Migration and separation complete!"
echo "Please verify the migrated tests and update any import paths as needed."
echo "Original tests backed up at: $BACKUP_DIR"
echo ""
echo "Project Locations:"
echo "1. mExpress tests: $MEXPRESS_DIR"
echo "2. MontPC CRM Backend tests: $MONTPC_DIR"
echo "3. MontPC CRM Frontend tests: $MONTPC_FRONTEND_DIR"
echo ""
echo "Test Execution Instructions (per project):"
echo "1. Run unit tests: npm run test:unit"
echo "2. Run integration tests: npm run test:integration"
echo "3. Generate coverage: npm run test:coverage"
echo "4. Run all tests: npm run test"
echo ""
echo "All test output will be redirected to appropriate results directories"

# Disable debug output
set +x