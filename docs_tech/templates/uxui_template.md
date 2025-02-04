<?xml version="1.0" encoding="UTF-8"?>

<uxui_template>

<!-- Enhanced Metadata Section -->
<metadata>
<version>2.0</version>
<phase>DESIGN</phase>
<purpose>Transform requirements into user-centered design solutions with Roo integration</purpose>
<template_chain>
<previous>ASK</previous>
<current>UXUI</current>
<next>ARCHITECT</next>
</template_chain>
<hierarchical_workflow>
<chain_position>Second in hierarchical workflow</chain_position>
<transition_rules>
<from_ask>
<requirements>
<requirement>Complete business requirements</requirement>
<requirement>Validated user research</requirement>
<requirement>Defined success criteria</requirement>
<requirement>Stakeholder approval</requirement>
<requirement>Documentation chain started</requirement>
</requirements>
<validation>strict</validation>
</from_ask>
<to_architect>
<deliverables>
<deliverable>Complete design system</deliverable>
<deliverable>Component specifications</deliverable>
<deliverable>Interaction patterns</deliverable>
<deliverable>Technical constraints</deliverable>
<deliverable>Implementation guidelines</deliverable>
</deliverables>
<validation>strict</validation>
</to_architect>
</transition_rules>
<operator_mediation>
<rules>
<rule>No direct mode switching</rule>
<rule>Operator approval required</rule>
<rule>Documentation chain verified</rule>
<rule>Quality gates passed</rule>
<rule>Chain integrity maintained</rule>
</rules>
<enforcement>strict</enforcement>
</operator_mediation>
</hierarchical_workflow>
</metadata>

    <!-- Standards References -->
    <standards_references>
        <documentation_standards>
            <reference>
                <path>/opt/mExpress/docs/standards/C1.1_uxui_documentation_standards.md</path>
                <description>Comprehensive documentation standards for design artifacts, pattern libraries, style guides, and research findings</description>
                <sections>
                    <section>Design Process Documentation</section>
                    <section>Design System Documentation</section>
                    <section>Handoff Documentation</section>
                </sections>
            </reference>
        </documentation_standards>

        <quality_standards>
            <reference>
                <path>/opt/mExpress/docs/standards/C1.1.1_uxui_quality_standards.md</path>
                <description>Quality metrics and standards for design, documentation, and testing</description>
                <sections>
                    <section>Design Quality Metrics</section>
                    <section>Research Quality</section>
                    <section>Implementation Quality</section>
                </sections>
            </reference>
        </quality_standards>

        <validation_standards>
            <reference>
                <path>/opt/mExpress/docs/standards/C1.1.1_uxui_quality_standards.md#validation-frameworks</path>
                <description>Enhanced validation frameworks for design, usability, accessibility, and performance</description>
                <sections>
                    <section>Automated Validation Tools</section>
                    <section>Continuous Validation Workflows</section>
                    <section>Real-time Monitoring</section>
                    <section>Validation Reporting</section>
                </sections>
            </reference>
        </validation_standards>
    </standards_references>

    <!-- Cross References -->
    <cross_references>
        <reference_mapping>
            <reference>
                <source>validation_systems.design_validation</source>
                <target>state_management.design_states</target>
                <relationship>validates</relationship>
                <description>Design validation frameworks enforce state transition requirements</description>
            </reference>
            <reference>
                <source>documentation_responsibilities</source>
                <target>protocol_chains.handoff_protocol</target>
                <relationship>guides</relationship>
                <description>Documentation standards guide handoff process and deliverables</description>
            </reference>
            <reference>
                <source>roo_integration.tool_mapping</source>
                <target>validation_systems</target>
                <relationship>implements</relationship>
                <description>Roo tools implement validation frameworks and checks</description>
            </reference>
            <reference>
                <source>documentation_standards</source>
                <target>state_management.design_states</target>
                <relationship>governs</relationship>
                <description>Documentation standards guide state transitions and artifacts</description>
            </reference>
            <reference>
                <source>quality_standards</source>
                <target>validation_chains</target>
                <relationship>defines</relationship>
                <description>Quality standards define validation criteria and metrics</description>
            </reference>
            <reference>
                <source>validation_systems</source>
                <target>protocol_chains</target>
                <relationship>enforces</relationship>
                <description>Validation systems enforce protocol chain requirements</description>
            </reference>
            <reference>
                <source>documentation_standards</source>
                <target>validation_systems</target>
                <relationship>validates</relationship>
                <description>Documentation standards are enforced through validation systems</description>
            </reference>
        </reference_mapping>
    </cross_references>

    <!-- Design Environment Configuration -->
    <environment_configuration>
        <design_workspace>
            <base_path>/opt/mExpress/design</base_path>
            <directories>
                <research_path>/opt/mExpress/design/research</research_path>
                <wireframes_path>/opt/mExpress/design/wireframes</wireframes_path>
                <prototypes_path>/opt/mExpress/design/prototypes</prototypes_path>
                <style_guides_path>/opt/mExpress/design/style-guides</style_guides_path>
            </directories>
            <assets>
                <design_systems>/opt/mExpress/design/systems</design_systems>
                <components>/opt/mExpress/design/components</components>
                <resources>/opt/mExpress/design/resources</resources>
            </assets>
        </design_workspace>

        <context_management>
            <design_context>
                <brand_guidelines>required</brand_guidelines>
                <design_system>managed</design_system>
                <user_research>tracked</user_research>
                <accessibility_standards>enforced</accessibility_standards>
            </design_context>

            <state_tracking>
                <current_design_phase>tracked</current_design_phase>
                <artifact_versions>managed</artifact_versions>
                <review_status>monitored</review_status>
                <iteration_history>preserved</iteration_history>
            </state_tracking>

            <resource_management>
                <design_tools>
                    <wireframing>
                        <tool>figma</tool>
                        <tool>sketch</tool>
                        <integration>managed</integration>
                    </wireframing>
                    <prototyping>
                        <tool>figma_prototypes</tool>
                        <tool>principle</tool>
                        <integration>managed</integration>
                    </prototyping>
                    <validation>
                        <tool>accessibility_checkers</tool>
                        <tool>usability_testing</tool>
                        <integration>enforced</integration>
                    </validation>
                </design_tools>
            </resource_management>
        </context_management>
    </environment_configuration>

    <!-- Template Integration Configuration -->
    <template_integration>
        <integration_points>
            <ask_integration>
                <input_requirements>
                    <requirement>business_requirements</requirement>
                    <requirement>user_research</requirement>
                    <requirement>success_criteria</requirement>
                    <requirement>value_propositions</requirement>
                </input_requirements>
                <validation_gates>
                    <gate>documentation_chain_started</gate>
                    <gate>business_alignment</gate>
                    <gate>operator_approval</gate>
                    <gate>chain_integrity</gate>
                </validation_gates>
            </ask_integration>

            <architect_integration>
                <output_requirements>
                    <requirement>design_system_specifications</requirement>
                    <requirement>component_requirements</requirement>
                    <requirement>interaction_patterns</requirement>
                    <requirement>technical_constraints</requirement>
                    <requirement>implementation_guidelines</requirement>
                </output_requirements>
                <validation_gates>
                    <gate>technical_feasibility</gate>
                    <gate>implementation_clarity</gate>
                    <gate>documentation_chain_continued</gate>
                    <gate>operator_approval_secured</gate>
                    <gate>chain_integrity_verified</gate>
                </validation_gates>
            </architect_integration>

            <mode_chain_enforcement>
                <rules>
                    <rule>No direct mode switching</rule>
                    <rule>Operator approval required</rule>
                    <rule>Documentation chain verified</rule>
                    <rule>Quality gates passed</rule>
                    <rule>Chain integrity maintained</rule>
                </rules>
                <validation>strict</validation>
                <documentation>required</documentation>
                <operator_mediation>enforced</operator_mediation>
            </mode_chain_enforcement>
        </integration_points>

        <synchronization_protocols>
            <design_sync>
                <frequency>real_time</frequency>
                <scope>
                    <item>design_progress</item>
                    <item>review_status</item>
                    <item>iteration_feedback</item>
                </scope>
                <validation>required</validation>
            </design_sync>

            <artifact_sync>
                <frequency>on_update</frequency>
                <scope>
                    <item>design_files</item>
                    <item>specifications</item>
                    <item>documentation</item>
                </scope>
                <validation>required</validation>
            </artifact_sync>
        </synchronization_protocols>
    </template_integration>

    <!-- Design System Configuration -->
    <design_system_configuration>
        <system_structure>
            <foundations>
                <colors>managed</colors>
                <typography>managed</typography>
                <spacing>managed</spacing>
                <grid_system>managed</grid_system>
                <iconography>managed</iconography>
            </foundations>

            <components>
                <atomic_design>enforced</atomic_design>
                <hierarchy>
                    <atoms>tracked</atoms>
                    <molecules>tracked</molecules>
                    <organisms>tracked</organisms>
                    <templates>tracked</templates>
                    <pages>tracked</pages>
                </hierarchy>
            </components>

            <patterns>
                <interaction>documented</interaction>
                <layout>documented</layout>
                <navigation>documented</navigation>
                <forms>documented</forms>
                <feedback>documented</feedback>
            </patterns>
        </system_structure>

        <versioning>
            <strategy>semantic</strategy>
            <tracking>enforced</tracking>
            <changelog>required</changelog>
        </versioning>
    </design_system_configuration>

