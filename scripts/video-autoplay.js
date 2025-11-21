/**
 * ROKKO Records - Intro Video Controls
 * Simple video control system - browser handles autoplay via HTML attributes
 * 
 * Features:
 * - Video autoplays muted via HTML attributes (autoplay muted)
 * - Video stops on last frame (no loop attribute)
 * - Provides user controls: Mute/Unmute toggle and Stop/Play
 */

(function() {
  'use strict';

  let video = null;
  let toggleMuteBtn = null;
  let stopVideoBtn = null;
  let preloader = null;
  let loadingBar = null;

  /**
   * Hide the video preloader
   */
  function hidePreloader() {
    if (preloader) {
      preloader.style.transition = 'opacity 0.5s ease';
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }
  }

  /**
   * Update loading bar progress
   */
  function updateLoadingProgress() {
    if (!video || !loadingBar) return;
    
    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const duration = video.duration;
      if (duration > 0) {
        const percentLoaded = (bufferedEnd / duration) * 100;
        loadingBar.style.width = `${percentLoaded}%`;
      }
    }
  }

  /**
   * Toggle mute/unmute
   */
  function toggleIntroMute() {
    if (!video) return;
    
    video.muted = !video.muted;
    updateMuteButtonState();
  }

  /**
   * Stop/Play video toggle
   */
  function stopIntroVideo() {
    if (!video) return;
    
    // If video is playing, stop it (jump to end)
    if (!video.paused) {
      video.currentTime = video.duration;
      video.pause();
      updateStopButtonState();
    } else {
      // If video is stopped/paused, restart from beginning
      video.currentTime = 0;
      video.play();
      updateStopButtonState();
    }
  }
  
  /**
   * Update stop button state based on video playing status
   */
  function updateStopButtonState() {
    if (!stopVideoBtn) return;
    
    // Show play button when video is paused, stop button when playing
    if (video.paused) {
      stopVideoBtn.innerHTML = '<img src="img/playbutton.png" alt="Play" style="width: 30px; height: 30px; vertical-align: middle;">';
      stopVideoBtn.setAttribute('aria-label', 'Video abspielen');
      stopVideoBtn.title = 'Video abspielen';
    } else {
      stopVideoBtn.innerHTML = '<img src="img/stopbutton.png" alt="Stop" style="width: 30px; height: 30px; vertical-align: middle;">';
      stopVideoBtn.setAttribute('aria-label', 'Video stoppen');
      stopVideoBtn.title = 'Video stoppen';
    }
  }

  /**
   * Update mute button state
   */
  function updateMuteButtonState() {
    if (!toggleMuteBtn) return;
    
    // When video is muted, show sound.png (click to enable sound)
    // When video has sound, show mute.png (click to mute)
    if (video.muted) {
      toggleMuteBtn.innerHTML = '<img src="img/sound.png" alt="Sound aktivieren" style="width: 30px; height: 30px; vertical-align: middle;">';
      toggleMuteBtn.setAttribute('aria-pressed', 'true');
      toggleMuteBtn.setAttribute('aria-label', 'Ton aktivieren');
      toggleMuteBtn.title = 'Ton aktivieren';
    } else {
      toggleMuteBtn.innerHTML = '<img src="img/mute.png" alt="Ton aus" style="width: 30px; height: 30px; vertical-align: middle;">';
      toggleMuteBtn.setAttribute('aria-pressed', 'false');
      toggleMuteBtn.setAttribute('aria-label', 'Ton deaktivieren');
      toggleMuteBtn.title = 'Ton deaktivieren';
    }
  }

  /**
   * Initialize intro video controls
   */
  function initIntroVideo() {
    // Find video element
    video = document.getElementById('introVideo');
    if (!video) {
      return;
    }

    // Find preloader elements
    preloader = document.getElementById('videoPreloader');
    loadingBar = document.getElementById('loadingBar');

    // Find or create control buttons
    const videoContainer = video.parentElement;

    // Create or find stop/play button - positioned bottom-left
    stopVideoBtn = document.getElementById('stopVideoBtn');
    if (!stopVideoBtn) {
      stopVideoBtn = document.createElement('button');
      stopVideoBtn.id = 'stopVideoBtn';
      stopVideoBtn.className = 'video-controls';
      stopVideoBtn.setAttribute('aria-label', 'Video stoppen');
      stopVideoBtn.style.cssText = 'position: absolute; bottom: 10px; left: 10px; z-index: 10; background: transparent; border: none; padding: 0; cursor: pointer; transition: all 0.3s ease;';
      videoContainer.appendChild(stopVideoBtn);
    }

    // Create or find mute toggle button - positioned bottom-right
    toggleMuteBtn = document.getElementById('toggleMuteBtn');
    if (!toggleMuteBtn) {
      toggleMuteBtn = document.createElement('button');
      toggleMuteBtn.id = 'toggleMuteBtn';
      toggleMuteBtn.className = 'video-controls';
      toggleMuteBtn.style.cssText = 'position: absolute; bottom: 10px; right: 10px; z-index: 10; background: transparent; border: none; padding: 0; cursor: pointer; transition: all 0.3s ease;';
      videoContainer.appendChild(toggleMuteBtn);
    }

    // Set up event listeners
    toggleMuteBtn.addEventListener('click', toggleIntroMute);
    stopVideoBtn.addEventListener('click', stopIntroVideo);
    
    // Add hover effects
    [toggleMuteBtn, stopVideoBtn].forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.1)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
      });
    });

    // Update button states initially
    updateMuteButtonState();
    updateStopButtonState();

    // Update loading progress as video buffers
    video.addEventListener('progress', updateLoadingProgress);
    
    // Track loading progress
    const loadingInterval = setInterval(() => {
      if (video && !video.paused) {
        updateLoadingProgress();
      }
    }, 100);

    // Update UI when video plays
    video.addEventListener('play', () => {
      updateStopButtonState();
    });
    
    // Hide preloader when video has buffered enough
    video.addEventListener('canplaythrough', () => {
      clearInterval(loadingInterval);
      hidePreloader();
    });
    
    // Also hide on playing event as fallback
    video.addEventListener('playing', () => {
      clearInterval(loadingInterval);
      hidePreloader();
    });

    // When video ends, update stop button to show play icon
    video.addEventListener('ended', () => {
      updateStopButtonState();
    });
    
    // Update stop button state when video pauses
    video.addEventListener('pause', () => {
      updateStopButtonState();
    });
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIntroVideo);
  } else {
    initIntroVideo();
  }

})();
