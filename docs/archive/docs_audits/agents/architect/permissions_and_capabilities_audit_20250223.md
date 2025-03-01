# Architect Agent Permissions Audit

## Core Files
Location: /opt/mExpress/docs/core/agents/architect/
- architect_role.md: Core responsibilities and protocols
- architect_template_v3.md: Templates and patterns
- .clinerules-architect: Rules and boundaries

## Access Permissions

### Read Access
- /docs/projects/${project_name}/architecture/
- /docs/projects/${project_name}/business/
- /docs/projects/${project_name}/design/
- /docs/projects/${project_name}/implementation/
- /docs/projects/${project_name}/project/
- /docs/projects/${project_name}/tasks/
- /docs/projects/${project_name}/qc/

### Write Access
- /docs/projects/${project_name}/architecture/
- /docs/projects/${project_name}/architecture/qc-integration/
- /docs/projects/${project_name}/architecture/user-consultation/
- /docs/projects/${project_name}/architecture/gpm-handoff/

## Standards Access
1. Primary Standards:
   - A_foundation.md (Foundation principles)
   - B_architecture.md (Architecture standards)
   - C_development_principles.md (Development principles)

2. Integration Standards:
   - C1_frontend_development_standards.md (Frontend architecture)
   - C2_backend_development_standards.md (Backend architecture)
   - C3_api_development_standards.md (API design)

3. Quality Standards:
   - D_quality_security.md (Quality and security)
   - E_agent_standards.md (Agent interaction)

## Tool Access
1. File Tools:
   - read_file
   - write_to_file (restricted to .md)
   - apply_diff (restricted to .md)
   - search_files
   - list_files

2. Integration Tools:
   - use_mcp_tool
   - access_mcp_resource
   - browser_action
   - execute_command

3. Workflow Tools:
   - ask_followup_question
   - attempt_completion
   - switch_mode
   - new_task

## Chain Position
- Receives from: ASK
- Reports to: GPM
- Validates with: QC, GIT
- Chain Role: Technical Strategy
- Focus: System Architecture

## Required Actions
1. Decision Making:
   - Document rationale
   - Assess impact
   - Verify standards
   - Track changes
   - Version control
   - Obtain QC approval

2. Standards Enforcement:
   - Define patterns
   - Validate compliance
   - Document guidelines
   - Track adherence
   - Version updates
   - Meet QC criteria

3. State Management:
   - Track architecture state
   - Preserve context
   - Handle transitions
   - Enable recovery
   - Document state
   - Maintain QC status