<!-- Enhanced Roo Tool Integration -->

    <roo_integration>
        <tool_mapping>
            <design_operations>
                <tool>
                    <name>write_to_file</name>
                    <purpose>Create and update design specifications</purpose>
                    <permissions>write_design_spec</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
                <tool>
                    <name>apply_diff</name>
                    <purpose>Make iterative design updates</purpose>
                    <permissions>modify_design</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
                <tool>
                    <name>export_design</name>
                    <purpose>Generate design assets and specifications</purpose>
                    <permissions>export_assets</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
            </design_operations>

            <design_analysis_operations>
                <tool>
                    <name>list_code_definition_names</name>
                    <purpose>Analyze design system components and patterns</purpose>
                    <permissions>read_only</permissions>
                    <context_preservation>required</context_preservation>
                    <usage>
                        - Component structure analysis
                        - Pattern identification
                        - Design system hierarchy
                        - Component relationships
                    </usage>
                </tool>
            </design_analysis_operations>

            <preview_operations>
                <tool>
                    <name>browser_action</name>
                    <purpose>Preview and validate design implementations</purpose>
                    <permissions>read_only</permissions>
                    <actions>
                        - Preview design system components
                        - Validate responsive layouts
                        - Test interactions
                        - Review accessibility
                    </actions>
                </tool>
            </preview_operations>

            <validation_commands>
                <tool>
                    <name>execute_command</name>
                    <purpose>Run design validation tools</purpose>
                    <permissions>execute_only</permissions>
                    <commands>
                        - Design system validation
                        - Accessibility checks
                        - Visual regression tests
                        - Performance benchmarks
                    </commands>
                </tool>
            </validation_commands>

            <mcp_integration>
                <tool>
                    <name>use_mcp_tool</name>
                    <purpose>Integrate external design tools</purpose>
                    <permissions>execute_only</permissions>
                    <capabilities>
                        - Design system management
                        - Accessibility testing
                        - Visual regression testing
                        - User testing coordination
                        - Design token management
                    </capabilities>
                </tool>
                <tool>
                    <name>access_mcp_resource</name>
                    <purpose>Access external design resources</purpose>
                    <permissions>read_only</permissions>
                    <resources>
                        - Design pattern libraries
                        - Component libraries
                        - UX research templates
                        - Accessibility guidelines
                        - Design system documentation
                    </resources>
                </tool>
            </mcp_integration>

            <tool_chain_integration>
                <validation_flow>
                    <step>
                        <tool>list_code_definition_names</tool>
                        <purpose>Design system analysis</purpose>
                        <sequence>1</sequence>
                        <outputs>
                            - Component hierarchy
                            - Pattern usage
                            - Design system structure
                            - Component relationships
                        </outputs>
                    </step>
                    <step>
                        <tool>browser_action</tool>
                        <purpose>Design validation</purpose>
                        <sequence>2</sequence>
                        <outputs>
                            - Visual consistency
                            - Responsive behavior
                            - Interaction patterns
                            - Accessibility compliance
                        </outputs>
                    </step>
                    <step>
                        <tool>execute_command</tool>
                        <purpose>Automated testing</purpose>
                        <sequence>3</sequence>
                        <outputs>
                            - Accessibility reports
                            - Visual regression results
                            - Performance metrics
                            - Design system compliance
                        </outputs>
                    </step>
                </validation_flow>
                <workflow_sequence>
                    1. Analyze design system components
                    2. Validate visual implementation
                    3. Run automated tests
                    4. Generate validation reports
                    5. Update design documentation
                </workflow_sequence>
            </tool_chain_integration>

            <validation_operations>
                <tool>
                    <name>read_file</name>
                    <purpose>Review design documentation and standards</purpose>
                    <permissions>read_only</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
                <tool>
                    <name>search_files</name>
                    <purpose>Analyze design patterns and components</purpose>
                    <permissions>read_only</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
                <tool>
                    <name>validate_accessibility</name>
                    <purpose>Check WCAG compliance and accessibility standards</purpose>
                    <permissions>validate_design</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
                <tool>
                    <name>check_consistency</name>
                    <purpose>Verify design system compliance</purpose>
                    <permissions>validate_design</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
            </validation_operations>

            <testing_operations>
                <tool>
                    <name>usability_test</name>
                    <purpose>Conduct usability evaluations</purpose>
                    <permissions>test_design</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
                <tool>
                    <name>prototype_test</name>
                    <purpose>Test interactive prototypes</purpose>
                    <permissions>test_design</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
                <tool>
                    <name>heuristic_evaluation</name>
                    <purpose>Perform expert usability reviews</purpose>
                    <permissions>evaluate_design</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
            </testing_operations>

            <research_operations>
                <tool>
                    <name>user_research</name>
                    <purpose>Conduct user research and analysis</purpose>
                    <permissions>conduct_research</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
                <tool>
                    <name>analytics_review</name>
                    <purpose>Analyze user behavior data</purpose>
                    <permissions>analyze_data</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
                <tool>
                    <name>feedback_collection</name>
                    <purpose>Gather and analyze user feedback</purpose>
                    <permissions>collect_feedback</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
            </research_operations>

            <collaboration_operations>
                <tool>
                    <name>share_design</name>
                    <purpose>Share designs for review</purpose>
                    <permissions>share_artifacts</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
                <tool>
                    <name>collect_feedback</name>
                    <purpose>Gather design feedback</purpose>
                    <permissions>manage_feedback</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
                <tool>
                    <name>handoff_specs</name>
                    <purpose>Generate development specifications</purpose>
                    <permissions>create_specs</permissions>
                    <context_preservation>required</context_preservation>
                </tool>
            </collaboration_operations>
        </tool_mapping>

        <environment_context>
            <working_directory>
                <base_path>/opt/mExpress/design</base_path>
                <design_path>/opt/mExpress/design/artifacts</design_path>
                <research_path>/opt/mExpress/design/research</research_path>
                <specs_path>/opt/mExpress/design/specifications</specs_path>
            </working_directory>

            <file_system_context>
                <design_files>
                    <path>/opt/mExpress/design/artifacts</path>
                    <access>read_write</access>
                </design_files>
                <design_system>
                    <path>/opt/mExpress/design/system</path>
                    <access>read_write</access>
                </design_system>
                <research_data>
                    <path>/opt/mExpress/design/research</path>
                    <access>read_write</access>
                </research_data>
            </file_system_context>

            <state_tracking>
                <current_directory>tracked</current_directory>
                <file_access_history>preserved</file_access_history>
                <tool_usage_context>maintained</tool_usage_context>
            </state_tracking>
        </environment_context>

        <permission_management>
            <allowed_operations>
                <operation>read_design_files</operation>
                <operation>write_design_files</operation>
                <operation>conduct_research</operation>
                <operation>run_tests</operation>
                <operation>create_specs</operation>
                <operation>manage_feedback</operation>
                <operation>execute_validation_tools</operation>
                <operation>analyze_design_system</operation>
                <operation>preview_designs</operation>
                <operation>access_external_resources</operation>
            </allowed_operations>

            <restricted_operations>
                <operation>modify_system_files</operation>
                <operation>access_production</operation>
                <operation>bypass_validation</operation>
            </restricted_operations>

            <mode_specific_permissions>
                <mode>design</mode>
                <allowed_tools>
                    <tool>read_file</tool>
                    <tool>write_to_file</tool>
                    <tool>apply_diff</tool>
                    <tool>search_files</tool>
                    <tool>validate_accessibility</tool>
                    <tool>check_consistency</tool>
                    <tool>usability_test</tool>
                    <tool>prototype_test</tool>
                    <tool>user_research</tool>
                    <tool>share_design</tool>
                    <tool>list_code_definition_names</tool>
                    <tool>browser_action</tool>
                    <tool>execute_command</tool>
                    <tool>use_mcp_tool</tool>
                    <tool>access_mcp_resource</tool>
                </allowed_tools>
            </mode_specific_permissions>
        </permission_management>
    </roo_integration>

    <!-- TaskManager Integration -->
    <taskmanager_integration>
        <request_handling>
            <input_processors>
                <processor name="task_request_processor">
                    <capabilities>
                        <capability>Parse task specifications</capability>
                        <capability>Extract design requirements</capability>
                        <capability>Validate resource requirements</capability>
                        <capability>Map dependencies</capability>
                    </capabilities>
                    <validation>
                        <check>Request completeness</check>
                        <check>Resource availability</check>
                        <check>Timeline feasibility</check>
                    </validation>
                </processor>

                <processor name="design_requirement_processor">
                    <capabilities>
                        <capability>Analyze design specifications</capability>
                        <capability>Map to design system</capability>
                        <capability>Identify component needs</capability>
                        <capability>Define interaction patterns</capability>
                    </capabilities>
                    <validation>
                        <check>Specification completeness</check>
                        <check>Design system alignment</check>
                        <check>Technical feasibility</check>
                    </validation>
                </processor>
            </input_processors>

            <synchronization_handlers>
                <handler name="implementation_sync">
                    <triggers>
                        <trigger>Design specification updates</trigger>
                        <trigger>Implementation feedback</trigger>
                        <trigger>Component changes</trigger>
                        <trigger>Pattern updates</trigger>
                    </triggers>
                    <actions>
                        <action>Update design documentation</action>
                        <action>Notify implementation team</action>
                        <action>Update status tracking</action>
                        <action>Schedule reviews</action>
                    </actions>
                </handler>

                <handler name="progress_sync">
                    <triggers>
                        <trigger>Design milestone completion</trigger>
                        <trigger>Review feedback</trigger>
                        <trigger>Implementation status updates</trigger>
                        <trigger>Quality gate results</trigger>
                    </triggers>
                    <actions>
                        <action>Update task status</action>
                        <action>Generate progress reports</action>
                        <action>Schedule checkpoints</action>
                        <action>Coordinate reviews</action>
                    </actions>
                </handler>
            </synchronization_handlers>
        </request_handling>

        <status_reporting>
            <reports>
                <report name="design_progress">
                    <frequency>daily</frequency>
                    <content>
                        <section>Design status</section>
                        <section>Completed items</section>
                        <section>Pending reviews</section>
                        <section>Blocking issues</section>
                        <section>Next steps</section>
                    </content>
                </report>

                <report name="implementation_alignment">
                    <frequency>per_milestone</frequency>
                    <content>
                        <section>Implementation accuracy</section>
                        <section>Visual consistency</section>
                        <section>Interaction patterns</section>
                        <section>Component compliance</section>
                        <section>Required updates</section>
                    </content>
                </report>
            </reports>
        </status_reporting>

        <feedback_handling>
            <channels>
                <channel name="implementation_feedback">
                    <priority>high</priority>
                    <response_time>same_day</response_time>
                    <escalation>
                        <trigger>unresolved > 24h</trigger>
                        <action>escalate_to_gpm</action>
                    </escalation>
                </channel>

                <channel name="review_feedback">
                    <priority>normal</priority>
                    <response_time>next_day</response_time>
                    <escalation>
                        <trigger>unresolved > 48h</trigger>
                        <action>escalate_to_lead</action>
                    </escalation>
                </channel>
            </channels>

            <resolution_process>
                <steps>
                    <step>Analyze feedback</step>
                    <step>Assess impact</step>
                    <step>Plan updates</step>
                    <step>Implement changes</step>
                    <step>Verify resolution</step>
                    <step>Update documentation</step>
                </steps>
                <validation>required</validation>
            </resolution_process>
        </feedback_handling>
    </taskmanager_integration>

    <!-- Enhanced State Management System -->
    <state_management>
        <design_states>
            <state name="RESEARCH_PHASE">
                <valid_inputs>
                    <input type="user_research">
                        <validation>research_format_check</validation>
                        <required_fields>
                            <field>user_needs</field>
                            <field>pain_points</field>
                            <field>user_journey</field>
                            <field>user_personas</field>
                            <field>research_findings</field>
                        </required_fields>
                    </input>
                </valid_inputs>
                <transitions>
                    <to>ask_PHASE</to>
                    <to>REQUEST_RESEARCH_CLARIFICATION</to>
                </transitions>
                <required_validations>
                    <validation>research_completeness</validation>
                    <validation>findings_clarity</validation>
                    <validation>data_quality</validation>
                </required_validations>
                <research_verification>
                    <checks>
                        <check>Research methodology</check>
                        <check>Data quality</check>
                        <check>Sample size adequacy</check>
                        <check>Finding relevance</check>
                    </checks>
                </research_verification>
            </state>

            <state name="ask_PHASE">
                <valid_inputs>
                    <input type="design_concepts">
                        <validation>concept_format_check</validation>
                        <required_fields>
                            <field>sketches</field>
                            <field>concept_descriptions</field>
                            <field>design_rationale</field>
                            <field>initial_wireframes</field>
                        </required_fields>
                    </input>
                </valid_inputs>
                <transitions>
                    <to>WIREFRAME_PHASE</to>
                    <to>REVISE_CONCEPTS</to>
                </transitions>
                <required_validations>
                    <validation>concept_viability</validation>
                    <validation>user_needs_alignment</validation>
                    <validation>technical_feasibility</validation>
                </required_validations>
            </state>

            <state name="WIREFRAME_PHASE">
                <valid_inputs>
                    <input type="wireframes">
                        <validation>wireframe_format_check</validation>
                        <required_fields>
                            <field>layout_structure</field>
                            <field>navigation_flow</field>
                            <field>content_hierarchy</field>
                            <field>interaction_points</field>
                        </required_fields>
                    </input>
                </valid_inputs>
                <transitions>
                    <to>VISUAL_DESIGN_PHASE</to>
                    <to>REVISE_WIREFRAMES</to>
                </transitions>
                <required_validations>
                    <validation>layout_usability</validation>
                    <validation>information_architecture</validation>
                    <validation>interaction_logic</validation>
                </required_validations>
            </state>

            <state name="VISUAL_DESIGN_PHASE">
                <valid_inputs>
                    <input type="visual_designs">
                        <validation>design_format_check</validation>
                        <required_fields>
                            <field>style_guide</field>
                            <field>component_designs</field>
                            <field>layout_compositions</field>
                            <field>responsive_variations</field>
                        </required_fields>
                    </input>
                </valid_inputs>
                <transitions>
                    <to>PROTOTYPE_PHASE</to>
                    <to>REVISE_DESIGNS</to>
                </transitions>
                <required_validations>
                    <validation>visual_consistency</validation>
                    <validation>brand_alignment</validation>
                    <validation>accessibility_standards</validation>
                </required_validations>
            </state>

            <state name="PROTOTYPE_PHASE">
                <valid_inputs>
                    <input type="prototypes">
                        <validation>prototype_format_check</validation>
                        <required_fields>
                            <field>interactive_flows</field>
                            <field>animations</field>
                            <field>state_transitions</field>
                            <field>responsive_behavior</field>
                        </required_fields>
                    </input>
                </valid_inputs>
                <transitions>
                    <to>TESTING_PHASE</to>
                    <to>REVISE_PROTOTYPE</to>
                </transitions>
                <required_validations>
                    <validation>interaction_quality</validation>
                    <validation>performance_check</validation>
                    <validation>usability_standards</validation>
                </required_validations>
            </state>

            <state name="TESTING_PHASE">
                <valid_inputs>
                    <input type="test_results">
                        <validation>test_data_check</validation>
                        <required_fields>
                            <field>usability_findings</field>
                            <field>user_feedback</field>
                            <field>performance_metrics</field>
                            <field>accessibility_report</field>
                        </required_fields>
                    </input>
                </valid_inputs>
                <transitions>
                    <to>HANDOFF_PHASE</to>
                    <to>REVISION_PHASE</to>
                </transitions>
                <required_validations>
                    <validation>test_coverage</validation>
                    <validation>feedback_analysis</validation>
                    <validation>issue_severity</validation>
                </required_validations>
            </state>

            <state name="HANDOFF_PHASE">
                <valid_inputs>
                    <input type="design_specifications">
                        <validation>spec_format_check</validation>
                        <required_fields>
                            <field>component_specs</field>
                            <field>style_guide</field>
                            <field>interaction_documentation</field>
                            <field>asset_exports</field>
                        </required_fields>
                    </input>
                </valid_inputs>
                <transitions>
                    <to>COMPLETED</to>
                    <to>REVISION_REQUESTED</to>
                </transitions>
                <required_validations>
                    <validation>specification_completeness</validation>
                    <validation>asset_quality</validation>
                    <validation>documentation_clarity</validation>
                </required_validations>
            </state>
        </design_states>

        <state_transitions>
            <transition_controls>
                <pre_transition_checks>
                    <validations>
                        <validation>Current state validation</validation>
                        <validation>Required artifacts present</validation>
                        <validation>Quality gates passed</validation>
                        <validation>Stakeholder approval</validation>
                    </validations>
                    <state_preservation>
                        <action>Create design snapshot</action>
                        <action>Log transition attempt</action>
                        <action>Preserve design context</action>
                        <action>Save version history</action>
                    </state_preservation>
                </pre_transition_checks>

                <transition_execution>
                    <steps>
                        1. Lock current design state
                        2. Validate transition requirements
                        3. Create state snapshot
                        4. Update design status
                        5. Initialize target state
                        6. Transfer design context
                        7. Verify transition success
                        8. Update global state
                    </steps>
                    <rollback_procedure>
                        1. Restore design snapshot
                        2. Revert status changes
                        3. Log rollback event
                        4. Notify stakeholders
                    </rollback_procedure>
                </transition_execution>

                <post_transition_actions>
                    <actions>
                        <action>Update state trackers</action>
                        <action>Generate transition report</action>
                        <action>Update design status</action>
                        <action>Prepare next phase</action>
                        <action>Notify stakeholders</action>
                    </actions>
                    <verifications>
                        <verification>Verify state consistency</verification>
                        <verification>Check design integrity</verification>
                        <verification>Validate context preservation</verification>
                        <verification>Confirm quality gates</verification>
                    </verifications>
                </post_transition_actions>
            </transition_controls>
        </state_transitions>

        <error_handling>
            <detection_system>
                <monitors>
                    <monitor id="STATE_MONITOR">
                        <type>state_consistency</type>
                        <check_frequency>real_time</check_frequency>
                        <detection_rules>
                            <rule>
                                <condition>state_mismatch</condition>
                                <severity>critical</severity>
                                <action>immediate_recovery</action>
                            </rule>
                        </detection_rules>
                    </monitor>

                    <monitor id="DESIGN_MONITOR">
                        <type>design_validation</type>
                        <check_frequency>on_update</check_frequency>
                        <detection_rules>
                            <rule>
                                <condition>design_inconsistency</condition>
                                <severity>high</severity>
                                <action>block_and_review</action>
                            </rule>
                        </detection_rules>
                    </monitor>
                </monitors>

                <recovery_procedures>
                    <procedure id="STATE_RECOVERY">
                        <steps>
                            1. Identify inconsistency
                            2. Lock design state
                            3. Load last valid state
                            4. Verify consistency
                            5. Resume operations
                        </steps>
                        <validation>required</validation>
                    </procedure>

                    <procedure id="DESIGN_RECOVERY">
                        <steps>
                            1. Identify design issues
                            2. Load design history
                            3. Restore valid version
                            4. Verify design state
                            5. Update documentation
                        </steps>
                        <validation>required</validation>
                    </procedure>
                </recovery_procedures>

                <monitoring_system>
                    <alerts>
                        <channels>
                            <channel>email</channel>
                            <channel>slack</channel>
                            <channel>dashboard</channel>
                        </channels>
                        <severity_levels>
                            <level name="critical">
                                <response_time>immediate</response_time>
                                <notification_type>all_channels</notification_type>
                                <escalation>required</escalation>
                            </level>
                            <level name="high">
                                <response_time>within_hour</response_time>
                                <notification_type>primary_channels</notification_type>
                                <escalation>conditional</escalation>
                            </level>
                            <level name="medium">
                                <response_time>within_day</response_time>
                                <notification_type>standard</notification_type>
                                <escalation>none</escalation>
                            </level>
                        </severity_levels>
                    </alerts>

                    <logging>
                        <level>detailed</level>
                        <retention>90_days</retention>
                        <format>structured_json</format>
                        <storage>
                            <path>/opt/mExpress/design/logs</path>
                            <backup>enabled</backup>
                            <encryption>required</encryption>
                        </storage>
                    </logging>

                    <metrics>
                        <collection>
                            <frequency>real_time</frequency>
                            <aggregation>15_minute_intervals</aggregation>
                            <retention>180_days</retention>
                        </collection>
                        <thresholds>
                            <threshold name="error_rate">
                                <warning>5_percent</warning>
                                <critical>10_percent</critical>
                            </threshold>
                            <threshold name="response_time">
                                <warning>2_seconds</warning>
                                <critical>5_seconds</critical>
                            </threshold>
                        </thresholds>
                    </metrics>
                </monitoring_system>
            </detection_system>
        </error_handling>

    </state_management>

    <!-- Enhanced Protocol Chains -->
    <protocol_chains>
        <design_workflow>
            <research_protocol>
                <phases>
                    <phase name="user_research">
                        <steps>
                            <step>
                                <name>Research Planning</name>
                                <actions>
                                    <action>Define research objectives</action>
                                    <action>Select research methods</action>
                                    <action>Identify target users</action>
                                    <action>Create research plan</action>
                                </actions>
                                <validation>research_plan_complete</validation>
                            </step>
                            <step>
                                <name>Data Collection</name>
                                <actions>
                                    <action>Conduct user interviews</action>
                                    <action>Run usability studies</action>
                                    <action>Gather analytics data</action>
                                    <action>Document observations</action>
                                </actions>
                                <validation>data_collection_complete</validation>
                            </step>
                            <step>
                                <name>Analysis</name>
                                <actions>
                                    <action>Analyze research data</action>
                                    <action>Identify patterns</action>
                                    <action>Create user personas</action>
                                    <action>Map user journeys</action>
                                </actions>
                                <validation>analysis_complete</validation>
                            </step>
                        </steps>
                        <deliverables>
                            <deliverable>Research findings report</deliverable>
                            <deliverable>User personas</deliverable>
                            <deliverable>Journey maps</deliverable>
                            <deliverable>Pain point analysis</deliverable>
                        </deliverables>
                    </phase>
                </phases>
            </research_protocol>

            <design_protocol>
                <phases>
                    <phase name="concept_development">
                        <steps>
                            <step>
                                <name>Ideation</name>
                                <actions>
                                    <action>Brainstorm solutions</action>
                                    <action>Sketch concepts</action>
                                    <action>Create mood boards</action>
                                    <action>Define design principles</action>
                                </actions>
                                <validation>ask_complete</validation>
                            </step>
                            <step>
                                <name>Wireframing</name>
                                <actions>
                                    <action>Create low-fi wireframes</action>
                                    <action>Define information architecture</action>
                                    <action>Establish navigation flows</action>
                                    <action>Map user interactions</action>
                                </actions>
                                <validation>wireframes_complete</validation>
                            </step>
                            <step>
                                <name>Visual Design</name>
                                <actions>
                                    <action>Develop visual style</action>
                                    <action>Create component library</action>
                                    <action>Design key screens</action>
                                    <action>Define responsive behavior</action>
                                </actions>
                                <validation>visual_design_complete</validation>
                            </step>
                        </steps>
                        <deliverables>
                            <deliverable>Design system documentation</deliverable>
                            <deliverable>Component library</deliverable>
                            <deliverable>Screen designs</deliverable>
                            <deliverable>Style guide</deliverable>
                        </deliverables>
                    </phase>
                </phases>
            </design_protocol>

            <prototype_protocol>
                <phases>
                    <phase name="interactive_prototyping">
                        <steps>
                            <step>
                                <name>Interaction Design</name>
                                <actions>
                                    <action>Define interactions</action>
                                    <action>Create animations</action>
                                    <action>Set up transitions</action>
                                    <action>Build user flows</action>
                                </actions>
                                <validation>interactions_complete</validation>
                            </step>
                            <step>
                                <name>Prototype Development</name>
                                <actions>
                                    <action>Build interactive prototype</action>
                                    <action>Implement animations</action>
                                    <action>Create user flows</action>
                                    <action>Test interactions</action>
                                </actions>
                                <validation>prototype_complete</validation>
                            </step>
                        </steps>
                        <deliverables>
                            <deliverable>Interactive prototype</deliverable>
                            <deliverable>Animation specifications</deliverable>
                            <deliverable>Interaction documentation</deliverable>
                            <deliverable>User flow diagrams</deliverable>
                        </deliverables>
                    </phase>
                </phases>
            </prototype_protocol>

            <testing_protocol>
                <phases>
                    <phase name="design_validation">
                        <steps>
                            <step>
                                <name>Usability Testing</name>
                                <actions>
                                    <action>Plan test scenarios</action>
                                    <action>Recruit participants</action>
                                    <action>Conduct sessions</action>
                                    <action>Document findings</action>
                                </actions>
                                <validation>testing_complete</validation>
                            </step>
                            <step>
                                <name>Accessibility Review</name>
                                <actions>
                                    <action>WCAG compliance check</action>
                                    <action>Color contrast testing</action>
                                    <action>Screen reader testing</action>
                                    <action>Keyboard navigation check</action>
                                </actions>
                                <validation>accessibility_complete</validation>
                            </step>
                            <step>
                                <name>Performance Review</name>
                                <actions>
                                    <action>Load time analysis</action>
                                    <action>Animation performance</action>
                                    <action>Interaction responsiveness</action>
                                    <action>Resource optimization</action>
                                </actions>
                                <validation>performance_complete</validation>
                            </step>
                        </steps>
                        <deliverables>
                            <deliverable>Usability report</deliverable>
                            <deliverable>Accessibility audit</deliverable>
                            <deliverable>Performance metrics</deliverable>
                            <deliverable>Improvement recommendations</deliverable>
                        </deliverables>
                    </phase>
                </phases>
            </testing_protocol>

            <handoff_protocol>
                <phases>
                    <phase name="development_handoff">
                        <steps>
                            <step>
                                <name>Asset Preparation</name>
                                <actions>
                                    <action>Export design assets</action>
                                    <action>Prepare icon sets</action>
                                    <action>Generate style guides</action>
                                    <action>Create component specs</action>
                                </actions>
                                <validation>assets_complete</validation>
                            </step>
                            <step>
                                <name>Documentation</name>
                                <actions>
                                    <action>Write implementation guides</action>
                                    <action>Document interactions</action>
                                    <action>Specify behaviors</action>
                                    <action>Define animations</action>
                                </actions>
                                <validation>documentation_complete</validation>
                            </step>
                            <step>
                                <name>Handoff Review</name>
                                <actions>
                                    <action>Review with development team</action>
                                    <action>Address technical questions</action>
                                    <action>Validate feasibility</action>
                                    <action>Clarify requirements</action>
                                </actions>
                                <validation>review_complete</validation>
                            </step>
                        </steps>
                        <deliverables>
                            <deliverable>Design specifications</deliverable>
                            <deliverable>Asset package</deliverable>
                            <deliverable>Implementation guide</deliverable>
                            <deliverable>Technical documentation</deliverable>
                        </deliverables>
                    </phase>
                </phases>
            </handoff_protocol>
        </design_workflow>

        <validation_chains>
            <chain name="design_quality">
                <validators>
                    <validator>
                        <type>user_needs_alignment</type>
                        <checks>
                            <check>Research alignment</check>
                            <check>Persona validation</check>
                            <check>Journey mapping</check>
                            <check>Problem-solution fit</check>
                        </checks>
                        <enforcement>strict</enforcement>
                    </validator>
                    <validator>
                        <type>visual_consistency</type>
                        <checks>
                            <check>Design system compliance</check>
                            <check>Style guide adherence</check>
                            <check>Component consistency</check>
                            <check>Pattern usage</check>
                        </checks>
                        <enforcement>strict</enforcement>
                    </validator>
                    <validator>
                        <type>usability_standards</type>
                        <checks>
                            <check>Navigation clarity</check>
                            <check>Information architecture</check>
                            <check>Interaction patterns</check>
                            <check>Error handling</check>
                        </checks>
                        <enforcement>strict</enforcement>
                    </validator>
                </validators>
            </chain>

            <chain name="accessibility_compliance">
                <validators>
                    <validator>
                        <type>wcag_compliance</type>
                        <checks>
                            <check>Color contrast</check>
                            <check>Text scaling</check>
                            <check>Keyboard navigation</check>
                            <check>Screen reader compatibility</check>
                        </checks>
                        <enforcement>mandatory</enforcement>
                    </validator>
                </validators>
            </chain>

            <chain name="performance_optimization">
                <validators>
                    <validator>
                        <type>interaction_performance</type>
                        <checks>
                            <check>Animation smoothness</check>
                            <check>Touch response</check>
                            <check>Scroll performance</check>
                            <check>Load time optimization</check>
                        </checks>
                        <enforcement>required</enforcement>
                    </validator>
                </validators>
            </chain>
        </validation_chains>

        <feedback_chains>
            <chain name="design_review">
                <stages>
                    <stage>
                        <name>Internal Review</name>
                        <participants>
                            <participant>Design team</participant>
                            <participant>Product team</participant>
                            <participant>Technical team</participant>
                        </participants>
                        <focus>
                            <area>Design consistency</area>
                            <area>Technical feasibility</area>
                            <area>User experience</area>
                        </focus>
                    </stage>
                    <stage>
                        <name>Stakeholder Review</name>
                        <participants>
                            <participant>Product owner</participant>
                            <participant>Business stakeholders</participant>
                            <participant>Key users</participant>
                        </participants>
                        <focus>
                            <area>Business requirements</area>
                            <area>User needs</area>
                            <area>Market fit</area>
                        </focus>
                    </stage>
                </stages>
            </chain>

            <chain name="user_feedback">
                <stages>
                    <stage>
                        <name>Usability Testing</name>
                        <methods>
                            <method>Task completion</method>
                            <method>Think-aloud protocol</method>
                            <method>User interviews</method>
                            <method>Satisfaction surveys</method>
                        </methods>
                        <metrics>
                            <metric>Success rate</metric>
                            <metric>Time on task</metric>
                            <metric>Error rate</metric>
                            <metric>Satisfaction score</metric>
                        </metrics>
                    </stage>
                </stages>
            </chain>
        </feedback_chains>

    </protocol_chains>

    <!-- Validation Systems -->
    <validation_systems>
        <mode_chain_validation>
            <framework name="hierarchical_workflow">
                <position>Second in chain</position>
                <transitions>
                    <from_ask>
                        <validation>
                            <requirements>
                                <requirement>Business requirements complete</requirement>
                                <requirement>User research validated</requirement>
                                <requirement>Success criteria defined</requirement>
                                <requirement>Documentation chain started</requirement>
                            </requirements>
                            <operator_approval>required</operator_approval>
                        </validation>
                    </from_ask>
                    <to_architect>
                        <deliverables>
                            <deliverable>Design system complete</deliverable>
                            <deliverable>Component specifications</deliverable>
                            <deliverable>Interaction patterns</deliverable>
                            <deliverable>Technical constraints</deliverable>
                            <deliverable>Implementation guidelines</deliverable>
                        </deliverables>
                        <validation>
                            <requirements>
                                <requirement>Design documentation complete</requirement>
                                <requirement>Technical feasibility verified</requirement>
                                <requirement>Documentation chain continued</requirement>
                                <requirement>Operator approval secured</requirement>
                            </requirements>
                        </validation>
                    </to_architect>
                </transitions>
                <enforcement>strict</enforcement>
            </framework>
        </mode_chain_validation>

        <design_validation>
            <frameworks>
                <framework name="component_validation">
                    <checks>
                        <visual_checks>
                            <check>Design system compliance</check>
                            <check>Visual consistency</check>
                            <check>Layout alignment</check>
                            <check>Typography hierarchy</check>
                        </visual_checks>
                        <functional_checks>
                            <check>Component behavior</check>
                            <check>State management</check>
                            <check>Interaction patterns</check>
                            <check>Responsive design</check>
                        </functional_checks>
                        <documentation_checks>
                            <check>Component documentation</check>
                            <check>Usage guidelines</check>
                            <check>Props documentation</check>
                            <check>Example implementations</check>
                        </documentation_checks>
                    </checks>
                    <tools>
                        <tool>design_system_validator</tool>
                        <tool>visual_regression_testing</tool>
                        <tool>component_analyzer</tool>
                    </tools>
                </framework>
            </frameworks>
            <automation>
                <ci_integration>enabled</ci_integration>
                <validation_frequency>on_commit</validation_frequency>
                <reporting>automated</reporting>
            </automation>
        </design_validation>

        <usability_validation>
            <frameworks>
                <framework name="user_testing">
                    <methods>
                        <method>task_analysis</method>
                        <method>user_interviews</method>
                        <method>heuristic_evaluation</method>
                        <method>cognitive_walkthrough</method>
                    </methods>
                    <metrics>
                        <metric>task_success_rate</metric>
                        <metric>time_on_task</metric>
                        <metric>error_rate</metric>
                        <metric>user_satisfaction</metric>
                    </metrics>
                </framework>
            </frameworks>
            <automation>
                <testing_schedule>regular</testing_schedule>
                <participant_recruitment>managed</participant_recruitment>
                <results_analysis>automated</results_analysis>
            </automation>
        </usability_validation>

        <accessibility_validation>
            <frameworks>
                <framework name="wcag_compliance">
                    <standards>
                        <standard>WCAG_2.1_AA</standard>
                        <standard>Section_508</standard>
                    </standards>
                    <testing_tools>
                        <tool>axe_core</tool>
                        <tool>wave</tool>
                        <tool>screen_readers</tool>
                    </testing_tools>
                </framework>
            </frameworks>
            <automation>
                <ci_integration>enabled</ci_integration>
                <regular_audits>scheduled</regular_audits>
                <compliance_reporting>automated</compliance_reporting>
            </automation>
        </accessibility_validation>

        <performance_validation>
            <frameworks>
                <framework name="performance_metrics">
                    <metrics>
                        <metric>load_time</metric>
                        <metric>interaction_time</metric>
                        <metric>animation_fps</metric>
                        <metric>memory_usage</metric>
                    </metrics>
                    <tools>
                        <tool>lighthouse</tool>
                        <tool>web_vitals</tool>
                        <tool>performance_monitor</tool>
                    </tools>
                </framework>
            </frameworks>
            <automation>
                <monitoring>continuous</monitoring>
                <benchmarking>automated</benchmarking>
                <alerting>enabled</alerting>
            </automation>
        </performance_validation>
    </validation_systems>

    <!-- Documentation Standards -->
    <documentation_standards>
        <design_documentation_standards>
            <framework name="documentation_quality">
                <standards>
                    <standard name="Component Documentation">
                        <requirements>
                            <requirement>
                                <name>Completeness</name>
                                <criteria>
                                    <criterion>All props documented</criterion>
                                    <criterion>Usage examples provided</criterion>
                                    <criterion>Edge cases covered</criterion>
                                    <criterion>Accessibility notes included</criterion>
                                </criteria>
                            </requirement>
                            <requirement>
                                <name>Clarity</name>
                                <criteria>
                                    <criterion>Clear explanation of purpose</criterion>
                                    <criterion>Code examples are concise</criterion>
                                    <criterion>Visual aids when needed</criterion>
                                    <criterion>Consistent terminology</criterion>
                                </criteria>
                            </requirement>
                            <requirement>
                                <name>Maintainability</name>
                                <criteria>
                                    <criterion>Version history tracked</criterion>
                                    <criterion>Last update date visible</criterion>
                                    <criterion>Reviewers listed</criterion>
                                    <criterion>Change process documented</criterion>
                                </criteria>
                            </requirement>
                        </requirements>
                    </standard>
                </standards>
                <validation>
                    <automated_checks>enabled</automated_checks>
                    <review_process>mandatory</review_process>
                    <update_frequency>on_change</update_frequency>
                </validation>
            </framework>
        </design_documentation_standards>
    </documentation_standards>

    <!-- Quality Standards -->
    <quality_standards>
        <design_quality_standards>
            <framework name="quality_metrics">
                <categories>
                    <category name="Visual Quality">
                        <metrics>
                            <metric>
                                <name>Design System Compliance</name>
                                <threshold>98%</threshold>
                                <measurement>automated_check</measurement>
                                <frequency>per_commit</frequency>
                            </metric>
                            <metric>
                                <name>Visual Consistency</name>
                                <threshold>95%</threshold>
                                <measurement>visual_regression</measurement>
                                <frequency>daily</frequency>
                            </metric>
                            <metric>
                                <name>Responsive Design</name>
                                <threshold>100%</threshold>
                                <measurement>breakpoint_testing</measurement>
                                <frequency>per_release</frequency>
                            </metric>
                        </metrics>
                    </category>
                    <category name="User Experience">
                        <metrics>
                            <metric>
                                <name>Task Success Rate</name>
                                <threshold>90%</threshold>
                                <measurement>user_testing</measurement>
                                <frequency>per_feature</frequency>
                            </metric>
                            <metric>
                                <name>Error Rate</name>
                                <threshold>5%</threshold>
                                <measurement>analytics</measurement>
                                <frequency>continuous</frequency>
                            </metric>
                            <metric>
                                <name>User Satisfaction</name>
                                <threshold>4.5/5</threshold>
                                <measurement>surveys</measurement>
                                <frequency>monthly</frequency>
                            </metric>
                        </metrics>
                    </category>
                    <category name="Performance">
                        <metrics>
                            <metric>
                                <name>Load Time</name>
                                <threshold>2s</threshold>
                                <measurement>automated_testing</measurement>
                                <frequency>per_deploy</frequency>
                            </metric>
                            <metric>
                                <name>Animation FPS</name>
                                <threshold>60fps</threshold>
                                <measurement>performance_monitoring</measurement>
                                <frequency>continuous</frequency>
                            </metric>
                            <metric>
                                <name>Memory Usage</name>
                                <threshold>100MB</threshold>
                                <measurement>resource_monitoring</measurement>
                                <frequency>continuous</frequency>
                            </metric>
                        </metrics>
                    </category>
                </categories>
                <validation>
                    <automated_monitoring>enabled</automated_monitoring>
                    <alert_thresholds>configured</alert_thresholds>
                    <reporting_frequency>weekly</reporting_frequency>
                </validation>
            </framework>
        </design_quality_standards>
    </quality_standards>

    <!-- Documentation Responsibilities -->
    <documentation_responsibilities>
        <design_documentation>
            <components>
                <specifications>
                    <format>markdown</format>
                    <location>/opt/mExpress/design/docs/components</location>
                    <required_sections>
                        <section>Component overview</section>
                        <section>Props and configuration</section>
                        <section>Usage examples</section>
                        <section>Accessibility considerations</section>
                        <section>Performance implications</section>
                    </required_sections>
                    <maintenance>
                        <frequency>on_change</frequency>
                        <reviewers>design_team</reviewers>
                        <versioning>required</versioning>
                    </maintenance>
                </specifications>
            </components>
        </design_documentation>

        <pattern_libraries>
            <structure>
                <organization>
                    <categories>
                        <category>Layout patterns</category>
                        <category>Navigation patterns</category>
                        <category>Input patterns</category>
                        <category>Feedback patterns</category>
                        <category>Content patterns</category>
                    </categories>
                    <metadata>
                        <item>Usage guidelines</item>
                        <item>Implementation details</item>
                        <item>Accessibility notes</item>
                        <item>Examples</item>
                    </metadata>
                </organization>
                <maintenance>
                    <frequency>bi_weekly</frequency>
                    <review_process>structured</review_process>
                    <updates_tracking>required</updates_tracking>
                </maintenance>
            </structure>
        </pattern_libraries>

        <style_guides>
            <components>
                <visual_language>
                    <elements>
                        <element>Color palette</element>
                        <element>Typography system</element>
                        <element>Spacing system</element>
                        <element>Grid system</element>
                        <element>Icon system</element>
                    </elements>
                    <documentation>
                        <item>Usage rules</item>
                        <item>Implementation guidelines</item>
                        <item>Accessibility requirements</item>
                    </documentation>
                </visual_language>
                <maintenance>
                    <frequency>monthly</frequency>
                    <review_process>mandatory</review_process>
                    <version_control>required</version_control>
                </maintenance>
            </components>
        </style_guides>

        <user_research_findings>
            <documentation>
                <research_reports>
                    <structure>
                        <section>Executive summary</section>
                        <section>Methodology</section>
                        <section>Key findings</section>
                        <section>Recommendations</section>
                        <section>Supporting data</section>
                    </structure>
                    <format>
                        <type>markdown</type>
                        <templates>standardized</templates>
                        <storage>version_controlled</storage>
                    </format>
                </research_reports>
                <maintenance>
                    <archival>required</archival>
                    <accessibility>team_wide</accessibility>
                    <updates>as_needed</updates>
                </maintenance>
            </documentation>
        </user_research_findings>
    </documentation_responsibilities>

</uxui_template>
