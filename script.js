/* Portfolio Lucas DECEBAL-DANGER */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ===== À MODIFIER : URL exacte des dépôts GitHub (laisser vide = bouton masqué) ===== */
const REPOS = { agriscan: '' };
document.querySelectorAll('[data-repo]').forEach(a => {
  const url = REPOS[a.dataset.repo];
  if (url) { a.href = url; a.hidden = false; }
});

/* Année du footer */
document.getElementById('year').textContent = new Date().getFullYear();

/* Menu mobile : ouverture, fermeture après clic, touche Échap */
const nav = document.getElementById('nav'), btn = document.getElementById('menu-btn'), menu = document.getElementById('menu');
const setMenu = open => { menu.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu'); };
btn.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
addEventListener('keydown', e => { if (e.key === 'Escape') { setMenu(false); btn.focus(); } });

/* En-tête : fond au défilement */
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 20);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* Apparition des sections (le contenu reste visible sans JS) */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .08 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* Lien actif de la navigation */
const links = [...menu.querySelectorAll('a[href^="#"]')];
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-40% 0px -55% 0px' });
links.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });

/* Tache lumineuse discrète qui suit la souris (ordinateur uniquement) */
const blob = document.getElementById('mouse-blob');
if (fine && !reduce) addEventListener('pointermove', e => { blob.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`; }, { passive: true });
else blob.style.display = 'none';

/* Lightbox pour agrandir les images des projets */
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('lightbox-image');
const modalClose = document.getElementById('lightbox-close');
let lastFocusedElement = null;

if (modal) {
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-label', 'Vue agrandie du projet');
  modal.setAttribute('aria-hidden', 'true');
  modal.tabIndex = -1;
}

const openLightbox = image => {
  if (!modal || !modalImage || !modalClose) return;
  lastFocusedElement = document.activeElement;
  modalImage.src = image.src;
  modalImage.alt = image.alt || 'Image agrandie du projet';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  modal.setAttribute('aria-modal', 'true');
  document.body.classList.add('modal-open');
  modalClose.focus();
  modal.focus();
};

const closeLightbox = () => {
  if (!modal || !modalImage) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  modal.removeAttribute('aria-modal');
  document.body.classList.remove('modal-open');
  if (lastFocusedElement) lastFocusedElement.focus();
};

document.querySelectorAll('.project-visual img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.tabIndex = 0;
  img.setAttribute('role', 'button');
  img.setAttribute('aria-label', img.alt ? `Agrandir l'image : ${img.alt}` : "Agrandir l'image du projet");
  img.addEventListener('click', () => openLightbox(img));
  img.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(img);
    }
  });
});

if (modalClose) modalClose.addEventListener('click', closeLightbox);
if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeLightbox();

  if (e.key === 'Tab' && modal && modal.classList.contains('open')) {
    const elements = [modalClose];
    const first = elements[0];
    const last = elements[elements.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }

    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});
