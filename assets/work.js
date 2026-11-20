/* /work/: pick the role, see that resume on the page, download its PDF. */
(function () {
  'use strict';
  var R = window.ROLES;
  if (!R || !R.roles) return;
  function $(s) { return document.querySelector(s); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function clean(t) { return String(t || '').replace(/[–—]/g, '-'); }

  var params; try { params = new URLSearchParams(location.search); } catch (e) { params = { get: function () { return null; } }; }
  var current = R.roles[params.get('role')] ? params.get('role') : 'busser';
  var greet = $('#greet');
  var place = greet && !greet.hidden ? $('#greet-place').textContent : '';

  var chips = $('#role-chips');
  R.order.forEach(function (k) {
    var b = el('button', 'chip', R.roles[k].label);
    b.type = 'button'; b.setAttribute('role', 'radio'); b.dataset.role = k;
    b.addEventListener('click', function () { show(k, true); });
    chips.appendChild(b);
  });
  chips.addEventListener('keydown', function (e) {
    if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].indexOf(e.key) < 0) return;
    e.preventDefault();
    var i = R.order.indexOf(current) + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1);
    i = (i + R.order.length) % R.order.length;
    show(R.order[i], true);
    chips.querySelector('[data-role="' + R.order[i] + '"]').focus();
  });

  function list(items, cls) { var ul = el('ul', cls); items.forEach(function (t) { ul.appendChild(el('li', null, clean(t))); }); return ul; }

  function renderResume(r) {
    var box = $('#resume'); box.innerHTML = '';
    var head = el('div', 'r-head');
    head.appendChild(el('h3', null, 'Liam Courtot'));
    head.appendChild(el('p', 'r-sub', clean(r.headline)));
    head.appendChild(el('p', 'r-meta', 'Avon, CO 81620 · liamcourtot24@gmail.com'));
    box.appendChild(head);
    box.appendChild(el('p', 'r-meta', 'Available part-time, 2–3 shifts a week · Evenings and days off · Mid-Dec 2026 – Mar 28, 2027'));
    box.appendChild(el('p', 'r-sum', clean(r.summary.replace('{at}', place ? ' at ' + place : ''))));
    box.appendChild(el('h4', null, 'Experience'));
    r.experience.forEach(function (x) {
      var job = el('div', 'r-job');
      var top = el('div', 'r-top'); top.appendChild(el('b', null, x.org)); top.appendChild(el('span', 'mono', clean(x.dates)));
      job.appendChild(top);
      job.appendChild(el('p', 'r-title', clean(x.title) + (x.place ? ', ' + x.place : '')));
      if (x.meta) job.appendChild(el('p', 'r-meta', clean(x.meta)));
      if (x.bullets.length) job.appendChild(list(x.bullets));
      box.appendChild(job);
    });
    box.appendChild(el('h4', null, 'Skills'));
    box.appendChild(list(r.skills, 'r-skills'));
    box.appendChild(el('p', 'r-lang', 'Languages: ' + clean(r.languages)));
    box.appendChild(el('h4', null, 'Education'));
    r.education.forEach(function (e) { box.appendChild(el('p', null, e.school + ', ' + clean(e.degree) + ', ' + clean(e.dates))); });
    var dl = el('a', 'btn', 'Download this resume (PDF)'); dl.href = '../' + r.pdf; dl.setAttribute('download', '');
    var row = el('div', 'btns r-dl'); row.appendChild(dl); box.appendChild(row);
  }

  function show(k, fromUser) {
    current = k; var r = R.roles[k];
    $('#hero-h1').textContent = r.h1;
    $('#hero-pdf').href = '../' + r.pdf;
    $('#role-sum').textContent = clean(r.summary.replace('{at}', place ? ' at ' + place : ''));
    var hl = $('#role-hl'); hl.innerHTML = ''; r.highlights.forEach(function (t) { hl.appendChild(el('li', null, clean(t))); });
    $('#role-skills').textContent = r.skills.map(clean).join(', ');
    Array.prototype.forEach.call(chips.children, function (b) {
      var on = b.dataset.role === k; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1;
    });
    renderResume(r);
    if (fromUser && window.history && history.replaceState) {
      try { var u = new URL(location.href); u.searchParams.set('role', k); history.replaceState(null, '', u.pathname + u.search + u.hash); } catch (e) {}
    }
  }

  var tog = $('#role-view');
  tog.addEventListener('click', function () {
    var box = $('#resume'), open = box.hidden;
    box.hidden = !open; tog.setAttribute('aria-expanded', String(open));
    tog.textContent = open ? 'Hide full resume' : 'View full resume';
    if (open) box.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });

  show(current, false);
})();
