// ROKKO Records Audio Player
// Playlist Configuration

const playlist = [
    {
        title: "Track 1 - Sample",
        artist: "ROKKO Artist",
        audioSrc: "assets/track1.mp3",
        coverSrc: "assets/cover1.jpg"
    },
    {
        title: "Track 2 - Sample",
        artist: "ROKKO Artist",
        audioSrc: "assets/track2.mp3",
        coverSrc: "assets/cover2.jpg"
    },
    {
        title: "Track 3 - Sample",
        artist: "ROKKO Artist",
        audioSrc: "assets/track3.mp3",
        coverSrc: "assets/cover3.jpg"
    }
    // Add more tracks here as needed
    // Place MP3 files in audioplayer/assets/ directory
    // Place cover images in audioplayer/assets/ directory
];

// DOM Elements
const audioElement = document.getElementById('audioElement');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.querySelector('.progress-bar');
const progress = document.getElementById('progress');
const progressHandle = document.getElementById('progressHandle');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const coverArt = document.getElementById('coverArt');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const volumeSlider = document.getElementById('volumeSlider');
const muteBtn = document.getElementById('muteBtn');
const volumeIcon = document.getElementById('volumeIcon');
const muteIcon = document.getElementById('muteIcon');
const playlistToggle = document.getElementById('playlistToggle');
const playlistPanel = document.getElementById('playlistPanel');
const playlistEl = document.getElementById('playlist');

// Player State
let currentTrackIndex = 0;
let isPlaying = false;
let isSeeking = false;
let lastVolume = 0.7;

// Initialize Player
function init() {
    // Set initial volume
    audioElement.volume = volumeSlider.value / 100;
    lastVolume = audioElement.volume;
    
    // Load first track
    loadTrack(currentTrackIndex);
    
    // Build playlist UI
    buildPlaylist();
    
    // Add event listeners
    addEventListeners();
}

// Build Playlist UI
function buildPlaylist() {
    playlistEl.innerHTML = '';
    
    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.className = 'playlist-item';
        li.tabIndex = 0;
        li.setAttribute('role', 'button');
        li.setAttribute('aria-label', `Play ${track.title} by ${track.artist}`);
        
        if (index === currentTrackIndex) {
            li.classList.add('active');
        }
        
        li.innerHTML = `
            <div class="playlist-item-title">${track.title}</div>
            <div class="playlist-item-artist">${track.artist}</div>
        `;
        
        li.addEventListener('click', () => {
            loadTrack(index);
            play();
            closePlaylist();
        });
        
        li.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                loadTrack(index);
                play();
                closePlaylist();
            }
        });
        
        playlistEl.appendChild(li);
    });
}

// Load Track
function loadTrack(index) {
    if (index < 0 || index >= playlist.length) return;
    
    currentTrackIndex = index;
    const track = playlist[index];
    
    // Update audio source
    audioElement.src = track.audioSrc;
    
    // Update UI
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    
    // Update cover art with loading state
    coverArt.classList.add('loading');
    coverArt.src = track.coverSrc;
    coverArt.onerror = () => {
        coverArt.src = 'assets/cover-placeholder.jpg';
        coverArt.classList.remove('loading');
    };
    coverArt.onload = () => {
        coverArt.classList.remove('loading');
    };
    
    // Update playlist active state
    updatePlaylistActiveState();
    
    // Reset progress
    progress.style.width = '0%';
    currentTimeEl.textContent = '0:00';
}

