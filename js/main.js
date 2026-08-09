/* ============================================================
   main.js — Portfolio interactions
   Sections:
     1. Typing animation
     2. Stat counters
     3. Scroll reveal
     4. Experience tree trunk
     5. Experience tree card toggle
     6. Mobile sidebar
     7. Reduced motion
   ============================================================ */

'use strict';

/* ── 1. Typing animation ─────────────────────────────── */
(function initTyping() {
  const phrases = [
    'Requirements Analysis',
    'Workflow Management',
    'Sample Management',
    'Laboratory Operations',
    'Digital Workflows',
  ];

  const el  = document.getElementById('typed');
  let pi    = 0;   // phrase index
  let ci    = 0;   // character index
  let deleting = false;

  function tick() {
    const word = phrases[pi];

    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) {
        deleting = true;
        setTimeout(tick, 1900);
        return;
      }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }

    setTimeout(tick, deleting ? 55 : 100);
  }

  setTimeout(tick, 900);
})();


/* ── 2. Animated stat counters ───────────────────────── */
(function initCounters() {
  function animateCount(el, target) {
    const step = Math.ceil(1600 / target);
    let n = 0;
    const timer = setInterval(() => {
      n++;
      el.textContent = n + '+';
      if (n >= target) {
        el.textContent = target + '+';
        clearInterval(timer);
      }
    }, step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCount(e.target, parseInt(e.target.dataset.target, 10));
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-num[data-target]').forEach((el) =>
    observer.observe(el)
  );
})();


/* ── 3. Scroll reveal ────────────────────────────────── */
(function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          /* Trigger skill bars inside a revealed element */
          e.target.querySelectorAll('.skill-fill').forEach((bar) => {
            bar.style.width = bar.style.getPropertyValue('--tw');
          });
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  const revealEls = document.querySelectorAll('.reveal');

  revealEls.forEach((el) => {
    /* Immediately show elements already in the viewport on load */
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('visible');
    } else {
      observer.observe(el);
    }
  });
})();


/* ── 4. Experience tree trunk animation ──────────────── */
(function initTreeTrunk() {
  const trunk = document.getElementById('tree-trunk');
  if (!trunk) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          trunk.classList.add('animated');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.05 }
  );

  observer.observe(trunk);
})();


/* ── 5. Experience tree card toggle ──────────────────── */
function toggleTree(card) {
  const wasOpen = card.classList.contains('open');

  /* Close all open cards */
  document.querySelectorAll('.tree-card.open').forEach((c) => {
    c.classList.remove('open');
    const icon = c.querySelector('.toggle-icon');
    if (icon) icon.className = 'ti ti-chevron-down toggle-icon';
  });
  document.querySelectorAll('.tree-item.active').forEach((item) =>
    item.classList.remove('active')
  );

  /* Open the clicked card if it was not already open */
  if (!wasOpen) {
    card.classList.add('open');
    const icon = card.querySelector('.toggle-icon');
    if (icon) icon.className = 'ti ti-chevron-up toggle-icon';
    card.closest('.tree-item').classList.add('active');
  }
}


/* ── 6. Mobile sidebar ───────────────────────────────── */
(function initSidebar() {
  const sidebar   = document.getElementById('mobSidebar');
  const overlay   = document.getElementById('mobOverlay');
  const hamburger = document.getElementById('hamburger');

  function open() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    hamburger.classList.add('open');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function close() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { overlay.style.display = 'none'; }, 300);
  }

  /* Expose globally so inline onclick="" attributes work */
  window.toggleSidebar = () => sidebar.classList.contains('open') ? close() : open();
  window.closeSidebar  = close;

  overlay.addEventListener('click', close);
})();


/* ── 7. Respect prefers-reduced-motion ───────────────── */
(function respectReducedMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach((el) => {
      el.style.animationDuration  = '0.001s';
      el.style.transitionDuration = '0.001s';
    });
  }
})();
