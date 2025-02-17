# UXUI Agent Pattern Extraction

## XML Patterns (from uxui_template_v3.md)

### Core Configuration Pattern
```xml
<identity>
    <version>3.0</version>
    <role>uxui</role>
    <purpose>User experience and interface design with accessibility focus</purpose>
</identity>
```
USAGE: Agent identity and version tracking
VARIATIONS: UX/UI design focus

### Workspace Pattern
```xml
<boundaries>
    <workspace>
        <primary_path>/docs/design/</primary_path>
        <allowed_operations>
            <read>
                <paths>
                    - /docs/[standard_paths]
                    - /docs/design/
                    - /docs/mockups/
                </paths>
            </read>
            <write>
                <paths>
                    - /docs/design/
                    - /docs/mockups/
                </paths>
            </write>
        </allowed_operations>
    </workspace>
</boundaries>
```
USAGE: Define workspace boundaries and permissions
VARIATIONS: Design-focused paths

### Design Management Pattern
```xml
<design_management>
    <design_system>
        <components>
            <id>string</id>
            <status>string</status>
            <accessibility>object</accessibility>
            <validation>object</validation>
        </components>
        <validation>required</validation>
    </design_system>
    <mockup_tracking>
        <current_mockup>
            <id>string</id>
            <status>string</status>
            <components>array</components>
            <validation>object</validation>
        </current_mockup>
        <validation>required</validation>
    </mockup_tracking>
</design_management>
```
USAGE: Design system management
VARIATIONS: Unique to UXUI agent

## Role Patterns (from uxui_role.md)

### Task Reception Header
```
Roo: UXUI
PROJECT: [Project Name]
RECEIVED FROM: [ARCHITECT] - [Task Name] - [BRQ-YEAR-NUMBER]
DESIGN TYPE: [Component/Layout/Flow]
ACCESSIBILITY: [Required Level]
VALIDATION POINTS: [List]
```
USAGE: Standardized task reception format
VARIATIONS: Design-focused fields

### Design Completion Header
```
Roo: UXUI
PROJECT: [Project Name]
REPORTING TO: QC - [Task Name] - [BRQ-YEAR-NUMBER]
DESIGN STATUS: [Complete/In Progress]
COMPONENTS:
    - Status: [List]
    - Accessibility: [Verified]
    - Documentation: [Complete]
VALIDATION: [Status]
```
USAGE: Design completion format
VARIATIONS: Component tracking focus

### Chain Position Pattern
```markdown
## Mode Chain Position
- Position: Design phase
- Receives From: ARCHITECT
- Reports To: QC
- Chain Role: UX/UI Design
- Focus: Accessibility and Usability
```
USAGE: Define agent's position in workflow
VARIATIONS: Design-specific role

## Rules Patterns (from .clinerules-uxui)

### Core Configuration Pattern
```yaml
mode: uxui
description: "User experience and interface design"
version: "1.0.0"

responsibilities:
  - Component design
  - Layout systems
  - Accessibility
  - Design validation
  - Documentation
  - Pattern library

docs_path: /opt/mExpress/docs/design/
```
USAGE: Basic agent configuration
VARIATIONS: Design-focused responsibilities

### Design System Pattern
```yaml
design_system:
  components:
    - Type definitions
    - Usage patterns
    - Accessibility rules
    - Validation points
  validation:
    required: true
    blocking: true
```
USAGE: Design system rules
VARIATIONS: Unique to UXUI agent

### Accessibility Pattern
```yaml
accessibility:
  requirements:
    - WCAG compliance
    - Aria labels
    - Keyboard navigation
    - Screen reader support
  validation:
    required: true
    blocking: true
```
USAGE: Accessibility management
VARIATIONS: Design focus

## Integration Patterns

### QC Integration
```
Roo: UXUI
SUBMITTING TO: QC - [Task Name] - [BRQ-YEAR-NUMBER]
PACKAGE TYPE: [Design System]
SCOPE: [Component/Layout]
VERIFICATION:
    - Accessibility
    - Usability
    - Documentation
    - Pattern Library
```
USAGE: QC submission format
VARIATIONS: Design verification focus

### Component Library Pattern
```yaml
component_library:
  management:
    - Component tracking
    - Version control
    - Usage documentation
    - Accessibility status
  validation:
    required: true
    blocking: true
```
USAGE: Component management
VARIATIONS: Unique to UXUI agent

## Standardization Opportunities

### Design System
- Standardize component structure
- Define accessibility rules
- Establish validation points
- Create documentation format

### Component Management
- Standardize tracking system
- Define version control
- Establish usage patterns
- Create validation methods

### Accessibility
- Standardize requirements
- Define validation rules
- Establish testing methods
- Create compliance checks