<?xml version="1.0" encoding="UTF-8"?>
<qa_test_validation>
    <!-- Chain Validation Points -->
    <validation_chain>
        <architect_validation>
            <mandatory_checks>
                <check>
                    <name>Test Strategy Definition</name>
                    <validation>
                        <must_have>
                            - Unit test requirements
                            - Integration test plan
                            - Coverage targets
                            - Test architecture
                        </must_have>
                        <format>
                            Test Strategy:
                            - Unit Coverage: [TARGET]%
                            - Integration Coverage: [TARGET]%
                            - Test Architecture: [DEFINED/MISSING]
                            - Framework: [SPECIFIED/MISSING]
                        </format>
                    </validation>
                </check>
                <check>
                    <name>Quality Gate Definition</name>
                    <validation>
                        <must_have>
                            - Coverage thresholds
                            - Test pass criteria
                            - Performance metrics
                            - Security requirements
                        </must_have>
                        <format>
                            Quality Gates:
                            - Coverage Gate: [DEFINED/MISSING]
                            - Performance Gate: [DEFINED/MISSING]
                            - Security Gate: [DEFINED/MISSING]
                        </format>
                    </validation>
                </check>
            </mandatory_checks>
        </architect_validation>

        <gpm_validation>
            <mandatory_checks>
                <check>
                    <name>Test Resource Planning</name>
                    <validation>
                        <must_have>
                            - Test environment
                            - Testing tools
                            - Coverage tools
                            - Monitoring setup
                        </must_have>
                        <format>
                            Resources:
                            - Environment: [READY/MISSING]
                            - Tools: [READY/MISSING]
                            - Monitoring: [READY/MISSING]
                        </format>
                    </validation>
                </check>
                <check>
                    <name>Test Milestone Definition</name>
                    <validation>
                        <must_have>
                            - Coverage milestones
                            - Testing phases
                            - Quality checkpoints
                            - Validation points
                        </must_have>
                        <format>
                            Milestones:
                            - Coverage Goals: [DEFINED/MISSING]
                            - Test Phases: [DEFINED/MISSING]
                            - Checkpoints: [DEFINED/MISSING]
                        </format>
                    </validation>
                </check>
            </mandatory_checks>
        </gpm_validation>

        <taskmanager_validation>
            <mandatory_checks>
                <check>
                    <name>Task Test Requirements</name>
                    <validation>
                        <must_have>
                            - Coverage requirements
                            - Test specifications
                            - Acceptance criteria
                            - Validation steps
                        </must_have>
                        <format>
                            Task Requirements:
                            - Coverage: [SPECIFIED/MISSING]
                            - Tests: [SPECIFIED/MISSING]
                            - Criteria: [SPECIFIED/MISSING]
                        </format>
                    </validation>
                </check>
                <check>
                    <name>Test Acceptance Criteria</name>
                    <validation>
                        <must_have>
                            - Coverage thresholds
                            - Test scenarios
                            - Pass/fail criteria
                            - Validation method
                        </must_have>
                        <format>
                            Acceptance:
                            - Thresholds: [DEFINED/MISSING]
                            - Scenarios: [DEFINED/MISSING]
                            - Criteria: [DEFINED/MISSING]
                        </format>
                    </validation>
                </check>
            </mandatory_checks>
        </taskmanager_validation>
    </validation_chain>

    <!-- Validation Process -->
    <validation_process>
        <step>
            <order>1</order>
            <role>ARCHITECT</role>
            <action>Validate test strategy and requirements</action>
            <blocker>true</blocker>
        </step>
        <step>
            <order>2</order>
            <role>GPM</role>
            <action>Validate resource planning and milestones</action>
            <blocker>true</blocker>
        </step>
        <step>
            <order>3</order>
            <role>TASKMANAGER</role>
            <action>Validate task requirements and criteria</action>
            <blocker>true</blocker>
        </step>
    </validation_process>

    <!-- Failure Response -->
    <failure_response>
        <when_missing_requirements>
            <actions>
                <action>Block task progression</action>
                <action>Escalate to responsible role</action>
                <action>Require explicit definition</action>
                <action>Track resolution</action>
            </actions>
        </when_missing_requirements>
        <when_incomplete_specs>
            <actions>
                <action>Return to responsible role</action>
                <action>Request completion</action>
                <action>Verify updates</action>
                <action>Document resolution</action>
            </actions>
        </when_incomplete_specs>
    </failure_response>
</qa_test_validation>