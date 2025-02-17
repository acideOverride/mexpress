# Agent Payload Formats

## 1. Input Layer Payloads

### 1.1 ASK → ARCHITECT
```yaml
Business_Requirements_Payload:
  context:
    business_needs: string
    success_criteria: string[]
    constraints: string[]
  requirements:
    functional: string[]
    non_functional: string[]
  validation:
    acceptance_criteria: string[]
    business_rules: string[]
  documentation:
    references: string[]
    attachments: string[]
```

### 1.2 UXUI → ARCHITECT
```yaml
Design_Specifications_Payload:
  design_system:
    patterns: string[]
    components: string[]
    guidelines: string[]
  specifications:
    ui_components: object[]
    ux_flows: object[]
    interactions: object[]
  validation:
    design_rules: string[]
    accessibility: string[]
  documentation:
    mockups: string[]
    prototypes: string[]
```

## 2. Main Chain Payloads

### 2.1 ARCHITECT → QC/GPM
```yaml
ARCH_Payload:
  technical_specs:
    architecture: object
    patterns: string[]
    components: object[]
  decisions:
    rationale: string[]
    trade_offs: string[]
  implementation:
    guidelines: string[]
    constraints: string[]
  validation:
    standards: string[]
    requirements: string[]
```

### 2.2 GPM → TASK MANAGER
```yaml
GPM_Payload:
  project:
    milestones: object[]
    timeline: object
    resources: object[]
  planning:
    phases: object[]
    dependencies: object[]
  allocation:
    teams: object[]
    skills: string[]
  tracking:
    metrics: object[]
    checkpoints: string[]
```

### 2.3 TASK MANAGER → CODE
```yaml
TM_Payload:
  tasks:
    implementation: object[]
    testing: object[]
    documentation: object[]
  resources:
    assignments: object[]
    schedule: object
  requirements:
    technical: string[]
    quality: string[]
  tracking:
    progress: object
    dependencies: object[]
```

## 3. Quality Reports

### 3.1 QA/CODE Report
```yaml
CODE_QA_Report:
  implementation:
    coverage: number
    quality: object
    issues: string[]
  testing:
    results: object
    failures: string[]
  documentation:
    completeness: number
    issues: string[]
  recommendations:
    improvements: string[]
    priorities: string[]
```

### 3.2 QA/TASK MANAGER Report
```yaml
TM_QA_Report:
  task_management:
    completion: number
    efficiency: object
    issues: string[]
  resource_usage:
    allocation: object
    bottlenecks: string[]
  timeline:
    adherence: number
    delays: string[]
  recommendations:
    improvements: string[]
    priorities: string[]
```

### 3.3 QA/GPM Report
```yaml
GPM_QA_Report:
  project_management:
    milestone_status: object
    resource_efficiency: object
    issues: string[]
  progress:
    completion: number
    risks: string[]
  quality:
    metrics: object
    issues: string[]
  recommendations:
    improvements: string[]
    priorities: string[]
```

## 4. Support Payloads

### 4.1 DEBUG Support
```yaml
Debug_Context:
  error:
    type: string
    message: string
    stack: string
  context:
    state: object
    environment: object
  analysis:
    root_cause: string
    impact: string[]
  resolution:
    steps: string[]
    verification: string[]
```

## 5. Quality Control

### 5.1 QC Verification
```yaml
QC_Verification:
  submission:
    type: string
    content: object
  verification:
    standards: string[]
    requirements: string[]
  results:
    status: "accepted" | "rejected"
    issues: string[]
  feedback:
    required_changes: string[]
    recommendations: string[]
```

## Payload Flow Summary

1. Requirements Flow:
   - ASK → Business_Requirements_Payload → ARCHITECT
   - UXUI → Design_Specifications_Payload → ARCHITECT

2. Implementation Flow:
   - ARCHITECT → ARCH_Payload → QC → GPM
   - GPM → GPM_Payload → TASK MANAGER
   - TASK MANAGER → TM_Payload → CODE

3. Quality Flow:
   - CODE → CODE_QA_Report → QA
   - TASK MANAGER → TM_QA_Report → QA
   - GPM → GPM_QA_Report → QA

4. Support Flow:
   - CODE ↔ Debug_Context ↔ DEBUG

5. Quality Control:
   - ARCHITECT → QC_Verification → GPM

All payloads maintain consistent structure and format throughout the workflow.