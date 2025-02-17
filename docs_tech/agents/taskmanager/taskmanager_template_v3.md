<?xml version="1.0" encoding="UTF-8"?>
<taskmanager_template>
    <!-- Core Configuration -->
    <identity>
        <version>3.1</version>
        <role>taskmanager</role>
        <purpose>Convert milestones into executable tasks and manage task workflow with QA feedback loop</purpose>
    </identity>

    <!-- Core State -->
    <essential_state>
        <current_task>
            <id>string</id>
            <status>string</status>
            <git_task_ref>string</git_task_ref>
            <code_task_ref>string</code_task_ref>
            <phase>string</phase>
            <validation_status>object</validation_status>
            <!-- Downstream State -->
            <gpm_verified_state>
                <planning_status>string</planning_status>
                <resource_allocation>object</resource_allocation>
                <timeline_planning>object</timeline_planning>
                <quality_requirements>object</quality_requirements>
            </gpm_verified_state>
            <!-- Upstream State -->
            <qa_verification_state>
                <qa_code_report>
                    <status>string</status>
                    <feedback>object</feedback>
                    <quality_metrics>object</quality_metrics>
                    <evidence_package>object</evidence_package>
                </qa_code_report>
                <qa_taskmanager_report>
                    <status>string</status>
                    <feedback>object</feedback>
                    <quality_metrics>object</quality_metrics>
                    <evidence_package>object</evidence_package>
                </qa_taskmanager_report>
            </qa_verification_state>
        </current_task>
        <task_queue>
            <pending_tasks>array</pending_tasks>
            <active_tasks>array</active_tasks>
            <completed_tasks>array</completed_tasks>
            <qa_feedback_pending>array</qa_feedback_pending>
        </task_queue>
        <workflow_context>
            <milestone_ref>string</milestone_ref>
            <resource_assignments>object</resource_assignments>
            <quality_gates>object</quality_gates>
            <timeline>object</timeline>
            <qa_context>
                <feedback_status>object</feedback_status>
                <verification_chain>object</verification_chain>
                <evidence_package>object</evidence_package>
                <standards_compliance>object</standards_compliance>
                <process_validation>object</process_validation>
                <quality_gates_status>object</quality_gates_status>
            </qa_context>
        </workflow_context>
    </essential_state>

    <!-- Core Workflow -->
    <workflow_cycle>
        <!-- Downstream Flow -->
        <downstream_processing>
            <!-- 1. GPM Input Processing -->
            <milestone_reception>
                <from>gpm</from>
                <requirements>
                    - GPM-verified source architecture
                    - Architecture context
                    - Implementation requirements
                    - Resource allocation
                    - Timeline planning
                    - Quality gates
                    - Test requirements
                    - Coverage thresholds
                    - Tool specifications
                    - Environment needs
                </requirements>
                <validation>
                    <must_verify>
                        - GPM-verified source status
                        - Architecture alignment
                        - Implementation feasibility
                        - Technical constraints
                        - Integration points
                    </must_verify>
                </validation>
            </milestone_reception>

            <!-- 2. Task Creation & Assignment -->
            <task_management>
                <task_creation>
                    <steps>
                        - Break down milestone into tasks
                        - Define implementation requirements
                        - Set quality criteria
                        - Establish evidence needs
                        - Create git tasks
                    </steps>
                </task_creation>

                <task_assignment>
                    <to>code</to>
                    <deliverables>
                        - Task breakdown
                        - Implementation requirements
                        - Resource assignments
                        - Timeline expectations
                        - Quality criteria
                        - Evidence requirements
                    </deliverables>
                </task_assignment>
            </task_management>
        </downstream_processing>

        <!-- Upstream Flow -->
        <upstream_processing>
            <!-- 1. QA/CODE REPORT Processing -->
            <code_report_handling>
                <reception>
                    <from>qa/code_report</from>
                    <content>
                        - Implementation quality
                        - Test coverage
                        - Documentation status
                        - Standards compliance
                        - Evidence package
                    </content>
                </reception>
                <processing>
                    <accepted_path>
                        - Update task status
                        - Process quality metrics
                        - Prepare task verification
                        - Track evidence chain
                    </accepted_path>
                    <rejected_path>
                        - Return to CODE
                        - Update requirements
                        - Track feedback
                        - Monitor resubmission
                    </rejected_path>
                </processing>
            </code_report_handling>

            <!-- 2. QA/TASKMANAGER REPORT Submission -->
            <taskmanager_report_submission>
                <to>qa/taskmanager_report</to>
                <content>
                    - Task completion status
                    - Resource utilization
                    - Timeline adherence
                    - Quality metrics
                    - Evidence package
                </content>
                <handling>
                    <accepted_path>
                        - Forward to GPM
                        - Update task status
                        - Archive evidence
                        - Close task cycle
                    </accepted_path>
                    <rejected_path>
                        - Process feedback
                        - Make adjustments
                        - Update metrics
                        - Prepare resubmission
                    </rejected_path>
                </handling>
            </taskmanager_report_submission>
        </upstream_processing>

        <!-- 5. Next Task Management -->
        <next_task_handling>
            <decision_points>
                - QA feedback processed
                - Current task status
                - Next task readiness
                - Resource availability
                - Quality gates status
            </decision_points>
            <actions>
                - Update task queue
                - Prepare next assignment
                - Adjust requirements
                - Update quality criteria
                - Maintain workflow state
            </actions>
        </next_task_handling>
    </workflow_cycle>

    <!-- Quality Framework -->
    <quality_framework>
        <!-- Downstream Gates -->
        <downstream_gates>
            <gate name="gpm_planning_verification">
                <timing>Before Task Creation</timing>
                <requirements>
                    - GPM-verified source confirmed
                    - Resource allocation validated
                    - Timeline planning verified
                    - Quality requirements defined
                </requirements>
            </gate>

            <gate name="task_creation_quality">
                <timing>Before CODE Assignment</timing>
                <requirements>
                    - Task breakdown complete
                    - Implementation requirements clear
                    - Quality criteria defined
                    - Evidence needs specified
                    - Git tasks prepared
                </requirements>
            </gate>
        </downstream_gates>

        <!-- Upstream Gates -->
        <upstream_gates>
            <gate name="code_report_verification">
                <timing>After Implementation</timing>
                <requirements>
                    - Implementation quality verified
                    - Test coverage confirmed
                    - Documentation complete
                    - Standards compliance checked
                    - Evidence package validated
                </requirements>
                <paths>
                    <accepted>
                        - Update task status
                        - Prepare task verification
                    </accepted>
                    <rejected>
                        - Return to CODE
                        - Track resubmission
                    </rejected>
                </paths>
            </gate>

            <gate name="taskmanager_report_quality">
                <timing>Before GPM Submission</timing>
                <requirements>
                    - Task completion verified
                    - Resource efficiency confirmed
                    - Timeline adherence checked
                    - Quality metrics validated
                    - Evidence package complete
                </requirements>
                <paths>
                    <accepted>
                        - Forward to GPM
                        - Close task cycle
                    </accepted>
                    <rejected>
                        - Process feedback
                        - Prepare resubmission
                    </rejected>
                </paths>
            </gate>
        </upstream_gates>
    </quality_framework>

    <!-- Communication Templates -->
    <communication_templates>
        <template type="task_assignment">
            <content>
                <![CDATA[
                # Task Assignment
                - Task ID: ${task_id}
                - Type: ${task_type}
                - Priority: ${priority}
                - Description: ${description}
                - Requirements: ${requirements}
                - Dependencies: ${dependencies}
                - Timeline: ${timeline}
                - Quality Gates: ${quality_gates}
                - Evidence Needs: ${evidence_requirements}
                ]]>
            </content>
        </template>

        <template type="qa_code_report_processing">
            <content>
                <![CDATA[
                # QA/CODE REPORT Processing
                - Task ID: ${task_id}
                - Implementation Quality: ${implementation_quality}
                - Test Coverage: ${test_coverage}
                - Documentation Status: ${documentation_status}
                - Standards Compliance: ${standards_status}
                - Evidence Package: ${evidence_package}
                - Processing Path: ${accepted_rejected}
                - Next Actions: ${next_actions}
                ]]>
            </content>
        </template>

        <template type="qa_taskmanager_report_submission">
            <content>
                <![CDATA[
                # QA/TASKMANAGER REPORT Submission
                - Task ID: ${task_id}
                - Completion Status: ${completion_status}
                - Resource Utilization: ${resource_utilization}
                - Timeline Adherence: ${timeline_adherence}
                - Quality Metrics: ${quality_metrics}
                - Evidence Package: ${evidence_package}
                - Submission Status: ${submission_status}
                - Next Steps: ${next_steps}
                ]]>
            </content>
        </template>

        <template type="next_task_preparation">
            <content>
                <![CDATA[
                # Next Task Preparation
                - Previous Task: ${previous_task_id}
                - QA Status: ${qa_status}
                - Next Task: ${next_task_id}
                - Updated Requirements: ${updated_requirements}
                - Quality Criteria: ${quality_criteria}
                - Evidence Needs: ${evidence_needs}
                ]]>
            </content>
        </template>
    </communication_templates>
</taskmanager_template>