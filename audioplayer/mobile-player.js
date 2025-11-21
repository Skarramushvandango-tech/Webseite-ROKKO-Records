// ROKKO Records Mobile Audio Player - Using playerleiste.png buttons

const playlist = [
    {
        title: "SkaRamush Vandango",
        artist: "Neurocentric",
        audioSrc: "assets/track1.mp3",
        coverSrc: "assets/cover1.jpg"
    },
    {
        title: "Song Name",
        artist: "Artist Name",
        audioSrc: "assets/track2.mp3",
        coverSrc: "assets/cover2.jpg"
    },
    {
        title: "Song Name",
        artist: "Artist Name",
        audioSrc: "assets/track3.mp3",
        coverSrc: "assets/cover3.jpg"
    },
    {
        title: "Song Name",
        artist: "Artist Name",
        audioSrc: "assets/track4.mp3",
        coverSrc: "assets/cover4.jpg"
    },
    {
        title: "Song Name",
        artist: "Artist Name",
        audioSrc: "assets/track5.mp3",
        coverSrc: "assets/cover5.jpg"
    },
    {
        title: "Song Name",
        artist: "Artist Name",
        audioSrc: "assets/track6.mp3",
        coverSrc: "assets/cover6.jpg"
    },
    {
        title: "Song Name",
        artist: "Artist Name",
        audioSrc: "assets/track7.mp3",
        coverSrc: "assets/cover7.jpg"
    }
];

// DOM Elements
const playerOverlay = document.getElementById('playerOverlay');
const openPlayerBtn = document.getElementById('openPlayerBtn');
const closePlayerBtn = document.getElementById('closePlayerBtn');
const audioElement = document.getElementById('audioElement');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const albumCover = document.getElementById('albumCover');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const playlistScroll = document.getElementById('playlistScroll');

// State
let currentTrackIndex = 0;
let isPlaying = false;

// Initialize
function init() {
    audioElement.volume = 0.7;
    loadTrack(currentTrackIndex);
    buildPlaylist();
    addEventListeners();
}

// Open/Close
function openPlayer() {
    playerOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closePlayer() {
    playerOverlay.style.display = 'none';
    document.body.style.overflow = '';
    pause();
}

// Build Playlist
function buildPlaylist() {
    playlistScroll.innerHTML = '';
    
    playlist.forEach((track, index) => {
        const button = document.createElement('button');
        button.className = 'playlist-item';
        button.setAttribute('aria-label', `Play ${track.title} by ${track.artist}`);
        button.textContent = `${index + 1}. ${track.title}`;
        
        if (index === currentTrackIndex) {
            button.classList.add('active');
        }
        
        button.addEventListener('click', () => {
            loadTrack(index);
            play();
        });
        
        playlistScroll.appendChild(button);
    });
}

// Load Track
function loadTrack(index) {
    if (index < 0 || index >= playlist.length) return;
    
    currentTrackIndex = index;
    const track = playlist[index];
    
    audioElement.src = track.audioSrc;
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    albumCover.src = track.coverSrc;
    
    updatePlaylistActive();
    progressFill.style.width = '0%';
    updateTime();
}

// Update Playlist Active
function updatePlaylistActive() {
    const items = playlistScroll.querySelectorAll('.playlist-item');
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
            playBtn.setAttribute('aria-label', 'Pause');
        })
        .catch(error => {
            console.error('Error playing:', error);
            alert('Audio file not found. Add MP3 files to audioplayer/assets/');
        });
}

// Pause
function pause() {
    audioElement.pause();
    isPlaying = false;
    playBtn.setAttribute('aria-label', 'Play');
}

// Toggle Play/Pause
function togglePlayPause() {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

// Previous
function previousTrack() {
    let newIndex = currentTrackIndex - 1;
    if (newIndex < 0) {
        newIndex = playlist.length - 1;
    }
    loadTrack(newIndex);
    if (isPlaying) play();
}

// Next
function nextTrack() {
    let newIndex = currentTrackIndex + 1;
    if (newIndex >= playlist.length) {
        newIndex = 0;
    }
    loadTrack(newIndex);
    if (isPlaying) play();
}

// Update Progress
function updateProgress() {
    if (audioElement.duration) {
        const percent = (audioElement.currentTime / audioElement.duration) * 100;
        progressFill.style.width = percent + '%';
        progressBar.setAttribute('aria-valuenow', Math.round(percent));
    }
}

// Update Time
function updateTime() {
    currentTimeEl.textContent = formatTime(audioElement.currentTime);
    const dur = audioElement.duration && !isNaN(audioElement.duration) 
        ? formatTime(audioElement.duration) 
        : '0:00';
    durationEl.textContent = dur;
}

// Format Time
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
    const percentage = Math.max(0, Math.min(1, clickX / width));
    
    if (audioElement.duration) {
        audioElement.currentTime = percentage * audioElement.duration;
    }
}

// Event Listeners
function addEventListeners() {
    // Open/Close
    if (openPlayerBtn) {
        openPlayerBtn.addEventListener('click', openPlayer);
    }
    closePlayerBtn.addEventListener('click', closePlayer);
    
    // Close on overlay
    playerOverlay.addEventListener('click', (e) => {
        if (e.target === playerOverlay) {
            closePlayer();
        }
    });
    
    // Controls
    playBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', previousTrack);
    nextBtn.addEventListener('click', nextTrack);
    
    // Progress
    progressBar.addEventListener('click', seek);
    
    // Audio events
    audioElement.addEventListener('timeupdate', () => {
        updateProgress();
        updateTime();
    });
    
    audioElement.addEventListener('loadedmetadata', updateTime);
    audioElement.addEventListener('ended', nextTrack);
    
    audioElement.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        pause();
    });
    
    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (playerOverlay.style.display !== 'flex') return;
        if (e.target.tagName === 'BUTTON') return;
        
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

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
