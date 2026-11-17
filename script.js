/* Portfolio Lucas Decebal-Danger — premium / cinematic */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';

  /* Année */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* En-tête : masqué au défilement vers le bas, révélé vers le haut */
  const head = document.getElementById('site-head');
  let lastY = window.scrollY;

  function onScroll() {
    const y = window.scrollY;
    if (head) {
      head.classList.toggle('is-scrolled', y > 40);
      if (y > lastY + 6 && y > 260) head.classList.add('is-hidden');
      else if (y < lastY - 6) head.classList.remove('is-hidden');
    }
    lastY = y;
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Défilement fluide */
  let lenis = null;
  if (hasGSAP && window.Lenis && fine && !reduce) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    if (window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const id = link.getAttribute('href');
        if (!id || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        event.preventDefault();
        lenis.scrollTo(target, { offset: -80 });
      });
    });
  }

  /* Menu mobile */
  const menuBtn = document.getElementById('menu-btn');
  const nav = document.getElementById('nav');

  function setMenu(open) {
    if (!nav || !menuBtn) return;
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    if (lenis) open ? lenis.stop() : lenis.start();
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenu(false);
    });
    addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        menuBtn.focus();
      }
    });
  }

  /* Préloader */
  const preloader = document.getElementById('preloader');
  const hidePreloader = () => {
    if (preloader) preloader.style.display = 'none';
  };

  if (!hasGSAP || reduce) {
    hidePreloader();
  } else {
    const tl = gsap.timeline({ onComplete: hidePreloader });
    tl.to('.preloader-bar i', { scaleX: 1, duration: 0.85, ease: 'power2.inOut' })
      .to('.preloader-mark', { opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.1')
      .to('.preloader-door--top', { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '-=0.05')
      .to('.preloader-door--bottom', { yPercent: 100, duration: 0.9, ease: 'power4.inOut' }, '<')
      .from('.hero-line > span', { yPercent: 115, duration: 1.1, stagger: 0.12, ease: 'power4.out' }, '-=0.55')
      .from('.hero-eyebrow, .hero-statement, .hero-avail, .hero-scroll',
        { y: 16, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out' }, '-=0.7');
  }

  /* Animations liées au scroll */
  if (hasGSAP && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      // Ne pas masquer ce qui est déjà visible à l'écran (évite tout contenu bloqué).
      if (el.getBoundingClientRect().top < innerHeight * 0.9) return;
      gsap.from(el, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });

    const progress = document.getElementById('progress');
    if (progress) {
      gsap.to(progress, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    }
  }

  /* Curseur personnalisé (desktop uniquement) */
  if (fine && !reduce) {
    const cursor = document.getElementById('cursor');
    if (cursor) {
      const moveCursor = (x, y) => {
        cursor.style.transform = `translate3d(${x - 18}px, ${y}px, 0)`;
      };

      addEventListener(
        'pointermove',
        (event) => moveCursor(event.clientX, event.clientY),
        { passive: true }
      );

      const hoverables = 'a, button';
      document.addEventListener('pointerover', (event) => {
        if (event.target.closest && event.target.closest(hoverables)) {
          cursor.classList.add('is-hover');
        }
      });
      document.addEventListener('pointerout', (event) => {
        const from = event.target.closest ? event.target.closest(hoverables) : null;
        const to =
          event.relatedTarget && event.relatedTarget.closest
            ? event.relatedTarget.closest(hoverables)
            : null;
        if (from && from !== to) cursor.classList.remove('is-hover');
      });

      let sparkTimer;
      addEventListener('pointerdown', () => {
        cursor.classList.add('is-down');
        cursor.classList.remove('is-click');
        void cursor.offsetWidth;
        cursor.classList.add('is-click');
        clearTimeout(sparkTimer);
        sparkTimer = setTimeout(() => cursor.classList.remove('is-click'), 420);
      });
      addEventListener('pointerup', () => cursor.classList.remove('is-down'));

      document.body.classList.add('has-cursor');
      moveCursor(innerWidth / 2, innerHeight / 2);
    }
  }

  /* Boutons magnétiques */
  if (hasGSAP && fine && !reduce) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });

      el.addEventListener('pointermove', (event) => {
        const rect = el.getBoundingClientRect();
        xTo((event.clientX - rect.left - rect.width / 2) * 0.28);
        yTo((event.clientY - rect.top - rect.height / 2) * 0.38);
      });
      el.addEventListener('pointerleave', () => {
        xTo(0);
        yTo(0);
      });
    });
  }

  /* Lightbox */
  const modal = document.getElementById('image-modal');
  const modalImage = document.getElementById('lightbox-image');
  const closeBtn = document.getElementById('lightbox-close');
  let opener = null;

  function openModal(src, alt) {
    if (!modal || !modalImage || !closeBtn) return;
    modalImage.src = src;
    modalImage.alt = alt || 'Image agrandie du projet';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Image agrandie');
    document.body.classList.add('is-locked');
    if (lenis) lenis.stop();
    closeBtn.focus();
  }

  function closeModal() {
    if (!modal || !modalImage) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    document.body.classList.remove('is-locked');
    if (lenis) lenis.start();
    if (opener) opener.focus();
  }

  document.querySelectorAll('[data-zoom]').forEach((button) => {
    button.addEventListener('click', () => {
      const image = button.querySelector('img');
      if (!image) return;
      opener = button;
      openModal(image.currentSrc || image.src, image.alt);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });
  }

  addEventListener('keydown', (event) => {
    if (!modal || !modal.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      closeModal();
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      closeBtn.focus();
    }
  });
})();
