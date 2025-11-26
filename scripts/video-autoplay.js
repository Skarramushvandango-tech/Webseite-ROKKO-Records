/**
 * ROKKO Records - Intro Video Controls
 * 
 * CRITICAL: Video MUST autoplay IMMEDIATELY without ANY user interaction!
 * DO NOT TOUCH THIS FILE - Video autoplay is PERMANENTLY ENABLED!
 * 
 * How it works:
 * - Video has autoplay and muted attributes in HTML (required by browsers)
 * - This script tries to unmute after autoplay starts
 * - User can toggle mute/unmute with button
 * - Video plays once and stops on last frame (no loop)
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
      const url = new URL(urlOrPath, window.location.origin);
      return url.pathname.split('/').pop();
    } catch (e) {
      return urlOrPath.split('/').pop();
    }
  }

  /**
   * Set the appropriate video source based on screen size
   * Called on init and on resize
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
      video.load();
      // Ensure autoplay continues after source change
      video.play().catch(() => {});
    }
  }

  /**
   * Force video to start playing
   * This is called multiple times to ensure video plays
   */
  function forceAutoplay() {
    if (!video) return;
    
    // Make sure video is set to autoplay
    video.autoplay = true;
    video.loop = false; // Play once and stop
    
    // Try to play
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('[ROKKO] Video autoplay started successfully');
          hidePreloader();
          updateStopButtonState();
          updateMuteButtonState();
        })
        .catch(err => {
          console.warn('[ROKKO] Autoplay blocked, video is muted and should still play:', err);
          // Video should still be playing muted due to HTML attributes
          updateMuteButtonState();
          updateStopButtonState();
        });
    }
  }

  /**
   * Initialize intro video controls
   */
  function initIntroVideo() {
    // Find video element
    video = document.getElementById('introVideo');
    if (!video) {
      console.error('[ROKKO] Video element not found!');
      return;
    }

    console.log('[ROKKO] Initializing video autoplay...');
    
    // Video should already have autoplay and muted attributes from HTML
    // We just need to ensure it plays and set up controls
    video.loop = false; // Play once and stop on last frame

    // Set the appropriate video source based on screen size
    setVideoSource();

    // Find preloader elements
    preloader = document.getElementById('videoPreloader');
    loadingBar = document.getElementById('loadingBar');

    // Find control buttons
    toggleMuteBtn = document.getElementById('toggleMuteBtn');
    stopVideoBtn = document.getElementById('stopVideoBtn');
    
    if (!toggleMuteBtn || !stopVideoBtn) {
      console.warn('[ROKKO] Video control buttons not found');
    }

    // Set up button event listeners
    if (toggleMuteBtn) {
      toggleMuteBtn.addEventListener('click', toggleIntroMute);
      toggleMuteBtn.addEventListener('mouseenter', () => { toggleMuteBtn.style.transform = 'scale(1.1)'; });
      toggleMuteBtn.addEventListener('mouseleave', () => { toggleMuteBtn.style.transform = 'scale(1)'; });
    }
    
    if (stopVideoBtn) {
      stopVideoBtn.addEventListener('click', stopIntroVideo);
      stopVideoBtn.addEventListener('mouseenter', () => { stopVideoBtn.style.transform = 'scale(1.1)'; });
      stopVideoBtn.addEventListener('mouseleave', () => { stopVideoBtn.style.transform = 'scale(1)'; });
    }

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

    // Video events
    video.addEventListener('play', () => {
      console.log('[ROKKO] Video playing');
      updateStopButtonState();
    });
    
    video.addEventListener('playing', () => {
      console.log('[ROKKO] Video now playing');
      clearInterval(loadingInterval);
      hidePreloader();
    });
    
    video.addEventListener('canplaythrough', () => {
      console.log('[ROKKO] Video can play through');
      clearInterval(loadingInterval);
      hidePreloader();
      // Force play in case autoplay didn't work
      forceAutoplay();
    });

    video.addEventListener('ended', () => {
      console.log('[ROKKO] Video ended');
      updateStopButtonState();
    });
    
    video.addEventListener('pause', () => {
      updateStopButtonState();
    });
    
    // Handle window resize
    if (!resizeHandlerAttached) {
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          setVideoSource();
        }, 250);
      });
      resizeHandlerAttached = true;
    }

    // CRITICAL: Force autoplay immediately and on various events
    // This ensures video ALWAYS plays automatically
    forceAutoplay();
    
    // Also try on canplay event
    video.addEventListener('canplay', () => {
      forceAutoplay();
    });
    
    // Also try on loadeddata event
    video.addEventListener('loadeddata', () => {
      forceAutoplay();
    });
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIntroVideo);
  } else {
    initIntroVideo();
  }

})();
