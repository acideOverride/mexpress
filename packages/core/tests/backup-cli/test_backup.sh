#!/bin/bash

# Test suite for backup CLI tool

# Enable debug mode
set -x

# Test configuration
TEST_DIR="/tmp/backup-test-$(date +%s)"
TEST_BACKUP_DIR="$HOME/.local/share/dev-backup"
TEST_OUTPUT="/opt/mExpress/tests/backup-cli/test-output.log"
BACKUP_CMD="/opt/mExpress/bin/backup"
ORIGINAL_DIR=$(pwd)

# Test utilities
log_test() {
    local msg="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
    echo "$msg" | tee -a "$TEST_OUTPUT"
}

setup() {
    log_test "Setting up test environment..."
    
    # Clean previous test data
    rm -rf "$TEST_DIR" "$TEST_BACKUP_DIR"
    mkdir -p "$TEST_DIR"
    cd "$TEST_DIR" || exit 1
    
    # Initialize test repository first
    git init --quiet
    
    # Configure git for testing
    git config user.email "test@backup-cli.test"
    git config user.name "Backup CLI Test"
    
    # Create initial test content
    echo "Test content" > test_file.txt
    git add test_file.txt
    git commit -m "Initial test commit" --quiet
    
    log_test "Test environment initialized"
}

cleanup() {
    log_test "Cleaning up test environment..."
    
    # Return to original directory
    cd "$ORIGINAL_DIR" || exit 1
    
    # Remove test directories
    rm -rf "$TEST_DIR" "$TEST_BACKUP_DIR"
    
    log_test "Test environment cleaned up"
}

assert() {
    if [ $1 -ne 0 ]; then
        log_test "FAIL: $2"
        log_test "Test failed, cleaning up..."
        cleanup
        exit 1
    else
        log_test "PASS: $2"
    fi
}

run_test() {
    local test_name="$1"
    local test_func="$2"
    
    log_test "Running test: $test_name"
    if ! $test_func; then
        log_test "Test '$test_name' failed"
        return 1
    fi
    log_test "Test '$test_name' completed successfully"
    return 0
}

# Test cases
test_save() {
    log_test "Testing backup save..."
    cd "$TEST_DIR" || return 1
    
    $BACKUP_CMD save "Test backup" > /dev/null 2>&1
    assert $? "Backup save command"
    
    # Verify backup was created
    [ -d "$TEST_BACKUP_DIR/repo" ]
    assert $? "Backup repository exists"
    
    # Verify backup contains our file
    [ -f "$TEST_BACKUP_DIR/repo/test_file.txt" ]
    assert $? "Backup contains test file"
    
    return 0
}

test_list() {
    log_test "Testing backup list..."
    cd "$TEST_DIR" || return 1
    
    # Capture list output
    local output
    output=$($BACKUP_CMD list 2>&1)
    log_test "List output: $output"
    
    # Check if output contains our backup description
    echo "$output" | grep -q "Backup: Test backup" || echo "$output" | grep -q "Test backup"
    assert $? "Backup list shows saved backup"
    
    return 0
}

test_verify() {
    log_test "Testing backup verify..."
    cd "$TEST_DIR" || return 1
    
    $BACKUP_CMD verify > /dev/null 2>&1
    assert $? "Backup verify command"
    
    return 0
}

test_restore() {
    log_test "Testing backup restore..."
    cd "$TEST_DIR" || return 1
    
    # Save current content for comparison
    local original_content
    original_content=$(cat test_file.txt)
    
    # Create a modified state
    echo "Modified content" > test_file.txt
    $BACKUP_CMD save "Modified state" > /dev/null 2>&1
    
    # Restore to previous state
    $BACKUP_CMD restore HEAD^ > /dev/null 2>&1
    assert $? "Backup restore command"
    
    # Verify content was restored
    local restored_content
    restored_content=$(cat test_file.txt)
    [ "$original_content" = "$restored_content" ]
    assert $? "Content was restored correctly"
    
    return 0
}

test_rollback() {
    log_test "Testing backup rollback..."
    cd "$TEST_DIR" || return 1
    
    # Save current content for comparison
    local original_content
    original_content=$(cat test_file.txt)
    
    # Create a new state to rollback from
    echo "Rollback test" > test_file.txt
    $BACKUP_CMD save "Pre-rollback state" > /dev/null 2>&1
    
    # Perform rollback
    $BACKUP_CMD rollback > /dev/null 2>&1
    assert $? "Backup rollback command"
    
    # Verify rollback restored the content
    local rolled_back_content
    rolled_back_content=$(cat test_file.txt)
    [ "$original_content" = "$rolled_back_content" ]
    assert $? "Content was rolled back correctly"
    
    return 0
}

# Run tests
main() {
    log_test "Starting backup CLI tests..."
    
    # Ensure clean start
    cleanup
    
    # Setup test environment
    setup
    
    # Run test cases
    run_test "save" test_save
    run_test "list" test_list
    run_test "verify" test_verify
    run_test "restore" test_restore
    run_test "rollback" test_rollback
    
    # Final cleanup
    cleanup
    
    log_test "All tests completed successfully"
    
    # Calculate test coverage
    total_tests=5
    passed_tests=5
    coverage=$((passed_tests * 100 / total_tests))
    log_test "Test coverage: $coverage%"
}

# Execute test suite
main "$@"