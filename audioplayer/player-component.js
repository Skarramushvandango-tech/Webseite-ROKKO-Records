// ROKKO Records Vanilla JS Audio Player Component
// Features: Waveform visualization, vinyl/tonearm animations, keyboard accessibility
(function () {
  'use strict';

  const ASSETS = {
    vinyl: 'assets/vinyl.svg',
    tonearm: 'assets/tonearm.svg',
    avatar: 'assets/avatar.svg',
    logoBeatport: 'assets/logo-beatport.svg',
    logoSpotify: 'assets/logo-spotify.svg',
    logoApple: 'assets/logo-applemusic.svg',
    logoSoundcloud: 'assets/logo-soundcloud.svg'
  };

  // Player state
  let state = {
    playlist: [],
    currentIndex: 0,
    isPlaying: false,
    audioContext: null,
    audioBuffer: null,
    source: null,
    startTime: 0,
    pauseTime: 0,
    duration: 0,
    vinylRotation: 0,
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

  // Create the player overlay HTML structure
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
          <!-- Left Section: Vinyl & Tonearm -->
          <div class="rokko-player-vinyl-section">
            <div class="rokko-vinyl-wrapper">
              <img src="${ASSETS.vinyl}" alt="Vinyl record" class="rokko-vinyl" id="rokko-vinyl">
              <img src="${ASSETS.tonearm}" alt="Tonearm" class="rokko-tonearm" id="rokko-tonearm">
              <div class="rokko-cover-inset">
                <img src="${ASSETS.avatar}" alt="Album cover" class="rokko-album-cover" id="rokko-album-cover">
              </div>
            </div>
          </div>

          <!-- Right Section: Controls & Info -->
          <div class="rokko-player-info-section">
            <div class="rokko-track-info">
              <h2 class="rokko-artist-name" id="rokko-artist-name">Artist Name</h2>
              <h3 class="rokko-track-title" id="rokko-track-title">Track Title</h3>
            </div>

            <!-- Waveform Canvas -->
            <div class="rokko-waveform-container">
              <canvas id="rokko-waveform" class="rokko-waveform" width="600" height="100"></canvas>
              <div class="rokko-waveform-progress" id="rokko-waveform-progress"></div>
            </div>

            <!-- Playback Controls -->
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

            <!-- Time Display -->
            <div class="rokko-time-display">
              <span id="rokko-current-time">0:00</span>
              <span id="rokko-duration">0:00</span>
            </div>

            <!-- Playlist -->
            <div class="rokko-playlist" id="rokko-playlist"></div>

            <!-- Streaming Buttons -->
            <div class="rokko-streaming-buttons">
              <a href="#" class="rokko-stream-btn" data-service="beatport" data-url="" aria-label="Listen on Beatport">
                <img src="${ASSETS.logoBeatport}" alt="Beatport">
              </a>
              <a href="#" class="rokko-stream-btn" data-service="spotify" data-url="" aria-label="Listen on Spotify">
                <img src="${ASSETS.logoSpotify}" alt="Spotify">
              </a>
              <a href="#" class="rokko-stream-btn" data-service="apple" data-url="" aria-label="Listen on Apple Music">
                <img src="${ASSETS.logoApple}" alt="Apple Music">
              </a>
              <a href="#" class="rokko-stream-btn" data-service="soundcloud" data-url="" aria-label="Listen on SoundCloud">
                <img src="${ASSETS.logoSoundcloud}" alt="SoundCloud">
              </a>
            </div>
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
      vinyl: document.getElementById('rokko-vinyl'),
      tonearm: document.getElementById('rokko-tonearm'),
      albumCover: document.getElementById('rokko-album-cover'),
      artistName: document.getElementById('rokko-artist-name'),
      trackTitle: document.getElementById('rokko-track-title'),
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
    elements.waveform.addEventListener('click', handleWaveformClick);
  }

  // Setup keyboard shortcuts
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (state.playlist.length === 0 || elements.overlay.style.display === 'none') return;
      
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
    if (options.playlist && Array.isArray(options.playlist)) {
      state.playlist = options.playlist;
      state.currentIndex = options.startIndex || 0;
    } else if (options.artistFolder) {
      loadPlaylistFromFolder(options.artistFolder, options.artistName || '');
      return; // Will open after loading
    } else {
      console.error('RokkoPlayer: Invalid options. Provide playlist array or artistFolder.');
      return;
    }

    renderPlaylist();
    loadTrack(state.currentIndex);
    elements.overlay.style.display = 'flex';
    elements.btnPlay.focus();
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
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const links = Array.from(doc.querySelectorAll('a'));
      
      const audioFiles = links
        .map(a => a.getAttribute('href'))
        .filter(href => href && /\.(mp3|m4a|ogg|wav)$/i.test(href));
      
      state.playlist = audioFiles.map(file => ({
        title: file.replace(/\.(mp3|m4a|ogg|wav)$/i, '').replace(/_/g, ' '),
        artist: artistName || 'Unknown Artist',
        audioSrc: `${folder}/${file}`,
        coverSrc: `${folder}/cover.png`
      }));
      
      state.currentIndex = 0;
      renderPlaylist();
      loadTrack(state.currentIndex);
      elements.overlay.style.display = 'flex';
      elements.btnPlay.focus();
    } catch (error) {
      console.error('RokkoPlayer: Failed to load playlist', error);
    }
  }

  // Close player
  function closePlayer() {
    stopPlayback();
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
    
    // Add click handlers to playlist items
    document.querySelectorAll('.rokko-playlist-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        if (index !== state.currentIndex) {
          loadTrack(index);
          play();
        }
      });
    });
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
      
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      state.audioBuffer = await state.audioContext.decodeAudioData(arrayBuffer);
      state.duration = state.audioBuffer.duration;
      
      elements.duration.textContent = formatTime(state.duration);
      drawWaveform();
    } catch (error) {
      console.error('RokkoPlayer: Failed to load audio', error);
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
    ctx.fillStyle = '#d77014'; // Orange from design
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
    
    // Start animations
    startVinylAnimation();
    moveTonearmDown();
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
    
    stopVinylAnimation();
    moveTonearmUp();
    
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
    
    stopVinylAnimation();
    moveTonearmUp();
    
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
    
    elements.currentTime.textContent = formatTime(currentTime);
    elements.waveformProgress.style.width = `${Math.min(progress, 100)}%`;
    
    state.animationFrame = requestAnimationFrame(updateProgress);
  }

  // Handle waveform click (seek)
  function handleWaveformClick(e) {
    if (!state.audioBuffer) return;
    
    const rect = elements.waveform.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const seekTime = percent * state.duration;
    
    const wasPlaying = state.isPlaying;
    if (wasPlaying) pause();
    
    state.pauseTime = seekTime;
    elements.currentTime.textContent = formatTime(seekTime);
    elements.waveformProgress.style.width = `${percent * 100}%`;
    
    if (wasPlaying) play();
  }

  // Start vinyl animation
  function startVinylAnimation() {
    function animate() {
      if (!state.isPlaying) return;
      state.vinylRotation += 2; // degrees per frame
      elements.vinyl.style.transform = `rotate(${state.vinylRotation}deg)`;
      requestAnimationFrame(animate);
    }
    animate();
  }

  // Stop vinyl animation with soft spin-down
  function stopVinylAnimation() {
    let speed = 2;
    function spinDown() {
      if (speed <= 0) return;
      speed *= 0.95; // Gradual slowdown
      state.vinylRotation += speed;
      elements.vinyl.style.transform = `rotate(${state.vinylRotation}deg)`;
      if (speed > 0.1) {
        requestAnimationFrame(spinDown);
      }
    }
    spinDown();
  }

  // Move tonearm down (playing)
  function moveTonearmDown() {
    elements.tonearm.style.transform = 'rotate(-15deg)';
    elements.tonearm.style.transformOrigin = 'top center';
  }

  // Move tonearm up (stopped)
  function moveTonearmUp() {
    elements.tonearm.style.transform = 'rotate(0deg)';
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
