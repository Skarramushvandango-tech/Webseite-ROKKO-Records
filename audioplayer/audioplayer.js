/**
 * ROKKO Records Audio Player
 * Plain JavaScript implementation with playlist support
 */

// Playlist Configuration - Replace with actual MP3 and cover paths
const playlist = [
    {
        title: "Track 1",
        artist: "Artist Name",
        cover: "assets/placeholder-cover.svg",
        src: "assets/track1.mp3",
        duration: "3:45"
    },
    {
        title: "Track 2",
        artist: "Artist Name",
        cover: "assets/placeholder-cover.svg",
        src: "assets/track2.mp3",
        duration: "4:12"
    },
    {
        title: "Track 3",
        artist: "Artist Name",
        cover: "assets/placeholder-cover.svg",
        src: "assets/track3.mp3",
        duration: "3:30"
    }
    // Add more tracks as needed
];

// Player State
let currentTrackIndex = 0;
let isPlaying = false;
let isDragging = false;

// DOM Elements
const audioElement = document.getElementById('audioElement');
const coverArt = document.getElementById('coverArt');
const trackTitle = document.getElementById('trackTitle');
const artistName = document.getElementById('artistName');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const progressBar = document.getElementById('progressBar');
const progressFilled = document.getElementById('progressFilled');
const progressHandle = document.getElementById('progressHandle');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volumeSlider = document.getElementById('volumeSlider');
const muteBtn = document.getElementById('muteBtn');
const volumeIcon = document.getElementById('volumeIcon');
const muteIcon = document.getElementById('muteIcon');
const playlistBtn = document.getElementById('playlistBtn');
const closePlaylistBtn = document.getElementById('closePlaylistBtn');
const playlistElement = document.getElementById('playlist');
const playlistItems = document.getElementById('playlistItems');

/**
 * Initialize the audio player
 */
function init() {
    loadTrack(currentTrackIndex);
    renderPlaylist();
    setupEventListeners();
    
    // Set initial volume
    audioElement.volume = volumeSlider.value / 100;
}

/**
 * Load a track by index
 */
function loadTrack(index) {
    if (index < 0 || index >= playlist.length) {
        console.error('Invalid track index');
        return;
    }
    
    currentTrackIndex = index;
    const track = playlist[index];
    
    audioElement.src = track.src;
    coverArt.src = track.cover;
    trackTitle.textContent = track.title;
    artistName.textContent = track.artist;
    
    // Reset progress
    progressFilled.style.width = '0%';
    progressHandle.style.left = '0%';
    currentTimeDisplay.textContent = '0:00';
    
    // Update playlist active state
    updatePlaylistActiveState();
}

/**
 * Play or pause the current track
 */
