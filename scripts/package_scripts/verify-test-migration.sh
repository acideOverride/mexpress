#!/bin/bash

# Test Migration Verification Script v2.0
# Validates priority-based test organization for all projects

set -e

# Configuration
MEXPRESS_DIR="/opt/mExpress/packages/core/tests"
MONTPC_DIR="/opt/mExpress/projects/montpc_crm/tests"
MONTPC_FRONTEND_DIR="/opt/mExpress/projects/montpc_crm/tests/frontend"

# Create results directory
RESULTS_DIR="/opt/mExpress/packages/core/tests/migration_verification_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$RESULTS_DIR"

# Verification results file
RESULTS_FILE="$RESULTS_DIR/verification.log"
touch "$RESULTS_FILE"

log() {
    echo "$1" | tee -a "$RESULTS_FILE"
}

verify_project() {
    local project_dir="$1"
    local project_name="$2"
    local is_frontend="$3"
    
    log "Verifying $project_name Project"
    log "=========================="
    log "Directory: $project_dir"
    log ""
    
    ERRORS=0
    
    # 1. Priority-Based Directory Structure Verification
    log "1. Priority-Based Directory Structure Verification"
    log "---------------------------------------------"
    
    check_directory() {
        local dir="$1"
        if [ -d "$dir" ]; then
            log "✓ Found directory: $dir"
            return 0
        else
            log "✗ Missing directory: $dir"
            return 1
        fi
    }
    
    # Check priority-based directories
    for priority in p0 p1 p2 p3; do
        check_directory "$project_dir/$priority" || ((ERRORS++))
        check_directory "$project_dir/results/$priority" || ((ERRORS++))
        
        if [ "$is_frontend" = "true" ]; then
            check_directory "$project_dir/$priority/components" || ((ERRORS++))
            check_directory "$project_dir/$priority/hooks" || ((ERRORS++))
            check_directory "$project_dir/$priority/api/interceptors" || ((ERRORS++))
            check_directory "$project_dir/$priority/api/services" || ((ERRORS++))
        else
            check_directory "$project_dir/$priority/models" || ((ERRORS++))
            check_directory "$project_dir/$priority/services" || ((ERRORS++))
            check_directory "$project_dir/$priority/utils" || ((ERRORS++))
            check_directory "$project_dir/$priority/core" || ((ERRORS++))
            check_directory "$project_dir/$priority/infrastructure" || ((ERRORS++))
        fi
    done
    
    # Check other standard directories
    check_directory "$project_dir/integration" || ((ERRORS++))
    check_directory "$project_dir/__mocks__" || ((ERRORS++))
    check_directory "$project_dir/results/integration" || ((ERRORS++))
    check_directory "$project_dir/results/summary" || ((ERRORS++))
    
    log ""
    
    # 2. Test File Distribution by Priority
    log "2. Test File Distribution by Priority"
    log "--------------------------------"
    
    count_files() {
        local dir="$1"
        local count=0
        if [ -d "$dir" ]; then
            count=$(find "$dir" -type f \( -name "*.test.*" -o -name "*.spec.*" \) | wc -l)
        fi
        echo "$count"
    }
    
    for priority in p0 p1 p2 p3; do
        log "$priority Tests:"
        if [ -d "$project_dir/$priority" ]; then
            if [ "$is_frontend" = "true" ]; then
                # Frontend test distribution
                for module in components hooks api; do
                    if [ "$module" = "api" ]; then
                        for api_type in interceptors services; do
                            count=$(count_files "$project_dir/$priority/$module/$api_type")
                            log "  - $module/$api_type: $count tests"
                        done
                    elif [ "$module" = "components" ]; then
                        for component_type in $(ls "$project_dir/$priority/$module" 2>/dev/null); do
                            count=$(count_files "$project_dir/$priority/$module/$component_type")
                            log "  - $module/$component_type: $count tests"
                        done
                    else
                        count=$(count_files "$project_dir/$priority/$module")
                        log "  - $module: $count tests"
                    fi
                done
            else
                # Backend test distribution
                for module in models services utils core infrastructure; do
                    count=$(count_files "$project_dir/$priority/$module")
                    log "  - $module: $count tests"
                done
            fi
        else
            log "  No $priority tests found"
            ((ERRORS++))
        fi
    done
    
    # Count integration tests
    integration_count=$(count_files "$project_dir/integration")
    log "Integration Tests: $integration_count tests"
    
    # Count mock files
    mock_count=$(find "$project_dir/__mocks__" -type f 2>/dev/null | wc -l)
    log "Mock Files: $mock_count files"
    
    log ""
    
    # 3. Configuration Verification
    log "3. Configuration Verification"
    log "---------------------------"
    
    check_config() {
        local config_file="$project_dir/jest.config.js"
        if [ -f "$config_file" ]; then
            log "✓ Found Jest configuration"
            
            if grep -q "p0/" "$config_file" && \
               grep -q "p1/" "$config_file" && \
               grep -q "p2/" "$config_file" && \
               grep -q "p3/" "$config_file" && \
               grep -q "setupFilesAfterEnv" "$config_file" && \
               grep -q "moduleNameMapper" "$config_file" && \
               grep -q "coverageThreshold" "$config_file"; then
                log "✓ Configuration contains required priority-based settings"
                
                if [ "$is_frontend" = "true" ]; then
                    if grep -q "jsdom" "$config_file" && \
                       grep -q "@testing-library/jest-dom" "$config_file" && \
                       grep -q "identity-obj-proxy" "$config_file"; then
                        log "✓ Frontend-specific configuration is correct"
                    else
                        log "✗ Missing frontend-specific configuration"
                        ((ERRORS++))
                    fi
                fi
            else
                log "✗ Missing required priority-based configuration settings"
                ((ERRORS++))
            fi
        else
            log "✗ Missing Jest configuration"
            ((ERRORS++))
        fi
    }
    
    check_config
    
    log ""
    
    # 4. Test Script Verification
    log "4. Test Script Verification"
    log "-------------------------"
    
    check_scripts() {
        local package_file="$project_dir/package.json"
        if [ -f "$package_file" ]; then
            log "✓ Found package.json"
            
            if grep -q "test:p0" "$package_file" && \
               grep -q "test:p1" "$package_file" && \
               grep -q "test:p2" "$package_file" && \
               grep -q "test:p3" "$package_file" && \
               grep -q "test:integration" "$package_file" && \
               grep -q "test:coverage" "$package_file" && \
               grep -q "results/" "$package_file" && \
               grep -q "2>/dev/null" "$package_file"; then
                log "✓ Priority-based test scripts properly configured with output redirection"
            else
                log "✗ Missing or incorrect priority-based test script configuration"
                ((ERRORS++))
            fi
        else
            log "✗ Missing package.json"
            ((ERRORS++))
        fi
    }
    
    check_scripts
    
    log ""
    
    # Summary
    log "Project Summary"
    log "=============="
    log "Total Errors: $ERRORS"
    
    if [ $ERRORS -eq 0 ]; then
        log "✓ Project verification passed"
        log "Test structure follows priority-based standards and output management is properly configured"
    else
        log "✗ Project verification failed with $ERRORS errors"
        log "Please review the log and fix the identified issues"
    fi
    
    log ""
    log "----------------------------------------"
    log ""
    
    return $ERRORS
}

