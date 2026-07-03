/* ═══════════════════════════════════════════
   YOUSSIF KADY – PORTFOLIO JavaScript
═══════════════════════════════════════════ */

'use strict';

/* ── Preloader ───────────────────────────── */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  setTimeout(() => {
    preloader.classList.add('hidden');
    // Init everything after preloader
    initAll();
  }, 1900);
});

function initAll() {
  initCursor();
  initNavbar();
  initMobileMenu();
  initTypewriter();
  initParticles();
  initCounters();
  initAOS();
  initSkillBars();
  initContactForm();
  initBackToTop();
  initFooterYear();
  initAvatarFallback();
}

/* ── Custom Cursor ───────────────────────── */
function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const interactables = document.querySelectorAll(
    'a, button, .project-card, .skill-card, .glass-card, input, textarea, .badge, .tech-pill'
  );
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}

/* ── Navbar ──────────────────────────────── */
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!navbar) return;

  // Scroll shrink
  const onScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active section highlight
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const bot = top + sec.offsetHeight;
      const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (link) {
        link.classList.toggle('active', scrollPos >= top && scrollPos <= bot);
      }
    });
  }

  // Smooth scroll
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ── Mobile Menu ─────────────────────────── */
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    menu.setAttribute('aria-hidden', !isOpen);
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    });
  });
}

/* ── Typewriter ──────────────────────────── */
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const phrases = [
    'Web Applications.',
    'Mobile Apps.',
    'ML Models.',
    'Clean Code.',
    'Great Products.',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let pause     = false;

  function tick() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        pause = true;
        setTimeout(() => { pause = false; deleting = true; }, 2000);
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }

    if (!pause) {
      setTimeout(tick, deleting ? 50 : 80);
    }
  }
  setTimeout(tick, 600);
}

/* ── Particle Canvas ─────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;

  const PARTICLE_COUNT = Math.min(80, window.innerWidth < 640 ? 30 : 65);
  const COLORS = ['rgba(79,168,255,', 'rgba(168,85,247,', 'rgba(45,212,191,'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function mkParticle() {
    const col = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 1.5 + 0.4,
      vx:   (Math.random() - 0.5) * 0.35,
      vy:   (Math.random() - 0.5) * 0.35,
      col,
      a:    Math.random() * 0.5 + 0.15,
    };
  }

  particles = Array.from({ length: PARTICLE_COUNT }, mkParticle);

  // Mouse interaction
  let mouse = { x: -9999, y: -9999 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  function connect(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const d2 = dx * dx + dy * dy;
    if (d2 < 18000) {
      const alpha = (1 - d2 / 18000) * 0.3;
      ctx.strokeStyle = `rgba(79,168,255,${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Move
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Mouse repulsion
      const mx = p.x - mouse.x, my = p.y - mouse.y;
      const md = mx * mx + my * my;
      if (md < 8000) {
        const f = (8000 - md) / 8000 * 0.8;
        p.vx += (mx / Math.sqrt(md)) * f * 0.15;
        p.vy += (my / Math.sqrt(md)) * f * 0.15;
        // Clamp speed
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > 2) { p.vx = (p.vx / spd) * 2; p.vy = (p.vy / spd) * 2; }
      }

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.col}${p.a})`;
      ctx.fill();
    });

    // Connect nearby
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        connect(particles[i], particles[j]);
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
}

/* ── Animated Counters ───────────────────── */
function initCounters() {
  const nums = document.querySelectorAll('.stat-number[data-count]');
  let done = false;

  function animateCounters() {
    if (done) return;
    const hero = document.getElementById('hero');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      done = true;
      nums.forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        let current = 0;
        const step = Math.ceil(target / 40);
        const t = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current;
          if (current >= target) clearInterval(t);
        }, 35);
      });
    }
  }
  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters();
}

/* ── AOS (custom Intersection Observer) ─── */
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay || '0', 10);
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
}

/* ── Skill Bars ──────────────────────────── */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar[data-width]');
  if (!bars.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-bar-fill');
        const w = entry.target.dataset.width;
        if (fill) {
          setTimeout(() => { fill.style.width = w + '%'; }, 300);
        }
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => obs.observe(bar));
}

/* ── Contact Form ────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const btn  = document.getElementById('submit-btn');
  const succ = document.getElementById('form-success');
  if (!form || !btn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.querySelector('#contact-name')?.value.trim();
    const email   = form.querySelector('#contact-email')?.value.trim();
    const subject = form.querySelector('#contact-subject')?.value.trim();
    const message = form.querySelector('#contact-message')?.value.trim();

    if (!name || !email || !subject || !message) {
      shakeForm(form);
      return;
    }
    if (!isValidEmail(email)) {
      shakeForm(form.querySelector('#contact-email'));
      return;
    }

    // Simulate sending
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending...';

    setTimeout(() => {
      btn.querySelector('span').textContent = 'Sent!';
      btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';

      if (succ) succ.classList.add('show');
      form.reset();

      setTimeout(() => {
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Send Message';
        btn.style.background = '';
        if (succ) succ.classList.remove('show');
      }, 4000);
    }, 1400);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeForm(el) {
  if (!el) return;
  el.style.animation = 'shake 0.4s ease';
  el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
}

// Shake keyframe
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-8px); }
  40%       { transform: translateX(8px); }
  60%       { transform: translateX(-5px); }
  80%       { transform: translateX(5px); }
}
`;
document.head.appendChild(style);

/* ── Back to Top ─────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Footer Year ─────────────────────────── */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ── Avatar Fallback ─────────────────────── */
function initAvatarFallback() {
  const avatars = document.querySelectorAll('img[src="avatar.png"]');
  avatars.forEach(img => {
    img.onerror = () => {
      // Replace broken image with a generated SVG avatar
      const parent = img.parentElement;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 200 200');
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.style.cssText = img.style.cssText;
      svg.setAttribute('class', img.className);
      svg.innerHTML = `
        <defs>
          <linearGradient id="avatarGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#4fa8ff"/>
            <stop offset="100%" stop-color="#a855f7"/>
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#avatarGrad)" opacity="0.15"/>
        <circle cx="100" cy="80" r="35" fill="url(#avatarGrad)" opacity="0.7"/>
        <ellipse cx="100" cy="155" rx="55" ry="45" fill="url(#avatarGrad)" opacity="0.55"/>
        <text x="100" y="116" text-anchor="middle" font-family="Outfit,sans-serif" font-size="36" font-weight="800" fill="url(#avatarGrad)">YK</text>
      `;
      img.style.display = 'none';
      parent.appendChild(svg);
    };
  });
}

/* ── Smooth in-page anchor scrolling for ALL anchors ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
