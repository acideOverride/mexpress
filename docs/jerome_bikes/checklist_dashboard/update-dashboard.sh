#!/bin/bash

# Script to update the checklist dashboard
# This should be run after any update to CHECKLIST.md

CHECKLIST_FILE="/opt/mExpress/docs/jerome_bikes/CHECKLIST.md"
DASHBOARD_DIR="/opt/mExpress/docs/jerome_bikes/checklist_dashboard"
DASHBOARD_FILE="$DASHBOARD_DIR/dashboard.md"

if [ ! -f "$CHECKLIST_FILE" ]; then
  echo "Error: CHECKLIST.md file not found at $CHECKLIST_FILE"
  exit 1
fi

echo "Updating Jerome Bikes implementation dashboard..."

# Create dashboard file
cat > "$DASHBOARD_FILE" << EOF
# Jerome Bikes Implementation Dashboard

Last updated: $(date '+%Y-%m-%d %H:%M:%S')

## Current Task Status
EOF

# Extract current task information
TASK_ID=$(grep -A 1 "^# Implementation Checklist:" "$CHECKLIST_FILE" | grep -o "TASK-JRMB-[0-9]\+" | head -1)
TASK_NAME=$(grep -A 1 "^# Implementation Checklist:" "$CHECKLIST_FILE" | grep -o "TASK-JRMB-[0-9]\+.*" | sed 's/^TASK-JRMB-[0-9]\+ - //' | head -1)

# Extract AMTC document status
grep -A 5 "^## Current AMTC Document Status" "$CHECKLIST_FILE" | grep -v "^##" >> "$DASHBOARD_FILE"

echo -e "\n## Task Progress\n" >> "$DASHBOARD_FILE"

# Extract completed features
echo "### Completed Features" >> "$DASHBOARD_FILE"
grep -A 100 "^### Completed Features" "$CHECKLIST_FILE" | grep -v "^### Current Focus" | grep -v "^## Implementation Notes" | grep -v "^## Implementation Observations" | grep -v "^## Performance Optimization Results" | sed '/^$/d' >> "$DASHBOARD_FILE"

# Extract current focus
echo -e "\n### Current Focus" >> "$DASHBOARD_FILE"
grep -A 20 "^### Current Focus" "$CHECKLIST_FILE" | grep -v "^## Implementation Notes" | grep -v "^## Implementation Observations" | grep -v "^## Performance Optimization Results" | sed '/^$/d' >> "$DASHBOARD_FILE"

# Extract implementation notes
echo -e "\n## Implementation Highlights" >> "$DASHBOARD_FILE"
TOTAL_NOTES=$(grep -c "^- " "$CHECKLIST_FILE")
COMPLETED_NOTES=$(grep -c "^- ✅" "$CHECKLIST_FILE")
IN_PROGRESS_NOTES=$(grep -c "^- 🔄" "$CHECKLIST_FILE")
PERCENT=$((COMPLETED_NOTES * 100 / TOTAL_NOTES))

echo "- **Progress**: $COMPLETED_NOTES/$TOTAL_NOTES tasks completed ($PERCENT%)" >> "$DASHBOARD_FILE"
echo -e "- **In Progress**: $IN_PROGRESS_NOTES tasks\n" >> "$DASHBOARD_FILE"

# Extract selected implementation notes (just the first 10)
grep "^- ✅" "$CHECKLIST_FILE" | head -10 >> "$DASHBOARD_FILE"

# Extract performance results if available
if grep -q "^## Performance Optimization Results" "$CHECKLIST_FILE"; then
  echo -e "\n## Performance Status" >> "$DASHBOARD_FILE"
  grep -A 100 "^## Performance Optimization Results" "$CHECKLIST_FILE" | sed '/^## /d' | head -20 >> "$DASHBOARD_FILE"
fi

# Extract final verification if available
if grep -q "^## Final Verification" "$CHECKLIST_FILE"; then
  echo -e "\n## Verification Status" >> "$DASHBOARD_FILE"
  grep -A 100 "^## Final Verification" "$CHECKLIST_FILE" | sed '/^$/d' | head -30 >> "$DASHBOARD_FILE"
fi

# Make the script executable
chmod +x "$DASHBOARD_DIR/update-dashboard.sh"

echo "Dashboard updated at $DASHBOARD_FILE"