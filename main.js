/* ============================================================
   LENZ COMPANY — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Header scroll effect ─────────────────────────────── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });


  /* ── Mobile Navigation ────────────────────────────────── */
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  const navCta = document.querySelector('.nav__cta');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (navCta) navCta.style.display = isOpen ? 'flex' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
        if (navCta) navCta.style.display = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!header.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }


  /* ── Smooth Scroll ────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = document.querySelector('.header').offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ── Scroll Reveal ────────────────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.product-card, .service-card, .benefit-item, .testimonial-card, .trust-bar__item, .contact-channel, .section__header'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    const col = i % 4;
    if (col > 0) el.classList.add(`reveal-delay-${col}`);
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ── Product Filter ───────────────────────────────────── */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      productCards.forEach(card => {
        const match = filter === 'all' || card.dataset.cat === filter;
        card.classList.toggle('hidden', !match);
        if (match) {
          // Re-trigger reveal
          card.classList.remove('visible');
          setTimeout(() => card.classList.add('visible'), 50);
        }
      });
    });
  });


  /* ── Product Info Modal (lightweight) ────────────────── */
  document.querySelectorAll('.product-card__cta').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = btn.dataset.product;
      // Pre-fill service form and scroll to it
      const servicioSelect = document.getElementById('servicio');
      const mensajeArea = document.getElementById('mensaje');
      if (servicioSelect) servicioSelect.value = 'catalogo';
      if (mensajeArea) mensajeArea.value = `Hola, me gustaría recibir más información sobre: ${product}`;
      document.getElementById('agendar').scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => document.getElementById('nombre').focus(), 600);
    });
  });


  /* ── Service CTA pre-fill ─────────────────────────────── */
  document.querySelectorAll('[data-service]').forEach(btn => {
    btn.addEventListener('click', e => {
      if (btn.tagName === 'A') return; // Let smooth scroll handle it
      const service = btn.dataset.service;
      const map = {
        'Visita a Domicilio': 'visita',
        'Mantenimiento': 'mantenimiento',
        'Demostración Virtual': 'demo-virtual',
        'Gestión de Cobranza': 'cobranza',
      };
      const val = map[service];
      const servicioSelect = document.getElementById('servicio');
      if (servicioSelect && val) servicioSelect.value = val;
    });
  });

  document.querySelectorAll('a[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      const service = link.dataset.service;
      const map = {
        'Visita a Domicilio': 'visita',
        'Mantenimiento': 'mantenimiento',
        'Demostración Virtual': 'demo-virtual',
        'Gestión de Cobranza': 'cobranza',
      };
      const val = map[service];
      setTimeout(() => {
        const servicioSelect = document.getElementById('servicio');
        if (servicioSelect && val) servicioSelect.value = val;
      }, 400);
    });
  });


  /* ── Testimonials Slider ──────────────────────────────── */
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('testimDots');
  const prevBtn = document.getElementById('testimPrev');
  const nextBtn = document.getElementById('testimNext');

  if (track) {
    const cards = Array.from(track.querySelectorAll('.testimonial-card'));
    let current = 0;
    let perView = getPerView();
    let autoInterval;

    function getPerView() {
      if (window.innerWidth <= 580) return 1;
      if (window.innerWidth <= 960) return 2;
      return 3;
    }

    function maxIndex() {
      return Math.max(0, cards.length - perView);
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      const count = maxIndex() + 1;
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Testimonio ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      document.querySelectorAll('.dot').forEach((d, i) =>
        d.classList.toggle('active', i === current)
      );
    }

    function goTo(idx) {
      current = Math.min(Math.max(idx, 0), maxIndex());
      const cardWidth = cards[0].offsetWidth + 24; // gap = 24
      track.style.transform = `translateX(-${current * cardWidth}px)`;
      updateDots();
    }

    function startAuto() {
      autoInterval = setInterval(() => {
        goTo(current >= maxIndex() ? 0 : current + 1);
      }, 5000);
    }
    function stopAuto() { clearInterval(autoInterval); }

    prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        stopAuto();
        goTo(diff > 0 ? current + 1 : current - 1);
        startAuto();
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      perView = getPerView();
      current = 0;
      buildDots();
      goTo(0);
    });

    buildDots();
    goTo(0);
    startAuto();
  }


  /* ── Form Validation & Submission ────────────────────── */
  const form = document.getElementById('appointmentForm');
  const formSuccess = document.getElementById('formSuccess');
  const newRequestBtn = document.getElementById('newRequestBtn');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const submitLoader = document.getElementById('submitLoader');

  const validators = {
    nombre: v => v.trim().length >= 3 ? '' : 'Ingresa tu nombre completo (mínimo 3 caracteres).',
    telefono: v => /^[\d\s\+\-\(\)]{7,}$/.test(v.trim()) ? '' : 'Ingresa un número de teléfono válido.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Ingresa un correo electrónico válido.',
    ciudad: v => v.trim().length >= 2 ? '' : 'Ingresa tu ciudad.',
    servicio: v => v ? '' : 'Selecciona un tipo de servicio.',
    privacidad: (_, el) => el.checked ? '' : 'Debes aceptar la política de privacidad.',
  };

  function showError(fieldId, msg) {
    const el = document.getElementById(fieldId);
    const errEl = document.getElementById(fieldId + 'Error');
    if (el) el.classList.toggle('error', !!msg);
    if (errEl) errEl.textContent = msg;
  }

  function validateField(id) {
    const el = document.getElementById(id);
    if (!el || !validators[id]) return true;
    const err = validators[id](el.value, el);
    showError(id, err);
    return !err;
  }

  // Live validation on blur
  Object.keys(validators).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => validateField(id));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(id);
    });
  });

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      // Validate all
      const fields = Object.keys(validators);
      let valid = true;
      fields.forEach(id => { if (!validateField(id)) valid = false; });
      if (!valid) {
        const firstError = form.querySelector('.error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Simulate async submission
      submitBtn.disabled = true;
      submitText.classList.add('hidden');
      submitLoader.classList.remove('hidden');

      await new Promise(r => setTimeout(r, 1800));

      form.classList.add('hidden');
      formSuccess.classList.remove('hidden');

      // Reset state
      submitBtn.disabled = false;
      submitText.classList.remove('hidden');
      submitLoader.classList.add('hidden');

      // Scroll success into view
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  if (newRequestBtn) {
    newRequestBtn.addEventListener('click', () => {
      form.reset();
      form.classList.remove('hidden');
      formSuccess.classList.add('hidden');
      // Clear all errors
      Object.keys(validators).forEach(id => showError(id, ''));
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }


  /* ── Set min date for date picker ─────────────────────── */
  const fechaInput = document.getElementById('fecha');
  if (fechaInput) {
    const today = new Date().toISOString().split('T')[0];
    fechaInput.min = today;
  }


  /* ── Active nav link on scroll ────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav__links a');

  const activeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--blue-mid)' : '';
          a.style.background = a.getAttribute('href') === `#${id}` ? 'var(--blue-pale)' : '';
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => activeObserver.observe(s));

});