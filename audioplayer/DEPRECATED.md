# DEPRECATED - Old Audio Player Files

## Notice

⚠️ **These audio player files are deprecated and should not be used in new implementations.**

The audio player has been replaced with a modern component located at:
- **JavaScript**: `/scripts/modern-audio-player.js`
- **CSS**: `/styles/modern-audio-player.css`

## Reason for Deprecation

The old player files in this directory have been replaced with a modern audio player that includes:

1. **Animated vinyl record** - Spins during playback with smooth spin-down on pause
2. **Animated tonearm** - Moves "on-record" when playing and "off-record" when paused
3. **Waveform visualization** - Real-time audio visualization using Canvas + Web Audio API
4. **Modern controls** - Play/pause/prev/next with improved accessibility
5. **Seekable progress bar** - With time display (current/total)
6. **Streaming buttons** - Integrated platform links
7. **Single shared instance** - Works in both artist popup and carousel popup contexts
8. **Better performance** - Optimized animations and reduced code duplication

## Migration Guide

If you were using the old template player (`template-audio-player.js`), update your code:

### Old Usage
```javascript
if (window.rokkoAudioPlayer) {
    window.rokkoAudioPlayer.openPlayer(tracks, artistName);
}
```

### New Usage
```javascript
if (window.rokkoModernPlayer) {
    window.rokkoModernPlayer.openPlayer(tracks, artistName);
}
```

### HTML Changes
Replace in `index.html`:
```html
<!-- Old -->
<link rel="stylesheet" href="styles/template-audio-player.css">
<script defer src="scripts/template-audio-player.js"></script>

<!-- New -->
<link rel="stylesheet" href="styles/modern-audio-player.css">
<script defer src="scripts/modern-audio-player.js"></script>
```

## Files in This Directory (Deprecated)

- `audioplayer.js` - Old basic player
- `audioplayer.css` - Old player styles
- `template-player.js` - Old template-based player
- `template-player.css` - Old template styles
- `template-player.html` - Old template HTML
- `image-player.js` - Old image-based player
- `image-player.css` - Old image player styles
- `popup-player.js` - Old popup player
- `popup-player.css` - Old popup styles
- `popup-player.html` - Old popup HTML
- `mobile-player.js` - Old mobile player
- `mobile-player.css` - Old mobile styles
- `mobile-player-component.js` - Old mobile component
- `custom-mobile-player.js` - Old custom mobile player
- `custom-mobile-player.css` - Old custom mobile styles
- `custom-mobile-player.html` - Old custom mobile HTML

## Timeline

- **Deprecated**: November 24, 2025
- **Planned Removal**: These files may be removed in a future release after all references have been migrated

## Support

For questions or issues with the new modern player, please open an issue in the repository.
