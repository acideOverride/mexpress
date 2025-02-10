# Quality Streams in Roo Code - Corrected Version

## 1. Downstream Quality Control (QC)
```
ASK -----> QC Review -----> UXUI -----> QC Review -----> ARCHITECT
 |                                                            |
 |                                                            |
 +----------------> QC Review -------------------------------→ |
 (If no UXUI features)                                        |
                                                             |
                                                             v
                                                            GPM
                                                             |
                                                             v
                                                        TASKMANAGER
                                                             |
                                                             v
                                                           CODE
```

## 2. Upstream Quality Assurance (QA) - Corrected Flow
```
TASKMANAGER --------> CODE --------> QA
     ^                 |             |
     |                 |             |
     +-----------------+-------------+
     (Feedback Loop for Fixes)

If major issues:
QA -----> TASKMANAGER -----> GPM
(Quality Impact Assessment)
```

## Key Points:

1. Downstream QC:
   - Validates requirements and design
   - Ensures proper planning
   - One-way flow to implementation
   - Clear handoff points

2. Upstream QA:
   - Primary feedback loop: TASKMANAGER -> CODE -> QA -> TASKMANAGER
   - Focused on implementation quality
   - Quick iteration for fixes
   - Escalation path to GPM for major issues

3. Quality Gates:
   - QC: Before implementation starts
   - QA: During implementation
   - Clear acceptance criteria
   - Defined escalation paths

This creates a tight feedback loop where:
1. TASKMANAGER assigns work
2. CODE implements
3. QA validates
4. TASKMANAGER manages fixes
5. GPM handles major issues

The focus is on quick iterations and immediate feedback, with clear escalation paths for significant issues.