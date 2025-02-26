#!/bin/bash

# Reconciliation Tools Demo Script
# This script demonstrates the key features of the reconciliation tools

# Ensure we're in the right directory
ROOT_DIR="$(cd "$(dirname "$0")/../../../.." && pwd)"
CORE_DIR="$ROOT_DIR/packages/core"
DIST_DIR="$CORE_DIR/dist/src/reconciliation-tools"
BIN_DIR="$CORE_DIR/bin"

# Create data directory if it doesn't exist
mkdir -p "$CORE_DIR/.reconciliation-data"

echo "🔄 Reconciliation Tools Demo 🔄"
echo "==============================="
echo

echo "🧩 Setting up sample data..."
# Run the initialization script to set up sample data
node "$CORE_DIR/src/reconciliation-tools/examples/initialize-project.js"
echo

echo "⏱️ Showing sprint status..."
# Show the sprint dashboard
node "$DIST_DIR/cli.js" sprint status
echo

echo "📊 Showing matrix components..."
# List all components in the matrix
node "$DIST_DIR/cli.js" matrix list
echo

echo "🔍 Scanning for components..."
# Scan for a specific component in the codebase
node "$DIST_DIR/cli.js" scan component -n "AuthService" -d "$CORE_DIR/src"
echo

echo "🔎 Discovering components..."
# Discover components matching a pattern
node "$DIST_DIR/cli.js" scan discover -p ".*Service" -d "$CORE_DIR/src"
echo

echo "📈 Generating matrix report..."
# Generate a status report
node "$DIST_DIR/cli.js" matrix report
echo

echo "📁 Exporting matrix to CSV..."
# Export the matrix to a CSV file
node "$DIST_DIR/cli.js" matrix export -o "$CORE_DIR/matrix-export.csv"
echo

echo "✅ Demo completed!"
echo "You can find the reconciliation data in $CORE_DIR/.reconciliation-data/"
echo "Generated CSV export is in $CORE_DIR/matrix-export.csv"
echo
echo "Next steps:"
echo "1. Explore the reconciliation tools using the CLI"
echo "2. Integrate with your development workflow"
echo "3. Read the documentation in $ROOT_DIR/docs/core/projects/mexpress/implementation/"
echo
echo "For more information, see the README at $CORE_DIR/src/reconciliation-tools/README.md"