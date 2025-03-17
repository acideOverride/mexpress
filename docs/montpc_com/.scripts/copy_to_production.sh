#!/bin/bash

# Script to copy MontPC website content to production
# Intermediate solution before implementing the fully working website

SOURCE_DIR="/opt/mExpress/docs/montpc_com/__mocks__/accepted/v3/fr"
DEST_DIR="/var/www/montpc.com"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
  echo "Error: Source directory does not exist: $SOURCE_DIR"
  exit 1
fi

# Check if destination directory exists, create if not
if [ ! -d "$DEST_DIR" ]; then
  echo "Creating destination directory: $DEST_DIR"
  mkdir -p "$DEST_DIR"
fi

# Copy all content from source to destination
echo "Copying content from $SOURCE_DIR to $DEST_DIR..."
cp -r "$SOURCE_DIR"/* "$DEST_DIR"

# Check if copy was successful
if [ $? -eq 0 ]; then
  echo "Copy completed successfully!"
  echo "Website content has been updated at $DEST_DIR"
else
  echo "Error: Copy operation failed"
  exit 1
fi

exit 0