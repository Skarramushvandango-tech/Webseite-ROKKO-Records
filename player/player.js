/**
 * ROKKO Custom Audio Player
 * Handles playlist, play/pause, prev/next, seek, time updates, and autoplay
 */

class RokkoAudioPlayer {
  constructor(containerId, playlist) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('Player container not found:', containerId);
      return;
    }

    this.playlist = playlist || [];
    this.currentTrackIndex = 0;
    this.audio = new Audio();
    this.isPlaying = false;

    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
    if (this.playlist.length > 0) {
      this.loadTrack(0);
    }
  }

  render() {
    const html = `
      <div class="rokko-audio-player">
        <div class="player-layout">
          <div class="player-main">
            <div class="player-cover">
              <img id="player-cover-img" src="${this.getCoverImage()}" alt="Album Cover">
            </div>
            
            <div class="track-info">
              <h2 class="track-title" id="track-title">Select a track</h2>
              <p class="track-artist" id="track-artist">ROKKO Records</p>
            </div>
            
            <div class="progress-container">
              <input 
                type="range" 
                class="progress-bar" 
                id="progress-bar" 
                min="0" 
                max="100" 
                value="0"
                aria-label="Seek through track"
              >
              <div class="time-display">
                <span id="current-time">0:00</span>
                <span id="total-time">0:00</span>
              </div>
            </div>
            
            <div class="player-controls">
              <button 
                class="control-btn btn-prev" 
                id="btn-prev" 
                aria-label="Previous track"
                title="Previous track"
              >
                ⏮
              </button>
              
              <button 
                class="control-btn btn-play" 
                id="btn-play" 
                aria-label="Play"
                title="Play"
              >
                ▶
              </button>
              
              <button 
                class="control-btn btn-next" 
                id="btn-next" 
                aria-label="Next track"
                title="Next track"
              >
                ⏭
              </button>
            </div>
          </div>
          
          <div class="player-playlist">
            <h3 class="playlist-title">Playlist</h3>
            <div id="playlist-items"></div>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.renderPlaylist();
  }

  renderPlaylist() {
    const playlistContainer = document.getElementById('playlist-items');
    if (!playlistContainer) return;

    playlistContainer.innerHTML = this.playlist.map((track, index) => `
      <div 
        class="playlist-item ${index === this.currentTrackIndex ? 'active' : ''}" 
        data-index="${index}"
        role="button"
        tabindex="0"
        aria-label="Play ${track.title} by ${track.artist}"
      >
        <div class="playlist-item-title">${track.title}</div>
        <div class="playlist-item-artist">${track.artist}</div>
      </div>
    `).join('');
  }

  attachEventListeners() {
    // Play/Pause button
    const playBtn = document.getElementById('btn-play');
    if (playBtn) {
      playBtn.addEventListener('click', () => this.togglePlay());
    }

    // Previous button
    const prevBtn = document.getElementById('btn-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousTrack());
    }

    // Next button
    const nextBtn = document.getElementById('btn-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextTrack());
    }

    // Progress bar
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      progressBar.addEventListener('input', (e) => this.seek(e.target.value));
    }

    // Playlist items
    const playlistContainer = document.getElementById('playlist-items');
    if (playlistContainer) {
      playlistContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.playlist-item');
        if (item) {
          const index = parseInt(item.dataset.index);
          this.loadTrack(index);
          this.play();
        }
      });

      // Keyboard support for playlist
      playlistContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const item = e.target.closest('.playlist-item');
          if (item) {
            const index = parseInt(item.dataset.index);
            this.loadTrack(index);
            this.play();
          }
        }
      });
    }

    // Audio events
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => this.onTrackEnded());
    this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
    this.audio.addEventListener('error', (e) => this.onError(e));
  }

  loadTrack(index) {
    if (index < 0 || index >= this.playlist.length) return;

    this.currentTrackIndex = index;
    const track = this.playlist[index];

    this.audio.src = track.src;
    this.audio.load();

    // Update UI
    const coverImg = document.getElementById('player-cover-img');
    const titleEl = document.getElementById('track-title');
    const artistEl = document.getElementById('track-artist');

    if (coverImg) coverImg.src = track.cover || this.getCoverImage();
    if (titleEl) titleEl.textContent = track.title;
    if (artistEl) artistEl.textContent = track.artist;

    // Update playlist active state
    this.renderPlaylist();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.audio.play()
      .then(() => {
        this.isPlaying = true;
        this.updatePlayButton();
      })
      .catch(error => {
        console.error('Error playing audio:', error);
        this.onError(error);
      });
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updatePlayButton();
  }

  previousTrack() {
    let newIndex = this.currentTrackIndex - 1;
    if (newIndex < 0) {
      newIndex = this.playlist.length - 1; // Loop to last track
    }
    this.loadTrack(newIndex);
    if (this.isPlaying) {
      this.play();
    }
  }

  nextTrack() {
    let newIndex = this.currentTrackIndex + 1;
    if (newIndex >= this.playlist.length) {
      newIndex = 0; // Loop to first track
    }
    this.loadTrack(newIndex);
    if (this.isPlaying) {
      this.play();
    }
  }

  seek(value) {
    const time = (value / 100) * this.audio.duration;
    if (!isNaN(time)) {
      this.audio.currentTime = time;
    }
  }

  updateProgress() {
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');

    if (progressBar && this.audio.duration) {
      const progress = (this.audio.currentTime / this.audio.duration) * 100;
      progressBar.value = progress;
    }

    if (currentTimeEl) {
      currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
    }
  }

  updateDuration() {
    const totalTimeEl = document.getElementById('total-time');
    if (totalTimeEl) {
      totalTimeEl.textContent = this.formatTime(this.audio.duration);
    }
  }

  updatePlayButton() {
    const playBtn = document.getElementById('btn-play');
    if (playBtn) {
      playBtn.textContent = this.isPlaying ? '⏸' : '▶';
      playBtn.setAttribute('aria-label', this.isPlaying ? 'Pause' : 'Play');
      playBtn.setAttribute('title', this.isPlaying ? 'Pause' : 'Play');
    }
  }

  onTrackEnded() {
    // Autoplay next track
    this.nextTrack();
  }

  onError(error) {
    console.error('Audio player error:', error);
    this.isPlaying = false;
    this.updatePlayButton();
  }

  formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getCoverImage() {
    // Default placeholder cover - SVG with ROKKO branding
    const svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">',
      '<rect width="400" height="400" fill="#E0C290"/>',
      '<text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#3D2817" font-size="24" font-family="Arial">',
      'ROKKO Records',
      '</text>',
      '</svg>'
    ].join('');
    
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }
}

// Make it globally available
window.RokkoAudioPlayer = RokkoAudioPlayer;
