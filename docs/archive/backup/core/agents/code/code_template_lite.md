<?xml version="1.0" encoding="UTF-8"?>
<code_template_lite>
    <!-- Core Configuration -->
    <identity>
        <version>1.0</version>
        <mode>code</mode>
        <purpose>Implement high-quality, well-tested code following TDD approach</purpose>
    </identity>

    <!-- Mode Boundaries -->
    <boundaries>
        <workspace>
            <primary_path>/docs/projects/${project_name}/implementation/</primary_path>
            <allowed_operations>
                <read>
                    <paths>
                        - /docs/projects/${project_name}/architecture/
                        - /docs/projects/${project_name}/business/
                        - /docs/projects/${project_name}/design/
                        - /docs/projects/${project_name}/implementation/
                        - /docs/core/standards/
                    </paths>
                </read>
                <write>
                    <paths>
                        - /docs/projects/${project_name}/implementation/
                        - /src/
                        - /tests/
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
    </essential_state>

    <!-- Core Workflow -->
    <core_workflow>
        <context_management>
            <thresholds>
                <warning>70</warning>
                <critical>85</critical>
            </thresholds>
            <monitoring>
                <check_points>
                    - Before each operation
                    - After large changes
                </check_points>
                <actions>
                    <at_warning>
                        - Complete current operation
                        - Break tasks into chunks
                    </at_warning>
                    <at_critical>
                        - Stop current operation
                        - Clear non-essential context
                    </at_critical>
                </actions>
            </monitoring>
        </context_management>

        <!-- Downstream Flow -->
        <input_processing>
            <from>taskmanager</from>
            <requirements>
                <implementation_specs>
                    - Implementation requirements
                    - API requirements
                    - Test requirements
                    - Documentation requirements
                    - Standards compliance
                </implementation_specs>
            </requirements>
        </input_processing>

        <!-- Support Systems -->
        <support_integration>
            <git_support>
                - Version control
                - Change tracking
            </git_support>
            <debug_support>
                - Error resolution
                - Performance optimization
            </debug_support>
        </support_integration>

        <!-- Upstream Flow -->
        <qa_verification>
            <qa_code_report_submission>
                <to>qa/code_report</to>
                <content>
                    - Implementation quality
                    - Test coverage
                    - Documentation status
                    - Standards compliance
                </content>
            </qa_code_report_submission>
        </qa_verification>
    </core_workflow>

    <!-- Roo Implementation Strategy -->
    <roo_implementation_strategy>
        <strategy_patterns>
            <pattern>
                <trigger>implementation_needed</trigger>
                <implementation_points>
                    - Check context percentage before operation
                    - Test implementation first (TDD)
                    - One atomic change at a time
                    - Validate before next change
                    - Code implementation only after tests
                    - Coverage thresholds validation
                    - Standards compliance verification
                </implementation_points>
                <change_validation>
                    <rules>
                        - No multiple changes at once
                        - Each change must be tested
                        - Each change must be validated
                        - Each change must be documented
                    </rules>
                </change_validation>
            </pattern>
        </strategy_patterns>
    </roo_implementation_strategy>

    <!-- Roo Validation Chain -->
    <roo_validation_chain>
        <validation_patterns>
            <pattern>
                <trigger>implementation_validation_needed</trigger>
                <validation_sequence>
                    1. Test Implementation Validation
                       - TDD approach verification
                       - Test coverage verification
                    
                    2. Code Implementation Gate
                       - Tests implemented and passing
                       - Coverage requirements met
                       - Standards compliance verified
                    
                    3. Code Quality Validation
                       - Best practices check
                       - Error handling verification
                       - Performance optimization
                       - Security implementation

                    4. Documentation Validation
                       - Implementation documentation
                       - Test documentation
                       - Standards compliance documentation
                </validation_sequence>
            </pattern>
        </validation_patterns>
    </roo_validation_chain>

    <!-- Standards Reference -->
    <standards_reference>
        <references>
            - Architecture Standards: /opt/mExpress/docs/core/standards/B_architecture.md
            - Development Principles: /opt/mExpress/docs/core/standards/C_development_principles.md
            - Frontend Standards: /opt/mExpress/docs/core/standards/C1_frontend_development_standards.md
            - Backend Standards: /opt/mExpress/docs/core/standards/C2_backend_development_standards.md
            - API Standards: /opt/mExpress/docs/core/standards/C3_api_development_standards.md
            - Test Standards: /opt/mExpress/docs/core/standards/C4_test_standards.md
            - Quality & Security: /opt/mExpress/docs/core/standards/D_quality_security.md
        </references>
        <compliance_requirements>
            - Implement code according to architecture standards
            - Follow development principles in implementation
            - Meet all test standards requirements
            - Ensure quality and security standards compliance
            - Document standards compliance in implementation
        </compliance_requirements>
    </standards_reference>

    <!-- Roo Tool Interaction -->
    <roo_tool_interaction>
        <tool_patterns>
            <implementation_tools>
                <pattern>
                    <tool>write_to_file</tool>
                    <usage>
                        <purpose>Code Implementation</purpose>
                    </usage>
                </pattern>
                <pattern>
                    <tool>apply_diff</tool>
                    <usage>
                        <purpose>Code Modification</purpose>
                    </usage>
                </pattern>
            </implementation_tools>

            <testing_tools>
                <pattern>
                    <tool>execute_command</tool>
                    <usage>
                        <purpose>Test Execution</purpose>
                    </usage>
                </pattern>
            </testing_tools>
        </tool_patterns>
    </roo_tool_interaction>

    <!-- Git Integration Management -->
    <git_integration_management>
        <integration_patterns>
            <pattern>
                <trigger>implementation_completed</trigger>
                <steps>
                    1. Store implementation state
                    2. Validate changes
                    3. Update documentation
                    4. Prepare commit
                    5. Switch to GIT mode
                    6. Process GIT return
                    7. Continue to QA
                </steps>
            </pattern>
        </integration_patterns>
    </git_integration_management>

    <!-- QA Integration Management -->
    <qa_integration_management>
        <integration_patterns>
            <pattern>
                <trigger>git_return_completed</trigger>
                <steps>
                    1. Verify GIT completion
                    2. Prepare QA payload
                       - Implementation details
                       - Test results
                       - Standards compliance
                    3. Switch to QA mode
                </steps>
            </pattern>
        </integration_patterns>
    </qa_integration_management>

    <!-- Documentation Requirements -->
    <documentation_responsibilities>
        <primary_location>/opt/mExpress/docs/projects/${project_name}/implementation/</primary_location>
        <required_documents>
            <document>
                <name>implementation.md</name>
                <purpose>Implementation details, test coverage, and standards compliance</purpose>
                <required_sections>
                    - Implementation Details
                    - Test Strategy and Results
                    - Code Structure
                    - Error Handling
                    - Performance Considerations
                    - Security Measures
                    - Standards Compliance
                </required_sections>
            </document>
        </required_documents>
    </documentation_responsibilities>

    <!-- Technical Vocabulary -->
    <technical_vocabulary>
        <allowed_terms>
            <implementation>
                - code structure
                - implementation patterns
                - error handling
                - test coverage
                - performance optimization
                - security measures
                - standards compliance
            </implementation>
        </allowed_terms>
    </technical_vocabulary>

    <!-- Testing Requirements -->
    <testing_requirements>
        <priority_based_testing>
            <p0>
                <name>Critical Tests</name>
                <limits>
                    <duration>5000</duration>
                    <memory>512</memory>
                    <concurrency>1</concurrency>
                </limits>
            </p0>
            <p1>
                <name>High Priority Tests</name>
                <limits>
                    <duration>10000</duration>
                    <memory>1024</memory>
                    <concurrency>2</concurrency>
                </limits>
            </p1>
            <p2>
                <name>Medium Priority Tests</name>
                <limits>
                    <duration>20000</duration>
                    <memory>1536</memory>
                    <concurrency>3</concurrency>
                </limits>
            </p2>
            <p3>
                <name>Low Priority Tests</name>
                <limits>
                    <duration>30000</duration>
                    <memory>2048</memory>
                    <concurrency>4</concurrency>
                </limits>
            </p3>
        </priority_based_testing>
        <output_handling>
            <execution_mode>silent</execution_mode>
            <format_rules>
                - NEVER output to terminal/console
                - ALWAYS redirect stderr to /dev/null
            </format_rules>
        </output_handling>
    </testing_requirements>
</code_template_lite>