#!/bin/bash

# Script to update all Jest configuration files to remove warnings
# This script modifies all Jest config files to use the proper format for Jest 29

CONFIG_FILES=$(find /opt/mExpress -name "jest.config.js")
MODIFIED_COUNT=0

for config_file in $CONFIG_FILES; do
  echo "Processing $config_file..."
  
  # Create a backup
  cp "$config_file" "${config_file}.bak"
  
  # Fix ts-jest configuration warnings
  if grep -q "'ts-jest'" "$config_file"; then
    echo "- Fixing ts-jest configuration in $config_file"
    
    # Check if transform section exists
    if grep -q "transform:" "$config_file"; then
      # If transform already exists, just remove ts-jest from globals
      sed -i "/globals/,/}/{ /ts-jest/d; }" "$config_file"
    else
      # If transform doesn't exist, add it and remove ts-jest from globals
      sed -i "/globals/,/}/{ /ts-jest/d; }" "$config_file"
      sed -i "/module.exports/a \\    transform: { \\n        '^.+\\\\.tsx?$': ['ts-jest', { \\n            isolatedModules: true \\n        }] \\n    }," "$config_file"
    fi
    
    MODIFIED_COUNT=$((MODIFIED_COUNT + 1))
  fi
  
  # Fix testTimeout warnings
  if grep -q "testTimeout:" "$config_file"; then
    echo "- Fixing testTimeout in $config_file"
    sed -i "/testTimeout:/d" "$config_file"
    MODIFIED_COUNT=$((MODIFIED_COUNT + 1))
  fi
  
  # Fix reporters warnings
  if grep -q "reporters:" "$config_file"; then
    echo "- Fixing reporters in $config_file"
    # Replace simple reporter arrays with proper format
    sed -i "s/reporters: \[\s*'default',\s*'.*'\s*\]/reporters: [[\"default\", {}]]/g" "$config_file"
    sed -i "s/reporters: \[\s*'default',\s*\".*\"\s*\]/reporters: [[\"default\", {}]]/g" "$config_file"
    sed -i "s/reporters: \[\s*'default'\s*\]/reporters: [[\"default\", {}]]/g" "$config_file"
    sed -i "s/reporters: \[\s*\"default\"\s*\]/reporters: [[\"default\", {}]]/g" "$config_file"
    MODIFIED_COUNT=$((MODIFIED_COUNT + 1))
  fi
  
  # Fix watchPlugins warnings
  if grep -q "watchPlugins:" "$config_file"; then
    echo "- Removing watchPlugins from $config_file"
    sed -i "/watchPlugins:/d" "$config_file"
    sed -i "/.*jest.resource-monitor.js.*/d" "$config_file"
    MODIFIED_COUNT=$((MODIFIED_COUNT + 1))
  fi
  
  # Fix silent and verbose options
  if grep -q "silent:" "$config_file" || grep -q "verbose:" "$config_file"; then
    echo "- Removing silent/verbose options from $config_file"
    sed -i "/silent:/d" "$config_file"
    sed -i "/verbose:/d" "$config_file"
    MODIFIED_COUNT=$((MODIFIED_COUNT + 1))
  fi
  
  # Check if we need testRunner
  if ! grep -q "testRunner:" "$config_file"; then
    echo "- Adding testRunner to $config_file"
    sed -i "/module.exports/a \\    testRunner: \"jest-circus/runner\"," "$config_file"
    MODIFIED_COUNT=$((MODIFIED_COUNT + 1))
  fi
  
  # Fix any syntax errors that might have been introduced (trailing commas, etc.)
  # This is a simple fix but not foolproof
  sed -i "s/,\s*}/}/g" "$config_file"
  
  echo "Completed processing $config_file"
done

echo "Processed $MODIFIED_COUNT files."
echo "Test script fixes complete. Run your tests to see if warnings are reduced."