# Color Policy Enforcement

## Purpose

This document serves as a reference for automated checks and code reviewers to ensure the immutable color policy is maintained.

## Immutable Color Declaration

The following color value is declared immutable and must never be changed:

```css
--rokko-sand: #E0C290
```

## Validation Rules

### For Code Review

When reviewing pull requests, verify:

1. ✅ The value `#E0C290` is not modified in any CSS files
2. ✅ The variable `--rokko-sand` is not reassigned to a different value
3. ✅ No inline styles override this color without proper justification
4. ✅ Any color changes are documented in COLORS.md

### Automated Checks

The following patterns should trigger a review flag:

```bash
# Patterns that require approval
--rokko-sand:.*(?!#E0C290)
#E0C290.*(?=changed|modified|updated)
```

## Change Request Process

If a change to the immutable color is absolutely necessary:

1. Open an issue explaining the business/design reason
2. Tag the project owner for approval
3. Document the change in COLORS.md with:
   - Date of change
   - Approver name
   - Justification
   - New color value and reason
4. Update this policy document

## Contact

For questions about this policy, contact the project owner.

---

**Last Updated:** 2025-11-17
**Policy Version:** 1.0
