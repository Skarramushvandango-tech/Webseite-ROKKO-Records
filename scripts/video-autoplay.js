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
   * Stop video (pause and reset to beginning)
   */
  function stopIntroVideo() {
    if (!video) return;
    
    video.pause();
    video.currentTime = 0;
    
    console.log('[Video Autoplay] Video stopped and reset');
  }

  /**
   * Update mute button state
   * Uses mute_0.png for muted and mute_1.png for unmuted
   */
  function updateMuteButtonState() {
    if (!toggleMuteBtn) return;
    
    // Use PNG images instead of emojis: mute_0.png = muted, mute_1.png = unmuted
    if (video.muted) {
      toggleMuteBtn.innerHTML = '<img src="img/mute_0.png" alt="Muted" style="width: 24px; height: 24px; vertical-align: middle;">';
      toggleMuteBtn.setAttribute('aria-pressed', 'true');
      toggleMuteBtn.setAttribute('aria-label', 'Ton aktivieren');
      toggleMuteBtn.title = 'Ton aktivieren';
    } else {
      toggleMuteBtn.innerHTML = '<img src="img/mute_1.png" alt="Unmuted" style="width: 24px; height: 24px; vertical-align: middle;">';
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

    // Create or find mute toggle button
    toggleMuteBtn = document.getElementById('toggleMuteBtn');
    if (!toggleMuteBtn) {
      toggleMuteBtn = document.createElement('button');
      toggleMuteBtn.id = 'toggleMuteBtn';
      toggleMuteBtn.className = 'video-controls';
      toggleMuteBtn.style.cssText = 'position: absolute; bottom: 10px; right: 10px;';
      videoContainer.appendChild(toggleMuteBtn);
    }

    // Create or find stop button (no emojis - simple text only)
    stopVideoBtn = document.getElementById('stopVideoBtn');
    if (!stopVideoBtn) {
      stopVideoBtn = document.createElement('button');
      stopVideoBtn.id = 'stopVideoBtn';
      stopVideoBtn.className = 'video-controls';
      stopVideoBtn.textContent = 'Stop';
      stopVideoBtn.setAttribute('aria-label', 'Video stoppen');
      stopVideoBtn.style.cssText = 'position: absolute; bottom: 10px; left: 10px;';
      videoContainer.appendChild(stopVideoBtn);
    }

    // Set up event listeners
    toggleMuteBtn.addEventListener('click', toggleIntroMute);
    stopVideoBtn.addEventListener('click', stopIntroVideo);

    // Update button state initially
    updateMuteButtonState();

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

    // When video ends, pause it on the last frame (don't loop or reset)
    video.addEventListener('ended', () => {
      console.log('[Video Autoplay] Video playback completed, pausing on last frame');
      // Video naturally stays on last frame when ended
      // No need to reset to beginning
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
