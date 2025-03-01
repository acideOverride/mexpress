# Syntax Audit - Architect Agent

## Files Analyzed
1. .clinerules-architect
2. architect_role.md
3. architect_template_v3.md

## Findings and Fixes

### 1. .clinerules-architect

#### Inconsistent List Formatting
Lines affected:
- Lines 29-39: Mixes numbered (1.) and unnumbered (-) lists
- Lines 71-84: Inconsistent list marker spacing

Fix:
```markdown
# Before (inconsistent)
1. package-architecture.md
   - Package Boundaries
   - Package APIs
2. architecture-decisions.md
   -Technical Rationale
   - Package Impact

# After (consistent)
1. package-architecture.md
   - Package Boundaries
   - Package APIs

2. architecture-decisions.md
   - Technical Rationale
   - Package Impact
```

#### Missing Section Separators
Lines needing blank line separators:
- Between lines 38-39
- Between lines 52-53
- Between lines 83-84

Fix: Add blank line between major sections for readability

### 2. architect_role.md

#### Perfect Formatting Elements
✅ Strengths:
- Perfect heading hierarchy (# → ## → ###)
- Consistent code block formatting with ```
- Well-structured list formatting
- Clear section organization
- Detailed template structures

🔍 Patterns:
- Uses ### for subsections
- Uses - for unordered lists
- Uses 1. for ordered lists
- Uses ``` for code blocks
- Consistent indentation in templates

⚠️ Minor Issues:
- Numbering restart in some sections (e.g., QC Integration Protocol)
- Some inconsistent blank line usage between sections
- Mixed list style usage in some sections (- vs *)

### 3. architect_template_v3.md

#### XML Structure Issues
Lines with inconsistent formatting:
- Lines 16-25: List items using - are not properly aligned with XML structure
- Lines 71-76: Uses hyphens in XML content
- Lines 1104-1107: Uses hyphens in XML content

Fix:
```xml
<!-- Before -->
<paths>
    - /docs/projects/${project_name}/architecture/
    - /docs/projects/${project_name}/business/
</paths>

<!-- After -->
<paths>
    <item>/docs/projects/${project_name}/architecture/</item>
    <item>/docs/projects/${project_name}/business/</item>
</paths>
```

## Action Items

### 1. Create Formatting Scripts
```bash
#!/bin/bash
# standardize-architect-docs.sh

# Fix list markers
sed -i 's/^\s*\*/    -/' architect_role.md
sed -i 's/^   -/  -/' .clinerules-architect

# Convert XML lists to elements
sed -i 's/^\s*-\s\(.*\)/<item>\1<\/item>/' architect_template_v3.md

# Add blank lines before headers
sed -i '/^#/i\' .clinerules-architect
sed -i '/^#/i\' architect_role.md
```

### 2. Add Pre-commit Validation
```bash
#!/bin/bash
# validate-architect-docs.sh

# Check list consistency
if grep -P '^\s*\*\s' *.md; then
  echo "Error: Use - for lists, not *"
  exit 1
fi

# Check XML format
if grep -P '^\s*-\s' architect_template_v3.md; then
  echo "Error: Use XML elements for lists"
  exit 1
fi

# Check blank lines before headers
if grep -P '^[A-Z].*\n#' *.md; then
  echo "Error: Missing blank line before header"
  exit 1
fi
```

### 3. Documentation Standards
- Use - for all unordered lists
- Use proper XML elements instead of hyphens
- Add blank lines between sections
- Maintain consistent indentation (2 spaces for XML, 3 for lists)
- Use descriptive XML element names