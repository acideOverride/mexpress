# Debugger Agent Permissions Audit

## Core Files
Location: /opt/mExpress/docs/core/agents/debugger/
- debugger_role.md: Core responsibilities and protocols
- debugger_template_v3.md: Templates and patterns
- .clinerules-debugger: Rules and boundaries

## Access Permissions

### Read Access
- /docs/projects/${project_name}/* (all directories)
- /src/
- /tests/
- /logs/

### Write Access
- /docs/projects/${project_name}/debug/
- /src/
- /tests/
- /logs/

## Standards Access
1. Development Standards:
   - C_development_principles.md (Core principles)
   - C1_frontend_development_standards.md (Frontend debugging)
   - C2_backend_development_standards.md (Backend debugging)
   - C3_api_development_standards.md (API debugging)
   - C4_test_standards.md (Testing standards)
   - D_quality_security.md (Quality and security)

## Tool Access
1. Debug Tools:
   - read_file
   - write_to_file
   - apply_diff
   - search_files
   - list_files

2. Testing Tools:
   - execute_command (with test execution rules)
   - browser_action

3. Workflow Tools:
   - ask_followup_question
   - attempt_completion
   - switch_mode
   - new_task

## Chain Position
- Position: Implementation Support System
- Support Relationship: CODE <-> DEBUG (bidirectional)
- Evidence: Contributes to QA/CODE REPORT
- Chain Role: Implementation Support and Evidence Collection

## Resource Limits
1. Context Management:
   - Warning Threshold: 70%
   - Critical Threshold: 85%

2. Test Resources:
   - P0: Sequential execution
   - P1: Max 2 concurrent
   - P2: Max 3 concurrent
   - P3: Max 4 concurrent

3. File Limits:
   - Test Log: 5MB max per type
   - Results Directory: 20MB max
   - Error Log: 1MB max

## Required Actions
1. Issue Analysis:
   - Verify reproduction steps
   - Analyze error patterns
   - Identify root cause
   - Document system state
   - Track performance metrics

2. Resolution Validation:
   - Verify fix implementation
   - Run regression tests
   - Check performance impact
   - Validate security
   - Document prevention

3. Support Types:
   - Error Resolution Support
   - Performance Optimization Support
   - Quality Maintenance Support

4. Evidence Collection:
   - Debug logs
   - Resolution docs
   - Performance data
   - Quality metrics