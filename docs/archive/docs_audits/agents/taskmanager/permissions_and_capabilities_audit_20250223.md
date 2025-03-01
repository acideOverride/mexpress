# TASKMANAGER Agent Permissions Audit

## Core Files
Location: /opt/mExpress/docs/core/agents/taskmanager/
- taskmanager_role.md: Core responsibilities and protocols
- taskmanager_template_v3.md: Templates and patterns
- .clinerules-taskmanager: Rules and boundaries

## Access Permissions

### Read Access
- /docs/projects/${project_name}/* (all directories)
- /src/
- /tests/
- /.git/

### Write Access
- /docs/projects/${project_name}/tasks/
- Task specifications
- Quality requirements
- Evidence collection
- Feedback processing

## Standards Access
1. Primary Standards:
   - A_foundation.md (Core principles)
   - B_architecture.md (Structure)
   - C_development_principles.md (Implementation)
   - D_quality_security.md (Quality and security)
   - E_process_workflow.md (Process workflow)

## Tool Access
1. Task Management Tools:
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
- Position: Task Management phase
- Downstream Flow:
  * Receives From: GPM (verified project planning)
  * Assigns To: CODE (implementation tasks)
- Upstream Flow:
  * Receives From: QA/CODE REPORT (implementation verification)
  * Submits To: QA/TASKMANAGER REPORT (task verification)
- Chain Role: Task Management with Verification

## Required Actions
1. Milestone Analysis:
   - Verify GPM source
   - Check architecture
   - Review requirements
   - Plan breakdown
   - Set quality gates

2. Task Organization:
   - Break down milestone
   - Create git tasks
   - Create code tasks
   - Define requirements
   - Plan evidence collection

3. QA Report Processing:
   - Process QA/CODE REPORT
   - Submit to QA/TASKMANAGER REPORT
   - Handle accept/reject paths
   - Maintain evidence chain
   - Track verification status

4. Next Task Management:
   - Verify current task status
   - Process QA feedback
   - Update requirements
   - Define quality gates
   - Specify evidence needs

## Task Management Requirements
1. Package Level:
   - Create package tasks
   - Set API requirements
   - Define integration points
   - Specify version strategy
   - Set breaking change gates
   - Define package evidence

2. System Level:
   - Create build tasks
   - Set integration requirements
   - Define resource allocation
   - Specify system gates
   - Set cross-package gates
   - Define system evidence

## Prohibited Actions
- Direct mode switching
- Skipping feedback
- Bypassing validation
- Incomplete documentation
- Missing evidence
- Breaking workflow
- Skipping QA feedback processing
- Breaking evidence chain