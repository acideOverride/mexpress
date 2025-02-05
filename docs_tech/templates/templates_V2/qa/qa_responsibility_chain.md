<?xml version="1.0" encoding="UTF-8"?>
<qa_responsibility_chain>
    <!-- Chain Analysis -->
    <test_responsibility>
        <primary_owner>
            <role>ARCHITECT</role>
            <responsibilities>
                <responsibility>Define test strategy</responsibility>
                <responsibility>Set coverage requirements</responsibility>
                <responsibility>Specify test architecture</responsibility>
            </responsibilities>
            <deliverables>
                <deliverable>Testing strategy document</deliverable>
                <deliverable>Coverage requirements</deliverable>
                <deliverable>Test architecture specs</deliverable>
            </deliverables>
        </primary_owner>

        <secondary_owner>
            <role>GPM</role>
            <responsibilities>
                <responsibility>Include test requirements in milestones</responsibility>
                <responsibility>Set coverage metrics in quality gates</responsibility>
                <responsibility>Plan test resources</responsibility>
            </responsibilities>
            <deliverables>
                <deliverable>Test milestones</deliverable>
                <deliverable>Quality gate metrics</deliverable>
                <deliverable>Resource allocation</deliverable>
            </deliverables>
        </secondary_owner>

        <tertiary_owner>
            <role>TASKMANAGER</role>
            <responsibilities>
                <responsibility>Include test requirements in tasks</responsibility>
                <responsibility>Specify coverage expectations</responsibility>
                <responsibility>Define test acceptance criteria</responsibility>
            </responsibilities>
            <deliverables>
                <deliverable>Task test requirements</deliverable>
                <deliverable>Coverage expectations</deliverable>
                <deliverable>Acceptance criteria</deliverable>
            </deliverables>
        </tertiary_owner>
    </test_responsibility>

    <!-- Implementation Chain -->
    <implementation_chain>
        <code_role>
            <responsibilities>
                <responsibility>Implement per task requirements</responsibility>
                <responsibility>Follow test specifications</responsibility>
                <responsibility>Meet coverage targets</responsibility>
            </responsibilities>
            <constraints>
                <constraint>Cannot create requirements</constraint>
                <constraint>Must follow task specifications</constraint>
                <constraint>Needs explicit test requirements</constraint>
            </constraints>
        </code_role>

        <qa_role>
            <responsibilities>
                <responsibility>Verify against requirements</responsibility>
                <responsibility>Check coverage metrics</responsibility>
                <responsibility>Report gaps</responsibility>
            </responsibilities>
            <escalation>
                <target>TASKMANAGER</target>
                <reasons>
                    <reason>Missing test requirements</reason>
                    <reason>Undefined coverage targets</reason>
                    <reason>Incomplete specifications</reason>
                </reasons>
            </escalation>
        </qa_role>
    </implementation_chain>

    <!-- Prevention Measures -->
    <prevention>
        <architect_level>
            <measures>
                <measure>Mandatory test strategy</measure>
                <measure>Required coverage definitions</measure>
                <measure>Test architecture review</measure>
            </measures>
        </architect_level>

        <gpm_level>
            <measures>
                <measure>Test milestone verification</measure>
                <measure>Quality gate validation</measure>
                <measure>Resource confirmation</measure>
            </measures>
        </gpm_level>

        <taskmanager_level>
            <measures>
                <measure>Test requirement checklist</measure>
                <measure>Coverage specification review</measure>
                <measure>Acceptance criteria validation</measure>
            </measures>
        </taskmanager_level>
    </prevention>

    <!-- Resolution Process -->
    <resolution>
        <when_no_coverage>
            <steps>
                <step>Escalate to ARCHITECT</step>
                <step>Review test strategy</step>
                <step>Update requirements</step>
                <step>Propagate through chain</step>
            </steps>
        </when_no_coverage>
    </resolution>
</qa_responsibility_chain>