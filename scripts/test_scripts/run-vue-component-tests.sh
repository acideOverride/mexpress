#!/bin/bash
# Vue Components Test Runner
# Part of the standardized test infrastructure for mExpress
# Created: 2025-03-09

# Set the package directory
PACKAGE_DIR="/opt/mExpress/packages/vue-components"
CONFIG_FILE="$PACKAGE_DIR/jest.config.js"

# Default options
PRIORITY=""
TEST_TYPE=""
COVERAGE=false
WATCH=false
VERBOSE=false
OUTPUT_FILE=""

# Display help
function show_help {
  echo "Vue Components Test Runner"
  echo "Usage: $0 [options]"
  echo ""
  echo "Options:"
  echo "  --p0                 Run priority 0 (critical) tests only"
  echo "  --p1                 Run priority 1 (important) tests only"
  echo "  --p2                 Run priority 2 (secondary) tests only"
  echo "  --p3                 Run priority 3 (performance) tests only"
  echo "  --vue                Run vue-specific tests only"
  echo "  --coverage           Generate coverage report"
  echo "  --watch              Run in watch mode"
  echo "  --verbose            Run with verbose output"
  echo "  --output <file>      Redirect output to specified file"
  echo "  --vitest             Run tests using Vitest instead of Jest"
  echo "  --help               Show this help message"
  echo ""
  echo "Example: $0 --p1 --coverage"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --p0)
      PRIORITY="p0"
      shift
      ;;
    --p1)
      PRIORITY="p1"
      shift
      ;;
    --p2)
      PRIORITY="p2"
      shift
      ;;
    --p3)
      PRIORITY="p3"
      shift
      ;;
    --vue)
      TEST_TYPE="vue"
      shift
      ;;
    --coverage)
      COVERAGE=true
      shift
      ;;
    --watch)
      WATCH=true
      shift
      ;;
    --verbose)
      VERBOSE=true
      shift
      ;;
    --output)
      OUTPUT_FILE="$2"
      shift 2
      ;;
    --vitest)
      USE_VITEST=true
      shift
      ;;
    --help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      exit 1
      ;;
  esac
done

# Change to package directory
cd "$PACKAGE_DIR" || {
  echo "Error: Cannot find package directory at $PACKAGE_DIR"
  exit 1
}

# Build the command
if [ "$USE_VITEST" = true ]; then
  # Vitest command
  CMD="npx vitest run"
  
  if [ "$WATCH" = true ]; then
    CMD="npx vitest"
  fi
  
  if [ "$COVERAGE" = true ]; then
    CMD="$CMD --coverage"
  fi
  
  if [ "$VERBOSE" = true ]; then
    CMD="$CMD --reporter verbose"
  fi
else
  # Jest command
  CMD="npx jest --config $CONFIG_FILE"
  
  # Add environment variables
  if [ -n "$PRIORITY" ]; then
    export PRIORITY="$PRIORITY"
    echo "Running priority $PRIORITY tests..."
  fi
  
  if [ -n "$TEST_TYPE" ]; then
    export TEST_TYPE="$TEST_TYPE"
    echo "Running $TEST_TYPE tests..."
  fi
  
  # Add options
  if [ "$COVERAGE" = true ]; then
    CMD="$CMD --coverage"
  fi
  
  if [ "$WATCH" = true ]; then
    CMD="$CMD --watch"
  fi
  
  if [ "$VERBOSE" = true ]; then
    CMD="$CMD --verbose"
  fi
fi

# Execute the command
echo "Running command: $CMD"
if [ -n "$OUTPUT_FILE" ]; then
  echo "Redirecting output to $OUTPUT_FILE"
  eval "$CMD" > "$OUTPUT_FILE" 2>&1
  RESULT=$?
  
  # Print summary based on exit code
  if [ $RESULT -eq 0 ]; then
    echo "✅ Tests completed successfully. Output saved to $OUTPUT_FILE"
  else
    echo "❌ Tests failed with exit code $RESULT. Output saved to $OUTPUT_FILE"
  fi
  
  exit $RESULT
else
  eval "$CMD"
fi