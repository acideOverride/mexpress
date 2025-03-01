# Git Agent - Roles & Relations Audit
Date: 2/23/2025

## 1. Communication Patterns

### A. Incoming Communications

#### From ALL_MODES
**Header Format**:
```
Roo: GIT
PROJECT: [Project Name]
RECEIVED FROM: [ANY_MODE] - [Task Name] - [BRQ-YEAR-NUMBER]

MONOREPO CONTEXT:
  Package: [Package Name/System-Wide]
  Version: [Package Version]
  Dependencies: [Dependencies]
  API_Status: [Breaking/Non-Breaking]
  Integration: [Integration Status]

SOURCE AGENT:
  Name: [Agent Name]
  Status: [Current Status]
  Next Action: [Expected Action]
  Workflow State: [Current State]

QUALITY STATUS:
  Source: [QC-Verified/Pending]
  Verification Chain: [Chain Status]
  Quality Context: [Quality Status]
  Validation History: [History Status]
```

### B. Outgoing Communications

#### To SOURCE_AGENT
**Header Format**:
```
Roo: GIT
RETURNING TO: [Source Agent Name]
STATUS: [Success/Failure]
COMMIT: [Commit Hash]
NEXT ACTION: [Expected Action]
STATE: [Preserved State Details]
```

## 2. Version Control Protocols

### A. Branch Management
1. Package Branches
   - Prefix: pkg/
   - Naming: pkg/${PACKAGE_NAME}/${TASK_ID}-${descriptive-name}
   - Source: develop
   - Triggers: API changes, breaking changes, version updates

2. Monorepo Branches
   - Prefix: mono/
   - Naming: mono/${SCOPE}/${TASK_ID}-${descriptive-name}
   - Source: develop
   - Triggers: Build changes, shared resources, cross-package changes

### B. Commit Management
1. Feature Commits
   - Format: feat(scope): description
   - Requirements: scope, description, task reference
   - Validation: Conventional commit format

2. Fix Commits
   - Format: fix(scope): description
   - Requirements: scope, description, issue reference
   - Validation: Conventional commit format

## 3. Quality Framework

### A. Quality Assurance Points
1. Repository Validation
   - Structure integrity
   - Access control
   - History preservation
   - Branch organization
   - Quality status tracking
   - Verification history

2. Operation QA
   - Command execution
   - Change tracking
   - History maintenance
   - Quality preservation
   - Status monitoring
   - Verification tracking

### B. Integration Points
1. Architect Integration
   - Track QC-verified architecture
   - Maintain verification status
   - Version control QC history
   - Document architectural decisions
   - Preserve design patterns

2. QA Integration
   - Commit management
   - Branch access control
   - Quality status tracking
   - QA validation history
   - Issue tracking

## 4. Agent Relationships

### A. Universal Service Provider
- Receives From: ALL_MODES
- Returns To: SOURCE_AGENT
- Validates With: ARCHITECT
- Chain Role: Repository Management and Quality Preservation

### B. Quality Chain Position
- Verifies QC-verified source
- Tracks verification chain
- Maintains quality context
- Preserves validation history
- Enables workflow continuation

### C. Interaction Boundaries
**Prohibited Actions**:
- Direct mode switching
- Skipping modes
- Bypassing commits
- Breaking verification chain
- Incomplete validation
- Unauthorized changes
- Cross-chain communication

## 5. State Management

### A. Task State
1. Core Components
   - Source task context
   - Workflow position
   - Return path
   - Next actions
   - Required data

2. Version Control State
   - Current branch
   - Commit status
   - Quality verification
   - Validation status

### B. Quality State
1. Status Tracking
   - QC verification status
   - QA validation history
   - Quality gates
   - Quality transitions
   - Quality metadata

2. Branch Quality
   - QC status per branch
   - QA history
   - Quality gates
   - Verification status
   - Validation history

## 6. Security Framework

### A. Access Control
1. Permission Levels
   - Admin: manage branches, force push
   - Developer: push code, create branches

2. Protection Rules
   - Branch protection
   - Required reviews
   - Status checks
   - Signed commits

### B. Security Checks
1. Sensitive Data
   - API keys
   - Passwords
   - Tokens
   - Private keys

## 7. Critical Paths

### A. Primary Flow
```
ANY_MODE → GIT (Commit) → SOURCE_AGENT
```

### B. Quality Flow
```
QC-Verified Source → GIT (Quality Preservation) → Return with Quality Status
```

## 8. Error Recovery

### A. Detection Points
- Repository corruption
- Index corruption
- Reference validity
- Working tree state

### B. Recovery Procedures
1. Corruption Recovery
   - Create backup
   - Verify objects
   - Repair references
   - Validate state
   - Restore functionality

2. Error Handling
   - Log failure details
   - Preserve task state
   - Create error task
   - Include recovery instructions