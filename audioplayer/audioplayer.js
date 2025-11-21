/**
 * ROKKO Records Audio Player
 * Standalone audio player with playlist functionality
 */

class AudioPlayer {
    constructor() {
        // Audio element
        this.audio = document.getElementById('audioElement');
        
        // Player state
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.isMuted = false;
        this.volume = 0.7;
        
        // Playlist - Replace with actual MP3 paths and cover images
        this.playlist = [
            {
                title: 'Sample Track 1',
                artist: 'ROKKO Artist',
                src: 'assets/sample-track-1.mp3',
                cover: 'assets/placeholder-cover.svg',
                duration: '3:45'
            },
            {
                title: 'Sample Track 2',
                artist: 'ROKKO Artist',
                src: 'assets/sample-track-2.mp3',
                cover: 'assets/placeholder-cover.svg',
                duration: '4:12'
            },
            {
                title: 'Sample Track 3',
                artist: 'ROKKO Artist',
                src: 'assets/sample-track-3.mp3',
                cover: 'assets/placeholder-cover.svg',
                duration: '3:28'
            },
            {
                title: 'Demo Song',
                artist: 'Demo Artist',
                src: 'assets/demo.mp3',
                cover: 'assets/placeholder-cover.svg',
                duration: '2:55'
            }
        ];
        
        // DOM elements
        this.elements = {
            playPauseBtn: document.getElementById('playPauseBtn'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            volumeBtn: document.getElementById('volumeBtn'),
            volumeSlider: document.getElementById('volumeSlider'),
            seekBar: document.getElementById('seekBar'),
            progressFill: document.getElementById('progressFill'),
            currentTime: document.getElementById('currentTime'),
            duration: document.getElementById('duration'),
            trackTitle: document.getElementById('trackTitle'),
            trackArtist: document.getElementById('trackArtist'),
            albumArt: document.getElementById('albumArt'),
            playIcon: document.getElementById('playIcon'),
            pauseIcon: document.getElementById('pauseIcon'),
            volumeIcon: document.getElementById('volumeIcon'),
            muteIcon: document.getElementById('muteIcon'),
            playlistContainer: document.getElementById('playlistContainer'),
            playerElement: document.querySelector('.audio-player')
        };
        
        this.init();
    }
    
    init() {
        // Set initial volume
        this.audio.volume = this.volume;
        this.elements.volumeSlider.value = this.volume * 100;
        
        // Load first track
        this.loadTrack(this.currentTrackIndex);
        
        // Render playlist
        this.renderPlaylist();
        
        // Attach event listeners
        this.attachEventListeners();
        
        console.log('ROKKO Audio Player initialized');
    }
    
    attachEventListeners() {
        // Playback controls
        this.elements.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.elements.prevBtn.addEventListener('click', () => this.previousTrack());
        this.elements.nextBtn.addEventListener('click', () => this.nextTrack());
        
        // Volume controls
        this.elements.volumeBtn.addEventListener('click', () => this.toggleMute());
        this.elements.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value / 100));
        
