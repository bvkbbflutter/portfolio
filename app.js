'use strict';

/* ============================================================
   CONFIG
   ============================================================ */
const THEMES = [
  { id:'midnight', name:'Midnight', bg:'#060b18', accent:'#6382ff' },
  { id:'aurora',   name:'Aurora',   bg:'#03100d', accent:'#10d9a0' },
  { id:'obsidian', name:'Obsidian', bg:'#0a0a0a', accent:'#f59e0b' },
  { id:'crimson',  name:'Crimson',  bg:'#0c0408', accent:'#f43f5e' },
  { id:'nebula',   name:'Nebula',   bg:'#06030f', accent:'#a855f7' },
  { id:'arctic',   name:'Arctic',   bg:'#eef6ff', accent:'#0ea5e9' },
  { id:'sakura',   name:'Sakura',   bg:'#fff0f5', accent:'#ec4899' },
  { id:'forest',   name:'Forest',   bg:'#040d08', accent:'#22c55e' },
  { id:'ember',    name:'Ember',    bg:'#0e0600', accent:'#f97316' },
  { id:'slate',    name:'Slate',    bg:'#f7f8fa', accent:'#6366f1' },
];

const FONTS = [
  { id:'grotesk', name:'Space Grotesk',   preview:'Modern & Geometric' },
  { id:'syne',    name:'Syne',            preview:'Bold & Editorial' },
  { id:'outfit',  name:'Outfit',          preview:'Clean & Versatile' },
  { id:'jakarta', name:'Plus Jakarta',    preview:'Professional' },
  { id:'raleway', name:'Raleway',         preview:'Elegant & Thin' },
  { id:'nunito',  name:'Nunito',          preview:'Friendly & Round' },
  { id:'manrope', name:'Manrope',         preview:'Sharp & Technical' },
  { id:'oxanium', name:'Oxanium',         preview:'Futuristic & Sci-fi' },
  { id:'mono',    name:'JetBrains Mono',  preview:'Hacker & Code' },
  { id:'dm',      name:'DM Sans',         preview:'Simple & Neutral' },
];

const SKILLS = [
  { icon:'📱', name:'Flutter / Dart',       level:95 },
  { icon:'🔥', name:'Firebase Suite',        level:90 },
  { icon:'⚡', name:'Riverpod / State Mgmt', level:88 },
  { icon:'🗺️', name:'GoRouter',              level:85 },
  { icon:'🗄️', name:'Hive / Local DB',       level:84 },
  { icon:'🤖', name:'Kotlin (Android)',       level:78 },
  { icon:'🌐', name:'REST API / HTTP',        level:88 },
  { icon:'🔺', name:'Angular',               level:76 },
  { icon:'☁️', name:'Node.js / Express',     level:74 },
  { icon:'🎨', name:'UI/UX Design',          level:82 },
  { icon:'📡', name:'WebRTC',               level:72 },
  { icon:'🔧', name:'Git & CI/CD',           level:84 },
];

const TYPEWRITER_TEXTS = [
  'Flutter Developer',
  'Firebase Expert',
  'Mobile Engineer',
  'Full-Stack Builder',
  'UI/UX Enthusiast',
  'Open Source Contributor',
];

const CATEGORY_EMOJIS = { flutter:'📱', angular:'🔺', 'web-apps':'🌐', 'social-links':'🔗' };
const CATEGORY_COLORS  = { flutter:'#38bdf8', angular:'#f43f5e', 'web-apps':'#22c55e', 'social-links':'#a855f7' };

/* ============================================================
   STATE
   ============================================================ */
let portfolioData = null;
let activeFilter  = 'all';
let currentTheme  = localStorage.getItem('pf-theme') || 'midnight';
let currentFont   = localStorage.getItem('pf-font')  || 'grotesk';
let currentCardH  = parseInt(localStorage.getItem('pf-card-h') || '440');
let settingsOpen  = false;

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', async () => {
  applyTheme(currentTheme, false);
  applyFont(currentFont, false);
  applyCardHeight(currentCardH, false);

  buildThemeGrid();
  buildFontList();
  buildSkills();
  setupSettings();
  setupNav();
  setupCursorGlow();
  setupScrollReveal();
  setupModal();
  startTypewriter();
  startCounters();
  initParticles();

  document.getElementById('currentYear').textContent = new Date().getFullYear();
  document.getElementById('cardHeightSlider').value = currentCardH;
  document.getElementById('cardHeightVal').textContent = currentCardH + 'px';

  // Page load fade-out
  setTimeout(() => {
    const loader = document.getElementById('pageLoader');
    loader.classList.add('done');
    setTimeout(() => loader.remove(), 700);
  }, 800);

  // Load data.json
  try {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('fetch failed');
    portfolioData = await res.json();
    renderProfile();
    renderFilters();
    renderProjects();
    renderContactCards();
    renderFooterSocial();
    setupFiltering();
    setupScrollReveal();
    setup3DTilt();
  } catch (err) {
    console.error('Could not load data.json:', err);
  }
});

