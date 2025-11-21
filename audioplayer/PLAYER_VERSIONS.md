# ROKKO Records Audio Player - Versions

## Two Player Versions

### 1. Mobile Player (popup-player.html)
**Uses YOUR design files:**
- `player_template.png` - Layout and design reference
- `playerleiste.png` - Three control buttons (prev/play/next)
- `background.png` - Background pattern

**Features:**
- Full-page popup overlay
- Close X button in top-right corner
- Album cover, track info, time display
- Three large circular buttons from playerleiste.png:
  - **Left button** - Skip to previous song
  - **Middle button** - Play/Pause toggle
  - **Right button** - Skip to next song
- Progress bar (clickable to seek)
- **Scrollable playlist** - Shows 7+ songs, scroll if more
- Streaming service buttons (Spotify, Beatport, Apple Music, SoundCloud)
- Optimized for mobile screens

**Files:**
- `popup-player.html`
- `mobile-player.css`
- `mobile-player.js`

**Usage:**
```html
<!-- Open from any page -->
<button onclick="document.getElementById('playerOverlay').style.display='flex'">
  Open Player
</button>
```

### 2. Desktop Player (index.html)
**Uses ROKKO dark brown/orange color scheme:**
- Colors from `COLOR_GUIDE.md`
- `--gold1: #E0C290` (IMMUTABLE interior color)
- `--rokko-brown: #201613` (Dark brown)
- `--rokko-brown-dark: #3D2817` (Frame borders)
- `--bg: #997A4B` (Content background)

**Features:**
- Standalone page (not popup)
- 600px max-width player
- Album cover display
- Track info (title, artist)
- Progress bar with time display
- Control buttons (prev/play/pause/next)
- Volume control with slider
- Playlist toggle panel
- Keyboard shortcuts
- Full ARIA labels for accessibility

**Files:**
- `index.html`
- `audioplayer.css`
- `audioplayer.js`

**Usage:**
```bash
# Direct link
<a href="/audioplayer/index.html">Open Player</a>

# Or integrate into existing page
<div id="player-container"></div>
<script src="/audioplayer/audioplayer.js"></script>
```

## When to Use Which Version

### Use Mobile Player (popup-player.html) when:
- ✅ Mobile/responsive site
- ✅ Want full-page popup overlay
- ✅ Using your custom design (player_template.png)
- ✅ Need close button to dismiss
- ✅ Want to use playerleiste.png button graphics

### Use Desktop Player (index.html) when:
- ✅ Desktop-first site
- ✅ Want inline player (not popup)
- ✅ Prefer ROKKO brand colors (#E0C290, #3D2817)
- ✅ Need volume controls
- ✅ Want keyboard shortcuts
- ✅ Standard player interface

## Configuration

Both players use the same playlist format in their respective JS files:

```javascript
const playlist = [
    {
        title: "Track Title",
        artist: "Artist Name",
        audioSrc: "assets/track1.mp3",
        coverSrc: "assets/cover1.jpg"
    }
];
```

**Adding Audio Files:**
1. Place MP3 files in `audioplayer/assets/`
2. Place cover images in `audioplayer/assets/`
3. Update the playlist array in the respective JS file

## Testing Locally

```bash
cd audioplayer
python3 -m http.server 8000

# Mobile player:
# http://localhost:8000/popup-player.html

# Desktop player:
# http://localhost:8000/index.html
```

## Scrollable Playlist

The mobile player's playlist automatically becomes scrollable when:
- More than 7 songs are in the playlist
- Song names are too long to fit

The scroll area has custom styling to match the design:
- Thin scrollbar (4px width)
- Styled thumb and track
- Smooth scrolling

## Design Assets Location

All design files are available in both locations:
- `/img/` - Original location
- `/audioplayer/` - Copied for convenience

Files:
- `player_template.png` (675×1080px) - Complete player layout
- `playerleiste.png` (1266×341px) - Control button strip with 3 circles
- `background.png` (450×720px) - Background pattern

## Keyboard Shortcuts

### Mobile Player
- **Escape** - Close player
- **Space** - Play/Pause
- **← Arrow** - Previous track
- **→ Arrow** - Next track

### Desktop Player
- **Space** - Play/Pause
- **← Arrow** - Previous track
- **→ Arrow** - Next track
- **↑ Arrow** - Volume up
- **↓ Arrow** - Volume down
- **M** - Mute/Unmute
- **L** - Toggle playlist

## Browser Compatibility

Both players support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

Both players include:
- ✅ ARIA labels on all controls
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Screen reader support
- ✅ Respects prefers-reduced-motion
