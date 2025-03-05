# Syntax Audit - Git Agent

[Previous content remains the same...]

### 2. git_template_v3.md

#### XML List Format Issues
Lines using hyphens instead of proper XML elements:
- Lines 17-24: Read paths listing
- Lines 28-29: Write paths listing
- Lines 75-81: Repository validation points
- Lines 83-88: Tracking requirements
- Lines 92-98: Operation QA validation points
- Lines 100-105: Quality preservation points

Fix:
```xml
<!-- Before -->
<validation_points>
    - Structure integrity
    - Access control
    - History preservation
</validation_points>

<!-- After -->
<validation_points>
    <point>Structure integrity</point>
    <point>Access control</point>
    <point>History preservation</point>
</validation_points>
```

#### Long Lines
Lines exceeding readable length:
- Line 7: Purpose description
- Line 361: Long naming convention pattern
- Line 386: Long monorepo naming convention
- Line 430: Long hotfix naming convention
- Line 477: Long commit message pattern

Fix:
```xml
<!-- Before -->
<naming_convention>pkg/${PACKAGE_NAME}/${TASK_ID}-${descriptive-name}</naming_convention>

<!-- After -->
<naming_convention>
    pkg/${PACKAGE_NAME}/${TASK_ID}-${descriptive-name}
</naming_convention>
```

#### Inconsistent List Formatting
Lines with inconsistent list formats:
- Lines 494-499: Admin permissions using hyphens
- Lines 503-508: Developer permissions using hyphens
- Lines 516-518: Branch protection scope using hyphens
- Lines 533-536: Security scan targets using hyphens
- Lines 580-584: Commit rules using hyphens

Fix:
```xml
<!-- Before -->
<permissions>
    - manage_branches
    - force_push
</permissions>

<!-- After -->
<permissions>
    <permission>manage_branches</permission>
    <permission>force_push</permission>
</permissions>
```

#### Missing XML Schema Reference
Issue: No XML schema validation specified
Fix: Add schema reference:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE git_template SYSTEM "git_template.dtd">
<git_template>
```

## Action Items

### 1. Update Standardization Script
```bash
#!/bin/bash
# standardize-git-docs.sh

[Previous script content remains the same...]

# Fix git_template_v3.md
# Convert lists to XML elements
sed -i 's/^\s*-\s\(.*\)/<item>\1<\/item>/' git_template_v3.md

# Add schema reference
sed -i '1i<!DOCTYPE git_template SYSTEM "git_template.dtd">' git_template_v3.md

# Fix indentation
xmllint --format git_template_v3.md --output git_template_v3.md

# Wrap long lines
fold -s -w 100 git_template_v3.md > temp && mv temp git_template_v3.md
```

### 2. Update Pre-commit Validation
```bash
#!/bin/bash
# validate-git-docs.sh

[Previous validation rules remain the same...]

# Add XML validation for git_template_v3.md
if ! xmllint --noout git_template_v3.md; then
  echo "Error: Invalid XML format"
  exit 1
fi

# Check for hyphen lists in XML
if grep -P '^\s*-\s' git_template_v3.md; then
  echo "Error: Convert hyphen lists to XML elements"
  exit 1
fi

# Check line length
if grep -P '.{101,}' git_template_v3.md; then
  echo "Error: Lines too long (max 100 chars)"
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
- Use proper element naming conventions
- Validate XML schema compliance