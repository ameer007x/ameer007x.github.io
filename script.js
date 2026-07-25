(() => {
  const data = window.V8_SITE_DATA;
  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => [...root.querySelectorAll(selector)];

  /* Header: large at the top, compact while scrolling */
  const topbar = q('#topbar');
  const navToggle = q('#navToggle');
  const mainNav = q('#mainNav');

  const updateHeader = () => {
    topbar?.classList.toggle('is-compact', window.scrollY > 48);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  navToggle?.addEventListener('click', () => {
    const open = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  qa('.main-nav a').forEach(link => link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }));

  /* Reveal animation */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  qa('[data-reveal]').forEach(element => revealObserver.observe(element));

  /* Active navigation section */
  const navLinks = qa('.main-nav a');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  qa('main section[id]').forEach(section => sectionObserver.observe(section));

  /* News filters */
  qa('[data-news-filter]').forEach(button => button.addEventListener('click', () => {
    qa('[data-news-filter]').forEach(item => item.classList.remove('is-active'));
    button.classList.add('is-active');
    const filter = button.dataset.newsFilter;
    qa('.news-card').forEach(card => {
      card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  }));

  /* Driver selector */
  const drivers = data.drivers;
  const AUTO_DELAY = 6000;
  const VISIBLE_THUMBS = 4;
  let driverIndex = 0;
  let changing = false;
  let autoChangeId = 0;

  const driverName = q('#driverName');
  const driverVehicle = q('#driverVehicle');
  const driverTagline = q('#driverTagline');
  const driverGhost = q('#driverGhost');
  const driverArt = q('#driverArt');
  const driverBackdropArt = q('#driverBackdropArt');
  const driverArtWrap = q('#driverArtWrap');
  const driverColorWorld = q('#driverColorWorld');
  const driverCopy = q('#driverCopy');
  const skillList = q('#skillList');
  const driverThumbs = q('#driverThumbs');
  const driverIndexEl = q('#driverIndex');
  const driverTotal = q('#driverTotal');
  const autoTimer = q('#autoTimer');

  driverTotal.textContent = String(drivers.length).padStart(2, '0');

  const wrapIndex = index => (index + drivers.length) % drivers.length;

  function restartTimerAnimation() {
    if (!autoTimer) return;
    autoTimer.style.animation = 'none';
    void autoTimer.offsetWidth;
    autoTimer.style.animation = '';
  }

  function startAutoChange() {
    window.clearInterval(autoChangeId);
    restartTimerAnimation();
    autoChangeId = window.setInterval(() => {
      setDriver(driverIndex + 1, { automatic: true });
    }, AUTO_DELAY);
  }

  function buildVisibleThumbs() {
    driverThumbs.innerHTML = '';
    const start = driverIndex;

    for (let offset = 0; offset < VISIBLE_THUMBS; offset += 1) {
      const index = wrapIndex(start + offset);
      const driver = drivers[index];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'driver-thumb';
      button.classList.toggle('is-active', index === driverIndex);
      button.title = `${String(index + 1).padStart(2, '0')} — ${driver.name}`;
      button.setAttribute('aria-label', `Show ${driver.name}`);
      button.innerHTML = `
        <img src="${driver.avatar}" alt="${driver.name}">
        <span class="driver-thumb-index">${String(index + 1).padStart(2, '0')}</span>
      `;
      button.addEventListener('click', () => setDriver(index, { manual: true }));
      driverThumbs.appendChild(button);
    }
  }

  function renderSkills(driver) {
    skillList.innerHTML = driver.skills.map((skill, index) => `
      <article class="skill" style="animation-delay:${index * 0.11}s">
        <span class="skill-icon">
          <img src="${skill.icon || 'assets/tutorial/specials.svg'}" alt="">
        </span>
        <div>
          <h4>${skill.title}</h4>
          <p>${skill.text}</p>
        </div>
      </article>
    `).join('');
  }

  function applyDriver(index) {
    driverIndex = wrapIndex(index);
    const driver = drivers[driverIndex];

    document.documentElement.style.setProperty('--driver-accent', driver.accent);
    document.documentElement.style.setProperty('--driver-accent2', driver.accent2);
    document.documentElement.style.setProperty('--driver-accent3', driver.accent3 || driver.accent);
    document.documentElement.style.setProperty('--progress', `${((driverIndex + 1) / drivers.length) * 100}%`);

    driverName.textContent = driver.name;
    driverVehicle.textContent = driver.vehicle;
    driverTagline.textContent = driver.tagline;
    driverGhost.textContent = driver.name.replace(/\s+/g, ' ');
    driverArt.src = driver.image;
    driverArt.alt = driver.name;
    driverBackdropArt.src = driver.backgroundImage || driver.image;
    driverIndexEl.textContent = String(driverIndex + 1).padStart(2, '0');
    renderSkills(driver);
    buildVisibleThumbs();

    driverArtWrap.classList.remove('is-exiting');
    driverColorWorld.classList.remove('is-exiting');
    driverCopy.classList.remove('is-exiting');

    [driverArt, driverBackdropArt, driverColorWorld, driverCopy].forEach(element => {
      if (!element) return;
      element.style.animation = 'none';
      void element.offsetWidth;
      element.style.animation = '';
    });

    changing = false;
    restartTimerAnimation();
  }

  function setDriver(next, options = {}) {
    const target = wrapIndex(next);
    if (changing || target === driverIndex && !options.instant) {
      if (options.manual) startAutoChange();
      return;
    }

    changing = true;
    if (options.instant) {
      applyDriver(target);
    } else {
      driverArtWrap.classList.add('is-exiting');
      driverColorWorld.classList.add('is-exiting');
      driverCopy.classList.add('is-exiting');
      window.setTimeout(() => applyDriver(target), 390);
    }

    if (options.manual) startAutoChange();
  }

  q('#driverPrev')?.addEventListener('click', () => setDriver(driverIndex - 1, { manual: true }));
  q('#driverNext')?.addEventListener('click', () => setDriver(driverIndex + 1, { manual: true }));

  /* Deliberately no mouse-wheel, keyboard, or swipe driver switching. */
  setDriver(0, { instant: true });
  startAutoChange();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      window.clearInterval(autoChangeId);
    } else {
      startAutoChange();
    }
  });

  /* Driver profile modal */
  const modal = q('#profileModal');
  q('#viewProfile')?.addEventListener('click', () => {
    const driver = drivers[driverIndex];
    q('#modalImage').src = driver.image;
    q('#modalImage').alt = driver.name;
    q('#profileTitle').textContent = driver.name;
    q('#modalVehicle').textContent = driver.vehicle;
    q('#modalDescription').textContent = driver.description;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    window.clearInterval(autoChangeId);
  });

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    startAutoChange();
  }
  q('#modalClose')?.addEventListener('click', closeModal);
  modal?.addEventListener('click', event => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal?.classList.contains('is-open')) closeModal();
  });

  /* Tutorial cards */
  function renderTutorial(level) {
    q('#tutorialGrid').innerHTML = data.tutorial[level].map((item, index) => `
      <article class="tutorial-card" style="animation-delay:${index * 0.07}s">
        <img src="${item.image}" alt="${item.title}">
        <h3>${item.title}</h3>
      </article>
    `).join('');
  }
  qa('[data-tutorial]').forEach(button => button.addEventListener('click', () => {
    qa('[data-tutorial]').forEach(item => item.classList.remove('is-active'));
    button.classList.add('is-active');
    renderTutorial(button.dataset.tutorial);
  }));
  renderTutorial('beginner');

  /* Features slider — centered card, side previews and hard end stops. */
  let featureIndex = 0;
  const track = q('#featureTrack');
  const dots = q('#featureDots');
  const featureStage = q('.feature-stage');
  const featureViewport = q('.feature-viewport');
  const featurePrev = q('#featurePrev');
  const featureNext = q('#featureNext');

  function buildFeatures() {
    track.innerHTML = data.features.map((feature, index) => `
      <article class="feature-card" data-feature-index="${index}">
        <div class="feature-media">
          <img src="${feature.image}" alt="${feature.title}">
          <span class="feature-number">${String(index + 1).padStart(2, '0')}</span>
        </div>
        <div class="feature-caption"><h3>${feature.title}</h3><p>${feature.text}</p></div>
      </article>
    `).join('');

    dots.innerHTML = data.features.map((_, index) => `<button aria-label="Feature ${index + 1}"></button>`).join('');
    qa('button', dots).forEach((button, index) => button.addEventListener('click', () => setFeature(index)));
    qa('.feature-card', track).forEach((card, index) => card.addEventListener('click', () => setFeature(index)));
    setFeature(0, true);
  }

  function updateFeatureControls() {
    const atStart = featureIndex === 0;
    const atEnd = featureIndex === data.features.length - 1;
    featurePrev.disabled = atStart;
    featureNext.disabled = atEnd;
    featurePrev.setAttribute('aria-disabled', String(atStart));
    featureNext.setAttribute('aria-disabled', String(atEnd));
    featurePrev.title = atStart ? 'Beginning of features' : 'Previous feature';
    featureNext.title = atEnd ? 'End of features' : 'Next feature';
  }

  function centerActiveFeature(instant = false) {
    const cards = qa('.feature-card', track);
    const card = cards[featureIndex];
    if (!card || !featureViewport) return;
    const targetCenter = card.offsetLeft + card.offsetWidth / 2;
    const viewportCenter = featureViewport.clientWidth / 2;
    const translateX = viewportCenter - targetCenter;
    track.style.transition = instant ? 'none' : '';
    track.style.transform = `translate3d(${translateX}px, 0, 0)`;
    if (instant) window.setTimeout(() => { track.style.transition = ''; }, 30);
  }

  function setFeature(next, instant = false) {
    const last = data.features.length - 1;
    featureIndex = Math.max(0, Math.min(last, next));
    const cards = qa('.feature-card', track);
    cards.forEach((card, index) => {
      card.classList.toggle('is-active', index === featureIndex);
      card.classList.toggle('is-before', index < featureIndex);
      card.classList.toggle('is-after', index > featureIndex);
      card.setAttribute('aria-current', index === featureIndex ? 'true' : 'false');
    });
    qa('button', dots).forEach((dot, index) => dot.classList.toggle('is-active', index === featureIndex));
    updateFeatureControls();
    window.requestAnimationFrame(() => centerActiveFeature(instant));
  }

  buildFeatures();
  featurePrev?.addEventListener('click', () => {
    if (!featurePrev.disabled) setFeature(featureIndex - 1);
  });
  featureNext?.addEventListener('click', () => {
    if (!featureNext.disabled) setFeature(featureIndex + 1);
  });
  window.addEventListener('resize', () => centerActiveFeature(true));

})();

