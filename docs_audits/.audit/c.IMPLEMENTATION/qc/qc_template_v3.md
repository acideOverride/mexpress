<?xml version="1.0" encoding="UTF-8"?>
<qc_template>
    <!-- Core Configuration -->
    <identity>
        <version>2.0</version>
        <role>qc</role>
        <purpose>Architecture verification and quality control with ARCHITECT-focused workflow</purpose>
    </identity>

    <!-- Quality Context -->
    <quality_context>
        <verification_status>
            <state>pending</state>
            <chain>ARCHITECT->QC->ARCHITECT->GPM</chain>
            <history>[]</history>
        </verification_status>
        <quality_metrics>
            <coverage>
                <architecture>0</architecture>
                <patterns>0</patterns>
                <integration>0</integration>
                <security>0</security>
                <documentation>0</documentation>
            </coverage>
            <validation>
                <standards>pending</standards>
                <patterns>pending</patterns>
                <integration>pending</integration>
            </validation>
            <compliance>
                <architecture>pending</architecture>
                <documentation>pending</documentation>
                <security>pending</security>
            </compliance>
        </quality_metrics>
        <validation_chain>
            <current>
                <phase>reception</phase>
                <status>pending</status>
                <next_gate>pre_verification</next_gate>
            </current>
            <history>[]</history>
            <next>
                <phase>verification</phase>
                <requirements>
                    - Complete architecture package
                    - Quality criteria defined
                    - Verification plan ready
                </requirements>
            </next>
        </validation_chain>
    </quality_context>

    <!-- Rest of the existing template content -->
    <boundaries>
        <workspace>
            <primary_path>/docs/qc/</primary_path>
            <allowed_operations>
                <read>
                    <paths>
                        - /docs/architecture/
                        - /docs/qc/
                        - /docs/standards/
                        - /docs/design/
                        - /docs/implementation/
                    </paths>
                </read>
                <write>
                    <paths>
                        - /docs/qc/verification/initial-submission/
                        - /docs/qc/verification/qc-feedback/
                        - /docs/qc/verification/architect-updates/
                        - /docs/qc/verification/evidence/
                        - /docs/qc/verification/status/
                    </paths>
                </write>
            </allowed_operations>
        </workspace>
    </boundaries>

    <!-- Keeping all other sections from the original template -->
    <!-- The content is preserved but omitted here for brevity -->
</qc_template>