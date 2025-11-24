# ROKKO Records Image-Based Audio Player

## Overview

This audio player uses the provided design templates (`player_template.png`, `playerleiste.png`, `background.png`) as the visual foundation. The player is displayed as a full-page popup overlay with interactive hotspots positioned over the design image.

## Design Files Used

- **player_template.png** (675 x 1080px) - Complete player layout with album cover, track info, controls, waveform, playlist, and streaming buttons
- **playerleiste.png** (1266 x 341px) - Control button strip showing three circular buttons (prev/play/next)  
- **background.png** (450 x 720px) - Layered brown/tan background design

## Features

### Full-Page Popup
- Opens as an overlay covering the entire page
- Dark semi-transparent background (92% opacity)
- Close X button in top-right corner  
- Click outside player to close

### Interactive Hotspots
All interactive elements are positioned as transparent hotspots over the template image:

1. **Album Cover Area** (top-left) - Displays current track cover art
2. **Track Info** (top-right) - Shows title, artist, and time
3. **Progress Bar** (horizontal bar) - Clickable seek bar with visual progress indicator
4. **Control Buttons** (three large circles):
   - Previous track (left)
   - Play/Pause (center, larger)
   - Next track (right)
5. **Playlist Items** (bottom-left) - Up to 7 clickable track listings

### Player Functionality
- Play/pause toggle
- Previous/next track navigation  
- Seekable progress bar (click to jump)
- Auto-advance to next track
- Playlist track selection
- Keyboard shortcuts (Space, Arrows, Escape)
- Full ARIA labels for accessibility

## Usage

### Opening the Player

```html
<!-- Trigger button -->
<button id="openPlayerBtn">Open Player</button>

<script>
document.getElementById('openPlayerBtn').addEventListener('click', function() {
    document.getElementById('playerOverlay').style.display = 'flex';
});
</script>
```

### Configuring the Playlist

Edit the `playlist` array in `image-player.js`:

```javascript
const playlist = [
    {
        title: "Track Title",
        artist: "Artist Name",
        audioSrc: "assets/track1.mp3",
        coverSrc: "assets/cover1.jpg"
    },
    // Add up to 7 tracks to match design
];
```

### File Structure

```
audioplayer/
├── popup-player.html          # Main HTML file
├── image-player.css           # Styles with hotspot positioning
├── image-player.js            # Player logic  
├── player_template.png        # Design template (from img/)
├── playerleiste.png           # Control buttons design
├── background.png             # Background design
├── assets/
│   ├── track1.mp3            # Audio files
│   ├── track2.mp3
│   ├── cover1.jpg            # Cover art images
│   └── cover2.jpg
└── IMAGE_PLAYER_README.md     # This file
```

## Testing Locally

```bash
cd audioplayer
python3 -m http.server 8000
```

Then open http://localhost:8000/popup-player.html

## Keyboard Shortcuts

When player is open:
- **Space** - Play/Pause
- **← Left Arrow** - Previous track (or -5s on progress bar)
- **→ Right Arrow** - Next track (or +5s on progress bar)
- **Escape** - Close player

## Integration

### Option 1: Direct Integration
Copy the player files to your project and link the HTML/CSS/JS files.

### Option 2: iframe Embed
```html
<iframe src="/audioplayer/popup-player.html" 
        width="100%" 
        height="600px" 
        frameborder="0"></iframe>
```

### Option 3: Modal Trigger
Add a button anywhere on your site that opens the player overlay when clicked.

## Design Notes

### Hotspot Positioning
All interactive elements use percentage-based positioning to overlay precisely on the template image:

- Cover overlay: `top: 11%; left: 8.5%; width: 36%`
- Progress bar: `top: 35.5%; left: 9%; width: 82%`
- Prev button: `top: 42.5%; left: 11%; width: 18%`
- Play button: `top: 41%; left: 50%; width: 22%`
- Next button: `top: 42.5%; right: 11%; width: 18%`
- Playlist area: `top: 62%; left: 10.5%; width: 45%; height: 30%`

### Responsive Behavior
The player maintains its aspect ratio (675:1080) and scales proportionally on different screen sizes while keeping hotspots aligned with the template image.

### Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers supported

## Customization

### Adjusting Hotspot Positions
If you need to fine-tune hotspot positions, edit the CSS in `image-player.css`:

```css
.control-hotspot.play-hotspot {
    top: 41%;           /* Adjust vertical position */
    left: 50%;          /* Adjust horizontal position */
    width: 22%;         /* Adjust button size */
    aspect-ratio: 1;    /* Keep circular */
}
```

### Using Different Design Templates
Replace `player_template.png` with your own design and adjust hotspot positions accordingly.

## Accessibility

- All interactive elements have ARIA labels
- Keyboard navigation fully supported
- Screen reader compatible
- Focus indicators for keyboard users
- Respects `prefers-reduced-motion`

## Troubleshooting

### Player Not Showing
- Check that `player_template.png` exists in audioplayer directory
- Verify the overlay display is set to 'flex' when opened
- Check browser console for errors

### Hotspots Misaligned
- Ensure template image has correct dimensions (675 x 1080px)
- Check that no CSS is modifying the container aspect ratio
- Adjust percentage positions in `image-player.css`

### Audio Not Playing
- Verify MP3 files exist in `assets/` directory
- Check file paths in playlist array match actual filenames
- Run from HTTP server, not file:// protocol

## License

© ROKKO Records. All rights reserved.
