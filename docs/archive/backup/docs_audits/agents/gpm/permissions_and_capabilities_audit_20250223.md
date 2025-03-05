# GPM (Git Project Manager) Agent Permissions Audit

## Core Files
Location: /opt/mExpress/docs/core/agents/gpm/
- gpm_role.md: Core responsibilities and protocols
- gpm_template_v3.md: Templates and patterns
- .clinerules-gpm: Rules and boundaries

## Access Permissions

### Read Access
- /docs/projects/${project_name}/* (all directories)
- /src/
- /tests/
- /.git/

### Write Access
- /docs/projects/${project_name}/project/
- Project management documentation
- Milestone tracking
- Resource planning

## Standards Access
1. Primary Standards:
   - A_foundation.md (Core principles)
   - B_architecture.md (Project structure)
   - C_development_principles.md (Implementation)
   - D_quality_security.md (Quality and security)
   - E_process_workflow.md (Process workflow)

## Tool Access
1. Project Management Tools:
   - read_file
   - write_to_file
   - search_files
   - list_files

2. Version Control Tools:
   - execute_command (git operations)

3. Workflow Tools:
   - ask_followup_question
   - attempt_completion
   - switch_mode
   - new_task

## Chain Position
- Position: Project Management phase
- Receives From: ARCHITECT (QC-verified source)
- Reports To:
  * TASKMANAGER (with verification chain)
  * QA/GPM REPORT (for implementation verification)
- Validates With: GIT, QA
- Chain Role: Project Management with Dual Verification

## Required Actions
1. Milestone Management:
   - Document milestone details
   - Plan resources
   - Set timeline
   - Track changes
   - Version control
   - Maintain verification chain

2. Progress Monitoring:
   - Track status
   - Update progress
   - Document blockers
   - Maintain timeline
   - Version updates
   - Verify QC approval status

3. Verification Management:
   - Maintain verification packages
   - Preserve verification chain
   - Link verification artifacts
   - Ensure verification traceability
   - Track source verification
   - Document verification steps

## Quality Gates
1. Source Verification:
   - Confirm QC-verified source
   - Review verification chain
   - Validate verification package
   - Check verification flow
   - Verify chain integrity

2. Documentation Quality:
   - Check documentation completeness
   - Verify verification links
   - Validate verification flow
   - Review verification history
   - Track chain integrity

3. Implementation Quality:
   - Verify implementation status
   - Check resource utilization
   - Validate milestone completion
   - Review quality standards
   - Assess roadmap compliance

## Prohibited Actions
- Direct mode switching
- Skipping modes
- Bypassing validation
- Incomplete documentation
- Unauthorized changes
- Cross-chain communication
- Missing commits
- State loss
- Bypassing QC verification
- Breaking evidence chain
- Incomplete verification records
- Missing user consultation records