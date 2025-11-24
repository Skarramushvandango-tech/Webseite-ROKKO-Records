/**
 * ROKKO Records - Modern Audio Player Component
 * Features: Animated vinyl, tonearm, waveform visualization, and full playback controls
 * Used in both artist popup and carousel popup contexts
 */

class ModernAudioPlayer {
    // Constants
    static VINYL_RPM = 2; // Revolutions per minute for vinyl rotation
    
    constructor() {
        this.currentPlaylist = [];
        this.currentArtist = '';
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.audioElement = null;
        this.playerOverlay = null;
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.animationId = null;
        this.vinylRotation = 0;
        this.vinylSpeed = 0;
        this.targetVinylSpeed = 0;
        
        this.init();
    }
    
    init() {
        // Create player overlay if it doesn't exist
        if (!document.getElementById('modernPlayerOverlay')) {
            this.createPlayerHTML();
        }
        
        // Cache DOM elements
        this.playerOverlay = document.getElementById('modernPlayerOverlay');
        this.audioElement = document.getElementById('modernAudioElement');
        this.closeBtn = document.getElementById('modernCloseBtn');
        this.playBtn = document.getElementById('modernPlayBtn');
        this.prevBtn = document.getElementById('modernPrevBtn');
        this.nextBtn = document.getElementById('modernNextBtn');
        this.progressBar = document.getElementById('modernProgressBar');
        this.progressFill = document.getElementById('modernProgressFill');
        this.currentTime = document.getElementById('modernCurrentTime');
        this.totalTime = document.getElementById('modernTotalTime');
        this.albumCover = document.getElementById('modernAlbumCover');
        this.trackTitle = document.getElementById('modernTrackTitle');
        this.trackArtist = document.getElementById('modernTrackArtist');
        this.playlistArea = document.getElementById('modernPlaylistArea');
        this.vinylElement = document.getElementById('modernVinyl');
        this.tonearmElement = document.getElementById('modernTonearm');
        this.waveformCanvas = document.getElementById('modernWaveformCanvas');
        this.waveformCtx = this.waveformCanvas.getContext('2d');
        
        // Set volume
        this.audioElement.volume = 0.7;
        
        // Add event listeners
        this.addEventListeners();
        
        // Initialize Web Audio API
        this.initAudioContext();
        
        // Start animation loop
        this.animate();
    }
    
    createPlayerHTML() {
        const playerHTML = `
        <!-- Modern Audio Player Overlay -->
        <div id="modernPlayerOverlay" class="modern-player-overlay" style="display: none;">
            <!-- Close Button (Top Right) -->
            <button id="modernCloseBtn" class="modern-close-btn" aria-label="Player schließen" title="Schließen">✕</button>

            <!-- Player Container -->
            <div class="modern-player-container">
                <!-- Background with template image -->
                <img src="img/player_template.png" alt="" class="modern-bg">

                <!-- Interactive Layer -->
                <div class="modern-interactive-layer">
                    <!-- Vinyl Record Area (animated) -->
                    <div class="modern-vinyl-area">
                        <div id="modernVinyl" class="modern-vinyl">
                            <img id="modernAlbumCover" src="img/player_template.png" alt="Album Cover" class="modern-vinyl-cover">
                            <div class="modern-vinyl-label"></div>
                        </div>
                    </div>

                    <!-- Tonearm (animated) -->
                    <div id="modernTonearm" class="modern-tonearm"></div>

                    <!-- Artist Name -->
                    <div class="modern-artist-name">
                        <span id="modernTrackArtist">Artist Name</span>
                    </div>

                    <!-- Album/Track Title -->
                    <div class="modern-album-name">
                        <span id="modernTrackTitle">Album Name</span>
                    </div>

                    <!-- Waveform Visualization -->
                    <canvas id="modernWaveformCanvas" class="modern-waveform"></canvas>

                    <!-- Control Buttons -->
                    <button id="modernPrevBtn" class="modern-control-btn modern-prev-btn" aria-label="Previous Track" title="Previous">
                        <span>◀</span>
                    </button>
                    <button id="modernPlayBtn" class="modern-control-btn modern-play-btn" aria-label="Play" title="Play/Pause">
                        <span>▶</span>
                    </button>
                    <button id="modernNextBtn" class="modern-control-btn modern-next-btn" aria-label="Next Track" title="Next">
                        <span>▶▶</span>
                    </button>

                    <!-- Progress Bar with Time Display -->
                    <div class="modern-progress-container">
                        <span id="modernCurrentTime" class="modern-time">0:00</span>
                        <div id="modernProgressBar" class="modern-progress-bar" role="slider" aria-label="Seek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0">
                            <div id="modernProgressFill" class="modern-progress-fill"></div>
                        </div>
                        <span id="modernTotalTime" class="modern-time">0:00</span>
                    </div>

                    <!-- Playlist Area -->
                    <div class="modern-playlist-container">
                        <div id="modernPlaylistArea" class="modern-playlist-area">
                            <!-- Generated by JavaScript -->
                        </div>
                    </div>

                    <!-- Streaming Buttons -->
                    <div class="modern-streaming-buttons-area">
                        <button class="modern-streaming-btn" aria-label="Listen on Amazon Music" title="Amazon Music">
                            <img src="img/logo_02.png" alt="Amazon Music">
                        </button>
                        <button class="modern-streaming-btn" aria-label="Listen on Apple Music" title="Apple Music">
                            <img src="img/logo_03.png" alt="Apple Music">
                        </button>
                        <button class="modern-streaming-btn" aria-label="Listen on Beatport" title="Beatport">
                            <img src="img/logo_04.png" alt="Beatport">
                        </button>
                        <button class="modern-streaming-btn" aria-label="Listen on Spotify" title="Spotify">
                            <img src="img/logo_05.png" alt="Spotify">
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Audio Element -->
        <audio id="modernAudioElement" preload="metadata" crossorigin="anonymous"></audio>
        `;
        
        document.body.insertAdjacentHTML('beforeend', playerHTML);
    }
    
