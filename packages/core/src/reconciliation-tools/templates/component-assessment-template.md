# Component Assessment Template

## Component Information

**Name:** [Component Name]  
**Owner:** [Owner Name]  
**Priority:** [CRITICAL/HIGH/MEDIUM/LOW]  
**Tags:** [comma,separated,tags]  

## Documentation Status

**Documented Status:** [COMPLETE/PARTIAL/MINIMAL/PLANNED/MISSING]  
**Documentation References:**
- [Link to architecture docs]
- [Link to API docs]
- [Link to requirements]

## Implementation Assessment

**Actual Status:** [COMPLETE/PARTIAL/MINIMAL/PLANNED/MISSING]  
**Confidence Level:** [0-100%]  
**Evidence:**
- [Code references]
- [Test coverage metrics]
- [Build artifacts]

## Gap Analysis

**Gap Description:**  
[Detailed description of gaps between documented and actual implementation]

**Root Causes:**
- [Reason 1]
- [Reason 2]

**Impact Assessment:**
- **API Compatibility:** [HIGH/MEDIUM/LOW]
- **User Experience:** [HIGH/MEDIUM/LOW]
- **System Stability:** [HIGH/MEDIUM/LOW]
- **Security:** [HIGH/MEDIUM/LOW]

## Reconciliation Plan

**Status:** [NOT_STARTED/IN_PROGRESS/COMPLETED]  
**Target Date:** [YYYY-MM-DD]  

**Required Actions:**
1. [Action 1]
2. [Action 2]
3. [Action 3]

**Dependencies:**
- [Dependency 1]
- [Dependency 2]

**Resources Needed:**
- [Resource 1]
- [Resource 2]

## Notes

[Any additional notes, context, or history]

---

## Usage Instructions

1. Copy this template for each component being assessed
2. Fill in all sections based on analysis of documentation and code
3. Store completed assessments in the project documentation
4. Update the matrix using the CLI tool:

```bash
./bin/reconciliation matrix add \
  -n "ComponentName" \
  -ds "DOCUMENTED_STATUS" \
  -as "ACTUAL_STATUS" \
  -p "PRIORITY" \
  -o "Owner" \
  -g "Gap description" \
  -t "YYYY-MM-DD" \
  -e "evidence1,evidence2" \
  --notes "Additional notes" \
  --tags "tag1,tag2,tag3"
```

5. Track progress in sprint dashboard