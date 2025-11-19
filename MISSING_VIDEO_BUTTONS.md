# Missing Video Control Button Images

## Status: BLOCKED - Waiting for Image Assets

### Required Images

According to requirement #8, the following button images should exist in the `images/` directory but are currently missing:

1. **mute.png** - Display when video sound is ON (clicking will mute)
2. **sound.png** - Display when video sound is OFF (clicking will unmute)
3. **playbutton.png** - Play button to start/resume video
4. **stopbutton.png** - Stop button to pause and jump to end of video

### Current Implementation

The video controls currently use:
- `img/mute_0.png` - For muted state
- `img/mute_1.png` - For unmuted state

These files exist in the `img/` directory, but the requirement specifies new images should be in the `images/` directory with different names.

### Required Changes

Once the images are added, update `scripts/video-autoplay.js`:

#### Line 173-183: Update Mute Button Icons

Current code:
```javascript
if (video.muted) {
  toggleMuteBtn.innerHTML = '<img src="img/mute_0.png" alt="Muted" style="width: 24px; height: 24px; vertical-align: middle;">';
  // ... 
} else {
  toggleMuteBtn.innerHTML = '<img src="img/mute_1.png" alt="Unmuted" style="width: 24px; height: 24px; vertical-align: middle;">';
  // ...
}
```

Should become:
```javascript
if (video.muted) {
  toggleMuteBtn.innerHTML = '<img src="images/sound.png" alt="Click to unmute" style="width: 24px; height: 24px; vertical-align: middle;">';
  toggleMuteBtn.setAttribute('aria-label', 'Ton aktivieren');
  toggleMuteBtn.title = 'Ton aktivieren';
} else {
  toggleMuteBtn.innerHTML = '<img src="images/mute.png" alt="Click to mute" style="width: 24px; height: 24px; vertical-align: middle;">';
  toggleMuteBtn.setAttribute('aria-label', 'Ton deaktivieren');
  toggleMuteBtn.title = 'Ton deaktivieren';
}
```

#### Line 214-224: Update Stop Button to Use New Image

Current code:
```javascript
stopVideoBtn = document.createElement('button');
stopVideoBtn.id = 'stopVideoBtn';
stopVideoBtn.className = 'video-controls';
stopVideoBtn.textContent = 'Stop';
```

Should become:
```javascript
stopVideoBtn = document.createElement('button');
stopVideoBtn.id = 'stopVideoBtn';
stopVideoBtn.className = 'video-controls';
stopVideoBtn.innerHTML = '<img src="images/stopbutton.png" alt="Stop" style="width: 24px; height: 24px; vertical-align: middle;">';
```

#### Add Play Button Functionality

The requirement mentions `playbutton.png` should be used. Currently, there's no separate play button (only mute and stop). Need to clarify if:
1. The stop button should toggle between stop and play states, OR
2. A separate play button should be added

### Action Items

- [ ] Add `images/mute.png` to repository
- [ ] Add `images/sound.png` to repository
- [ ] Add `images/playbutton.png` to repository
- [ ] Add `images/stopbutton.png` to repository
- [ ] Update `scripts/video-autoplay.js` with new image paths
- [ ] Clarify play button behavior (toggle vs separate button)
- [ ] Test all button states and interactions

### Notes

The user stated: "Ich habe ebenfalls im Images Ordner die stop and play Buttons für das Video die du so wie den aktuellen Play/stop und mute/unmute button, auszutauschen gegen die aktuellen png."

Translation: "I have also placed the stop and play buttons for the video in the Images folder, which you should exchange with the current play/stop and mute/unmute buttons against the current pngs."

This suggests:
1. The images should already be in the repository (but they're not)
2. The stopbutton.png should make the video jump to the end and pause
3. The playbutton.png should play the video from the beginning (or resume from current position)
4. These should replace the current control buttons

**Status:** Waiting for the image files to be committed to the repository before implementation can proceed.