function togglePlayPause() {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

/**
 * Play the current track
 */
function play() {
    audioElement.play()
        .then(() => {
            isPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        })
        .catch(error => {
            console.error('Playback error:', error);
            showError('Fehler beim Abspielen. Bitte überprüfen Sie die Audio-Datei.');
        });
}

/**
 * Pause the current track
 */
function pause() {
    audioElement.pause();
    isPlaying = false;
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
}

/**
 * Play previous track
 */
function playPrevious() {
    if (currentTrackIndex > 0) {
        loadTrack(currentTrackIndex - 1);
        if (isPlaying) {
            play();
        }
    } else {
        // Loop to last track
        loadTrack(playlist.length - 1);
        if (isPlaying) {
            play();
        }
    }
}

/**
 * Play next track
 */
function playNext() {
    if (currentTrackIndex < playlist.length - 1) {
        loadTrack(currentTrackIndex + 1);
        if (isPlaying) {
            play();
        }
    } else {
        // Loop to first track
        loadTrack(0);
        if (isPlaying) {
            play();
        }
    }
}

/**
 * Update progress bar as track plays
 */
function updateProgress() {
    if (!isDragging && audioElement.duration) {
        const percent = (audioElement.currentTime / audioElement.duration) * 100;
        progressFilled.style.width = percent + '%';
        progressHandle.style.left = percent + '%';
    }
    
    // Update current time display
    currentTimeDisplay.textContent = formatTime(audioElement.currentTime);
}

/**
 * Seek to a position in the track
 */
function seek(event) {
    const rect = progressBar.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    
    if (audioElement.duration) {
        audioElement.currentTime = (percent / 100) * audioElement.duration;
        progressFilled.style.width = percent + '%';
        progressHandle.style.left = percent + '%';
    }
}

/**
 * Handle volume change
 */
function updateVolume() {
    audioElement.volume = volumeSlider.value / 100;
    updateVolumeIcon();
}

/**
 * Toggle mute
 */
function toggleMute() {
    audioElement.muted = !audioElement.muted;
    updateVolumeIcon();
}

/**
 * Update volume icon based on volume level
 */
function updateVolumeIcon() {
    if (audioElement.muted || audioElement.volume === 0) {
        volumeIcon.style.display = 'none';
        muteIcon.style.display = 'block';
    } else {
        volumeIcon.style.display = 'block';
        muteIcon.style.display = 'none';
    }
}

/**
 * Toggle playlist visibility
 */
function togglePlaylist() {
    if (playlistElement.style.display === 'none') {
        playlistElement.style.display = 'block';
    } else {
        playlistElement.style.display = 'none';
    }
}

/**
 * Render the playlist
 */
function renderPlaylist() {
    playlistItems.innerHTML = '';
    
    playlist.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Play ${track.title} by ${track.artist}`);
        
        if (index === currentTrackIndex) {
            item.classList.add('active');
        }
        
        item.innerHTML = `
            <img src="${track.cover}" alt="${track.title}" class="playlist-item-cover">
            <div class="playlist-item-info">
                <div class="playlist-item-title">${track.title}</div>
                <div class="playlist-item-artist">${track.artist}</div>
            </div>
            <div class="playlist-item-duration">${track.duration}</div>
        `;
        
        const playTrack = () => {
            loadTrack(index);
            play();
            togglePlaylist();
        };
        
        item.addEventListener('click', playTrack);
        
        // Keyboard accessibility
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playTrack();
            }
        });
        
        playlistItems.appendChild(item);
    });
}

/**
 * Update active state in playlist
 */
function updatePlaylistActiveState() {
    const items = playlistItems.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === currentTrackIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * Format time in MM:SS format
 */
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Show error message
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const playerContainer = document.querySelector('.audio-player');
    playerContainer.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Play/Pause button
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    // Previous/Next buttons
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    
    // Audio element events
    audioElement.addEventListener('timeupdate', updateProgress);
    
    audioElement.addEventListener('loadedmetadata', () => {
        durationDisplay.textContent = formatTime(audioElement.duration);
    });
    
    audioElement.addEventListener('ended', () => {
        playNext();
    });
    
    audioElement.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        showError('Fehler beim Laden der Audio-Datei.');
    });
    
    // Progress bar - Click to seek
    progressBar.addEventListener('click', seek);
    
    // Progress bar - Drag to seek
    let mouseMoveHandler = null;
    let mouseUpHandler = null;
    
    progressBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        progressBar.classList.add('dragging');
        seek(e);
        
        // Attach move and up handlers only during drag
        mouseMoveHandler = (e) => {
            if (isDragging) {
                seek(e);
            }
        };
        
        mouseUpHandler = () => {
            if (isDragging) {
                isDragging = false;
                progressBar.classList.remove('dragging');
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            }
        };
        
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    });
    
    // Volume controls
    volumeSlider.addEventListener('input', updateVolume);
    muteBtn.addEventListener('click', toggleMute);
    
    // Playlist controls
    playlistBtn.addEventListener('click', togglePlaylist);
    closePlaylistBtn.addEventListener('click', togglePlaylist);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case ' ':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                playPrevious();
                break;
            case 'ArrowRight':
                e.preventDefault();
                playNext();
                break;
            case 'ArrowUp':
                e.preventDefault();
                volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 10);
                updateVolume();
                break;
            case 'ArrowDown':
                e.preventDefault();
                volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 10);
                updateVolume();
                break;
            case 'm':
            case 'M':
                e.preventDefault();
                toggleMute();
                break;
        }
    });
}

// Initialize player when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
