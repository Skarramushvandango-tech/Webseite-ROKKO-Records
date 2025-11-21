# Custom Mobile Audio Player

This audio player is built exactly according to the design template provided by the client.

## Design Files Used

- `background.png` - Mandatory background for mobile view (450x720px)
- `playerleiste.png` - Three control buttons (1266x341px):
  - Left button: Skip to previous track
  - Middle button: Play/Pause toggle
  - Right button: Skip to next track
- `player_template.png` - Complete layout reference (675x1080px)
- `logo_01.png` through `logo_05.png` - Platform logos stacked on the right side

## Files

- `custom-mobile-player.html` - Main HTML structure
- `custom-mobile-player.css` - Styling matching the exact design template
- `custom-mobile-player.js` - Player functionality (play, pause, skip, track selection)

## Features

1. **Album Cover Display** - Shows current track's album artwork in a styled frame
2. **Song Information** - Artist name and song title display
3. **Progress Bar** - Seekable progress indicator with time display (current/total)
4. **Control Buttons** - Using playerleiste.png as button background:
   - Previous track button
   - Play/Pause button
   - Next track button
5. **Waveform Visualization** - Visual representation of audio
6. **Track List** - Scrollable list of all tracks with click-to-play functionality
7. **Platform Logos** - Stacked on the right side (Spotify, Beatport, Apple Music, SoundCloud)
8. **Responsive Design** - Adapts to different mobile screen sizes

## Design Specifications

- Maximum width: 675px (matches template)
- Background: Uses exact background.png image
- Color scheme: Browns and beiges as per template (#E0C290, #B89968, #8B7355, #5D4A3A, #3D2817, #201613)
- Typography: Clean, readable fonts matching the design
- Layout: Vertical flow with centered elements

## Usage

Open `custom-mobile-player.html` in a mobile browser or mobile viewport to see the player in action.

## Integration

To integrate this player into the main website, the HTML structure and styling can be adapted into the existing page structure while maintaining the exact visual design.
