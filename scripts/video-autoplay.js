/**
 * ROKKO Records - Intro Video Autoplay with Sound
 * Attempts to autoplay video with sound, with robust fallback to muted autoplay
 * 
 * ============================================================================
 * ⚠️ CRITICAL - DO NOT MODIFY WITHOUT EXPLICIT APPROVAL ⚠️
 * ============================================================================
 * 
 * This code is subject to strict change control policies.
 * All color values, size specifications, and behavior patterns are MANDATORY
 * and must NOT be changed without explicit written approval from the project owner.
 * 
 * Specifically protected elements:
 * - Mute button icons: mute_0.png (muted), mute_1.png (unmuted) - IMMUTABLE
 * - Video autoplay behavior - IMMUTABLE
 * - Button positioning and styling - IMMUTABLE
 * 
 * ============================================================================
 * 
 * Features:
 * - Attempts unmuted autoplay on page load when video is fully loaded
 * - Falls back to muted autoplay if browser blocks sound
 * - Provides user controls: Mute/Unmute toggle (using PNG icons) and Stop
 * - Shows notification if autoplay with sound is blocked
 */

(function() {
  'use strict';

  let video = null;
  let toggleMuteBtn = null;
  let stopVideoBtn = null;
  let notificationShown = false;
  let preloader = null;
  let loadingBar = null;

  /**
   * Show notification that autoplay with sound was blocked
   */
  function showAutoplayNotification() {
    if (notificationShown) return;
    notificationShown = true;

    const notification = document.createElement('div');
    notification.className = 'video-notification';
    notification.id = 'autoplayNotification';
    notification.innerHTML = `
      <p><strong>Autoplay mit Ton wurde blockiert</strong></p>
      <p>Das Video läuft stumm. Klicken Sie auf "Ton aktivieren" für Audio.</p>
      <button id="dismissNotification">OK, verstanden</button>
    `;

    const videoContainer = video.parentElement;
    videoContainer.appendChild(notification);

    // Dismiss notification
    document.getElementById('dismissNotification').addEventListener('click', () => {
      notification.style.opacity = '0';
      setTimeout(() => {
        notification.remove();
      }, 300);
    });

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.opacity = '0';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }
    }, 5000);
  }

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
   * Attempt to play video with sound
   */
  async function attemptAutoplayWithSound() {
    if (!video) {
      console.error('[Video Autoplay] Video element not found');
      return;
    }

    try {
      // First, try unmuted autoplay
      video.muted = false;
      const playPromise = video.play();

      if (playPromise !== undefined) {
        await playPromise;
        console.log('[Video Autoplay] Successfully autoplaying with sound');
        updateMuteButtonState();
        hidePreloader();
      }
    } catch (error) {
      console.warn('[Video Autoplay] Autoplay with sound blocked:', error.message);
      
      // Fallback to muted autoplay
      try {
        video.muted = true;
        await video.play();
        console.log('[Video Autoplay] Falling back to muted autoplay');
        updateMuteButtonState();
        hidePreloader();
        showAutoplayNotification();
      } catch (mutedError) {
        console.error('[Video Autoplay] Even muted autoplay failed:', mutedError.message);
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
    
    console.log(`[Video Autoplay] Video ${video.muted ? 'muted' : 'unmuted'}`);
  }

  /**
   * Stop video (jump to end or replay from beginning)
   */
  function stopIntroVideo() {
    if (!video) return;
    
    // If video is playing or paused before the end, jump to the end
    if (video.currentTime < video.duration - 0.5) {
      video.currentTime = video.duration;
      video.pause();
      updateStopButtonState();
      console.log('[Video Autoplay] Video jumped to end');
    } else {
      // If video is at the end, replay from beginning
      video.currentTime = 0;
      video.play();
      updateStopButtonState();
      console.log('[Video Autoplay] Video replaying from beginning');
    }
  }
  
  /**
   * Update stop button state based on video position
   */
  function updateStopButtonState() {
    if (!stopVideoBtn) return;
    
    // Show play button when video is at the end, stop button otherwise
    if (video.currentTime >= video.duration - 0.5) {
      stopVideoBtn.innerHTML = '<img src="img/playbutton.png" alt="Play" style="width: 20px; height: 20px; vertical-align: middle;">';
      stopVideoBtn.setAttribute('aria-label', 'Video abspielen');
      stopVideoBtn.title = 'Video abspielen';
    } else {
      stopVideoBtn.innerHTML = '<img src="img/stopbutton.png" alt="Stop" style="width: 20px; height: 20px; vertical-align: middle;">';
      stopVideoBtn.setAttribute('aria-label', 'Video stoppen');
      stopVideoBtn.title = 'Video stoppen';
    }
  }

  /**
   * Update mute button state
   * Uses mute.png when sound is playing (to show you can mute it)
   * Uses sound.png when muted (to show you can enable sound)
   */
  function updateMuteButtonState() {
    if (!toggleMuteBtn) return;
    
    // Use new PNG images: sound.png when muted (click to enable sound), mute.png when playing (click to mute)
    if (video.muted) {
      toggleMuteBtn.innerHTML = '<img src="img/sound.png" alt="Sound aktivieren" style="width: 20px; height: 20px; vertical-align: middle;">';
      toggleMuteBtn.setAttribute('aria-pressed', 'true');
      toggleMuteBtn.setAttribute('aria-label', 'Ton aktivieren');
      toggleMuteBtn.title = 'Ton aktivieren';
    } else {
      toggleMuteBtn.innerHTML = '<img src="img/mute.png" alt="Mute" style="width: 20px; height: 20px; vertical-align: middle;">';
      toggleMuteBtn.setAttribute('aria-pressed', 'false');
      toggleMuteBtn.setAttribute('aria-label', 'Ton deaktivieren');
      toggleMuteBtn.title = 'Ton deaktivieren';
    }
  }

  /**
   * Initialize intro video autoplay system
   */
  function initIntroVideo() {
    // Find video element
    video = document.getElementById('introVideo');
    if (!video) {
      console.warn('[Video Autoplay] Video element #introVideo not found');
      return;
    }

    // Find preloader elements
    preloader = document.getElementById('videoPreloader');
    loadingBar = document.getElementById('loadingBar');

    // Find or create control buttons
    const videoContainer = video.parentElement;

    // Create or find mute toggle button - positioned bottom-left
    toggleMuteBtn = document.getElementById('toggleMuteBtn');
    if (!toggleMuteBtn) {
      toggleMuteBtn = document.createElement('button');
      toggleMuteBtn.id = 'toggleMuteBtn';
      toggleMuteBtn.className = 'video-controls';
      toggleMuteBtn.style.cssText = 'position: absolute; bottom: 5px; left: 5px; z-index: 10; background: transparent; border: none; padding: 2px; cursor: pointer;';
      videoContainer.appendChild(toggleMuteBtn);
    }

    // Create or find stop button - positioned bottom-right
    stopVideoBtn = document.getElementById('stopVideoBtn');
    if (!stopVideoBtn) {
      stopVideoBtn = document.createElement('button');
      stopVideoBtn.id = 'stopVideoBtn';
      stopVideoBtn.className = 'video-controls';
      stopVideoBtn.setAttribute('aria-label', 'Video stoppen');
      stopVideoBtn.style.cssText = 'position: absolute; bottom: 5px; right: 5px; z-index: 10; background: transparent; border: none; padding: 2px; cursor: pointer;';
      videoContainer.appendChild(stopVideoBtn);
    }

    // Set up event listeners
    toggleMuteBtn.addEventListener('click', toggleIntroMute);
    stopVideoBtn.addEventListener('click', stopIntroVideo);

    // Update button states initially
    updateMuteButtonState();
    updateStopButtonState();

    // Update loading progress as video buffers
    video.addEventListener('progress', updateLoadingProgress);

    // Attempt autoplay with sound when video is fully loaded
    // Use canplaythrough event to ensure video is completely loaded
    if (video.readyState >= 4) {
      // Video is fully loaded and ready to play
      attemptAutoplayWithSound();
    } else {
      // Wait for video to be fully loaded before attempting autoplay
      video.addEventListener('canplaythrough', () => {
        if (video.paused) {
          attemptAutoplayWithSound();
        }
      }, { once: true });
      
      // Fallback: also try when metadata is loaded (in case canplaythrough takes too long)
      video.addEventListener('loadedmetadata', () => {
        if (video.paused && video.readyState >= 2) {
          attemptAutoplayWithSound();
        }
      }, { once: true });
    }

    // Hide preloader if video starts playing
    video.addEventListener('play', hidePreloader);

    // When video ends, update stop button to show play icon
    video.addEventListener('ended', () => {
      console.log('[Video Autoplay] Video playback completed, pausing on last frame');
      updateStopButtonState();
    });
    
    // Update stop button state when video plays
    video.addEventListener('play', () => {
      updateStopButtonState();
    });
    
    // Update stop button state when video pauses
    video.addEventListener('pause', () => {
      updateStopButtonState();
    });

    console.log('[Video Autoplay] Initialized');
  }

  // Export functions to window
  window.initIntroVideo = initIntroVideo;
  window.toggleIntroMute = toggleIntroMute;
  window.stopIntroVideo = stopIntroVideo;

  // Auto-initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIntroVideo);
  } else {
    // DOM already loaded
    initIntroVideo();
  }

})();
