# DEBUGGER Agent Pattern Extraction

## XML Patterns (from debugger_template_v3.md)

### Core Configuration Pattern
```xml
<identity>
    <version>3.0</version>
    <mode>debugger</mode>
    <purpose>Analyze and resolve technical issues with comprehensive debugging capabilities</purpose>
</identity>
```
USAGE: Agent identity and version tracking
VARIATIONS: Debug-focused purpose

### Workspace Pattern
```xml
<boundaries>
    <workspace>
        <primary_path>/docs/debug/</primary_path>
        <allowed_operations>
            <read>
                <paths>
                    - /docs/[standard_paths]
                    - /src/
                    - /tests/
                    - /logs/
                </paths>
            </read>
            <write>
                <paths>
                    - /docs/debug/
                    - /src/
                    - /tests/
                    - /logs/
                </paths>
            </write>
        </allowed_operations>
    </workspace>
</boundaries>
```
USAGE: Define workspace boundaries and permissions
VARIATIONS: Extended access to source/test/logs

### Context Management Pattern
```xml
<context_management>
    <thresholds>
        <warning>70</warning>
        <critical>85</critical>
    </thresholds>
    <monitoring_points>
        <debug_specific>
            - Before loading debug logs
            - Before stack trace analysis
            - Before loading system state
            - After each debug operation
        </debug_specific>
        <data_handling>
            - Load logs incrementally
            - Process stack traces in chunks
            - Stream system state data
            - Use pagination for large outputs
        </data_handling>
    </monitoring_points>
</context_management>
```
USAGE: Debug-specific context management
VARIATIONS: Debug-focused monitoring points

## Role Patterns (from debugger_role.md)

### Issue Reception Header
```
Roo: DEBUGGER
PROJECT: [Project Name]
RECEIVED FROM: CODE - [Task Name] - [BRQ-YEAR-NUMBER]
ISSUE TYPE: [Bug/Performance/Security]
SEVERITY: [Critical/High/Medium/Low]
REPRODUCTION: [Steps to Reproduce]
GIT CONTEXT: [Branch/Commit Reference]
```
USAGE: Standardized issue reception format
VARIATIONS: Issue type, severity levels

### Issue Resolution Header
```
Roo: DEBUGGER
PROJECT: [Project Name]
REPORTING TO: CODE - [Task Name] - [BRQ-YEAR-NUMBER]
ISSUE STATUS: [RESOLVED/NEEDS_MORE_INFO]
ROOT CAUSE: [Description]
RESOLUTION: [Fix Description]
PREVENTION: [Future Prevention Steps]
GIT STATUS: [COMMITTED/PENDING]
```
USAGE: Standardized resolution format
VARIATIONS: Debug-specific fields

### Chain Position Pattern
```markdown
## Mode Chain Position
- Position: Debug phase
- Receives From: CODE
- Reports To: CODE
- Validates With: GIT
- Chain Role: Issue Resolution
- Focus: Technical Problem-Solving
```
USAGE: Define agent's position in workflow
VARIATIONS: Debug-specific role and focus

## Rules Patterns (from .clinerules-debugger)

### Core Configuration Pattern
```yaml
mode: debugger
description: "Issue analysis and resolution with debugging capabilities"
version: "1.0.0"

responsibilities:
  - Issue analysis
  - Root cause identification
  - Resolution validation
  - Regression testing
  - Performance profiling
  - Security verification
  - Prevention planning

docs_path: /opt/mExpress/docs/debug/
```
USAGE: Basic agent configuration
VARIATIONS: Debug-focused responsibilities

### Debug Session Pattern
```yaml
debug_session:
  organization:
    - Session boundaries
    - Context preservation
    - Resource cleanup
  tracking:
    - Active sessions
    - Resource usage
    - Context limits
  cleanup:
    - Session termination
    - Resource release
    - Context reset
```
USAGE: Debug session management
VARIATIONS: Unique to DEBUGGER

### Evidence Collection Pattern
```yaml
evidence_framework:
  collection_points:
    - Issue reproduction
    - Root cause analysis
    - Fix validation
  storage:
    - Evidence location
    - Retention policy
    - Access control
```
USAGE: Debug evidence management
VARIATIONS: Unique to DEBUGGER

## Integration Patterns

### Git Integration
```
Roo: DEBUGGER
PROJECT: [Project Name]
SENDING TO: GIT - [Task Name] - [BRQ-YEAR-NUMBER]
COMMIT TYPE: [Fix/Test/Docs]
SCOPE: [Component/Module Name]
NEXT ACTION: [Expected Action]
RETURN PATH: [Workflow Details]
```
USAGE: Git interaction format
VARIATIONS: Debug-specific commit types

### Error Filtering Pattern
```yaml
error_filtering:
  output_control:
    commands:
      - test_execution
      - coverage_report
      - type_check
      - lint_check
    output_structure:
      directories:
        - coverage/
        - logs/
```
USAGE: Error output management
VARIATIONS: Unique to DEBUGGER

## Standardization Opportunities

### Debug Session Management
- Standardize session boundaries
- Define resource management
- Establish cleanup procedures
- Create tracking methods

### Evidence Collection
- Standardize collection points
- Define storage requirements
- Establish retention policies
- Create access controls

### Error Management
- Standardize output formats
- Define filtering rules
- Establish logging patterns
- Create recovery procedures