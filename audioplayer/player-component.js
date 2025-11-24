/* audioplayer/player-component.js
   Rokko shared audio player component (vanilla JS)
   Usage:
     RokkoPlayer.openPlayer({ artistFolder: 'mp3/SkaRamushVandango', startIndex: 0 })
     OR
     RokkoPlayer.openPlayer({ playlist: [{title, artist, audioSrc, coverSrc}, ...], startIndex: 0 })
*/

(function () {
  const ASSETS = {
    vinyl: 'assets/vinyl.png',
    tonearm: 'assets/tonearm.png',
    avatar: 'assets/avatar.png',
    logoBeatport: 'assets/logo-beatport.png',
    logoSpotify: 'assets/logo-spotify.png',
    logoApple: 'assets/logo-applemusic.png',
    logoSoundcloud: 'assets/logo-soundcloud.png'
  };

  // Player state
  let overlay, container, audioEl, canvas, ctx;
  let playBtn, prevBtn, nextBtn, closeBtn;
  let progressFill, timeCurrent, timeDuration, progressBar;
  let vinylImg, tonearmImg, coverImg, avatarImg;
  let streamButtons;
  let playlist = [];
  let currentIndex = 0;
  let audioCtx, sourceNode, analyser;
  let waveformPeaks = null;
  let rafId = null;
  let spinAnimFrame = null;
  let rotation = 0;
  let spinSpeed = 0; // normalized speed
  let spinTarget = 0.6; // play speed target

  // Soft spin-down params
  const SPIN_DECAY = 0.98;

  // Create DOM once
  function createDOM() {
    overlay = document.createElement('div');
    overlay.className = 'rokko-player-overlay';
    overlay.innerHTML = `
      <div class="rokko-player-wrap" role="dialog" aria-modal="true" aria-label="ROKKO Audio Player">
        <button class="rokko-close" aria-label="Schließen">✕</button>

        <div class="rokko-player">
          <div class="left-column">
            <div class="cover-frame">
              <img class="rokko-cover" src="" alt="Album Cover" />
              <div class="vinyl-wrap">
                <img class="rokko-vinyl" src="${ASSETS.vinyl}" alt="Vinyl" />
                <img class="rokko-tonearm" src="${ASSETS.tonearm}" alt="Tonarm" />
              </div>
            </div>
            <div class="meta">
              <div class="artist" id="rp-artist">Artist Name</div>
              <div class="album" id="rp-album">Album / Track</div>
            </div>
            <div class="avatar-row">
              <img class="rokko-avatar" src="${ASSETS.avatar}" alt="Mascot" />
            </div>
          </div>

          <div class="right-column">
            <canvas class="rokko-waveform" width="800" height="140"></canvas>

            <div class="time-row">
              <span class="time-current">0:00</span>
              <div class="progress-bar" role="slider" tabindex="0" aria-label="Song position">
                <div class="progress-fill" style="width:0%"></div>
              </div>
              <span class="time-duration">0:00</span>
            </div>

            <div class="controls-row">
              <button class="ctrl prev" aria-label="Vorheriger Titel">⏮</button>
              <button class="ctrl play" aria-label="Play">▶</button>
              <button class="ctrl next" aria-label="Nächster Titel">⏭</button>
            </div>

            <div class="stream-buttons">
              <button class="stream-btn" data-url=""> <img src="${ASSETS.logoBeatport}" alt="Beatport" /> </button>
              <button class="stream-btn" data-url=""> <img src="${ASSETS.logoSpotify}" alt="Spotify" /> </button>
              <button class="stream-btn" data-url=""> <img src="${ASSETS.logoApple}" alt="Apple Music" /> </button>
              <button class="stream-btn" data-url=""> <img src="${ASSETS.logoSoundcloud}" alt="SoundCloud" /> </button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    container = overlay.querySelector('.rokko-player-wrap');
    closeBtn = overlay.querySelector('.rokko-close');
    playBtn = overlay.querySelector('.ctrl.play');
    prevBtn = overlay.querySelector('.ctrl.prev');
    nextBtn = overlay.querySelector('.ctrl.next');
    progressFill = overlay.querySelector('.progress-fill');
    progressBar = overlay.querySelector('.progress-bar');
    timeCurrent = overlay.querySelector('.time-current');
    timeDuration = overlay.querySelector('.time-duration');
    vinylImg = overlay.querySelector('.rokko-vinyl');
    tonearmImg = overlay.querySelector('.rokko-tonearm');
    coverImg = overlay.querySelector('.rokko-cover');
    avatarImg = overlay.querySelector('.rokko-avatar');
    canvas = overlay.querySelector('.rokko-waveform');
    ctx = canvas.getContext('2d');
    streamButtons = Array.from(overlay.querySelectorAll('.stream-btn'));

    // audio element
    audioEl = document.createElement('audio');
    audioEl.preload = 'metadata';
    audioEl.crossOrigin = 'anonymous';
    overlay.appendChild(audioEl);

    // events
    closeBtn.addEventListener('click', closePlayer);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePlayer();
    });

    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);

    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      seekToPct(pct);
    });
    progressBar.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') seekBy(-5);
      if (e.key === 'ArrowRight') seekBy(5);
    });

    // stream buttons
    streamButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-url') || '#';
        if (url && url !== '#') window.open(url, '_blank');
      });
    });

    // keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (!overlay || overlay.style.display !== 'flex') return;
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.key === ' ') { e.preventDefault(); togglePlay(); }
      if (e.key === 'Escape') { closePlayer(); }
      if (e.key === 'ArrowLeft') prevTrack();
      if (e.key === 'ArrowRight') nextTrack();
    });

    // audio events
    audioEl.addEventListener('timeupdate', onAudioTime);
    audioEl.addEventListener('loadedmetadata', onLoadedMeta);
    audioEl.addEventListener('ended', nextTrack);
    audioEl.addEventListener('play', onPlay);
    audioEl.addEventListener('pause', onPause);

    // web audio context
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
    } catch (e) {
      audioCtx = null;
      analyser = null;
      console.warn('WebAudio not supported:', e);
    }
  }

  function openOverlay() {
    overlay.style.display = 'flex';
    setTimeout(() => playBtn.focus(), 50);
  }

  function closePlayer() {
    pause();
    overlay.style.display = 'none';
    if (rafId) cancelAnimationFrame(rafId);
    if (spinAnimFrame) cancelAnimationFrame(spinAnimFrame);
    tonearmImg.style.transform = '';
  }

  function loadPlaylistFromOptions(options = {}) {
    return new Promise((resolve) => {
      if (Array.isArray(options.playlist) && options.playlist.length) {
        playlist = options.playlist.map(normalizeTrackObj);
        resolve();
        return;
      }

      if (options.artistFolder) {
        const manifestUrl = `${options.artistFolder.replace(/\/$/, '')}/playlist.json`;
        fetch(manifestUrl).then(r => {
          if (!r.ok) throw new Error('no manifest');
          return r.json();
        }).then(data => {
          if (Array.isArray(data)) {
            playlist = data.map(normalizeTrackObj);
            resolve();
          } else {
            throw new Error('invalid manifest');
          }
        }).catch(() => {
          const tries = [];
          for (let i = 1; i <= 12; i++) {
            const n = String(i).padStart(2, '0');
            tries.push(`${options.artistFolder.replace(/\/$/, '')}/track-${n}.mp3`);
          }
          playlist = tries.map((p, idx) => ({
            title: `Track ${idx + 1}`,
            artist: options.artistName || '',
            audioSrc: p,
            coverSrc: `${options.artistFolder.replace(/\/$/, '')}/cover.jpg`
          }));
          resolve();
        });
        return;
      }

      playlist = [];
      resolve();
    });
  }

  function normalizeTrackObj(t) {
    return {
      title: t.title || t.name || 'Unknown',
      artist: t.artist || t.albumArtist || '',
      audioSrc: t.audioSrc || t.src || t.file || '',
      coverSrc: t.coverSrc || t.cover || t.art || ''
    };
  }

  function openPlayer(options = {}) {
    if (!overlay) createDOM();
    loadPlaylistFromOptions(options).then(() => {
      currentIndex = options.startIndex || 0;
      if (!playlist || playlist.length === 0) {
        console.warn('No tracks in playlist');
      }
      loadTrack(currentIndex).then(() => {
        openOverlay();
      });
    });
  }

  async function loadTrack(idx) {
    const t = playlist[idx];
    if (!t) return;
    container.querySelector('#rp-artist').textContent = t.artist || '';
    container.querySelector('#rp-album').textContent = t.title || '';
    coverImg.src = t.coverSrc || '';
    audioEl.src = t.audioSrc;
    audioEl.load();

    if (audioCtx) {
      try {
        const resp = await fetch(t.audioSrc, { mode: 'cors' });
        if (!resp.ok) throw new Error('failed fetch audio for waveform');
        const ab = await resp.arrayBuffer();
        const decoded = await audioCtx.decodeAudioData(ab.slice(0));
        waveformPeaks = computePeaks(decoded, canvas.width);
        drawWaveform();
      } catch (err) {
        console.warn('Waveform generation failed', err);
        waveformPeaks = null;
        clearCanvas();
      }
    } else {
      waveformPeaks = null;
      clearCanvas();
    }
  }

  function computePeaks(audioBuffer, width) {
    const raw = audioBuffer.getChannelData(0);
    const blockSize = Math.floor(raw.length / width);
    const peaks = new Float32Array(width);
    for (let i = 0; i < width; i++) {
      let start = i * blockSize;
      let end = start + blockSize;
      let max = 0;
      for (let j = start; j < end; j++) {
        const v = Math.abs(raw[j]);
        if (v > max) max = v;
      }
      peaks[i] = max;
    }
    return peaks;
  }

  function drawWaveform(progressPct = 0) {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(0, 0, w, h);

    if (!waveformPeaks) {
      ctx.fillStyle = 'rgba(215,112,20,0.12)';
      ctx.fillRect(0, h / 3, w, h / 3);
      return;
    }

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(228,199,154,0.45)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x++) {
      const p = waveformPeaks[x];
      const y = (p * (h / 2));
      ctx.moveTo(x, (h / 2) - y);
      ctx.lineTo(x, (h / 2) + y);
    }
    ctx.stroke();

    const activeW = Math.floor(w * progressPct);
    ctx.fillStyle = '#d77014';
    ctx.globalCompositeOperation = 'source-over';
    for (let x = 0; x < activeW; x++) {
      const p = waveformPeaks[x];
      const y = (p * (h / 2));
      ctx.fillRect(x, (h / 2) - y, 1, y * 2);
    }
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function onLoadedMeta() {
    timeDuration.textContent = formatTime(audioEl.duration);
  }

  function onAudioTime() {
    const pct = audioEl.duration ? (audioEl.currentTime / audioEl.duration) : 0;
    progressFill.style.width = (pct * 100) + '%';
    timeCurrent.textContent = formatTime(audioEl.currentTime);
    drawWaveform(pct);
  }

  function formatTime(s) {
    if (!s || !isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  function seekToPct(pct) {
    if (!audioEl.duration) return;
    audioEl.currentTime = pct * audioEl.duration;
    onAudioTime();
  }

  function seekBy(seconds) {
    if (!audioEl.duration) return;
    audioEl.currentTime = Math.max(0, Math.min(audioEl.duration, audioEl.currentTime + seconds));
  }

  function togglePlay() {
    if (audioEl.paused) audioEl.play();
    else audioEl.pause();
  }

  function prevTrack() {
    if (!playlist || !playlist.length) return;
    currentIndex = Math.max(0, currentIndex - 1);
    loadTrack(currentIndex).then(() => { audioEl.play(); });
  }

  function nextTrack() {
    if (!playlist || !playlist.length) return;
    currentIndex = Math.min(playlist.length - 1, currentIndex + 1);
    loadTrack(currentIndex).then(() => { audioEl.play(); });
  }

  function animateSpin() {
    function step() {
      rotation += spinSpeed * 360 / 60;
      vinylImg.style.transform = `rotate(${rotation}deg)`;
      spinAnimFrame = requestAnimationFrame(step);
    }
    if (!spinAnimFrame) spinAnimFrame = requestAnimationFrame(step);
  }

  function startSpinning() {
    spinSpeed = spinTarget;
    if (!spinAnimFrame) animateSpin();
  }

  function softStopSpinning() {
    function decay() {
      spinSpeed *= SPIN_DECAY;
      if (spinSpeed < 0.002) {
        spinSpeed = 0;
        if (spinAnimFrame) cancelAnimationFrame(spinAnimFrame);
        spinAnimFrame = null;
        return;
      }
      spinAnimFrame = requestAnimationFrame(decay);
    }
    if (spinAnimFrame) requestAnimationFrame(decay);
  }

  function onPlay() {
    playBtn.textContent = '❚❚';
    tonearmImg.style.transformOrigin = 'left center';
    tonearmImg.style.transition = 'transform 0.6s ease';
    tonearmImg.style.transform = 'rotate(-15deg)';
    startSpinning();
    if (audioCtx && !sourceNode) {
      try {
        sourceNode = audioCtx.createMediaElementSource(audioEl);
        sourceNode.connect(analyser);
        analyser.connect(audioCtx.destination);
      } catch (e) {}
    }
    if (!rafId) {
      const frame = () => {
        onAudioTime();
        rafId = requestAnimationFrame(frame);
      };
      rafId = requestAnimationFrame(frame);
    }
  }

  function onPause() {
    playBtn.textContent = '▶';
    tonearmImg.style.transform = '';
    softStopSpinning();
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  // expose API
  window.RokkoPlayer = {
    openPlayer,
    closePlayer,
    preloadAssets: function (map) {
      Object.assign(ASSETS, map || {});
    }
  };

  createDOM();

})();