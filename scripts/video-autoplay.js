/**
 * ROKKO Records - Intro Video Controls
 * JavaScript-controlled video autoplay system with sound
 * 
 * Features:
 * - Video attempts to autoplay with sound via JavaScript
 * - Handles browser autoplay policies gracefully
 * - Video stops on last frame (no loop)
 * - Provides user controls: Mute/Unmute toggle and Stop/Play
 */

(function() {
  'use strict';

  let video = null;
  let toggleMuteBtn = null;
  let stopVideoBtn = null;
  let preloader = null;
  let loadingBar = null;
  let resizeTimer = null;
  let resizeHandlerAttached = false;
  let autoplayAttempted = false;

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
      stopVideoBtn.innerHTML = '<img src="img/playbutton.png" alt="Play" style="width: 50px; height: 50px; vertical-align: middle;">';
      stopVideoBtn.setAttribute('aria-label', 'Video abspielen');
      stopVideoBtn.title = 'Video abspielen';
    } else {
      stopVideoBtn.innerHTML = '<img src="img/stopbutton.png" alt="Stop" style="width: 50px; height: 50px; vertical-align: middle;">';
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
      toggleMuteBtn.innerHTML = '<img src="img/sound.png" alt="Sound aktivieren" style="width: 50px; height: 50px; vertical-align: middle;">';
      toggleMuteBtn.setAttribute('aria-pressed', 'true');
      toggleMuteBtn.setAttribute('aria-label', 'Ton aktivieren');
      toggleMuteBtn.title = 'Ton aktivieren';
    } else {
      toggleMuteBtn.innerHTML = '<img src="img/mute.png" alt="Ton aus" style="width: 50px; height: 50px; vertical-align: middle;">';
      toggleMuteBtn.setAttribute('aria-pressed', 'false');
      toggleMuteBtn.setAttribute('aria-label', 'Ton deaktivieren');
      toggleMuteBtn.title = 'Ton deaktivieren';
    }
  }

  /**
   * Get filename from URL or path
   */
  function getFilename(urlOrPath) {
    try {
      // Try to parse as URL
      const url = new URL(urlOrPath, window.location.origin);
      return url.pathname.split('/').pop();
    } catch (e) {
      // If not a valid URL, treat as path
      return urlOrPath.split('/').pop();
    }
  }

  /**
   * Set the appropriate video source based on screen size
   */
  function setVideoSource() {
    if (!video) return;
    
    const videoSource = document.getElementById('videoSource');
    if (!videoSource) return;
    
    // Check if mobile (768px or less) or desktop
    const isMobile = window.innerWidth <= 768;
    const newSrc = isMobile ? 'images/intro_movie_mobile.mp4' : 'images/intro_movie.mp4';
    const newFilename = getFilename(newSrc);
    const currentFilename = getFilename(videoSource.src);
    
    // Only update if the source is different
    if (currentFilename !== newFilename) {
      videoSource.src = newSrc;
      video.load(); // Reload the video with the new source
      // Reset autoplay flag so video can autoplay with the new source
      autoplayAttempted = false;
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

    // Start video with sound enabled (unmuted) - autoplay will be attempted with sound
    video.muted = false;
    
    // Ensure video does not loop (play once and stop at last frame)
    video.loop = false;

    // Set the appropriate video source based on screen size
    setVideoSource();

    // Find preloader elements
    preloader = document.getElementById('videoPreloader');
    loadingBar = document.getElementById('loadingBar');

    // Find control buttons (now defined in HTML)
    toggleMuteBtn = document.getElementById('toggleMuteBtn');
    stopVideoBtn = document.getElementById('stopVideoBtn');
    
    if (!toggleMuteBtn || !stopVideoBtn) {
      console.warn('Video control buttons not found in DOM: toggleMuteBtn=' + !!toggleMuteBtn + ', stopVideoBtn=' + !!stopVideoBtn);
      return;
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
    
    // Handle window resize to switch video source if needed
    // Only attach once to prevent multiple listeners
    if (!resizeHandlerAttached) {
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          setVideoSource();
        }, 250); // Debounce resize events
      });
      resizeHandlerAttached = true;
    }

    /**
     * Attempt to autoplay video with muted fallback
     */
    function attemptMutedAutoplay() {
      video.muted = true;
      video.play()
        .then(() => {
          console.log('Video autoplay started muted (fallback)');
          updateStopButtonState();
          updateMuteButtonState();
        })
        .catch(err => {
          console.error('Video autoplay failed completely:', err);
          updateMuteButtonState();
          updateStopButtonState();
        });
    }

    // Attempt to autoplay video with sound when browser can start playing
    // canplay event fires when enough data is available to play without buffering
    // Note: Video should play once with sound and stay on last frame
    // Use flag to prevent multiple autoplay attempts
    video.addEventListener('canplay', () => {
      if (autoplayAttempted) {
        return; // Already attempted autoplay once
      }
      autoplayAttempted = true;
      
      // Try to play the video with sound (browsers may block this)
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Autoplay with sound succeeded
            console.log('Video autoplay with sound started successfully');
            updateStopButtonState();
            updateMuteButtonState();
          })
          .catch(error => {
            // Autoplay with sound was blocked, try muted as fallback
            console.warn('Video autoplay with sound was prevented, trying muted:', error);
            attemptMutedAutoplay();
          });
      }
    });
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIntroVideo);
  } else {
    initIntroVideo();
  }

})();
