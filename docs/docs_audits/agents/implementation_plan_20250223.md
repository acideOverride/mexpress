# Straight-Forward Implementation Plan
Date: 2/23/2025

## Phase 1: Core Files Update (2 days)

### Day 1: Verification Chain Standardization
1. Update .clinerules files:
   ```
   ARCHITECT/.clinerules-architect: Add QC verification format
   GPM/.clinerules-gpm: Standardize QC verification reception
   QC/.clinerules-qc: Add GPM handoff format
   ```

2. Update role files:
   ```
   architect_role.md: Add GPM handoff protocol
   gpm_role.md: Update verification reception
   qc_role.md: Add GPM verification format
   ```

### Day 2: Evidence Framework Unification
1. Create standard evidence format:
   ```
   EVIDENCE:
     Package: [Evidence ID]
     Type: [Technical/Research/QC]
     Chain: [Chain Reference]
     Validation: [Status]
   ```

2. Update all agents to use this format:
   - Remove agent-specific formats
   - Replace with standard format
   - Update validation chains

## Phase 2: Quick Fixes (1 day)

### Communication Headers
1. Create standard header template:
   ```
   Roo: [AGENT]
   PROJECT: [Name]
   TASK: [Name]-[BRQ-NUM]
   SOURCE: [Verified/Pending]
   CHAIN: [Chain Reference]
   ```

2. Update all agent files:
   - Replace custom headers
   - Use standard format
   - Update references

### Quality Gates
1. Standardize on simple format:
   ```
   QUALITY:
     Status: [Pass/Fail]
     Evidence: [Reference]
     Chain: [Chain ID]
   ```

2. Update all quality checks:
   - Remove percentage-based gates
   - Use standard pass/fail
   - Keep evidence references

## Phase 3: Final Integration (1 day)

### State Management
1. Use single state format:
   ```
   STATE:
     Agent: [Current Agent]
     Task: [Current Task]
     Chain: [Chain Reference]
     Next: [Next Action]
   ```

2. Update all state tracking:
   - Remove custom states
   - Use standard format
   - Update transitions

### Documentation Updates
1. Minimal required updates:
   - Update chain references
   - Fix verification flows
   - Update evidence links

## Implementation Order

1. Start with core chain:
   ```
   ARCHITECT → QC → GPM → TASKMANAGER
   ```

2. Then support agents:
   ```
   CODE → DEBUG → GIT
   QA → UXUI → ASK
   ```

## Success Criteria
- All agents use standard headers
- Verification chain flows correctly
- Evidence format unified
- States properly tracked

## Monitoring Points
- Test each agent after update
- Verify chain completion
- Check evidence flow
- Validate state transitions

This plan focuses on actual implementation rather than documentation. Each phase has concrete file changes and clear success criteria. Total time: 4 days maximum.