# Verify all projects
TOTAL_ERRORS=0

log "Starting Priority-Based Test Organization Verification"
log "============================================="
log ""

verify_project "$MEXPRESS_DIR" "mExpress" "false"
((TOTAL_ERRORS+=$?))

verify_project "$MONTPC_DIR" "MontPC CRM Backend" "false"
((TOTAL_ERRORS+=$?))

verify_project "$MONTPC_FRONTEND_DIR" "MontPC CRM Frontend" "true"
((TOTAL_ERRORS+=$?))

# Final Summary
log "Final Verification Summary"
log "======================="
log "Total Project Errors: $TOTAL_ERRORS"

if [ $TOTAL_ERRORS -eq 0 ]; then
    log "✓ All projects verified successfully with priority-based organization"
else
    log "✗ Verification failed with errors"
    log "Please review project-specific logs for details"
fi

# Create summary file
SUMMARY_FILE="$RESULTS_DIR/summary.json"
cat > "$SUMMARY_FILE" << EOL
{
    "verificationDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "totalErrors": $TOTAL_ERRORS,
    "status": "$([ $TOTAL_ERRORS -eq 0 ] && echo "PASSED" || echo "FAILED")",
    "projects": {
        "mexpress": {
            "p0Tests": $(count_files "$MEXPRESS_DIR/p0"),
            "p1Tests": $(count_files "$MEXPRESS_DIR/p1"),
            "p2Tests": $(count_files "$MEXPRESS_DIR/p2"),
            "p3Tests": $(count_files "$MEXPRESS_DIR/p3"),
            "integrationTests": $(count_files "$MEXPRESS_DIR/integration"),
            "mocks": $(find "$MEXPRESS_DIR/__mocks__" -type f 2>/dev/null | wc -l)
        },
        "montpc_crm_backend": {
            "p0Tests": $(count_files "$MONTPC_DIR/p0"),
            "p1Tests": $(count_files "$MONTPC_DIR/p1"),
            "p2Tests": $(count_files "$MONTPC_DIR/p2"),
            "p3Tests": $(count_files "$MONTPC_DIR/p3"),
            "integrationTests": $(count_files "$MONTPC_DIR/integration"),
            "mocks": $(find "$MONTPC_DIR/__mocks__" -type f 2>/dev/null | wc -l)
        },
        "montpc_crm_frontend": {
            "p0Tests": $(count_files "$MONTPC_FRONTEND_DIR/p0"),
            "p1Tests": $(count_files "$MONTPC_FRONTEND_DIR/p1"),
            "p2Tests": $(count_files "$MONTPC_FRONTEND_DIR/p2"),
            "p3Tests": $(count_files "$MONTPC_FRONTEND_DIR/p3"),
            "integrationTests": $(count_files "$MONTPC_FRONTEND_DIR/integration"),
            "mocks": $(find "$MONTPC_FRONTEND_DIR/__mocks__" -type f 2>/dev/null | wc -l)
        }
    }
}
EOL

echo "Verification complete! Results available at: $RESULTS_DIR"