# 🎨 ROKKO Records Color Quick Reference

## ⚠️ IMMUTABLE COLOR - READ THIS FIRST

```
--rokko-sand: #E0C290
```

**THIS COLOR IS PERMANENTLY FIXED AND CANNOT BE CHANGED WITHOUT APPROVAL**

---

## Quick Facts

| Property | Value |
|----------|-------|
| Variable | `--rokko-sand` |
| Hex | `#E0C290` |
| RGB | `rgb(224, 194, 144)` |
| Name | Light Sand |
| Usage | Interior of all brown frames |
| Status | 🔒 **IMMUTABLE** |

---

## Where Is It Used?

✅ Frame backgrounds  
✅ Carousel containers  
✅ Audio player widgets  
✅ Artist dropdown backgrounds  
✅ All content section interiors  

---

## How to Validate

```bash
./validate-colors.sh
```

Expected output:
```
✅ SUCCESS: Immutable color is correctly defined
```

---

## Documentation

📖 **Full Documentation:** [COLORS.md](../COLORS.md)  
🖼️ **Visual Guide:** [COLOR_VISUAL_GUIDE.md](../COLOR_VISUAL_GUIDE.md)  
📋 **Policy:** [COLOR_POLICY.md](COLOR_POLICY.md)  
📝 **Implementation:** [IMPLEMENTATION_SUMMARY.md](../IMPLEMENTATION_SUMMARY.md)  

---

## Change Request

To change this color, you MUST:

1. Open an issue with justification
2. Get explicit approval from project owner
3. Update all documentation
4. Follow the change management process in COLORS.md

**Unauthorized changes will be rejected.**

---

## Visual Example

![Frame Color Example](https://github.com/user-attachments/assets/9fc0cd93-02a2-46c7-be9c-737dc94bcd2c)

---

## CSS Usage

```css
/* Correct - Using the variable */
.my-element {
  background: var(--rokko-sand);
}

/* Incorrect - Hardcoding the value */
.my-element {
  background: #E0C290; /* Don't do this! Use var(--rokko-sand) */
}
```

---

## For Code Reviewers

When reviewing PRs, check:

- [ ] `#E0C290` is not modified
- [ ] `--rokko-sand` is not reassigned
- [ ] No inline styles override this color
- [ ] Any color changes are documented

If the immutable color is changed:
- ❌ Request changes
- 📝 Ask for approval documentation
- 🔄 Verify change management process was followed

---

**Remember: The sand interior color is not just a design choice—it's a permanent commitment to the ROKKO Records brand identity.**

🔒 **DO NOT MODIFY WITHOUT APPROVAL** 🔒
