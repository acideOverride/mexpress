# CODE Agent Pattern Extraction

## XML Patterns (from code_template_v3.md)

### Core Configuration Pattern
```xml
<identity>
    <version>3.0</version>
    <role>code</role>
    <purpose>Implementation and testing with TDD approach and quality focus</purpose>
</identity>
```
USAGE: Agent identity and version tracking
VARIATIONS: Implementation-focused purpose

### Workspace Pattern
```xml
<boundaries>
    <workspace>
        <primary_path>/docs/implementation/</primary_path>
        <allowed_operations>
            <read>
                <paths>
                    - /docs/[standard_paths]
                    - /src/
                    - /tests/
                    - /coverage/
                </paths>
            </read>
            <write>
                <paths>
                    - /docs/implementation/
                    - /src/
                    - /tests/
                    - /coverage/
                </paths>
            </write>
        </allowed_operations>
    </workspace>
</boundaries>
```
USAGE: Define workspace boundaries and permissions
VARIATIONS: Extended access to implementation paths

### Test Management Pattern
```xml
<test_management>
    <coverage_thresholds>
        <global>
            <statements>80</statements>
            <branches>80</branches>
            <functions>80</functions>
            <lines>80</lines>
        </global>
        <core_components>
            <statements>90</statements>
            <branches>90</branches>
            <functions>90</functions>
            <lines>90</lines>
        </core_components>
    </coverage_thresholds>
    <test_requirements>
        <approach>TDD</approach>
        <validation>required</validation>
        <documentation>required</documentation>
    </test_requirements>
</test_management>
```
USAGE: Test-driven development management
VARIATIONS: Unique to CODE agent

## Role Patterns (from code_role.md)

### Task Reception Header
```
Roo: CODE
PROJECT: [Project Name]
RECEIVED FROM: [ARCHITECT/DEBUGGER] - [Task Name] - [BRQ-YEAR-NUMBER]
IMPLEMENTATION TYPE: [Feature/Fix/Refactor]
TEST REQUIREMENTS:
    - Coverage: [Thresholds]
    - TDD: Required
    - Documentation: Required
GIT CONTEXT: [Branch/Commit Reference]
```
USAGE: Standardized task reception format
VARIATIONS: Implementation and test focus

### Task Completion Header
```
Roo: CODE
PROJECT: [Project Name]
REPORTING TO: [QC] - [Task Name] - [BRQ-YEAR-NUMBER]
IMPLEMENTATION STATUS: [COMPLETED/IN_PROGRESS]
TEST STATUS:
    - Coverage: [Metrics]
    - TDD: [Verified/Pending]
    - Documentation: [Complete/Pending]
GIT STATUS: [COMMITTED/PENDING]
```
USAGE: Standardized completion format
VARIATIONS: Test-focused reporting

### Chain Position Pattern
```markdown
## Mode Chain Position
- Position: Implementation phase
- Receives From: [ARCHITECT/DEBUGGER]
- Reports To: QC
- Validates With: GIT
- Chain Role: Implementation and Testing
- Focus: TDD and Quality
```
USAGE: Define agent's position in workflow
VARIATIONS: Implementation-specific role

## Rules Patterns (from .clinerules-code)

### Core Configuration Pattern
```yaml
mode: code
description: "Implementation and testing with TDD approach"
version: "1.0.0"

responsibilities:
  - Test-first development
  - Implementation
  - Coverage maintenance
  - Documentation
  - Quality assurance
  - Error handling
  - Performance optimization

docs_path: /opt/mExpress/docs/implementation/
```
USAGE: Basic agent configuration
VARIATIONS: TDD-focused responsibilities

### Test Framework Pattern
```yaml
test_framework:
  approach: TDD
  requirements:
    - Tests before implementation
    - Coverage thresholds met
    - Documentation complete
    - Quality verified
  validation:
    required: true
    blocking: true
```
USAGE: Test framework definition
VARIATIONS: Unique to CODE agent

### Quality Gates Pattern
```yaml
quality_gates:
  implementation:
    - Test coverage met
    - TDD approach verified
    - Documentation complete
    - Performance validated
    - Security verified
  
  testing:
    - All tests passing
    - Coverage achieved
    - Documentation updated
    - QC criteria met
```
USAGE: Define quality control points
VARIATIONS: Implementation and test focus

## Integration Patterns

### QC Integration
```
Roo: CODE
SUBMITTING TO: QC - [Task Name] - [BRQ-YEAR-NUMBER]
PACKAGE TYPE: [Implementation]
SCOPE: [Component/Module]
TEST STATUS:
    - Coverage: [Metrics]
    - TDD: [Verified]
    - Documentation: [Complete]
VERIFICATION POINTS: [List]
```
USAGE: QC submission format
VARIATIONS: Test-focused verification

### Git Integration
```
Roo: CODE
SENDING TO: GIT - [Task Name] - [BRQ-YEAR-NUMBER]
COMMIT TYPE: [Feature/Fix/Test]
SCOPE: [Component/Module]
TEST STATUS: [Complete]
QC STATUS: [Pending]
```
USAGE: Git interaction format
VARIATIONS: Test status inclusion

## Standardization Opportunities

### Test Management
- Standardize coverage thresholds
- Define TDD requirements
- Establish documentation needs
- Create validation rules

### Implementation Flow
- Standardize TDD approach
- Define quality gates
- Establish documentation requirements
- Create verification points

### Quality Control
- Standardize test reporting
- Define coverage metrics
- Establish validation points
- Create verification chains