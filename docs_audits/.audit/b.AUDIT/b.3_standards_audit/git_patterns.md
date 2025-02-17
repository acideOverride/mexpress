# GIT Agent Pattern Extraction

## XML Patterns (from git_template_v3.md)

### Core Configuration Pattern
```xml
<identity>
    <version>3.1</version>
    <role>git</role>
    <purpose>Manage version control and code changes with task-based workflow and state preservation</purpose>
</identity>
```
USAGE: Agent identity and version tracking
VARIATIONS: Version number, role focus on version control

### Workspace Pattern
```xml
<boundaries>
    <workspace>
        <primary_path>/docs/git/</primary_path>
        <allowed_operations>
            <read><paths>[list]</paths></read>
            <write><paths>[list]</paths></write>
        </allowed_operations>
    </workspace>
</boundaries>
```
USAGE: Define workspace boundaries and permissions
VARIATIONS: Primary path, read/write paths include source control

### State Pattern
```xml
<essential_state>
    <current_task>
        <id>string</id>
        <status>string</status>
        <source_task_ref>string</source_task_ref>
        <source_role>string</source_role>
        <next_action>string</next_action>
        <workflow_state>string</workflow_state>
    </current_task>
    <version_control_state>
        <current_branch>[details]</current_branch>
        <commit_status>[details]</commit_status>
    </version_control_state>
</essential_state>
```
USAGE: Track git operations and source state
VARIATIONS: Includes version control specific state

## Role Patterns (from git_role.md)

### Task Reception Header
```
Roo: GIT
PROJECT: [Project Name]
RECEIVED FROM: [ANY_MODE] - [Task Name] - [BRQ-YEAR-NUMBER]
SOURCE AGENT:
  Name: [Agent Name]
  Status: [Current Status]
  Next Action: [Expected Action]
  Workflow State: [Current State]
COMMIT TYPE: [Feature/Fix/Docs/Refactor]
SCOPE: [Component/Module Name]
```
USAGE: Standardized task reception format
VARIATIONS: Source agent tracking, commit type focus

### Task Return Header
```
Roo: GIT
RETURNING TO: [Source Agent Name]
STATUS: [Success/Failure]
COMMIT: [Commit Hash]
NEXT ACTION: [Expected Action]
STATE: [Preserved State Details]
ERROR: [Error Details If Any]
```
USAGE: Standardized return format
VARIATIONS: Includes commit hash, preserved state

### Chain Position Pattern
```markdown
## Mode Chain Position
- Position: Version Control phase
- Receives From: ALL_MODES
- Returns To: SOURCE_AGENT
- Chain Role: Repository Management
```
USAGE: Define agent's position in workflow
VARIATIONS: Receives from all, returns to source

## Rules Patterns (from .clinerules-git)

### Core Configuration Pattern
```yaml
mode: git
description: "Version control and code changes management"
version: "1.0.0"

responsibilities:
  - Repository management
  - Version control
  - Branch management
  - Merge handling
  - Commit validation
  - History preservation

docs_path: /opt/mExpress/docs/git/
```
USAGE: Basic agent configuration
VARIATIONS: Version control specific responsibilities

### Commit Management Pattern
```yaml
commit_management:
  commit_types:
    - type: feature
      prefix: feat
      format: ${prefix}(${scope}): ${description}
      requirements: [list]
    - type: fix
      prefix: fix
      format: ${prefix}(${scope}): ${description}
      requirements: [list]
```
USAGE: Define commit structures
VARIATIONS: Unique to GIT agent

### Branch Management Pattern
```yaml
branch_management:
  branch_types:
    - name: feature
      prefix: feature/
      source: develop
      naming_convention: feature/${TASK_ID}-${descriptive-name}
    - name: hotfix
      prefix: hotfix/
      source: main
      naming_convention: hotfix/${VERSION}-${issue-description}
```
USAGE: Define branch structures
VARIATIONS: Unique to GIT agent

## Integration Patterns

### Source Agent Return
```
Roo: GIT
RETURNING TO: [Source Agent]
STATUS: [Success/Failure]
COMMIT: [Commit Hash]
NEXT ACTION: [Expected Action]
STATE: [Preserved State Details]
```
USAGE: Return to source agent format
VARIATIONS: Includes commit details

### Error Handling
```yaml
error_handling:
  scenarios:
    - trigger: commit_failure
      actions: [list]
    - trigger: state_corruption
      actions: [list]
```
USAGE: Define error handling
VARIATIONS: Version control specific errors

## Standardization Opportunities

### Version Control Integration
- Standardize commit formats
- Define branch structures
- Establish naming conventions
- Create error handling patterns

### State Preservation
- Standardize state tracking
- Define preservation rules
- Establish recovery procedures
- Create validation methods

### Return Flow
- Standardize return formats
- Define state preservation
- Establish error handling
- Create workflow continuation