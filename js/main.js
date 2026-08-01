/* ══════════════════════════════════════════
   SNEHA JINDAL — PORTFOLIO v2 (award mode)
══════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);
document.body.classList.add('loading');

let lenis;

/* ─── 1. SMOOTH SCROLL ─── */
function initSmoothScroll(){
  lenis = new Lenis({ duration:1.15, easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)), smoothWheel:true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t*1000));
  gsap.ticker.lagSmoothing(0);
}

/* ─── 2. PRELOADER + 🆕 HERO NAME SCRAMBLE ─── */
function initPreloader(){
  const pre = document.getElementById('preloader');
  const fill = document.getElementById('preBarFill');
  const count = document.getElementById('preCount');
  let n = 0;

  const tick = setInterval(()=>{
    n += Math.random()*11;
    if(n >= 100){ n = 100; clearInterval(tick); finish(); }
    count.textContent = Math.floor(n);
    fill.style.width = n + '%';
  }, 90);

  function finish(){
    gsap.to(pre, {
      yPercent:-100, duration:1, ease:'power4.inOut', delay:.35,
      onComplete(){
        pre.style.display='none';
        document.body.classList.remove('loading');
        ScrollTrigger.refresh();
        scrambleHero();
      }
    });
          gsap.fromTo('.hero-title .w', 
      { yPercent:105 }, 
      { yPercent:0, duration:1.25, ease:'power4.out', stagger:.09, delay:.75 }
    );
    gsap.to('.hero-stats', { opacity:1, duration:1, ease:'power3.out', delay:1.1 });
    gsap.to('.hero-meta, .hero-photo, .hero-intro > *, .hero-sub, .scroll-hint',
      { opacity:1, y:0, duration:1, ease:'power3.out', stagger:.07, delay:1.15 });
    animateHeroStats();
  }
}
gsap.set('.hero-meta, .hero-photo, .hero-intro > *, .hero-sub, .scroll-hint', { opacity:0, y:24 });

/* 🆕 Text scramble on hero name */
function scrambleHero(){
  // Disabled — the yPercent animation is enough
  return;
}
/* 🆕 Animate hero counter numbers */
function animateHeroStats(){
  document.querySelectorAll('.hstat-num').forEach((el, idx) => {
    const target = parseInt(el.dataset.count, 10);
    gsap.to({v:0}, {
      v: target,
      duration: 1.6,
      ease: 'power2.out',
      delay: 1.4 + (idx * 0.12),
      onUpdate(){ el.textContent = Math.floor(this.targets()[0].v); }
    });
  });
}

/* ─── 3. CURSOR ─── */
function initCursor(){
  if(window.matchMedia('(hover: none)').matches) return;
  const cur = document.getElementById('cursor');
  const label = document.getElementById('cursorLabel');
  let x=0,y=0,cx=0,cy=0;

  window.addEventListener('mousemove', e=>{ x=e.clientX; y=e.clientY; });
  (function loop(){
    cx += (x-cx)*0.18; cy += (y-cy)*0.18;
    cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('[data-cursor]').forEach(el=>{
    const type = el.dataset.cursor;
    el.addEventListener('mouseenter', ()=>{
      cur.classList.add(type);
      if(type==='view') label.textContent = 'View';
    });
    el.addEventListener('mouseleave', ()=>{
      cur.classList.remove('hover','view');
      label.textContent='';
    });
  });
}

/* ─── 4. 🆕 INTERACTIVE GRID BACKGROUND ─── */
function initGridBg(){
  if(window.matchMedia('(hover: none)').matches) return;
  const grid = document.querySelector('.grid-bg');
  if(!grid) return;
  let mx = -300, my = -300, tx = -300, ty = -300;
  window.addEventListener('mousemove', e=>{ mx = e.clientX; my = e.clientY; });
  (function loop(){
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    grid.style.setProperty('--mx', tx + 'px');
    grid.style.setProperty('--my', ty + 'px');
    requestAnimationFrame(loop);
  })();
}

/* ─── 5. NAV ─── */
function initNav(){
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  let last = 0;

  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    if(y > 140 && y > last) nav.classList.add('hidden');
    else nav.classList.remove('hidden');
    last = y;
  }, { passive:true });

  toggle.addEventListener('click', ()=>{
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
    if(menu.classList.contains('open')) lenis?.stop(); else lenis?.start();
  });

  menu.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=>{
      toggle.classList.remove('open');
      menu.classList.remove('open');
      lenis?.start();
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const t = document.querySelector(a.getAttribute('href'));
      if(t){ e.preventDefault(); lenis ? lenis.scrollTo(t,{offset:-10}) : t.scrollIntoView({behavior:'smooth'}); }
    });
  });
}