/* ============================================================
   PAGE LOAD OVERLAY — already handled in CSS + above timeout
   ============================================================ */

/* ============================================================
   PARTICLES
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouseX = -999, mouseY = -999;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  function getAccentColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--particle').trim() || '#6382ff';
  }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x    = Math.random() * W;
      this.y    = initial ? Math.random() * H : H + 10;
      this.size = Math.random() * 1.8 + 0.4;
      this.vx   = (Math.random() - 0.5) * 0.3;
      this.vy   = -(Math.random() * 0.6 + 0.2);
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
      this.color = getAccentColor();
    }
    update() {
      this.life++;
      const dist = Math.hypot(this.x - mouseX, this.y - mouseY);
      if (dist < 120) {
        const angle = Math.atan2(this.y - mouseY, this.x - mouseX);
        const force = (120 - dist) / 120 * 0.4;
        this.vx += Math.cos(angle) * force;
        this.vy += Math.sin(angle) * force;
      }
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.x += this.vx;
      this.y += this.vy;
      if (this.life > this.maxLife || this.y < -10 || this.x < -10 || this.x > W + 10) this.reset();
    }
    draw() {
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.55;
      try {
        const rgb = hexToRgb(this.color);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${alpha})`;
        ctx.fill();
      } catch(e) {}
    }
  }

  const count = window.innerWidth < 768 ? 40 : 90;
  for (let i = 0; i < count; i++) particles.push(new Particle());

  // Connection lines between nearby particles
  function drawConnections() {
    const accentColor = getAccentColor();
    let rgb = '99,130,255';
    try { rgb = hexToRgb(accentColor); } catch(e) {}
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${rgb},${(1 - dist/100) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ============================================================
   TYPEWRITER EFFECT
   ============================================================ */
function startTypewriter() {
  const el = document.getElementById('heroSubtitle');
  if (!el) return;
  let tIdx = 0, cIdx = 0, deleting = false;

  // Insert cursor span
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  el.after(cursor);

  function tick() {
    const current = TYPEWRITER_TEXTS[tIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length) { deleting = true; setTimeout(tick, 2000); return; }
      setTimeout(tick, 65);
    } else {
      el.textContent = current.slice(0, --cIdx);
      if (cIdx === 0) { deleting = false; tIdx = (tIdx + 1) % TYPEWRITER_TEXTS.length; setTimeout(tick, 400); return; }
      setTimeout(tick, 35);
    }
  }
  setTimeout(tick, 1200);
}

/* ============================================================
   COUNTER ANIMATIONS
   ============================================================ */
function startCounters() {
  const nums = document.querySelectorAll('.stat-num[data-count]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      const target = parseInt(entry.target.dataset.count);
      const suffix = entry.target.dataset.suffix || '+';
      let current = 0;
      const step = Math.ceil(target / 40);
      const interval = setInterval(() => {
        current = Math.min(current + step, target);
        entry.target.textContent = current + (current === target ? suffix : '');
        if (current >= target) clearInterval(interval);
      }, 35);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => io.observe(n));
}

/* ============================================================
   CURSOR GLOW (smooth lag follow)
   ============================================================ */
function setupCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  let mx = 0, my = 0, gx = 0, gy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mouseleave', () => glow.style.opacity = '0');
  document.addEventListener('mouseenter', () => glow.style.opacity = '0.4');
  (function frame() {
    gx += (mx - gx) * 0.09;
    gy += (my - gy) * 0.09;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(frame);
  })();
}

/* ============================================================
   3D CARD TILT (magnetic perspective effect)
   ============================================================ */
function setup3DTilt() {
  document.querySelectorAll('.project-card').forEach(card => {
    // Add shine div
    const shine = document.createElement('div');
    shine.className = 'card-shine';
    card.appendChild(shine);

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      const rotX = -dy * 8;
      const rotY =  dx * 8;

      // Shine position
      const mx = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const my = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      shine.style.background = `radial-gradient(circle at ${mx}% ${my}%, rgba(255,255,255,0.07) 0%, transparent 60%)`;

      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px) scale(1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
      shine.style.background = 'none';
    });
  });
}

