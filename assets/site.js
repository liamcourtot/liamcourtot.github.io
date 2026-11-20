/* Liam Courtot · shared behaviour. No dependencies, no cookies. */
(function () {
  'use strict';
  var C = window.LIAM || {};
  var page = document.body.getAttribute('data-page') || 'hub';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function lang() { return document.documentElement.lang === 'es' ? 'es' : 'en'; }

  function toast(msg) {
    var t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(function () { t.hidden = true; }, 2400);
  }

  /* language toggle (hub and studio) */
  var langBtn = $('#lang');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      var next = lang() === 'es' ? 'en' : 'es';
      document.documentElement.lang = next;
      try { localStorage.setItem('lang', next); } catch (e) {}
      paintLang();
    });
  }
  function paintLang() {
    if (langBtn) langBtn.textContent = lang() === 'es' ? 'English' : 'Español';
    var t = document.body.getAttribute('data-title-' + lang());
    if (t) document.title = t;
    wireMessages();
  }

  /* who scanned: ?for=vin48 → "Vin48" */
  function placeName() {
    var m = /[?&]for=([^&#]+)/.exec(location.search);
    if (!m) return '';
    var raw = '';
    try { raw = decodeURIComponent(m[1]); } catch (e) { return ''; }
    raw = raw.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
    var known = (C.places || {})[raw];
    if (known) return known;
    if (raw.length < 3 || raw.length > 30) return '';
    return raw.split('-').map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');
  }
  var place = placeName();
  var greet = $('#greet');
  if (greet && place) { $('#greet-place').textContent = place; greet.hidden = false; }

  /* message links: SMS when there is a US number, WhatsApp otherwise */
  var digitsUS = String(C.phoneUS || '').replace(/[^\d+]/g, '');
  function waText() {
    if (page === 'work') return 'Hi Liam, ' + (place ? 'this is ' + place + '. ' : '') + 'I saw your resume.';
    if (page === 'studio') return lang() === 'es' ? 'Hola Liam, vi la página de The Obhivion Studio.' : 'Hi Liam, I saw The Obhivion Studio page.';
    return lang() === 'es' ? 'Hola Liam, nos conocimos hace un rato.' : 'Hi Liam, we just met.';
  }
  function wireMessages() {
    $$('[data-msg]').forEach(function (a) {
      var useSms = page === 'work' && digitsUS;
      a.href = useSms ? 'sms:' + digitsUS + '?&body=' + encodeURIComponent(waText())
        : (C.whatsapp ? 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(waText()) : 'mailto:' + (C.email || ''));
      if (!useSms) { a.target = '_blank'; a.rel = 'noopener'; }
    });
  }
  wireMessages();

  /* email: assembled here so the plain address is not in the HTML */
  $$('[data-email]').forEach(function (el) {
    if (!C.email) { el.hidden = true; return; }
    if (el.tagName === 'A') el.href = 'mailto:' + C.email;
    var t = el.querySelector('[data-email-text]') || (el.hasAttribute('data-email-text') ? el : null);
    if (t) t.textContent = C.email;
  });
  $$('[data-copy-email]').forEach(function (b) {
    if (!C.email) { b.hidden = true; return; }
    b.addEventListener('click', function () {
      var ok = function () { toast(lang() === 'es' ? 'Mail copiado' : 'Email copied'); };
      try { navigator.clipboard.writeText(C.email).then(ok, function () { location.href = 'mailto:' + C.email; }); }
      catch (e) { location.href = 'mailto:' + C.email; }
    });
  });

  /* WhatsApp number shown as text */
  $$('[data-wa-text]').forEach(function (el) {
    var d = String(C.whatsapp || '');
    if (!d) { el.closest('[data-if]') ? el.closest('[data-if]').hidden = true : el.hidden = true; return; }
    el.textContent = d.length === 13 ? '+' + d.slice(0, 2) + ' ' + d.slice(2, 3) + ' ' + d.slice(3, 6) + ' ' + d.slice(6, 9) + ' ' + d.slice(9) : '+' + d;
  });

  /* optional rows: only show what is configured */
  var links = {
    instagram: C.instagram ? 'https://instagram.com/' + C.instagram : '',
    instagramStudio: C.instagramStudio ? 'https://instagram.com/' + C.instagramStudio : '',
    linkedin: C.linkedin || ''
  };
  $$('[data-if]').forEach(function (el) {
    var k = el.getAttribute('data-if');
    var v = links[k] !== undefined ? links[k] : C[k];
    var has = Array.isArray(v) ? v.length > 0 : !!v;
    el.hidden = !has;
    if (has && links[k] !== undefined && el.tagName === 'A') { el.href = links[k]; el.target = '_blank'; el.rel = 'noopener'; }
    if (has && k === 'instagram') { var h = el.querySelector('[data-handle]'); if (h) h.textContent = '@' + C.instagram; }
    if (has && k === 'instagramStudio') { var h2 = el.querySelector('[data-handle]'); if (h2) h2.textContent = '@' + C.instagramStudio; }
  });

  /* work page extras */
  var vid = $('#intro-video');
  if (vid && C.videoWork) { vid.src = C.videoWork; if (C.videoPoster) vid.poster = C.videoPoster; }
  var refs = $('#refs-list');
  if (refs && Array.isArray(C.references)) {
    C.references.forEach(function (r) {
      var li = document.createElement('li');
      var b = document.createElement('b'); b.textContent = r.name || '';
      var s = document.createElement('span'); s.textContent = r.role || '';
      var c = document.createElement('span'); c.className = 'mono'; c.textContent = r.contact || '';
      li.appendChild(b); li.appendChild(s); li.appendChild(c); refs.appendChild(li);
    });
  }

  /* studio links: the Obhivion website when it exists, /studio/ until then */
  if (C.obhivionUrl) {
    if (page === 'studio') { location.replace(C.obhivionUrl); return; }
    $$('[data-studio]').forEach(function (a) { a.href = C.obhivionUrl; });
  }

  paintLang();

  /* cookieless page counts (optional) */
  if (C.goatcounter) {
    window.goatcounter = { path: function (p) { return location.pathname + (place ? '?for=' + place.toLowerCase().replace(/\s+/g, '-') : ''); } };
    var s = document.createElement('script');
    s.async = true; s.src = 'https://gc.zgo.at/count.js';
    s.setAttribute('data-goatcounter', 'https://' + C.goatcounter + '.goatcounter.com/count');
    document.body.appendChild(s);
  }
})();
