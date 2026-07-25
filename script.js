(() => {
  const data = window.V8_SITE_DATA;
  const q = (s, el=document) => el.querySelector(s);
  const qa = (s, el=document) => [...el.querySelectorAll(s)];

  const navToggle=q('#navToggle'), mainNav=q('#mainNav');
  navToggle?.addEventListener('click',()=>{const open=mainNav.classList.toggle('is-open');navToggle.setAttribute('aria-expanded',open)});
  qa('.main-nav a').forEach(a=>a.addEventListener('click',()=>mainNav.classList.remove('is-open')));

  const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');revealObserver.unobserve(e.target)}}),{threshold:.12});
  qa('[data-reveal]').forEach(el=>revealObserver.observe(el));

  const sections=qa('main section[id]');
  const navLinks=qa('.main-nav a');
  const sectionObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-35% 0px -55% 0px'});
  sections.forEach(s=>sectionObserver.observe(s));

  qa('[data-news-filter]').forEach(btn=>btn.addEventListener('click',()=>{
    qa('[data-news-filter]').forEach(b=>b.classList.remove('is-active'));btn.classList.add('is-active');
    const f=btn.dataset.newsFilter;qa('.news-card').forEach(card=>card.classList.toggle('is-hidden',f!=='all'&&card.dataset.category!==f));
  }));

  let driverIndex=0, changing=false;
  const driverName=q('#driverName'),driverVehicle=q('#driverVehicle'),driverTagline=q('#driverTagline'),driverGhost=q('#driverGhost'),driverArt=q('#driverArt'),driverArtWrap=q('#driverArtWrap'),driverCopy=q('#driverCopy'),skillList=q('#skillList'),driverThumbs=q('#driverThumbs'),driverIndexEl=q('#driverIndex'),driverTotal=q('#driverTotal'),driversSection=q('#drivers');
  driverTotal.textContent=String(data.drivers.length).padStart(2,'0');

  function buildThumbs(){
    driverThumbs.innerHTML='';
    data.drivers.forEach((d,i)=>{const b=document.createElement('button');b.className='driver-thumb';b.title=d.name;b.innerHTML=`<img src="${d.avatar}" alt="${d.name}">`;b.addEventListener('click',()=>setDriver(i));driverThumbs.appendChild(b)});
  }
  function setDriver(next, instant=false){
    if(changing||next===driverIndex&&!instant)return; changing=true; next=(next+data.drivers.length)%data.drivers.length;
    const apply=()=>{
      driverIndex=next;const d=data.drivers[next];
      document.documentElement.style.setProperty('--driver-accent',d.accent);document.documentElement.style.setProperty('--driver-accent2',d.accent2);document.documentElement.style.setProperty('--progress',`${((next+1)/data.drivers.length)*100}%`);
      driverName.textContent=d.name;driverVehicle.textContent=d.vehicle;driverTagline.textContent=d.tagline;driverGhost.textContent=d.name.split(' ')[0];driverArt.src=d.image;driverArt.alt=d.name;driverIndexEl.textContent=String(next+1).padStart(2,'0');
      skillList.innerHTML=d.skills.map((s,i)=>`<article class="skill" style="animation-delay:${i*.1}s"><span class="skill-icon">${String(i+1).padStart(2,'0')}</span><div><h4>${s.title}</h4><p>${s.text}</p></div></article>`).join('');
      qa('.driver-thumb').forEach((t,i)=>t.classList.toggle('is-active',i===next));
      driverArtWrap.classList.remove('is-exiting');driverCopy.classList.remove('is-exiting');driverArt.style.animation='none';void driverArt.offsetWidth;driverArt.style.animation='';changing=false;
    };
    if(instant){apply();return}
    driverArtWrap.classList.add('is-exiting');driverCopy.classList.add('is-exiting');
    setTimeout(apply,340);
  }
  buildThumbs();setDriver(0,true);
  q('#driverPrev').addEventListener('click',()=>setDriver(driverIndex-1));q('#driverNext').addEventListener('click',()=>setDriver(driverIndex+1));
  let wheelLock=false;driversSection.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)<20||wheelLock)return;wheelLock=true;setDriver(driverIndex+(e.deltaY>0?1:-1));setTimeout(()=>wheelLock=false,650)},{passive:true});
  document.addEventListener('keydown',e=>{if(document.activeElement?.tagName==='INPUT')return;if(e.key==='ArrowRight')setDriver(driverIndex+1);if(e.key==='ArrowLeft')setDriver(driverIndex-1)});
  let touchX=0;driversSection.addEventListener('touchstart',e=>touchX=e.touches[0].clientX,{passive:true});driversSection.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>55)setDriver(driverIndex+(dx<0?1:-1))},{passive:true});

  const modal=q('#profileModal');
  q('#viewProfile').addEventListener('click',()=>{const d=data.drivers[driverIndex];q('#modalImage').src=d.image;q('#modalImage').alt=d.name;q('#profileTitle').textContent=d.name;q('#modalVehicle').textContent=d.vehicle;q('#modalDescription').textContent=d.description;modal.classList.add('is-open');modal.setAttribute('aria-hidden','false')});
  function closeModal(){modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true')}
  q('#modalClose').addEventListener('click',closeModal);modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

  let tutorialLevel='beginner';
  function renderTutorial(level){tutorialLevel=level;const items=data.tutorial[level];q('#tutorialGrid').innerHTML=items.map((it,i)=>`<article class="tutorial-card" style="animation-delay:${i*.07}s"><img src="${it.image}" alt="${it.title}"><h3>${it.title}</h3></article>`).join('')}
  qa('[data-tutorial]').forEach(btn=>btn.addEventListener('click',()=>{qa('[data-tutorial]').forEach(b=>b.classList.remove('is-active'));btn.classList.add('is-active');renderTutorial(btn.dataset.tutorial)}));renderTutorial('beginner');

  let featureIndex=0;
  const track=q('#featureTrack'),dots=q('#featureDots');
  function buildFeatures(){track.innerHTML=data.features.map((f,i)=>`<article class="feature-card"><img src="${f.image}" alt="${f.title}"><div class="feature-caption"><h3>${f.title}</h3><p>${f.text}</p></div></article>`).join('');dots.innerHTML=data.features.map((_,i)=>`<button aria-label="Feature ${i+1}"></button>`).join('');qa('button',dots).forEach((b,i)=>b.addEventListener('click',()=>setFeature(i)));setFeature(0,true)}
  function setFeature(next,instant=false){featureIndex=(next+data.features.length)%data.features.length;const cards=qa('.feature-card',track);cards.forEach((c,i)=>c.classList.toggle('is-active',i===featureIndex));qa('button',dots).forEach((d,i)=>d.classList.toggle('is-active',i===featureIndex));const card=cards[0];if(!card)return;const gap=25;const width=card.getBoundingClientRect().width+gap;const stage=q('.feature-stage').clientWidth;const offset=featureIndex*width-(stage-width)/2+60;track.style.transition=instant?'none':'';track.style.transform=`translateX(${-Math.max(0,offset)}px)`;if(instant)setTimeout(()=>track.style.transition='',20)}
  buildFeatures();q('#featurePrev').addEventListener('click',()=>setFeature(featureIndex-1));q('#featureNext').addEventListener('click',()=>setFeature(featureIndex+1));window.addEventListener('resize',()=>setFeature(featureIndex,true));
})();
