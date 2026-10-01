(function() {
  'use strict';
  document.documentElement.classList.add('js');

  // --- Contact Form ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const FORM_ENDPOINT = '';
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const statusEl = contactForm.querySelector('.form__status');
    const fields = {
      name: contactForm.querySelector('#name'),
      email: contactForm.querySelector('#email'),
      subject: contactForm.querySelector('#subject'),
      message: contactForm.querySelector('#message'),
      website: contactForm.querySelector('#website')
    };

    function setFieldError(field, message) {
      const errorEl = contactForm.querySelector(`#${field.id}-error`);
      if (!errorEl) return;
      errorEl.textContent = message || '';
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (message) {
        field.setAttribute('aria-describedby', `${field.id}-error`);
      } else {
        field.removeAttribute('aria-describedby');
      }
    }

    function validateField(field) {
      const value = field.value.trim();
      let message = '';

      if (field === fields.name && !value) {
        message = 'Please enter your name.';
      }

      if (field === fields.email) {
        if (!value) {
          message = 'Please enter your email.';
        } else if (!field.validity.valid) {
          message = 'Please enter a valid email address.';
        }
      }

      if (field === fields.message) {
        if (!value) {
          message = 'Please enter a message.';
        } else if (value.length < 20) {
          message = 'Message must be at least 20 characters.';
        }
      }

      setFieldError(field, message);
      return !message;
    }

    function updateMessageCount() {
      const countEl = contactForm.querySelector('[data-count-for="message"]');
      if (!countEl) return;
      const length = fields.message.value.length;
      countEl.textContent = `${length} / 20`;
    }

    function focusFirstInvalid() {
      const firstInvalid = [...contactForm.querySelectorAll('input, textarea')].find(input => input.getAttribute('aria-invalid') === 'true');
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }

    Object.values(fields).forEach(field => {
      if (!field) return;
      field.addEventListener('blur', () => validateField(field));
      if (field === fields.message) {
        field.addEventListener('input', () => {
          updateMessageCount();
          if (field.value.trim().length >= 20) {
            setFieldError(field, '');
          }
        });
      }
    });

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (fields.website && fields.website.value.trim()) {
        return;
      }

      const results = [
        validateField(fields.name),
        validateField(fields.email),
        validateField(fields.message)
      ];

      const hasErrors = results.some(result => result === false);
      if (hasErrors) {
        focusFirstInvalid();
        return;
      }

      if (!submitBtn || !statusEl) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      statusEl.textContent = '';
      statusEl.className = 'form__status';

      if (FORM_ENDPOINT) {
        try {
          const payload = {
            name: fields.name.value.trim(),
            email: fields.email.value.trim(),
            subject: fields.subject.value.trim(),
            message: fields.message.value.trim()
          };

          const response = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            throw new Error('Request failed');
          }

          statusEl.textContent = 'Thanks! Your message was sent successfully.';
          statusEl.classList.add('is-success');
          contactForm.reset();
          updateMessageCount();
        } catch (error) {
          statusEl.textContent = 'Something went wrong while sending your message. Please try again.';
          statusEl.classList.add('is-error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send message';
        }
        return;
      }

      const name = encodeURIComponent(fields.name.value.trim());
      const senderEmail = encodeURIComponent(fields.email.value.trim());
      const subject = encodeURIComponent(fields.subject.value.trim() || 'Portfolio enquiry');
      const message = encodeURIComponent(fields.message.value.trim());
      const body = encodeURIComponent(`Name: ${fields.name.value.trim()}\nEmail: ${fields.email.value.trim()}\n\n${fields.message.value.trim()}`);

      window.location.href = `mailto:harishb934522@gmail.com?subject=${subject}&body=${body}`;
      statusEl.textContent = 'Your email app should open. If it doesn\'t, email me directly.';
      statusEl.classList.add('is-success');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
      contactForm.reset();
      updateMessageCount();
    });

    updateMessageCount();
  }

  // --- Copy email button ---
  const copyBtn = document.querySelector('.contact-copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const value = copyBtn.getAttribute('data-copy') || '';
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = value;
          textarea.setAttribute('readonly', '');
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          textarea.setSelectionRange(0, textarea.value.length);
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        document.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Email copied' } }));
      } catch (error) {
        document.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Copy failed' } }));
      }
    });
  }

  // --- Theme Management ---
  const themeBtn = document.querySelector('.nav__theme-btn');
  
  function getTheme() {
    try {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) return storedTheme;
    } catch (e) {
      // Ignore storage errors
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeBtn) {
      const isDark = theme === 'dark';
      themeBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      themeBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // Ignore storage errors
    }
  }

  if (themeBtn) {
    setTheme(document.documentElement.getAttribute('data-theme') || getTheme());
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  // --- Mobile Menu ---
  const hamburger = document.querySelector('.nav__hamburger');
  const navList = document.querySelector('.nav__list');
  
  if (hamburger && navList) {
    const toggleMenu = (forceClose = false) => {
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      const willOpen = !isExpanded && !forceClose;
      
      hamburger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      if (willOpen) {
        navList.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      } else {
        navList.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    };

    hamburger.addEventListener('click', () => toggleMenu());
    
    // Close on link click
    navList.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'a') {
        toggleMenu(true);
      }
    });

    // Close on Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggleMenu(true);
    });

    // Close on resize past 900px
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 900) {
        toggleMenu(true);
      }
    });
  }

  // --- Active Nav Link ---
  const pageId = document.body.getAttribute('data-page');
  if (pageId) {
    const activeLink = document.querySelector(`.nav__link[data-nav="${pageId}"]`);
    if (activeLink) {
      activeLink.setAttribute('aria-current', 'page');
    }
  }

  // --- Reveal on Scroll ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal');

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay') || '0';
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, parseInt(delay, 10));
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // If reduced motion or no observer, show immediately
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // --- Lightbox ---
  const lightboxTriggers = document.querySelectorAll('[data-lightbox]');
  
  if (lightboxTriggers.length > 0) {
    // Create dialog element
    const dialog = document.createElement('dialog');
    dialog.className = 'lightbox';
    dialog.innerHTML = `
      <div class="lightbox__content">
        <button class="lightbox__close" aria-label="Close lightbox">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <img class="lightbox__img" src="" alt="">
        <div class="lightbox__caption"></div>
      </div>
    `;
    document.body.appendChild(dialog);

    const img = dialog.querySelector('.lightbox__img');
    const caption = dialog.querySelector('.lightbox__caption');
    const closeBtn = dialog.querySelector('.lightbox__close');
    let lastFocused = null;

    lightboxTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        lastFocused = document.activeElement;
        
        img.src = trigger.getAttribute('data-src') || trigger.getAttribute('href');
        img.alt = trigger.getAttribute('data-caption') || '';
        caption.textContent = trigger.getAttribute('data-caption') || '';
        
        dialog.showModal();
      });
    });

    const closeDialog = () => {
      dialog.close();
      if (lastFocused) lastFocused.focus();
    };

    closeBtn.addEventListener('click', closeDialog);
    
    // Backdrop click
    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const inDialog = e.clientX >= rect.left && e.clientX <= rect.right &&
                       e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inDialog) closeDialog();
    });
  }

  // --- Footer Year ---
  const yearEl = document.querySelector('.footer__year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- Toast ---
  let toastTimeout;
  const showToast = (message) => {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('is-active');
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('is-active');
    }, 3000);
  };

  // Expose toast via custom event
  document.addEventListener('toast', (e) => {
    if (e.detail && e.detail.message) {
      showToast(e.detail.message);
    }
  });

  // --- Toggle Buttons ---
  const toggleBtns = document.querySelectorAll('[data-toggle-target]');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-toggle-target');
      const target = document.getElementById(targetId);
      if (target) {
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !isExpanded);
        
        if (isExpanded) {
          target.classList.remove('is-expanded');
          btn.textContent = btn.getAttribute('data-text-expand');
        } else {
          target.classList.add('is-expanded');
          btn.textContent = btn.getAttribute('data-text-collapse');
        }
      }
    });
  });

  // --- LeetCode Stats ---
  const lcCards = document.querySelectorAll('.lc-card');
  lcCards.forEach(card => {
    ['solved', 'rating', 'streak'].forEach(stat => {
      const val = card.getAttribute(`data-${stat}`);
      const statEl = card.querySelector(`.lc-stat[data-type="${stat}"] .lc-stat__val`);
      if (val && statEl) {
        statEl.textContent = val;
      }
    });
  });

})();
