# Quality Streams in Roo Code

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

## 2. Upstream Quality Assurance (QA)
```
CODE -----> QA Review -----> TASKMANAGER -----> QA Review -----> GPM
 |              |                |                   |
 |              |                |                   |
 |              +----------------+                   |
 |         (Feedback Loop)                          |
 |                                                  |
 |                                                  |
 +---> DEBUG -----> QA Review -----> GIT            |
         ^              |                           |
         |              |                           |
         +--------------+                           |
      (Feedback Loop)                              |
                                                   |
                                    (Project Level Feedback)
```

## Key Points:

1. Downstream QC:
   - Validates requirements and design before implementation
   - Ensures proper setup and planning
   - Prevents issues before they reach implementation
   - Single path to implementation

2. Upstream QA:
   - Validates implementation quality
   - Multiple feedback loops for improvements
   - Separate paths for code and debug
   - Project-level impact assessment

3. Integration Points:
   - QC focuses on preparation and planning
   - QA focuses on implementation and delivery
   - Clear separation of concerns
   - Distinct feedback mechanisms

4. Flow Control:
   - QC gates before major transitions
   - QA feedback loops for refinement
   - Clear escalation paths
   - Defined quality checkpoints