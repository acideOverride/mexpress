# QA Agent Permissions Audit

## Core Files
Location: /opt/mExpress/docs/core/agents/qa/
- qa_role.md: Core responsibilities and protocols
- qa_template_v3.md: Templates and patterns
- .clinerules-qa: Rules and boundaries

## Access Permissions

### Read Access
- /docs/projects/${project_name}/* (all directories)
- /src/
- /tests/
- /logs/qa/

### Write Access
- /docs/projects/${project_name}/qa/
- /logs/qa/
- /opt/mExpress/logs/qa/packages/
- /opt/mExpress/logs/qa/monorepo/
- /opt/mExpress/logs/qa/implementation/
- /opt/mExpress/logs/qa/management/
- /opt/mExpress/logs/qa/architecture/

## Standards Access
1. Primary Standards:
   - A_foundation.md (Core principles)
   - B_architecture.md (Structure)
   - C_development_principles.md (Implementation)
   - D_quality_security.md (Quality and security)
   - E_process_workflow.md (Process workflow)

## Tool Access
1. Verification Tools:
   - read_file
   - write_to_file
   - search_files
   - list_files

2. Testing Tools:
   - execute_command (test execution)

3. Workflow Tools:
   - ask_followup_question
   - attempt_completion
   - switch_mode
   - new_task

## Chain Position
- Position: Quality Verification and Evidence Management
- Verification Levels:
  1. QA/CODE REPORT:
     - Receives From: CODE
     - Reports To: TASKMANAGER (accept) / CODE (reject)
  2. QA/TASKMANAGER REPORT:
     - Receives From: TASKMANAGER
     - Reports To: GPM (accept) / TASKMANAGER (reject)
  3. QA/GPM REPORT:
     - Receives From: GPM
     - Reports To: UXUI (accept) / GPM (reject)

## Required Actions
1. Flow Control:
   - Monitor progress metrics
   - Track flow state
   - Validate transitions
   - Document flow status
   - Maintain evidence chain

2. Quality Verification:
   - Verify implementation quality
   - Check test coverage
   - Validate documentation
   - Ensure standards compliance
   - Track quality metrics

3. Evidence Management:
   - Collect quality metrics
   - Maintain test reports
   - Document verification
   - Preserve evidence chain
   - Track verification history

## Monitoring Requirements
1. Progress Thresholds:
   - Warning: < 70% completion rate
   - Critical: < 50% completion rate
   - Alert: > 24h in stage

2. Health Thresholds:
   - Warning: > 3 active blockers
   - Critical: > 5 active blockers
   - Alert: > 48h blocker age

3. Pipeline Thresholds:
   - Warning: < 70% flow efficiency
   - Critical: < 50% flow efficiency
   - Alert: > 30% return rate

## Prohibited Actions
- Incomplete validation
- Missing requirements
- Unclear decisions
- Undocumented findings
- State loss
- Cross-chain communication
- Direct implementation
- Unauthorized changes
- Skipping validations
- Missing evidence