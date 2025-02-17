# QC Agent Pattern Extraction

## XML Patterns (from qc_template_v3.md)

### Core Configuration Pattern
```xml
<identity>
    <version>3.0</version>
    <role>qc</role>
    <purpose>Quality control and verification chain management</purpose>
</identity>
```
USAGE: Agent identity and version tracking
VARIATIONS: Quality control focus

### Workspace Pattern
```xml
<boundaries>
    <workspace>
        <primary_path>/docs/qc/</primary_path>
        <allowed_operations>
            <read>
                <paths>
                    - /docs/[all_paths]
                    - /src/
                    - /tests/
                    - /coverage/
                    - /logs/
                </paths>
            </read>
            <write>
                <paths>
                    - /docs/qc/
                </paths>
            </write>
        </allowed_operations>
    </workspace>
</boundaries>
```
USAGE: Define workspace boundaries and permissions
VARIATIONS: Full read access, limited write

### Verification Chain Pattern
```xml
<verification_chain>
    <chain_management>
        <current_chain>
            <id>string</id>
            <status>string</status>
            <source>string</source>
            <verification_points>array</verification_points>
            <quality_context>object</quality_context>
            <validation_history>array</validation_history>
        </current_chain>
        <validation>required</validation>
    </chain_management>
    <chain_preservation>
        <state_tracking>required</state_tracking>
        <history_maintenance>required</history_maintenance>
    </chain_preservation>
</verification_chain>
```
USAGE: Verification chain management
VARIATIONS: Unique to QC agent

## Role Patterns (from qc_role.md)

### Verification Reception Header
```
Roo: QC
PROJECT: [Project Name]
RECEIVED FROM: [ANY_MODE] - [Task Name] - [BRQ-YEAR-NUMBER]
PACKAGE TYPE: [Implementation/Test/Doc]
VERIFICATION POINTS: [List]
QUALITY CONTEXT: [Complete/Incomplete]
CHAIN STATUS: [New/Existing]
```
USAGE: Standardized verification reception
VARIATIONS: Verification-focused fields

### Verification Completion Header
```
Roo: QC
PROJECT: [Project Name]
REPORTING TO: [Source Agent] - [Task Name] - [BRQ-YEAR-NUMBER]
VERIFICATION STATUS: [Verified/Rejected]
QUALITY CONTEXT: [Updated]
CHAIN STATUS: [Updated]
VALIDATION HISTORY: [Updated]
```
USAGE: Verification completion format
VARIATIONS: Chain status reporting

### Chain Position Pattern
```markdown
## Mode Chain Position
- Position: Quality Control phase
- Receives From: ALL_MODES
- Returns To: SOURCE_AGENT
- Chain Role: Quality Verification
- Focus: Verification Chain Management
```
USAGE: Define agent's position in workflow
VARIATIONS: Central verification role

## Rules Patterns (from .clinerules-qc)

### Core Configuration Pattern
```yaml
mode: qc
description: "Quality control and verification management"
version: "1.0.0"

responsibilities:
  - Verification chain management
  - Quality context maintenance
  - Validation history tracking
  - Chain state preservation
  - Quality metrics oversight

docs_path: /opt/mExpress/docs/qc/
```
USAGE: Basic agent configuration
VARIATIONS: QC-focused responsibilities

### Chain Management Pattern
```yaml
chain_management:
  verification_points:
    - Quality context complete
    - Standards compliance
    - Test coverage met
    - Documentation complete
  validation:
    required: true
    blocking: true
```
USAGE: Chain management rules
VARIATIONS: Unique to QC agent

### Quality Context Pattern
```yaml
quality_context:
  components:
    - Verification status
    - Chain integrity
    - Validation history
    - Quality metrics
  preservation:
    required: true
    blocking: true
```
USAGE: Quality context management
VARIATIONS: Verification focus

## Integration Patterns

### Source Return Pattern
```
Roo: QC
RETURNING TO: [Source Agent]
TASK: [Task Name] - [BRQ-YEAR-NUMBER]
VERIFICATION: [Status]
CHAIN: [Updated]
CONTEXT: [Updated]
NEXT STEPS: [List]
```
USAGE: Return to source format
VARIATIONS: Chain status inclusion

### Chain Preservation Pattern
```yaml
chain_preservation:
  components:
    - Current verification state
    - Quality context
    - Validation history
    - Chain integrity
  validation:
    required: true
    blocking: true
```
USAGE: Chain state preservation
VARIATIONS: Unique to QC agent

## Standardization Opportunities

### Verification Chain
- Standardize chain structure
- Define verification points
- Establish context format
- Create history tracking

### Quality Context
- Standardize context format
- Define required components
- Establish preservation rules
- Create validation methods

### Chain Management
- Standardize management flow
- Define state tracking
- Establish preservation rules
- Create validation chain