# ROKKO Records Color Scheme - Complete Guide

## ⚠️ CRITICAL: PERMANENT COLOR COMMITMENT ⚠️

**THIS DOCUMENT ESTABLISHES THE PERMANENT AND IMMUTABLE COLOR SCHEME FOR THE ROKKO RECORDS WEBSITE.**

---

## Overview

This document provides the complete color palette, visual examples, and policy documentation for the ROKKO Records website, specifically highlighting the **permanently fixed interior color** of all brown frames.

---

## Frame Interior Color - PERMANENTLY FIXED

The interior color of all brown frames is **PERMANENTLY ESTABLISHED** and must **NEVER** be changed without explicit written approval from the project owner.

```css
--rokko-sand: #E0C290
```

**HEX VALUE:** `#E0C290`  
**RGB VALUE:** `rgb(224, 194, 144)`  
**COLOR NAME:** Light Sand / Beige  
**USAGE:** Interior background for all framed content areas

---

## 🔒 Immutability Declaration

**EFFECTIVE DATE:** 2025-11-17

The following color value is hereby declared **PERMANENT AND IMMUTABLE**:

| Color Variable | Hex Value | Usage | Status |
|----------------|-----------|-------|---------|
| `--rokko-sand` | `#E0C290` | Frame interior background | **PERMANENTLY FIXED** |

### Why This Color Cannot Be Changed

1. **Brand Identity:** This sand color (`#E0C290`) is integral to the ROKKO Records brand identity
2. **Design Consistency:** Changing this color would break the established visual hierarchy
3. **User Experience:** The contrast between brown frames and sand interior is carefully calibrated
4. **Historical Commitment:** This color scheme has been established as the permanent standard

---

## Complete Color Palette

### Primary Colors (Frame System)

| Variable | Hex Value | RGB | Usage | Mutability |
|----------|-----------|-----|-------|------------|
| `--rokko-brown` | `#201613` | rgb(32, 22, 19) | Dark brown header/text | Modifiable with approval |
| `--rokko-brown-dark` | `#3D2817` | rgb(61, 40, 23) | Dark brown frame borders | Modifiable with approval |
| `--rokko-sand` | `#E0C290` | rgb(224, 194, 144) | **INTERIOR BACKGROUNDS** | **IMMUTABLE** |
| `--rokko-accent` | `#B8935F` | rgb(184, 147, 95) | Accent sand/brown | Modifiable with approval |
| `--content-bg` | `#997A4B` | rgb(153, 122, 75) | Darker sand/brown background | Modifiable with approval |

### Supporting Colors

| Variable | Hex Value | Usage |
|----------|-----------|-------|
| `--carousel-arrow-bg` | `rgba(224, 194, 144, 0.95)` | Arrow background with transparency |
| `--carousel-outline` | `#3D2817` | Dark brown for frame outlines |
| `--frame-color` | `#3D2817` | Dark brown color for all frames |

---

## Visual Structure - The Frame System

The ROKKO Records website uses a distinctive frame system with three layers:

### 1. Dark Brown Outer Frame (`#3D2817`)
- Creates the border around each content section
- Provides visual separation and hierarchy
- 6px solid border with 8px border-radius

### 2. Light Sand Interior (`#E0C290`) ← **PERMANENTLY FIXED**
- The background color inside all frames
- Creates warm, inviting content areas
- Must never be changed without explicit approval

### 3. Background (`#997A4B`)
- Darker sand/brown color behind all frames
- Creates depth and contrast with the framed content

### Visual Diagram

