// Audio Player JavaScript
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const progressHandle = document.getElementById('progress-handle');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const songTitleEl = document.getElementById('song-title');
const artistNameEl = document.getElementById('artist-name');
const albumCoverEl = document.getElementById('album-cover');
const tracklistEl = document.getElementById('tracklist');
const waveformCanvas = document.getElementById('waveform-canvas');

// Track data - All songs from mp3/vandango folder
const tracks = [
    {
        title: 'Set the Fire',
        artist: 'SkaRamush Vandango',
        src: '../mp3/vandango/set_the_fire.m4a',
        cover: '../mp3/vandango/cover.png'
    },
    {
        title: 'Set the Fire (Remix)',
        artist: 'SkaRamush Vandango',
        src: '../mp3/vandango/set_the_fire_remix.m4a',
        cover: '../mp3/vandango/cover.png'
    },
    {
        title: 'Always Sunny',
        artist: 'SkaRamush Vandango',
        src: '../mp3/vandango/always_sunny.m4a',
        cover: '../mp3/vandango/cover.png'
    },
    {
        title: 'Borrowed Time',
        artist: 'SkaRamush Vandango',
        src: '../mp3/vandango/borrowed_time.m4a',
        cover: '../mp3/vandango/cover.png'
    },
    {
        title: 'Like Water',
        artist: 'SkaRamush Vandango',
        src: '../mp3/vandango/like_water.m4a',
        cover: '../mp3/vandango/cover.png'
    },
    {
        title: 'Love Song',
        artist: 'SkaRamush Vandango',
        src: '../mp3/vandango/love_song.m4a',
        cover: '../mp3/vandango/cover.png'
    },
    {
        title: 'Man on a Mission',
        artist: 'SkaRamush Vandango',
        src: '../mp3/vandango/man_on_a_mission.m4a',
        cover: '../mp3/vandango/cover.png'
    },
    {
        title: 'Nights Go By',
        artist: 'SkaRamush Vandango',
        src: '../mp3/vandango/nights_go_by.m4a',
        cover: '../mp3/vandango/cover.png'
    },
    {
        title: 'No Stitch No Story',
        artist: 'SkaRamush Vandango',
        src: '../mp3/vandango/no_stitch_no_story.m4a',
        cover: '../mp3/vandango/cover.png'
    },
    {
        title: 'Oh I Try',
        artist: 'SkaRamush Vandango',
        src: '../mp3/vandango/oh_i_try.m4a',
        cover: '../mp3/vandango/cover.png'
    },
    {
        title: 'System Failure (Kortana Mix)',
        artist: 'SkaRamush Vandango',
        src: '../mp3/vandango/system_failure_kortana_mix.m4a',
        cover: '../mp3/vandango/cover.png'
    },
    {
        title: 'Tiptoes',
        artist: 'SkaRamush Vandango',
        src: '../mp3/vandango/tiptoes.m4a',
        cover: '../mp3/vandango/cover.png'
    },
    {
        title: 'What You Need',
        artist: 'SkaRamush Vandango',
        src: '../mp3/vandango/what_you_need.m4a',
        cover: '../mp3/vandango/cover.png'
    },
    {
        title: 'Among the Crowd',
        artist: 'SkaRamush Vandango',
        src: '../mp3/vandango/among_the_crowd.m4a',
        cover: '../mp3/vandango/cover.png'
    }
];

let currentTrackIndex = 0;
let isPlaying = false;

// Initialize player
function init() {
    loadTrack(currentTrackIndex);
    renderTracklist();
    setupWaveform();
}

// Load track
function loadTrack(index) {
    const track = tracks[index];
    audioPlayer.src = track.src;
    songTitleEl.textContent = track.title;
    artistNameEl.textContent = track.artist;
    albumCoverEl.src = track.cover;
    
    // Update tracklist active state
    updateTracklistActive();
}

// Render tracklist
function renderTracklist() {
    tracklistEl.innerHTML = '';
    tracks.forEach((track, index) => {
        const trackItem = document.createElement('div');
        trackItem.className = 'track-item';
        if (index === currentTrackIndex) {
            trackItem.classList.add('active');
        }
        
        trackItem.innerHTML = `
            <span class="track-number">${index + 1}.</span>
            <span class="track-name">${track.title}</span>
        `;
        
        trackItem.addEventListener('click', () => {
            currentTrackIndex = index;
            loadTrack(index);
            play();
        });
        
        tracklistEl.appendChild(trackItem);
    });
}

// Update tracklist active state
function updateTracklistActive() {
    const trackItems = document.querySelectorAll('.track-item');
    trackItems.forEach((item, index) => {
        if (index === currentTrackIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Play
function play() {
    audioPlayer.play()
        .then(() => {
            isPlaying = true;
        })
        .catch(error => {
            console.log('Playback failed:', error);
            isPlaying = false;
        });
}

// Pause
function pause() {
    audioPlayer.pause();
    isPlaying = false;
}

// Toggle play/pause
function togglePlay() {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

// Previous track
function prevTrack() {
    currentTrackIndex--;
    if (currentTrackIndex < 0) {
        currentTrackIndex = tracks.length - 1;
    }
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        play();
    }
}

// Next track
function nextTrack() {
    currentTrackIndex++;
    if (currentTrackIndex >= tracks.length) {
        currentTrackIndex = 0;
    }
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        play();
    }
}

// Format time
function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) {
        return '0:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update progress
function updateProgress() {
    if (!audioPlayer.duration || isNaN(audioPlayer.duration) || audioPlayer.duration === 0) {
        return;
    }
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
    progressHandle.style.left = `${progress}%`;
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
}

// Setup waveform visualization
function setupWaveform() {
    const ctx = waveformCanvas.getContext('2d');
    waveformCanvas.width = waveformCanvas.offsetWidth;
    waveformCanvas.height = waveformCanvas.offsetHeight;
    
    // Draw static waveform pattern
    const barCount = 60;
    const barWidth = waveformCanvas.width / barCount;
    
    ctx.fillStyle = '#E0C290';
    for (let i = 0; i < barCount; i++) {
        const barHeight = Math.random() * waveformCanvas.height * 0.8;
        const x = i * barWidth;
        const y = (waveformCanvas.height - barHeight) / 2;
        ctx.fillRect(x, y, barWidth - 2, barHeight);
    }
}

// Event listeners
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);

audioPlayer.addEventListener('timeupdate', updateProgress);

audioPlayer.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener('ended', () => {
    nextTrack();
});

// Progress bar click
const progressContainer = document.querySelector('.progress-bar-bg');
if (progressContainer) {
    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        audioPlayer.currentTime = percentage * audioPlayer.duration;
    });
}

// Initialize on load
init();
