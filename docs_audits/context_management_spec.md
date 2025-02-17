# Context Window Management Specification

## 1. Individual Agent Level

### 1.1 Context Monitoring
```yaml
Required in .clinerules:
  context_management:
    thresholds:
      warning: 70%    # Start preparing for context management
      critical: 85%   # Must take immediate action
    
    monitoring_points:
      - Before each operation
      - After large changes
      - Before state transitions
      - After file operations
    
    required_actions:
      - Check context percentage before operations
      - Monitor environment_details context size
      - Break large tasks into chunks
      - Use incremental implementation
      - Force commits at warning threshold
      - Stop operations at critical threshold
    
    prohibited_actions:
      - Large operations when near warning threshold
      - Any operations at critical threshold
      - Ignoring context percentage
      - Multiple operations without commits
      - Large file reads without chunking
```

### 1.2 State Preservation
```yaml
Required in role.md:
  state_management:
    context_preservation:
      - Essential state only
      - Minimal format
      - Critical data points
      - Recovery information
    
    state_recovery:
      - Restoration points
      - Minimal context
      - Essential workflow data
      - Operation continuity
```

## 2. Workflow Level

### 2.1 Handoff Protocol
```yaml
Between Agents:
  context_handoff:
    required:
      - Essential state only
      - Current operation status
      - Critical data points
      - Next action required
    
    prohibited:
      - Full context transfer
      - Non-essential data
      - Historical information
      - Debug details
```

### 2.2 Chain Management
```yaml
Workflow Chain:
  context_chain:
    preservation:
      - Chain position
      - Essential state
      - Next actions
      - Critical data
    
    recovery:
      - Chain restoration
      - State rebuilding
      - Operation resumption
      - Data reconstruction
```

## 3. System Level

### 3.1 Context Thresholds
```yaml
System Wide:
  context_limits:
    warning_threshold: 70%
    critical_threshold: 85%
    
    actions:
      at_warning:
        - Complete current operation only
        - Force incremental commit
        - Split remaining work
        - Avoid large operations
        - Clear non-essential data
      
      at_critical:
        - Stop current operation
        - Force immediate commit
        - Clear context and restart
        - Split into smaller chunks
        - Process one chunk at a time
```

### 3.2 Recovery Protocol
```yaml
System Recovery:
  context_recovery:
    required_state:
      - Current agent
      - Operation status
      - Essential data
      - Next action
    
    recovery_steps:
      - Restore minimal state
      - Verify chain position
      - Resume operation
      - Rebuild context
```

## 4. Implementation Requirements

### 4.1 Agent Core Files Updates
1. .clinerules
   - Add context_management section
   - Define thresholds
   - Specify monitoring points
   - List required/prohibited actions

2. role.md
   - Add state_management section
   - Define preservation rules
   - Specify recovery procedures
   - Document context handling

3. template_v3.md
   - Add context monitoring
   - Include state preservation
   - Define recovery steps
   - Specify continuation protocols

### 4.2 Critical Points
1. Monitor context size before operations
2. Preserve essential state only
3. Handle transitions carefully
4. Maintain recovery points
5. Follow threshold actions strictly

### 4.3 Success Criteria
1. No context overflow
2. Smooth transitions
3. Reliable recovery
4. Operation continuity
5. Data preservation

This specification should be implemented in all agent core files to ensure consistent context management across the system.