# TASKMANAGER Standards Migration Handoff

## 1. Migration Package

### 1.1 Source Files
```
Current Location: /opt/mExpress/docs_tech/docs_migration/.audit/a.PREPARATION/1.current_state/taskmanager/
- template_v3.md
- role.md
- .clinerules-taskmanager
```

### 1.2 Target Standards
```
Standards Version: 2.0
Location: /opt/mExpress/docs_tech/docs_migration/.audit/b.AUDIT/b.3_standards_audit/F_agent_standards.md
```

### 1.3 Implementation Details
```
Location: /opt/mExpress/docs_tech/docs_migration/.audit/b.AUDIT/b.3_standards_audit/implementation_breakdown.md
```

### 1.4 Migration Strategy
```
Location: /opt/mExpress/docs_tech/docs_migration/.audit/b.AUDIT/b.3_standards_audit/migration_strategy.md
```

## 2. Required Updates

### 2.1 template_v3.md Updates
1. Identity Block
   ```xml
   <!-- Update to -->
   <identity>
       <version>2.0</version>
       <role>taskmanager</role>
       <purpose>Task orchestration and workflow management across all modes</purpose>
   </identity>
   ```

2. Quality Context Addition
   ```xml
   <!-- Add -->
   <quality_context>
       <verification_status>
           <state>string</state>
           <chain>string</chain>
           <history>string</history>
       </verification_status>
       <quality_metrics>
           <coverage>object</coverage>
           <validation>object</validation>
           <compliance>object</compliance>
       </quality_metrics>
       <validation_chain>
           <current>object</current>
           <history>array</history>
           <next>object</next>
       </validation_chain>
   </quality_context>
   ```

3. State Management Update
   ```xml
   <!-- Standardize -->
   <essential_state>
       <current_task>
           <id>string</id>
           <status>string</status>
           <source_task_ref>string</source_task_ref>
           <source_role>string</source_role>
           <next_action>string</next_action>
           <workflow_state>string</workflow_state>
       </current_task>
   </essential_state>
   ```

### 2.2 role.md Updates
1. Task Headers
   ```
   <!-- Reception Format -->
   Roo: TASKMANAGER
   PROJECT: [Project Name]
   CREATING: [Task Type] - [BRQ-YEAR-NUMBER]
   TARGET MODE: [Mode Name]
   WORKFLOW CHAIN: [Chain Definition]
   QUALITY REQUIREMENTS: [List]
   STATE PRESERVATION: [Required/Optional]
   ```

2. Chain Position
   ```markdown
   ## Mode Chain Position
   - Position: Orchestration Layer
     * Definition: Central workflow coordinator
     * Responsibilities: [List]
     * Quality Gates: [List]

   - Controls: ALL_MODES
     * Required State: [For Each Mode]
     * Validation Points: [For Each Mode]
     * Quality Requirements: [For Each Mode]
   ```

### 2.3 .clinerules Updates
1. Base Configuration
   ```yaml
   mode: taskmanager
   description: "Task orchestration and workflow management"
   version: "1.0.0"

   responsibilities:
     core:
       - Quality framework integration
       - State management
       - Documentation maintenance
       - Chain position maintenance
     
     quality:
       - Verification chain participation
       - Quality metrics tracking
       - Validation history maintenance
       - Framework compliance
     
     workflow:
       - Task management
       - State preservation
       - Chain integration
       - Mode transitions
   ```

2. Context Management
   ```yaml
   context_management:
     thresholds:
       warning: 70
       critical: 85
     
     monitoring_points:
       state:
         - Before state changes
         - After state updates
         - During transitions
         - On quality updates
       
       operations:
         - Before large operations
         - During file operations
         - After major changes
         - Before commits
   ```

## 3. Validation Steps

### 3.1 Pre-Update Validation
```bash
# Backup current state
cp -r /opt/mExpress/docs_tech/docs_migration/.audit/a.PREPARATION/1.current_state/taskmanager/ backup/

# Verify current functionality
npm run verify-agent taskmanager
```

### 3.2 Update Validation
```bash
# After each file update
npm run verify-structure taskmanager
npm run verify-integration taskmanager
```

### 3.3 Post-Update Validation
```bash
# Full verification
npm run verify-agent taskmanager
npm run verify-chain taskmanager
npm run verify-system
```

## 4. Rollback Procedure

### 4.1 Single File Rollback
```bash
# Restore specific file
cp backup/[file] /opt/mExpress/docs_tech/docs_migration/.audit/a.PREPARATION/1.current_state/taskmanager/
```

### 4.2 Full Rollback
```bash
# Restore all files
rm -rf /opt/mExpress/docs_tech/docs_migration/.audit/a.PREPARATION/1.current_state/taskmanager/
cp -r backup/taskmanager/ /opt/mExpress/docs_tech/docs_migration/.audit/a.PREPARATION/1.current_state/
```

## 5. Success Criteria

### 5.1 Structure Validation
- XML schema valid
- All sections present
- Extensions documented
- Quality context complete

### 5.2 Integration Validation
- Chain position correct
- Mode transitions working
- State preservation valid
- Quality framework integrated

### 5.3 Documentation Validation
- All changes documented
- References updated
- Version numbers correct
- Chain documented

## 6. Support Contact

### 6.1 During Migration
- Technical Support: [Contact]
- Quality Support: [Contact]
- Documentation: [Location]

### 6.2 Post Migration
- System Monitoring: [Contact]
- Issue Tracking: [System]
- Documentation Updates: [Process]