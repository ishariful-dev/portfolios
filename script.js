/* ============================================================
   SHARIFUL ISLAM — PORTFOLIO
   script.js
   GSAP 3 + ScrollTrigger
   ============================================================ */

'use strict';

/* ── GSAP SETUP ─────────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* Respect reduced-motion preference throughout */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── UTILITY ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── CUSTOM CURSOR ───────────────────────────────────────── */
(function initCursor() {
  const dot  = $('.cursor');
  const ring = $('.cursor-ring');
  if (!dot || !ring) return;

  /* Only on true pointer devices */
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let mx = 0, my = 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    gsap.to(dot,  { x: mx, y: my, duration: 0.04, ease: 'none' });
    gsap.to(ring, { x: mx, y: my, duration: 0.18, ease: 'power2.out' });
  });

  /* Hover enlargement on interactive elements */
  $$('a, button, .p-card, .svc-card, .why-card, .proc-step, .faq-q, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });
})();

/* ── NAV SCROLL BEHAVIOUR ───────────────────────────────── */
(function initNav() {
  const nav = $('#nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); /* run once on load */

  /* Active section highlight */
  const sections = $$('section[id]');
  const navLinks = $$('.nav-links a');

  if (sections.length && navLinks.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('active'));
          const link = $(`.nav-links a[href="#${entry.target.id}"]`);
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(sec => io.observe(sec));
  }
})();

/* ── MOBILE MENU ─────────────────────────────────────────── */
(function initMobileMenu() {
  const btn  = $('#hamburger');
  const menu = $('#mobile-menu');
  if (!btn || !menu) return;

  let open = false;
  const spans = $$('span', btn);

  const openMenu = () => {
    open = true;
    menu.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Close navigation menu');
    document.body.style.overflow = 'hidden';

    if (!prefersReducedMotion) {
      gsap.to(spans[0], { y: 6.5,  rotation: 45,  duration: 0.32, ease: 'power2.inOut' });
      gsap.to(spans[1], { opacity: 0, duration: 0.18 });
      gsap.to(spans[2], { y: -6.5, rotation: -45, duration: 0.32, ease: 'power2.inOut' });

      /* Stagger menu links */
      gsap.fromTo($$('a', menu),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power3.out', delay: 0.2 }
      );
    }
  };

  const closeMenu = () => {
    open = false;
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';

    if (!prefersReducedMotion) {
      gsap.to(spans, { y: 0, rotation: 0, opacity: 1, duration: 0.28, ease: 'power2.out' });
    }
  };

  btn.addEventListener('click', () => open ? closeMenu() : openMenu());

  /* Close on any nav link click */
  $$('a', menu).forEach(link => link.addEventListener('click', closeMenu));

  /* Close on Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) closeMenu();
  });
})();

/* ── SMOOTH SCROLL ───────────────────────────────────────── */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = $(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; /* nav height */
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── HERO ANIMATIONS ─────────────────────────────────────── */
(function initHero() {
  if (prefersReducedMotion) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero-name',     { y: 90, opacity: 0, duration: 1.3, skewY: 1.5 }, 0)
    .from('.hero-photo',    { opacity: 0, x: 40, duration: 1.2 }, 0.15)
    .from('.hero-glow',     { opacity: 0, duration: 1.4 }, 0.1)
    .from('.hero-hi',       { y: 20, opacity: 0, duration: 0.8 }, 0.55)
    .from('.hero-tagline',  { y: 28, opacity: 0, duration: 0.85 }, 0.72)
    .from('.trust-pill',    { y: 18, opacity: 0, duration: 0.7 }, 0.88)
    .from('.hero-btns',     { y: 18, opacity: 0, duration: 0.7 }, 0.98)
    .from('.sat-card',      { y: 18, opacity: 0, duration: 0.7, scale: 0.96 }, 1.05);
})();

/* ── SCROLL REVEAL ───────────────────────────────────────── */
(function initScrollReveal() {
  if (prefersReducedMotion) {
    /* Show everything immediately */
    $$('[data-reveal], [data-reveal-left]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  /* Generic data-reveal (fade + slide up) */
  $$('[data-reveal]').forEach((el, i) => {
    gsap.from(el, {
      y: 52,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 86%',
        toggleActions: 'play none none none',
      }
    });
  });

  /* data-reveal-left (slide from left) */
  $$('[data-reveal-left]').forEach(el => {
    gsap.from(el, {
      x: -40,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 86%',
        toggleActions: 'play none none none',
      }
    });
  });
})();

/* ── SERVICES STAGGER ────────────────────────────────────── */
(function initServices() {
  if (prefersReducedMotion) return;
  const grid = $('.services-grid');
  if (!grid) return;

  gsap.from($$('.svc-card', grid), {
    y: 40, opacity: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: { trigger: grid, start: 'top 82%', toggleActions: 'play none none none' }
  });
})();

/* ── PROJECT CARDS STAGGER ───────────────────────────────── */
(function initProjectCards() {
  if (prefersReducedMotion) return;

  $$('.p-card').forEach((card) => {
    gsap.from(card, {
      y: 50, opacity: 0, duration: 0.85, ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none',
      }
    });
  });
})();

/* ── PROCESS STAGGER ─────────────────────────────────────── */
(function initProcess() {
  if (prefersReducedMotion) return;
  const grid = $('.process-grid');
  if (!grid) return;

  gsap.from($$('.proc-step', grid), {
    y: 40, opacity: 0, duration: 0.75, stagger: 0.14, ease: 'power3.out',
    scrollTrigger: { trigger: grid, start: 'top 82%', toggleActions: 'play none none none' }
  });
})();

/* ── WHY CARDS STAGGER ───────────────────────────────────── */
(function initWhy() {
  if (prefersReducedMotion) return;
  const grid = $('.why-grid');
  if (!grid) return;

  gsap.from($$('.why-card', grid), {
    y: 38, opacity: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: { trigger: grid, start: 'top 82%', toggleActions: 'play none none none' }
  });
})();

/* ── PROJECT SCREENSHOT LAZY LOAD + FALLBACK ─────────────── */
(function initProjectImages() {
  $$('.p-img img').forEach(img => {
    const init = img.dataset.fallbackInit || '??';
    const dom  = img.dataset.fallbackDom  || '';

    const showFallback = () => {
      const fb = document.createElement('div');
      fb.className = 'p-img-fallback';
      fb.innerHTML = `<div class="p-fb-init">${init}</div><div class="p-fb-dom">${dom}</div>`;
      if (img.parentElement) {
        img.parentElement.replaceChild(fb, img);
      }
    };

    img.addEventListener('error', showFallback);

    /* If already errored (cached) */
    if (img.complete && img.naturalWidth === 0) showFallback();
  });
})();

/* ── PROJECT FILTERING ───────────────────────────────────── */
(function initFilters() {
  const filterBtns = $$('.filter-btn');
  const cards      = $$('.p-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      /* Update active button */
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      /* Show / hide cards */
      cards.forEach(card => {
        const cats = (card.dataset.category || '').split(' ');
        const show = filter === 'all' || cats.includes(filter);

        if (show) {
          card.classList.remove('hidden');
          if (!prefersReducedMotion) {
            gsap.fromTo(card,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
            );
          }
        } else {
          if (!prefersReducedMotion) {
            gsap.to(card, {
              opacity: 0, y: 10, duration: 0.25, ease: 'power2.in',
              onComplete: () => card.classList.add('hidden')
            });
          } else {
            card.classList.add('hidden');
          }
        }
      });

      /* Refresh ScrollTrigger after layout change */
      setTimeout(() => ScrollTrigger.refresh(), 350);
    });
  });
})();

