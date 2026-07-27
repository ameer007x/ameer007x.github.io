(() => {
  'use strict';

  const data = window.V8_SITE_DATA;
  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const delay = milliseconds => new Promise(resolve => window.setTimeout(resolve, milliseconds));
  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

  /* --------------------------------------------------------------------------
     Header
  -------------------------------------------------------------------------- */
  const topbar = q('#topbar');
  const navToggle = q('#navToggle');
  const mainNav = q('#mainNav');
  let headerTicking = false;

  const updateHeader = () => {
    headerTicking = false;
    topbar?.classList.toggle('is-compact', window.scrollY > 48);
  };

  const requestHeaderUpdate = () => {
    if (headerTicking) return;
    headerTicking = true;
    window.requestAnimationFrame(updateHeader);
  };

  updateHeader();
  window.addEventListener('scroll', requestHeaderUpdate, { passive: true });

  navToggle?.addEventListener('click', () => {
    const open = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  qa('.main-nav a').forEach(link => link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }));

  /* --------------------------------------------------------------------------
     News & Features cinematic carousel
  -------------------------------------------------------------------------- */
  const newsCollections = {
    news: [
      { image: 'assets/news/legacy-arrives.svg', eyebrow: 'PROJECT NEWS', title: 'Original Vigilante 8 vehicles join the Unity roster', date: '2026.07.25' },
      { image: 'assets/news/team-battle.svg', eyebrow: 'PROJECT NEWS', title: 'Online road wars enter a new testing phase', date: '2026.07.25' },
      { image: 'assets/news/special-weapons.svg', eyebrow: 'PROJECT NEWS', title: 'Development report: the legacy arsenal expands', date: '2026.07.25' }
    ],
    update: [
      { image: 'assets/news/team-battle.svg', eyebrow: 'NEW UPDATE', title: 'Team modes, lobby systems and online improvements', date: '2026.07.25' },
      { image: 'assets/news/legacy-arrives.svg', eyebrow: 'NEW UPDATE', title: 'Vehicle balance and survival progression refined', date: '2026.07.25' },
      { image: 'assets/news/special-weapons.svg', eyebrow: 'NEW UPDATE', title: 'Interface, audio and stability pass now in testing', date: '2026.07.25' }
    ],
    feature: [
      { image: 'assets/news/special-weapons.svg', eyebrow: 'NEW FEATURE', title: 'Classic special weapons rebuilt with new systems', date: '2026.07.25' },
      { image: 'assets/news/team-battle.svg', eyebrow: 'NEW FEATURE', title: 'Competitive team battles with custom match rules', date: '2026.07.25' },
      { image: 'assets/news/legacy-arrives.svg', eyebrow: 'NEW FEATURE', title: 'Twenty-seven driver and vehicle profiles prepared', date: '2026.07.25' }
    ]
  };

  const newsTrack = q('#newsTrack');
  const newsDots = q('#newsDots');
  const newsPrev = q('#newsPrev');
  const newsNext = q('#newsNext');
  let activeNewsFilter = 'news';
  let activeNewsIndex = 1;
  const newsIndexes = { news: 1, update: 1, feature: 1 };

  function renderNewsCarousel({ replay = true } = {}) {
    if (!newsTrack) return;
    const collection = newsCollections[activeNewsFilter] || [];
    activeNewsIndex = clamp(activeNewsIndex, 0, Math.max(0, collection.length - 1));
    newsIndexes[activeNewsFilter] = activeNewsIndex;

    newsTrack.innerHTML = collection.map((item, index) => {
      const relative = index - activeNewsIndex;
      let positionClass = 'is-far-right';
      if (relative === 0) positionClass = 'is-current';
      else if (relative === -1) positionClass = 'is-prev';
      else if (relative === 1) positionClass = 'is-next';
      else if (relative < -1) positionClass = 'is-far-left';
      return `
        <article class="news-slide ${positionClass}" data-news-index="${index}" aria-hidden="${relative !== 0}">
          <div class="news-shot-frame">
            <img src="${item.image}" alt="${item.title}" decoding="async">
            <div class="news-shot-sheen"></div>
          </div>
          <div class="news-slide-caption">
            <span>${item.eyebrow}</span>
            <h3>${item.title}</h3>
            <time>${item.date}</time>
          </div>
        </article>`;
    }).join('');

    qa('.news-slide', newsTrack).forEach(slide => {
      slide.addEventListener('click', () => {
        const index = Number(slide.dataset.newsIndex);
        if (Number.isFinite(index) && index !== activeNewsIndex) setNewsIndex(index);
      });
    });

    if (newsDots) {
      newsDots.innerHTML = collection.map((_, index) => `
        <button type="button" class="${index === activeNewsIndex ? 'is-active' : ''}" data-news-dot="${index}" aria-label="Show item ${index + 1}"></button>
      `).join('');
      qa('[data-news-dot]', newsDots).forEach(dot => dot.addEventListener('click', () => setNewsIndex(Number(dot.dataset.newsDot))));
    }

    if (newsPrev) newsPrev.disabled = activeNewsIndex <= 0;
    if (newsNext) newsNext.disabled = activeNewsIndex >= collection.length - 1;

    if (replay) {
      const current = q('.news-slide.is-current', newsTrack);
      current?.classList.remove('news-slide-enter');
      void current?.offsetWidth;
      current?.classList.add('news-slide-enter');
    }
  }

  function setNewsIndex(index) {
    const collection = newsCollections[activeNewsFilter] || [];
    const next = clamp(index, 0, Math.max(0, collection.length - 1));
    if (next === activeNewsIndex) return;
    activeNewsIndex = next;
    renderNewsCarousel();
  }

  function applyNewsFilter(filter) {
    if (!newsCollections[filter]) return;
    activeNewsFilter = filter;
    activeNewsIndex = newsIndexes[filter] || 0;
    qa('[data-news-filter]').forEach(item => item.classList.toggle('is-active', item.dataset.newsFilter === filter));
    renderNewsCarousel();
  }

  qa('[data-news-filter]').forEach(button => button.addEventListener('click', () => applyNewsFilter(button.dataset.newsFilter)));
  newsPrev?.addEventListener('click', () => setNewsIndex(activeNewsIndex - 1));
  newsNext?.addEventListener('click', () => setNewsIndex(activeNewsIndex + 1));
  applyNewsFilter('news');

  /* --------------------------------------------------------------------------
     Driver selector
  -------------------------------------------------------------------------- */
  const drivers = data.drivers;
  const AUTO_DELAY = 15000;
  const VISIBLE_THUMBS = 4;

  /*
    V21 fine composition pass:
    - portraits can shift right per driver without entering the selector lane;
    - First Offense requested vehicles retain the 25% enlargement, with per-driver extras;
    - Second Offense secondary vehicles stay above the base vehicle and receive precise local tuning;
    - labels identify the stock and upgraded variants.
  */
  const DRIVER_ART_INSETS = Array(31).fill(0);
  const LARGE_FIRST_OFFENSE_VEHICLES = new Set([2, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const VEHICLE_GROUP_OFFSETS = [
    [0,0], [-20,0], [-10,0], [-55,0], [-30,0], [-55,0], [-25,0], [-25,0], [-30,0], [-35,0], [-25,0], [-15,0], [0,0],
    [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0]
  ];
  const DRIVER_TUNE = {
    2:  { artX: 4, primaryX: -14, primaryY: 102, primaryScaleMult: 1.10 },
    3:  { primaryX: -62, primaryScaleMult: 1.18 },
    4:  { artX: 10, primaryX: 0, primaryY: 180 },
    5:  { artX: 30, primaryX: -18, primaryScaleMult: 1.07 },
    6:  { artX: -4, primaryX: -18, primaryScaleMult: 1.18 },
    7:  { artX: 38, artScale: 0.95, primaryX: -24, primaryY: 92 },
    8:  { artX: 32, primaryX: -18, primaryScaleMult: 1.08 },
    9:  { artX: 12, primaryX: -24, primaryY: 86 },
    10: { artX: 8, artScale: 0.95, primaryX: -24, primaryScaleMult: 1.15 },
    11: { artX: 16, primaryX: -20, primaryY: 120 },
    12: { artX: -4, primaryScaleMult: 0.95 },
    13: { artX: -18, primaryScaleMult: 1.15, primaryY: 26 },
    14: { secondaryY: 14 },
    15: { artX: 14 },
    16: { groupX: -12 },
    17: { secondaryY: 14 },
    18: { secondaryY: 14 },
    19: { primaryScale: 1.10, secondaryY: 24 },
    20: { primaryScale: 0.90, secondaryScale: 0.72, secondaryY: 14 },
    22: { secondaryY: 28 },
    23: { secondaryY: 14, secondaryX: 10 },
    24: { secondaryY: 14 },
    26: { secondaryScale: 0.70, secondaryY: 24 },
    27: { artX: 32, artScale: 0.70, groupX: -24, secondaryY: 40 },
    28: { secondaryY: 24 },
    29: { primaryY: 84, secondaryY: 84 },
    30: { secondaryY: 28 },
    31: { secondaryY: 28, secondaryX: -10 }
  };
  let driverIndex = 0;
  let driverChanging = false;
  let autoChangeId = 0;
  let driverSceneActive = false;
  const DRIVER_AUTO_STORAGE_KEY = 'v8-driver-auto-enabled';
  let driverAutoEnabled = true;
  try { driverAutoEnabled = window.localStorage.getItem(DRIVER_AUTO_STORAGE_KEY) !== 'false'; }
  catch (_) { driverAutoEnabled = true; }

  const driverName = q('#driverName');
  const driverKicker = q('#driverKicker');
  const driverVehicle = q('#driverVehicle');
  const driverTagline = q('#driverTagline');
  const driverGhost = q('#driverGhost');
  const driverArt = q('#driverArt');
  const driverBackdropArt = q('#driverBackdropArt');
  const driverArtWrap = q('#driverArtWrap');
  const driverVehicleArt = q('#driverVehicleArt');
  const driverColorWorld = q('#driverColorWorld');
  const driverCopy = q('#driverCopy');
  const skillList = q('#skillList');
  const driverThumbs = q('#driverThumbs');
  const driverIndexEl = q('#driverIndex');
  const driverTotal = q('#driverTotal');
  const autoTimer = q('#autoTimer');
  const driverProgress = q('#driverProgress');
  const driverAutoToggle = q('#driverAutoToggle');
  const driverAutoText = q('#driverAutoText');
  const driverAutoDelay = q('#driverAutoDelay');

  if (driverTotal) driverTotal.textContent = String(drivers.length).padStart(2, '0');

  const wrapIndex = index => (index + drivers.length) % drivers.length;

  function driverFactionClass(faction = '') {
    const value = faction.toUpperCase();
    if (value.includes('VIGILANTE')) return 'faction-vigilante';
    if (value.includes('COYOTE')) return 'faction-coyote';
    if (value.includes('DRIFTER')) return 'faction-drifter';
    return 'faction-secret';
  }

  function driverKickerMarkup(driver) {
    return `<span class="driver-game-label">${driver.game}</span><span class="driver-kicker-separator"> • </span><span class="driver-faction ${driverFactionClass(driver.faction)}">${driver.faction}</span>`;
  }

  function updateDriverAutoUi() {
    driverProgress?.classList.toggle('is-auto-off', !driverAutoEnabled);
    driverAutoToggle?.classList.toggle('is-on', driverAutoEnabled);
    driverAutoToggle?.classList.toggle('is-off', !driverAutoEnabled);
    driverAutoToggle?.setAttribute('aria-pressed', String(driverAutoEnabled));
    driverAutoToggle?.setAttribute('aria-label', driverAutoEnabled ? 'Turn automatic driver changes off' : 'Turn automatic driver changes on');
    if (driverAutoToggle) driverAutoToggle.title = `Automatic driver changes: ${driverAutoEnabled ? 'on' : 'off'}`;
    if (driverAutoText) driverAutoText.textContent = driverAutoEnabled ? 'AUTO ON' : 'AUTO OFF';
    if (driverAutoDelay) driverAutoDelay.textContent = driverAutoEnabled ? '15 SEC' : 'PAUSED';
  }

  function restartTimerAnimation() {
    if (!autoTimer) return;
    autoTimer.style.animation = 'none';
    autoTimer.style.transform = 'scaleX(0)';
    void autoTimer.offsetWidth;
    if (!driverAutoEnabled) return;
    autoTimer.style.transform = '';
    autoTimer.style.animation = '';
  }

  function stopAutoChange() {
    window.clearInterval(autoChangeId);
    autoChangeId = 0;
  }

  function startAutoChange() {
    stopAutoChange();
    if (!driverAutoEnabled || !driverSceneActive || document.hidden || q('#profileModal')?.classList.contains('is-open')) return;
    restartTimerAnimation();
    autoChangeId = window.setInterval(() => {
      setDriver(driverIndex + 1, { automatic: true });
    }, AUTO_DELAY);
  }

  function buildVisibleThumbs() {
    if (!driverThumbs) return;
    driverThumbs.innerHTML = '';
    const start = driverIndex;

    for (let offset = 0; offset < VISIBLE_THUMBS; offset += 1) {
      const index = wrapIndex(start + offset);
      const driver = drivers[index];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'driver-thumb';
      button.classList.toggle('is-active', index === driverIndex);
      button.title = `${String(index + 1).padStart(2, '0')} — ${driver.name} — ${driver.game}`;
      button.setAttribute('aria-label', `Show ${driver.name}`);
      button.innerHTML = `
        <img src="${driver.avatar}" alt="${driver.name}" decoding="async">
        <span class="driver-thumb-index">${String(index + 1).padStart(2, '0')}</span>
      `;
      button.addEventListener('click', () => setDriver(index, { manual: true }));
      driverThumbs.appendChild(button);
    }
  }

  function renderSkills(driver) {
    if (!skillList) return;
    skillList.innerHTML = driver.skills.map((skill, index) => {
      const kind = skill.kind === 'driver' ? 'is-driver' : 'is-weapon';
      const alt = skill.kind === 'driver' ? `${driver.name} portrait` : `${driver.specialWeapon} weapon`;
      return `
        <article class="skill" style="animation-delay:${index * 0.11}s">
          <span class="skill-icon ${kind}">
            <img src="${skill.icon || 'assets/tutorial/specials.svg'}" alt="${alt}" decoding="async">
          </span>
          <div>
            <h4>${skill.title}</h4>
            <p>${skill.text}</p>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderDriverVehicles(driver) {
    if (!driverVehicleArt) return;
    const vehicles = Array.isArray(driver.vehicles) ? driver.vehicles : [];
    const isSecondOffensePair = vehicles.length > 1;
    const vehicleMarkup = vehicles.map((source, index) => `
      <img class="driver-vehicle-image ${index === 0 ? 'vehicle-primary' : 'vehicle-secondary'}"
           src="${source}" alt="" decoding="async" loading="eager"
           style="animation-delay:${index * 0.08}s">
    `).join('');
    const labels = isSecondOffensePair ? `
      <span class="driver-vehicle-label label-primary">WITHOUT UPGRADE</span>
      <span class="driver-vehicle-label label-secondary">UPGRADED</span>
    ` : '';
    driverVehicleArt.innerHTML = vehicleMarkup + labels;
    driverVehicleArt.classList.toggle('has-two-vehicles', isSecondOffensePair);
  }

  function applyDriver(index, { replay = true } = {}) {
    driverIndex = wrapIndex(index);
    const driver = drivers[driverIndex];

    document.documentElement.style.setProperty('--driver-accent', driver.accent);
    document.documentElement.style.setProperty('--driver-accent2', driver.accent2);
    document.documentElement.style.setProperty('--driver-accent3', driver.accent3 || driver.accent);
    document.documentElement.style.setProperty('--progress', `${((driverIndex + 1) / drivers.length) * 100}%`);

    const visualNumber = driverIndex + 1;
    const tune = DRIVER_TUNE[visualNumber] || {};
    const [baseVehicleShiftX, baseVehicleShiftY] = VEHICLE_GROUP_OFFSETS[driverIndex] || [0, 0];
    const vehicleShiftX = baseVehicleShiftX + (tune.groupX || 0);
    const vehicleShiftY = baseVehicleShiftY + (tune.groupY || 0);
    const basePrimaryScale = LARGE_FIRST_OFFENSE_VEHICLES.has(visualNumber) ? 1.25 : 1;
    const primaryScale = Number.isFinite(tune.primaryScale) ? tune.primaryScale : basePrimaryScale * (tune.primaryScaleMult || 1);
    const secondaryScale = Number.isFinite(tune.secondaryScale) ? tune.secondaryScale : 0.95;

    driverArtWrap?.style.setProperty('--driver-art-inset', `${DRIVER_ART_INSETS[driverIndex] || 0}px`);
    driverArtWrap?.style.setProperty('--driver-art-shift-x', `${tune.artX || 0}px`);
    driverArtWrap?.style.setProperty('--driver-art-scale', `${tune.artScale || 1}`);
    driverArtWrap?.style.setProperty('--driver-wrap-right-adjust', `${driverIndex < 13 ? 34 : 0}px`);
    driverVehicleArt?.style.setProperty('--vehicle-group-shift-x', `${vehicleShiftX}px`);
    driverVehicleArt?.style.setProperty('--vehicle-group-shift-y', `${vehicleShiftY}px`);
    driverVehicleArt?.style.setProperty('--vehicle-primary-scale', `${primaryScale}`);
    driverVehicleArt?.style.setProperty('--vehicle-primary-x', `${tune.primaryX || 0}px`);
    driverVehicleArt?.style.setProperty('--vehicle-primary-y', `${tune.primaryY || 0}px`);
    driverVehicleArt?.style.setProperty('--vehicle-secondary-scale', `${secondaryScale}`);
    driverVehicleArt?.style.setProperty('--vehicle-secondary-x', `${tune.secondaryX || 0}px`);
    driverVehicleArt?.style.setProperty('--vehicle-secondary-y', `${tune.secondaryY || 0}px`);

    if (driverName) driverName.textContent = driver.name;
    if (driverKicker) driverKicker.innerHTML = driverKickerMarkup(driver);
    if (driverVehicle) driverVehicle.textContent = driver.vehicle;
    if (driverTagline) driverTagline.textContent = driver.tagline;
    if (driverGhost) driverGhost.textContent = driver.name.replace(/\s+/g, ' ');
    if (driverArt) {
      driverArt.src = driver.image;
      driverArt.alt = driver.name;
    }
    if (driverBackdropArt) driverBackdropArt.src = driver.backgroundImage || driver.image;
    if (driverIndexEl) driverIndexEl.textContent = String(driverIndex + 1).padStart(2, '0');
    renderSkills(driver);
    renderDriverVehicles(driver);
    buildVisibleThumbs();

    driverArtWrap?.classList.remove('is-exiting');
    driverColorWorld?.classList.remove('is-exiting');
    driverCopy?.classList.remove('is-exiting');
    driverVehicleArt?.classList.remove('is-exiting');

    if (replay) {
      [driverArt, driverBackdropArt, driverColorWorld, driverCopy, driverVehicleArt].forEach(element => {
        if (!element) return;
        element.style.animation = 'none';
        void element.offsetWidth;
        element.style.animation = '';
      });
    }

    driverChanging = false;
    if (driverSceneActive && driverAutoEnabled) restartTimerAnimation();
  }

  function setDriver(next, options = {}) {
    const target = wrapIndex(next);
    if (driverChanging || (target === driverIndex && !options.instant)) {
      if (options.manual) startAutoChange();
      return;
    }

    driverChanging = true;
    if (options.instant) {
      applyDriver(target);
    } else {
      driverArtWrap?.classList.add('is-exiting');
      driverColorWorld?.classList.add('is-exiting');
      driverCopy?.classList.add('is-exiting');
      driverVehicleArt?.classList.add('is-exiting');
      window.setTimeout(() => applyDriver(target), 390);
    }

    if (options.manual) startAutoChange();
  }

  q('#driverPrev')?.addEventListener('click', () => setDriver(driverIndex - 1, { manual: true }));
  q('#driverNext')?.addEventListener('click', () => setDriver(driverIndex + 1, { manual: true }));

  driverAutoToggle?.addEventListener('click', () => {
    driverAutoEnabled = !driverAutoEnabled;
    try { window.localStorage.setItem(DRIVER_AUTO_STORAGE_KEY, String(driverAutoEnabled)); }
    catch (_) { /* Storage can be unavailable in strict privacy modes. */ }
    updateDriverAutoUi();
    if (driverAutoEnabled) startAutoChange();
    else {
      stopAutoChange();
      restartTimerAnimation();
    }
  });

  updateDriverAutoUi();
  const requestedDriver = Number.parseInt(new URLSearchParams(window.location.search).get('driver') || '1', 10);
  setDriver(Number.isFinite(requestedDriver) ? Math.min(Math.max(requestedDriver, 1), drivers.length) - 1 : 0, { instant: true });

  /* --------------------------------------------------------------------------
     Driver profile modal
  -------------------------------------------------------------------------- */
  const modal = q('#profileModal');

  q('#viewProfile')?.addEventListener('click', () => {
    const driver = drivers[driverIndex];
    q('#modalImage').src = driver.image;
    q('#modalImage').alt = driver.name;
    q('#profileTitle').textContent = driver.name;
    q('#modalKicker').innerHTML = driverKickerMarkup(driver);
    q('#modalVehicle').textContent = driver.vehicle;
    q('#modalSpecial').textContent = `SPECIAL WEAPON: ${driver.specialWeapon}`;
    q('#modalDescription').textContent = driver.description;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    stopAutoChange();
  });

  function closeModal() {
    modal?.classList.remove('is-open');
    modal?.setAttribute('aria-hidden', 'true');
    startAutoChange();
  }

  q('#modalClose')?.addEventListener('click', closeModal);
  modal?.addEventListener('click', event => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal?.classList.contains('is-open')) closeModal();
  });

  /* --------------------------------------------------------------------------
     Map selector
  -------------------------------------------------------------------------- */
  const maps = data.maps || [];
  const MAP_AUTO_DELAY = 7000;
  const MAP_VISIBLE_THUMBS = 4;
  let mapIndex = 0;
  let mapChanging = false;
  let mapAutoId = 0;
  let mapSceneActive = false;

  const mapBackground = q('#mapBackground');
  const mapMiniImage = q('#mapMiniImage');
  const mapGame = q('#mapGame');
  const mapName = q('#mapName');
  const mapLocation = q('#mapLocation');
  const mapDescription = q('#mapDescription');
  const mapGhost = q('#mapGhost');
  const mapStats = q('#mapStats');
  const mapInfoCard = q('#mapInfoCard');
  const mapHighlight = q('#mapHighlight');
  const mapHighlightTitle = q('#mapHighlightTitle');
  const mapHighlightText = q('#mapHighlightText');
  const mapThumbs = q('#mapThumbs');
  const mapIndexElement = q('#mapIndex');
  const mapTotal = q('#mapTotal');
  const mapAutoTimer = q('#mapAutoTimer');

  if (mapTotal) mapTotal.textContent = String(maps.length).padStart(2, '0');

  const wrapMapIndex = index => maps.length ? (index + maps.length) % maps.length : 0;

  function restartMapTimerAnimation() {
    if (!mapAutoTimer) return;
    mapAutoTimer.style.animation = 'none';
    void mapAutoTimer.offsetWidth;
    mapAutoTimer.style.animation = '';
  }

  function stopMapAuto() {
    window.clearInterval(mapAutoId);
    mapAutoId = 0;
  }

  function startMapAuto() {
    stopMapAuto();
    if (!mapSceneActive || document.hidden || maps.length < 2) return;
    restartMapTimerAnimation();
    mapAutoId = window.setInterval(() => setMap(mapIndex + 1, { automatic: true }), MAP_AUTO_DELAY);
  }

  function buildMapThumbs() {
    if (!mapThumbs || !maps.length) return;
    mapThumbs.innerHTML = '';
    for (let offset = 0; offset < Math.min(MAP_VISIBLE_THUMBS, maps.length); offset += 1) {
      const index = wrapMapIndex(mapIndex + offset);
      const map = maps[index];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'map-thumb';
      button.classList.toggle('is-active', index === mapIndex);
      button.title = `${String(index + 1).padStart(2, '0')} — ${map.name}`;
      button.setAttribute('aria-label', `Show ${map.name}`);
      button.innerHTML = `<img src="${map.image}" alt="${map.name}" decoding="async">`;
      button.addEventListener('click', () => setMap(index, { manual: true }));
      mapThumbs.appendChild(button);
    }
  }

  function renderMapStats(map) {
    if (!mapStats) return;
    mapStats.innerHTML = (map.stats || []).map(stat => `
      <article><small>${stat.label}</small><strong>${stat.value}</strong></article>
    `).join('');
  }

  function applyMap(index, { replay = true } = {}) {
    if (!maps.length) return;
    mapIndex = wrapMapIndex(index);
    const map = maps[mapIndex];

    document.documentElement.style.setProperty('--map-accent', map.accent || '#ff7714');
    document.documentElement.style.setProperty('--map-accent2', map.accent2 || '#ffd31c');
    document.documentElement.style.setProperty('--map-accent3', map.accent3 || '#2a211b');
    document.documentElement.style.setProperty('--map-progress', `${((mapIndex + 1) / maps.length) * 100}%`);

    if (mapBackground) {
      mapBackground.src = map.image;
      mapBackground.alt = `${map.name} battlefield`;
    }
    if (mapMiniImage) {
      mapMiniImage.src = map.image;
      mapMiniImage.alt = `${map.name} preview`;
    }
    if (mapGame) mapGame.textContent = map.game || 'VIGILANTE 8';
    if (mapName) mapName.textContent = map.name;
    if (mapLocation) mapLocation.textContent = map.location;
    if (mapDescription) mapDescription.textContent = map.description;
    if (mapGhost) mapGhost.textContent = map.name;
    if (mapHighlightTitle) mapHighlightTitle.textContent = map.highlightTitle;
    if (mapHighlightText) mapHighlightText.textContent = map.highlightText;
    if (mapIndexElement) mapIndexElement.textContent = String(mapIndex + 1).padStart(2, '0');
    renderMapStats(map);
    buildMapThumbs();

    [mapBackground, mapInfoCard, mapHighlight].forEach(element => element?.classList.remove('is-exiting'));
    if (replay) [mapBackground, mapInfoCard, mapHighlight].forEach(restartElementAnimation);

    mapChanging = false;
    if (mapSceneActive) restartMapTimerAnimation();
  }

  function setMap(next, options = {}) {
    if (!maps.length) return;
    const target = wrapMapIndex(next);
    if (mapChanging || (target === mapIndex && !options.instant)) {
      if (options.manual) startMapAuto();
      return;
    }

    mapChanging = true;
    if (options.instant) {
      applyMap(target);
    } else {
      mapBackground?.classList.add('is-exiting');
      mapInfoCard?.classList.add('is-exiting');
      mapHighlight?.classList.add('is-exiting');
      window.setTimeout(() => applyMap(target), 390);
    }

    if (options.manual) startMapAuto();
  }

  q('#mapPrev')?.addEventListener('click', () => setMap(mapIndex - 1, { manual: true }));
  q('#mapNext')?.addEventListener('click', () => setMap(mapIndex + 1, { manual: true }));
  if (maps.length) setMap(0, { instant: true });

  /* --------------------------------------------------------------------------
     Tutorial cards
  -------------------------------------------------------------------------- */
  function renderTutorial(level) {
    const tutorialGrid = q('#tutorialGrid');
    if (!tutorialGrid) return;
    tutorialGrid.innerHTML = data.tutorial[level].map((item, index) => `
      <article class="tutorial-card" style="animation-delay:${index * 0.07}s">
        <img src="${item.image}" alt="${item.title}" loading="eager" decoding="async">
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

  /* --------------------------------------------------------------------------
     Ambient ash and section scenery
  -------------------------------------------------------------------------- */
  const ambientTargets = [
    q('.hero'),
    q('.news'),
    q('.tutorial'),
    q('.download'),
    q('.credits')
  ].filter(Boolean);

  ambientTargets.forEach((section, sectionIndex) => {
    if (section.querySelector(':scope > .v6-embers')) return;

    const layer = document.createElement('div');
    layer.className = 'v6-embers';
    layer.setAttribute('aria-hidden', 'true');

    const decor = document.createElement('div');
    decor.className = 'v8-scene-decor';
    decor.setAttribute('aria-hidden', 'true');
    const sceneNames = {
      home: 'ROAD WAR',
      news: 'NEWS & FEATURES',
      tutorial: 'COMBAT SCHOOL',
      download: 'DOWNLOAD',
      credits: 'CREDITS'
    };
    decor.innerHTML = `
      <span class="scene-panel"></span>
      <span class="scene-ghost">${sceneNames[section.id] || 'VIGILANTE 8'}</span>
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

  /* --------------------------------------------------------------------------
     Cinematic one-section-at-a-time navigation engine
  -------------------------------------------------------------------------- */
  const SCROLL_DURATION = 860;
  const SCENE_ANIMATION_TIME = 1180;
  const WHEEL_THRESHOLD = 34;
  const WHEEL_RELEASE_DELAY = 170;
  const POST_ANIMATION_COOLDOWN = 250;

  const scenes = qa('main > section');
  const navLinks = qa('.main-nav a');
  const sceneTransition = q('#sceneTransition');
  const sceneTransitionLabel = q('#sceneTransitionLabel');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cinematicQuery = window.matchMedia('(min-width: 901px) and (min-height: 680px)');

  let currentSceneIndex = 0;
  let sceneLocked = false;
  let wheelAccumulator = 0;
  let wheelResetId = 0;
  let ignoreWheelUntil = 0;
  let sceneScrollTicking = false;
  let sceneAnimationId = 0;

  scenes.forEach((section, index) => {
    section.classList.add('scene-section');
    section.dataset.sceneIndex = String(index);
    if (!section.id) section.id = `scene-${index + 1}`;
  });

  function cinematicEnabled() {
    return cinematicQuery.matches && !reducedMotionQuery.matches;
  }

  function sectionLabel(section) {
    const heading = section.querySelector('h2, .poster-title, .section-heading h2');
    return (heading?.textContent || section.id || 'VIGILANTE 8').replace(/\s+/g, ' ').trim();
  }

  function updateActiveNavigation(section) {
    navLinks.forEach(link => {
      const target = link.getAttribute('href');
      link.classList.toggle('active', target === `#${section.id}`);
    });
  }

  function restartElementAnimation(element) {
    if (!element) return;
    element.style.animation = 'none';
    void element.offsetWidth;
    element.style.animation = '';
  }

  function replaySceneDetails(section) {
    const revealItems = qa('[data-reveal]', section);
    revealItems.forEach((element, index) => {
      element.classList.remove('revealed');
      element.style.transitionDelay = `${Math.min(index * 110, 330)}ms`;
    });

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        revealItems.forEach(element => element.classList.add('revealed'));
      });
    });

    if (section.id === 'drivers') {
      applyDriver(driverIndex, { replay: true });
    }

    if (section.id === 'maps') {
      applyMap(mapIndex, { replay: true });
    }

    if (section.id === 'tutorial') {
      qa('.tutorial-card', section).forEach((card, index) => {
        card.style.animationDelay = `${120 + index * 85}ms`;
        restartElementAnimation(card);
      });
    }

  }

  function setSceneActive(index, { initial = false } = {}) {
    currentSceneIndex = clamp(index, 0, scenes.length - 1);
    const activeSection = scenes[currentSceneIndex];

    scenes.forEach((section, sectionIndex) => {
      const active = sectionIndex === currentSceneIndex;
      section.classList.toggle('scene-active', active);
      section.setAttribute('aria-current', active ? 'true' : 'false');
      if (!active) {
        section.classList.remove('scene-entering');
        qa('[data-reveal]', section).forEach(element => element.classList.remove('revealed'));
      }
    });

    document.body.dataset.sceneIndex = String(currentSceneIndex);
    document.body.classList.toggle('scene-at-start', currentSceneIndex === 0);
    document.body.classList.toggle('scene-at-end', currentSceneIndex === scenes.length - 1);
    updateActiveNavigation(activeSection);

    driverSceneActive = activeSection.id === 'drivers';
    if (driverSceneActive) startAutoChange();
    else stopAutoChange();

    mapSceneActive = activeSection.id === 'maps';
    if (mapSceneActive) startMapAuto();
    else stopMapAuto();

    window.clearTimeout(sceneAnimationId);
    activeSection.classList.remove('scene-entering');
    void activeSection.offsetWidth;
    activeSection.classList.add('scene-entering');
    replaySceneDetails(activeSection);

    sceneAnimationId = window.setTimeout(() => {
      activeSection.classList.remove('scene-entering');
    }, SCENE_ANIMATION_TIME + 250);

  }

  function nearestSceneIndex() {
    const marker = window.scrollY + window.innerHeight * 0.45;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    scenes.forEach((section, index) => {
      const center = section.offsetTop + section.offsetHeight * 0.5;
      const distance = Math.abs(center - marker);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  function targetScrollY(section) {
    const compactHeader = window.innerWidth <= 820 ? 56 : 58;
    const preferred = section.offsetTop - compactHeader;
    const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return clamp(preferred, 0, maximum);
  }

  function easeInOutCubic(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  function animateScrollTo(target, duration) {
    const start = window.scrollY;
    const distance = target - start;
    if (Math.abs(distance) < 2 || duration === 0) {
      window.scrollTo(0, target);
      return Promise.resolve();
    }

    return new Promise(resolve => {
      const startedAt = performance.now();

      function frame(now) {
        const progress = clamp((now - startedAt) / duration, 0, 1);
        window.scrollTo(0, start + distance * easeInOutCubic(progress));
        if (progress < 1) window.requestAnimationFrame(frame);
        else resolve();
      }

      window.requestAnimationFrame(frame);
    });
  }


  /* Load every section and every dynamic driver/map/tutorial image concurrently.
     Navigation never waits for decoding; assets are already warming from startup. */
  const preloadedSources = new Set();
  const preloadHandles = [];

  function collectImageSources(value, output = preloadedSources) {
    if (!value) return output;
    if (typeof value === 'string') {
      if (/\.(?:png|jpe?g|webp|gif|svg)(?:[?#].*)?$/i.test(value)) output.add(value);
      return output;
    }
    if (Array.isArray(value)) {
      value.forEach(item => collectImageSources(item, output));
      return output;
    }
    if (typeof value === 'object') {
      Object.values(value).forEach(item => collectImageSources(item, output));
    }
    return output;
  }

  function preloadAllSiteAssets() {
    qa('img').forEach((image, index) => {
      image.loading = 'eager';
      image.decoding = 'async';
      if ('fetchPriority' in image) image.fetchPriority = index < 3 ? 'high' : 'auto';
      const source = image.currentSrc || image.src;
      if (source) preloadedSources.add(source);
    });

    collectImageSources(data);

    preloadedSources.forEach(source => {
      const image = new Image();
      image.decoding = 'async';
      image.loading = 'eager';
      image.src = source;
      preloadHandles.push(image);
    });
  }

  function showSceneTransition(section, direction) {
    if (!sceneTransition) return;
    if (sceneTransitionLabel) sceneTransitionLabel.textContent = sectionLabel(section);
    sceneTransition.classList.remove('is-forward', 'is-backward');
    sceneTransition.classList.add(direction >= 0 ? 'is-forward' : 'is-backward');
    void sceneTransition.offsetWidth;
    sceneTransition.classList.add('is-active');
  }

  function hideSceneTransition() {
    sceneTransition?.classList.remove('is-active');
  }

  async function navigateToScene(index, { immediate = false } = {}) {
    const targetIndex = clamp(index, 0, scenes.length - 1);
    if (sceneLocked || targetIndex === currentSceneIndex) return;

    const targetSection = scenes[targetIndex];
    const direction = targetIndex > currentSceneIndex ? 1 : -1;
    sceneLocked = true;
    document.body.classList.add('scene-navigation-locked', 'scene-switching');
    showSceneTransition(targetSection, direction);

    const duration = immediate || reducedMotionQuery.matches ? 0 : SCROLL_DURATION;
    await animateScrollTo(targetScrollY(targetSection), duration);
    setSceneActive(targetIndex);
    await delay(reducedMotionQuery.matches ? 80 : SCENE_ANIMATION_TIME);

    hideSceneTransition();
    document.body.classList.remove('scene-switching');
    ignoreWheelUntil = performance.now() + POST_ANIMATION_COOLDOWN;
    sceneLocked = false;
    document.body.classList.remove('scene-navigation-locked');
  }

  function handleWheel(event) {
    if (!cinematicEnabled()) return;
    if (modal?.classList.contains('is-open')) return;
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

    event.preventDefault();
    if (sceneLocked || performance.now() < ignoreWheelUntil) return;

    wheelAccumulator += event.deltaY;
    window.clearTimeout(wheelResetId);
    wheelResetId = window.setTimeout(() => { wheelAccumulator = 0; }, WHEEL_RELEASE_DELAY);

    if (Math.abs(wheelAccumulator) < WHEEL_THRESHOLD) return;
    const direction = wheelAccumulator > 0 ? 1 : -1;
    wheelAccumulator = 0;
    navigateToScene(currentSceneIndex + direction);
  }

  window.addEventListener('wheel', handleWheel, { passive: false });

  function handleHashNavigation(event) {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;
    const hash = anchor.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = q(hash);
    const index = scenes.indexOf(target);
    if (index < 0) return;

    event.preventDefault();
    mainNav?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');

    if (cinematicEnabled()) navigateToScene(index);
    else target.scrollIntoView({ behavior: reducedMotionQuery.matches ? 'auto' : 'smooth', block: 'start' });
  }

  document.addEventListener('click', handleHashNavigation);

  function handleNativeSceneTracking() {
    if (sceneLocked || cinematicEnabled()) return;
    if (sceneScrollTicking) return;
    sceneScrollTicking = true;
    window.requestAnimationFrame(() => {
      sceneScrollTicking = false;
      const nearest = nearestSceneIndex();
      if (nearest !== currentSceneIndex) setSceneActive(nearest);
    });
  }

  window.addEventListener('scroll', handleNativeSceneTracking, { passive: true });

  function refreshCinematicMode() {
    const cinematic = cinematicEnabled();
    document.body.classList.toggle('scene-engine-ready', cinematic);
    document.documentElement.classList.toggle('scene-engine-ready', cinematic);
    document.body.classList.toggle('all-ambient-animations', cinematic);
    document.documentElement.classList.toggle('all-ambient-animations', cinematic);
    currentSceneIndex = nearestSceneIndex();
    setSceneActive(currentSceneIndex, { initial: true });
  }

  cinematicQuery.addEventListener?.('change', refreshCinematicMode);
  reducedMotionQuery.addEventListener?.('change', refreshCinematicMode);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoChange();
      stopMapAuto();
    } else {
      if (driverSceneActive) startAutoChange();
      if (mapSceneActive) startMapAuto();
    }
  });

  qa('main img').forEach(image => {
    image.decoding = 'async';
    image.loading = 'eager';
  });

  preloadAllSiteAssets();
  refreshCinematicMode();
})();