/* ============================================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
function setupScrollReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      // Trigger skill bars
      if (entry.target.classList.contains('skills-grid') || entry.target.classList.contains('stagger-children')) {
        entry.target.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
          setTimeout(() => { bar.style.width = bar.dataset.level + '%'; }, i * 70 + 200);
        });
      }
    });
  }, { threshold: 0.08, rootMargin:'0px 0px -30px 0px' });

  document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.stagger-children,.project-card').forEach(el => io.observe(el));
}

/* ============================================================
   NAV scroll effect + hamburger
   ============================================================ */
function setupNav() {
  const nav       = document.getElementById('mainNav');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  let navOpen = false;

  // Scroll shadow
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  hamburger.addEventListener('click', () => {
    navOpen = !navOpen;
    hamburger.classList.toggle('open', navOpen);
    mobileNav.classList.toggle('open', navOpen);
  });
  document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', () => {
    navOpen = false; hamburger.classList.remove('open'); mobileNav.classList.remove('open');
  }));

  // Smooth scroll
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth' }); }
  });
}

/* ============================================================
   THEME
   ============================================================ */
function applyTheme(id, save = true) {
  currentTheme = id;
  document.documentElement.setAttribute('data-theme', id);
  if (save) localStorage.setItem('pf-theme', id);
  document.querySelectorAll('.theme-swatch').forEach(s => s.classList.toggle('active', s.dataset.theme === id));
  // Restart particles to pick up new accent colour
}

function buildThemeGrid() {
  const grid = document.getElementById('themeGrid');
  THEMES.forEach(t => {
    const el = document.createElement('div');
    el.className = 'theme-swatch' + (t.id === currentTheme ? ' active' : '');
    el.dataset.theme = t.id;
    el.innerHTML = `
      <div class="swatch-circle" style="background:linear-gradient(135deg,${t.bg} 50%,${t.accent} 50%)"></div>
      <span class="swatch-name">${t.name}</span>`;
    el.addEventListener('click', () => applyTheme(t.id));
    grid.appendChild(el);
  });
}

/* ============================================================
   FONT
   ============================================================ */
function applyFont(id, save = true) {
  currentFont = id;
  document.documentElement.setAttribute('data-font', id);
  if (save) localStorage.setItem('pf-font', id);
  document.querySelectorAll('.font-item').forEach(f => f.classList.toggle('active', f.dataset.font === id));
}

function buildFontList() {
  const list = document.getElementById('fontList');
  FONTS.forEach(f => {
    const el = document.createElement('div');
    el.className = 'font-item' + (f.id === currentFont ? ' active' : '');
    el.dataset.font = f.id;
    el.innerHTML = `
      <div>
        <div class="font-item-name" style="font-family:'${f.name}',sans-serif">${f.name}</div>
        <div class="font-item-preview">${f.preview}</div>
      </div>
      <i class="fas fa-check font-item-check"></i>`;
    el.addEventListener('click', () => applyFont(f.id));
    list.appendChild(el);
  });
}

/* ============================================================
   CARD HEIGHT
   ============================================================ */
function applyCardHeight(h, save = true) {
  currentCardH = h;
  document.documentElement.style.setProperty('--card-h', h + 'px');
  if (save) localStorage.setItem('pf-card-h', h);
}

/* ============================================================
   SETTINGS PANEL
   ============================================================ */
function setupSettings() {
  const btn      = document.getElementById('settingsBtn');
  const panel    = document.getElementById('settingsPanel');
  const backdrop = document.getElementById('settingsBackdrop');
  const closeBtn = document.getElementById('settingsClose');
  const slider   = document.getElementById('cardHeightSlider');
  const valEl    = document.getElementById('cardHeightVal');

  const open  = () => { settingsOpen = true;  panel.classList.add('open');    backdrop.classList.add('open'); };
  const close = () => { settingsOpen = false; panel.classList.remove('open'); backdrop.classList.remove('open'); };

  btn.addEventListener('click', e => { e.stopPropagation(); open(); });
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && settingsOpen) close(); });

  slider.addEventListener('input', () => {
    const v = parseInt(slider.value);
    valEl.textContent = v + 'px';
    applyCardHeight(v);
  });
}

/* ============================================================
   PROFILE
   ============================================================ */
