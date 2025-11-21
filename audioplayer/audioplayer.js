/* Simple player: Playlist, Play/Pause, Prev/Next, Seek, Time update */
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const seek = document.getElementById('seek');
const currentEl = document.getElementById('current');
const durationEl = document.getElementById('duration');
const listEl = document.getElementById('list');
const cover = document.getElementById('cover');

/* Beispiel-Playlist: bitte Pfade auf eure Dateien anpassen */
const playlist = [
  { title: 'Track One', src: 'assets/track1.mp3', cover: 'assets/cover-placeholder.jpg' },
  { title: 'Track Two', src: 'assets/track2.mp3', cover: 'assets/cover2.jpg' },
  { title: 'Track Three', src: 'assets/track3.mp3', cover: 'assets/cover3.jpg' }
];

let idx = 0;
let isPlaying = false;

function loadTrack(i){
  const t = playlist[i];
  audio.src = t.src;
  cover.src = t.cover || 'assets/cover-placeholder.jpg';
  document.querySelectorAll('#list li').forEach((el)=>el.classList.remove('active'));
  const active = document.querySelector(`#list li[data-i="${i}"]`);
  if(active) active.classList.add('active');
}

function renderPlaylist(){
  listEl.innerHTML = '';
  playlist.forEach((t,i)=>{
    const li = document.createElement('li');
    li.textContent = `${i+1}. ${t.title}`;
    li.setAttribute('data-i', i);
    li.addEventListener('click', ()=>{ idx = i; loadTrack(idx); play(); });
    listEl.appendChild(li);
  });
}

function play(){
  audio.play();
  isPlaying = true;
  playBtn.textContent = '❚❚';
}
function pause(){
  audio.pause();
  isPlaying = false;
  playBtn.textContent = '▶';
}

playBtn.addEventListener('click', ()=>{
  if(!audio.src) loadTrack(idx);
  if(isPlaying) pause(); else play();
});
prevBtn.addEventListener('click', ()=>{ idx = (idx-1+playlist.length) % playlist.length; loadTrack(idx); play(); });
nextBtn.addEventListener('click', ()=>{ idx = (idx+1) % playlist.length; loadTrack(idx); play(); });

audio.addEventListener('loadedmetadata', ()=>{
  seek.max = audio.duration;
  durationEl.textContent = formatTime(audio.duration);
});
audio.addEventListener('timeupdate', ()=>{
  seek.value = audio.currentTime;
  currentEl.textContent = formatTime(audio.currentTime);
});
seek.addEventListener('input', ()=>{ audio.currentTime = seek.value; });

audio.addEventListener('ended', ()=>{ nextBtn.click(); });

function formatTime(sec){
  if(!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec/60);
  const s = Math.floor(sec%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

/* init */
renderPlaylist();
loadTrack(idx);
