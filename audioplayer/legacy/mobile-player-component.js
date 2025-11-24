/**
 * Custom Mobile Audio Player Component
 * Based on exact design template (background.png, playerleiste.png, player_template.png)
 * Can be embedded in artist profiles and carousels
 */

class MobileAudioPlayer {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.artistName = options.artistName || 'Artist Name';
        this.tracks = options.tracks || [];
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.audioElement = null;
        
        this.init();
    }
    
    init() {
        this.render();
        this.setupEventListeners();
        if (this.tracks.length > 0) {
            this.loadTrack(0);
        }
    }
    
    render() {
        this.container.innerHTML = `
            <div class="mobile-player-container" style="position: relative; width: 100%; max-width: 675px; margin: 0 auto; background: url('img/background.png') no-repeat center top; background-size: cover; padding: 0; border-radius: 12px; overflow: hidden;">
                <!-- Top Section -->
                <div class="mp-top-section" style="padding: 40px 20px 15px; display: flex; flex-direction: column; align-items: center;">
                    <!-- Album Cover -->
                    <div class="mp-album-cover-wrapper" style="margin-bottom: 12px;">
                        <div class="mp-album-cover-frame" style="width: 220px; height: 220px; background: #E0C290; border: 5px solid #B89968; border-radius: 12px; padding: 6px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);">
                            <img class="mp-album-cover" src="" alt="Album Cover" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">
                        </div>
                    </div>

                    <!-- Song Info -->
                    <div class="mp-song-info" style="text-align: center; margin-bottom: 12px; padding: 0 15px;">
                        <div class="mp-artist-name" style="font-size: 0.95em; font-weight: 600; color: #201613; margin-bottom: 2px;">${this.artistName}</div>
                        <div class="mp-song-title" style="font-size: 1.4em; font-weight: 700; color: #201613;">Song Title</div>
                    </div>

                    <!-- Progress Bar -->
                    <div class="mp-progress-wrapper" style="width: 90%; max-width: 350px; margin-bottom: 8px;">
                        <div class="mp-progress-bar-bg" style="position: relative; width: 100%; height: 24px; background: #8B7355; border-radius: 12px; border: 2px solid #5D4A3A; overflow: visible; margin-bottom: 4px; cursor: pointer;">
                            <div class="mp-progress-bar-fill" style="height: 100%; width: 0%; background: linear-gradient(to right, #C8A882, #B89968); border-radius: 10px; transition: width 0.1s linear;"></div>
                            <div class="mp-progress-handle" style="position: absolute; top: 50%; left: 0%; transform: translate(-50%, -50%); width: 16px; height: 16px; background: #3D2817; border: 2px solid #E0C290; border-radius: 50%; cursor: pointer; z-index: 2;"></div>
                        </div>
                        <div class="mp-time-display" style="text-align: right; font-size: 0.9em; font-weight: 700; color: #201613;">
                            <span class="mp-current-time">0:00</span>/<span class="mp-total-time">0:00</span>
                        </div>
                    </div>
                </div>

                <!-- Player Controls -->
                <div class="mp-controls-section" style="position: relative; width: 100%; max-width: 450px; height: 90px; margin: 10px auto; display: flex; justify-content: center; align-items: center;">
                    <img src="img/playerleiste.png" alt="Player Controls" class="mp-controls-bg" style="width: 100%; height: auto; max-width: 450px; display: block;">
                    <button class="mp-prev-btn" aria-label="Previous Track" style="position: absolute; left: 8%; top: 50%; transform: translateY(-50%); width: 75px; height: 75px; background: transparent; border: none; cursor: pointer; border-radius: 50%;"></button>
                    <button class="mp-play-btn" aria-label="Play/Pause" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 95px; height: 95px; background: transparent; border: none; cursor: pointer; border-radius: 50%;"></button>
                    <button class="mp-next-btn" aria-label="Next Track" style="position: absolute; right: 8%; top: 50%; transform: translateY(-50%); width: 75px; height: 75px; background: transparent; border: none; cursor: pointer; border-radius: 50%;"></button>
                </div>

                <!-- Bottom Section -->
                <div class="mp-bottom-section" style="padding: 0 20px 25px; display: flex; flex-direction: column; align-items: center;">
                    <!-- Waveform -->
                    <div class="mp-waveform-section" style="width: 100%; max-width: 350px; height: 75px; background: rgba(224, 194, 144, 0.85); border: 3px solid #5D4A3A; border-radius: 12px; padding: 10px; margin-bottom: 12px;">
                        <canvas class="mp-waveform-canvas" style="width: 100%; height: 100%; border-radius: 6px; background: rgba(139, 115, 85, 0.4);"></canvas>
                    </div>

                    <!-- Track List -->
                    <div class="mp-tracklist-section" style="position: relative; width: 100%; max-width: 350px; background: rgba(224, 194, 144, 0.9); border: 3px solid #5D4A3A; border-radius: 12px; padding: 12px; max-height: 220px;">
                        <div class="mp-tracklist-scroll" style="max-height: 190px; overflow-y: auto; display: flex; flex-direction: column; gap: 2px;">
                            <!-- Tracks populated by JS -->
                        </div>
                        <div class="mp-headphone-icon" style="position: absolute; bottom: 10px; right: 12px; font-size: 20px; opacity: 0.5;">🎧</div>
                    </div>
                </div>

                <!-- Logo Stack -->
                <div class="mp-logo-stack" style="position: absolute; right: 15px; bottom: 120px; display: flex; flex-direction: column; gap: 10px; z-index: 100;">
                    <a href="#" target="_blank" style="display: block; width: 85px; height: auto; transition: transform 0.2s;">
                        <img src="img/logo_01.png" alt="Logo 1" style="width: 100%; height: auto; display: block; filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));">
                    </a>
                    <a href="#" target="_blank" style="display: block; width: 85px; height: auto; transition: transform 0.2s;">
                        <img src="img/logo_02.png" alt="Logo 2" style="width: 100%; height: auto; display: block; filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));">
                    </a>
                    <a href="#" target="_blank" style="display: block; width: 85px; height: auto; transition: transform 0.2s;">
                        <img src="img/logo_03.png" alt="Logo 3" style="width: 100%; height: auto; display: block; filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));">
                    </a>
                    <a href="#" target="_blank" style="display: block; width: 85px; height: auto; transition: transform 0.2s;">
                        <img src="img/logo_04.png" alt="Logo 4" style="width: 100%; height: auto; display: block; filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));">
                    </a>
                </div>

                <!-- Hidden Audio Element -->
                <audio class="mp-audio-player" preload="metadata">
                    <source src="" type="audio/mp4">
                </audio>
            </div>
        `;
        
        // Cache DOM references
        this.audioElement = this.container.querySelector('.mp-audio-player');
        this.playBtn = this.container.querySelector('.mp-play-btn');
        this.prevBtn = this.container.querySelector('.mp-prev-btn');
        this.nextBtn = this.container.querySelector('.mp-next-btn');
        this.progressBar = this.container.querySelector('.mp-progress-bar-fill');
        this.progressHandle = this.container.querySelector('.mp-progress-handle');
        this.progressBg = this.container.querySelector('.mp-progress-bar-bg');
        this.currentTimeEl = this.container.querySelector('.mp-current-time');
        this.totalTimeEl = this.container.querySelector('.mp-total-time');
        this.songTitleEl = this.container.querySelector('.mp-song-title');
        this.albumCoverEl = this.container.querySelector('.mp-album-cover');
        this.tracklistEl = this.container.querySelector('.mp-tracklist-scroll');
        this.waveformCanvas = this.container.querySelector('.mp-waveform-canvas');
        
        this.renderTracklist();
        this.setupWaveform();
    }
    
    renderTracklist() {
        this.tracklistEl.innerHTML = '';
        this.tracks.forEach((track, index) => {
            const trackItem = document.createElement('div');
            trackItem.className = 'mp-track-item';
            trackItem.style.cssText = 'display: flex; align-items: center; padding: 7px 10px; background: #B89968; border-radius: 6px; cursor: pointer; transition: background 0.2s;';
            
            if (index === this.currentTrackIndex) {
                trackItem.style.background = '#8B7355';
            }
            
            trackItem.innerHTML = `
                <span style="font-weight: 700; margin-right: 7px; color: #201613; min-width: 20px; font-size: 0.8em;">${index + 1}.</span>
                <span style="flex: 1; color: #201613; font-size: 0.8em;">${track.title}</span>
            `;
            
            trackItem.addEventListener('click', () => {
                this.currentTrackIndex = index;
                this.loadTrack(index);
                this.play();
            });
            
            this.tracklistEl.appendChild(trackItem);
        });
    }
    
    setupWaveform() {
        const ctx = this.waveformCanvas.getContext('2d');
        this.waveformCanvas.width = this.waveformCanvas.offsetWidth;
        this.waveformCanvas.height = this.waveformCanvas.offsetHeight;
        
        const barCount = 50;
        const barWidth = this.waveformCanvas.width / barCount;
        
        ctx.fillStyle = '#E0C290';
        // Use seeded pattern for consistent waveform
        for (let i = 0; i < barCount; i++) {
            const seed = Math.sin(i * 0.5) * 0.5 + 0.5;
            const barHeight = seed * this.waveformCanvas.height * 0.8;
            const x = i * barWidth;
            const y = (this.waveformCanvas.height - barHeight) / 2;
            ctx.fillRect(x, y, barWidth - 2, barHeight);
        }
    }
    
    setupEventListeners() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.prevTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        
        this.audioElement.addEventListener('timeupdate', () => this.updateProgress());
        this.audioElement.addEventListener('loadedmetadata', () => {
            this.totalTimeEl.textContent = this.formatTime(this.audioElement.duration);
        });
        this.audioElement.addEventListener('ended', () => this.nextTrack());
        
        this.progressBg.addEventListener('click', (e) => {
            const rect = this.progressBg.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            this.audioElement.currentTime = percentage * this.audioElement.duration;
        });
    }
    
    loadTrack(index) {
        const track = this.tracks[index];
        this.audioElement.src = track.src;
        this.songTitleEl.textContent = track.title;
        this.albumCoverEl.src = track.cover;
        this.updateTracklistActive();
    }
    
    updateTracklistActive() {
        const trackItems = this.tracklistEl.querySelectorAll('.mp-track-item');
        trackItems.forEach((item, index) => {
            if (index === this.currentTrackIndex) {
                item.style.background = '#8B7355';
                item.querySelectorAll('span').forEach(span => span.style.color = '#E0C290');
            } else {
                item.style.background = '#B89968';
                item.querySelectorAll('span').forEach(span => span.style.color = '#201613');
            }
        });
    }
    
    play() {
        this.audioElement.play()
            .then(() => {
                this.isPlaying = true;
            })
            .catch(error => {
                console.log('Playback failed:', error);
                this.isPlaying = false;
            });
    }
    
    pause() {
        this.audioElement.pause();
        this.isPlaying = false;
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    prevTrack() {
        this.currentTrackIndex--;
        if (this.currentTrackIndex < 0) {
            this.currentTrackIndex = this.tracks.length - 1;
        }
        this.loadTrack(this.currentTrackIndex);
        if (this.isPlaying) {
            this.play();
        }
    }
    
    nextTrack() {
        this.currentTrackIndex++;
        if (this.currentTrackIndex >= this.tracks.length) {
            this.currentTrackIndex = 0;
        }
        this.loadTrack(this.currentTrackIndex);
        if (this.isPlaying) {
            this.play();
        }
    }
    
    updateProgress() {
        if (!this.audioElement.duration || isNaN(this.audioElement.duration) || this.audioElement.duration === 0) {
            return;
        }
        const progress = (this.audioElement.currentTime / this.audioElement.duration) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.progressHandle.style.left = `${progress}%`;
        this.currentTimeEl.textContent = this.formatTime(this.audioElement.currentTime);
    }
    
    formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) {
            return '0:00';
        }
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileAudioPlayer;
}
