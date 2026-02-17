// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
  });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const targetPosition = target.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Back to top button
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Privacy modal
function showPrivacy() {
  document.getElementById('privacy-modal').style.display = 'block';
}

function closePrivacy() {
  document.getElementById('privacy-modal').style.display = 'none';
}

window.addEventListener('click', (e) => {
  const modal = document.getElementById('privacy-modal');
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// reCAPTCHA form submission
function submitForm() {
  grecaptcha.ready(function() {
    grecaptcha.execute('6LeBPdgrAAAAAGH4s-DRmxTmsozkCmHpmvVYsAQH', {action: 'submit'}).then(function(token) {
      document.getElementById('contact-form').submit();
    });
  });
}

function onSubmit(token) {
  document.getElementById('contact-form').submit();
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = '#0f172a';
  } else {
    navbar.style.background = '#0f172a';
  }
});
