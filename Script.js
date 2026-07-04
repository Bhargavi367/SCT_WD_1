/* =========================================================
   VELOURA HOTELS — SCRIPT
   Vanilla JS only. No frameworks or libraries.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1. NAVBAR — scroll state (transparent -> solid white)
  --------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const SCROLL_THRESHOLD = 60;

  const updateNavbarOnScroll = () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  updateNavbarOnScroll();
  window.addEventListener('scroll', updateNavbarOnScroll, { passive: true });


  /* ---------------------------------------------------------
     2. MOBILE HAMBURGER MENU — slide-in + backdrop
  --------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navBackdrop = document.getElementById('navBackdrop');

  const openMenu = () => {
    navLinks.classList.add('open');
    navBackdrop.classList.add('show');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    navLinks.classList.remove('open');
    navBackdrop.classList.remove('show');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });
  navBackdrop.addEventListener('click', closeMenu);

  // Close mobile menu when a link is tapped
  document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });


  /* ---------------------------------------------------------
     3. ACTIVE NAV LINK — highlight section in view
  --------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link[data-nav]');

  const setActiveLink = (id) => {
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
    });
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));


  /* ---------------------------------------------------------
     4. SCROLL-REVEAL ANIMATIONS — Intersection Observer
        (fade-up / fade-left / fade-right / zoom)
  --------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right, .reveal-zoom'
  );

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));


  /* ---------------------------------------------------------
     5. RIPPLE BUTTON EFFECT
  --------------------------------------------------------- */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);

      ripple.className = 'ripple-effect';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });


  /* ---------------------------------------------------------
     6. HERO PARALLAX — subtle background drift on scroll
  --------------------------------------------------------- */
  const heroBg = document.getElementById('heroBg');
  const hero = document.querySelector('.hero');

  const updateParallax = () => {
    if (!hero) return;
    const heroHeight = hero.offsetHeight;
    const scrolled = window.scrollY;
    if (scrolled < heroHeight) {
      heroBg.style.transform = `translateY(${scrolled * 0.35}px) scale(1.08)`;
    }
  };
  window.addEventListener('scroll', updateParallax, { passive: true });

  // subtle mouse-driven float for the hero shapes (desktop only)
  const shapes = document.querySelectorAll('.shape');
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      shapes.forEach((shape, i) => {
        const depth = (i + 1) * 0.6;
        shape.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    });
  }


  /* ---------------------------------------------------------
     7. BOOKING FORM — basic client-side handling
  --------------------------------------------------------- */
  const bookingForm = document.getElementById('bookingForm');
  const checkin = document.getElementById('checkin');
  const checkout = document.getElementById('checkout');

  // default the date pickers to sensible values
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 3);

  const toISO = (d) => d.toISOString().split('T')[0];
  checkin.min = toISO(tomorrow);
  checkout.min = toISO(dayAfter);
  checkin.value = toISO(tomorrow);
  checkout.value = toISO(dayAfter);

  checkin.addEventListener('change', () => {
    const minCheckout = new Date(checkin.value);
    minCheckout.setDate(minCheckout.getDate() + 1);
    checkout.min = toISO(minCheckout);
    if (new Date(checkout.value) <= new Date(checkin.value)) {
      checkout.value = toISO(minCheckout);
    }
  });

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const guests = document.getElementById('guests').value;
    alert(`Searching availability\nCheck-in: ${checkin.value}\nCheck-out: ${checkout.value}\nGuests: ${guests}`);
  });


  /* ---------------------------------------------------------
     8. NEWSLETTER FORM — lightweight confirmation
  --------------------------------------------------------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterNote = document.getElementById('newsletterNote');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    newsletterNote.textContent = 'Thank you — you are on the list.';
    newsletterForm.reset();
  });

});