/* ── FAQ ACCORDION ───────────────────────────────────────── */
(function initFAQ() {
  const items = $$('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn    = $('.faq-q', item);
    const answer = $('.faq-a', item);
    const inner  = $('.faq-a-inner', item);
    if (!btn || !answer || !inner) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      /* Close all open items */
      items.forEach(other => {
        if (other !== item && other.classList.contains('open')) {
          other.classList.remove('open');
          $('.faq-a', other).style.maxHeight = '0';
          $('.faq-q', other).setAttribute('aria-expanded', 'false');
        }
      });

      /* Toggle current */
      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = '0';
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        answer.style.maxHeight = inner.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    /* Keyboard support */
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
})();

/* ── MAGNETIC BUTTONS ────────────────────────────────────── */
(function initMagnetic() {
  if (prefersReducedMotion) return;
  if (!window.matchMedia('(hover: hover)').matches) return;

  $$('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.32;
      const y = (e.clientY - r.top  - r.height / 2) * 0.32;
      gsap.to(btn, { x, y, duration: 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.55)' });
    });
  });
})();

/* ── MARQUEE PAUSE ON HOVER ──────────────────────────────── */
(function initMarquee() {
  $$('.marquee-strip').forEach(strip => {
    const track = $('.marquee-track', strip);
    if (!track) return;
    strip.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
    strip.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
  });
})();

/* ── SECTION PARALLAX (subtle) ───────────────────────────── */
(function initParallax() {
  if (prefersReducedMotion) return;
  if (!window.matchMedia('(min-width: 900px)').matches) return;

  /* Subtle glow drift on hero */
  gsap.to('.hero-glow', {
    y: -30,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    }
  });
})();

/* ── KEYBOARD: FOCUS VISIBLE ─────────────────────────────── */
(function initFocusVisible() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
  });
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
})();

/* ── CONSOLE SIGNATURE ───────────────────────────────────── */
console.log('%cShariful Islam | WordPress Developer & SEO Specialist', 'color:#e85d04;font-size:13px;font-weight:600;');
console.log('%cishariful.info@gmail.com', 'color:#68636a;font-size:11px;');
