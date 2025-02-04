#!/bin/bash

# Installation script for backup CLI tool

# Configuration
INSTALL_DIR="/usr/local/bin"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_SCRIPT="$SCRIPT_DIR/bin/backup"

# Ensure script is run as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

# Check if backup script exists
if [ ! -f "$BACKUP_SCRIPT" ]; then
    echo "Error: backup script not found at $BACKUP_SCRIPT"
    exit 1
fi

# Install the script
echo "Installing backup CLI tool..."
cp "$BACKUP_SCRIPT" "$INSTALL_DIR/backup"
chmod +x "$INSTALL_DIR/backup"

echo "Installation complete. You can now use the backup command."
echo "Try 'backup help' to get started."