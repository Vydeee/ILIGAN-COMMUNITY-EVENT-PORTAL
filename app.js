/* =========================================================
   Iligan Community Event Portal — Front-End Application
   Vanilla ES6+, Native HTML5/CSS3. No external frameworks.
   Includes:
     - Top Hero Carousel with 5s Interval & Progress Bar
     - Spacious, Uncluttered Event Cards with Pinned Actions
     - Interactive, Animated Authentication Modal
     - Safe DOM construction using textContent to prevent XSS
     - Role-Based Dashboards & Native Modals
   ========================================================= */
(() => {
  'use strict';

  /* ---------- Constants & State ---------- */
  const API_URL = 'api.php';
  const PAGE_SIZE = 9;
  const USER_STORAGE_KEY = 'iligan_current_user';
  const CAROUSEL_INTERVAL_MS = 5000;
  const ROLE_NAMES = { user: 'Citizen', organizer: 'Coordinator', admin: 'Administrator' };
  const DEFAULT_CATEGORIES = ['Festival', 'Eco-Tourism', 'Arts & Culture', 'Sports', 'LGU Public Service', 'Community', 'Guided tours', 'Workshops', 'Heritage'];

  const ROUTES = {
    home: { title: 'Home' },
    events: { title: 'Discover Events' },
    about: { title: 'About Us' },
    contact: { title: 'Contact Us' },
    guide: { title: 'Portal Guide' },
    citizen: { title: 'Citizen Dashboard', roles: ['user'] },
    bookings: { title: 'My Bookings', roles: ['user', 'organizer', 'admin'] },
    dashboard: { title: 'Coordinator Dashboard', roles: ['organizer'] },
    admin: { title: 'Admin Console', roles: ['admin'] }
  };

  const DEFAULT_CAROUSEL_SLIDES = [
    {
      title: "Diyandi Festival 2026: Kasadya sa Diyandi",
      subtitle: "The grand street dancing centerpiece honoring patron saint Señor San Miguel with exuberant tri-people cultural contingents.",
      badge: "Featured Festival Highlight",
      meta: "September 27 · Quezon Ave to Anahaw Amphitheater",
      image: "images/kasadya_sa_diyandi.jpg",
      actionText: "Explore Festival",
      eventId: 1
    },
    {
      title: "Anahaw Amphitheater Sunset Concerts",
      subtitle: "Overlooking Buhanginan Hills with acoustic harana sessions, youth indie bands, and sunset symphonies under the evening sky.",
      badge: "Arts & Culture",
      meta: "October 18 · Buhanginan Hills, Pala-o",
      image: "images/anahaw_amphitheater.jpg",
      actionText: "View Concert Pass",
      eventId: 13
    },
    {
      title: "Diyandi Paramotor & Aerial Display Show",
      subtitle: "High-flying acrobatic paramotor pilots soaring over the picturesque Iligan bayfront coastline and downtown avenues.",
      badge: "Eco-Tourism & Sports",
      meta: "September 28 · Iligan Bay Coastline",
      image: "images/diyandi_paramotor_show.jpg",
      actionText: "View Schedule",
      eventId: 16
    },
    {
      title: "Pagkanaug sa San Miguel Civic Procession",
      subtitle: "Solemn traditional ceremonial rites uniting all 44 barangays of the City of Majestic Waterfalls in shared devotion.",
      badge: "Civic & Heritage",
      meta: "September 29 · St. Michael Cathedral, Poblacion",
      image: "images/pagkanaug_san_miguel.jpg",
      actionText: "View Details",
      eventId: 1
    }
  ];

  const state = {
    user: null,
    events: [],
    barangays: [],
    tags: [],
    settings: {},
    bookings: [],
    page: 1,
    eventsLoaded: false,
    filters: { search: '', category: 'All', barangay: '', coordinator: '', price: '', date: '', sort: 'date', past: false },
    carouselIndex: 0,
    carouselTimer: null,
    carouselProgressStart: null,
    carouselAnimFrame: null,
    carouselSlides: [...DEFAULT_CAROUSEL_SLIDES]
  };

  /* ---------- DOM Helpers ---------- */
  const find = (selector, root = document) => root.querySelector(selector);
  const findAll = (selector, root = document) => [...root.querySelectorAll(selector)];

  function createElement(tag, attributes = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attributes || {})) {
      if (value == null || value === false) continue;
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2), value);
      else node.setAttribute(key, value === true ? '' : value);
    }
    for (const child of children.flat()) {
      if (child == null || child === false) continue;
      node.append(child.nodeType ? child : document.createTextNode(String(child)));
    }
    return node;
  }
  const clear = (node) => { node.replaceChildren(); return node; };

  /* Native line-style SVG icons */
  const ICONS = {
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    ticket: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><path d="M13 5v2M13 11v2M13 17v2"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    warning: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    check: '<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>',
    error: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    trash: '<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.1z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    arrowLeft: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
    arrowRight: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    badgeCheck: '<path d="M12 2l3.09 3.26 4.41.64 1.55 4.19 3.1 3.25-3.1 3.26-1.55 4.19-4.41.64L12 22l-3.09-3.26-4.41-.64-1.55-4.19-3.1-3.26 3.1-3.25 1.55-4.19 4.41-.64z"/><polyline points="9 12 11 14 15 10"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'
  };
  function icon(name, className = '') {
    const template = document.createElement('template');
    template.innerHTML = `<svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;
    return template.content.firstElementChild;
  }

  /* ---------- Formatting ---------- */
  const todayDate = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const toNumber = (value) => Number(value) || 0;
  const isFree = (event) => toNumber(event.price) <= 0;
  const formatPrice = (amount) => (toNumber(amount) <= 0 ? 'FREE' : '₱' + toNumber(amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  const formatDate = (dateText) => new Date(dateText + 'T00:00:00').toLocaleDateString('en-PH', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const parseDateParts = (dateText) => {
    const date = new Date(dateText + 'T00:00:00');
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate()
    };
  };
  function formatTime(time) {
    const [hour, minute] = String(time || '00:00').split(':');
    const date = new Date(); date.setHours(+hour, +minute, 0, 0);
    return date.toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' });
  }
  const isPast = (event) => event.event_date < todayDate();
  const seatsTaken = (event) => Math.max(0, toNumber(event.total_slots) - toNumber(event.available_slots));
  function formatLocation(event) {
    const venue = (event.venue_name || '').trim();
    const barangay = (event.barangay || '').trim();
    if (!venue || !barangay) return venue || barangay;
    const lastPart = venue.split(',').pop().trim();
    return lastPart.toLowerCase() === barangay.toLowerCase() ? venue : `${venue}, ${barangay}`;
  }
  const canBook = (event) => event.status === 'active' && toNumber(event.available_slots) > 0 && !isPast(event);
  const debounce = (callback, delay = 350) => { let timer; return (...argumentsList) => { clearTimeout(timer); timer = setTimeout(() => callback(...argumentsList), delay); }; };

  const DEFAULT_EVENT_IMAGE = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">' +
    '<rect width="800" height="450" fill="#EBF0FF"/>' +
    '<g fill="none" stroke="#1E3A8A" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" transform="translate(340 140)">' +
    '<rect x="0" y="12" width="120" height="110" rx="12"/><path d="M0 48h120M32 0v28M88 0v28"/></g>' +
    '<text x="400" y="330" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#1E3A8A">Iligan City Event</text></svg>');

  function createEventImage(event) {
    const image = createElement('img', { src: event.image_url || DEFAULT_EVENT_IMAGE, alt: `${event.title} event banner`, loading: 'lazy', width: 800, height: 450 });
    image.addEventListener('error', () => { if (image.src !== DEFAULT_EVENT_IMAGE) image.src = DEFAULT_EVENT_IMAGE; });
    return image;
  }

  /* ---------- API Client ---------- */
  async function api(action, { params = {}, body = null } = {}) {
    const url = new URL(API_URL, location.href);
    url.searchParams.set('action', action);
    for (const [key, value] of Object.entries(params)) if (value !== '' && value != null) url.searchParams.set(key, value);
    const requestOptions = { headers: {} };
    if (body) {
      requestOptions.method = 'POST';
      requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(body);
    }
    try {
      const response = await fetch(url, requestOptions);
      const json = await response.json();
      if (response.status === 401 && state.user && action !== 'login') {
        setUser(null);
        findAll('dialog[open]').forEach((dialog) => dialog.close());
        route();
      }
      return { ok: !!json.success, status: response.status, message: json.message || '', tip: json.actionable_tip || '', data: json.data };
    } catch {
      return { ok: false, message: 'We could not reach the server.', tip: 'Make sure Apache and MySQL are running in XAMPP, then try again.', data: null };
    }
  }

  /* ---------- UI Kit: Alerts, Toasts, Confirm ---------- */
  function alertBox(type, title, text, { dismissible = true, actions = [] } = {}) {
    const box = createElement('div', { class: `alert alert-${type}`, role: type === 'error' ? 'alert' : 'status' },
      icon({ info: 'info', warning: 'warning', success: 'check', error: 'error' }[type]),
      createElement('div', { class: 'alert-body' },
        title && createElement('p', { class: 'alert-title', text: title }),
        text && createElement('p', { class: 'alert-text', text }),
        actions.length ? createElement('div', { class: 'form-actions' }, actions) : null),
      dismissible && createElement('button', { type: 'button', class: 'icon-button alert-close', 'aria-label': 'Dismiss message', onclick: () => box.remove() }, icon('x', 'icon-small')));
    return box;
  }
  function showAlert(target, type, title, text, options) {
    const host = typeof target === 'string' ? find(target) : target;
    clear(host).append(alertBox(type, title, text, options));
  }
  const clearAlert = (target) => clear(typeof target === 'string' ? find(target) : target);
  const showApiError = (target, response) => showAlert(target, 'error', response.message || 'Something went wrong.', response.tip);

  function toast(message, { type = 'info', actionLabel = '', onAction = null, duration = 5000 } = {}) {
    const node = createElement('div', { class: `toast toast-${type}`, role: type === 'error' ? 'alert' : 'status' }, icon({ info: 'info', warning: 'warning', success: 'check', error: 'error' }[type]), createElement('p', { class: 'toast-text', text: message }));
    const region = find('#toast-region');
    const host = findAll('dialog[open]').at(-1) || document.body;
    if (region.parentElement !== host) {
      region.hidePopover();
      host.append(region);
    }
    const remove = () => {
      node.remove();
      if (!region.childElementCount) region.hidePopover();
    };
    if (actionLabel) node.append(createElement('button', { type: 'button', class: 'button button-plain', onclick: () => { remove(); onAction && onAction(); } }, actionLabel));
    node.append(createElement('button', { type: 'button', class: 'icon-button', 'aria-label': 'Dismiss notification', onclick: remove }, icon('x', 'icon-small')));
    region.append(node);
    region.showPopover();
    setTimeout(remove, duration);
  }

  async function withLoading(button, task) {
    button.classList.add('is-loading'); button.disabled = true; button.setAttribute('aria-busy', 'true');
    try { return await task(); } finally { button.classList.remove('is-loading'); button.disabled = false; button.removeAttribute('aria-busy'); }
  }

  function confirmAction({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Keep It', requireText = '' }) {
    return new Promise((resolve) => {
      const dialog = find('#dlg-confirm'), confirmButton = find('#confirm-button'), cancel = find('#confirm-cancel'), input = find('#confirmation-text');
      find('#confirm-title').textContent = title;
      find('#confirm-message').textContent = message;
      confirmButton.textContent = confirmLabel; cancel.textContent = cancelLabel;
      find('#confirmation-text-field').hidden = !requireText;
      input.value = ''; input.placeholder = requireText; confirmButton.disabled = !!requireText;
      if (requireText) find('#confirmation-text-label').textContent = `Type "${requireText}" in capital letters to confirm:`;
      input.oninput = () => { confirmButton.disabled = input.value !== requireText; };
      let result = false;
      confirmButton.onclick = () => { result = true; dialog.close(); };
      cancel.onclick = () => dialog.close();
      dialog.addEventListener('close', () => resolve(result), { once: true });
      dialog.showModal();
      (requireText ? input : cancel).focus();
    });
  }

  function setFieldError(input, message) {
    clearFieldError(input);
    const id = `${input.id}-err`;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', [input.getAttribute('aria-describedby'), id].filter(Boolean).join(' '));
    const field = input.closest('.field') || input.parentElement;
    field.append(createElement('p', { class: 'field-error', id }, icon('error', 'icon-small'), createElement('span', { text: message })));
  }
  function clearFieldError(input) {
    input.removeAttribute('aria-invalid');
    const id = `${input.id}-err`;
    find(`#${id}`)?.remove();
    const descriptionIds = (input.getAttribute('aria-describedby') || '').split(' ').filter((descriptionId) => descriptionId && descriptionId !== id).join(' ');
    descriptionIds ? input.setAttribute('aria-describedby', descriptionIds) : input.removeAttribute('aria-describedby');
  }
  function applyRules(form, rules) {
    findAll('input,select,textarea', form).forEach(clearFieldError);
    const errors = rules.filter(([, message]) => message);
    errors.forEach(([input, message]) => setFieldError(input, message));
    errors[0]?.[0].focus();
    return errors.length === 0;
  }
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  function initTabs(tablist, onSelect) {
    const tabs = findAll('[role="tab"]', tablist);
    const select = (tab, focus = false) => {
      tabs.forEach((tabItem) => { const isActive = tabItem === tab; tabItem.setAttribute('aria-selected', isActive); tabItem.tabIndex = isActive ? 0 : -1; });
      if (focus) tab.focus();
      onSelect(tab);
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (browserEvent) => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[browserEvent.key];
        if (step) { browserEvent.preventDefault(); select(tabs[(index + step + tabs.length) % tabs.length], true); }
        if (browserEvent.key === 'Home') { browserEvent.preventDefault(); select(tabs[0], true); }
        if (browserEvent.key === 'End') { browserEvent.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
    return select;
  }

  /* =========================================================
     TOP HERO CAROUSEL IMPLEMENTATION
     ========================================================= */
  function initHeroCarousel() {
    const track = find('#carousel-track'), dots = find('#carousel-dots');
    if (!track) return;

    // Build slides (Split Spotlight Hero Carousel)
    clear(track); clear(dots);
    const totalSlides = state.carouselSlides.length;
    state.carouselSlides.forEach((slide, index) => {
      const showcaseImage = createElement('img', {
        class: 'carousel-media-img',
        src: slide.image,
        alt: slide.title,
        loading: index === 0 ? 'eager' : 'lazy',
        decoding: 'async'
      });
      const backdropFill = createElement('img', {
        class: 'carousel-media-backdrop',
        src: slide.image,
        alt: '',
        'aria-hidden': 'true',
        loading: index === 0 ? 'eager' : 'lazy',
        decoding: 'async'
      });
      showcaseImage.addEventListener('error', () => {
        showcaseImage.src = 'images/kasadya_sa_diyandi.jpg';
        backdropFill.src = 'images/kasadya_sa_diyandi.jpg';
      });

      const slideCounter = `${String(index + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;

      const slideNode = createElement('div', { class: `carousel-slide ${index === 0 ? 'is-active' : ''}`, 'data-slide': index },
        createElement('div', { class: 'container carousel-split-grid' },
          createElement('div', { class: 'carousel-content' },
            createElement('div', { class: 'carousel-eyebrow-row' },
              createElement('span', { class: 'carousel-badge', text: slide.badge || 'Community Highlight' }),
              createElement('span', { class: 'carousel-slide-count', text: `Featured Spotlight · ${slideCounter}` })),
            createElement('h2', { class: 'carousel-title', text: slide.title }),
            createElement('p', { class: 'carousel-subtitle', text: slide.subtitle }),
            slide.meta && createElement('div', { class: 'carousel-meta-row' },
              createElement('span', { class: 'carousel-meta-item' }, icon('pin', 'icon-small'), slide.meta)),
            createElement('div', { class: 'carousel-actions' },
              createElement('button', {
                type: 'button',
                class: 'button carousel-button-primary',
                onclick: () => {
                  if (slide.eventId) openEventDetails(slide.eventId);
                  else navigateTo('#/events');
                }
              }, icon('ticket', 'icon-small'), slide.actionText || 'Book Pass'),
              createElement('button', {
                type: 'button',
                class: 'button carousel-button-transparent',
                onclick: () => { navigateTo('#/events'); }
              }, 'Browse All Events'))),
          createElement('div', {
            class: 'carousel-media-showcase',
            onclick: () => {
              if (slide.eventId) openEventDetails(slide.eventId);
              else navigateTo('#/events');
            }
          },
            backdropFill,
            showcaseImage,
            createElement('span', { class: 'carousel-media-tag' }, icon('star', 'icon-small'), 'Featured Event'))));
      track.append(slideNode);

      // Dot button
      const dot = createElement('button', {
        type: 'button',
        class: `carousel-dot ${index === 0 ? 'is-active' : ''}`,
        'aria-label': `Go to slide ${index + 1}: ${slide.title}`,
        onclick: () => setCarouselSlide(index)
      });
      dots.append(dot);
    });

    find('#carousel-previous').onclick = () => prevCarouselSlide();
    find('#carousel-next').onclick = () => nextCarouselSlide();

    // Pause on hover
    const carousel = find('#hero-carousel');
    carousel.addEventListener('mouseenter', pauseCarousel);
    carousel.addEventListener('mouseleave', resumeCarousel);

    // Touch Swipe Support
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (browserEvent) => { touchStartX = browserEvent.changedTouches[0].screenX; }, { passive: true });
    carousel.addEventListener('touchend', (browserEvent) => {
      const swipeDistance = browserEvent.changedTouches[0].screenX - touchStartX;
      if (swipeDistance > 50) prevCarouselSlide();
      else if (swipeDistance < -50) nextCarouselSlide();
    }, { passive: true });

    startCarouselTimer();
  }

  function setCarouselSlide(index) {
    const total = state.carouselSlides.length;
    state.carouselIndex = (index + total) % total;

    findAll('.carousel-slide', find('#carousel-track')).forEach((slide, index) => {
      slide.classList.toggle('is-active', index === state.carouselIndex);
    });
    findAll('.carousel-dot', find('#carousel-dots')).forEach((dot, index) => {
      dot.classList.toggle('is-active', index === state.carouselIndex);
    });

    startCarouselTimer();
  }

  function nextCarouselSlide() {
    setCarouselSlide(state.carouselIndex + 1);
  }

  function prevCarouselSlide() {
    setCarouselSlide(state.carouselIndex - 1);
  }

  function startCarouselTimer() {
    clearInterval(state.carouselTimer);
    if (state.carouselAnimFrame) cancelAnimationFrame(state.carouselAnimFrame);

    state.carouselProgressStart = performance.now();
    const progressBar = find('#carousel-progress-bar');

    function stepProgress(now) {
      if (!state.carouselProgressStart) return;
      const elapsed = now - state.carouselProgressStart;
      const percent = Math.min(100, (elapsed / CAROUSEL_INTERVAL_MS) * 100);
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (elapsed < CAROUSEL_INTERVAL_MS) {
        state.carouselAnimFrame = requestAnimationFrame(stepProgress);
      }
    }
    state.carouselAnimFrame = requestAnimationFrame(stepProgress);

    state.carouselTimer = setTimeout(() => {
      nextCarouselSlide();
    }, CAROUSEL_INTERVAL_MS);
  }

  function pauseCarousel() {
    clearInterval(state.carouselTimer);
    if (state.carouselAnimFrame) cancelAnimationFrame(state.carouselAnimFrame);
    state.carouselProgressStart = null;
  }

  function resumeCarousel() {
    startCarouselTimer();
  }

  /* =========================================================
     LANDING PAGE SCROLLSPY NAVIGATION (ALL ROLES)
     ========================================================= */
  const LANDING_ROUTES = ['home', 'events', 'about', 'contact'];
  let syncHomeScrollspy = () => {};
  let lockScrollspy = () => {};
  const navigateTo = (hash) => {
    if (location.hash === hash) route();
    else location.hash = hash;
  };

  function setActiveNavRoute(routeName) {
    findAll('[data-route]').forEach((link) => {
      const isActive = link.dataset.route === routeName;
      link.classList.toggle('cs-active', isActive);
      isActive ? link.setAttribute('aria-current', 'page') : link.removeAttribute('aria-current');
    });
    const portalButton = find('#cs-portal-dropdown-btn');
    if (portalButton) {
      const isPortalRoute = ['citizen', 'bookings', 'dashboard', 'admin'].includes(routeName);
      portalButton.classList.toggle('cs-active', isPortalRoute);
    }
    const page = ROUTES[routeName];
    if (page && state.user) {
      document.title = `${page.title} | Iligan Community Event Portal`;
    }
  }

  function initHomeScrollspy() {
    const header = find('#cs-navigation');

    // Keep --header-height CSS custom property synced with sticky header
    const updateHeaderHeight = () => {
      if (header) {
        const height = Math.round(header.getBoundingClientRect().height);
        if (height > 0) document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };
    updateHeaderHeight();
    if (header && typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(updateHeaderHeight).observe(header);
    }
    window.addEventListener('resize', updateHeaderHeight, { passive: true });

    let activeLandingRoute = 'home';
    let clickLockUntil = 0;

    lockScrollspy = (durationMs = 850) => {
      clickLockUntil = performance.now() + durationMs;
    };

    let scrollTicking = false;
    syncHomeScrollspy = () => {
      const homeView = find('#view-home');
      if (!homeView || homeView.hidden) return;
      if (performance.now() < clickLockUntil) return;

      const sections = LANDING_ROUTES
        .map((routeKey) => ({ routeKey, element: find(`#view-${routeKey}`) }))
        .filter((item) => item.element && !item.element.hidden);

      if (!sections.length) return;

      const headerHeight = header ? header.getBoundingClientRect().height : 70;
      const triggerLine = headerHeight + 120;

      // If scrolled near the very bottom of the page, highlight the last landing section (Contact Us)
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
      let currentRoute = sections[0].routeKey;

      if (scrolledToBottom) {
        currentRoute = sections[sections.length - 1].routeKey;
      } else {
        for (const { routeKey, element } of sections) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= triggerLine) {
            currentRoute = routeKey;
          } else {
            break;
          }
        }
      }

      if (activeLandingRoute !== currentRoute) {
        activeLandingRoute = currentRoute;
        setActiveNavRoute(currentRoute);
        if (location.hash !== `#/${currentRoute}`) {
          history.replaceState(null, '', `#/${currentRoute}`);
        }
      }
    };

    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(() => {
          syncHomeScrollspy();
          scrollTicking = false;
        });
      }
    }, { passive: true });
  }

  /* =========================================================
     AUTH & INTERACTIVE MODAL CONTROLS
     ========================================================= */
  function setUser(user) {
    if (state.user?.id !== user?.id) state.bookings = [];
    state.user = user;
    user ? localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)) : localStorage.removeItem(USER_STORAGE_KEY);
    document.body.classList.toggle('login-required', !user);
    find('#login-status').hidden = true;
    updateAccountDisplay();
  }
  function updateAccountDisplay() {
    const user = state.user;
    find('#guest-navigation').hidden = !!user;
    find('#account-navigation').hidden = !user;
    findAll('[data-role]').forEach((element) => { element.hidden = !(user && element.dataset.role.split(' ').includes(user.role)); });
    if (user) {
      find('#user-name').textContent = user.name;
      find('#user-role').textContent = ROLE_NAMES[user.role] || 'Citizen';
      find('#menu-name').textContent = user.name;
      find('#menu-email').textContent = user.email;
      find('#menu-role').textContent = ROLE_NAMES[user.role] || 'Citizen';
      find('#menu-avatar').textContent = (user.name || 'U').trim().charAt(0).toUpperCase();
    }
  }

  function switchAuthTab(tab) {
    const isLogin = tab === 'login';
    const dialog = find('#dlg-auth');
    dialog.classList.toggle('is-register', !isLogin);
    find('#auth-panel-switch').textContent = isLogin ? 'Create Account →' : '← Sign In to Your Account';

    find('#login-form').hidden = !isLogin;
    find('#register-form').hidden = isLogin;
    find('#auth-title').textContent = isLogin ? 'Log in to Your Account' : 'Create Your Account';
    find('#auth-description').textContent = isLogin
      ? 'Sign in to access the portal, discover events, and manage your passes.'
      : 'Join our community portal to reserve slots or publish official city events.';

    find('.auth-form-panel').scrollTop = 0;
    clearAlert('#auth-alert');
    if (dialog.open) (isLogin ? find('#login-email') : find('#register-name')).focus({ preventScroll: true });
  }

  function openAuth(tab = 'login', notice = '') {
    switchAuthTab(tab);
    if (notice) showAlert('#auth-alert', 'info', notice);
    const dialog = find('#dlg-auth');
    if (!dialog.open) dialog.showModal();
    (tab === 'login' ? find('#login-email') : find('#register-name')).focus();
  }

  async function finishSignIn(response, form) {
    setUser(response.data.user);
    find('#dlg-auth').close();
    form.reset();
    toast(response.message, { type: 'success' });
    if (location.hash === '#/home') route(); else location.hash = '#/home';
    await Promise.all([loadSettings(), loadEvents()]);
  }

  function bindAuth() {
    find('#dlg-auth').addEventListener('cancel', (event) => { if (!state.user) event.preventDefault(); });
    find('#auth-panel-switch').onclick = () => switchAuthTab(find('#login-form').hidden ? 'login' : 'register');

    // Password visibility toggles
    findAll('[data-toggle-password]').forEach((button) => {
      button.addEventListener('click', () => {
        const targetInput = find(`#${button.dataset.togglePassword}`);
        if (!targetInput) return;
        const isPassword = targetInput.type === 'password';
        targetInput.type = isPassword ? 'text' : 'password';
        button.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      });
    });

    // Role switcher cards
    findAll('.role-card').forEach((card) => {
      card.addEventListener('click', () => {
        findAll('.role-card').forEach((roleCard) => roleCard.classList.remove('is-selected'));
        card.classList.add('is-selected');
        const radio = find('input[type="radio"]', card);
        if (radio) {
          radio.checked = true;
          find('#register-role').value = radio.value;
          find('#coordinator-key-field').hidden = radio.value !== 'organizer';
        }
      });
    });

    find('#login-form').addEventListener('submit', async (browserEvent) => {
      browserEvent.preventDefault();
      const form = browserEvent.currentTarget, email = find('#login-email'), password = find('#login-password');
      if (!applyRules(form, [[email, isValidEmail(email.value.trim()) ? '' : 'Enter a valid email address.'], [password, password.value ? '' : 'Enter your password.']])) return;
      const response = await withLoading(find('button[type=submit]', form), () => api('login', { body: { email: email.value.trim(), password: password.value } }));
      response.ok ? finishSignIn(response, form) : showApiError('#auth-alert', response);
    });

    find('#register-form').addEventListener('submit', async (browserEvent) => {
      browserEvent.preventDefault();
      const form = browserEvent.currentTarget;
      const name = find('#register-name'), email = find('#register-email'), password = find('#register-password'), role = find('#register-role'), key = find('#coordinator-key');
      const isCoordinator = role.value === 'organizer';
      if (!applyRules(form, [
        [name, name.value.trim().length >= 3 ? '' : 'Enter your full name (at least 3 characters).'],
        [email, isValidEmail(email.value.trim()) ? '' : 'Enter a valid email address.'],
        [password, password.value.length >= 6 ? '' : 'Password must be at least 6 characters.'],
        [key, !isCoordinator || key.value.trim() ? '' : 'The LGU authorization key is required for coordinators.']
      ])) return;
      const response = await withLoading(find('button[type=submit]', form), () => api('register', {
        body: {
          name: name.value.trim(), email: email.value.trim(), phone: find('#register-phone').value.trim(),
          password: password.value, role: role.value, coordinator_key: key.value.trim()
        }
      }));
      if (response.ok) { form.reset(); find('#coordinator-key-field').hidden = true; finishSignIn(response, form); } else showApiError('#auth-alert', response);
    });

    find('#sign-out-button').addEventListener('click', async () => {
      find('#account-menu').hidePopover();
      closeMobileMenu();
      const user = state.user;
      const roleTitle = user ? (ROLE_NAMES[user.role] || 'Citizen') : 'Citizen';
      const confirmed = await confirmAction({
        title: 'Are you sure you want to log out?',
        message: `You are currently signed in as ${user?.name || 'a user'} (${roleTitle}). You can sign back in anytime to view your passes and manage your account.`,
        confirmLabel: 'Yes, Sign Out',
        cancelLabel: 'Stay Signed In'
      });
      if (!confirmed) return;
      const response = await api('logout', { body: {} });
      if (!response.ok) return toast(response.message, { type: 'error' });
      setUser(null);
      state.bookings = [];
      route();
      toast('You have been signed out.', { type: 'success' });
    });

    /* =========================================================
       [DEV ONLY] QUICK LOGIN HELPER (EASY TO REMOVE)
       Delete this entire block to remove quick login behavior.
       ========================================================= */
    const quickLogin = find('#test-login');
    if (quickLogin) {
      const quickLoginButton = find('#test-login-toggle');
      if (quickLoginButton) {
        quickLoginButton.addEventListener('click', (browserEvent) => {
          browserEvent.stopPropagation();
          quickLogin.classList.toggle('is-open');
        });
        quickLoginButton.addEventListener('keydown', (browserEvent) => {
          if (browserEvent.key === 'Enter' || browserEvent.key === ' ') {
            browserEvent.preventDefault();
            quickLogin.classList.toggle('is-open');
          }
        });
      }

      findAll('[data-test-role]', quickLogin).forEach((button) => {
        button.addEventListener('click', async (browserEvent) => {
          browserEvent.preventDefault();
          browserEvent.stopPropagation();
          const role = button.dataset.testRole;
          const accounts = {
            admin: { email: 'admin@iligancity.gov.ph', password: 'password123' },
            organizer: { email: 'tourism@iligancity.gov.ph', password: 'password123' },
            coord_tourism: { email: 'tourism@iligancity.gov.ph', password: 'password123' },
            coord_sports: { email: 'sports@iligancity.gov.ph', password: 'password123' },
            coord_arts: { email: 'arts.guild@iligancity.gov.ph', password: 'password123' },
            coord_eco: { email: 'ecotourism@iligancity.gov.ph', password: 'password123' },
            citizen: { email: 'amina.alonto@gmail.com', password: 'password123' }
          };
          const account = accounts[role];
          if (!account) return;
          switchAuthTab('login');
          find('#login-email').value = account.email;
          find('#login-password').value = account.password;
          quickLogin.classList.remove('is-open');
          find('#login-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        });
      });

      document.addEventListener('click', (browserEvent) => {
        if (!quickLogin.contains(browserEvent.target)) {
          quickLogin.classList.remove('is-open');
        }
      });
    }
    /* [/DEV ONLY QUICK LOGIN] */
  }

  /* ---------- Profile ---------- */
  async function openProfile() {
    find('#account-menu').hidePopover();
    closeMobileMenu();
    const dialog = find('#profile-dialog');
    clearAlert('#profile-alert');
    find('#profile-password').value = '';
    dialog.showModal();
    const response = await api('get_profile');
    if (!response.ok) return showApiError('#profile-alert', response);
    const profile = response.data;
    find('#profile-email').value = profile.email; find('#profile-name').value = profile.name; find('#profile-phone').value = profile.phone || '';
    find('#profile-stats').textContent = `${ROLE_NAMES[profile.role] || 'Citizen'} Account · ${profile.total_bookings} Total Booking${profile.total_bookings === 1 ? '' : 's'} · Registered on ${new Date(profile.created_at.replace(' ', 'T')).toLocaleDateString('en-PH', { year: 'numeric', month: 'long' })}`;
  }
  function bindProfile() {
    find('#open-profile').addEventListener('click', openProfile);
    find('#profile-form').addEventListener('submit', async (browserEvent) => {
      browserEvent.preventDefault();
      const form = browserEvent.currentTarget, name = find('#profile-name'), password = find('#profile-password');
      if (!applyRules(form, [[name, name.value.trim().length >= 3 ? '' : 'Enter at least 3 characters.'], [password, !password.value || password.value.length >= 6 ? '' : 'Password must be at least 6 characters.']])) return;
      const response = await withLoading(find('button[type=submit]', form), () => api('update_profile', { body: { name: name.value.trim(), phone: find('#profile-phone').value.trim(), new_password: password.value } }));
      if (!response.ok) return showApiError('#profile-alert', response);
      setUser({ ...state.user, name: response.data.name, phone: response.data.phone });
      showAlert('#profile-alert', 'success', response.message);
      password.value = '';
    });
  }

  /* ---------- Data Loading ---------- */
  async function loadSettings() {
    const [barangayResponse, tagResponse, settingsResponse] = await Promise.all([api('get_barangays'), api('get_hero_tags'), api('get_settings')]);
    if (barangayResponse.ok) state.barangays = barangayResponse.data.barangays;
    if (tagResponse.ok) state.tags = tagResponse.data.tags;
    if (settingsResponse.ok) state.settings = settingsResponse.data;
    fillBarangaySelects(); renderHeroTags();
  }

  async function loadEvents() {
    const grid = find('#events-grid');
    if (!state.eventsLoaded) {
      clear(grid).append(...Array.from({ length: 6 }, () => createElement('div', { class: 'skeleton', 'aria-hidden': 'true' })));
    }
    const isStaff = state.user && ['organizer', 'admin'].includes(state.user.role);
    const response = await api('get_events', { params: isStaff ? { role: 'organizer' } : {} });
    if (!response.ok) {
      state.events = [];
      clear(grid);
      showAlert('#events-alert', 'error', response.message, response.tip, { dismissible: false, actions: [createElement('button', { type: 'button', class: 'button button-outline button-small', onclick: loadEvents }, 'Try Again')] });
      return;
    }
    clearAlert('#events-alert');
    state.events = response.data;
    state.eventsLoaded = true;

    // Curate premier featured carousel slides from active events
    const validFeatured = state.events.filter((event) =>
      event.status === 'active' &&
      toNumber(event.is_featured) &&
      event.image_url &&
      !event.image_url.includes('meow-assets') &&
      !event.image_url.includes('alderhaven') &&
      !event.title.toLowerCase().includes('alderhaven') &&
      event.description &&
      event.description.trim().length > 25
    );

    if (validFeatured.length >= 1) {
      state.carouselSlides = validFeatured.slice(0, 5).map((event) => ({
        title: event.title,
        subtitle: (event.description || '').replace(/\s+/g, ' ').slice(0, 140) + (event.description.length > 140 ? '...' : ''),
        badge: event.category,
        meta: `${formatDate(event.event_date)} · ${event.venue_name}`,
        image: event.image_url,
        actionText: isFree(event) ? 'Reserve Free Pass' : 'Book Pass',
        eventId: event.id
      }));
    } else {
      state.carouselSlides = [...DEFAULT_CAROUSEL_SLIDES];
    }
    initHeroCarousel();

    buildCategoryChips();
    renderCoordinatorFilterOptions();
    renderEvents();
    renderCategoryOptions();
    refreshStaffViews();
    if (state.user?.role === 'user' && location.hash === '#/citizen') renderCitizenDashboard();
  }

  /* ---------- Filters & Search ---------- */
  function renderHeroTags() {
    const host = find('#hero-tags');
    if (!host) return;
    clear(host);
    if (!state.tags.length) return;
    host.append(createElement('span', { class: 'tag-label', text: 'Popular:' }), ...state.tags.map((tag) =>
      createElement('button', { type: 'button', class: 'tag-button', onclick: () => applyTag(tag.name) }, tag.name)));
  }
  function applyTag(name) {
    const isBarangay = state.barangays.some((barangay) => barangay.name === name);
    resetFilters(false);
    if (isBarangay) {
      state.filters.barangay = name;
      if (find('#filter-barangay')) find('#filter-barangay').value = name;
    } else {
      state.filters.search = name;
      if (find('#search-input')) find('#search-input').value = name;
      if (find('#discover-search-input')) find('#discover-search-input').value = name;
    }
    state.page = 1;
    renderEvents();
    navigateTo('#/events');
  }
  function fillBarangaySelects() {
    const names = state.barangays.map((barangay) => barangay.name);
    const barangayFilter = find('#filter-barangay'), selectedValue = barangayFilter.value;
    clear(barangayFilter).append(createElement('option', { value: '' }, 'All barangays'), ...names.map((name) => createElement('option', { value: name }, name)));
    barangayFilter.value = selectedValue;
    const eventBarangay = find('#event-form-barangay');
    clear(eventBarangay).append(createElement('option', { value: '' }, 'Select a barangay'), ...names.map((name) => createElement('option', { value: name }, name)));
  }
  function renderCategoryOptions() {
    const categories = [...new Set([...DEFAULT_CATEGORIES, ...state.events.map((event) => event.category)])].sort();
    clear(find('#category-options')).append(...categories.map((category) => createElement('option', { value: category })));
  }
  function buildCategoryChips() {
    const categories = [...new Set(state.events.filter((event) => event.status === 'active').map((event) => event.category))].sort();
    const host = clear(find('#category-chips'));
    ['All', ...categories].forEach((category) => host.append(createElement('button', {
      type: 'button', class: 'chip', 'aria-pressed': String(state.filters.category === category),
      onclick: () => { state.filters.category = category; state.page = 1; buildCategoryChips(); renderEvents(); }
    }, category === 'All' ? 'All Events' : category)));
  }
  function renderCoordinatorFilterOptions() {
    const select = find('#filter-coordinator');
    if (!select) return;
    const current = select.value;
    const coordinators = [...new Set(state.events.map((e) => e.coordinator_author_name || e.organizer_name).filter(Boolean))].sort();
    clear(select).append(
      createElement('option', { value: '' }, 'All coordinators'),
      ...coordinators.map((name) => createElement('option', { value: name, selected: name === current }, name))
    );
  }

  function resetFilters(render = true) {
    state.filters = { search: '', category: 'All', barangay: '', coordinator: '', price: '', date: '', sort: 'date', past: false };
    if (find('#search-input')) find('#search-input').value = '';
    if (find('#discover-search-input')) find('#discover-search-input').value = '';
    if (find('#filter-barangay')) find('#filter-barangay').value = '';
    if (find('#filter-coordinator')) find('#filter-coordinator').value = '';
    if (find('#filter-price')) find('#filter-price').value = '';
    if (find('#filter-date')) find('#filter-date').value = '';
    if (find('#filter-sort')) find('#filter-sort').value = 'date';
    if (find('#filter-past')) find('#filter-past').checked = false;
    state.page = 1; buildCategoryChips();
    if (render) renderEvents();
  }
  function filteredEvents() {
    const filters = state.filters, searchText = filters.search.trim().toLowerCase(), today = todayDate();
    const list = state.events.filter((event) => {
      if (event.status !== 'active') return false;
      if (!filters.past && event.event_date < today) return false;
      if (filters.category !== 'All' && event.category !== filters.category) return false;
      if (filters.barangay && event.barangay !== filters.barangay) return false;
      if (filters.coordinator && (event.coordinator_author_name || '').toLowerCase() !== filters.coordinator.toLowerCase() && String(event.coordinator_id) !== filters.coordinator) return false;
      if (filters.price === 'free' && !isFree(event)) return false;
      if (filters.price === 'paid' && isFree(event)) return false;
      if (filters.date && event.event_date < filters.date) return false;
      if (searchText && ![event.title, event.description, event.venue_name, event.barangay, event.category, event.organizer_name, event.coordinator_author_name].join(' ').toLowerCase().includes(searchText)) return false;
      return true;
    });
    const sorters = {
      date: (firstEvent, secondEvent) => (firstEvent.event_date + firstEvent.event_time).localeCompare(secondEvent.event_date + secondEvent.event_time),
      'price-asc': (firstEvent, secondEvent) => toNumber(firstEvent.price) - toNumber(secondEvent.price),
      'price-desc': (firstEvent, secondEvent) => toNumber(secondEvent.price) - toNumber(firstEvent.price),
      slots: (firstEvent, secondEvent) => toNumber(secondEvent.available_slots) - toNumber(firstEvent.available_slots)
    };
    return list.sort(sorters[filters.sort]);
  }
  const filtersActive = () => { const filters = state.filters; return !!(filters.search || filters.category !== 'All' || filters.barangay || filters.coordinator || filters.price || filters.date || filters.past); };

  function bindFilters() {
    if (find('#hero-search')) {
      find('#hero-search').addEventListener('submit', (browserEvent) => {
        browserEvent.preventDefault();
        const value = find('#search-input') ? find('#search-input').value : '';
        state.filters.search = value;
        if (find('#discover-search-input')) find('#discover-search-input').value = value;
        state.page = 1;
        renderEvents();
        navigateTo('#/events');
      });
    }
    if (find('#search-input')) {
      find('#search-input').addEventListener('input', debounce(() => {
        const value = find('#search-input').value;
        state.filters.search = value;
        if (find('#discover-search-input')) find('#discover-search-input').value = value;
        state.page = 1;
        renderEvents();
      }, 300));
    }
    if (find('#discover-search-form')) {
      find('#discover-search-form').addEventListener('submit', (browserEvent) => {
        browserEvent.preventDefault();
        const value = find('#discover-search-input').value;
        state.filters.search = value;
        if (find('#search-input')) find('#search-input').value = value;
        state.page = 1;
        renderEvents();
        find('#events-results-heading').scrollIntoView({ behavior: 'smooth' });
      });
    }
    if (find('#discover-search-input')) {
      find('#discover-search-input').addEventListener('input', debounce(() => {
        const value = find('#discover-search-input').value;
        state.filters.search = value;
        if (find('#search-input')) find('#search-input').value = value;
        state.page = 1;
        renderEvents();
      }, 300));
    }
    const filterFields = { 'filter-barangay': 'barangay', 'filter-coordinator': 'coordinator', 'filter-price': 'price', 'filter-date': 'date', 'filter-sort': 'sort' };
    Object.entries(filterFields).forEach(([id, key]) => find(`#${id}`).addEventListener('change', (browserEvent) => { state.filters[key] = browserEvent.target.value; state.page = 1; renderEvents(); }));
    find('#filter-past').addEventListener('change', (browserEvent) => { state.filters.past = browserEvent.target.checked; state.page = 1; renderEvents(); });
    find('#filter-reset').addEventListener('click', () => resetFilters());
    find('#filters').addEventListener('submit', (browserEvent) => browserEvent.preventDefault());
    find('#load-more').addEventListener('click', () => { state.page += 1; renderEvents(); });
  }

  /* =========================================================
     REDESIGNED EVENT CARD (SPACIOUS, UNCLUTTERED, ELEGANT)
     ========================================================= */
  function eventCard(event) {
    const headingId = `ev-title-${event.id}`;
    const dateParts = parseDateParts(event.event_date);
    const slots = toNumber(event.available_slots);

    // Subtle capacity status
    let capacityNode = null;
    if (isPast(event)) {
      capacityNode = createElement('span', { class: 'capacity-status is-full' }, 'Event Concluded');
    } else if (slots <= 0) {
      capacityNode = createElement('span', { class: 'capacity-status is-full' }, 'Sold Out');
    } else if (slots <= 10) {
      capacityNode = createElement('span', { class: 'capacity-status is-warning' },
        createElement('span', { class: 'pulse-dot' }), `Only ${slots} slots left`);
    } else {
      capacityNode = createElement('span', { class: 'capacity-status is-available' },
        createElement('span', { class: 'pulse-dot' }), `${slots} slots available`);
    }

    const coordinatorName = event.coordinator_author_name || event.organizer_name || 'Iligan City Tourism Office';

    const card = createElement('article', {
      class: 'card event-card',
      'aria-labelledby': headingId,
      onclick: (browserEvent) => {
        // Prevent trigger if clicking an internal button specifically
        if (!browserEvent.target.closest('button')) openEventDetails(event.id);
      }
    },
      // 1. Media Header with floating category pill and calendar tile
      createElement('div', { class: 'event-media' },
        createEventImage(event),
        createElement('span', { class: 'card-category-badge', text: event.category }),
        createElement('div', { class: 'card-date-tile', 'aria-label': formatDate(event.event_date) },
          createElement('span', { class: 'date-month', text: dateParts.month }),
          createElement('span', { class: 'date-day', text: dateParts.day })),
        toNumber(event.is_featured) ? createElement('span', { class: 'card-featured-tag' }, icon('star', 'icon-small'), 'Featured') : null
      ),

      // 2. Event Body with Breathing Room & Uncluttered Layout
      createElement('div', { class: 'event-body' },
        createElement('h3', { class: 'event-name', id: headingId, text: event.title }),

        // Clean highlight rows (Coordinator, Venue and Time)
        createElement('div', { class: 'event-highlights' },
          createElement('div', { class: 'highlight-row' },
            icon('user', 'icon-small'),
            createElement('span', { class: 'highlight-text', title: `Coordinator: ${coordinatorName}`, text: `Coordinator: ${coordinatorName}` })),
          createElement('div', { class: 'highlight-row' },
            icon('pin', 'icon-small'),
            createElement('span', { class: 'highlight-text', title: event.venue_name, text: event.venue_name })),
          createElement('div', { class: 'highlight-row' },
            icon('clock', 'icon-small'),
            createElement('span', { class: 'highlight-text', text: formatTime(event.event_time) }))
        ),

        // Clean capacity indicator
        capacityNode,

        // 3. Pinned Bottom Footer Taking Advantage of Space
        createElement('div', { class: 'event-footer' },
          createElement('div', { class: 'price-lockup' },
            createElement('span', { class: 'price-label', text: 'Admission' }),
            createElement('span', { class: `price-value ${isFree(event) ? 'is-free' : ''}`, text: formatPrice(event.price) })),
          createElement('button', {
            type: 'button',
            class: 'button button-primary event-card-button',
            'aria-label': `View details and book ${event.title}`,
            onclick: (browserEvent) => {
              browserEvent.stopPropagation();
              openEventDetails(event.id);
            }
          }, canBook(event) ? 'View & Book →' : 'View Details')
        )
      )
    );

    return card;
  }

  function emptyState(title, text, button) {
    return createElement('div', { class: 'empty' }, icon('inbox'), createElement('h3', { class: 'h3', text: title }), createElement('p', { text }), button);
  }

  function renderEvents() {
    const today = todayDate();
    // 1. Prioritize active events marked as featured by administrators
    let featured = state.events.filter((event) => event.status === 'active' && toNumber(event.is_featured));

    // Sort featured events: upcoming dates first, followed by others, ordered chronologically
    featured.sort((a, b) => {
      const aUpcoming = a.event_date >= today ? 1 : 0;
      const bUpcoming = b.event_date >= today ? 1 : 0;
      if (aUpcoming !== bUpcoming) return bUpcoming - aUpcoming;
      return (a.event_date + (a.event_time || '')).localeCompare(b.event_date + (b.event_time || ''));
    });

    // Fallback: If no event has been manually marked featured, display upcoming active events
    if (!featured.length) {
      featured = state.events.filter((event) => event.status === 'active' && event.event_date >= today);
      featured.sort((a, b) => (a.event_date + (a.event_time || '')).localeCompare(b.event_date + (b.event_time || '')));
    }
    if (!featured.length) {
      featured = state.events.filter((event) => event.status === 'active');
    }

    const hasActiveFilters = Boolean(
      state.filters.search.trim() ||
      (state.filters.category && state.filters.category !== 'All') ||
      state.filters.barangay ||
      state.filters.coordinator ||
      state.filters.price ||
      state.filters.date ||
      state.filters.past
    );

    const featuredList = featured.slice(0, 3);
    find('#featured-section').hidden = hasActiveFilters || featuredList.length === 0;
    clear(find('#featured-grid')).append(...featuredList.map(eventCard));

    const directoryHeading = find('#directory-heading-title');
    if (directoryHeading) {
      directoryHeading.textContent = hasActiveFilters ? 'Filtered Event Results' : 'All Upcoming Events';
    }

    const list = filteredEvents(), shown = list.slice(0, state.page * PAGE_SIZE), grid = clear(find('#events-grid'));
    find('#results-count').textContent = state.eventsLoaded ? `${list.length} event${list.length === 1 ? '' : 's'} available` : '';
    if (state.eventsLoaded && !list.length) {
      grid.append(emptyState('No events match your criteria', 'Try clearing your search query or adjusting your filters to see more occasions.',
        createElement('button', { type: 'button', class: 'button button-primary', onclick: () => resetFilters() }, 'Reset All Filters')));
    } else {
      grid.append(...shown.map(eventCard));
    }
    find('#load-more').hidden = shown.length >= list.length;
  }

  /* ---------- Event Details Modal ---------- */
  function openEventDetails(id) {
    const event = state.events.find((event) => event.id == id);
    if (!event) return;
    find('#event-title').textContent = event.title;
    const coordinatorName = event.coordinator_author_name || event.organizer_name || 'Iligan City Tourism Office';
    const isOrganizer = state.user && state.user.role === 'organizer';
    const isOwner = !!event.is_mine;
    const isStaff = event.can_manage && state.user && ['organizer', 'admin'].includes(state.user.role);
    const isOtherCoordinator = isOrganizer && !isOwner;

    const aside = createElement('aside', { class: 'detail-aside', 'aria-label': 'Reservation details' },
      createElement('div', { class: 'price-lockup' },
        createElement('span', { class: 'price-label', text: 'Ticket Price' }),
        createElement('span', { class: `price-value ${isFree(event) ? 'is-free' : ''}`, text: formatPrice(event.price) })),
      createElement('p', { class: 'muted', text: isFree(event) ? 'Free public admission' : 'Per reserved pass' }),
      createElement('div', { class: 'stat-summary', style: 'margin-block: 8px;' },
        createElement('span', { class: 'badge badge-blue', text: `${event.available_slots} of ${event.total_slots} slots remaining` })),
      createElement('button', {
        type: 'button',
        class: 'button button-secondary button-full-width',
        disabled: !canBook(event),
        onclick: () => { find('#event-dialog').close(); openBooking(event); }
      }, icon('ticket', 'icon-small'), canBook(event) ? 'Book Event Pass' : isPast(event) ? 'Event Has Ended' : 'Fully Booked'),
      isStaff && createElement('button', {
        type: 'button',
        class: 'button button-outline button-full-width',
        onclick: () => { find('#event-dialog').close(); openEventForm(event); }
      }, icon('edit', 'icon-small'), 'Edit Event'),
      isStaff && createElement('button', {
        type: 'button',
        class: 'button button-danger-outline button-full-width',
        onclick: () => { find('#event-dialog').close(); deleteEvent(event); }
      }, icon('trash', 'icon-small'), 'Delete Event Listing'),
      isOtherCoordinator && createElement('div', { class: 'coord-lock-notice' },
        icon('lock', 'icon-small'),
        createElement('div', {},
          createElement('strong', { text: 'Protected Listing' }),
          createElement('p', { class: 'muted-small', text: `Coordinated by ${coordinatorName}.` })
        )
      )
    );

    clear(find('#event-body')).append(
      createElement('div', { class: 'detail-media' }, createEventImage(event)),
      createElement('div', { class: 'detail-grid' },
        createElement('div', { class: 'stack' },
          createElement('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;' },
            createElement('span', { class: 'badge badge-blue', text: event.category }),
            createElement('span', { class: 'badge badge-gold', text: `Brgy. ${event.barangay}` })),
          createElement('ul', { class: 'meta-list', style: 'margin-block: 10px;' },
            createElement('li', {}, icon('calendar'), createElement('span', { class: 'meta-text', text: formatDate(event.event_date) })),
            createElement('li', {}, icon('clock'), createElement('span', { class: 'meta-text', text: formatTime(event.event_time) })),
            createElement('li', {}, icon('pin'), createElement('span', { class: 'meta-text', text: formatLocation(event) })),
            createElement('li', {}, icon('users'), createElement('span', { class: 'meta-text', text: `Coordinator: ${coordinatorName}` }))),
          createElement('h3', { class: 'h4', text: 'About This Event' }),
          createElement('p', { class: 'event-description', text: event.description })
        ),
        aside
      )
    );
    find('#event-dialog').showModal();
  }

  /* ---------- Booking Pass Workflow ---------- */
  function openBooking(event) {
    if (!canBook(event)) return toast('This event is no longer accepting reservations.', { type: 'error' });
    const user = state.user, maximum = Math.min(10, toNumber(event.available_slots));
    let quantity = 1;
    find('#booking-title').textContent = 'Reserve Your Event Pass';
    const alertHost = createElement('div', { id: 'book-alert' });
    const name = createElement('input', { type: 'text', id: 'booking-name', autocomplete: 'name', value: user?.name || '', required: true, placeholder: 'Your complete name' });
    const email = createElement('input', { type: 'email', id: 'booking-email', autocomplete: 'email', value: user?.email || '', required: true, readonly: !!user, placeholder: 'name@domain.com' });
    const phone = createElement('input', { type: 'tel', id: 'booking-phone', autocomplete: 'tel', value: user?.phone || '', placeholder: '0917 123 4567', required: true });
    const quantityOutput = createElement('output', { id: 'booking-quantity', 'aria-live': 'polite', text: '1' });
    const total = createElement('span', { text: formatPrice(event.price) });
    const minus = createElement('button', { type: 'button', 'aria-label': 'Decrease tickets', disabled: true }, '−');
    const plus = createElement('button', { type: 'button', 'aria-label': 'Increase tickets', disabled: maximum <= 1 }, '+');
    const slider = createElement('input', { type: 'range', id: 'booking-quantity-slider', min: 1, max: maximum, value: 1, step: 1, disabled: maximum === 1 });
    const sync = () => { slider.value = quantity; quantityOutput.textContent = quantity; total.textContent = formatPrice(toNumber(event.price) * quantity); minus.disabled = quantity <= 1; plus.disabled = quantity >= maximum; };
    slider.oninput = () => { quantity = toNumber(slider.value); sync(); };
    minus.onclick = () => { quantity = Math.max(1, quantity - 1); sync(); };
    plus.onclick = () => { quantity = Math.min(maximum, quantity + 1); sync(); };

    const form = createElement('form', { novalidate: true },
      alertHost,
      !user && alertBox('info', 'Booking as Guest', 'Log in or create a citizen account if you want this pass to be saved directly to your account.', { dismissible: false }),
      !isFree(event) && alertBox('warning', 'Payment is arranged with the organizer', 'This portal reserves a place and does not collect online payments. Confirm payment arrangements with the organizer.', { dismissible: false }),
      createElement('div', { class: 'summary' },
        createElement('p', { class: 'h4', text: event.title }),
        createElement('p', { class: 'muted', text: `${formatDate(event.event_date)} · ${formatTime(event.event_time)} · ${event.venue_name}` })),
      createElement('div', { class: 'field' }, createElement('label', { for: 'booking-name' }, 'Full name of primary attendee'), name),
      createElement('div', { class: 'field' }, createElement('label', { for: 'booking-email' }, 'Confirmation email address'), email),
      createElement('div', { class: 'field' }, createElement('label', { for: 'booking-phone' }, 'Contact mobile number'), phone),
      createElement('div', { class: 'field' }, createElement('span', { class: 'label', id: 'booking-quantity-label' }, `Number of tickets (maximum ${maximum})`),
        createElement('div', { class: 'stepper', role: 'group', 'aria-labelledby': 'booking-quantity-label' }, minus, quantityOutput, plus),
        createElement('label', { for: 'booking-quantity-slider', class: 'hint' }, 'Slide to choose the number of tickets'), slider),
      createElement('div', { class: 'summary' }, createElement('div', { class: 'summary-row total' }, createElement('span', { text: 'Total Amount' }), total)),
      createElement('div', { class: 'form-actions' },
        createElement('button', { type: 'button', class: 'button button-plain', 'data-close': '' }, 'Cancel'),
        createElement('button', { type: 'submit', class: 'button button-secondary' }, icon('check', 'icon-small'), 'Confirm Reservation')));

    form.addEventListener('submit', async (browserEvent) => {
      browserEvent.preventDefault();
      if (!applyRules(form, [
        [name, name.value.trim().length >= 3 ? '' : 'Enter your full first and last name.'],
        [email, isValidEmail(email.value.trim()) ? '' : 'Enter a valid email address.'],
        [phone, phone.value.replace(/\D/g, '').length >= 7 ? '' : 'Enter a valid mobile contact number.']
      ])) return;
      const response = await withLoading(find('button[type=submit]', form), () => api('book_event', {
        body: {
          event_id: event.id, attendee_name: name.value.trim(), attendee_email: email.value.trim(), attendee_phone: phone.value.trim(), tickets_count: quantity
        }
      }));
      if (!response.ok) {
        showApiError(alertHost, response);
        if (response.status === 409) { find('#portal-alert-message').textContent = response.message; find('#portal-alert').showModal(); }
        return;
      }
      toast(response.message, { type: 'success', duration: 5000 });
      renderPass(response.data, 'Reservation Confirmed!');
      loadEvents();
    });
    clear(find('#booking-content')).append(form);
    find('#booking-dialog').showModal();
    name.focus();
  }

  function createPassCode(reference) {
    const code = window.qrcode(0, 'M');
    code.addData(`ILIGAN-PASS:${reference}`);
    code.make();
    const template = document.createElement('template');
    template.innerHTML = code.createSvgTag({ cellSize: 4, margin: 16, scalable: true });
    const image = template.content.firstElementChild;
    image.setAttribute('class', 'code');
    image.setAttribute('role', 'img');
    image.setAttribute('aria-label', `QR code for booking ${reference}`);
    return image;
  }

  function renderPass(pass, heading) {
    find('#booking-title').textContent = heading;
    const row = (key, value) => [createElement('dt', { text: key }), createElement('dd', { text: value })];
    clear(find('#booking-content')).append(
      alertBox('success', heading, 'Present this digital pass reference at the venue entrance.', { dismissible: false }),
      createElement('div', { class: 'pass' },
        createElement('p', { class: 'badge badge-blue', text: 'Iligan City Official Pass' }),
        createElement('p', { class: 'pass-reference', text: pass.booking_reference }),
        createPassCode(pass.booking_reference),
        createElement('p', { class: 'h4', text: pass.event_title }),
        createElement('dl', {}, row('Attendee', pass.attendee_name),
          row('Coordinator', pass.coordinator_name || pass.coordinator_author_name || pass.organizer_name || 'Iligan City Tourism Office'),
          row('Date', pass.event_date), row('Time', pass.event_time),
          row('Venue', formatLocation(pass)), row('Passes', String(pass.tickets_count)), row('Total', formatPrice(toNumber(pass.price) * toNumber(pass.tickets_count))))),
      createElement('div', { class: 'form-actions' },
        createElement('button', { type: 'button', class: 'button button-plain', 'data-close': '' }, 'Done'),
        state.user && createElement('a', { class: 'button button-primary', href: '#/bookings', onclick: () => find('#booking-dialog').close() }, 'View My Bookings')));
    if (!find('#booking-dialog').open) find('#booking-dialog').showModal();
  }

  /* ---------- My Bookings View ---------- */
  async function loadCitizenDashboard() {
    const user = state.user;
    clearAlert('#citizen-alert');
    clear(find('#citizen-stats'));
    clear(find('#citizen-next')).append(createElement('p', { text: 'Loading your reservations…' }));
    const result = await api('get_bookings', { params: { email: user.email } });
    if (state.user?.id !== user.id) return;
    if (!result.ok) {
      clear(find('#citizen-next'));
      return showAlert('#citizen-alert', 'error', result.message, result.tip, {
        actions: [createElement('button', { type: 'button', class: 'button button-outline button-small', onclick: loadCitizenDashboard }, 'Try Again')]
      });
    }
    state.bookings = result.data;
    renderCitizenDashboard();
  }

  function renderCitizenDashboard() {
    if (state.user?.role !== 'user') return;
    find('#citizen-welcome').textContent = `Welcome, ${state.user.name}. Plan your next outing in Iligan City.`;
    const bookings = state.bookings;
    const upcoming = bookings.filter((booking) => booking.status === 'confirmed' && !isPast(booking))
      .sort((first, second) => `${first.event_date} ${first.event_time}`.localeCompare(`${second.event_date} ${second.event_time}`));
    const tickets = upcoming.reduce((total, booking) => total + toNumber(booking.tickets_count), 0);
    const past = bookings.filter((booking) => booking.status === 'confirmed' && isPast(booking));
    clear(find('#citizen-stats')).append(statCard(upcoming.length, 'Upcoming reservations'), statCard(tickets, 'Passes for upcoming events'), statCard(past.length, 'Past events booked'));
    const host = clear(find('#citizen-next'));
    const booking = upcoming[0];
    if (!booking) {
      host.append(emptyState('Your next outing starts here', 'Find a community event and reserve your place. Your next reservation will appear here.', createElement('a', { class: 'button button-outline', href: '#/events' }, 'Explore Events')));
      return;
    }
    host.append(
      createElement('p', { class: 'next-event-date', text: `${formatDate(booking.event_date)} · ${formatTime(booking.event_time)}` }),
      createElement('h3', { class: 'h2', text: booking.event_title }),
      createElement('p', { class: 'muted', text: formatLocation(booking) }),
      createElement('p', { class: 'next-event-reference', text: `${booking.tickets_count} pass${toNumber(booking.tickets_count) === 1 ? '' : 'es'} · ${booking.booking_reference}` }),
      createElement('div', { class: 'form-actions' },
        createElement('button', { type: 'button', class: 'button button-primary', onclick: () => renderPass({ ...booking, event_date: formatDate(booking.event_date), event_time: formatTime(booking.event_time) }, 'Digital Pass') }, 'Open My Pass'),
        createElement('a', { class: 'button button-plain', href: '#/bookings' }, 'All My Bookings')));
  }

  async function loadBookings() {
    const user = state.user;
    const host = clear(find('#bookings-list'));
    clearAlert('#bookings-alert');
    host.append(createElement('div', { class: 'skeleton', 'aria-hidden': 'true', style: 'min-height:120px' }));
    const response = await api('get_bookings', { params: { email: user.email } });
    if (state.user?.id !== user.id) return;
    if (!response.ok) { clear(host); return showApiError('#bookings-alert', response); }
    state.bookings = response.data;
    renderBookings();
  }
  function renderBookings() {
    const host = clear(find('#bookings-list'));
    if (!state.bookings.length) {
      return host.append(emptyState('No Bookings Found', 'You have not reserved passes for upcoming events yet.', createElement('a', { class: 'button button-primary', href: '#/events' }, 'Discover Events')));
    }
    state.bookings.forEach((booking) => {
      const isCancelled = booking.status === 'cancelled';
      const past = isPast(booking);
      host.append(createElement('article', { class: `card booking-card ${isCancelled ? 'is-cancelled' : ''}`, 'aria-label': `Booking ${booking.booking_reference}` },
        createElement('div', { class: 'booking-main' },
          createElement('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;align-items:center' },
            createElement('span', { class: `badge ${isCancelled ? 'badge-red' : past ? 'badge-gray' : 'badge-green'}`, text: isCancelled ? 'Cancelled' : past ? 'Concluded' : 'Confirmed Active' }),
            createElement('span', { class: 'booking-reference', text: booking.booking_reference })),
          createElement('h2', { class: 'h4 event-name', text: booking.event_title }),
          createElement('ul', { class: 'meta-list' },
            createElement('li', {}, icon('calendar'), createElement('span', { class: 'meta-text', text: `${formatDate(booking.event_date)} · ${formatTime(booking.event_time)}` })),
            createElement('li', {}, icon('pin'), createElement('span', { class: 'meta-text', text: formatLocation(booking) })),
            createElement('li', {}, icon('ticket'), createElement('span', { class: 'meta-text', text: `${booking.tickets_count} ticket${booking.tickets_count > 1 ? 's' : ''} · ${formatPrice(toNumber(booking.price) * toNumber(booking.tickets_count))}` })))),
        createElement('div', { class: 'event-actions' },
          isCancelled
            ? (past ? createElement('span', { class: 'muted', text: 'This event has concluded.' }) : createElement('button', { type: 'button', class: 'button button-outline', onclick: () => restoreBooking(booking.booking_reference) }, 'Restore Booking'))
            : [createElement('button', { type: 'button', class: 'button button-primary', onclick: () => renderPass({ ...booking, event_date: formatDate(booking.event_date), event_time: formatTime(booking.event_time) }, 'Digital Pass') }, 'View Pass'),
            !past && createElement('button', { type: 'button', class: 'button button-danger-outline', onclick: () => cancelBooking(booking) }, 'Cancel Booking')])));
    });
  }
  async function cancelBooking(booking) {
    const confirmed = await confirmAction({
      title: 'Cancel this reservation?',
      message: `Your ${booking.tickets_count} reserved pass${booking.tickets_count > 1 ? 'es' : ''} for "${booking.event_title}" will be released back to the community. You can undo this right after.`,
      confirmLabel: 'Cancel Booking', cancelLabel: 'Keep Booking'
    });
    if (!confirmed) return;
    const response = await api('cancel_booking', { body: { booking_reference: booking.booking_reference } });
    if (!response.ok) return showApiError('#bookings-alert', response);
    toast(response.message, { type: 'success', duration: 5000, actionLabel: 'Undo', onAction: () => restoreBooking(booking.booking_reference) });
    await loadBookings(); loadEvents();
  }
  async function restoreBooking(reference) {
    const response = await api('restore_booking', { body: { booking_reference: reference } });
    if (!response.ok) return showApiError('#bookings-alert', response);
    toast(response.message, { type: 'success' });
    await loadBookings(); loadEvents();
  }

  /* ---------- Coordinator & Admin Dashboards ---------- */
  const statCard = (value, label) => createElement('div', { class: 'stat' }, createElement('span', { class: 'stat-value', text: value }), createElement('span', { class: 'stat-label', text: label }));
  const tablePaginationState = {};

  function getPaginationPages(current, total) {
    if (total <= 7) {
      return Array.from({ length: total }, (unused, index) => index + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }
    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  }

  function eventsTable(host, events, { caption, showCoordinator = false }) {
    clear(host);
    if (!events.length) {
      return host.append(emptyState('No Events Yet', 'Create your first event listing to see management controls here.', createElement('button', { type: 'button', class: 'button button-primary', 'data-new-event': '' }, 'Add New Event')));
    }

    const tableKey = host.id || caption || 'default-table';
    if (!tablePaginationState[tableKey]) {
      tablePaginationState[tableKey] = { page: 1, pageSize: 10 };
    }
    const tableState = tablePaginationState[tableKey];
    const pageSize = tableState.pageSize || 10;
    const totalPages = Math.max(1, Math.ceil(events.length / pageSize));
    if (tableState.page > totalPages) tableState.page = totalPages;
    if (tableState.page < 1) tableState.page = 1;
    const currentPage = tableState.page;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, events.length);
    const displayStatus = (event) => event.status === 'active' && isPast(event) ? 'Concluded' : event.status;
    const columns = [
      { label: 'Event', key: 'title', value: (event) => event.title },
      { label: 'Date & time', key: 'date', value: (event) => `${event.event_date}T${event.event_time || '00:00:00'}` },
      { label: 'Barangay', key: 'barangay', value: (event) => event.barangay },
      { label: 'Reserved', key: 'reserved', value: (event) => seatsTaken(event) },
      { label: 'Price', key: 'price', value: (event) => toNumber(event.price) },
      { label: 'Status', key: 'status', value: displayStatus },
      { label: 'Actions' }
    ];
    const sortColumn = columns.find((column) => column.key && column.key === tableState.sortKey);
    const sortedEvents = [...events];
    if (sortColumn) {
      sortedEvents.sort((firstEvent, secondEvent) => {
        const firstValue = sortColumn.value(firstEvent);
        const secondValue = sortColumn.value(secondEvent);
        const comparison = typeof firstValue === 'number' && typeof secondValue === 'number'
          ? firstValue - secondValue
          : String(firstValue ?? '').localeCompare(String(secondValue ?? ''), 'en-PH', { sensitivity: 'base', numeric: true });
        return tableState.sortDirection === 'desc' ? -comparison : comparison;
      });
    }
    const pagedEvents = sortedEvents.slice(startIndex, endIndex);

    const renderHeading = (column) => {
      if (!column.key) return createElement('th', { scope: 'col', text: column.label });
      const active = tableState.sortKey === column.key;
      const direction = active ? tableState.sortDirection : null;
      return createElement('th', { scope: 'col', 'aria-sort': active ? (direction === 'asc' ? 'ascending' : 'descending') : 'none' },
        createElement('button', {
          type: 'button', class: `table-sort ${active ? 'is-sorted' : ''}`,
          'data-sort-key': column.key,
          'aria-label': `${column.label}: sort ${direction === 'asc' ? 'descending' : 'ascending'}`,
          onclick: () => {
            tableState.sortDirection = active && direction === 'asc' ? 'desc' : 'asc';
            tableState.sortKey = column.key;
            tableState.page = 1;
            eventsTable(host, events, { caption, showCoordinator });
            host.querySelector(`[data-sort-key="${column.key}"]`).focus({ preventScroll: true });
          }
        }, column.label, createElement('span', { class: `sort-arrows ${direction || ''}`, 'aria-hidden': 'true' },
          createElement('span', { class: 'sort-up' }), createElement('span', { class: 'sort-down' }))));
    };
    const rows = pagedEvents.map((event) => {
      const featured = !!toNumber(event.is_featured);
      const status = displayStatus(event);
      const button = (label, iconName, callback, className = '', showLabel = true) => createElement('button', {
        type: 'button', class: `table-action ${className}`, title: label,
        'aria-label': `${label}: ${event.title}`, onclick: callback
      }, icon(iconName, 'icon-small'), showLabel ? label : null);
      const featureButton = button(featured ? 'Unfeature' : 'Feature', 'star', () => toggleFeatured(event), featured ? 'is-featured' : '');
      featureButton.setAttribute('aria-pressed', String(featured));
      return createElement('tr', {},
        createElement('td', { class: 'event-title-cell' },
          createElement('span', { class: 'table-event-name', text: event.title }),
          showCoordinator && createElement('span', { class: 'table-secondary', text: event.coordinator_author_name || event.organizer_name })),
        createElement('td', { class: 'event-date-cell' },
          createElement('span', { text: new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) }),
          createElement('span', { class: 'table-secondary', text: formatTime(event.event_time) })),
        createElement('td', { text: event.barangay }),
        createElement('td', { class: 'reserved-seats-cell' }, createElement('span', { text: seatsTaken(event).toLocaleString('en-PH') }),
          createElement('span', { class: 'table-capacity', text: ` / ${toNumber(event.total_slots).toLocaleString('en-PH')}` })),
        createElement('td', { class: 'event-price-cell', text: toNumber(event.price) === 0 ? 'Free' : formatPrice(event.price) }),
        createElement('td', {}, createElement('span', { class: `table-status ${event.status === 'active' ? (isPast(event) ? 'is-concluded' : 'is-active') : 'is-inactive'}`, text: status })),
        createElement('td', {}, createElement('div', { class: 'table-actions' },
          button('Attendees', 'users', () => openAttendees(event), 'table-action-attendees', true),
          button('Edit', 'edit', () => openEventForm(event)),
          featureButton,
          button('Delete', 'trash', () => deleteEvent(event), 'table-action-delete'))));
    });

    const goToPage = (newPage) => {
      tableState.page = Math.max(1, Math.min(newPage, totalPages));
      eventsTable(host, events, { caption, showCoordinator });
      host.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    const changePageSize = (newSize) => {
      tableState.pageSize = Number(newSize) || 10;
      tableState.page = 1;
      eventsTable(host, events, { caption, showCoordinator });
    };

    const paginationBar = createElement('div', { class: 'table-pagination' },
      createElement('div', { class: 'pagination-info' },
        'Showing ',
        createElement('strong', { text: `${startIndex + 1}–${endIndex}` }),
        ' of ',
        createElement('strong', { text: `${events.length}` }),
        ` event${events.length === 1 ? '' : 's'}`
      ),
      createElement('div', { class: 'pagination-controls' },
        events.length > 10 ? createElement('label', { class: 'pagination-size' },
          'Per page: ',
          createElement('select', {
            'aria-label': 'Events per page',
            onchange: (browserEvent) => changePageSize(browserEvent.target.value)
          },
            [10, 25, 50].map((size) => createElement('option', { value: size, selected: size === pageSize }, `${size}`))
          )
        ) : null,
        totalPages > 1 ? createElement('nav', { class: 'pagination-nav', 'aria-label': 'Events table pagination' },
          createElement('button', {
            type: 'button',
            class: 'pagination-button pagination-prev',
            'aria-label': 'Previous page',
            disabled: currentPage <= 1,
            onclick: () => goToPage(currentPage - 1)
          }, icon('arrowLeft', 'icon-small'), createElement('span', { text: 'Prev' })),
          createElement('div', { class: 'pagination-pages' },
            getPaginationPages(currentPage, totalPages).map((pageNumber) => {
              if (pageNumber === '...') return createElement('span', { class: 'pagination-ellipsis', text: '…' });
              const isCurrentPage = pageNumber === currentPage;
              return createElement('button', {
                type: 'button',
                class: `pagination-page ${isCurrentPage ? 'is-active' : ''}`,
                'aria-label': `Page ${pageNumber}`,
                ...(isCurrentPage ? { 'aria-current': 'page' } : {}),
                onclick: () => goToPage(pageNumber)
              }, `${pageNumber}`);
            })
          ),
          createElement('button', {
            type: 'button',
            class: 'pagination-button pagination-next',
            'aria-label': 'Next page',
            disabled: currentPage >= totalPages,
            onclick: () => goToPage(currentPage + 1)
          }, createElement('span', { text: 'Next' }), icon('arrowRight', 'icon-small'))
        ) : null
      )
    );

    host.append(createElement('div', { class: 'table-card events-table-card' },
      createElement('div', { class: 'table-scroll' },
        createElement('table', { class: 'data-table events-table' }, createElement('caption', {}, createElement('span', { text: caption }), createElement('span', { class: 'table-count', text: `${events.length} event${events.length === 1 ? '' : 's'}` })),
          createElement('thead', {}, createElement('tr', {}, columns.map(renderHeading))),
          createElement('tbody', {}, rows)
        )
      ),
      paginationBar
    ));
  }

  function refreshStaffViews() {
    if (!state.user) return;
    if (state.user.role === 'organizer') renderCoordinatorDashboard();
    if (state.user.role === 'admin') {
      const events = state.events;
      const upcoming = events.filter((event) => event.status === 'active' && !isPast(event));
      const featured = events.filter((event) => toNumber(event.is_featured));
      const coordinators = new Set(events.map((event) => event.coordinator_id).filter(Boolean));
      clear(find('#admin-stats')).append(statCard(events.length, 'Citywide events'), statCard(upcoming.length, 'Upcoming active events'), statCard(featured.length, 'Featured listings'), statCard(coordinators.size, 'Coordinators with listings'));
      eventsTable(find('#admin-table'), events, { caption: 'Citywide Portal Events Directory', showCoordinator: true });
    }
  }

  function renderCoordinatorDashboard() {
    if (find('#hub-coordinator-name') && state.user) {
      find('#hub-coordinator-name').textContent = `Coordinator: ${state.user.name}`;
    }
    const events = state.events.filter((event) => event.is_mine);
    const upcoming = events.filter((event) => event.status === 'active' && !isPast(event));
    const tickets = upcoming.reduce((total, event) => total + seatsTaken(event), 0);
    const available = upcoming.reduce((total, event) => total + toNumber(event.available_slots), 0);
    clear(find('#dashboard-stats')).append(statCard(events.length, 'My published events'), statCard(upcoming.length, 'Upcoming events'), statCard(tickets, 'Upcoming reserved passes'), statCard(available, 'Upcoming available seats'));
    const filter = find('#coordinator-filter').value;
    const visibleEvents = events.filter((event) => filter === 'all' || (filter === 'past' ? isPast(event) : !isPast(event)))
      .sort((first, second) => `${first.event_date} ${first.event_time}`.localeCompare(`${second.event_date} ${second.event_time}`));
    const host = clear(find('#coordinator-events'));
    if (!visibleEvents.length) {
      host.append(emptyState('No events in this view', events.length ? 'Choose another view to find your published events.' : 'Publish your first event to manage its seating and attendees here.',
        createElement('button', { type: 'button', class: 'button button-outline', 'data-new-event': '' }, 'Add New Event')));
      return;
    }
    visibleEvents.forEach((event) => {
      const reserved = seatsTaken(event);
      host.append(createElement('article', { class: 'coordinator-event' },
        createElement('time', { class: 'coordinator-event-date', datetime: event.event_date }, createElement('strong', { text: new Date(event.event_date + 'T00:00:00').getDate() }),
          createElement('span', { text: new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-PH', { month: 'short', year: 'numeric' }) })),
        createElement('div', { class: 'coordinator-event-details' },
          createElement('span', { class: `table-status ${isPast(event) ? 'is-concluded' : event.status === 'active' ? 'is-active' : 'is-inactive'}`, text: isPast(event) ? 'Concluded' : event.status }),
          createElement('h3', { class: 'h4', text: event.title }),
          createElement('p', { class: 'muted', text: `${formatTime(event.event_time)} · ${formatLocation(event)}` })),
        createElement('div', { class: 'coordinator-capacity' },
          createElement('p', {}, createElement('strong', { text: reserved.toLocaleString('en-PH') }), ` / ${toNumber(event.total_slots).toLocaleString('en-PH')} reserved`),
          createElement('progress', { max: Math.max(1, toNumber(event.total_slots)), value: reserved, 'aria-label': `Reserved seats for ${event.title}` }),
          createElement('span', { class: 'table-secondary', text: `${toNumber(event.available_slots).toLocaleString('en-PH')} seats available · ${Math.min(100, Math.round(reserved / Math.max(1, toNumber(event.total_slots)) * 100))}% reserved` })),
        createElement('div', { class: 'coordinator-event-actions' },
          createElement('button', { type: 'button', class: 'button button-outline button-small', onclick: () => openAttendees(event), 'aria-label': `Attendees: ${event.title}` }, icon('users', 'icon-small'), 'Attendees'),
          createElement('button', { type: 'button', class: 'button button-plain button-small', onclick: () => openEventForm(event), 'aria-label': `Edit: ${event.title}` }, icon('edit', 'icon-small'), 'Edit'),
          createElement('button', { type: 'button', class: 'table-action table-action-delete', title: 'Delete event', 'aria-label': `Delete: ${event.title}`, onclick: () => deleteEvent(event) }, icon('trash', 'icon-small'), 'Delete'))));
    });
  }

  async function toggleFeatured(event) {
    const next = toNumber(event.is_featured) ? 0 : 1;
    const response = await api('toggle_featured', { body: { id: event.id, is_featured: next } });
    response.ok ? toast(response.message, { type: 'success' }) : toast(response.message, { type: 'error' });
    if (response.ok) await loadEvents();
  }

  async function deleteEvent(event) {
    if (event && !event.can_manage) {
      const owner = event.coordinator_author_name || event.organizer_name || 'another coordinator';
      return toast(`Access Denied: This event is coordinated by "${owner}". You cannot delete another coordinator's event.`, { type: 'error', duration: 7000 });
    }
    const confirmed = await confirmAction({
      title: 'Permanently remove event?',
      message: `"${event.title}" and all related booking passes will be permanently removed from Iligan City portal.`,
      confirmLabel: 'Delete Event', cancelLabel: 'Keep Event', requireText: 'DELETE'
    });
    if (!confirmed) return;
    const response = await api('delete_event', { body: { id: event.id, confirmation_text: 'DELETE' } });
    if (!response.ok) return toast(`${response.message} ${response.tip}`.trim(), { type: 'error', duration: 8000 });
    toast(response.message, { type: 'success' });
    await loadEvents();
  }

  async function openAttendees(event) {
    find('#attendees-title').textContent = `Attendees List · ${event.title}`;
    const body = clear(find('#attendees-content')).appendChild(createElement('p', { class: 'muted', text: 'Loading attendee records...' }));
    find('#attendees-dialog').showModal();
    const response = await api('get_bookings', { params: { event_id: event.id } });
    const host = clear(find('#attendees-content'));
    if (!response.ok) return host.append(alertBox('error', response.message, response.tip, { dismissible: false }));
    if (!response.data.length) return host.append(emptyState('No Reservations Yet', 'Registered attendees will appear here once citizens reserve passes.'));
    const confirmed = response.data.filter((booking) => booking.status === 'confirmed').reduce((total, booking) => total + toNumber(booking.tickets_count), 0);
    host.append(createElement('p', { class: 'muted', style: 'margin-bottom:16px', text: `${confirmed} confirmed passes across ${response.data.length} registered reservations.` }),
      createElement('div', { class: 'table-scroll' }, createElement('table', { class: 'data-table' },
        createElement('thead', {}, createElement('tr', {}, ['Reference', 'Attendee Name', 'Contact Info', 'Tickets', 'Status'].map((heading) => createElement('th', { scope: 'col', text: heading })))),
        createElement('tbody', {}, response.data.map((booking) => createElement('tr', {},
          createElement('td', { class: 'booking-reference', text: booking.booking_reference }), createElement('td', { text: booking.attendee_name }),
          createElement('td', { text: `${booking.attendee_email} · ${booking.attendee_phone}` }), createElement('td', { text: booking.tickets_count }),
          createElement('td', {}, createElement('span', { class: `badge ${booking.status === 'confirmed' ? 'badge-green' : 'badge-red'}`, text: booking.status }))))))));
  }

  /* ---------- Event Creation & Editing Form ---------- */
  function openEventForm(event = null) {
    if (!state.user || !['organizer', 'admin'].includes(state.user.role)) return toast('Sign in as a coordinator to publish events.', { type: 'error' });
    if (event && !event.can_manage) {
      const owner = event.coordinator_author_name || event.organizer_name || 'another coordinator';
      return toast(`Access Denied: This event is coordinated by "${owner}". Coordinators cannot edit another coordinator's listing.`, { type: 'error', duration: 7000 });
    }
    const form = find('#event-form');
    form.reset(); clearAlert('#event-form-alert'); clear(find('#event-duplicate-warning'));
    findAll('input,select,textarea', form).forEach(clearFieldError);
    find('#event-form-date').min = event ? '' : todayDate();
    find('#event-form-heading').textContent = event ? 'Edit Event Listing' : 'Publish New Community Event';
    find('#save-event-button').textContent = event ? 'Save Changes' : 'Publish Event';
    find('#event-form-id').value = event ? event.id : '';
    find('#event-image-preview').hidden = true;
    const featureControl = find('#event-form-featured').closest('label');
    if (featureControl) featureControl.hidden = state.user?.role !== 'admin';
    if (event) {
      if (event.barangay && !state.barangays.some((barangay) => barangay.name === event.barangay)) find('#event-form-barangay').append(createElement('option', { value: event.barangay }, event.barangay));
      Object.entries({
        'event-form-title': event.title, 'event-form-description': event.description, 'event-form-category': event.category, 'event-form-barangay': event.barangay, 'event-form-venue': event.venue_name,
        'event-form-date': event.event_date, 'event-form-time': String(event.event_time).slice(0, 5), 'event-form-price': event.price, 'event-form-capacity': event.total_slots,
        'event-form-organizer': event.organizer_name, 'event-form-image': event.image_url || ''
      }).forEach(([id, value]) => { find(`#${id}`).value = value; });
      find('#event-form-featured').checked = !!toNumber(event.is_featured);
      updatePreview();
    } else {
      find('#event-form-organizer').value = state.user?.name || '';
    }
    updateTextCounters();
    find('#event-form-dialog').showModal();
    find('#event-form-title').focus();
  }
  function updatePreview() {
    const imageUrl = find('#event-form-image').value.trim(), image = find('#event-image-preview');
    if (!imageUrl) { image.hidden = true; return; }
    image.onerror = () => { image.hidden = true; };
    image.onload = () => { image.hidden = false; };
    image.src = imageUrl;
  }
  async function checkDuplicateTitle() {
    const title = find('#event-form-title').value.trim(), host = clear(find('#event-duplicate-warning'));
    if (title.length < 5) return;
    const response = await api('check_event_exists', { params: { title } });
    const found = response.ok && response.data?.exists && String(response.data.event.id) !== find('#event-form-id').value;
    if (found) host.append(alertBox('warning', 'Notice: Duplicate Event Title', response.data.warning, { dismissible: false }));
  }
  function bindEventForm() {
    document.addEventListener('click', (browserEvent) => { if (browserEvent.target.closest('[data-new-event]')) openEventForm(); });
    find('#event-form-title').addEventListener('input', debounce(checkDuplicateTitle, 500));
    find('#event-form-image').addEventListener('input', debounce(updatePreview, 400));
    find('#event-form').addEventListener('submit', async (browserEvent) => {
      browserEvent.preventDefault();
      const form = browserEvent.currentTarget, field = (id) => find(`#${id}`), editing = !!field('event-form-id').value;
      const price = Number(field('event-form-price').value), slots = Number(field('event-form-capacity').value);
      if (!applyRules(form, [
        [field('event-form-title'), field('event-form-title').value.trim().length >= 5 ? '' : 'Use a descriptive title (at least 5 characters).'],
        [field('event-form-description'), field('event-form-description').value.trim().length >= 15 ? '' : 'Describe the event in at least 15 characters.'],
        [field('event-form-category'), field('event-form-category').value.trim() ? '' : 'Choose or type a category.'],
        [field('event-form-barangay'), field('event-form-barangay').value ? '' : 'Select the barangay where the event happens.'],
        [field('event-form-venue'), field('event-form-venue').value.trim() ? '' : 'Enter the venue or landmark.'],
        [field('event-form-date'), !field('event-form-date').value ? 'Select the event date.' : (!editing && field('event-form-date').value < todayDate() ? 'The date cannot be in the past.' : '')],
        [field('event-form-time'), field('event-form-time').value ? '' : 'Set the start time.'],
        [field('event-form-price'), field('event-form-price').value !== '' && price >= 0 ? '' : 'Enter 0 for free events, or a positive amount.'],
        [field('event-form-capacity'), Number.isInteger(slots) && slots >= 1 ? '' : 'Seats must be a whole number of at least 1.']
      ])) return;
      const body = {
        id: field('event-form-id').value || undefined, title: field('event-form-title').value.trim(), description: field('event-form-description').value.trim(),
        category: field('event-form-category').value.trim(), barangay: field('event-form-barangay').value, venue_name: field('event-form-venue').value.trim(),
        event_date: field('event-form-date').value, event_time: field('event-form-time').value, price, total_slots: slots,
        organizer_name: field('event-form-organizer').value.trim(), image_url: field('event-form-image').value.trim(), is_featured: field('event-form-featured').checked ? 1 : 0
      };
      const response = await withLoading(field('save-event-button'), () => api(editing ? 'update_event' : 'create_event', { body }));
      if (!response.ok) {
        showApiError('#event-form-alert', response);
        find('#event-form-dialog .dialog-content').scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      find('#event-form-dialog').close();
      toast(response.message, { type: 'success', duration: 5000 });
      await loadEvents();
    });
  }

  /* ---------- Admin Console ---------- */
  function renderPills(selector, items, onDelete, label) {
    const host = clear(find(selector));
    if (!items.length) return host.append(createElement('li', { class: 'muted', text: `No ${label} configured yet.` }));
    items.forEach((item) => host.append(createElement('li', { class: 'pill' }, item.name,
      createElement('button', { type: 'button', class: 'icon-button', 'aria-label': `Remove ${item.name}`, onclick: () => onDelete(item) }, icon('trash', 'icon-small'), 'Delete'))));
  }
  function renderAdminLists() {
    renderPills('#barangay-list', state.barangays, deleteBarangay, 'barangays');
    renderPills('#tag-list', state.tags, deleteTag, 'tags');
    find('#homepage-title').value = state.settings.hero_title || '';
    find('#homepage-subtitle').value = state.settings.hero_subtitle || '';
    find('#homepage-image').value = state.settings.hero_bg_image || '';
  }
  async function deleteBarangay(barangay) {
    const confirmed = await confirmAction({ title: `Remove ${barangay.name}?`, message: 'Existing events keep their location, but this barangay will no longer be offered for new events.', confirmLabel: 'Remove Barangay' });
    if (!confirmed) return;
    const response = await api('delete_barangay', { body: { id: barangay.id } });
    if (!response.ok) return showApiError('#admin-alert', response);
    state.barangays = response.data.barangays; fillBarangaySelects(); renderAdminLists(); toast(response.message, { type: 'success' });
  }
  async function deleteTag(tag) {
    const response = await api('delete_hero_tag', { body: { id: tag.id } });
    if (!response.ok) return showApiError('#admin-alert', response);
    state.tags = response.data.tags; renderHeroTags(); renderAdminLists(); toast(response.message, { type: 'success' });
  }
  function bindAdmin() {
    const panels = { events: '#panel-events', content: '#panel-content', barangays: '#panel-barangays', tags: '#panel-tags', inquiries: '#panel-inquiries' };
    initTabs(find('#view-admin .tabs'), (tab) => { Object.entries(panels).forEach(([panelName, selector]) => { find(selector).hidden = panelName !== tab.dataset.tab; }); if (tab.dataset.tab === 'inquiries') loadInquiries(); });

    find('#content-form').addEventListener('submit', async (browserEvent) => {
      browserEvent.preventDefault();
      const imageUrl = find('#homepage-image').value.trim();
      const response = await withLoading(find('button[type=submit]', browserEvent.currentTarget), () => api('update_settings', { body: { hero_title: find('#homepage-title').value.trim(), hero_subtitle: find('#homepage-subtitle').value.trim(), hero_bg_image: imageUrl, hero_banner_image: imageUrl } }));
      if (!response.ok) return showApiError('#admin-alert', response);
      state.settings = response.data; toast(response.message, { type: 'success' });
    });
    find('#barangay-form').addEventListener('submit', async (browserEvent) => {
      browserEvent.preventDefault();
      const input = find('#new-barangay');
      if (!applyRules(browserEvent.currentTarget, [[input, input.value.trim().length >= 2 ? '' : 'Enter at least 2 characters.']])) return;
      const response = await api('add_barangay', { body: { name: input.value.trim() } });
      if (!response.ok) return showApiError('#admin-alert', response);
      state.barangays = response.data.barangays; input.value = ''; fillBarangaySelects(); renderAdminLists(); toast(response.message, { type: 'success' });
    });
    find('#tag-form').addEventListener('submit', async (browserEvent) => {
      browserEvent.preventDefault();
      const input = find('#new-tag');
      if (!applyRules(browserEvent.currentTarget, [[input, input.value.trim().length >= 2 ? '' : 'Enter at least 2 characters.']])) return;
      const response = await api('add_hero_tag', { body: { name: input.value.trim() } });
      if (!response.ok) return showApiError('#admin-alert', response);
      state.tags = response.data.tags; input.value = ''; renderHeroTags(); renderAdminLists(); toast(response.message, { type: 'success' });
    });
  }

  /* ---------- Contact Form ---------- */
  function bindContact() {
    const form = find('#contact-form');
    if (!form) return;
    form.addEventListener('submit', async (browserEvent) => {
      browserEvent.preventDefault();
      const name = find('#contact-name'), email = find('#contact-email'), topic = find('#contact-topic'), message = find('#contact-message');
      if (!applyRules(form, [
        [name, name.value.trim().length >= 3 ? '' : 'Enter your full name (at least 3 characters).'],
        [email, isValidEmail(email.value.trim()) ? '' : 'Enter a valid email address.'],
        [topic, topic.value ? '' : 'Select an inquiry topic.'],
        [message, message.value.trim().length >= 10 ? '' : 'Please enter a message of at least 10 characters.']
      ])) return;
      const response = await withLoading(find('button[type=submit]', form), () => api('send_inquiry', { body: {
        name: name.value.trim(), email: email.value.trim(), topic: topic.value,
        barangay: find('#contact-barangay').value.trim(), message: message.value.trim()
      } }));
      if (!response.ok) return showApiError('#contact-alert', response);
      form.reset();
      updateTextCounters();
      showAlert('#contact-alert', 'success', 'Inquiry Saved', 'Your inquiry is saved in the portal support inbox. Keep your email available for a reply.');
      toast('Your inquiry has been saved.', { type: 'success' });
    });
  }

  /* =========================================================
     CS-NAVIGATION CONTROLLER (Adapted from Navigation.js)
     ========================================================= */
  let closeMobileMenu = () => { };

  function initCsNavigation() {
    const navigationSettings = {
      BREAKPOINTS: { MOBILE: 1023.5 },
      SCROLL_THRESHOLD: 100,
      SELECTORS: {
        body: 'body',
        navigation: '#cs-navigation',
        hamburger: '#cs-navigation .cs-toggle',
        menuWrapper: '#cs-ul-wrapper',
        dropdownToggle: '.cs-dropdown-toggle',
        dropdown: '.cs-dropdown',
        dropdownMenu: '.cs-drop-ul',
      },
      CLASSES: {
        active: 'cs-active',
        menuOpen: 'cs-open',
        scrolled: 'scroll',
      },
    };

    const elements = {
      body: document.querySelector(navigationSettings.SELECTORS.body),
      navigation: document.querySelector(navigationSettings.SELECTORS.navigation),
      hamburger: document.querySelector(navigationSettings.SELECTORS.hamburger),
      menuWrapper: document.querySelector(navigationSettings.SELECTORS.menuWrapper),
    };

    const isMobile = () => window.matchMedia(`(max-width: ${navigationSettings.BREAKPOINTS.MOBILE}px)`).matches;

    const toggleAriaExpanded = (element, forceState) => {
      if (!element) return false;
      const isExpanded = forceState !== undefined ? forceState : element.getAttribute('aria-expanded') !== 'true';
      element.setAttribute('aria-expanded', isExpanded.toString());
      return isExpanded;
    };

    const setInertState = (element, shouldBeInert) => {
      if (!element) return;
      element.inert = shouldBeInert;
    };

    const toggleDropdown = (dropdown, forceClose = false) => {
      if (!dropdown) return false;
      const toggle = dropdown.querySelector(navigationSettings.SELECTORS.dropdownToggle);
      const menu = dropdown.querySelector(navigationSettings.SELECTORS.dropdownMenu);
      const isActive = dropdown.classList.contains(navigationSettings.CLASSES.active);
      const shouldOpen = forceClose ? false : !isActive;

      dropdown.classList.toggle(navigationSettings.CLASSES.active, shouldOpen);
      if (toggle) toggle.setAttribute('aria-expanded', shouldOpen.toString());
      if (menu) setInertState(menu, !shouldOpen);
      return shouldOpen;
    };

    const closeAllDropdowns = () => {
      if (!elements.navigation) return;
      elements.navigation.querySelectorAll(`${navigationSettings.SELECTORS.dropdown}.${navigationSettings.CLASSES.active}`).forEach((dropdown) => {
        toggleDropdown(dropdown, true);
      });
    };

    const toggleMobileMenu = (forceClose = false) => {
      if (!elements.hamburger || !elements.navigation || !elements.body) return;
      const isOpen = elements.navigation.classList.contains(navigationSettings.CLASSES.active);
      const shouldOpen = forceClose ? false : !isOpen;

      elements.hamburger.classList.toggle(navigationSettings.CLASSES.active, shouldOpen);
      elements.navigation.classList.toggle(navigationSettings.CLASSES.active, shouldOpen);
      elements.body.classList.toggle(navigationSettings.CLASSES.menuOpen, shouldOpen);
      toggleAriaExpanded(elements.hamburger, shouldOpen);

      if (elements.menuWrapper && isMobile()) {
        setInertState(elements.menuWrapper, !shouldOpen);
      }
      if (!shouldOpen) closeAllDropdowns();
    };

    closeMobileMenu = () => {
      closeAllDropdowns();
      if (elements.navigation?.classList.contains(navigationSettings.CLASSES.active)) {
        toggleMobileMenu(true);
      }
    };

    const updateInertStates = () => {
      if (!elements.menuWrapper) return;
      if (isMobile()) {
        const isMenuOpen = elements.navigation?.classList.contains(navigationSettings.CLASSES.active);
        setInertState(elements.menuWrapper, !isMenuOpen);
      } else {
        setInertState(elements.menuWrapper, false);
        if (elements.navigation?.classList.contains(navigationSettings.CLASSES.active)) {
          toggleMobileMenu(true);
        }
      }
      if (elements.navigation) {
        elements.navigation.querySelectorAll(navigationSettings.SELECTORS.dropdown).forEach((dropdown) => {
          const isOpen = dropdown.classList.contains(navigationSettings.CLASSES.active);
          const dropdownMenu = dropdown.querySelector(navigationSettings.SELECTORS.dropdownMenu);
          if (dropdownMenu) setInertState(dropdownMenu, !isOpen);
        });
      }
    };

    if (elements.hamburger) {
      elements.hamburger.addEventListener('click', () => toggleMobileMenu());
    }

    if (elements.navigation) {
      elements.navigation.addEventListener('click', (event) => {
        const dropdownToggle = event.target.closest(navigationSettings.SELECTORS.dropdownToggle);
        if (dropdownToggle) {
          event.preventDefault();
          const dropdown = dropdownToggle.closest(navigationSettings.SELECTORS.dropdown);
          if (dropdown) toggleDropdown(dropdown);
          return;
        }
        // Close mobile menu & dropdowns when a navigation link is clicked
        if (event.target.closest('a[data-route]')) {
          closeMobileMenu();
        }
      });

      elements.navigation.querySelectorAll(navigationSettings.SELECTORS.dropdown).forEach((dropdown) => {
        let hoverTimeout;
        dropdown.addEventListener('mouseenter', () => {
          if (!isMobile()) {
            clearTimeout(hoverTimeout);
            const dropdownMenu = dropdown.querySelector(navigationSettings.SELECTORS.dropdownMenu);
            if (dropdownMenu) setInertState(dropdownMenu, false);
          }
        });
        dropdown.addEventListener('mouseleave', () => {
          if (!isMobile() && !dropdown.classList.contains(navigationSettings.CLASSES.active)) {
            hoverTimeout = setTimeout(() => {
              const dropdownMenu = dropdown.querySelector(navigationSettings.SELECTORS.dropdownMenu);
              if (dropdownMenu) setInertState(dropdownMenu, true);
            }, 300);
          }
        });
        dropdown.addEventListener('focusout', (event) => {
          setTimeout(() => {
            if (!dropdown.contains(document.activeElement) && dropdown.classList.contains(navigationSettings.CLASSES.active)) {
              toggleDropdown(dropdown, true);
            }
          }, 10);
        });
      });
    }

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const activeDropdown = elements.navigation?.querySelector(`${navigationSettings.SELECTORS.dropdown}.${navigationSettings.CLASSES.active}`);
      if (activeDropdown) {
        const toggle = activeDropdown.querySelector(navigationSettings.SELECTORS.dropdownToggle);
        toggleDropdown(activeDropdown, true);
        toggle?.focus();
        return;
      }
      if (elements.navigation?.classList.contains(navigationSettings.CLASSES.active)) {
        toggleMobileMenu(true);
        elements.hamburger?.focus();
      }
    });

    if (elements.navigation) {
      elements.navigation.addEventListener('focusout', () => {
        if (!isMobile() || !elements.navigation.classList.contains(navigationSettings.CLASSES.active)) return;
        setTimeout(() => {
          if (document.activeElement && !elements.navigation.contains(document.activeElement)) {
            toggleMobileMenu(true);
          }
        }, 10);
      });
    }

    window.addEventListener('scroll', () => {
      const isScrolled = document.documentElement.scrollTop >= navigationSettings.SCROLL_THRESHOLD;
      elements.body?.classList.toggle(navigationSettings.CLASSES.scrolled, isScrolled);
    }, { passive: true });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateInertStates, 100);
    });

    updateInertStates();
  }


  function updateTextCounters() {
    findAll('textarea[maxlength]').forEach((input) => {
      const id = `${input.id}-count`;
      let counter = document.getElementById(id);
      if (!counter) {
        counter = createElement('span', { id, class: 'character-count' });
        input.after(counter);
        const descriptions = new Set((input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
        descriptions.add(id);
        input.setAttribute('aria-describedby', [...descriptions].join(' '));
        input.addEventListener('input', () => { counter.textContent = `${input.value.length} / ${input.maxLength} characters`; });
      }
      counter.textContent = `${input.value.length} / ${input.maxLength} characters`;
    });
  }

  function bindPortalControls() {
    updateTextCounters();
    find('#mobile-action').addEventListener('click', () => {
      if (state.user && ['organizer', 'admin'].includes(state.user.role)) openEventForm();
      else navigateTo('#/events');
    });
    document.addEventListener('click', (event) => {
      if (event.target.closest('[data-open-privacy]')) find('#privacy-dialog').showModal();
    });
    findAll('input, textarea, select').forEach((input) => input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') clearFieldError(input);
    }));
  }

  async function loadInquiries() {
    const host = clear(find('#inquiries-list'));
    host.append(createElement('p', { text: 'Loading support inquiries…' }));
    const response = await api('get_inquiries');
    clear(host);
    if (!response.ok) return host.append(alertBox('error', response.message, response.tip));
    if (!response.data.length) return host.append(emptyState('No support inquiries yet', 'Submitted contact messages will appear here.'));
    response.data.forEach((inquiry) => host.append(createElement('article', { class: 'card form-card stack' },
      createElement('h3', { class: 'h4', text: inquiry.topic }),
      createElement('p', { class: 'muted', text: `${inquiry.name} · ${inquiry.email} · ${inquiry.created_at}` }),
      createElement('p', { class: 'event-description', text: inquiry.message }),
      inquiry.status === 'new' ? createElement('button', { type: 'button', class: 'button button-outline', onclick: async () => {
        const result = await api('resolve_inquiry', { body: { id: inquiry.id } });
        if (!result.ok) return toast(result.message, { type: 'error' });
        toast('Inquiry marked as resolved.', { type: 'success' });
        loadInquiries();
      } }, 'Mark Resolved') : createElement('span', { class: 'badge badge-green', text: 'Resolved' }))));
  }

  /* ---------- Global Nav & Routing ---------- */
  function bindGlobal() {
    document.addEventListener('click', (browserEvent) => {
      const close = browserEvent.target.closest('[data-close]');
      if (close && (state.user || close.closest('dialog').id !== 'dlg-auth')) close.closest('dialog').close();
      const auth = browserEvent.target.closest('[data-open-auth]');
      if (auth) {
        closeMobileMenu();
        openAuth(auth.dataset.openAuth);
        return;
      }
      const routeAnchor = browserEvent.target.closest('a[href^="#/"]');
      if (routeAnchor) {
        const targetHash = routeAnchor.getAttribute('href');
        const targetName = (targetHash.replace(/^#\/?/, '') || 'home').split('?')[0];
        if (LANDING_ROUTES.includes(targetName) && location.hash === targetHash) {
          browserEvent.preventDefault();
          route();
        }
      }
    });
    ['#event-dialog', '#attendees-dialog'].forEach((selector) => find(selector).addEventListener('click', (browserEvent) => { if (browserEvent.target === browserEvent.currentTarget) browserEvent.currentTarget.close(); }));
  }

  let firstRoute = true;
  function route() {
    if (!state.user) {
      findAll('.view').forEach((view) => { view.hidden = true; });
      document.title = 'Sign In | Iligan Community Event Portal';
      closeMobileMenu();
      if (!find('#dlg-auth').open) openAuth('login');
      return;
    }
    const name = (location.hash.replace(/^#\/?/, '') || 'home').split('?')[0];
    const page = ROUTES[name];
    if (!page) { location.replace('#/home'); return; }
    if (page.roles && !(state.user && page.roles.includes(state.user.role))) {
      location.replace('#/home');
      state.user ? toast('You do not have permission to view that section.', { type: 'error' }) : openAuth('login', 'Please sign in to access that portal section.');
      return;
    }
    const isLandingRoute = LANDING_ROUTES.includes(name);
    findAll('.view').forEach((view) => {
      if (isLandingRoute) {
        view.hidden = !view.hasAttribute('data-landing-section');
      } else {
        view.hidden = view.id !== `view-${name}`;
      }
    });
    setActiveNavRoute(name);
    closeMobileMenu();
    find('#mobile-action').textContent = state.user && ['organizer', 'admin'].includes(state.user.role) ? 'Add Event' : 'Discover Events';
    find('#account-menu').hidePopover();
    if (name === 'guide') {
      const topic = new URLSearchParams(location.hash.split('?')[1] || '').get('topic') || 'booking';
      findAll('[data-help-topic]').forEach((link) => {
        const active = link.dataset.helpTopic === topic;
        active ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current');
      });
      if (location.hash.includes('?') && ['booking', 'accounts', 'events', 'privacy'].includes(topic)) requestAnimationFrame(() => find(`#guide-${topic}`).scrollIntoView({ block: 'start' }));
    }
    if (isLandingRoute) {
      lockScrollspy(900);
      const scrollBehavior = firstRoute ? 'instant' : 'smooth';
      if (name === 'home') {
        window.scrollTo({ top: 0, left: 0, behavior: scrollBehavior });
      } else {
        requestAnimationFrame(() => {
          find(`#view-${name}`)?.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
        });
      }
      if (!firstRoute) find('#main').focus({ preventScroll: true });
    } else if (!firstRoute) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      find('#main').focus({ preventScroll: true });
    }
    firstRoute = false;
    if (name === 'bookings') loadBookings();
    if (name === 'citizen') loadCitizenDashboard();
    if (name === 'dashboard' || name === 'admin') refreshStaffViews();
    if (name === 'admin') renderAdminLists();
  }

  /* ---------- App Initialization ---------- */
  async function startApp() {
    initCsNavigation();
    initHeroCarousel();
    initHomeScrollspy();
    bindGlobal(); bindAuth(); bindProfile(); bindFilters(); bindEventForm(); bindAdmin(); bindContact(); bindPortalControls();
    find('#coordinator-filter').addEventListener('change', renderCoordinatorDashboard);
    window.addEventListener('hashchange', route);
    const response = await api('get_profile');
    setUser(response.ok ? response.data : null);
    route();
    if (!state.user) return;
    await Promise.all([loadSettings(), loadEvents()]);
    if (location.hash.includes('admin')) renderAdminLists();
  }

  document.addEventListener('DOMContentLoaded', startApp);
})();
