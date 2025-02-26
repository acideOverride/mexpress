# Syntax Audit - QC Agent

[Previous content remains the same...]

### 2. qc_template_v3.md

#### XML List Format Issues
Lines using hyphens instead of proper XML elements:
- Lines 17-22: Read paths listing
- Lines 26-31: Write paths listing
- Lines 49-55: Package Architecture requirements
- Lines 57-63: Monorepo Architecture requirements
- Lines 1142-1147: External tools listing
- Lines 1150-1155: Data exchange listing

Fix:
```xml
<!-- Before -->
<paths>
    - /docs/architecture/
    - /docs/qc/
    - /docs/standards/
</paths>

<!-- After -->
<paths>
    <path>/docs/architecture/</path>
    <path>/docs/qc/</path>
    <path>/docs/standards/</path>
</paths>
```

#### Message Template Issues
Issue: Message templates contain unformatted text
Lines affected: 41-77, 84-132

Fix:
```xml
<template>
    <![CDATA[
    Roo: QC
    PROJECT: ${project_name}
    RECEIVED FROM: ARCHITECT - ${task_name} - ${brq_reference}
    MILESTONE: ${sprint_name} - ${milestone_description}
    ]]>
</template>
```

#### Process Steps Format Issues
Lines using numbered lists without proper XML structure:
- Lines 139-145: Initial Reception Phase steps
- Lines 146-152: Verification Phase steps
- Lines 153-159: Analysis Phase steps
- Lines 160-166: Return to ARCHITECT steps

Fix:
```xml
<!-- Before -->
<steps>
    1. Initial Reception Phase
       - Receive architecture package
       - Review quality criteria
</steps>

<!-- After -->
<steps>
    <phase id="1" name="Initial Reception Phase">
        <step>Receive architecture package</step>
        <step>Review quality criteria</step>
    </phase>
</steps>
```

#### Inconsistent Indentation
Lines with inconsistent indentation:
- Lines 741-748: Components section using inconsistent spacing
- Lines 750-756: State tracking section using inconsistent spacing
- Lines 815-821: Checkpoints section using inconsistent spacing

Fix:
```xml
<!-- Before -->
<components>
    - Current verification phase
    - Architecture package state
</components>

<!-- After -->
<components>
    <item>Current verification phase</item>
    <item>Architecture package state</item>
</components>
```

## Action Items

### 1. Update Standardization Script
```bash
#!/bin/bash
# standardize-qc-docs.sh

[Previous script content remains the same...]

# Fix qc_template_v3.md
# Convert lists to XML elements
sed -i 's/^\s*-\s\(.*\)/<item>\1<\/item>/' qc_template_v3.md

# Add schema reference
sed -i '1i<!DOCTYPE qc_template SYSTEM "qc_template.dtd">' qc_template_v3.md

# Fix indentation
xmllint --format qc_template_v3.md --output qc_template_v3.md

# Format message templates
sed -i '/<template>/,/<\/template>/ s/^[^<].*/<![CDATA[&]]>/' qc_template_v3.md

# Convert numbered lists to XML
sed -i 's/^\s*[0-9]\.\s\(.*\)/<phase id="&" name="\1">/' qc_template_v3.md
```

### 2. Update Pre-commit Validation
```bash
#!/bin/bash
# validate-qc-docs.sh

[Previous validation rules remain the same...]

# Add XML validation for qc_template_v3.md
if ! xmllint --noout qc_template_v3.md; then
  echo "Error: Invalid XML format"
  exit 1
fi

# Check for hyphen lists in XML
if grep -P '^\s*-\s' qc_template_v3.md; then
  echo "Error: Convert hyphen lists to XML elements"
  exit 1
fi

# Check message templates
if grep -P '^[^<].*$' qc_template_v3.md | grep -v 'CDATA'; then
  echo "Error: Message templates must be wrapped in CDATA"
  exit 1
fi

# Check numbered lists
if grep -P '^\s*[0-9]\.' qc_template_v3.md; then
  echo "Error: Convert numbered lists to XML structure"
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
- Format message templates with CDATA sections
- Convert numbered lists to proper XML structure
- Use descriptive element names
- Add appropriate comments for major sections
- Follow consistent XML structure
- Use proper element naming conventions
- Validate XML schema compliance