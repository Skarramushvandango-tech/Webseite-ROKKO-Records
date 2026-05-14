// ROKKO Records Modern Audio Player Component
// Features: Modern card design, waveform visualization, large album cover, keyboard accessibility
(function () {
  'use strict';

  const ASSETS = {
    avatar: 'audioplayer/assets/avatar.svg',
    logoBeatport: 'audioplayer/assets/logo-beatport.svg',
    logoSpotify: 'audioplayer/assets/logo-spotify.svg',
    logoApple: 'audioplayer/assets/logo-applemusic.svg',
    logoSoundcloud: 'audioplayer/assets/logo-soundcloud.svg'
  };

  const COLORS = {
    waveform: '#d77014',  // ROKKO orange for waveform
    waveformBg: '#8B7355'
  };

  // Player state
  let state = {
    playlist: [],
    currentIndex: 0,
    isPlaying: false,
    isOpen: false,
    audioContext: null,
    audioBuffer: null,
    source: null,
    startTime: 0,
    pauseTime: 0,
    duration: 0,
    animationFrame: null
  };

  // DOM references
  let elements = {};

  // Initialize the player
  function initPlayer() {
    createPlayerHTML();
    cacheElements();
    attachEventListeners();
    setupKeyboardShortcuts();
  }

  // Create the player overlay HTML structure - Modern Card Design
  function createPlayerHTML() {
    const overlay = document.createElement('div');
    overlay.id = 'rokko-player-overlay';
    overlay.className = 'rokko-player-overlay';
    overlay.style.display = 'none';
    overlay.innerHTML = `
      <div class="rokko-player-container">
        <button class="rokko-player-close" aria-label="Close player" title="Close (Esc)">
          <span aria-hidden="true">&times;</span>
        </button>
        
        <div class="rokko-player-content">
          <!-- Album Cover Section - Large Framed Cover -->
          <div class="rokko-player-cover-section">
            <div class="rokko-album-frame">
              <img src="${ASSETS.avatar}" alt="Album cover" class="rokko-album-cover" id="rokko-album-cover">
            </div>
          </div>

          <!-- Track Info - Artist & Title -->
          <div class="rokko-track-info">
            <p class="rokko-artist-name" id="rokko-artist-name">Artist Name</p>
            <h2 class="rokko-track-title" id="rokko-track-title">Track Title</h2>
          </div>

          <!-- Progress Bar Section -->
          <div class="rokko-progress-section">
            <div class="rokko-progress-bar-wrapper" id="rokko-progress-bar">
              <div class="rokko-progress-fill" id="rokko-progress-fill"></div>
              <div class="rokko-progress-handle" id="rokko-progress-handle"></div>
            </div>
            <div class="rokko-time-display">
              <span id="rokko-current-time">0:00</span>/<span id="rokko-duration">0:00</span>
            </div>
          </div>

          <!-- Playback Controls -->
          <div class="rokko-controls-section">
            <div class="rokko-controls">
              <button class="rokko-btn rokko-btn-prev" id="rokko-btn-prev" aria-label="Previous track (Left Arrow)">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>
              <button class="rokko-btn rokko-btn-play" id="rokko-btn-play" aria-label="Play (Space)">
                <svg class="rokko-icon-play" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <svg class="rokko-icon-pause" viewBox="0 0 24 24" fill="currentColor" width="32" height="32" style="display:none;">
                  <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
                </svg>
              </button>
              <button class="rokko-btn rokko-btn-next" id="rokko-btn-next" aria-label="Next track (Right Arrow)">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M16 18h2V6h-2zm-11-1l8.5-6L5 5z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Waveform Visualization -->
          <div class="rokko-waveform-container" id="rokko-waveform-container">
            <canvas id="rokko-waveform" class="rokko-waveform" width="450" height="60"></canvas>
            <div class="rokko-waveform-progress" id="rokko-waveform-progress"></div>
          </div>

          <!-- Playlist -->
          <div class="rokko-playlist" id="rokko-playlist"></div>

          <!-- Streaming Buttons -->
          <div class="rokko-streaming-buttons">
            <a href="#" class="rokko-stream-btn" data-service="beatport" data-url="" aria-label="Listen on Beatport">
              Beatport
            </a>
            <a href="#" class="rokko-stream-btn" data-service="spotify" data-url="" aria-label="Listen on Spotify">
              Spotify
            </a>
            <a href="#" class="rokko-stream-btn" data-service="apple" data-url="" aria-label="Listen on Apple Music">
              Apple Music
            </a>
            <a href="#" class="rokko-stream-btn" data-service="soundcloud" data-url="" aria-label="Listen on SoundCloud">
              SoundCloud
            </a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  // Cache DOM elements
  function cacheElements() {
    elements = {
      overlay: document.getElementById('rokko-player-overlay'),
      closeBtn: document.querySelector('.rokko-player-close'),
      albumCover: document.getElementById('rokko-album-cover'),
      artistName: document.getElementById('rokko-artist-name'),
      trackTitle: document.getElementById('rokko-track-title'),
      progressBar: document.getElementById('rokko-progress-bar'),
      progressFill: document.getElementById('rokko-progress-fill'),
      progressHandle: document.getElementById('rokko-progress-handle'),
      waveformContainer: document.getElementById('rokko-waveform-container'),
      waveform: document.getElementById('rokko-waveform'),
      waveformProgress: document.getElementById('rokko-waveform-progress'),
      btnPrev: document.getElementById('rokko-btn-prev'),
      btnPlay: document.getElementById('rokko-btn-play'),
      btnNext: document.getElementById('rokko-btn-next'),
      currentTime: document.getElementById('rokko-current-time'),
      duration: document.getElementById('rokko-duration'),
      playlist: document.getElementById('rokko-playlist'),
      iconPlay: document.querySelector('.rokko-icon-play'),
      iconPause: document.querySelector('.rokko-icon-pause')
    };
  }

  // Attach event listeners
  function attachEventListeners() {
    elements.closeBtn.addEventListener('click', closePlayer);
    elements.overlay.addEventListener('click', (e) => {
      if (e.target === elements.overlay) closePlayer();
    });
    elements.btnPrev.addEventListener('click', playPrevious);
    elements.btnPlay.addEventListener('click', togglePlayPause);
    elements.btnNext.addEventListener('click', playNext);
    elements.waveformContainer.addEventListener('click', handleWaveformClick);
    elements.progressBar.addEventListener('click', handleProgressBarClick);
    elements.playlist.addEventListener('click', handlePlaylistClick);
  }

  // Setup keyboard shortcuts
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (!state.isOpen || state.playlist.length === 0) return;
      
      switch(e.key) {
        case ' ':
        case 'Spacebar':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'Escape':
          e.preventDefault();
          closePlayer();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          playPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          playNext();
          break;
      }
    });
  }

  // Open player with options
  function openPlayer(options) {
    if (options.playlist && Array.isArray(options.playlist) && options.playlist.length > 0) {
      state.playlist = options.playlist;
      state.currentIndex = options.startIndex || 0;
    } else if (options.artistFolder) {
      loadPlaylistFromFolder(options.artistFolder, options.artistName || '');
      return; // Will open after loading
    } else {
      console.error('RokkoPlayer: Invalid options. Provide playlist array or artistFolder.');
      // Show empty state if player is opened without valid playlist
      showEmptyPlayerState();
      return;
    }

    renderPlaylist();
    loadTrack(state.currentIndex);
    state.isOpen = true;
    elements.overlay.style.display = 'flex';
    elements.btnPlay.focus();
  }
  
  // Show empty player state when no tracks available
  function showEmptyPlayerState() {
    state.isOpen = true;
    elements.overlay.style.display = 'flex';
    elements.trackTitle.textContent = 'Keine Tracks verfügbar';
    elements.artistName.textContent = 'ROKKO Records';
    elements.albumCover.src = ASSETS.avatar;
    elements.playlist.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--rokko-brown);">Keine Tracks geladen</div>';
  }

  // Load playlist from artist folder
  async function loadPlaylistFromFolder(folder, artistName) {
    try {
      const response = await fetch(`${folder}/manifest.json`);
      if (!response.ok) throw new Error('Manifest not found');
      
      const manifest = await response.json();
      state.playlist = manifest.tracks.map(track => ({
        title: track.title,
        artist: artistName || track.artist || 'Unknown Artist',
        audioSrc: `${folder}/${track.file}`,
        coverSrc: track.cover ? `${folder}/${track.cover}` : `${folder}/cover.png`
      }));
      
      state.currentIndex = 0;
      renderPlaylist();
      loadTrack(state.currentIndex);
      elements.overlay.style.display = 'flex';
      elements.btnPlay.focus();
    } catch (error) {
      console.warn('RokkoPlayer: Could not load manifest, attempting folder scan...', error);
      await scanFolder(folder, artistName);
    }
  }

  // Scan folder for audio files (fallback)
  async function scanFolder(folder, artistName) {
    try {
      const response = await fetch(folder);
      if (!response.ok) throw new Error('Folder not accessible');
      
      const html = await response.text();
      // Safely parse HTML - only extract href attributes, don't execute scripts
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const links = Array.from(doc.querySelectorAll('a'));
      
      // Sanitize and filter audio files
      const audioFiles = links
        .map(a => {
          const href = a.getAttribute('href');
          // Only accept relative paths, no absolute URLs or protocols
          return (href && !href.includes(':') && !href.startsWith('//')) ? href : null;
        })
        .filter(href => href && /\.(mp3|m4a|ogg|wav)$/i.test(href));
      
      if (audioFiles.length === 0) {
        throw new Error('No audio files found in folder');
      }
      
      state.playlist = audioFiles.map(file => ({
        title: file.replace(/\.(mp3|m4a|ogg|wav)$/i, '').replace(/_/g, ' '),
        artist: artistName || 'Unknown Artist',
        audioSrc: `${folder}/${file}`,
        coverSrc: `${folder}/cover.png`
      }));
      
      state.currentIndex = 0;
      renderPlaylist();
      loadTrack(state.currentIndex);
      state.isOpen = true;
      elements.overlay.style.display = 'flex';
      elements.btnPlay.focus();
    } catch (error) {
      console.error('RokkoPlayer: Failed to load playlist', error);
    }
  }

  // Close player
  function closePlayer() {
    stopPlayback();
    state.isOpen = false;
    elements.overlay.style.display = 'none';
  }

  // Render playlist
  function renderPlaylist() {
    elements.playlist.innerHTML = state.playlist.map((track, index) => `
      <div class="rokko-playlist-item ${index === state.currentIndex ? 'active' : ''}" data-index="${index}">
        <span class="rokko-playlist-number">${index + 1}</span>
        <span class="rokko-playlist-title">${track.title}</span>
        <span class="rokko-playlist-artist">${track.artist}</span>
      </div>
    `).join('');
  }
  
  // Handle playlist item clicks using event delegation
  function handlePlaylistClick(e) {
    const item = e.target.closest('.rokko-playlist-item');
    if (item) {
      const index = parseInt(item.dataset.index);
      if (index !== state.currentIndex) {
        loadTrack(index);
        play();
      }
    }
  }

  // Load a track
  function loadTrack(index) {
    if (index < 0 || index >= state.playlist.length) return;
    
    stopPlayback();
    state.currentIndex = index;
    const track = state.playlist[index];
    
    elements.artistName.textContent = track.artist;
    elements.trackTitle.textContent = track.title;
    elements.albumCover.src = track.coverSrc || ASSETS.avatar;
    
    // Update active playlist item
    document.querySelectorAll('.rokko-playlist-item').forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
    
    // Load audio with Web Audio API
    loadAudio(track.audioSrc);
  }

  // Load audio file
  async function loadAudio(url) {
    try {
      if (!state.audioContext) {
        state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      // Show loading state
      if (elements.trackTitle) {
        elements.trackTitle.textContent = state.playlist[state.currentIndex]?.title || 'Lädt...';
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }
      const arrayBuffer = await response.arrayBuffer();
      state.audioBuffer = await state.audioContext.decodeAudioData(arrayBuffer);
      state.duration = state.audioBuffer.duration;
      
      elements.duration.textContent = formatTime(state.duration);
      drawWaveform();
      
      // Clear any error state
      clearErrorState();
    } catch (error) {
      console.error('RokkoPlayer: Failed to load audio', error);
      showErrorState('Audio konnte nicht geladen werden. Bitte versuche es erneut.');
    }
  }
  
  // Show error state in the player
  function showErrorState(message) {
    if (elements.trackTitle) {
      elements.trackTitle.textContent = message;
      elements.trackTitle.style.color = '#c44';
    }
    if (elements.duration) {
      elements.duration.textContent = '--:--';
    }
    // Draw empty waveform
    if (elements.waveform) {
      const ctx = elements.waveform.getContext('2d');
      ctx.clearRect(0, 0, elements.waveform.width, elements.waveform.height);
      ctx.fillStyle = '#999';
      ctx.textAlign = 'center';
      ctx.font = '14px sans-serif';
      ctx.fillText('Kein Audio verfügbar', elements.waveform.width / 2, elements.waveform.height / 2);
    }
  }
  
  // Clear error state
  function clearErrorState() {
    if (elements.trackTitle) {
      elements.trackTitle.style.color = '';
    }
  }

  // Draw waveform
  function drawWaveform() {
    const canvas = elements.waveform;
    const ctx = canvas.getContext('2d');
    const buffer = state.audioBuffer;
    
    if (!buffer) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const data = buffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amp = height / 2;
    
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = COLORS.waveform;
    ctx.beginPath();
    
    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      
      for (let j = 0; j < step; j++) {
        const datum = data[(i * step) + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      
      const y1 = (1 + min) * amp;
      const y2 = (1 + max) * amp;
      ctx.fillRect(i, y1, 1, y2 - y1);
    }
  }

  // Toggle play/pause
  function togglePlayPause() {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }

  // Play audio
  function play() {
    if (!state.audioBuffer) return;
    
    state.source = state.audioContext.createBufferSource();
    state.source.buffer = state.audioBuffer;
    state.source.connect(state.audioContext.destination);
    
    const offset = state.pauseTime;
    state.source.start(0, offset);
    state.startTime = state.audioContext.currentTime - offset;
    state.isPlaying = true;
    
    elements.iconPlay.style.display = 'none';
    elements.iconPause.style.display = 'block';
    elements.btnPlay.setAttribute('aria-label', 'Pause (Space)');
    
    // Start progress updates
    updateProgress();
    
    // Auto-advance to next track
    state.source.onended = () => {
      if (state.isPlaying) {
        playNext();
      }
    };
  }

  // Pause audio
  function pause() {
    if (!state.source) return;
    
    state.source.stop();
    state.pauseTime = state.audioContext.currentTime - state.startTime;
    state.isPlaying = false;
    
    elements.iconPlay.style.display = 'block';
    elements.iconPause.style.display = 'none';
    elements.btnPlay.setAttribute('aria-label', 'Play (Space)');
    
    if (state.animationFrame) {
      cancelAnimationFrame(state.animationFrame);
    }
  }

  // Stop playback
  function stopPlayback() {
    if (state.source) {
      state.source.stop();
      state.source = null;
    }
    state.isPlaying = false;
    state.pauseTime = 0;
    state.startTime = 0;
    
    elements.iconPlay.style.display = 'block';
    elements.iconPause.style.display = 'none';
    
    if (state.animationFrame) {
      cancelAnimationFrame(state.animationFrame);
    }
  }

  // Play previous track
  function playPrevious() {
    const newIndex = state.currentIndex > 0 ? state.currentIndex - 1 : state.playlist.length - 1;
    loadTrack(newIndex);
    if (state.isPlaying) {
      play();
    }
  }

  // Play next track
  function playNext() {
    const newIndex = state.currentIndex < state.playlist.length - 1 ? state.currentIndex + 1 : 0;
    loadTrack(newIndex);
    if (state.isPlaying) {
      play();
    }
  }

  // Update progress display
  function updateProgress() {
    if (!state.isPlaying) return;
    
    const currentTime = state.audioContext.currentTime - state.startTime;
    const progress = (currentTime / state.duration) * 100;
    const clampedProgress = Math.min(progress, 100);
    
    elements.currentTime.textContent = formatTime(currentTime);
    
    // Update waveform progress
    elements.waveformProgress.style.width = `${clampedProgress}%`;
    
    // Update progress bar and handle
    if (elements.progressFill) {
      elements.progressFill.style.width = `${clampedProgress}%`;
    }
    if (elements.progressHandle) {
      elements.progressHandle.style.left = `${clampedProgress}%`;
    }
    
    state.animationFrame = requestAnimationFrame(updateProgress);
  }

  // Handle waveform click (seek)
  function handleWaveformClick(e) {
    if (!state.audioBuffer) return;
    
    const rect = elements.waveformContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const seekTime = percent * state.duration;
    
    const wasPlaying = state.isPlaying;
    if (wasPlaying) pause();
    
    state.pauseTime = seekTime;
    elements.currentTime.textContent = formatTime(seekTime);
    
    const clampedPercent = Math.min(percent * 100, 100);
    elements.waveformProgress.style.width = `${clampedPercent}%`;
    if (elements.progressFill) {
      elements.progressFill.style.width = `${clampedPercent}%`;
    }
    if (elements.progressHandle) {
      elements.progressHandle.style.left = `${clampedPercent}%`;
    }
    
    if (wasPlaying) play();
  }

  // Handle progress bar click (seek)
  function handleProgressBarClick(e) {
    if (!state.audioBuffer) return;
    
    const rect = elements.progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const seekTime = percent * state.duration;
    
    const wasPlaying = state.isPlaying;
    if (wasPlaying) pause();
    
    state.pauseTime = seekTime;
    elements.currentTime.textContent = formatTime(seekTime);
    
    const clampedPercent = Math.min(percent * 100, 100);
    elements.waveformProgress.style.width = `${clampedPercent}%`;
    if (elements.progressFill) {
      elements.progressFill.style.width = `${clampedPercent}%`;
    }
    if (elements.progressHandle) {
      elements.progressHandle.style.left = `${clampedPercent}%`;
    }
    
    if (wasPlaying) play();
  }

  // Format time (seconds to mm:ss)
  function formatTime(seconds) {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlayer);
  } else {
    initPlayer();
  }

  // Export API
  window.RokkoPlayer = {
    openPlayer: openPlayer,
    closePlayer: closePlayer
  };

})();
