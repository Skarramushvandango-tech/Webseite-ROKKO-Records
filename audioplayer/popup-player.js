// ROKKO Records Popup Audio Player
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
const playerOverlay = document.getElementById('playerOverlay');
const openPlayerBtn = document.getElementById('openPlayerBtn');
const closePlayerBtn = document.getElementById('closePlayerBtn');
const audioElement = document.getElementById('audioElement');
const playStopBtn = document.getElementById('playStopBtn');
const playIcon = document.getElementById('playIcon');
const stopIcon = document.getElementById('stopIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const coverArt = document.getElementById('coverArt');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const volumeSlider = document.getElementById('volumeSlider');
const muteBtn = document.getElementById('muteBtn');
const soundIcon = document.getElementById('soundIcon');
const muteIcon = document.getElementById('muteIcon');
const playlistToggle = document.getElementById('playlistToggle');
const playlistPanel = document.getElementById('playlistPanel');
const playlistEl = document.getElementById('playlist');

// Player State
let currentTrackIndex = 0;
let isPlaying = false;
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

// Open/Close Player Overlay
function openPlayer() {
    playerOverlay.style.display = 'flex';
    playerOverlay.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closePlayer() {
    playerOverlay.style.display = 'none';
    playerOverlay.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
    pause(); // Stop playback when closing
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
        });
        
        li.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                loadTrack(index);
                play();
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
    
    // Update cover art
    coverArt.style.display = 'block';
    coverArt.src = track.coverSrc;
    coverArt.onerror = () => {
        coverArt.style.display = 'none';
    };
    
    // Update playlist active state
    updatePlaylistActiveState();
    
    // Reset progress
    progressBar.value = 0;
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
            stopIcon.style.display = 'block';
            playStopBtn.setAttribute('aria-label', 'Stop');
        })
        .catch(error => {
            console.error('Error playing audio:', error);
            alert('Fehler beim Laden der Audiodatei. Bitte stellen Sie sicher, dass die Datei existiert: ' + playlist[currentTrackIndex].audioSrc);
        });
}

// Pause
function pause() {
    audioElement.pause();
    isPlaying = false;
    playIcon.style.display = 'block';
    stopIcon.style.display = 'none';
    playStopBtn.setAttribute('aria-label', 'Play');
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
        progressBar.value = progressPercent;
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
function seek() {
    if (audioElement.duration) {
        const seekTime = (progressBar.value / 100) * audioElement.duration;
        audioElement.currentTime = seekTime;
    }
}

// Toggle Playlist
function togglePlaylist() {
    const isShown = playlistPanel.style.display === 'block';
    if (isShown) {
        playlistPanel.style.display = 'none';
        playlistPanel.classList.remove('show');
        playlistToggle.setAttribute('aria-expanded', 'false');
        playlistPanel.setAttribute('aria-hidden', 'true');
    } else {
        playlistPanel.style.display = 'block';
        playlistPanel.classList.add('show');
        playlistToggle.setAttribute('aria-expanded', 'true');
        playlistPanel.setAttribute('aria-hidden', 'false');
    }
}

// Toggle Mute
function toggleMute() {
    if (audioElement.volume > 0) {
        lastVolume = audioElement.volume;
        audioElement.volume = 0;
        volumeSlider.value = 0;
        soundIcon.style.display = 'none';
        muteIcon.style.display = 'block';
        muteBtn.setAttribute('aria-label', 'Ton an');
    } else {
        audioElement.volume = lastVolume;
        volumeSlider.value = lastVolume * 100;
        soundIcon.style.display = 'block';
        muteIcon.style.display = 'none';
        muteBtn.setAttribute('aria-label', 'Stummschalten');
    }
}

// Update Volume
function updateVolume() {
    const volume = volumeSlider.value / 100;
    audioElement.volume = volume;
    
    if (volume > 0) {
        lastVolume = volume;
        soundIcon.style.display = 'block';
        muteIcon.style.display = 'none';
        muteBtn.setAttribute('aria-label', 'Stummschalten');
    } else {
        soundIcon.style.display = 'none';
        muteIcon.style.display = 'block';
        muteBtn.setAttribute('aria-label', 'Ton an');
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
    playStopBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', previousTrack);
    nextBtn.addEventListener('click', nextTrack);
    
    // Progress bar
    progressBar.addEventListener('input', seek);
    
    // Volume controls
    volumeSlider.addEventListener('input', updateVolume);
    muteBtn.addEventListener('click', toggleMute);
    
    // Playlist toggle
    playlistToggle.addEventListener('click', togglePlaylist);
    
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
        alert('Fehler beim Laden der Audiodatei: ' + playlist[currentTrackIndex].audioSrc + 
              '\n\nBitte stellen Sie sicher, dass die MP3-Dateien im audioplayer/assets/ Verzeichnis vorhanden sind.');
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT') return;
        
        // Only when player is open
        if (playerOverlay.style.display !== 'flex') return;
        
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
