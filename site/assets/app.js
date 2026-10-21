/* tradingAI tracker — shared runtime. No dependencies. Everything persists in localStorage under one key.
 * Pages call TA.init({page:'roadmap'}) then use TA.store / TA.bindChecklist / TA.renderNav.
 * Storage is per-browser. Share progress with Export/Import (JSON), not by sharing the HTML.
 */
(function () {
  const KEY = 'tradingai.v1';
  const PAGES = [
    ['index.html', 'Start'], ['roadmap.html', 'Roadmap'], ['learning.html', 'Learning'],
    ['journal.html', 'Journal'], ['money.html', 'Money'], ['decisions.html', 'Decisions'], ['ai.html', 'AI & you'],
  ];

  function safeParse(s, d) { try { return s ? JSON.parse(s) : d; } catch (e) { return d; } }
  function loadAll() { try { return safeParse(localStorage.getItem(KEY), {}); } catch (e) { return {}; } }
  let cache = loadAll();
  function saveAll() { try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch (e) { /* private mode etc. */ } }

  const store = {
    get(k, d) { return (k in cache) ? cache[k] : d; },
    set(k, v) { cache[k] = v; cache._updated = new Date().toISOString(); saveAll(); document.dispatchEvent(new CustomEvent('ta:change', { detail: { key: k } })); },
    del(k) { delete cache[k]; saveAll(); },
    all() { return cache; },
    replace(obj) { cache = obj || {}; saveAll(); location.reload(); },
    reset() { cache = {}; saveAll(); location.reload(); },
  };

  function mode() { return (localStorage.getItem('tradingai.mode') || 'plain'); }
  function setMode(m) { try { localStorage.setItem('tradingai.mode', m); } catch (e) {} document.documentElement.setAttribute('data-mode', m); document.querySelectorAll('.toggle [data-mode]').forEach(b => b.classList.toggle('on', b.dataset.mode === m)); }
  function theme() { return localStorage.getItem('tradingai.theme') || ''; }
  function setTheme(t) { try { localStorage.setItem('tradingai.theme', t); } catch (e) {} if (t) document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme'); }

  function exportAll() {
    const blob = new Blob([JSON.stringify({ exported: new Date().toISOString(), data: cache }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'tradingai-progress-' + new Date().toISOString().slice(0, 10) + '.json'; a.click();
  }
  function importAll(file) {
    const r = new FileReader();
    r.onload = () => { const j = safeParse(r.result, null); if (j && j.data) { if (confirm('Replace all progress in this browser with the imported file?')) store.replace(j.data); } else alert('Not a tradingAI export file.'); };
    r.readAsText(file);
  }

  function renderNav(active) {
    const bar = document.createElement('div'); bar.className = 'topbar';
    bar.innerHTML = `<div class="wrap"><a class="brand" href="index.html">tradingAI</a><nav class="nav">${PAGES.map(([h, t]) => `<a href="${h}" class="${h === active ? 'active' : ''}">${t}</a>`).join('')}</nav>
      <div class="controls"><span class="toggle" title="Plain language or full detail"><button data-mode="plain">Plain</button><button data-mode="detail">Detailed</button></span>
      <button class="btn small" id="ta-export" title="Download your progress as a file">Export</button>
      <label class="btn small" title="Load a progress file">Import<input type="file" accept="application/json" id="ta-import" style="display:none"></label></div></div>`;
    document.body.prepend(bar);
    bar.querySelectorAll('.toggle [data-mode]').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
    bar.querySelector('#ta-export').addEventListener('click', exportAll);
    bar.querySelector('#ta-import').addEventListener('change', e => { if (e.target.files[0]) importAll(e.target.files[0]); });
    setMode(mode()); setTheme(theme());
  }

  function footer() {
    const f = document.createElement('div'); f.className = 'footer wrap';
    const u = cache._updated ? new Date(cache._updated).toLocaleString() : 'never';
    f.innerHTML = `Progress is saved in this browser only (last change: ${u}). Use Export to back it up or move it. Nothing here is financial advice; see the reality check. <a href="#" id="ta-reset">Reset all progress</a>`;
    document.body.appendChild(f);
    f.querySelector('#ta-reset').addEventListener('click', e => { e.preventDefault(); if (confirm('Delete ALL saved progress in this browser? Export first if unsure.')) store.reset(); });
  }

  /* Checklist binding: container has .check rows with input[data-id]. State stored as {id:true} under storeKey. */
  function bindChecklist(container, storeKey, onChange) {
    const el = typeof container === 'string' ? document.getElementById(container) : container;
    if (!el) return;
    const state = store.get(storeKey, {});
    el.querySelectorAll('input[type=checkbox][data-id]').forEach(cb => {
      cb.checked = !!state[cb.dataset.id];
      cb.closest('.check') && cb.closest('.check').classList.toggle('done', cb.checked);
      cb.addEventListener('change', () => {
        const s = store.get(storeKey, {}); if (cb.checked) s[cb.dataset.id] = new Date().toISOString().slice(0, 10); else delete s[cb.dataset.id];
        store.set(storeKey, s); cb.closest('.check') && cb.closest('.check').classList.toggle('done', cb.checked);
        if (onChange) onChange(s);
      });
    });
    if (onChange) onChange(state);
  }
  function checklistProgress(container, storeKey) {
    const el = typeof container === 'string' ? document.getElementById(container) : container;
    const ids = [...el.querySelectorAll('input[type=checkbox][data-id]')].map(c => c.dataset.id);
    const s = store.get(storeKey, {}); const done = ids.filter(i => s[i]).length;
    return { done, total: ids.length, pct: ids.length ? Math.round(done / ids.length * 100) : 0 };
  }
  function setProgress(barEl, pct) { const b = typeof barEl === 'string' ? document.getElementById(barEl) : barEl; if (!b) return; b.querySelector('span').style.width = pct + '%'; b.classList.toggle('ok', pct >= 100); }

  /* Shared list helpers for journal/money/log pages: arrays of objects under a key. */
  function list(key) { return store.get(key, []); }
  function push(key, obj) { const a = list(key); obj.id = obj.id || (Date.now().toString(36) + Math.random().toString(36).slice(2, 6)); a.push(obj); store.set(key, a); return obj; }
  function remove(key, id) { store.set(key, list(key).filter(x => x.id !== id)); }
  function update(key, id, patch) { store.set(key, list(key).map(x => x.id === id ? Object.assign({}, x, patch) : x)); }

  function fmt(n, d = 2) { return (n === null || n === undefined || isNaN(n)) ? '—' : Number(n).toFixed(d); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  function init(opts) { renderNav(opts.page); window.addEventListener('load', footer); }

  window.TA = { store, init, renderNav, bindChecklist, checklistProgress, setProgress, list, push, remove, update, fmt, esc, exportAll, mode, setMode, setTheme, PAGES };
})();
