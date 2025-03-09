#!/bin/bash
# Standardized test runner script for mExpress Core package
# STANDARDIZED VERSION - 2025-03-15
#
# This script allows running tests with different priorities and types
# using the standardized dynamic Jest configuration.

# Set default values
PRIORITY=""
TEST_TYPE=""
VERBOSE=""
COVERAGE=""
WATCH=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --p0|--critical)
      PRIORITY="p0"
      shift
      ;;
    --p1|--important)
      PRIORITY="p1"
      shift
      ;;
    --p2|--secondary)
      PRIORITY="p2"
      shift
      ;;
    --p3|--performance)
      PRIORITY="p3"
      shift
      ;;
    --integration)
      TEST_TYPE="integration"
      shift
      ;;
    --frontend)
      TEST_TYPE="frontend"
      shift
      ;;
    --react)
      TEST_TYPE="react"
      shift
      ;;
    --vue)
      TEST_TYPE="vue"
      shift
      ;;
    --verbose)
      VERBOSE="--verbose"
      shift
      ;;
    --coverage)
      COVERAGE="--coverage"
      shift
      ;;
    --watch)
      WATCH="--watch"
      shift
      ;;
    --help|-h)
      echo "mExpress Core Tests Runner"
      echo ""
      echo "Usage: $0 [options]"
      echo ""
      echo "Options:"
      echo "  --p0, --critical     Run P0 (critical) tests"
      echo "  --p1, --important    Run P1 (important) tests"
      echo "  --p2, --secondary    Run P2 (secondary) tests"
      echo "  --p3, --performance  Run P3 (performance) tests"
      echo "  --integration        Run integration tests"
      echo "  --frontend           Run frontend tests"
      echo "  --react              Run React component tests"
      echo "  --vue                Run Vue component tests"
      echo "  --verbose            Show verbose output"
      echo "  --coverage           Generate coverage report"
      echo "  --watch              Run tests in watch mode"
      echo "  --help, -h           Show this help message"
      echo ""
      echo "Examples:"
      echo "  $0 --p0              Run P0 tests"
      echo "  $0 --p1 --coverage   Run P1 tests with coverage"
      echo "  $0 --integration     Run integration tests"
      echo "  $0                   Run all tests"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help to see available options"
      exit 1
      ;;
  esac
done

# Set up environment variables based on options
if [ -n "$PRIORITY" ]; then
  export PRIORITY
fi

if [ -n "$TEST_TYPE" ]; then
  export TEST_TYPE
fi

# Construct command
CMD="npx jest --config=../../packages/core/jest.config.js $VERBOSE $COVERAGE $WATCH"

# Run the tests
echo "Running tests with configuration:"
echo "  Priority: ${PRIORITY:-all}"
echo "  Test Type: ${TEST_TYPE:-all}"
echo "  Command: $CMD"
echo ""

# Execute the command
eval $CMD

# Get exit code
EXIT_CODE=$?

# Display results summary
if [ $EXIT_CODE -eq 0 ]; then
  echo ""
  echo "✅ All tests passed successfully!"
else
  echo ""
  echo "❌ Some tests failed. Exit code: $EXIT_CODE"
fi

exit $EXIT_CODE