/* V6 ambient ember layers — intentionally excludes the driver showcase. */
(() => {
  const targets = [
    document.querySelector('.hero'),
    document.querySelector('.news'),
    document.querySelector('.creator'),
    document.querySelector('.tutorial'),
    document.querySelector('.features'),
    document.querySelector('.download')
  ].filter(Boolean);

  targets.forEach((section, sectionIndex) => {
    if (section.querySelector(':scope > .v6-embers')) return;
    const layer = document.createElement('div');
    layer.className = 'v6-embers';
    layer.setAttribute('aria-hidden', 'true');

    const decor = document.createElement('div');
    decor.className = 'v8-scene-decor';
    decor.setAttribute('aria-hidden', 'true');
    const sceneNames = ['ROAD WAR', 'PROJECT FEED', 'UNITY BUILD', 'COMBAT SCHOOL', 'GAME FEATURES', 'DOWNLOAD'];
    decor.innerHTML = `
      <span class="scene-panel"></span>
      <span class="scene-ghost">${sceneNames[sectionIndex] || 'VIGILANTE 8'}</span>
      <span class="scene-halftone"></span>
      <span class="scene-slash scene-slash-a"></span>
      <span class="scene-slash scene-slash-b"></span>
      <span class="scene-slash scene-slash-c"></span>
    `;

    const count = window.matchMedia('(max-width: 780px)').matches ? 12 : 24;
    for (let i = 0; i < count; i += 1) {
      const ember = document.createElement('i');
      const seed = (i * 37 + sectionIndex * 19) % 100;
      ember.className = i % 6 === 0 ? 'ash' : (i % 3 === 0 ? 'spark' : 'ember');
      ember.style.setProperty('--x', `${2 + (seed * 0.96)}%`);
      ember.style.setProperty('--delay', `${-((i * 0.73 + sectionIndex) % 11)}s`);
      ember.style.setProperty('--duration', `${7.2 + ((i * 11) % 46) / 10}s`);
      ember.style.setProperty('--size', `${1.5 + ((i * 7) % 5)}px`);
      ember.style.setProperty('--drift', `${-48 + ((i * 29 + sectionIndex * 13) % 96)}px`);
      ember.style.setProperty('--sway', `${-16 + ((i * 17) % 32)}px`);
      ember.style.setProperty('--alpha', `${0.34 + ((i * 9) % 38) / 100}`);
      layer.appendChild(ember);
    }
    section.prepend(layer);
    section.prepend(decor);
  });
})();
