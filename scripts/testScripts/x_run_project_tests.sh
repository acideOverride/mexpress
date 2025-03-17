#!/bin/bash

# x_run_project_tests.sh
#
# This script combines the project-specific test pre-calculation and test runner
# First, it calculates all metrics that can be determined without running tests
# Then, it runs the tests and updates the report in real-time
#
# Usage: ./x_run_project_tests.sh [project_name] [options]
# Options:
#   --max-tests=N      Maximum number of tests to run
#   --all              Run all tests (default: only run newer tests)
#   --shuffle          Shuffle test order
#   --priority=P0,P1   Only run tests with specified priorities (comma-separated)
#
# Example: ./x_run_project_tests.sh jerome_bikes --priority=P0,P1

# Check if project name is provided
if [ -z "$1" ]; then
  echo "Error: Project name is required."
  echo "Usage: ./x_run_project_tests.sh [project_name] [options]"
  echo "Example: ./x_run_project_tests.sh jerome_bikes --priority=P0,P1"
  exit 1
fi

PROJECT_NAME="$1"
shift # Remove project name from arguments but keep all other options

echo "➡️ Step 1: Performing test pre-calculations for $PROJECT_NAME project..."
/opt/mExpress/scripts/testScripts/a_project_test_pre_calculation.sh "$PROJECT_NAME"

if [ $? -ne 0 ]; then
  echo "❌ Error in test pre-calculations. Aborting."
  exit 1
fi

echo "➡️ Step 2: Running tests with real-time reporting for $PROJECT_NAME project..."
/opt/mExpress/scripts/testScripts/b_project_test_runner.sh "$PROJECT_NAME" "$@"

if [ $? -ne 0 ]; then
  echo "❌ Error in test runner. Check logs for details."
  exit 1
fi

echo "✅ Project test run complete for $PROJECT_NAME!"
echo "📊 Pre-test metrics report: /opt/mExpress/docs/$PROJECT_NAME/_tests/PRE_TEST_METRICS.md"
echo "📊 Test list: /opt/mExpress/docs/$PROJECT_NAME/_tests/PROJECT_TESTS_LIST.md"
echo "📊 Test execution report: /opt/mExpress/docs/$PROJECT_NAME/_tests/TESTS_STATUS.md"