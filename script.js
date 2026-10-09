/* ============================
   WenzZTools - Script
   ============================ */

// ============================
// THEME
// ============================
const themes = ['', 'theme-purple', 'theme-blue', 'theme-green', 'theme-red'];

function toggleTheme() {
  const body = document.body;
  let current = '';
  themes.forEach(t => {
    if (t && body.classList.contains(t)) current = t;
  });
  
  const idx = themes.indexOf(current);
  const next = themes[(idx + 1) % themes.length];
  
  themes.forEach(t => { if (t) body.classList.remove(t); });
  if (next) body.classList.add(next);
  
  localStorage.setItem('wenzz-theme', next);
  showToast('Tema: ' + (next || 'Hitam'));
}

function loadTheme() {
  const saved = localStorage.getItem('wenzz-theme') || '';
  // Hapus semua theme class dulu
  themes.forEach(t => { if (t) document.body.classList.remove(t); });
  // Apply yang tersimpan
  if (saved) document.body.classList.add(saved);
}

// ============================
// TOAST
// ============================
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

// ============================
// SEARCH / FILTER
// ============================
function filterTools(query) {
  const q = query.toLowerCase().trim();
  const cards = document.querySelectorAll('.tool-card');
  const empty = document.getElementById('emptyMsg');
  let visible = 0;

  cards.forEach(card => {
    const name = (card.dataset.name || '').toLowerCase();
    const text = card.textContent.toLowerCase();
    const match = !q || name.includes(q) || text.includes(q);
    card.style.display = match ? '' : 'none';
    if (match) visible++;
  });

  if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
}

// ============================
// NAV ACTIVE
// ============================
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    const href = btn.getAttribute('href') || '';
    if (href.includes(path) || (path === 'index.html' && href === 'index.html')) {
      btn.classList.add('active');
    }
  });
}

// ============================
// QUICK MENU
// ============================
function showQuickMenu() {
  const menu = document.getElementById('quickMenu');
  if (menu) menu.style.display = 'flex';
}

function closeQuickMenu() {
  const menu = document.getElementById('quickMenu');
  if (menu) menu.style.display = 'none';
}

// Tutup modal kalau klik di overlay
document.addEventListener('click', function(e) {
  const menu = document.getElementById('quickMenu');
  if (menu && menu.style.display === 'flex' && e.target === menu) {
    menu.style.display = 'none';
  }
});

// ============================
// FAVORIT
// ============================
function toggleFavorit(el) {
  const favs = JSON.parse(localStorage.getItem('wenzz-fav') || '[]');
  showToast('Favorit (' + favs.length + ' tersimpan)');
  // placeholder
}

// ============================
// RIWAYAT
// ============================
function showHistory() {
  const hist = JSON.parse(localStorage.getItem('wenzz-history') || '[]');
  if (hist.length === 0) {
    showToast('Riwayat kosong');
  } else {
    showToast('Riwayat: ' + hist.length + ' aktivitas');
  }
}

// ============================
// SETTINGS
// ============================
function showSettings() {
  showToast('Ketuk icon matahari untuk ganti tema');
}

// ============================
// RECORD HISTORY (dipanggil tiap buka tool)
// ============================
function recordHistory(toolName) {
  const hist = JSON.parse(localStorage.getItem('wenzz-history') || '[]');
  hist.unshift({ name: toolName, time: Date.now() });
  localStorage.setItem('wenzz-history', JSON.stringify(hist.slice(0, 50)));
}

// ============================
// ADMIN CODE
// ============================
function askAdminCode() {
  const code = prompt('🔐 Masukkan kode akses admin:');
  if (code === '9989') {
    window.location.href = 'admin.html';
  } else if (code !== null) {
    showToast('❌ Kode akses salah!');
  }
}
// ============================
// INIT
// ============================
document.addEventListener('DOMContentLoaded', function() {
  loadTheme();
  setActiveNav();

  // Catat klik tool ke riwayat
  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.querySelector('.tool-name')?.textContent || 'Tool';
      recordHistory(name);
    });
  });
});

  resize();
  window.addEventListener('resize', resize);

  function getAccent() {
    const styles = getComputedStyle(document.body);
    return styles.getPropertyValue('--accent').trim() || '#ffffff';
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const accent = getAccent();

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.6;
      ctx.fill();
    });

    // Garis penghubung
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = accent;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
})();
// ============================
// STARFIELD BACKGROUND
// ============================
(function() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let stars = [];
  const starCount = 80;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 3 + 0.5,
      size: Math.random() * 1.5 + 0.3
    });
  }

  function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const styles = getComputedStyle(document.body);
    const accent = styles.getPropertyValue('--accent').trim() || '#ffffff';

    stars.forEach(s => {
      s.y += s.z * 0.3;
      if (s.y > canvas.height) {
        s.y = 0;
        s.x = Math.random() * canvas.width;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.7;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }
  animate();
})();
// ============================
// USER PROFILE DATA
// ============================
(function() {
  // 1. USERNAME dari localStorage (bisa di-edit di halaman Profil)
  const savedName = localStorage.getItem('wenzz-username') || 'WenzZDev';
  const nameEl = document.getElementById('userName');
  const avatarEl = document.getElementById('userAvatar');
  if (nameEl) nameEl.textContent = savedName;
  if (avatarEl) avatarEl.textContent = savedName.charAt(0).toUpperCase();

  // 2. PERANGKAT — auto-detect
  const deviceEl = document.getElementById('userDevice');
  if (deviceEl) {
    const ua = navigator.userAgent;
    let device = 'Unknown';
    
    if (/Android/i.test(ua)) device = 'Android';
    else if (/iPhone|iPad|iPod/i.test(ua)) device = 'iPhone';
    else if (/Windows/i.test(ua)) device = 'Windows';
    else if (/Mac/i.test(ua)) device = 'MacOS';
    else if (/Linux/i.test(ua)) device = 'Linux';
    
    deviceEl.textContent = device;
  }

  // 3. BATERAI — pakai Battery API (works di Chrome HP)
  const batteryEl = document.getElementById('userBattery');
  if (batteryEl) {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        function updateBattery() {
          const level = Math.round(battery.level * 100);
          const charging = battery.charging;
          batteryEl.textContent = level + '%' + (charging ? ' ⚡' : '');
          
          // Warna: merah kalau <20%, kuning <50%, hijau >50%
          if (level < 20) batteryEl.style.color = '#ef4444';
          else if (level < 50) batteryEl.style.color = '#f59e0b';
          else batteryEl.style.color = '#10b981';
        }
        
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      }).catch(() => {
        batteryEl.textContent = 'N/A';
      });
    } else {
      batteryEl.textContent = 'N/A';
    }
  }
})();