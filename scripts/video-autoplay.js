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

    // Ensure video is playing (browsers should autoplay muted video due to HTML attributes)
    try {
      await video.play();
      console.log('[Video Autoplay] Video playing successfully');
    } catch (error) {
      console.warn('[Video Autoplay] Initial play failed:', error.message);
    }

    // Video starts muted due to HTML attribute - this allows autoplay
    // Try to unmute after a small delay to give browser time to start playback
    setTimeout(() => {
      try {
        video.muted = false;
        console.log('[Video Autoplay] Successfully unmuted video');
        updateMuteButtonState();
      } catch (error) {
        console.warn('[Video Autoplay] Could not unmute:', error.message);
        // Keep muted if unmuting fails
        video.muted = true;
        updateMuteButtonState();
      }
    }, 100);
    
    hidePreloader();
    updateStopButtonState();
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
   * Stop/Play video toggle
   */
  function stopIntroVideo() {
    if (!video) return;
    
    // If video is playing, stop it (jump to end)
    if (!video.paused) {
      video.currentTime = video.duration;
      video.pause();
      updateStopButtonState();
      console.log('[Video Autoplay] Video stopped at end');
    } else {
      // If video is stopped/paused, restart from beginning
      video.currentTime = 0;
      video.play();
      updateStopButtonState();
      console.log('[Video Autoplay] Video restarted from beginning');
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
   * When sound is playing (unmuted): show mute.png (user can click to mute)
   * When muted: show sound.png (user can click to enable sound)
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
    
    // Add hover effects (scale only, no background change)
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
    
    // Start tracking loading progress immediately
    const loadingInterval = setInterval(() => {
      if (video && !video.paused) {
        updateLoadingProgress();
      }
    }, 100);

    // Aggressively attempt to start video playback as soon as possible
    // Try on multiple events to ensure autoplay
    let autoplayAttempted = false;
    const tryAutoplay = () => {
      // Prevent multiple simultaneous play attempts
      if (autoplayAttempted) {
        console.log('[Video Autoplay] Autoplay already attempted, skipping...');
        return;
      }
      
      autoplayAttempted = true;
      console.log('[Video Autoplay] Attempting autoplay...');
      
      video.play().then(() => {
        console.log('[Video Autoplay] Autoplay successful - video playing, waiting for sufficient buffer...');
        // Don't hide preloader yet - keep it visible while buffering
        // It will be hidden when video has buffered enough (canplaythrough event)
        
        // Try to unmute after successful play
        setTimeout(() => {
          try {
            video.muted = false;
            console.log('[Video Autoplay] Successfully unmuted video');
            updateMuteButtonState();
          } catch (error) {
            console.warn('[Video Autoplay] Could not unmute:', error.message);
            video.muted = true;
            updateMuteButtonState();
          }
        }, 100);
      }).catch((error) => {
        console.warn('[Video Autoplay] Autoplay failed:', error.message);
        // Reset flag to allow retry
        autoplayAttempted = false;
        // Keep trying with muted playback
        video.muted = true;
        updateMuteButtonState();
      });
    };

    // Try autoplay on multiple events for maximum reliability
    video.addEventListener('loadedmetadata', tryAutoplay);
    video.addEventListener('loadeddata', tryAutoplay);
    video.addEventListener('canplay', tryAutoplay);
    
    // Immediate attempt if video is already loaded
    if (video.readyState >= 2) {
      console.log('[Video Autoplay] Video already loaded, attempting immediate playback');
      tryAutoplay();
    }
    
    // Fallback: Force play after a short delay if nothing else worked
    setTimeout(() => {
      if (video.paused) {
        console.log('[Video Autoplay] Fallback autoplay triggered');
        tryAutoplay();
      }
    }, 500);

    // Video will autoplay muted due to HTML attributes
    // Once it starts playing, update UI state
    video.addEventListener('play', () => {
      // Keep preloader visible while buffering
      updateStopButtonState();
    });
    
    // Hide preloader only when video has buffered enough to play smoothly
    video.addEventListener('canplaythrough', () => {
      console.log('[Video Autoplay] Video buffered enough, hiding preloader');
      clearInterval(loadingInterval);
      hidePreloader();
    });
    
    // Also hide on playing event as fallback (when video actually starts playing)
    video.addEventListener('playing', () => {
      console.log('[Video Autoplay] Video playing smoothly, ensuring preloader is hidden');
      clearInterval(loadingInterval);
      hidePreloader();
    });

    // When video ends, update stop button to show play icon
    video.addEventListener('ended', () => {
      console.log('[Video Autoplay] Video playback completed, pausing on last frame');
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

  // Auto-initialize immediately since script is not deferred
  // This ensures video starts loading and playing as soon as possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIntroVideo);
  } else {
    // DOM already loaded, initialize immediately
    initIntroVideo();
  }

})();
