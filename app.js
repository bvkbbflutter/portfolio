'use strict';

/* ============================================================
   CONFIG
   ============================================================ */
const THEMES = [
  { id: 'midnight', name: 'Midnight', bg: '#060b18', accent: '#6382ff' },
  { id: 'aurora',   name: 'Aurora',   bg: '#03100d', accent: '#10d9a0' },
  { id: 'obsidian', name: 'Obsidian', bg: '#0a0a0a', accent: '#f59e0b' },
  { id: 'crimson',  name: 'Crimson',  bg: '#0c0408', accent: '#f43f5e' },
  { id: 'nebula',   name: 'Nebula',   bg: '#06030f', accent: '#a855f7' },
  { id: 'arctic',   name: 'Arctic',   bg: '#eef6ff', accent: '#0ea5e9' },
  { id: 'sakura',   name: 'Sakura',   bg: '#fff0f5', accent: '#ec4899' },
  { id: 'forest',   name: 'Forest',   bg: '#040d08', accent: '#22c55e' },
  { id: 'ember',    name: 'Ember',    bg: '#0e0600', accent: '#f97316' },
  { id: 'slate',    name: 'Slate',    bg: '#f7f8fa', accent: '#6366f1' },
];

const FONTS = [
  { id: 'grotesk', name: 'Space Grotesk', preview: 'Modern & Geometric' },
  { id: 'syne',    name: 'Syne',          preview: 'Bold & Editorial' },
  { id: 'outfit',  name: 'Outfit',        preview: 'Clean & Versatile' },
  { id: 'jakarta', name: 'Plus Jakarta',  preview: 'Professional' },
  { id: 'raleway', name: 'Raleway',       preview: 'Elegant & Thin' },
  { id: 'nunito',  name: 'Nunito',        preview: 'Friendly & Round' },
  { id: 'manrope', name: 'Manrope',       preview: 'Sharp & Technical' },
  { id: 'oxanium', name: 'Oxanium',       preview: 'Futuristic & Sci-fi' },
  { id: 'mono',    name: 'JetBrains Mono',preview: 'Hacker & Code' },
  { id: 'dm',      name: 'DM Sans',       preview: 'Simple & Neutral' },
];

const SKILLS = [
  { icon: '📱', name: 'Flutter / Dart',      level: 95 },
  { icon: '🔥', name: 'Firebase Suite',       level: 90 },
  { icon: '⚡', name: 'Riverpod / State Mgmt', level: 88 },
  { icon: '🗺️', name: 'GoRouter',             level: 85 },
  { icon: '🗄️', name: 'Hive / Local DB',      level: 84 },
  { icon: '🤖', name: 'Kotlin (Android)',      level: 78 },
  { icon: '🌐', name: 'REST API / HTTP',       level: 88 },
  { icon: '🔺', name: 'Angular',              level: 76 },
  { icon: '☁️', name: 'Node.js / Express',    level: 74 },
  { icon: '🎨', name: 'UI/UX Design',         level: 82 },
  { icon: '📡', name: 'WebRTC',              level: 72 },
  { icon: '🔧', name: 'Git & CI/CD',          level: 84 },
];

/* ============================================================
   STATE
   ============================================================ */
let portfolioData   = null;
let activeFilter    = 'all';
let currentTheme    = localStorage.getItem('pf-theme') || 'midnight';
let currentFont     = localStorage.getItem('pf-font')  || 'grotesk';
let currentCardH    = parseInt(localStorage.getItem('pf-card-h') || '440');
let settingsOpen    = false;

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
  setupCursor();
  setupScrollReveal();
  setupModal();

  document.getElementById('currentYear').textContent = new Date().getFullYear();
  document.getElementById('cardHeightSlider').value = currentCardH;
  document.getElementById('cardHeightVal').textContent = currentCardH + 'px';

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
    setupScrollReveal(); // re-run after DOM populated
  } catch (err) {
    console.error('Error loading data.json:', err);
  }
});

/* ============================================================
   THEME
   ============================================================ */
function applyTheme(id, save = true) {
  currentTheme = id;
  document.documentElement.setAttribute('data-theme', id);
  if (save) localStorage.setItem('pf-theme', id);
  document.querySelectorAll('.theme-swatch').forEach(s =>
    s.classList.toggle('active', s.dataset.theme === id)
  );
}

