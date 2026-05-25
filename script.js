/* ============================================================
   WARISHA NADEEM — Portfolio JS (Light Theme Update)
   ============================================================ */

// ===== NAVBAR SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ===== MOBILE MENU =====
const burger   = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobClose = document.getElementById('mobClose');
const mobLinks = document.querySelectorAll('.mob-link');

function openMenu() {
  burger.classList.add('open');
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  burger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

burger.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});
if (mobClose) mobClose.addEventListener('click', closeMenu);
mobLinks.forEach(link => link.addEventListener('click', closeMenu));

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// Hero elements reveal on load
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 160 + 200);
  });
});

// ===== SKILL BARS =====
const skillItems = document.querySelectorAll('.skill-item');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

skillItems.forEach(item => skillObserver.observe(item));

// ===== CLICKABLE PROJECT CARDS =====
const pcards = document.querySelectorAll('.pcard');
let openProjectId = null;

function openDetail(projectId) {
  // Close any currently open detail
  if (openProjectId) {
    const prevDetail = document.getElementById('detail-' + openProjectId);
    const prevCard   = document.querySelector(`.pcard[data-project="${openProjectId}"]`);
    if (prevDetail) prevDetail.classList.remove('open');
    if (prevCard)   prevCard.setAttribute('aria-expanded', 'false');
  }

  if (openProjectId === projectId) {
    // Toggle off if same card clicked again
    openProjectId = null;
    return;
  }

  openProjectId = projectId;

  const detail = document.getElementById('detail-' + projectId);
  const card   = document.querySelector(`.pcard[data-project="${projectId}"]`);

  if (detail) {
    detail.classList.add('open');
    detail.setAttribute('aria-hidden', 'false');

    // Smooth scroll to the detail panel
    setTimeout(() => {
      detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }
  if (card) card.setAttribute('aria-expanded', 'true');
}

function closeDetail(projectId) {
  const detail = document.getElementById('detail-' + projectId);
  const card   = document.querySelector(`.pcard[data-project="${projectId}"]`);
  if (detail) { detail.classList.remove('open'); detail.setAttribute('aria-hidden', 'true'); }
  if (card)   card.setAttribute('aria-expanded', 'false');
  openProjectId = null;
}

// Card click / keyboard
pcards.forEach(card => {
  card.addEventListener('click', () => {
    openDetail(card.dataset.project);
  });
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDetail(card.dataset.project);
    }
  });
});

// Close buttons
document.querySelectorAll('.detail-close').forEach(btn => {
  btn.addEventListener('click', () => {
    const projectId = btn.dataset.project;
    closeDetail(projectId);

    // Scroll back to the card
    const card = document.querySelector(`.pcard[data-project="${projectId}"]`);
    if (card) {
      setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
    }
  });
});

// ===== STAT COUNTER ANIMATION =====
const statNums = document.querySelectorAll('.stat-num[data-count]');

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el      = entry.target;
      const target  = parseInt(el.dataset.count);
      const suffix  = el.querySelector('span') ? el.querySelector('span').textContent : '';
      let current   = 0;
      const step    = target / 55;  // ~60fps × ~0.9s

      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.innerHTML = Math.round(current) + (suffix ? `<span>${suffix}</span>` : '');
        if (current >= target) clearInterval(timer);
      }, 16);

      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statObserver.observe(el));

// ===== ACTIVE NAV HIGHLIGHT =====
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a');

function updateActiveNav() {
  const scrollPos = window.scrollY + 130;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav__links a[href="#${id}"]`);
    if (link) {
      const isActive = scrollPos >= top && scrollPos < top + height;
      link.style.color = isActive ? 'var(--accent)' : '';
    }
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });

// ===== SOFT CARD HOVER PARALLAX =====
// Light tilt — much softer than before
pcards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const x     = (e.clientX - rect.left) / rect.width  - 0.5;
    const y     = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 4}deg) translateY(-6px) scale(1.01)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(.22,1,.36,1)';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});

// ===== SHOWCASE ITEM OBSERVER =====
// Ensures transition-delay from --delay CSS variable is respected
const showcaseItems = document.querySelectorAll('.showcase-item.reveal');

const showcaseObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = getComputedStyle(entry.target).getPropertyValue('--delay') || '0s';
      entry.target.style.transitionDelay = delay;
      entry.target.classList.add('visible');
      showcaseObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

showcaseItems.forEach(item => showcaseObserver.observe(item));
