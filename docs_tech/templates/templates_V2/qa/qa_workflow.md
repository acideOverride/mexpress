<?xml version="1.0" encoding="UTF-8"?>
<qa_workflow>
    <!-- Workflow Configuration -->
    <identity>
        <version>3.0</version>
        <mode>qa</mode>
        <purpose>Define QA workflow states and transitions</purpose>
    </identity>

    <!-- Workflow States -->
    <states>
        <reception_state>
            <name>RECEIVING</name>
            <from>CODE</from>
            <requirements>
                <requirement>Implementation complete</requirement>
                <requirement>Tests passing</requirement>
                <requirement>Documentation ready</requirement>
                <requirement>Metrics available</requirement>
            </requirements>
        </reception_state>

        <verification_state>
            <name>VERIFYING</name>
            <gate>[Current Gate]</gate>
            <requirements>
                <requirement>Access to evidence</requirement>
                <requirement>Test environment</requirement>
                <requirement>Monitoring tools</requirement>
                <requirement>Documentation</requirement>
            </requirements>
        </verification_state>

        <blocking_state>
            <name>BLOCKING</name>
            <gate>[Failed Gate]</gate>
            <requirements>
                <requirement>Failure evidence</requirement>
                <requirement>Impact assessment</requirement>
                <requirement>Resolution path</requirement>
                <requirement>Escalation plan</requirement>
            </requirements>
        </blocking_state>

        <approval_state>
            <name>APPROVING</name>
            <gates>ALL_PASSED</gates>
            <requirements>
                <requirement>All gates verified</requirement>
                <requirement>Evidence documented</requirement>
                <requirement>Issues resolved</requirement>
                <requirement>Metrics collected</requirement>
            </requirements>
        </approval_state>
    </states>

    <!-- Gate Progression -->
    <gate_progression>
        <sequence>
            <gate>
                <id>QG1</id>
                <name>Architecture Compliance</name>
                <state>QG1_VERIFICATION</state>
                <requires>
                    <requirement>Architecture docs</requirement>
                    <requirement>Implementation evidence</requirement>
                    <requirement>Pattern validation</requirement>
                </requires>
            </gate>

            <gate>
                <id>QG2</id>
                <name>Performance Standards</name>
                <state>QG2_VERIFICATION</state>
                <requires>
                    <requirement>Performance metrics</requirement>
                    <requirement>Load test results</requirement>
                    <requirement>Resource usage data</requirement>
                </requires>
            </gate>

            <gate>
                <id>QG3</id>
                <name>Security Requirements</name>
                <state>QG3_VERIFICATION</state>
                <requires>
                    <requirement>Security scan results</requirement>
                    <requirement>Authentication tests</requirement>
                    <requirement>Authorization checks</requirement>
                </requires>
            </gate>

            <gate>
                <id>QG4</id>
                <name>Integration Verification</name>
                <state>QG4_VERIFICATION</state>
                <requires>
                    <requirement>Integration tests</requirement>
                    <requirement>Service communication</requirement>
                    <requirement>Error handling</requirement>
                </requires>
            </gate>
        </sequence>

        <transitions>
            Reception → QG1 → QG2 → QG3 → QG4 → Approval
                       ↓      ↓      ↓      ↓
                    Blocking State (if fails)
                       ↓      ↓      ↓      ↓
                    Resolution Verification
        </transitions>
    </gate_progression>

    <!-- State Recovery -->
    <recovery>
        <on_gate_failure>
            <steps>
                <step>Document failure</step>
                <step>Collect evidence</step>
                <step>Block progression</step>
                <step>Track resolution</step>
                <step>Re-verify</step>
            </steps>
        </on_gate_failure>

        <on_resolution>
            <steps>
                <step>Verify fix</step>
                <step>Update evidence</step>
                <step>Document resolution</step>
                <step>Resume progression</step>
            </steps>
        </on_resolution>
    </recovery>

    <!-- Final State Requirements -->
    <final_state>
        <completion_requirements>
            <requirement>All gates verified</requirement>
            <requirement>Evidence documented</requirement>
            <requirement>Issues resolved</requirement>
            <requirement>Handoff ready</requirement>
        </completion_requirements>

        <documentation_requirements>
            <requirement>Gate verifications</requirement>
            <requirement>Quality metrics</requirement>
            <requirement>Issue resolutions</requirement>
            <requirement>Handoff package</requirement>
        </documentation_requirements>
    </final_state>
</qa_workflow>