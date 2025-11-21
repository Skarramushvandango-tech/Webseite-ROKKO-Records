# Template-Based Audio Player

This is a template-based audio player that matches the exact design specifications from `player_template.png`.

## Features

- **Exact Template Matching**: Uses `player_template.png` as the background and positions all elements to match the design
- **Album Cover**: Positioned in the top-left corner as shown in the template
- **Track Information**: Artist name and album title displayed on the right side with semi-transparent overlays
- **Time Display**: Current time / duration display positioned on the right
- **Progress Bar**: Interactive progress bar that follows the template design
- **Control Buttons**: Previous, Play/Pause, and Next buttons positioned as circular controls
- **Playlist**: 7-song playlist displayed in the bottom-left area
- **Streaming Platforms**: 4 streaming service logos (Spotify, Beatport, Apple Music, SoundCloud) displayed in bottom-right

## Files

- `template-player.html` - HTML structure for the player
- `template-player.css` - Styling that matches the template positioning
- `template-player.js` - JavaScript functionality for audio playback
- `player_template.png` - The design template image used as background

## Usage

### Local Testing

1. Start a local web server:
   ```bash
   cd audioplayer
   python3 -m http.server 8000
   ```

2. Open in browser:
   ```
   http://localhost:8000/template-player.html
   ```

3. Click "🎵 Player öffnen" to open the player overlay

### Adding Audio Files

1. Place MP3 files in `audioplayer/assets/` directory
2. Place cover images in `audioplayer/assets/` directory
3. Update the playlist in `template-player.js`:

```javascript
const playlist = [
    {
        title: "Your Song Title",
        artist: "Your Artist Name",
        audioSrc: "assets/your-song.mp3",
        coverSrc: "assets/your-cover.jpg"
    },
    // Add more tracks...
];
```

## Design Specifications

The player is designed to match `player_template.png` with the following positioning:

- **Album Cover**: Top-left at 10.8% from top, 8.2% from left, 38.2% width
- **Track Info**: Top-right at 11.3% from top, 50.5% from left, 45% width
- **Time Display**: Right side at 32.5% from top, 7.5% from right
- **Progress Bar**: 35% from top, 9.5% from left, 81% width
- **Control Buttons**: 
  - Previous: 42.8% from top, 8.5% from left, 22% size
  - Play: 40.5% from top, centered, 27% size
  - Next: 42.8% from top, 8.5% from right, 22% size
- **Playlist**: 60.5% from top, 7% from left, 50% width, 34% height
- **Streaming Buttons**: 60.5% from top, 5.5% from right, 37% width, 34.5% height

## Interactive Elements

- **Play/Pause Button**: Click to play or pause the current track
- **Previous/Next Buttons**: Navigate through the playlist
- **Playlist Items**: Click any song to play it immediately
- **Progress Bar**: Click anywhere on the bar to seek to that position
- **Close Button**: Top-right "✕" button to close the player overlay

## Keyboard Shortcuts

- **Space**: Play/Pause
- **←/→**: Previous/Next track
- **Escape**: Close player overlay

## Styling

The player uses CSS custom properties for easy customization:

```css
:root {
    --overlay-bg: rgba(224, 194, 144, 0.98);
}
```

This ensures text overlays properly cover the static template text while maintaining design consistency.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- The player uses the template image as a background and overlays interactive elements
- Semi-transparent backgrounds on text areas ensure dynamic content is readable
- All positioning is done using percentages for responsive design
- The player maintains the exact aspect ratio of the template (675 x 1080)