    initAudioContext() {
        try {
            // Create audio context
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            
            // Create analyser node
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.analyser.smoothingTimeConstant = 0.8;
            
            // Create media source
            const source = this.audioContext.createMediaElementSource(this.audioElement);
            source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            // Create data array for waveform
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            
            // Set canvas size
            this.waveformCanvas.width = this.waveformCanvas.offsetWidth;
            this.waveformCanvas.height = this.waveformCanvas.offsetHeight;
        } catch (error) {
            console.warn('Web Audio API not available:', error);
        }
    }
    
    addEventListeners() {
        // Close button
        this.closeBtn.addEventListener('click', () => this.closePlayer());
        
        // Control buttons
        this.playBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.previousTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        
        // Progress bar
        this.progressBar.addEventListener('click', (e) => this.seek(e));
        
        // Audio element events
        this.audioElement.addEventListener('timeupdate', () => this.updateProgress());
        this.audioElement.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audioElement.addEventListener('ended', () => this.nextTrack());
        this.audioElement.addEventListener('play', () => this.onPlay());
        this.audioElement.addEventListener('pause', () => this.onPause());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Close on overlay click
        this.playerOverlay.addEventListener('click', (e) => {
            if (e.target === this.playerOverlay) {
                this.closePlayer();
            }
        });
    }
    
