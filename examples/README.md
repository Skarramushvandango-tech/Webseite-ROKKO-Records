# ROKKO Styles - Integration Guide

This directory contains examples and documentation for the new ROKKO player and carousel styles.

## 📁 Files Added

### CSS Updates
- **styles/override-rokko.css** - Updated with new frame, headline, and carousel styles

### JavaScript
- **assets/js/carousel-simple.js** - Carousel navigation with arrow controls

### Demo Pages
- **examples/headline-usage.html** - Comprehensive demo showcasing all new styles

## 🎨 New CSS Classes

### 1. Rokko Frame
Dark brown outer frame with light sand interior:

```html
<div class="rokko-frame">
  <div class="inner">
    <!-- Your content here -->
  </div>
</div>
```

### 2. Headline Images
Full-width images with minimal frame spacing:

```html
<div class="rokko-frame">
  <div class="inner">
    <div class="headline-container">
      <img src="../images/beats.png" alt="Beats" class="headline-img">
    </div>
    <!-- More content -->
  </div>
</div>
```

### 3. Artist Carousel
Horizontal scrollable carousel with rounded covers and arrow navigation:

```html
<div class="artist-carousel">
  <h3>Collection Title</h3>
  <div class="carousel-track">
    <div class="cover">
      <img src="path/to/cover.png" alt="Album">
    </div>
    <!-- More covers -->
  </div>
</div>
```

## 🔧 CSS Variables

All colors are centralized for easy customization:

```css
:root {
  --rokko-sand: #E0C290;           /* Light sand for interiors */
  --rokko-brown: #201613;          /* Dark brown for text */
  --rokko-brown-dark: #2d1f1b;    /* Darker brown for hovers */
  --rokko-accent: #d9af6b;         /* Gold accent color */
  --frame-color: #3D2817;          /* Frame border color */
  --carousel-arrow-bg: rgba(224, 194, 144, 0.9); /* Arrow background */
}
```

## 🚀 Integration Steps

### Option 1: Add to Existing Pages

1. Ensure `styles/override-rokko.css` is loaded in your HTML:
```html
<link rel="stylesheet" href="styles/override-rokko.css">
```

2. Add the carousel JavaScript before closing `</body>` tag:
```html
<script src="assets/js/carousel-simple.js"></script>
```

3. Use the new classes in your HTML markup (see examples above)

### Option 2: Use as Reference

Copy the relevant CSS rules from `styles/override-rokko.css` (search for "ROKKO FRAME STYLES", "HEADLINE IMAGE STYLES", and "ARTIST CAROUSEL STYLES") into your preferred CSS file.

## 📋 Features

✅ **Dark brown frames** (#3D2817) with light sand interiors (#E0C290)  
✅ **Wider headline images** with minimal spacing  
✅ **Rounded carousel covers** with shadow effects  
✅ **Round navigation arrows** (desktop only, auto-hidden on mobile)  
✅ **Consistent color variables** for easy customization  
✅ **Responsive design** for mobile and desktop  
✅ **Horizontal mousewheel support** for carousels  
✅ **Smooth scroll animations**  

## 🧪 Testing Locally

1. Start a local HTTP server:
```bash
cd /path/to/Webseite-ROKKO-Records
python3 -m http.server 8080
```

2. Open in browser:
```
http://localhost:8080/examples/headline-usage.html
```

3. Test responsiveness by resizing browser window

## 🌐 GitHub Pages / Netlify

The demo page is ready for deployment. Simply:

1. **GitHub Pages**: Enable Pages in repository settings, select branch
2. **Netlify**: Connect repository and deploy

Access the demo at: `https://your-site.com/examples/headline-usage.html`

## 📸 Visual Examples

See `examples/headline-usage.html` for:
- Basic frame examples
- Headline image integration
- Carousel functionality
- Combined examples
- Audio player styling

## 🔍 Troubleshooting

### Arrows Not Appearing
- Arrows are desktop-only (hidden on mobile via CSS)
- Check browser console for JavaScript errors
- Ensure `carousel-simple.js` is loaded

### Images Not Loading
- Verify image paths are correct relative to HTML file
- Check that images exist in `/images/` and `/mp3/` directories
- Use browser DevTools Network tab to check for 404 errors

### Styles Not Applied
- Confirm `override-rokko.css` is loaded after other stylesheets
- Check browser console for CSS loading errors
- Verify CSS variable support in browser (IE11 not supported)

## 💡 Customization Tips

### Change Colors
Edit CSS variables in `styles/override-rokko.css`:
```css
:root {
  --rokko-sand: #YOUR_COLOR;
  --frame-color: #YOUR_COLOR;
}
```

### Adjust Carousel Speed
In `assets/js/carousel-simple.js`, modify:
```javascript
const scrollAmount = track.offsetWidth * 0.7; // Change 0.7 to desired value
```

### Modify Frame Thickness
In `styles/override-rokko.css`:
```css
.rokko-frame {
  border: 6px solid var(--frame-color); /* Change 6px to desired thickness */
}
```

## 📝 Notes

- **No Breaking Changes**: New styles are additive, existing functionality unchanged
- **Non-invasive**: Carousel JS only affects `.artist-carousel` elements
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile-First**: Responsive by default with mobile-specific optimizations

## 🤝 Support

For issues or questions, refer to:
- Demo page: `examples/headline-usage.html`
- CSS file: `styles/override-rokko.css` (sections are clearly commented)
- JS file: `assets/js/carousel-simple.js` (well-documented code)
