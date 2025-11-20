/**
 * ROKKO Audio Player Integration Script
 * 
 * This script automatically finds and replaces player containers with the ROKKO audio player.
 * 
 * Usage:
 * 1. Add this script to your HTML: <script src="player/integrate.js"></script>
 * 2. Add a container with either:
 *    - data-player="replace" attribute, OR
 *    - id="replace-player"
 * 
 * Example:
 * <div data-player="replace" id="my-player"></div>
 * 
 * The script will:
 * - Load player.css and player.js automatically
 * - Replace the container content with the player
 * - Initialize the player with a demo playlist (or custom playlist if provided)
 */

(function() {
  'use strict';

  // Configuration
  const PLAYER_BASE_PATH = 'player/';
  const CSS_PATH = PLAYER_BASE_PATH + 'player.css';
  const JS_PATH = PLAYER_BASE_PATH + 'player.js';

  // Default demo playlist
  const DEFAULT_PLAYLIST = [
    {
      title: 'Demo Track 1',
      artist: 'ROKKO Artist',
      src: 'public/player-assets/demo-track-1.mp3',
      cover: 'public/player-assets/cover-1.jpg'
    },
    {
      title: 'Demo Track 2',
      artist: 'ROKKO Artist',
      src: 'public/player-assets/demo-track-2.mp3',
      cover: 'public/player-assets/cover-2.jpg'
    },
    {
      title: 'Demo Track 3',
      artist: 'ROKKO Artist',
      src: 'public/player-assets/demo-track-3.mp3',
      cover: 'public/player-assets/cover-3.jpg'
    }
  ];

  /**
   * Load CSS file dynamically
   */
  function loadCSS(href) {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      const existingLink = document.querySelector(`link[href="${href}"]`);
      if (existingLink) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  /**
   * Load JavaScript file dynamically
   */
  function loadJS(src) {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  /**
   * Find player containers
   */
  function findPlayerContainers() {
    const containers = [];

    // Find by data-player="replace"
    const dataContainers = document.querySelectorAll('[data-player="replace"]');
    containers.push(...dataContainers);

    // Find by id="replace-player"
    const idContainer = document.getElementById('replace-player');
    if (idContainer && !containers.includes(idContainer)) {
      containers.push(idContainer);
    }

    return containers;
  }

  /**
   * Get playlist from container's data attribute
   */
  function getPlaylistFromContainer(container) {
    const playlistData = container.dataset.playlist;
    
    if (playlistData) {
      try {
        return JSON.parse(playlistData);
      } catch (e) {
        console.error('Failed to parse playlist data:', e);
      }
    }

    // Check if window has a playlist defined
    if (window.ROKKO_PLAYLIST && Array.isArray(window.ROKKO_PLAYLIST)) {
      return window.ROKKO_PLAYLIST;
    }

    return DEFAULT_PLAYLIST;
  }

  /**
   * Initialize player in container
   */
  function initializePlayer(container, playlist) {
    // Generate unique ID if container doesn't have one
    if (!container.id) {
      container.id = 'rokko-player-' + Date.now();
    }

    // Wait for RokkoAudioPlayer to be available
    if (typeof window.RokkoAudioPlayer !== 'function') {
      console.error('RokkoAudioPlayer not loaded yet');
      return;
    }

    // Initialize player
    try {
      new window.RokkoAudioPlayer(container.id, playlist);
    } catch (error) {
      console.error('Failed to initialize player:', error);
      container.innerHTML = '<div class="player-error">Failed to load audio player. Please check console for details.</div>';
    }
  }

  /**
   * Main integration function
   */
  async function integrate() {
    try {
      // Find containers
      const containers = findPlayerContainers();

      if (containers.length === 0) {
        console.log('No player containers found (looking for data-player="replace" or id="replace-player")');
        return;
      }

      console.log(`Found ${containers.length} player container(s)`);

      // Load CSS and JS
      await loadCSS(CSS_PATH);
      await loadJS(JS_PATH);

      // Initialize each container
      containers.forEach(container => {
        const playlist = getPlaylistFromContainer(container);
        initializePlayer(container, playlist);
      });

    } catch (error) {
      console.error('Failed to integrate player:', error);
    }
  }

  // Run integration when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', integrate);
  } else {
    integrate();
  }

})();