// Update Playlist Active State
function updatePlaylistActiveState() {
    const items = playlistEl.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === currentTrackIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Play
function play() {
    audioElement.play()
        .then(() => {
            isPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            playPauseBtn.setAttribute('aria-label', 'Pause');
        })
        .catch(error => {
            console.error('Error playing audio:', error);
            alert('Error loading audio file. Please check that the file exists at: ' + playlist[currentTrackIndex].audioSrc);
        });
}

// Pause
function pause() {
    audioElement.pause();
    isPlaying = false;
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    playPauseBtn.setAttribute('aria-label', 'Play');
}

// Toggle Play/Pause
function togglePlayPause() {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

// Previous Track
function previousTrack() {
    let newIndex = currentTrackIndex - 1;
    if (newIndex < 0) {
        newIndex = playlist.length - 1;
    }
    loadTrack(newIndex);
    if (isPlaying) {
        play();
    }
}

// Next Track
function nextTrack() {
    let newIndex = currentTrackIndex + 1;
    if (newIndex >= playlist.length) {
        newIndex = 0;
    }
    loadTrack(newIndex);
    if (isPlaying) {
        play();
    }
}

// Update Progress
function updateProgress() {
    if (!isSeeking && audioElement.duration) {
        const progressPercent = (audioElement.currentTime / audioElement.duration) * 100;
        progress.style.width = progressPercent + '%';
        progressBar.setAttribute('aria-valuenow', progressPercent.toFixed(0));
    }
}

// Update Time Display
function updateTimeDisplay() {
    currentTimeEl.textContent = formatTime(audioElement.currentTime);
    if (audioElement.duration && !isNaN(audioElement.duration)) {
        durationEl.textContent = formatTime(audioElement.duration);
    }
}

// Format Time (seconds to mm:ss)
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Seek
function seek(e) {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = (clickX / width);
    
    if (audioElement.duration) {
        audioElement.currentTime = percentage * audioElement.duration;
        progress.style.width = (percentage * 100) + '%';
    }
}

// Toggle Playlist
function togglePlaylist() {
    const isActive = playlistPanel.classList.toggle('active');
    playlistToggle.setAttribute('aria-expanded', isActive);
    playlistPanel.setAttribute('aria-hidden', !isActive);
}

// Close Playlist
function closePlaylist() {
    playlistPanel.classList.remove('active');
    playlistToggle.setAttribute('aria-expanded', 'false');
    playlistPanel.setAttribute('aria-hidden', 'true');
}

// Toggle Mute
function toggleMute() {
    if (audioElement.volume > 0) {
        lastVolume = audioElement.volume;
        audioElement.volume = 0;
        volumeSlider.value = 0;
        volumeIcon.style.display = 'none';
        muteIcon.style.display = 'block';
        muteBtn.setAttribute('aria-label', 'Unmute');
    } else {
        audioElement.volume = lastVolume;
        volumeSlider.value = lastVolume * 100;
        volumeIcon.style.display = 'block';
        muteIcon.style.display = 'none';
        muteBtn.setAttribute('aria-label', 'Mute');
    }
}

// Update Volume
function updateVolume() {
    const volume = volumeSlider.value / 100;
    audioElement.volume = volume;
    
    if (volume > 0) {
        lastVolume = volume;
        volumeIcon.style.display = 'block';
        muteIcon.style.display = 'none';
        muteBtn.setAttribute('aria-label', 'Mute');
    } else {
        volumeIcon.style.display = 'none';
        muteIcon.style.display = 'block';
        muteBtn.setAttribute('aria-label', 'Unmute');
    }
}

// Add Event Listeners
function addEventListeners() {
    // Playback controls
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', previousTrack);
    nextBtn.addEventListener('click', nextTrack);
    
    // Progress bar
    progressBar.addEventListener('click', seek);
    progressBar.addEventListener('mousedown', () => {
        isSeeking = true;
    });
    progressBar.addEventListener('mouseup', (e) => {
        seek(e);
        isSeeking = false;
    });
    progressBar.addEventListener('mousemove', (e) => {
        if (isSeeking) {
            seek(e);
        }
    });
    
    // Progress bar keyboard navigation
    progressBar.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            audioElement.currentTime = Math.max(0, audioElement.currentTime - 5);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            audioElement.currentTime = Math.min(audioElement.duration, audioElement.currentTime + 5);
        }
    });
    
    // Volume controls
    volumeSlider.addEventListener('input', updateVolume);
    muteBtn.addEventListener('click', toggleMute);
    
    // Playlist toggle
    playlistToggle.addEventListener('click', togglePlaylist);
    
    // Close playlist when clicking outside
    document.addEventListener('click', (e) => {
        if (!playlistPanel.contains(e.target) && 
            !playlistToggle.contains(e.target) && 
            playlistPanel.classList.contains('active')) {
            closePlaylist();
        }
    });
    
    // Audio element events
    audioElement.addEventListener('timeupdate', () => {
        updateProgress();
        updateTimeDisplay();
    });
    
    audioElement.addEventListener('loadedmetadata', () => {
        updateTimeDisplay();
    });
    
    audioElement.addEventListener('ended', () => {
        nextTrack();
    });
    
    audioElement.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        pause();
        alert('Error loading audio file: ' + playlist[currentTrackIndex].audioSrc + 
              '\n\nPlease make sure MP3 files are placed in the audioplayer/assets/ directory.');
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Prevent shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT') return;
        
        switch(e.key) {
            case ' ':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'ArrowLeft':
                if (!progressBar.matches(':focus')) {
                    e.preventDefault();
                    previousTrack();
                }
                break;
            case 'ArrowRight':
                if (!progressBar.matches(':focus')) {
                    e.preventDefault();
                    nextTrack();
                }
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
            case 'l':
            case 'L':
                e.preventDefault();
                togglePlaylist();
                break;
        }
    });
}

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
