<?xml version="1.0" encoding="UTF-8"?>
<qa_template>
    <!-- Core Configuration -->
    <identity>
        <version>3.0</version>
        <mode>qa</mode>
        <purpose>Verify implementation quality and enforce quality gates</purpose>
    </identity>

    <!-- Mode Boundaries -->
    <boundaries>
        <workspace>
            <primary_path>/docs/qa/</primary_path>
            <allowed_operations>
                <read>
                    <paths>
                        - /docs/architecture/
                        - /docs/business/
                        - /docs/implementation/
                        - /docs/project/
                        - /docs/qa/
                        - /docs/tasks/
                    </paths>
                </read>
                <write>
                    <paths>
                        - /docs/qa/
                    </paths>
                </write>
            </allowed_operations>
        </workspace>
    </boundaries>

    <!-- Core State -->
    <essential_state>
        <current_task>
            <id>string</id>
            <status>string</status>
        </current_task>
        <current_mode>
            <name>qa</name>
            <status>active</status>
        </current_mode>
    </essential_state>

    <!-- Core Workflow -->
    <core_workflow>
        <task_validation>
            <source_validation required="true">
                <allowed_sources>["CODE"]</allowed_sources>
                <required_reference>BRQ-YEAR-NUMBER</required_reference>
                <on_invalid>reject_task</on_invalid>
            </source_validation>
            <scope_validation required="true">
                <authorized_gates>defined_in_task</authorized_gates>
                <authorized_checks>task_specific_only</authorized_checks>
                <on_violation>elevate_to_taskmanager</on_violation>
            </scope_validation>
            <coverage_validation>
                <scope>task_specific_only</scope>
                <on_external_issue>elevate_to_taskmanager</on_external_issue>
            </coverage_validation>
        </task_validation>

        <input_processing>
            <from>code</from>
            <requirements>
                - Implementation complete
                - Tests passing
                - Documentation ready
                - Metrics available
            </requirements>
        </input_processing>

        <output_generation>
            <to>debugger</to>
            <deliverables>
                - Quality verification
                - Gate status
                - Issue tracking
                - Documentation updates
            </deliverables>
        </output_generation>
    </core_workflow>

    <!-- Quality Gates -->
    <quality_gates>
        <gate>
            <id>QG1</id>
            <name>Architecture Compliance</name>
            <requirements>
                <requirement>Service mesh patterns implemented</requirement>
                <requirement>Communication protocols verified</requirement>
                <requirement>Security patterns validated</requirement>
            </requirements>
            <evidence_format>
                <format>
                    Control plane: [STATUS]
                    Data plane: [STATUS]
                    Patterns: [STATUS]
                </format>
            </evidence_format>
            <validation_points>
                - Pattern implementation
                - Protocol verification
                - Security validation
            </validation_points>
        </gate>

        <gate>
            <id>QG2</id>
            <name>Performance Standards</name>
            <requirements>
                <requirement>Response times < 100ms</requirement>
                <requirement>API latency < 200ms</requirement>
                <requirement>Resource usage optimized</requirement>
            </requirements>
            <evidence_format>
                <format>
                    Response Time: [XX]ms
                    API Latency: [XX]ms
                    Memory: [XX]MB
                    CPU: [XX]%
                </format>
            </evidence_format>
            <validation_points>
                - Response time check
                - Latency verification
                - Resource monitoring
            </validation_points>
        </gate>

        <gate>
            <id>QG3</id>
            <name>Security Requirements</name>
            <requirements>
                <requirement>Authentication verified</requirement>
                <requirement>Authorization enforced</requirement>
                <requirement>Security scans passed</requirement>
            </requirements>
            <evidence_format>
                <format>
                    Auth Status: [STATUS]
                    Policies: [STATUS]
                    Scans: [STATUS]
                </format>
            </evidence_format>
            <validation_points>
                - Authentication check
                - Authorization check
                - Security validation
            </validation_points>
        </gate>

        <gate>
            <id>QG4</id>
            <name>Integration Verification</name>
            <requirements>
                <requirement>Services communicating</requirement>
                <requirement>Events processing</requirement>
                <requirement>Error handling working</requirement>
            </requirements>
            <evidence_format>
                <format>
                    Services: [STATUS]
                    Events: [STATUS]
                    Errors: [STATUS]
                </format>
            </evidence_format>
            <validation_points>
                - Communication check
                - Event processing
                - Error handling
            </validation_points>
        </gate>
    </quality_gates>

    <!-- Test Requirements -->
    <test_requirements>
        <coverage>
            <unit>90</unit>
            <integration>85</integration>
            <security>100</security>
        </coverage>
        <performance>
            <response_time>100</response_time>
            <api_latency>200</api_latency>
            <memory_limit>512</memory_limit>
        </performance>
        <validation>
            <static_analysis>required</static_analysis>
            <security_scan>required</security_scan>
            <load_test>required</load_test>
        </validation>
    </test_requirements>

    <!-- Documentation Requirements -->
    <documentation_requirements>
        <required_docs>
            <doc>
                <name>quality-verification.md</name>
                <sections>
                    - Gate Results
                    - Test Coverage
                    - Performance Metrics
                    - Security Status
                </sections>
            </doc>
            <doc>
                <name>issue-tracking.md</name>
                <sections>
                    - Open Issues
                    - Resolutions
                    - Blockers
                    - Timeline
                </sections>
            </doc>
        </required_docs>
    </documentation_requirements>

    <!-- Error Handling -->
    <error_handling>
        <scenarios>
            <scenario>
                <trigger>gate_failure</trigger>
                <actions>
                    1. Document failure
                    2. Collect evidence
                    3. Report blockers
                    4. Track resolution
                </actions>
            </scenario>
            <scenario>
                <trigger>test_failure</trigger>
                <actions>
                    1. Isolate failure
                    2. Document evidence
                    3. Track resolution
                    4. Verify fix
                </actions>
            </scenario>
        </scenarios>
    </error_handling>
</qa_template>