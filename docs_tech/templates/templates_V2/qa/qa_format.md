<?xml version="1.0" encoding="UTF-8"?>
<qa_format>
    <!-- Format Configuration -->
    <identity>
        <version>3.0</version>
        <mode>qa</mode>
        <purpose>Define standardized formats for QA operations</purpose>
    </identity>

    <!-- Task Reception Format -->
    <reception_format>
        <template>
            Roo: QA
            PROJECT: [Project Name]
            RECEIVED FROM: CODE - [Task Name] - [BRQ-YEAR-NUMBER]
            MILESTONE: [Sprint/Release Name]
            QUALITY GATES: [List of Required Gates]
            COVERAGE REQUIREMENTS: [Percentage]
        </template>
        <required_fields>
            <field>Project Name</field>
            <field>Task Name</field>
            <field>BRQ Number</field>
            <field>Milestone</field>
            <field>Quality Gates</field>
            <field>Coverage Requirements</field>
        </required_fields>
    </reception_format>

    <!-- Gate Verification Format -->
    <verification_format>
        <template>
            Roo: QA
            PROJECT: [Project Name]
            VERIFYING: [Task Name] - [BRQ-YEAR-NUMBER]
            QUALITY GATE: [Gate Name]
            STATUS: [IN_PROGRESS/COMPLETED/FAILED]
            EVIDENCE: [Documentation Path]

            ## Gate Requirements
            [List specific requirements for this gate]

            ## Verification Results
            [Detailed results with evidence]

            ## Issues Found (if any)
            [List of issues with evidence]

            ## Next Steps
            [Required actions or proceed to next gate]
        </template>
        <required_sections>
            <section>Gate Requirements</section>
            <section>Verification Results</section>
            <section>Issues Found</section>
            <section>Next Steps</section>
        </required_sections>
    </verification_format>

    <!-- Issue Report Format -->
    <issue_format>
        <template>
            Roo: QA
            PROJECT: [Project Name]
            TASK: [Task Name] - [BRQ-YEAR-NUMBER]
            ISSUE TYPE: [Quality/Performance/Security]
            SEVERITY: [High/Medium/Low]
            GATE: [Failed Gate Name]

            ## Issue Description
            [Detailed description]

            ## Evidence
            [Test results/logs/metrics]

            ## Impact
            [Affected components/functionality]

            ## Required Resolution
            [What needs to be fixed]
        </template>
        <required_sections>
            <section>Issue Description</section>
            <section>Evidence</section>
            <section>Impact</section>
            <section>Required Resolution</section>
        </required_sections>
    </issue_format>

    <!-- Gate Report Format -->
    <gate_report_format>
        <template>
            Roo: QA
            PROJECT: [Project Name]
            GATE: [Gate Name]
            STATUS: [PASSED/FAILED]
            EVIDENCE PATH: [Documentation Location]

            ## Requirements
            [List of gate requirements]

            ## Verification Results
            [Detailed verification evidence]

            ## Metrics
            [Relevant metrics and KPIs]

            ## Status
            [Gate status with evidence]
        </template>
        <required_sections>
            <section>Requirements</section>
            <section>Verification Results</section>
            <section>Metrics</section>
            <section>Status</section>
        </required_sections>
    </gate_report_format>

    <!-- Blocking Report Format -->
    <blocking_format>
        <template>
            Roo: QA
            PROJECT: [Project Name]
            BLOCKING: [Task Name] - [BRQ-YEAR-NUMBER]
            GATE: [Failed Gate Name]
            SEVERITY: [High/Medium/Low]

            ## Reason
            [Why progression is blocked]

            ## Evidence
            [Proof of quality gate failure]

            ## Required Actions
            [What needs to be done]

            ## Escalation
            [Who needs to be notified]
        </template>
        <required_sections>
            <section>Reason</section>
            <section>Evidence</section>
            <section>Required Actions</section>
            <section>Escalation</section>
        </required_sections>
    </blocking_format>

    <!-- Final Approval Format -->
    <approval_format>
        <template>
            Roo: QA
            PROJECT: [Project Name]
            APPROVING: [Task Name] - [BRQ-YEAR-NUMBER]
            STATUS: APPROVED
            QUALITY GATES: ALL_PASSED

            ## Quality Summary
            [Overview of quality status]

            ## Evidence Chain
            [Links to all verification docs]

            ## Metrics Summary
            [Final quality metrics]

            ## Handoff Status
            [Ready for next role]
        </template>
        <required_sections>
            <section>Quality Summary</section>
            <section>Evidence Chain</section>
            <section>Metrics Summary</section>
            <section>Handoff Status</section>
        </required_sections>
    </approval_format>
</qa_format>