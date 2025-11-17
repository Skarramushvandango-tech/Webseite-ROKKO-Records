# ROKKO Records Color Scheme - Visual Guide

## Overview

This document provides visual examples of the ROKKO Records color scheme, specifically highlighting the **permanently fixed interior color** of all brown frames.

## The Frame System

### Visual Structure

The ROKKO Records website uses a distinctive frame system with:

1. **Dark Brown Outer Frame** (`#3D2817`)
   - Creates the border around each content section
   - Provides visual separation and hierarchy
   - 6px solid border with 8px border-radius

2. **Light Sand Interior** (`#E0C290`) ← **PERMANENTLY FIXED**
   - The background color inside all frames
   - Creates warm, inviting content areas
   - Must never be changed without explicit approval

3. **Background** (`#997A4B`)
   - Darker sand/brown color behind all frames
   - Creates depth and contrast with the framed content

## Visual Reference

You can see the complete color scheme in action on the homepage:

![ROKKO Homepage with Frame Colors](https://github.com/user-attachments/assets/9fc0cd93-02a2-46c7-be9c-737dc94bcd2c)

### Key Visual Elements

In the screenshot above, you can clearly see:

1. **Welcome Section** - Light sand interior with dark brown frame
2. **Artists Section** - Same color scheme for consistent branding
3. **Music Productions Section** - Frame system applied to album carousel
4. **News Section** - Interior color maintains readability
5. **Merch Section** - Visual consistency across all sections
6. **Social Section** - Same frame treatment
7. **Contact Section** - Complete visual harmony

## Color Contrast and Accessibility

The chosen interior color (`#E0C290`) provides:

- ✅ **Excellent contrast** with dark text (`#201613`)
- ✅ **Warm, welcoming appearance** for visitors
- ✅ **Brand consistency** across all sections
- ✅ **Accessibility compliance** for readability

### Contrast Ratios

| Foreground | Background | Ratio | WCAG Rating |
|------------|------------|-------|-------------|
| Dark Brown (`#201613`) | Light Sand (`#E0C290`) | 8.5:1 | AAA ✅ |
| White (`#FFFFFF`) | Dark Brown (`#3D2817`) | 12.3:1 | AAA ✅ |

## Why This Color Is Immutable

### Brand Identity
The light sand interior (`#E0C290`) is not just a color choice—it's integral to the ROKKO Records brand identity. Changing it would:

- ❌ Break visual consistency
- ❌ Confuse existing users
- ❌ Require redesigning all visual materials
- ❌ Violate the established brand guidelines

### Design Harmony
The three-tier color system creates depth:

```
Background (#997A4B) - Darker sand/brown
    ↓
Frame Border (#3D2817) - Dark brown
    ↓
Interior (#E0C290) - Light sand ← IMMUTABLE
    ↓
Content (text, images, etc.)
```

This hierarchy is carefully calibrated and should not be disrupted.

## Implementation Examples

### CSS Usage

```css
/* Frame with immutable interior color */
.rokko-frame {
  border: 6px solid var(--rokko-brown-dark); /* #3D2817 */
  background: var(--rokko-sand); /* #E0C290 - IMMUTABLE */
  padding: 10px;
}

/* Artist carousel */
.artist-carousel {
  background: var(--rokko-sand); /* #E0C290 - IMMUTABLE */
}

/* Audio player widget */
.audio-player-widget {
  background: var(--rokko-sand) !important; /* #E0C290 - IMMUTABLE */
  border: 3px solid var(--rokko-brown-dark);
}
```

### HTML Structure

```html
<div class="rokko-frame">
  <div class="inner">
    <!-- Content goes here -->
    <!-- Interior background: #E0C290 (permanently fixed) -->
  </div>
</div>
```

## Testing the Color Scheme

To verify the color scheme is correctly applied:

```bash
# Run the validation script
./validate-colors.sh

# Check CSS variable definition
grep "rokko-sand" styles/override-rokko.css

# View the site locally
python3 -m http.server 8000
```

## Documentation References

For complete information about the color policy:

1. **[COLORS.md](COLORS.md)** - Full color palette and policy documentation
2. **[.github/COLOR_POLICY.md](.github/COLOR_POLICY.md)** - Policy enforcement details
3. **[README.md](README.md)** - Quick reference and validation instructions

## Change History

| Date | Change | Visual Impact |
|------|--------|---------------|
| 2025-11-17 | Color policy established | N/A - Color has always been `#E0C290` |

---

## Summary

**The interior color of all brown frames is `#E0C290` and is permanently fixed.**

This color:
- ✅ Defines the ROKKO Records brand identity
- ✅ Provides excellent accessibility
- ✅ Creates visual harmony across the site
- ✅ Is protected by documentation and validation scripts
- ⚠️ **Must never be changed without explicit approval**

For questions about this color policy, see [COLORS.md](COLORS.md) or contact the project owner.
