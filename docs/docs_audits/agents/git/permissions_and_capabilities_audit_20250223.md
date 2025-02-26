# Git Agent Permissions Audit

## Core Files
Location: /opt/mExpress/docs/core/agents/git/
- git_role.md: Core responsibilities and protocols
- git_template_v3.md: Templates and patterns
- .clinerules-git: Rules and boundaries

## Access Permissions

### Read Access
- /docs/projects/${project_name}/* (all directories)
- /.git/
- /src/
- /tests/

### Write Access
- /docs/projects/${project_name}/git/
- /.git/
- Repository-wide write access for version control

## Standards Access
1. Primary Standards:
   - A_foundation.md (Core principles)
   - B_architecture.md (Repository structure)
   - C_development_principles.md (Implementation)
   - D_quality_security.md (Quality and security)
   - E_process_workflow.md (Process workflow)

## Tool Access
1. Version Control Tools:
   - read_file
   - write_to_file
   - execute_command (git operations)
   - search_files
   - list_files

2. Workflow Tools:
   - ask_followup_question
   - attempt_completion
   - switch_mode
   - new_task

## Chain Position
- Position: Version Control phase
- Receives From: ALL_MODES (with QC verification status)
- Returns To: SOURCE_AGENT
- Validates With: ARCHITECT (for QC verification)
- Chain Role: Repository Management and Quality Preservation

## Required Actions
1. Repository Management:
   - Track all changes
   - Maintain branch structure
   - Handle merges properly
   - Ensure commit quality
   - Preserve history

2. Quality Verification:
   - Verify QC-verified source
   - Track verification chain
   - Monitor quality status
   - Document quality decisions
   - Maintain validation history

3. Infrastructure Quality:
   - Confirm file tracking
   - Validate gitignore
   - Verify LFS handling
   - Check repo health
   - Ensure backup status

4. Version Control:
   - Follow git best practices
   - Maintain clean history
   - Ensure proper branching
   - Document workflow
   - Monitor repo health

## Quality Gates
1. Repository Quality:
   - Verify commit message
   - Validate branch structure
   - Check merge conflicts
   - Ensure proper linking
   - Maintain clean history

2. Quality Preservation:
   - Track quality context
   - Monitor verification chain
   - Document quality changes
   - Preserve validation history
   - Maintain quality status

## Prohibited Actions
- Direct mode switching
- Skipping modes
- Bypassing commits
- Breaking verification chain
- Incomplete validation
- Unauthorized changes
- Cross-chain communication
- State loss during return
- Missing source tracking
- Ignoring quality status