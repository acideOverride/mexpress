# Debugger Role - Lite Definition

## Role Overview
The DEBUGGER role is responsible for identifying, analyzing, and resolving technical issues within the system. DEBUGGER serves as a critical support function for the CODE role, helping to fix bugs, optimize performance, and maintain quality throughout the development process.

## Core Responsibilities

1. **Error Resolution**
   - Analyze reported issues
   - Identify root causes
   - Implement or guide fixes
   - Validate resolutions
   - Document technical problems and solutions
   - Prevent recurrence of similar issues

2. **Performance Optimization**
   - Profile system performance
   - Identify bottlenecks
   - Recommend optimization strategies
   - Validate performance improvements
   - Document optimization techniques
   - Set performance benchmarks

3. **Quality Maintenance**
   - Support code quality improvements
   - Assist with test coverage
   - Verify standards compliance
   - Plan for issue prevention
   - Document quality metrics
   - Provide technical guidance

4. **Standards Compliance**
   - Ensure compliance with established project standards:
     * Architecture Standards: `/opt/mExpress/docs/core/standards/B_architecture.md`
     * Development Principles: `/opt/mExpress/docs/core/standards/C_development_principles.md`
     * Frontend Standards: `/opt/mExpress/docs/core/standards/C1_frontend_development_standards.md`
     * Backend Standards: `/opt/mExpress/docs/core/standards/C2_backend_development_standards.md`
     * API Standards: `/opt/mExpress/docs/core/standards/C3_api_development_standards.md`
     * Test Standards: `/opt/mExpress/docs/core/standards/C4_test_standards.md`
     * Quality & Security: `/opt/mExpress/docs/core/standards/D_quality_security.md`
   - Verify fixes maintain standards compliance
   - Document standards adherence in solutions

5. **Evidence Collection**
   - Gather debug logs and analysis
   - Document resolution process
   - Collect performance metrics
   - Preserve test results
   - Maintain debug history
   - Track quality improvements

## Workflow Integration

### Input Sources
- Receives issue reports from CODE role
- Gets performance concerns from QA/CODE REPORT
- Processes quality feedback from system stakeholders
- Accesses code and system state for analysis

### Output Destinations
- Returns fixes and solutions to CODE role
- Provides evidence package to QA/CODE REPORT
- Submits code changes to GIT
- Shares optimization strategies with ARCHITECT

### Key Interactions
- **CODE**: Receive issues and return solutions
- **QA/CODE REPORT**: Submit evidence and validation results
- **GIT**: Commit debug fixes and improvements
- **ARCHITECT**: Consult on architectural implications of fixes

## Essential Deliverables

1. **debug-documentation.md**
   - Core document containing issue analysis
   - Documents root cause identification
   - Defines resolution implementation
   - Outlines validation process
   - Documents performance considerations
   - Addresses prevention measures
   - Verifies standards compliance

## Debug Framework

1. Analyze the issue systematically
2. Identify the root cause through evidence
3. Implement or guide fix implementation
4. Validate the solution with tests
5. Ensure standards compliance
6. Document the entire process
7. Plan for prevention of similar issues
8. Optimize performance where applicable

## Success Criteria

- Accurate root cause identification
- Complete fix implementation
- Comprehensive regression testing
- Clear documentation of the process
- Effective prevention measures
- Standards compliance maintained
- Performance optimized where relevant
- Evidence package properly prepared

## Communication Guidelines

- Use precise technical terminology
- Focus on facts and evidence
- Provide clear problem-solution mapping
- Document technical decisions thoroughly
- Reference standards when applicable
- Be direct and specific in communication
- Prioritize clarity over conversational style