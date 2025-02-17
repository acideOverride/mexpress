# Standards Migration Strategy

## 1. Migration Approach

### 1.1 Core Principles
- One agent at a time
- Incremental updates
- Continuous validation
- Quality preservation
- State maintenance
- Chain integrity

### 1.2 Update Sequence
1. TASKMANAGER (Central orchestrator)
2. QC (Quality verification)
3. GIT (Version control)
4. ARCHITECT (Technical design)
5. CODE (Implementation)
6. DEBUGGER (Issue resolution)
7. QA (Quality assurance)
8. ASK (Business analysis)
9. GPM (Project management)
10. UXUI (Design)

Rationale:
- Start with core workflow agents
- Maintain quality chain
- Enable version control
- Support technical flow
- Complete business flow

## 2. Migration Steps

### 2.1 Per-Agent Process
1. Backup Phase
   ```bash
   # Create backup
   cp -r /opt/mExpress/docs_tech/docs_migration/.audit/a.PREPARATION/1.current_state/[agent]/ backup/
   ```

2. Update Phase
   - template_v3.md
   - role.md
   - .clinerules

3. Validation Phase
   - XML validation
   - Role verification
   - Rules compliance
   - Integration check

4. Quality Gates
   - Structure validation
   - Chain verification
   - State preservation
   - Documentation check

### 2.2 Validation Points
Each agent update must pass:

1. Structure Gates
   - XML schema valid
   - Required sections present
   - Extensions documented
   - Quality context complete

2. Role Gates
   - Headers standardized
   - Chain position valid
   - State management correct
   - Extensions documented

3. Rules Gates
   - Configuration valid
   - Context management complete
   - Quality framework integrated
   - Extensions documented

4. Integration Gates
   - QC integration valid
   - Git integration complete
   - State preservation working
   - Chain maintained

## 3. Rollback Procedures

### 3.1 Single Agent Rollback
```bash
# Restore from backup
rm -rf /opt/mExpress/docs_tech/docs_migration/.audit/a.PREPARATION/1.current_state/[agent]/
cp -r backup/[agent]/ /opt/mExpress/docs_tech/docs_migration/.audit/a.PREPARATION/1.current_state/
```

### 3.2 Full Rollback
```bash
# Restore all agents
rm -rf /opt/mExpress/docs_tech/docs_migration/.audit/a.PREPARATION/1.current_state/
cp -r backup/ /opt/mExpress/docs_tech/docs_migration/.audit/a.PREPARATION/1.current_state/
```

## 4. Quality Preservation

### 4.1 Chain Maintenance
- Verify chain before update
- Maintain during migration
- Validate after update
- Document changes

### 4.2 State Preservation
- Capture state before update
- Maintain during migration
- Restore after update
- Verify integrity

### 4.3 Documentation
- Update all docs
- Maintain versions
- Track changes
- Verify references

## 5. Implementation Schedule

### 5.1 Core Workflow (Week 1)
1. Day 1-2: TASKMANAGER
2. Day 3-4: QC
3. Day 5: GIT

### 5.2 Technical Flow (Week 2)
1. Day 1-2: ARCHITECT
2. Day 3-4: CODE
3. Day 5: DEBUGGER

### 5.3 Quality Flow (Week 3)
1. Day 1-2: QA
2. Day 3: ASK
3. Day 4-5: GPM, UXUI

## 6. Verification Process

### 6.1 Per-Agent Verification
```bash
# Run verification
npm run verify-agent [agent]
npm run verify-integration [agent]
npm run verify-chain [agent]
```

### 6.2 System Verification
```bash
# Run full verification
npm run verify-system
npm run verify-chain
npm run verify-integration
```

## 7. Success Criteria

### 7.1 Technical Success
- All XML valid
- All roles correct
- All rules compliant
- All integrations working

### 7.2 Quality Success
- Chain maintained
- State preserved
- Documentation complete
- Extensions working

### 7.3 Workflow Success
- All agents communicating
- Chain intact
- Quality preserved
- State maintained

## 8. Support Plan

### 8.1 During Migration
- Technical support ready
- Rollback prepared
- Documentation available
- Monitoring active

### 8.2 Post Migration
- Monitor system
- Track issues
- Update docs
- Support users