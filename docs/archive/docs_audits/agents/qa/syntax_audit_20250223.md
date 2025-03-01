# Syntax Audit - QA Agent

[Previous content remains the same...]

### 2. qa_template_v3.md

#### XML List Format Issues
Lines using hyphens instead of proper XML elements:
- Lines 12-17: Implementation Verification responsibilities
- Lines 23-28: Task Management Verification responsibilities
- Lines 34-39: Project Management Verification responsibilities
- Lines 53-58: Quality Verification functions
- Lines 90-100: Read paths listing
- Lines 104-107: Write paths listing

Fix:
```xml
<!-- Before -->
<responsibilities>
    - Verify implementation quality
    - Check test coverage
    - Validate documentation
</responsibilities>

<!-- After -->
<responsibilities>
    <item>Verify implementation quality</item>
    <item>Check test coverage</item>
    <item>Validate documentation</item>
</responsibilities>
```

#### Long Lines
Lines exceeding readable length:
- Line 7: Purpose description
- Line 279: Next actions description
- Line 298: Next actions description
- Multiple lines in message format templates (717-834)

Fix:
```xml
<!-- Before -->
<purpose>Quality verification and evidence management across development pipeline</purpose>

<!-- After -->
<purpose>
    Quality verification and evidence management 
    across development pipeline
</purpose>
```

#### Message Format Template Issues
Issue: Message format templates contain unformatted text
Lines affected: 717-834

Fix:
```xml
<template>
    <![CDATA[
    Roo: QA/CODE REPORT
    PROJECT: ${project_name}
    TASK: ${task_name} - ${brq_reference}
    STATUS: [ACCEPTED/REJECTED]

    IMPLEMENTATION VERIFICATION:
      Quality:
        - Implementation: ${implementation_quality}
        - Test Coverage: ${test_coverage}
    ]]>
</template>
```

#### Inconsistent Indentation
Lines with inconsistent indentation:
- Lines 872-877: Components section using inconsistent spacing
- Lines 883-888: Components section using inconsistent spacing
- Lines 894-899: Sections listing using inconsistent spacing

Fix:
```xml
<!-- Before -->
<components>
    - Progress status
    - Flow position
</components>

<!-- After -->
<components>
    <item>Progress status</item>
    <item>Flow position</item>
</components>
```

## Action Items

### 1. Update Standardization Script
```bash
#!/bin/bash
# standardize-qa-docs.sh

[Previous script content remains the same...]

# Fix qa_template_v3.md
# Convert lists to XML elements
sed -i 's/^\s*-\s\(.*\)/<item>\1<\/item>/' qa_template_v3.md

# Add schema reference
sed -i '1i<!DOCTYPE qa_template SYSTEM "qa_template.dtd">' qa_template_v3.md

# Fix indentation
xmllint --format qa_template_v3.md --output qa_template_v3.md

# Wrap long lines
fold -s -w 100 qa_template_v3.md > temp && mv temp qa_template_v3.md

# Format message templates
sed -i '/<template>/,/<\/template>/ s/^[^<].*/<![CDATA[&]]>/' qa_template_v3.md
```

### 2. Update Pre-commit Validation
```bash
#!/bin/bash
# validate-qa-docs.sh

[Previous validation rules remain the same...]

# Add XML validation for qa_template_v3.md
if ! xmllint --noout qa_template_v3.md; then
  echo "Error: Invalid XML format"
  exit 1
fi

# Check for hyphen lists in XML
if grep -P '^\s*-\s' qa_template_v3.md; then
  echo "Error: Convert hyphen lists to XML elements"
  exit 1
fi

# Check line length
if grep -P '.{101,}' qa_template_v3.md; then
  echo "Error: Lines too long (max 100 chars)"
  exit 1
fi

# Check message format templates
if grep -P '^[^<].*$' qa_template_v3.md | grep -v 'CDATA'; then
  echo "Error: Message templates must be wrapped in CDATA"
  exit 1
fi
```

### 3. Documentation Standards

#### Markdown Standards
[Previous standards remain the same...]

#### XML Standards
- Use proper XML elements instead of hyphens for lists
- Include XML schema validation
- Maintain consistent indentation (2 spaces)
- Wrap long lines at 100 characters
- Use descriptive element names
- Add appropriate comments for major sections
- Follow consistent XML structure
- Format message templates with CDATA sections
- Use proper element naming conventions
- Validate XML schema compliance