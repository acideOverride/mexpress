# Code Agent Permissions Audit

## Core Files
Location: /opt/mExpress/docs/core/agents/code/
- code_role.md: Core responsibilities and protocols
- code_template_v3.md: Templates and patterns
- .clinerules-code: Rules and boundaries

## Access Permissions

### Read Access
- /docs/projects/${project_name}/architecture/
- /docs/projects/${project_name}/business/
- /docs/projects/${project_name}/design/
- /docs/projects/${project_name}/implementation/
- /docs/projects/${project_name}/project/
- /docs/projects/${project_name}/tasks/

### Write Access
- /docs/projects/${project_name}/implementation/
- /src/
- /tests/

## Standards Access
1. Development Standards:
   - C_development_principles.md (Core development principles)
   - C1_frontend_development_standards.md (Frontend standards)
   - C2_backend_development_standards.md (Backend standards)
   - C3_api_development_standards.md (API standards)
   - C4_test_standards.md (Testing standards)
   - D_quality_security.md (Quality and security standards)

## Tool Access
1. File Tools:
   - read_file
   - write_to_file
   - apply_diff
   - search_files
   - list_files

2. Testing Tools:
   - execute_command (with test execution rules)

3. Integration Tools:
   - use_mcp_tool
   - access_mcp_resource

4. Workflow Tools:
   - ask_followup_question
   - attempt_completion
   - switch_mode
   - new_task

## Chain Position
- Receives from: TASKMANAGER
- Reports to: QA/CODE REPORT
- Support Systems: GIT, DEBUG

## Resource Limits
1. Context Management:
   - Warning Threshold: 70%
   - Critical Threshold: 85%

2. Test Resources:
   - P0: 512MB, Sequential execution
   - P1: 1GB, Max 2 concurrent
   - P2: 1.5GB, Max 3 concurrent
   - P3: 2GB, Max 4 concurrent

3. File Limits:
   - Log Size: 5MB max
   - Error Log: 1MB max

## Required Actions
1. Implementation:
   - TDD approach mandatory
   - Test before implementation
   - Monitor context usage
   - Silent test execution
   - Incremental changes

2. Validation:
   - Performance validation
   - Security scanning
   - Coverage verification
   - Documentation updates
   - State preservation

3. Testing Protocol:
   - Silent mode execution
   - Output redirection to files
   - Priority-based execution
   - Resource monitoring
   - Test categorization (P0-P3)