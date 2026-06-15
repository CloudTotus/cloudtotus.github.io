/* =========================================================
   CloudTotus Modern interactions
   NOTE: Form submission (reCAPTCHA v3 + n8n webhook) behavior
   is preserved exactly from the original site.
   ========================================================= */

/* ---------- Mobile menu toggle ---------- */
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('active');
  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- Smooth scroll for in-page anchors ---------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '#top') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---------- Navbar background on scroll ---------- */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('back-to-top');

function onScroll() {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 40);
  backToTop.classList.toggle('visible', y > 320);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Back to top ---------- */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- Scroll reveal (IntersectionObserver) ---------- */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

/* ---------- Privacy modal ---------- */
const modal = document.getElementById('privacy-modal');

function showPrivacy() {
  modal.classList.add('open');
}
function closePrivacy() {
  modal.classList.remove('open');
}
window.showPrivacy = showPrivacy;
window.closePrivacy = closePrivacy;

window.addEventListener('click', (e) => {
  if (e.target === modal) closePrivacy();
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePrivacy();
});

/* ---------- Contact form submission (PRESERVED) ----------
   Validates required fields natively, runs reCAPTCHA v3, then
   submits the form (GET) to the n8n webhook same as before. */
function submitForm() {
  const form = document.getElementById('contact-form');

  // Native HTML5 validation before invoking reCAPTCHA
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  grecaptcha.ready(function () {
    grecaptcha
      .execute('6LeBPdgrAAAAAGH4s-DRmxTmsozkCmHpmvVYsAQH', { action: 'submit' })
      .then(function (token) {
        form.submit();
      });
  });
}
window.submitForm = submitForm;

// Kept for backward compatibility with any reCAPTCHA callback wiring
function onSubmit(token) {
  document.getElementById('contact-form').submit();
}
window.onSubmit = onSubmit;

/* ---------- Hero: mouse parallax (tilt + depth) ---------- */
const hero = document.querySelector('.hero');
const hvPanel = document.querySelector('.hv-panel');
const orbs = document.querySelectorAll('.orb');
const pills = document.querySelectorAll('.hv-pill');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

if (hero && finePointer && !prefersReduced) {
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;  // -0.5 .. 0.5
    const py = (e.clientY - r.top) / r.height - 0.5;

    if (hvPanel) {
      hvPanel.style.transform =
        `translate(-50%, -50%) rotateX(${8 - py * 10}deg) rotateY(${-12 + px * 14}deg)`;
    }
    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 12;
      orb.style.transform = `translate(${px * depth}px, ${py * depth}px)`;
    });
    pills.forEach((pill, i) => {
      const depth = (i + 1) * 8;
      pill.style.transform = `translate(${px * depth}px, ${py * depth}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    if (hvPanel) hvPanel.style.transform = 'translate(-50%, -50%) rotateX(8deg) rotateY(-12deg)';
    orbs.forEach((orb) => { orb.style.transform = ''; });
    pills.forEach((pill) => { pill.style.transform = ''; });
  });
}

/* ---------- Hero: animated stat count-up ---------- */
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
    const val = (target * eased).toFixed(decimals);
    el.textContent = prefix + val + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = prefix + target.toFixed(decimals) + suffix;
  }
  requestAnimationFrame(tick);
}

const statEls = document.querySelectorAll('.hero-stats strong[data-count]');
if (statEls.length) {
  if (prefersReduced) {
    statEls.forEach((el) => {
      const d = parseInt(el.dataset.decimals || '0', 10);
      el.textContent = (el.dataset.prefix || '') + parseFloat(el.dataset.count).toFixed(d) + (el.dataset.suffix || '');
    });
  } else if ('IntersectionObserver' in window) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { animateCount(entry.target); so.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    statEls.forEach((el) => so.observe(el));
  } else {
    statEls.forEach(animateCount);
  }
}
