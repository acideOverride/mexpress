# QA Agent Pattern Extraction

## XML Patterns (from qa_template_v3.md)

### Core Configuration Pattern
```xml
<identity>
    <version>3.0</version>
    <role>qa</role>
    <purpose>Quality assurance and testing validation with comprehensive coverage</purpose>
</identity>
```
USAGE: Agent identity and version tracking
VARIATIONS: Quality assurance focus

### Workspace Pattern
```xml
<boundaries>
    <workspace>
        <primary_path>/docs/qa/</primary_path>
        <allowed_operations>
            <read>
                <paths>
                    - /docs/[standard_paths]
                    - /src/
                    - /tests/
                    - /coverage/
                    - /logs/
                </paths>
            </read>
            <write>
                <paths>
                    - /docs/qa/
                    - /tests/
                    - /coverage/
                    - /logs/
                </paths>
            </write>
        </allowed_operations>
    </workspace>
</boundaries>
```
USAGE: Define workspace boundaries and permissions
VARIATIONS: Extended test access

### Quality Management Pattern
```xml
<quality_management>
    <coverage_requirements>
        <unit_tests>
            <threshold>90</threshold>
            <critical_paths>100</critical_paths>
        </unit_tests>
        <integration_tests>
            <threshold>85</threshold>
            <api_coverage>100</api_coverage>
        </integration_tests>
        <e2e_tests>
            <threshold>80</threshold>
            <user_flows>100</user_flows>
        </e2e_tests>
    </coverage_requirements>
    <validation>required</validation>
</quality_management>
```
USAGE: Quality metrics management
VARIATIONS: Unique to QA agent

## Role Patterns (from qa_role.md)

### Task Reception Header
```
Roo: QA
PROJECT: [Project Name]
RECEIVED FROM: [CODE] - [Task Name] - [BRQ-YEAR-NUMBER]
TEST TYPE: [Unit/Integration/E2E]
COVERAGE REQUIREMENTS:
    - Unit: [Threshold]
    - Integration: [Threshold]
    - E2E: [Threshold]
QUALITY GATES: [List]
```
USAGE: Standardized task reception format
VARIATIONS: Test-focused requirements

### Task Completion Header
```
Roo: QA
PROJECT: [Project Name]
REPORTING TO: QC - [Task Name] - [BRQ-YEAR-NUMBER]
TEST STATUS:
    - Unit Coverage: [Metrics]
    - Integration Coverage: [Metrics]
    - E2E Coverage: [Metrics]
QUALITY GATES: [Status]
VERIFICATION: [Complete/Pending]
```
USAGE: Test completion format
VARIATIONS: Coverage reporting focus

### Chain Position Pattern
```markdown
## Mode Chain Position
- Position: Quality Assurance phase
- Receives From: CODE
- Reports To: QC
- Chain Role: Quality Validation
- Focus: Test Coverage and Quality
```
USAGE: Define agent's position in workflow
VARIATIONS: Quality assurance focus

## Rules Patterns (from .clinerules-qa)

### Core Configuration Pattern
```yaml
mode: qa
description: "Quality assurance and test validation"
version: "1.0.0"

responsibilities:
  - Test validation
  - Coverage verification
  - Quality metrics
  - Performance testing
  - Security validation
  - Documentation review

docs_path: /opt/mExpress/docs/qa/
```
USAGE: Basic agent configuration
VARIATIONS: QA-focused responsibilities

### Test Framework Pattern
```yaml
test_framework:
  coverage_types:
    - unit:
        threshold: 90
        critical: 100
    - integration:
        threshold: 85
        api: 100
    - e2e:
        threshold: 80
        flows: 100
  validation:
    required: true
    blocking: true
```
USAGE: Test framework definition
VARIATIONS: Unique to QA agent

### Quality Gates Pattern
```yaml
quality_gates:
  testing:
    - Coverage thresholds met
    - Critical paths covered
    - Performance validated
    - Security verified
  
  validation:
    - Documentation complete
    - Tests automated
    - CI/CD integrated
    - Monitoring configured
```
USAGE: Define quality control points
VARIATIONS: Test-focused gates

## Integration Patterns

### QC Integration
```
Roo: QA
SUBMITTING TO: QC - [Task Name] - [BRQ-YEAR-NUMBER]
PACKAGE TYPE: [Test Coverage]
SCOPE: [Component/Module]
COVERAGE:
    - Unit: [Metrics]
    - Integration: [Metrics]
    - E2E: [Metrics]
VERIFICATION POINTS: [List]
```
USAGE: QC submission format
VARIATIONS: Coverage-focused verification

### Test Execution Pattern
```yaml
test_execution:
  sequence:
    - Unit tests
    - Integration tests
    - E2E tests
    - Performance tests
  validation:
    - Coverage metrics
    - Performance baselines
    - Security checks
  reporting:
    - Coverage reports
    - Performance metrics
    - Security findings
```
USAGE: Test execution management
VARIATIONS: Unique to QA agent

## Standardization Opportunities

### Test Management
- Standardize coverage thresholds
- Define test types
- Establish execution flow
- Create validation rules

### Quality Metrics
- Standardize metrics collection
- Define reporting formats
- Establish baselines
- Create comparison methods

### Verification Chain
- Standardize verification points
- Define evidence requirements
- Establish validation flow
- Create quality gates