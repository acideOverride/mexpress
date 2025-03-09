#!/bin/bash
# Master Test Runner for mExpress
# STANDARDIZED VERSION - 2025-03-15
#
# This script runs tests across all packages and projects using the standardized
# dynamic Jest configuration approach.

# Set default values
PRIORITY=""
TEST_TYPE=""
VERBOSE=""
COVERAGE=""
BAIL=""
TARGET=""

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
    --verbose)
      VERBOSE="--verbose"
      shift
      ;;
    --coverage)
      COVERAGE="--coverage"
      shift
      ;;
    --bail)
      BAIL="--bail"
      shift
      ;;
    --core)
      TARGET="core"
      shift
      ;;
    --utils)
      TARGET="utils"
      shift
      ;;
    --ui-components)
      TARGET="ui-components"
      shift
      ;;
    --vue-components)
      TARGET="vue-components"
      shift
      ;;
    --montpc)
      TARGET="montpc"
      shift
      ;;
    --help|-h)
      echo "mExpress Master Test Runner"
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
      echo "  --verbose            Show verbose output"
      echo "  --coverage           Generate coverage report"
      echo "  --bail               Stop on first failure"
      echo "  --core               Run only Core package tests"
      echo "  --utils              Run only Utils package tests"
      echo "  --ui-components      Run only UI Components package tests"
      echo "  --vue-components     Run only Vue Components package tests"
      echo "  --montpc             Run only MontPC CRM project tests"
      echo "  --help, -h           Show this help message"
      echo ""
      echo "Examples:"
      echo "  $0 --p0              Run all P0 tests"
      echo "  $0 --p1 --core       Run P1 tests for core package"
      echo "  $0 --integration     Run all integration tests"
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

# Determine which configuration to use based on target
if [ -n "$TARGET" ]; then
  case "$TARGET" in
    "core")
      CONFIG_PATH="--config=packages/core/jest.config.js"
      ;;
    "utils")
      CONFIG_PATH="--config=packages/utils/jest.config.js"
      ;;
    "ui-components")
      CONFIG_PATH="--config=packages/ui-components/jest.config.js"
      ;;
    "vue-components")
      CONFIG_PATH="--config=packages/vue-components/jest.config.js"
      ;;
    "montpc")
      CONFIG_PATH="--config=projects/montpc_crm/jest.config.js"
      ;;
    *)
      echo "Unknown target: $TARGET"
      exit 1
      ;;
  esac
else
  # Use root config to run all tests
  CONFIG_PATH="--config=jest.config.js"
fi

# Construct command
CMD="npx jest $CONFIG_PATH --runInBand $VERBOSE $COVERAGE $BAIL"

# Run the tests
echo "🧪 Running mExpress Tests"
echo "========================="
echo "Priority: ${PRIORITY:-all}"
echo "Test Type: ${TEST_TYPE:-all}"
echo "Target: ${TARGET:-all packages}"
echo "Command: $CMD"
echo "========================="
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