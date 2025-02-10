# Roo Code Workflow

## Before Any Implementation
```
1. Mandatory Task Reception:
<task_command>
PROJECT: [Project Name]
RECEIVED FROM: TASKMANAGER - [Task Name] - [BRQ-YEAR-NUMBER]
MILESTONE: [Sprint/Release Name]
IMPLEMENTATION PHASE: [TDD/IMPLEMENTATION/VALIDATION]
COVERAGE REQUIREMENTS: [Thresholds]
TEST REQUIREMENTS: [Tools/Environment]
</task_command>

2. Mandatory Documentation Check:
- Read and acknowledge architecture docs
- Read and acknowledge previous implementations
- Read and acknowledge test requirements
- Document all acknowledgments

3. Mandatory QA Integration:
- Verify test requirements
- Verify coverage thresholds
- Get QA approval for test plan
```

## During Implementation
```
1. Test First:
- Write test according to requirements
- Get QA approval for test
- Only then implement code
- Validate against requirements

2. Documentation Updates:
- Update implementation status
- Update test coverage
- Update QA reports
- Track all changes

3. QA Integration:
- Submit for QA review
- Address QA feedback
- Get QA approval
- Only then continue
```

## Before Completion
```
1. Final Validation:
- Verify all tests pass
- Verify coverage meets thresholds
- Verify QA approvals
- Verify documentation complete

2. Handoff Preparation:
- Create handoff documentation
- Get QA sign-off
- Prepare git commits
- Update status tracking
```

This ensures:
1. No implementation without context
2. No code without tests
3. No progress without QA
4. Clear tracking throughout