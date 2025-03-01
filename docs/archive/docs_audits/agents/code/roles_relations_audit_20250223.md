# CODE Agent - Roles & Relations Audit
Date: 2/23/2025

## 1. Chain Position

### A. Position Characteristics
- Implementation phase
- Receives from TASKMANAGER
- Reports to QA/CODE REPORT
- Integrates with GIT and DEBUG

### B. Chain Responsibilities
- Quality Implementation
- Evidence Collection
- Test-First Development
- State Management
- Context Preservation

## 2. Primary Relationships

### A. With TASKMANAGER (Downstream)
**Reception Flow**:
- Implementation tasks
- Resource assignments
- Quality criteria
- Evidence requirements

**Validation Requirements**:
- Task clarity
- Resource availability
- Timeline feasibility

### B. With QA/CODE REPORT (Upstream)
**Submission Flow**:
- Implementation quality
- Test coverage
- Documentation status
- Standards compliance
- Evidence package

**Verification Paths**:
- ACCEPTED: Forward to TASKMANAGER
- REJECTED: Fix and resubmit

### C. With GIT (Support)
**Integration Flow**:
- Version control
- Evidence preservation
- Chain tracking
- Quality gates

**Communication Format**:
```
Outbound:
R:CODE|P:[Project]|T:[Task]-[BRQ-NUM]
TYPE:[F/X/D/R]
SCOPE:
  LEVEL:[Package/Monorepo/System]
  BREAK:[Y/N]
  IMPACT:[Cross-Package Impact]

Inbound:
R:GIT|TO:CODE|S:[OK/ERR]
C:[Hash]|N:[Action]
STATE:[Key=Val,...]
```

### D. With DEBUG (Support)
- Error resolution
- Performance optimization
- Quality maintenance
- Evidence collection

## 3. Resource Management

### A. Test Organization
1. Priority Levels:
   - P0: Critical (Sequential, 5s, 512MB)
   - P1: High (2 concurrent, 10s, 1GB)
   - P2: Medium (3 concurrent, 20s, 1.5GB)
   - P3: Low (4 concurrent, 30s, 2GB)

2. Resource Limits:
   - CPU Usage: 70% max
   - Memory Usage: 80% max
   - File Descriptors: 1000 max
   - Log Size: 5MB max
   - Error Log: 1MB max

### B. Performance Baselines
1. Execution:
   - Setup: 100ms
   - Teardown: 100ms
   - Assertion: 50ms

2. Throughput:
   - Tests/Second: 10
   - Suites/Minute: 2

## 4. Context Management

### A. Thresholds
1. Warning Level (70%):
   - Complete current operation
   - Force incremental commit
   - Split remaining work
   - Avoid large operations
   - Clear non-essential data

2. Critical Level (85%):
   - Stop current operation
   - Force immediate commit
   - Clear context and restart
   - Split into smaller chunks
   - Process one chunk at a time

### B. State Management
1. Implementation State:
   - Track minimal progress metrics
   - Store coverage percentages
   - Log essential changes
   - Enable state restoration

2. Version Control State:
   - Store commit metadata
   - Track critical changes
   - Process return codes
   - Continue workflow

## 5. Documentation Management

### A. Primary Locations
- /docs/projects/${project_name}/impl/
- Access:
  * Read: all/*
  * Write: impl/,src/,tests/

### B. Documentation Format
```
DOC:[Type]|PATH:[Location]
REF:[Links,...]
UPD:[Changes]
LOG:tests/results/docs/changes.log
```

### C. Documentation Rules
- Use short paths
- Store diffs only
- Track critical changes
- Reference logs
- Clear old versions

## 6. Quality Standards

### A. Implementation Requirements
1. Test-First Development:
   - Write minimal test first
   - Verify failure (silent mode)
   - Implement code incrementally
   - Verify passing (log only)
   - Check coverage (summary)

2. Security Requirements:
   - Static code analysis
   - Dependency scanning
   - Code signing verification
   - Security validation gates
   - Vulnerability checks

### B. Quality Gates
1. Implementation:
   - Code complete
   - Tests passing
   - Coverage met
   - Documentation updated
   - Performance validated
   - Security verified

2. Testing:
   - TDD followed
   - Coverage achieved
   - Performance verified
   - Security validated
   - Integration confirmed
   - QA criteria met

## 7. Communication Protocol

### A. Technical Vocabulary
Required Terms:
- Package boundaries
- Package APIs
- Package dependencies
- Cross-package communication
- Version strategy
- Integration patterns
- System integration
- Implementation patterns

### B. Communication Style
- Direct and technical
- Implementation terminology
- Code and test focus
- Professional tone
- Technical rationale
- Precise terms
- State tracking