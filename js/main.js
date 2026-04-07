/* =========================================
   The Consulting Group at Baylor - Main JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  // --- Check for reduced motion preference ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Navbar scroll ---
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Mobile nav ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('active'));
    });
  }

  // --- Hero background slider ---
  const heroBg = document.getElementById('heroBackground');
  const heroIndicators = document.getElementById('heroIndicators');
  if (heroBg) {
    const slides = [
      'assets/images/foster-exterior.png',
      'assets/images/foster-interior.png'
    ];
    let currentSlide = 0;
    heroBg.style.backgroundImage = `url('${slides[0]}')`;

    if (heroIndicators) {
      heroIndicators.children[0].classList.add('active');
    }

    function changeSlide(idx) {
      if (idx === undefined) {
        currentSlide = (currentSlide + 1) % slides.length;
      } else {
        currentSlide = idx;
      }
      heroBg.style.opacity = 0;
      setTimeout(() => {
        heroBg.style.backgroundImage = `url('${slides[currentSlide]}')`;
        heroBg.style.opacity = 1;
      }, 600);
      if (heroIndicators) {
        Array.from(heroIndicators.children).forEach((dot, i) => {
          dot.classList.toggle('active', i === currentSlide);
        });
      }
    }

    // Only auto-rotate if user doesn't prefer reduced motion
    if (!prefersReducedMotion) {
      setInterval(() => changeSlide(), 7000);
    }

    if (heroIndicators) {
      Array.from(heroIndicators.children).forEach((dot, i) => {
        dot.addEventListener('click', () => changeSlide(i));
      });
    }
  }

  // --- Video modal ---
  const videoCard = document.getElementById('videoCard');
  const videoModal = document.getElementById('videoModal');
  const videoFrame = document.getElementById('videoFrame');
  const videoModalClose = document.getElementById('videoModalClose');
  const videoOverlay = videoModal ? videoModal.querySelector('.modal-overlay') : null;

  if (videoCard && videoModal && videoFrame) {
    videoCard.addEventListener('click', () => {
      // Replace with actual CGB video URL when available
      videoFrame.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
      videoModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeVideoModal = () => {
      videoModal.classList.remove('active');
      videoFrame.src = '';
      document.body.style.overflow = '';
    };

    if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
    if (videoOverlay) videoOverlay.addEventListener('click', closeVideoModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('active')) closeVideoModal();
    });
  }

  // --- Animated counters ---
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length) {
    const observerCounter = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          
          // Skip animation if user prefers reduced motion
          const suffix = el.dataset.suffix || '';

          if (prefersReducedMotion) {
            el.textContent = parseInt(el.dataset.target).toLocaleString() + suffix;
            observerCounter.unobserve(el);
            return;
          }
          
          const target = parseInt(el.dataset.target);
          const duration = 1200;
          const start = performance.now();
          
          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(ease * target).toLocaleString() + suffix;
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              el.textContent = target.toLocaleString() + suffix;
            }
          }
          requestAnimationFrame(tick);
          observerCounter.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(c => observerCounter.observe(c));
  }

  // --- Scroll fade-up animation ---
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length && !prefersReducedMotion) {
    const observerFade = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observerFade.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observerFade.observe(el));
  } else if (fadeEls.length && prefersReducedMotion) {
    // If reduced motion preferred, just show everything
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // --- FAQ accordion ---
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // --- Project modal ---
  const projectModal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');
  const projectModalOverlay = projectModal ? projectModal.querySelector('.modal-overlay') : null;

  const projectData = {
    'market-entry': {
      title: 'Market Entry Strategy',
      client: 'Local Food & Beverage Startup',
      desc: 'Conducted comprehensive market research and competitive analysis for a local F&B startup looking to expand into the Austin market. Delivered a go-to-market strategy with pricing recommendations and distribution channel analysis.',
      outcomes: ['Market sizing completed', 'Competitive landscape mapped', 'GTM strategy delivered', '3 distribution partnerships identified']
    },
    'ops-efficiency': {
      title: 'Operational Efficiency Assessment',
      client: 'Waco Nonprofit Organization',
      desc: 'Evaluated operational workflows and identified process improvements for a local nonprofit. Implemented Lean principles to reduce administrative overhead and improve volunteer coordination.',
      outcomes: ['30% reduction in admin time', 'New volunteer management system', 'Cost savings of $15K annually', 'Process documentation delivered']
    },
    'digital-transformation': {
      title: 'Digital Transformation Roadmap',
      client: 'Regional Healthcare Provider',
      desc: 'Developed a comprehensive digital transformation strategy for a regional healthcare provider, focusing on patient engagement and operational efficiency through technology adoption.',
      outcomes: ['Technology assessment completed', '3-year roadmap delivered', 'Vendor evaluation matrix', 'Change management plan']
    },
    'growth-strategy': {
      title: 'Growth Strategy Development',
      client: 'Texas-Based Social Enterprise',
      desc: 'Created a sustainable growth strategy for a social enterprise focused on workforce development. Analyzed market opportunities and developed financial projections for expansion.',
      outcomes: ['5-year financial model', 'Market expansion plan', 'Partnership strategy', 'Impact measurement framework']
    }
  };

  document.querySelectorAll('.project-card[data-project]').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.project;
      const data = projectData[key];
      if (!data || !modalContent || !projectModal) return;
      modalContent.innerHTML = `
        <h2 style="margin-bottom:6px;">${data.title}</h2>
        <p style="color:var(--green-600);font-weight:600;margin-bottom:16px;">${data.client}</p>
        <p style="color:var(--gray-600);line-height:1.7;margin-bottom:20px;">${data.desc}</p>
        <h4 style="margin-bottom:10px;">Key Outcomes</h4>
        <ul style="list-style:none;">
          ${data.outcomes.map(o => `<li style="padding:4px 0 4px 22px;position:relative;color:var(--gray-600);font-size:0.92rem;"><span style="position:absolute;left:0;color:var(--green-500);font-weight:700;">✓</span>${o}</li>`).join('')}
        </ul>
      `;
      projectModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeProjectModal = () => {
    if (projectModal) {
      projectModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };
  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  if (projectModalOverlay) projectModalOverlay.addEventListener('click', closeProjectModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) closeProjectModal();
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });
});