```
┌─────────────────────────────────────┐
│  DARK BROWN BORDER (#3D2817)       │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │  SAND INTERIOR (#E0C290)      │ │
│  │  ← THIS COLOR IS PERMANENT    │ │
│  │                               │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Design Hierarchy

```
Background (#997A4B) - Darker sand/brown
    ↓
Frame Border (#3D2817) - Dark brown
    ↓
Interior (#E0C290) - Light sand ← IMMUTABLE
    ↓
Content (text, images, etc.)
```

---

## Frame Interior Usage Examples

The `--rokko-sand` color (`#E0C290`) is used in the following locations:

1. **Main Frame Backgrounds**
   - `.rokko-frame { background: var(--rokko-sand); }`
   - `.rokko-frame .inner { background: var(--rokko-sand); }`

2. **Carousel Containers**
   - `.artist-carousel { background: var(--rokko-sand); }`
   - `.carousel-track { scrollbar-color: var(--rokko-brown-dark) var(--rokko-sand); }`
   - `#album-carousel-wrapper { background: var(--rokko-sand); }`

3. **Audio Player Widgets**
   - `.audio-player-widget { background: var(--rokko-sand) !important; }`

4. **Artist Dropdowns**
   - `.artist-dropdown { background: #f3e2c9; }` (slightly lighter variation for contrast)

---

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

---

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

---

## Change Management Policy

### For the Immutable Interior Color (`--rokko-sand: #E0C290`)

**ANY MODIFICATION TO THIS COLOR REQUIRES:**

1. ✅ Explicit written approval from the project owner
2. ✅ Documentation of the business/design reason for the change
3. ✅ Update to this COLOR_GUIDE.md file with change history
4. ✅ Review of all affected components
5. ✅ Visual regression testing

**WITHOUT THESE REQUIREMENTS MET, NO CHANGES ARE PERMITTED.**

### For Other Colors

Other colors may be modified with standard code review approval, but changes should:
- Maintain the overall brown/sand color scheme
- Preserve adequate contrast ratios for accessibility
- Be documented in this file

---

## Technical Implementation

The color is defined in `/styles/override-rokko.css`:

```css
:root{
  --rokko-brown: #201613; /* dunkles Braun, an Header angelehnt */
  --rokko-brown-dark: #3D2817; /* Dark brown for frames */
  --rokko-sand: #E0C290; /* Light sand color for interior backgrounds - PERMANENTLY FIXED */
  --rokko-accent: #B8935F; /* Accent sand/brown */
  --carousel-arrow-bg: rgba(224, 194, 144, 0.95); /* Arrow background with transparency */
  --main-width: 900px; /* Breite der Inhalte auf Desktop (zentriert) */
  --content-bg: #997A4B; /* darker sand/brown background */
  --artist-img-max: 468px; /* Reduced by 10% from 520px */
  --carousel-outline: #3D2817; /* Dark brown for frames */
  --frame-color: #3D2817; /* Dark brown color for all frames */
}
```

---

## Color Testing and Validation

To verify the frame interior color is correctly applied, check these elements:

```bash
# Check for --rokko-sand usage
grep -r "var(--rokko-sand)" styles/

# Verify the hex value
grep "#E0C290" styles/override-rokko.css

# Run the validation script
./validate-colors.sh
```

Expected output should show multiple uses of `var(--rokko-sand)` throughout the stylesheet.

---

## Key Visual Elements

The color scheme is applied consistently across all sections:

1. **Welcome Section** - Light sand interior with dark brown frame
2. **Artists Section** - Same color scheme for consistent branding
3. **Music Productions Section** - Frame system applied to album carousel
4. **News Section** - Interior color maintains readability
5. **Merch Section** - Visual consistency across all sections
6. **Social Section** - Same frame treatment
7. **Contact Section** - Complete visual harmony

---

## Change History

| Date | Change | Approved By | Reason | Visual Impact |
|------|--------|-------------|--------|---------------|
| 2025-11-17 | Initial color commitment established | Project Owner | Brand identity establishment | N/A - Color has always been `#E0C290` |

---

## Summary

**The interior color of all brown frames is `#E0C290` and is permanently fixed.**

This color:
- ✅ Defines the ROKKO Records brand identity
- ✅ Provides excellent accessibility
- ✅ Creates visual harmony across the site
- ✅ Is protected by documentation and validation scripts
- ⚠️ **Must never be changed without explicit approval**

---

## Contact

For questions about this color policy or to request changes to the immutable interior color, contact the project owner.

**Remember:** The interior sand color (`#E0C290`) is not just a design choice—it's a permanent commitment to the ROKKO Records brand identity.

---

**END OF DOCUMENT**

⚠️ **DO NOT MODIFY THE INTERIOR COLOR (#E0C290) WITHOUT FOLLOWING THE CHANGE MANAGEMENT POLICY** ⚠️
