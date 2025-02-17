# Architect Role Analysis

## 1. Core Responsibilities

### 1.1 Task Handling
✓ Clear instruction requirements:
- Read and acknowledge instructions
- Verify understanding
- Confirm readiness
- Document compliance
- Validate understanding

### 1.2 Project Analysis Requirements
✓ Structured analysis process:
1. System Architecture Analysis
   - Component mapping
   - Relationship documentation
   - Integration points
   - Dependency tracking
   - Impact analysis

2. Architecture Organization Review
   - Pattern analysis
   - Structure review
   - Interface mapping
   - Findings documentation
   - Scalability assessment

## 2. QC Integration

### 2.1 Workflow Sequence
✓ Strict QC workflow:
1. Pre-QC Preparation
2. QC Submission Process
3. QC Feedback Implementation
4. Optional User Consultation
5. GPM Handoff Preparation

### 2.2 Documentation Requirements
✓ Clear documentation needs:
- Architecture design with patterns
- Comprehensive documentation
- Quality criteria verification
- Verification points
- Standards compliance
- Evidence collection

## 3. Communication Formats

### 3.1 Decision Header
✓ Standardized format:
```
Roo: ARCHITECT
PROJECT: [Project Name]
DECISION: [Decision Name] - [BRQ-YEAR-NUMBER]
IMPACT: [High/Medium/Low]
SCOPE: [System/Component/Module]
RATIONALE: [Technical Reasoning]
QC STATUS: [Not Submitted/In Review/Approved]
GIT CONTEXT: [Branch/Commit Reference]
```

### 3.2 Implementation Header
✓ Detailed implementation format:
- Project details
- Implementation status
- Phase tracking
- Impact assessment
- Standards compliance
- QC status tracking
- User consultation status
- GPM readiness
- Git status
- Evidence chain

## 4. Process Controls

### 4.1 Incremental Decision Protocol
✓ Clear process steps:
1. Decision Making Process
   - One decision at a time
   - Document rationale
   - Impact assessment
   - QC review
   - Validation
   - Dependency tracking

2. Decision Validation
   - Verification
   - Implication testing
   - Documentation
   - Progress tracking
   - Status updates
   - QC approval

### 4.2 Critical Rules
✓ Strict operational rules:
- Silent test execution
- One task at a time
- Validation requirements
- Commit requirements
- QC approval requirements

## 5. Integration Points

### 5.1 Documentation Integration
✓ Clear documentation rules:
- Read from /opt/mExpress/docs/
- Write to appropriate subdirectory
- Maintain documentation standards
- Link relevant documentation
- Update on state changes
- Version control
- QC status tracking

### 5.2 Git Integration
✓ Comprehensive git workflow:
1. Change Tracking
2. Version Control
3. State Management
4. Return Flow

## 6. Mode Management

### 6.1 Chain Position
✓ Clear position definition:
- Position: Architecture phase
- Receives From: ASK
- Reports To: GPM
- Validates With: QC, GIT
- Chain Role: Technical Strategy
- Focus: System Architecture

### 6.2 Transition Rules
✓ Clear rules:
- Prohibited actions
- Required actions
- State preservation
- QC integration

## 7. Communication Standards

### 7.1 Style Guidelines
✓ Clear communication requirements:
- Direct and technical
- Architecture terminology
- System design focus
- Professional tone
- Design rationale
- Decision documentation
- Precise terms
- Change tracking
- Commit explanation
- Context preservation
- QC status inclusion

### 7.2 Technical Vocabulary
✓ Well-defined terminology:
- Required terms
- Architecture focus
- Communication protocols

## 8. Gaps Identified

1. Context Management
   - No explicit context window management
   - Missing context size thresholds
   - No context preservation strategy

2. Performance Metrics
   - No specific performance requirements
   - Missing performance validation criteria
   - No load testing specifications

3. Error Recovery
   - Limited error recovery procedures
   - Missing retry strategies
   - No timeout handling

## 9. Recommendations

1. Add Context Management
   - Define context thresholds
   - Add preservation strategies
   - Include cleanup procedures

2. Enhance Error Handling
   - Add comprehensive recovery procedures
   - Include retry mechanisms
   - Define timeout handling

3. Add Performance Requirements
   - Define performance criteria
   - Add load testing requirements
   - Include monitoring guidelines

4. Strengthen State Management
   - Add state size limits
   - Include cleanup procedures
   - Add recovery mechanisms

## 10. Next Steps

1. Cross-reference with template_v3.md analysis
2. Update .clinerules with identified gaps
3. Implement recommended improvements
4. Verify alignment across all files
5. Document final recommendations