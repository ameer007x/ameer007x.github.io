const topbar = document.getElementById('topbar');
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const navLinks = [...document.querySelectorAll('.main-nav a')];

window.addEventListener('scroll', () => {
  topbar?.classList.toggle('scrolled', window.scrollY > 18);
}, { passive: true });

navToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const sections = [...document.querySelectorAll('main section[id]')];
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
sections.forEach(section => activeObserver.observe(section));

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery-card').forEach(card => {
  card.addEventListener('click', () => {
    const source = card.dataset.full || card.querySelector('img')?.src;
    if (!source || !lightbox || !lightboxImage) return;
    lightboxImage.src = source;
    lightbox.showModal();
  });
});

lightboxClose?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});

document.querySelectorAll('a.disabled').forEach(link => {
  link.addEventListener('click', event => event.preventDefault());
});

const trailerButton = document.querySelector('.trailer-play');
trailerButton?.addEventListener('click', () => {
  trailerButton.animate([
    { transform: 'translate(-50%, -50%) scale(1)' },
    { transform: 'translate(-50%, -50%) scale(1.12)' },
    { transform: 'translate(-50%, -50%) scale(1)' }
  ], { duration: 380, easing: 'ease-out' });
});

// Lightweight dust effect. Disabled automatically when reduced motion is requested.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('dustCanvas');
if (canvas && !reduceMotion) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(85, Math.max(28, Math.floor(width / 18)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + .35,
      vx: Math.random() * .18 + .05,
      vy: Math.random() * .08 - .04,
      a: Math.random() * .18 + .04
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x > width + 10) p.x = -10;
      if (p.y > height + 10) p.y = -10;
      if (p.y < -10) p.y = height + 10;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 186, 112, ${p.a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
}
