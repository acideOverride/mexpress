Roo: CODE
PROJECT: mExpress Frontend
TASK: Research Migration - BRQ-2025-CLEANUP-002
STATUS: Planning

MIGRATION PLAN:

1. Research Documentation Migration
   Source: /frontend/src/research/interviews/2025-02-17_P001/
   Target: /docs/projects/mexpress/research/interviews/2025-02-17_P001/
   Files:
   - interview.md
   - interview-summary.md
   - completion-report.md

2. Research Templates Migration
   Source: /frontend/src/research/templates/
   Target: /docs/projects/mexpress/research/templates/
   Files:
   - session-template.md
   - interview-template.md
   - usability-test-template.md
   - card-sort-template.md
   - prototype-test-template.md
   - index.md

3. Infrastructure Cleanup
   Remove:
   /frontend/src/core/infrastructure/
   - types.ts
   - eventBus.ts
   - serviceClient.ts

MIGRATION STEPS:

1. Create Target Directories
   ```bash
   mkdir -p /opt/mExpress/docs/projects/mexpress/research/interviews/2025-02-17_P001
   mkdir -p /opt/mExpress/docs/projects/mexpress/research/templates
   ```

2. Move Research Files
   ```bash
   mv /opt/mExpress/frontend/src/research/interviews/2025-02-17_P001/* \
      /opt/mExpress/docs/projects/mexpress/research/interviews/2025-02-17_P001/

   mv /opt/mExpress/frontend/src/research/templates/* \
      /opt/mExpress/docs/projects/mexpress/research/templates/
   ```

3. Remove Infrastructure Files
   ```bash
   rm -rf /opt/mExpress/frontend/src/core/infrastructure/*
   ```

4. Clean Empty Directories
   ```bash
   rm -rf /opt/mExpress/frontend/src/research
   rm -rf /opt/mExpress/frontend/src/core/infrastructure
   ```

VERIFICATION STEPS:

1. Directory Structure
   - Verify target directories exist
   - Check file migrations
   - Confirm cleanup
   - Validate structure

2. Documentation Chain
   - Update references
   - Verify links
   - Check integrity
   - Maintain history

3. Project State
   - Verify migrations
   - Check structure
   - Update status
   - Document changes

Will proceed with migration only after confirmation.