/* ─── 6. 🆕 CLIP-PATH IMAGE REVEALS ─── */
function initMediaReveal(){
  document.querySelectorAll('.media').forEach(el=>{
    ScrollTrigger.create({
      trigger:el,
      start:'top 82%',
      onEnter: ()=> el.classList.add('revealed'),
    });
  });
}

/* ─── 7. 🆕 SECTION NUMBER COUNTERS ─── */
function initSectionNums(){
  document.querySelectorAll('.sec-num').forEach(el=>{
    const target = parseInt(el.textContent, 10);
    if(isNaN(target)) return;
    const padded = (n)=> String(n).padStart(2,'0');
    el.textContent = '00';
    ScrollTrigger.create({
      trigger:el,
      start:'top 90%',
      once:true,
      onEnter: ()=>{
        let n = 0;
        const int = setInterval(()=>{
          n++;
          el.textContent = padded(n);
          if(n >= target) clearInterval(int);
        }, 60);
      }
    });
  });
}

/* ─── 8. SCROLL ANIMATIONS ─── */
function initScrollAnims(){
  gsap.utils.toArray('.reveal-text').forEach(el=>{
    gsap.to(el,{ opacity:1, y:0, duration:1, ease:'power3.out',
      scrollTrigger:{ trigger:el, start:'top 88%' } });
  });

  const words = gsap.utils.toArray('.big-statement .w');
  if(words.length){
    gsap.to(words,{ opacity:1, stagger:.05, ease:'none',
      scrollTrigger:{ trigger:'.big-statement', start:'top 78%', end:'bottom 62%', scrub:.6 } });
  }

  gsap.utils.toArray('.sec-title').forEach(el=>{
    gsap.from(el,{ y:56, opacity:0, duration:1.1, ease:'power4.out',
      scrollTrigger:{ trigger:el, start:'top 88%' } });
  });

  gsap.utils.toArray('.project').forEach(p=>{
    gsap.from(p.querySelector('.project-media'),{ y:70, opacity:0, duration:1.2, ease:'power4.out',
      scrollTrigger:{ trigger:p, start:'top 82%' } });
    gsap.from(p.querySelectorAll('.project-info > *'),{ y:34, opacity:0, duration:.9, stagger:.07, ease:'power3.out',
      scrollTrigger:{ trigger:p, start:'top 76%' } });
  });

  gsap.utils.toArray('.skill-row').forEach(r=>{
    gsap.from(r,{ x:-42, opacity:0, duration:.9, ease:'power3.out',
      scrollTrigger:{ trigger:r, start:'top 92%' } });
  });

  gsap.from('.trait',{ y:40, opacity:0, duration:.85, stagger:.08, ease:'power3.out',
    scrollTrigger:{ trigger:'.traits', start:'top 86%' } });

  gsap.from('.market-card',{ y:40, opacity:0, duration:.85, stagger:.08, ease:'power3.out',
    scrollTrigger:{ trigger:'.markets-grid', start:'top 85%' } });

  gsap.utils.toArray('.cred-item').forEach(c=>{
    gsap.from(c,{ y:30, opacity:0, duration:.8, ease:'power3.out',
      scrollTrigger:{ trigger:c, start:'top 92%' } });
  });

  gsap.from('.contact-big .w',{ y:80, opacity:0, duration:1.1, stagger:.07, ease:'power4.out',
    scrollTrigger:{ trigger:'.contact-big', start:'top 85%' } });

  gsap.from('.c-card',{ y:34, opacity:0, duration:.8, stagger:.06, ease:'power3.out',
    scrollTrigger:{ trigger:'.contact-grid', start:'top 88%' } });

  gsap.to('.hero-photo img',{ yPercent:12, ease:'none',
    scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true } });

  gsap.to('.about-photo img',{ yPercent:-8, ease:'none',
    scrollTrigger:{ trigger:'.about-photo', start:'top bottom', end:'bottom top', scrub:true } });
}

/* ─── 9. HORIZONTAL GALLERY ─── */
function initHorizontalScroll(){
  if(window.innerWidth < 900) return;
  const track = document.getElementById('hscrollTrack');
  if(!track) return;

  const dist = () => track.scrollWidth - window.innerWidth + 60;

  gsap.to(track,{
    x: () => -dist(),
    ease:'none',
    scrollTrigger:{
      trigger:'.life',
      start:'top top',
      end: () => '+=' + dist(),
      pin:true,
      scrub:1,
      invalidateOnRefresh:true,
      anticipatePin:1
    }
  });
}

