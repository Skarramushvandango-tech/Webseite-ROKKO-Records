# ROKKO Records Audio Player

A modern, accessible, and responsive audio player designed for ROKKO Records with full playlist functionality, keyboard navigation, and ARIA labels.

## Features

- ✅ **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- ✅ **Keyboard Accessible**: Full keyboard navigation support with ARIA labels
- ✅ **Playlist Management**: Dynamic playlist with track selection
- ✅ **Playback Controls**: Play/Pause, Previous/Next track navigation
- ✅ **Progress Bar**: Seek through tracks with visual progress indication
- ✅ **Volume Control**: Adjustable volume with mute/unmute functionality
- ✅ **Cover Art Display**: Shows album artwork for each track
- ✅ **ROKKO Color Scheme**: Uses official ROKKO Records color palette (from COLOR_GUIDE.md)

## Installation & Testing

### Local Testing

1. **Simple Method** (no server required for some browsers):
   ```bash
   open audioplayer/index.html
   ```
   Or double-click on `index.html`

2. **Recommended Method** (with local server to avoid CORS issues):
   ```bash
   # From project root directory
   cd audioplayer
   python3 -m http.server 8000
   ```
   Then open http://localhost:8000 in your browser

3. **Alternative Servers**:
   ```bash
   # Using Node.js
   npx http-server -p 8000
   
   # Using PHP
   php -S localhost:8000
   ```

## Configuration

### Adding Tracks to the Playlist

Edit the `playlist` array in `audioplayer/audioplayer.js`:

```javascript
const playlist = [
    {
        title: "Your Track Title",
        artist: "Artist Name",
        audioSrc: "assets/your-track.mp3",
        coverSrc: "assets/your-cover.jpg"
    },
    // Add more tracks...
];
```

### Asset Organization

Place your media files in the `audioplayer/assets/` directory:

```
audioplayer/
├── assets/
│   ├── track1.mp3           # Audio files
│   ├── track2.mp3
│   ├── track3.mp3
│   ├── cover1.jpg           # Cover art images
│   ├── cover2.jpg
│   ├── cover3.jpg
│   └── cover-placeholder.jpg # Default cover art
├── index.html
├── audioplayer.css
├── audioplayer.js
└── README.md
```

### Supported Formats

- **Audio**: MP3, WAV, OGG, M4A
- **Images**: JPG, PNG, WebP, GIF

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `←` (Left Arrow) | Previous track (or seek back 5s when progress bar is focused) |
| `→` (Right Arrow) | Next track (or seek forward 5s when progress bar is focused) |
| `↑` (Up Arrow) | Increase volume |
| `↓` (Down Arrow) | Decrease volume |
| `M` | Mute/Unmute |
| `L` | Toggle playlist |
| `Tab` | Navigate between controls |
| `Enter` | Activate focused button/track |

## Integration into Website

### Method 1: Embedded Player

Include the player in any page:

```html
<link rel="stylesheet" href="/audioplayer/audioplayer.css">

<div class="player-container">
    <!-- Copy content from index.html -->
</div>

<audio id="audioElement" preload="metadata"></audio>
<script src="/audioplayer/audioplayer.js"></script>
```

### Method 2: Iframe Integration

```html
<iframe 
    src="/audioplayer/index.html" 
    width="100%" 
    height="600px"
    frameborder="0"
    title="ROKKO Records Audio Player">
</iframe>
```

### Method 3: Standalone Page

Link to the player as a separate page:
```html
<a href="/audioplayer/index.html">Listen Now</a>
```

## Color Customization

The player uses CSS variables that align with the ROKKO Records brand identity:

```css
:root {
    --bg: #997A4B;              /* Content background */
    --accent: #B8935F;          /* Accent color */
    --gold1: #E0C290;           /* Primary sand color (IMMUTABLE per COLOR_GUIDE.md) */
    --rokko-brown: #201613;     /* Dark brown text */
    --rokko-brown-dark: #3D2817; /* Frame borders */
}
```

⚠️ **Note**: The `--gold1` (#E0C290) color is permanently fixed per the COLOR_GUIDE.md and should not be changed.

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility Features

- **ARIA Labels**: All interactive elements have descriptive ARIA labels
- **Keyboard Navigation**: Full keyboard control support
- **Focus Indicators**: Clear visual focus states for keyboard users
- **Screen Reader Support**: Semantic HTML and proper ARIA roles
- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **High Contrast**: Sufficient color contrast ratios (WCAG AA compliant)

## Troubleshooting

### Audio Not Playing

1. Check that MP3 files exist in `audioplayer/assets/` directory
2. Verify file paths in the `playlist` array match actual file names
3. Run from a web server (not directly from file system) to avoid CORS issues
4. Check browser console for error messages

### Cover Images Not Loading

1. Ensure image files exist in `audioplayer/assets/` directory
2. Verify image paths in the `playlist` array
3. Check that image files are in supported formats (JPG, PNG, WebP)
4. Add a placeholder image: `assets/cover-placeholder.jpg`

### Browser CORS Errors

Run the player from a local web server instead of opening the HTML file directly:
```bash
python3 -m http.server 8000
```

## Design Notes

This player implementation:
- Uses the official ROKKO Records color palette
- Features responsive design for all screen sizes
- Provides full keyboard and screen reader accessibility
- Includes smooth animations and transitions
- Implements modern web standards and best practices

## License

© ROKKO Records. All rights reserved.
