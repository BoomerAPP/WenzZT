// ============================
// WenzZTools - Background Music
// ============================
(function() {
  var MUSIC_PATH = 'music/chill.mp3';
  var STORAGE_KEY = 'wenzz-music';
  
  var audio = null;
  
  function createMusicButton() {
    if (document.getElementById('musicToggle')) return;
    
    var btn = document.createElement('button');
    btn.id = 'musicToggle';
    btn.title = 'Musik On/Off';
    btn.style.cssText = 'position:fixed;bottom:96px;right:16px;width:42px;height:42px;border-radius:50%;background:#1a1a1a;border:1px solid #333;color:#fff;font-size:18px;cursor:pointer;z-index:99;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.4);';
    btn.onclick = toggleMusic;
    document.body.appendChild(btn);
    updateButtonState();
  }
  
  function updateButtonState() {
    var btn = document.getElementById('musicToggle');
    if (!btn) return;
    var musicOn = localStorage.getItem(STORAGE_KEY) !== 'off';
    if (musicOn && audio && !audio.paused) {
      btn.innerHTML = '🎵';
      btn.style.borderColor = '#8b5cf6';
    } else {
      btn.innerHTML = '🔇';
      btn.style.borderColor = '#333';
    }
  }
  
  function toggleMusic() {
    var musicOn = localStorage.getItem(STORAGE_KEY) !== 'off';
    
    if (musicOn) {
      localStorage.setItem(STORAGE_KEY, 'off');
      if (audio) audio.pause();
    } else {
      localStorage.setItem(STORAGE_KEY, 'on');
      if (!audio) {
        audio = new Audio(MUSIC_PATH);
        audio.loop = true;
        audio.volume = 0.3;
      }
      audio.play().catch(function() {});
    }
    updateButtonState();
  }
  
  function startMusic() {
    createMusicButton();
    
    if (localStorage.getItem(STORAGE_KEY) === 'off') return;
    
    audio = new Audio(MUSIC_PATH);
    audio.loop = true;
    audio.volume = 0.3;
    
    audio.play().then(function() {
      updateButtonState();
    }).catch(function() {
      var once = function() {
        audio.play().catch(function() {});
        document.removeEventListener('click', once);
        document.removeEventListener('touchstart', once);
        updateButtonState();
      };
      document.addEventListener('click', once);
      document.addEventListener('touchstart', once);
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startMusic);
  } else {
    startMusic();
  }
})();