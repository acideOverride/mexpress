# Syntax Audit - GPM Agent

[Previous content remains the same...]

### 2. gpm_template_v3.md

#### XML List Format Issues
Lines using hyphens instead of proper XML elements:
- Lines 17-23: Read paths listing
- Lines 27-28: Write paths listing
- Lines 64-69: Requirements listing
- Lines 74-78: Acceptance process listing
- Lines 80-84: Rejection process listing
- Lines 90-95: Metrics listing

Fix:
```xml
<!-- Before -->
<paths>
    - /docs/projects/${project_name}/architecture/
    - /docs/projects/${project_name}/business/
</paths>

<!-- After -->
<paths>
    <path>/docs/projects/${project_name}/architecture/</path>
    <path>/docs/projects/${project_name}/business/</path>
</paths>
```

#### Long Lines
Lines exceeding readable length:
- Line 7: Purpose description
- Line 1068: Next actions description
- Line 1096: Next actions description
- Multiple lines in CDATA sections (1424-1494)

Fix:
```xml
<!-- Before -->
<purpose>High-level project oversight and milestone management with task-based workflow</purpose>

<!-- After -->
<purpose>
    High-level project oversight and milestone management 
    with task-based workflow
</purpose>
```

#### CDATA Section Formatting
Issue: CDATA sections contain unformatted markdown
Lines affected: 1424-1494

Fix:
```xml
<![CDATA[
# Milestone Status Update
- Milestone: {milestone_id}
- Current State: {current_state}
- Progress: {progress_percentage}%

Source Verification:
- Status: {source_verification_status}
- Chain: {verification_chain_status}
- Quality: {documentation_quality}
]]>
```

#### Inconsistent Indentation
Lines with inconsistent indentation:
- Lines 1270-1277: Validation points using inconsistent spacing
- Lines 1279-1284: Verification tracking points using inconsistent spacing
- Lines 1301-1306: QC verification metrics using inconsistent spacing

Fix:
```xml
<!-- Before -->
<validation_points>
    - Requirements validated
    - Resources allocated
</validation_points>

<!-- After -->
<validation_points>
    <point>Requirements validated</point>
    <point>Resources allocated</point>
</validation_points>
```

## Action Items

### 1. Update Standardization Script
```bash
#!/bin/bash
# standardize-gpm-docs.sh

[Previous script content remains the same...]

# Fix gpm_template_v3.md
# Convert lists to XML elements
sed -i 's/^\s*-\s\(.*\)/<item>\1<\/item>/' gpm_template_v3.md

# Add schema reference
sed -i '1i<!DOCTYPE gpm_template SYSTEM "gpm_template.dtd">' gpm_template_v3.md

# Fix indentation
xmllint --format gpm_template_v3.md --output gpm_template_v3.md

# Wrap long lines
fold -s -w 100 gpm_template_v3.md > temp && mv temp gpm_template_v3.md
```

### 2. Update Pre-commit Validation
```bash
#!/bin/bash
# validate-gpm-docs.sh

[Previous validation rules remain the same...]

# Add XML validation for gpm_template_v3.md
if ! xmllint --noout gpm_template_v3.md; then
  echo "Error: Invalid XML format"
  exit 1
fi

# Check for hyphen lists in XML
if grep -P '^\s*-\s' gpm_template_v3.md; then
  echo "Error: Convert hyphen lists to XML elements"
  exit 1
fi

# Check line length
if grep -P '.{101,}' gpm_template_v3.md; then
  echo "Error: Lines too long (max 100 chars)"
  exit 1
fi

# Check CDATA formatting
if grep -P '^\s*#' gpm_template_v3.md; then
  echo "Error: Format markdown in CDATA sections"
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
- Format CDATA sections properly
- Use proper element naming conventions
- Validate XML schema compliance