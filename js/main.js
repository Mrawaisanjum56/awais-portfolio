/* ════════════════════════════════════════════════════
       ALEX MERCER — PORTFOLIO  |  main.js
       Sections:
         1. Custom Cursor
         2. Scroll Progress Bar
         3. Navbar Shrink on Scroll
         4. Mobile Hamburger Menu
         5. Typewriter Effect (Hero)
         6. Intersection Observer — Reveal Animations
         7. Magazine Slider (Projects)
         8. Contact Form Feedback
    ════════════════════════════════════════════════════ */


    /* ────────────────────────────────────────────────
       1. CUSTOM CURSOR
       — Dot follows mouse instantly.
       — Ring lags behind for a trailing effect.
    ──────────────────────────────────────────────── */
    (function initCursor() {
      const dot = document.getElementById('cursor');
      const ring = document.getElementById('cursor-ring');
      if (!dot || !ring) return;

      let mouseX = 0, mouseY = 0;
      let ringX = 0, ringY = 0;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
      });

      // Animate ring with lerp for smooth lag
      (function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
      })();

      // Scale cursor on hover over interactive elements
      const interactives = 'a, button, input, textarea, .skill-card, .t-card, .chip, .mag-dot';
      document.querySelectorAll(interactives).forEach((el) => {
        el.addEventListener('mouseenter', () => dot.classList.add('hover'));
        el.addEventListener('mouseleave', () => dot.classList.remove('hover'));
      });
    })();


    /* ────────────────────────────────────────────────
       2. SCROLL PROGRESS BAR
       — Thin accent line at very top of page.
    ──────────────────────────────────────────────── */
    (function initProgressBar() {
      const bar = document.getElementById('progress-bar');
      if (!bar) return;

      window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const percentage = (scrolled / maxScroll) * 100;
        bar.style.width = percentage + '%';
      }, { passive: true });
    })();


    /* ────────────────────────────────────────────────
       3. NAVBAR SHRINK ON SCROLL
       — Adds .scrolled class when page scrolls > 60px.
    ──────────────────────────────────────────────── */
    (function initNavbar() {
      const nav = document.getElementById('navbar');
      if (!nav) return;

      window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
      }, { passive: true });
    })();


    /* ────────────────────────────────────────────────
       4. MOBILE HAMBURGER MENU
       — Closes automatically when a link is tapped.
    ──────────────────────────────────────────────── */
    (function initMobileMenu() {
      const btn = document.getElementById('hamburger');
      const menu = document.getElementById('mobileMenu');
      if (!btn || !menu) return;

      btn.addEventListener('click', () => {
        btn.classList.toggle('open');
        menu.classList.toggle('open');
      });

      // Close when any mobile link is tapped
      menu.querySelectorAll('.mobile-link').forEach((link) => {
        link.addEventListener('click', () => {
          btn.classList.remove('open');
          menu.classList.remove('open');
        });
      });
    })();


    /* ────────────────────────────────────────────────
       5. TYPEWRITER EFFECT
       — Cycles through role words with type/delete loop.
    ──────────────────────────────────────────────── */
    (function initTypewriter() {
      const el = document.getElementById('typed');
      if (!el) return;

      const words = ['scalable APIs.', 'beautiful UIs.', 'AI systems.', 'mobile apps.', 'dev tools.'];
      let wordIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      function tick() {
        const currentWord = words[wordIndex];

        if (!isDeleting) {
          // Typing forward
          el.textContent = currentWord.substring(0, ++charIndex);
          if (charIndex === currentWord.length) {
            // Pause at full word, then start deleting
            isDeleting = true;
            return setTimeout(tick, 1800);
          }
        } else {
          // Deleting
          el.textContent = currentWord.substring(0, --charIndex);
          if (charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
          }
        }

        setTimeout(tick, isDeleting ? 55 : 95);
      }

      // Small delay before starting so hero animations settle
      setTimeout(tick, 1700);
    })();


    /* ────────────────────────────────────────────────
       6. INTERSECTION OBSERVER — REVEAL ANIMATIONS
       — Watches .reveal, .stat-item, .exp-item, .t-card
       — Adds .visible class when element enters viewport.
       — Stagger delay calculated from element index.
    ──────────────────────────────────────────────── */
    (function initReveal() {
      const revealItems = document.querySelectorAll(
        '.reveal, .stat-item, .exp-item, .t-card'
      );

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, Number(delay));

          observer.unobserve(entry.target); // animate only once
        });
      }, { threshold: 0.12 });

      // Assign stagger delays in groups of 3
      revealItems.forEach((el, i) => {
        el.dataset.delay = (i % 3) * 100;
        observer.observe(el);
      });
    })();


    /* ────────────────────────────────────────────────
       7. MAGAZINE SLIDER
       — Full-bleed editorial slide with:
         • Fade + subtle translate transition
         • Animated stretch-dot indicators
         • Counter (01 / 05)
         • Auto-advance (pauses on interaction)
         • Touch / swipe support
         • Keyboard arrow key support
    ──────────────────────────────────────────────── */
    (function initMagazineSlider() {

      /* ── Project data ── */
      const projects = [
        {
          num: '01',
          type: 'AI · Django · Machine Learning',
          title: 'AgroSmart Platform',
          desc: 'Agricultural e-commerce platform with AI-powered wheat grain quality classification using MobileNetV2. Features automated price scraping from market APIs and APScheduler for daily data refresh.',
          stack: ['Django', 'MobileNetV2', 'BeautifulSoup', 'PostgreSQL', 'APScheduler'],
          icon: '🌾',
          bg: 'linear-gradient(135deg, #071520 0%, #0a2535 100%)',
          challenge: 'Replace this with the specific problem farmers/buyers faced — e.g. no reliable way to grade wheat quality at scale, and no single source for daily market prices.',
          solution: 'Replace this with what you actually built — e.g. a MobileNetV2 classifier trained on grain images plus a scheduled scraper that keeps prices fresh without manual work.',
          results: 'Replace this with the measurable outcome — e.g. classification accuracy, time saved per batch, or number of users/vendors onboarded.',
          live: '', // ← put your live demo URL here, e.g. 'https://agrosmart.yourdomain.com'
          code: 'https://github.com/Mrawaisanjum56/AI-Agriculture_MarketPlace', // ← put your GitHub repo URL here, e.g. 'https://github.com/Mrawaisanjum56/agrosmart'
        },
        {
          num: '02',
          type: 'ML, Classifier ',
          title: 'Ml Wheat Classification Model',
          desc: 'Reduces subjective human error in grain grading, Speeds up quality analysis process , Demonstrates practical ML application in agriculture (AgriTech)',
          stack: ['FastAPI', 'LangChain', 'Redis', 'WebSocket', 'TensorFLow'],
          icon: '🧠',
          bg: 'linear-gradient(135deg, #0e0a20 0%, #1a0d30 100%)',
          challenge: 'Replace this with the constraint you were solving for — e.g. keeping conversations context-aware at scale while staying fast under real traffic.',
          solution: 'Replace this with the architecture decisions — e.g. Redis-backed memory, WebSocket streaming, and a routing layer that picks the right model per request.',
          results: 'Replace this with real numbers — e.g. message volume handled, latency achieved, or cost per conversation reduced.',
          live: '',
          code: 'https://github.com/Mrawaisanjum56/ML-Wheat_Classification_Model',
        },
        {
          num: '03',
          type: 'SaaS · Analytics, Business Management · Python',
          title: 'DeskTop Clinic App',
          desc: 'Business intelligence dashboard with real-time metric streaming, customizable widget layouts, and automated PDF report generation.',
          stack: ['React', 'D3.js', 'Node.js', 'TimescaleDB', 'WebSocket'],
          icon: '📊',
          bg: 'linear-gradient(135deg, #141a08 0%, #0d1a12 100%)',
          challenge: 'Replace this with the business problem — e.g. teams needed live metrics without waiting on manual report exports.',
          solution: 'A complete version of clinic management app: MySQL Db, a full login system, designed prescription PDF, an appointment token queue, and every screen (dashboard, patient registration, billing, medicines, services, search/history, appointments) wired up and working end to end.',
          results: '',
          live: '',
          code: 'https://github.com/Mrawaisanjum56/Desktop-Clinic-App',
        },
        {
          num: '04',
          type: 'Web3 · Security · Blockchain',
          title: 'VaultChain Auth',
          desc: 'Decentralized identity and authentication system using blockchain attestations. Implements zero-knowledge proofs for privacy-preserving credential verification without revealing user data.',
          stack: ['Solidity', 'ethers.js', 'Next.js', 'ZK-SNARKs', 'IPFS'],
          icon: '🔐',
          bg: 'linear-gradient(135deg, #1a0d0a 0%, #2d1508 100%)',
          challenge: 'Replace this with the security gap you addressed — e.g. verifying identity without ever exposing the underlying personal data.',
          solution: 'Replace this with the technical approach — e.g. zero-knowledge proof circuits plus on-chain attestations stored via IPFS.',
          results: 'Replace this with the outcome — e.g. verification time, audit results, or number of integrations.',
          live: '',
          code: '',
        },
        {
          num: '05',
          type: 'EdTech · Flask · Full-Stack',
          title: 'EduTrack Pro',
          desc: 'Student management system with role-based access control, grade analytics, and performance dashboards. Refactored from a CLI tool into a layered Flask architecture with a modern UI.',
          stack: ['Flask', 'SQLAlchemy', 'Chart.js', 'JWT', 'PostgreSQL'],
          icon: '🎓',
          bg: 'linear-gradient(135deg, #0d0d1a 0%, #0a1220 100%)',
          challenge: 'Replace this with the starting point — e.g. a CLI tool that couldn\'t scale to multiple roles or give teachers usable analytics.',
          solution: 'Replace this with the rebuild — e.g. a layered Flask app with JWT auth, role-based permissions, and Chart.js dashboards.',
          results: 'Replace this with the impact — e.g. number of students/teachers using it, or time saved on grade reporting.',
          live: '',
          code: '',
        },
      ];

      /* ── DOM references ── */
      const viewport = document.getElementById('magViewport');
      const dotsWrap = document.getElementById('magDots');
      const btnPrev = document.getElementById('magPrev');
      const btnNext = document.getElementById('magNext');
      const counterEl = document.getElementById('magCurrent');
      const totalEl = document.getElementById('magTotal');

      if (!viewport) return;

      /* ── Build slides ── */
      projects.forEach((p, i) => {
        const slide = document.createElement('div');
        slide.className = 'mag-slide' + (i === 0 ? ' active' : '');
        slide.innerHTML = `
      <!-- Left: text info -->
      <div class="mag-left">
        <div class="mag-slide-num">${p.num} / ${String(projects.length).padStart(2, '0')}</div>
        <div>
          <div class="mag-slide-type">${p.type}</div>
          <h3 class="mag-slide-title">${p.title}</h3>
          <p class="mag-slide-desc">${p.desc}</p>
          <div class="mag-slide-stack">
            ${p.stack.map(s => `<span class="mag-tech">${s}</span>`).join('')}
          </div>
          <div class="mag-slide-links">
            ${p.live
        ? `<a href="${p.live}" class="mag-link live" target="_blank" rel="noopener">↗ Live Demo</a>`
        : `<span class="mag-link live" style="opacity:.4; cursor:not-allowed;" title="No live demo yet">↗ Live Demo</span>`}
            ${p.code
        ? `<a href="${p.code}" class="mag-link code" target="_blank" rel="noopener">⌥ Source</a>`
        : `<span class="mag-link code" style="opacity:.4; cursor:not-allowed;" title="Repo not public yet">⌥ Source</span>`}
            <button type="button" class="mag-link case" data-case-index="${i}">📄 Case Study</button>
          </div>
        </div>
      </div>

      <!-- Right: visual panel -->
      <div class="mag-right">
        <div class="mag-right-bg" style="background: ${p.bg};"></div>
        <div class="mag-right-overlay"></div>
        <div class="mag-right-icon">${p.icon}</div>
        <div class="mag-right-number">${p.num}</div>
      </div>
    `;
        viewport.appendChild(slide);
      });

      /* ── Build dots ── */
      const dots = projects.map((_, i) => {
        const d = document.createElement('button');
        d.className = 'mag-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', `Go to project ${i + 1}`);
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
        return d;
      });

      /* ── Update total counter ── */
      if (totalEl) totalEl.textContent = String(projects.length).padStart(2, '0');

      /* ── State ── */
      let current = 0;
      let busy = false;
      let autoTimer = null;
      const slides = viewport.querySelectorAll('.mag-slide');

      /* ── Core navigation ── */
      function goTo(index) {
        if (busy || index === current) return;
        busy = true;

        // Fade out current
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');

        current = (index + projects.length) % projects.length;

        // Fade in next
        slides[current].classList.add('active');
        dots[current].classList.add('active');

        // Update counter
        if (counterEl) counterEl.textContent = String(current + 1).padStart(2, '0');

        // Unlock after transition
        setTimeout(() => { busy = false; }, 580);
      }

      function next() { goTo(current + 1); }
      function prev() { goTo(current - 1); }

      /* ── Button click handlers ── */
      if (btnNext) btnNext.addEventListener('click', () => { stopAuto(); next(); });
      if (btnPrev) btnPrev.addEventListener('click', () => { stopAuto(); prev(); });

      /* ── Keyboard navigation ── */
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { stopAuto(); next(); }
        if (e.key === 'ArrowLeft') { stopAuto(); prev(); }
      });

      /* ── Auto-advance (every 4.5s) ── */
      function startAuto() {
        autoTimer = setInterval(next, 4500);
      }
      function stopAuto() {
        clearInterval(autoTimer);
        autoTimer = null;
      }
      startAuto();

      /* ── Touch / swipe support ── */
      let touchStartX = 0;
      let touchStartY = 0;

      viewport.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      viewport.addEventListener('touchend', (e) => {
        const dx = touchStartX - e.changedTouches[0].clientX;
        const dy = touchStartY - e.changedTouches[0].clientY;

        // Only treat as horizontal swipe if x-movement dominates
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) {
          stopAuto();
          dx > 0 ? next() : prev();
        }
      }, { passive: true });

      /* ── Pause auto on hover (desktop) ── */
      const slider = viewport.closest('.mag-slider');
      if (slider) {
        slider.addEventListener('mouseenter', stopAuto);
        slider.addEventListener('mouseleave', startAuto);
      }

    })();


    /* ────────────────────────────────────────────────
       8. CONTACT FORM — REAL SUBMISSION
       — Sends the message to awaisryk56@gmail.com via
         FormSubmit.co (free, no backend required). On the
         very first submission FormSubmit emails a one-time
         confirmation link to that address — click it once
         to activate the form; every submission after that
         is delivered straight to the inbox.
    ──────────────────────────────────────────────── */
    (function initContactForm() {
      // Using the FormSubmit hash (instead of the raw email) keeps your
      // address out of the page's HTML source, so bots scraping public
      // sites for emails to spam can't pick it up. Delivery still goes
      // to the same inbox (awaisryk56@gmail.com) — this only changes
      // what shows up in "view source".
      const FORM_ENDPOINT = 'https://formsubmit.co/ajax/e133fcb8dfc9371a8ae3bcef9d8f2527';

      const form = document.getElementById('contactForm');
      const submit = form ? form.querySelector('.btn-submit') : null;
      const status = form ? form.querySelector('#cf-status') : null;
      if (!form || !submit) return;

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputs = form.querySelectorAll('input[required], textarea[required]');
        const allFilled = [...inputs].every(i => i.value.trim() !== '');

        if (!allFilled) {
          inputs.forEach((input) => {
            if (!input.value.trim()) {
              input.style.borderColor = 'rgba(var(--accent3-rgb), 0.6)';
              input.addEventListener('input', () => {
                input.style.borderColor = '';
              }, { once: true });
            }
          });
          if (status) {
            status.textContent = 'Please fill in all fields.';
            status.style.color = 'var(--accent3)';
          }
          return;
        }

        const original = submit.innerHTML;
        submit.innerHTML = 'Sending…';
        submit.disabled = true;
        if (status) {
          status.textContent = '';
        }

        fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        })
          .then((res) => {
            if (!res.ok) throw new Error('Request failed');
            return res.json();
          })
          .then(() => {
            submit.innerHTML = '✓ Message Sent!';
            submit.style.background = 'var(--accent2)';
            if (status) {
              status.textContent = "Thanks — I'll get back to you soon.";
              status.style.color = 'var(--accent2)';
            }
            form.reset();
          })
          .catch(() => {
            submit.innerHTML = original;
            if (status) {
              status.textContent = 'Something went wrong — please email me directly instead.';
              status.style.color = 'var(--accent3)';
            }
          })
          .finally(() => {
            setTimeout(() => {
              submit.innerHTML = original;
              submit.style.background = '';
              submit.disabled = false;
            }, 3000);
          });
      });
    })();


    /* ────────────────────────────────────────────────
       9. PRELOADER
       — Hides once window fully loads (min display time
         so the animation doesn't just flash).
    ──────────────────────────────────────────────── */
    (function initPreloader() {
      const pre = document.getElementById('preloader');
      if (!pre) return;
      const shownAt = Date.now();
      const minDisplay = 900;

      window.addEventListener('load', () => {
        const elapsed = Date.now() - shownAt;
        const wait = Math.max(0, minDisplay - elapsed);
        setTimeout(() => {
          pre.classList.add('hidden');
          setTimeout(() => pre.remove(), 700);
        }, wait);
      });

      // Safety net in case 'load' never fires cleanly
      setTimeout(() => pre.classList.add('hidden'), 4000);
    })();


    /* ────────────────────────────────────────────────
      10. BACK TO TOP
       — Appears after scrolling, ring shows scroll %.
    ──────────────────────────────────────────────── */
    (function initBackToTop() {
      const btn = document.getElementById('backToTop');
      const ring = btn ? btn.querySelector('.progress') : null;
      if (!btn || !ring) return;

      const circumference = 2 * Math.PI * 23; // r=23

      window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const pct = maxScroll > 0 ? scrolled / maxScroll : 0;

        ring.style.strokeDashoffset = circumference * (1 - pct);
        btn.classList.toggle('visible', scrolled > 480);
      }, { passive: true });

      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    })();


    /* ────────────────────────────────────────────────
      11. CARD SPOTLIGHT + TILT
       — Cursor-tracked glow on skill / testimonial /
         about cards, plus a subtle 3D tilt on skill
         cards and the about photo frame.
    ──────────────────────────────────────────────── */
    (function initCardEffects() {
      const glowSelector = '.skill-card, .t-card, .about-frame';
      const tiltSelector = '.skill-card, .about-frame';

      document.querySelectorAll(glowSelector).forEach((card) => {
        const spot = document.createElement('div');
        spot.className = 'card-spotlight';
        card.appendChild(spot);

        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--sx', x + 'px');
          card.style.setProperty('--sy', y + 'px');
        });
      });

      // Respect users who prefer reduced motion
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) return;

      document.querySelectorAll(tiltSelector).forEach((card) => {
        let bounds;

        card.addEventListener('mouseenter', () => {
          bounds = card.getBoundingClientRect();
        });

        card.addEventListener('mousemove', (e) => {
          if (!bounds) bounds = card.getBoundingClientRect();
          const relX = (e.clientX - bounds.left) / bounds.width - 0.5;
          const relY = (e.clientY - bounds.top) / bounds.height - 0.5;
          const rotateX = (relY * -6).toFixed(2);
          const rotateY = (relX * 6).toFixed(2);
          card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });
    })();


    /* ────────────────────────────────────────────────
      12. MAGNETIC BUTTONS
       — Primary / ghost / nav CTA buttons pull slightly
         toward the cursor for a tactile, premium feel.
    ──────────────────────────────────────────────── */
    (function initMagneticButtons() {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) return;

      document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35 - 2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.transform = '';
        });
      });
    })();


    /* ────────────────────────────────────────────────
      13. HERO ORB PARALLAX
       — Ambient glow orbs drift toward the cursor for
         a subtle sense of depth.
    ──────────────────────────────────────────────── */
    (function initOrbParallax() {
      const hero = document.getElementById('hero');
      const orbs = hero ? hero.querySelectorAll('.hero-orb') : [];
      if (!hero || !orbs.length) return;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) return;

      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;

        orbs.forEach((orb, i) => {
          const depth = (i + 1) * 10;
          orb.style.translate = `${relX * depth}px ${relY * depth}px`;
        });
      });
    })();


    /* ────────────────────────────────────────────────
      14. THEME TOGGLE (DARK / LIGHT)
       — Persists choice in localStorage, falls back to
         the visitor's OS preference on first visit.
    ──────────────────────────────────────────────── */
    (function initThemeToggle() {
      const toggle = document.getElementById('themeToggle');
      const root = document.documentElement;
      if (!toggle) return;

      const stored = localStorage.getItem('theme');
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      const initial = stored || (prefersLight ? 'light' : 'dark');

      if (initial === 'light') root.setAttribute('data-theme', 'light');

      toggle.addEventListener('click', () => {
        const isLight = root.getAttribute('data-theme') === 'light';
        if (isLight) {
          root.removeAttribute('data-theme');
          localStorage.setItem('theme', 'dark');
        } else {
          root.setAttribute('data-theme', 'light');
          localStorage.setItem('theme', 'light');
        }
      });
    })();


    /* ────────────────────────────────────────────────
      15. CASE STUDY MODAL
       — Reads the same `projects` data used by the
         magazine slider (re-declared here to avoid
         needing to refactor the slider module).
    ──────────────────────────────────────────────── */
    (function initCaseStudyModal() {
      const overlay = document.getElementById('caseModalOverlay');
      const closeBtn = document.getElementById('caseModalClose');
      if (!overlay || !closeBtn) return;

      // NOTE: keep this in sync with the `projects` array above if you
      // add/remove/reorder projects in the magazine slider.
      const projects = [
        { type: 'AI · Django · Machine Learning', title: 'AgroSmart Platform',
          challenge: 'Replace this with the specific problem farmers/buyers faced — e.g. no reliable way to grade wheat quality at scale, and no single source for daily market prices.',
          solution: 'Replace this with what you actually built — e.g. a MobileNetV2 classifier trained on grain images plus a scheduled scraper that keeps prices fresh without manual work.',
          results: 'Replace this with the measurable outcome — e.g. classification accuracy, time saved per batch, or number of users/vendors onboarded.',
          stack: ['Django', 'MobileNetV2', 'BeautifulSoup', 'PostgreSQL', 'APScheduler'],
          live: '', code: 'https://github.com/Mrawaisanjum56/AI-Agriculture_MarketPlace' },
        { type: 'AI · NLP · Real-time API', title: 'NeuralChat Engine',
          challenge: 'Replace this with the constraint you were solving for — e.g. keeping conversations context-aware at scale while staying fast under real traffic.',
          solution: 'Replace this with the architecture decisions — e.g. Redis-backed memory, WebSocket streaming, and a routing layer that picks the right model per request.',
          results: 'Replace this with real numbers — e.g. message volume handled, latency achieved, or cost per conversation reduced.',
          stack: ['FastAPI', 'LangChain', 'Redis', 'WebSocket', 'OpenAI'],
          live: '', code: '' },
        { type: 'SaaS · Analytics · React', title: 'DataPulse Analytics',
          challenge: 'Replace this with the business problem — e.g. teams needed live metrics without waiting on manual report exports.',
          solution: 'Replace this with the build — e.g. a TimescaleDB pipeline streaming through WebSockets into a drag-and-drop widget dashboard.',
          results: 'Replace this with adoption/impact numbers — e.g. companies onboarded, hours saved per report cycle, or retention lift.',
          stack: ['React', 'D3.js', 'Node.js', 'TimescaleDB', 'WebSocket'],
          live: '', code: '' },
        { type: 'Web3 · Security · Blockchain', title: 'VaultChain Auth',
          challenge: 'Replace this with the security gap you addressed — e.g. verifying identity without ever exposing the underlying personal data.',
          solution: 'Replace this with the technical approach — e.g. zero-knowledge proof circuits plus on-chain attestations stored via IPFS.',
          results: 'Replace this with the outcome — e.g. verification time, audit results, or number of integrations.',
          stack: ['Solidity', 'ethers.js', 'Next.js', 'ZK-SNARKs', 'IPFS'],
          live: '', code: '' },
        { type: 'EdTech · Flask · Full-Stack', title: 'EduTrack Pro',
          challenge: 'Replace this with the starting point — e.g. a CLI tool that couldn\'t scale to multiple roles or give teachers usable analytics.',
          solution: 'Replace this with the rebuild — e.g. a layered Flask app with JWT auth, role-based permissions, and Chart.js dashboards.',
          results: 'Replace this with the impact — e.g. number of students/teachers using it, or time saved on grade reporting.',
          stack: ['Flask', 'SQLAlchemy', 'Chart.js', 'JWT', 'PostgreSQL'],
          live: '', code: '' },
      ];

      let lastFocused = null;

      function openModal(index) {
        const p = projects[index];
        if (!p) return;

        document.getElementById('caseModalType').textContent = p.type;
        document.getElementById('caseModalTitle').textContent = p.title;
        document.getElementById('caseModalChallenge').textContent = p.challenge;
        document.getElementById('caseModalSolution').textContent = p.solution;
        document.getElementById('caseModalResults').textContent = p.results;

        const stackWrap = document.getElementById('caseModalStack');
        stackWrap.innerHTML = '';
        p.stack.forEach((s) => {
          const chip = document.createElement('span');
          chip.className = 'chip';
          chip.textContent = s;
          stackWrap.appendChild(chip);
        });

        // Point the modal's Live Demo / Source links at this project's
        // real URLs. If a URL is blank, disable that link instead of
        // leaving a dead "#" that silently does nothing.
        const liveLink = document.querySelector('.case-modal-links .mag-link.live');
        const codeLink = document.querySelector('.case-modal-links .mag-link.code');
        if (liveLink) {
          if (p.live) {
            liveLink.href = p.live;
            liveLink.removeAttribute('aria-disabled');
            liveLink.style.opacity = '';
            liveLink.style.pointerEvents = '';
          } else {
            liveLink.href = '#';
            liveLink.setAttribute('aria-disabled', 'true');
            liveLink.style.opacity = '.4';
            liveLink.style.pointerEvents = 'none';
          }
        }
        if (codeLink) {
          if (p.code) {
            codeLink.href = p.code;
            codeLink.removeAttribute('aria-disabled');
            codeLink.style.opacity = '';
            codeLink.style.pointerEvents = '';
          } else {
            codeLink.href = '#';
            codeLink.setAttribute('aria-disabled', 'true');
            codeLink.style.opacity = '.4';
            codeLink.style.pointerEvents = 'none';
          }
        }

        lastFocused = document.activeElement;
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
      }

      function closeModal() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
      }

      // Delegated click — buttons are injected dynamically by the slider
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-case-index]');
        if (btn) {
          e.preventDefault();
          openModal(Number(btn.dataset.caseIndex));
        }
      });

      closeBtn.addEventListener('click', closeModal);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
      });
    })();


    /* ────────────────────────────────────────────────
      16. LIVE GITHUB STATS
       — Pulls public repo count from the GitHub API and
         drops it into the stats bar. Fails silently and
         leaves the static number in place if offline or
         rate-limited.
    ──────────────────────────────────────────────── */
    (function initGithubStats() {
      const target = document.querySelector('[data-github-stat]');
      if (!target) return;

      fetch('https://api.github.com/users/Mrawaisanjum56')
        .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
        .then((data) => {
          if (typeof data.public_repos === 'number') {
            target.textContent = data.public_repos + '+';
          }
        })
        .catch(() => {
          // Silently keep the static fallback value already in the markup
        });
    })();
