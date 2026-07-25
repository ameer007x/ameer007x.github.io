(() => {
  const data = window.V8_SITE_DATA || { characters: [], features: [] };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const siteLoader = $('#siteLoader');
  const topbar = $('#topbar');
  const menuButton = $('#menuButton');
  const mainNav = $('#mainNav');

  window.addEventListener('load', () => {
    window.setTimeout(() => siteLoader?.classList.add('is-hidden'), 450);
  });

  window.addEventListener('scroll', () => {
    topbar?.classList.toggle('is-scrolled', window.scrollY > 20);
  }, { passive: true });

  if (menuButton && mainNav) {
    menuButton.addEventListener('click', () => {
      const open = !mainNav.classList.contains('is-open');
      mainNav.classList.toggle('is-open', open);
      menuButton.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
    });

    $$('a', mainNav).forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        menuButton.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  const sections = $$('main section[id]');
  const navLinks = $$('.main-nav a');
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
  sections.forEach(section => navObserver.observe(section));

  const hero = $('.hero');
  const heroBg = $('.hero__background');
  if (hero && heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hero.addEventListener('pointermove', event => {
      const x = (event.clientX / window.innerWidth - 0.5) * 12;
      const y = (event.clientY / window.innerHeight - 0.5) * 8;
      heroBg.style.transform = `scale(1.05) translate(${x}px, ${y}px)`;
    });
    hero.addEventListener('pointerleave', () => {
      heroBg.style.transform = 'scale(1.04)';
    });
  }

  // ------------------------------------------------------------
  // Character showcase
  // ------------------------------------------------------------
  const characterStage = $('#characterStage');
  const characterCopy = $('#characterCopy');
  const characterArtWrap = $('#characterArtWrap');
  const characterArt = $('#characterArt');
  const characterRail = $('#characterRail');
  const characterName = $('#characterName');
  const characterVehicle = $('#characterVehicle');
  const characterSubtitle = $('#characterSubtitle');
  const characterDescription = $('#characterDescription');
  const characterIndex = $('#characterIndex');
  const characterTotal = $('#characterTotal');
  const characterMobileLabel = $('#characterMobileLabel');
  const characterBackdropWord = $('#characterBackdropWord');
  const skillList = $('#skillList');

  let activeCharacter = 0;
  let characterLocked = false;

  const pad2 = n => String(n).padStart(2, '0');

  function buildCharacterRail() {
    if (!characterRail || !data.characters.length) return;
    characterRail.innerHTML = data.characters.map((character, index) => `
      <button class="character-thumb${index === 0 ? ' is-active' : ''}" type="button" data-character-index="${index}" aria-label="Show ${character.name}">
        <img src="${character.art}" alt="">
        <span>${pad2(index + 1)}</span>
      </button>
    `).join('');

    $$('.character-thumb', characterRail).forEach(button => {
      button.addEventListener('click', () => showCharacter(Number(button.dataset.characterIndex)));
    });
  }

  function renderSkills(skills = []) {
    if (!skillList) return;
    skillList.innerHTML = skills.map(skill => `
      <article class="skill-item">
        <div class="skill-item__icon">${skill.icon || 'V8'}</div>
        <div>
          <h3>${skill.title || ''}</h3>
          <p>${skill.text || ''}</p>
        </div>
      </article>
    `).join('');
  }

  function applyCharacter(character, index) {
    if (!character) return;
    characterStage?.style.setProperty('--char-accent', character.accent || '#ff3d21');
    characterStage?.style.setProperty('--char-accent-2', character.accent2 || '#ffc400');
    if (characterName) characterName.textContent = character.name;
    if (characterVehicle) characterVehicle.textContent = character.vehicle;
    if (characterSubtitle) characterSubtitle.textContent = character.subtitle;
    if (characterDescription) characterDescription.textContent = character.description;
    if (characterIndex) characterIndex.textContent = pad2(index + 1);
    if (characterTotal) characterTotal.textContent = pad2(data.characters.length);
    if (characterMobileLabel) characterMobileLabel.textContent = `${pad2(index + 1)} / ${pad2(data.characters.length)}`;
    if (characterBackdropWord) characterBackdropWord.textContent = character.vehicle;
    if (characterArt) {
      characterArt.src = character.art;
      characterArt.alt = `${character.name} character art`;
    }
    renderSkills(character.skills);

    $$('.character-thumb', characterRail).forEach((thumb, thumbIndex) => {
      thumb.classList.toggle('is-active', thumbIndex === index);
    });

    const nextCharacter = data.characters[(index + 1) % data.characters.length];
    if (nextCharacter?.art) {
      const preload = new Image();
      preload.src = nextCharacter.art;
    }
  }

  function showCharacter(index, direction = 0) {
    if (!data.characters.length || characterLocked) return;
    const normalized = (index + data.characters.length) % data.characters.length;
    if (normalized === activeCharacter && direction === 0) return;

    characterLocked = true;
    characterCopy?.classList.add('is-out');
    characterArtWrap?.classList.add('is-out');

    window.setTimeout(() => {
      activeCharacter = normalized;
      applyCharacter(data.characters[activeCharacter], activeCharacter);

      characterCopy?.classList.remove('is-out');
      characterArtWrap?.classList.remove('is-out');
      characterCopy?.classList.remove('is-in');
      characterArtWrap?.classList.remove('is-in');
      void characterCopy?.offsetWidth;
      void characterArtWrap?.offsetWidth;
      characterCopy?.classList.add('is-in');
      characterArtWrap?.classList.add('is-in');

      window.setTimeout(() => {
        characterLocked = false;
      }, 520);
    }, 180);
  }

  function nextCharacter() { showCharacter(activeCharacter + 1, 1); }
  function prevCharacter() { showCharacter(activeCharacter - 1, -1); }

  buildCharacterRail();
  if (data.characters.length) applyCharacter(data.characters[0], 0);

  ['#characterNext', '#characterNextMobile'].forEach(selector => $(selector)?.addEventListener('click', nextCharacter));
  ['#characterPrev', '#characterPrevMobile'].forEach(selector => $(selector)?.addEventListener('click', prevCharacter));

  let wheelAccumulator = 0;
  let wheelTimer = null;
  characterStage?.addEventListener('wheel', event => {
    if (window.innerWidth < 901 || characterLocked) return;
    const rect = characterStage.getBoundingClientRect();
    const fullyEngaged = rect.top <= 100 && rect.bottom >= window.innerHeight - 100;
    if (!fullyEngaged) return;

    wheelAccumulator += event.deltaY;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { wheelAccumulator = 0; }, 220);

    if (Math.abs(wheelAccumulator) > 90) {
      if (wheelAccumulator > 0 && activeCharacter < data.characters.length - 1) {
        event.preventDefault();
        nextCharacter();
      } else if (wheelAccumulator < 0 && activeCharacter > 0) {
        event.preventDefault();
        prevCharacter();
      }
      wheelAccumulator = 0;
    }
  }, { passive: false });

  characterStage?.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextCharacter();
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') prevCharacter();
  });

  let touchStartX = 0;
  characterStage?.addEventListener('touchstart', event => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  characterStage?.addEventListener('touchend', event => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) < 50) return;
    delta < 0 ? nextCharacter() : prevCharacter();
  }, { passive: true });

  // ------------------------------------------------------------
  // Tutorial tabs and modal
  // ------------------------------------------------------------
  const tutorialTabs = $$('[data-tutorial-tab]');
  const tutorialCards = $$('.tutorial-card');

  function filterTutorials(level) {
    tutorialCards.forEach(card => {
      const visible = level === 'beginner'
        ? true
        : card.dataset.level === level;
      card.classList.toggle('is-hidden', !visible);
    });
  }

  tutorialTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tutorialTabs.forEach(item => item.classList.toggle('is-active', item === tab));
      filterTutorials(tab.dataset.tutorialTab);
    });
  });

  const mediaModal = $('#mediaModal');
  const mediaModalClose = $('#mediaModalClose');

  function openMediaModal() {
    mediaModal?.classList.add('is-open');
    mediaModal?.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeMediaModal() {
    mediaModal?.classList.remove('is-open');
    mediaModal?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  $$('.tutorial-card button').forEach(button => button.addEventListener('click', openMediaModal));
  mediaModalClose?.addEventListener('click', closeMediaModal);
  mediaModal?.addEventListener('click', event => {
    if (event.target === mediaModal) closeMediaModal();
  });
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMediaModal();
  });

  // ------------------------------------------------------------
  // Feature slider built from site-data.js
  // ------------------------------------------------------------
  const featureTrack = $('#featureTrack');

  function buildFeatures() {
    if (!featureTrack) return;
    featureTrack.innerHTML = data.features.map((feature, index) => `
      <article class="feature-card">
        <div class="feature-card__media">
          <img src="${feature.media}" alt="${feature.title} media">
          <span class="feature-card__index">${pad2(index + 1)}</span>
        </div>
        <div class="feature-card__body">
          <h3>${feature.title}</h3>
          <p>${feature.text}</p>
          <span class="feature-card__tag">PNG / JPG / WEBP / GIF</span>
        </div>
      </article>
    `).join('');
  }

  buildFeatures();

  function slideFeatures(direction) {
    if (!featureTrack) return;
    const card = $('.feature-card', featureTrack);
    const amount = (card?.getBoundingClientRect().width || 520) + 22;
    featureTrack.scrollBy({ left: amount * direction, behavior: 'smooth' });
  }

  $('#featurePrev')?.addEventListener('click', () => slideFeatures(-1));
  $('#featureNext')?.addEventListener('click', () => slideFeatures(1));
})();
