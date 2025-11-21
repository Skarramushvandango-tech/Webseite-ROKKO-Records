# ROKKO Records Audio Player

A modern, responsive audio player implementation for ROKKO Records website, designed to match the brand's distinctive brown and sand color scheme.

## Features

- **Full Playlist Support**: Manage and play multiple tracks with visual feedback
- **Modern UI**: Clean, intuitive interface following ROKKO design guidelines
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Keyboard Controls**: Full keyboard navigation support
- **Visual Feedback**: Album art, progress bar, and now-playing indicators
- **Volume Control**: Adjustable volume with mute functionality
- **Accessibility**: ARIA labels and keyboard navigation for screen readers

## Installation

### Option 1: Standalone Test Page

The audio player includes a standalone test page (`index.html`) that can be opened directly in a browser:

1. Open `audioplayer/index.html` in your web browser
2. Add your MP3 files and cover images to the `audioplayer/assets/` directory
3. Update the playlist in `audioplayer/audioplayer.js` (see Configuration section)

### Option 2: Integration into Existing Website

To integrate the audio player into your existing ROKKO Records website:

1. **Include the CSS** in your HTML `<head>`:
   ```html
   <link rel="stylesheet" href="audioplayer/audioplayer.css">
   ```

2. **Add the player HTML structure** where you want the player to appear:
   ```html
   <div class="audio-player-container">
       <div class="audio-player">
           <!-- Copy the structure from index.html -->
       </div>
   </div>
   ```

3. **Include the JavaScript** before the closing `</body>` tag:
   ```html
   <audio id="audioElement" preload="metadata"></audio>
   <script src="audioplayer/audioplayer.js"></script>
   ```

## Configuration

### Adding Your Music

1. **Add media files** to the `audioplayer/assets/` directory:
   - MP3 files (your tracks)
   - JPG/PNG files (album covers)

2. **Update the playlist** in `audioplayer/audioplayer.js`:
   ```javascript
   this.playlist = [
       {
           title: 'Your Track Title',
           artist: 'Artist Name',
           src: 'assets/your-track.mp3',
           cover: 'assets/your-cover.jpg',
           duration: '3:45'  // Optional, auto-calculated if omitted
       },
       // Add more tracks...
   ];
   ```

### Customizing Colors

The audio player uses CSS variables that follow the ROKKO color scheme defined in `COLOR_GUIDE.md`:

```css
:root {
    --rokko-brown: #201613;       /* Dark brown for text */
    --rokko-brown-dark: #3D2817;  /* Dark brown for borders */
    --rokko-sand: #E0C290;        /* Sand color for backgrounds (IMMUTABLE) */
    --rokko-accent: #B8935F;      /* Accent color */
    --content-bg: #997A4B;        /* Page background */
}
```

**Important**: The `--rokko-sand` color (`#E0C290`) is permanently fixed per the project's color policy. Do not modify this value without explicit approval.

To customize other aspects, edit the CSS variables in `audioplayer/audioplayer.css`.

## File Structure

```
audioplayer/
├── index.html          # Standalone test page
├── audioplayer.css     # Player styles
├── audioplayer.js      # Player functionality
├── README.md          # This file
└── assets/            # Directory for audio files and images
    └── .gitkeep       # Keeps directory in git
```

## Keyboard Controls

The audio player supports the following keyboard shortcuts:

| Key | Action |
|-----|--------|
| `Space` or `K` | Play/Pause |
| `←` | Seek backward 5 seconds |
| `→` | Seek forward 5 seconds |
| `↑` | Volume up |
| `↓` | Volume down |
| `M` | Mute/Unmute |
| `N` | Next track |
| `P` | Previous track |

## Browser Support

The audio player works in all modern browsers that support:
- HTML5 `<audio>` element
- CSS Grid and Flexbox
- ES6 JavaScript (classes, arrow functions)

Tested in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

The player includes:
- ARIA labels on all interactive elements
- Keyboard navigation support
- Proper heading hierarchy
- Color contrast meeting WCAG AAA standards
- Screen reader friendly controls

## Technical Details

### Dependencies

**None!** The audio player is built with vanilla HTML, CSS, and JavaScript. No external libraries or frameworks are required.

### Browser APIs Used

- HTML5 Audio API
- CSS Custom Properties (Variables)
- Vanilla JavaScript ES6

### Performance

- Lightweight: Total size < 50KB (uncompressed)
- No external requests (except for audio files)
- Efficient event handling
- Smooth animations using CSS transitions

## Customization Examples

### Changing Player Layout

Edit the grid template in `audioplayer.css`:

```css
.audio-player {
    display: grid;
    grid-template-columns: 300px 1fr;  /* Adjust album art width */
    gap: var(--spacing-lg);
}
```

### Adjusting Control Sizes

Modify button sizes in `audioplayer.css`:

```css
.control-btn-main {
    width: 64px;   /* Main play button size */
    height: 64px;
}
```

### Playlist Height

Change the maximum playlist height:

```css
.playlist-container {
    max-height: 300px;  /* Adjust as needed */
}
```

## Troubleshooting

### Audio files not playing

1. Check that the file paths in the playlist are correct
2. Ensure MP3 files are in the `assets/` directory
3. Check browser console for error messages
4. Verify the audio file format is supported (MP3 is recommended)

### Cover images not showing

1. Check that image paths in the playlist are correct
2. Ensure image files are in the `assets/` directory
3. Verify image formats (JPG, PNG, WebP are supported)

### Styling issues

1. Ensure `audioplayer.css` is loaded before the page renders
2. Check for CSS conflicts with existing stylesheets
3. Verify CSS custom properties are supported by the browser

## Integration Notes

- The player is designed to work within the ROKKO Records frame system
- It automatically matches the site's color scheme through CSS variables
- The player container can be placed in any `.rokko-frame` element
- Responsive breakpoints match the main site's breakpoints

## Development

### Local Testing

To test the audio player locally:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Then open: http://localhost:8000/audioplayer/
```

### Adding Features

The `AudioPlayer` class in `audioplayer.js` is well-structured for extensions:

- Add methods to the class for new features
- Update the DOM elements object for new UI elements
- Follow the existing pattern for event listeners

## Support

For issues, questions, or contributions related to this audio player:
1. Check this README for common solutions
2. Review the code comments in `audioplayer.js` and `audioplayer.css`
3. Consult the main ROKKO Records repository documentation

## License

This audio player is part of the ROKKO Records website project.

---

**Note**: Remember to populate the `assets/` directory with your actual audio files and cover images before deploying to production. The placeholder paths in the default playlist will need to be updated with your real content.
