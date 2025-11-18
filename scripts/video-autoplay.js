/**
 * ROKKO Records - Intro Video Autoplay with Sound
 * Attempts to autoplay video with sound, with robust fallback to muted autoplay
 * 
 * Features:
 * - Attempts unmuted autoplay on page load
 * - Falls back to muted autoplay if browser blocks sound
 * - Provides user controls: Mute/Unmute toggle and Stop
 * - Shows notification if autoplay with sound is blocked
 */

(function() {
  'use strict';

  let video = null;
  let toggleMuteBtn = null;
  let stopVideoBtn = null;
  let notificationShown = false;

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
      }
    } catch (error) {
      console.warn('[Video Autoplay] Autoplay with sound blocked:', error.message);
      
      // Fallback to muted autoplay
      try {
        video.muted = true;
        await video.play();
        console.log('[Video Autoplay] Falling back to muted autoplay');
        updateMuteButtonState();
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
   */
  function updateMuteButtonState() {
    if (!toggleMuteBtn) return;
    
    if (video.muted) {
      toggleMuteBtn.textContent = '🔇 Ton aktivieren';
      toggleMuteBtn.setAttribute('aria-pressed', 'true');
      toggleMuteBtn.setAttribute('aria-label', 'Ton aktivieren');
    } else {
      toggleMuteBtn.textContent = '🔊 Ton deaktivieren';
      toggleMuteBtn.setAttribute('aria-pressed', 'false');
      toggleMuteBtn.setAttribute('aria-label', 'Ton deaktivieren');
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

    // Create or find stop button
    stopVideoBtn = document.getElementById('stopVideoBtn');
    if (!stopVideoBtn) {
      stopVideoBtn = document.createElement('button');
      stopVideoBtn.id = 'stopVideoBtn';
      stopVideoBtn.className = 'video-controls';
      stopVideoBtn.textContent = '⏹ Stop';
      stopVideoBtn.setAttribute('aria-label', 'Video stoppen');
      stopVideoBtn.style.cssText = 'position: absolute; bottom: 10px; left: 10px;';
      videoContainer.appendChild(stopVideoBtn);
    }

    // Set up event listeners
    toggleMuteBtn.addEventListener('click', toggleIntroMute);
    stopVideoBtn.addEventListener('click', stopIntroVideo);

    // Update button state initially
    updateMuteButtonState();

    // Attempt autoplay with sound when video metadata is loaded
    if (video.readyState >= 2) {
      // Metadata already loaded
      attemptAutoplayWithSound();
    } else {
      video.addEventListener('loadedmetadata', attemptAutoplayWithSound, { once: true });
    }

    // Also try on canplay event as a backup
    video.addEventListener('canplay', () => {
      if (video.paused) {
        attemptAutoplayWithSound();
      }
    }, { once: true });

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
