#!/bin/bash

# run_enhanced_tests.sh
#
# This script combines the test pre-calculation and real-time test runner
# First, it calculates all metrics that can be determined without running tests
# Then, it runs the tests and updates the report in real-time
#
# Usage: ./run_enhanced_tests.sh [--max-tests=N] [--all] [--shuffle] [--priority=P0,P1]

echo "➡️ Step 1: Performing test pre-calculations..."
/opt/mExpress/scripts/testScripts/test_pre_calculation.sh

echo "➡️ Step 2: Running tests with real-time reporting..."
/opt/mExpress/scripts/testScripts/real_time_test_runner.sh "$@"

echo "✅ Enhanced test run complete!"
echo "📊 Pre-test metrics report: /opt/mExpress/tests/validation/unified/PRE_TEST_METRICS.md"
echo "📊 Test list: /opt/mExpress/tests/validation/unified/REAL_TESTS_LIST.md"
echo "📊 Test execution report: /opt/mExpress/tests/validation/unified/TESTS_STATUS_ENHANCED.md"
echo "📊 JSON metrics: /opt/mExpress/dashboard/unified/generated/test-pre-metrics.json"
echo "📊 JSON execution stats: /opt/mExpress/dashboard/unified/generated/test-execution-stats.json"