function buildThemeGrid() {
  const grid = document.getElementById('themeGrid');
  THEMES.forEach(t => {
    const el = document.createElement('div');
    el.className = 'theme-swatch' + (t.id === currentTheme ? ' active' : '');
    el.dataset.theme = t.id;
    el.innerHTML = `
      <div class="swatch-circle" style="background:linear-gradient(135deg,${t.bg} 50%,${t.accent} 50%)"></div>
      <span class="swatch-name">${t.name}</span>
    `;
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
  document.querySelectorAll('.font-item').forEach(f =>
    f.classList.toggle('active', f.dataset.font === id)
  );
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
      <i class="fas fa-check font-item-check"></i>
    `;
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
  const btn       = document.getElementById('settingsBtn');
  const panel     = document.getElementById('settingsPanel');
  const backdrop  = document.getElementById('settingsBackdrop');
  const closeBtn  = document.getElementById('settingsClose');
  const slider    = document.getElementById('cardHeightSlider');
  const sliderVal = document.getElementById('cardHeightVal');

  function openSettings() {
    settingsOpen = true;
    panel.classList.add('open');
    backdrop.classList.add('open');
  }
  function closeSettings() {
    settingsOpen = false;
    panel.classList.remove('open');
    backdrop.classList.remove('open');
  }

  btn.addEventListener('click', e => { e.stopPropagation(); openSettings(); });
  closeBtn.addEventListener('click', closeSettings);
  backdrop.addEventListener('click', closeSettings);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && settingsOpen) closeSettings(); });

  slider.addEventListener('input', () => {
    const v = parseInt(slider.value);
    sliderVal.textContent = v + 'px';
    applyCardHeight(v);
  });
}

/* ============================================================
   NAV — hamburger + scroll shrink
   ============================================================ */
function setupNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  let   navOpen   = false;

  hamburger.addEventListener('click', () => {
    navOpen = !navOpen;
    hamburger.classList.toggle('open', navOpen);
    mobileNav.classList.toggle('open', navOpen);
  });

  // Close mobile nav when a link is clicked
  document.querySelectorAll('.mobile-nav-link').forEach(l => {
    l.addEventListener('click', () => {
      navOpen = false;
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });

  // Smooth scroll for all anchor links
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

/* ============================================================
   CURSOR GLOW
   ============================================================ */
function setupCursor() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  let mx = 0, my = 0, gx = 0, gy = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { glow.style.opacity = '0.35'; });

  (function animate() {
    gx += (mx - gx) * 0.09;
    gy += (my - gy) * 0.09;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(animate);
  })();
}

/* ============================================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
function setupScrollReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Trigger skill bars when skills section is visible
        if (entry.target.classList.contains('skills-grid')) {
          entry.target.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
            setTimeout(() => {
              bar.style.width = bar.dataset.level + '%';
            }, i * 65);
          });
        }
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal, .project-card').forEach(el => io.observe(el));
}

/* ============================================================
   PROFILE (from data.json)
   ============================================================ */
function renderProfile() {
  const p = portfolioData?.profile;
  if (!p) return;

  // Avatar
  const avatarInner = document.getElementById('avatarInner');
  if (p.image) {
    const img = document.createElement('img');
    img.src = p.image;
    img.alt = p.name;
    img.onerror = () => { avatarInner.textContent = initials(p.name); };
    avatarInner.appendChild(img);
  } else {
    avatarInner.textContent = initials(p.name);
  }

  // Text
  document.getElementById('heroName').innerHTML = `<span class="highlight">${firstName(p.name)}</span> ${lastName(p.name)}`;
  document.getElementById('heroTitle').textContent = p.title || '';

  // Bio — strip HTML tags for plain text version, keep short
  const plainBio = (p.bio || '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '');
  document.getElementById('heroBio').textContent = plainBio;

  // Social links
  const socialRow = document.getElementById('socialRow');
  socialRow.innerHTML = '';
  (p.socialLinks || []).forEach(link => {
    const a = document.createElement('a');
    a.href = link.url;
    a.className = 'social-link';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', link.platform);
    a.innerHTML = `<i class="${link.icon}"></i>`;
    socialRow.appendChild(a);
  });
}

function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
function firstName(name) {
  const parts = name.split(' ');
  return parts.slice(0, 2).join(' ');
}
function lastName(name) {
  const parts = name.split(' ');
  return parts.slice(2).join(' ');
}

/* ============================================================
   FILTER BUTTONS (from data.json filterCategories)
   ============================================================ */
function renderFilters() {
  const row = document.getElementById('filterRow');
  row.innerHTML = '';
  const cats = portfolioData?.filterCategories || [];
  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-chip' + (cat.value === 'all' ? ' active' : '');
    btn.dataset.filter = cat.value;
    btn.textContent = cat.name;
    row.appendChild(btn);
  });
}

function setupFiltering() {
  const row = document.getElementById('filterRow');
  row.addEventListener('click', e => {
    const btn = e.target.closest('.filter-chip');
    if (!btn) return;
    activeFilter = btn.dataset.filter;
    row.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterCards();
  });
}

function filterCards() {
  document.querySelectorAll('.project-card').forEach(card => {
    const match = activeFilter === 'all' || card.dataset.category === activeFilter;
    card.classList.toggle('hidden', !match);
  });
}

/* ============================================================
   PROJECT CARDS (from data.json projects)
   ============================================================ */
const CATEGORY_EMOJIS = {
  flutter:   '📱',
  angular:   '🔺',
  'web-apps':'🌐',
  'social-links': '🔗',
};
const CATEGORY_COLORS = {
  flutter:   '#38bdf8',
  angular:   '#f43f5e',
  'web-apps':'#22c55e',
  'social-links': '#a855f7',
};

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = '';
  const projects = portfolioData?.projects || [];

  projects.forEach((proj, i) => {
    const card = buildProjectCard(proj, i);
    grid.appendChild(card);
  });

  // Re-observe new cards
  const io = new IntersectionObserver(entries => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in-view'), idx * 55);
      }
    });
  }, { threshold: 0.06 });
  document.querySelectorAll('.project-card').forEach(c => io.observe(c));
}

function buildProjectCard(proj, idx) {
  const article = document.createElement('article');
  article.className = 'project-card';
  article.dataset.category = proj.category || 'other';

  const emoji = CATEGORY_EMOJIS[proj.category] || '💡';
  const col   = CATEGORY_COLORS[proj.category] || 'var(--accent)';

  // Limit tags to first 3 for card display
  const tagBadges = (proj.tags || []).slice(0, 3)
    .map(t => `<span class="card-tag">${t}</span>`)
    .join('');

  // Build overlay buttons from links
  const overlayBtns = buildOverlayBtns(proj.links || []);

  article.innerHTML = `
    <div class="card-band"></div>
    <div class="card-img-wrap">
      ${proj.image
        ? `<img class="card-img" src="${proj.image}" alt="${escHtml(proj.title)}" loading="lazy" onerror="this.parentNode.innerHTML='<div class=\\'card-img-fallback\\'><span style=\\'font-size:3rem\\'>${emoji}</span></div>'">`
        : `<div class="card-img-fallback" style="background:linear-gradient(135deg,${col}22,${col}11)"><span style="font-size:3rem">${emoji}</span></div>`
      }
      <div class="card-overlay">
        <button class="overlay-btn ob-preview" data-idx="${idx}">
          <i class="fas fa-eye"></i> Preview
        </button>
        ${overlayBtns}
      </div>
    </div>
    <div class="card-body">
      <div class="card-cat">${proj.category || 'project'}</div>
      <h3 class="card-title">${escHtml(proj.title)}</h3>
      <p class="card-desc">${escHtml(proj.description)}</p>
      <div class="card-foot">
        <div class="card-tags">${tagBadges}</div>
        <div class="card-arrow"><i class="fas fa-up-right-from-square" style="font-size:0.55rem"></i></div>
      </div>
    </div>
  `;

  // Whole card click → modal (unless clicking an overlay link)
  article.addEventListener('click', e => {
    if (e.target.closest('a')) return;
    const previewBtn = e.target.closest('.ob-preview');
    if (previewBtn || !e.target.closest('.card-overlay')) {
      openModal(idx);
    }
  });

  return article;
}

function buildOverlayBtns(links) {
  return links.map(link => {
    const label = linkLabel(link.type);
    const safeUrl = link.url.trim();
    if (!safeUrl || safeUrl.startsWith('https: ')) return ''; // skip malformed
    return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="overlay-btn ob-link">
      <i class="${link.icon}"></i> ${label}
    </a>`;
  }).join('');
}

