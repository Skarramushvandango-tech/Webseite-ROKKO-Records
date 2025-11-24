# ROKKO Records Vanilla JS Audio Player

A modern, accessible audio player component with waveform visualization, vinyl/tonearm animations, and full keyboard support.

## Features

### 🎨 Visual Design
- **Vinyl Record Animation**: Rotates smoothly during playback with soft spin-down effect
- **Animated Tonearm**: Moves to playing position (-15deg) during playback
- **Waveform Visualization**: WebAudio API-powered waveform display in ROKKO orange (#d77014)
- **Progress Overlay**: Visual indicator showing current playback position on waveform
- **COLOR_GUIDE Compliant**: All colors match the ROKKO Records brand palette

### 🎵 Playback Features
- **Full Playback Controls**: Previous, Play/Pause, Next buttons
- **Seekable Waveform**: Click anywhere on waveform to jump to that position
- **Auto-Advance**: Automatically plays next track when current track ends
- **Playlist Display**: Interactive playlist with track selection
- **Album Cover Display**: Shows cover art in vinyl center inset

### ♿ Accessibility
- **ARIA Labels**: All interactive elements properly labeled
- **Keyboard Shortcuts**:
  - `Space`: Play/Pause
  - `Escape`: Close player
  - `Left Arrow`: Previous track
  - `Right Arrow`: Next track
- **Focus Management**: Focus set to play button when player opens
- **Reduced Motion**: Respects `prefers-reduced-motion` setting

### 🔗 Streaming Integration
- Pre-configured buttons for:
  - Beatport
  - Spotify
  - Apple Music
  - SoundCloud
- Uses `data-url` attributes for easy link injection

## Installation

### Include in Your Page

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="audioplayer/player-styles.css">
</head>
<body>
    <!-- Your page content -->
    
    <script src="audioplayer/player-component.js"></script>
</body>
</html>
```

The player overlay is automatically created and hidden when the page loads.

## Usage

### Option 1: Open with Custom Playlist

```javascript
window.RokkoPlayer.openPlayer({
    playlist: [
        {
            title: "Track Title",
            artist: "Artist Name",
            audioSrc: "path/to/audio.mp3",
            coverSrc: "path/to/cover.jpg"
        },
        {
            title: "Another Track",
            artist: "Artist Name",
            audioSrc: "path/to/audio2.mp3",
            coverSrc: "path/to/cover2.jpg"
        }
    ],
    startIndex: 0  // Optional: which track to start with (default: 0)
});
```

### Option 2: Load from Artist Folder with Manifest

Create a `manifest.json` file in the artist's mp3 folder:

```json
{
    "artist": "Artist Name",
    "tracks": [
        {
            "title": "Track Title",
            "file": "track1.m4a",
            "cover": "cover.png"
        },
        {
            "title": "Another Track",
            "file": "track2.m4a"
        }
    ]
}
```

Then open the player:

```javascript
window.RokkoPlayer.openPlayer({
    artistFolder: 'mp3/ArtistName',
    artistName: 'Artist Name'  // Optional
});
```

### Option 3: Load from Folder (Automatic Scan)

If no manifest exists, the player will attempt to scan the folder and find audio files:

```javascript
window.RokkoPlayer.openPlayer({
    artistFolder: 'mp3/vandango',
    artistName: 'Vandango'
});
```

**Note**: Folder scanning requires the web server to allow directory listing. If not available, use a manifest.json file.

### Close Player Programmatically

```javascript
window.RokkoPlayer.closePlayer();
```

## API Reference

### `window.RokkoPlayer.openPlayer(options)`

Opens the audio player with the specified options.

**Parameters:**

- `options.playlist` (Array): Array of track objects with properties:
  - `title` (String): Track title
  - `artist` (String): Artist name
  - `audioSrc` (String): Path to audio file
  - `coverSrc` (String): Path to cover image (optional)

- `options.artistFolder` (String): Path to folder containing audio files
- `options.artistName` (String): Artist name (used with artistFolder)
- `options.startIndex` (Number): Index of track to start playing (default: 0)

**Note**: Provide either `playlist` OR `artistFolder`, not both.

### `window.RokkoPlayer.closePlayer()`

Closes the audio player and stops playback.

## Manifest File Format

Place a `manifest.json` file in your artist folder for structured playlist loading:

```json
{
    "artist": "Artist Name",
    "album": "Album Name",
    "tracks": [
        {
            "title": "Track Title",
            "file": "filename.m4a",
            "cover": "cover.png",
            "artist": "Optional different artist"
        }
    ]
}
```

**Fields:**

- `artist`: Default artist name for all tracks
- `album`: Album name (optional)
- `tracks`: Array of track objects
  - `title`: Track title (required)
  - `file`: Audio filename relative to folder (required)
  - `cover`: Cover image filename (optional, defaults to `cover.png`)
  - `artist`: Override artist for this track (optional)

## Fallback Behavior

If manifest loading fails, the player will:

1. Attempt to fetch the folder directory listing
2. Parse HTML to find audio files (.mp3, .m4a, .ogg, .wav)
3. Create a playlist from discovered files
4. Use `cover.png` from the folder as album art

**Limitations of Folder Scan:**
- Requires directory listing enabled on server
- Track titles derived from filenames (underscores replaced with spaces)
- No custom metadata (artist, album) unless provided in `artistName` parameter

## Keyboard Shortcuts

When the player is open:

| Key | Action |
|-----|--------|
| `Space` | Toggle play/pause |
| `Escape` | Close player |
| `Left Arrow` | Previous track |
| `Right Arrow` | Next track |
| `Tab` | Navigate between controls |
| `Enter` | Activate focused element |

## Supported Audio Formats

The player uses the Web Audio API and HTML5 Audio, supporting:

- MP3 (.mp3)
- M4A (.m4a)
- OGG Vorbis (.ogg)
- WAV (.wav)

**Note**: Format support depends on browser. MP3 and M4A have the widest support.

## Streaming Service Integration

Update streaming links dynamically:

```javascript
// After opening player, update links
document.querySelectorAll('.rokko-stream-btn').forEach(btn => {
    const service = btn.dataset.service;
    if (service === 'spotify') {
        btn.dataset.url = 'https://open.spotify.com/track/...';
        btn.href = btn.dataset.url;
    }
});
```

Or set links before opening:

```javascript
// Extend track objects with streaming links
const playlist = [
    {
        title: "Track",
        artist: "Artist",
        audioSrc: "audio.mp3",
        coverSrc: "cover.jpg",
        links: {
            spotify: "https://open.spotify.com/...",
            apple: "https://music.apple.com/...",
            beatport: "https://www.beatport.com/...",
            soundcloud: "https://soundcloud.com/..."
        }
    }
];
```

## Color Customization

The player uses CSS variables from COLOR_GUIDE.md:

```css
:root {
  --rokko-brown: #201613;        /* Dark brown text */
  --rokko-brown-dark: #3D2817;   /* Frame borders */
  --rokko-sand: #E0C290;         /* Interior backgrounds (IMMUTABLE) */
  --rokko-accent: #B8935F;       /* Accent color */
  --content-bg: #997A4B;         /* Darker backgrounds */
  --rokko-orange: #d77014;       /* Waveform color */
}
```

⚠️ **Note**: `--rokko-sand` is permanently fixed per COLOR_GUIDE.md and should not be changed.

## Technical Details

### Waveform Generation

The waveform is generated using the Web Audio API:

1. Audio file is fetched and decoded to AudioBuffer
2. Channel data is extracted and downsampled to canvas width
3. Min/max values calculated for each vertical bar
4. Rendered to canvas in ROKKO orange (#d77014)
5. Progress overlay shows playback position

### Vinyl Animation

- **Playing**: Continuous rotation at 2 degrees per frame (~120 RPM feel)
- **Stopping**: Gradual spin-down with 0.95 decay factor for realistic deceleration
- Uses `requestAnimationFrame` for smooth 60fps animation

### Tonearm Animation

- **Down Position**: -15deg rotation on play
- **Up Position**: 0deg rotation on pause/stop
- Smooth CSS transition (0.5s ease-out)
- Transform origin at top center for realistic pivot

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Requirements:**
- Web Audio API support
- ES6 JavaScript support
- CSS Grid and Flexbox support

## File Structure

```
audioplayer/
├── player-component.js       # Main player component
├── player-styles.css         # Player styles (COLOR_GUIDE compliant)
├── player-template.html      # Demo page
├── NEW_PLAYER_README.md      # This file
├── assets/
│   ├── vinyl.svg            # Vinyl record image
│   ├── tonearm.svg          # Tonearm image
│   ├── avatar.svg           # Default avatar/cover
│   ├── logo-beatport.svg    # Beatport logo
│   ├── logo-spotify.svg     # Spotify logo
│   ├── logo-applemusic.svg  # Apple Music logo
│   ├── logo-soundcloud.svg  # SoundCloud logo
│   ├── cover1.jpg           # Sample cover art
│   └── placeholder-cover.svg # Fallback cover
└── legacy/                   # Old player files (archived)
    ├── image-player.js
    ├── mobile-player-component.js
    ├── popup-player.html
    └── ...
```

## Migration from Legacy Players

### From Image Player

**Old:**
```javascript
document.getElementById('openPlayerBtn').addEventListener('click', function() {
    document.getElementById('playerOverlay').style.display = 'flex';
});
```

**New:**
```javascript
document.getElementById('openPlayerBtn').addEventListener('click', function() {
    window.RokkoPlayer.openPlayer({
        artistFolder: 'mp3/artistname',
        artistName: 'Artist Name'
    });
});
```

### From Mobile Player Component

**Old:**
```javascript
const player = new MobileAudioPlayer('containerId', {
    artistName: 'Artist',
    tracks: [...]
});
```

**New:**
```javascript
window.RokkoPlayer.openPlayer({
    playlist: [
        { title: '...', artist: 'Artist', audioSrc: '...', coverSrc: '...' }
    ]
});
```

## Troubleshooting

### Player doesn't open
- Check that `player-component.js` is loaded
- Verify `window.RokkoPlayer` exists in console
- Check browser console for errors

### Audio doesn't play
- Verify audio file paths are correct
- Check audio format is supported by browser
- Ensure files are accessible (check CORS if loading from different domain)
- Try opening player with a simple test file

### Waveform not displaying
- Web Audio API requires user interaction to start
- Check that audio file is valid and decodable
- Look for errors in browser console
- Some audio formats may not decode (use MP3 or M4A)

### Folder scanning doesn't work
- Requires directory listing enabled on server
- Use manifest.json as more reliable alternative
- Python: `python3 -m http.server` enables directory listing
- Apache: Requires `Options +Indexes`

### Animations not smooth
- Check CPU usage (close other tabs/apps)
- Verify `prefers-reduced-motion` setting if animations disabled
- Some older devices may have performance limitations

## Performance Tips

1. **Use Manifest Files**: Faster loading than folder scanning
2. **Optimize Images**: Compress cover art to reduce file size
3. **Limit Playlist Size**: Large playlists may affect UI performance
4. **Use Appropriate Audio Format**: MP3 at 128-192kbps is good balance
5. **Preload Covers**: Consider preloading cover images for smooth transitions

## Accessibility Notes

- All controls have descriptive ARIA labels
- Keyboard navigation fully supported
- Focus indicators visible on all interactive elements
- Color contrast ratios meet WCAG AA standards
- Respects reduced motion preferences
- Screen reader compatible

## License

© ROKKO Records. All rights reserved.

## Support

For issues or questions about this player component, please refer to the main repository documentation.