function renderProfile() {
  const p = portfolioData?.profile;
  if (!p) return;

  // Avatar
  const ai = document.getElementById('avatarInner');
  if (p.image) {
    const img = new Image();
    img.onload  = () => { ai.innerHTML = ''; ai.appendChild(img); img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%'; };
    img.onerror = () => { ai.textContent = initials(p.name); };
    img.src = p.image;
    img.alt = p.name;
  } else {
    ai.textContent = initials(p.name);
  }

  // Name (split for highlight)
  const parts = p.name.split(' ');
  const first = parts.slice(0, 2).join(' ');
  const last  = parts.slice(2).join(' ');
  document.getElementById('heroName').innerHTML =
    `<span class="highlight">${escHtml(first)}</span>${last ? ' ' + escHtml(last) : ''}`;

  // Bio
  const plain = (p.bio || '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '');
  document.getElementById('heroBio').textContent = plain;

  // Social
  const row = document.getElementById('socialRow');
  row.innerHTML = '';
  (p.socialLinks || []).forEach(link => {
    const a = document.createElement('a');
    a.className = 'social-link';
    a.href = link.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', link.platform);
    a.innerHTML = `<i class="${link.icon}"></i>`;
    row.appendChild(a);
  });
}

function initials(name) { return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase(); }

/* ============================================================
   FILTERS
   ============================================================ */
function renderFilters() {
  const row = document.getElementById('filterRow');
  row.innerHTML = '';
  (portfolioData?.filterCategories || []).forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-chip' + (cat.value === 'all' ? ' active' : '');
    btn.dataset.filter = cat.value;
    btn.textContent = cat.name;
    row.appendChild(btn);
  });
}

function setupFiltering() {
  document.getElementById('filterRow').addEventListener('click', e => {
    const btn = e.target.closest('.filter-chip');
    if (!btn) return;
    activeFilter = btn.dataset.filter;
    document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterCards();
  });
}

function filterCards() {
  document.querySelectorAll('.project-card').forEach(c => {
    const show = activeFilter === 'all' || c.dataset.category === activeFilter;
    if (show) {
      c.classList.remove('hidden');
      c.style.animation = 'none';
      void c.offsetHeight;
      c.style.animation = '';
    } else {
      c.classList.add('hidden');
    }
  });
}

/* ============================================================
   PROJECT CARDS
   ============================================================ */
function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = '';
  (portfolioData?.projects || []).forEach((proj, i) => {
    const card = buildCard(proj, i);
    grid.appendChild(card);
  });

  // Staggered reveal via IO
  const io = new IntersectionObserver(entries => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }, idx * 60);
      }
    });
  }, { threshold: 0.05 });
  document.querySelectorAll('.project-card').forEach(c => io.observe(c));

  // Re-apply 3D tilt to new cards
  setTimeout(setup3DTilt, 100);
}

function buildCard(proj, idx) {
  const article = document.createElement('article');
  article.className = 'project-card';
  article.dataset.category = proj.category || 'other';
  const emoji = CATEGORY_EMOJIS[proj.category] || '💡';
  const col   = CATEGORY_COLORS[proj.category] || 'var(--accent)';
  const tags  = (proj.tags || []).slice(0, 3).map(t => `<span class="card-tag">${escHtml(t)}</span>`).join('');
  const overlays = buildOverlayBtns(proj.links || []);

  article.innerHTML = `
    <div class="card-band"></div>
    <div class="card-img-wrap">
      ${proj.image
        ? `<img class="card-img" src="${escHtml(proj.image)}" alt="${escHtml(proj.title)}" loading="lazy"
             onerror="this.parentNode.innerHTML='<div class=\\'card-img-fallback\\'><span style=\\'font-size:3rem\\'>${emoji}</span></div>'">`
        : `<div class="card-img-fallback" style="background:linear-gradient(135deg,${col}22,${col}11)"><span style="font-size:3rem">${emoji}</span></div>`
      }
      <div class="card-overlay">
        <button class="overlay-btn ob-preview" data-idx="${idx}">
          <i class="fas fa-eye"></i> Preview
        </button>
        ${overlays}
      </div>
    </div>
    <div class="card-body">
      <div class="card-cat">${escHtml(proj.category || 'project')}</div>
      <h3 class="card-title">${escHtml(proj.title)}</h3>
      <p class="card-desc">${escHtml(proj.description)}</p>
      <div class="card-foot">
        <div class="card-tags">${tags}</div>
        <div class="card-arrow"><i class="fas fa-up-right-from-square" style="font-size:0.55rem"></i></div>
      </div>
    </div>`;

  article.addEventListener('click', e => {
    if (e.target.closest('a')) return;
    openModal(idx);
  });
  return article;
}