/* ─── 10. 🆕 PROJECT MEDIA TILT ─── */
function initProjectTilt(){
  if(window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.project-media').forEach(card=>{
    const inner = card.querySelector('.tilt-inner');
    if(!inner) return;
    card.addEventListener('mousemove', e=>{
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(inner,{
        rotateY: px * 10, rotateX: -py * 10,
        duration:.6, ease:'power3.out', transformPerspective:1000
      });
    });
    card.addEventListener('mouseleave', ()=>{
      gsap.to(inner,{ rotateY:0, rotateX:0, duration:.9, ease:'elastic.out(1,0.4)' });
    });
  });
}

/* ─── 11. MAGNETIC BUTTONS ─── */
function initMagnetic(){
  if(window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.btn-magnetic, .ghost-btn').forEach(btn=>{
    btn.addEventListener('mousemove', e=>{
      const r = btn.getBoundingClientRect();
      gsap.to(btn,{
        x:(e.clientX - r.left - r.width/2)*0.28,
        y:(e.clientY - r.top - r.height/2)*0.4,
        duration:.5, ease:'power3.out'
      });
    });
    btn.addEventListener('mouseleave', ()=>{
      gsap.to(btn,{ x:0, y:0, duration:.7, ease:'elastic.out(1,0.35)' });
    });
  });
}

/* ─── 12. 🆕 SECTION TRANSITION SWEEP ─── */
function initSectionTransition(){
  const bar = document.querySelector('.section-transition');
  if(bar) bar.style.display = 'none';
}

/* ─── 13. LOCAL TIME ─── */
function initClock(){
  const el = document.getElementById('localTime');
  if(!el) return;
  const tick = ()=>{
    el.textContent = new Intl.DateTimeFormat('en-GB',{
      hour:'2-digit', minute:'2-digit', hour12:false, timeZone:'Asia/Kolkata'
    }).format(new Date()) + ' IST';
  };
  tick(); setInterval(tick, 1000*20);
}

/* ─── 14. COPY EMAIL ─── */
function initCopy(){
  const btn = document.getElementById('copyMail');
  const toast = document.getElementById('toast');
  btn?.addEventListener('click', async ()=>{
    try{
      await navigator.clipboard.writeText('snehajindal24@gmail.com');
      toast.classList.add('show');
      setTimeout(()=>toast.classList.remove('show'), 2200);
    }catch(e){ window.location.href='mailto:snehajindal24@gmail.com'; }
  });
}

/* ─── 15. 🆕 MAIL AUTO-TYPE ─── */
function initMailType(){
  const el = document.getElementById('mailLink');
  if(!el) return;
  const full = 'snehajindal24@gmail.com';
  el.innerHTML = '<span class="mail-cursor"></span>';

  ScrollTrigger.create({
    trigger:el, start:'top 85%', once:true,
    onEnter: ()=>{
      let i = 0;
      const t = setInterval(()=>{
        i++;
        el.innerHTML = full.slice(0, i) + '<span class="mail-cursor"></span>';
        if(i >= full.length){
          clearInterval(t);
          setTimeout(()=>{ el.innerHTML = full; }, 1400);
        }
      }, 55);
    }
  });
}

