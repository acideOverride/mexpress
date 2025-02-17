<?xml version="1.0" encoding="UTF-8"?>
<taskmanager_template>
    <!-- Core Configuration -->
    <identity>
        <version>2.0</version>
        <role>taskmanager</role>
        <purpose>Task orchestration and workflow management with quality-driven approach</purpose>
    </identity>

    <!-- Core State -->
    <essential_state>
        <current_task>
            <id>string</id>
            <status>string</status>
            <source_task_ref>string</source_task_ref>
            <source_role>string</source_role>
            <next_action>string</next_action>
            <workflow_state>string</workflow_state>
        </current_task>

        <quality_context>
            <verification_status>
                <state>string</state>
                <chain>string</chain>
                <history>string</history>
            </verification_status>
            <quality_metrics>
                <coverage>object</coverage>
                <validation>object</validation>
                <compliance>object</compliance>
            </quality_metrics>
            <validation_chain>
                <current>object</current>
                <history>array</history>
                <next>object</next>
            </validation_chain>
        </quality_context>

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

        <!-- 2. Task Creation -->
        <task_creation>
            <steps>
                - Break down milestone into tasks
                - Create git tasks for version control
                - Create code tasks for implementation
                - Define quality requirements
                - Set up evidence collection
            </steps>
            <validation>
                <requirements>
                    - Task breakdown complete
                    - Git tasks created
                    - Code tasks prepared
                    - Quality criteria defined
                    - Evidence needs specified
                </requirements>
            </validation>
        </task_creation>

        <!-- 3. Task Assignment -->
        <task_assignment>
            <to>code</to>
            <deliverables>
                - Task breakdown
                - Implementation requirements
                - Resource assignments
                - Timeline expectations
                - Test requirements
                - Coverage thresholds
                - TDD mandate
                - Tool requirements
                - Quality gates
                - Evidence collection needs
            </deliverables>
            <validation>
                <must_verify>
                    - Task clarity
                    - Resource availability
                    - Timeline feasibility
                    - Quality criteria completeness
                    - Evidence requirements
                </must_verify>
            </validation>
        </task_assignment>

        <!-- 4. QA Feedback Processing -->
        <qa_feedback_handling>
            <reception>
                <from>qa</from>
                <content>
                    - Review results
                    - Quality status
                    - Standards compliance
                    - Process validation
                    - Evidence verification
                </content>
            </reception>
            <processing>
                <steps>
                    - Analyze feedback
                    - Update task status
                    - Process quality metrics
                    - Track standards compliance
                    - Maintain evidence chain
                </steps>
            </processing>
            <next_actions>
                <options>
                    - Assign next task
                    - Request updates
                    - Close current task
                    - Update requirements
                </options>
            </next_actions>
        </qa_feedback_handling>

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
        <verification_chain>
            <points>
                - Source verification
                - Chain integrity
                - Quality context
                - Validation history
            </points>
            <tracking>
                - Monitor quality status
                - Track verification chain
                - Document decisions
                - Preserve history
            </tracking>
            <validation>
                - Verification complete
                - Chain maintained
                - Context preserved
                - History updated
            </validation>
        </verification_chain>

        <gates>
            <gate name="task_readiness">
                <timing>Before Assignment</timing>
                <requirements>
                    - GPM-verified source confirmed
                    - Task breakdown complete
                    - Resources allocated
                    - Quality criteria defined
                    - Evidence needs specified
                </requirements>
            </gate>

            <gate name="assignment_quality">
                <timing>During Task</timing>
                <requirements>
                    - Implementation quality criteria
                    - Test requirements
                    - Coverage thresholds
                    - Evidence collection needs
                    - Standards compliance
                </requirements>
            </gate>

            <gate name="feedback_processing">
                <timing>After QA Review</timing>
                <requirements>
                    - QA feedback received
                    - Quality status verified
                    - Evidence collected
                    - Standards validated
                    - Next steps defined
                </requirements>
            </gate>
        </gates>
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

        <template type="qa_feedback_processing">
            <content>
                <![CDATA[
                # QA Feedback Processing
                - Task ID: ${task_id}
                - Review Results: ${review_results}
                - Quality Status: ${quality_status}
                - Standards Compliance: ${standards_status}
                - Evidence Status: ${evidence_status}
                - Next Actions: ${next_actions}
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