function buildOverlayBtns(links) {
  return links.map(link => {
    const url = (link.url || '').trim();
    if (!url || url.startsWith('https: ')) return '';
    return `<a href="${escHtml(url)}" target="_blank" rel="noopener noreferrer" class="overlay-btn ob-link">
      <i class="${link.icon}"></i> ${linkLabel(link.type)}
    </a>`;
  }).join('');
}

function linkLabel(type) {
  return { code:'Code', demo:'Demo', live:'Live', package:'Package',
           playstore:'Play Store', appstore:'App Store', github:'Code' }[type] || 'Link';
}

/* ============================================================
   SKILLS
   ============================================================ */
function buildSkills() {
  const grid = document.getElementById('skillsGrid');
  SKILLS.forEach(s => {
    const el = document.createElement('div');
    el.className = 'skill-card';
    el.innerHTML = `
      <span class="skill-icon">${s.icon}</span>
      <div class="skill-name">${s.name}</div>
      <div class="skill-bar-bg">
        <div class="skill-bar-fill" data-level="${s.level}" style="width:0%"></div>
      </div>`;
    grid.appendChild(el);
  });
}

/* ============================================================
   CONTACT
   ============================================================ */
function renderContactCards() {
  const c = document.getElementById('contactCards');
  c.innerHTML = '';
  (portfolioData?.profile?.socialLinks || []).forEach(link => {
    const a = document.createElement('a');
    a.className = 'contact-card';
    a.href = link.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.innerHTML = `
      <div class="contact-icon"><i class="${link.icon}"></i></div>
      <div class="contact-platform">${escHtml(link.platform)}</div>
      <div class="contact-hint">${escHtml(contactHint(link))}</div>`;
    c.appendChild(a);
  });
}

function contactHint(link) {
  if (link.url.startsWith('mailto:')) return link.url.replace('mailto:', '');
  if (link.url.includes('github.com'))   return 'github.com/' + link.url.split('/').pop();
  if (link.url.includes('linkedin.com')) return 'linkedin.com/in/…';
  return link.platform;
}

function renderFooterSocial() {
  const row = document.getElementById('footerSocial');
  row.innerHTML = '';
  (portfolioData?.profile?.socialLinks || []).forEach(link => {
    const a = document.createElement('a');
    a.className = 'footer-social-link';
    a.href = link.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', link.platform);
    a.innerHTML = `<i class="${link.icon}"></i>`;
    row.appendChild(a);
  });
}

/* ============================================================
   MODAL
   ============================================================ */
function setupModal() {
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalBackdrop').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function openModal(idx) {
  const proj = portfolioData?.projects?.[idx];
  if (!proj) return;

  document.getElementById('modalTitle').textContent = proj.title;

  const imgWrap = document.getElementById('modalImgWrap');
  const img     = document.getElementById('modalImg');
  if (proj.image) {
    img.src = proj.image; img.alt = proj.title;
    img.style.display = 'block'; imgWrap.style.display = 'block';
  } else {
    imgWrap.style.display = 'none';
  }

  const emoji = CATEGORY_EMOJIS[proj.category] || '💡';
  document.getElementById('modalMeta').innerHTML =
    `<span class="meta-badge">${emoji} ${escHtml(proj.category || '')}</span>` +
    (proj.links || []).map(l => `<span class="meta-badge"><i class="${l.icon}"></i> ${linkLabel(l.type)}</span>`).join('');

  document.getElementById('modalDesc').textContent = proj.description;
  document.getElementById('modalTags').innerHTML =
    (proj.tags || []).map(t => `<span class="modal-tag">${escHtml(t)}</span>`).join('');

  const galEl = document.getElementById('modalGallery');
  galEl.innerHTML = '';
  (proj.gallery || []).forEach(src => {
    const i = document.createElement('img');
    i.className = 'modal-thumb'; i.src = src; i.alt = proj.title; i.loading = 'lazy';
    i.addEventListener('click', () => { img.src = src; });
    galEl.appendChild(i);
  });

  const actEl = document.getElementById('modalActions');
  actEl.innerHTML = '';
  (proj.links || []).forEach(link => {
    const url = (link.url || '').trim();
    if (!url || url.startsWith('https: ')) return;
    const a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    const primary = ['demo','live','playstore','appstore'].includes(link.type);
    a.className = 'modal-btn' + (primary ? ' modal-btn-primary' : '');
    a.innerHTML = `<i class="${link.icon}"></i> ${linkLabel(link.type)}`;
    actEl.appendChild(a);
  });

  document.getElementById('modalBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}

/* ============================================================
   UTILS
   ============================================================ */
function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