/* ─── 16. MISC ─── */
function initMisc(){
  document.getElementById('year').textContent = new Date().getFullYear();
  document.querySelectorAll('.media img').forEach(img=>{
    const done = ()=>{ if(img.naturalWidth) img.closest('.media').removeAttribute('data-label'); };
    img.complete ? done() : img.addEventListener('load', done);
  });
}
/* ─── 20. 🆕 ROTATING LIVE PRODUCT CARD ─── */
function initLiveProductRotator(){
  const card = document.getElementById('liveProductCard');
  const nameEl = document.getElementById('liveProductName');
  if(!card || !nameEl) return;

  const products = [
    { name: 'LeadPilot',  url: 'https://leadpilot-56ml.onrender.com' },
    { name: 'StockPulse', url: 'https://stockpulse-fqgk.onrender.com' },
    { name: 'PennyWise',  url: 'https://pennywise-ztq5.onrender.com' }
  ];

  let idx = 0;
  let timer = null;

  const swap = () => {
    idx = (idx + 1) % products.length;
    nameEl.classList.add('swap');
    setTimeout(() => {
      nameEl.textContent = products[idx].name;
      card.href = products[idx].url;
      nameEl.classList.remove('swap');
    }, 400);
  };

  const start = () => { stop(); timer = setInterval(swap, 3000); };
  const stop  = () => { if(timer){ clearInterval(timer); timer = null; } };

  card.addEventListener('mouseenter', stop);
  card.addEventListener('mouseleave', start);

  ScrollTrigger.create({
    trigger: '.contact-grid',
    start: 'top 90%',
    end: 'bottom 10%',
    onEnter: start,
    onEnterBack: start,
    onLeave: stop,
    onLeaveBack: stop
  });
}
/* ─── BOOT ─── */
window.addEventListener('DOMContentLoaded', ()=>{
  initSmoothScroll();
  initPreloader();
  initCursor();
  initGridBg();
  initNav();
  initMediaReveal();
  initSectionNums();
  initScrollAnims();
  initHorizontalScroll();
  initProjectTilt();
  initMagnetic();
  initSectionTransition();
  initClock();
  initCopy();
  initMailType();
  initProjectGallery();
  initContactForm();
  initLiveProductRotator();
  initMisc();
});

let rt;
window.addEventListener('resize', ()=>{
  clearTimeout(rt);
  rt = setTimeout(()=>ScrollTrigger.refresh(), 250);
});
/* ══════════════════════════════════════════
   🆕 v3 — PROJECT GALLERY + CONTACT FORM
══════════════════════════════════════════ */

/* ─── 17. 🆕 PROJECT GALLERY AUTO-CYCLE ─── */
function initProjectGallery(){
  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const imgs = gallery.querySelectorAll('.g-img');
    const dots = gallery.querySelectorAll('.g-dot');
    if(imgs.length <= 1) return;

    let idx = 0;
    let timer = null;
    const DELAY = 3200;

    const go = (next) => {
      idx = (next + imgs.length) % imgs.length;
      imgs.forEach((im, i) => im.classList.toggle('is-active', i === idx));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    };

    const start = () => {
      stop();
      timer = setInterval(() => go(idx + 1), DELAY);
    };
    const stop = () => { if(timer) { clearInterval(timer); timer = null; } };

    // Dot clicks — jump + restart timer
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        go(parseInt(dot.dataset.idx, 10));
        start();
      });
    });

    // Pause on hover of the whole media card
    const media = gallery.closest('.project-media');
    if(media){
      media.addEventListener('mouseenter', stop);
      media.addEventListener('mouseleave', start);
    }

    // Only start when scrolled into view (perf)
    ScrollTrigger.create({
      trigger: gallery,
      start: 'top 90%',
      end: 'bottom 10%',
      onEnter: start,
      onEnterBack: start,
      onLeave: stop,
      onLeaveBack: stop
    });
  });
}

/* ─── 18. 🆕 CONTACT FORM (Web3Forms) ─── */
function initContactForm(){
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  if(!form) return;

  const submitBtn = form.querySelector('.cf-submit');
  const submitTxt = form.querySelector('.cf-submit-txt');
  const originalTxt = submitTxt ? submitTxt.textContent : 'Send message';

  const showToast = (msg, ms = 2600) => {
    if(!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), ms);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic client-side validation
    let ok = true;
    form.querySelectorAll('.cf-field').forEach(f => {
      const input = f.querySelector('input, textarea');
      if(input && input.hasAttribute('required') && !input.value.trim()){
        f.classList.add('error');
        ok = false;
      } else {
        f.classList.remove('error');
      }
    });
    if(!ok){ showToast('Please fill in all fields'); return; }

    // Honeypot check
    if(form.querySelector('[name="botcheck"]').checked) return;

    submitBtn.disabled = true;
    submitBtn.classList.add('sending');
    if(submitTxt) submitTxt.textContent = 'Sending...';

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData);

    try{
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if(data.success){
        showToast('Message sent ✓ — I\'ll reply soon');
        form.reset();
      } else {
        showToast('Something went wrong. Try emailing directly.');
        console.error('Web3Forms error:', data);
      }
    } catch(err){
      showToast('Network error. Please email directly.');
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('sending');
      if(submitTxt) submitTxt.textContent = originalTxt;
    }
  });

  // Clear error state as user types
  form.querySelectorAll('input, textarea').forEach(inp => {
    inp.addEventListener('input', () => inp.closest('.cf-field')?.classList.remove('error'));
  });
}