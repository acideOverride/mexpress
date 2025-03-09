#!/bin/bash
# cleanup-jest-configs.sh
#
# This script identifies and backs up redundant Jest configuration files
# as part of the Jest configuration standardization effort.
#
# IMPORTANT: This script creates backups before removing files.
# The backup directory is .jest-backup in the project root.

# Set script to exit if any command fails
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}mExpress Jest Configuration Cleanup${NC}"
echo -e "${YELLOW}This script will identify and back up redundant Jest configuration files.${NC}"
echo -e "${YELLOW}Standardization effort: Reducing from 45+ configs to ~10 configs.${NC}"
echo

# Create backup directory
BACKUP_DIR="/opt/mExpress/.jest-backup"
BACKUP_TIME=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_TIME}"
mkdir -p "${BACKUP_PATH}"
echo -e "${GREEN}Created backup directory: ${BACKUP_PATH}${NC}"

# Find all Jest configuration files
echo -e "${BLUE}Finding all Jest configuration files...${NC}"
JEST_FILES=$(find /opt/mExpress -name "jest.*.js" | grep -v "jest.preset.js" | grep -v "jest.utils.js")
JEST_CONFIGS=$(find /opt/mExpress -name "jest.config.js")

# Count the files
TOTAL_FILES=$(echo "${JEST_FILES}" | wc -l)
CONFIG_FILES=$(echo "${JEST_CONFIGS}" | wc -l)
echo -e "${GREEN}Found ${TOTAL_FILES} Jest utility files and ${CONFIG_FILES} Jest configuration files.${NC}"

# Define essential files (these should not be deleted)
ESSENTIAL_FILES=(
    # Core configuration files
    "/opt/mExpress/jest.preset.js"
    "/opt/mExpress/jest.utils.js"
    "/opt/mExpress/jest.config.js"
    
    # Package configurations
    "/opt/mExpress/packages/core/jest.config.js"
    "/opt/mExpress/packages/utils/jest.config.js"
    "/opt/mExpress/packages/ui-components/jest.config.js"
    
    # MontPC CRM configurations
    "/opt/mExpress/projects/montpc_crm/jest.config.js"
    "/opt/mExpress/projects/montpc_crm/frontend/jest.config.js"
    "/opt/mExpress/projects/montpc_crm/tests/jest.config.js"
    
    # Test runner scripts
    "/opt/mExpress/run-all-tests.sh"
    "/opt/mExpress/packages/core/tests/run-tests.sh"
)

# Function to check if a file is in the essential files list
is_essential() {
    local file="$1"
    for essential in "${ESSENTIAL_FILES[@]}"; do
        if [[ "$file" == "$essential" ]]; then
            return 0
        fi
    done
    return 1
}

# Identify redundant files
echo -e "${BLUE}Identifying redundant Jest configuration files...${NC}"
REDUNDANT_FILES=()

# Check Jest config files
for file in ${JEST_CONFIGS}; do
    if ! is_essential "$file"; then
        REDUNDANT_FILES+=("$file")
    fi
done

# Add Jest utility files (not jest.config.js)
for file in ${JEST_FILES}; do
    if [[ "$file" != *"jest.preset.js" && "$file" != *"jest.utils.js" ]]; then
        REDUNDANT_FILES+=("$file")
    fi
done

# Count redundant files
REDUNDANT_COUNT=${#REDUNDANT_FILES[@]}
echo -e "${GREEN}Identified ${REDUNDANT_COUNT} redundant Jest configuration files.${NC}"

# Ask for confirmation before proceeding
echo
echo -e "${YELLOW}Do you want to back up and delete these redundant files? (y/n)${NC}"
read -r confirmation

if [[ "$confirmation" != "y" && "$confirmation" != "Y" ]]; then
    echo -e "${RED}Operation canceled. No files were modified.${NC}"
    exit 0
fi

# Back up and delete redundant files
echo -e "${BLUE}Backing up redundant files to ${BACKUP_PATH}...${NC}"
for file in "${REDUNDANT_FILES[@]}"; do
    # Create the directory structure in the backup
    relative_path="${file#/opt/mExpress/}"
    backup_file="${BACKUP_PATH}/${relative_path}"
    backup_dir=$(dirname "$backup_file")
    mkdir -p "$backup_dir"
    
    # Copy the file to the backup location
    cp "$file" "$backup_file"
    
    # Rename the original file with .bak extension instead of deleting
    mv "$file" "${file}.bak"
    
    echo -e "${GREEN}Backed up and renamed: ${file}${NC}"
done

echo
echo -e "${GREEN}Completed! All redundant files have been backed up to ${BACKUP_PATH}${NC}"
echo -e "${GREEN}and renamed with .bak extension.${NC}"
echo -e "${YELLOW}To restore, you can copy files from the backup directory or remove the .bak extension.${NC}"
echo -e "${BLUE}Jest configuration standardization is now complete!${NC}"