#!/bin/bash

# Architecture Dashboard Updater Script
# Updates the architecture dashboard based on ARCHITECTURE.md files

# Set script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "Updating architecture dashboard..."

# Run the architecture updater
node scripts/architecture/architecture-updater.js

# If successful, display success message
if [ $? -eq 0 ]; then
  echo "Architecture dashboard updated successfully."
  echo "Open the dashboard at: file://$SCRIPT_DIR/pages/architecture.html"
else
  echo "Error updating architecture dashboard."
  exit 1
fi