function linkLabel(type) {
  const map = { code: 'Code', demo: 'Demo', live: 'Live', package: 'Package',
                playstore: 'Play Store', appstore: 'App Store', github: 'Code' };
  return map[type] || 'Link';
}

/* ============================================================
   SKILLS
   ============================================================ */
function buildSkills() {
  const grid = document.getElementById('skillsGrid');
  SKILLS.forEach(skill => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `
      <span class="skill-icon">${skill.icon}</span>
      <div class="skill-name">${skill.name}</div>
      <div class="skill-bar-bg">
        <div class="skill-bar-fill" data-level="${skill.level}" style="width:0%"></div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ============================================================
   CONTACT CARDS (social links from profile)
   ============================================================ */
function renderContactCards() {
  const container = document.getElementById('contactCards');
  const links = portfolioData?.profile?.socialLinks || [];
  container.innerHTML = '';
  links.forEach(link => {
    const a = document.createElement('a');
    a.className = 'contact-card';
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = `
      <div class="contact-icon"><i class="${link.icon}"></i></div>
      <div class="contact-platform">${link.platform}</div>
      <div class="contact-hint">${contactHint(link)}</div>
    `;
    container.appendChild(a);
  });
}

function contactHint(link) {
  if (link.url.startsWith('mailto:')) return link.url.replace('mailto:', '');
  if (link.url.includes('github.com')) return 'github.com/' + link.url.split('/').pop();
  if (link.url.includes('linkedin.com')) return 'linkedin.com/in/…';
  return link.platform;
}

/* ============================================================
   FOOTER SOCIAL
   ============================================================ */
function renderFooterSocial() {
  const row = document.getElementById('footerSocial');
  const links = portfolioData?.profile?.socialLinks || [];
  row.innerHTML = '';
  links.forEach(link => {
    const a = document.createElement('a');
    a.className = 'footer-social-link';
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', link.platform);
    a.innerHTML = `<i class="${link.icon}"></i>`;
    row.appendChild(a);
  });
}

/* ============================================================
   PROJECT PREVIEW MODAL
   ============================================================ */
function setupModal() {
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalClose');

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(idx) {
  const proj = portfolioData?.projects?.[idx];
  if (!proj) return;

  document.getElementById('modalTitle').textContent = proj.title;

  // Image
  const imgWrap = document.getElementById('modalImgWrap');
  const img     = document.getElementById('modalImg');
  if (proj.image) {
    img.src = proj.image;
    img.alt = proj.title;
    img.style.display = 'block';
    imgWrap.style.display = 'block';
  } else {
    imgWrap.style.display = 'none';
  }

  // Meta badges
  const emoji = CATEGORY_EMOJIS[proj.category] || '💡';
  document.getElementById('modalMeta').innerHTML = `
    <span class="meta-badge">${emoji} ${proj.category || 'project'}</span>
    ${proj.links.map(l => `<span class="meta-badge"><i class="${l.icon}"></i> ${linkLabel(l.type)}</span>`).join('')}
  `;

  // Description
  document.getElementById('modalDesc').textContent = proj.description;

  // All tags
  document.getElementById('modalTags').innerHTML =
    (proj.tags || []).map(t => `<span class="modal-tag">${escHtml(t)}</span>`).join('');

  // Gallery thumbnails (if any)
  const galEl = document.getElementById('modalGallery');
  galEl.innerHTML = '';
  if (proj.gallery && proj.gallery.length > 0) {
    proj.gallery.forEach(src => {
      const img2 = document.createElement('img');
      img2.className = 'modal-thumb';
      img2.src = src;
      img2.alt = proj.title;
      img2.loading = 'lazy';
      img2.addEventListener('click', () => {
        document.getElementById('modalImg').src = src;
      });
      galEl.appendChild(img2);
    });
  }

  // Action buttons from links
  const actEl = document.getElementById('modalActions');
  actEl.innerHTML = '';
  (proj.links || []).forEach(link => {
    const safeUrl = link.url.trim();
    if (!safeUrl || safeUrl.startsWith('https: ')) return;
    const a = document.createElement('a');
    a.href = safeUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    const label = linkLabel(link.type);
    const isPrimary = ['demo', 'live', 'playstore', 'appstore'].includes(link.type);
    a.className = 'modal-btn' + (isPrimary ? ' modal-btn-primary' : '');
    a.innerHTML = `<i class="${link.icon}"></i> ${label}`;
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
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
