// ROKKO Records Image-Based Audio Player
// Playlist Configuration

const playlist = [
    {
        title: "SkaRamush Vandango",
        artist: "Neurocentric",
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
    },
    {
        title: "Track 4 - Sample",
        artist: "ROKKO Artist",
        audioSrc: "assets/track4.mp3",
        coverSrc: "assets/cover4.jpg"
    },
    {
        title: "Track 5 - Sample",
        artist: "ROKKO Artist",
        audioSrc: "assets/track5.mp3",
        coverSrc: "assets/cover5.jpg"
    },
    {
        title: "Track 6 - Sample",
        artist: "ROKKO Artist",
        audioSrc: "assets/track6.mp3",
        coverSrc: "assets/cover6.jpg"
    },
    {
        title: "Track 7 - Sample",
        artist: "ROKKO Artist",
        audioSrc: "assets/track7.mp3",
        coverSrc: "assets/cover7.jpg"
    }
];

// DOM Elements
const playerOverlay = document.getElementById('playerOverlay');
const openPlayerBtn = document.getElementById('openPlayerBtn');
const closePlayerBtn = document.getElementById('closePlayerBtn');
const audioElement = document.getElementById('audioElement');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressHotspot = document.getElementById('progressHotspot');
const progressFill = document.getElementById('progressFill');
const coverArt = document.getElementById('coverArt');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const trackTime = document.getElementById('trackTime');
const playlistHotspots = document.getElementById('playlistHotspots');

// Player State
let currentTrackIndex = 0;
let isPlaying = false;

// Initialize Player
function init() {
    // Set initial volume
    audioElement.volume = 0.7;
    
    // Load first track
    loadTrack(currentTrackIndex);
    
    // Build playlist hotspots
    buildPlaylistHotspots();
    
    // Add event listeners
    addEventListeners();
}

// Open/Close Player Overlay
function openPlayer() {
    playerOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closePlayer() {
    playerOverlay.style.display = 'none';
    document.body.style.overflow = '';
    pause();
}

// Build Playlist Hotspots
function buildPlaylistHotspots() {
    playlistHotspots.innerHTML = '';
    
    // Limit to 7 tracks to match design
    const displayPlaylist = playlist.slice(0, 7);
    
    displayPlaylist.forEach((track, index) => {
        const button = document.createElement('button');
        button.className = 'playlist-item-hotspot';
        button.setAttribute('aria-label', `Play ${track.title} by ${track.artist}`);
        button.textContent = `${index + 1}. ${track.title}`;
        
        if (index === currentTrackIndex) {
            button.classList.add('active');
        }
        
        button.addEventListener('click', () => {
            loadTrack(index);
            play();
        });
        
        playlistHotspots.appendChild(button);
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
    
    // Update cover art
    coverArt.style.opacity = '1';
    coverArt.src = track.coverSrc;
    coverArt.onerror = () => {
        coverArt.style.opacity = '0';
    };
    
    // Update playlist active state
    updatePlaylistActiveState();
    
    // Reset progress
    progressFill.style.width = '0%';
    updateTimeDisplay();
}

// Update Playlist Active State
function updatePlaylistActiveState() {
    const items = playlistHotspots.querySelectorAll('.playlist-item-hotspot');
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
            playPauseBtn.setAttribute('aria-label', 'Pause');
        })
        .catch(error => {
            console.error('Error playing audio:', error);
            alert('Fehler beim Laden der Audiodatei.\nBitte stellen Sie sicher, dass die MP3-Dateien im Ordner audioplayer/assets/ vorhanden sind.');
        });
}

// Pause
function pause() {
    audioElement.pause();
    isPlaying = false;
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
    if (audioElement.duration) {
        const progressPercent = (audioElement.currentTime / audioElement.duration) * 100;
        progressFill.style.width = progressPercent + '%';
        progressHotspot.setAttribute('aria-valuenow', Math.round(progressPercent));
    }
}

// Update Time Display
function updateTimeDisplay() {
    const current = formatTime(audioElement.currentTime);
    const duration = audioElement.duration && !isNaN(audioElement.duration) 
        ? formatTime(audioElement.duration) 
        : '0:00';
    trackTime.textContent = `${current} / ${duration}`;
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
    const rect = progressHotspot.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    
    if (audioElement.duration) {
        audioElement.currentTime = percentage * audioElement.duration;
        progressFill.style.width = (percentage * 100) + '%';
    }
}

// Add Event Listeners
function addEventListeners() {
    // Open/Close Player
    if (openPlayerBtn) {
        openPlayerBtn.addEventListener('click', openPlayer);
    }
    closePlayerBtn.addEventListener('click', closePlayer);
    
    // Close on overlay click (but not player content)
    playerOverlay.addEventListener('click', (e) => {
        if (e.target === playerOverlay) {
            closePlayer();
        }
    });
    
    // Playback controls
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', previousTrack);
    nextBtn.addEventListener('click', nextTrack);
    
    // Progress bar
    progressHotspot.addEventListener('click', seek);
    
    // Progress bar keyboard navigation
    progressHotspot.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            audioElement.currentTime = Math.max(0, audioElement.currentTime - 5);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            audioElement.currentTime = Math.min(audioElement.duration || 0, audioElement.currentTime + 5);
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
    });
    
    // Keyboard shortcuts (when player is open)
    document.addEventListener('keydown', (e) => {
        // Only when player is open
        if (playerOverlay.style.display !== 'flex') return;
        
        // Don't trigger shortcuts when typing in inputs or on hotspots
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
        
        switch(e.key) {
            case 'Escape':
                closePlayer();
                break;
            case ' ':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                previousTrack();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextTrack();
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
