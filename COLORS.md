# ROKKO Records Color Scheme Documentation

## ⚠️ CRITICAL: PERMANENT COLOR COMMITMENT ⚠️

**THIS DOCUMENT ESTABLISHES THE PERMANENT AND IMMUTABLE COLOR SCHEME FOR THE ROKKO RECORDS WEBSITE.**

### Frame Interior Color - PERMANENTLY FIXED

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

## Change Management Policy

### For the Immutable Interior Color (`--rokko-sand: #E0C290`)

**ANY MODIFICATION TO THIS COLOR REQUIRES:**

1. ✅ Explicit written approval from the project owner
2. ✅ Documentation of the business/design reason for the change
3. ✅ Update to this COLORS.md file with change history
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

The color is defined in `/styles/override-rokko.css` at line 7:

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
```

Expected output should show multiple uses of `var(--rokko-sand)` throughout the stylesheet.

---

## Visual Reference

### Frame Structure

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

### Color Hierarchy

1. **Outer Frame:** Dark Brown (`#3D2817`)
2. **Inner Background:** Light Sand (`#E0C290`) ← **IMMUTABLE**
3. **Content Text:** Dark Brown (`#201613`)

---

## Contact

For questions about this color policy or to request changes to the immutable interior color, contact the project owner.

**Remember:** The interior sand color (`#E0C290`) is not just a design choice—it's a permanent commitment to the ROKKO Records brand identity.

---

## Change History

| Date | Change | Approved By | Reason |
|------|--------|-------------|--------|
| 2025-11-17 | Initial color commitment established | Project Owner | Brand identity establishment |

---

**END OF DOCUMENT**

⚠️ **DO NOT MODIFY THE INTERIOR COLOR (#E0C290) WITHOUT FOLLOWING THE CHANGE MANAGEMENT POLICY** ⚠️
