# Final Quality Streams in Roo Code

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

## 2. Upstream Quality Assurance (QA) - Final Correct Flow
```
                    [Primary Implementation Loop]
TASKMANAGER --------> CODE --------> QA --------> TASKMANAGER
                       |              ^              ^
                       |              |              |
                       |              |              |
                       v              |              |
                     DEBUG ---------->+              |
                       ^                             |
                       |                             |
                       +-----------------------------+
                     [Debug Loop]

When Quality Gates Pass:
CODE -----> DEBUG -----> QA -----> GIT
```

## Key Points:

1. Primary QA Loop:
   - TASKMANAGER assigns tasks
   - CODE implements
   - QA reviews
   - Back to TASKMANAGER for:
     * New tasks
     * Fixes
     * Adjustments

2. Debug Loop:
   - Triggered when issues found
   - DEBUG fixes issues
   - QA validates fixes
   - Back to TASKMANAGER for verification

3. Final Path:
   - When quality gates pass
   - Through DEBUG for final check
   - QA validates
   - To GIT for integration

This creates a complete quality system where:
1. Implementation is continuously validated
2. Issues are properly debugged
3. Quality is maintained throughout
4. Clear path to final integration

The system ensures:
- Quick feedback for implementation issues
- Proper handling of debug cases
- Clear quality gates before GIT
- Maintained quality throughout the process