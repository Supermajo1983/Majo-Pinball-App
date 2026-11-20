const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = (s) => String(s || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').replace(/\bthe\b/g, '').replace(/\s+/g, ' ').trim();

const findGame = (name) => window.MPU.matchGame(window.GAMES, name);

// --- Gemeinsame Notizen (Majo Strategie) ---
let notes = {};
let notesInfo = { persistent: true, editable: true };
const pinEntry = (name) => {
  const n = norm(name);
  if (!n) return null;
  return window.PINSIDE.find((p) => norm(p.name) === n)
    || window.PINSIDE.find((p) => { const x = norm(p.name); return x.length > 3 && n.length > 3 && (n.includes(x) || x.includes(n)); })
    || null;
};
const noteKey = (name) => { const p = pinEntry(name); return norm(p ? p.name : name); };
const hasNote = (name) => { const n = notes[noteKey(name)]; return !!(n && (n.rules || n.strategy)); };
const rich = (t) => esc(t).replace(/https?:\/\/[^\s<]+/g, (u) => `<a href="${u}" target="_blank" rel="noopener" style="color:#facc15">${u}</a>`);

function notesHtml(name, editing) {
  const k = noteKey(name);
  const n = notes[k] || {};
  const head = '<h3>Majo Strategie</h3>';
  if (editing) {
    return `${head}<label class="muted">Rulesheet (Text oder Link)</label><textarea id="nRules" rows="4">${esc(n.rules || '')}</textarea>
      <label class="muted">Strategie</label><textarea id="nStrat" rows="8">${esc(n.strategy || '')}</textarea>
      <div><button data-save="1">Speichern</button> <button data-cancel="1" class="alt">Abbrechen</button> <span id="nMsg" class="muted"></span></div>`;
  }
  return `${head}<p><b>Rulesheet:</b></p><div class="note">${n.rules ? rich(n.rules) : '<span class="muted">noch nichts eingetragen</span>'}</div>
    <p><b>Strategie:</b></p><div class="note">${n.strategy ? rich(n.strategy) : '<span class="muted">noch nichts eingetragen</span>'}</div>
    ${n.updated ? `<div class="muted">Zuletzt geändert: ${esc(new Date(n.updated).toLocaleString('de-DE'))}</div>` : ''}
    <button data-edit="1" class="alt">✎ Bearbeiten</button>`;
}

function proHtml(name) {
  const P = window.PRO_TIPS;
  if (!P) return '';
  const n = norm(name);
  const items = [];
  P.players.forEach((p) => Object.keys(p.machines || {}).forEach((m) => { if (norm(m) === n) items.push(...p.machines[m]); }));
  const gen = (P.general || []).concat(...P.players.map((p) => p.general.slice(0, 1))).slice(0, 4);
  const ul = (a) => '<ul>' + a.map((x) => `<li>${esc(x)}</li>`).join('') + '</ul>';
  return (items.length ? '<h3>Profi-Tipps (dieses Gerät)</h3>' + ul(items) : '') + (gen.length ? '<h3>Profi-Mindset (Top-Spieler)</h3>' + ul(gen) : '');
}

function showGame(name, fromList, notesOnly) {
  const g = findGame(name);
  const list = (a) => '<ul>' + a.map((x) => `<li>${esc(x)}</li>`).join('') + '</ul>';
  const back = fromList ? '<button class="back" data-back="1">← Zurück zur Geräteliste</button>' : '';
  $('#detail').innerHTML = `${back}<h2>${esc(g ? g.name : name)}</h2>
    <div class="muted">${g ? esc(g.maker + ' · ' + g.year) : ''}</div>
    <div id="notes" data-name="${esc(name)}">${notesHtml(name)}</div>
    ${notesOnly ? '' : g ? `<h3>Tipps</h3>${list(g.tips)}<h3>Turnierstrategie</h3>${list(g.strategy)}` : '<p class="warn">Für dieses Gerät sind noch keine recherchierten Tipps hinterlegt.</p>'}
    ${notesOnly ? '' : proHtml(g ? g.name : name)}
    ${!notesOnly && g && g.sources.length ? '<p class="muted">Quellen: ' + g.sources.map((u) => `<a href="${esc(u)}" target="_blank" rel="noopener" style="color:#facc15">${esc(new URL(u).hostname)}</a>`).join(' · ') + '</p>' : ''}`;
  $('#modal').hidden = false;
  $('#modal').scrollTop = 0;
}

async function saveNote(name) {
  let key = localStorage.getItem('editKey');
  if (!key) key = prompt('Bearbeitungs-Passwort (EDIT_KEY):');
  if (!key) return;
  $('#nMsg').textContent = 'Speichere …';
  try {
    const r = await fetch('/api/notes/' + encodeURIComponent(noteKey(name)), {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-edit-key': key },
      body: JSON.stringify({ rules: $('#nRules').value, strategy: $('#nStrat').value }),
    });
    const j = await r.json().catch(() => ({}));
    if (r.status === 403) localStorage.removeItem('editKey');
    if (!r.ok) throw new Error(j.error || 'Fehler ' + r.status);
    localStorage.setItem('editKey', key);
    notes = j.notes;
    $('#notes').innerHTML = notesHtml(name);
    renderStrat();
  } catch (e) { $('#nMsg').textContent = '⚠ ' + e.message; }
}

async function loadNotes() {
  const r = await fetch('/api/notes', { cache: 'no-store' });
  if (!r.ok) throw new Error('Notizen: Fehler ' + r.status);
  const j = await r.json();
  notes = j.notes || {};
  notesInfo = { persistent: j.persistent, editable: j.editable };
}

// --- Navigation: Zurueck-Taste geht in der App einen Schritt zurueck ---
let cur = { tab: 'tournaments' };
function applyState(s) {
  cur = s;
  document.querySelectorAll('nav button').forEach((b) => b.classList.toggle('active', b.dataset.tab === s.tab));
  ['tournaments', 'games', 'majo', 'strat'].forEach((id) => { $('#' + id).hidden = id !== s.tab; });
  if (!s.modal) { $('#modal').hidden = true; return; }
  if (s.modal === 'arenas') showArenas(s.tid); else showGame(s.name, s.tid != null, s.notesOnly);
}
function nav(patch) {
  const s = { tab: cur.tab, ...patch };
  history.pushState(s, '');
  applyState(s);
}
window.addEventListener('popstate', (e) => applyState(e.state || { tab: 'tournaments' }));
history.replaceState(cur, '');

// --- Flipper-Liste ---
function renderGames() {
  const q = norm($('#search').value);
  const items = window.GAMES.filter((g) => !q || norm(g.name + ' ' + g.aliases.join(' ')).includes(q));
  $('#gList').innerHTML = items.map((g) => `<div class="item click" data-g="${esc(g.name)}"><b>${esc(g.name)}</b> <span class="muted">${esc(g.maker)} · ${g.year}</span></div>`).join('')
    || '<p class="muted">Nichts gefunden.</p>';
}

function renderStrat() {
  const q = norm($('#sSearch').value);
  const items = window.PINSIDE.filter((p) => !q || norm(p.name + ' ' + p.maker).includes(q));
  $('#sList').innerHTML = items.map((p) => `<div class="item click" data-g="${esc(p.name)}"><b>${esc(p.name)}</b>${hasNote(p.name) ? ' <span class="tag">✎ Notiz</span>' : ''}
    <div class="muted">${esc(p.maker)} · ${p.year}</div></div>`).join('') || '<p class="muted">Nichts gefunden.</p>';
}

// --- Matchplay ---
let selected = JSON.parse(localStorage.getItem('playerSel') || 'null');
let tournaments = [];
let completedLimit = 10;
let busy = false;
const detailCache = new Map(); // abgeschlossene Turniere aendern sich nicht mehr

const mpGet = async (p) => {
  const r = await fetch('/api/mp/' + p, { cache: 'no-store' });
  if (!r.ok) {
    const hint = r.status === 401 ? ' (Token ungueltig oder fehlt: MATCHPLAY_TOKEN am Server pruefen)' : '';
    throw new Error('Matchplay-Fehler ' + r.status + hint);
  }
  const j = await r.json();
  return j.data ?? j;
};

async function loadDetail(t) {
  const hit = detailCache.get(t.tournamentId);
  if (hit) return hit;
  try {
    const [d, st] = await Promise.all([
      mpGet(`tournaments/${t.tournamentId}?includePlayers=true&includeArenas=true`),
      t._s === 'soon' ? null : mpGet(`tournaments/${t.tournamentId}/standings`).catch(() => null),
    ]);
    const full = { ...t, ...d, _s: t._s, _place: selected ? window.MPU.placement(st, d && d.players, selected.userId) : null };
    if (t._s === 'done' && !t._stale) detailCache.set(t.tournamentId, full);
    return full;
  } catch { return t; }
}

const byStart = (dir) => (a, b) => dir * (new Date(a.startUtc || 0) - new Date(b.startUtc || 0));

async function loadTournaments() {
  const sel = selected;
  if (!sel) { tournaments = []; return; }
  const q = (s) => mpGet(`tournaments?played=${sel.userId}&status=${s}`);
  const [live, soon, done] = await Promise.all([q('started'), q('upcoming'), q('completed')]);
  const tag = (a, s) => (a || []).map((t) => ({ ...t, _s: s }));
  const now = Date.now();
  const isPast = (t) => t.startUtc && new Date(t.startUtc) < now;
  // Als "geplant" gefuehrte Turniere mit Startdatum in der Vergangenheit gelten als vergangen.
  const future = tag(soon, 'soon').filter((t) => !isPast(t));
  const stale = tag(soon, 'done').filter(isPast).map((t) => ({ ...t, _stale: true }));
  const past = [...tag(done, 'done'), ...stale].sort(byStart(-1));
  const list = [
    ...future.sort(byStart(1)).slice(0, 15),
    ...tag(live, 'live').sort(byStart(1)).slice(0, 15),
    ...past.slice(0, completedLimit),
  ];
  const detailed = await Promise.all(list.map(loadDetail));
  if (sel !== selected) return false; // Spieler wurde inzwischen gewechselt: altes Ergebnis verwerfen
  tournaments = detailed.filter((t) => window.MPU.isPlayer(t.players, sel.userId));
}

const LABEL = { live: ['LIVE', 'live'], soon: ['geplant', ''], done: ['abgeschlossen', ''] };

const tcard = (t) => {
  const [txt, cls] = t._stale ? ['nicht gestartet', ''] : LABEL[t._s];
  const place = t._place ? `<div><b class="${window.MPU.placeClass(t._place.position, t._place.total)}">${t._s === 'live' ? 'Aktuell ' : ''}Platz ${t._place.position}</b> <span class="muted">von ${t._place.total}</span></div>` : '';
  const n = (t.arenas || []).length;
  return `<div class="item click" data-t="${esc(t.tournamentId)}"><b>${esc(t.name)}</b> <span class="tag ${cls}">${txt}</span>
  <div class="muted">${esc(t.startUtc ? new Date(t.startUtc).toLocaleString('de-DE') : '')}</div>${place}
  <div class="muted">${n ? n + ' Flipper – antippen für die Liste' : 'Keine Geräte hinterlegt'}</div></div>`;
};

function renderTournaments() {
  const el = $('#tList');
  if (!selected) { el.innerHTML = '<p class="muted">Namen oder IFPA-Nummer eintippen und einen Vorschlag auswählen.</p>'; return; }
  if (!tournaments.length) { el.innerHTML = `<p class="muted">Keine Turniere für ${esc(selected.name)} gefunden.</p>`; return; }
  const doneCount = tournaments.filter((t) => t._s === 'done').length;
  const HEAD = { soon: 'Anstehende Turniere (nächstes zuerst)', live: 'Laufende Turniere', done: 'Vergangene Turniere (neueste zuerst)' };
  let last = null;
  el.innerHTML = `<p class="muted">Spieler: <b>${esc(selected.name)}</b></p>` + tournaments.map((t) => {
    const head = t._s !== last ? `<h2 class="sep">${HEAD[t._s]}</h2>` : '';
    last = t._s;
    return head + tcard(t);
  }).join('') + (doneCount >= completedLimit ? '<button id="more">Mehr abgeschlossene Turniere</button>' : '');
}

function showArenas(id) {
  const t = tournaments.concat(majoList).find((x) => String(x.tournamentId) === String(id));
  if (!t) return;
  const arenas = t.arenas || [];
  $('#detail').innerHTML = `<h2>${esc(t.name)}</h2><div class="muted">${arenas.length} Flipper – antippen für Tipps &amp; Strategie</div>`
    + (arenas.map((a) => `<div class="item click" data-g="${esc(a.name)}"><b>${esc(a.name)}</b>${hasNote(a.name) ? ' <span class="tag">✎ Notiz</span>' : ''}${findGame(a.name) ? '' : ' <span class="muted">(keine recherchierten Tipps)</span>'}</div>`).join('')
      || '<p class="muted">Keine Geräte hinterlegt.</p>');
  $('#modal').hidden = false;
  $('#modal').scrollTop = 0;
}

// --- Majo: kommende Turniere von Marco Siemund ---
let majoList = [];
let majoUser = JSON.parse(localStorage.getItem('majoUser') || 'null');

async function loadMajo() {
  if (!majoUser) {
    const us = await fetchUsers('Marco Siemund');
    majoUser = us.find((u) => norm(u.name) === 'marco siemund') || us[0];
    if (!majoUser) throw new Error('Marco Siemund nicht gefunden');
    localStorage.setItem('majoUser', JSON.stringify({ userId: majoUser.userId, name: majoUser.name }));
  }
  const uid = majoUser.userId;
  const get = (qs) => mpGet('tournaments?' + qs).catch(() => []);
  const [played, owned] = await Promise.all([get(`played=${uid}&status=upcoming`), get(`owner=${uid}&status=upcoming`)]);
  const own = (owned || []).filter((t) => t.ownerId != null && String(t.ownerId) === String(uid));
  const byId = new Map();
  [...(played || []), ...own].forEach((t) => byId.set(t.tournamentId, { ...t, _s: 'soon' }));
  const now = Date.now();
  const future = [...byId.values()].filter((t) => !t.startUtc || new Date(t.startUtc) >= now).sort(byStart(1)).slice(0, 20);
  majoList = await Promise.all(future.map(loadDetail));
}

function renderMajo() {
  const el = $('#mList');
  if (!majoUser) { el.innerHTML = '<p class="muted">Lade …</p>'; return; }
  el.innerHTML = `<h2 class="sep">Geplante Turniere von ${esc(majoUser.name)}</h2>`
    + (majoList.map(tcard).join('') || '<p class="muted">Keine geplanten Turniere gefunden.</p>');
}

let again = false;
async function refresh() {
  if (document.hidden) return;
  if (busy) { again = true; return; } // laeuft schon: direkt danach noch einmal
  busy = true;
  const errs = [];
  const run = (p) => p.catch((e) => errs.push(e.message));
  await Promise.all([
    run(loadNotes().then(renderStrat)),
    run(loadMajo().then(renderMajo)),
    run(loadTournaments().then((ok) => ok !== false && renderTournaments())),
  ]);
  $('#status').textContent = errs.length ? '⚠ ' + errs[0] : 'Aktualisiert ' + new Date().toLocaleTimeString('de-DE');
  busy = false;
  if (again) { again = false; refresh(); }
}

// --- Spielersuche mit Vorschlaegen ---
let sugSeq = 0;
let sugTimer;
let suggestions = [];

async function fetchUsers(q) {
  const calls = [mpGet(`search?query=${encodeURIComponent(q)}&type=users`)];
  if (/^\d+$/.test(q)) calls.push(mpGet('users/' + q).catch(() => null));
  return (await Promise.all(calls)).flat().filter((u) => u && u.userId != null);
}

function showSuggestions(list, msg) {
  const ul = $('#suggest');
  suggestions = list;
  ul.innerHTML = list.map((u) => `<li data-uid="${esc(u.userId)}">${esc(u.name)}${u.ifpaId ? ` <span class="muted">IFPA ${esc(u.ifpaId)}</span>` : ''}</li>`).join('')
    || (msg ? `<li class="muted">${esc(msg)}</li>` : '');
  ul.hidden = !ul.innerHTML;
}

function onType() {
  clearTimeout(sugTimer);
  const q = $('#playerName').value.trim();
  if (!q) { showSuggestions([]); return; }
  sugTimer = setTimeout(async () => {
    const seq = ++sugSeq;
    try {
      const users = window.MPU.matchUsers(await fetchUsers(q), q, 5);
      if (seq === sugSeq) showSuggestions(users, 'Kein Spieler gefunden');
    } catch (e) {
      if (seq === sugSeq) showSuggestions([], e.message);
    }
  }, 200);
}

function selectUser(u) {
  selected = { userId: u.userId, name: u.name };
  localStorage.setItem('playerSel', JSON.stringify(selected));
  detailCache.clear();
  completedLimit = 10;
  $('#playerName').value = u.name;
  showSuggestions([]);
  tournaments = [];
  $('#tList').innerHTML = '<p class="muted">Lade Turniere …</p>';
  refresh();
}

document.addEventListener('click', (e) => {
  const sug = e.target.closest('#suggest li[data-uid]');
  if (sug) return selectUser(suggestions.find((u) => String(u.userId) === sug.dataset.uid));
  if (!e.target.closest('.ac')) showSuggestions([]);
  if (e.target.id === 'more') { completedLimit += 10; return refresh(); }
  if (e.target.closest('[data-back]')) return history.back();
  const ed = e.target.closest('[data-edit]');
  if (ed) { const el = $('#notes'); el.innerHTML = notesHtml(el.dataset.name, true); return; }
  if (e.target.closest('[data-cancel]')) { const el = $('#notes'); el.innerHTML = notesHtml(el.dataset.name); return; }
  if (e.target.closest('[data-save]')) return saveNote($('#notes').dataset.name);
  const tc = e.target.closest('[data-t]');
  if (tc) return nav({ modal: 'arenas', tid: tc.dataset.t, d: 1 });
  const g = e.target.closest('[data-g]');
  if (g) return nav({ modal: 'game', notesOnly: !!g.closest('#strat'), name: g.dataset.g, tid: cur.modal === 'arenas' ? cur.tid : null, d: cur.modal === 'arenas' ? 2 : 1 });
  const tab = e.target.closest('[data-tab]');
  if (tab && tab.dataset.tab !== cur.tab) nav({ tab: tab.dataset.tab });
});
$('#close').onclick = () => { if (cur.d) history.go(-cur.d); else applyState({ tab: cur.tab }); };
$('#sSearch').oninput = renderStrat;
$('#search').oninput = renderGames;
$('#playerName').oninput = onType;
$('#playerForm').onsubmit = async (e) => {
  e.preventDefault();
  if (suggestions.length) return selectUser(suggestions[0]);
  const q = $('#playerName').value.trim();
  if (/^\d+$/.test(q)) {
    try { const u = await mpGet('users/' + q); if (u && u.userId) return selectUser(u); } catch { /* kein Treffer */ }
  }
  showSuggestions([], 'Kein Spieler gefunden');
};
if (selected) $('#playerName').value = selected.name;

renderGames();
renderStrat();
renderTournaments();
refresh();
setInterval(refresh, 10000); // Auto-Refresh alle 10 s, solange die App sichtbar ist
document.addEventListener('visibilitychange', refresh);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
