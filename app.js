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
  const API = 'api.php';
  const PAGE_SIZE = 9;
  const USER_KEY = 'iligan_current_user';
  const CAROUSEL_INTERVAL_MS = 5000;
  const ROLE_LABEL = { user: 'Citizen', organizer: 'Coordinator', admin: 'Administrator' };
  const DEFAULT_CATEGORIES = ['Festival', 'Eco-Tourism', 'Arts & Culture', 'Sports', 'LGU Public Service', 'Community', 'Guided tours', 'Workshops', 'Heritage'];
  
  const ROUTES = {
    home:      { title: 'Home' },
    events:    { title: 'Discover Events' },
    about:     { title: 'About Us' },
    contact:   { title: 'Contact Us' },
    bookings:  { title: 'My Bookings', roles: ['user', 'organizer', 'admin'] },
    dashboard: { title: 'Coordinator Dashboard', roles: ['organizer'] },
    admin:     { title: 'Admin Console', roles: ['admin'] }
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
    filters: { search: '', category: 'All', barangay: '', price: '', date: '', sort: 'date', past: false },
    carouselIndex: 0,
    carouselTimer: null,
    carouselProgressStart: null,
    carouselAnimFrame: null,
    carouselSlides: [...DEFAULT_CAROUSEL_SLIDES]
  };

  /* ---------- DOM Helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function el(tag, props = {}, ...kids) {
    const node = document.createElement(tag);
    for (const [key, val] of Object.entries(props || {})) {
      if (val == null || val === false) continue;
      if (key === 'class') node.className = val;
      else if (key === 'text') node.textContent = val;
      else if (key.startsWith('on') && typeof val === 'function') node.addEventListener(key.slice(2), val);
      else node.setAttribute(key, val === true ? '' : val);
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      node.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
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
    arrowRight: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>'
  };
  function icon(name, extra = '') {
    const t = document.createElement('template');
    t.innerHTML = `<svg class="icon ${extra}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;
    return t.content.firstElementChild;
  }

  /* ---------- Formatting ---------- */
  const todayISO = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const num = (v) => Number(v) || 0;
  const isFree = (ev) => num(ev.price) <= 0;
  const peso = (n) => (num(n) <= 0 ? 'FREE' : '₱' + num(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  const fmtDate = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('en-PH', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const parseDateParts = (iso) => {
    const d = new Date(iso + 'T00:00:00');
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: d.getDate()
    };
  };
  function fmtTime(t) {
    const [h, m] = String(t || '00:00').split(':');
    const d = new Date(); d.setHours(+h, +m, 0, 0);
    return d.toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' });
  }
  const isPast = (ev) => ev.event_date < todayISO();
  const seatsTaken = (ev) => Math.max(0, num(ev.total_slots) - num(ev.available_slots));
  const canBook = (ev) => ev.status === 'active' && num(ev.available_slots) > 0 && !isPast(ev);
  const debounce = (fn, ms = 350) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  const PLACEHOLDER_IMG = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">' +
    '<rect width="800" height="450" fill="#EBF0FF"/>' +
    '<g fill="none" stroke="#1E3A8A" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" transform="translate(340 140)">' +
    '<rect x="0" y="12" width="120" height="110" rx="12"/><path d="M0 48h120M32 0v28M88 0v28"/></g>' +
    '<text x="400" y="330" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#1E3A8A">Iligan City Event</text></svg>');

  function bannerImg(ev) {
    const img = el('img', { src: ev.image_url || PLACEHOLDER_IMG, alt: `${ev.title} event banner`, loading: 'lazy', width: 800, height: 450 });
    img.addEventListener('error', () => { if (img.src !== PLACEHOLDER_IMG) img.src = PLACEHOLDER_IMG; });
    return img;
  }

  /* ---------- API Client ---------- */
  async function api(action, { params = {}, body = null } = {}) {
    const url = new URL(API, location.href);
    url.searchParams.set('action', action);
    for (const [k, v] of Object.entries(params)) if (v !== '' && v != null) url.searchParams.set(k, v);
    const init = { headers: {} };
    if (body) {
      init.method = 'POST';
      init.headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify({ ...(state.user ? { user_id: state.user.id } : {}), ...body });
    } else if (state.user) {
      url.searchParams.set('user_id', state.user.id);
    }
    try {
      const res = await fetch(url, init);
      const json = await res.json();
      return { ok: !!json.success, message: json.message || '', tip: json.actionable_tip || '', data: json.data };
    } catch {
      return { ok: false, message: 'We could not reach the server.', tip: 'Make sure Apache and MySQL are running in XAMPP, then try again.', data: null };
    }
  }

  /* ---------- UI Kit: Alerts, Toasts, Confirm ---------- */
  function alertBox(type, title, text, { dismissible = true, actions = [] } = {}) {
    const box = el('div', { class: `alert alert-${type}`, role: type === 'error' ? 'alert' : 'status' },
      icon({ info: 'info', warning: 'warning', success: 'check', error: 'error' }[type]),
      el('div', { class: 'alert-body' },
        title && el('p', { class: 'alert-title', text: title }),
        text && el('p', { class: 'alert-text', text }),
        actions.length ? el('div', { class: 'form-actions' }, actions) : null),
      dismissible && el('button', { type: 'button', class: 'icon-btn alert-close', 'aria-label': 'Dismiss message', onclick: () => box.remove() }, icon('x', 'icon-sm')));
    return box;
  }
  function showAlert(target, type, title, text, opts) {
    const host = typeof target === 'string' ? $(target) : target;
    clear(host).append(alertBox(type, title, text, opts));
  }
  const clearAlert = (target) => clear(typeof target === 'string' ? $(target) : target);
  const showApiError = (target, res) => showAlert(target, 'error', res.message || 'Something went wrong.', res.tip);

  function toast(message, { type = 'info', actionLabel = '', onAction = null, duration = 5000 } = {}) {
    const node = el('div', { class: `toast toast-${type}` }, el('p', { class: 'toast-text', text: message }));
    const remove = () => node.remove();
    if (actionLabel) node.append(el('button', { type: 'button', class: 'btn btn-ghost', onclick: () => { remove(); onAction && onAction(); } }, actionLabel));
    node.append(el('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Dismiss notification', onclick: remove }, icon('x', 'icon-sm')));
    $('#toast-region').append(node);
    setTimeout(remove, duration);
  }

  async function withLoading(btn, task) {
    btn.classList.add('is-loading'); btn.disabled = true;
    try { return await task(); } finally { btn.classList.remove('is-loading'); btn.disabled = false; }
  }

  function confirmAction({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Keep It', requireText = '' }) {
    return new Promise((resolve) => {
      const dlg = $('#dlg-confirm'), ok = $('#confirm-ok'), cancel = $('#confirm-cancel'), input = $('#confirm-type');
      $('#confirm-title').textContent = title;
      $('#confirm-message').textContent = message;
      ok.textContent = confirmLabel; cancel.textContent = cancelLabel;
      $('#confirm-type-wrap').hidden = !requireText;
      input.value = ''; ok.disabled = !!requireText;
      if (requireText) $('#confirm-type-label').textContent = `Type "${requireText}" in capital letters to confirm:`;
      input.oninput = () => { ok.disabled = input.value !== requireText; };
      let result = false;
      ok.onclick = () => { result = true; dlg.close(); };
      cancel.onclick = () => dlg.close();
      dlg.addEventListener('close', () => resolve(result), { once: true });
      dlg.showModal();
      (requireText ? input : cancel).focus();
    });
  }

  function setFieldError(input, msg) {
    clearFieldError(input);
    const id = `${input.id}-err`;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', [input.getAttribute('aria-describedby'), id].filter(Boolean).join(' '));
    input.parentElement.append(el('p', { class: 'field-error', id, text: msg }));
  }
  function clearFieldError(input) {
    input.removeAttribute('aria-invalid');
    const id = `${input.id}-err`;
    $(`#${id}`)?.remove();
    const d = (input.getAttribute('aria-describedby') || '').split(' ').filter((x) => x && x !== id).join(' ');
    d ? input.setAttribute('aria-describedby', d) : input.removeAttribute('aria-describedby');
  }
  function applyRules(form, rules) {
    $$('input,select,textarea', form).forEach(clearFieldError);
    const bad = rules.filter(([, msg]) => msg);
    bad.forEach(([input, msg]) => setFieldError(input, msg));
    bad[0]?.[0].focus();
    return bad.length === 0;
  }
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  function initTabs(tablist, onSelect) {
    const tabs = $$('[role="tab"]', tablist);
    const select = (tab, focus = false) => {
      tabs.forEach((t) => { const on = t === tab; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
      if (focus) tab.focus();
      onSelect(tab);
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (step) { e.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
    return select;
  }

  /* =========================================================
     TOP HERO CAROUSEL IMPLEMENTATION
     ========================================================= */
  function initHeroCarousel() {
    const track = $('#carousel-track'), dots = $('#carousel-dots');
    if (!track) return;

    // Build slides
    clear(track); clear(dots);
    state.carouselSlides.forEach((slide, idx) => {
      const bgImg = el('img', { class: 'carousel-bg', src: slide.image, alt: slide.title, loading: idx === 0 ? 'eager' : 'lazy' });
      bgImg.addEventListener('error', () => { bgImg.src = 'images/kasadya_sa_diyandi.jpg'; });

      const slideNode = el('div', { class: `carousel-slide ${idx === 0 ? 'is-active' : ''}`, 'data-slide': idx },
        bgImg,
        el('div', { class: 'carousel-scrim' }),
        el('div', { class: 'container' },
          el('div', { class: 'carousel-content' },
            el('span', { class: 'carousel-badge', text: slide.badge || 'Community Highlight' }),
            el('h2', { class: 'carousel-title', text: slide.title }),
            el('p', { class: 'carousel-sub', text: slide.subtitle }),
            slide.meta && el('div', { class: 'carousel-meta-row' },
              el('span', { class: 'carousel-meta-item' }, icon('pin', 'icon-sm'), slide.meta)),
            el('div', { class: 'carousel-actions' },
              el('button', {
                type: 'button',
                class: 'btn carousel-btn-primary',
                onclick: () => {
                  if (slide.eventId) openEventDetails(slide.eventId);
                  else location.hash = '#/events';
                }
              }, icon('ticket', 'icon-sm'), slide.actionText || 'Book Pass'),
              el('button', {
                type: 'button',
                class: 'btn carousel-btn-glass',
                onclick: () => { location.hash = '#/events'; }
              }, 'Browse All Events')))));
      track.append(slideNode);

      // Dot button
      const dot = el('button', {
        type: 'button',
        class: `carousel-dot ${idx === 0 ? 'is-active' : ''}`,
        'aria-label': `Go to slide ${idx + 1}: ${slide.title}`,
        onclick: () => setCarouselSlide(idx)
      });
      dots.append(dot);
    });

    $('#carousel-prev').onclick = () => prevCarouselSlide();
    $('#carousel-next').onclick = () => nextCarouselSlide();

    // Pause on hover
    const carouselEl = $('#hero-carousel');
    carouselEl.addEventListener('mouseenter', pauseCarousel);
    carouselEl.addEventListener('mouseleave', resumeCarousel);

    // Touch Swipe Support
    let touchStartX = 0;
    carouselEl.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    carouselEl.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (diff > 50) prevCarouselSlide();
      else if (diff < -50) nextCarouselSlide();
    }, { passive: true });

    startCarouselTimer();
  }

  function setCarouselSlide(index) {
    const total = state.carouselSlides.length;
    state.carouselIndex = (index + total) % total;
    
    $$('.carousel-slide', $('#carousel-track')).forEach((s, idx) => {
      s.classList.toggle('is-active', idx === state.carouselIndex);
    });
    $$('.carousel-dot', $('#carousel-dots')).forEach((d, idx) => {
      d.classList.toggle('is-active', idx === state.carouselIndex);
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
    const pBar = $('#carousel-progress-bar');

    function stepProgress(now) {
      if (!state.carouselProgressStart) return;
      const elapsed = now - state.carouselProgressStart;
      const pct = Math.min(100, (elapsed / CAROUSEL_INTERVAL_MS) * 100);
      if (pBar) pBar.style.width = `${pct}%`;
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
     AUTH & INTERACTIVE MODAL CONTROLS
     ========================================================= */
  function loadUser() {
    try { state.user = JSON.parse(localStorage.getItem(USER_KEY)); } catch { state.user = null; }
  }
  function setUser(user) {
    state.user = user;
    user ? localStorage.setItem(USER_KEY, JSON.stringify(user)) : localStorage.removeItem(USER_KEY);
    applyAuthUI();
  }
  function applyAuthUI() {
    const u = state.user;
    $('#nav-guest').hidden = !!u;
    $('#nav-user').hidden = !u;
    $$('[data-role]').forEach((n) => { n.hidden = !(u && n.dataset.role.split(' ').includes(u.role)); });
    if (u) {
      $('#user-name').textContent = u.name;
      $('#user-avatar').textContent = (u.name || 'U').trim().charAt(0).toUpperCase();
      $('#user-role').textContent = ROLE_LABEL[u.role] || 'Citizen';
    }
  }
  function homeRouteFor(user) { return { organizer: '#/dashboard', admin: '#/admin' }[user.role] || '#/home'; }

  function switchAuthTab(tab) {
    const isLogin = tab === 'login';
    const wrap = $('.auth-tabs-wrap');
    if (wrap) wrap.classList.toggle('is-register', !isLogin);

    $('#login-form').hidden = !isLogin;
    $('#register-form').hidden = isLogin;
    $('#auth-title').textContent = isLogin ? 'Welcome Back' : 'Create Your Account';
    $('#auth-sub').textContent = isLogin 
      ? 'Sign in to access your digital passes and registered events.'
      : 'Join our community portal to reserve slots or publish official city events.';

    $('#auth-tab-login').classList.toggle('is-active', isLogin);
    $('#auth-tab-register').classList.toggle('is-active', !isLogin);
    clearAlert('#auth-alert');
  }
  window.switchAuthTab = switchAuthTab;

  function openAuth(tab = 'login', notice = '') {
    switchAuthTab(tab);
    if (notice) showAlert('#auth-alert', 'info', notice);
    const dlg = $('#dlg-auth');
    if (!dlg.open) dlg.showModal();
    (tab === 'login' ? $('#l-email') : $('#r-name')).focus();
  }

  async function onAuthSuccess(res, form) {
    setUser(res.data.user);
    $('#dlg-auth').close();
    form.reset();
    toast(res.message, { type: 'success' });
    await loadEvents();
    const target = homeRouteFor(state.user);
    if (location.hash === target) route(); else location.hash = target;
  }

  function bindAuth() {
    $('#auth-tab-login').onclick = () => switchAuthTab('login');
    $('#auth-tab-register').onclick = () => switchAuthTab('register');

    // Password visibility toggles
    $$('[data-toggle-pw]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetInput = $(`#${btn.dataset.togglePw}`);
        if (!targetInput) return;
        const isPw = targetInput.type === 'password';
        targetInput.type = isPw ? 'text' : 'password';
        btn.setAttribute('aria-label', isPw ? 'Hide password' : 'Show password');
      });
    });

    // Role switcher cards
    $$('.role-card').forEach((card) => {
      card.addEventListener('click', () => {
        $$('.role-card').forEach((c) => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
        const radio = $('input[type="radio"]', card);
        if (radio) {
          radio.checked = true;
          $('#r-role').value = radio.value;
          $('#r-key-wrap').hidden = radio.value !== 'organizer';
        }
      });
    });

    $('#login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = e.currentTarget, email = $('#l-email'), pw = $('#l-password');
      if (!applyRules(f, [[email, emailOk(email.value.trim()) ? '' : 'Enter a valid email address.'], [pw, pw.value ? '' : 'Enter your password.']])) return;
      const res = await withLoading($('button[type=submit]', f), () => api('login', { body: { email: email.value.trim(), password: pw.value } }));
      res.ok ? onAuthSuccess(res, f) : showApiError('#auth-alert', res);
    });

    $('#register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = e.currentTarget;
      const name = $('#r-name'), email = $('#r-email'), pw = $('#r-password'), role = $('#r-role'), key = $('#r-key');
      const isCoord = role.value === 'organizer';
      if (!applyRules(f, [
        [name, name.value.trim().length >= 3 ? '' : 'Enter your full name (at least 3 characters).'],
        [email, emailOk(email.value.trim()) ? '' : 'Enter a valid email address.'],
        [pw, pw.value.length >= 6 ? '' : 'Password must be at least 6 characters.'],
        [key, !isCoord || key.value.trim() ? '' : 'The LGU authorization key is required for coordinators.']
      ])) return;
      const res = await withLoading($('button[type=submit]', f), () => api('register', { body: {
        name: name.value.trim(), email: email.value.trim(), phone: $('#r-phone').value.trim(),
        password: pw.value, role: role.value, coordinator_key: key.value.trim()
      } }));
      if (res.ok) { f.reset(); $('#r-key-wrap').hidden = true; onAuthSuccess(res, f); } else showApiError('#auth-alert', res);
    });

    $('#btn-logout').addEventListener('click', async () => {
      const u = state.user;
      const roleTitle = u ? (ROLE_LABEL[u.role] || 'Citizen') : 'Citizen';
      const yes = await confirmAction({
        title: 'Are you sure you want to log out?',
        message: `You are currently signed in as ${u?.name || 'a user'} (${roleTitle}). You can sign back in anytime to view your passes and manage your account.`,
        confirmLabel: 'Yes, Sign Out',
        cancelLabel: 'Stay Signed In'
      });
      if (!yes) return;
      await api('logout', { body: {} });
      setUser(null);
      state.bookings = [];
      toast('You have been signed out.', { type: 'success' });
      await loadEvents();
      if (location.hash === '#/home') route(); else location.hash = '#/home';
    });
  }

  /* ---------- Profile ---------- */
  async function openProfile() {
    const dlg = $('#dlg-profile');
    clearAlert('#profile-alert');
    $('#p-password').value = '';
    dlg.showModal();
    const res = await api('get_profile');
    if (!res.ok) return showApiError('#profile-alert', res);
    const p = res.data;
    $('#p-email').value = p.email; $('#p-name').value = p.name; $('#p-phone').value = p.phone || '';
    $('#p-stats').textContent = `${ROLE_LABEL[p.role] || 'Citizen'} Account · ${p.total_bookings} Total Booking${p.total_bookings === 1 ? '' : 's'} · Registered on ${new Date(p.created_at.replace(' ', 'T')).toLocaleDateString('en-PH', { year: 'numeric', month: 'long' })}`;
  }
  function bindProfile() {
    $('#open-profile').addEventListener('click', openProfile);
    $('#profile-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = e.currentTarget, name = $('#p-name'), pw = $('#p-password');
      if (!applyRules(f, [[name, name.value.trim().length >= 3 ? '' : 'Enter at least 3 characters.'], [pw, !pw.value || pw.value.length >= 6 ? '' : 'Password must be at least 6 characters.']])) return;
      const res = await withLoading($('button[type=submit]', f), () => api('update_profile', { body: { name: name.value.trim(), phone: $('#p-phone').value.trim(), new_password: pw.value } }));
      if (!res.ok) return showApiError('#profile-alert', res);
      setUser({ ...state.user, name: res.data.name, phone: res.data.phone });
      showAlert('#profile-alert', 'success', res.message);
      pw.value = '';
    });
  }

  /* ---------- Data Loading ---------- */
  async function loadMeta() {
    const [b, t, s] = await Promise.all([api('get_barangays'), api('get_hero_tags'), api('get_settings')]);
    if (b.ok) state.barangays = b.data.barangays;
    if (t.ok) state.tags = t.data.tags;
    if (s.ok) state.settings = s.data;
    fillBarangaySelects(); renderHeroTags();
  }

  async function loadEvents() {
    const grid = $('#events-grid');
    if (!state.eventsLoaded) {
      clear(grid).append(...Array.from({ length: 6 }, () => el('div', { class: 'skeleton', 'aria-hidden': 'true' })));
    }
    const isStaff = state.user && ['organizer', 'admin'].includes(state.user.role);
    const res = await api('get_events', { params: isStaff ? { role: 'organizer' } : {} });
    if (!res.ok) {
      state.events = [];
      clear(grid);
      showAlert('#events-alert', 'error', res.message, res.tip, { dismissible: false, actions: [el('button', { type: 'button', class: 'btn btn-outline btn-sm', onclick: loadEvents }, 'Try Again')] });
      return;
    }
    clearAlert('#events-alert');
    state.events = res.data;
    state.eventsLoaded = true;

    // Curate up to 4 premier featured carousel slides from active events
    const validFeatured = state.events.filter((e) =>
      e.status === 'active' &&
      num(e.is_featured) &&
      e.image_url &&
      !e.image_url.includes('meow-assets') &&
      !e.image_url.includes('alderhaven') &&
      !e.title.toLowerCase().includes('alderhaven') &&
      e.description &&
      e.description.trim().length > 25
    ).slice(0, 4);

    if (validFeatured.length >= 2) {
      state.carouselSlides = validFeatured.map((e) => ({
        title: e.title,
        subtitle: (e.description || '').replace(/\s+/g, ' ').slice(0, 140) + (e.description.length > 140 ? '...' : ''),
        badge: e.category,
        meta: `${fmtDate(e.event_date)} · ${e.venue_name}`,
        image: e.image_url,
        actionText: isFree(e) ? 'Reserve Free Pass' : 'Book Pass',
        eventId: e.id
      }));
    } else {
      state.carouselSlides = [...DEFAULT_CAROUSEL_SLIDES];
    }
    initHeroCarousel();

    buildCategoryChips();
    renderEvents();
    renderCategoryOptions();
    refreshStaffViews();
  }

  /* ---------- Filters & Search ---------- */
  function renderHeroTags() {
    const host = clear($('#hero-tags'));
    if (!state.tags.length) return;
    host.append(el('span', { class: 'tag-label', text: 'Popular:' }), ...state.tags.map((t) =>
      el('button', { type: 'button', class: 'tag-btn', onclick: () => applyTag(t.name) }, t.name)));
  }
  function applyTag(name) {
    const isBrgy = state.barangays.some((b) => b.name === name);
    resetFilters(false);
    if (isBrgy) {
      state.filters.barangay = name;
      $('#f-barangay').value = name;
    } else {
      state.filters.search = name;
      $('#search-input').value = name;
      if ($('#discover-search-input')) $('#discover-search-input').value = name;
    }
    state.page = 1;
    renderEvents();
    location.hash = '#/events';
  }
  function fillBarangaySelects() {
    const names = state.barangays.map((b) => b.name);
    const f = $('#f-barangay'), cur = f.value;
    clear(f).append(el('option', { value: '' }, 'All barangays'), ...names.map((n) => el('option', { value: n }, n)));
    f.value = cur;
    const ef = $('#ef-barangay');
    clear(ef).append(el('option', { value: '' }, 'Select a barangay'), ...names.map((n) => el('option', { value: n }, n)));
  }
  function renderCategoryOptions() {
    const cats = [...new Set([...DEFAULT_CATEGORIES, ...state.events.map((e) => e.category)])].sort();
    clear($('#category-options')).append(...cats.map((c) => el('option', { value: c })));
  }
  function buildCategoryChips() {
    const cats = [...new Set(state.events.filter((e) => e.status === 'active').map((e) => e.category))].sort();
    const host = clear($('#category-chips'));
    ['All', ...cats].forEach((c) => host.append(el('button', {
      type: 'button', class: 'chip', 'aria-pressed': String(state.filters.category === c),
      onclick: () => { state.filters.category = c; state.page = 1; buildCategoryChips(); renderEvents(); }
    }, c === 'All' ? 'All Events' : c)));
  }
  function resetFilters(render = true) {
    state.filters = { search: '', category: 'All', barangay: '', price: '', date: '', sort: 'date', past: false };
    $('#search-input').value = '';
    if ($('#discover-search-input')) $('#discover-search-input').value = '';
    $('#f-barangay').value = ''; $('#f-price').value = ''; $('#f-date').value = ''; $('#f-sort').value = 'date'; $('#f-past').checked = false;
    state.page = 1; buildCategoryChips();
    if (render) renderEvents();
  }
  function filteredEvents() {
    const f = state.filters, q = f.search.trim().toLowerCase(), today = todayISO();
    const list = state.events.filter((e) => {
      if (e.status !== 'active') return false;
      if (!f.past && e.event_date < today) return false;
      if (f.category !== 'All' && e.category !== f.category) return false;
      if (f.barangay && e.barangay !== f.barangay) return false;
      if (f.price === 'free' && !isFree(e)) return false;
      if (f.price === 'paid' && isFree(e)) return false;
      if (f.date && e.event_date < f.date) return false;
      if (q && ![e.title, e.description, e.venue_name, e.barangay, e.category, e.organizer_name].join(' ').toLowerCase().includes(q)) return false;
      return true;
    });
    const sorters = {
      date: (a, b) => (a.event_date + a.event_time).localeCompare(b.event_date + b.event_time),
      'price-asc': (a, b) => num(a.price) - num(b.price),
      'price-desc': (a, b) => num(b.price) - num(a.price),
      slots: (a, b) => num(b.available_slots) - num(a.available_slots)
    };
    return list.sort(sorters[f.sort]);
  }
  const filtersActive = () => { const f = state.filters; return !!(f.search || f.category !== 'All' || f.barangay || f.price || f.date || f.past); };

  function bindFilters() {
    $('#hero-search').addEventListener('submit', (e) => {
      e.preventDefault();
      const val = $('#search-input').value;
      state.filters.search = val;
      if ($('#discover-search-input')) $('#discover-search-input').value = val;
      state.page = 1;
      renderEvents();
      location.hash = '#/events';
    });
    $('#search-input').addEventListener('input', debounce(() => {
      const val = $('#search-input').value;
      state.filters.search = val;
      if ($('#discover-search-input')) $('#discover-search-input').value = val;
      state.page = 1;
      renderEvents();
    }, 300));
    if ($('#discover-search-form')) {
      $('#discover-search-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const val = $('#discover-search-input').value;
        state.filters.search = val;
        $('#search-input').value = val;
        state.page = 1;
        renderEvents();
        $('#all-events-head').scrollIntoView({ behavior: 'smooth' });
      });
    }
    if ($('#discover-search-input')) {
      $('#discover-search-input').addEventListener('input', debounce(() => {
        const val = $('#discover-search-input').value;
        state.filters.search = val;
        $('#search-input').value = val;
        state.page = 1;
        renderEvents();
      }, 300));
    }
    const map = { 'f-barangay': 'barangay', 'f-price': 'price', 'f-date': 'date', 'f-sort': 'sort' };
    Object.entries(map).forEach(([id, key]) => $(`#${id}`).addEventListener('change', (e) => { state.filters[key] = e.target.value; state.page = 1; renderEvents(); }));
    $('#f-past').addEventListener('change', (e) => { state.filters.past = e.target.checked; state.page = 1; renderEvents(); });
    $('#f-reset').addEventListener('click', () => resetFilters());
    $('#filters').addEventListener('submit', (e) => e.preventDefault());
    $('#load-more').addEventListener('click', () => { state.page += 1; renderEvents(); });
  }

  /* =========================================================
     REDESIGNED EVENT CARD (SPACIOUS, UNCLUTTERED, ELEGANT)
     ========================================================= */
  function eventCard(ev) {
    const hid = `ev-title-${ev.id}`;
    const dateParts = parseDateParts(ev.event_date);
    const slots = num(ev.available_slots);

    // Subtle capacity status
    let capacityNode = null;
    if (isPast(ev)) {
      capacityNode = el('span', { class: 'capacity-status is-full' }, 'Event Concluded');
    } else if (slots <= 0) {
      capacityNode = el('span', { class: 'capacity-status is-full' }, 'Sold Out');
    } else if (slots <= 10) {
      capacityNode = el('span', { class: 'capacity-status is-warning' },
        el('span', { class: 'pulse-dot' }), `Only ${slots} slots left`);
    } else {
      capacityNode = el('span', { class: 'capacity-status is-available' },
        el('span', { class: 'pulse-dot' }), `${slots} slots available`);
    }

    const card = el('article', {
      class: 'card event-card',
      'aria-labelledby': hid,
      onclick: (e) => {
        // Prevent trigger if clicking an internal button specifically
        if (!e.target.closest('button')) openEventDetails(ev.id);
      }
    },
      // 1. Media Header with floating category pill and calendar tile
      el('div', { class: 'event-media' },
        bannerImg(ev),
        el('span', { class: 'card-category-badge', text: ev.category }),
        el('div', { class: 'card-date-tile', 'aria-label': fmtDate(ev.event_date) },
          el('span', { class: 'date-month', text: dateParts.month }),
          el('span', { class: 'date-day', text: dateParts.day })),
        num(ev.is_featured) ? el('span', { class: 'card-featured-tag' }, icon('star', 'icon-sm'), 'Featured') : null
      ),

      // 2. Event Body with Breathing Room & Uncluttered Layout
      el('div', { class: 'event-body' },
        el('div', { class: 'event-location-pill' },
          icon('pin', 'icon-sm'),
          el('span', { text: `Brgy. ${ev.barangay}` })),
        el('h3', { class: 'event-name', id: hid, text: ev.title }),
        
        // Clean highlight rows (Venue and Time)
        el('div', { class: 'event-highlights' },
          el('div', { class: 'highlight-row' },
            icon('pin', 'icon-sm'),
            el('span', { class: 'highlight-text', text: ev.venue_name })),
          el('div', { class: 'highlight-row' },
            icon('clock', 'icon-sm'),
            el('span', { class: 'highlight-text', text: fmtTime(ev.event_time) }))
        ),

        // Clean capacity indicator
        capacityNode,

        // 3. Pinned Bottom Footer Taking Advantage of Space
        el('div', { class: 'event-foot' },
          el('div', { class: 'price-lockup' },
            el('span', { class: 'price-label', text: 'Admission' }),
            el('span', { class: `price-val ${isFree(ev) ? 'is-free' : ''}`, text: peso(ev.price) })),
          el('button', {
            type: 'button',
            class: 'btn btn-primary btn-card-action',
            'aria-label': `View details and book ${ev.title}`,
            onclick: (e) => {
              e.stopPropagation();
              openEventDetails(ev.id);
            }
          }, canBook(ev) ? 'View & Book →' : 'View Details')
        )
      )
    );

    return card;
  }

  function emptyState(title, text, btn) {
    return el('div', { class: 'empty' }, icon('inbox'), el('h3', { class: 'h3', text: title }), el('p', { text }), btn);
  }

  function renderEvents() {
    const today = todayISO();
    let featured = state.events.filter((e) => e.status === 'active' && num(e.is_featured) && e.event_date >= today).slice(0, 3);
    if (!featured.length) {
      featured = state.events.filter((e) => e.status === 'active' && e.event_date >= today).slice(0, 3);
    }
    $('#featured-wrap').hidden = featured.length === 0;
    clear($('#featured-grid')).append(...featured.map(eventCard));

    const list = filteredEvents(), shown = list.slice(0, state.page * PAGE_SIZE), grid = clear($('#events-grid'));
    $('#results-count').textContent = state.eventsLoaded ? `${list.length} event${list.length === 1 ? '' : 's'} available` : '';
    if (state.eventsLoaded && !list.length) {
      grid.append(emptyState('No events match your criteria', 'Try clearing your search query or adjusting your filters to see more occasions.',
        el('button', { type: 'button', class: 'btn btn-primary', onclick: () => resetFilters() }, 'Reset All Filters')));
    } else {
      grid.append(...shown.map(eventCard));
    }
    $('#load-more').hidden = shown.length >= list.length;
  }

  /* ---------- Event Details Modal ---------- */
  function openEventDetails(id) {
    const ev = state.events.find((e) => e.id == id);
    if (!ev) return;
    $('#event-title').textContent = ev.title;
    const isStaff = ev.can_manage && state.user && ['organizer', 'admin'].includes(state.user.role);
    
    const aside = el('aside', { class: 'detail-aside', 'aria-label': 'Reservation details' },
      el('div', { class: 'price-lockup' },
        el('span', { class: 'price-label', text: 'Ticket Price' }),
        el('span', { class: `price-val ${isFree(ev) ? 'is-free' : ''}`, text: peso(ev.price) })),
      el('p', { class: 'muted', text: isFree(ev) ? 'Free public admission' : 'Per reserved pass' }),
      el('div', { class: 'stat-summary', style: 'margin-block: 8px;' },
        el('span', { class: 'badge badge-blue', text: `${ev.available_slots} of ${ev.total_slots} slots remaining` })),
      el('button', {
        type: 'button',
        class: 'btn btn-secondary btn-block',
        disabled: !canBook(ev),
        onclick: () => { $('#dlg-event').close(); openBooking(ev); }
      }, icon('ticket', 'icon-sm'), canBook(ev) ? 'Book Event Pass' : isPast(ev) ? 'Event Has Ended' : 'Fully Booked'),
      isStaff && el('button', {
        type: 'button',
        class: 'btn btn-outline btn-block',
        onclick: () => { $('#dlg-event').close(); openEventForm(ev); }
      }, icon('edit', 'icon-sm'), 'Edit Event'),
      isStaff && el('button', {
        type: 'button',
        class: 'btn btn-danger-outline btn-block',
        onclick: () => { $('#dlg-event').close(); deleteEvent(ev); }
      }, icon('trash', 'icon-sm'), 'Delete Event Listing')
    );

    clear($('#event-body')).append(
      el('div', { class: 'detail-media' }, bannerImg(ev)),
      el('div', { class: 'detail-grid' },
        el('div', { class: 'stack' },
          el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;' },
            el('span', { class: 'badge badge-blue', text: ev.category }),
            el('span', { class: 'badge badge-gold', text: `Brgy. ${ev.barangay}` })),
          el('ul', { class: 'meta-list', style: 'margin-block: 10px;' },
            el('li', {}, icon('calendar'), fmtDate(ev.event_date)),
            el('li', {}, icon('clock'), fmtTime(ev.event_time)),
            el('li', {}, icon('pin'), `${ev.venue_name}, ${ev.barangay}`),
            el('li', {}, icon('users'), `Organized by: ${ev.organizer_name}`)),
          el('h3', { class: 'h4', text: 'About This Event' }),
          el('p', { class: 'detail-desc', text: ev.description })
        ),
        aside
      )
    );
    $('#dlg-event').showModal();
  }

  /* ---------- Booking Pass Workflow ---------- */
  function openBooking(ev) {
    if (!canBook(ev)) return toast('This event is no longer accepting reservations.', { type: 'error' });
    const u = state.user, max = Math.min(10, num(ev.available_slots));
    let qty = 1;
    $('#book-title').textContent = 'Reserve Your Event Pass';
    const alertHost = el('div', { id: 'book-alert' });
    const name = el('input', { type: 'text', id: 'b-name', autocomplete: 'name', value: u?.name || '', required: true, placeholder: 'Your complete name' });
    const email = el('input', { type: 'email', id: 'b-email', autocomplete: 'email', value: u?.email || '', required: true, readonly: !!u, placeholder: 'name@domain.com' });
    const phone = el('input', { type: 'tel', id: 'b-phone', autocomplete: 'tel', value: u?.phone || '', placeholder: '0917 123 4567', required: true });
    const out = el('output', { id: 'b-qty', 'aria-live': 'polite', text: '1' });
    const total = el('span', { text: peso(ev.price) });
    const minus = el('button', { type: 'button', 'aria-label': 'Decrease tickets', disabled: true }, '−');
    const plus = el('button', { type: 'button', 'aria-label': 'Increase tickets', disabled: max <= 1 }, '+');
    const sync = () => { out.textContent = qty; total.textContent = peso(num(ev.price) * qty); minus.disabled = qty <= 1; plus.disabled = qty >= max; };
    minus.onclick = () => { qty = Math.max(1, qty - 1); sync(); };
    plus.onclick = () => { qty = Math.min(max, qty + 1); sync(); };

    const form = el('form', { novalidate: true },
      alertHost,
      !u && alertBox('info', 'Booking as Guest', 'Log in or create a citizen account if you want this pass to be saved directly to your account.', { dismissible: false }),
      el('div', { class: 'summary' },
        el('p', { class: 'h4', text: ev.title }),
        el('p', { class: 'muted', text: `${fmtDate(ev.event_date)} · ${fmtTime(ev.event_time)} · ${ev.venue_name}` })),
      el('div', { class: 'field' }, el('label', { for: 'b-name' }, 'Full name of primary attendee'), name),
      el('div', { class: 'field' }, el('label', { for: 'b-email' }, 'Confirmation email address'), email),
      el('div', { class: 'field' }, el('label', { for: 'b-phone' }, 'Contact mobile number'), phone),
      el('div', { class: 'field' }, el('span', { class: 'label', id: 'b-qty-label' }, `Number of tickets (maximum ${max})`),
        el('div', { class: 'stepper', role: 'group', 'aria-labelledby': 'b-qty-label' }, minus, out, plus)),
      el('div', { class: 'summary' }, el('div', { class: 'summary-row total' }, el('span', { text: 'Total Amount' }), total)),
      el('div', { class: 'form-actions' },
        el('button', { type: 'button', class: 'btn btn-ghost', 'data-close': '' }, 'Cancel'),
        el('button', { type: 'submit', class: 'btn btn-secondary' }, icon('check', 'icon-sm'), 'Confirm Reservation')));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!applyRules(form, [
        [name, name.value.trim().length >= 3 ? '' : 'Enter your full first and last name.'],
        [email, emailOk(email.value.trim()) ? '' : 'Enter a valid email address.'],
        [phone, phone.value.replace(/\D/g, '').length >= 7 ? '' : 'Enter a valid mobile contact number.']
      ])) return;
      const res = await withLoading($('button[type=submit]', form), () => api('book_event', { body: {
        event_id: ev.id, attendee_name: name.value.trim(), attendee_email: email.value.trim(), attendee_phone: phone.value.trim(), tickets_count: qty
      } }));
      if (!res.ok) return showApiError(alertHost, res);
      toast(res.message, { type: 'success', duration: 6000 });
      renderPass(res.data, 'Reservation Confirmed!');
      loadEvents();
    });
    clear($('#book-body')).append(form);
    $('#dlg-book').showModal();
    name.focus();
  }

  function codeSvg(text) {
    const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
    let x = 0;
    for (const ch of text) {
      for (let i = 5; i >= 0; i--) {
        const w = (ch.charCodeAt(0) >> i) & 1 ? 3 : 1;
        if ((x + i) % 2 === 0 || w === 3) { const r = document.createElementNS(ns, 'rect'); r.setAttribute('x', x); r.setAttribute('width', w); r.setAttribute('height', 56); r.setAttribute('fill', 'currentColor'); svg.append(r); }
        x += w + 1;
      }
    }
    svg.setAttribute('viewBox', `0 0 ${x} 56`); svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('class', 'code'); svg.setAttribute('aria-hidden', 'true');
    return svg;
  }

  function renderPass(p, heading) {
    $('#book-title').textContent = heading;
    const row = (k, v) => [el('dt', { text: k }), el('dd', { text: v })];
    clear($('#book-body')).append(
      alertBox('success', heading, 'Present this digital pass reference at the venue entrance.', { dismissible: false }),
      el('div', { class: 'pass' },
        el('p', { class: 'badge badge-blue', text: 'Iligan City Official Pass' }),
        el('p', { class: 'pass-ref', text: p.booking_reference }),
        codeSvg(p.booking_reference),
        el('p', { class: 'h4', text: p.event_title }),
        el('dl', {}, row('Attendee', p.attendee_name), row('Date', p.event_date), row('Time', p.event_time),
          row('Venue', `${p.venue_name}, ${p.barangay}`), row('Passes', String(p.tickets_count)), row('Total', peso(num(p.price) * num(p.tickets_count))))),
      el('div', { class: 'form-actions' },
        el('button', { type: 'button', class: 'btn btn-ghost', 'data-close': '' }, 'Done'),
        state.user && el('a', { class: 'btn btn-primary', href: '#/bookings', onclick: () => $('#dlg-book').close() }, 'View My Bookings')));
    if (!$('#dlg-book').open) $('#dlg-book').showModal();
  }

  /* ---------- My Bookings View ---------- */
  async function loadBookings() {
    const host = clear($('#bookings-list'));
    clearAlert('#bookings-alert');
    host.append(el('div', { class: 'skeleton', 'aria-hidden': 'true', style: 'min-height:120px' }));
    const res = await api('get_bookings', { params: { email: state.user.email } });
    if (!res.ok) { clear(host); return showApiError('#bookings-alert', res); }
    state.bookings = res.data;
    renderBookings();
  }
  function renderBookings() {
    const host = clear($('#bookings-list'));
    if (!state.bookings.length) {
      return host.append(emptyState('No Bookings Found', 'You have not reserved passes for upcoming events yet.', el('a', { class: 'btn btn-primary', href: '#/events' }, 'Discover Events')));
    }
    state.bookings.forEach((b) => {
      const isCancelled = b.status === 'cancelled';
      host.append(el('article', { class: `card booking-card ${isCancelled ? 'is-cancelled' : ''}`, 'aria-label': `Booking ${b.booking_reference}` },
        el('div', { class: 'booking-main' },
          el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;align-items:center' },
            el('span', { class: `badge ${isCancelled ? 'badge-red' : 'badge-green'}`, text: isCancelled ? 'Cancelled' : 'Confirmed Active' }),
            el('span', { class: 'ref-chip', text: b.booking_reference })),
          el('h2', { class: 'h4 event-name', text: b.event_title }),
          el('ul', { class: 'meta-list' },
            el('li', {}, icon('calendar'), `${fmtDate(b.event_date)} · ${fmtTime(b.event_time)}`),
            el('li', {}, icon('pin'), `${b.venue_name}, ${b.barangay}`),
            el('li', {}, icon('ticket'), `${b.tickets_count} ticket${b.tickets_count > 1 ? 's' : ''} · ${peso(num(b.price) * num(b.tickets_count))}`))),
        el('div', { class: 'event-actions' },
          isCancelled
            ? el('button', { type: 'button', class: 'btn btn-outline', onclick: () => restoreBooking(b.booking_reference) }, 'Restore Booking')
            : [el('button', { type: 'button', class: 'btn btn-primary', onclick: () => renderPass({ ...b, event_date: fmtDate(b.event_date), event_time: fmtTime(b.event_time) }, 'Digital Pass') }, 'View Pass'),
               el('button', { type: 'button', class: 'btn btn-danger-outline', onclick: () => cancelBooking(b) }, 'Cancel Booking')])));
    });
  }
  async function cancelBooking(b) {
    const yes = await confirmAction({
      title: 'Cancel this reservation?',
      message: `Your ${b.tickets_count} reserved pass${b.tickets_count > 1 ? 'es' : ''} for "${b.event_title}" will be released back to the community. You can undo this right after.`,
      confirmLabel: 'Cancel Booking', cancelLabel: 'Keep Booking'
    });
    if (!yes) return;
    const res = await api('cancel_booking', { body: { booking_reference: b.booking_reference } });
    if (!res.ok) return showApiError('#bookings-alert', res);
    toast(res.message, { type: 'success', duration: 8000, actionLabel: 'Undo', onAction: () => restoreBooking(b.booking_reference) });
    await loadBookings(); loadEvents();
  }
  async function restoreBooking(ref) {
    const res = await api('restore_booking', { body: { booking_reference: ref } });
    if (!res.ok) return showApiError('#bookings-alert', res);
    toast(res.message, { type: 'success' });
    await loadBookings(); loadEvents();
  }

  /* ---------- Coordinator & Admin Dashboards ---------- */
  const statCard = (value, label) => el('div', { class: 'stat' }, el('span', { class: 'stat-value', text: value }), el('span', { class: 'stat-label', text: label }));
  function renderStats(host, events) {
    const today = todayISO();
    const booked = events.reduce((s, e) => s + seatsTaken(e), 0);
    const revenue = events.reduce((s, e) => s + seatsTaken(e) * num(e.price), 0);
    clear(host).append(
      statCard(events.length, 'Total Events Listed'),
      statCard(events.filter((e) => e.status === 'active' && e.event_date >= today).length, 'Upcoming Active Events'),
      statCard(booked, 'Reserved Passes Issued'),
      statCard(peso(revenue) === 'FREE' ? '₱0.00' : peso(revenue), 'Total Bookings Value')
    );
  }

  function eventsTable(host, events, { caption, showCoordinator = false }) {
    clear(host);
    if (!events.length) {
      return host.append(emptyState('No Events Yet', 'Create your first event listing to see management controls here.', el('button', { type: 'button', class: 'btn btn-primary', 'data-new-event': '' }, 'Add New Event')));
    }
    const head = ['Event Title', 'Date & Time', 'Barangay', showCoordinator && 'Coordinator', 'Seats Reserved', 'Price', 'Status', 'Actions'].filter(Boolean);
    const rows = events.map((ev) => {
      const btn = (label, ic, fn, cls = 'btn-outline') => el('button', { type: 'button', class: `btn btn-sm ${cls}`, 'aria-label': `${label}: ${ev.title}`, onclick: fn }, icon(ic, 'icon-sm'), label);
      return el('tr', {},
        el('td', { class: 'td-title' }, ev.title, num(ev.is_featured) ? el('span', { class: 'badge badge-gold', style: 'margin-left:8px;' }, 'Featured') : null),
        el('td', { text: `${fmtDate(ev.event_date)} ${fmtTime(ev.event_time)}` }),
        el('td', { text: ev.barangay }),
        showCoordinator && el('td', { text: ev.coordinator_author_name || ev.organizer_name }),
        el('td', { text: `${seatsTaken(ev)} / ${ev.total_slots}` }),
        el('td', { text: peso(ev.price) }),
        el('td', {}, el('span', { class: `badge ${ev.status === 'active' ? (isPast(ev) ? 'badge-gray' : 'badge-green') : 'badge-red'}`, text: ev.status === 'active' && isPast(ev) ? 'Concluded' : ev.status })),
        el('td', {}, el('div', { class: 'td-actions' },
          btn('Attendees', 'users', () => openAttendees(ev)),
          btn('Edit', 'edit', () => openEventForm(ev)),
          btn(num(ev.is_featured) ? 'Unfeature' : 'Feature', 'star', () => toggleFeatured(ev)),
          btn('Delete', 'trash', () => deleteEvent(ev), 'btn-danger-outline'))));
    });
    host.append(el('div', { class: 'table-card' }, el('div', { class: 'table-scroll' },
      el('table', { class: 'data' }, el('caption', { text: caption }),
        el('thead', {}, el('tr', {}, head.map((h) => el('th', { scope: 'col', text: h })))), el('tbody', {}, rows)))));
  }

  function refreshStaffViews() {
    if (!state.user) return;
    const mine = state.events.filter((e) => e.can_manage);
    if (state.user.role === 'organizer') { renderStats($('#dashboard-stats'), mine); eventsTable($('#dashboard-table'), mine, { caption: 'Your Managed Events' }); }
    if (state.user.role === 'admin') { renderStats($('#admin-stats'), state.events); eventsTable($('#admin-table'), state.events, { caption: 'Citywide Portal Events Directory', showCoordinator: true }); }
  }

  async function toggleFeatured(ev) {
    const next = num(ev.is_featured) ? 0 : 1;
    const res = await api('toggle_featured', { body: { id: ev.id, is_featured: next } });
    res.ok ? toast(res.message, { type: 'success' }) : toast(res.message, { type: 'error' });
    if (res.ok) await loadEvents();
  }

  async function deleteEvent(ev) {
    const yes = await confirmAction({
      title: 'Permanently remove event?',
      message: `"${ev.title}" and all related booking passes will be permanently removed from Iligan City portal.`,
      confirmLabel: 'Delete Event', cancelLabel: 'Keep Event', requireText: 'DELETE'
    });
    if (!yes) return;
    const res = await api('delete_event', { body: { id: ev.id, confirmation_text: 'DELETE' } });
    if (!res.ok) return toast(`${res.message} ${res.tip}`.trim(), { type: 'error', duration: 8000 });
    toast(res.message, { type: 'success' });
    await loadEvents();
  }

  async function openAttendees(ev) {
    $('#att-title').textContent = `Attendees List · ${ev.title}`;
    const body = clear($('#att-body')).appendChild(el('p', { class: 'muted', text: 'Loading attendee records...' }));
    $('#dlg-attendees').showModal();
    const res = await api('get_bookings', { params: { event_id: ev.id } });
    const host = clear($('#att-body'));
    if (!res.ok) return host.append(alertBox('error', res.message, res.tip, { dismissible: false }));
    if (!res.data.length) return host.append(emptyState('No Reservations Yet', 'Registered attendees will appear here once citizens reserve passes.'));
    const confirmed = res.data.filter((b) => b.status === 'confirmed').reduce((s, b) => s + num(b.tickets_count), 0);
    host.append(el('p', { class: 'muted', style: 'margin-bottom:16px', text: `${confirmed} confirmed passes across ${res.data.length} registered reservations.` }),
      el('div', { class: 'table-scroll' }, el('table', { class: 'data' },
        el('thead', {}, el('tr', {}, ['Reference', 'Attendee Name', 'Contact Info', 'Tickets', 'Status'].map((h) => el('th', { scope: 'col', text: h })))),
        el('tbody', {}, res.data.map((b) => el('tr', {},
          el('td', { class: 'ref-chip', text: b.booking_reference }), el('td', { text: b.attendee_name }),
          el('td', { text: `${b.attendee_email} · ${b.attendee_phone}` }), el('td', { text: b.tickets_count }),
          el('td', {}, el('span', { class: `badge ${b.status === 'confirmed' ? 'badge-green' : 'badge-red'}`, text: b.status }))))))));
  }

  /* ---------- Event Creation & Editing Form ---------- */
  function openEventForm(ev = null) {
    const form = $('#event-form');
    form.reset(); clearAlert('#ef-alert'); clear($('#ef-dup'));
    $$('input,select,textarea', form).forEach(clearFieldError);
    $('#ef-date').min = ev ? '' : todayISO();
    $('#ef-title').textContent = ev ? 'Edit Event Listing' : 'Publish New Community Event';
    $('#ef-submit').textContent = ev ? 'Save Changes' : 'Publish Event';
    $('#ef-id').value = ev ? ev.id : '';
    $('#ef-preview').hidden = true;
    if (ev) {
      if (ev.barangay && !state.barangays.some((b) => b.name === ev.barangay)) $('#ef-barangay').append(el('option', { value: ev.barangay }, ev.barangay));
      Object.entries({
        'ef-title-input': ev.title, 'ef-description': ev.description, 'ef-category': ev.category, 'ef-barangay': ev.barangay, 'ef-venue': ev.venue_name,
        'ef-date': ev.event_date, 'ef-time': String(ev.event_time).slice(0, 5), 'ef-price': ev.price, 'ef-slots': ev.total_slots,
        'ef-organizer': ev.organizer_name, 'ef-image': ev.image_url || ''
      }).forEach(([id, v]) => { $(`#${id}`).value = v; });
      $('#ef-featured').checked = !!num(ev.is_featured);
      updatePreview();
    } else {
      $('#ef-organizer').value = state.user?.name || '';
    }
    $('#dlg-event-form').showModal();
    $('#ef-title-input').focus();
  }
  function updatePreview() {
    const src = $('#ef-image').value.trim(), img = $('#ef-preview');
    if (!src) { img.hidden = true; return; }
    img.onerror = () => { img.hidden = true; };
    img.onload = () => { img.hidden = false; };
    img.src = src;
  }
  async function checkDuplicateTitle() {
    const title = $('#ef-title-input').value.trim(), host = clear($('#ef-dup'));
    if (title.length < 5) return;
    const res = await api('check_event_exists', { params: { title } });
    const found = res.ok && res.data?.exists && String(res.data.event.id) !== $('#ef-id').value;
    if (found) host.append(alertBox('warning', 'Notice: Duplicate Event Title', res.data.warning, { dismissible: false }));
  }
  function bindEventForm() {
    document.addEventListener('click', (e) => { if (e.target.closest('[data-new-event]')) openEventForm(); });
    $('#ef-title-input').addEventListener('input', debounce(checkDuplicateTitle, 500));
    $('#ef-image').addEventListener('input', debounce(updatePreview, 400));
    $('#event-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = e.currentTarget, g = (id) => $(`#${id}`), editing = !!g('ef-id').value;
      const price = Number(g('ef-price').value), slots = Number(g('ef-slots').value);
      if (!applyRules(f, [
        [g('ef-title-input'), g('ef-title-input').value.trim().length >= 5 ? '' : 'Use a descriptive title (at least 5 characters).'],
        [g('ef-description'), g('ef-description').value.trim().length >= 15 ? '' : 'Describe the event in at least 15 characters.'],
        [g('ef-category'), g('ef-category').value.trim() ? '' : 'Choose or type a category.'],
        [g('ef-barangay'), g('ef-barangay').value ? '' : 'Select the barangay where the event happens.'],
        [g('ef-venue'), g('ef-venue').value.trim() ? '' : 'Enter the venue or landmark.'],
        [g('ef-date'), !g('ef-date').value ? 'Select the event date.' : (!editing && g('ef-date').value < todayISO() ? 'The date cannot be in the past.' : '')],
        [g('ef-time'), g('ef-time').value ? '' : 'Set the start time.'],
        [g('ef-price'), g('ef-price').value !== '' && price >= 0 ? '' : 'Enter 0 for free events, or a positive amount.'],
        [g('ef-slots'), Number.isInteger(slots) && slots >= 1 ? '' : 'Seats must be a whole number of at least 1.']
      ])) return;
      const body = {
        id: g('ef-id').value || undefined, title: g('ef-title-input').value.trim(), description: g('ef-description').value.trim(),
        category: g('ef-category').value.trim(), barangay: g('ef-barangay').value, venue_name: g('ef-venue').value.trim(),
        event_date: g('ef-date').value, event_time: g('ef-time').value, price, total_slots: slots,
        organizer_name: g('ef-organizer').value.trim(), image_url: g('ef-image').value.trim(), is_featured: g('ef-featured').checked ? 1 : 0
      };
      const res = await withLoading(g('ef-submit'), () => api(editing ? 'update_event' : 'create_event', { body }));
      if (!res.ok) {
        showApiError('#ef-alert', res);
        $('#dlg-event-form .modal-body').scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      $('#dlg-event-form').close();
      toast(res.message, { type: 'success', duration: 6000 });
      await loadEvents();
    });
  }

  /* ---------- Admin Console ---------- */
  function renderPills(hostSel, items, onDelete, label) {
    const host = clear($(hostSel));
    if (!items.length) return host.append(el('li', { class: 'muted', text: `No ${label} configured yet.` }));
    items.forEach((it) => host.append(el('li', { class: 'pill' }, it.name,
      el('button', { type: 'button', class: 'icon-btn', 'aria-label': `Remove ${it.name}`, onclick: () => onDelete(it) }, icon('trash', 'icon-sm')))));
  }
  function renderAdminLists() {
    renderPills('#barangay-list', state.barangays, deleteBarangay, 'barangays');
    renderPills('#tag-list', state.tags, deleteTag, 'tags');
    $('#c-title').value = state.settings.hero_title || '';
    $('#c-subtitle').value = state.settings.hero_subtitle || '';
    $('#c-image').value = state.settings.hero_bg_image || '';
  }
  async function deleteBarangay(b) {
    const yes = await confirmAction({ title: `Remove ${b.name}?`, message: 'Existing events keep their location, but this barangay will no longer be offered for new events.', confirmLabel: 'Remove Barangay' });
    if (!yes) return;
    const res = await api('delete_barangay', { body: { id: b.id } });
    if (!res.ok) return showApiError('#admin-alert', res);
    state.barangays = res.data.barangays; fillBarangaySelects(); renderAdminLists(); toast(res.message, { type: 'success' });
  }
  async function deleteTag(t) {
    const res = await api('delete_hero_tag', { body: { id: t.id } });
    if (!res.ok) return showApiError('#admin-alert', res);
    state.tags = res.data.tags; renderHeroTags(); renderAdminLists(); toast(res.message, { type: 'success' });
  }
  function bindAdmin() {
    const panels = { events: '#panel-events', content: '#panel-content', barangays: '#panel-barangays', tags: '#panel-tags' };
    initTabs($('#view-admin .tabs'), (tab) => Object.entries(panels).forEach(([k, sel]) => { $(sel).hidden = k !== tab.dataset.tab; }));

    $('#content-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const img = $('#c-image').value.trim();
      const res = await withLoading($('button[type=submit]', e.currentTarget), () => api('update_settings', { body: { hero_title: $('#c-title').value.trim(), hero_subtitle: $('#c-subtitle').value.trim(), hero_bg_image: img, hero_banner_image: img } }));
      if (!res.ok) return showApiError('#admin-alert', res);
      state.settings = res.data; toast(res.message, { type: 'success' });
    });
    $('#barangay-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = $('#new-barangay');
      if (!applyRules(e.currentTarget, [[input, input.value.trim().length >= 2 ? '' : 'Enter at least 2 characters.']])) return;
      const res = await api('add_barangay', { body: { name: input.value.trim() } });
      if (!res.ok) return showApiError('#admin-alert', res);
      state.barangays = res.data.barangays; input.value = ''; fillBarangaySelects(); renderAdminLists(); toast(res.message, { type: 'success' });
    });
    $('#tag-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = $('#new-tag');
      if (!applyRules(e.currentTarget, [[input, input.value.trim().length >= 2 ? '' : 'Enter at least 2 characters.']])) return;
      const res = await api('add_hero_tag', { body: { name: input.value.trim() } });
      if (!res.ok) return showApiError('#admin-alert', res);
      state.tags = res.data.tags; input.value = ''; renderHeroTags(); renderAdminLists(); toast(res.message, { type: 'success' });
    });
  }

  /* ---------- Contact Form ---------- */
  function bindContact() {
    const form = $('#contact-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = $('#cf-name'), email = $('#cf-email'), topic = $('#cf-topic'), msg = $('#cf-message');
      if (!applyRules(form, [
        [name, name.value.trim().length >= 3 ? '' : 'Enter your full name (at least 3 characters).'],
        [email, emailOk(email.value.trim()) ? '' : 'Enter a valid email address.'],
        [topic, topic.value ? '' : 'Select an inquiry topic.'],
        [msg, msg.value.trim().length >= 10 ? '' : 'Please enter a message of at least 10 characters.']
      ])) return;
      await withLoading($('button[type=submit]', form), () => new Promise((r) => setTimeout(r, 350)));
      const sender = name.value.trim();
      const chosenTopic = topic.value;
      form.reset();
      showAlert('#contact-alert', 'success', 'Inquiry Sent to Iligan Tourism & Events Desk', `Thank you, ${sender}! Your message regarding "${chosenTopic}" has been logged. Our desk will reply within 1 business day.`);
      toast('Your message has been sent to the Iligan Tourism Desk.', { type: 'success' });
    });
  }

  /* =========================================================
     CS-NAVIGATION CONTROLLER (Adapted from Navigation.js)
     ========================================================= */
  let closeMobileMenuFn = () => {};

  function initCsNavigation() {
    const CONFIG = {
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
      body: document.querySelector(CONFIG.SELECTORS.body),
      navigation: document.querySelector(CONFIG.SELECTORS.navigation),
      hamburger: document.querySelector(CONFIG.SELECTORS.hamburger),
      menuWrapper: document.querySelector(CONFIG.SELECTORS.menuWrapper),
    };

    const isMobile = () => window.matchMedia(`(max-width: ${CONFIG.BREAKPOINTS.MOBILE}px)`).matches;

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
      const toggle = dropdown.querySelector(CONFIG.SELECTORS.dropdownToggle);
      const menu = dropdown.querySelector(CONFIG.SELECTORS.dropdownMenu);
      const isCurrentlyActive = dropdown.classList.contains(CONFIG.CLASSES.active);
      const shouldActivate = forceClose ? false : !isCurrentlyActive;

      dropdown.classList.toggle(CONFIG.CLASSES.active, shouldActivate);
      if (toggle) toggle.setAttribute('aria-expanded', shouldActivate.toString());
      if (menu) setInertState(menu, !shouldActivate);
      return shouldActivate;
    };

    const closeAllDropdowns = () => {
      if (!elements.navigation) return;
      elements.navigation.querySelectorAll(`${CONFIG.SELECTORS.dropdown}.${CONFIG.CLASSES.active}`).forEach((dropdown) => {
        toggleDropdown(dropdown, true);
      });
    };

    const toggleMobileMenu = (forceClose = false) => {
      if (!elements.hamburger || !elements.navigation || !elements.body) return;
      const isCurrentlyOpen = elements.navigation.classList.contains(CONFIG.CLASSES.active);
      const shouldOpen = forceClose ? false : !isCurrentlyOpen;

      elements.hamburger.classList.toggle(CONFIG.CLASSES.active, shouldOpen);
      elements.navigation.classList.toggle(CONFIG.CLASSES.active, shouldOpen);
      elements.body.classList.toggle(CONFIG.CLASSES.menuOpen, shouldOpen);
      toggleAriaExpanded(elements.hamburger, shouldOpen);

      if (elements.menuWrapper && isMobile()) {
        setInertState(elements.menuWrapper, !shouldOpen);
      }
      if (!shouldOpen) closeAllDropdowns();
    };

    closeMobileMenuFn = () => {
      closeAllDropdowns();
      if (elements.navigation?.classList.contains(CONFIG.CLASSES.active)) {
        toggleMobileMenu(true);
      }
    };

    const updateInertStates = () => {
      if (!elements.menuWrapper) return;
      if (isMobile()) {
        const isMenuOpen = elements.navigation?.classList.contains(CONFIG.CLASSES.active);
        setInertState(elements.menuWrapper, !isMenuOpen);
      } else {
        setInertState(elements.menuWrapper, false);
        if (elements.navigation?.classList.contains(CONFIG.CLASSES.active)) {
          toggleMobileMenu(true);
        }
      }
      if (elements.navigation) {
        elements.navigation.querySelectorAll(CONFIG.SELECTORS.dropdown).forEach((dropdown) => {
          const isOpen = dropdown.classList.contains(CONFIG.CLASSES.active);
          const dropdownMenu = dropdown.querySelector(CONFIG.SELECTORS.dropdownMenu);
          if (dropdownMenu) setInertState(dropdownMenu, !isOpen);
        });
      }
    };

    if (elements.hamburger) {
      elements.hamburger.addEventListener('click', () => toggleMobileMenu());
    }

    if (elements.navigation) {
      elements.navigation.addEventListener('click', (event) => {
        const dropdownToggle = event.target.closest(CONFIG.SELECTORS.dropdownToggle);
        if (dropdownToggle) {
          event.preventDefault();
          const dropdown = dropdownToggle.closest(CONFIG.SELECTORS.dropdown);
          if (dropdown) toggleDropdown(dropdown);
          return;
        }
        // Close mobile menu & dropdowns when a navigation link is clicked
        if (event.target.closest('a[data-route]')) {
          closeMobileMenuFn();
        }
      });

      elements.navigation.querySelectorAll(CONFIG.SELECTORS.dropdown).forEach((dropdown) => {
        let hoverTimeout;
        dropdown.addEventListener('mouseenter', () => {
          if (!isMobile()) {
            clearTimeout(hoverTimeout);
            const dropdownMenu = dropdown.querySelector(CONFIG.SELECTORS.dropdownMenu);
            if (dropdownMenu) setInertState(dropdownMenu, false);
          }
        });
        dropdown.addEventListener('mouseleave', () => {
          if (!isMobile() && !dropdown.classList.contains(CONFIG.CLASSES.active)) {
            hoverTimeout = setTimeout(() => {
              const dropdownMenu = dropdown.querySelector(CONFIG.SELECTORS.dropdownMenu);
              if (dropdownMenu) setInertState(dropdownMenu, true);
            }, 300);
          }
        });
        dropdown.addEventListener('focusout', (event) => {
          setTimeout(() => {
            if (!dropdown.contains(document.activeElement) && dropdown.classList.contains(CONFIG.CLASSES.active)) {
              toggleDropdown(dropdown, true);
            }
          }, 10);
        });
      });
    }

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const activeDropdown = elements.navigation?.querySelector(`${CONFIG.SELECTORS.dropdown}.${CONFIG.CLASSES.active}`);
      if (activeDropdown) {
        const toggle = activeDropdown.querySelector(CONFIG.SELECTORS.dropdownToggle);
        toggleDropdown(activeDropdown, true);
        toggle?.focus();
        return;
      }
      if (elements.navigation?.classList.contains(CONFIG.CLASSES.active)) {
        toggleMobileMenu(true);
        elements.hamburger?.focus();
      }
    });

    if (elements.navigation) {
      elements.navigation.addEventListener('focusout', () => {
        if (!isMobile() || !elements.navigation.classList.contains(CONFIG.CLASSES.active)) return;
        setTimeout(() => {
          if (document.activeElement && !elements.navigation.contains(document.activeElement)) {
            toggleMobileMenu(true);
          }
        }, 10);
      });
    }

    window.addEventListener('scroll', () => {
      const isScrolled = document.documentElement.scrollTop >= CONFIG.SCROLL_THRESHOLD;
      elements.body?.classList.toggle(CONFIG.CLASSES.scrolled, isScrolled);
    }, { passive: true });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateInertStates, 100);
    });

    updateInertStates();
  }

  /* ---------- Global Nav & Routing ---------- */
  function bindGlobal() {
    document.addEventListener('click', (e) => {
      const close = e.target.closest('[data-close]');
      if (close) close.closest('dialog').close();
      const auth = e.target.closest('[data-open-auth]');
      if (auth) {
        closeMobileMenuFn();
        openAuth(auth.dataset.openAuth);
      }
    });
    ['#dlg-event', '#dlg-attendees'].forEach((sel) => $(sel).addEventListener('click', (e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }));
  }

  let firstRoute = true;
  function route() {
    const name = (location.hash.replace(/^#\/?/, '') || 'home').split('?')[0];
    const def = ROUTES[name];
    if (!def) { location.replace('#/home'); return; }
    if (def.roles && !(state.user && def.roles.includes(state.user.role))) {
      location.replace('#/home');
      state.user ? toast('You do not have permission to view that section.', { type: 'error' }) : openAuth('login', 'Please sign in to access that portal section.');
      return;
    }
    $$('.view').forEach((v) => { v.hidden = v.id !== `view-${name}`; });
    $$('[data-route]').forEach((a) => {
      const on = a.dataset.route === name;
      a.classList.toggle('cs-active', on);
      on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
    });
    const portalBtn = $('#cs-portal-dropdown-btn');
    if (portalBtn) {
      const isPortalRoute = ['bookings', 'dashboard', 'admin'].includes(name);
      portalBtn.classList.toggle('cs-active', isPortalRoute);
    }
    closeMobileMenuFn();
    document.title = `${def.title} | Iligan Community Event Portal`;
    if (!firstRoute) { window.scrollTo(0, 0); $('#main').focus({ preventScroll: true }); }
    firstRoute = false;
    if (name === 'bookings') loadBookings();
    if (name === 'dashboard' || name === 'admin') refreshStaffViews();
    if (name === 'admin') renderAdminLists();
  }

  /* ---------- App Initialization ---------- */
  async function init() {
    loadUser();
    applyAuthUI();
    initCsNavigation();
    initHeroCarousel();
    bindGlobal(); bindAuth(); bindProfile(); bindFilters(); bindEventForm(); bindAdmin(); bindContact();
    window.addEventListener('hashchange', route);
    route();
    await Promise.all([loadMeta(), loadEvents()]);
    if (location.hash.includes('admin')) renderAdminLists();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