        // Seek bar
        this.elements.seekBar.addEventListener('input', (e) => this.seek(e.target.value));
        
        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.audio.addEventListener('play', () => this.onPlay());
        this.audio.addEventListener('pause', () => this.onPause());
        this.audio.addEventListener('error', (e) => this.onError(e));
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    loadTrack(index) {
        if (index < 0 || index >= this.playlist.length) {
            console.error('Invalid track index');
            return;
        }
        
        const track = this.playlist[index];
        this.currentTrackIndex = index;
        
        // Update audio source
        this.audio.src = track.src;
        
        // Update UI
        this.elements.trackTitle.textContent = track.title;
        this.elements.trackArtist.textContent = track.artist;
        this.elements.albumArt.src = track.cover;
        this.elements.albumArt.alt = `${track.title} cover`;
        
        // Reset progress
        this.elements.seekBar.value = 0;
        this.elements.progressFill.style.width = '0%';
        this.elements.currentTime.textContent = '0:00';
        
        // Update playlist active state
        this.updatePlaylistUI();
        
        // Load audio metadata
        this.audio.load();
        
        console.log(`Loaded track: ${track.title} by ${track.artist}`);
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    this.isPlaying = true;
                    this.updatePlayPauseButton();
                    this.elements.playerElement.classList.add('playing');
                })
                .catch(error => {
                    console.error('Error playing audio:', error);
                    this.showError('Unable to play audio. Please check the file path.');
                });
        }
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayPauseButton();
        this.elements.playerElement.classList.remove('playing');
    }
    
    previousTrack() {
        let newIndex = this.currentTrackIndex - 1;
        if (newIndex < 0) {
            newIndex = this.playlist.length - 1;
        }
        
        this.loadTrack(newIndex);
        
        if (this.isPlaying) {
            this.play();
        }
    }
    
    nextTrack() {
        let newIndex = this.currentTrackIndex + 1;
        if (newIndex >= this.playlist.length) {
            newIndex = 0;
        }
        
        this.loadTrack(newIndex);
        
        if (this.isPlaying) {
            this.play();
        }
    }
    
    seek(value) {
        const seekTime = (value / 100) * this.audio.duration;
        if (!isNaN(seekTime)) {
            this.audio.currentTime = seekTime;
        }
    }
    
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        this.audio.volume = this.volume;
        
        // Update volume slider fill
        this.elements.volumeSlider.style.setProperty('--volume-percent', `${this.volume * 100}%`);
        
        // Update mute icon
        if (this.volume === 0) {
            this.isMuted = true;
            this.updateVolumeButton();
        } else if (this.isMuted) {
            this.isMuted = false;
            this.updateVolumeButton();
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.audio.volume = 0;
        } else {
            this.audio.volume = this.volume;
        }
        
        this.updateVolumeButton();
    }
    
    updateProgress() {
        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        
        if (!isNaN(percent)) {
            this.elements.seekBar.value = percent;
            this.elements.progressFill.style.width = `${percent}%`;
            this.elements.currentTime.textContent = this.formatTime(this.audio.currentTime);
        }
    }
    
    updateDuration() {
        if (!isNaN(this.audio.duration)) {
            this.elements.duration.textContent = this.formatTime(this.audio.duration);
        }
    }
    
    updatePlayPauseButton() {
        if (this.isPlaying) {
            this.elements.playIcon.style.display = 'none';
            this.elements.pauseIcon.style.display = 'block';
        } else {
            this.elements.playIcon.style.display = 'block';
            this.elements.pauseIcon.style.display = 'none';
        }
    }
    
    updateVolumeButton() {
        if (this.isMuted || this.audio.volume === 0) {
            this.elements.volumeIcon.style.display = 'none';
            this.elements.muteIcon.style.display = 'block';
        } else {
            this.elements.volumeIcon.style.display = 'block';
            this.elements.muteIcon.style.display = 'none';
        }
    }
    
    renderPlaylist() {
        this.elements.playlistContainer.innerHTML = '';
        
        this.playlist.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            if (index === this.currentTrackIndex) {
                item.classList.add('active');
            }
            
            item.innerHTML = `
                <img src="${track.cover}" alt="${track.title} cover" class="playlist-item-cover">
                <div class="playlist-item-info">
                    <div class="playlist-item-title">${track.title}</div>
                    <div class="playlist-item-artist">${track.artist}</div>
                </div>
                <div class="playlist-item-duration">${track.duration}</div>
            `;
            
            item.addEventListener('click', () => {
                this.loadTrack(index);
                this.play();
            });
            
            this.elements.playlistContainer.appendChild(item);
        });
    }
    
    updatePlaylistUI() {
        const items = this.elements.playlistContainer.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            if (index === this.currentTrackIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    handleKeyboard(e) {
        switch(e.key) {
            case ' ':
            case 'k':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.audio.currentTime = Math.max(0, this.audio.currentTime - 5);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.audio.currentTime = Math.min(this.audio.duration, this.audio.currentTime + 5);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.setVolume(Math.min(1, this.volume + 0.1));
                this.elements.volumeSlider.value = this.volume * 100;
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.setVolume(Math.max(0, this.volume - 0.1));
                this.elements.volumeSlider.value = this.volume * 100;
                break;
            case 'm':
                e.preventDefault();
                this.toggleMute();
                break;
            case 'n':
                e.preventDefault();
                this.nextTrack();
                break;
            case 'p':
                e.preventDefault();
                this.previousTrack();
                break;
        }
    }
    
    onPlay() {
        this.isPlaying = true;
        this.updatePlayPauseButton();
        this.elements.playerElement.classList.add('playing');
    }
    
    onPause() {
        this.isPlaying = false;
        this.updatePlayPauseButton();
        this.elements.playerElement.classList.remove('playing');
    }
    
    onError(e) {
        console.error('Audio error:', e);
        this.pause();
        this.showError('Error loading audio file. Please check the file path.');
    }
    
    showError(message) {
        // Check if error message already exists
        let errorDiv = document.querySelector('.error-message');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            this.elements.playerElement.parentElement.insertBefore(
                errorDiv, 
                this.elements.playerElement
            );
        }
        
        errorDiv.textContent = message;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorDiv && errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    formatTime(seconds) {
        if (isNaN(seconds) || seconds === Infinity) {
            return '0:00';
        }
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.audioPlayer = new AudioPlayer();
});
