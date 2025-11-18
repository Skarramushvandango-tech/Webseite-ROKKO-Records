/**
 * Video Autoplay Handler
 * Manages intro video autoplay with sound attempt and robust fallback UI
 */

(function() {
  'use strict';

  const STATE = {
    video: null,
    muteButton: null,
    stopButton: null,
    isPlaying: false
  };

  /**
   * Show a temporary toast notification
   * @param {string} message - The message to display
   * @param {number} duration - How long to show the toast (ms)
   */
  function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'autoplay-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease-out';
      setTimeout(() => {
        if (toast.parentNode) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  /**
   * Update mute button label and aria-pressed state
   */
  function updateMuteButton() {
    if (!STATE.muteButton || !STATE.video) return;

    if (STATE.video.muted) {
      STATE.muteButton.textContent = 'UNMUTE';
      STATE.muteButton.setAttribute('aria-pressed', 'true');
    } else {
      STATE.muteButton.textContent = 'MUTE';
      STATE.muteButton.setAttribute('aria-pressed', 'false');
    }
  }

  /**
   * Update stop button label and aria-pressed state
   */
  function updateStopButton() {
    if (!STATE.stopButton || !STATE.video) return;

    if (STATE.video.paused) {
      STATE.stopButton.textContent = 'PLAY';
      STATE.stopButton.setAttribute('aria-pressed', 'false');
      STATE.isPlaying = false;
    } else {
      STATE.stopButton.textContent = 'STOP';
      STATE.stopButton.setAttribute('aria-pressed', 'true');
      STATE.isPlaying = true;
    }
  }

  /**
   * Toggle mute/unmute
   */
  function toggleIntroMute() {
    if (!STATE.video) return;

    STATE.video.muted = !STATE.video.muted;
    updateMuteButton();

    // If unmuting and video is paused, try to play
    if (!STATE.video.muted && STATE.video.paused) {
      STATE.video.play().catch(err => {
        console.log('Play after unmute failed:', err);
      });
    }
  }

  /**
   * Stop or play the video
   */
  function stopIntroVideo() {
    if (!STATE.video) return;

    if (STATE.video.paused) {
      STATE.video.play().catch(err => {
        console.error('Play failed:', err);
        showToast('Video konnte nicht abgespielt werden. Bitte versuchen Sie es erneut.');
      });
    } else {
      STATE.video.pause();
    }

    updateStopButton();
  }

  /**
   * Initialize the intro video with autoplay attempt
   */
  async function initIntroVideo() {
    STATE.video = document.getElementById('intro-video');
    STATE.muteButton = document.getElementById('intro-mute');
    STATE.stopButton = document.getElementById('intro-stop');

    if (!STATE.video) {
      console.log('Intro video element not found');
      return;
    }

    // Set up event listeners
    if (STATE.muteButton) {
      STATE.muteButton.addEventListener('click', toggleIntroMute);
    }

    if (STATE.stopButton) {
      STATE.stopButton.addEventListener('click', stopIntroVideo);
    }

    // Update button states when video plays/pauses
    STATE.video.addEventListener('play', updateStopButton);
    STATE.video.addEventListener('pause', updateStopButton);
    STATE.video.addEventListener('ended', () => {
      STATE.video.currentTime = 0;
      updateStopButton();
    });

    // Try to play with sound first
    try {
      STATE.video.muted = false;
      await STATE.video.play();
      console.log('Video playing with sound');
      updateMuteButton();
      updateStopButton();
    } catch (err) {
      console.log('Autoplay with sound blocked:', err.message);
      
      // Fallback: try muted autoplay
      try {
        STATE.video.muted = true;
        await STATE.video.play();
        console.log('Video playing muted');
        showToast('Autoplay mit Ton wurde blockiert. Klicken Sie auf UNMUTE für Ton.');
        updateMuteButton();
        updateStopButton();
      } catch (muteErr) {
        console.log('Muted autoplay also blocked:', muteErr.message);
        showToast('Autoplay blockiert. Klicken Sie auf PLAY zum Starten.');
        STATE.video.muted = false; // Reset to unmuted for manual play
        updateMuteButton();
        updateStopButton();
      }
    }
  }

  // Export functions to window
  window.initIntroVideo = initIntroVideo;
  window.toggleIntroMute = toggleIntroMute;
  window.stopIntroVideo = stopIntroVideo;

  // Auto-initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIntroVideo);
  } else {
    initIntroVideo();
  }
})();