    /**
     * Open player with a playlist
     * @param {Array} playlist - Array of track objects {title, artist, src, cover, album}
     * @param {string} artistName - Artist name to display
     * @param {number} startIndex - Track index to start playing (default: 0)
     */
    openPlayer(playlist, artistName = '', startIndex = 0) {
        this.currentPlaylist = playlist;
        this.currentArtist = artistName;
        this.currentTrackIndex = startIndex;
        
        // Resume audio context if suspended
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        // Pause all other audio on the page
        document.querySelectorAll('audio').forEach(audio => {
            if (audio !== this.audioElement && !audio.paused) {
                audio.pause();
            }
        });
        
        this.buildPlaylist();
        this.loadTrack(this.currentTrackIndex);
        
        this.playerOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    closePlayer() {
        this.playerOverlay.style.display = 'none';
        document.body.style.overflow = '';
        this.pause();
    }
    
    buildPlaylist() {
        this.playlistArea.innerHTML = '';
        
        this.currentPlaylist.forEach((track, index) => {
            const button = document.createElement('button');
            button.className = 'modern-playlist-item';
            button.setAttribute('aria-label', `Play ${track.title}`);
            button.textContent = `${index + 1}. ${track.title}`;
            
            if (index === this.currentTrackIndex) {
                button.classList.add('active');
            }
            
            button.addEventListener('click', () => {
                this.loadTrack(index);
                this.play();
            });
            
            this.playlistArea.appendChild(button);
        });
    }
    
    loadTrack(index) {
        if (index < 0 || index >= this.currentPlaylist.length) return;
        
        this.currentTrackIndex = index;
        const track = this.currentPlaylist[index];
        
        this.audioElement.src = track.src;
        this.trackTitle.textContent = track.album || track.title;
        this.trackArtist.textContent = track.artist || this.currentArtist;
        this.albumCover.src = track.cover;
        
        this.updatePlaylistActiveState();
        this.progressFill.style.width = '0%';
    }
    
    updatePlaylistActiveState() {
        const items = this.playlistArea.querySelectorAll('.modern-playlist-item');
        items.forEach((item, index) => {
            if (index === this.currentTrackIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    play() {
        // Pause all other audio on the page
        document.querySelectorAll('audio').forEach(audio => {
            if (audio !== this.audioElement && !audio.paused) {
                audio.pause();
            }
        });
        
        this.audioElement.play()
            .then(() => {
                this.isPlaying = true;
                this.playBtn.querySelector('span').textContent = '⏸';
                this.playBtn.setAttribute('aria-label', 'Pause');
                this.targetVinylSpeed = ModernAudioPlayer.VINYL_RPM;
                this.tonearmElement.classList.add('on-record');
            })
            .catch(error => {
                console.error('Error playing audio:', error);
            });
    }
    
    pause() {
        this.audioElement.pause();
        this.isPlaying = false;
        this.playBtn.querySelector('span').textContent = '▶';
        this.playBtn.setAttribute('aria-label', 'Play');
        this.targetVinylSpeed = 0; // Soft spin-down
        this.tonearmElement.classList.remove('on-record');
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    previousTrack() {
        let newIndex = this.currentTrackIndex - 1;
        if (newIndex < 0) {
            newIndex = this.currentPlaylist.length - 1;
        }
        this.loadTrack(newIndex);
        if (this.isPlaying) this.play();
    }
    
    nextTrack() {
        let newIndex = this.currentTrackIndex + 1;
        if (newIndex >= this.currentPlaylist.length) {
            newIndex = 0;
        }
        this.loadTrack(newIndex);
        if (this.isPlaying) this.play();
    }
    
    seek(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newTime = percent * this.audioElement.duration;
        if (!isNaN(newTime)) {
            this.audioElement.currentTime = newTime;
        }
    }
    
    updateProgress() {
        if (this.audioElement.duration) {
            const percent = (this.audioElement.currentTime / this.audioElement.duration) * 100;
            this.progressFill.style.width = percent + '%';
            this.progressBar.setAttribute('aria-valuenow', Math.round(percent));
            this.currentTime.textContent = this.formatTime(this.audioElement.currentTime);
        }
    }
    
    updateDuration() {
        this.totalTime.textContent = this.formatTime(this.audioElement.duration);
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    onPlay() {
        this.isPlaying = true;
    }
    
    onPause() {
        this.isPlaying = false;
    }
    
    handleKeyboard(e) {
        if (this.playerOverlay.style.display === 'none') return;
        
        switch(e.key) {
            case 'Escape':
                this.closePlayer();
                break;
            case ' ':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowLeft':
                this.previousTrack();
                break;
            case 'ArrowRight':
                this.nextTrack();
                break;
        }
    }
    
    // Animation loop for vinyl rotation and waveform
    animate() {
        // Smooth vinyl rotation with easing
        const speedDiff = this.targetVinylSpeed - this.vinylSpeed;
        this.vinylSpeed += speedDiff * 0.05; // Smooth easing
        
        if (Math.abs(this.vinylSpeed) > 0.01) {
            this.vinylRotation += this.vinylSpeed;
            this.vinylElement.style.transform = `rotate(${this.vinylRotation}deg)`;
        }
        
        // Draw waveform
        this.drawWaveform();
        
        // Continue animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    drawWaveform() {
        if (!this.analyser || !this.dataArray) return;
        
        // Get frequency data
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Clear canvas
        this.waveformCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.waveformCtx.fillRect(0, 0, this.waveformCanvas.width, this.waveformCanvas.height);
        
        // Draw bars
        const barWidth = (this.waveformCanvas.width / this.dataArray.length) * 2.5;
        let barHeight;
        let x = 0;
        
        for (let i = 0; i < this.dataArray.length; i++) {
            barHeight = (this.dataArray[i] / 255) * this.waveformCanvas.height * 0.8;
            
            // Orange gradient
            const gradient = this.waveformCtx.createLinearGradient(0, this.waveformCanvas.height - barHeight, 0, this.waveformCanvas.height);
            gradient.addColorStop(0, '#ff8800');
            gradient.addColorStop(1, '#ff4400');
            
            this.waveformCtx.fillStyle = gradient;
            this.waveformCtx.fillRect(x, this.waveformCanvas.height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
    }
}

// Initialize player when DOM is ready
let rokkoModernPlayer;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        rokkoModernPlayer = new ModernAudioPlayer();
        window.rokkoModernPlayer = rokkoModernPlayer;
    });
} else {
    rokkoModernPlayer = new ModernAudioPlayer();
    window.rokkoModernPlayer = rokkoModernPlayer;
}
